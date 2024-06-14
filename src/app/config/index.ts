import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_DOCKER_PORT: process.env.DATABASE_URL_DOCKER_PORT,
  NODE_ENV: process.env.NODE_ENV,
  SALT_ROUND: process.env.SALT_ROUND,
  JWT_SECRET_FOR_ACCESS_TOKEN: process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
  JWT_SECRET_FOR_REFRESH_TOKEN: process.env.JWT_SECRET_FOR_REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  COOKIE_EXPIRY: process.env.COOKIE_EXPIRY
};

