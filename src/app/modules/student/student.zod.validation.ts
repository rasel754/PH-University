import { create } from "domain";
import { z } from "zod";

const crateUserNameValidationSchema = z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(20, 'Name cannot be more than 20 characters')
      .transform((value) => value.trim()), // Trim spaces
    middleName: z
      .string()
      .optional()
      .transform((value) => value?.trim() || ''), // Trim spaces if provided
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .transform((value) => value.trim()), // Trim spaces
  });
  
  // Example usage in other schemas
  const crateGuardianValidationSchema = z.object({        
    fatherName: z
      .string()
      .min(1, 'Father\'s name is required')
      .transform((value) => value.trim()),
    fatherOccupation: z
      .string()
      .min(1, 'Father\'s occupation is required')
      .transform((value) => value.trim()),
    fatherContactNo: z
      .string()
      .min(1, 'Father\'s contact number is required')
      .transform((value) => value.trim()),
    motherName: z
      .string()
      .min(1, 'Mother\'s name is required')
      .transform((value) => value.trim()),
    motherOccupation: z
      .string()
      .min(1, 'Mother\'s occupation is required')
      .transform((value) => value.trim()),
    motherContactNo: z
      .string()
      .min(1, 'Mother\'s contact number is required')
      .transform((value) => value.trim()),
  });
  
  const crateLocalGuardianValidationSchema = z.object({
    name: z
      .string()
      .min(1, 'Local guardian\'s name is required'),
    occupation: z
      .string()
      .min(1, 'Local guardian\'s occupation is required'),
    contactNo: z
      .string()
      .min(1, 'Local guardian\'s contact number is required'),
    address: z
      .string()
      .min(1, 'Local guardian\'s address is required'),
  });
  
  const createStudentValidationSchema = z.object({
    body: z.object({
      // id: z.string().min(1, 'ID is required'),
      password: z.string().max(20),
      student: z.object({
        name: crateUserNameValidationSchema,
        gender: z.enum(['female', 'male', 'other'], {
          errorMap: () => ({
            message: 'Gender must be one of: male, female, or other',
          }),
        }),
        dateOfBirth: z.string().optional(),
        email: z
          .string()
          .email('Invalid email format')
          .min(1, 'Email is required'),
        contactNo: z.string().min(1, 'Contact number is required'),
        emergencyContactNo: z
          .string()
          .min(1, 'Emergency contact number is required'),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        presentAddress: z.string().min(1, 'Present address is required'),
        permanentAddress: z.string().min(1, 'Permanent address is required'),
        guardian: crateGuardianValidationSchema,
        localGuardian: crateLocalGuardianValidationSchema,
        admissionSemester: z.string(),
        profileImg: z.string().url('Invalid profile image URL').optional(),
        academicDepartment: z.string().optional(),
        // isActive: z.enum(['active', 'blocked']).default('active'),
      }),
    }),
  });


  
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

  const updateGuardianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional(),
  });

  const updateLocalGuardianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
  });

  export const updateStudentValidationSchema = z.object({
    body: z.object({
      student: z.object({
        name: updateUserNameValidationSchema,
        gender: z.enum(['male', 'female', 'other']).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloogGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGuardian: updateLocalGuardianValidationSchema.optional(),
        admissionSemester: z.string().optional(),
        profileImg: z.string().optional(),
        academicDepartment: z.string().optional(),
      }),
    }),
  });

  export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
  };