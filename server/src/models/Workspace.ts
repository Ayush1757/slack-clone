import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';

import { IWorkspace } from '../interfaces/workspace.interface';

const workspaceMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
  },
  { _id: false },
);

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [workspaceMemberSchema],
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase(),
    },
  },
  {
    timestamps: true,
  },
);

workspaceSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const json = returnedObject as unknown as {
      _id?: { toString(): string };
      __v?: unknown;
      id?: string;
      [key: string]: unknown;
    };

    if (json._id) {
      json.id = json._id.toString();
    }

    delete json._id;
    delete json.__v;
    return json;
  },
});

export const Workspace = model<IWorkspace>('Workspace', workspaceSchema);

