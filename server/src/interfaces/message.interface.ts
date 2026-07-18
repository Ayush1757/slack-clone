import { HydratedDocument, Types } from 'mongoose';

export interface IMessage {
  workspace: Types.ObjectId;
  channel: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  editedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IMessageDocument = HydratedDocument<IMessage> & {
  _id: Types.ObjectId;
};
