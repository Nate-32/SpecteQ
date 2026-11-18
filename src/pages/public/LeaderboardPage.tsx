import {useState} from 'react';
import {Search, Trophy} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {useSpecteQ} from '../../lib/store';
import type {CategorySlug} from '../../types/specteq';

const STAGE_OPTIONS = [
  {key: 'stage-0', label: 'Stage 0 · Onboarding'},
  {key: 'stage-1', label: 'Stage 1 · Training'},
  {key: 'stage-2', label: 'Stage 2 · Hardware Build'},
  {key: 'stage-3', label: 'Stage 3 · Final Arena'},
];

export function LeaderboardPage() {
  const {getRankedLeaderboard} = useSpecteQ();
  const [stageKey, setStageKey] = useState('stage-1');
  const [categoryFilter, setCategoryFilter] = useState<CategorySlug | 'all'>('all');
  const [search, setSearch] = useState('');

  const ranked = getRankedLeaderboard(stageKey, categoryFilter).filter(
    (row) =>
      row.teamName.toLowerCase().includes(search.trim().toLowerCase()) ||
      row.teamCode.toLowerCase().includes(search.trim().toLowerCase())
  );

  const getCategoryLabel = (slug: CategorySlug) =>
    COMPETITION_CATEGORIES.find((c) => c.slug === slug)?.name || slug;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase">Official Standings</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Arena Leaderboard
          </h1>
          <p className="mt-2 text-zinc-300">
            Stage-wise team rankings calculated automatically from verified competition scores.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team or ID..."
            aria-label="Search leaderboard teams"
            className="w-full rounded-lg border border-zinc-800 bg-[#0b0d17] pl-9 pr-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Stage & Category Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
          {STAGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStageKey(opt.key)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                stageKey === opt.key
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              categoryFilter === 'all' ? 'bg-fuchsia-600 text-white' : 'text-zinc-300 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {COMPETITION_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategoryFilter(c.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === c.slug ? 'bg-fuchsia-600 text-white' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {ranked.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-14 text-center space-y-3">
          <Trophy className="h-10 w-10 text-zinc-500 mx-auto" />
          <h2 className="font-display text-xl font-bold text-white">No scores published for this stage yet</h2>
          <p className="text-sm text-zinc-400">
            Scores appear automatically once verified by the SpecteQ Organizing Committee.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-[#070810] font-mono text-xs text-zinc-400 uppercase">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Team ID</th>
                <th className="px-5 py-3.5">Gaming Team</th>
                <th className="px-5 py-3.5">Mission Category</th>
                <th className="px-5 py-3.5 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {ranked.map((entry) => (
                <tr key={entry.teamId} className="hover:bg-zinc-900/45 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold tabular-nums text-indigo-300">
                    #{String(entry.rank).padStart(2, '0')}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-400 tabular-nums">{entry.teamCode}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">{entry.teamName}</td>
                  <td className="px-5 py-3.5 text-zinc-300">{getCategoryLabel(entry.category)}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-white tabular-nums">
                    {entry.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
