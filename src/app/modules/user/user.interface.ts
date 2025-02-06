import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";


export interface Tuser  {
  id:string;
  password:string;
  needToChangePassword:boolean;
  passwordChangedDate?:Date;
  role:'admin'|'student'|'faculty';
  status:'is-progress'|'blocked'; 
  isDelete:boolean;
}



export interface UserModel extends Model<Tuser> {
  isUserExistsByCustomeId(id:string):Promise<Tuser>;

  isPasswordMatched(plainTextPassword:string , hashPassword:string):Promise<boolean>

  isJWTssuedBeforePasswordChanged(passwordChangedTimeStamp:Date, jwtIssuedTimeStamp:number):boolean 
}

export type TUserRole = keyof typeof USER_ROLE;