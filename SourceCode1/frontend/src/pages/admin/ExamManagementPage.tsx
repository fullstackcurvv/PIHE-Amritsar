import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, Edit2, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react'
import { adminGetExams, adminCreateExam, adminDeleteExam } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Question {
  questionText: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options: string[]
  correctAnswer: string
  marks: number
}

interface Exam {
  _id: string
  title: string
  course?: { _id: string; title: string }
  totalMarks: number
  passingMarks: number
  duration: number
  questions: Question[]
  createdAt: string
}

const QUESTION_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false',      label: 'True / False' },
  { value: 'short-answer',    label: 'Short Answer' },
]

function emptyQuestion(): Question {
  return { questionText: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
}

// ── Create Exam Modal ─────────────────────────────────────────────────────────
function CreateModal({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: (e: Exam) => void
}) {
  const [title,        setTitle]        = useState('')
  const [passingMarks, setPassingMarks] = useState(40)
  const [duration,     setDuration]     = useState(60)
  const [questions,    setQuestions]    = useState<Question[]>([emptyQuestion()])
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  const totalMarks = questions.reduce((s, q) => s + Number(q.marks), 0)

  const reset = () => {
    setTitle(''); setPassingMarks(40); setDuration(60)
    setQuestions([emptyQuestion()]); setError('')
  }

  const handleClose = () => { reset(); onClose() }

  const addQuestion     = () => setQuestions(prev => [...prev, emptyQuestion()])
  const removeQuestion  = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i))

  const updateQuestion = (i: number, field: keyof Question, value: unknown) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== i) return q
      if (field === 'type') {
        const type = value as Question['type']
        return {
          ...q,
          type,
          options: type === 'true-false' ? ['True', 'False'] : type === 'short-answer' ? [] : ['', '', '', ''],
          correctAnswer: '',
        }
      }
      return { ...q, [field]: value }
    }))
  }

  const updateOption = (qi: number, oi: number, val: string) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== qi) return q
      const opts = [...q.options]
      opts[oi] = val
      return { ...q, options: opts }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Exam title is required'); return }
    if (questions.some(q => !q.questionText.trim())) { setError('All questions need text'); return }

    setLoading(true)
    try {
      const exam = await adminCreateExam({
        title, passingMarks, duration, totalMarks, questions,
      })
      onCreated(exam)
      handleClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to create exam')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">Create New Exam</h3>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
          )}

          <form id="create-exam" onSubmit={handleSubmit} className="space-y-5">
            {/* Meta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="e.g. Bhagavad Gita Final Exam" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                <div className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium">
                  {totalMarks}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                <input type="number" min={0} value={passingMarks} onChange={e => setPassingMarks(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">Questions ({questions.length})</h4>
                <button type="button" onClick={addQuestion}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50">
                  <Plus size={12} /> Add Question
                </button>
              </div>

              {questions.map((q, qi) => (
                <div key={qi} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Q{qi + 1}</span>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qi)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <input type="text" placeholder="Question text *" value={q.questionText}
                    onChange={e => updateQuestion(qi, 'questionText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />

                  <div className="grid grid-cols-2 gap-3">
                    <select value={q.type} onChange={e => updateQuestion(qi, 'type', e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
                      {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input type="number" min={1} placeholder="Marks" value={q.marks}
                      onChange={e => updateQuestion(qi, 'marks', Number(e.target.value))}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
                  </div>

                  {q.type === 'multiple-choice' && (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <input key={oi} type="text" placeholder={`Option ${oi + 1}`} value={opt}
                          onChange={e => updateOption(qi, oi, e.target.value)}
                          className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
                      ))}
                    </div>
                  )}

                  <input type="text" placeholder="Correct answer" value={q.correctAnswer}
                    onChange={e => updateQuestion(qi, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
                </div>
              ))}
            </div>
          </form>
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button type="button" onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" form="create-exam" disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {loading ? <><Spinner size="sm" /> Creating…</> : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExamManagementPage() {
  const [exams,    setExams]    = useState<Exam[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetExams()
      setExams(Array.isArray(data?.exams) ? data.exams : Array.isArray(data) ? data : [])
    } catch { setExams([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this exam? This cannot be undone.')) return
    setDeleting(id)
    try {
      await adminDeleteExam(id)
      setExams(prev => prev.filter(e => e._id !== id))
    } catch { /* ignore */ }
    finally { setDeleting(null) }
  }

  return (
    <div className="space-y-5">
      <CreateModal open={showModal} onClose={() => setShowModal(false)} onCreated={e => setExams(prev => [e, ...prev])} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Exam Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{exams.length} exam{exams.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">
            <Plus size={16} /> Create Exam
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : exams.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No exams yet</div>
      ) : (
        <div className="space-y-3">
          {exams.map(exam => (
            <div key={exam._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{exam.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {exam.questions?.length ?? 0} questions · {exam.totalMarks} marks · {exam.duration} min
                      {exam.course && ` · ${exam.course.title}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Pass: {exam.passingMarks}/{exam.totalMarks}</span>
                  <button onClick={() => setExpanded(expanded === exam._id ? null : exam._id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors">
                    {expanded === exam._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    disabled={deleting === exam._id}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors disabled:opacity-50"
                  >
                    {deleting === exam._id ? <Spinner size="sm" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>

              {expanded === exam._id && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-gray-50">
                  {exam.questions?.map((q, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-sm font-medium text-gray-800">Q{i + 1}: {q.questionText}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="capitalize">{q.type?.replace('-', ' ')}</span>
                        <span>{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                        {q.correctAnswer && <span className="text-green-600">✓ {q.correctAnswer}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
