import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

import { IUser, IUserDocument, UserRole } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function hashPassword(this: IUserDocument, next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const json = returnedObject as unknown as {
      _id?: { toString(): string };
      __v?: unknown;
      id?: string;
      password?: string;
      [key: string]: unknown;
    };

    if (json._id) {
      json.id = json._id.toString();
    }

    delete json._id;
    delete json.password;
    delete json.__v;
    return json;
  },
});

export const User = model<IUser>('User', userSchema);

export const userRoles: UserRole[] = ['member', 'admin'];
