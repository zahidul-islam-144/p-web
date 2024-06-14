import { z } from 'zod';

// Define a schema for the review object
const reviewSchemaToCreate = z.object({
  body: z.object({
    courseId: z.string({ required_error: 'Course Id is required.' }),
    rating: z
      .number()
      .min(1, { message: 'Rating value should be at least 1.' })
      .max(5, { message: 'Rating value should not exceed more than 5.' }),
    review: z.string().optional(),
  }),
});

export default reviewSchemaToCreate;
