export interface WorkspaceMember {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  role: 'owner' | 'admin' | 'member';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: WorkspaceMember[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacesResponse {
  success: boolean;
  workspaces: Workspace[];
}

export interface WorkspaceResponse {
  success: boolean;
  workspace: Workspace;
}
