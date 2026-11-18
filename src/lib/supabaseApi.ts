import {
  COMPETITION_CATEGORIES,
  type CategoryMeta,
  INITIAL_SCHEDULE,
  INITIAL_SITE_CONFIG,
  INITIAL_STAGE3_EVENT,
  INITIAL_STAGES,
} from '../data/specteqData';
import type {
  CategorySlug,
  CompetitionStage,
  ScheduleCategory,
  ScheduleStatus,
  ScheduleTask,
  SiteConfig,
  Stage3EventConfig,
} from '../types/specteq';
import {getSupabaseClient} from './supabase';

export type ApiSource = 'supabase' | 'fallback';

export interface MissionsApiResult {
  missions: CategoryMeta[];
  source: ApiSource;
  error?: string;
}

export interface MissionDetailApiResult {
  mission: CategoryMeta | null;
  source: ApiSource;
  error?: string;
}

export interface ArenaApiResult {
  stage3Event: Stage3EventConfig;
  schedule: ScheduleTask[];
  stages: CompetitionStage[];
  siteConfig: SiteConfig;
  activeSessionCount: number;
  source: ApiSource;
  error?: string;
}

function mapMissionRow(row: Record<string, unknown>): CategoryMeta {
  const slug = (row.slug as CategorySlug) || 'line-follower';
  const fallback = COMPETITION_CATEGORIES.find((c) => c.slug === slug);
  return {
    slug,
    code: String(row.code || fallback?.code || 'MISSION'),
    name: String(row.name || fallback?.name || slug),
    shortDesc: String(row.short_desc || fallback?.shortDesc || ''),
    coreChallenge: String(row.core_challenge || fallback?.coreChallenge || ''),
    skills: Array.isArray(row.skills) ? row.skills.map(String) : fallback?.skills || [],
    learningOutcomes: Array.isArray(row.learning_outcomes)
      ? row.learning_outcomes.map(String)
      : fallback?.learningOutcomes || [],
    difficulty: String(row.difficulty || fallback?.difficulty || 'TBD'),
    idealFor: String(row.ideal_for || fallback?.idealFor || ''),
    image: String(row.image_url || fallback?.image || ''),
    specsNote: String(row.specs_note || fallback?.specsNote || ''),
  };
}

function mapScheduleRow(row: Record<string, unknown>, idx: number): ScheduleTask {
  return {
    id: String(row.id || `sch-${idx}`),
    title: String(row.title || 'Competition Milestone'),
    description: String(row.description || ''),
    category: (row.category as ScheduleCategory) || 'Learning Phase',
    duration: String(row.duration || 'TBD'),
    startDate: String(row.start_date || 'TBD'),
    endDate: String(row.end_date || 'TBD'),
    status: (row.status as ScheduleStatus) || 'Upcoming',
    sortOrder: Number(row.sort_order ?? idx + 1),
  };
}

function mapStageRow(row: Record<string, unknown>, idx: number): CompetitionStage {
  const num = Number(row.stage_number ?? idx);
  const rules = (row.completion_rules as Record<string, unknown> | null) || {};
  const guidelinesText = typeof row.guidelines_markdown === 'string' ? row.guidelines_markdown : '';
  const guidelines = guidelinesText
    ? guidelinesText
        .split('\n')
        .map((l) => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
    : [];

  return {
    id: String(row.id || `stage-${num}`),
    stageNumber: num,
    slug: String(row.slug || `stage-${num}`),
    title: String(row.title || `Stage ${num}`),
    taskTitle: String(row.task_title || `Stage ${num} Task`),
    description: String(row.description || ''),
    guidelines,
    startDate: row.start_date ? String(row.start_date) : 'TBD',
    deadline: row.deadline ? String(row.deadline) : 'TBD',
    estimatedDuration: String(row.estimated_duration || 'TBD'),
    isPublished: Boolean(row.is_published),
    isActive: Boolean(row.is_active),
    hasQuiz: Boolean(row.has_quiz),
    hasAssignment: Boolean(row.has_assignment),
    assignmentTitle: String(row.assignment_title || ''),
    assignmentInstructions: String(row.assignment_instructions || ''),
    acceptedFormats: String(row.accepted_formats || 'PDF, ZIP, GitHub URL, Drive Link'),
    maxFileSizeMb: Number(row.max_file_size_mb ?? 25),
    allowResubmission: Boolean(row.allow_resubmission ?? true),
    completionRules: {
      requireGuidelines: Boolean(rules.requireGuidelines ?? true),
      requireQuizPass: Boolean(rules.requireQuizPass ?? false),
      requireAssignment: Boolean(rules.requireAssignment ?? false),
    },
  };
}

/**
 * Fetches competition mission tracks from Supabase (`public.missions`).
 * Falls back cleanly to seeded local tracks if Supabase is unconfigured or table is empty/unseeded.
 */
export async function fetchMissionsApi(): Promise<MissionsApiResult> {
  const sb = getSupabaseClient();
  if (!sb) {
    return {missions: COMPETITION_CATEGORIES, source: 'fallback'};
  }

  try {
    const {data, error} = await sb
      .from('missions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', {ascending: true});

    if (error) {
      return {
        missions: COMPETITION_CATEGORIES,
        source: 'fallback',
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {missions: COMPETITION_CATEGORIES, source: 'fallback'};
    }

    return {
      missions: data.map((row) => mapMissionRow(row as Record<string, unknown>)),
      source: 'supabase',
    };
  } catch (err) {
    return {
      missions: COMPETITION_CATEGORIES,
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Unable to reach Supabase missions API.',
    };
  }
}

/**
 * Fetches a single competition mission track by slug from Supabase (`public.missions`).
 */
export async function fetchMissionBySlugApi(slug: string): Promise<MissionDetailApiResult> {
  const localMatch = COMPETITION_CATEGORIES.find((c) => c.slug === slug) || null;
  const sb = getSupabaseClient();
  if (!sb) {
    return {mission: localMatch, source: 'fallback'};
  }

  try {
    const {data, error} = await sb
      .from('missions')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      return {mission: localMatch, source: 'fallback', error: error.message};
    }

    if (!data) {
      return {mission: localMatch, source: 'fallback'};
    }

    return {
      mission: mapMissionRow(data as Record<string, unknown>),
      source: 'supabase',
    };
  } catch (err) {
    return {
      mission: localMatch,
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Unable to reach Supabase mission API.',
    };
  }
}

/**
 * Fetches Arena schedule, Stage 3 Final Arena config, published stages, and site config from Supabase.
 */
export async function fetchArenaApi(
  fallbackStage3: Stage3EventConfig = INITIAL_STAGE3_EVENT,
  fallbackSchedule: ScheduleTask[] = INITIAL_SCHEDULE,
  fallbackStages: CompetitionStage[] = INITIAL_STAGES,
  fallbackSiteConfig: SiteConfig = INITIAL_SITE_CONFIG
): Promise<ArenaApiResult> {
  const sb = getSupabaseClient();
  if (!sb) {
    return {
      stage3Event: fallbackStage3,
      schedule: fallbackSchedule,
      stages: fallbackStages.filter((s) => s.isPublished),
      siteConfig: fallbackSiteConfig,
      activeSessionCount: 0,
      source: 'fallback',
    };
  }

  try {
    const [configRes, scheduleRes, stagesRes] = await Promise.all([
      sb.from('site_config').select('key, value').in('key', ['main', 'stage3_event']),
      sb.from('schedule_tasks').select('*').order('sort_order', {ascending: true}),
      sb.from('stages').select('*').eq('is_published', true).order('stage_number', {ascending: true}),
    ]);

    const hasError = configRes.error || scheduleRes.error || stagesRes.error;

    let stage3Event = fallbackStage3;
    let siteConfig = fallbackSiteConfig;
    let gotSupabaseData = false;

    if (configRes.data && configRes.data.length > 0) {
      gotSupabaseData = true;
      for (const row of configRes.data) {
        if (row.key === 'stage3_event' && row.value && typeof row.value === 'object') {
          stage3Event = {...fallbackStage3, ...(row.value as Partial<Stage3EventConfig>)};
        }
        if (row.key === 'main' && row.value && typeof row.value === 'object') {
          siteConfig = {...fallbackSiteConfig, ...(row.value as Partial<SiteConfig>)};
        }
      }
    }

    const schedule =
      scheduleRes.data && scheduleRes.data.length > 0
        ? ((gotSupabaseData = true),
          scheduleRes.data.map((r, i) => mapScheduleRow(r as Record<string, unknown>, i)))
        : fallbackSchedule;

    const stages =
      stagesRes.data && stagesRes.data.length > 0
        ? ((gotSupabaseData = true),
          stagesRes.data.map((r, i) => mapStageRow(r as Record<string, unknown>, i)))
        : fallbackStages.filter((s) => s.isPublished);

    return {
      stage3Event,
      schedule,
      stages,
      siteConfig,
      activeSessionCount: 0,
      source: gotSupabaseData ? 'supabase' : 'fallback',
      error: hasError?.message,
    };
  } catch (err) {
    return {
      stage3Event: fallbackStage3,
      schedule: fallbackSchedule,
      stages: fallbackStages.filter((s) => s.isPublished),
      siteConfig: fallbackSiteConfig,
      activeSessionCount: 0,
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Unable to load Arena data from Supabase.',
    };
  }
}
