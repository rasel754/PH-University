import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'academic department must be string ',
      required_error: 'Department Name Is Required',
    }),
    academicFaculty: z.string({
      invalid_type_error:'academic department must be string',
      required_error:'Faculty must be required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'academic department must be string ',
      required_error: 'Department Name Is Required',
    }).optional(),
    academicFaculty: z.string({
      invalid_type_error: 'academic department must be string',
      required_error: 'Faculty must be required',
    }).optional(),
  }),
});
export const academicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
