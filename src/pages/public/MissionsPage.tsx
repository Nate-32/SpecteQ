import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, RefreshCw} from 'lucide-react';
import type {CategoryMeta} from '../../data/specteqData';
import {fetchMissionsApi, type ApiSource} from '../../lib/supabaseApi';
import {useSpecteQ} from '../../lib/store';
import {ResilientImage} from '../../components/ResilientImage';

export function MissionsPage() {
  const {missions: cachedMissions} = useSpecteQ();
  const [missions, setMissions] = useState<CategoryMeta[]>(cachedMissions);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<ApiSource>('fallback');
  const [apiError, setApiError] = useState<string | null>(null);

  const loadMissions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const res = await fetchMissionsApi();
    setMissions(res.missions);
    setSource(res.source);
    setApiError(res.error || null);

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadMissions(false);
  }, [loadMissions]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase">
            Competition Tracks · {source === 'supabase' ? 'Supabase Live API' : 'Official Catalog'}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            SpecteQ 2027 Missions
          </h1>
          <p className="mt-3 text-zinc-300 leading-relaxed">
            Select one of the three official robotics challenges. Each mission track pairs guided training sessions with hardware development and live arena competition.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadMissions(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#0b0d17] px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:border-indigo-400 transition-colors whitespace-nowrap shrink-0 min-h-[42px] disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-indigo-300 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing Missions...' : 'Refresh from API'}
        </button>
      </div>

      {apiError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-200">
          Live Supabase missions endpoint returned an error ({apiError}). Displaying cached official mission catalog.
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="hud-panel h-64 animate-pulse bg-[#0b0d17]" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {missions.map((cat) => (
            <article
              key={cat.slug}
              className="hud-panel grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch"
            >
              <div className="lg:col-span-5 bg-[#070810]">
                <ResilientImage
                  src={cat.image}
                  alt={cat.name}
                  className="h-64 lg:h-full w-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <p className="font-mono text-xs text-indigo-300">
                    {cat.code} · {cat.difficulty}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{cat.name}</h2>
                  <p className="text-zinc-300 leading-relaxed">{cat.shortDesc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                    <div>
                      <span className="font-mono text-xs text-zinc-400 uppercase block">Technical Skills</span>
                      <span className="mt-1 block text-zinc-200">{cat.skills.join(' · ')}</span>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-zinc-400 uppercase block">Ideal For</span>
                      <span className="mt-1 block text-zinc-200">{cat.idealFor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
                  <span className="text-xs text-zinc-400">{cat.specsNote}</span>
                  <Link
                    to={`/missions/${cat.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-indigo-50 transition-colors whitespace-nowrap min-h-[42px]"
                  >
                    Inspect Mission Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
