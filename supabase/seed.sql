-- =============================================================================
-- SPECTEQ 2027 — STORAGE BUCKETS & INITIAL SEED DATA
-- =============================================================================
-- Run this AFTER running supabase/schema.sql.

-- 1. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('specteq-gallery', 'specteq-gallery', true),
  ('specteq-materials', 'specteq-materials', true),
  ('specteq-submissions', 'specteq-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE SECURITY POLICIES
CREATE POLICY "Public read gallery & materials"
ON storage.objects FOR SELECT
USING (bucket_id IN ('specteq-gallery', 'specteq-materials'));

CREATE POLICY "Admin upload gallery & materials"
ON storage.objects FOR ALL
USING (
  bucket_id IN ('specteq-gallery', 'specteq-materials')
  AND public.is_admin()
);

CREATE POLICY "Authenticated teams upload submissions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'specteq-submissions'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Teams & admins read submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'specteq-submissions'
  AND (auth.uid() = owner OR public.is_admin())
);

-- 3. SEED INITIAL COMPETITION STAGES
INSERT INTO public.stages (stage_number, slug, title, task_title, description, is_published, is_active, has_quiz, has_assignment)
VALUES
  (0, 'stage-0-onboarding', 'Stage 0 · Insert Coin & Foundations', 'Player Onboarding & Robotics Fundamentals', 'Complete team profile verification, review safety rules, and pass the Stage 0 readiness quiz.', true, true, true, false),
  (1, 'stage-1-simulation-control', 'Stage 1 · Training Missions & Control', 'PID Tuning, Sensor Calibration & Simulation', 'Explore PID feedback loops, Wokwi simulation, and sensor calibration.', true, true, true, true),
  (2, 'stage-2-hardware-build', 'Stage 2 · Hardware Build & Scrutiny', 'Chassis Assembly, Wiring & Bench Testing', 'Assemble physical robot, wire motor drivers safely, and submit bench-test video.', true, false, false, true),
  (3, 'stage-3-robotics-arena', 'Stage 3 · Final Robotics Arena', 'Live Arena Trials & High Score Championship', 'Compete live inside the SpecteQ 2027 Robotics Arena.', false, false, false, false)
ON CONFLICT (stage_number) DO NOTHING;

-- 4. SEED INITIAL SCHEDULE TASKS
INSERT INTO public.schedule_tasks (title, description, category, duration, start_date, end_date, status, sort_order)
VALUES
  ('01 · Registration Opens', 'Gaming Teams submit official registration details and choose a mission track.', 'Registration', 'TBD', 'TBD', 'TBD', 'Active', 1),
  ('02 · Player Onboarding & Inauguration', 'Team portal credentials issued and Stage 0 safety briefing.', 'Registration', '2 Days', 'TBD', 'TBD', 'Upcoming', 2),
  ('03 · Training Missions (Stage 1)', 'Technical workshops covering PID control, Wokwi simulation, and sensors.', 'Learning Phase', '2 Weeks', 'TBD', 'TBD', 'Upcoming', 3),
  ('04 · Hardware Build & Prototyping', 'Teams assemble physical chassis and calibrate firmware.', 'Implementation', '3 Weeks', 'TBD', 'TBD', 'Upcoming', 4),
  ('05 · Testing & Scrutiny Checks', 'Pre-arena hardware inspection and track calibration slots.', 'Implementation', '3 Days', 'TBD', 'TBD', 'Upcoming', 5),
  ('06 · Final Robotics Arena & Awards', 'Live championship runs followed by High Score Champion awards.', 'Final Phase', '1 Day', 'TBD', 'TBD', 'Upcoming', 6);

-- 5. SEED DEFAULT SITE CONFIG
INSERT INTO public.site_config (key, value)
VALUES (
  'main',
  '{
    "eventTitle": "SpecteQ 2027",
    "registrationOpen": true,
    "googleFormUrl": "",
    "committeeEmail": "committee@specteq2027.example",
    "venueText": "TBD — Official 2027 Arena Venue To Be Announced"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
