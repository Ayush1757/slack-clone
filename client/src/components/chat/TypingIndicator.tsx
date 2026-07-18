interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator = ({ typingUsers }: TypingIndicatorProps): JSX.Element | null => {
  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
        : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 border-t border-slate-800/40 bg-slate-950/40 px-4 py-1.5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <span className="h-2 w-0.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
        <span className="h-3.5 w-0.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
        <span className="h-2 w-0.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
      </div>
      <span className="font-mono text-[11px] font-medium text-cyan-300/90">{text}...</span>
    </div>
  );
};

export default TypingIndicator;
