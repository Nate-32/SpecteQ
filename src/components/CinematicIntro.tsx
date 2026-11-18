import {useEffect, useRef, useState} from 'react';
import {motion} from 'motion/react';

export type IntroPhase = 'playing' | 'landing' | 'done';

interface CinematicIntroProps {
  active: boolean;
  onPhaseChange: (phase: IntroPhase) => void;
}

export function CinematicIntro({active, onPhaseChange}: CinematicIntroProps) {
  // Stage 1: "S" and "Q" centered together
  // Stage 2: "S" slides left & "Q" slides right (opening the gap)
  // Stage 3: "pecte" reveals between S and Q -> forming "SpecteQ"
  // Stage 4: "2027" + flare lines + tagline animate in below "SpecteQ"
  // Stage 5: Entire lockup glides to Hero position while website comes to life
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 'done'>(1);
  const [pecteWidth, setPecteWidth] = useState<number>(210);
  const [landingDelta, setLandingDelta] = useState<{x: number; y: number; scale: number}>({
    x: -140,
    y: -110,
    scale: 1,
  });

  const lockupRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  useEffect(() => {
    if (!active) {
      setStage('done');
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setStage('done');
      onPhaseChangeRef.current('done');
      return;
    }

    const measurePecte = () => {
      if (measureRef.current) {
        const w = measureRef.current.getBoundingClientRect().width;
        if (w > 10) setPecteWidth(w);
      }
    };

    measurePecte();
    document.fonts?.ready?.then(measurePecte);

    setStage(1);
    onPhaseChangeRef.current('playing');

    const t1 = window.setTimeout(() => {
      measurePecte();
      setStage(2);
    }, 620);
    const t2 = window.setTimeout(() => setStage(3), 1320);
    const t3 = window.setTimeout(() => setStage(4), 1980);
    const t4 = window.setTimeout(() => {
      const targetEl = document.querySelector('[data-hero-lockup="specteq"]');
      const introEl = lockupRef.current;
      if (targetEl && introEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const introRect = introEl.getBoundingClientRect();
        const dx = targetRect.left + targetRect.width / 2 - (introRect.left + introRect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (introRect.top + introRect.height / 2);
        const scaleRatio =
          introRect.width > 0 ? Math.min(1.15, Math.max(0.7, targetRect.width / introRect.width)) : 1;
        setLandingDelta({x: dx, y: dy, scale: scaleRatio});
      }
      setStage(5);
      onPhaseChangeRef.current('landing');
    }, 2880);

    const t5 = window.setTimeout(() => {
      setStage('done');
      onPhaseChangeRef.current('done');
    }, 3760);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, [active]);

  const handleSkip = () => {
    setStage('done');
    onPhaseChangeRef.current('done');
  };

  if (!active || stage === 'done') return null;

  const isSeparated = stage >= 2;
  const showMiddle = stage >= 3;
  const showYear = stage >= 4;
  const isLanding = stage === 5;

  return (
    <motion.div
      key="specteq-intro-overlay"
      initial={{opacity: 1}}
      animate={{opacity: 1}}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 overflow-hidden select-none pointer-events-auto"
      aria-label="SpecteQ 2027 Entrance Sequence"
    >
      {/* Hidden exact-font measurer for "pecte" so S & Q expand to the exact final width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="specteq-hero-text text-5xl sm:text-7xl lg:text-[5.1rem] leading-[0.95] fixed -top-[999px] left-0 opacity-0 pointer-events-none whitespace-nowrap"
      >
        pecte
      </span>

      {/* Obsidian backdrop that fades out on Stage 5 so the main website comes to life underneath */}
      <motion.div
        aria-hidden="true"
        initial={{opacity: 1}}
        animate={{opacity: isLanding ? 0 : 1}}
        transition={{duration: 0.78, ease: [0.22, 1, 0.36, 1]}}
        className="absolute inset-0 bg-[#05060b]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,rgba(192,38,211,0.1)_40%,transparent_74%)]" />
        <div className="pointer-events-none absolute inset-0 arena-grid-bg opacity-40" />
      </motion.div>

      {/* Main Lockup: Stage 1 (SQ) -> Stage 2 (S   Q) -> Stage 3 (SpecteQ) -> Stage 4 (2027) -> Stage 5 (Glides to Hero) */}
      <motion.div
        ref={lockupRef}
        initial={{x: 0, y: 0, scale: 1, opacity: 1}}
        animate={
          isLanding
            ? {x: landingDelta.x, y: landingDelta.y, scale: landingDelta.scale, opacity: 1}
            : {x: 0, y: 0, scale: 1, opacity: 1}
        }
        transition={
          isLanding
            ? {duration: 0.85, ease: [0.22, 1, 0.36, 1]}
            : {duration: 0.4}
        }
        className="relative z-10 flex flex-col items-center justify-center text-center"
      >
        {/* Row 1: S + [pecte] + Q */}
        <motion.div
          initial={{opacity: 0, scale: 0.88}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
          className="specteq-hero-skew inline-flex items-baseline justify-center leading-[0.95] pl-1 pr-4"
        >
          <span className="specteq-hero-text text-5xl sm:text-7xl lg:text-[5.1rem] leading-[0.95]">
            S
          </span>

          <motion.span
            initial={{width: 0, opacity: 0, scale: 0.86, filter: 'blur(6px)'}}
            animate={{
              width: isSeparated ? pecteWidth : 0,
              opacity: showMiddle ? 1 : 0,
              scale: showMiddle ? 1 : 0.86,
              filter: showMiddle ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{
              width: {duration: 0.65, ease: [0.16, 1, 0.3, 1]},
              opacity: {duration: 0.48, ease: 'easeOut'},
              scale: {duration: 0.52, ease: [0.16, 1, 0.3, 1]},
              filter: {duration: 0.48, ease: 'easeOut'},
            }}
            style={{overflow: showMiddle ? 'visible' : 'hidden'}}
            className="inline-block whitespace-nowrap align-baseline"
          >
            <span className="specteq-hero-text text-5xl sm:text-7xl lg:text-[5.1rem] leading-[0.95]">
              pecte
            </span>
          </motion.span>

          <span className="specteq-hero-text text-5xl sm:text-7xl lg:text-[5.1rem] leading-[0.95]">
            Q
          </span>
        </motion.div>

        {/* Row 2: Styled "2027" + outward flare lines appearing below SpecteQ on Stage 4 */}
        <div className="mt-3 flex items-center justify-center gap-4 w-full min-h-[28px]">
          <motion.span
            initial={{scaleX: 0, opacity: 0}}
            animate={showYear ? {scaleX: 1, opacity: 1} : {scaleX: 0, opacity: 0}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            style={{transformOrigin: 'right center'}}
            className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-fuchsia-500/90 to-indigo-400"
          />

          <motion.span
            initial={{opacity: 0, y: 12, scale: 0.82, letterSpacing: '0.75em'}}
            animate={
              showYear
                ? {opacity: 1, y: 0, scale: 1, letterSpacing: '0.42em'}
                : {opacity: 0, y: 12, scale: 0.82, letterSpacing: '0.75em'}
            }
            transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
            className="specteq-hero-year text-xl sm:text-2xl leading-none pr-1"
          >
            2027
          </motion.span>

          <motion.span
            initial={{scaleX: 0, opacity: 0}}
            animate={showYear ? {scaleX: 1, opacity: 1} : {scaleX: 0, opacity: 0}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            style={{transformOrigin: 'left center'}}
            className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-indigo-400 to-fuchsia-500/90"
          />
        </div>

        {/* Row 3: Tagline reveal */}
        <motion.p
          initial={{opacity: 0, y: 8}}
          animate={showYear ? {opacity: 1, y: 0} : {opacity: 0, y: 8}}
          transition={{duration: 0.45, delay: 0.16, ease: 'easeOut'}}
          className="pt-3 font-mono text-xs tracking-[0.32em] text-zinc-400 uppercase"
        >
          ENGINEER · INNOVATE · COMPETE
        </motion.p>
      </motion.div>

      {/* Skip Intro */}
      <motion.button
        type="button"
        onClick={handleSkip}
        animate={{opacity: isLanding ? 0 : 1}}
        transition={{duration: 0.25}}
        className="fixed bottom-8 right-8 z-20 rounded-lg border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-xs font-medium text-zinc-200 hover:border-indigo-400/60 hover:text-white transition-colors min-h-[44px]"
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
}
