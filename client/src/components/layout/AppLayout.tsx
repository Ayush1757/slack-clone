import type { ReactNode } from 'react';

import { useSocket } from '../../context/SocketContext';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const { isConnected } = useSocket();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Background Gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="relative flex h-full w-full flex-col overflow-hidden bg-tech-grid">
        {/* Technical Top System Telemetry Bar */}
        <header className="flex h-9 flex-shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isConnected ? 'bg-emerald-400 opacity-75' : 'bg-rose-400 opacity-75'}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>
              <span className="font-mono font-medium tracking-wide text-slate-300">
                {isConnected ? 'WS_CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <span className="h-3 w-px bg-slate-800" />

            <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex font-mono">
              <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-cyan-400">node-1@cluster</span>
              <span className="text-slate-500">•</span>
              <span>12ms ping</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 text-[10px] font-mono sm:flex">
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300 font-semibold">
                React 19
              </span>
              <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-purple-300 font-semibold">
                Socket.IO
              </span>
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300 font-semibold">
                Redis Pub/Sub
              </span>
            </div>

            <span className="hidden h-3 w-px bg-slate-800 sm:block" />

            <button className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-400 transition hover:border-slate-700 hover:text-slate-200">
              <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Quick Search</span>
              <kbd className="rounded bg-slate-800 px-1 text-[9px] font-mono text-slate-400">Ctrl+K</kbd>
            </button>
          </div>
        </header>

        {/* Main Workspace Area (Sidebar + Chat) */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-950/60 backdrop-blur-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
