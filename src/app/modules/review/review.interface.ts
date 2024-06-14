import { Types } from "mongoose"

export interface IReview {
    courseId: Types.ObjectId;
    rating: number;
    review: string;
    createdBy: Types.ObjectId;
}

export enum EReviewMessage {
    SUCCESSFULL_TO_CREATE = 'Review is created successfully.',
    FAILED_TO_CREATE = 'Failed to create Review.',
    SUCCESSFULL_TO_UPDATED = 'Review is updated successfully.',
    FAILED_TO_UPDATED = 'Review is not updated successfully.',
    NOT_FOUND = 'Review not found.',
    OK_TO_GET_ALL = 'Reviews retrieved successfully.',
    NOT_OK_TO_GET_ALL = 'Failed to retrieve Reviews.',
    OK_TO_GET_SINGLE = '',
    NOT_OK_TO_GET_SINGLE = '',
    INVAILD_PAGE = '',
    INVALID_SORTING_FIELD = '',
    INVALID_TAGS = '',
    OK_TO_GET_BEST_COURSE = '',
    NOT_OK_TO_GET_BEST_COURSE = '',
    OK_COURSE_REVIEW = '',
    NOT_OK_COURSE_REVIEW = '',

  }