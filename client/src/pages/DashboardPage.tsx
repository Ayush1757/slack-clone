import { useAuth } from '../context/AuthContext';

const DashboardPage = (): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                Authenticated workspace
              </span>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Welcome{user ? `, ${user.name}` : ''}.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Week 1 and Week 2 are now connected through a protected session. The backend profile route
                returns sanitized user data, and this shell is ready for the next collaboration features.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Name', value: user?.name ?? 'Unknown' },
              { label: 'Email', value: user?.email ?? 'Unknown' },
              { label: 'Role', value: user?.role ?? 'member' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-lg font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
