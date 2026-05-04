import { useEffect, useState, useMemo } from 'react'
import { Link }                         from 'react-router'
import { Search, Filter, ArrowRight }   from 'lucide-react'
import { getAssignedSubmissions }       from '@/services/submissionService'
import { Spinner }                      from '@/components/ui/Spinner'
import type { AssignedSubmission }      from '@/types/exam'

type StatusFilter = 'all' | 'pending' | 'evaluated'

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

export default function AssignedStudentsPage() {
  const [submissions, setSubmissions] = useState<AssignedSubmission[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    getAssignedSubmissions()
      .then(data => { if (!cancelled) setSubmissions(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setSubmissions([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Unique courses for the course filter dropdown
  const courses = useMemo(() => {
    const seen = new Set<string>()
    return submissions
      .map(s => ({ id: s.course._id, title: s.course.title }))
      .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true })
  }, [submissions])

  const filtered = useMemo(() => {
    return submissions.filter(sub => {
      const matchSearch =
        !search ||
        sub.student.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.student.studentId.toLowerCase().includes(search.toLowerCase()) ||
        sub.course.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter
      const matchCourse = courseFilter === 'all' || sub.course._id === courseFilter
      return matchSearch && matchStatus && matchCourse
    })
  }, [submissions, search, statusFilter, courseFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          Assigned Students
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, ID or course…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#E8720C' } as React.CSSProperties}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="evaluated">Evaluated</option>
            </select>
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 bg-white"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No submissions match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student', 'Student ID', 'Course', 'Type', 'Submitted', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: '#E8720C' }}
                        >
                          {sub.student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{sub.student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{sub.student.studentId}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-[180px]">
                      <span className="line-clamp-1">{sub.course.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.type === 'online'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {sub.type === 'online' ? '💻 Online' : '📄 Offline'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(sub.submittedAt)}</td>
                    <td className="px-4 py-3"><StatusPill status={sub.status} /></td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/examiner/evaluate/${sub._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={
                          sub.status === 'pending'
                            ? { backgroundColor: '#E8720C', color: '#fff' }
                            : { border: '1px solid #E8720C', color: '#E8720C' }
                        }
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
        )}
      </div>

      {/* Footer count */}
      <p className="text-xs text-gray-400 text-right">
        Showing {filtered.length} of {submissions.length} submissions
      </p>
    </div>
  )
}
