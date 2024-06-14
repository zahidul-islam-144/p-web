import mongoose, { Schema, model } from 'mongoose';
import {
  IActivePassword,
  IPasswordHistory,
  IPasswordManager,
  IRefreshToken,
  IUser,
  UserModel,
} from './user.interface';
import { verifyPassword } from '../../utils/passwordStrategy';

const ActivePasswordSchema = new Schema<IActivePassword>(
  {
    password: String,
    lastCreatedAt: Date,
    lastUpdatedAt: Date,
  },
  { _id: false },
);

const PasswordHistorySchema = new Schema<IPasswordHistory>(
  {
    password: String,
    lastCreatedAt: Date,
    // lastUpdatedAt: Date,
  },
  { _id: false },
);

const PasswordManagerSchema = new Schema<IPasswordManager>({
  activePassword: ActivePasswordSchema,
  passwordHistory: [PasswordHistorySchema]
});

const RefreshTokenSchema = new Schema<IRefreshToken>({
  refreshToken: {
    type: String,
  },
  tokenCreatedAt: {
    type: Date,
    default: Date.now,
  }

}, { _id: false },)

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is mandatory.'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    passwordManager: {
      type: PasswordManagerSchema,
      _id: false,
      default: null,
    },
    refreshTokenManager: {
      type: [RefreshTokenSchema],
      default: [],
      _id: false
    }
  },
  {
    timestamps: true,
  },
);


UserSchema.statics.isUserExist = async function (payload: string) {
  const user = await User.find({
    username: payload,
  });
  // console.log("---> isUserExists:userModel: ", isUserExist, payload)
  return !user?.length ? null : user;
};

UserSchema.statics.isVerifiedUser = async function (payload: string, inputPassword: string) {
    const user = await User.findOne({ username: payload }).select('+password')
    const isVerified = await verifyPassword(inputPassword, user?.password!)
    console.log('--> model:isVerified ', isVerified)
    return isVerified ? user : null;
}

UserSchema.statics.isUserExistById = async function (payload: string) : Promise<IUser | null> {
  return await User.findById(payload);
}

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

UserSchema.set('toJSON', {
  transform: function (doc, returnObj) {
    // Removed 'password' field from the returned object
    const { password, passwordManager, refreshTokenManager, ...restData } = returnObj;
    return restData;
  },
})


// export model:user
export const User = model<IUser, UserModel>('User', UserSchema);