import {useState} from 'react';
import {CheckSquare, Eye, Plus, Square, Trash2, X} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {AdminLayout} from '../../components/AdminLayout';
import type {QuestionType, QuizAttempt, QuizQuestion, StageQuizConfig} from '../../types/specteq';

export function AdminQuizPage() {
  const {
    stages,
    teams,
    questions,
    stageQuizzes,
    quizAttempts,
    upsertQuestion,
    deleteQuestion,
    upsertStageQuiz,
  } = useSpecteQ();

  const [tab, setTab] = useState<'bank' | 'settings' | 'results'>('bank');
  const [selectedStageId, setSelectedStageId] = useState(stages[0]?.id || '');
  const activeStageId = stages.some((s) => s.id === selectedStageId) ? selectedStageId : stages[0]?.id || '';
  const [inspectAttempt, setInspectAttempt] = useState<QuizAttempt | null>(null);

  // Question Bank Form
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>('mcq');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('');
  const [topic, setTopic] = useState('Control Systems');
  const [difficulty, setDifficulty] = useState<QuizQuestion['difficulty']>('Intermediate');

  const currentStageQuiz: StageQuizConfig = stageQuizzes.find((sq) => sq.stageId === activeStageId) || {
    id: `quiz-${activeStageId || 'stage'}`,
    stageId: activeStageId,
    title: `Stage Quiz · ${activeStageId || 'Unassigned'}`,
    description: 'Official stage assessment',
    mode: 'manual',
    isEnabled: false,
    startAt: '',
    endAt: '',
    questionCount: 5,
    pointsPerQuestion: 2,
    passingScorePct: 60,
    durationMinutes: 15,
    maxAttempts: 1,
    randomizeQuestions: false,
    randomizeOptions: false,
    revealAnswers: true,
    assignedQuestionIds: [],
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;
    const options =
      qType === 'true_false'
        ? ['True', 'False']
        : qType === 'short'
          ? []
          : [optA, optB, optC, optD].map((o) => o.trim()).filter(Boolean);

    upsertQuestion({
      id: `q-${Date.now()}`,
      questionText: qText.trim(),
      questionType: qType,
      options,
      correctAnswer: correct.trim() || options[0] || '',
      explanation: '',
      points: 2,
      topic,
      difficulty,
    });
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrect('');
  };

  const toggleQuestionAssignment = (qId: string) => {
    const exists = currentStageQuiz.assignedQuestionIds.includes(qId);
    const nextIds = exists
      ? currentStageQuiz.assignedQuestionIds.filter((id) => id !== qId)
      : [...currentStageQuiz.assignedQuestionIds, qId];
    upsertStageQuiz({...currentStageQuiz, assignedQuestionIds: nextIds});
  };

  return (
    <AdminLayout title="Quiz Management">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
            {[
              {id: 'bank', label: '1. Question Bank & Assignment'},
              {id: 'settings', label: '2. Stage Quiz Settings'},
              {id: 'results', label: `3. Results (${quizAttempts.length})`},
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

          <select
            value={activeStageId}
            onChange={(e) => setSelectedStageId(e.target.value)}
            aria-label="Select Stage"
            className="rounded-lg border border-zinc-700 bg-[#0b0d17] px-3.5 py-2 text-xs font-semibold text-white"
          >
            {stages.length === 0 ? (
              <option value="">No stages created yet</option>
            ) : (
              stages.map((s) => (
                <option key={s.id} value={s.id}>
                  Stage {s.stageNumber}: {s.taskTitle}
                </option>
              ))
            )}
          </select>
        </div>

        {tab === 'bank' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleAddQuestion}
              className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-3 self-start"
            >
              <h2 className="font-display text-lg font-bold text-white">Create Bank Question</h2>
              <p className="text-xs text-zinc-400">
                Questions live independently in the bank. Toggle checkboxes on the right to assign them to the selected stage.
              </p>

              <textarea
                rows={3}
                required
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter question prompt..."
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-sm text-white"
              />

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as QuestionType)}
                  className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
                >
                  <option value="mcq">MCQ</option>
                  <option value="true_false">True / False</option>
                  <option value="short">Short Answer</option>
                </select>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Topic"
                  className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
                />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuizQuestion['difficulty'])}
                  className="rounded-lg border border-zinc-700 bg-[#070810] px-2.5 py-2 text-xs text-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {qType === 'mcq' && (
                <div className="grid grid-cols-2 gap-2">
                  <input value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A" className="rounded border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white" />
                  <input value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B" className="rounded border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white" />
                  <input value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C" className="rounded border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white" />
                  <input value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D" className="rounded border border-zinc-700 bg-[#070810] px-2.5 py-1.5 text-xs text-white" />
                </div>
              )}

              <input
                type="text"
                required
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                placeholder={qType === 'true_false' ? 'True or False' : 'Exact Correct Answer text'}
                className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-xs text-white"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Question Bank
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-lg border border-zinc-800 bg-[#0b0d17] px-4 py-3 text-xs text-indigo-300 font-mono">
                Assigned to selected stage: {currentStageQuiz.assignedQuestionIds.length} questions
              </div>
              {questions.map((q) => {
                const assigned = currentStageQuiz.assignedQuestionIds.includes(q.id);
                return (
                  <div key={q.id} className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-4 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-zinc-400">
                        {q.topic} · {q.difficulty} · {q.questionType.toUpperCase()}
                      </p>
                      <p className="text-sm font-semibold text-white">{q.questionText}</p>
                      <p className="text-xs text-emerald-400">Answer: {q.correctAnswer}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleQuestionAssignment(q.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          assigned
                            ? 'bg-white text-zinc-950'
                            : 'border border-zinc-700 text-zinc-300 hover:border-indigo-400'
                        }`}
                      >
                        {assigned ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                        {assigned ? 'Assigned' : 'Assign'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(q.id)}
                        aria-label="Delete question"
                        className="rounded border border-rose-500/40 p-1.5 text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-6 space-y-5 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{currentStageQuiz.title}</h2>
                <p className="text-xs text-zinc-400">Configure manual/scheduled activation, marks, and attempts.</p>
              </div>
              <button
                type="button"
                onClick={() => upsertStageQuiz({...currentStageQuiz, isEnabled: !currentStageQuiz.isEnabled})}
                className={`rounded-lg px-4 py-2 text-xs font-bold ${
                  currentStageQuiz.isEnabled ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {currentStageQuiz.isEnabled ? 'Quiz Enabled' : 'Quiz Disabled'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Mode</label>
                <select
                  value={currentStageQuiz.mode}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, mode: e.target.value as 'manual' | 'scheduled'})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white"
                >
                  <option value="manual">Manual Control</option>
                  <option value="scheduled">Scheduled Window</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Question Limit</label>
                <input
                  type="number"
                  min={1}
                  value={currentStageQuiz.questionCount}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, questionCount: Number(e.target.value) || 1})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Points / Question</label>
                <input
                  type="number"
                  min={1}
                  value={currentStageQuiz.pointsPerQuestion}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, pointsPerQuestion: Number(e.target.value) || 1})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={currentStageQuiz.durationMinutes}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, durationMinutes: Number(e.target.value) || 5})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Max Attempts</label>
                <input
                  type="number"
                  min={1}
                  value={currentStageQuiz.maxAttempts}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, maxAttempts: Number(e.target.value) || 1})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Passing Percentage (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={currentStageQuiz.passingScorePct}
                  onChange={(e) =>
                    upsertStageQuiz({...currentStageQuiz, passingScorePct: Number(e.target.value) || 0})
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-[#070810] px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'results' && (
          <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-[#070810] font-mono text-xs text-zinc-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Correct</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {quizAttempts.map((att) => {
                  const team = teams.find((t) => t.id === att.teamId);
                  return (
                    <tr key={att.id}>
                      <td className="px-4 py-3 font-semibold text-white">{team?.teamName || att.teamId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-indigo-300">{att.stageId}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-white">
                        {att.score} / {att.totalPossible}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{att.correctCount}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-emerald-400">
                        {att.passed ? 'Passed' : 'Not Passed'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectAttempt(att)}
                          className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2.5 py-1 text-xs text-zinc-200 hover:border-indigo-400"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {quizAttempts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      No quiz submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {inspectAttempt && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-[#0b0d17] p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">Attempt Breakdown</h3>
                <button type="button" onClick={() => setInspectAttempt(null)} className="text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="font-mono text-xs text-indigo-300">
                Score: {inspectAttempt.score} / {inspectAttempt.totalPossible} · Time: {inspectAttempt.timeTakenSeconds}s
              </p>
              <div className="space-y-2">
                {Object.entries(inspectAttempt.answers).map(([qid, ans]) => {
                  const q = questions.find((item) => item.id === qid);
                  const ok = q && ans.toLowerCase() === q.correctAnswer.toLowerCase();
                  return (
                    <div key={qid} className="rounded-lg border border-zinc-800 bg-[#070810] p-3 text-xs space-y-1">
                      <p className="font-semibold text-white">{q?.questionText || qid}</p>
                      <p className={ok ? 'text-emerald-400' : 'text-rose-400'}>Team Answer: {ans}</p>
                      {q && <p className="text-zinc-400">Correct Answer: {q.correctAnswer}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
