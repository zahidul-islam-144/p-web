import { z } from 'zod';

const categoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'Invalid name given.' })
      .trim()
      .min(1, { message: "Category name can't be empty." }),
  })
});

export default categoryValidationSchema;
