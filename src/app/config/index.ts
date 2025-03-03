import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
};


/***
 * step of create jwt secret access token
 * step-1: node -> command dew
 * step-2:require('crypto').randomBytes(32).toString('hex') -> ai command dew 
 * step-3:numbet ta copy kore bosao
 */
