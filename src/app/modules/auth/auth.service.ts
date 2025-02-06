import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';


const logingUser = async (payload: TLoginUser) => {
  //check if user is exist

  // const isUserExist = await User.findOne({ id: payload?.id });
  // console.log(isUserExist);

  // if (!isUserExist) {
  //   throw new AppError(
  //     httpStatus.NOT_FOUND,
  //     'this user does not exist in the database',
  //   );
  // }

  const user = await User.isUserExistsByCustomeId(payload.id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'this user does not exist in the database',
    );
  }

  //check if user is already deleted
  const isDeleted = user?.isDelete;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'this user has been deleted');
  }

  //check if user is already deleted
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'this user has been blocked');
  }

  //check if the password is correct
  //   const isPasswordCorrect = await bcrypt.compare(payload?.password, isUserExist?.password);
  // console.log(isPasswordCorrect);
  //   if (!isPasswordCorrect) {
  //     throw new AppError(httpStatus.UNAUTHORIZED, 'wrong password');
  //   }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'password mismatch');
  }



  //create token and send to the client

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(jwtPayload , config.jwt_access_secret as string , config.jwt_access_expire_in as string);

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expire_in as string,
  );


  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needToChangePassword
  };
};


const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomeId(userData.userId);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'this user does not exist in the database',
    );
  }

  //check if user is already deleted
  const isDeleted = user?.isDelete;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'this user has been deleted');
  }

  //check if user is already deleted
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'this user has been blocked');
  }



  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'password mismatch');
  }


  const newHashPassword = await bcrypt.hash(payload?.newPassword,Number(config.bcrypt_salt_rounds))


 await User.findOneAndUpdate(
   {
     id: userData.userId,
     role: userData.role,
   },
   {
     password: newHashPassword,
     needToChangePassword: false,
     passwordChangedDate:new Date()
   },
 );
  return null;
};


const refreshToken = async(token:string) => {
 

   //check if token is valid

   const decoded = jwt.verify(
     token,
     config.jwt_refresh_token as string,
   ) as JwtPayload;

   const { userId, iat } = decoded;

   const user = await User.isUserExistsByCustomeId(userId);

   if (!user) {
     throw new AppError(
       httpStatus.NOT_FOUND,
       'this user does not exist in the database',
     );
   }

   //check if user is already deleted
   const isDeleted = user?.isDelete;
   if (isDeleted) {
     throw new AppError(httpStatus.FORBIDDEN, 'this user has been deleted');
   }

   //check if user is already deleted
   const userStatus = user?.status;
   if (userStatus === 'blocked') {
     throw new AppError(httpStatus.FORBIDDEN, 'this user has been blocked');
   }

   if (
     user.passwordChangedDate &&
     User.isJWTssuedBeforePasswordChanged(
       user.passwordChangedDate,
       iat as number,
     )
   ) {
     throw new AppError(
       httpStatus.FORBIDDEN,
       'your password has been changed, you are not authorized ',
     );
   }


     const jwtPayload = {
       userId: user?.id,
       role: user?.role,
     };

     const accessToken = createToken(
       jwtPayload,
       config.jwt_access_secret as string,
       config.jwt_access_expire_in as string,
     );


     return {
       accessToken,
     };
};



export const AuthService = {
  logingUser,
  changePassword,
  refreshToken,
};
