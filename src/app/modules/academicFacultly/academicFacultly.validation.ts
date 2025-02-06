import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'academic faculty must be string ',
    }),
  }),
});

const upadateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'academic faculty must be string ',
    }),
  }),
});
export const academicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  upadateAcademicFacultyValidationSchema,
};
