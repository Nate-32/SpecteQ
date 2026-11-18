import {useEffect, useMemo, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Flag,
  Lock,
  Play,
  Send,
  Video,
} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {StudentLayout} from '../../components/StudentLayout';
import type {AssignmentSubmission, QuizQuestion} from '../../types/specteq';

export function StudentStagePage() {
  const {stageId} = useParams<{stageId: string}>();
  const {
    currentTeam,
    stages,
    stageProgress,
    materials,
    stageQuizzes,
    questions,
    quizAttempts,
    submissions,
    liveSessions,
    markGuidelinesReviewed,
    toggleMaterialCompleted,
    submitQuizAttempt,
    submitAssignment,
  } = useSpecteQ();

  const stage = stages.find((s) => s.id === stageId);
  const progress = stageProgress.find((p) => p.stageId === stageId && p.teamId === currentTeam?.id);
  const stageMaterials = materials.filter(
    (m) =>
      m.isEnabled &&
      m.stageId === stageId &&
      (m.category === 'all' || m.category === currentTeam?.category)
  );
  const stageQuiz = stageQuizzes.find((q) => q.stageId === stageId);
  const teamAttempts = quizAttempts.filter((a) => a.stageId === stageId && a.teamId === currentTeam?.id);
  const teamSubmission = submissions.find((s) => s.stageId === stageId && s.teamId === currentTeam?.id);
  const stageLiveSession = liveSessions.find(
    (ls) => ls.isEnabled && ls.stageNumber === stage?.stageNumber && ls.category === currentTeam?.category
  );

  // Quiz Runner State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Assignment Submission State
  const [subType, setSubType] = useState<AssignmentSubmission['submissionType']>(
    teamSubmission?.submissionType || 'Link'
  );
  const [subUrl, setSubUrl] = useState(teamSubmission?.contentUrl || '');
  const [subNotes, setSubNotes] = useState(teamSubmission?.notes || '');

  useEffect(() => {
    setQuizActive(false);
    setConfirmSubmitOpen(false);
    setAnswers({});
    setFlagged([]);
    setCurrentQIdx(0);
    setSubType(teamSubmission?.submissionType || 'Link');
    setSubUrl(teamSubmission?.contentUrl || '');
    setSubNotes(teamSubmission?.notes || '');
  }, [stageId]);

  const quizQuestions: QuizQuestion[] = useMemo(() => {
    if (!stageQuiz) return [];
    return stageQuiz.assignedQuestionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is QuizQuestion => Boolean(q))
      .slice(0, stageQuiz.questionCount);
  }, [stageQuiz, questions]);

  useEffect(() => {
    if (!quizActive || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [quizActive, secondsLeft]);

  // Auto-submit on timer expiration
  useEffect(() => {
    if (quizActive && secondsLeft === 0 && stage && currentTeam && stageQuiz) {
      submitQuizAttempt({
        stageId: stage.id,
        teamId: currentTeam.id,
        answers,
        timeTakenSeconds: stageQuiz.durationMinutes * 60,
      });
      setQuizActive(false);
    }
  }, [quizActive, secondsLeft, stage, currentTeam, stageQuiz, answers, submitQuizAttempt]);

  if (!currentTeam) return null;

  if (!stage) {
    return (
      <StudentLayout title="Stage Not Found">
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <p className="text-slate-600">This competition stage could not be found.</p>
          <Link to="/dashboard" className="text-sm font-semibold text-violet-700 underline">
            Return to Dashboard
          </Link>
        </div>
      </StudentLayout>
    );
  }

  if (!stage.isPublished || !stage.isActive) {
    return (
      <StudentLayout title={`Stage ${stage.stageNumber}`}>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3 max-w-xl mx-auto">
          <Lock className="h-10 w-10 text-slate-400 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-slate-900">{stage.title}</h2>
          <p className="text-sm text-slate-600">
            This stage is currently locked or upcoming. It will unlock automatically once activated by the SpecteQ Organizing Committee.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </StudentLayout>
    );
  }

  const startQuiz = () => {
    if (!stageQuiz) return;
    setAnswers({});
    setFlagged([]);
    setCurrentQIdx(0);
    setSecondsLeft(stageQuiz.durationMinutes * 60);
    setQuizActive(true);
  };

  const finalizeQuiz = () => {
    if (!stageQuiz) return;
    const elapsed = Math.max(1, stageQuiz.durationMinutes * 60 - secondsLeft);
    submitQuizAttempt({
      stageId: stage.id,
      teamId: currentTeam.id,
      answers,
      timeTakenSeconds: elapsed,
    });
    setConfirmSubmitOpen(false);
    setQuizActive(false);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subUrl.trim() && !subNotes.trim()) return;
    submitAssignment({
      stageId: stage.id,
      teamId: currentTeam.id,
      submissionType: subType,
      contentUrl: subUrl.trim(),
      notes: subNotes.trim(),
    });
  };

  const attemptsRemaining = stageQuiz ? Math.max(0, stageQuiz.maxAttempts - teamAttempts.length) : 0;

  return (
    <StudentLayout title={`Stage ${stage.stageNumber} · ${stage.taskTitle}`}>
      <div className="space-y-6">
        {/* A. Stage Overview */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-violet-700 uppercase">
                Stage {stage.stageNumber} · {progress?.status || 'Active'}
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900">{stage.title}</h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-slate-600">
              <span>Start: {stage.startDate}</span>
              <span>·</span>
              <span>Deadline: {stage.deadline}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{stage.description}</p>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all"
                style={{width: `${progress?.progressPct || 0}%`}}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
              {progress?.progressPct || 0}% Complete
            </span>
          </div>
        </section>

        {/* Live Session if active for this stage & team category */}
        {stageLiveSession && (
          <section className="rounded-xl border border-violet-200 bg-violet-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold text-violet-800 uppercase">
                Live Session Active · {stageLiveSession.date} · {stageLiveSession.time}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900">{stageLiveSession.title}</h3>
              <p className="text-sm text-slate-700">{stageLiveSession.description}</p>
            </div>
            <a
              href={stageLiveSession.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600 whitespace-nowrap shrink-0"
            >
              <Video className="h-4 w-4" />
              Join Live Session
            </a>
          </section>
        )}

        {/* B. Official Guidelines */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-slate-900">Guidelines & Instructions</h3>
            <button
              type="button"
              onClick={() => markGuidelinesReviewed(stage.id, currentTeam.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                progress?.guidelinesReviewed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-violet-700 text-white hover:bg-violet-600'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {progress?.guidelinesReviewed ? 'Guidelines Reviewed' : 'Mark Guidelines Reviewed'}
            </button>
          </div>
          <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5">
            {stage.guidelines.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
        </section>

        {/* C. Stage-Specific Materials */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900">Stage {stage.stageNumber} Materials</h3>
          {stageMaterials.length === 0 ? (
            <p className="text-sm text-slate-500">No materials attached to this stage yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageMaterials.map((mat) => {
                const done = progress?.completedMaterialIds.includes(mat.id);
                return (
                  <div key={mat.id} className="rounded-lg border border-slate-200 p-4 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-violet-700">{mat.resourceType}</p>
                      <h4 className="mt-1 font-semibold text-slate-900">{mat.title}</h4>
                      <p className="mt-1 text-xs text-slate-600">{mat.description}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open Resource
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleMaterialCompleted(stage.id, currentTeam.id, mat.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {done ? 'Completed' : 'Mark Read'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* D. Quiz System */}
        {stage.hasQuiz && stageQuiz && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-violet-700 uppercase">Stage Assessment</p>
                <h3 className="font-display text-lg font-bold text-slate-900">{stageQuiz.title}</h3>
                <p className="text-sm text-slate-600">{stageQuiz.description}</p>
              </div>
              {!quizActive && stageQuiz.isEnabled && attemptsRemaining > 0 && quizQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-600 shrink-0"
                >
                  <Play className="h-4 w-4" />
                  Start Quiz
                </button>
              )}
            </div>

            {!quizActive ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <span className="text-slate-500 block">Questions</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {quizQuestions.length}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <span className="text-slate-500 block">Time Limit</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {stageQuiz.durationMinutes} min
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <span className="text-slate-500 block">Passing Score</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {stageQuiz.passingScorePct}%
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <span className="text-slate-500 block">Attempts Left</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {attemptsRemaining} / {stageQuiz.maxAttempts}
                    </span>
                  </div>
                </div>

                {!stageQuiz.isEnabled && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    This quiz is currently disabled or outside its scheduled window.
                  </p>
                )}

                {teamAttempts.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold text-slate-900">Your Attempt History</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                      {teamAttempts.map((att) => (
                        <div key={att.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-mono font-semibold text-slate-900">
                            Attempt #{att.attemptNumber} · {new Date(att.completedAt).toLocaleString()}
                          </span>
                          <span className="font-mono font-bold tabular-nums text-violet-700">
                            Score: {att.score} / {att.totalPossible} ({att.passed ? 'Passed' : 'Not Passed'})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Active Interactive Quiz Runner */
              <div className="rounded-xl border border-violet-200 bg-slate-50 p-5 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <span className="font-mono text-xs font-bold text-violet-800 tabular-nums">
                    Question {currentQIdx + 1} of {quizQuestions.length}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 tabular-nums">
                    <Clock className="h-4 w-4 text-violet-700" />
                    {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                  </span>
                </div>

                {/* Question Navigation Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {quizQuestions.map((q, idx) => {
                    const answered = Boolean(answers[q.id]);
                    const isFlagged = flagged.includes(q.id);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQIdx(idx)}
                        className={`h-8 w-8 rounded-md font-mono text-xs font-bold tabular-nums border ${
                          idx === currentQIdx
                            ? 'border-violet-700 bg-violet-700 text-white'
                            : isFlagged
                              ? 'border-amber-400 bg-amber-50 text-amber-800'
                              : answered
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {quizQuestions[currentQIdx] && (
                  <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-5">
                    <p className="text-base font-semibold text-slate-900">
                      {quizQuestions[currentQIdx].questionText}
                    </p>

                    {quizQuestions[currentQIdx].questionType === 'short' ? (
                      <input
                        type="text"
                        value={answers[quizQuestions[currentQIdx].id] || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [quizQuestions[currentQIdx].id]: e.target.value,
                          }))
                        }
                        placeholder="Type your answer..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                      />
                    ) : (
                      <div className="space-y-2">
                        {quizQuestions[currentQIdx].options.map((opt) => {
                          const selected = answers[quizQuestions[currentQIdx].id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [quizQuestions[currentQIdx].id]: opt,
                                }))
                              }
                              className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors ${
                                selected
                                  ? 'border-violet-600 bg-violet-50 font-semibold text-violet-950'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentQIdx === 0}
                      onClick={() => setCurrentQIdx((p) => Math.max(0, p - 1))}
                      className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentQIdx >= quizQuestions.length - 1}
                      onClick={() => setCurrentQIdx((p) => Math.min(quizQuestions.length - 1, p + 1))}
                      className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const qid = quizQuestions[currentQIdx]?.id;
                        if (!qid) return;
                        setFlagged((prev) =>
                          prev.includes(qid) ? prev.filter((x) => x !== qid) : [...prev, qid]
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      Mark Review
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmSubmitOpen(true)}
                    className="rounded-lg bg-violet-700 px-5 py-2 text-xs font-bold text-white hover:bg-violet-600"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* E. Assignment / Submission */}
        {stage.hasAssignment && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-violet-700 uppercase">Practical Submission</p>
                <h3 className="font-display text-lg font-bold text-slate-900">{stage.assignmentTitle}</h3>
              </div>
              {teamSubmission && (
                <span className="rounded-md bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800">
                  Status: {teamSubmission.status}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600">{stage.assignmentInstructions}</p>
            <p className="font-mono text-xs text-slate-500">
              Accepted formats: {stage.acceptedFormats} · Max size: {stage.maxFileSizeMb} MB
            </p>

            {teamSubmission?.adminFeedback && (
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3.5 text-sm text-slate-800">
                <span className="font-bold block text-xs uppercase text-violet-800 mb-1">
                  Reviewer Feedback
                </span>
                {teamSubmission.adminFeedback}
              </div>
            )}

            {(!teamSubmission || stage.allowResubmission) && (
              <form onSubmit={handleAssignmentSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Submission Type</label>
                    <select
                      value={subType}
                      onChange={(e) => setSubType(e.target.value as AssignmentSubmission['submissionType'])}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="Link">Simulation / External URL</option>
                      <option value="GitHub">GitHub Repository</option>
                      <option value="Drive">Google Drive Folder</option>
                      <option value="File">File Reference</option>
                      <option value="Text">Text Response</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Resource / Submission URL</label>
                    <input
                      type="text"
                      value={subUrl}
                      onChange={(e) => setSubUrl(e.target.value)}
                      placeholder="https://wokwi.com/projects/..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Technical Notes</label>
                  <textarea
                    rows={3}
                    value={subNotes}
                    onChange={(e) => setSubNotes(e.target.value)}
                    placeholder="Summarize your wiring, control parameters, or test results..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600"
                >
                  <Send className="h-3.5 w-3.5" />
                  {teamSubmission ? 'Update Submission' : 'Submit Assignment'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* Confirmation Dialog for Quiz Submission */}
        {confirmSubmitOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 space-y-4 shadow-2xl">
              <FileText className="h-7 w-7 text-violet-700" />
              <h3 className="font-display text-lg font-bold text-slate-900">Submit Quiz Answers?</h3>
              <p className="text-sm text-slate-600">
                You have answered {Object.keys(answers).length} of {quizQuestions.length} questions. Once submitted, this attempt will be scored.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmSubmitOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Review Answers
                </button>
                <button
                  type="button"
                  onClick={finalizeQuiz}
                  className="rounded-lg bg-violet-700 px-4 py-2 text-xs font-bold text-white"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
