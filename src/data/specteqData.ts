import {SPECTEQ_ASSETS} from '../lib/assets';
import type {
  ActivityLog,
  Announcement,
  AssignmentSubmission,
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
  SupportTicket,
  TaskMaterial,
  Team,
} from '../types/specteq';

export interface CategoryMeta {
  slug: CategorySlug;
  code: string;
  name: string;
  shortDesc: string;
  coreChallenge: string;
  skills: string[];
  learningOutcomes: string[];
  difficulty: string;
  idealFor: string;
  image: string;
  specsNote: string;
}

export const COMPETITION_CATEGORIES: CategoryMeta[] = [
  {
    slug: 'line-follower',
    code: 'MISSION 01',
    name: 'Line Follower',
    shortDesc:
      'Build a robot that follows a designated path using sensors, precise navigation, and control algorithms.',
    coreChallenge: 'Follow a designated path accurately and efficiently across curves and intersections.',
    skills: ['IR sensors', 'Calibration', 'Motor control', 'PID / control tuning', 'Path tracking'],
    learningOutcomes: ['Sensor calibration', 'Accuracy & repeatability', 'Speed optimization', 'Control systems'],
    difficulty: 'Beginner–Intermediate (confirm officially)',
    idealFor: 'Beginners or teams interested in embedded control',
    image: SPECTEQ_ASSETS.catLineFollower,
    specsNote: 'Exact track geometry, sensor limits, and scoring weights remain configurable until official confirmation.',
  },
  {
    slug: 'maze-solver',
    code: 'MISSION 02',
    name: 'Maze Solver',
    shortDesc:
      'Create an intelligent robot that navigates a maze, detects obstacles and dead ends, and finds its way toward the goal.',
    coreChallenge: 'Navigate an unknown or structured maze, handle dead ends, and compute an optimal route.',
    skills: ['Ultrasonic / ToF sensors', 'Navigation', 'Path planning', 'Algorithm design'],
    learningOutcomes: ['Algorithm design', 'Sensor integration', 'Autonomous decision-making'],
    difficulty: 'Intermediate (confirm officially)',
    idealFor: 'Teams interested in programming, logic, and autonomous navigation',
    image: SPECTEQ_ASSETS.catMazeSolver,
    specsNote: 'Maze cell dimensions, wall height, and run timing rules remain configurable until officially confirmed.',
  },
  {
    slug: 'self-balancing',
    code: 'MISSION 03',
    name: 'Self Balancing',
    shortDesc:
      'Design a two-wheeled robot that maintains balance using sensors, feedback control, and real-time decision-making.',
    coreChallenge: 'Maintain a two-wheeled inverted-pendulum robot upright while balancing and maneuvering.',
    skills: ['IMU / gyroscope', 'Control theory', 'PID tuning', 'Signal filtering', 'Motor control'],
    learningOutcomes: ['Control theory', 'Signal processing', 'Real-time system dynamics'],
    difficulty: 'Advanced (confirm officially)',
    idealFor: 'Experienced teams seeking a challenging real-time control problem',
    image: SPECTEQ_ASSETS.catSelfBalancing,
    specsNote: 'Disturbance tests, payload rules, and arena scoring criteria remain configurable until officially confirmed.',
  },
];

export const TECHNOLOGIES_GROUPS = [
  {
    group: 'Embedded Systems',
    items: ['Arduino & microcontrollers', 'Motor controllers', 'Sensor integration', 'PWM control'],
  },
  {
    group: 'Programming',
    items: ['C / C++ firmware', 'Algorithm design', 'Real-time control', 'Embedded debugging'],
  },
  {
    group: 'Control Systems',
    items: ['PID controllers', 'Feedback loops', 'Sensor fusion', 'Balance control'],
  },
  {
    group: 'Navigation',
    items: ['Path planning', 'Maze solving', 'Line following', 'Obstacle detection'],
  },
  {
    group: 'Sensors',
    items: ['IR sensor arrays', 'Ultrasonic sensors', 'Gyroscope & IMU', 'Calibration routines'],
  },
  {
    group: 'Electronics',
    items: ['Circuit design', 'Power management', 'Motor drivers', 'Signal conditioning'],
  },
];

export interface RulePanelData {
  number: string;
  title: string;
  status: 'Confirmed Policy' | 'Configurable · Pending Final Confirmation';
  bullets: string[];
}

export const RULES_DATA: RulePanelData[] = [
  {
    number: '01',
    title: 'General Participation Rules',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'All participating Gaming Teams must complete official registration prior to onboarding.',
      'Participants must follow pit/bay safety instructions and marshal directions at all times.',
      'Respectful conduct toward fellow players, mentors, judges, and organizers is mandatory.',
      'Final eligibility criteria for SpecteQ 2027 will be published in the official rulebook.',
    ],
  },
  {
    number: '02',
    title: 'Team Requirements',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'Each registered team receives one unified team account for the Student Portal.',
      'Required team size and cross-institution eligibility depend on category and are pending final confirmation.',
      'Team Leaders are responsible for coordinating submissions and verifying member profiles.',
    ],
  },
  {
    number: '03',
    title: 'Mission & Category Rules',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'Teams compete in one selected track: Line Follower, Maze Solver, or Self Balancing.',
      'Robots must operate autonomously during arena runs unless a specific stage rule states otherwise.',
      'Category-specific track layouts and obstacle constraints remain configurable until confirmed.',
    ],
  },
  {
    number: '04',
    title: 'Robot Specifications',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'Exact maximum dimensions, weight caps, and battery voltage limits are TBD pending official release.',
      'Exposed wiring must be insulated; lithium batteries must have safe mechanical mounting.',
      'Scrutiny checks will verify hardware compliance before any bot enters the final Robotics Arena.',
    ],
  },
  {
    number: '05',
    title: 'Competition Guidelines',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'Arena slot timing, number of trial runs, and calibration windows will be communicated via the Schedule.',
      'Teams must be ready at the holding bay when called by arena marshals.',
      'External interference with arena sensors, lighting, or rival robots is strictly prohibited.',
    ],
  },
  {
    number: '06',
    title: 'Scoring Criteria',
    status: 'Configurable · Pending Final Confirmation',
    bullets: [
      'Scoring details to be announced. Stage-wise quiz, build milestones, and arena performance weights remain configurable.',
      'Public leaderboard rankings are calculated automatically from verified stage numeric scores.',
    ],
  },
  {
    number: '07',
    title: 'Material & Kit Responsibility',
    status: 'Confirmed Policy',
    bullets: [
      'Teams are responsible for proper handling, storage, and maintenance of any issued hardware kits or lab tools.',
      'Loss or intentional damage of competition-supplied equipment may incur replacement responsibility or disqualification.',
      'All borrowed arena assets must be returned in working condition after scrutiny or final runs.',
    ],
  },
  {
    number: '08',
    title: 'Plagiarism & Originality',
    status: 'Confirmed Policy',
    bullets: [
      'All submitted firmware, CAD designs, documentation, and hardware integrations must represent the team’s own engineering work.',
      'Copying solutions, unauthorized code sharing between competing teams, or submitting third-party projects as original is prohibited.',
      'Open-source libraries used for standard drivers must be properly credited in technical documentation.',
    ],
  },
  {
    number: '09',
    title: 'Final Decision & Organizer Authority',
    status: 'Confirmed Policy',
    bullets: [
      'Decisions of the SpecteQ Judging Panel and Organizing Committee on scoring, penalties, and rule interpretation are final.',
      'The committee reserves the right to update schedules, stage formats, or technical parameters when safety or logistics require.',
    ],
  },
  {
    number: '10',
    title: 'Code of Conduct',
    status: 'Confirmed Policy',
    bullets: [
      'Expected: Respect participants, organizers, mentors, and volunteers; practice ethical teamwork; meet published deadlines.',
      'Prohibited: Plagiarism, unauthorized external assistance during restricted assessments, tampering with equipment, or unsportsmanlike conduct.',
    ],
  },
];

export const FAQ_DATA = [
  {
    q: 'What is SpecteQ?',
    a: 'A hands-on robotics competition where participants learn, build, test, and compete across structured stages culminating in the Robotics Arena.',
  },
  {
    q: 'Who can participate?',
    a: 'Eligibility details for SpecteQ 2027 will be announced in the official rules; please check registration details once confirmed.',
  },
  {
    q: 'Do I need prior robotics experience?',
    a: 'No prior advanced experience is assumed—SpecteQ is designed to encourage learning across skill levels through Stage 0 and Stage 1 training missions.',
  },
  {
    q: 'How many members can be in a team?',
    a: 'Team size depends on the selected category and official 2027 requirements (currently configurable pending final announcement).',
  },
  {
    q: 'Which categories are available?',
    a: 'Three official mission tracks are available: Line Follower, Maze Solver, and Self Balancing.',
  },
  {
    q: 'Do we need to build our own robot?',
    a: 'Yes—teams engineer, assemble, calibrate, and program their own robot following the official category and kit policy guidelines.',
  },
  {
    q: 'What technologies will we learn?',
    a: 'Depending on your mission track and sessions, you will cover sensors, microcontrollers, C/C++ programming, motor control, navigation, and PID control systems.',
  },
  {
    q: 'When is the event?',
    a: 'The official 2027 calendar is currently TBD and will be published dynamically on the Event Timeline and Student Portal Schedule.',
  },
  {
    q: 'What are the prizes?',
    a: 'Participation, Merit, and Excellence certificates plus a cash prize pool up to ₹10,000 distributed among top-performing teams (terms apply).',
  },
  {
    q: 'How do I register?',
    a: 'Use the official registration link in the Insert Coin / Registration section. Once registered, the committee issues your team credentials.',
  },
  {
    q: 'Where can I see previous events?',
    a: 'Visit the dedicated Gallery page via the navigation bar or the Explore Full Gallery button to view photos from arena finals and workshops.',
  },
  {
    q: 'Who do I contact?',
    a: 'Use the Contact Committee button in the Rules section or visit the Contact page for direct organizer channels.',
  },
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  eventTitle: 'SpecteQ 2027',
  registrationOpen: true,
  googleFormUrl: (import.meta.env.VITE_GOOGLE_FORM_URL as string) || '',
  committeeEmail: (import.meta.env.VITE_COMMITTEE_EMAIL as string) || '',
  committeePhone: 'TBD',
  venueText: 'TBD',
  teamSizeNote: 'TBD',
  registrationFeeNote: 'TBD',
  heroHudStatus: 'READY',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
};

export const INITIAL_STAGES: CompetitionStage[] = [];

export const INITIAL_SCHEDULE: ScheduleTask[] = [];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'test-team-1',
    teamCode: 'SQ27-0001',
    teamName: 'Test Team 1',
    loginUsername: 'test1',
    loginEmail: 'test1@team.specteq.dev',
    passwordHashOrPreview: 'Test@1234',
    category: 'line-follower',
    institution: 'Test Institution',
    status: 'active',
    registrationComplete: true,
    paymentStatus: 'verified',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    members: [
      {
        id: 'test-m-1',
        fullName: 'Test User 1',
        email: 'test1@specteq.test',
        role: 'Team Leader',
        isLeader: true,
        institution: 'Test Institution',
        profileCompleted: true,
      },
    ],
  },
  {
    id: 'test-team-2',
    teamCode: 'SQ27-0002',
    teamName: 'Test Team 2',
    loginUsername: 'test2',
    loginEmail: 'test2@team.specteq.dev',
    passwordHashOrPreview: 'Test@1234',
    category: 'maze-solver',
    institution: 'Test Institution',
    status: 'active',
    registrationComplete: true,
    paymentStatus: 'verified',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    members: [
      {
        id: 'test-m-2',
        fullName: 'Test User 2',
        email: 'test2@specteq.test',
        role: 'Team Leader',
        isLeader: true,
        institution: 'Test Institution',
        profileCompleted: true,
      },
    ],
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [];

export const INITIAL_STAGE_QUIZZES: StageQuizConfig[] = [];

export const INITIAL_MATERIALS: TaskMaterial[] = [];

export const INITIAL_LIVE_SESSIONS: LiveSession[] = [];

export const INITIAL_LEADERBOARD: LeaderboardScore[] = [];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [];

export const INITIAL_STAGE_PROGRESS: StageTeamProgress[] = [];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_NOTIFICATIONS: PopupNotification[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_STAGE3_EVENT: Stage3EventConfig = {
  title: 'SpecteQ 2027 · Final Robotics Arena',
  description: 'Final Robotics Arena details will be published by the organizing committee.',
  venue: 'TBD',
  startDateTime: 'TBD',
  endDateTime: 'TBD',
  instructions: '',
  isPublished: false,
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];
