import api from './api';
import type { MessageResponse, MessagesResponse } from '../types/message';

export const messageService = {
  getMessages: (workspaceId: string, channelId: string, before?: string) => {
    const params = new URLSearchParams();
    if (before) params.set('before', before);
    const query = params.toString();
    return api.get<MessagesResponse>(
      `/messages/${workspaceId}/${channelId}${query ? `?${query}` : ''}`,
    );
  },

  send: (workspaceId: string, channelId: string, content: string) =>
    api.post<MessageResponse>(`/messages/${workspaceId}`, {
      channelId,
      content,
    }),

  update: (workspaceId: string, messageId: string, content: string) =>
    api.patch<MessageResponse>(`/messages/${workspaceId}/${messageId}`, {
      content,
    }),

  delete: (workspaceId: string, messageId: string) =>
    api.delete(`/messages/${workspaceId}/${messageId}`),
};
