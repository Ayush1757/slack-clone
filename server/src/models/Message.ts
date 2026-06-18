import { Schema, model } from 'mongoose';

import { IMessage } from '../interfaces/message.interface';

const messageSchema = new Schema<IMessage>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.set('toJSON', {
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

export const Message = model<IMessage>('Message', messageSchema);
