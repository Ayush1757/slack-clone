import { Router } from 'express';

import {
  createWorkspace,
  createWorkspaceInputSchema,
  deleteWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  joinByInviteCode,
  joinByInviteInputSchema,
  regenerateInviteCode,
  removeMember,
  updateWorkspace,
  updateWorkspaceInputSchema,
} from '../controllers/workspaceController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireWorkspaceMember } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const workspaceRouter = Router();

workspaceRouter.use(requireAuth);

workspaceRouter.post(
  '/',
  validateRequest(createWorkspaceInputSchema),
  asyncHandler(createWorkspace),
);

workspaceRouter.get('/', asyncHandler(getUserWorkspaces));

workspaceRouter.post(
  '/join',
  validateRequest(joinByInviteInputSchema),
  asyncHandler(joinByInviteCode),
);

workspaceRouter.get(
  '/:workspaceId',
  requireWorkspaceMember(),
  asyncHandler(getWorkspaceById),
);

workspaceRouter.patch(
  '/:workspaceId',
  requireWorkspaceMember('owner', 'admin'),
  validateRequest(updateWorkspaceInputSchema),
  asyncHandler(updateWorkspace),
);

workspaceRouter.delete(
  '/:workspaceId',
  requireWorkspaceMember('owner'),
  asyncHandler(deleteWorkspace),
);

workspaceRouter.post(
  '/:workspaceId/regenerate-invite',
  requireWorkspaceMember('owner', 'admin'),
  asyncHandler(regenerateInviteCode),
);

workspaceRouter.delete(
  '/:workspaceId/members/:userId',
  requireWorkspaceMember('owner', 'admin'),
  asyncHandler(removeMember),
);

export default workspaceRouter;
