import { Router } from 'express';

import {
  deleteMessage,
  getChannelMessages,
  sendMessage,
  sendMessageInputSchema,
  updateMessage,
  updateMessageInputSchema,
} from '../controllers/messageController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireWorkspaceMember } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const messageRouter = Router();

messageRouter.use(requireAuth);

messageRouter.post(
  '/:workspaceId',
  requireWorkspaceMember(),
  validateRequest(sendMessageInputSchema),
  asyncHandler(sendMessage),
);

messageRouter.get(
  '/:workspaceId/:channelId',
  requireWorkspaceMember(),
  asyncHandler(getChannelMessages),
);

messageRouter.patch(
  '/:workspaceId/:messageId',
  requireWorkspaceMember(),
  validateRequest(updateMessageInputSchema),
  asyncHandler(updateMessage),
);

messageRouter.delete(
  '/:workspaceId/:messageId',
  requireWorkspaceMember(),
  asyncHandler(deleteMessage),
);

export default messageRouter;
