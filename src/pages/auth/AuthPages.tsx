import {useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {AlertCircle, ArrowLeft, LogIn, ShieldCheck} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';

export function LoginPage() {
  const {session, loginTeam, supabaseConnected} = useSpecteQ();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (session?.role === 'team') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginTeam(identifier, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Unable to sign in.');
      return;
    }
    navigate('/dashboard', {replace: true});
  };

  const fillSampleTeam = () => {
    setIdentifier('vectorpulse');
    setPassword('SpecteQ#101');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#06070d] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to SpecteQ 2027
        </Link>

        <div className="hud-panel p-7 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <p className="font-mono text-xs text-indigo-300 uppercase">Participant Access</p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
              Team Portal Sign In
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Sign in with the team username or email issued by the SpecteQ Organizing Committee.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 flex items-start gap-2.5 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="team-id" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Team Username or Email
              </label>
              <input
                id="team-id"
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="vectorpulse"
                className="w-full rounded-lg border border-zinc-800 bg-[#090b14] px-3.5 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="team-pw" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="team-pw"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-[#090b14] px-3.5 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hud-btn-primary w-full inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-indigo-50 disabled:opacity-60 min-h-[44px] transition-colors"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-4">
            Team credentials are provisioned and managed exclusively by the SpecteQ Organizing Committee. Contact organizers if your team requires credential assistance.
          </p>

          {!supabaseConnected && (
            <div className="rounded-lg border border-zinc-800 bg-[#090b14] p-3.5 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-amber-300">Preview Persistence Mode</span>
                <button
                  type="button"
                  onClick={fillSampleTeam}
                  className="rounded border border-indigo-400/40 bg-indigo-500/15 px-2.5 py-1 font-semibold text-indigo-200 hover:bg-indigo-500/25"
                >
                  Fill Sample Team
                </button>
              </div>
              <p className="text-zinc-400">
                Sample Team: <code className="text-zinc-200">vectorpulse</code> / <code className="text-zinc-200">SpecteQ#101</code> (or create new teams in the Admin Panel).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminGatePage() {
  const {session, loginAdmin, supabaseConnected} = useSpecteQ();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (session?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Authentication failed.');
      return;
    }
    navigate('/admin/dashboard', {replace: true});
  };

  const fillDemoAdmin = () => {
    setEmail('admin@specteq.dev');
    setPassword('SpecteQ@2027');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#06070d] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Return to Main Website
        </Link>

        <div className="hud-panel-magenta p-7 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-fuchsia-400" />
            <div>
              <p className="font-mono text-xs text-fuchsia-300 uppercase">Restricted Area</p>
              <h1 className="font-display text-2xl font-extrabold text-white">SpecteQ Admin Sign In</h1>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 flex items-start gap-2.5 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@specteq.dev"
                className="w-full rounded-lg border border-zinc-800 bg-[#090b14] px-3.5 py-2.5 text-sm text-white focus:border-fuchsia-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-pw" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="admin-pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-[#090b14] px-3.5 py-2.5 text-sm text-white focus:border-fuchsia-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hud-btn-primary w-full bg-fuchsia-600 px-5 py-3 text-sm font-bold text-white hover:bg-fuchsia-500 disabled:opacity-60 min-h-[44px] transition-colors"
            >
              {loading ? 'Verifying Access...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {!supabaseConnected && (
            <div className="rounded-lg border border-zinc-800 bg-[#090b14] p-3.5 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-fuchsia-300">Preview Admin Access</span>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="rounded border border-fuchsia-500/40 bg-fuchsia-500/15 px-2.5 py-1 font-semibold text-fuchsia-200 hover:bg-fuchsia-500/25"
                >
                  Fill Admin Demo
                </button>
              </div>
              <p className="text-zinc-400">
                Demo credentials: <code className="text-zinc-200">admin@specteq.dev</code> / <code className="text-zinc-200">SpecteQ@2027</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
