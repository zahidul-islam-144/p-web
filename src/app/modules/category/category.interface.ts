import { Model, Types } from "mongoose";

export interface ICategory {
    name: string;
    createdBy: Types.ObjectId;
    _id: Types.ObjectId
}

export interface CategoryModel extends Model<ICategory> {
    isCategoryExist(name: string): Promise<ICategory | null>;
}

export enum ECategoryMessage {
    SUCCESSFULL_TO_CREATE = 'Category is created successfully.',
    FAILED_TO_CREATE = 'Failed to create category. This category already exists. Try unique one.',
    OK_TO_GET_ALL = 'Categories retrieved successfully.',
    NOT_OK_TO_GET_ALL = 'Categories not found.',
    OK_TO_GET_SINGLE = '',
    NOT_OK_TO_GET_SINGLE = ''
  }
  