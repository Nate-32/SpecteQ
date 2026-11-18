// Cloudflare Pages Function — Health & Public Config Check
// Automatically served at /api/health when deployed on Cloudflare Pages.

interface Env {
  VITE_SUPABASE_URL?: string;
}

export const onRequestGet = async (context: {env: Env}) => {
  return new Response(
    JSON.stringify({
      service: 'specteq-2027-edge',
      status: 'operational',
      supabaseConfigured: Boolean(context.env.VITE_SUPABASE_URL),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    }
  );
};
