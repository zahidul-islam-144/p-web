import catchAsync from "../../utils/catchAsync";
import customResponse from "../../utils/customResponse";
import { EHttpStatusCode } from "../../interface/interface";
import { userService } from "./user.service";

const { createUserIntoDB } = userService;

const createUser = catchAsync(async (req, res, next) => {
    const reqBody = req.body;
    const newUser = await createUserIntoDB(reqBody);
    // const { password, passwordManager, ...projectedData } = newUser.toJSON();
  
    customResponse(res, {
      success: true,
      statusCode: EHttpStatusCode.SUCCESSFULL,
      message: "User created successfully.",
      data: newUser || [],
    });
  });
  
  const createAdmin = catchAsync(async (req, res, next) => {
    const reqBody = req.body;
  
    // customResponse(res, {
    //   success: true,
    //   statusCode: EHttpStatusCode.SUCCESSFULL,
    //   message: ECourseMessage.SUCCESSFULL_TO_CREATE,
    //   data: projectedData || null,
    // });
  });
  

  export const userController = {
    createUser,
    createAdmin
  }