import { Server } from 'socket.io';

import { AuthenticatedSocket } from '../config/socket';
import { Channel } from '../models/Channel';
import { Message } from '../models/Message';
import { Workspace } from '../models/Workspace';

const onlineUsers = new Map<string, Set<string>>();

const getWorkspaceRoom = (workspaceId: string): string => `workspace:${workspaceId}`;
const getChannelRoom = (channelId: string): string => `channel:${channelId}`;

const addOnlineUser = (workspaceId: string, userId: string): void => {
  if (!onlineUsers.has(workspaceId)) {
    onlineUsers.set(workspaceId, new Set());
  }
  onlineUsers.get(workspaceId)!.add(userId);
};

const removeOnlineUser = (workspaceId: string, userId: string): void => {
  const users = onlineUsers.get(workspaceId);
  if (users) {
    users.delete(userId);
    if (users.size === 0) {
      onlineUsers.delete(workspaceId);
    }
  }
};

const getOnlineUsers = (workspaceId: string): string[] => {
  const users = onlineUsers.get(workspaceId);
  return users ? Array.from(users) : [];
};

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    const userId = user._id.toString();
    const joinedWorkspaces = new Set<string>();

    console.log(`Socket connected: ${user.name} (${userId})`);

    socket.on('join_workspace', async (workspaceId: string) => {
      try {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
          socket.emit('error', { message: 'Workspace not found' });
          return;
        }

        const isMember = workspace.members.some(
          (m) => m.user.toString() === userId,
        );

        if (!isMember) {
          socket.emit('error', { message: 'Not a member of this workspace' });
          return;
        }

        const room = getWorkspaceRoom(workspaceId);
        await socket.join(room);
        joinedWorkspaces.add(workspaceId);

        addOnlineUser(workspaceId, userId);

        io.to(room).emit('user_online', {
          userId,
          name: user.name,
          avatar: user.avatar,
          onlineUsers: getOnlineUsers(workspaceId),
        });

        socket.emit('workspace_joined', {
          workspaceId,
          onlineUsers: getOnlineUsers(workspaceId),
        });
      } catch (error) {
        console.error('join_workspace error:', error);
        socket.emit('error', { message: 'Failed to join workspace' });
      }
    });

    socket.on('join_channel', async (channelId: string) => {
      try {
        const channel = await Channel.findById(channelId);

        if (!channel) {
          socket.emit('error', { message: 'Channel not found' });
          return;
        }

        const room = getChannelRoom(channelId);
        await socket.join(room);

        socket.emit('channel_joined', { channelId });
      } catch (error) {
        console.error('join_channel error:', error);
        socket.emit('error', { message: 'Failed to join channel' });
      }
    });

    socket.on('leave_channel', async (channelId: string) => {
      const room = getChannelRoom(channelId);
      await socket.leave(room);
      socket.emit('channel_left', { channelId });
    });

    socket.on(
      'send_message',
      async (data: { channelId: string; workspaceId: string; content: string }) => {
        try {
          const { channelId, workspaceId, content } = data;

          if (!content || !channelId || !workspaceId) {
            socket.emit('error', { message: 'Missing required fields' });
            return;
          }

          const channel = await Channel.findOne({
            _id: channelId,
            workspace: workspaceId,
          });

          if (!channel) {
            socket.emit('error', { message: 'Channel not found' });
            return;
          }

          const message = await Message.create({
            workspace: workspaceId,
            channel: channelId,
            sender: userId,
            content,
          });

          const populatedMessage = await Message.findById(message._id).populate(
            'sender',
            'name email avatar',
          );

          if (populatedMessage) {
            const channelRoom = getChannelRoom(channelId);
            io.to(channelRoom).emit('receive_message', populatedMessage.toJSON());
          }
        } catch (error) {
          console.error('send_message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      },
    );

    socket.on(
      'typing_start',
      (data: { channelId: string; userName: string }) => {
        const { channelId, userName } = data;
        const room = getChannelRoom(channelId);
        socket.to(room).emit('typing_start', {
          userId,
          userName: userName || user.name,
          channelId,
        });
      },
    );

    socket.on('typing_stop', (data: { channelId: string }) => {
      const { channelId } = data;
      const room = getChannelRoom(channelId);
      socket.to(room).emit('typing_stop', {
        userId,
        channelId,
      });
    });

    socket.on(
      'message_read',
      (data: { channelId: string; messageId: string }) => {
        const { channelId, messageId } = data;
        const room = getChannelRoom(channelId);
        socket.to(room).emit('message_read', {
          userId,
          channelId,
          messageId,
        });
      },
    );

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${user.name} (${userId})`);

      for (const workspaceId of joinedWorkspaces) {
        removeOnlineUser(workspaceId, userId);
        const room = getWorkspaceRoom(workspaceId);
        io.to(room).emit('user_offline', {
          userId,
          name: user.name,
          onlineUsers: getOnlineUsers(workspaceId),
        });
      }

      joinedWorkspaces.clear();
    });
  });
};
