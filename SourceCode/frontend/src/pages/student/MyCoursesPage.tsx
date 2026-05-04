import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react'
import { useCourseStore } from '@/store/courseStore'
import { getMyEnrollments } from '@/services/enrollmentService'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import type { Enrollment } from '@/store/courseStore'

type TabType = 'active' | 'completed'

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const isCompleted = enrollment.status === 'completed'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Thumbnail */}
      <div
        className="h-32 flex items-center justify-center"
        style={{ backgroundColor: isCompleted ? '#F0FDF4' : '#FDE8D8' }}
      >
        {isCompleted ? (
          <CheckCircle size={40} className="text-green-500" />
        ) : (
          <BookOpen size={40} style={{ color: '#E8720C' }} />
        )}
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {enrollment.course.title}
          </h3>
          <span
            className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
              LEVEL_COLORS[enrollment.course.level] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {enrollment.course.level}
          </span>
        </div>

        {/* Meta */}
        <p className="text-xs text-gray-400 mb-4">
          {enrollment.course.lessons?.length ?? 0} Lessons · Enrolled{' '}
          {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        {/* Progress */}
        <ProgressBar value={enrollment.progress} size="md" showLabel />

        {/* CTA */}
        <Link
          to={`/student/courses/${enrollment.course._id}`}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={
            isCompleted
              ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
              : { backgroundColor: '#E8720C', color: '#fff' }
          }
        >
          {isCompleted ? 'Review Course' : 'Continue Learning'}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export default function MyCoursesPage() {
  const { enrollments, setEnrollments } = useCourseStore()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('active')

  useEffect(() => {
    getMyEnrollments()
      .then(setEnrollments)
      .catch(() => {
        // Keep any mock data already in store
      })
      .finally(() => setLoading(false))
  }, [setEnrollments])

  const filtered = enrollments.filter((e) => e.status === activeTab)

  const tabs: { key: TabType; label: string; count: number }[] = [
    {
      key: 'active',
      label: 'Enrolled',
      count: enrollments.filter((e) => e.status === 'active').length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: enrollments.filter((e) => e.status === 'completed').length,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          My Courses
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track your learning progress</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#E8720C] text-[#E8720C]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-orange-100 text-[#E8720C]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-[#E8720C]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            {activeTab === 'active'
              ? 'No active courses. Browse our course catalog!'
              : 'No completed courses yet. Keep learning!'}
          </p>
          {activeTab === 'active' && (
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#E8720C' }}
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((enrollment) => (
            <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  )
}
