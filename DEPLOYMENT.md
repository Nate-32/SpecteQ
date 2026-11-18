# SpecteQ 2027 — Deployment & Supabase Setup Guide

## Architecture Overview
SpecteQ 2027 is engineered for **two-stage deployment** with zero code rewrites:
1. **Stage 1 (Team Preview):** GitHub Pages via `.github/workflows/deploy.yml`
2. **Stage 2 (Production):** Cloudflare Pages with `public/_redirects` & `functions/api/health.ts`

## 1. Supabase Configuration
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run `/supabase/schema.sql` to create all tables, indexes, and Row Level Security (RLS) policies.
3. In **Authentication -> Users**, create your initial Admin user and insert their `auth.users.id` into `public.admins`.
4. Copy `.env.example` to `.env` (or configure Repository/Pages environment variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_FORM_URL` (optional; shows "Registration details will be announced soon" if unset)
   - `VITE_COMMITTEE_EMAIL`

> **Security Note:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code or `VITE_*` variables. Use a Supabase Edge Function or Cloudflare Worker for privileged server-side team user provisioning in production.

## 2. Stage 1 — GitHub Pages Deployment
1. Push this repository to GitHub (`main` branch).
2. In **Settings -> Pages**, set Source to **GitHub Actions**.
3. Optionally add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_GOOGLE_FORM_URL` under **Settings -> Secrets and variables -> Actions -> Variables**.
4. The workflow in `.github/workflows/deploy.yml` automatically sets `VITE_BASE_PATH=/<repo-name>/`, runs `npm run lint` and `npm run build`, and deploys `dist/` with SPA `404.html` fallback support.

## 3. Stage 2 — Cloudflare Pages Production Deployment
1. Connect the repository in **Cloudflare Dashboard -> Workers & Pages -> Create -> Pages**.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Environment variables:
   - `VITE_BASE_PATH=/`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_FORM_URL`
5. SPA routing is handled automatically by `public/_redirects` (`/* /index.html 200`), and `/api/health` is served by `functions/api/health.ts`.
