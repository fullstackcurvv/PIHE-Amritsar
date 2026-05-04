import { useEffect, useState, useMemo } from 'react'
import { useParams, Link }              from 'react-router'
import { ArrowLeft, Mail, Phone, BookOpen, ClipboardCheck } from 'lucide-react'
import { getAssignedSubmissions }       from '@/services/submissionService'
import { Spinner }                      from '@/components/ui/Spinner'
import type { AssignedSubmission }      from '@/types/exam'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function StatusPill({ status }: { status: AssignedSubmission['status'] }) {
  const map = {
    pending:   { label: '⏳ Pending',   cls: 'bg-amber-50 text-amber-700' },
    evaluated: { label: '✅ Evaluated', cls: 'bg-green-50 text-green-700' },
    approved:  { label: '🏅 Approved',  cls: 'bg-blue-50  text-blue-700'  },
  }
  const { label, cls } = map[status] ?? map.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export default function StudentProfilePage() {
  // Route: /examiner/students/:id  — :id is the studentId (mongo _id)
  const { id } = useParams<{ id: string }>()
  const [allSubmissions, setAllSubmissions] = useState<AssignedSubmission[]>([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    let cancelled = false
    getAssignedSubmissions()
      .then(data => { if (!cancelled) setAllSubmissions(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setAllSubmissions([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // The student whose profile we're viewing
  const studentSubmissions = useMemo(
    () => allSubmissions.filter(s => s.student._id === id),
    [allSubmissions, id]
  )

  const student = studentSubmissions[0]?.student ?? null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          Student not found
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          This student is not in your assigned list, or their ID is invalid.
        </p>
        <Link
          to="/examiner/students"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#E8720C' }}
        >
          <ArrowLeft size={16} /> Back to Assigned Students
        </Link>
      </div>
    )
  }

  const pendingCount   = studentSubmissions.filter(s => s.status === 'pending').length
  const evaluatedCount = studentSubmissions.filter(s => s.status !== 'pending').length

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back link */}
      <Link
        to="/examiner/students"
        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: '#E8720C' }}
      >
        <ArrowLeft size={16} /> Back to Assigned Students
      </Link>

      {/* Student card */}
      <div
        className="rounded-2xl p-6 lg:p-8"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D5E 100%)' }}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
            style={{ backgroundColor: '#E8720C' }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {student.name}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Student ID:{' '}
              <span className="text-[#E8720C] font-semibold font-mono">{student.studentId}</span>
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              {student.email && (
                <span className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Mail size={14} /> {student.email}
                </span>
              )}
              {student.phone && (
                <span className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Phone size={14} /> {student.phone}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 sm:gap-6 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{studentSubmissions.length}</p>
              <p className="text-white/50 text-xs mt-0.5">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
              <p className="text-white/50 text-xs mt-0.5">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{evaluatedCount}</p>
              <p className="text-white/50 text-xs mt-0.5">Evaluated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission history */}
      <div>
        <h2
          className="text-lg font-bold text-gray-900 mb-4"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Submission History
        </h2>

        {studentSubmissions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <ClipboardCheck size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studentSubmissions.map(sub => (
              <div
                key={sub._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Course icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#FDE8D8' }}
                >
                  <BookOpen size={20} style={{ color: '#E8720C' }} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{sub.course.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {sub.type === 'online' ? '💻 Online' : '📄 Offline'} ·{' '}
                    Submitted {formatDate(sub.submittedAt)}
                  </p>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill status={sub.status} />
                  <Link
                    to={`/examiner/evaluate/${sub._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={
                      sub.status === 'pending'
                        ? { backgroundColor: '#E8720C', color: '#fff' }
                        : { border: '1px solid #E8720C', color: '#E8720C' }
                    }
                  >
                    {sub.status === 'pending' ? 'Evaluate' : 'View'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
