import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlwares/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-academicSemester',
  validateRequest(academicSemesterValidation.createAcademicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);


router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get('/',auth('admin'), AcademicSemesterControllers.getAllAcademicSemesters);


export const AcademicSemesterRoutes = router;
