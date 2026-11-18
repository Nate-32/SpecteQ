import {useState} from 'react';
import {Plus, RotateCcw, Save, Trash2} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';
import type {AnnouncementCategory, AnnouncementPriority, SupportTicket} from '../../types/specteq';

export function AdminNotificationsPage() {
  const {
    notifications,
    announcements,
    tickets,
    teams,
    upsertNotification,
    deleteNotification,
    upsertAnnouncement,
    deleteAnnouncement,
    updateSupportTicket,
  } = useSpecteQ();

  const [tab, setTab] = useState<'popups' | 'announcements' | 'tickets'>('popups');

  // Popup Notification Form
  const [nTitle, setNTitle] = useState('');
  const [nDesc, setNDesc] = useState('');
  const [nScope, setNScope] = useState<'all' | 'category'>('all');
  const [nTargetVal, setNTargetVal] = useState('line-follower');

  // Announcement Form
  const [aTitle, setATitle] = useState('');
  const [aContent, setAContent] = useState('');
  const [aCat, setACat] = useState<AnnouncementCategory>('General');
  const [aPri, setAPri] = useState<AnnouncementPriority>('Normal');

  // Ticket Reply map
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const handleAddPopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle.trim() || !nDesc.trim()) return;
    upsertNotification({
      id: `notif-${Date.now()}`,
      title: nTitle.trim(),
      description: nDesc.trim(),
      targetScope: nScope,
      targetValue: nScope === 'category' ? nTargetVal : undefined,
      isEnabled: true,
      createdAt: new Date().toISOString(),
    });
    setNTitle('');
    setNDesc('');
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim() || !aContent.trim()) return;
    upsertAnnouncement({
      id: `ann-${Date.now()}`,
      title: aTitle.trim(),
      content: aContent.trim(),
      category: aCat,
      priority: aPri,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });
    setATitle('');
    setAContent('');
  };

  return (
    <AdminLayout title="Notifications & Announcements">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-[#0b1120] p-1.5">
          {[
            {id: 'popups', label: `Popup Alerts (${notifications.length})`},
            {id: 'announcements', label: `Announcements (${announcements.length})`},
            {id: 'tickets', label: `Support Tickets (${tickets.length})`},
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-lg px-4 py-2 text-xs font-bold ${
                tab === t.id ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'popups' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddPopup} className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-3 self-start">
              <h2 className="font-display text-lg font-bold text-white">Create Login Popup Alert</h2>
              <p className="text-xs text-slate-400">
                Enabled notifications appear once to targeted teams after login.
              </p>
              <input required value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="Notification Title" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
              <textarea required rows={3} value={nDesc} onChange={(e) => setNDesc(e.target.value)} placeholder="Message content..." className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
              <div className="grid grid-cols-2 gap-2">
                <select value={nScope} onChange={(e) => setNScope(e.target.value as 'all' | 'category')} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white">
                  <option value="all">Target: All Teams</option>
                  <option value="category">Target: Specific Category</option>
                </select>
                {nScope === 'category' && (
                  <select value={nTargetVal} onChange={(e) => setNTargetVal(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white">
                    <option value="line-follower">Line Follower</option>
                    <option value="maze-solver">Maze Solver</option>
                    <option value="self-balancing">Self Balancing</option>
                  </select>
                )}
              </div>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950">
                <Plus className="h-3.5 w-3.5" />
                Create Notification
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-cyan-300">
                      Scope: {n.targetScope} {n.targetValue ? `(${n.targetValue})` : ''}
                    </p>
                    <h3 className="font-bold text-white">{n.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{n.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => upsertNotification({...n, isEnabled: !n.isEnabled})}
                      className={`rounded px-2.5 py-1 text-xs font-bold ${n.isEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      {n.isEnabled ? 'Enabled' : 'Paused'}
                    </button>
                    <button type="button" onClick={() => deleteNotification(n.id)} className="rounded border border-rose-500/40 p-1.5 text-rose-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddAnnouncement} className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-3 self-start">
              <h2 className="font-display text-lg font-bold text-white">Publish Official Announcement</h2>
              <input required value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="Announcement Title" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
              <div className="grid grid-cols-2 gap-2">
                <select value={aCat} onChange={(e) => setACat(e.target.value as AnnouncementCategory)} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white">
                  <option>General</option>
                  <option>Important</option>
                  <option>Schedule Update</option>
                  <option>Task Update</option>
                  <option>Technical Notice</option>
                  <option>Deadline Reminder</option>
                </select>
                <select value={aPri} onChange={(e) => setAPri(e.target.value as AnnouncementPriority)} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white">
                  <option>Normal</option>
                  <option>Important</option>
                  <option>Urgent</option>
                </select>
              </div>
              <textarea required rows={3} value={aContent} onChange={(e) => setAContent(e.target.value)} placeholder="Announcement details..." className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950">
                <Plus className="h-3.5 w-3.5" />
                Publish
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-fuchsia-300">
                      {a.category} · {a.priority}
                    </p>
                    <h3 className="font-bold text-white">{a.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{a.content}</p>
                  </div>
                  <button type="button" onClick={() => deleteAnnouncement(a.id)} className="rounded border border-rose-500/40 p-1.5 text-rose-300 shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tickets' && (
          <div className="space-y-3">
            {tickets.map((t) => {
              const team = teams.find((tm) => tm.id === t.teamId);
              return (
                <div key={t.id} className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-cyan-300">
                      {team?.teamName || t.teamId} · {t.category}
                    </span>
                    <span className="font-bold text-amber-300">{t.status}</span>
                  </div>
                  <h3 className="font-bold text-white">{t.subject}</h3>
                  <p className="text-sm text-slate-300">{t.description}</p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
                    <input
                      value={replyMap[t.id] ?? t.adminReply ?? ''}
                      onChange={(e) => setReplyMap((prev) => ({...prev, [t.id]: e.target.value}))}
                      placeholder="Write organizer response..."
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                    {(['In Progress', 'Resolved'] as SupportTicket['status'][]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateSupportTicket(t.id, st, replyMap[t.id] ?? t.adminReply)}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:border-cyan-400"
                      >
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminSettingsPage() {
  const {siteConfig, updateSiteConfig, activityLogs, session, supabaseConnected, resetDemoDatabase} = useSpecteQ();
  const [form, setForm] = useState(siteConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(form);
  };

  return (
    <AdminLayout title="Settings & Audit Log">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-white">Competition & Public Site Config</h2>
          <p className="text-xs text-slate-400">
            Backend mode: {supabaseConnected ? 'Connected to Supabase' : 'Local Preview Persistence'} · Admin: {session?.email}
          </p>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Official Registration Google Form URL</label>
            <input
              type="url"
              value={form.googleFormUrl}
              onChange={(e) => setForm({...form, googleFormUrl: e.target.value})}
              placeholder="https://docs.google.com/forms/..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Committee Email</label>
            <input
              type="email"
              value={form.committeeEmail}
              onChange={(e) => setForm({...form, committeeEmail: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Arena Venue Display Text</label>
            <input
              type="text"
              value={form.venueText}
              onChange={(e) => setForm({...form, venueText: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Team Size Note (Public Registration)</label>
            <input
              type="text"
              value={form.teamSizeNote}
              onChange={(e) => setForm({...form, teamSizeNote: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Registration Fee Note</label>
            <input
              type="text"
              value={form.registrationFeeNote}
              onChange={(e) => setForm({...form, registrationFeeNote: e.target.value})}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300"
            >
              <Save className="h-3.5 w-3.5" />
              Save Configuration
            </button>
            <button
              type="button"
              onClick={resetDemoDatabase}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Preview State
            </button>
          </div>
        </form>

        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0b1120] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-white">Admin Activity Audit Log</h2>
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-mono">
                  <span>{log.action}</span>
                  <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="font-semibold text-white">{log.target}</p>
                <p className="text-slate-400">
                  {log.details} · by {log.actor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
