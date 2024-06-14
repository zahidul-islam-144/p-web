import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true },
);


categorySchema.statics.isCategoryExist = async function (payload: string) {
  const isCategoryExist = await Category.find({
    name: { $eq: payload },
  })
  return (isCategoryExist.length > 0) ? true : false;
};


export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
);
