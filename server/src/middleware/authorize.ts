import { NextFunction, Request, Response } from 'express';

import { WorkspaceRole } from '../interfaces/workspace.interface';
import { Workspace } from '../models/Workspace';
import { AppError } from '../utils/AppError';

export const requireWorkspaceMember =
  (...allowedRoles: WorkspaceRole[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(new AppError('Authentication required', 401));
        return;
      }

      const workspaceId = req.params.workspaceId ?? req.body?.workspace;

      if (!workspaceId) {
        next(new AppError('Workspace ID is required', 400));
        return;
      }

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        next(new AppError('Workspace not found', 404));
        return;
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user!._id.toString(),
      );

      if (!member) {
        next(new AppError('You are not a member of this workspace', 403));
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
        next(new AppError('You do not have permission to perform this action', 403));
        return;
      }

      req.workspace = workspace;
      req.memberRole = member.role;
      next();
    } catch {
      next(new AppError('Authorization check failed', 500));
    }
  };
