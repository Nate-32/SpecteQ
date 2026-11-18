import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {ResilientImage} from '../../components/ResilientImage';

export function MissionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 space-y-12">
      <div className="max-w-3xl">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">Competition Tracks</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
          SpecteQ 2027 Missions
        </h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          Select one of the three official robotics challenges. Each mission track pairs guided training sessions with hardware development and live arena competition.
        </p>
      </div>

      <div className="space-y-8">
        {COMPETITION_CATEGORIES.map((cat) => (
          <article
            key={cat.slug}
            className="hud-panel grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch"
          >
            <div className="lg:col-span-5 bg-slate-950">
              <ResilientImage
                src={cat.image}
                alt={cat.name}
                className="h-64 lg:h-full w-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="font-mono text-xs text-cyan-300">
                  {cat.code} · {cat.difficulty}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{cat.name}</h2>
                <p className="text-slate-300 leading-relaxed">{cat.shortDesc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                  <div>
                    <span className="font-mono text-xs text-slate-400 uppercase block">Technical Skills</span>
                    <span className="mt-1 block text-slate-200">{cat.skills.join(' · ')}</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 uppercase block">Ideal For</span>
                    <span className="mt-1 block text-slate-200">{cat.idealFor}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">{cat.specsNote}</span>
                <Link
                  to={`/missions/${cat.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors whitespace-nowrap min-h-[42px]"
                >
                  Inspect Mission Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
