import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { academicFacultyValidation } from './academicFacultly.validation';
import { AcademicFacultyControllers } from './academicFacultly.controller';

const router = express.Router();

router.post(
  '/create-academicFaculty',
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidation.upadateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

export const AcademicFacultyRoutes = router;
