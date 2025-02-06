import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  // studentMethod,
  TUserName,
} from './student.interface';
// import { string } from 'joi';
// import validator from 'validator';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'first name is required '],
    trim: true,
    maxlength: [20, 'name can not be more then 20'],

    //  validate:{
    //   validator:function(value:string){
    //     const firstNameStr=value.charAt(0).toUpperCase()+value.slice(1);
    //     return firstNameStr ===value;
    //   },
    //   message:'{VALUE} is not capitalize format'
    //  }
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'last name is required '],
    trim: true,
    // validate:{
    //   validator:(value:string)=>validator.isAlpha(value),
    //   message:'{VALUE} is not valid',
    // }
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true, trim: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});
const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: true, unique: true },
  // password: {
  //   type: String,
  //   required: [true, 'password is required'],
  //   maxlength: [20, 'password can not be more then 20 character'],
  // },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is Required'],
    unique: true,
    ref: 'User',
  },
  name: {
    type: userNameSchema,
    required: true,
  },

  gender: {
    type: String,
    enum: {
      values: ['female', 'male', 'other'],
      // message:"the gender field can only be one of them: 'male' 'female' 'other'"
      //or
      message: '{VALUE} is not valid ',
    },
    required: true,
  },
  dateOfBirth: { type: String },

  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    //  validate:{
    //   validator:(value:string)=>validator.isEmail(value),
    //   message:'{VALUE} is not email format'
    //  }
  },

  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: { type: String, require: true },
  permanentAddress: { type: String, require: true },

  guardian: {
    type: guardianSchema,
    required: true,
  },
  localGuardian: {
    type: localGuardianSchema,
    required: true,
  },
  profileImg: { type: String },

  admissionSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  // isActive: {
  //   type: String,
  //   enum: ['active', 'blocked'],
  //   default: 'active',
  // },
});

//pre save middleware / hook
// studentSchema.pre('save', async function (next) {
//   // console.log(this,'pre hook : we will save data ');

//   const user = this;
//   //hasing password and save into db
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });

// //post save middleware / hook
// studentSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

//creating a custom a static method
// studentSchema.statics.isUserExist = async function (id: string) {
//   const existingUser = await Student.findOne({ id });

//   return existingUser;
// };


studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};



//crating a custom instance method
// studentSchema.methods.isUserExist = async function(id:string){
//     const existingUser = await Student.findOne({id});

//     return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
