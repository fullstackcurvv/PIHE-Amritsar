import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import { Download, RefreshCw } from 'lucide-react'
import { getReports, exportCSV } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const COLORS = ['#E8720C', '#1A1A2E', '#F5A623', '#10B981', '#6366F1', '#EC4899']

interface ReportData {
  enrollmentsByMonth: { _id: { year: number; month: number }; count: number }[]
  resultsByStatus:    { _id: boolean; count: number }[]
  topCourses:         { title: string; count: number }[]
  examinerStats:      { name: string; total: number; evaluated: number }[]
}

type ExportType = 'students' | 'results' | 'certificates'

export default function ReportsPage() {
  const [data,     setData]     = useState<ReportData | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [exporting, setExporting] = useState<ExportType | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const d = await getReports()
      setData(d)
    } catch {
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleExport = async (type: ExportType) => {
    setExporting(type)
    try { await exportCSV(type) }
    catch { /* ignore */ }
    finally { setExporting(null) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-500 text-sm">{error}</div>
  )

  // Shape data for charts
  const enrollmentLine = (data?.enrollmentsByMonth ?? []).map(p => ({
    name: `${MONTH_NAMES[p._id.month]} ${p._id.year}`,
    Enrollments: p.count,
  }))

  const resultsPie = (data?.resultsByStatus ?? []).map(r => ({
    name: r._id ? 'Passed' : 'Failed',
    value: r.count,
  }))

  const topCoursesBar = (data?.topCourses ?? []).map(c => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title,
    Enrollments: c.count,
  }))

  const examinerBar = (data?.examinerStats ?? []).map(e => ({
    name: e.name.split(' ')[0],
    Assigned: e.total,
    Evaluated: e.evaluated,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Platform performance overview</p>
        </div>
        <button onClick={load} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Export row */}
      <div className="flex flex-wrap gap-3">
        {([
          { type: 'students'     as ExportType, label: 'Export Students CSV' },
          { type: 'results'      as ExportType, label: 'Export Results CSV' },
          { type: 'certificates' as ExportType, label: 'Export Certificates CSV' },
        ]).map(({ type, label }) => (
          <button
            key={type}
            onClick={() => handleExport(type)}
            disabled={exporting === type}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 shadow-sm"
          >
            {exporting === type ? <Spinner size="sm" /> : <Download size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Enrollment trend */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Enrollment Trend (Last 12 Months)</h3>
          {enrollmentLine.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={enrollmentLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Enrollments" stroke="#E8720C" strokeWidth={2}
                  dot={{ r: 4, fill: '#E8720C' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No data</div>
          )}
        </div>

        {/* Pass/Fail pie */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Exam Results Distribution</h3>
          {resultsPie.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={resultsPie} cx="50%" cy="45%" outerRadius={85}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No results yet</div>
          )}
        </div>

        {/* Top courses */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Courses by Enrollment</h3>
          {topCoursesBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topCoursesBar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="Enrollments" fill="#E8720C" radius={[0, 4, 4, 0]}>
                  {topCoursesBar.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No data</div>
          )}
        </div>

        {/* Examiner workload */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Examiner Workload</h3>
          {examinerBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={examinerBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Assigned"  fill="#1A1A2E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Evaluated" fill="#E8720C" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No examiner data</div>
          )}
        </div>
      </div>

      {/* Examiner table */}
      {(data?.examinerStats ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Examiner Performance Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Examiner</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Assigned</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Evaluated</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.examinerStats ?? []).map((e, i) => {
                  const pct = e.total > 0 ? Math.round((e.evaluated / e.total) * 100) : 0
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{e.name}</td>
                      <td className="px-5 py-3 text-gray-600">{e.total}</td>
                      <td className="px-5 py-3 text-gray-600">{e.evaluated}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
