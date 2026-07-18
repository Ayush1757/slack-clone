import { useEffect, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import Modal, { useModal } from '../ui/Modal';

const Sidebar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const {
    workspaces,
    activeWorkspace,
    channels,
    activeChannel,
    fetchWorkspaces,
    setActiveWorkspace,
    fetchChannels,
    setActiveChannel,
    createWorkspace,
    joinWorkspace,
    createChannel,
  } = useWorkspace();

  const createWsModal = useModal();
  const joinWsModal = useModal();
  const createChModal = useModal();

  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [chName, setChName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  useEffect(() => {
    void fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (activeWorkspace) {
      void fetchChannels(activeWorkspace.id);
    }
  }, [activeWorkspace, fetchChannels]);

  const handleCreateWorkspace = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      const ws = await createWorkspace(wsName, wsDesc);
      setActiveWorkspace(ws);
      setWsName('');
      setWsDesc('');
      createWsModal.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
    }
  };

  const handleJoinWorkspace = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      const ws = await joinWorkspace(inviteCode);
      setActiveWorkspace(ws);
      setInviteCode('');
      joinWsModal.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid invite code');
    }
  };

  const handleCreateChannel = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      const ch = await createChannel(chName);
      setActiveChannel(ch);
      setChName('');
      createChModal.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create channel');
    }
  };

  const handleCopyInviteCode = () => {
    if (activeWorkspace?.inviteCode) {
      void navigator.clipboard.writeText(activeWorkspace.inviteCode);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  return (
    <>
      <aside
        className={`relative flex flex-col border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-72'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800/80 px-4">
          {!collapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 font-bold text-white shadow-glow">
                {activeWorkspace?.name?.[0]?.toUpperCase() || 'D'}
              </div>
              <div className="overflow-hidden">
                <h2 className="truncate text-sm font-bold tracking-tight text-white">
                  {activeWorkspace?.name || 'DevWorkspace'}
                </h2>
                <p className="truncate font-mono text-[10px] text-cyan-400/80">
                  ID: {activeWorkspace?.id?.slice(-6) || 'standalone'}
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-white shadow-glow">
              {activeWorkspace?.name?.[0]?.toUpperCase() || 'D'}
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Workspaces List Section */}
        {!collapsed && (
          <div className="border-b border-slate-800/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Workspaces ({workspaces.length})
              </span>
            </div>
            <div className="max-h-36 space-y-1 overflow-y-auto pr-1">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setActiveChannel(null);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-all ${
                    activeWorkspace?.id === ws.id
                      ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 shadow-glow font-medium'
                      : 'border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 font-mono text-[11px] font-bold text-slate-200 group-hover:bg-slate-700">
                      {ws.name[0]?.toUpperCase()}
                    </span>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {activeWorkspace?.id === ws.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glow" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex gap-2">
              <button
                onClick={createWsModal.open}
                className="flex-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                + New Workspace
              </button>
              <button
                onClick={joinWsModal.open}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                + Join Code
              </button>
            </div>
          </div>
        )}

        {/* Invite Code Pill if Workspace Active */}
        {!collapsed && activeWorkspace?.inviteCode && (
          <div className="border-b border-slate-800/80 bg-slate-900/40 px-3 py-2">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5">
              <div className="overflow-hidden">
                <span className="block text-[9px] font-mono font-semibold text-slate-500">INVITE CODE</span>
                <span className="font-mono text-xs font-bold text-cyan-300">{activeWorkspace.inviteCode}</span>
              </div>
              <button
                onClick={handleCopyInviteCode}
                className="rounded bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                {copiedInvite ? 'Copied! ✨' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Channels Section */}
        {!collapsed && activeWorkspace && (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Channels
              </span>
              <button
                onClick={createChModal.open}
                className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                <span>+</span> Channel
              </button>
            </div>

            <div className="space-y-1">
              {channels.map((ch) => {
                const isActive = activeChannel?.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-all ${
                      isActive
                        ? 'border border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 text-white font-medium shadow-sm'
                        : 'border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`font-mono text-sm ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        #
                      </span>
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {ch.isDefault && (
                      <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-500">
                        default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* User Card Footer */}
        <div className="border-t border-slate-800/80 bg-slate-950/90 p-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-glow">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
            </div>

            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-bold text-white">{user?.name}</p>
                <p className="truncate font-mono text-[10px] text-slate-400">{user?.email}</p>
              </div>
            )}

            {!collapsed && (
              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                title="Sign out"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Modals */}
      <Modal isOpen={createWsModal.isOpen} onClose={createWsModal.close} title="Create Dev Workspace">
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <label className="block space-y-1.5 text-xs text-slate-300">
            <span>Workspace Name</span>
            <input
              type="text"
              placeholder="e.g. Acme Engineering"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/50"
              required
            />
          </label>
          <label className="block space-y-1.5 text-xs text-slate-300">
            <span>Description</span>
            <input
              type="text"
              placeholder="Primary development & architecture workspace"
              value={wsDesc}
              onChange={(e) => setWsDesc(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/50"
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 shadow-glow transition hover:brightness-110"
          >
            Create Workspace
          </button>
        </form>
      </Modal>

      <Modal isOpen={joinWsModal.isOpen} onClose={joinWsModal.close} title="Join Workspace via Invite">
        <form onSubmit={handleJoinWorkspace} className="space-y-4">
          <label className="block space-y-1.5 text-xs text-slate-300">
            <span>Invite Code</span>
            <input
              type="text"
              placeholder="Enter 10-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full font-mono rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-cyan-300 outline-none transition focus:border-cyan-500/50 uppercase"
              required
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 py-2.5 text-xs font-bold text-slate-950 shadow-glow transition hover:brightness-110"
          >
            Join Workspace
          </button>
        </form>
      </Modal>

      <Modal isOpen={createChModal.isOpen} onClose={createChModal.close} title="Create Channel">
        <form onSubmit={handleCreateChannel} className="space-y-4">
          <label className="block space-y-1.5 text-xs text-slate-300">
            <span>Channel Name</span>
            <input
              type="text"
              placeholder="e.g. backend-dev"
              value={chName}
              onChange={(e) => setChName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/50"
              required
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-2.5 text-xs font-bold text-slate-950 shadow-glow transition hover:brightness-110"
          >
            Create Channel
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Sidebar;
