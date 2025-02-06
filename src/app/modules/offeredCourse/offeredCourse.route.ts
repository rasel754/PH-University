import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseController } from './offeredCourse.controller';



const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(
    OfferedCourseValidations.createOfferedCourseValidationSchema
  ),
  OfferedCourseController.createOfferedCourses
);

// router.get('/', SemesterRegistrationController.getAllSemesterRegistration);

// router.get(
//   '/:id',
//   SemesterRegistrationController.getSingleSemesterRegistration,
// );

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
);

export const offeredCourseRoutes = router;
