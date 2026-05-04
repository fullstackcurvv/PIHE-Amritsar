import { Link } from 'react-router'
import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Course } from '@/types/course'

interface CourseCardProps {
  course: Course
}

const levelVariant: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course._id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full">

        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video">
          <img
            src={course.thumbnail || '/assets/images/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/FDE8D8/E8720C?text=ISKCON+Course'
            }}
          />
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {course.isBestSeller && <Badge variant="bestseller" />}
            {course.isPopular && !course.isBestSeller && <Badge variant="popular" />}
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={course.isPaid ? 'paid' : 'free'} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            {course.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-[#E8720C]">
              <BookOpen size={12} />
              <span>{course.lessons?.length ?? 0} Lessons</span>
            </div>
            <Badge variant={levelVariant[course.level] ?? 'beginner'} />
          </div>
        </div>
      </div>
    </Link>
  )
}
