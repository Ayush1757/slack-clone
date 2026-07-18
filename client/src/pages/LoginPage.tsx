import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LoginPage = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Login failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 bg-tech-grid">
      {/* Glow Backdrops */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex items-center px-6 py-12 lg:px-16">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-glow" />
              <span>Real-Time Developer Collaboration Platform</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Engineered for High-Velocity Teams.
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                Experience sub-20ms WebSocket messaging, Redis Pub/Sub room scaling, and granular workspace access control in one unified dev portal.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Socket.IO Architecture', detail: 'Real-Time Bi-Directional Stream' },
                { label: 'Redis Pub/Sub Layer', detail: 'Multi-Node Cluster Scaling' },
                { label: 'Strict TypeScript', detail: 'Type-Safe End-to-End Contracts' },
                { label: 'Dockerized Stack', detail: 'Production Containerized Deploy' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 shadow-glass backdrop-blur transition hover:border-cyan-500/30 hover:bg-slate-900/80"
                >
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300">{feature.label}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-glow-lg backdrop-blur-2xl"
          >
            <div className="mb-8 space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to DevWorkspace</h2>
              <p className="text-xs text-slate-400">Enter your credentials to access active workspace channels.</p>
            </div>

            <div className="space-y-4">
              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-900"
                  placeholder="developer@acme.io"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-900"
                  placeholder="••••••••••••"
                  required
                />
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-4 py-3.5 font-bold text-slate-950 shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Workspace ↵'}
            </button>

            <p className="mt-6 text-center text-xs text-slate-400">
              Need a workspace account?{' '}
              <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                Register New Developer Account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
