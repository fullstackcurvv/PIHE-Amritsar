import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { CourseGrid } from '@/components/course/CourseGrid'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/shared/Pagination'
import { getMockCourses } from '@/services/courseService'
import type { Course } from '@/types/course'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const TYPES  = ['All', 'Free', 'Paid']

const PAGE_SIZE = 12

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [type, setType]   = useState('All')
  const [page, setPage]   = useState(1)

  useEffect(() => {
    setTimeout(() => {
      // Duplicate mock data to simulate more courses
      const base = getMockCourses()
      setAllCourses([...base, ...base, ...base])
      setLoading(false)
    }, 300)
  }, [])

  const filtered = allCourses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel  = level === 'All' || c.level === level
    const matchType   = type === 'All' || (type === 'Free' ? !c.isPaid : c.isPaid)
    return matchSearch && matchLevel && matchType
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilter = (setter: (v: string) => void, value: string) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-bold text-4xl text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>All Courses</h1>
          <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#E8720C' }} />
          <p className="mt-3 text-gray-500">{filtered.length} courses available</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={e => handleFilter(setSearch, e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>

            {/* Level filter */}
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => handleFilter(setLevel, l)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    level === l ? 'bg-[#E8720C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex gap-2">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => handleFilter(setType, t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    type === t ? 'bg-[#E8720C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <CourseGrid courses={paginated} loading={loading} columns={3} emptyMessage="No courses match your filters." />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
