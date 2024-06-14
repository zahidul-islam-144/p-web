import { ZodError, z } from 'zod';

const PasswordSchema = z.string().trim().refine((password) => {
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


// const ActivePasswordSchema = z.object({
//     lastCreatedAt: z.date().optional(),
//     lastUpdatedAt: z.date().optional()
// })

// const PasswordHistorySchema = z.object({
//     password: z.string(),
//     lastCreatedAt: z.date().optional(),
//     lastUpdatedAt: z.date().optional()
// })


// const PasswordManagerSchema = z.object({
//     activePassword: ActivePasswordSchema,
//     passwordHistory: z.array(PasswordHistorySchema)
// })

const userValidationSchemaToCreate = z.object({
  body: z.object({
    username: z
      .string({ invalid_type_error: 'Invalid type of username field.' })
      .trim()
      .min(1, { message: "Username can't be empty." }),

      email: z
      .string()
      .min(1, { message: 'Email field has to be filled.' })
      .email({ message: 'This is not a valid email.' }),

      password: PasswordSchema,
      role: z.enum(['admin', 'user']).default('user'),
    //   passwordManager:
  }),
});

export default userValidationSchemaToCreate;