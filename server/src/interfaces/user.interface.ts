import { HydratedDocument, Types } from 'mongoose';

export type UserRole = 'member' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = HydratedDocument<IUser> & {
  _id: Types.ObjectId;
};
