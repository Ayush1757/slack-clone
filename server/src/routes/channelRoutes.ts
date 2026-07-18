import { Router } from 'express';

import {
  createChannel,
  createChannelInputSchema,
  deleteChannel,
  getChannelById,
  getWorkspaceChannels,
} from '../controllers/channelController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireWorkspaceMember } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const channelRouter = Router();

channelRouter.use(requireAuth);

channelRouter.post(
  '/:workspaceId',
  requireWorkspaceMember(),
  validateRequest(createChannelInputSchema),
  asyncHandler(createChannel),
);

channelRouter.get(
  '/:workspaceId',
  requireWorkspaceMember(),
  asyncHandler(getWorkspaceChannels),
);

channelRouter.get(
  '/:workspaceId/:channelId',
  requireWorkspaceMember(),
  asyncHandler(getChannelById),
);

channelRouter.delete(
  '/:workspaceId/:channelId',
  requireWorkspaceMember('owner', 'admin'),
  asyncHandler(deleteChannel),
);

export default channelRouter;
