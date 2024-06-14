import config from '../../config';
import CustomError from '../../errors/CustomError';
import { generateStrongPassword } from '../../utils/passwordStrategy';
import { EHttpStatusCode } from '../../interface/interface';
import {
  IActivePassword,
  IPasswordHistory,
  IPasswordManager,
  IUser,
} from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: IUser) => {
  const isUserExist = await User.isUserExist(payload.username);
  console.log('---> user:service: ', payload);

  if (!isUserExist) {
    const { password, ...projectedData } = payload;
    const hashedPassword = await generateStrongPassword(payload.password);
    const lastCreatedDate = new Date();

    const activePassword: IActivePassword = {
      password: hashedPassword,
      lastCreatedAt: lastCreatedDate,
      lastUpdatedAt: null,
    };

    const passwordHistory: IPasswordHistory = {
      password: hashedPassword,
      lastCreatedAt: lastCreatedDate,
    };

    const passwordManager: IPasswordManager = {
      activePassword: activePassword,
      passwordHistory: [passwordHistory],
    };

    const modifiedData = {
      ...payload,
      password: hashedPassword,
      passwordManager: passwordManager,
    };

    const newUser = await User.create(modifiedData);
    return newUser;
  } else {
    throw new CustomError(
      EHttpStatusCode.BAD_REQUEST,
      'User already exists.',
      true,
      [],
    );
  }
};



export const userService = {
  createUserIntoDB,
};
