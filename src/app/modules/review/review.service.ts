import CustomError from '../../errors/CustomError';
import { EHttpStatusCode } from '../../interface/interface';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReviewIntoDB = async (payload: IReview, createdUser: string) => {
  console.log('---> newReview: payload', payload);
  const newReview = await Review.create({...payload, createdBy: createdUser});
  return newReview;
};

export const reviewServices = {
  createReviewIntoDB,
};
