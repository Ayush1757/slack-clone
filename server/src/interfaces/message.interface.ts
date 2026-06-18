import { HydratedDocument, Types } from 'mongoose';

export interface IMessage {
  workspace: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IMessageDocument = HydratedDocument<IMessage> & {
  _id: Types.ObjectId;
};
