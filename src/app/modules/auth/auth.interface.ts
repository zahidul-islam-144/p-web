import { Model } from "mongoose";

export interface ILoginUser {
  username: string;
  password: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export const TOKEN_TYPE = {
  accessToken: 'ACCESS_TOKEN',
  refreshToken: 'REFRESH_TOKEN',
} as const;

export type TTokenType = keyof typeof TOKEN_TYPE;


export type TCookieOption = {
  expires?: Date,
  httpOnly: boolean,
  secure?: boolean,
  sameSite?: boolean | "strict" | "lax" | "none",
}