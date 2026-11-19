const LEGACY_TO_OPTIMIZED: Record<string, string> = {
  '/assets/aistudio/Typo_31699076.png': '/assets/optimized/Typo_31699076.webp',
  '/assets/aistudio/BG_7e539aca.png': '/assets/optimized/BG_7e539aca.webp',
  '/assets/aistudio/vector_pack_beb78451.png': '/assets/optimized/vector_pack_beb78451.webp',
  '/src/assets/images/cat_line_follower_1795021276425.jpg': '/assets/optimized/cat_line_follower.webp',
  '/src/assets/images/cat_maze_solver_1795021275809.jpg': '/assets/optimized/cat_maze_solver.webp',
  '/src/assets/images/cat_self_balancing_1795021276525.jpg': '/assets/optimized/cat_self_balancing.webp',
  '/src/assets/images/gallery_arena_finals_1795021277145.jpg': '/assets/optimized/gallery_arena_finals.webp',
  '/src/assets/images/gallery_hardware_bench_1795021278224.jpg': '/assets/optimized/gallery_hardware_bench.webp',
  '/src/assets/images/gallery_workshop_session_1795021277856.jpg': '/assets/optimized/gallery_workshop_session.webp',
};

/**
 * Resolves asset paths cleanly across root deployments (Cloudflare Pages)
 * and repository subpath deployments (GitHub Pages e.g. /SpecteQ/).
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const optimizedPath = LEGACY_TO_OPTIMIZED[path] || path;
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = optimizedPath.startsWith('/') ? optimizedPath.slice(1) : optimizedPath;
  return `${normalizedBase}${normalizedPath}`;
}

export const SPECTEQ_ASSETS = {
  logoBanner: '/assets/optimized/Typo_31699076.webp',
  heroArenaBg: '/assets/optimized/BG_7e539aca.webp',
  vectorPack: '/assets/optimized/vector_pack_beb78451.webp',
  catLineFollower: '/assets/optimized/cat_line_follower.webp',
  catMazeSolver: '/assets/optimized/cat_maze_solver.webp',
  catSelfBalancing: '/assets/optimized/cat_self_balancing.webp',
  galleryArenaFinals: '/assets/optimized/gallery_arena_finals.webp',
  galleryHardwareBench: '/assets/optimized/gallery_hardware_bench.webp',
  galleryWorkshopSession: '/assets/optimized/gallery_workshop_session.webp',
} as const;

let preloaded = false;

export function preloadCriticalAssets(): void {
  if (preloaded || typeof window === 'undefined') return;
  preloaded = true;

  const priorityList = [
    SPECTEQ_ASSETS.heroArenaBg,
    SPECTEQ_ASSETS.logoBanner,
    SPECTEQ_ASSETS.catLineFollower,
    SPECTEQ_ASSETS.catMazeSolver,
    SPECTEQ_ASSETS.catSelfBalancing,
    SPECTEQ_ASSETS.galleryWorkshopSession,
  ];

  for (const path of priorityList) {
    const img = new Image();
    img.decoding = 'async';
    img.src = assetUrl(path);
    if (typeof img.decode === 'function') {
      img.decode().catch(() => {});
    }
  }
}
