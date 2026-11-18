import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Menu, X, Mail, MapPin} from 'lucide-react';
import {useSpecteQ} from '../lib/store';
import {ContactCommitteeModal} from './ContactCommitteeModal';

const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Missions', to: '/missions'},
  {label: 'Arena', to: '/arena'},
  {label: 'Gallery', to: '/gallery'},
  {label: 'Leaderboard', to: '/leaderboard'},
  {label: 'Rules', to: '/rules'},
];

export function PublicLayout({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const {session, siteConfig} = useSpecteQ();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const loginHref = session?.role === 'team' ? '/dashboard' : '/login';
  const loginLabel = session?.role === 'team' ? 'Team Portal' : 'Player Login';

  return (
    <div className="min-h-screen flex flex-col bg-[#06070d] text-zinc-100">
      {/* Top Bar Contract: Zone 1 Wordmark — Zone 2 Concise Links — Zone 3 Primary Action */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#06070d]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
          <Link
            to="/"
            className="font-display italic text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Specte<span className="text-indigo-400">Q</span> 2027
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  isActive(link.to)
                    ? 'text-white border-indigo-400'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={loginHref}
              className="hidden sm:inline-flex items-center justify-center hud-btn-primary bg-white px-4 py-2 text-xs font-bold tracking-wide text-zinc-950 hover:bg-indigo-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              {loginLabel}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-2 text-zinc-200 hover:text-white min-h-[44px] min-w-[44px]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-800 bg-[#080a13] px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  isActive(link.to) ? 'bg-indigo-500/20 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900 min-h-[44px] flex items-center"
            >
              Contact
            </Link>
            <div className="pt-2">
              <Link
                to={loginHref}
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-bold text-zinc-950 min-h-[44px]"
              >
                {loginLabel}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer — 4 Clean Columns */}
      <footer className="border-t border-zinc-900 bg-[#05060b] text-zinc-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <span className="font-display italic text-xl font-bold tracking-tight text-white block">
              Specte<span className="text-indigo-400">Q</span> 2027
            </span>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Empowering the next generation of robotics innovators through hands-on learning and competition.
            </p>
            <p className="font-mono text-xs text-zinc-500">Built for Players · Powered by Innovation</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link to="/about" className="hover:text-indigo-300 transition-colors">About SpecteQ</Link></li>
              <li><Link to="/missions" className="hover:text-indigo-300 transition-colors">Missions & Categories</Link></li>
              <li><Link to="/arena" className="hover:text-indigo-300 transition-colors">Robotics Arena & Timeline</Link></li>
              <li><Link to="/gallery" className="hover:text-indigo-300 transition-colors">Gallery</Link></li>
              <li><Link to="/register" className="hover:text-indigo-300 transition-colors">Insert Coin · Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link to="/rules" className="hover:text-indigo-300 transition-colors">Official Rules & FAQ</Link></li>
              <li><Link to="/leaderboard" className="hover:text-indigo-300 transition-colors">Public Leaderboard</Link></li>
              <li><Link to="/login" className="hover:text-indigo-300 transition-colors">Participant Portal Login</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-300 transition-colors">Contact Organizers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="break-all">{siteConfig.committeeEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-fuchsia-400 shrink-0 mt-0.5" />
                <span>{siteConfig.venueText}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:border-indigo-400/60 transition-colors min-h-[40px]"
            >
              Contact Committee
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-900 py-5 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
            <span>© 2027 SpecteQ Organizing Committee. All rights reserved.</span>
            <span>ENGINEER · INNOVATE · COMPETE</span>
          </div>
        </div>
      </footer>

      <ContactCommitteeModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
