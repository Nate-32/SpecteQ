import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {
  COMPETITION_CATEGORIES,
  type CategoryMeta,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_LEADERBOARD,
  INITIAL_LIVE_SESSIONS,
  INITIAL_MATERIALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUESTIONS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_SCHEDULE,
  INITIAL_SITE_CONFIG,
  INITIAL_STAGE3_EVENT,
  INITIAL_STAGE_PROGRESS,
  INITIAL_STAGE_QUIZZES,
  INITIAL_STAGES,
  INITIAL_SUBMISSIONS,
  INITIAL_TEAMS,
  INITIAL_TICKETS,
} from '../data/specteqData';
import {fetchArenaApi, fetchMissionsApi} from './supabaseApi';
import type {
  ActivityLog,
  Announcement,
  AssignmentSubmission,
  AuthSession,
  CategorySlug,
  CompetitionStage,
  GalleryItem,
  LeaderboardScore,
  LiveSession,
  PopupNotification,
  QuizAttempt,
  QuizQuestion,
  ScheduleTask,
  SiteConfig,
  Stage3EventConfig,
  StageQuizConfig,
  StageTeamProgress,
  SubmissionStatus,
  SupportTicket,
  TaskMaterial,
  Team,
  TeamMember,
  TeamStatus,
} from '../types/specteq';
import {getSupabaseClient, isSupabaseConfigured} from './supabase';

const STORAGE_KEY = 'specteq_2027_state_v2';
const SESSION_KEY = 'specteq_2027_session_v2';
const READ_NOTIFS_KEY = 'specteq_2027_read_notifs_v2';

interface PersistedState {
  teams: Team[];
  stages: CompetitionStage[];
  stageProgress: StageTeamProgress[];
  schedule: ScheduleTask[];
  questions: QuizQuestion[];
  stageQuizzes: StageQuizConfig[];
  quizAttempts: QuizAttempt[];
  leaderboard: LeaderboardScore[];
  materials: TaskMaterial[];
  submissions: AssignmentSubmission[];
  liveSessions: LiveSession[];
  announcements: Announcement[];
  notifications: PopupNotification[];
  tickets: SupportTicket[];
  gallery: GalleryItem[];
  stage3Event: Stage3EventConfig;
  siteConfig: SiteConfig;
  activityLogs: ActivityLog[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface RankedLeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  teamCode: string;
  category: CategorySlug;
  score: number;
  updatedAt: string;
}

interface SpecteQContextValue extends PersistedState {
  missions: CategoryMeta[];
  session: AuthSession | null;
  currentTeam: Team | null;
  readNotificationIds: string[];
  toasts: ToastMessage[];
  supabaseConnected: boolean;
  pushToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  // Auth
  loginTeam: (identifier: string, password: string) => Promise<{ok: boolean; error?: string}>;
  loginAdmin: (email: string, password: string) => Promise<{ok: boolean; error?: string}>;
  logout: () => Promise<void>;
  // Team management (Admin)
  createTeam: (input: {
    teamName: string;
    category: CategorySlug;
    institution: string;
    members: Omit<TeamMember, 'id'>[];
  }) => {team: Team; generatedPassword: string} | {error: string};
  updateTeam: (teamId: string, patch: Partial<Team>) => void;
  setTeamStatus: (teamId: string, status: TeamStatus) => void;
  resetTeamCredentials: (teamId: string) => {username: string; password: string} | null;
  deleteTeam: (teamId: string) => void;
  // Student team updates
  updateTeamMemberProfile: (teamId: string, memberId: string, patch: Partial<TeamMember>) => void;
  // Stages & Progress
  upsertStage: (stage: CompetitionStage) => void;
  deleteStage: (stageId: string) => void;
  toggleStageActive: (stageId: string) => void;
  markGuidelinesReviewed: (stageId: string, teamId: string) => void;
  toggleMaterialCompleted: (stageId: string, teamId: string, materialId: string) => void;
  // Schedule
  upsertScheduleTask: (task: ScheduleTask) => void;
  deleteScheduleTask: (taskId: string) => void;
  // Quiz Bank & Config & Attempts
  upsertQuestion: (q: QuizQuestion) => void;
  deleteQuestion: (qId: string) => void;
  upsertStageQuiz: (cfg: StageQuizConfig) => void;
  submitQuizAttempt: (params: {
    stageId: string;
    teamId: string;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }) => QuizAttempt | null;
  // Leaderboard
  upsertLeaderboardScore: (stageKey: string, teamId: string, score: number) => void;
  removeLeaderboardScore: (entryId: string) => void;
  getRankedLeaderboard: (stageKey: string, categoryFilter?: CategorySlug | 'all') => RankedLeaderboardEntry[];
  // Materials & Submissions
  upsertMaterial: (mat: TaskMaterial) => void;
  deleteMaterial: (matId: string) => void;
  submitAssignment: (params: {
    stageId: string;
    teamId: string;
    submissionType: AssignmentSubmission['submissionType'];
    contentUrl: string;
    notes: string;
  }) => void;
  reviewSubmission: (submissionId: string, status: SubmissionStatus, adminFeedback: string) => void;
  // Live Sessions, Notifications, Announcements, Tickets, Gallery, Config
  upsertLiveSession: (session: LiveSession) => void;
  upsertAnnouncement: (ann: Announcement) => void;
  deleteAnnouncement: (annId: string) => void;
  upsertNotification: (notif: PopupNotification) => void;
  deleteNotification: (notifId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  createSupportTicket: (params: {
    teamId: string;
    subject: string;
    category: SupportTicket['category'];
    description: string;
  }) => void;
  updateSupportTicket: (ticketId: string, status: SupportTicket['status'], adminReply?: string) => void;
  upsertGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (itemId: string) => void;
  updateStage3Event: (cfg: Stage3EventConfig) => void;
  updateSiteConfig: (cfg: SiteConfig) => void;
  resetDemoDatabase: () => void;
}

const defaultState: PersistedState = {
  teams: INITIAL_TEAMS,
  stages: INITIAL_STAGES,
  stageProgress: INITIAL_STAGE_PROGRESS,
  schedule: INITIAL_SCHEDULE,
  questions: INITIAL_QUESTIONS,
  stageQuizzes: INITIAL_STAGE_QUIZZES,
  quizAttempts: INITIAL_QUIZ_ATTEMPTS,
  leaderboard: INITIAL_LEADERBOARD,
  materials: INITIAL_MATERIALS,
  submissions: INITIAL_SUBMISSIONS,
  liveSessions: INITIAL_LIVE_SESSIONS,
  announcements: INITIAL_ANNOUNCEMENTS,
  notifications: INITIAL_NOTIFICATIONS,
  tickets: INITIAL_TICKETS,
  gallery: INITIAL_GALLERY,
  stage3Event: INITIAL_STAGE3_EVENT,
  siteConfig: INITIAL_SITE_CONFIG,
  activityLogs: INITIAL_ACTIVITY_LOGS,
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {...defaultState, ...parsed};
  } catch {
    return defaultState;
  }
}

function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function loadReadNotifs(): string[] {
  try {
    const raw = localStorage.getItem(READ_NOTIFS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  let out = 'SQ27-';
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

const SpecteQContext = createContext<SpecteQContextValue | null>(null);

export function SpecteQProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [missions, setMissions] = useState<CategoryMeta[]>(COMPETITION_CATEGORIES);
  const [session, setSession] = useState<AuthSession | null>(loadSession);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(loadReadNotifs);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors in restricted browsing modes
    }
  }, [state]);

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(readNotificationIds));
    } catch {
      // Ignore
    }
  }, [readNotificationIds]);

  // Hydrate public missions, arena config, schedule & stages from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    Promise.all([
      fetchMissionsApi(),
      fetchArenaApi(state.stage3Event, state.schedule, state.stages, state.siteConfig),
    ]).then(([missionsRes, arenaRes]) => {
      if (!active) return;
      if (missionsRes.source === 'supabase' && missionsRes.missions.length > 0) {
        setMissions(missionsRes.missions);
      }
      if (arenaRes.source === 'supabase') {
        setState((prev) => ({
          ...prev,
          stage3Event: arenaRes.stage3Event,
          schedule: arenaRes.schedule.length > 0 ? arenaRes.schedule : prev.schedule,
          stages: arenaRes.stages.length > 0 ? arenaRes.stages : prev.stages,
          siteConfig: arenaRes.siteConfig,
        }));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Sync Supabase auth listener + public config if configured
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    const {data: listener} = sb.auth.onAuthStateChange(async (_event, sbSession) => {
      if (!sbSession?.user) return;
      const email = sbSession.user.email || '';
      const {data: adminRow} = await sb
        .from('admins')
        .select('id, display_name')
        .eq('id', sbSession.user.id)
        .maybeSingle();

      if (adminRow) {
        setSession({
          role: 'admin',
          email,
          displayName: adminRow.display_name || 'SpecteQ Admin',
          isSupabaseAuth: true,
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const pushToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, {id, type, message}]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const appendLog = useCallback((action: string, target: string, details: string) => {
    const actor = session?.email || 'admin';
    const entry: ActivityLog = {
      id: `log-${Date.now()}`,
      actor,
      action,
      target,
      details,
      timestamp: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      activityLogs: [entry, ...prev.activityLogs].slice(0, 60),
    }));
  }, [session?.email]);

  const loginTeam = useCallback(
    async (identifier: string, password: string) => {
      const cleanId = identifier.trim().toLowerCase();
      if (!cleanId || !password) {
        return {ok: false, error: 'Please enter both team username/email and password.'};
      }

      const sb = getSupabaseClient();
      let supabaseAuthError: string | null = null;
      if (sb && cleanId.includes('@')) {
        const {data, error} = await sb.auth.signInWithPassword({email: cleanId, password});
        if (!error && data.user) {
          const matched = state.teams.find(
            (t) => t.loginEmail.toLowerCase() === cleanId || t.members.some((m) => m.email.toLowerCase() === cleanId)
          );
          setSession({
            role: 'team',
            email: cleanId,
            displayName: matched?.teamName || data.user.email || 'Participant Team',
            teamId: matched?.id || state.teams[0]?.id,
            isSupabaseAuth: true,
          });
          return {ok: true};
        }
        if (error) {
          supabaseAuthError = error.message;
        }
      }

      const matchedTeam = state.teams.find(
        (t) =>
          t.loginUsername.toLowerCase() === cleanId ||
          t.loginEmail.toLowerCase() === cleanId ||
          t.teamCode.toLowerCase() === cleanId
      );

      if (!matchedTeam) {
        return {
          ok: false,
          error: supabaseAuthError || 'No team account found matching that username or email.',
        };
      }
      if (matchedTeam.status === 'disabled') {
        return {ok: false, error: 'This team account has been disabled by the administrator.'};
      }
      if (matchedTeam.passwordHashOrPreview !== password) {
        return {ok: false, error: 'Invalid credentials. Please verify your team password.'};
      }

      setSession({
        role: 'team',
        email: matchedTeam.loginEmail,
        displayName: matchedTeam.teamName,
        teamId: matchedTeam.id,
        isSupabaseAuth: false,
      });
      return {ok: true};
    },
    [state.teams]
  );

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return {ok: false, error: 'Administrator email and password are required.'};
    }

    const sb = getSupabaseClient();
    if (sb) {
      const {data, error} = await sb.auth.signInWithPassword({email: cleanEmail, password});
      if (error || !data.user) {
        return {ok: false, error: error?.message || 'Supabase admin authentication failed.'};
      }
      const {data: adminRow, error: adminError} = await sb
        .from('admins')
        .select('id, display_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (adminError) {
        await sb.auth.signOut();
        return {
          ok: false,
          error: `Admin verification failed (${adminError.message}). Make sure supabase/schema.sql has been run in your Supabase SQL Editor.`,
        };
      }

      if (!adminRow) {
        await sb.auth.signOut();
        return {
          ok: false,
          error: `Access denied: ${cleanEmail} is signed in (Auth UID: ${data.user.id}), but is not listed in the public.admins table yet.`,
        };
      }
      setSession({
        role: 'admin',
        email: cleanEmail,
        displayName: adminRow.display_name || 'SpecteQ Admin',
        isSupabaseAuth: true,
      });
      return {ok: true};
    }

    return {
      ok: false,
      error: 'Supabase authentication is not configured for this build.',
    };
  }, []);

  const logout = useCallback(async () => {
    const sb = getSupabaseClient();
    if (sb) {
      await sb.auth.signOut();
    }
    setSession(null);
  }, []);

  const createTeam = useCallback(
    (input: {
      teamName: string;
      category: CategorySlug;
      institution: string;
      members: Omit<TeamMember, 'id'>[];
    }) => {
      const cleanName = input.teamName.trim();
      if (!cleanName) return {error: 'Team name is required.'};
      if (state.teams.some((t) => t.teamName.toLowerCase() === cleanName.toLowerCase())) {
        return {error: 'A team with this name already exists. Team names must be unique.'};
      }

      const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'team';
      let username = baseSlug;
      let suffix = 1;
      while (state.teams.some((t) => t.loginUsername === username)) {
        username = `${baseSlug}${suffix}`;
        suffix += 1;
      }

      const generatedPassword = generateTempPassword();
      const teamId = `team-${Date.now()}`;
      const teamCode = `SQ27-${String(state.teams.length + 101).padStart(4, '0')}`;
      const now = new Date().toISOString();

      const newTeam: Team = {
        id: teamId,
        teamCode,
        teamName: cleanName,
        loginUsername: username,
        loginEmail: `${username}@team.specteq.dev`,
        passwordHashOrPreview: generatedPassword,
        category: input.category,
        institution: input.institution.trim() || 'Participating Institution',
        status: 'active',
        registrationComplete: true,
        paymentStatus: 'verified',
        createdAt: now,
        updatedAt: now,
        members: input.members.map((m, idx) => ({
          id: `mem-${Date.now()}-${idx}`,
          fullName: m.fullName.trim(),
          email: m.email.trim(),
          role: m.role.trim() || (idx === 0 ? 'Team Leader' : 'Member'),
          isLeader: idx === 0 || m.isLeader,
          institution: m.institution.trim() || input.institution.trim() || '',
          profileCompleted: Boolean(m.fullName.trim() && m.email.trim()),
        })),
      };

      setState((prev) => ({
        ...prev,
        teams: [newTeam, ...prev.teams],
      }));
      appendLog('Created Team', cleanName, `Code ${teamCode} (${input.category})`);
      pushToast(`Team "${cleanName}" registered with credentials.`);
      return {team: newTeam, generatedPassword};
    },
    [state.teams, appendLog, pushToast]
  );

  const updateTeam = useCallback(
    (teamId: string, patch: Partial<Team>) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId ? {...t, ...patch, updatedAt: new Date().toISOString()} : t
        ),
      }));
      appendLog('Updated Team', teamId, 'Modified team profile or category');
      pushToast('Team updated.');
    },
    [appendLog, pushToast]
  );

  const setTeamStatus = useCallback(
    (teamId: string, status: TeamStatus) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId ? {...t, status, updatedAt: new Date().toISOString()} : t
        ),
      }));
      appendLog('Changed Team Status', teamId, `Status -> ${status}`);
      pushToast(`Team status updated to ${status}.`);
    },
    [appendLog, pushToast]
  );

  const resetTeamCredentials = useCallback(
    (teamId: string) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return null;
      const newPassword = generateTempPassword();
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId ? {...t, passwordHashOrPreview: newPassword, updatedAt: new Date().toISOString()} : t
        ),
      }));
      appendLog('Reset Credentials', team.teamName, 'Generated new temporary password');
      pushToast(`Temporary password regenerated for ${team.teamName}.`);
      return {username: team.loginUsername, password: newPassword};
    },
    [state.teams, appendLog, pushToast]
  );

  const deleteTeam = useCallback(
    (teamId: string) => {
      const target = state.teams.find((t) => t.id === teamId);
      setState((prev) => ({
        ...prev,
        teams: prev.teams.filter((t) => t.id !== teamId),
        leaderboard: prev.leaderboard.filter((l) => l.teamId !== teamId),
        quizAttempts: prev.quizAttempts.filter((a) => a.teamId !== teamId),
        submissions: prev.submissions.filter((s) => s.teamId !== teamId),
      }));
      appendLog('Deleted Team', target?.teamName || teamId, 'Removed team and linked records');
      pushToast('Team deleted.', 'info');
    },
    [state.teams, appendLog, pushToast]
  );

  const updateTeamMemberProfile = useCallback(
    (teamId: string, memberId: string, patch: Partial<TeamMember>) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                members: t.members.map((m) => (m.id === memberId ? {...m, ...patch} : m)),
              }
            : t
        ),
      }));
      pushToast('Member profile updated.');
    },
    [pushToast]
  );

  const upsertStage = useCallback(
    (stage: CompetitionStage) => {
      setState((prev) => {
        const exists = prev.stages.some((s) => s.id === stage.id);
        const stages = exists
          ? prev.stages.map((s) => (s.id === stage.id ? stage : s))
          : [...prev.stages, stage].sort((a, b) => a.stageNumber - b.stageNumber);
        return {...prev, stages};
      });
      appendLog('Saved Stage', stage.title, `Active: ${stage.isActive}, Published: ${stage.isPublished}`);
      pushToast(`Saved "${stage.title}".`);
    },
    [appendLog, pushToast]
  );

  const deleteStage = useCallback(
    (stageId: string) => {
      setState((prev) => ({
        ...prev,
        stages: prev.stages.filter((s) => s.id !== stageId),
      }));
      pushToast('Stage removed.', 'info');
    },
    [pushToast]
  );

  const toggleStageActive = useCallback(
    (stageId: string) => {
      setState((prev) => ({
        ...prev,
        stages: prev.stages.map((s) => (s.id === stageId ? {...s, isActive: !s.isActive, isPublished: true} : s)),
      }));
      appendLog('Toggled Stage Active', stageId, 'Updated student portal visibility');
      pushToast('Stage activation updated.');
    },
    [appendLog, pushToast]
  );

  const markGuidelinesReviewed = useCallback((stageId: string, teamId: string) => {
    setState((prev) => {
      const existing = prev.stageProgress.find((p) => p.stageId === stageId && p.teamId === teamId);
      const next: StageTeamProgress = existing
        ? {...existing, guidelinesReviewed: true, progressPct: Math.max(existing.progressPct, 35), updatedAt: new Date().toISOString()}
        : {
            stageId,
            teamId,
            guidelinesReviewed: true,
            completedMaterialIds: [],
            status: 'active',
            progressPct: 35,
            updatedAt: new Date().toISOString(),
          };
      const others = prev.stageProgress.filter((p) => !(p.stageId === stageId && p.teamId === teamId));
      return {...prev, stageProgress: [...others, next]};
    });
    pushToast('Guidelines marked as reviewed.');
  }, [pushToast]);

  const toggleMaterialCompleted = useCallback((stageId: string, teamId: string, materialId: string) => {
    setState((prev) => {
      const existing = prev.stageProgress.find((p) => p.stageId === stageId && p.teamId === teamId);
      const prevIds = existing?.completedMaterialIds || [];
      const nextIds = prevIds.includes(materialId)
        ? prevIds.filter((id) => id !== materialId)
        : [...prevIds, materialId];
      const next: StageTeamProgress = existing
        ? {
            ...existing,
            completedMaterialIds: nextIds,
            progressPct: Math.min(100, Math.max(existing.progressPct, 25 + nextIds.length * 15)),
            updatedAt: new Date().toISOString(),
          }
        : {
            stageId,
            teamId,
            guidelinesReviewed: false,
            completedMaterialIds: nextIds,
            status: 'active',
            progressPct: 25,
            updatedAt: new Date().toISOString(),
          };
      const others = prev.stageProgress.filter((p) => !(p.stageId === stageId && p.teamId === teamId));
      return {...prev, stageProgress: [...others, next]};
    });
  }, []);

  const upsertScheduleTask = useCallback(
    (task: ScheduleTask) => {
      setState((prev) => {
        const exists = prev.schedule.some((t) => t.id === task.id);
        const schedule = exists
          ? prev.schedule.map((t) => (t.id === task.id ? task : t))
          : [...prev.schedule, task];
        return {...prev, schedule: schedule.sort((a, b) => a.sortOrder - b.sortOrder)};
      });
      appendLog('Updated Schedule', task.title, `${task.status} (${task.startDate})`);
      pushToast('Schedule task saved.');
    },
    [appendLog, pushToast]
  );

  const deleteScheduleTask = useCallback(
    (taskId: string) => {
      setState((prev) => ({
        ...prev,
        schedule: prev.schedule.filter((t) => t.id !== taskId),
      }));
      pushToast('Schedule task deleted.', 'info');
    },
    [pushToast]
  );

  const upsertQuestion = useCallback(
    (q: QuizQuestion) => {
      setState((prev) => {
        const exists = prev.questions.some((item) => item.id === q.id);
        return {
          ...prev,
          questions: exists ? prev.questions.map((item) => (item.id === q.id ? q : item)) : [q, ...prev.questions],
        };
      });
      pushToast('Question saved to bank.');
    },
    [pushToast]
  );

  const deleteQuestion = useCallback(
    (qId: string) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== qId),
        stageQuizzes: prev.stageQuizzes.map((sq) => ({
          ...sq,
          assignedQuestionIds: sq.assignedQuestionIds.filter((id) => id !== qId),
        })),
      }));
      pushToast('Question removed from bank.', 'info');
    },
    [pushToast]
  );

  const upsertStageQuiz = useCallback(
    (cfg: StageQuizConfig) => {
      setState((prev) => {
        const exists = prev.stageQuizzes.some((q) => q.id === cfg.id || q.stageId === cfg.stageId);
        return {
          ...prev,
          stageQuizzes: exists
            ? prev.stageQuizzes.map((q) => (q.id === cfg.id || q.stageId === cfg.stageId ? cfg : q))
            : [...prev.stageQuizzes, cfg],
        };
      });
      appendLog('Updated Stage Quiz', cfg.title, `Enabled: ${cfg.isEnabled}, Mode: ${cfg.mode}`);
      pushToast('Quiz configuration saved.');
    },
    [appendLog, pushToast]
  );

  const submitQuizAttempt = useCallback(
    ({
      stageId,
      teamId,
      answers,
      timeTakenSeconds,
    }: {
      stageId: string;
      teamId: string;
      answers: Record<string, string>;
      timeTakenSeconds: number;
    }) => {
      const quizCfg = state.stageQuizzes.find((q) => q.stageId === stageId);
      if (!quizCfg) return null;

      const assignedQs = quizCfg.assignedQuestionIds
        .map((id) => state.questions.find((q) => q.id === id))
        .filter((q): q is QuizQuestion => Boolean(q))
        .slice(0, quizCfg.questionCount);

      let correctCount = 0;
      let score = 0;
      const totalPossible = assignedQs.length * quizCfg.pointsPerQuestion;

      assignedQs.forEach((q) => {
        const given = (answers[q.id] || '').trim().toLowerCase();
        const expected = q.correctAnswer.trim().toLowerCase();
        if (given && given === expected) {
          correctCount += 1;
          score += quizCfg.pointsPerQuestion;
        }
      });

      const pct = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
      const passed = pct >= quizCfg.passingScorePct;
      const prevCount = state.quizAttempts.filter((a) => a.stageId === stageId && a.teamId === teamId).length;

      const attempt: QuizAttempt = {
        id: `att-${Date.now()}`,
        stageQuizId: quizCfg.id,
        stageId,
        teamId,
        attemptNumber: prevCount + 1,
        score,
        totalPossible,
        correctCount,
        passed,
        status: 'Completed',
        timeTakenSeconds,
        answers,
        completedAt: new Date().toISOString(),
      };

      setState((prev) => {
        const existingProg = prev.stageProgress.find((p) => p.stageId === stageId && p.teamId === teamId);
        const stage = prev.stages.find((s) => s.id === stageId);
        const autoComplete = passed && (!stage?.hasAssignment || !stage.completionRules.requireAssignment);
        const nextProg: StageTeamProgress = existingProg
          ? {
              ...existingProg,
              progressPct: autoComplete ? 100 : Math.max(existingProg.progressPct, 70),
              status: autoComplete ? 'completed' : existingProg.status,
              updatedAt: new Date().toISOString(),
            }
          : {
              stageId,
              teamId,
              guidelinesReviewed: true,
              completedMaterialIds: [],
              progressPct: autoComplete ? 100 : 70,
              status: autoComplete ? 'completed' : 'active',
              updatedAt: new Date().toISOString(),
            };
        return {
          ...prev,
          quizAttempts: [attempt, ...prev.quizAttempts],
          stageProgress: [
            ...prev.stageProgress.filter((p) => !(p.stageId === stageId && p.teamId === teamId)),
            nextProg,
          ],
        };
      });

      pushToast(`Quiz submitted! Score: ${score}/${totalPossible} (${pct}%).`);
      return attempt;
    },
    [state.stageQuizzes, state.questions, state.quizAttempts, pushToast]
  );

  const upsertLeaderboardScore = useCallback(
    (stageKey: string, teamId: string, score: number) => {
      setState((prev) => {
        const existing = prev.leaderboard.find((l) => l.stageKey === stageKey && l.teamId === teamId);
        const next: LeaderboardScore = existing
          ? {...existing, score, updatedAt: new Date().toISOString()}
          : {id: `lb-${Date.now()}`, stageKey, teamId, score, updatedAt: new Date().toISOString()};
        const others = prev.leaderboard.filter((l) => !(l.stageKey === stageKey && l.teamId === teamId));
        return {...prev, leaderboard: [...others, next]};
      });
      appendLog('Updated Leaderboard Score', `${stageKey} · ${teamId}`, `Score set to ${score}`);
      pushToast('Leaderboard score updated & rankings recalculated.');
    },
    [appendLog, pushToast]
  );

  const removeLeaderboardScore = useCallback(
    (entryId: string) => {
      setState((prev) => ({
        ...prev,
        leaderboard: prev.leaderboard.filter((l) => l.id !== entryId),
      }));
      pushToast('Leaderboard entry removed.', 'info');
    },
    [pushToast]
  );

  const getRankedLeaderboard = useCallback(
    (stageKey: string, categoryFilter: CategorySlug | 'all' = 'all'): RankedLeaderboardEntry[] => {
      const entries = state.leaderboard
        .filter((l) => l.stageKey === stageKey)
        .map((l) => {
          const team = state.teams.find((t) => t.id === l.teamId);
          if (!team || team.status === 'disabled') return null;
          if (categoryFilter !== 'all' && team.category !== categoryFilter) return null;
          return {
            teamId: team.id,
            teamName: team.teamName,
            teamCode: team.teamCode,
            category: team.category,
            score: l.score,
            updatedAt: l.updatedAt,
          };
        })
        .filter((x): x is Omit<RankedLeaderboardEntry, 'rank'> => Boolean(x))
        .sort((a, b) => b.score - a.score || a.teamName.localeCompare(b.teamName));

      // Standard competition ranking supporting ties (1, 2, 2, 4...)
      let currentRank = 0;
      let prevScore: number | null = null;
      return entries.map((entry, index) => {
        if (prevScore === null || entry.score < prevScore) {
          currentRank = index + 1;
          prevScore = entry.score;
        }
        return {...entry, rank: currentRank};
      });
    },
    [state.leaderboard, state.teams]
  );

  const upsertMaterial = useCallback(
    (mat: TaskMaterial) => {
      setState((prev) => {
        const exists = prev.materials.some((m) => m.id === mat.id);
        return {
          ...prev,
          materials: exists ? prev.materials.map((m) => (m.id === mat.id ? mat : m)) : [mat, ...prev.materials],
        };
      });
      appendLog('Saved Material', mat.title, `Stage ${mat.stageId}`);
      pushToast('Task material saved.');
    },
    [appendLog, pushToast]
  );

  const deleteMaterial = useCallback(
    (matId: string) => {
      setState((prev) => ({
        ...prev,
        materials: prev.materials.filter((m) => m.id !== matId),
      }));
      pushToast('Material removed.', 'info');
    },
    [pushToast]
  );

  const submitAssignment = useCallback(
    ({
      stageId,
      teamId,
      submissionType,
      contentUrl,
      notes,
    }: {
      stageId: string;
      teamId: string;
      submissionType: AssignmentSubmission['submissionType'];
      contentUrl: string;
      notes: string;
    }) => {
      const now = new Date().toISOString();
      setState((prev) => {
        const existing = prev.submissions.find((s) => s.stageId === stageId && s.teamId === teamId);
        const sub: AssignmentSubmission = existing
          ? {...existing, submissionType, contentUrl, notes, status: 'Submitted', updatedAt: now}
          : {
              id: `sub-${Date.now()}`,
              stageId,
              teamId,
              submissionType,
              contentUrl,
              notes,
              status: 'Submitted',
              adminFeedback: '',
              submittedAt: now,
              updatedAt: now,
            };
        const others = prev.submissions.filter((s) => !(s.stageId === stageId && s.teamId === teamId));
        const existingProg = prev.stageProgress.find((p) => p.stageId === stageId && p.teamId === teamId);
        const nextProg: StageTeamProgress = existingProg
          ? {...existingProg, status: 'submitted', progressPct: Math.max(existingProg.progressPct, 90), updatedAt: now}
          : {
              stageId,
              teamId,
              guidelinesReviewed: true,
              completedMaterialIds: [],
              status: 'submitted',
              progressPct: 90,
              updatedAt: now,
            };
        return {
          ...prev,
          submissions: [sub, ...others],
          stageProgress: [
            ...prev.stageProgress.filter((p) => !(p.stageId === stageId && p.teamId === teamId)),
            nextProg,
          ],
        };
      });
      pushToast('Assignment submitted for review.');
    },
    [pushToast]
  );

  const reviewSubmission = useCallback(
    (submissionId: string, status: SubmissionStatus, adminFeedback: string) => {
      const now = new Date().toISOString();
      setState((prev) => {
        const target = prev.submissions.find((s) => s.id === submissionId);
        const submissions = prev.submissions.map((s) =>
          s.id === submissionId ? {...s, status, adminFeedback, updatedAt: now} : s
        );
        let stageProgress = prev.stageProgress;
        if (target && status === 'Accepted') {
          const existing = prev.stageProgress.find((p) => p.stageId === target.stageId && p.teamId === target.teamId);
          const updated: StageTeamProgress = existing
            ? {...existing, status: 'completed', progressPct: 100, updatedAt: now}
            : {
                stageId: target.stageId,
                teamId: target.teamId,
                guidelinesReviewed: true,
                completedMaterialIds: [],
                status: 'completed',
                progressPct: 100,
                updatedAt: now,
              };
          stageProgress = [
            ...prev.stageProgress.filter((p) => !(p.stageId === target.stageId && p.teamId === target.teamId)),
            updated,
          ];
        }
        return {...prev, submissions, stageProgress};
      });
      appendLog('Reviewed Submission', submissionId, `Status: ${status}`);
      pushToast(`Submission marked as ${status}.`);
    },
    [appendLog, pushToast]
  );

  const upsertLiveSession = useCallback(
    (ls: LiveSession) => {
      setState((prev) => {
        const exists = prev.liveSessions.some((x) => x.id === ls.id);
        return {
          ...prev,
          liveSessions: exists ? prev.liveSessions.map((x) => (x.id === ls.id ? ls : x)) : [...prev.liveSessions, ls],
        };
      });
      appendLog('Updated Live Session', ls.title, `Enabled: ${ls.isEnabled}`);
      pushToast('Live session saved.');
    },
    [appendLog, pushToast]
  );

  const upsertAnnouncement = useCallback(
    (ann: Announcement) => {
      setState((prev) => {
        const exists = prev.announcements.some((a) => a.id === ann.id);
        return {
          ...prev,
          announcements: exists ? prev.announcements.map((a) => (a.id === ann.id ? ann : a)) : [ann, ...prev.announcements],
        };
      });
      pushToast('Announcement published.');
    },
    [pushToast]
  );

  const deleteAnnouncement = useCallback(
    (annId: string) => {
      setState((prev) => ({
        ...prev,
        announcements: prev.announcements.filter((a) => a.id !== annId),
      }));
      pushToast('Announcement deleted.', 'info');
    },
    [pushToast]
  );

  const upsertNotification = useCallback(
    (notif: PopupNotification) => {
      setState((prev) => {
        const exists = prev.notifications.some((n) => n.id === notif.id);
        return {
          ...prev,
          notifications: exists ? prev.notifications.map((n) => (n.id === notif.id ? notif : n)) : [notif, ...prev.notifications],
        };
      });
      appendLog('Saved Notification', notif.title, `Enabled: ${notif.isEnabled}`);
      pushToast('Notification saved.');
    },
    [appendLog, pushToast]
  );

  const deleteNotification = useCallback(
    (notifId: string) => {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.filter((n) => n.id !== notifId),
      }));
      pushToast('Notification deleted.', 'info');
    },
    [pushToast]
  );

  const markNotificationRead = useCallback((notifId: string) => {
    setReadNotificationIds((prev) => (prev.includes(notifId) ? prev : [...prev, notifId]));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setReadNotificationIds(state.notifications.map((n) => n.id));
  }, [state.notifications]);

  const createSupportTicket = useCallback(
    ({
      teamId,
      subject,
      category,
      description,
    }: {
      teamId: string;
      subject: string;
      category: SupportTicket['category'];
      description: string;
    }) => {
      const now = new Date().toISOString();
      const ticket: SupportTicket = {
        id: `tkt-${Date.now()}`,
        teamId,
        subject,
        category,
        description,
        status: 'Submitted',
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({
        ...prev,
        tickets: [ticket, ...prev.tickets],
      }));
      pushToast('Support request submitted to organizers.');
    },
    [pushToast]
  );

  const updateSupportTicket = useCallback(
    (ticketId: string, status: SupportTicket['status'], adminReply?: string) => {
      setState((prev) => ({
        ...prev,
        tickets: prev.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status,
                adminReply: adminReply !== undefined ? adminReply : t.adminReply,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }));
      pushToast('Support ticket updated.');
    },
    [pushToast]
  );

  const upsertGalleryItem = useCallback(
    (item: GalleryItem) => {
      setState((prev) => {
        const exists = prev.gallery.some((g) => g.id === item.id);
        return {
          ...prev,
          gallery: exists ? prev.gallery.map((g) => (g.id === item.id ? item : g)) : [item, ...prev.gallery],
        };
      });
      pushToast('Gallery item saved.');
    },
    [pushToast]
  );

  const deleteGalleryItem = useCallback(
    (itemId: string) => {
      setState((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g.id !== itemId),
      }));
      pushToast('Gallery item deleted.', 'info');
    },
    [pushToast]
  );

  const updateStage3Event = useCallback(
    (cfg: Stage3EventConfig) => {
      setState((prev) => ({...prev, stage3Event: cfg}));
      const sb = getSupabaseClient();
      if (sb && session?.isSupabaseAuth && session.role === 'admin') {
        void sb.from('site_config').upsert({key: 'stage3_event', value: cfg, updated_at: new Date().toISOString()});
      }
      appendLog('Updated Stage 3 Event', cfg.title, `Venue: ${cfg.venue}`);
      pushToast('Stage 3 Event details saved.');
    },
    [appendLog, pushToast, session?.isSupabaseAuth, session?.role]
  );

  const updateSiteConfig = useCallback(
    (cfg: SiteConfig) => {
      setState((prev) => ({...prev, siteConfig: cfg}));
      const sb = getSupabaseClient();
      if (sb && session?.isSupabaseAuth && session.role === 'admin') {
        void sb.from('site_config').upsert({key: 'main', value: cfg, updated_at: new Date().toISOString()});
      }
      appendLog('Updated Site Configuration', 'Global Settings', 'Updated registration/contact config');
      pushToast('Site settings saved.');
    },
    [appendLog, pushToast, session?.isSupabaseAuth, session?.role]
  );

  const resetDemoDatabase = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    pushToast('Reset competition state to defaults.', 'info');
  }, [pushToast]);

  const currentTeam = useMemo(() => {
    if (session?.role !== 'team' || !session.teamId) return null;
    return state.teams.find((t) => t.id === session.teamId) || null;
  }, [session, state.teams]);

  const value: SpecteQContextValue = {
    ...state,
    missions,
    session,
    currentTeam,
    readNotificationIds,
    toasts,
    supabaseConnected: isSupabaseConfigured,
    pushToast,
    dismissToast,
    loginTeam,
    loginAdmin,
    logout,
    createTeam,
    updateTeam,
    setTeamStatus,
    resetTeamCredentials,
    deleteTeam,
    updateTeamMemberProfile,
    upsertStage,
    deleteStage,
    toggleStageActive,
    markGuidelinesReviewed,
    toggleMaterialCompleted,
    upsertScheduleTask,
    deleteScheduleTask,
    upsertQuestion,
    deleteQuestion,
    upsertStageQuiz,
    submitQuizAttempt,
    upsertLeaderboardScore,
    removeLeaderboardScore,
    getRankedLeaderboard,
    upsertMaterial,
    deleteMaterial,
    submitAssignment,
    reviewSubmission,
    upsertLiveSession,
    upsertAnnouncement,
    deleteAnnouncement,
    upsertNotification,
    deleteNotification,
    markNotificationRead,
    markAllNotificationsRead,
    createSupportTicket,
    updateSupportTicket,
    upsertGalleryItem,
    deleteGalleryItem,
    updateStage3Event,
    updateSiteConfig,
    resetDemoDatabase,
  };

  return <SpecteQContext.Provider value={value}>{children}</SpecteQContext.Provider>;
}

export function useSpecteQ(): SpecteQContextValue {
  const ctx = useContext(SpecteQContext);
  if (!ctx) throw new Error('useSpecteQ must be used inside SpecteQProvider');
  return ctx;
}
