import Joi from "joi";

const userNameValidationSchema = Joi.object({
    firstName: Joi.string()    
      .trim()
      .max(20)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.empty': 'First name is required',
        'string.max': 'First name cannot be more than 20 characters',
        'string.pattern.base': '{#value} is not in capitalize format',
      }),
    middleName: Joi.string().trim().allow(null, ''),
    lastName: Joi.string()
      .trim()
      .regex(/^[A-Za-z]+$/)
      .required()
      .messages({
        'string.empty': 'Last name is required',
        'string.pattern.base': '{#value} is not valid',
      }),
  });
  
  const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().trim().required().messages({
      'string.empty': 'Father name is required',
    }),
    fatherOccupation: Joi.string().trim().required().messages({
      'string.empty': 'Father occupation is required',
    }),
    fatherContactNo: Joi.string().trim().required().messages({
      'string.empty': 'Father contact number is required',
    }),
    motherName: Joi.string().trim().required().messages({
      'string.empty': 'Mother name is required',
    }),
    motherOccupation: Joi.string().trim().required().messages({
      'string.empty': 'Mother occupation is required',
    }),
    motherContactNo: Joi.string().trim().required().messages({
      'string.empty': 'Mother contact number is required',
    }),
  });
  
  const localGuardianValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Local guardian name is required',
    }),
    occupation: Joi.string().trim().required().messages({
      'string.empty': 'Local guardian occupation is required',
    }),
    contactNo: Joi.string().trim().required().messages({
      'string.empty': 'Local guardian contact number is required',
    }),
    address: Joi.string().trim().required().messages({
      'string.empty': 'Local guardian address is required',
    }),
  });
  

  const studentValidationSchema = Joi.object({
    id: Joi.string().trim().required().messages({
      'string.empty': 'Student ID is required',
    }),
    name: userNameValidationSchema.required(),
    gender: Joi.string()
      .valid('female', 'male', 'other')
      .required()
      .messages({
        'string.empty': 'Gender is required',
        'any.only': '{#value} is not valid',
      }),
    dateOfBirth: Joi.string()
      .isoDate()
      .messages({ 'string.isoDate': 'Date of birth must be in ISO format' }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': '{#value} is not a valid email format',
      }),
    contactNo: Joi.string().trim().required().messages({
      'string.empty': 'Contact number is required',
    }),
    emergencyContactNo: Joi.string().trim().required().messages({
      'string.empty': 'Emergency contact number is required',
    }),
    bloodGroup: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
      .messages({
        'any.only': '{#value} is not a valid blood group',
      }),
    presentAddress: Joi.string().trim().required().messages({
      'string.empty': 'Present address is required',
    }),
    permanentAddress: Joi.string().trim().required().messages({
      'string.empty': 'Permanent address is required',
    }),

    guardian: guardianValidationSchema.required(),
    localGuardian: localGuardianValidationSchema.required(),
    profileImg: Joi.string().uri().messages({
      'string.uri': 'Profile image must be a valid URL',
    }),
    isActive: Joi.string()
      .valid('active', 'blocked')
      .default('active')
      .messages({
        'any.only': '{#value} is not a valid status',
      }),
  });

  export default studentValidationSchema;


