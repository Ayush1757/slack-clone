import { HydratedDocument, Types } from 'mongoose';

export interface IChannel {
  name: string;
  description: string;
  workspace: Types.ObjectId;
  members: Types.ObjectId[];
  isDefault: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IChannelDocument = HydratedDocument<IChannel> & {
  _id: Types.ObjectId;
};
