import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Users, Clock, CheckCircle, ArrowRight, ClipboardCheck } from 'lucide-react'
import { useAuthStore }           from '@/store/authStore'
import { getAssignedSubmissions } from '@/services/submissionService'
import { StatsCard }              from '@/components/ui/StatsCard'
import { Spinner }                from '@/components/ui/Spinner'
import type { AssignedSubmission } from '@/types/exam'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function StatusPill({ status }: { status: AssignedSubmission['status'] }) {
  const map = {
    pending:   { label: '⏳ Pending',   cls: 'bg-amber-50 text-amber-700'  },
    evaluated: { label: '✅ Evaluated', cls: 'bg-green-50 text-green-700'  },
    approved:  { label: '🏅 Approved',  cls: 'bg-blue-50  text-blue-700'   },
  }
  const { label, cls } = map[status] ?? map.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export default function ExaminerDashboardPage() {
  const { user } = useAuthStore()
  const [submissions, setSubmissions] = useState<AssignedSubmission[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    let cancelled = false
    getAssignedSubmissions()
      .then(data => { if (!cancelled) setSubmissions(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setSubmissions([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const pendingCount   = submissions.filter(s => s.status === 'pending').length
  const completedCount = submissions.filter(s => s.status !== 'pending').length
  const recent         = submissions.slice(0, 5)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 lg:p-8"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D5E 100%)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm">{greeting()},</p>
            <h1
              className="text-2xl lg:text-3xl font-bold text-white mt-1"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {user?.name ?? 'Examiner'} 👋
            </h1>
            <p className="text-white/50 text-sm mt-2">Here's your evaluation queue for today.</p>
          </div>
          <Link
            to="/examiner/students"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            View All Students <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={<Users size={22} style={{ color: '#E8720C' }} />}
          title="Assigned Students"
          value={submissions.length}
          iconBg="bg-orange-100"
        />
        <StatsCard
          icon={<Clock size={22} className="text-amber-600" />}
          title="Pending Evaluation"
          value={pendingCount}
          iconBg="bg-amber-50"
        />
        <StatsCard
          icon={<CheckCircle size={22} className="text-green-600" />}
          title="Completed"
          value={completedCount}
          iconBg="bg-green-50"
        />
      </div>

      {/* Recent assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
            Recently Assigned
          </h2>
          <Link
            to="/examiner/students"
            className="text-sm font-semibold flex items-center gap-1 hover:underline"
            style={{ color: '#E8720C' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <ClipboardCheck size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No submissions assigned yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              The admin will assign student submissions for you to evaluate.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Student', 'Course', 'Type', 'Submitted', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map(sub => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{sub.student.name}</div>
                        <div className="text-xs text-gray-400">{sub.student.studentId}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{sub.course.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.type === 'online'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {sub.type === 'online' ? '💻 Online' : '📄 Offline'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(sub.submittedAt)}</td>
                      <td className="px-4 py-3"><StatusPill status={sub.status} /></td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/examiner/evaluate/${sub._id}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            sub.status === 'pending'
                              ? 'text-white hover:opacity-90'
                              : 'border text-gray-600 hover:bg-gray-50'
                          }`}
                          style={sub.status === 'pending' ? { backgroundColor: '#E8720C' } : { borderColor: '#E8720C', color: '#E8720C' }}
                        >
                          {sub.status === 'pending' ? 'Evaluate' : 'View'}
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
