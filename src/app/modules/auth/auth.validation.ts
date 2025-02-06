import { z } from "zod";



const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'id must be a string',
    }),
    password: z.string({
      required_error: 'password must be a string',
    }),
  }),
});


const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies:z.object({
    refreshToken: z.string({ required_error: 'refreshToken is required' }),
  })
})

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema, 
  refreshTokenValidationSchema
};