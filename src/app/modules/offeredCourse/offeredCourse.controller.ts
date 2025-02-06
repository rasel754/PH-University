import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { offeredCourseServices } from "./offeredCourse.service";

const createOfferedCourses = catchAsync(async (req:Request , res:Response) => {
  const result = await offeredCourseServices.createOfferedCoursesIntoDB(req.body);

  sendResponse(res , {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course created successfully",
    data: result,
  })
})


const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await offeredCourseServices.updatedOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourses,
  updateOfferedCourse,
};

