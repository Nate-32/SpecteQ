export type CategorySlug = 'line-follower' | 'maze-solver' | 'self-balancing';

export type TeamStatus = 'active' | 'pending' | 'disabled';
export type PaymentStatus = 'pending' | 'verified' | 'waived';

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isLeader: boolean;
  institution: string;
  profileCompleted: boolean;
}

export interface Team {
  id: string;
  teamCode: string;
  teamName: string;
  loginUsername: string;
  loginEmail: string;
  passwordHashOrPreview: string;
  category: CategorySlug;
  institution: string;
  status: TeamStatus;
  registrationComplete: boolean;
  paymentStatus: PaymentStatus;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type StageProgressStatus =
  | 'locked'
  | 'upcoming'
  | 'active'
  | 'submitted'
  | 'under_evaluation'
  | 'completed';

export interface StageCompletionRules {
  requireGuidelines: boolean;
  requireQuizPass: boolean;
  requireAssignment: boolean;
}

export interface CompetitionStage {
  id: string;
  stageNumber: number;
  slug: string;
  title: string;
  taskTitle: string;
  description: string;
  guidelines: string[];
  startDate: string;
  deadline: string;
  estimatedDuration: string;
  isPublished: boolean;
  isActive: boolean;
  hasQuiz: boolean;
  hasAssignment: boolean;
  assignmentTitle: string;
  assignmentInstructions: string;
  acceptedFormats: string;
  maxFileSizeMb: number;
  allowResubmission: boolean;
  completionRules: StageCompletionRules;
}

export interface StageTeamProgress {
  stageId: string;
  teamId: string;
  guidelinesReviewed: boolean;
  completedMaterialIds: string[];
  status: StageProgressStatus;
  progressPct: number;
  updatedAt: string;
}

export type ScheduleStatus = 'Upcoming' | 'Active' | 'Completed' | 'Deadline Passed' | 'Cancelled';
export type ScheduleCategory = 'Registration' | 'Learning Phase' | 'Implementation' | 'Final Phase';

export interface ScheduleTask {
  id: string;
  title: string;
  description: string;
  category: ScheduleCategory;
  duration: string;
  startDate: string;
  endDate: string;
  status: ScheduleStatus;
  sortOrder: number;
}

export type QuestionType = 'mcq' | 'true_false' | 'short';

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StageQuizConfig {
  id: string;
  stageId: string;
  title: string;
  description: string;
  mode: 'manual' | 'scheduled';
  isEnabled: boolean;
  startAt: string;
  endAt: string;
  questionCount: number;
  pointsPerQuestion: number;
  passingScorePct: number;
  durationMinutes: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  revealAnswers: boolean;
  assignedQuestionIds: string[];
}

export interface QuizAttempt {
  id: string;
  stageQuizId: string;
  stageId: string;
  teamId: string;
  attemptNumber: number;
  score: number;
  totalPossible: number;
  correctCount: number;
  passed: boolean;
  status: 'Completed' | 'Pending';
  timeTakenSeconds: number;
  answers: Record<string, string>;
  completedAt: string;
}

export interface LeaderboardScore {
  id: string;
  stageKey: string;
  teamId: string;
  score: number;
  updatedAt: string;
}

export type ResourceType = 'PDF' | 'Document' | 'Video' | 'Link' | 'Code' | 'ZIP' | 'Presentation';

export interface TaskMaterial {
  id: string;
  stageId: string;
  category: CategorySlug | 'all';
  title: string;
  description: string;
  resourceType: ResourceType;
  url: string;
  isEnabled: boolean;
  createdAt: string;
}

export type SubmissionStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Late Submission'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Revision Required';

export interface AssignmentSubmission {
  id: string;
  stageId: string;
  teamId: string;
  submissionType: 'Link' | 'GitHub' | 'Drive' | 'Text' | 'File';
  contentUrl: string;
  notes: string;
  status: SubmissionStatus;
  adminFeedback: string;
  submittedAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  stageNumber: number;
  category: CategorySlug;
  isEnabled: boolean;
  title: string;
  meetingLink: string;
  description: string;
  date: string;
  time: string;
}

export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent';
export type AnnouncementCategory =
  | 'General'
  | 'Important'
  | 'Schedule Update'
  | 'Task Update'
  | 'Technical Notice'
  | 'Deadline Reminder';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  attachmentUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface PopupNotification {
  id: string;
  title: string;
  description: string;
  targetScope: 'all' | 'stage' | 'category';
  targetValue?: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  teamId: string;
  subject: string;
  category: 'Registration' | 'Payment' | 'Technical Issue' | 'Quiz / Task' | 'Schedule' | 'General Query';
  description: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Arena Finals' | 'Hardware & Prototyping' | 'Training Workshops';
  imageUrl: string;
  year: string;
  isFeatured: boolean;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Stage3EventConfig {
  title: string;
  description: string;
  venue: string;
  startDateTime: string;
  endDateTime: string;
  instructions: string;
  isPublished: boolean;
}

export interface SiteConfig {
  eventTitle: string;
  registrationOpen: boolean;
  googleFormUrl: string;
  committeeEmail: string;
  committeePhone: string;
  venueText: string;
  teamSizeNote: string;
  registrationFeeNote: string;
  heroHudStatus: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

export interface AuthSession {
  role: 'admin' | 'team';
  email: string;
  displayName: string;
  teamId?: string;
  isSupabaseAuth: boolean;
}
