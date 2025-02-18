import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {

  // const userDate = req.user;

  const result = await AuthService.logingUser(req.body);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'development',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is logged in successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password is change successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'access token is refresh successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
};
