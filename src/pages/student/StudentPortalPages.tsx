import {useState} from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Megaphone,
  Search,
  Send,
  Shield,
  UserCheck,
} from 'lucide-react';
import {COMPETITION_CATEGORIES, FAQ_DATA} from '../../data/specteqData';
import {useSpecteQ} from '../../lib/store';
import {StudentLayout} from '../../components/StudentLayout';
import type {ResourceType, SupportTicket} from '../../types/specteq';

export function StudentTeamPage() {
  const {currentTeam, updateTeamMemberProfile} = useSpecteQ();
  if (!currentTeam) return null;

  const completedCount = currentTeam.members.filter((m) => m.profileCompleted).length;
  const catName =
    COMPETITION_CATEGORIES.find((c) => c.slug === currentTeam.category)?.name || currentTeam.category;

  return (
    <StudentLayout title="Team Members">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-violet-700">
              {currentTeam.teamCode} · {catName}
            </p>
            <h2 className="font-display text-2xl font-bold text-slate-900">{currentTeam.teamName}</h2>
            <p className="text-sm text-slate-600">{currentTeam.institution}</p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-900 tabular-nums">
            {completedCount} / {currentTeam.members.length} Members Completed Profiles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTeam.members.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border bg-white p-5 space-y-3 ${
                m.isLeader ? 'border-violet-300' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-display font-bold text-violet-800 shrink-0">
                    {m.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{m.fullName}</h3>
                    <p className="text-xs text-slate-500">
                      {m.isLeader ? 'Team Leader' : 'Team Member'} · {m.role}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    m.profileCompleted ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {m.profileCompleted ? 'Profile Complete' : 'Incomplete'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>Email: {m.email}</p>
                <p>Institution: {m.institution || currentTeam.institution}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    updateTeamMemberProfile(currentTeam.id, m.id, {
                      profileCompleted: !m.profileCompleted,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserCheck className="h-3.5 w-3.5 text-violet-700" />
                  {m.profileCompleted ? 'Mark Incomplete' : 'Verify & Complete Profile'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}

export function StudentMaterialsPage() {
  const {currentTeam, stages, materials, stageProgress, toggleMaterialCompleted} = useSpecteQ();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({'stage-0': true, 'stage-1': true});

  if (!currentTeam) return null;

  const publishedStages = stages
    .filter((s) => s.isPublished)
    .sort((a, b) => a.stageNumber - b.stageNumber);

  const visibleMaterials = materials.filter(
    (m) =>
      m.isEnabled &&
      (m.category === 'all' || m.category === currentTeam.category) &&
      (typeFilter === 'all' || m.resourceType === typeFilter) &&
      (m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <StudentLayout title="Task Materials Library">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, links, starter code..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ResourceType | 'all')}
            aria-label="Filter by resource type"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
          >
            <option value="all">All Resource Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="Document">Documents</option>
            <option value="Video">Videos</option>
            <option value="Link">External Links</option>
            <option value="Code">Code Files</option>
          </select>
        </div>

        <div className="space-y-4">
          {publishedStages.map((stage) => {
            const list = visibleMaterials.filter((m) => m.stageId === stage.id);
            const isOpen = openStages[stage.id] ?? true;
            const prog = stageProgress.find((p) => p.stageId === stage.id && p.teamId === currentTeam.id);

            return (
              <div key={stage.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenStages((prev) => ({...prev, [stage.id]: !isOpen}))}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <span className="font-mono text-xs text-violet-700">
                      STAGE {stage.stageNumber} · {list.length} Resources
                    </span>
                    <h2 className="font-display text-base font-bold text-slate-900">{stage.title}</h2>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5">
                    {list.length === 0 ? (
                      <p className="text-sm text-slate-500">No matching resources in this stage.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {list.map((mat) => {
                          const completed = prog?.completedMaterialIds.includes(mat.id);
                          return (
                            <div key={mat.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                              <div>
                                <span className="font-mono text-xs text-violet-700">{mat.resourceType}</span>
                                <h3 className="font-semibold text-slate-900 mt-0.5">{mat.title}</h3>
                                <p className="text-xs text-slate-600 mt-1">{mat.description}</p>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <a
                                  href={mat.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:underline"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Open Resource
                                </a>
                                <button
                                  type="button"
                                  onClick={() => toggleMaterialCompleted(stage.id, currentTeam.id, mat.id)}
                                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${
                                    completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {completed ? 'Completed' : 'Mark Complete'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}

export function StudentSchedulePage() {
  const {schedule} = useSpecteQ();
  const [catFilter, setCatFilter] = useState('All');
  const [view, setView] = useState<'list' | 'timeline'>('list');

  const categories = ['All', 'Registration', 'Learning Phase', 'Implementation', 'Final Phase'];
  const filtered = catFilter === 'All' ? schedule : schedule.filter((t) => t.category === catFilter);

  return (
    <StudentLayout title="Competition Schedule">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCatFilter(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  catFilter === c
                    ? 'bg-violet-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                view === 'list' ? 'bg-violet-700 text-white' : 'text-slate-600'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setView('timeline')}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                view === 'timeline' ? 'bg-violet-700 text-white' : 'text-slate-600'
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>

        <div className={view === 'timeline' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
          {filtered.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-violet-700 font-semibold">{task.category}</span>
                <span className="text-slate-600">{task.status}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">{task.title}</h3>
              <p className="text-sm text-slate-600">{task.description}</p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
                <span>Start: {task.startDate}</span>
                <span>End: {task.endDate}</span>
                <span>Duration: {task.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}

export function StudentAnnouncementsPage() {
  const {announcements} = useSpecteQ();
  const published = announcements.filter((a) => a.isPublished);

  return (
    <StudentLayout title="Announcements">
      <div className="space-y-4">
        {published.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No official announcements published yet.
          </div>
        ) : (
          published.map((ann) => (
            <article
              key={ann.id}
              className={`rounded-xl border bg-white p-6 space-y-2 ${
                ann.priority === 'Urgent' ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 text-violet-700 font-semibold">
                  <Megaphone className="h-3.5 w-3.5" />
                  {ann.category} · {ann.priority}
                </span>
                <span className="text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="font-display text-lg font-bold text-slate-900">{ann.title}</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{ann.content}</p>
            </article>
          ))
        )}
      </div>
    </StudentLayout>
  );
}

export function StudentSettingsPage() {
  const {currentTeam, updatePassword, pushToast} = useSpecteQ();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  if (!currentTeam) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      pushToast('Passwords do not match.', 'error');
      return;
    }
    const res = await updatePassword(newPassword);
    pushToast(res.message, res.ok ? 'success' : 'error');
    if (res.ok) {
      setNewPassword('');
      setConfirm('');
    }
  };

  return (
    <StudentLayout title="Team Profile & Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Team Account Information</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Team Name</dt>
              <dd className="font-semibold text-slate-900">{currentTeam.teamName}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Team ID & Login Username</dt>
              <dd className="font-mono text-slate-800">
                {currentTeam.teamCode} · {currentTeam.loginUsername}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Institution</dt>
              <dd className="text-slate-800">{currentTeam.institution}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Primary Email</dt>
              <dd className="text-slate-800">{currentTeam.loginEmail}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-700" />
            <h2 className="font-display text-lg font-bold text-slate-900">Change Team Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}

export function StudentSupportPage() {
  const {currentTeam, tickets, createSupportTicket, siteConfig} = useSpecteQ();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Technical Issue');
  const [description, setDescription] = useState('');

  if (!currentTeam) return null;

  const myTickets = tickets.filter((t) => t.teamId === currentTeam.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    createSupportTicket({
      teamId: currentTeam.id,
      subject: subject.trim(),
      category,
      description: description.trim(),
    });
    setSubject('');
    setDescription('');
  };

  return (
    <StudentLayout title="Contact Support">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Submit Support Request</h2>
          <p className="text-xs text-slate-500">
            Committee email: <span className="font-mono text-slate-700">{siteConfig.committeeEmail}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Registration</option>
                <option>Payment</option>
                <option>Technical Issue</option>
                <option>Quiz / Task</option>
                <option>Schedule</option>
                <option>General Query</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details so organizers can help quickly..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600"
            >
              <Send className="h-3.5 w-3.5" />
              Submit Ticket
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Your Support Requests</h2>
            {myTickets.length === 0 ? (
              <p className="text-sm text-slate-500">No support requests submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {myTickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-violet-700">{t.category}</span>
                      <span className="font-bold text-slate-800">{t.status}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{t.subject}</h3>
                    <p className="text-sm text-slate-600">{t.description}</p>
                    {t.adminReply && (
                      <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                        <span className="font-bold block mb-0.5">Organizer Reply:</span>
                        {t.adminReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">Quick FAQ</h2>
            {FAQ_DATA.slice(0, 4).map((f) => (
              <div key={f.q} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                <p className="font-semibold text-slate-900">{f.q}</p>
                <p className="text-slate-600 mt-0.5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
