import { Request, Response } from 'express';
import { z } from 'zod';

import { Channel } from '../models/Channel';
import { Message } from '../models/Message';
import { AppError } from '../utils/AppError';

const sendMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  channelId: z.string().min(1),
});

const updateMessageSchema = z.object({
  content: z.string().min(1).max(4000),
});

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  before: z.string().optional(),
});

export const sendMessageInputSchema = sendMessageSchema;
export const updateMessageInputSchema = updateMessageSchema;
export const paginationInputSchema = paginationSchema;

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.workspace) {
    throw new AppError('Authentication required', 401);
  }

  const { content, channelId } = sendMessageSchema.parse(req.body);

  const channel = await Channel.findOne({
    _id: channelId,
    workspace: req.workspace._id,
  });

  if (!channel) {
    throw new AppError('Channel not found in this workspace', 404);
  }

  const message = await Message.create({
    workspace: req.workspace._id,
    channel: channel._id,
    sender: req.user._id,
    content,
  });

  const populatedMessage = await Message.findById(message._id).populate(
    'sender',
    'name email avatar',
  );

  res.status(201).json({
    success: true,
    message: populatedMessage?.toJSON(),
  });
};

export const getChannelMessages = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const { channelId } = req.params;
  const { limit, before } = paginationSchema.parse(req.query);

  const channel = await Channel.findOne({
    _id: channelId,
    workspace: req.workspace._id,
  });

  if (!channel) {
    throw new AppError('Channel not found in this workspace', 404);
  }

  const query: Record<string, unknown> = { channel: channel._id };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .populate('sender', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    messages: messages.reverse().map((msg) => msg.toJSON()),
    hasMore: messages.length === limit,
  });
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { messageId } = req.params;
  const { content } = updateMessageSchema.parse(req.body);

  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new AppError('You can only edit your own messages', 403);
  }

  message.content = content;
  message.editedAt = new Date();
  await message.save();

  const populatedMessage = await Message.findById(message._id).populate(
    'sender',
    'name email avatar',
  );

  res.status(200).json({
    success: true,
    message: populatedMessage?.toJSON(),
  });
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  const isOwner = message.sender.toString() === req.user._id.toString();
  const isAdminOrOwner = req.memberRole === 'owner' || req.memberRole === 'admin';

  if (!isOwner && !isAdminOrOwner) {
    throw new AppError('You do not have permission to delete this message', 403);
  }

  await Message.findByIdAndDelete(messageId);

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
};
