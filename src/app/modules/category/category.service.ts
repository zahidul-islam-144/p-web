import CustomError from '../../errors/CustomError';
import { EHttpStatusCode } from '../../interface/interface';
import { ECategoryMessage, ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: ICategory, createdUser: string) => {
  const isCategoryExist = await Category.isCategoryExist(payload?.name);

  if (!isCategoryExist) {
    const newCategory = await Category.create({
      ...payload,
      createdBy: createdUser
    });
    return newCategory;
  } else {
    throw new CustomError(
      EHttpStatusCode.NOT_ACCEPTABLE,
      ECategoryMessage.FAILED_TO_CREATE,
      true,
      [],
    );
  }
};

const getAllCategoriesFromDB = async () => {
  const getCategories = await Category.find(
    {},
    { _id: 1, name: 1, createdBy: 1, createdAt: 1, updatedAt: 1 }, // Include necessary fields
  )
    .populate({
      path: 'createdBy',
      select: '_id username email role',
    })
    .lean()

  console.log('---> getAllcate: ', getCategories);
  return getCategories;
};

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
