import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Award, ChevronLeft, ChevronRight, CheckCircle, Clock, Search } from 'lucide-react'
import { getAllCertificates, getPendingResults, approveResult, exportCSV } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Certificate {
  _id: string
  student: { name: string; studentId: string; email: string }
  course:  { title: string }
  certificateId: string
  issuedAt: string
}

interface PendingResult {
  _id: string
  student: { name: string; studentId: string; email: string }
  exam:    { title: string; totalMarks: number }
  submission: { course?: { title: string } }
  marksObtained: number
  percentage: number
  evaluatedAt: string
}

const PAGE_SIZE = 15

// ── Tab: Pending Approvals ────────────────────────────────────────────────────
function PendingTab() {
  const [results,   setResults]   = useState<PendingResult[]>([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [loading,   setLoading]   = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [confirm,   setConfirm]   = useState<PendingResult | null>(null)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const data = await getPendingResults({ page: p, limit: PAGE_SIZE })
      setResults(Array.isArray(data?.results) ? data.results : [])
      setTotal(data?.total ?? 0)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleApprove = async () => {
    if (!confirm) return
    setApproving(confirm._id)
    setConfirm(null)
    try {
      await approveResult(confirm._id)
      setResults(prev => prev.filter(r => r._id !== confirm._id))
      setTotal(t => t - 1)
    } catch { /* ignore */ }
    finally { setApproving(null) }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Approve Result</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{confirm.student?.name}</span> scored{' '}
              <span className="text-green-600 font-semibold">{confirm.marksObtained}/{confirm.exam?.totalMarks}</span>
              {confirm.percentage !== undefined && ` (${confirm.percentage}%)`}
            </p>
            <p className="text-sm text-gray-500 mb-5">
              Approving will mark this result as verified and auto-generate a completion certificate.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600">
                Approve & Generate Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
          <CheckCircle size={36} className="text-green-300" />
          <p className="text-sm">All results have been approved!</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Student</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Exam</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Course</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Score</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Evaluated</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{r.student?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400 font-mono">{r.student?.studentId ?? ''}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{r.exam?.title ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{r.submission?.course?.title ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-green-600">
                        {r.marksObtained}/{r.exam?.totalMarks}
                      </span>
                      {r.percentage !== undefined && (
                        <span className="text-xs text-gray-400 ml-1">({r.percentage}%)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(r.evaluatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      {approving === r._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <button
                          onClick={() => setConfirm(r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, total)} of {total}</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => { setPage(p => p-1); load(page-1) }}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <span className="px-3 py-1.5 text-xs text-gray-600">{page}/{totalPages}</span>
                <button disabled={page === totalPages} onClick={() => { setPage(p => p+1); load(page+1) }}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: All Certificates ─────────────────────────────────────────────────────
function CertificatesTab() {
  const [certs,    setCerts]    = useState<Certificate[]>([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const data = await getAllCertificates({ page: p, limit: PAGE_SIZE })
      setCerts(Array.isArray(data?.certificates) ? data.certificates : [])
      setTotal(data?.total ?? 0)
    } catch { setCerts([]) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const filtered = certs.filter(c =>
    !search ||
    c.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateId?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search certificates…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
        </div>
        <button onClick={async () => { setExporting(true); try { await exportCSV('certificates') } catch {} finally { setExporting(false) } }}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          {exporting ? <Spinner size="sm" /> : null} Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
          <Award size={36} />
          <p className="text-sm">No certificates issued yet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Student</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Course</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Certificate ID</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{c.student?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400 font-mono">{c.student?.studentId ?? ''}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{c.course?.title ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        {c.certificateId}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(c.issuedAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Page {page} of {totalPages} · {total} total</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => { setPage(p => p-1); load(page-1) }}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button disabled={page === totalPages} onClick={() => { setPage(p => p+1); load(page+1) }}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CertificateManagementPage() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Certificate Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Approve results and manage issued certificates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'pending', label: 'Pending Approvals', icon: Clock },
          { key: 'all',     label: 'All Certificates',  icon: Award },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t.key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          {tab === 'pending' ? <PendingTab /> : <CertificatesTab />}
        </div>
      </div>
    </div>
  )
}
