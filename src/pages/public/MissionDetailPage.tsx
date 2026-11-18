import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ArrowLeft, ArrowRight, CheckCircle2, Info} from 'lucide-react';
import type {CategoryMeta} from '../../data/specteqData';
import {fetchMissionBySlugApi, type ApiSource} from '../../lib/supabaseApi';
import {useSpecteQ} from '../../lib/store';
import {ResilientImage} from '../../components/ResilientImage';

export function MissionDetailPage() {
  const {slug} = useParams<{slug: string}>();
  const {missions} = useSpecteQ();
  const initialMatch = missions.find((c) => c.slug === slug) || null;
  const [category, setCategory] = useState<CategoryMeta | null>(initialMatch);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<ApiSource>('fallback');

  useEffect(() => {
    let active = true;
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMissionBySlugApi(slug).then((res) => {
      if (!active) return;
      setCategory(res.mission);
      setSource(res.source);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading && !category) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="hud-panel h-80 animate-pulse bg-[#0b0d17]" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white">Mission Track Not Found</h1>
        <p className="text-zinc-400">Choose one of the official SpecteQ 2027 robotics categories.</p>
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-indigo-50"
        >
          Back to Missions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          <ArrowLeft className="h-4 w-4" />
          All Competition Missions
        </Link>
        <span className="font-mono text-xs text-zinc-500">
          {source === 'supabase' ? 'Synced from Supabase API' : 'Official Catalog'}
        </span>
      </div>

      <div className="hud-panel grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch">
        <div className="lg:col-span-5 bg-[#070810]">
          <ResilientImage
            src={category.image}
            alt={category.name}
            loading="eager"
            className="h-72 lg:h-full w-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
          <p className="font-mono text-xs text-indigo-300">
            {category.code} · {category.difficulty}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{category.name}</h1>
          <p className="text-zinc-300 leading-relaxed">{category.shortDesc}</p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3 text-sm text-amber-100">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{category.specsNote}</span>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="hud-btn-primary inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-indigo-50 min-h-[44px]"
            >
              Register for This Track
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/rules"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:border-indigo-400 min-h-[44px]"
            >
              Read Official Rules
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Core Engineering Challenge</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">{category.coreChallenge}</p>
          <h3 className="font-mono text-xs text-indigo-300 uppercase pt-2">Technologies & Skills Covered</h3>
          <ul className="space-y-2 text-sm text-zinc-200">
            {category.skills.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Learning Outcomes & Fit</h2>
          <ul className="space-y-2 text-sm text-zinc-200">
            {category.learningOutcomes.map((o) => (
              <li key={o} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-fuchsia-400 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-zinc-800 pt-4">
            <span className="font-mono text-xs text-zinc-400 uppercase block">Ideal Participant Profile</span>
            <p className="mt-1 text-sm text-zinc-200">{category.idealFor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
