import {useState} from 'react';
import {CheckCircle2, Plus, Trash2, Video} from 'lucide-react';
import {COMPETITION_CATEGORIES} from '../../data/specteqData';
import {SPECTEQ_ASSETS} from '../../lib/assets';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';
import type {CategorySlug, GalleryItem, ResourceType, SubmissionStatus} from '../../types/specteq';

export function AdminContentPage() {
  const {
    stages,
    materials,
    submissions,
    teams,
    stage3Event,
    gallery,
    upsertMaterial,
    deleteMaterial,
    upsertStage,
    toggleStageActive,
    reviewSubmission,
    updateStage3Event,
    upsertGalleryItem,
    deleteGalleryItem,
  } = useSpecteQ();

  const [tab, setTab] = useState<'materials' | 'stages' | 'stage3' | 'submissions' | 'gallery'>('materials');

  // New Material State
  const [matStageId, setMatStageId] = useState(stages[0]?.id || '');
  const activeMatStageId = stages.some((s) => s.id === matStageId) ? matStageId : stages[0]?.id || '';
  const [matCategory, setMatCategory] = useState<CategorySlug | 'all'>('all');
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<ResourceType>('PDF');
  const [matUrl, setMatUrl] = useState('');
  const [matDesc, setMatDesc] = useState('');

  // New Dynamic Stage State
  const [newStageNum, setNewStageNum] = useState(stages.length);
  const [newStageTitle, setNewStageTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  // Submission Review State
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  // Gallery Item State
  const [galTitle, setGalTitle] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryItem['category']>('Arena Finals');
  const [galImg, setGalImg] = useState<string>(SPECTEQ_ASSETS.galleryArenaFinals);

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matUrl.trim() || !activeMatStageId) return;
    upsertMaterial({
      id: `mat-${Date.now()}`,
      stageId: activeMatStageId,
      category: matCategory,
      title: matTitle.trim(),
      description: matDesc.trim(),
      resourceType: matType,
      url: matUrl.trim(),
      isEnabled: true,
      createdAt: new Date().toISOString(),
    });
    setMatTitle('');
    setMatUrl('');
    setMatDesc('');
  };

  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageTitle.trim() || !newTaskTitle.trim()) return;
    upsertStage({
      id: `stage-${Date.now()}`,
      stageNumber: Number(newStageNum),
      slug: `stage-${newStageNum}-${Date.now()}`,
      title: newStageTitle.trim(),
      taskTitle: newTaskTitle.trim(),
      description: newStageDesc.trim(),
      guidelines: ['Follow all safety and competition rules for this stage.'],
      startDate: 'TBD',
      deadline: 'TBD',
      estimatedDuration: '1 Week',
      isPublished: true,
      isActive: true,
      hasQuiz: true,
      hasAssignment: true,
      assignmentTitle: `${newTaskTitle.trim()} Deliverable`,
      assignmentInstructions: 'Submit your deliverable URL or documentation.',
      acceptedFormats: 'PDF, GitHub URL, Drive URL',
      maxFileSizeMb: 25,
      allowResubmission: true,
      completionRules: {requireGuidelines: true, requireQuizPass: false, requireAssignment: true},
    });
    setNewStageTitle('');
    setNewTaskTitle('');
    setNewStageDesc('');
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim()) return;
    upsertGalleryItem({
      id: `gal-${Date.now()}`,
      title: galTitle.trim(),
      caption: galCaption.trim(),
      category: galCategory,
      imageUrl: galImg,
      year: '2027',
      isFeatured: true,
    });
    setGalTitle('');
    setGalCaption('');
  };

  return (
    <AdminLayout title="Content & Stage Management">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
          {[
            {id: 'materials', label: 'Task Materials'},
            {id: 'stages', label: 'Dynamic Stages'},
            {id: 'stage3', label: 'Stage 3 Event'},
            {id: 'submissions', label: `Submissions (${submissions.length})`},
            {id: 'gallery', label: `Gallery (${gallery.length})`},
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-lg px-4 py-2 text-xs font-bold ${
                tab === t.id ? 'bg-white text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'materials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddMaterial} className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3 self-start">
              <h2 className="font-display text-lg font-bold text-white">Add Task Material</h2>
              <div className="grid grid-cols-2 gap-2">
                <select value={activeMatStageId} onChange={(e) => setMatStageId(e.target.value)} className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white">
                  {stages.length === 0 ? (
                    <option value="">Create a stage first</option>
                  ) : (
                    stages.map((s) => (
                      <option key={s.id} value={s.id}>Stage {s.stageNumber}</option>
                    ))
                  )}
                </select>
                <select value={matCategory} onChange={(e) => setMatCategory(e.target.value as CategorySlug | 'all')} className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white">
                  <option value="all">All Categories</option>
                  {COMPETITION_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <input required value={matTitle} onChange={(e) => setMatTitle(e.target.value)} placeholder="Material Title" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <div className="grid grid-cols-3 gap-2">
                <select value={matType} onChange={(e) => setMatType(e.target.value as ResourceType)} className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white">
                  <option>PDF</option>
                  <option>Document</option>
                  <option>Video</option>
                  <option>Link</option>
                  <option>Code</option>
                  <option>ZIP</option>
                </select>
                <input required value={matUrl} onChange={(e) => setMatUrl(e.target.value)} placeholder="https://..." className="col-span-2 rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-white" />
              </div>
              <textarea rows={2} value={matDesc} onChange={(e) => setMatDesc(e.target.value)} placeholder="Description" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50">
                <Plus className="h-3.5 w-3.5" />
                Publish Material
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {materials.map((m) => (
                <div key={m.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-indigo-300">
                      {m.stageId} · {m.category} · {m.resourceType}
                    </p>
                    <h3 className="font-semibold text-white">{m.title}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{m.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => upsertMaterial({...m, isEnabled: !m.isEnabled})}
                      className={`rounded px-2.5 py-1 text-xs font-semibold ${m.isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}
                    >
                      {m.isEnabled ? 'Enabled' : 'Hidden'}
                    </button>
                    <button type="button" onClick={() => deleteMaterial(m.id)} className="rounded border border-rose-500/40 p-1.5 text-rose-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleCreateStage} className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3 self-start">
              <h2 className="font-display text-lg font-bold text-white">Create Dynamic Stage</h2>
              <input type="number" value={newStageNum} onChange={(e) => setNewStageNum(Number(e.target.value))} placeholder="Stage Number" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white font-mono" />
              <input required value={newStageTitle} onChange={(e) => setNewStageTitle(e.target.value)} placeholder="Stage Title (e.g. Stage 4 · Bonus Challenge)" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <input required value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Task Title" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <textarea rows={3} value={newStageDesc} onChange={(e) => setNewStageDesc(e.target.value)} placeholder="Stage description..." className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50">
                <Plus className="h-3.5 w-3.5" />
                Create & Publish Stage
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {stages.map((st) => (
                <div key={st.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-indigo-300">Stage {st.stageNumber}</p>
                    <h3 className="font-bold text-white">{st.title}</h3>
                    <p className="text-xs text-zinc-400">{st.taskTitle}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => upsertStage({...st, isPublished: !st.isPublished})}
                      className={`rounded px-3 py-1.5 text-xs font-semibold ${st.isPublished ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-400'}`}
                    >
                      {st.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStageActive(st.id)}
                      className={`rounded px-3 py-1.5 text-xs font-bold ${st.isActive ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      {st.isActive ? 'Active' : 'Locked'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stage3' && (
          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-4 max-w-2xl">
            <h2 className="font-display text-xl font-bold text-white">Stage 3 · Final Robotics Arena Config</h2>
            <input value={stage3Event.title} onChange={(e) => updateStage3Event({...stage3Event, title: e.target.value})} className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
            <input value={stage3Event.venue} onChange={(e) => updateStage3Event({...stage3Event, venue: e.target.value})} placeholder="Venue" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
            <div className="grid grid-cols-2 gap-3">
              <input value={stage3Event.startDateTime} onChange={(e) => updateStage3Event({...stage3Event, startDateTime: e.target.value})} placeholder="Start Date/Time" className="rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <input value={stage3Event.endDateTime} onChange={(e) => updateStage3Event({...stage3Event, endDateTime: e.target.value})} placeholder="End Date/Time" className="rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
            </div>
            <textarea rows={3} value={stage3Event.description} onChange={(e) => updateStage3Event({...stage3Event, description: e.target.value})} className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
            <textarea rows={3} value={stage3Event.instructions} onChange={(e) => updateStage3Event({...stage3Event, instructions: e.target.value})} className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
          </div>
        )}

        {tab === 'submissions' && (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-10 text-center text-zinc-400">
                No team assignment submissions yet.
              </div>
            ) : (
              submissions.map((sub) => {
                const team = teams.find((t) => t.id === sub.teamId);
                return (
                  <div key={sub.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs text-indigo-300">
                          {sub.stageId} · {sub.submissionType}
                        </p>
                        <h3 className="font-bold text-white">{team?.teamName || sub.teamId}</h3>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-300">{sub.status}</span>
                    </div>
                    {sub.contentUrl && (
                      <a href={sub.contentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-300 underline break-all">
                        {sub.contentUrl}
                      </a>
                    )}
                    <p className="text-sm text-zinc-300">{sub.notes}</p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-800">
                      <input
                        type="text"
                        value={feedbackMap[sub.id] ?? sub.adminFeedback}
                        onChange={(e) => setFeedbackMap((prev) => ({...prev, [sub.id]: e.target.value}))}
                        placeholder="Add evaluation feedback..."
                        className="flex-1 rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-white"
                      />
                      {(['Accepted', 'Revision Required', 'Rejected'] as SubmissionStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => reviewSubmission(sub.id, st, feedbackMap[sub.id] ?? sub.adminFeedback)}
                          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:border-indigo-400"
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddGallery} className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3 self-start">
              <h2 className="font-display text-lg font-bold text-white">Add Gallery Photo</h2>
              <input required value={galTitle} onChange={(e) => setGalTitle(e.target.value)} placeholder="Photo Title" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <select value={galCategory} onChange={(e) => setGalCategory(e.target.value as GalleryItem['category'])} className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white">
                <option>Arena Finals</option>
                <option>Hardware & Prototyping</option>
                <option>Training Workshops</option>
              </select>
              <input required value={galImg} onChange={(e) => setGalImg(e.target.value)} placeholder="Image asset path or URL" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-white font-mono" />
              <textarea rows={2} value={galCaption} onChange={(e) => setGalCaption(e.target.value)} placeholder="Caption" className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white" />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50">
                <Plus className="h-3.5 w-3.5" />
                Add to Gallery
              </button>
            </form>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-indigo-300">{g.category}</p>
                    <p className="font-bold text-white text-sm">{g.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">{g.caption}</p>
                  </div>
                  <button type="button" onClick={() => deleteGalleryItem(g.id)} className="rounded border border-rose-500/40 p-1.5 text-rose-300 shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminLiveSessionsPage() {
  const {liveSessions, upsertLiveSession} = useSpecteQ();
  const [stageNum, setStageNum] = useState(0);

  const stageSessions = liveSessions.filter((ls) => ls.stageNumber === stageNum);

  return (
    <AdminLayout title="Live Sessions (Google Meet)">
      <div className="space-y-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setStageNum(num)}
              className={`rounded-lg px-4 py-2 text-xs font-bold ${
                stageNum === num
                  ? 'bg-white text-zinc-950'
                  : 'border border-zinc-800 bg-[#0b0d17] text-zinc-300 hover:text-white'
              }`}
            >
              Stage {num} Sessions
            </button>
          ))}
        </div>

        {stageSessions.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-10 text-center space-y-3">
            <Video className="h-8 w-8 text-zinc-500 mx-auto" />
            <p className="text-sm text-zinc-400">No session cards configured for Stage {stageNum} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {stageSessions.map((ls) => (
              <div key={ls.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-indigo-300">{ls.category}</span>
                  <button
                    type="button"
                    onClick={() => upsertLiveSession({...ls, isEnabled: !ls.isEnabled})}
                    className={`rounded px-2.5 py-1 text-xs font-bold ${
                      ls.isEnabled ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {ls.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <input
                  value={ls.title}
                  onChange={(e) => upsertLiveSession({...ls, title: e.target.value})}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
                />
                <input
                  value={ls.meetingLink}
                  onChange={(e) => upsertLiveSession({...ls, meetingLink: e.target.value})}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-indigo-300 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={ls.date}
                    onChange={(e) => upsertLiveSession({...ls, date: e.target.value})}
                    placeholder="Date"
                    className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    value={ls.time}
                    onChange={(e) => upsertLiveSession({...ls, time: e.target.value})}
                    placeholder="Time"
                    className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  value={ls.description}
                  onChange={(e) => upsertLiveSession({...ls, description: e.target.value})}
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-zinc-300"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Auto-synced with Student Portal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
