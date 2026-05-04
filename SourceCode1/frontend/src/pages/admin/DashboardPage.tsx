import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts'
import {
  GraduationCap, UserCheck, BookOpen, FileText,
  ClipboardList, CheckCircle, Award, TrendingUp,
} from 'lucide-react'
import { getDashboard } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

// ── Types ─────────────────────────────────────────────────────────────────────
interface KPIs {
  totalStudents:    number
  totalExaminers:   number
  totalCourses:     number
  totalEnrollments: number
  pendingSubmissions: number
  pendingApprovals: number
  totalCertificates: number
}
interface MonthlyPoint { _id: { year: number; month: number }; count: number }
interface RecentEnrollment {
  _id: string
  student: { name: string; studentId: string }
  course:  { title: string }
  enrolledAt: string
}

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS  = ['#E8720C', '#1A1A2E', '#F5A623', '#10B981', '#6366F1']

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({
  icon: Icon, label, value, color, bg,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
  bg: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString('en-IN')}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [kpis,    setKpis]    = useState<KPIs | null>(null)
  const [monthly, setMonthly] = useState<{ name: string; Enrollments: number }[]>([])
  const [recent,  setRecent]  = useState<RecentEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getDashboard()
      .then(data => {
        if (cancelled) return
        if (data?.kpis) setKpis(data.kpis)
        if (Array.isArray(data?.monthlyEnrollments)) {
          setMonthly(
            data.monthlyEnrollments.map((p: MonthlyPoint) => ({
              name: `${MONTH_NAMES[p._id.month]} ${p._id.year}`,
              Enrollments: p.count,
            }))
          )
        }
        if (Array.isArray(data?.recentEnrollments)) {
          setRecent(data.recentEnrollments)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load dashboard')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">{error}</p>
    </div>
  )

  const pieData = kpis ? [
    { name: 'Students',    value: kpis.totalStudents },
    { name: 'Examiners',   value: kpis.totalExaminers },
    { name: 'Courses',     value: kpis.totalCourses },
    { name: 'Certificates',value: kpis.totalCertificates },
  ] : []

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening on the portal</p>
      </div>

      {/* KPI cards */}
      {kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={GraduationCap} label="Students"         value={kpis.totalStudents}      color="text-orange-600" bg="bg-orange-50" />
          <KPICard icon={UserCheck}     label="Examiners"        value={kpis.totalExaminers}     color="text-indigo-600" bg="bg-indigo-50" />
          <KPICard icon={BookOpen}      label="Courses"          value={kpis.totalCourses}       color="text-emerald-600" bg="bg-emerald-50" />
          <KPICard icon={TrendingUp}    label="Enrollments"      value={kpis.totalEnrollments}   color="text-yellow-600" bg="bg-yellow-50" />
          <KPICard icon={ClipboardList} label="Pending Submissions" value={kpis.pendingSubmissions} color="text-red-600" bg="bg-red-50" />
          <KPICard icon={CheckCircle}   label="Pending Approvals"  value={kpis.pendingApprovals}   color="text-blue-600" bg="bg-blue-50" />
          <KPICard icon={Award}         label="Certificates"     value={kpis.totalCertificates}  color="text-purple-600" bg="bg-purple-50" />
          <KPICard icon={FileText}      label="Total Active"     value={kpis.totalEnrollments}   color="text-gray-600" bg="bg-gray-50" />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Enrollment Trend</h3>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Enrollments"
                  stroke="#E8720C"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#E8720C' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No enrollment data yet
            </div>
          )}
        </div>

        {/* Distribution pie */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Distribution</h3>
          {pieData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="45%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Recent Enrollments</h3>
        </div>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Student</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Student ID</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Course</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{e.student?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{e.student?.studentId ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{e.course?.title ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(e.enrolledAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            No enrollments yet
          </div>
        )}
      </div>
    </div>
  )
}
