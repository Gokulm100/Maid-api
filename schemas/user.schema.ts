import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}
export enum Usertype {
  Admin = 'Admin',
  Maid = 'Maid',
  Customer = 'Customer',
}
@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;


  @Prop({ required: true,unique:true })
  email: string;
  
  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: () => new Date() })
  updatedAt: Date;

  @Prop({ required: true, enum: Usertype })
  userType: Usertype;

  @Prop({ required: true})
  password:String
}


export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ name: 1 }, { unique: true });
