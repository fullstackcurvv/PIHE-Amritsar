import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { BookOpen, CheckCircle, FileText, Award, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCourseStore } from '@/store/courseStore'
import { getMyEnrollments } from '@/services/enrollmentService'
import { getMyResults } from '@/services/examService'
import { getMyCertificates } from '@/services/certificateService'
import { StatsCard } from '@/components/ui/StatsCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import type { Result } from '@/types/exam'

// Mock data for when API is not yet connected
const MOCK_ENROLLMENTS = [
  {
    _id: 'e1',
    course: {
      _id: 'c1',
      title: 'Bhagavad Gita Foundation',
      description: 'An introduction to the timeless wisdom of the Bhagavad Gita',
      thumbnail: '',
      lessons: Array(12).fill({}),
      level: 'Beginner',
      isPaid: false,
      isBestSeller: true,
      isPopular: true,
    },
    student: 'u1',
    status: 'active' as const,
    progress: 65,
    enrolledAt: '2026-04-10T00:00:00Z',
  },
  {
    _id: 'e2',
    course: {
      _id: 'c2',
      title: 'ISKCON Philosophy & Culture',
      description: 'Explore the rich philosophy and cultural heritage of ISKCON',
      thumbnail: '',
      lessons: Array(8).fill({}),
      level: 'Intermediate',
      isPaid: false,
      isBestSeller: false,
      isPopular: true,
    },
    student: 'u1',
    status: 'active' as const,
    progress: 30,
    enrolledAt: '2026-04-05T00:00:00Z',
  },
  {
    _id: 'e3',
    course: {
      _id: 'c3',
      title: 'Kirtan & Devotional Practices',
      description: 'Learn the sacred art of kirtan and devotional practices',
      thumbnail: '',
      lessons: Array(6).fill({}),
      level: 'Beginner',
      isPaid: false,
      isBestSeller: false,
      isPopular: false,
    },
    student: 'u1',
    status: 'completed' as const,
    progress: 100,
    enrolledAt: '2026-03-15T00:00:00Z',
    completedAt: '2026-04-01T00:00:00Z',
  },
]

// Selector keeps the reference stable — prevents unnecessary re-renders when
// unrelated courseStore fields (isLoading, courses, etc.) change.
const selectEnrollments   = (s: ReturnType<typeof useCourseStore.getState>) => s.enrollments
const selectSetEnrollments = (s: ReturnType<typeof useCourseStore.getState>) => s.setEnrollments

export default function DashboardPage() {
  const { user } = useAuthStore()
  // Use individual selectors so we only re-render when the specific slice changes
  const enrollments   = useCourseStore(selectEnrollments)
  const setEnrollments = useCourseStore(selectSetEnrollments)
  const [results, setResults] = useState<Result[]>([])
  const [certCount, setCertCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false  // cleanup flag prevents state updates after unmount

    const load = async () => {
      try {
        const [enrollData, resultData, certData] = await Promise.allSettled([
          getMyEnrollments(),
          getMyResults(),
          getMyCertificates(),
        ])
        if (cancelled) return

        // Guard: only use API value if it is actually an array; fall back to
        // mock data otherwise.  This prevents a runtime crash if the backend
        // accidentally sends a non-array (e.g. wrong ApiResponse argument order).
        if (enrollData.status === 'fulfilled' && Array.isArray(enrollData.value)) {
          setEnrollments(enrollData.value)
        } else {
          setEnrollments(MOCK_ENROLLMENTS as Parameters<typeof setEnrollments>[0])
        }

        if (resultData.status === 'fulfilled' && Array.isArray(resultData.value)) {
          setResults(resultData.value)
        }

        if (certData.status === 'fulfilled' && Array.isArray(certData.value)) {
          setCertCount(certData.value.length)
        }
      } catch {
        // Promise.allSettled absorbs individual failures; this catch only fires
        // if allSettled itself rejects (should never happen).
        if (!cancelled) setEnrollments(MOCK_ENROLLMENTS as Parameters<typeof setEnrollments>[0])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()

    return () => { cancelled = true }
    // setEnrollments from Zustand is stable (created once with the store),
    // so this effect runs exactly once per mount — no spurious re-fetches.
  }, [setEnrollments])

  const displayEnrollments = enrollments.length > 0 ? enrollments : MOCK_ENROLLMENTS
  const completedCount = displayEnrollments.filter((e) => e.status === 'completed').length
  const pendingExams = results.filter((r) => r.status === 'pending').length
  const recentCourses = displayEnrollments
    .filter((e) => e.status === 'active')
    .slice(0, 3)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <div
        className="rounded-2xl p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D5E 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm">{greeting()},</p>
            <h1
              className="text-2xl lg:text-3xl font-bold text-white mt-1"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {user?.name ?? 'Student'} 🙏
            </h1>
            {user?.studentId && (
              <p className="text-white/50 text-sm mt-2">
                Student ID:{' '}
                <span className="text-[#E8720C] font-semibold">{user.studentId}</span>
              </p>
            )}
          </div>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen size={22} style={{ color: '#E8720C' }} />}
          title="Enrolled Courses"
          value={displayEnrollments.length}
          iconBg="bg-orange-100"
        />
        <StatsCard
          icon={<CheckCircle size={22} className="text-green-600" />}
          title="Completed"
          value={completedCount}
          iconBg="bg-green-100"
        />
        <StatsCard
          icon={<FileText size={22} className="text-blue-600" />}
          title="Exams Pending"
          value={pendingExams}
          iconBg="bg-blue-100"
        />
        <StatsCard
          icon={<Award size={22} className="text-purple-600" />}
          title="Certificates"
          value={certCount}
          iconBg="bg-purple-100"
        />
      </div>

      {/* Recent courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
            Continue Learning
          </h2>
          <Link
            to="/student/courses"
            className="text-sm font-semibold flex items-center gap-1 hover:underline"
            style={{ color: '#E8720C' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#E8720C' }}
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div
                    className="w-full sm:w-20 h-16 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#FDE8D8' }}
                  >
                    <BookOpen size={28} style={{ color: '#E8720C' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {enrollment.course.title}
                      </h3>
                      <span className="shrink-0 text-xs text-gray-400">
                        {enrollment.course.lessons?.length ?? 0} lessons
                      </span>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={enrollment.progress} size="md" showLabel />
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/student/courses/${enrollment.course._id}`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: '#E8720C' }}
                  >
                    Continue <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
