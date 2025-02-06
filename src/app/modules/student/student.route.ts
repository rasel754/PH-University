import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlwares/validateRequest';
import { updateStudentValidationSchema } from './student.zod.validation';
//will call controller function
const route = express.Router();

// route.post('/create-student', studentController.createStudent);
route.get('/', studentController.getAllStudent);

route.delete('/:id', studentController.deleteStudent);

route.patch('/:id',validateRequest(updateStudentValidationSchema), studentController.updateStudent);

route.get('/:id', studentController.getSingleStudent);

export const StudentRoute = route;
