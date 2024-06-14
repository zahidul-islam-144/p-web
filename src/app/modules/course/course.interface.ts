import { Model, Types } from 'mongoose';

export interface ITags {
    name: string;
    isDeleted: boolean;
}

export interface IDetails {
    level: 'Beginner' | 'beginner' | 'Intermediate' | 'intermediate' | 'Advanced' | 'advanced';
    description: string;
}

export interface ICourse {
    title: string;
    instructor: string;
    categoryId: Types.ObjectId;
    price: number;
    tags: ITags[];
    startDate: string;
    endDate: string;
    language: string;
    provider: string;
    durationInWeeks: number;
    details: IDetails;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


export interface IDateQueryParams {
    startDate?: string | undefined;
    endDate?: string | undefined
}

export interface IPriceQueryParams {
    minPrice?: number;
    maxPrice?: number;
}

export interface IQueryRangeParams {
    [key: string] : string | number | unknown;
}

export interface IDateQueryReturnType {
    query: string
}

export enum ECourseMessage {
    SUCCESSFULL_TO_CREATE = 'Course is created successfully.',
    FAILED_TO_CREATE = 'Failed to create course. This course already exists. Try unique one.',
    SUCCESSFULL_TO_UPDATED = 'Course is updated successfully.',
    FAILED_TO_UPDATED = 'Course is not updated successfully.',
    NOT_FOUND = 'Course not found.',
    OK_TO_GET_ALL = 'Courses retrieved successfully.',
    NOT_OK_TO_GET_ALL = 'Failed to retrieve courses.',
    OK_TO_GET_SINGLE = '',
    NOT_OK_TO_GET_SINGLE = '',
    INVAILD_PAGE = 'Invalid page number. No data available for this page.',
    INVALID_SORTING_FIELD = 'Invalid querying. Please, check your query.',
    INVALID_TAGS = 'Invalid tags.',
    OK_TO_GET_BEST_COURSE = 'Best course retrieved successfully',
    NOT_OK_TO_GET_BEST_COURSE = 'No best course found.',
    OK_COURSE_REVIEW = 'Course and Reviews retrieved successfully',
    NOT_OK_COURSE_REVIEW = 'No course found along with its review.',

  }

// -----final course model-----
export interface CourseModel extends Model<ICourse> {
    isCourseExist(title: string): Promise<ICourse | null>;
    isCourseExistById(id: string): Promise<ICourse | null>;
}