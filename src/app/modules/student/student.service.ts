import mongoose, { Query, skipMiddlewareFunction } from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/queryBuilders';
import { studentSearcheAbleFiled } from './student.constant';

// const createStudentIntoDB = async (studentData: TStudent) => {

//   if(await Student.isUserExists(studentData.id)){
//     throw new Error('User already exist');
//    }

//    const result = await Student.create(studentData);//build in static method

//   // const student = new Student(studentData); // create an  instance

//   // if(await student.isUserExist(studentData.id)){
//   //   throw new Error('User already exist');
//   // }

//   // const result = await student.save(); //build in instance method

//   return result;
// };

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  /*
  const queryObj= {...query};



  const studentSearcheAbleFiled = ['email', 'name.firstName', 'presentAddress']
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

const searchQuery = Student.find({
    $or: studentSearcheAbleFiled.map((filed) => ({
      [filed]: { $regex: searchTerm, $options: 'i' },
    })),
  })


  //filtering
  const excludeFilde = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFilde.forEach(el => delete queryObj[el])
  console.log('ex',{query} ,'exOb', {queryObj})

  // console.log(query , 'and ' ,queryObj);


  const filterQuery =  searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });


    let sort ='-createdAt';
    if (query.sort){
      sort = query.sort as string;

    } 
    const sortQuery =  filterQuery.sort(sort);

    let page = 1;
    let limit = 1;
    let skip = 0;

     if (query.limit) {
       limit = Number(query.limit);
     }

    if(query.page){
      page = Number(query.page)
      page = (page - 1)*limit;
    }
   
    const paginateQuery = sortQuery.skip(skip);

    const limitQuery = await paginateQuery.limit(limit);

    //fields limiting
    /*let fields = '-__v';

    if (query.fields) {
      fields = (query.fields as string).split(',').join(' ');
      console.log('snk',{fields});
    }


    const fieldsQuery = await limitQuery.select(fields)
    
     return limitQuery;
    */

  const studentsQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearcheAbleFiled)
    .filter()
    .sort()
    .paginate(); //.fields();

  const result = await studentsQuery.modelQuery;
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentInDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id , modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delted student ');
    }

    // get user _id from deletedStudent
    const userId = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delted user ');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

// const deleteStudentFromDB = async (id: string) => {
//   const result = await Student.updateOne({ id }, { isDeleted: true });
//   return result;
// };

export const studentServices = {
  // createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentInDB,
};

////////////////////////////////////////////////////////////////////////////////////////
