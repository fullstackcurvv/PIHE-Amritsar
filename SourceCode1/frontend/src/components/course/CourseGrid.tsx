import { CourseCard } from './CourseCard'
import { Spinner } from '@/components/ui/Spinner'
import type { Course } from '@/types/course'

interface CourseGridProps {
  courses: Course[]
  loading?: boolean
  columns?: 2 | 3 | 4
  emptyMessage?: string
}

const colClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function CourseGrid({ courses, loading = false, columns = 4, emptyMessage = 'No courses found.' }: CourseGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (!courses.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-base">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-6`}>
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  )
}
