import {useState} from 'react';
import {Edit3, Plus, Trash2, Trophy} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';
import type {ScheduleCategory, ScheduleStatus, ScheduleTask} from '../../types/specteq';

export function AdminSchedulePage() {
  const {schedule, upsertScheduleTask, deleteScheduleTask} = useSpecteQ();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ScheduleCategory>('Learning Phase');
  const [duration, setDuration] = useState('TBD');
  const [startDate, setStartDate] = useState('TBD');
  const [endDate, setEndDate] = useState('TBD');
  const [status, setStatus] = useState<ScheduleStatus>('Upcoming');

  const startEdit = (task: ScheduleTask) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setDuration(task.duration);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setStatus(task.status);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('Learning Phase');
    setDuration('TBD');
    setStartDate('TBD');
    setEndDate('TBD');
    setStatus('Upcoming');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    upsertScheduleTask({
      id: editingId || `sch-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      duration: duration.trim() || 'TBD',
      startDate: startDate.trim() || 'TBD',
      endDate: endDate.trim() || 'TBD',
      status,
      sortOrder: editingId
        ? schedule.find((s) => s.id === editingId)?.sortOrder || schedule.length + 1
        : schedule.length + 1,
    });
    resetForm();
  };

  return (
    <AdminLayout title="Schedule Management">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-4 self-start"
        >
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? 'Edit Schedule Task' : 'Add Schedule Task'}
          </h2>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hardware Kit Distribution"
              className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
              >
                <option>Registration</option>
                <option>Learning Phase</option>
                <option>Implementation</option>
                <option>Final Phase</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
              >
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Deadline Passed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">End Date</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {editingId ? 'Save Task' : 'Add Task'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-7 space-y-3">
          {schedule.map((task) => (
            <div key={task.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-mono text-xs text-indigo-300">
                  {task.category} · {task.status}
                </p>
                <h3 className="font-display text-base font-bold text-white">{task.title}</h3>
                <p className="text-sm text-zinc-300">{task.description}</p>
                <p className="font-mono text-xs text-zinc-500 pt-1">
                  Start: {task.startDate} · End: {task.endDate} · Duration: {task.duration}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  aria-label="Edit task"
                  className="rounded border border-zinc-700 p-2 text-zinc-300 hover:border-indigo-400"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteScheduleTask(task.id)}
                  aria-label="Delete task"
                  className="rounded border border-rose-500/40 p-2 text-rose-300 hover:bg-rose-950/60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

const STAGE_KEYS = [
  {key: 'stage-0', label: 'Stage 0 · Onboarding'},
  {key: 'stage-1', label: 'Stage 1 · Training'},
  {key: 'stage-2', label: 'Stage 2 · Hardware'},
  {key: 'stage-3', label: 'Stage 3 · Final Arena'},
];

export function AdminLeaderboardPage() {
  const {teams, leaderboard, getRankedLeaderboard, upsertLeaderboardScore, removeLeaderboardScore} = useSpecteQ();
  const [stageKey, setStageKey] = useState('stage-1');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [scoreInput, setScoreInput] = useState('90');

  const ranked = getRankedLeaderboard(stageKey, 'all');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(scoreInput);
    if (!selectedTeamId || Number.isNaN(numeric)) return;
    upsertLeaderboardScore(stageKey, selectedTeamId, numeric);
  };

  return (
    <AdminLayout title="Leaderboard Management">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {STAGE_KEYS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStageKey(s.key)}
              className={`rounded-lg px-4 py-2 text-xs font-bold ${
                stageKey === s.key
                  ? 'bg-white text-zinc-950'
                  : 'border border-zinc-800 bg-[#0b0d17] text-zinc-300 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleUpdate}
          className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Select Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2.5 text-sm text-white"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.teamName} ({t.teamCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Numeric Score</label>
            <input
              type="number"
              step="0.5"
              required
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2.5 text-sm text-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-fuchsia-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-fuchsia-500 min-h-[42px]"
          >
            <Trophy className="h-4 w-4" />
            Add / Update Score
          </button>
        </form>

        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-[#070810] font-mono text-xs text-zinc-400 uppercase">
              <tr>
                <th className="px-5 py-3">Calculated Rank</th>
                <th className="px-5 py-3">Team</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {ranked.map((row) => {
                const rawEntry = leaderboard.find((l) => l.stageKey === stageKey && l.teamId === row.teamId);
                return (
                  <tr key={row.teamId}>
                    <td className="px-5 py-3 font-mono font-bold text-indigo-300 tabular-nums">#{row.rank}</td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {row.teamName} <span className="font-mono text-xs text-zinc-400">({row.teamCode})</span>
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-white tabular-nums">{row.score}</td>
                    <td className="px-5 py-3 text-right">
                      {rawEntry && (
                        <button
                          type="button"
                          onClick={() => removeLeaderboardScore(rawEntry.id)}
                          className="rounded border border-rose-500/40 px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-950/60"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-zinc-400">
                    No scores assigned for this stage yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
