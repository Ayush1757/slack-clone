import { HydratedDocument, Types } from 'mongoose';

export type WorkspaceRole = 'owner' | 'admin' | 'member';

export interface IWorkspaceMember {
  user: Types.ObjectId;
  role: WorkspaceRole;
}

export interface IWorkspace {
  name: string;
  description: string;
  owner: Types.ObjectId;
  members: IWorkspaceMember[];
  inviteCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IWorkspaceDocument = HydratedDocument<IWorkspace> & {
  _id: Types.ObjectId;
};
