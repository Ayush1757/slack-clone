import { HydratedDocument, Types } from 'mongoose';

export interface IWorkspace {
  name: string;
  description: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  inviteCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IWorkspaceDocument = HydratedDocument<IWorkspace> & {
  _id: Types.ObjectId;
};
