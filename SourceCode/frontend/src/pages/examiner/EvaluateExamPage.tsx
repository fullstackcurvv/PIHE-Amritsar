import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { getSubmissionById, evaluateSubmission } from '@/services/submissionService'
import { Button }  from '@/components/ui/Button'
import { Modal }   from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import type { ExaminerSubmission, BackendQuestion } from '@/types/exam'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStudentAnswer(
  question: BackendQuestion,
  answers: ExaminerSubmission['answers']
): string {
  const ans = answers.find(a => String(a.questionId) === String(question._id))
  if (!ans) return ''
  return ans.selectedOption ?? ans.answerText ?? ''
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface QuestionRowProps {
  question: BackendQuestion
  index: number
  answer: string
  marks: number | ''
  onChange: (qid: string, value: number | '') => void
  isAlreadyEvaluated: boolean
}

function QuestionRow({ question, index, answer, marks, onChange, isAlreadyEvaluated }: QuestionRowProps) {
  const hasAnswer  = answer !== ''
  const hasMarks   = marks !== ''
  const overMax    = hasMarks && Number(marks) > question.marks

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Left: question + marks input */}
      <div className="bg-white p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-relaxed">
                {question.questionText}
              </p>
              {question.type === 'mcq' && question.options.length > 0 && (
                <div className="mt-2 space-y-1">
                  {question.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-lg ${
                        opt === question.correctAnswer
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {opt === question.correctAnswer ? '✓ ' : ''}{opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg whitespace-nowrap">
            /{question.marks} marks
          </span>
        </div>

        {/* Marks input */}
        <div className="flex items-center gap-3 mt-4">
          <label className="text-sm font-semibold text-gray-600">Marks awarded:</label>
          <input
            type="number"
            min={0}
            max={question.marks}
            step={0.5}
            value={marks}
            disabled={isAlreadyEvaluated}
            onChange={e => {
              const raw = e.target.value
              onChange(question._id, raw === '' ? '' : Number(raw))
            }}
            className={`w-20 px-3 py-1.5 border rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 transition-colors ${
              overMax
                ? 'border-red-300 bg-red-50 text-red-700'
                : hasMarks
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          <span className="text-sm text-gray-400">/ {question.marks}</span>
          {overMax && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> Exceeds max
            </span>
          )}
        </div>
      </div>

      {/* Right: student answer */}
      <div className="bg-gray-50/60 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Student Answer
        </p>
        {hasAnswer ? (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No answer provided</p>
        )}
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function EvaluateExamPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate         = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()

  const [submission, setSubmission] = useState<ExaminerSubmission | null>(null)
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState<string | null>(null)

  // Per-question marks keyed by questionId
  const [questionMarks, setQuestionMarks] = useState<Record<string, number | ''>>({})
  const [remarks, setRemarks]             = useState('')
  const [showConfirm, setShowConfirm]     = useState(false)
  const [isSubmitting, setIsSubmitting]   = useState(false)

  useEffect(() => {
    if (!submissionId) return
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    getSubmissionById(submissionId)
      .then(data => {
        if (cancelled) return
        setSubmission(data)
      })
      .catch(err => {
        if (cancelled) return
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Failed to load submission'
        setLoadError(msg)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [submissionId])

  // ── Derived values ────────────────────────────────────────────────────────
  const totalMarks   = submission?.exam?.totalMarks ?? 0
  const passingMarks = submission?.exam?.passingMarks ?? 0
  const questions    = submission?.exam?.questions ?? []

  const totalObtained = useMemo(
    () => Object.values(questionMarks).reduce<number>((sum, m) => sum + (m === '' ? 0 : m), 0),
    [questionMarks]
  )
  const isPassed         = totalObtained >= passingMarks
  const allMarksEntered  = questions.length > 0 &&
    questions.every(q => questionMarks[q._id] !== undefined && questionMarks[q._id] !== '')
  const hasOverMaxMarks  = questions.some(
    q => questionMarks[q._id] !== '' && Number(questionMarks[q._id]) > q.marks
  )
  const canSubmit = allMarksEntered && !hasOverMaxMarks

  const isAlreadyEvaluated = submission?.status === 'evaluated' || submission?.status === 'approved'

  const handleMarkChange = (qid: string, value: number | '') => {
    setQuestionMarks(prev => ({ ...prev, [qid]: value }))
  }

  const handleEvaluate = async () => {
    if (!submissionId) return
    setIsSubmitting(true)
    try {
      await evaluateSubmission(submissionId, {
        marksObtained: totalObtained,
        remarks,
      })
      toastSuccess('Evaluation submitted successfully!')
      navigate('/examiner/students')
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to submit evaluation'
      toastError(msg)
    } finally {
      setIsSubmitting(false)
      setShowConfirm(false)
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (loadError || !submission) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          {loadError ?? 'Submission not found'}
        </h2>
        <Link
          to="/examiner/students"
          className="inline-flex items-center gap-2 mt-6 text-sm font-semibold hover:underline"
          style={{ color: '#E8720C' }}
        >
          <ArrowLeft size={16} /> Back to Assigned Students
        </Link>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Sticky header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
        <div>
          <Link
            to="/examiner/students"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-2 hover:underline"
            style={{ color: '#E8720C' }}
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <h1
            className="text-xl lg:text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {isAlreadyEvaluated ? 'View Evaluation: ' : 'Evaluate: '}
            {submission.exam.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Student:{' '}
            <span className="font-semibold text-gray-700">{submission.student.name}</span>
            {' · '}
            <span className="font-mono text-xs text-gray-400">{submission.student.studentId}</span>
            {' · '}
            {submission.type === 'online' ? '💻 Online' : '📄 Offline'}
          </p>
        </div>

        {/* Live score badge */}
        <div
          className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-lg font-bold ${
            isPassed
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50  text-red-700  border border-red-200'
          }`}
        >
          {isPassed
            ? <CheckCircle size={22} className="text-green-500" />
            : <XCircle    size={22} className="text-red-400"   />
          }
          <span>{totalObtained} / {totalMarks}</span>
          <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${
            isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPassed ? 'PASS' : 'FAIL'}
          </span>
        </div>
      </div>

      {/* Already-evaluated notice */}
      {isAlreadyEvaluated && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm">
          <CheckCircle size={18} className="text-blue-500 shrink-0" />
          This submission has already been evaluated. Results are read-only.
        </div>
      )}

      {/* For offline submissions — PDF viewer */}
      {submission.type === 'offline' && submission.uploadedFile && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-800 text-sm">📄 Uploaded Answer Paper</p>
            <a
              href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') ?? ''}/uploads/${submission.uploadedFile.replace(/.*[\\/]/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold hover:underline"
              style={{ color: '#E8720C' }}
            >
              Open in new tab ↗
            </a>
          </div>
          <iframe
            src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') ?? ''}/uploads/${submission.uploadedFile.replace(/.*[\\/]/, '')}`}
            className="w-full"
            style={{ height: '60vh' }}
            title="Uploaded exam paper"
          />
        </div>
      )}

      {/* Per-question evaluation grid */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>
            Questions & Answers
          </h2>
          {questions.map((q, i) => (
            <QuestionRow
              key={q._id}
              question={q}
              index={i}
              answer={getStudentAnswer(q, submission.answers)}
              marks={questionMarks[q._id] ?? (isAlreadyEvaluated ? '' : '')}
              onChange={handleMarkChange}
              isAlreadyEvaluated={isAlreadyEvaluated}
            />
          ))}
        </div>
      ) : (
        /* Offline-only: no structured questions — show raw answers summary */
        submission.type === 'offline' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">Offline submission</p>
            <p>There are no structured questions for this exam. Review the uploaded paper above and enter the total marks below.</p>
          </div>
        )
      )}

      {/* Manual total override for offline exams with no structured questions */}
      {submission.type === 'offline' && questions.length === 0 && !isAlreadyEvaluated && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Marks Awarded
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={totalMarks}
              placeholder="0"
              value={questionMarks['__offline__'] ?? ''}
              onChange={e => {
                const v = e.target.value === '' ? '' : Number(e.target.value)
                setQuestionMarks({ '__offline__': v })
              }}
              className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2"
            />
            <span className="text-sm text-gray-400">/ {totalMarks}</span>
          </div>
        </div>
      )}

      {/* Remarks + submit bar */}
      {!isAlreadyEvaluated && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <label className="block font-semibold text-gray-800 mb-2 text-sm">
            Overall Remarks{' '}
            <span className="font-normal text-gray-400">(visible to the student)</span>
          </label>
          <textarea
            rows={4}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Provide constructive feedback for the student…"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 transition-colors"
          />

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Progress indicator */}
            <div className="text-sm text-gray-500">
              {questions.length > 0 ? (
                <>
                  <span className={allMarksEntered ? 'text-green-600 font-semibold' : ''}>
                    {Object.values(questionMarks).filter(m => m !== '').length} / {questions.length} questions marked
                  </span>
                  {hasOverMaxMarks && (
                    <span className="ml-3 text-red-500">⚠ Some marks exceed the question maximum</span>
                  )}
                </>
              ) : null}
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={!canSubmit && questions.length > 0}
              onClick={() => setShowConfirm(true)}
              className="shrink-0"
            >
              Submit Evaluation
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Evaluation"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            You are about to submit an evaluation for{' '}
            <strong className="text-gray-900">{submission.student.name}</strong>.
          </p>

          <div
            className={`rounded-xl p-4 text-center ${
              isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="text-3xl font-bold" style={{ color: isPassed ? '#16a34a' : '#dc2626' }}>
              {totalObtained} / {totalMarks}
            </p>
            <p className={`text-sm font-bold mt-1 ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
              {isPassed ? '✅ PASS' : '❌ FAIL'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Passing marks: {passingMarks} / {totalMarks}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            This action cannot be undone. The student will be able to view their result.
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={handleEvaluate}>
              Confirm &amp; Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
