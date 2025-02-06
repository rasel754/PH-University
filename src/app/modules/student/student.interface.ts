import { Model, Types } from 'mongoose';
import { Schema, model, connect } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  password: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  profileImg?: string;
  localGuardian: TLocalGuardian;
  admissionSemester: Types.ObjectId;
  isDeleted: boolean;
  academicDepartment: Types.ObjectId;
  // isActive: 'active' | 'blocked';
};

//for crating static 
export interface StudentModel extends Model<TStudent> {
  isUserExists(id:string): Promise<TStudent| null>;
}

//for crating instance 

// export type studentMethod = {
//   isUserExist(id: string): Promise<TStudent| null>;
// };

// export type studentModel = Model<
//   TStudent,
//   Record<string, never>,
//   studentMethod
// >;
