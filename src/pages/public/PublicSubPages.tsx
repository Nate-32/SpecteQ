import {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  Send,
  Shield,
  Trophy,
} from 'lucide-react';
import {FAQ_DATA, RULES_DATA, TECHNOLOGIES_GROUPS} from '../../data/specteqData';
import {SPECTEQ_ASSETS} from '../../lib/assets';
import {useSpecteQ} from '../../lib/store';
import {ContactCommitteeModal} from '../../components/ContactCommitteeModal';
import {ResilientImage} from '../../components/ResilientImage';

export function AboutPage() {
  const {siteConfig} = useSpecteQ();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-12">
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">About the Event</p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          About SpecteQ 2027
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          SpecteQ is a hands-on robotics and engineering competition designed around a progressive multi-stage structure—helping students transition from foundational sensor concepts to working autonomous machines in the Robotics Arena.
        </p>
      </div>

      <div className="hud-panel grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch">
        <div className="lg:col-span-6 bg-slate-950">
          <ResilientImage
            src={SPECTEQ_ASSETS.galleryWorkshopSession}
            alt="Students testing robotics prototypes in training workshop"
            className="h-64 lg:h-full w-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 p-6 sm:p-8 space-y-4 flex flex-col justify-center">
          <h2 className="font-display text-2xl font-bold text-white">Learning While Competing</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Rather than separating workshops from competition day, SpecteQ treats the entire 2027 season as a structured progression. Teams onboard in Level 00, complete simulation and control training in Level 01, build and test physical prototypes in Level 02, and compete live in the Robotics Arena.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-slate-400 block">VENUE</span>
              <span className="text-white mt-1 block">{siteConfig.venueText}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-slate-400 block">PRIZE POOL</span>
              <span className="text-cyan-300 mt-1 block">Up to ₹10,000 + Certificates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TECHNOLOGIES_GROUPS.slice(0, 3).map((g) => (
          <div key={g.group} className="rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-3">
            <h3 className="font-display text-lg font-bold text-cyan-300">{g.group}</h3>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArenaPage() {
  const {schedule, stage3Event} = useSpecteQ();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-12">
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-xs tracking-[0.2em] text-fuchsia-400 uppercase">Championship Stage</p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          The Robotics Arena & Timeline
        </h1>
        <p className="text-slate-300 leading-relaxed">
          Inspect the configurable 2027 competition timeline and Final Robotics Arena protocol.
        </p>
      </div>

      <div className="hud-panel-magenta p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <p className="font-mono text-xs text-fuchsia-300 uppercase">Stage 3 · Final Boss</p>
          <h2 className="font-display text-2xl font-bold text-white">{stage3Event.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{stage3Event.description}</p>
          <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-400" />
              {stage3Event.venue}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-fuchsia-400" />
              {stage3Event.startDateTime}
            </span>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            to="/leaderboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
          >
            <Trophy className="h-4 w-4" />
            View Live Leaderboard
          </Link>
          <Link
            to="/missions"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:border-cyan-400"
          >
            Explore Arena Tracks
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">Event Schedule & Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300">{task.category}</span>
                <span className="text-slate-400">{task.status}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">{task.title}</h3>
              <p className="text-sm text-slate-300">{task.description}</p>
              <p className="font-mono text-xs text-slate-400 pt-1">
                Start: {task.startDate} · End: {task.endDate} · Duration: {task.duration}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RulesPage() {
  const [openRule, setOpenRule] = useState<string | null>('01');
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">Official Rulebook</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Rules & Guidelines
          </h1>
          <p className="mt-2 text-slate-300">
            Fair play, safety, integrity, and respect are essential throughout SpecteQ 2027.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="rounded-lg bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 whitespace-nowrap shrink-0 min-h-[42px]"
        >
          Contact Committee
        </button>
      </div>

      <div className="space-y-3">
        {RULES_DATA.map((rule) => {
          const isOpen = openRule === rule.number;
          return (
            <div key={rule.number} className="rounded-xl border border-slate-800 bg-[#0b1120] overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenRule(isOpen ? null : rule.number)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-900/60"
              >
                <div>
                  <span className="font-mono text-xs text-cyan-300 block">
                    Rule {rule.number} · {rule.status}
                  </span>
                  <span className="font-display text-lg font-bold text-white">{rule.title}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-800 px-5 py-4 bg-slate-950/50">
                  <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                    {rule.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-900">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-fuchsia-400" />
          <h2 className="font-display text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_DATA.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-2">
              <h3 className="text-sm font-bold text-white">{faq.q}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <ContactCommitteeModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

export function ContactPage() {
  const {siteConfig, pushToast} = useSpecteQ();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    pushToast('Message prepared for SpecteQ organizers.');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">Get In Touch</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
            Contact Organizers
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Have questions about team eligibility, hardware scrutiny, or mission tracks? Reach the SpecteQ 2027 Committee directly.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
            <div>
              <span className="font-mono text-xs text-slate-400 block">Committee Email</span>
              <a href={`mailto:${siteConfig.committeeEmail}`} className="text-white hover:text-cyan-300 break-all">
                {siteConfig.committeeEmail}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-fuchsia-400 shrink-0 mt-1" />
            <div>
              <span className="font-mono text-xs text-slate-400 block">Event Venue</span>
              <span className="text-slate-200">{siteConfig.venueText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 hud-panel p-6 sm:p-8">
        {submitted ? (
          <div className="space-y-4 py-6">
            <h2 className="font-display text-2xl font-bold text-emerald-300">Ready to Send</h2>
            <p className="text-sm text-slate-300">
              Click below to launch your email client addressed to the organizing committee, or log into the Student Portal to track a support ticket.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.committeeEmail}?subject=${encodeURIComponent(
                  `[SpecteQ 2027 Inquiry] ${name}`
                )}&body=${encodeURIComponent(message)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950"
              >
                Open Email Client
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Send Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white">Send an Inquiry</h2>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 min-h-[44px]"
            >
              <Send className="h-4 w-4" />
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const {siteConfig} = useSpecteQ();
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <div className="hud-panel p-8 sm:p-12 text-center space-y-6">
        <p className="font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">
          LEVEL 00 · PLAYER ENTRY
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          Insert Coin. Join the Game.
        </h1>
        <p className="mx-auto max-w-2xl text-slate-300 leading-relaxed">
          Register your Gaming Team for SpecteQ 2027. After submitting the official registration form, the Organizing Committee provisions your team account credentials for the Participant Portal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-xs text-slate-400 block">Team Requirements</span>
            <span className="mt-1 block text-sm text-white">{siteConfig.teamSizeNote}</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-xs text-slate-400 block">Registration Fee</span>
            <span className="mt-1 block text-sm text-white">{siteConfig.registrationFeeNote}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {siteConfig.googleFormUrl ? (
            <a
              href={siteConfig.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-btn-primary inline-flex items-center gap-2 bg-cyan-400 px-8 py-4 text-sm font-extrabold text-slate-950 hover:bg-cyan-300 min-h-[48px]"
            >
              Register Your Team Now
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="hud-btn-primary inline-flex items-center gap-2 bg-slate-800 px-8 py-4 text-sm font-bold text-slate-400 cursor-not-allowed min-h-[48px]"
            >
              Registration Details Will Be Announced Soon
            </button>
          )}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-4 text-sm font-semibold text-white hover:border-cyan-400 min-h-[48px]"
          >
            Team Portal Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
