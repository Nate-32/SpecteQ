import {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronDown,
  Cpu,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Shield,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';
import {
  COMPETITION_CATEGORIES,
  FAQ_DATA,
  RULES_DATA,
  TECHNOLOGIES_GROUPS,
} from '../../data/specteqData';
import {SPECTEQ_ASSETS} from '../../lib/assets';
import {useSpecteQ} from '../../lib/store';
import {ContactCommitteeModal} from '../../components/ContactCommitteeModal';
import {ResilientImage} from '../../components/ResilientImage';

const JOURNEY_STAGES = [
  {
    code: 'LEVEL 00',
    term: 'INSERT COIN',
    realMeaning: 'Registration & Onboarding',
    description:
      'Create your Player profile, form your Gaming Team, choose your mission track, and prepare to enter SpecteQ.',
  },
  {
    code: 'LEVEL 01',
    term: 'TRAINING',
    realMeaning: 'Workshops & Learning Missions',
    description:
      'Learn the foundations, explore essential technologies, and prepare for your robotics challenge.',
  },
  {
    code: 'LEVEL 02',
    term: 'BUILD',
    realMeaning: 'Robot Development',
    description: 'Design, assemble, program, and improve your autonomous robot.',
  },
  {
    code: 'LEVEL 03',
    term: 'TEST',
    realMeaning: 'Testing, Debugging & Calibration',
    description: 'Test your robot, refine control performance, debug systems, and prepare for scrutiny.',
  },
  {
    code: 'FINAL',
    term: 'THE ROBOTICS ARENA',
    realMeaning: 'High Score Championship',
    description: 'Take your machine to the arena, compete, complete the challenge, and aim for the High Score.',
  },
];

const LEVEL_PROGRESSION = [
  {
    level: '00',
    title: 'LEVEL 00 — INSERT COIN',
    subtitle: 'Registration & Onboarding',
    deliverables: [
      'Submit Player and Gaming Team details via official registration',
      'Select preferred robotics mission category',
      'Receive team portal credentials and onboarding briefing',
    ],
    achievement: 'Coin Inserted · Player Onboarded',
  },
  {
    level: '01',
    title: 'LEVEL 01 — TRAINING',
    subtitle: 'Learn the Game · Training Missions',
    deliverables: [
      'Attend guided technical sessions and explore core robotics concepts',
      'Complete simulation and sensor calibration study materials',
      'Pass Stage 1 readiness assessment',
    ],
    achievement: 'Training Complete',
  },
  {
    level: '02',
    title: 'LEVEL 02 — BUILD',
    subtitle: 'Unlock Your Bot · Player Build',
    deliverables: [
      'Design and assemble mechanical chassis and power distribution',
      'Integrate IR/ultrasonic/IMU sensors and motor drivers',
      'Implement embedded firmware and run iterative bench tests',
    ],
    achievement: 'Bot Built',
  },
  {
    level: '03',
    title: 'LEVEL 03 — FINAL BOSS',
    subtitle: 'The Robotics Arena',
    deliverables: [
      'Pass hardware safety and category specification scrutiny',
      'Execute live timed runs inside the SpecteQ Robotics Arena',
      'Record official arena score for championship ranking',
    ],
    achievement: 'Mission Complete',
  },
];

export function HomePage() {
  const {schedule, siteConfig, gallery} = useSpecteQ();
  const [selectedJourney, setSelectedJourney] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [openRule, setOpenRule] = useState<string | null>('01');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [chosenMissionNote, setChosenMissionNote] = useState<string | null>(null);

  const featuredGallery = gallery.filter((g) => g.isFeatured).slice(0, 3);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="overflow-x-hidden">
      {/* SECTION 01 — HERO */}
      <section className="relative min-h-[86vh] flex items-center border-b border-slate-800/80 overflow-hidden">
        <ResilientImage
          src={SPECTEQ_ASSETS.heroArenaBg}
          alt="SpecteQ 2027 futuristic neon robotics arena backdrop"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#060913]/85 via-[#060913]/70 to-[#060913]"
        />
        <div aria-hidden="true" className="absolute inset-0 arena-grid-bg opacity-35" />

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-mono text-xs sm:text-sm tracking-[0.22em] text-cyan-300 uppercase">
              THE BOT COMPETITION · 2027 EDITION
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.06] text-balance">
              Specte<span className="text-cyan-400">Q</span> 2027
            </h1>
            <p className="font-display text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-300 via-slate-100 to-fuchsia-400 bg-clip-text text-transparent">
              Build. Battle. Dominate.
            </p>
            <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
              Enter the ultimate robotics arena. Learn, experiment, engineer your machines, and compete to achieve the highest score.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('registration')}
                className="hud-btn-primary inline-flex items-center gap-2 bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition-colors min-h-[46px]"
              >
                Enter the Arena
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('categories')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/75 px-6 py-3.5 text-sm font-semibold text-white hover:border-cyan-400/60 transition-colors min-h-[46px]"
              >
                Explore Missions
              </button>
            </div>
          </div>

          {/* Decorative Illustrative Game HUD Panel */}
          <div className="lg:col-span-5">
            <div className="hud-panel p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
                <span>PLAYER 01</span>
                <span>Season 2027 · Open Entry</span>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-800/90 bg-slate-950">
                <ResilientImage
                  src={SPECTEQ_ASSETS.logoBanner}
                  alt="SpecteQ 2027 Official Logo Banner"
                  loading="eager"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-1">
                <div className="rounded-md bg-slate-950/80 border border-slate-800 p-3">
                  <span className="block text-[11px] text-slate-400">STATUS</span>
                  <span className="mt-1 block font-bold text-cyan-300">{siteConfig.heroHudStatus}</span>
                </div>
                <div className="rounded-md bg-slate-950/80 border border-slate-800 p-3">
                  <span className="block text-[11px] text-slate-400">CURRENT LEVEL</span>
                  <span className="mt-1 block font-bold text-white tabular-nums">00 / 03</span>
                </div>
                <div className="rounded-md bg-slate-950/80 border border-slate-800 p-3">
                  <span className="block text-[11px] text-slate-400">MISSION</span>
                  <span className="mt-1 block font-bold text-amber-400">NOT STARTED</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Illustrative arena preview HUD. Registered teams track live stage progress inside the{' '}
                <Link to="/login" className="text-cyan-300 underline hover:text-cyan-200">
                  Participant Portal
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 — WHAT IS SPECTEQ? */}
      <section id="about" className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">01. Introduction</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white text-balance">
              What Is SpecteQ?
            </h2>
            <p className="mt-2 text-lg text-cyan-200/90 font-medium">
              An inclusive robotics competition for all skill levels.
            </p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              SpecteQ is a hands-on robotics competition where students learn, build, experiment, and compete. Participants move through structured training, robot development, testing, and arena challenges—turning engineering concepts into working machines.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="hud-panel p-6 space-y-3">
              <Users className="h-6 w-6 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white">College Competition</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Students come together across institutions to compete, collaborate, and showcase practical engineering skills.
              </p>
            </div>
            <div className="hud-panel p-6 space-y-3">
              <Cpu className="h-6 w-6 text-fuchsia-400" />
              <h3 className="font-display text-lg font-bold text-white">Robotics Competition</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Experience autonomous robotics through practical arena challenges, debugging, and live competition in a learning-while-competing environment.
              </p>
            </div>
            <div className="hud-panel p-6 space-y-3">
              <Wrench className="h-6 w-6 text-amber-400" />
              <h3 className="font-display text-lg font-bold text-white">Hands-On Learning</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore microcontrollers, sensor fusion, and motor control through guided training missions and real-world prototyping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — EXPLORE THE COMPETITION (3 CATEGORIES) */}
      <section id="categories" className="py-20 px-4 sm:px-6 bg-[#080d1b]/60 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-fuchsia-400 uppercase">02. Mission Tracks</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white text-balance">
                Explore the Competition
              </h2>
              <p className="mt-2 text-slate-300">
                Choose your challenge. Build your machine. Enter the arena.
              </p>
            </div>
            <Link
              to="/missions"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              Compare All Missions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COMPETITION_CATEGORIES.map((cat) => (
              <article
                key={cat.slug}
                className="hud-panel flex flex-col overflow-hidden group transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <ResilientImage
                    src={cat.image}
                    alt={`${cat.name} autonomous competition robot`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <p className="font-mono text-xs text-cyan-300">
                      {cat.code} · {cat.difficulty}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-white">{cat.name}</h3>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">{cat.shortDesc}</p>
                    <p className="mt-3 text-xs text-slate-400">
                      {cat.skills.slice(0, 4).join(' · ')}
                    </p>
                  </div>

                  <Link
                    to={`/missions/${cat.slug}`}
                    className="inline-flex items-center justify-between rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-400 hover:text-slate-950 transition-colors min-h-[42px]"
                  >
                    <span>Explore Mission</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04 — CATEGORY COMPARISON / CHOOSE YOUR MISSION */}
      <section className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">03. Track Comparison</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Choose Your Mission</h2>
          <p className="mt-2 text-slate-300">Every mission demands a different way of thinking.</p>

          {chosenMissionNote && (
            <div className="mt-6 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-4 py-3 text-sm text-cyan-100 flex flex-wrap items-center justify-between gap-3">
              <span>
                Selected preview track: <strong>{chosenMissionNote}</strong>. Final track selection is submitted during team registration.
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('registration')}
                className="rounded-md bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300"
              >
                Go to Registration
              </button>
            </div>
          )}

          {/* Responsive Comparison Cards (Desktop 3-col, Mobile stacked) */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COMPETITION_CATEGORIES.map((cat) => (
              <div key={cat.slug} className="rounded-xl border border-slate-800 bg-[#0b1120] p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-display text-xl font-bold text-white">{cat.name}</h3>
                    <span className="font-mono text-xs text-cyan-300">{cat.code}</span>
                  </div>

                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-mono text-xs text-slate-400 uppercase">Core Challenge</dt>
                      <dd className="mt-0.5 text-slate-200">{cat.coreChallenge}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-slate-400 uppercase">Key Skills</dt>
                      <dd className="mt-0.5 text-slate-300">{cat.skills.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-slate-400 uppercase">Learning Focus</dt>
                      <dd className="mt-0.5 text-slate-300">{cat.learningOutcomes.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-slate-400 uppercase">Difficulty</dt>
                      <dd className="mt-0.5 text-amber-300">{cat.difficulty}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-slate-400 uppercase">Ideal For</dt>
                      <dd className="mt-0.5 text-slate-300">{cat.idealFor}</dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => setChosenMissionNote(cat.name)}
                  className="w-full rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-2.5 text-sm font-semibold text-fuchsia-200 hover:bg-fuchsia-500 hover:text-white transition-colors min-h-[42px]"
                >
                  Choose this Mission
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 — PARTICIPANT JOURNEY */}
      <section id="journey" className="py-20 px-4 sm:px-6 bg-[#080d1b]/60 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">04. Player Flow</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Your Journey</h2>
          <p className="mt-2 text-slate-300">
            From first boot to High Score Champion — Players form Gaming Teams, complete Training Missions, unlock Levels, and compete in The Robotics Arena.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-3">
            {JOURNEY_STAGES.map((item, idx) => {
              const active = selectedJourney === idx;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedJourney(idx)}
                  className={`text-left rounded-xl border p-4 transition-colors min-h-[112px] ${
                    active
                      ? 'border-cyan-400 bg-cyan-950/35 text-white'
                      : 'border-slate-800 bg-[#0b1120] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-xs text-cyan-300 block">{item.code}</span>
                  <span className="mt-1 font-display text-base font-bold block">{item.term}</span>
                  <span className="mt-1 text-xs text-slate-400 block">{item.realMeaning}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 hud-panel p-6">
            <p className="font-mono text-xs text-fuchsia-300">
              {JOURNEY_STAGES[selectedJourney].code} · {JOURNEY_STAGES[selectedJourney].realMeaning}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              {JOURNEY_STAGES[selectedJourney].term}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{JOURNEY_STAGES[selectedJourney].description}</p>
          </div>
        </div>
      </section>

      {/* SECTION 06 — EVENT PROGRESSION / LEVEL SYSTEM */}
      <section className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-fuchsia-400 uppercase">05. Interactive Demo</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                Level Progression System
              </h2>
              <p className="mt-2 text-slate-300">
                Click any level to inspect deliverables and milestones along the SpecteQ player journey.
              </p>
            </div>
            <div className="font-mono text-xs text-cyan-300 border border-slate-800 rounded-lg bg-[#0b1120] px-4 py-2.5 tabular-nums">
              PREVIEW PROGRESS: LEVEL 0{selectedLevel} / 03 (Demo Preview Only)
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-3">
              {LEVEL_PROGRESSION.map((lvl, idx) => {
                const isSelected = selectedLevel === idx;
                return (
                  <button
                    key={lvl.level}
                    type="button"
                    onClick={() => setSelectedLevel(idx)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30'
                        : 'border-slate-800 bg-[#0b1120] hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-xs text-cyan-300">{lvl.title}</span>
                    <span className="mt-1 block text-sm font-semibold text-white">{lvl.subtitle}</span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 hud-panel-magenta p-6 sm:p-8 space-y-5">
              <div>
                <p className="font-mono text-xs text-fuchsia-300">
                  INSPECTING LEVEL {LEVEL_PROGRESSION[selectedLevel].level} · DEMO PREVIEW
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {LEVEL_PROGRESSION[selectedLevel].title}
                </h3>
                <p className="text-sm text-slate-300">{LEVEL_PROGRESSION[selectedLevel].subtitle}</p>
              </div>

              <div>
                <h4 className="font-mono text-xs text-slate-400 uppercase mb-2.5">Key Deliverables</h4>
                <ul className="space-y-2 text-sm text-slate-200">
                  {LEVEL_PROGRESSION[selectedLevel].deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <Layers className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-emerald-300">
                  Milestone: {LEVEL_PROGRESSION[selectedLevel].achievement}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLevel((prev) => (prev + 1) % LEVEL_PROGRESSION.length)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:border-cyan-400"
                >
                  Simulate Next Level (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — TECHNOLOGIES TO LEARN */}
      <section id="technologies" className="py-20 px-4 sm:px-6 bg-[#080d1b]/60 border-b border-slate-900 overflow-hidden">
        <div className="mx-auto max-w-7xl mb-10">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">06. Skill Stack</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
            Technologies to Learn
          </h2>
          <p className="mt-2 text-slate-300">
            Master essential robotics skills across embedded hardware, sensors, and autonomous control.
          </p>
        </div>

        {/* Continuous accessible marquee (pauses on hover, disabled under prefers-reduced-motion) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-5 animate-marquee-slow px-4">
            {[...TECHNOLOGIES_GROUPS, ...TECHNOLOGIES_GROUPS].map((group, i) => (
              <div
                key={`${group.group}-${i}`}
                className="w-72 shrink-0 rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-3"
              >
                <h3 className="font-display text-base font-bold text-cyan-300">{group.group}</h3>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 08 — READY TO CHOOSE CTA */}
      <section className="py-16 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="hud-panel p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2">
              <p className="font-mono text-xs text-cyan-300 uppercase">Mission Briefing Ready</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Ready to Choose Your Mission?
              </h2>
              <p className="text-slate-300">
                Choose your challenge, gather your Gaming Team, and get ready to enter the SpecteQ 2027 arena.
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('registration')}
              className="hud-btn-primary bg-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-fuchsia-400 transition-colors whitespace-nowrap shrink-0 min-h-[46px]"
            >
              Choose Your Mission
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 09 — EVENT TIMELINE */}
      <section id="timeline" className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">07. Milestones</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                Event Timeline & Milestones
              </h2>
              <p className="mt-2 text-slate-300">
                Follow the progression from initial registration through final championship awards.
              </p>
            </div>
            <span className="font-mono text-xs text-amber-300">
              Dates TBD · Configurable 2027 Schedule
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schedule.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300">{task.category}</span>
                  <span className="text-slate-400">{task.status}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">{task.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
                  <span>Start: {task.startDate}</span>
                  <span>Duration: {task.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — PRIZES & REWARDS */}
      <section id="rewards" className="py-20 px-4 sm:px-6 bg-[#080d1b]/60 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs tracking-[0.2em] text-fuchsia-400 uppercase">08. Recognition</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Prizes & Rewards</h2>
          <p className="mt-2 text-slate-300">
            Exceptional recognition for outstanding talent. Based on performance, participants may be shortlisted for certificates and cash prizes.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hud-panel p-7 space-y-4">
              <Award className="h-7 w-7 text-cyan-400" />
              <h3 className="font-display text-2xl font-bold text-white">Certificates</h3>
              <p className="text-sm text-slate-300">
                Recognized SpecteQ certificates for various levels of achievement:
              </p>
              <ul className="space-y-2 text-sm text-slate-200">
                <li>Participation Certificate</li>
                <li>Merit Certificate</li>
                <li>Excellence Certificate</li>
              </ul>
            </div>

            <div className="hud-panel-magenta p-7 space-y-4">
              <Trophy className="h-7 w-7 text-fuchsia-400" />
              <h3 className="font-display text-2xl font-bold text-white">Cash Prizes</h3>
              <p className="font-display text-2xl font-extrabold text-cyan-300 tabular-nums">
                Total prize pool up to ₹10,000
              </p>
              <p className="text-sm text-slate-300">Distributed among top-performing teams.</p>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                * Terms and conditions apply. Shortlisted candidates will be rewarded based on selection criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY PREVIEW (Separate Route CTA — full gallery NOT embedded here) */}
      <section className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">09. Visual Archive</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                Inside the Robotics Arena
              </h2>
              <p className="mt-2 text-slate-300">
                Explore highlights from arena finals, prototyping benches, and training workshops.
              </p>
            </div>
            <Link
              to="/gallery"
              className="hud-btn-primary inline-flex items-center gap-2 bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 min-h-[42px]"
            >
              <ImageIcon className="h-4 w-4" />
              Explore Full Gallery
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGallery.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group rounded-xl overflow-hidden border border-slate-800 bg-[#0b1120] hover:border-cyan-500/40 transition-colors"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-xs text-cyan-300">
                    {item.category} · {item.year}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold text-white">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — RULES & GUIDELINES */}
      <section id="rules" className="py-20 px-4 sm:px-6 bg-[#080d1b]/60 border-b border-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">10. Rulebook</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                Rules & Guidelines
              </h2>
              <p className="mt-2 text-slate-300">
                Fair play, safety, integrity, and respect are essential throughout SpecteQ.
              </p>
            </div>
            <Link to="/rules" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 whitespace-nowrap">
              View Dedicated Rules Page &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {RULES_DATA.map((rule) => {
              const isOpen = openRule === rule.number;
              return (
                <div key={rule.number} className="rounded-xl border border-slate-800 bg-[#0b1120] overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenRule(isOpen ? null : rule.number)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-900/60 transition-colors min-h-[56px]"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-cyan-300 block">
                        Rule {rule.number} · {rule.status}
                      </span>
                      <span className="font-display text-base sm:text-lg font-bold text-white">
                        {rule.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-cyan-300' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-800/80 px-5 py-4 bg-slate-950/50">
                      <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                        {rule.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-[#0b1120] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Questions about the rules? Need clarification?</p>
                <p className="text-sm text-slate-400">Reach out directly to the SpecteQ Organizing Committee.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="rounded-lg bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 min-h-[42px]"
            >
              Contact the Committee
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 border-b border-slate-900">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs tracking-[0.2em] text-fuchsia-400 uppercase">11. Support</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="rounded-xl border border-slate-800 bg-[#0b1120] overflow-hidden self-start">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-900/60 min-h-[54px]"
                  >
                    <span className="text-sm font-semibold text-white">{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-fuchsia-300' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-800/80 px-5 py-3.5 text-sm text-slate-300 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 13 — REGISTRATION / INSERT COIN / JOIN THE GAME */}
      <section id="registration" className="py-24 px-4 sm:px-6 arena-grid-bg">
        <div className="mx-auto max-w-4xl">
          <div className="hud-panel p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <p className="font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">
              LEVEL 00 · PLAYER ENTRY
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white text-balance">
              Insert Coin. Join the Game.
            </h2>
            <p className="mx-auto max-w-2xl text-slate-300 leading-relaxed">
              Register your Player profile and Gaming Team to begin your SpecteQ journey. Choose your mission and get ready to enter the arena.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-4">
                <span className="font-mono text-xs text-slate-400 block">Team Composition</span>
                <span className="mt-1 block text-sm font-medium text-white">{siteConfig.teamSizeNote}</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-4">
                <span className="font-mono text-xs text-slate-400 block">Registration Fee</span>
                <span className="mt-1 block text-sm font-medium text-white">{siteConfig.registrationFeeNote}</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-4">
                <span className="font-mono text-xs text-slate-400 block">Available Tracks</span>
                <span className="mt-1 block text-sm font-medium text-white">
                  Line Follower · Maze Solver · Self Balancing
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {siteConfig.googleFormUrl ? (
                <a
                  href={siteConfig.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hud-btn-primary inline-flex items-center gap-2 bg-cyan-400 px-8 py-4 text-sm font-extrabold text-slate-950 hover:bg-cyan-300 transition-colors min-h-[48px]"
                >
                  Register Your Team Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="hud-btn-primary inline-flex items-center gap-2 bg-slate-800 px-8 py-4 text-sm font-bold text-slate-400 cursor-not-allowed min-h-[48px]"
                  >
                    Registration Details Will Be Announced Soon
                  </button>
                  <p className="text-xs text-slate-400">
                    Official Google Form URL can be configured by administrators in Admin Settings or{' '}
                    <code className="font-mono text-cyan-300">VITE_GOOGLE_FORM_URL</code>.
                  </p>
                </div>
              )}

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm font-semibold text-white hover:border-cyan-400 transition-colors min-h-[48px]"
              >
                <BookOpen className="h-4 w-4 text-cyan-300" />
                Already Registered? Portal Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactCommitteeModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
