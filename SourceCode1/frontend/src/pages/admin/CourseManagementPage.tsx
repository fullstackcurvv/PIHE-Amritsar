import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, RefreshCw } from 'lucide-react'
import { adminGetCourses, adminDeleteCourse, adminUpdateCourse } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Lesson { _id: string; title: string; order: number; isPublished: boolean }
interface Course {
  _id: string
  title: string
  category: string
  level: string
  isPaid: boolean
  price: number
  isPublished: boolean
  isFeatured: boolean
  lessons: Lesson[]
  createdAt: string
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
  open, title, message, onConfirm, onCancel, danger,
}: {
  open: boolean; title: string; message: string
  onConfirm: () => void; onCancel: () => void; danger?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CourseManagementPage() {
  const [courses,  setCourses]  = useState<Course[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [confirm,  setConfirm]  = useState<{ id: string; action: 'delete' | 'toggle' | 'feature'; course: Course } | null>(null)
  const [actioning, setActioning] = useState<string | null>(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetCourses({ limit: 100 })
      setCourses(Array.isArray(data?.courses) ? data.courses : Array.isArray(data) ? data : [])
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleConfirm = async () => {
    if (!confirm) return
    setActioning(confirm.id)
    setConfirm(null)
    try {
      if (confirm.action === 'delete') {
        await adminDeleteCourse(confirm.id)
        setCourses(prev => prev.filter(c => c._id !== confirm.id))
      } else if (confirm.action === 'toggle') {
        const updated = await adminUpdateCourse(confirm.id, { isPublished: !confirm.course.isPublished })
        setCourses(prev => prev.map(c => c._id === confirm.id ? { ...c, isPublished: updated?.isPublished ?? !c.isPublished } : c))
      } else if (confirm.action === 'feature') {
        const updated = await adminUpdateCourse(confirm.id, { isFeatured: !confirm.course.isFeatured })
        setCourses(prev => prev.map(c => c._id === confirm.id ? { ...c, isFeatured: updated?.isFeatured ?? !c.isFeatured } : c))
      }
    } catch (err: unknown) {
      console.error(err)
    } finally {
      setActioning(null)
    }
  }

  return (
    <div className="space-y-5">
      <ConfirmModal
        open={!!confirm}
        title={
          confirm?.action === 'delete' ? 'Delete Course' :
          confirm?.action === 'toggle' ? (confirm.course.isPublished ? 'Unpublish Course' : 'Publish Course') :
          (confirm?.course.isFeatured ? 'Remove from Featured' : 'Mark as Featured')
        }
        message={
          confirm?.action === 'delete'
            ? `This will permanently delete "${confirm?.course.title}". This action cannot be undone.`
            : `Are you sure you want to update "${confirm?.course.title}"?`
        }
        danger={confirm?.action === 'delete'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => navigate('/admin/courses/add')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            Add Course
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search courses by title or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            <BookOpenIcon />
            <p className="text-sm">No courses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Title</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Level</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Lessons</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Price</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(course => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 line-clamp-1">{course.title}</span>
                        {course.isFeatured && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{course.category}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{course.lessons?.length ?? 0}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {course.isPaid ? `₹${course.price}` : 'Free'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {actioning === course._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <button
                              onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setConfirm({ id: course._id, action: 'toggle', course })}
                              className="p-1.5 text-gray-400 hover:text-orange-600 rounded transition-colors"
                              title={course.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              {course.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              onClick={() => setConfirm({ id: course._id, action: 'feature', course })}
                              className={`p-1.5 rounded transition-colors ${course.isFeatured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
                              title={course.isFeatured ? 'Remove from featured' : 'Mark featured'}
                            >
                              <Star size={15} />
                            </button>
                            <button
                              onClick={() => setConfirm({ id: course._id, action: 'delete', course })}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
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

function BookOpenIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
