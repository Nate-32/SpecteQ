import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';

const INTRO_SESSION_KEY = 'specteq_2027_intro_played';

export function CinematicIntro({onComplete}: {onComplete?: () => void}) {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 'done'>(() => {
    if (typeof window === 'undefined') return 'done';
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'done';
    if (sessionStorage.getItem(INTRO_SESSION_KEY) === '1') return 'done';
    return 1;
  });

  useEffect(() => {
    if (stage === 'done') {
      onComplete?.();
      return;
    }

    const t1 = window.setTimeout(() => setStage(2), 550);
    const t2 = window.setTimeout(() => setStage(3), 1250);
    const t3 = window.setTimeout(() => setStage(4), 2600);
    const t4 = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
      setStage('done');
      onComplete?.();
    }, 3350);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [stage === 'done', onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    setStage('done');
    onComplete?.();
  };

  if (stage === 'done') return null;

  const isSeparated = stage >= 2;
  const showTitle = stage >= 3;
  const isFading = stage === 4;

  return (
    <AnimatePresence>
      <motion.div
        key="specteq-intro"
        initial={{opacity: 1}}
        animate={{opacity: isFading ? 0 : 1}}
        transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#040711] px-6 overflow-hidden select-none"
        aria-label="SpecteQ 2027 Boot Sequence"
      >
        {/* Subtle radial arena glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.16)_0%,rgba(217,70,239,0.08)_36%,transparent_72%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 arena-grid-bg opacity-45" />

        {/* Centerpiece: S + 2 separation & SPECTEQ 2027 reveal */}
        <div className="relative flex flex-col items-center justify-center text-center max-w-3xl w-full">
          <div className="relative flex items-center justify-center min-h-[120px] w-full">
            {/* Left "S" Prism Symbol */}
            <motion.div
              initial={{x: 18, opacity: 0, scale: 0.88}}
              animate={{
                x: isSeparated ? -160 : 12,
                opacity: 1,
                scale: isSeparated ? 0.92 : 1.05,
              }}
              transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
              className="hidden sm:flex items-center justify-center"
            >
              <svg
                viewBox="0 0 64 64"
                className="h-16 w-16 drop-shadow-[0_0_18px_rgba(6,182,212,0.55)]"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="sqPrism" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#e879f9" />
                  </linearGradient>
                </defs>
                <polygon
                  points="32,6 58,52 6,52"
                  fill="none"
                  stroke="url(#sqPrism)"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <text
                  x="32"
                  y="44"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="22"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  S
                </text>
              </svg>
            </motion.div>

            {/* Center SPECTEQ 2027 Reveal */}
            <motion.div
              initial={{opacity: 0, scale: 0.92}}
              animate={{
                opacity: showTitle ? 1 : 0,
                scale: showTitle ? 1 : 0.92,
              }}
              transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
              className="flex flex-col items-center px-4"
            >
              <span className="font-display text-4xl sm:text-6xl font-extrabold tracking-[0.14em] text-white">
                SPECTE<span className="text-cyan-400">Q</span>{' '}
                <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
                  2027
                </span>
              </span>
            </motion.div>

            {/* Right "2" Symbol */}
            <motion.div
              initial={{x: -18, opacity: 0, scale: 0.88}}
              animate={{
                x: isSeparated ? 160 : -12,
                opacity: 1,
                scale: isSeparated ? 0.92 : 1.05,
              }}
              transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
              className="hidden sm:flex items-center justify-center"
            >
              <span className="font-display text-5xl font-extrabold text-fuchsia-400 drop-shadow-[0_0_16px_rgba(217,70,239,0.5)]">
                2
              </span>
            </motion.div>
          </div>

          {/* Mobile simplified centered S + 2 badge before title */}
          {!showTitle && (
            <div className="sm:hidden flex items-center gap-3 text-4xl font-display font-extrabold text-white">
              <span className="text-cyan-400">S</span>
              <span className="text-fuchsia-400">2</span>
            </div>
          )}

          {/* Tagline */}
          <motion.p
            initial={{opacity: 0, y: 8}}
            animate={{opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 8}}
            transition={{duration: 0.5, delay: 0.12}}
            className="mt-4 font-mono text-xs sm:text-sm tracking-[0.32em] text-cyan-300/90 uppercase"
          >
            ENGINEER · INNOVATE · COMPETE
          </motion.p>
        </div>

        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="fixed bottom-8 right-8 rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-cyan-400/60 hover:text-white transition-colors min-h-[44px]"
        >
          Skip Intro
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
