import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { z } from 'zod';

import { Channel } from '../models/Channel';
import { Message } from '../models/Message';
import { Workspace } from '../models/Workspace';
import { AppError } from '../utils/AppError';

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional().default(''),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(500).optional(),
});

const joinByInviteSchema = z.object({
  inviteCode: z.string().min(1),
});

export const createWorkspaceInputSchema = createWorkspaceSchema;
export const updateWorkspaceInputSchema = updateWorkspaceSchema;
export const joinByInviteInputSchema = joinByInviteSchema;

export const createWorkspace = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { name, description } = createWorkspaceSchema.parse(req.body);

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  await Channel.create({
    name: 'general',
    description: 'General discussion',
    workspace: workspace._id,
    members: [req.user._id],
    isDefault: true,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    workspace: workspace.toJSON(),
  });
};

export const getUserWorkspaces = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const workspaces = await Workspace.find({
    'members.user': req.user._id,
  })
    .populate('members.user', 'name email avatar')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    workspaces: workspaces.map((ws) => ws.toJSON()),
  });
};

export const getWorkspaceById = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const workspace = await Workspace.findById(req.workspace._id).populate(
    'members.user',
    'name email avatar',
  );

  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  res.status(200).json({
    success: true,
    workspace: workspace.toJSON(),
  });
};

export const updateWorkspace = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const updates = updateWorkspaceSchema.parse(req.body);

  const workspace = await Workspace.findByIdAndUpdate(req.workspace._id, updates, {
    new: true,
    runValidators: true,
  }).populate('members.user', 'name email avatar');

  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  res.status(200).json({
    success: true,
    workspace: workspace.toJSON(),
  });
};

export const deleteWorkspace = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const channels = await Channel.find({ workspace: req.workspace._id });
  const channelIds = channels.map((ch) => ch._id);

  await Message.deleteMany({ channel: { $in: channelIds } });
  await Channel.deleteMany({ workspace: req.workspace._id });
  await Workspace.findByIdAndDelete(req.workspace._id);

  res.status(200).json({
    success: true,
    message: 'Workspace deleted successfully',
  });
};

export const joinByInviteCode = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { inviteCode } = joinByInviteSchema.parse(req.body);

  const workspace = await Workspace.findOne({ inviteCode });

  if (!workspace) {
    throw new AppError('Invalid invite code', 404);
  }

  const alreadyMember = workspace.members.some(
    (m) => m.user.toString() === req.user!._id.toString(),
  );

  if (alreadyMember) {
    throw new AppError('You are already a member of this workspace', 400);
  }

  workspace.members.push({ user: req.user._id, role: 'member' });
  await workspace.save();

  const defaultChannel = await Channel.findOne({
    workspace: workspace._id,
    isDefault: true,
  });

  if (defaultChannel) {
    defaultChannel.members.push(req.user._id);
    await defaultChannel.save();
  }

  const populatedWorkspace = await Workspace.findById(workspace._id).populate(
    'members.user',
    'name email avatar',
  );

  res.status(200).json({
    success: true,
    workspace: populatedWorkspace?.toJSON(),
  });
};

export const regenerateInviteCode = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const newCode = randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();

  const workspace = await Workspace.findByIdAndUpdate(
    req.workspace._id,
    { inviteCode: newCode },
    { new: true },
  );

  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  res.status(200).json({
    success: true,
    inviteCode: workspace.inviteCode,
  });
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
  if (!req.workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const { userId } = req.params;

  if (req.workspace.owner.toString() === userId) {
    throw new AppError('Cannot remove the workspace owner', 400);
  }

  const memberIndex = req.workspace.members.findIndex(
    (m) => m.user.toString() === userId,
  );

  if (memberIndex === -1) {
    throw new AppError('User is not a member of this workspace', 404);
  }

  req.workspace.members.splice(memberIndex, 1);
  await req.workspace.save();

  await Channel.updateMany(
    { workspace: req.workspace._id },
    { $pull: { members: userId } },
  );

  res.status(200).json({
    success: true,
    message: 'Member removed successfully',
  });
};
