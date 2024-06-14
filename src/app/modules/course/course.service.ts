import mongoose from 'mongoose';
import CustomError from '../../errors/CustomError';
import {
  ECourseMessage,
  ICourse,
  IDateQueryParams,
  IPriceQueryParams,
  IQueryRangeParams,
  ITags,
} from './course.interface';
import { Course } from './course.model';
import { courseUtils } from './course.utils';
import { EHttpStatusCode } from '../../interface/interface';

const createCourseIntoDB = async (payload: ICourse, createdUser: string) => {
  const isCourseExist = await Course.isCourseExist(payload.title);
  const { durationInWeeks, ...projectedData } = payload;
  const countWeeks = courseUtils.calculateWeek(
    payload.startDate,
    payload.endDate,
  );
  // const levelToLowerCase = details?.level.toLowerCase();

  const updatedPayload = {
    ...projectedData,
    createdBy: createdUser,
    durationInWeeks: countWeeks,
  };

  if (!isCourseExist) {
    const newCourse = await Course.create(updatedPayload);
    return newCourse;
  } else {
    throw new CustomError(
      EHttpStatusCode.NOT_ACCEPTABLE,
      ECourseMessage.FAILED_TO_CREATE,
      true,
      [],
    );
  }
};

const getCourseByQueryingFromDB = async (payload: Record<string, any>) => {
  const filterEmptyQuery = Object.values(payload).filter((query) => !query);
  if (filterEmptyQuery.length > 0) {
    throw new CustomError(
      EHttpStatusCode.BAD_REQUEST,
      ECourseMessage.NOT_OK_TO_GET_ALL,
      true,
      [],
    );
  }

  const _limit = Number(payload.limit || 10);
  const _page = Number(payload.page || 1);
  const _skip = (_page - 1) * _limit;
  const _totalDocs = await Course.find().countDocuments();
  const totalPages = Math.ceil(_totalDocs / _limit);

  const meta: Record<string, unknown> = {
    page: _page,
    limit: _limit,
    total: _totalDocs,
  };
  const expectedParams = [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
    'tags',
    'language',
    'provider',
    'durationInWeeks',
    'level',
  ];
  const key1 = Object.keys(payload).find((param) =>
    expectedParams.includes(param),
  );
  const key2 = Object.entries(payload);
  const isSingleParam = key1?.length ? true : false;

  if (isSingleParam) {
    switch (key1) {
      case 'limit':
        const resultsBylimit = await Course.find({})
          .limit(Number(_limit))
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        const _hasCourse = !resultsBylimit.length ? false : true;
        meta.total = resultsBylimit?.length;
        return { meta, resultsBylimit, hasCourse: _hasCourse };
        break;

      case 'page':
        const isInvalidPage = totalPages < _page ? true : false;
        if (!isInvalidPage) {
          const resultsByPage = await Course.find({})
            .skip(_skip)
            .limit(_limit)
            .populate({
              path: 'createdBy',
              select: '_id username email role',
            })
            .lean();
          const hasCourse = !resultsByPage.length ? false : true;
          meta.total = resultsByPage?.length;
          return { meta, resultsByPage, hasCourse };
        } else {
          return { msgForPage: ECourseMessage.INVAILD_PAGE, resultsByPage: [] };
        }
        break;

      case 'sortBy':
        const sortBy = payload.sortBy;
        const sortFields = [
          'title',
          'price',
          'startDate',
          'endDate',
          'language',
          'durationInWeeks',
        ];
        const isInclude = sortFields.includes(sortBy.toString());
        if (isInclude) {
          const resultsByFieldSorting = await Course.find()
            .sort({
              [sortBy.toString()]: 1,
            })
            .populate({
              path: 'createdBy',
              select: '_id username email role',
            })
            .lean();
          const hasCourse = !resultsByFieldSorting.length ? false : true;
          meta.total = resultsByFieldSorting?.length;
          return { meta, resultsByFieldSorting, hasCourse };
        } else {
          return {
            msgForFieldFiltering: ECourseMessage.INVALID_SORTING_FIELD,
          };
        }
        break;

      case 'sortOrder':
        const order =
          payload.sortOrder === 'asc' || payload.sortOrder === 'ascending'
            ? 1
            : -1;
        const resultsBySorting = await Course.find()
          .sort({
            _id: order === 1 ? 1 : -1,
          })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        const hasCourse = !resultsBySorting.length ? false : true;
        meta.total = resultsBySorting?.length;
        return { meta, resultsBySorting, hasCourse };
        break;

      case 'tags':
        const resultsByTags = await Course.find({
          tags: { $elemMatch: { name: payload.tags } },
        })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        if (!resultsByTags?.length) {
          return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        } else {
          const hasCourse = !resultsByTags.length ? false : true;
          meta.total = resultsByTags?.length;
          return { meta, resultsByTags, hasCourse };
        }
        break;

      case 'language':
        const resultsBylanguage = await Course.find({
          language: payload.language,
        })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        if (!resultsBylanguage?.length) {
          return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        } else {
          const hasCourse = !resultsBylanguage.length ? false : true;
          meta.total = resultsBylanguage?.length;
          return { meta, resultsBylanguage, hasCourse };
        }
        break;

      case 'provider':
        const resultsByProvider = await Course.find({
          provider: payload.provider,
        })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        if (!resultsByProvider?.length) {
          return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        } else {
          const hasCourse = !resultsByProvider.length ? false : true;
          meta.total = resultsByProvider?.length;
          return { meta, resultsByProvider, hasCourse };
        }
        break;

      case 'durationInWeeks':
        const resultsByWeeks = await Course.find({
          durationInWeeks: { $eq: payload.durationInWeeks },
        })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();

        if (!resultsByWeeks?.length) {
          return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        } else {
          const hasCourse = !resultsByWeeks.length ? false : true;
          meta.total = resultsByWeeks?.length;
          return { meta, resultsByWeeks, hasCourse };
        }
        break;

      case 'level':
        const resultsByLevel = await Course.find({
          'details.level': payload.level,
        })
          .populate({
            path: 'createdBy',
            select: '_id username email role',
          })
          .lean();
        if (!resultsByLevel?.length) {
          return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        } else {
          const hasCourse = !resultsByLevel.length ? false : true;
          meta.total = resultsByLevel?.length;
          return { meta, resultsByLevel, hasCourse };
        }
        break;

      default:
        return { msgNotFound: ECourseMessage.NOT_OK_TO_GET_ALL };
        break;
    }
  } else {
    const params: IQueryRangeParams = {};
    for (const [key, value] of Object.entries(payload)) {
      params[`${key}`] = value;
    }

    const resultsByRange = await courseUtils.getCoursesByRange(params);
    const hasCourse = !resultsByRange.length ? false : true;
    meta.total = resultsByRange?.length;
    return { meta, resultsByRange, hasCourse };
  }
};

const getCourseByIdFromDB = async (payload: string) => {
  console.log('---> payload:params ', payload);
  const course = await Course.aggregate([
    // stage-1: find
    {
      $match: { _id: mongoose.Types.ObjectId.createFromHexString(payload) },
    },
    {
      $lookup: {
        from: 'reviews', // Foreign collection name:reviews
        localField: '_id', // with which field I need to compare of courses collection
        foreignField: 'courseId', // with which field I need to compare of reviews collection
        as: 'reviews', // custom field name where I kept reviews data
      },
    },
    {
      $lookup: {
        from: 'users', // Foreign collection name:reviews
        localField: 'createdBy', // with which field I need to compare of courses collection
        foreignField: '_id', // with which field I need to compare of reviews collection
        as: 'createdBy', // custom field name where I kept reviews data
      },
    },
    {
      $project: {
        reviews: { _id: 0 },
        'createdBy.password': 0,
        'createdBy.passwordManager': 0,
        'createdBy._v': 0,
      },
    },
  ]);
  return course;
};

const getBestCourseFromDB = async () => {
  const result = await Course.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $unwind: '$reviews',
    },
    {
      $group: {
        _id: '$_id',
        course: { $first: '$$ROOT' },
        _averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users', // Foreign collection name:reviews
        localField: 'createdBy', // with which field I need to compare of courses collection
        foreignField: '_id', // with which field I need to compare of reviews collection
        as: 'createdBy', // custom field name where I kept reviews data
      },
    },
    {
      $unwind: '$createdBy',
    },
    {
      $addFields: {
        averageRating: { $round: ['$_averageRating', 1] },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        _id: 0,
        'course.reviews': 0,
        'course.createdAt': 0,
        'course.updatedAt': 0,
        _averageRating: 0,
      },
    },
  ]);
  return result;
};

const updateCourseFromDB = async (
  targetId: string,
  payload: Partial<ICourse>,
) => {
  const isCourseExist = await Course.isCourseExistById(targetId);
  const { tags, details, ...othersInputData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...othersInputData };

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      modifiedUpdatedData[`details.${key}`] = value;
    }
  }

  const filteredUndeletedTags: ITags[] = [];
  const filterDeletedTags: ITags[] = [];
  tags?.filter((tag) => {
    if (tag.isDeleted === true) {
      filterDeletedTags.push(tag);
    } else {
      filteredUndeletedTags.push(tag);
    }
  });
  const filterName: Array<string> = filterDeletedTags.map((tag) => tag.name);

  if (isCourseExist) {
    const { ObjectId } = mongoose.Types;
    await Course.updateOne(
      { _id: new ObjectId(targetId) },
      {
        $pull: { tags: { name: { $in: filterName } } },
      },
    );

    await Course.findOneAndUpdate(
      { _id: new ObjectId(targetId) },
      {
        ...modifiedUpdatedData,
        $addToSet: { tags: { $each: filteredUndeletedTags } },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    const results = await Course.find({ _id: new ObjectId(targetId) })
      .populate({
        path: 'createdBy',
        select: '_id username email role',
      })
      .lean();
    return results ? results : [];
  } else {
    throw new CustomError(
      EHttpStatusCode.BAD_REQUEST,
      ECourseMessage.NOT_FOUND,
      true,
      [],
    );
  }
};

export const courseService = {
  createCourseIntoDB,
  getCourseByQueryingFromDB,
  getCourseByIdFromDB,
  getBestCourseFromDB,
  updateCourseFromDB,
};
