import {useState} from 'react';
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import {useSpecteQ} from '../lib/store';

export function StudentLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const {
    session,
    currentTeam,
    stages,
    notifications,
    readNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
  } = useSpecteQ();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  if (!session || session.role !== 'team' || !currentTeam) {
    return <Navigate to="/login" replace />;
  }

  const publishedStages = stages.filter((s) => s.isPublished).sort((a, b) => a.stageNumber - b.stageNumber);

  const visibleNotifs = notifications.filter((n) => {
    if (!n.isEnabled) return false;
    if (n.targetScope === 'category' && n.targetValue && n.targetValue !== currentTeam.category) return false;
    return true;
  });

  const unreadNotifs = visibleNotifs.filter((n) => !readNotificationIds.includes(n.id));
  const activePopup = unreadNotifs[0] || null;

  const navItems = [
    {label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard},
    {label: 'Team Members', to: '/portal/team', icon: Users},
    {label: 'Task Materials', to: '/portal/materials', icon: BookOpen},
    {label: 'Schedule', to: '/portal/schedule', icon: Calendar},
    {label: 'Announcements', to: '/portal/announcements', icon: Megaphone},
    {label: 'Team Settings', to: '/portal/settings', icon: Settings},
    {label: 'Contact Support', to: '/portal/support', icon: HelpCircle},
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', {replace: true});
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-[#1E1B4B] text-indigo-100">
      <div className="flex items-center justify-between px-4 h-16 border-b border-indigo-900/70">
        {!collapsed && (
          <Link to="/dashboard" className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
            Specte<span className="text-cyan-400">Q</span> Portal
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex rounded-lg p-2 text-indigo-300 hover:bg-indigo-900/70 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="lg:hidden rounded-lg p-2 text-indigo-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <nav aria-label="Student Portal Navigation" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[42px] ${
                  active
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-indigo-200 hover:bg-indigo-900/60 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Dynamic Active Stages */}
        <div className="space-y-1.5 border-t border-indigo-900/70 pt-4">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
              Active Stages
            </p>
          )}
          {publishedStages.map((st) => {
            const to = `/portal/stages/${st.id}`;
            const active = location.pathname === to;
            return (
              <Link
                key={st.id}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[40px] ${
                  active
                    ? 'bg-violet-600 text-white'
                    : st.isActive
                      ? 'text-indigo-100 hover:bg-indigo-900/60'
                      : 'text-indigo-300/60 hover:bg-indigo-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {st.isActive ? (
                    <Layers className="h-4 w-4 shrink-0 text-cyan-300" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-indigo-400/70" />
                  )}
                  {!collapsed && <span className="truncate">Stage {st.stageNumber}</span>}
                </div>
                {!collapsed && (
                  <span className="text-[11px] font-mono text-indigo-300">
                    {st.isActive ? 'Open' : 'Locked'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-indigo-900/70 p-3 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-900/60 hover:text-white"
        >
          {!collapsed ? 'Public SpecteQ Website' : 'Web'}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-200 hover:bg-rose-950/60 transition-colors min-h-[42px]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block shrink-0 transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden flex">
          <div className="w-64 h-full shadow-2xl">{SidebarContent}</div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 min-h-[40px] min-w-[40px]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{currentTeam.teamName}</p>
              <p className="font-mono text-xs text-slate-500">{currentTeam.teamCode}</p>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setBellOpen((p) => !p)}
                aria-label="Notifications"
                className="relative rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white tabular-nums">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs font-semibold text-violet-700 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {visibleNotifs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No notifications right now.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {visibleNotifs.map((n) => {
                        const isRead = readNotificationIds.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            className={`rounded-lg border p-2.5 text-xs space-y-1 ${
                              isRead ? 'border-slate-100 bg-slate-50 text-slate-500' : 'border-violet-200 bg-violet-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">{n.title}</span>
                              {!isRead && (
                                <button
                                  type="button"
                                  onClick={() => markNotificationRead(n.id)}
                                  className="text-violet-700 font-semibold hover:underline shrink-0"
                                >
                                  Read
                                </button>
                              )}
                            </div>
                            <p className="leading-relaxed">{n.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/portal/settings"
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hidden md:inline-flex"
            >
              Settings
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* One-time Popup Notification after login */}
      {activePopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-notif-title"
          className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-violet-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-violet-700">
                Organizer Notice
              </span>
              <button
                type="button"
                onClick={() => markNotificationRead(activePopup.id)}
                aria-label="Dismiss notice"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2 id="popup-notif-title" className="font-display text-xl font-bold text-slate-900">
              {activePopup.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{activePopup.description}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => markNotificationRead(activePopup.id)}
                className="rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
