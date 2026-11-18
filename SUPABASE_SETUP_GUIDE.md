# Beginner's Step-by-Step Guide: Setting Up Supabase for SpecteQ 2027

Follow these steps in order—no prior database experience required.

---

## Step 1: Create Your Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (sign in with GitHub).
2. Click **New Project**.
3. Choose an organization, set **Name** to `specteq-2027`, create a strong **Database Password** (save it somewhere safe), pick the region closest to your college/venue, and click **Create new project**.
4. Wait ~1–2 minutes until the green **"Project is ready"** status appears.

---

## Step 2: Run the Database Tables & Security Rules (`schema.sql`)
1. On the left sidebar of Supabase, click **SQL Editor** (the `>_` icon).
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, copy **all** of its contents, and paste it into the SQL Editor.
4. Click **Run** (bottom-right, or `Ctrl/Cmd + Enter`).
5. You should see **"Success. No rows returned"**.
   - This created all 21 database tables (`teams`, `team_members`, `stages`, `quiz_questions`, `stage_quizzes`, `quiz_attempts`, `leaderboard_scores`, `materials`, `submissions`, `live_sessions`, `notifications`, `announcements`, `support_tickets`, `gallery_items`, `activity_logs`, etc.) and enabled **Row Level Security (RLS)** so students can only see their own team data.

---

## Step 3: Set Up File Storage & Starter Data (`seed.sql`)
1. In **SQL Editor**, click **New query** again.
2. Open `supabase/seed.sql`, copy everything, paste it in, and click **Run**.
3. This creates 3 Storage buckets (`specteq-gallery`, `specteq-materials`, `specteq-submissions`), sets who can upload/read files, and inserts Stages 0–3 plus initial schedule items.

---

## Step 4: Create Your First Admin Account
1. On the left sidebar, click **Authentication** &rarr; **Users**.
2. Click **Add user** &rarr; **Create new user**.
3. Enter your Admin email (e.g., `admin@specteq.dev`) and a strong password, check **Auto Confirm User**, and click **Create user**.
4. Copy the **User UID** shown in the Users table (looks like `a1b2c3d4-...`).
5. Go back to **SQL Editor** &rarr; **New query**, paste this SQL (replacing the UID and email with yours), and click **Run**:
   ```sql
   INSERT INTO public.admins (id, email, display_name, role)
   VALUES (
     'PASTE-YOUR-USER-UID-HERE',
     'admin@specteq.dev',
     'SpecteQ Chief Admin',
     'super_admin'
   );
   ```
   Now you can sign into `/admin` using that email and password!

---

## Step 5: Connect the Website to Supabase (API Keys)
1. In Supabase, click **Project Settings** (gear icon at bottom-left) &rarr; **API** (or **Data API / API Keys**).
2. Copy two values:
   - **Project URL** (looks like `https://abcdefghijkl.supabase.co`)
   - **`anon` `public` key** (starts with `eyJ...`)
   > **IMPORTANT:** Never put the `service_role` secret key in your frontend `.env` or GitHub variables! Only use the public `anon` key.

3. **For Local Development**:
   Create a `.env` file in the root of your project (copy `.env.example`) and add:
   ```env
   VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```

4. **For GitHub Pages (Stage 1 Preview)**:
   In your GitHub repo &rarr; **Settings** &rarr; **Secrets and variables** &rarr; **Actions** &rarr; **Variables** tab &rarr; **New repository variable**:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your `anon` public key

5. **For Cloudflare Pages (Stage 2 Production)**:
   In Cloudflare Dashboard &rarr; your Pages project &rarr; **Settings** &rarr; **Environment variables**, add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Step 6: How Creating Student Team Accounts Works
- When an Admin creates a team in production Supabase, Supabase Auth requires either:
  1. Creating the team's login user in **Authentication &rarr; Users** (or via a Supabase Edge Function using `service_role` on the server) and linking `auth_user_id` in `public.teams`, **OR**
  2. Using the Admin Panel's **Register Team** form while building/previewing.
- Example SQL to link a Supabase Auth user to a team:
  ```sql
  INSERT INTO public.teams (team_code, team_name, login_username, auth_user_id, category, institution)
  VALUES (
    'SQ27-0101',
    'Vector Pulse',
    'vectorpulse',
    'PASTE-TEAM-AUTH-USER-UID-HERE',
    'line-follower',
    'Institute of Engineering'
  );
  ```
