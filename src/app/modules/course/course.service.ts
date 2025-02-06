import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilders';
import { courseSearchAbleFileds } from './course.constant';
import { TCourse, TCourseFaculties } from './course.interface';
import { Course, courseFaculties } from './course.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchAbleFileds)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;

  return result;
};

const getSingleFromDb = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDb = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //step 1: basic course info update
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to update courses');
    }

    //check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletePrerequisitesCoourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePrerequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletePrerequisitesCoourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update courses');
      }

      //filter out the new courses fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!newPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update courses');
      }
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'failed to update courses');
  }
};

const assignFacultiesWithCourseIntoDb = async (
  id: string,
  payload: Partial<TCourseFaculties>,
) => {
  const result = await courseFaculties.findByIdAndUpdate(
    id,
    {
      course:id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  );

  return result;
};


const removeFacultiesWithCourseFromDb = async (
  id: string,
  payload: Partial<TCourseFaculties>,
) => {
  const result = await courseFaculties.findByIdAndUpdate(
    id,
    {
      $pull: { faculties :{$in: payload}},
    },
    { upsert: true, new: true },
  );

  return result;
};

export const courseService = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleFromDb,
  deleteCourseFromDb,
  updateCourseIntoDb,
  assignFacultiesWithCourseIntoDb,
  removeFacultiesWithCourseFromDb,
};
