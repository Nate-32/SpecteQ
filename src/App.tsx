import {lazy, Suspense, useEffect} from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation} from 'react-router-dom';
import {CinematicIntro} from './components/CinematicIntro';
import {PublicLayout} from './components/PublicLayout';
import {ToastContainer} from './components/ToastContainer';
import {SpecteQProvider} from './lib/store';

// Critical Home route loaded immediately; secondary routes code-split for peak performance
import {HomePage} from './pages/public/HomePage';

const GalleryPage = lazy(() =>
  import('./pages/public/GalleryPage').then((m) => ({default: m.GalleryPage}))
);
const MissionsPage = lazy(() =>
  import('./pages/public/MissionsPage').then((m) => ({default: m.MissionsPage}))
);
const MissionDetailPage = lazy(() =>
  import('./pages/public/MissionDetailPage').then((m) => ({default: m.MissionDetailPage}))
);
const LeaderboardPage = lazy(() =>
  import('./pages/public/LeaderboardPage').then((m) => ({default: m.LeaderboardPage}))
);
const AboutPage = lazy(() =>
  import('./pages/public/PublicSubPages').then((m) => ({default: m.AboutPage}))
);
const ArenaPage = lazy(() =>
  import('./pages/public/PublicSubPages').then((m) => ({default: m.ArenaPage}))
);
const RulesPage = lazy(() =>
  import('./pages/public/PublicSubPages').then((m) => ({default: m.RulesPage}))
);
const ContactPage = lazy(() =>
  import('./pages/public/PublicSubPages').then((m) => ({default: m.ContactPage}))
);
const RegisterPage = lazy(() =>
  import('./pages/public/PublicSubPages').then((m) => ({default: m.RegisterPage}))
);

// Auth routes
const LoginPage = lazy(() =>
  import('./pages/auth/AuthPages').then((m) => ({default: m.LoginPage}))
);
const ForgotPasswordPage = lazy(() =>
  import('./pages/auth/AuthPages').then((m) => ({default: m.ForgotPasswordPage}))
);
const ResetPasswordPage = lazy(() =>
  import('./pages/auth/AuthPages').then((m) => ({default: m.ResetPasswordPage}))
);
const AdminGatePage = lazy(() =>
  import('./pages/auth/AuthPages').then((m) => ({default: m.AdminGatePage}))
);

// Student Portal routes
const StudentDashboard = lazy(() =>
  import('./pages/student/StudentDashboard').then((m) => ({default: m.StudentDashboard}))
);
const StudentStagePage = lazy(() =>
  import('./pages/student/StudentStagePage').then((m) => ({default: m.StudentStagePage}))
);
const StudentTeamPage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentTeamPage}))
);
const StudentMaterialsPage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentMaterialsPage}))
);
const StudentSchedulePage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentSchedulePage}))
);
const StudentAnnouncementsPage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentAnnouncementsPage}))
);
const StudentSettingsPage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentSettingsPage}))
);
const StudentSupportPage = lazy(() =>
  import('./pages/student/StudentPortalPages').then((m) => ({default: m.StudentSupportPage}))
);

// Admin Panel routes
const AdminDashboard = lazy(() =>
  import('./pages/admin/AdminDashboard').then((m) => ({default: m.AdminDashboard}))
);
const AdminTeamsPage = lazy(() =>
  import('./pages/admin/AdminTeamsPage').then((m) => ({default: m.AdminTeamsPage}))
);
const AdminTeamDetailPage = lazy(() =>
  import('./pages/admin/AdminTeamsPage').then((m) => ({default: m.AdminTeamDetailPage}))
);
const AdminSchedulePage = lazy(() =>
  import('./pages/admin/AdminScheduleLeaderboard').then((m) => ({default: m.AdminSchedulePage}))
);
const AdminLeaderboardPage = lazy(() =>
  import('./pages/admin/AdminScheduleLeaderboard').then((m) => ({default: m.AdminLeaderboardPage}))
);
const AdminQuizPage = lazy(() =>
  import('./pages/admin/AdminQuizPage').then((m) => ({default: m.AdminQuizPage}))
);
const AdminContentPage = lazy(() =>
  import('./pages/admin/AdminContentSessions').then((m) => ({default: m.AdminContentPage}))
);
const AdminLiveSessionsPage = lazy(() =>
  import('./pages/admin/AdminContentSessions').then((m) => ({default: m.AdminLiveSessionsPage}))
);
const AdminNotificationsPage = lazy(() =>
  import('./pages/admin/AdminNotificationsSettings').then((m) => ({default: m.AdminNotificationsPage}))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminNotificationsSettings').then((m) => ({default: m.AdminSettingsPage}))
);

function ScrollToTop() {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#060913] text-cyan-300 font-mono text-xs">
      Loading SpecteQ Module...
    </div>
  );
}

function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <p className="font-mono text-xs text-fuchsia-400">404 · SECTOR NOT FOUND</p>
        <h1 className="font-display text-4xl font-extrabold text-white">Route Not Found</h1>
        <p className="text-sm text-slate-400">
          The requested page does not exist inside the SpecteQ 2027 Arena.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950"
        >
          Return Home
        </Link>
      </div>
    </PublicLayout>
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <SpecteQProvider>
      <BrowserRouter basename={baseUrl}>
        <ScrollToTop />
        <CinematicIntro />
        <ToastContainer />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/missions" element={<PublicLayout><MissionsPage /></PublicLayout>} />
            <Route path="/missions/:slug" element={<PublicLayout><MissionDetailPage /></PublicLayout>} />
            <Route path="/arena" element={<PublicLayout><ArenaPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/leaderboard" element={<PublicLayout><LeaderboardPage /></PublicLayout>} />
            <Route path="/rules" element={<PublicLayout><RulesPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin" element={<AdminGatePage />} />

            {/* Student / Participant Portal Routes */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/portal/stages/:stageId" element={<StudentStagePage />} />
            <Route path="/portal/team" element={<StudentTeamPage />} />
            <Route path="/team" element={<StudentTeamPage />} />
            <Route path="/portal/materials" element={<StudentMaterialsPage />} />
            <Route path="/materials" element={<StudentMaterialsPage />} />
            <Route path="/portal/schedule" element={<StudentSchedulePage />} />
            <Route path="/schedule" element={<StudentSchedulePage />} />
            <Route path="/portal/announcements" element={<StudentAnnouncementsPage />} />
            <Route path="/announcements" element={<StudentAnnouncementsPage />} />
            <Route path="/portal/settings" element={<StudentSettingsPage />} />
            <Route path="/settings" element={<StudentSettingsPage />} />
            <Route path="/portal/support" element={<StudentSupportPage />} />
            <Route path="/support" element={<StudentSupportPage />} />

            {/* Admin Panel Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teams" element={<AdminTeamsPage />} />
            <Route path="/admin/teams/:teamId" element={<AdminTeamDetailPage />} />
            <Route path="/admin/schedule" element={<AdminSchedulePage />} />
            <Route path="/admin/leaderboard" element={<AdminLeaderboardPage />} />
            <Route path="/admin/quiz" element={<AdminQuizPage />} />
            <Route path="/admin/content" element={<AdminContentPage />} />
            <Route path="/admin/live-sessions" element={<AdminLiveSessionsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SpecteQProvider>
  );
}
