import { NextFunction, Request, RequestHandler, Response } from 'express';
import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// import { error } from 'console';

// import Joi from 'joi';
// import { z } from "zod";
// import studentValidationSchema from './student.zod.validation';
// import studentValidationSchema from './student.validation';

// const createStudent = async (req: Request, res: Response) => {
//   try {
//     //crating a schema validation using joi

//     const { student: studentData } = req.body;

//     //data validation using joi
//     // const{error,value}=studentValidationSchema.validate(studentData);
//     // console.log(error ,'  ---' , value);

//    //data validation using zod
//     const zodParseData =studentValidationSchema.parse(studentData)

//      //will call service function to send this data
//      const result = await studentServices.createStudentIntoDB(zodParseData);

//     // if(error){
//     //   res.status(500).json({
//     //     success: false,
//     //     message: 'something went wrong',
//     //     error
//     //   })
//     // }

//     //send response

//     res.status(200).json({
//       success: true,
//       message: 'Student is crate successfully',
//       data: result,
//     });
//   } catch (err:any) {
//     res.status(500).json({
//       success: false,
//       message: err.message|| 'something went wrong',
//       error:err,
//     });
//   }
// };

const getAllStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is find is successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is find is successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted is successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {student} = req.body;
  const result = await studentServices.updateStudentInDB(id , student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is update is successfully',
    data: result,
  });
});

export const studentController = {
  // createStudent,
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent
};
