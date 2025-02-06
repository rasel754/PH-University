import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, ' you are not authorized');
    }

    //check if token is valid

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

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


    if(user.passwordChangedDate && User.isJWTssuedBeforePasswordChanged(user.passwordChangedDate , iat as number)){
      throw new AppError(httpStatus.FORBIDDEN, 'your password has been changed, you are not authorized ');
    }






    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'you are not authorized to access this resource',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
