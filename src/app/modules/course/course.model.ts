import mongoose, { Schema, model } from 'mongoose';
import { CourseModel, ICourse, IDetails, ITags } from './course.interface';

const TagsSchema = new Schema<ITags>({
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const DetailsSchema = new Schema<IDetails>({
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    instructor: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Category id is required'],
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [TagsSchema],
      _id: false,
      default: []
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    durationInWeeks: {
      type: Number,
    },
    details: {
      type: DetailsSchema,
      required: true,
      _id: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  },
);

courseSchema.statics.isCourseExist = async function (payload: string) {
  // const { ObjectId } = mongoose.Types;
  const isCourseExist = await Course.find({
    title: payload,
  });

  return !isCourseExist?.length ? false : true;
};

courseSchema.statics.isCourseExistById = async function (payload: string) {
  const { ObjectId } = mongoose.Types;
  const isCourseExistById = await Course.find({
    _id: new ObjectId(payload),
  });

  return !isCourseExistById?.length ? false : true;
};

export const Course = model<ICourse, CourseModel>('Course', courseSchema);

/*
// to check object id is valid or not
  approach-1: id.match(/^[0-9a-fA-F]{24}$/)
  approach-1: mongoose.ObjectId.isValid(id)


*/