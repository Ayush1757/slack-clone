import { Schema, model } from 'mongoose';

import { IChannel } from '../interfaces/channel.interface';

const channelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

channelSchema.index({ workspace: 1, name: 1 }, { unique: true });

channelSchema.set('toJSON', {
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

export const Channel = model<IChannel>('Channel', channelSchema);
