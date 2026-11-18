import {useState} from 'react';
import {X, Send, Mail} from 'lucide-react';
import {useSpecteQ} from '../lib/store';

export function ContactCommitteeModal({open, onClose}: {open: boolean; onClose: () => void}) {
  const {siteConfig, pushToast} = useSpecteQ();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Rules Clarification');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
    pushToast('Inquiry recorded. You can also reach the committee directly via email.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-committee-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-indigo-400/30 bg-[#0b0d17] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="contact-committee-title" className="font-display text-xl font-bold text-white">
          Contact the SpecteQ Committee
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Direct email:{' '}
          <a href={`mailto:${siteConfig.committeeEmail}`} className="text-indigo-300 underline">
            {siteConfig.committeeEmail}
          </a>
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200 space-y-3">
            <p className="font-semibold">Message prepared for the SpecteQ Organizing Committee.</p>
            <p className="text-zinc-300">
              If your team already holds portal credentials, submit tracked tickets inside Student Portal &rarr; Support.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href={`mailto:${siteConfig.committeeEmail}?subject=${encodeURIComponent(
                  `[SpecteQ 2027] ${topic} - ${name}`
                )}&body=${encodeURIComponent(message)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50"
              >
                <Mail className="h-3.5 w-3.5" />
                Open in Email Client
              </a>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  onClose();
                }}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-lg border border-zinc-800 bg-[#070810] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full rounded-lg border border-zinc-800 bg-[#070810] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Inquiry Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-[#070810] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              >
                <option>Rules Clarification</option>
                <option>Team Registration</option>
                <option>Category / Robot Specifications</option>
                <option>Sponsorship / Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Question or Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question regarding rules, eligibility, or arena requirements..."
                className="w-full rounded-lg border border-zinc-800 bg-[#070810] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 min-h-[42px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-indigo-50 min-h-[42px]"
              >
                <Send className="h-4 w-4" />
                Send Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
