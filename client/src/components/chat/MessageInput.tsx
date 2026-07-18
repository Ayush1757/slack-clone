import { useState, useRef, type FormEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  channelName?: string;
  disabled?: boolean;
}

const QUICK_EMOJIS = ['🚀', '⚡', '🔥', '✨', '👍', '💻', '🎉'];

const MessageInput = ({
  onSend,
  onTypingStart,
  onTypingStop,
  channelName,
  disabled,
}: MessageInputProps): JSX.Element => {
  const [content, setContent] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const handleTyping = (): void => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop?.();
    }, 2000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    const finalContent = isCodeMode ? `\`\`\`\n${trimmed}\n\`\`\`` : trimmed;
    onSend(finalContent);
    setContent('');
    setIsCodeMode(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    onTypingStop?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-800/80 bg-slate-950/80 p-3 backdrop-blur-xl">
      <div className={`rounded-2xl border transition-all ${isCodeMode ? 'border-cyan-500/50 bg-slate-950 shadow-glow' : 'border-slate-800 bg-slate-900/60 focus-within:border-cyan-500/40 focus-within:bg-slate-900'}`}>
        {/* Quick Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800/60 px-3 py-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCodeMode(!isCodeMode)}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition ${
                isCodeMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              title="Toggle code snippet mode"
            >
              <span>{`</>`}</span>
              <span>{isCodeMode ? 'Code Mode' : 'Code'}</span>
            </button>

            <span className="h-3 w-px bg-slate-800" />

            <div className="flex items-center gap-0.5">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="rounded p-1 text-xs transition hover:bg-slate-800 hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden font-mono text-[10px] text-slate-500 sm:block">
            <span>Enter to send • Shift+Enter for newline</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex items-end gap-2 px-3 py-2">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={channelName ? `Message #${channelName}...` : 'Type a message...'}
            rows={isCodeMode ? 3 : 1}
            disabled={disabled}
            className={`max-h-36 flex-1 resize-none bg-transparent text-xs text-white outline-none placeholder:text-slate-500 disabled:opacity-50 ${isCodeMode ? 'font-mono text-cyan-200' : 'font-sans'}`}
          />
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 font-bold text-slate-950 shadow-glow transition hover:brightness-110 disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
