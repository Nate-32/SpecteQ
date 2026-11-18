-- =============================================================================
-- SPECTEQ 2027 — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Run this script in your Supabase SQL Editor to provision all tables,
-- indexes, constraints, and strict RLS policies for 300+ concurrent users.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMINS
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function for RLS admin checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
$$;

-- 2. SITE CONFIG (Public read, admin write)
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TEAMS & TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_code TEXT UNIQUE NOT NULL,
  team_name TEXT UNIQUE NOT NULL,
  login_username TEXT UNIQUE NOT NULL,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('line-follower', 'maze-solver', 'self-balancing')),
  institution TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'disabled')),
  registration_complete BOOLEAN NOT NULL DEFAULT true,
  payment_status TEXT NOT NULL DEFAULT 'verified' CHECK (payment_status IN ('pending', 'verified', 'waived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_category ON public.teams(category);
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_auth_user ON public.teams(auth_user_id);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Member',
  is_leader BOOLEAN NOT NULL DEFAULT false,
  institution TEXT DEFAULT '',
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);

-- 4. DYNAMIC COMPETITION STAGES
CREATE TABLE IF NOT EXISTS public.stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  task_title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  guidelines_markdown TEXT NOT NULL DEFAULT '',
  start_date TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  estimated_duration TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT false,
  has_quiz BOOLEAN NOT NULL DEFAULT false,
  has_assignment BOOLEAN NOT NULL DEFAULT false,
  assignment_title TEXT DEFAULT '',
  assignment_instructions TEXT DEFAULT '',
  accepted_formats TEXT DEFAULT 'PDF, ZIP, GitHub URL, Drive Link',
  max_file_size_mb INTEGER DEFAULT 25,
  allow_resubmission BOOLEAN NOT NULL DEFAULT true,
  completion_rules JSONB NOT NULL DEFAULT '{"requireGuidelines": true, "requireQuizPass": false, "requireAssignment": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stage_team_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  guidelines_reviewed BOOLEAN NOT NULL DEFAULT false,
  completed_material_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('locked', 'upcoming', 'active', 'submitted', 'under_evaluation', 'completed')),
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stage_id, team_id)
);

-- 5. SCHEDULE TASKS
CREATE TABLE IF NOT EXISTS public.schedule_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Learning Phase',
  duration TEXT NOT NULL DEFAULT 'TBD',
  start_date TEXT NOT NULL DEFAULT 'TBD',
  end_date TEXT NOT NULL DEFAULT 'TBD',
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Active', 'Completed', 'Deadline Passed', 'Cancelled')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. QUIZ QUESTION BANK & STAGE QUIZZES
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'multi', 'true_false', 'short')),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT DEFAULT '',
  points INTEGER NOT NULL DEFAULT 2,
  topic TEXT DEFAULT 'General Robotics',
  difficulty TEXT DEFAULT 'Intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stage_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID UNIQUE NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'scheduled')),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  question_count INTEGER NOT NULL DEFAULT 5,
  points_per_question INTEGER NOT NULL DEFAULT 2,
  passing_score_pct INTEGER NOT NULL DEFAULT 60,
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  max_attempts INTEGER NOT NULL DEFAULT 1,
  randomize_questions BOOLEAN NOT NULL DEFAULT false,
  randomize_options BOOLEAN NOT NULL DEFAULT false,
  reveal_answers BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stage_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_quiz_id UUID NOT NULL REFERENCES public.stage_quizzes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (stage_quiz_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_quiz_id UUID NOT NULL REFERENCES public.stage_quizzes(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  total_possible INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('In Progress', 'Completed', 'Pending')),
  time_taken_seconds INTEGER DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_team ON public.quiz_attempts(team_id);

-- 7. LEADERBOARD SCORES (Hosted on public main website)
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_key TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  score NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stage_key, team_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_stage_score ON public.leaderboard_scores(stage_key, score DESC);

-- 8. MATERIALS, STAGE 3 EVENT & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES public.stages(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'all',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  resource_type TEXT NOT NULL DEFAULT 'PDF',
  url TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL DEFAULT 'link',
  content_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Not Started', 'In Progress', 'Submitted', 'Late Submission', 'Under Review', 'Accepted', 'Rejected', 'Revision Required')),
  admin_feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_team ON public.submissions(team_id);

-- 9. LIVE SESSIONS, ANNOUNCEMENTS, NOTIFICATIONS, SUPPORT, GALLERY, AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('line-follower', 'maze-solver', 'self-balancing')),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  title TEXT NOT NULL,
  meeting_link TEXT DEFAULT '',
  description TEXT DEFAULT '',
  session_date TEXT DEFAULT '',
  session_time TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stage_number, category)
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Important', 'Urgent')),
  attachment_url TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_scope TEXT NOT NULL DEFAULT 'all',
  target_value TEXT DEFAULT '',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_reads (
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (notification_id, team_id)
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'In Progress', 'Resolved')),
  admin_reply TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2026',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_team_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Safe public website content)
CREATE POLICY "Public read site_config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public read schedule_tasks" ON public.schedule_tasks FOR SELECT USING (true);
CREATE POLICY "Public read gallery_items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read leaderboard" ON public.leaderboard_scores FOR SELECT USING (true);
CREATE POLICY "Public read published stages" ON public.stages FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (is_published = true OR public.is_admin());

-- Team Member / Student Self-Access Policies
CREATE POLICY "Team reads own record" ON public.teams
  FOR SELECT USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Team reads own members" ON public.team_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Team updates own members" ON public.team_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Authenticated read enabled materials" ON public.materials
  FOR SELECT USING ((is_enabled = true AND auth.uid() IS NOT NULL) OR public.is_admin());

CREATE POLICY "Authenticated read enabled quizzes" ON public.stage_quizzes
  FOR SELECT USING (auth.uid() IS NOT NULL OR public.is_admin());

CREATE POLICY "Authenticated read stage quiz questions" ON public.stage_quiz_questions
  FOR SELECT USING (auth.uid() IS NOT NULL OR public.is_admin());

CREATE POLICY "Authenticated read quiz questions" ON public.quiz_questions
  FOR SELECT USING (auth.uid() IS NOT NULL OR public.is_admin());

CREATE POLICY "Team manages own quiz attempts" ON public.quiz_attempts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Team manages own submissions" ON public.submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Team manages own stage progress" ON public.stage_team_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Team reads live sessions for category" ON public.live_sessions
  FOR SELECT USING (
    (is_enabled = true AND EXISTS (SELECT 1 FROM public.teams t WHERE t.auth_user_id = auth.uid() AND t.category = live_sessions.category))
    OR public.is_admin()
  );

CREATE POLICY "Team reads active notifications" ON public.notifications
  FOR SELECT USING ((is_enabled = true AND auth.uid() IS NOT NULL) OR public.is_admin());

CREATE POLICY "Team manages own notification reads" ON public.notification_reads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Team manages own support tickets" ON public.support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.auth_user_id = auth.uid())
    OR public.is_admin()
  );

-- Admin Full Access Policies
CREATE POLICY "Admin full admins" ON public.admins FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full site_config" ON public.site_config FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full teams" ON public.teams FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full team_members" ON public.team_members FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full stages" ON public.stages FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full schedule_tasks" ON public.schedule_tasks FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full quiz_questions" ON public.quiz_questions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full stage_quizzes" ON public.stage_quizzes FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full stage_quiz_questions" ON public.stage_quiz_questions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full leaderboard" ON public.leaderboard_scores FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full materials" ON public.materials FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full live_sessions" ON public.live_sessions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full announcements" ON public.announcements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full notifications" ON public.notifications FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full gallery" ON public.gallery_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full activity_logs" ON public.activity_logs FOR ALL USING (public.is_admin());
