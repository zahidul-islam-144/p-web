import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import customResponse from '../../utils/customResponse';
import { categoryServices } from './category.service';
import { EHttpStatusCode } from '../../interface/interface';
import { Types } from 'mongoose';
import { ECategoryMessage } from './category.interface';

const { createCategoryIntoDB, getAllCategoriesFromDB } = categoryServices;

const createCategory = catchAsync(async (req, res, next) => {
  const reqBody = req.body;
  const createdUser = req?.user?._id
  const newCategory = await createCategoryIntoDB(reqBody, createdUser);
  // const { createdAt, updatedAt, ...projectedData } = newCategory && newCategory.toJSON();

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: ECategoryMessage.SUCCESSFULL_TO_CREATE,
    data: newCategory || null,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const getCategories = await getAllCategoriesFromDB();
  const hasCategories = getAllCategories?.length > 0 ? true : false;
  
  customResponse(res, {
    success: hasCategories ? true : false,
    statusCode: hasCategories ? EHttpStatusCode.OK : EHttpStatusCode.NOT_FOUND,
    message: hasCategories
      ? ECategoryMessage.OK_TO_GET_ALL
      : ECategoryMessage.NOT_OK_TO_GET_ALL,
    data: hasCategories ? getCategories : null,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
};
