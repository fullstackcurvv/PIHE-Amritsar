import { useEffect, useState, useCallback } from 'react'
import { Search, RefreshCw, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { getStudents, toggleStudentStatus, exportCSV } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Student {
  _id: string
  name: string
  email: string
  studentId: string
  phone: string
  isActive: boolean
  createdAt: string
}

function ConfirmModal({ open, name, isActive, onConfirm, onCancel }: {
  open: boolean; name: string; isActive: boolean
  onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isActive ? 'Deactivate Student' : 'Activate Student'}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
          <span className="font-semibold">{name}</span>?
          {isActive && ' They will lose access to the portal.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}

const PAGE_SIZE = 20

export default function StudentManagementPage() {
  const [students,  setStudents]  = useState<Student[]>([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(true)
  const [confirm,   setConfirm]   = useState<Student | null>(null)
  const [actioning, setActioning] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async (p = page, q = search) => {
    setLoading(true)
    try {
      const data = await getStudents({ page: p, limit: PAGE_SIZE, search: q })
      setStudents(Array.isArray(data?.students) ? data.students : [])
      setTotal(data?.total ?? 0)
    } catch {
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search) }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleToggle = async () => {
    if (!confirm) return
    setActioning(confirm._id)
    setConfirm(null)
    try {
      await toggleStudentStatus(confirm._id)
      setStudents(prev => prev.map(s => s._id === confirm._id ? { ...s, isActive: !s.isActive } : s))
    } catch (err) {
      console.error(err)
    } finally {
      setActioning(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try { await exportCSV('students') }
    catch { /* ignore */ }
    finally { setExporting(false) }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-5">
      <ConfirmModal
        open={!!confirm}
        name={confirm?.name ?? ''}
        isActive={confirm?.isActive ?? false}
        onConfirm={handleToggle}
        onCancel={() => setConfirm(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} student{total !== 1 ? 's' : ''} registered</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting ? <Spinner size="sm" /> : null}
            Export CSV
          </button>
          <button onClick={() => load()} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text" placeholder="Search by name, email or student ID…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No students found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Student ID</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Phone</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Joined</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(student => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600 shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{student.studentId ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{student.email}</td>
                      <td className="px-5 py-3 text-gray-500">{student.phone ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          student.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(student.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-3">
                        {actioning === student._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <button
                            onClick={() => setConfirm(student)}
                            className={`p-1.5 rounded transition-colors ${
                              student.isActive
                                ? 'text-green-500 hover:text-red-500'
                                : 'text-red-400 hover:text-green-500'
                            }`}
                            title={student.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {student.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex gap-1">
                  <button
                    disabled={page === 1} onClick={() => { setPage(p => p - 1); load(page - 1, search) }}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1.5 text-xs text-gray-600">{page} / {totalPages}</span>
                  <button
                    disabled={page === totalPages} onClick={() => { setPage(p => p + 1); load(page + 1, search) }}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
