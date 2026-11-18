import {Link} from 'react-router-dom';
import {ArrowRight, Bell, CheckCircle2, FileQuestion, Layers, Trophy, Users} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';

export function AdminDashboard() {
  const {
    teams,
    stages,
    quizAttempts,
    submissions,
    tickets,
    activityLogs,
    toggleStageActive,
  } = useSpecteQ();

  const totalTeams = teams.length;
  const activeTeams = teams.filter((t) => t.status === 'active').length;
  const pendingTeams = teams.filter((t) => t.status === 'pending').length;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Key Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-1">
            <span className="text-xs font-mono text-slate-400">TOTAL TEAMS</span>
            <p className="font-display text-3xl font-extrabold text-white tabular-nums">{totalTeams}</p>
            <Link to="/admin/teams" className="text-xs text-cyan-300 hover:underline inline-flex items-center gap-1">
              Manage Teams <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-1">
            <span className="text-xs font-mono text-slate-400">ACTIVE TEAMS</span>
            <p className="font-display text-3xl font-extrabold text-emerald-400 tabular-nums">{activeTeams}</p>
            <span className="text-xs text-slate-500">Cleared for portal access</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-1">
            <span className="text-xs font-mono text-slate-400">PENDING TEAMS</span>
            <p className="font-display text-3xl font-extrabold text-amber-400 tabular-nums">{pendingTeams}</p>
            <span className="text-xs text-slate-500">Awaiting activation</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-1">
            <span className="text-xs font-mono text-slate-400">QUIZ / SUBMISSIONS / TICKETS</span>
            <p className="font-display text-3xl font-extrabold text-fuchsia-300 tabular-nums">
              {quizAttempts.length} · {submissions.length} · {openTickets}
            </p>
            <span className="text-xs text-slate-500">Attempts · Reviews · Open Tickets</span>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin/teams?tab=register"
            className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex items-center gap-3 hover:border-cyan-400 transition-colors"
          >
            <Users className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-sm font-bold text-white">Register New Team</p>
              <p className="text-xs text-slate-400">Generate credentials</p>
            </div>
          </Link>
          <Link
            to="/admin/quiz"
            className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 flex items-center gap-3 hover:border-fuchsia-400 transition-colors"
          >
            <FileQuestion className="h-5 w-5 text-fuchsia-400" />
            <div>
              <p className="text-sm font-bold text-white">Quiz Control</p>
              <p className="text-xs text-slate-400">Bank, schedule & results</p>
            </div>
          </Link>
          <Link
            to="/admin/leaderboard"
            className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 flex items-center gap-3 hover:border-cyan-400 transition-colors"
          >
            <Trophy className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white">Update Leaderboard</p>
              <p className="text-xs text-slate-400">Stage scores & ranks</p>
            </div>
          </Link>
          <Link
            to="/admin/notifications"
            className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 flex items-center gap-3 hover:border-cyan-400 transition-colors"
          >
            <Bell className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-sm font-bold text-white">Announcements & Alerts</p>
              <p className="text-xs text-slate-400">Popups & support</p>
            </div>
          </Link>
        </section>

        {/* Stage Quick Activation + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-400" />
                <h2 className="font-display text-lg font-bold text-white">Stage Activation Controls</h2>
              </div>
              <Link to="/admin/content" className="text-xs text-cyan-300 hover:underline">
                Configure Stages &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {stages.map((st) => (
                <div
                  key={st.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-cyan-300">
                      Stage {st.stageNumber} · {st.isPublished ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-sm font-semibold text-white truncate">{st.taskTitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStageActive(st.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 ${
                      st.isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {st.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Recent Admin Activity</h2>
              <Link to="/admin/settings" className="text-xs text-cyan-300 hover:underline">
                Full Audit Log &rarr;
              </Link>
            </div>
            <div className="divide-y divide-slate-800/80">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      {log.action}: {log.target}
                    </p>
                    <p className="text-slate-400">{log.details}</p>
                  </div>
                  <span className="font-mono text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
