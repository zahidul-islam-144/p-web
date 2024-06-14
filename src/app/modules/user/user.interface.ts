import { Model, Types } from 'mongoose';

export interface IActivePassword {
  password: string | undefined;
  lastCreatedAt: Date | null;
  lastUpdatedAt: Date | null;
}

export interface IPasswordHistory {
  password: string | undefined;
  lastCreatedAt: Date | null;
  // lastUpdatedAt: Date | null;
}

export interface IPasswordManager {
  activePassword: IActivePassword;
  passwordHistory: [IPasswordHistory];
  // passwordHistory: Array<{ password: string; updatedAt: Date }>;
}

export interface IRefreshToken {
  refreshToken: string;
  tokenCreatedAt?: Date;
}

export interface IUser {
  // -------- others --------
  save(): unknown;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  passwordManager?: IPasswordManager;
  refreshTokenManager?: IRefreshToken[];
  _id: Types.ObjectId;
}

export interface UserModel extends Model<IUser> {
  save(): unknown;
  isUserExist(username: string): Promise<IUser | null>;
  isVerifiedUser(
    username: string,
    inputPassword: string,
  ): Promise<IUser | null>;
  isUserExistById(id: string): Promise<IUser | null>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

// Another approach to Define models:
// const User: Model<IUser> = mongoose.model('User', UserSchema);
// const Course: Model<ICourse> = mongoose.model('Course', CourseSchema);

// -------- others --------

export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUserRole = keyof typeof USER_ROLE;
