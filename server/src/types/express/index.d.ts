import { IUserDocument } from '../../interfaces/user.interface';
import { WorkspaceRole, IWorkspaceDocument } from '../../interfaces/workspace.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      workspace?: IWorkspaceDocument;
      memberRole?: WorkspaceRole;
    }
  }
}

export {};

