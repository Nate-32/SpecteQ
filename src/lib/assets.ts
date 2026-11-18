/**
 * Resolves asset paths cleanly across root deployments (Cloudflare Pages)
 * and repository subpath deployments (GitHub Pages e.g. /SpecteQ/).
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

export const SPECTEQ_ASSETS = {
  logoBanner: '/assets/aistudio/Typo_31699076.png',
  heroArenaBg: '/assets/aistudio/BG_7e539aca.png',
  vectorPack: '/assets/aistudio/vector_pack_beb78451.png',
  catLineFollower: '/src/assets/images/cat_line_follower_1795021276425.jpg',
  catMazeSolver: '/src/assets/images/cat_maze_solver_1795021275809.jpg',
  catSelfBalancing: '/src/assets/images/cat_self_balancing_1795021276525.jpg',
  galleryArenaFinals: '/src/assets/images/gallery_arena_finals_1795021277145.jpg',
  galleryHardwareBench: '/src/assets/images/gallery_hardware_bench_1795021278224.jpg',
  galleryWorkshopSession: '/src/assets/images/gallery_workshop_session_1795021277856.jpg',
} as const;
