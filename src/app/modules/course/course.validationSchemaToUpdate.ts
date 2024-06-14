import { ZodError, z } from 'zod';

const TagsSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Invalid name type given.' })
    .min(1, { message: 'Name field is needed in tags.' }).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: 'isDelete field is invalid type.' })
    .default(false).optional(),
});

const DetailsSchema = z.object({
  level: z.string({
    invalid_type_error: 'Invalid type data given in level field',
    required_error: 'Level is needed.',
  }).optional(),
  description: z.string({
    invalid_type_error: 'Invalid type description written.',
    required_error: 'Description is mandatory.',
  }).optional(),
});

const courseValidationSchemaToUpdate = z.object({
    body: z
      .object({
        title: z
          .string({ invalid_type_error: 'Invalid type title given.' })
          .min(1, { message: "Title field can't be empty." })
          .optional(),
        instructor: z
          .string({ invalid_type_error: 'Invalid type instructor given.' })
          .min(1, { message: 'Instructor name is needed.' })
          .optional(),
        categoryId: z
          .string({ invalid_type_error: 'Invalid provider type given.' })
          .min(1, { message: 'Category Id is mandatory.' })
          .optional(),
        price: z
          .number({ invalid_type_error: 'Invalid type price given.' })
          .min(1, { message: 'Price field is empty.' })
          .optional(),
        tags: z.array(TagsSchema).optional(),
        startDate: z
          .string({ invalid_type_error: 'Invalid date type given.' })
          .optional(),
        endDate: z
          .string({ invalid_type_error: 'Invalid date type given.' })
          .optional(),
        language: z
          .string({ invalid_type_error: 'Invalid type language given.' })
          .min(1, { message: "Language field can't be empty." })
          .optional(),
        provider: z
          .string({
            invalid_type_error: 'Invalid provider type given.',
            required_error: 'Provider is needed.',
          })
          .optional(),
        durationInWeeks: z.number().int().optional(),
        details: DetailsSchema.optional(),
      })
      .refine(
        (data) => {
          if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            return startDate <= endDate;
          }
          return true; 
        },
        {
          message:
            'Write down the date carefully. Start date must be before the end date or, End date must be after the start date.',
          path: ['startDate', 'endDate'],
        },
      ),
  });
  
  export default courseValidationSchemaToUpdate;
  
