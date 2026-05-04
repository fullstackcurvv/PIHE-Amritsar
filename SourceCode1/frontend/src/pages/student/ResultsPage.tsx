import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { getMyResults } from '@/services/examService'
import { Spinner } from '@/components/ui/Spinner'
import type { Result } from '@/types/exam'

const STATUS_CONFIG = {
  pass: {
    label: 'PASS',
    icon: CheckCircle,
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  fail: {
    label: 'FAIL',
    icon: XCircle,
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  pending: {
    label: 'PENDING',
    icon: Clock,
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
}

const MOCK_RESULTS: Result[] = [
  {
    _id: 'r1',
    student: 'u1',
    exam: 'ex1',
    course: 'c1',
    courseTitle: 'Bhagavad Gita Foundation',
    obtainedMarks: 78,
    totalMarks: 100,
    percentage: 78,
    status: 'pass',
    remarks: 'Excellent understanding of the core concepts.',
    evaluatedAt: '2026-04-12T00:00:00Z',
    examinerName: 'Prabhu Das',
  },
  {
    _id: 'r2',
    student: 'u1',
    exam: 'ex2',
    course: 'c2',
    courseTitle: 'ISKCON Philosophy & Culture',
    obtainedMarks: 35,
    totalMarks: 100,
    percentage: 35,
    status: 'fail',
    remarks: 'Need more detail on Vaishnava philosophy. Please review chapters 3–5.',
    evaluatedAt: '2026-04-13T00:00:00Z',
    examinerName: 'Prabhu Das',
  },
  {
    _id: 'r3',
    student: 'u1',
    exam: 'ex3',
    course: 'c3',
    courseTitle: 'Kirtan & Devotional Practices',
    obtainedMarks: 0,
    totalMarks: 80,
    percentage: 0,
    status: 'pending',
    evaluatedAt: undefined,
  },
]

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyResults()
      .then(setResults)
      .catch(() => setResults(MOCK_RESULTS))
      .finally(() => setLoading(false))
  }, [])

  const displayResults = results.length > 0 ? results : MOCK_RESULTS

  const passCount = displayResults.filter((r) => r.status === 'pass').length
  const failCount = displayResults.filter((r) => r.status === 'fail').length
  const pendingCount = displayResults.filter((r) => r.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          My Results
        </h1>
        <p className="text-gray-500 text-sm mt-1">View your exam results and examiner feedback</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
          <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Cinzel, serif' }}>
            {passCount}
          </p>
          <p className="text-xs text-green-600 font-medium mt-1">Passed</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
          <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Cinzel, serif' }}>
            {failCount}
          </p>
          <p className="text-xs text-red-500 font-medium mt-1">Failed</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-100">
          <p className="text-2xl font-bold text-yellow-700" style={{ fontFamily: 'Cinzel, serif' }}>
            {pendingCount}
          </p>
          <p className="text-xs text-yellow-600 font-medium mt-1">Pending</p>
        </div>
      </div>

      {/* Results table — desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-500">Course</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-500">Marks</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-500">%</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-500">Status</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-500">Examiner Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayResults.map((result) => {
              const cfg = STATUS_CONFIG[result.status]
              const Icon = cfg.icon
              return (
                <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{result.courseTitle ?? result.course}</p>
                    {result.evaluatedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(result.evaluatedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {result.status !== 'pending' ? (
                      <span className="font-semibold text-gray-800">
                        {result.obtainedMarks}/{result.totalMarks}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {result.status !== 'pending' ? (
                      <span
                        className={`font-bold ${
                          result.percentage >= 50 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {result.percentage}%
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <Icon size={12} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    {result.remarks ? (
                      <p className="text-gray-600 text-xs italic line-clamp-2">"{result.remarks}"</p>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        {result.status === 'pending' ? 'Awaiting evaluation...' : 'No remarks'}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Results cards — mobile */}
      <div className="md:hidden space-y-4">
        {displayResults.map((result) => {
          const cfg = STATUS_CONFIG[result.status]
          const Icon = cfg.icon
          return (
            <div key={result._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {result.courseTitle ?? result.course}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  <Icon size={11} />
                  {cfg.label}
                </span>
              </div>
              {result.status !== 'pending' && (
                <div className="flex gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-400 text-xs">Marks</span>
                    <p className="font-semibold text-gray-800">
                      {result.obtainedMarks}/{result.totalMarks}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Percentage</span>
                    <p
                      className={`font-bold ${
                        result.percentage >= 50 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {result.percentage}%
                    </p>
                  </div>
                </div>
              )}
              {result.remarks && (
                <p className="text-gray-500 text-xs italic bg-gray-50 rounded-lg p-3">
                  "{result.remarks}"
                </p>
              )}
              {result.status === 'pending' && !result.remarks && (
                <p className="text-yellow-600 text-xs bg-yellow-50 rounded-lg p-3">
                  Your submission is awaiting evaluation.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {displayResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No results available yet.</p>
        </div>
      )}
    </div>
  )
}
