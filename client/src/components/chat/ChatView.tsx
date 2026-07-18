import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { messageService } from '../../services/messageService';
import type { Message } from '../../types/message';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import TypingIndicator from './TypingIndicator';

interface OnlineUser {
  userId: string;
  name: string;
  avatar?: string;
}

const ChatView = (): JSX.Element => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { activeWorkspace, activeChannel } = useWorkspace();

  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showOnline, setShowOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async (): Promise<void> => {
    if (!activeWorkspace || !activeChannel) return;

    setLoading(true);
    try {
      const { data } = await messageService.getMessages(
        activeWorkspace.id,
        activeChannel.id,
      );
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace, activeChannel]);

  useEffect(() => {
    void loadMessages();
    setTypingUsers([]);
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !activeWorkspace) return;

    socket.emit('join_workspace', activeWorkspace.id);

    const handleOnline = (data: { onlineUsers: string[]; userId: string; name: string; avatar?: string }) => {
      setOnlineUsers((prev) => {
        const exists = prev.some((u) => u.userId === data.userId);
        if (exists) return prev;
        return [...prev, { userId: data.userId, name: data.name, avatar: data.avatar }];
      });
    };

    const handleOffline = (data: { userId: string; onlineUsers: string[] }) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on('user_online', handleOnline);
    socket.on('user_offline', handleOffline);

    return () => {
      socket.off('user_online', handleOnline);
      socket.off('user_offline', handleOffline);
    };
  }, [socket, activeWorkspace]);

  useEffect(() => {
    if (!socket || !activeChannel) return;

    socket.emit('join_channel', activeChannel.id);

    const handleReceiveMessage = (message: Message) => {
      if (message.channel === activeChannel.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTypingStart = (data: { userId: string; userName: string; channelId: string }) => {
      if (data.channelId === activeChannel.id && data.userId !== user?.id) {
        setTypingUsers((prev) => {
          if (prev.includes(data.userName)) return prev;
          return [...prev, data.userName];
        });

        const existing = typingTimeoutsRef.current.get(data.userId);
        if (existing) clearTimeout(existing);

        typingTimeoutsRef.current.set(
          data.userId,
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((n) => n !== data.userName));
            typingTimeoutsRef.current.delete(data.userId);
          }, 3000),
        );
      }
    };

    const handleTypingStop = (data: { userId: string; channelId: string }) => {
      if (data.channelId === activeChannel.id) {
        const timeout = typingTimeoutsRef.current.get(data.userId);
        if (timeout) {
          clearTimeout(timeout);
          typingTimeoutsRef.current.delete(data.userId);
        }
        setTypingUsers((prev) => prev.filter((_, i) => i !== 0));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.emit('leave_channel', activeChannel.id);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, activeChannel, user?.id]);

  const handleSendMessage = (content: string): void => {
    if (!socket || !activeWorkspace || !activeChannel) return;

    socket.emit('send_message', {
      channelId: activeChannel.id,
      workspaceId: activeWorkspace.id,
      content,
    });
  };

  const handleTypingStart = (): void => {
    if (!socket || !activeChannel) return;
    socket.emit('typing_start', {
      channelId: activeChannel.id,
      userName: user?.name || 'Someone',
    });
  };

  const handleTypingStop = (): void => {
    if (!socket || !activeChannel) return;
    socket.emit('typing_stop', { channelId: activeChannel.id });
  };

  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    if (!activeWorkspace) return;
    try {
      await messageService.delete(activeWorkspace.id, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleEditMessage = async (messageId: string, content: string): Promise<void> => {
    if (!activeWorkspace) return;
    const newContent = prompt('Edit message:', content);
    if (!newContent || newContent === content) return;

    try {
      const { data } = await messageService.update(activeWorkspace.id, messageId, newContent);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? data.message : m)),
      );
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-600/20 border border-cyan-500/30 shadow-glow">
            <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            DevWorkspace Hub
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Select an active development workspace from the sidebar or initialize a new project space to collaborate in real-time.
          </p>
        </div>
      </div>
    );
  }

  if (!activeChannel) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-cyan-400">
            <span className="font-mono text-xl font-bold">#</span>
          </div>
          <h2 className="text-xl font-bold text-white">{activeWorkspace.name}</h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Select a channel from the left menu to start stream messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Technical Channel Top Bar */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 font-mono text-sm font-bold text-cyan-400">
              #
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-white">
                  {activeChannel.name}
                </h3>
                <span className="rounded border border-slate-800 bg-slate-900/80 px-1.5 py-0.2 font-mono text-[9px] text-slate-500">
                  channel:{activeChannel.id.slice(-6)}
                </span>
              </div>
              {activeChannel.description && (
                <p className="truncate text-[11px] text-slate-400">{activeChannel.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 font-mono text-[10px] text-slate-500 sm:flex">
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-400">
                {messages.length} messages
              </span>
            </div>

            <button
              onClick={() => setShowOnline(!showOnline)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                showOnline
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-glow'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Online ({onlineUsers.length})</span>
            </button>
          </div>
        </div>

        {/* Message History Feed */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-3 shadow-glow">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <span className="font-mono text-xs text-slate-300">Fetching channel message stream...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-glow">
                  <span className="font-mono text-lg font-bold">#</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Welcome to #{activeChannel.name}!
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  This channel was created on {new Date(activeChannel.createdAt || Date.now()).toLocaleDateString()}. Start the conversation below.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-3">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwnMessage={msg.sender.id === user?.id}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <TypingIndicator typingUsers={typingUsers} />

        <MessageInput
          onSend={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          channelName={activeChannel.name}
        />
      </div>

      <OnlineUsers
        users={onlineUsers}
        isOpen={showOnline}
        onToggle={() => setShowOnline(false)}
      />
    </div>
  );
};

export default ChatView;
