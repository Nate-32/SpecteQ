import {Link, useParams} from 'react-router-dom';
import {ArrowLeft, ArrowRight, CheckCircle2, Info} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {ResilientImage} from '../../components/ResilientImage';

export function MissionDetailPage() {
  const {slug} = useParams<{slug: string}>();
  const category = COMPETITION_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white">Mission Track Not Found</h1>
        <p className="text-slate-400">Choose one of the official SpecteQ 2027 robotics categories.</p>
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950"
        >
          Back to Missions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-10">
      <Link
        to="/missions"
        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All Competition Missions
      </Link>

      <div className="hud-panel grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch">
        <div className="lg:col-span-5 bg-slate-950">
          <ResilientImage
            src={category.image}
            alt={category.name}
            loading="eager"
            className="h-72 lg:h-full w-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
          <p className="font-mono text-xs text-cyan-300">
            {category.code} · {category.difficulty}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{category.name}</h1>
          <p className="text-slate-300 leading-relaxed">{category.shortDesc}</p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3 text-sm text-amber-100">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{category.specsNote}</span>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="hud-btn-primary inline-flex items-center gap-2 bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 min-h-[44px]"
            >
              Register for This Track
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/rules"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:border-cyan-400 min-h-[44px]"
            >
              Read Official Rules
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Core Engineering Challenge</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{category.coreChallenge}</p>
          <h3 className="font-mono text-xs text-cyan-300 uppercase pt-2">Technologies & Skills Covered</h3>
          <ul className="space-y-2 text-sm text-slate-200">
            {category.skills.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Learning Outcomes & Fit</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            {category.learningOutcomes.map((o) => (
              <li key={o} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-fuchsia-400 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-800 pt-4">
            <span className="font-mono text-xs text-slate-400 uppercase block">Ideal Participant Profile</span>
            <p className="mt-1 text-sm text-slate-200">{category.idealFor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
