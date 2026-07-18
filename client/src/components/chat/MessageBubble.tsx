import { useState } from 'react';
import type { Message } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

const MessageBubble = ({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
}: MessageBubbleProps): JSX.Element => {
  const [copied, setCopied] = useState(false);

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = () => {
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if content looks like a code block
  const isCode = message.content.startsWith('```') || message.content.includes('\nfunction ') || message.content.includes('\nconst ');

  return (
    <div className="group relative flex gap-3.5 px-4 py-2 transition-all hover:bg-slate-900/40">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 font-bold text-white text-xs shadow-glow">
          {message.sender.name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Message Content Container */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-baseline gap-2.5">
          <span className="text-xs font-bold text-white tracking-wide">
            {message.sender.name}
          </span>
          <span className="font-mono text-[10px] text-slate-500">{time}</span>
          {message.editedAt && (
            <span className="font-mono text-[9px] text-slate-500">(edited)</span>
          )}
        </div>

        {isCode ? (
          <div className="mt-1.5 rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-cyan-200">
            <pre className="whitespace-pre-wrap break-words">{message.content.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')}</pre>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-200">
            {message.content}
          </p>
        )}
      </div>

      {/* Action Toolbar on Hover */}
      <div className="absolute right-4 top-2 hidden items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 px-2 py-1 shadow-lg backdrop-blur-md group-hover:flex">
        <button
          onClick={handleCopy}
          className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          title="Copy text"
        >
          {copied ? (
            <span className="font-mono text-[10px] text-emerald-400">Copied!</span>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {isOwnMessage && onEdit && (
          <button
            onClick={() => onEdit(message.id, message.content)}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
            title="Edit message"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        {isOwnMessage && onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
            title="Delete message"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
