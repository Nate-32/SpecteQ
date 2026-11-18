import {useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {AlertCircle, ArrowLeft, KeyRound, Lock, LogIn, ShieldCheck} from 'lucide-react';
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
    <div className="min-h-screen bg-[#060913] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to SpecteQ 2027
        </Link>

        <div className="hud-panel p-7 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <p className="font-mono text-xs text-cyan-300 uppercase">Participant Access</p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
              Team Portal Sign In
            </h1>
            <p className="mt-1 text-sm text-slate-400">
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
              <label htmlFor="team-id" className="block text-xs font-medium text-slate-300 mb-1.5">
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="team-pw" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-cyan-300 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="team-pw"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hud-btn-primary w-full inline-flex items-center justify-center gap-2 bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60 min-h-[44px]"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {!supabaseConnected && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-amber-300">Preview Persistence Mode</span>
                <button
                  type="button"
                  onClick={fillSampleTeam}
                  className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300 hover:bg-cyan-500/20"
                >
                  Fill Sample Team
                </button>
              </div>
              <p className="text-slate-400">
                Sample Team: <code className="text-slate-200">vectorpulse</code> / <code className="text-slate-200">SpecteQ#101</code> (or create new teams in the Admin Panel).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const {requestPasswordReset} = useSpecteQ();
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await requestPasswordReset(email);
    setLoading(false);
    setStatusMsg(res.message);
  };

  return (
    <div className="min-h-screen bg-[#060913] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
        <div className="hud-panel p-7 sm:p-8 space-y-5">
          <KeyRound className="h-7 w-7 text-cyan-400" />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Reset Team Password</h1>
            <p className="mt-1 text-sm text-slate-400">
              Enter your team email to receive password recovery instructions.
            </p>
          </div>

          {statusMsg && (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-3 text-sm text-cyan-100">
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@university.edu"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 min-h-[44px]"
            >
              {loading ? 'Sending...' : 'Request Reset'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const {updatePassword} = useSpecteQ();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    const res = await updatePassword(password);
    setMsg(res.message);
  };

  return (
    <div className="min-h-screen bg-[#060913] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md hud-panel p-7 sm:p-8 space-y-5">
        <Lock className="h-7 w-7 text-cyan-400" />
        <h1 className="font-display text-2xl font-bold text-white">Choose New Password</h1>
        {msg && <p className="rounded-lg border border-cyan-500/30 bg-slate-950 p-3 text-sm text-cyan-200">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 min-h-[44px]"
          >
            Update Password
          </button>
        </form>
        <Link to="/login" className="block text-center text-xs text-cyan-300 hover:underline">
          Return to Sign In
        </Link>
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
    <div className="min-h-screen bg-[#050711] arena-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">
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
              <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@specteq.dev"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-fuchsia-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-pw" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="admin-pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-fuchsia-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hud-btn-primary w-full bg-fuchsia-500 px-5 py-3 text-sm font-bold text-white hover:bg-fuchsia-400 disabled:opacity-60 min-h-[44px]"
            >
              {loading ? 'Verifying Access...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {!supabaseConnected && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-fuchsia-300">Preview Admin Access</span>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="rounded border border-fuchsia-500/40 bg-fuchsia-500/10 px-2.5 py-1 font-semibold text-fuchsia-200 hover:bg-fuchsia-500/20"
                >
                  Fill Admin Demo
                </button>
              </div>
              <p className="text-slate-400">
                Demo credentials: <code className="text-slate-200">admin@specteq.dev</code> / <code className="text-slate-200">SpecteQ@2027</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
