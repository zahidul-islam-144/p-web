import CustomError from '../../errors/CustomError';
import createToken from '../../utils/createToken';
import { EHttpStatusCode } from '../../interface/interface';
import { User } from '../user/user.model';
import { IChangePassword, ILoginUser, TOKEN_TYPE } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import {
  IActivePassword,
  IPasswordHistory,
  IPasswordManager,
  IRefreshToken,
  IUser,
} from '../user/user.interface';
import { generateStrongPassword } from '../../utils/passwordStrategy';
import { jwtServices } from '../../utils/jwtServices';
import config from '../../config';
import { Response } from 'express';
import { authUtils } from './auth.utils';

const logInUserIntoDB = async (
  payload: ILoginUser,
  reqCookies: Pick<IRefreshToken, 'refreshToken'>,
  res: Response,
) => {
  console.log('* ---> reqCookies: ', reqCookies);

  // Check if user exists
  const isUserExist = await User.isUserExist(payload.username);
  if (!isUserExist) {
    throw new CustomError(
      EHttpStatusCode.FORBIDDEN,
      'Unauthorized access.',
      true,
      [],
    );
  }

  // Verify user credentials
  const currentLoginUser = await User.isVerifiedUser(
    payload.username,
    payload.password,
  );

  if (!currentLoginUser) {
    throw new CustomError(
      EHttpStatusCode.FORBIDDEN,
      'Credential mismatch. Try again.',
      true,
      [],
    );
  }

  // Create tokens
  const createAccessToken = createToken(
    currentLoginUser,
    TOKEN_TYPE.accessToken,
  );
  const createRefreshToken = createToken(
    currentLoginUser,
    TOKEN_TYPE.refreshToken,
  );

  // Refresh token management
  let newRefreshTokenArray : IRefreshToken[] =
    currentLoginUser.refreshTokenManager?.filter(
      (rt: IRefreshToken) => rt.refreshToken !== reqCookies?.refreshToken,
    ) ?? [];

  if (reqCookies?.refreshToken) {
    console.log('* ---> if: new next login')
    const foundToken = await User.findOne({
      refreshTokenManager: {
        $elemMatch: { refreshToken: reqCookies.refreshToken },
      },
    }).exec();

    if (!foundToken) {
      newRefreshTokenArray = [];
    }

    res.clearCookie('refreshtoken', authUtils.cookieOptionsToReset);
    console.log('* ---> if: clear cookie-rt')
  } else {
    console.log('* ---> else: create rt')
    newRefreshTokenArray =
      currentLoginUser.refreshTokenManager?.map((rt: IRefreshToken) => ({
        refreshToken: rt.refreshToken,
      })) ?? [];
  }

  console.log('* ---> newRefreshTokenArray: ', newRefreshTokenArray);
  console.log('* ---> createRt:', createRefreshToken)

  // Update refresh token array with the new token
  currentLoginUser.refreshTokenManager = [
    ...newRefreshTokenArray,
    { refreshToken: createRefreshToken },
  ] as IRefreshToken[];

  // Save updated user and return tokens
  const updatedLoginUser = await currentLoginUser.save();
  return {
    user: updatedLoginUser,
    accessToken: createAccessToken,
    refreshToken: createRefreshToken,
  };
};

const changePasswordIntoDB = async (
  payload: IChangePassword,
  userData: JwtPayload,
) => {
  // Check if the current user exists
  const currentLoginUser = await User.isUserExistById(userData._id);

  if (!currentLoginUser) {
    throw new CustomError(
      EHttpStatusCode.NOT_FOUND,
      'User not found.',
      true,
      [],
    );
  }

  // Verify if the current password is correct
  const isVerifiedUser = await User.isVerifiedUser(
    currentLoginUser.username,
    payload.currentPassword,
  );

  if (!isVerifiedUser) {
    throw new CustomError(
      EHttpStatusCode.UNAUTHENTICATED,
      'Incorrect current password.',
      true,
      [],
    );
  }

  // Generate a strong hash for the new password
  const newHashedPassword = await generateStrongPassword(payload.newPassword);
  let passwordHistory : IPasswordHistory[] = currentLoginUser.passwordManager?.passwordHistory || [];

  // Check if the new password has been used before
  const isMatchedWithOldPassword : boolean = passwordHistory.some(
    (item) => item.password === newHashedPassword,
  );

  if (isMatchedWithOldPassword) {
    const lastUsed : Date = passwordHistory.find(
      (item) => item.password === newHashedPassword,
    )?.lastCreatedAt as Date;

    if (lastUsed) {
      const localDate : string = lastUsed.toLocaleDateString();
      const localTime : string = lastUsed.toLocaleTimeString();

      throw new CustomError(
        EHttpStatusCode.BAD_REQUEST,
        `Password change failed. The new password was last used on ${localDate} at ${localTime}. Try again with new unique password.`,
        true,
        [],
      );
    }
  }

  // Update password history
  passwordHistory.push({
    password: newHashedPassword!,
    lastCreatedAt: new Date(),
  });

  if (passwordHistory.length > 5) {
    passwordHistory.shift();
  }

  // Update user password and password manager details
  const results  = await User.findOneAndUpdate(
    { _id: userData._id, role: userData.role },
    {
      password: newHashedPassword,
      'passwordManager.activePassword.password': newHashedPassword,
      'passwordManager.activePassword.lastCreatedAt': new Date(),
      'passwordManager.passwordHistory': passwordHistory,
    },
    { new: true },
  );

  return results;
};

//Pick<IRefreshToken, 'refreshToken'>

const getRefreshTokenFromDB = async (payload: any) => {
  console.log('---> payload: ', payload);

  // Check if refreshToken is provided in the payload
  if (!payload?.refreshToken) {
    throw new CustomError(
      EHttpStatusCode.UNAUTHENTICATED,
      'Unauthenticated user access!',
      true,
      { errorTag: 'RefreshTokenError', mode: 'EMPTY_REFRESH_TOKEN_GIVEN' },
    );
  }

  // Find user with the given refreshToken in the DB
  const findUserInDB: IUser[] = await User.find({
    refreshTokenManager: {
      $elemMatch: { refreshToken: payload.refreshToken },
    },
  });

  console.log('---> findUserInDB: ', findUserInDB, findUserInDB.length);

  // Verify the JWT token
  const isExpiredUser = jwtServices.verifyJWTToken(
    payload.refreshToken as string,
    config.JWT_SECRET_FOR_REFRESH_TOKEN as string,
  ) as JwtPayload;

  console.log('---> isExpiredUser: ', isExpiredUser);

  // Handle refresh token reuse detection
  if (findUserInDB.length === 0) {
    console.log('---> if:1');
    if (typeof isExpiredUser === 'undefined') {
      console.log('---> if: 1:1:: Attempted refresh token reuse!');
      throw new CustomError(
        EHttpStatusCode.FORBIDDEN,
        'Forbidden user access!',
        true,
        { errorTag: 'RefreshTokenError', mode: 'DETECTED_REFRESH_TOKEN_REUSE' },
      );
    } else {
      console.log('---> if: 1:2:: making refreshToken empty in DB for victim.');
      const { jwtPayload } = isExpiredUser;
      const hackedUser: IUser[] = await User.find({ email: jwtPayload?.email });

      if (hackedUser.length) {
        hackedUser[0].refreshTokenManager = [];
        await hackedUser[0].save();
        console.log('---> if: 1:2::hackedUser.length', hackedUser.length, hackedUser);
        throw new CustomError(
          EHttpStatusCode.FORBIDDEN,
          'Forbidden user access! Please, login again.',
          true,
          { errorTag: 'RefreshTokenError', mode: 'DETECTED_NON_EXPIRED_REFRESH_TOKEN_REUSE' },
        );
      }
    }
  }

  // Prepare new refresh token array
  let newRefreshTokenArray: IRefreshToken[] = [];
  if (findUserInDB[0]?.refreshTokenManager) {
    console.log('---> if: 2 : newRefreshTokenArray');
    newRefreshTokenArray = findUserInDB[0].refreshTokenManager
      .filter((rt: IRefreshToken) => rt.refreshToken !== payload.refreshToken)
      .map((rt: IRefreshToken) => ({ refreshToken: rt.refreshToken }));
  }
  console.log('---> newRefreshTokenArray: ', newRefreshTokenArray);

  // Check if the refresh token has expired
  if (!isExpiredUser) {
    console.log('---> if: 3: expired --- login again.');
    findUserInDB[0].refreshTokenManager = newRefreshTokenArray;
    await findUserInDB[0].save();
    throw new CustomError(
      EHttpStatusCode.FORBIDDEN,
      'Forbidden user access! Please, Login again.',
      true,
      { errorTag: 'RefreshTokenError', mode: 'EXPIRED_REFRESH_TOKEN' },
    );
  } else {
    console.log('---> if: 4: not expired, create new token');
    const { jwtPayload } = isExpiredUser;
    const newAccessToken = createToken(jwtPayload, TOKEN_TYPE.accessToken);
    const newRefreshToken = createToken(jwtPayload, TOKEN_TYPE.refreshToken);

    // Save the new refresh token with the current user
    findUserInDB[0].refreshTokenManager = [
      ...newRefreshTokenArray,
      { refreshToken: newRefreshToken as string },
    ];
    await findUserInDB[0].save();

    return { newAccessToken, newRefreshToken };
  }
};


const logOutUserFromDB = async (
  userId: string,
  reqCookies: Pick<IRefreshToken, 'refreshToken'>,
  res: Response,
) => {
  const isLoginUser: IUser | null = await User.isUserExistById(userId);
  const refreshToken = reqCookies?.refreshToken;
  console.log('-----', isLoginUser);

  if (!isLoginUser) {
    res.clearCookie('refreshtoken', authUtils.cookieOptionsToReset);
    throw new CustomError(
      EHttpStatusCode.BAD_REQUEST,
      'Unauthorized access.',
      true,
      [],
    );
  } else {
    if (refreshToken || true) {
      // isLoginUser.refreshTokenManager = isLoginUser?.refreshTokenManager?.filter((rt : IRefreshToken) => rt?.refreshToken !== refreshToken);
      isLoginUser.refreshTokenManager = [];
      await isLoginUser.save();
      res.clearCookie('refreshtoken', authUtils.cookieOptionsToReset);
    }
  }
};

export const authService = {
  logInUserIntoDB,
  changePasswordIntoDB,
  getRefreshTokenFromDB,
  logOutUserFromDB,
};

/*
    // saving refreshToken into DB
    // currentLoginUser.refreshTokenManager = [
    //   {
    //     refreshToken: createRefreshToken as string,
    //     tokenCreatedAt: new Date(),
    //   },
    // ];

    */
