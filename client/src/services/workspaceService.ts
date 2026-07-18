import api from './api';
import type { WorkspaceResponse, WorkspacesResponse } from '../types/workspace';

export const workspaceService = {
  getAll: () => api.get<WorkspacesResponse>('/workspaces'),

  getById: (id: string) => api.get<WorkspaceResponse>(`/workspaces/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post<WorkspaceResponse>('/workspaces', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<WorkspaceResponse>(`/workspaces/${id}`, data),

  delete: (id: string) => api.delete(`/workspaces/${id}`),

  joinByInvite: (inviteCode: string) =>
    api.post<WorkspaceResponse>('/workspaces/join', { inviteCode }),

  regenerateInvite: (id: string) =>
    api.post<{ success: boolean; inviteCode: string }>(
      `/workspaces/${id}/regenerate-invite`,
    ),

  removeMember: (workspaceId: string, userId: string) =>
    api.delete(`/workspaces/${workspaceId}/members/${userId}`),
};
