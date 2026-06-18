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
      navigate('/', { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl"
          >
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-white">Create your account</h2>
              <p className="text-sm text-slate-400">Start your collaboration workspace in minutes.</p>
            </div>

            <div className="space-y-5">
              <label className="block space-y-2 text-sm text-slate-200">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                  placeholder="Jane Doe"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm text-slate-200">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
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
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                  placeholder="Create a strong password"
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
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-300 transition hover:text-emerald-200">
                Sign in
              </Link>
            </p>
          </form>
        </section>

        <section className="hidden items-center px-6 py-14 lg:flex lg:px-16">
          <div className="max-w-xl space-y-8">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Secure onboarding
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                A clean starting point for the rest of the workspace platform.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Register once, receive a JWT-backed session, and move into the protected workspace shell.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Protected route gating',
                'Context-driven session state',
                'API responses without password leakage',
                'Built for later workspace expansion',
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
      </div>
    </main>
  );
};

export default RegisterPage;
