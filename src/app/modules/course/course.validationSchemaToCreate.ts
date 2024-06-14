import { ZodError, z } from 'zod';

const TagsSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Invalid name type given.' })
    .min(1, { message: 'Name field is needed in tags.' }),
  isDeleted: z
    .boolean({ invalid_type_error: 'isDelete field is invalid type.' })
    .default(false),
});

const DetailsSchema = z.object({
  level: z.string({
    invalid_type_error: 'Invalid type data given in level field',
    required_error: 'Level is needed.',
  }),
  description: z.string({
    invalid_type_error: 'Invalid type description written.',
    required_error: 'Description is mandatory.',
  }),
});

const courseValidationSchemaToCreate = z.object({
  body: z
    .object({
      title: z
        .string({ invalid_type_error: 'Invalid type title given.' })
        .min(1, { message: "Title field can't be empty." }),
      instructor: z
        .string({ invalid_type_error: 'Invalid type instructor given.' })
        .min(1, { message: 'Instructor name is needed.' }),
      categoryId: z
        .string({ invalid_type_error: 'Invalid categoryId type given.' })
        .min(1, { message: 'Category Id is mandatory.' }),
      price: z
        .number({ invalid_type_error: 'Invalid type price given.' })
        .min(1, { message: 'Price field is empty.' }),
      tags: z.array(TagsSchema),
      startDate: z.string({ invalid_type_error: 'Invalid date type given.' }),
      endDate: z.string({ invalid_type_error: 'Invalid date type given.' }),
      language: z
        .string({ invalid_type_error: 'Invalid type language given.' })
        .min(1, { message: "Language field can't be empty." }),
      provider: z.string({
        invalid_type_error: 'Invalid provider type given.',
        required_error: 'Provider is needed.',
      }),
      durationInWeeks: z.number().int().optional(),
      details: DetailsSchema,
    })
    .refine(
      (data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return startDate <= endDate;
      },
      {
        message:
          'Write down the date carefully. Start date must be before the end date or, End date must be after the start date.',
        path: ['startDate', 'endDate'],
      },
    ),
});

export default courseValidationSchemaToCreate;
