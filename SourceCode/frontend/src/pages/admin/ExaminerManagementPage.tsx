import { useEffect, useState, useCallback } from 'react'
import { Search, Plus, RefreshCw, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { getExaminers, createExaminer, toggleExaminerStatus } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Examiner {
  _id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
}

// ── Create Examiner Modal ──────────────────────────────────────────────────────
function CreateModal({ open, onClose, onCreated }: {
  open: boolean
  onClose: () => void
  onCreated: (examiner: Examiner) => void
}) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const reset = () => { setName(''); setEmail(''); setPassword(''); setPhone(''); setError('') }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const examiner = await createExaminer({ name, email, password, phone: phone || undefined })
      onCreated(examiner)
      handleClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to create examiner')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Add New Examiner</h3>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="e.g. Prabhu Das" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="examiner@iskcon.org" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Minimum 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="10-digit mobile number" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {loading ? <><Spinner size="sm" /> Creating…</> : 'Create Examiner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ExaminerManagementPage() {
  const [examiners, setExaminers] = useState<Examiner[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)
  const [actioning, setActioning] = useState<string | null>(null)

  const load = useCallback(async (q = search) => {
    setLoading(true)
    try {
      const data = await getExaminers({ search: q })
      setExaminers(Array.isArray(data) ? data : [])
    } catch {
      setExaminers([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => load(search), 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleToggle = async (examiner: Examiner) => {
    setActioning(examiner._id)
    try {
      await toggleExaminerStatus(examiner._id)
      setExaminers(prev => prev.map(e => e._id === examiner._id ? { ...e, isActive: !e.isActive } : e))
    } catch { /* ignore */ }
    finally { setActioning(null) }
  }

  return (
    <div className="space-y-5">
      <CreateModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={e => setExaminers(prev => [e, ...prev])}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Examiner Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{examiners.length} examiner{examiners.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load()} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            <Plus size={16} /> Add Examiner
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text" placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : examiners.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No examiners found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Phone</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Added</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {examiners.map(ex => (
                  <tr key={ex._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
                          {ex.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{ex.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{ex.email}</td>
                    <td className="px-5 py-3 text-gray-500">{ex.phone ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        ex.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {ex.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(ex.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      {actioning === ex._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <button
                          onClick={() => handleToggle(ex)}
                          className={`p-1.5 rounded transition-colors ${
                            ex.isActive ? 'text-green-500 hover:text-red-500' : 'text-red-400 hover:text-green-500'
                          }`}
                          title={ex.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {ex.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
