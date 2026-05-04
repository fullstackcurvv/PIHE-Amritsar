import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { BookOpen, Clock, Lock, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getMockCourses } from '@/services/courseService'
import type { Course } from '@/types/course'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [openLesson, setOpenLesson] = useState<number | null>(0)

  useEffect(() => {
    setTimeout(() => {
      const found = getMockCourses().find(c => c._id === id) ?? getMockCourses()[0]
      setCourse(found)
      setLoading(false)
    }, 300)
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" className="text-[#E8720C]" /></div>
  if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500">Course not found.</div>

  const freeCount = course.lessons.filter(l => !l.isLocked).length

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: course.title }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={course.isPaid ? 'paid' : 'free'} />
                {course.isBestSeller && <Badge variant="bestseller" />}
                <Badge variant={course.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced'} />
              </div>
              <h1 className="font-bold text-3xl text-gray-900 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>{course.title}</h1>
              <p className="text-gray-600 text-base leading-relaxed">{course.description}</p>
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><BookOpen size={15} />{course.lessons.length} Lessons</span>
                <span className="flex items-center gap-1.5"><Clock size={15} />Self-paced</span>
              </div>
            </div>

            {/* Course thumbnail */}
            <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100">
              <img
                src={`https://placehold.co/800x450/FDE8D8/E8720C?text=${encodeURIComponent(course.title)}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* About section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-xl text-gray-900 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>About This Course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description} This course is ideal for students who want to deepen their understanding of Vedic philosophy and apply timeless teachings to daily spiritual practice.</p>
            </div>

            {/* Lesson Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-xl text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Lesson Preview</h2>
              <p className="text-sm text-gray-500 mb-4">{freeCount} lessons free · {course.lessons.length - freeCount} lessons require enrollment</p>
              <div className="space-y-2">
                {course.lessons.slice(0, 6).map((lesson, i) => (
                  <div key={lesson._id}>
                    <button
                      onClick={() => setOpenLesson(openLesson === i ? null : i)}
                      disabled={lesson.isLocked}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors ${
                        lesson.isLocked ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-orange-50 text-gray-800 hover:bg-orange-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {lesson.isLocked ? <Lock size={14} className="text-gray-400" /> : <BookOpen size={14} className="text-[#E8720C]" />}
                        {lesson.title}
                      </span>
                      <span className="flex items-center gap-2 text-xs">
                        <Clock size={12} />{lesson.duration}
                        {!lesson.isLocked && (openLesson === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </span>
                    </button>
                    {openLesson === i && !lesson.isLocked && (
                      <div className="px-4 py-3 text-sm text-gray-500 bg-white border border-orange-100 rounded-b-xl">
                        Preview available after enrollment. This lesson covers key concepts and provides interactive exercises.
                      </div>
                    )}
                  </div>
                ))}
                {course.lessons.length > 6 && (
                  <p className="text-sm text-center text-gray-400 pt-2">+ {course.lessons.length - 6} more lessons after enrollment</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar sticky card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-20">
              <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                {course.isPaid ? `₹${course.price}` : 'Free'}
              </div>
              {course.isPaid && <p className="text-sm text-gray-400 mb-4">One-time payment</p>}

              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full mb-3">
                  Enroll Now →
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-400">
                Register to get full access to all lessons, study materials, and certificate.
              </p>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><BookOpen size={15} className="text-[#E8720C]" /> {course.lessons.length} lessons</div>
                <div className="flex items-center gap-2"><FileText size={15} className="text-[#E8720C]" /> Study materials included</div>
                <div className="flex items-center gap-2"><Clock size={15} className="text-[#E8720C]" /> Lifetime access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
