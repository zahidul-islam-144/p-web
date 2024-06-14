import { ZodError, z } from 'zod';

const PasswordSchema = z.string().refine((password) => {
    const regexPatterns = [
      // {
      //   pattern: /^$|\s+/,
      //   message: 'No white space character is allowed.',
      //   path: ['password']
      // },
      {
        pattern: /[a-z]/,
        message: 'Password must contain at least one lowercase letter',
        path: ['password'],
      },
      {
        pattern: /[A-Z]/,
        message: 'Password must contain at least one uppercase letter',
        path: ['password'],
      },
      {
        pattern: /[0-9]/,
        message: 'Password must contain at least one digit',
        path: ['password'],
      },
      {
        pattern: /[^a-zA-Z0-9]/,
        message: 'Password must contain at least one special character',
        path: ['password'],
      },
      {
        pattern: /^.{5,10}$/,
        message: 'Password must be 5-10 characters long.',
        path: ['password'],
      },
    ];
  
    const failedAttempts = regexPatterns.reduce((errors: any, pattern) => {
      if (!pattern.pattern.test(password)) {
        errors.push({ message: pattern.message, path: pattern.path });
      }
      return errors;
    }, []);
  
    if (failedAttempts.length > 0) {
      throw new ZodError(failedAttempts);
    } else {
      return true;
    }
  });

const loginValidationSchema = z.object({
  body: z.object({
    username: z
      .string({ invalid_type_error: 'Invalid type of username field.' })
      .trim()
      .min(1, { message: "Username can't be empty." }),
    password: z.string().trim(),
  }),
});


const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string().trim(),
    newPassword : PasswordSchema
  })
})

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  })
})

export const authValidationSchema = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidation
}