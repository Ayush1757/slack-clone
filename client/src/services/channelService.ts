import api from './api';
import type { ChannelResponse, ChannelsResponse } from '../types/channel';

export const channelService = {
  getAll: (workspaceId: string) =>
    api.get<ChannelsResponse>(`/channels/${workspaceId}`),

  getById: (workspaceId: string, channelId: string) =>
    api.get<ChannelResponse>(`/channels/${workspaceId}/${channelId}`),

  create: (workspaceId: string, data: { name: string; description?: string }) =>
    api.post<ChannelResponse>(`/channels/${workspaceId}`, data),

  delete: (workspaceId: string, channelId: string) =>
    api.delete(`/channels/${workspaceId}/${channelId}`),
};
