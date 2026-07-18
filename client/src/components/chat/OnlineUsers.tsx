interface OnlineUser {
  userId: string;
  name: string;
  avatar?: string;
}

interface OnlineUsersProps {
  users: OnlineUser[];
  isOpen: boolean;
  onToggle: () => void;
}

const OnlineUsers = ({ users, isOpen, onToggle }: OnlineUsersProps): JSX.Element => {
  return (
    <div
      className={`border-l border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {isOpen && (
        <div className="flex h-full flex-col p-3.5">
          <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-glow" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Connected Nodes ({users.length})
              </span>
            </div>
            <button
              onClick={onToggle}
              className="rounded p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u.userId}
                className="group flex items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 p-2 transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-glow">
                    {u.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-glow" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-bold text-white">{u.name}</p>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                    <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-emerald-400 font-semibold">ONLINE</span>
                    <span>•</span>
                    <span className="truncate">id:{u.userId.slice(-4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
