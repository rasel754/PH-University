import { model, Schema } from "mongoose";
import { Tuser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';


const userSchema = new Schema<Tuser, UserModel>(
  {
    id: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      select:0
    },
    needToChangePassword: {
      type: Boolean,
      default: true,
    },
    passwordChangedDate:{
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['is-progress', 'blocekd'],
      default: 'is-progress',
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);


userSchema.pre('save', async function (next) {
  // console.log(this,'pre hook : we will save data ');

  const user = this;
  
  // console.log(user.password);
  //hasing password and save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//post save middleware / hook
 userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});


userSchema.statics.isUserExistsByCustomeId = async function(id:string){
  return await User.findOne({ id }).select('+password');
}

userSchema.statics.isPasswordMatched = async function(plainTextPassword:string , hashPassword:string){
  return await bcrypt.compare(plainTextPassword, hashPassword);
}



userSchema.statics.isJWTssuedBeforePasswordChanged= function(passwordChangedTimeStamp:Date, jwtIssuedTimeStamp:number){
  const passwordChangeTime = new Date(passwordChangedTimeStamp).getTime()/1000;

  return jwtIssuedTimeStamp < passwordChangeTime;
}


export const User = model<Tuser, UserModel>('user', userSchema);