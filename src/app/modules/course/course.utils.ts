import {
  ECourseMessage,
  ICourse,
  IDateQueryParams,
  IPriceQueryParams,
  IQueryRangeParams,
} from './course.interface';
import { Course } from './course.model';

const calculateWeek = (
  startDate: string,
  endDate: string,
): number | undefined => {
  const _startDate = new Date(startDate);
  const _endDate = new Date(endDate);

  if (isNaN(_startDate.getTime()) || isNaN(_endDate.getTime())) {
    return undefined;
  } else {
    const timeDifference = Math.abs(_endDate.getTime() - _startDate.getTime());
    const durationInWeeks = Math.ceil(timeDifference / (1000 * 3600 * 24 * 7));

    return durationInWeeks;
  }
};

//dynamically handle date and price range in query parameters
const getCoursesByRange = async (
  params: IQueryRangeParams,
): Promise<ICourse[] | []> => {
  const keys = Object.keys(params);
  const values = Object.values(params);
  const queryConditions: Record<string, any> = {};

  // handle date-range
  if (keys[0] === 'startDate' && keys[1] === 'endDate') {
    queryConditions[`${keys[0]}`] = { $gte: values[0] };
    queryConditions[`${keys[1]}`] = { $lte: values[1] };
  } else {
    if (keys[0] === 'startDate') {
      queryConditions[`${keys[0]}`] = { $gte: values[0] };
    }

    if (keys[0] === 'endDate') {
      queryConditions[`${keys[0]}`] = { $lte: values[0] };
    }
  }

  // handle price-range
  if (keys[0] === 'minPrice' && keys[1] === 'maxPrice') {
    queryConditions.price = {
      $gte: Number(values[0]),
      $lte: Number(values[1]),
    };
  } else {
    if (keys[0] === 'minPrice') {
      queryConditions.price = { $gte: values[0] };
    }

    if (keys[0] === 'maxPrice') {
      queryConditions.price = { $lte: values[0] };
    }
  }

  console.log('---> queryConditions:', queryConditions);

  const query = Course.find(queryConditions)
    .populate({
      path: 'createdBy',
      select: '_id username email role',
    })
    .lean();
  const courses = await query.exec();

  return courses;
};

export const courseUtils = {
  calculateWeek,
  getCoursesByRange,
};
