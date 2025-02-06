import {  model, Schema } from "mongoose";
import { TAcademicSemester} from "./academicSemester.interface";
import { academicSemesterCode, academicSemesterName, months } from "./academicSemester.constent";
import httpStatus from 'http-status';
import AppError from "../../errors/appError";


const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      require: true,
      enum:academicSemesterName,
    },
    year: {
      type: String,
      require: true,
    },
    code: {
      type: String,
      required: true,
      enum:academicSemesterCode
    },
    startDate: {
      type: String,
      enum: months,
      required:true
    },
    endDate: {
      type: String,
      enum: months,
      required:true
    },
   
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save' , async function(next){
  const isSemesterExists = await AcademicSemester.findOne({
    year:this.year,
    name:this.name,
  })
  if(isSemesterExists){
    throw new AppError(httpStatus.NOT_FOUND, 'Semester is already exists');
  }
  next();
})



 export const AcademicSemester = model<TAcademicSemester>(
   'AcademicSemester',
   academicSemesterSchema,
 );