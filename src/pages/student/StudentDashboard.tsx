import {Link} from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Users,
  Video,
} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {useSpecteQ} from '../../lib/store';
import {StudentLayout} from '../../components/StudentLayout';

export function StudentDashboard() {
  const {
    currentTeam,
    stages,
    stageProgress,
    quizAttempts,
    announcements,
    schedule,
    liveSessions,
  } = useSpecteQ();

  if (!currentTeam) return null;

  const categoryName =
    COMPETITION_CATEGORIES.find((c) => c.slug === currentTeam.category)?.name || currentTeam.category;

  const publishedStages = stages
    .filter((s) => s.isPublished)
    .sort((a, b) => a.stageNumber - b.stageNumber);

  const activeStages = publishedStages.filter((s) => s.isActive);
  const completedMembers = currentTeam.members.filter((m) => m.profileCompleted).length;

  const teamProgressMap = new Map(
    stageProgress.filter((p) => p.teamId === currentTeam.id).map((p) => [p.stageId, p])
  );

  const completedStagesCount = publishedStages.filter(
    (s) => teamProgressMap.get(s.id)?.status === 'completed'
  ).length;

  const overallPct =
    publishedStages.length > 0
      ? Math.round((completedStagesCount / publishedStages.length) * 100)
      : 0;

  const currentFocusStage =
    activeStages.find((s) => teamProgressMap.get(s.id)?.status !== 'completed') ||
    activeStages[0] ||
    publishedStages[0];

  const currentFocusProg = currentFocusStage ? teamProgressMap.get(currentFocusStage.id) : undefined;

  const teamAttempts = quizAttempts.filter((a) => a.teamId === currentTeam.id);
  const latestAttempt = teamAttempts[0];

  const urgentAnnouncement = announcements.find((a) => a.isPublished && a.priority === 'Urgent');
  const relevantLiveSessions = liveSessions.filter(
    (ls) => ls.isEnabled && ls.category === currentTeam.category
  );

  return (
    <StudentLayout title="Participant Dashboard">
      <div className="space-y-6">
        {/* Urgent Announcement Banner */}
        {urgentAnnouncement && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono font-bold uppercase text-amber-800">
                  Urgent Announcement · {urgentAnnouncement.category}
                </p>
                <p className="text-sm font-semibold text-slate-900">{urgentAnnouncement.title}</p>
                <p className="text-xs text-slate-700 mt-0.5">{urgentAnnouncement.content}</p>
              </div>
            </div>
            <Link
              to="/portal/announcements"
              className="text-xs font-bold text-amber-900 underline whitespace-nowrap shrink-0"
            >
              View All
            </Link>
          </div>
        )}

        {/* Welcome Header */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-mono text-xs text-violet-700">
              {currentTeam.teamCode} · {categoryName}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {currentTeam.teamName}
            </h2>
            <p className="text-sm text-slate-600">
              Current Active Phase: {currentFocusStage ? currentFocusStage.title : 'Onboarding'}
            </p>
          </div>

          <div className="w-full lg:w-72 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Overall Competition Progress</span>
              <span className="font-mono tabular-nums">{overallPct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{width: `${overallPct}%`}}
              />
            </div>
          </div>
        </section>

        {/* 6 Progress Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Registration</span>
            <p className="text-lg font-bold text-emerald-700">
              {currentTeam.registrationComplete ? 'Completed' : 'Pending'}
            </p>
            <span className="text-xs text-slate-500 block">Team account active</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Payment Verification</span>
            <p className="text-lg font-bold text-slate-900 capitalize">{currentTeam.paymentStatus}</p>
            <span className="text-xs text-slate-500 block">Managed by organizing committee</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Team Profiles</span>
            <p className="text-lg font-bold text-slate-900 tabular-nums">
              {completedMembers} / {currentTeam.members.length} Completed
            </p>
            <Link to="/portal/team" className="text-xs font-semibold text-violet-700 hover:underline">
              Verify member details &rarr;
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Current Stage</span>
            <p className="text-lg font-bold text-blue-700 truncate">
              {currentFocusStage ? `Stage ${currentFocusStage.stageNumber}` : 'TBD'}
            </p>
            <span className="text-xs text-slate-500 block truncate">
              {currentFocusStage?.taskTitle || 'Awaiting activation'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Stages Completed</span>
            <p className="text-lg font-bold text-slate-900 tabular-nums">
              {completedStagesCount} / {publishedStages.length}
            </p>
            <span className="text-xs text-slate-500 block">Dynamic stage checklist</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Latest Quiz Score</span>
            <p className="text-lg font-bold text-slate-900 tabular-nums">
              {latestAttempt
                ? `${latestAttempt.score} / ${latestAttempt.totalPossible}`
                : 'No Attempts Yet'}
            </p>
            <span className="text-xs text-slate-500 block">
              {latestAttempt ? (latestAttempt.passed ? 'Passed' : 'Needs Review') : 'Available in active stages'}
            </span>
          </div>
        </section>

        {/* Competition Progress Tracker */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">
            Competition Progression Tracker
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {publishedStages.map((st) => {
              const prog = teamProgressMap.get(st.id);
              const statusLabel = !st.isActive
                ? 'Locked'
                : prog?.status === 'completed'
                  ? 'Completed'
                  : prog?.status === 'submitted'
                    ? 'Submitted'
                    : 'Active';
              const tone =
                statusLabel === 'Completed'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : statusLabel === 'Submitted'
                    ? 'border-blue-200 bg-blue-50 text-blue-800'
                    : statusLabel === 'Active'
                      ? 'border-violet-300 bg-violet-50 text-violet-900'
                      : 'border-slate-200 bg-slate-50 text-slate-500';

              return (
                <Link
                  key={st.id}
                  to={`/portal/stages/${st.id}`}
                  className={`rounded-lg border p-4 transition-colors hover:border-violet-400 ${tone}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>STAGE {st.stageNumber}</span>
                    <span>{statusLabel}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold truncate">{st.taskTitle}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Continue Where You Left Off + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-violet-200 bg-white p-6 flex flex-col justify-between space-y-5">
            {currentFocusStage ? (
              <>
                <div className="space-y-2">
                  <span className="font-mono text-xs font-semibold text-violet-700 uppercase">
                    Continue Where You Left Off · Stage {currentFocusStage.stageNumber}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {currentFocusStage.taskTitle}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentFocusStage.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      Deadline: {currentFocusStage.deadline}
                    </span>
                    <span className="tabular-nums">
                      Progress: {currentFocusProg?.progressPct || 0}%
                    </span>
                  </div>
                  <Link
                    to={`/portal/stages/${currentFocusStage.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-600"
                  >
                    Continue Stage {currentFocusStage.stageNumber}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">No active stages published yet.</p>
            )}
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentFocusStage && (
                <Link
                  to={`/portal/stages/${currentFocusStage.id}`}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50/50"
                >
                  <Layers className="h-4 w-4 text-violet-700" />
                  <span>Current Stage</span>
                </Link>
              )}
              <Link
                to="/portal/materials"
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50/50"
              >
                <BookOpen className="h-4 w-4 text-violet-700" />
                <span>Task Materials</span>
              </Link>
              <Link
                to="/portal/team"
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50/50"
              >
                <Users className="h-4 w-4 text-violet-700" />
                <span>Team Members</span>
              </Link>
              <Link
                to="/portal/schedule"
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50/50"
              >
                <Calendar className="h-4 w-4 text-violet-700" />
                <span>Schedule</span>
              </Link>
              <Link
                to="/portal/support"
                className="sm:col-span-2 flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50/50"
              >
                <HelpCircle className="h-4 w-4 text-violet-700" />
                <span>Contact Support & Organizers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Relevant Live Sessions + Upcoming Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              Live Sessions ({categoryName})
            </h3>
            {relevantLiveSessions.length === 0 ? (
              <p className="text-sm text-slate-500">
                No active live sessions scheduled for {categoryName} right now.
              </p>
            ) : (
              <div className="space-y-3">
                {relevantLiveSessions.map((ls) => (
                  <div key={ls.id} className="rounded-lg border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-violet-700">
                        Stage {ls.stageNumber} · {ls.date} · {ls.time}
                      </p>
                      <p className="text-sm font-bold text-slate-900">{ls.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{ls.description}</p>
                    </div>
                    <a
                      href={ls.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-violet-600 whitespace-nowrap shrink-0"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Join Live Session
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900">Upcoming Milestones</h3>
              <Link to="/portal/schedule" className="text-xs font-semibold text-violet-700 hover:underline">
                Full Schedule
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {schedule.slice(0, 4).map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.category} · Duration: {task.duration}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-600 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
