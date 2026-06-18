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
      navigate('/', { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Login failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex items-center px-6 py-14 lg:px-16">
          <div className="max-w-xl space-y-8">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Slack Clone MERN
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Bring your workspace conversations into one secure place.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Sign in to access the collaboration workspace foundation built for authentication,
                clean APIs, and a future-ready architecture.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'JWT-authenticated profile route',
                'Strict TypeScript across the stack',
                'MongoDB Atlas + Mongoose models',
                'Responsive Tailwind UI',
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-glow backdrop-blur"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl"
          >
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400">Use your workspace credentials to continue.</p>
            </div>

            <div className="space-y-5">
              <label className="block space-y-2 text-sm text-slate-200">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm text-slate-200">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter your password"
                  required
                />
              </label>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              New here?{' '}
              <Link to="/register" className="font-medium text-cyan-300 transition hover:text-cyan-200">
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
