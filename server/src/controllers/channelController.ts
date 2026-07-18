import { Request, Response } from 'express';
import { z } from 'zod';

import { Channel } from '../models/Channel';
import { Message } from '../models/Message';
import { AppError } from '../utils/AppError';

const createChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(80)
    .transform((val) => val.toLowerCase().replace(/\s+/g, '-')),
  description: z.string().max(500).optional().default(''),
});

export const createChannelInputSchema = createChannelSchema;

export const createChannel = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.workspace) {
    throw new AppError('Authentication required', 401);
  }

  const { name, description } = createChannelSchema.parse(req.body);

  const existingChannel = await Channel.findOne({
    workspace: req.workspace._id,
    name,
  });

  if (existingChannel) {
    throw new AppError('A channel with this name already exists in the workspace', 409);
  }

  const memberIds = req.workspace.members.map((m) => m.user);

  const channel = await Channel.create({
    name,
    description,
    workspace: req.workspace._id,
    members: memberIds,
    isDefault: false,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    channel: channel.toJSON(),
  });
};

export const getWorkspaceChannels = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const channels = await Channel.find({
    workspace: req.workspace._id,
  }).sort({ isDefault: -1, name: 1 });

  res.status(200).json({
    success: true,
    channels: channels.map((ch) => ch.toJSON()),
  });
};

export const getChannelById = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const channel = await Channel.findOne({
    _id: req.params.channelId,
    workspace: req.workspace._id,
  }).populate('members', 'name email avatar');

  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  res.status(200).json({
    success: true,
    channel: channel.toJSON(),
  });
};

export const deleteChannel = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const channel = await Channel.findOne({
    _id: req.params.channelId,
    workspace: req.workspace._id,
  });

  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  if (channel.isDefault) {
    throw new AppError('Cannot delete the default channel', 400);
  }

  await Message.deleteMany({ channel: channel._id });
  await Channel.findByIdAndDelete(channel._id);

  res.status(200).json({
    success: true,
    message: 'Channel deleted successfully',
  });
};
