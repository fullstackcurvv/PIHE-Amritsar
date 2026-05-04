import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react'
import { adminCreateCourse } from '@/services/adminService'
import { Spinner } from '@/components/ui/Spinner'

interface Lesson { title: string; content: string; videoUrl: string; duration: number; order: number }

const LEVELS    = ['Beginner', 'Intermediate', 'Advanced'] as const
const CATEGORIES = ['Bhakti Yoga', 'Philosophy', 'Scriptures', 'Devotional Practices', 'Sanskrit', 'Other']

export default function AddCoursePage() {
  const navigate = useNavigate()

  // Form state
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('')
  const [level,       setLevel]       = useState<typeof LEVELS[number]>('Beginner')
  const [isPaid,      setIsPaid]      = useState(false)
  const [price,       setPrice]       = useState(0)
  const [isFeatured,  setIsFeatured]  = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [tags,        setTags]        = useState('')
  const [lessons,     setLessons]     = useState<Lesson[]>([
    { title: '', content: '', videoUrl: '', duration: 0, order: 1 },
  ])

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // ── Lesson helpers ──────────────────────────────────────────────────────────
  const addLesson = () => setLessons(prev => [
    ...prev,
    { title: '', content: '', videoUrl: '', duration: 0, order: prev.length + 1 },
  ])

  const removeLesson = (idx: number) => setLessons(prev => {
    const next = prev.filter((_, i) => i !== idx)
    return next.map((l, i) => ({ ...l, order: i + 1 }))
  })

  const updateLesson = (idx: number, field: keyof Lesson, value: string | number) => {
    setLessons(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim() || !category) {
      setError('Title, description and category are required.')
      return
    }

    const form = new FormData()
    form.append('title',       title.trim())
    form.append('description', description.trim())
    form.append('category',    category)
    form.append('level',       level)
    form.append('isPaid',      String(isPaid))
    form.append('price',       String(isPaid ? price : 0))
    form.append('isFeatured',  String(isFeatured))
    form.append('isPublished', String(isPublished))
    form.append('tags',        tags)
    form.append('lessons',     JSON.stringify(lessons.filter(l => l.title.trim())))

    setLoading(true)
    try {
      await adminCreateCourse(form)
      navigate('/admin/courses')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
          <p className="text-sm text-gray-500">Fill in the details to create a new course</p>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Basic Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. Introduction to Bhagavad Gita"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              rows={4} value={description} onChange={e => setDescription(e.target.value)} required
              placeholder="Describe what students will learn…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category} onChange={e => setCategory(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={level} onChange={e => setLevel(e.target.value as typeof LEVELS[number])}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="e.g. yoga, philosophy, scripture"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {/* Pricing + flags */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Pricing & Visibility</h3>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">Paid Course</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>
          </div>

          {isPaid && (
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          )}
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Lessons ({lessons.length})</h3>
            <button type="button" onClick={addLesson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
            >
              <Plus size={13} /> Add Lesson
            </button>
          </div>

          {lessons.map((lesson, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500">Lesson {idx + 1}</span>
                </div>
                {lessons.length > 1 && (
                  <button type="button" onClick={() => removeLesson(idx)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <input
                type="text" placeholder="Lesson title *" value={lesson.title}
                onChange={e => updateLesson(idx, 'title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />

              <textarea
                rows={2} placeholder="Lesson content / notes"
                value={lesson.content} onChange={e => updateLesson(idx, 'content', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white resize-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url" placeholder="Video URL (optional)" value={lesson.videoUrl}
                  onChange={e => updateLesson(idx, 'videoUrl', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} placeholder="Duration (min)" value={lesson.duration || ''}
                    onChange={e => updateLesson(idx, 'duration', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? <><Spinner size="sm" /> Creating…</> : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
