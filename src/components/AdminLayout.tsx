import {useState} from 'react';
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Radio,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {useSpecteQ} from '../lib/store';

const ADMIN_NAV = [
  {label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard},
  {label: 'Teams', to: '/admin/teams', icon: Users},
  {label: 'Schedule', to: '/admin/schedule', icon: Calendar},
  {label: 'Leaderboard', to: '/admin/leaderboard', icon: Trophy},
  {label: 'Quiz', to: '/admin/quiz', icon: FileQuestion},
  {label: 'Content', to: '/admin/content', icon: FolderKanban},
  {label: 'Live Sessions', to: '/admin/live-sessions', icon: Radio},
  {label: 'Notifications', to: '/admin/notifications', icon: Bell},
  {label: 'Settings', to: '/admin/settings', icon: Settings},
];

export function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const {session, logout} = useSpecteQ();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  if (!session || session.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin', {replace: true});
  };

  const SidebarInner = (
    <div className="flex h-full flex-col bg-[#080c17] border-r border-slate-800 text-slate-200">
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-display text-base font-extrabold text-white whitespace-nowrap">
            <ShieldCheck className="h-5 w-5 text-fuchsia-400 shrink-0" />
            <span>SpecteQ Admin</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          aria-label="Toggle sidebar"
          className="hidden lg:inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Admin Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[42px] ${
                active
                  ? 'bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/35'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3 space-y-1">
        <Link
          to="/"
          className="block rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-900 hover:text-cyan-300"
        >
          {!collapsed ? 'View Public Website' : 'Web'}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-950/50 min-h-[42px]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#060913] text-slate-100">
      <aside className={`hidden lg:block shrink-0 transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <div className="sticky top-0 h-screen">{SidebarInner}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden flex">
          <div className="w-64 h-full shadow-2xl">{SidebarInner}</div>
          <div className="flex-1 bg-black/70" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-[#080c17]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden rounded-lg border border-slate-800 p-2 text-slate-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg sm:text-xl font-bold text-white truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setBudgetOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400"
            >
              <Wallet className="h-3.5 w-3.5 text-cyan-400" />
              <span>Budget</span>
            </button>
            <span className="hidden md:inline font-mono text-xs text-slate-400">{session.email}</span>
            <Link
              to="/admin/settings"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-fuchsia-400"
            >
              Profile
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {budgetOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[85] flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0b1120] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Budget Module</h2>
              <button
                type="button"
                onClick={() => setBudgetOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-amber-200 bg-amber-950/30 border border-amber-500/30 rounded-lg p-3">
              Status: Unspecified / To Be Defined
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Per SpecteQ Admin Specifications (§10), financial expense tracking and budget limits are reserved here and will be activated once the Organizing Committee finalizes expense categories.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setBudgetOpen(false)}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
