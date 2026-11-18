import {useMemo, useState} from 'react';
import {Link, useParams, useSearchParams} from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  KeyRound,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';
import type {CategorySlug, TeamStatus} from '../../types/specteq';

export function AdminTeamsPage() {
  const {
    teams,
    createTeam,
    setTeamStatus,
    resetTeamCredentials,
    deleteTeam,
    updateTeam,
    pushToast,
  } = useSpecteQ();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'list';
  const [tab, setTab] = useState<'list' | 'register'>(initialTab);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<CategorySlug | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TeamStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('date');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Register Team Form
  const [teamName, setTeamName] = useState('');
  const [category, setCategory] = useState<CategorySlug>('line-follower');
  const [institution, setInstitution] = useState('');
  const [memberCount, setMemberCount] = useState(2);
  const [memberInputs, setMemberInputs] = useState<Array<{fullName: string; email: string; role: string}>>([
    {fullName: '', email: '', role: 'Team Leader'},
    {fullName: '', email: '', role: 'Member'},
    {fullName: '', email: '', role: 'Member'},
    {fullName: '', email: '', role: 'Member'},
    {fullName: '', email: '', role: 'Member'},
  ]);
  const [regError, setRegError] = useState('');
  const [createdCreds, setCreatedCreds] = useState<{
    teamName: string;
    username: string;
    email: string;
    password: string;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams
      .filter((t) => {
        if (catFilter !== 'all' && t.category !== catFilter) return false;
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (q && !t.teamName.toLowerCase().includes(q) && !t.teamCode.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.teamName.localeCompare(b.teamName);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [teams, search, catFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / pageSize));
  const pagedTeams = filteredTeams.slice((page - 1) * pageSize, page * pageSize);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const activeMembers = memberInputs.slice(0, memberCount);
    if (activeMembers.some((m) => !m.fullName.trim() || !m.email.trim())) {
      setRegError('All member names and emails are required.');
      return;
    }

    const res = createTeam({
      teamName,
      category,
      institution,
      members: activeMembers.map((m, idx) => ({
        fullName: m.fullName,
        email: m.email,
        role: m.role || (idx === 0 ? 'Team Leader' : 'Member'),
        isLeader: idx === 0,
        institution,
        profileCompleted: true,
      })),
    });

    if ('error' in res) {
      setRegError(res.error);
      return;
    }

    setCreatedCreds({
      teamName: res.team.teamName,
      username: res.team.loginUsername,
      email: res.team.loginEmail,
      password: res.generatedPassword,
    });
    setTeamName('');
    setInstitution('');
  };

  const copyCredentials = (creds: {teamName: string; username: string; email: string; password: string}) => {
    const text = `SpecteQ 2027 Team Credentials\nTeam: ${creds.teamName}\nUsername: ${creds.username}\nEmail: ${creds.email}\nTemporary Password: ${creds.password}`;
    navigator.clipboard?.writeText(text);
    pushToast('Credentials copied to clipboard.');
  };

  const getCategoryName = (slug: CategorySlug) =>
    COMPETITION_CATEGORIES.find((c) => c.slug === slug)?.name || slug;

  return (
    <AdminLayout title="Team Management">
      <div className="space-y-6">
        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
            <button
              type="button"
              onClick={() => {
                setTab('list');
                setSearchParams({});
              }}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                tab === 'list' ? 'bg-white text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              All Teams ({teams.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setSearchParams({tab: 'register'});
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                tab === 'register' ? 'bg-fuchsia-600 text-white' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register Team
            </button>
          </div>
        </div>

        {createdCreds && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-emerald-300 uppercase">
                  One-Time Credentials Generated
                </p>
                <h2 className="font-display text-lg font-bold text-white">{createdCreds.teamName}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyCredentials(createdCreds)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedCreds(null)}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs bg-[#070810] border border-zinc-800 rounded-lg p-3">
              <div>
                <span className="text-zinc-400 block">Username</span>
                <span className="text-white font-bold">{createdCreds.username}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Login Email</span>
                <span className="text-white font-bold">{createdCreds.email}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Temporary Password</span>
                <span className="text-indigo-300 font-bold">{createdCreds.password}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'register' ? (
          <form
            onSubmit={handleRegisterSubmit}
            className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-6 max-w-4xl"
          >
            <div>
              <h2 className="font-display text-xl font-bold text-white">Register New Team (Admin Only)</h2>
              <p className="text-sm text-zinc-400">
                Create a unique team record and generate team portal login credentials.
              </p>
            </div>

            {regError && (
              <p className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200">
                {regError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Mecha Spark"
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3.5 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Robot Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategorySlug)}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3.5 py-2.5 text-sm text-white"
                >
                  {COMPETITION_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="University / College Name"
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Number of Members</label>
                <select
                  value={memberCount}
                  onChange={(e) => setMemberCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3.5 py-2.5 text-sm text-white"
                >
                  {[2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Members
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 border-t border-zinc-800 pt-5">
              <h3 className="text-sm font-bold text-indigo-300">Member Details</h3>
              {Array.from({length: memberCount}).map((_, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-zinc-800 bg-[#070810] p-3.5">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Member {idx + 1} Name {idx === 0 ? '(Leader)' : ''} *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberInputs[idx]?.fullName || ''}
                      onChange={(e) => {
                        const copy = [...memberInputs];
                        copy[idx] = {...copy[idx], fullName: e.target.value};
                        setMemberInputs(copy);
                      }}
                      className="w-full rounded-md border border-zinc-700 bg-[#06070d] px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={memberInputs[idx]?.email || ''}
                      onChange={(e) => {
                        const copy = [...memberInputs];
                        copy[idx] = {...copy[idx], email: e.target.value};
                        setMemberInputs(copy);
                      }}
                      className="w-full rounded-md border border-zinc-700 bg-[#06070d] px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={memberInputs[idx]?.role || ''}
                      onChange={(e) => {
                        const copy = [...memberInputs];
                        copy[idx] = {...copy[idx], role: e.target.value};
                        setMemberInputs(copy);
                      }}
                      className="w-full rounded-md border border-zinc-700 bg-[#06070d] px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Create Team & Generate Credentials
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Search, Filters, Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search team name or ID..."
                  className="w-full rounded-lg border border-zinc-800 bg-[#0b0d17] pl-9 pr-3 py-2.5 text-sm text-white"
                />
              </div>

              <select
                value={catFilter}
                onChange={(e) => {
                  setCatFilter(e.target.value as CategorySlug | 'all');
                  setPage(1);
                }}
                className="rounded-lg border border-zinc-800 bg-[#0b0d17] px-3 py-2.5 text-sm text-white"
              >
                <option value="all">All Categories</option>
                {COMPETITION_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as TeamStatus | 'all');
                  setPage(1);
                }}
                className="rounded-lg border border-zinc-800 bg-[#0b0d17] px-3 py-2.5 text-sm text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'category')}
                className="rounded-lg border border-zinc-800 bg-[#0b0d17] px-3 py-2.5 text-sm text-white"
              >
                <option value="date">Sort: Created Date</option>
                <option value="name">Sort: Team Name</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>

            {/* Teams Table */}
            <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-[#070810] font-mono text-xs text-zinc-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Team ID</th>
                    <th className="px-4 py-3">Team Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Members</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {pagedTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-zinc-900/40">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-300 tabular-nums">{team.teamCode}</td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/teams/${team.id}`} className="font-semibold text-white hover:text-indigo-300">
                          {team.teamName}
                        </Link>
                        <span className="block font-mono text-xs text-zinc-400">@{team.loginUsername}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{getCategoryName(team.category)}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{team.members.length}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold capitalize ${
                            team.status === 'active'
                              ? 'text-emerald-400'
                              : team.status === 'pending'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                          }`}
                        >
                          {team.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/admin/teams/${team.id}`}
                            className="rounded border border-zinc-700 px-2.5 py-1 text-xs text-zinc-200 hover:border-indigo-400"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              const res = resetTeamCredentials(team.id);
                              if (res) {
                                setCreatedCreds({
                                  teamName: team.teamName,
                                  username: res.username,
                                  email: team.loginEmail,
                                  password: res.password,
                                });
                              }
                            }}
                            title="Reset Password"
                            className="rounded border border-zinc-700 p-1.5 text-zinc-300 hover:border-indigo-400 hover:text-indigo-300"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTeamStatus(team.id, team.status === 'active' ? 'disabled' : 'active')
                            }
                            className="rounded border border-zinc-700 px-2.5 py-1 text-xs text-zinc-200 hover:border-amber-400"
                          >
                            {team.status === 'active' ? 'Disable' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(team.id)}
                            title="Delete Team"
                            className="rounded border border-rose-500/40 p-1.5 text-rose-300 hover:bg-rose-950/60"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pagedTeams.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                        No teams match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="tabular-nums">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded border border-zinc-700 px-3 py-1.5 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded border border-zinc-700 px-3 py-1.5 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-sm rounded-xl border border-rose-500/40 bg-[#0b0d17] p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-white">Confirm Team Deletion</h3>
              <p className="text-sm text-zinc-300">
                Deleting this team permanently removes its member records, quiz attempts, and leaderboard entries.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTeam(deleteTargetId);
                    setDeleteTargetId(null);
                  }}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white"
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminTeamDetailPage() {
  const {teamId} = useParams<{teamId: string}>();
  const {teams, quizAttempts, leaderboard, updateTeam, resetTeamCredentials, pushToast} = useSpecteQ();
  const team = teams.find((t) => t.id === teamId);
  const [editingName, setEditingName] = useState(team?.teamName || '');
  const [editingCat, setEditingCat] = useState<CategorySlug>(team?.category || 'line-follower');
  const [tempCred, setTempCred] = useState<string | null>(null);

  if (!team) {
    return (
      <AdminLayout title="Team Not Found">
        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-10 text-center space-y-3">
          <p className="text-zinc-400">Requested team record does not exist.</p>
          <Link to="/admin/teams" className="text-sm text-indigo-300 underline">
            Back to All Teams
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const teamQuizzes = quizAttempts.filter((a) => a.teamId === team.id);
  const teamScores = leaderboard.filter((l) => l.teamId === team.id);

  return (
    <AdminLayout title={`Team · ${team.teamName}`}>
      <div className="space-y-6">
        <Link to="/admin/teams" className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to All Teams
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-indigo-300">
                  {team.teamCode} · @{team.loginUsername}
                </p>
                <h2 className="font-display text-2xl font-bold text-white">{team.teamName}</h2>
                <p className="text-sm text-zinc-400">{team.institution}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const res = resetTeamCredentials(team.id);
                  if (res) setTempCred(res.password);
                }}
                className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/20"
              >
                Reset Credentials
              </button>
            </div>

            {tempCred && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-200">
                  New Password: <strong>{tempCred}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(tempCred);
                    pushToast('Copied password.');
                  }}
                  className="text-emerald-300 underline"
                >
                  Copy
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Edit Team Name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Robot Category</label>
                <select
                  value={editingCat}
                  onChange={(e) => setEditingCat(e.target.value as CategorySlug)}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
                >
                  {COMPETITION_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateTeam(team.id, {teamName: editingName, category: editingCat})}
              className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50"
            >
              Save Changes
            </button>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-white">Team Members ({team.members.length})</h3>
            <div className="space-y-2.5">
              {team.members.map((m) => (
                <div key={m.id} className="rounded-lg border border-zinc-800 bg-[#070810] p-3 text-xs">
                  <p className="font-bold text-white">
                    {m.fullName} {m.isLeader ? '(Leader)' : ''}
                  </p>
                  <p className="text-zinc-400">{m.email} · {m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-white">Quiz Scores</h3>
            {teamQuizzes.length === 0 ? (
              <p className="text-xs text-zinc-400">No quiz attempts recorded.</p>
            ) : (
              teamQuizzes.map((a) => (
                <div key={a.id} className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                  <span>{a.stageId} (Attempt #{a.attemptNumber})</span>
                  <span className="font-mono text-indigo-300 tabular-nums">
                    {a.score} / {a.totalPossible}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-white">Leaderboard Scores</h3>
            {teamScores.length === 0 ? (
              <p className="text-xs text-zinc-400">No leaderboard entries yet.</p>
            ) : (
              teamScores.map((l) => (
                <div key={l.id} className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                  <span className="font-mono uppercase">{l.stageKey}</span>
                  <span className="font-mono text-fuchsia-300 tabular-nums">{l.score} pts</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
