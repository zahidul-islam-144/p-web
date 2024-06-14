import { EHttpStatusCode } from "../../interface/interface";
import catchAsync from "../../utils/catchAsync";
import customResponse from "../../utils/customResponse";
import { ECategoryMessage } from "../category/category.interface";
import { EReviewMessage } from "./review.interface";
import { reviewServices } from "./review.service";


const { createReviewIntoDB } = reviewServices;

const createReview = catchAsync(async (req, res, next) => {
    const reqBody = req.body;
    const createdUser = req?.user?._id;
    const results = await createReviewIntoDB(reqBody, createdUser);
 
    customResponse(res, {
      success: true,
      statusCode: EHttpStatusCode.SUCCESSFULL,
      message: EReviewMessage.SUCCESSFULL_TO_CREATE,
      data: results,
    });
  });
  


export const reviewController = {
    createReview
}