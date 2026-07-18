import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const RegisterPage = (): JSX.Element => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register(name, email, password);
      navigate('/app', { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 bg-tech-grid">
      {/* Glow Backdrops */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-glow-lg backdrop-blur-2xl"
          >
            <div className="mb-8 space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-white">Create Developer Profile</h2>
              <p className="text-xs text-slate-400">Initialize your access identity across workspace nodes.</p>
            </div>

            <div className="space-y-4">
              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900"
                  placeholder="Jane Developer"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900"
                  placeholder="jane@company.io"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900"
                  placeholder="Minimum 8 characters"
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
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 px-4 py-3.5 font-bold text-slate-950 shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Initializing Account...' : 'Create Account & Continue ↵'}
            </button>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
                Sign In Instead
              </Link>
            </p>
          </form>
        </section>

        <section className="hidden items-center px-6 py-12 lg:flex lg:px-16">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-glow" />
              <span>Instant Onboarding Pipeline</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ready for Production Collaboration.
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                Join or launch custom workspaces with built-in channels, real-time presence indicators, and seamless channel management.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'JWT Protected Routes', detail: 'Secure bearer token authorization' },
                { label: 'Role-Based Access Control', detail: 'Owner, Admin & Member roles' },
                { label: 'Channel & DM Rooms', detail: 'Instant Socket room isolation' },
                { label: 'Typing Waveform', detail: 'Sub-second active typing feedback' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 shadow-glass backdrop-blur transition hover:border-emerald-500/30 hover:bg-slate-900/80"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">{feature.label}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
