import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { useExamStore } from '@/store/examStore'
import { getExamByCourse, submitExam } from '@/services/examService'
import { ExamTimer } from '@/components/exam/ExamTimer'
import { QuestionCard } from '@/components/exam/QuestionCard'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ProgressBar } from '@/components/ui/ProgressBar'

// Confirmation modal
function ConfirmModal({
  answeredCount,
  totalCount,
  onConfirm,
  onCancel,
}: {
  answeredCount: number
  totalCount: number
  onConfirm: () => void
  onCancel: () => void
}) {
  const unanswered = totalCount - answeredCount
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle size={20} style={{ color: '#E8720C' }} />
          </div>
          <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Cinzel, serif' }}>
            Submit Exam?
          </h2>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          You have answered <strong>{answeredCount}</strong> out of{' '}
          <strong>{totalCount}</strong> questions.
        </p>

        {unanswered > 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl text-sm text-orange-700 mb-4">
            <AlertTriangle size={14} />
            {unanswered} question{unanswered > 1 ? 's' : ''} left unanswered.
          </div>
        )}

        <p className="text-gray-500 text-xs mb-6">
          Once submitted, you cannot change your answers.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={onCancel} className="flex-1">
            Go Back
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm} className="flex-1">
            Submit Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ExamSectionPage() {
  const { id: courseId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentExam, answers, setExam, setAnswer, submitExam: markSubmitted, isSubmitted } =
    useExamStore()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    getExamByCourse(courseId)
      .then((exam) => setExam(exam))
      .catch(() => setError('No exam found for this course, or exam is not active yet.'))
      .finally(() => setLoading(false))
  }, [courseId, setExam])

  const handleTimerExpire = useCallback(() => {
    handleSubmit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async () => {
    if (!currentExam) return
    setSubmitting(true)
    setShowConfirm(false)
    try {
      await submitExam({ examId: currentExam._id, answers })
      markSubmitted()
      navigate('/student/results', { replace: true })
    } catch {
      setError('Failed to submit exam. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (error || !currentExam) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          No Exam Available
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {error ?? 'This course does not have an active exam yet.'}
        </p>
        <Button variant="outline" size="md" onClick={() => navigate(-1)}>
          ← Go Back
        </Button>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          Exam Submitted!
        </h2>
        <p className="text-gray-500 text-sm">Redirecting to results...</p>
      </div>
    )
  }

  const questions = currentExam.questions
  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion._id)
  const answeredCount = answers.filter((a) => a.selectedOption || a.answerText).length
  const progressPct = Math.round((answeredCount / questions.length) * 100)

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Exam header */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1
                className="font-bold text-gray-900 text-base truncate"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {currentExam.title}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <ExamTimer onExpire={handleTimerExpire} />
          </div>

          <div className="mt-4">
            <ProgressBar value={progressPct} size="sm" />
            <p className="text-xs text-gray-400 mt-1">{answeredCount}/{questions.length} answered</p>
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          selectedOption={currentAnswer?.selectedOption}
          answerText={currentAnswer?.answerText}
          onOptionSelect={(optionId) =>
            setAnswer(currentQuestion._id, optionId, 'mcq')
          }
          onTextChange={(text) =>
            setAnswer(
              currentQuestion._id,
              text,
              currentQuestion.type as 'short' | 'long'
            )
          }
        />

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            icon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>

          {/* Question dots (hidden on very small screens) */}
          <div className="hidden sm:flex flex-wrap gap-1.5 justify-center flex-1">
            {questions.map((q, i) => {
              const ans = answers.find((a) => a.questionId === q._id)
              const isAnswered = !!(ans?.selectedOption || ans?.answerText)
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    i === currentIndex
                      ? 'text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={i === currentIndex ? { backgroundColor: '#E8720C' } : {}}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex((i) => i + 1)}
              icon={<ChevronRight size={16} />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              loading={submitting}
              onClick={() => setShowConfirm(true)}
            >
              Submit Exam
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
