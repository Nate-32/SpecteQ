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
  committeeEmail: (import.meta.env.VITE_COMMITTEE_EMAIL as string) || 'committee@specteq2027.example',
  committeePhone: 'TBD — Contact via official email or portal support',
  venueText: 'TBD — Official 2027 Arena Venue To Be Announced',
  teamSizeNote: '2–4 members per Gaming Team (Pending final 2027 confirmation)',
  registrationFeeNote: 'TBD — Official fee structure will be confirmed on the registration form',
  heroHudStatus: 'READY',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
};

export const INITIAL_STAGES: CompetitionStage[] = [
  {
    id: 'stage-0',
    stageNumber: 0,
    slug: 'stage-0-onboarding',
    title: 'Stage 0 · Insert Coin & Foundations',
    taskTitle: 'Player Onboarding & Robotics Fundamentals',
    description:
      'Complete team profile verification, review competition safety rules, study embedded systems fundamentals, and pass the Stage 0 readiness quiz.',
    guidelines: [
      'Verify all team member profiles and Institution details under Team Members.',
      'Review the introductory embedded systems and microcontroller pinout sheet.',
      'Complete the Stage 0 readiness quiz before the deadline to unlock Stage 1.',
    ],
    startDate: 'TBD · Phase 01',
    deadline: 'TBD · Configurable',
    estimatedDuration: '1 Week',
    isPublished: true,
    isActive: true,
    hasQuiz: true,
    hasAssignment: false,
    assignmentTitle: '',
    assignmentInstructions: '',
    acceptedFormats: 'PDF, ZIP, GitHub URL',
    maxFileSizeMb: 20,
    allowResubmission: true,
    completionRules: {requireGuidelines: true, requireQuizPass: true, requireAssignment: false},
  },
  {
    id: 'stage-1',
    stageNumber: 1,
    slug: 'stage-1-simulation-control',
    title: 'Stage 1 · Training Missions & Control',
    taskTitle: 'PID Tuning, Sensor Calibration & Simulation',
    description:
      'Dive into PID feedback loops, Wokwi circuit simulation, and category-specific sensor modeling before touching physical hardware.',
    guidelines: [
      'Read the Introduction to PID Control and Sensor Filtering guide.',
      'Build and test your virtual prototype inside Wokwi or equivalent simulator.',
      'Submit your simulation project URL or schematic PDF and complete the Stage 1 quiz.',
    ],
    startDate: 'TBD · Phase 02',
    deadline: 'TBD · Configurable',
    estimatedDuration: '2 Weeks',
    isPublished: true,
    isActive: true,
    hasQuiz: true,
    hasAssignment: true,
    assignmentTitle: 'Wokwi Simulation & Control Loop Report',
    assignmentInstructions:
      'Submit a shareable simulation link (Wokwi / GitHub) along with a concise 1-page PDF explaining your sensor calibration and PID constants.',
    acceptedFormats: 'Wokwi URL, GitHub URL, PDF',
    maxFileSizeMb: 25,
    allowResubmission: true,
    completionRules: {requireGuidelines: true, requireQuizPass: true, requireAssignment: true},
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    slug: 'stage-2-hardware-build',
    title: 'Stage 2 · Hardware Build & Scrutiny',
    taskTitle: 'Chassis Assembly, Wiring & Bench Testing',
    description:
      'Assemble your physical robot, wire motor drivers and power rails safely, and submit a bench-test video for preliminary scrutiny.',
    guidelines: [
      'Follow battery safety and wire-insulation standards from Rule 04.',
      'Run static and dynamic bench calibration tests for your category sensors.',
      'Upload a 60-second bench-test video link and wiring schematic.',
    ],
    startDate: 'TBD · Phase 03',
    deadline: 'TBD · Configurable',
    estimatedDuration: '3 Weeks',
    isPublished: true,
    isActive: false,
    hasQuiz: false,
    hasAssignment: true,
    assignmentTitle: 'Hardware Prototype & Bench Test Video',
    assignmentInstructions:
      'Provide a Google Drive or unlisted video link demonstrating autonomous sensor response and motor actuation.',
    acceptedFormats: 'Google Drive URL, Video Link, PDF',
    maxFileSizeMb: 50,
    allowResubmission: true,
    completionRules: {requireGuidelines: true, requireQuizPass: false, requireAssignment: true},
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    slug: 'stage-3-robotics-arena',
    title: 'Stage 3 · Final Robotics Arena',
    taskTitle: 'Live Arena Trials & High Score Championship',
    description:
      'Enter the SpecteQ 2027 Robotics Arena for live timed runs, scrutiny clearance, and final championship scoring.',
    guidelines: [
      'Report to the arena holding bay 30 minutes prior to your scheduled heat.',
      'No tethered laptops allowed during official timed arena attempts.',
      'Final scores are recorded live by marshals and published to the main leaderboard.',
    ],
    startDate: 'TBD · Final Day',
    deadline: 'TBD · Final Day',
    estimatedDuration: '1 Day',
    isPublished: false,
    isActive: false,
    hasQuiz: false,
    hasAssignment: false,
    assignmentTitle: '',
    assignmentInstructions: '',
    acceptedFormats: 'N/A',
    maxFileSizeMb: 10,
    allowResubmission: false,
    completionRules: {requireGuidelines: true, requireQuizPass: false, requireAssignment: false},
  },
];

export const INITIAL_SCHEDULE: ScheduleTask[] = [
  {
    id: 'sch-1',
    title: '01 · Registration Opens',
    description: 'Gaming Teams submit official registration details and select preferred mission track.',
    category: 'Registration',
    duration: 'TBD',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Active',
    sortOrder: 1,
  },
  {
    id: 'sch-2',
    title: '02 · Player Onboarding & Inauguration',
    description: 'Team credentials distributed, portal orientation, and Stage 0 foundational briefing.',
    category: 'Registration',
    duration: '2 Days',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Upcoming',
    sortOrder: 2,
  },
  {
    id: 'sch-3',
    title: '03 · Training Missions (Stage 1)',
    description: 'Structured technical workshops covering PID control, Wokwi simulation, and sensor arrays.',
    category: 'Learning Phase',
    duration: '2 Weeks',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Upcoming',
    sortOrder: 3,
  },
  {
    id: 'sch-4',
    title: '04 · Hardware Kit Distribution & Build',
    description: 'Teams assemble physical chassis, integrate motor drivers, and begin firmware calibration.',
    category: 'Implementation',
    duration: '3 Weeks',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Upcoming',
    sortOrder: 4,
  },
  {
    id: 'sch-5',
    title: '05 · Testing & Scrutiny Checks',
    description: 'Pre-arena hardware inspection, battery safety checks, and track calibration slots.',
    category: 'Implementation',
    duration: '3 Days',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Upcoming',
    sortOrder: 5,
  },
  {
    id: 'sch-6',
    title: '06 · Final Robotics Arena & Awards',
    description: 'Live championship runs across all three tracks followed by High Score Champion awards.',
    category: 'Final Phase',
    duration: '1 Day',
    startDate: 'TBD',
    endDate: 'TBD',
    status: 'Upcoming',
    sortOrder: 6,
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-101',
    teamCode: 'SQ27-0101',
    teamName: 'Vector Pulse',
    loginUsername: 'vectorpulse',
    loginEmail: 'vectorpulse@team.specteq.dev',
    passwordHashOrPreview: 'SpecteQ#101',
    category: 'line-follower',
    institution: 'Institute of Engineering & Robotics',
    status: 'active',
    registrationComplete: true,
    paymentStatus: 'verified',
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-11-01T14:20:00Z',
    members: [
      {
        id: 'm-1',
        fullName: 'Aarav Mehta',
        email: 'aarav.mehta@student.edu',
        role: 'Team Leader · Embedded Firmware',
        isLeader: true,
        institution: 'Institute of Engineering & Robotics',
        profileCompleted: true,
      },
      {
        id: 'm-2',
        fullName: 'Diya Nair',
        email: 'diya.nair@student.edu',
        role: 'Hardware & PCB Design',
        isLeader: false,
        institution: 'Institute of Engineering & Robotics',
        profileCompleted: true,
      },
      {
        id: 'm-3',
        fullName: 'Rohan Kulkarni',
        email: 'rohan.k@student.edu',
        role: 'PID & Sensor Calibration',
        isLeader: false,
        institution: 'Institute of Engineering & Robotics',
        profileCompleted: false,
      },
    ],
  },
  {
    id: 'team-102',
    teamCode: 'SQ27-0102',
    teamName: 'Aegis Dynamics',
    loginUsername: 'aegisdynamics',
    loginEmail: 'aegisdynamics@team.specteq.dev',
    passwordHashOrPreview: 'SpecteQ#102',
    category: 'self-balancing',
    institution: 'National School of Mechatronics',
    status: 'active',
    registrationComplete: true,
    paymentStatus: 'verified',
    createdAt: '2026-10-14T11:30:00Z',
    updatedAt: '2026-11-03T10:00:00Z',
    members: [
      {
        id: 'm-4',
        fullName: 'Siddharth Rao',
        email: 'siddharth.rao@student.edu',
        role: 'Team Leader · Control Theory',
        isLeader: true,
        institution: 'National School of Mechatronics',
        profileCompleted: true,
      },
      {
        id: 'm-5',
        fullName: 'Meera Krishnan',
        email: 'meera.k@student.edu',
        role: 'IMU Filtering & Mechanical',
        isLeader: false,
        institution: 'National School of Mechatronics',
        profileCompleted: true,
      },
    ],
  },
  {
    id: 'team-103',
    teamCode: 'SQ27-0103',
    teamName: 'Labyrinth Nine',
    loginUsername: 'labyrinthnine',
    loginEmail: 'labyrinthnine@team.specteq.dev',
    passwordHashOrPreview: 'SpecteQ#103',
    category: 'maze-solver',
    institution: 'Metro Tech University',
    status: 'active',
    registrationComplete: true,
    paymentStatus: 'verified',
    createdAt: '2026-10-18T16:45:00Z',
    updatedAt: '2026-11-04T08:15:00Z',
    members: [
      {
        id: 'm-6',
        fullName: 'Kabir Verma',
        email: 'kabir.v@student.edu',
        role: 'Team Leader · Path Planning',
        isLeader: true,
        institution: 'Metro Tech University',
        profileCompleted: true,
      },
      {
        id: 'm-7',
        fullName: 'Ananya Sen',
        email: 'ananya.s@student.edu',
        role: 'Sensor Fusion',
        isLeader: false,
        institution: 'Metro Tech University',
        profileCompleted: true,
      },
    ],
  },
  {
    id: 'team-104',
    teamCode: 'SQ27-0104',
    teamName: 'Flux Circuit',
    loginUsername: 'fluxcircuit',
    loginEmail: 'fluxcircuit@team.specteq.dev',
    passwordHashOrPreview: 'SpecteQ#104',
    category: 'line-follower',
    institution: 'Apex Polytech',
    status: 'pending',
    registrationComplete: true,
    paymentStatus: 'pending',
    createdAt: '2026-11-01T12:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z',
    members: [
      {
        id: 'm-8',
        fullName: 'Ishaan Patel',
        email: 'ishaan.p@student.edu',
        role: 'Team Leader',
        isLeader: true,
        institution: 'Apex Polytech',
        profileCompleted: false,
      },
      {
        id: 'm-9',
        fullName: 'Tara Deshmukh',
        email: 'tara.d@student.edu',
        role: 'Member',
        isLeader: false,
        institution: 'Apex Polytech',
        profileCompleted: false,
      },
    ],
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    questionText: 'In a PID controller, which term is primarily responsible for eliminating steady-state error over time?',
    questionType: 'mcq',
    options: ['Proportional (P)', 'Integral (I)', 'Derivative (D)', 'Feedforward Gain'],
    correctAnswer: 'Integral (I)',
    explanation: 'The Integral term accumulates past error over time to drive steady-state offset to zero.',
    points: 2,
    topic: 'Control Systems',
    difficulty: 'Intermediate',
  },
  {
    id: 'q-2',
    questionText: 'What does PWM stand for when controlling DC motor speed from a microcontroller?',
    questionType: 'mcq',
    options: [
      'Pulse Width Modulation',
      'Power Wave Multiplier',
      'Phase Wire Management',
      'Proportional Weight Mapping',
    ],
    correctAnswer: 'Pulse Width Modulation',
    explanation: 'PWM varies the duty cycle of a square wave to control average voltage delivered to a motor driver.',
    points: 2,
    topic: 'Embedded Systems',
    difficulty: 'Beginner',
  },
  {
    id: 'q-3',
    questionText: 'An H-Bridge motor driver such as the L298N or TB6612FNG allows a microcontroller to reverse motor direction.',
    questionType: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'An H-Bridge switches polarity across the motor terminals, enabling bidirectional rotation.',
    points: 2,
    topic: 'Electronics',
    difficulty: 'Beginner',
  },
  {
    id: 'q-4',
    questionText: 'Which algorithm is commonly used by Micromouse maze solvers to compute the shortest path to the goal cell?',
    questionType: 'mcq',
    options: ['Flood Fill', 'Bubble Sort', 'K-Means Clustering', 'Huffman Coding'],
    correctAnswer: 'Flood Fill',
    explanation: 'Flood Fill assigns Manhattan-distance costs from the goal cell and dynamically updates as walls are discovered.',
    points: 2,
    topic: 'Navigation',
    difficulty: 'Intermediate',
  },
  {
    id: 'q-5',
    questionText: 'Why is a complementary or Kalman filter used with an MPU6050 IMU on a self-balancing robot?',
    questionType: 'mcq',
    options: [
      'To combine fast gyroscope rate readings with drift-free accelerometer tilt angles',
      'To increase battery voltage above 12V',
      'To convert analog IR signals into ultrasonic pulses',
      'To bypass the motor driver enable pins',
    ],
    correctAnswer: 'To combine fast gyroscope rate readings with drift-free accelerometer tilt angles',
    explanation: 'Gyroscopes drift over time while accelerometers are noisy under motion; sensor fusion yields a clean tilt estimate.',
    points: 2,
    topic: 'Sensors',
    difficulty: 'Advanced',
  },
  {
    id: 'q-6',
    questionText: 'Before entering the Final Robotics Arena, all robots must pass hardware safety and wiring scrutiny.',
    questionType: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Mandatory scrutiny ensures battery safety, insulated connections, and category compliance.',
    points: 2,
    topic: 'Safety & Rules',
    difficulty: 'Beginner',
  },
];

export const INITIAL_STAGE_QUIZZES: StageQuizConfig[] = [
  {
    id: 'quiz-stage-0',
    stageId: 'stage-0',
    title: 'Stage 0 · Embedded & Arena Readiness Quiz',
    description: 'Verify your grasp of core embedded systems concepts and competition safety rules.',
    mode: 'manual',
    isEnabled: true,
    startAt: '',
    endAt: '',
    questionCount: 4,
    pointsPerQuestion: 2,
    passingScorePct: 50,
    durationMinutes: 10,
    maxAttempts: 2,
    randomizeQuestions: false,
    randomizeOptions: false,
    revealAnswers: true,
    assignedQuestionIds: ['q-2', 'q-3', 'q-6', 'q-1'],
  },
  {
    id: 'quiz-stage-1',
    stageId: 'stage-1',
    title: 'Stage 1 · PID, Navigation & Sensor Fusion Quiz',
    description: 'Technical evaluation covering control loops, maze algorithms, and IMU filtering.',
    mode: 'manual',
    isEnabled: true,
    startAt: '',
    endAt: '',
    questionCount: 4,
    pointsPerQuestion: 2,
    passingScorePct: 50,
    durationMinutes: 15,
    maxAttempts: 2,
    randomizeQuestions: false,
    randomizeOptions: false,
    revealAnswers: true,
    assignedQuestionIds: ['q-1', 'q-4', 'q-5', 'q-2'],
  },
];

export const INITIAL_MATERIALS: TaskMaterial[] = [
  {
    id: 'mat-1',
    stageId: 'stage-0',
    category: 'all',
    title: 'SpecteQ 2027 Participant Handbook & Safety Protocol',
    description: 'Mandatory pit-bay safety checklist, battery guidelines, and stage progression overview.',
    resourceType: 'PDF',
    url: 'https://docs.arduino.cc/learn/starting-guide/getting-started-arduino/',
    isEnabled: true,
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'mat-2',
    stageId: 'stage-1',
    category: 'all',
    title: 'Introduction to PID Control & Feedback Loops',
    description: 'Step-by-step tuning workflow for proportional, integral, and derivative gains on differential drive bots.',
    resourceType: 'Document',
    url: 'https://pidexplained.com/',
    isEnabled: true,
    createdAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'mat-3',
    stageId: 'stage-1',
    category: 'all',
    title: 'Wokwi Arduino & Sensor Simulation Starter',
    description: 'Simulate Arduino Nano, ultrasonic sensors, and servo/motor logic online before hardware assembly.',
    resourceType: 'Link',
    url: 'https://wokwi.com/',
    isEnabled: true,
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'mat-4',
    stageId: 'stage-1',
    category: 'self-balancing',
    title: 'Arduino Nano & MPU6050 Complementary Filter Starter',
    description: 'Reference wiring and tilt-angle estimation code snippet for two-wheeled balancing.',
    resourceType: 'Code',
    url: 'https://github.com/ElectronicCats/mpu6050',
    isEnabled: true,
    createdAt: '2026-10-24T10:00:00Z',
  },
  {
    id: 'mat-5',
    stageId: 'stage-2',
    category: 'all',
    title: 'Hardware Assembly & Power Distribution Guide',
    description: 'Wiring high-current motor drivers separately from logic rails to prevent microcontroller brownouts.',
    resourceType: 'PDF',
    url: 'https://learn.sparkfun.com/tutorials/motors-and-selecting-the-right-one',
    isEnabled: true,
    createdAt: '2026-11-01T10:00:00Z',
  },
];

export const INITIAL_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'ls-0-lf',
    stageNumber: 0,
    category: 'line-follower',
    isEnabled: true,
    title: 'Stage 0 · Line Follower Kickoff & IR Array Calibration',
    meetingLink: 'https://meet.google.com/',
    description: 'Live mentor briefing covering 8-channel IR sensor calibration and chassis balance.',
    date: 'TBD · Session 01',
    time: '18:00 IST',
  },
  {
    id: 'ls-0-ms',
    stageNumber: 0,
    category: 'maze-solver',
    isEnabled: true,
    title: 'Stage 0 · Maze Solver Orientation & Sensor Placement',
    meetingLink: 'https://meet.google.com/',
    description: 'Wall-detection geometry and flood-fill algorithm fundamentals.',
    date: 'TBD · Session 01',
    time: '19:00 IST',
  },
  {
    id: 'ls-0-sb',
    stageNumber: 0,
    category: 'self-balancing',
    isEnabled: true,
    title: 'Stage 0 · Self Balancing Physics & IMU Setup',
    meetingLink: 'https://meet.google.com/',
    description: 'Inverted-pendulum modeling and MPU6050 I2C initialization.',
    date: 'TBD · Session 01',
    time: '20:00 IST',
  },
  {
    id: 'ls-1-lf',
    stageNumber: 1,
    category: 'line-follower',
    isEnabled: true,
    title: 'Stage 1 · High-Speed PID Curve Tuning Lab',
    meetingLink: 'https://meet.google.com/',
    description: 'Eliminating oscillation on sharp 90-degree turns and hairpins.',
    date: 'TBD · Session 02',
    time: '18:00 IST',
  },
  {
    id: 'ls-1-ms',
    stageNumber: 1,
    category: 'maze-solver',
    isEnabled: false,
    title: 'Stage 1 · Flood-Fill & Dead-End Recovery',
    meetingLink: 'https://meet.google.com/',
    description: 'Hands-on debugging of maze exploration memory arrays.',
    date: 'TBD · Session 02',
    time: '19:00 IST',
  },
  {
    id: 'ls-1-sb',
    stageNumber: 1,
    category: 'self-balancing',
    isEnabled: true,
    title: 'Stage 1 · Cascaded PID & Disturbance Rejection',
    meetingLink: 'https://meet.google.com/',
    description: 'Tuning inner angle loop and outer velocity loop for stability.',
    date: 'TBD · Session 02',
    time: '20:00 IST',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardScore[] = [
  {id: 'lb-1', stageKey: 'stage-0', teamId: 'team-101', score: 94, updatedAt: '2026-11-05T10:00:00Z'},
  {id: 'lb-2', stageKey: 'stage-0', teamId: 'team-102', score: 91, updatedAt: '2026-11-05T10:05:00Z'},
  {id: 'lb-3', stageKey: 'stage-0', teamId: 'team-103', score: 88, updatedAt: '2026-11-05T10:10:00Z'},
  {id: 'lb-4', stageKey: 'stage-1', teamId: 'team-102', score: 96, updatedAt: '2026-11-10T10:00:00Z'},
  {id: 'lb-5', stageKey: 'stage-1', teamId: 'team-101', score: 92, updatedAt: '2026-11-10T10:05:00Z'},
  {id: 'lb-6', stageKey: 'stage-1', teamId: 'team-103', score: 92, updatedAt: '2026-11-10T10:10:00Z'},
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att-1',
    stageQuizId: 'quiz-stage-0',
    stageId: 'stage-0',
    teamId: 'team-101',
    attemptNumber: 1,
    score: 8,
    totalPossible: 8,
    correctCount: 4,
    passed: true,
    status: 'Completed',
    timeTakenSeconds: 185,
    answers: {
      'q-2': 'Pulse Width Modulation',
      'q-3': 'True',
      'q-6': 'True',
      'q-1': 'Integral (I)',
    },
    completedAt: '2026-11-02T14:15:00Z',
  },
];

export const INITIAL_STAGE_PROGRESS: StageTeamProgress[] = [
  {
    stageId: 'stage-0',
    teamId: 'team-101',
    guidelinesReviewed: true,
    completedMaterialIds: ['mat-1'],
    status: 'completed',
    progressPct: 100,
    updatedAt: '2026-11-02T14:20:00Z',
  },
  {
    stageId: 'stage-1',
    teamId: 'team-101',
    guidelinesReviewed: true,
    completedMaterialIds: ['mat-2'],
    status: 'active',
    progressPct: 45,
    updatedAt: '2026-11-06T09:00:00Z',
  },
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    stageId: 'stage-1',
    teamId: 'team-102',
    submissionType: 'Link',
    contentUrl: 'https://wokwi.com/projects/example-aegis-imu',
    notes: 'Completed cascaded PID simulation with 12ms loop period.',
    status: 'Under Review',
    adminFeedback: '',
    submittedAt: '2026-11-08T16:30:00Z',
    updatedAt: '2026-11-08T16:30:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Stage 1 Training Materials & Wokwi Simulation Active',
    content:
      'Stage 1 resources including the PID Control Guide and Wokwi Simulation Starter are now live in Task Materials. Complete your Stage 0 readiness quiz before attempting Stage 1.',
    category: 'Task Update',
    priority: 'Important',
    isPublished: true,
    createdAt: '2026-11-05T09:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Battery & Motor Driver Safety Scrutiny Notice',
    content:
      'All Gaming Teams preparing hardware builds must ensure LiPo/Li-ion cells are mechanically secured and logic rails are fused prior to Stage 2 bench testing.',
    category: 'Technical Notice',
    priority: 'Urgent',
    isPublished: true,
    createdAt: '2026-11-10T11:30:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: PopupNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to SpecteQ 2027 Participant Portal',
    description:
      'Stage 0 Onboarding and Stage 1 Training Missions are active. Verify all team member profiles and complete your Stage 0 readiness quiz.',
    targetScope: 'all',
    isEnabled: true,
    createdAt: '2026-11-01T08:00:00Z',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    teamId: 'team-101',
    subject: 'Question on IR Array Channel Limit',
    category: 'Quiz / Task',
    description: 'Are 8-channel analog IR sensor arrays allowed for Stage 2 Line Follower hardware builds?',
    status: 'Resolved',
    adminReply: 'Yes, up to 8-channel IR arrays are permitted. Final max width specs will be posted in Stage 2 Guidelines.',
    createdAt: '2026-11-04T11:00:00Z',
    updatedAt: '2026-11-04T15:20:00Z',
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Championship Track & Pit Bays',
    caption: 'Teams preparing autonomous prototypes at perimeter pit benches beside the illuminated arena floor.',
    category: 'Arena Finals',
    imageUrl: SPECTEQ_ASSETS.galleryArenaFinals,
    year: '2026',
    isFeatured: true,
  },
  {
    id: 'gal-2',
    title: 'Line Follower Precision Run',
    caption: 'Carbon-chassis autonomous line follower executing a high-speed curve calibration run.',
    category: 'Arena Finals',
    imageUrl: SPECTEQ_ASSETS.catLineFollower,
    year: '2026',
    isFeatured: true,
  },
  {
    id: 'gal-3',
    title: 'Hardware Prototyping Bench',
    caption: 'Multimeter voltage verification, custom wiring harnesses, and microcontroller assembly during Stage 2.',
    category: 'Hardware & Prototyping',
    imageUrl: SPECTEQ_ASSETS.galleryHardwareBench,
    year: '2026',
    isFeatured: true,
  },
  {
    id: 'gal-4',
    title: 'Micromouse Maze Navigation',
    caption: 'Ultrasonic and LiDAR-equipped maze solver mapping corridor intersections during trial heats.',
    category: 'Arena Finals',
    imageUrl: SPECTEQ_ASSETS.catMazeSolver,
    year: '2026',
    isFeatured: false,
  },
  {
    id: 'gal-5',
    title: 'Inverted-Pendulum Control Rig',
    caption: 'Two-wheeled self-balancing prototype running real-time IMU sensor fusion.',
    category: 'Hardware & Prototyping',
    imageUrl: SPECTEQ_ASSETS.catSelfBalancing,
    year: '2026',
    isFeatured: false,
  },
  {
    id: 'gal-6',
    title: 'Embedded Control Lab Workshop',
    caption: 'Teams calibrating sensor arrays and inspecting circuit schematics during Training Mission sessions.',
    category: 'Training Workshops',
    imageUrl: SPECTEQ_ASSETS.galleryWorkshopSession,
    year: '2026',
    isFeatured: false,
  },
];

export const INITIAL_STAGE3_EVENT: Stage3EventConfig = {
  title: 'SpecteQ 2027 · Final Robotics Arena',
  description:
    'Live championship heats for qualified Line Follower, Maze Solver, and Self Balancing teams. Scrutineering opens prior to qualification runs.',
  venue: 'TBD — Main Engineering Auditorium & Arena Hall',
  startDateTime: 'TBD',
  endDateTime: 'TBD',
  instructions:
    'Bring fully charged spare batteries, safety glasses, and a printed team check-in pass from your Student Portal.',
  isPublished: true,
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    actor: 'admin@specteq.dev',
    action: 'Activated Stage',
    target: 'Stage 1 · Training Missions',
    details: 'Published Stage 1 materials and enabled quiz.',
    timestamp: '2026-11-05T09:05:00Z',
  },
  {
    id: 'log-2',
    actor: 'admin@specteq.dev',
    action: 'Updated Leaderboard',
    target: 'Aegis Dynamics (Stage 1)',
    details: 'Assigned verified evaluation score: 96.',
    timestamp: '2026-11-10T10:00:00Z',
  },
];
