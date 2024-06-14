import { EHttpStatusCode } from '../../interface/interface';
import catchAsync from '../../utils/catchAsync';
import customResponse from '../../utils/customResponse';
import { ECourseMessage } from './course.interface';
import { courseService } from './course.service';

const {
  createCourseIntoDB,
  getCourseByQueryingFromDB,
  getCourseByIdFromDB,
  getBestCourseFromDB,
  updateCourseFromDB,
} = courseService;

const createCourse = catchAsync(async (req, res, next) => {
  const reqBody = req.body;
  const createdUser = req?.user?._id;
  const newCourse = await createCourseIntoDB(reqBody, createdUser);
  const { createdAt, updatedAt, ...projectedData } = newCourse.toJSON();

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: ECourseMessage.SUCCESSFULL_TO_CREATE,
    data: projectedData || null,
  });
});

const getCourseByQuerying = catchAsync(async (req, res, next) => {
  const results = await getCourseByQueryingFromDB(req.query);
  const msg = results.hasCourse
    ? results?.msgForPage ||
      results?.msgForFieldFiltering ||
      results?.msgNotFound ||
      ECourseMessage.OK_TO_GET_ALL
    : ECourseMessage.NOT_FOUND;
    
  customResponse(res, {
    success: results?.hasCourse ? true : false,
    statusCode: results?.hasCourse
      ? EHttpStatusCode.OK
      : EHttpStatusCode.NOT_FOUND,
    message: msg,
    meta: results?.meta,
    data:
      results?.resultsByPage ||
      results?.resultsBylimit ||
      results?.resultsByFieldSorting ||
      results?.resultsBySorting ||
      results?.resultsByTags ||
      results?.resultsBylanguage ||
      results.resultsByProvider ||
      results?.resultsByWeeks ||
      results?.resultsByLevel ||
      results?.resultsByRange ||
      null,
  });
});

const getCourseById = catchAsync(async (req, res, next) => {
  const reqParams = req.params.courseId;
  const results = await getCourseByIdFromDB(reqParams);
  const hasCourse = results && results?.length > 0 ? true : false;

  customResponse(res, {
    success: hasCourse ? true : false,
    statusCode: hasCourse
      ? EHttpStatusCode.SUCCESSFULL
      : EHttpStatusCode.NOT_FOUND,
    message: hasCourse
      ? ECourseMessage.OK_COURSE_REVIEW
      : ECourseMessage.NOT_OK_COURSE_REVIEW,
    data: results || null,
  });
});

const getBestCourse = catchAsync(async (req, res, next) => {
  const bestCourse = await getBestCourseFromDB();
  const hasCourse = bestCourse && bestCourse.length > 0 ? true : false;

  customResponse(res, {
    success: hasCourse ? true : false,
    statusCode: hasCourse
      ? EHttpStatusCode.SUCCESSFULL
      : EHttpStatusCode.NOT_FOUND,
    message: hasCourse
      ? ECourseMessage.OK_TO_GET_BEST_COURSE
      : ECourseMessage.NOT_OK_TO_GET_BEST_COURSE,
    data: bestCourse || null,
  });
});

const updateCourse = catchAsync(async (req, res, next) => {
  const targetId = req.params.targetId;
  const updatedCourse = await updateCourseFromDB(targetId, req.body);
  const hasCourse = !updatedCourse.length ? false : true;

  customResponse(res, {
    success: hasCourse ? true : false,
    statusCode: hasCourse
      ? EHttpStatusCode.SUCCESSFULL
      : EHttpStatusCode.NOT_FOUND,
    message: hasCourse
      ? ECourseMessage.SUCCESSFULL_TO_UPDATED
      : ECourseMessage.FAILED_TO_UPDATED,
    data: updatedCourse || null,
  });
});

export const courseController = {
  createCourse,
  getCourseByQuerying,
  getCourseById,
  getBestCourse,
  updateCourse,
};
