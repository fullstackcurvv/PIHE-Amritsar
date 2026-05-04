import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router'
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Lock,
  Play,
  Download,
  FileText,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { getCourseById } from '@/services/courseService'
import { FileUploadZone } from '@/components/ui/FileUploadZone'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import { uploadOfflinePaper } from '@/services/examService'
import { updateLessonProgress } from '@/services/enrollmentService'
import { useCourseStore } from '@/store/courseStore'
import type { Course } from '@/types/course'

export default function CoursePageStudent() {
  const { id } = useParams<{ id: string }>()
  const { enrollments, updateProgress } = useCourseStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [openLesson, setOpenLesson] = useState<string | null>(null)
  const [completingLesson, setCompletingLesson] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const enrollment = enrollments.find((e) => e.course._id === id)
  const progress = enrollment?.progress ?? 0

  // Mark a lesson as complete and update progress optimistically
  const handleMarkComplete = useCallback(
    async (lessonId: string) => {
      if (!enrollment) return
      setCompletingLesson(lessonId)
      // Optimistic update: increment progress by 1 lesson worth
      const totalLessons = course?.lessons?.length ?? 1
      const newProgress = Math.min(100, progress + Math.round(100 / totalLessons))
      updateProgress(enrollment._id, newProgress)
      try {
        const updated = await updateLessonProgress(enrollment._id, lessonId)
        // Sync with server value
        updateProgress(enrollment._id, updated.progress)
      } catch {
        // Roll back optimistic update on error
        updateProgress(enrollment._id, progress)
      } finally {
        setCompletingLesson(null)
      }
    },
    [enrollment, course, progress, updateProgress]
  )

  useEffect(() => {
    if (!id) return
    getCourseById(id)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleOfflineUpload = async (file: File) => {
    if (!id) return
    setUploading(true)
    setUploadError(null)
    try {
      const result = await uploadOfflinePaper('', id, file)
      setUploadSuccess(`Paper submitted! ID: ${result._id}`)
    } catch {
      setUploadError('Failed to upload paper. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Course not found.</p>
        <Link to="/student/courses" className="text-[#E8720C] underline text-sm mt-2 inline-block">
          ← Back to My Courses
        </Link>
      </div>
    )
  }

  const completedLessons = Math.floor((progress / 100) * (course.lessons?.length ?? 0))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400">
        <Link to="/student/courses" className="hover:text-[#E8720C] transition-colors">
          My Courses
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Course header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h1
              className="text-xl lg:text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {course.title}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{course.description}</p>
            <ProgressBar value={progress} size="lg" showLabel />
            <p className="text-xs text-gray-400 mt-2">
              {completedLessons} of {course.lessons?.length ?? 0} lessons completed
            </p>
          </div>

          {/* Lesson list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={18} style={{ color: '#E8720C' }} />
                Course Lessons
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {(course.lessons ?? []).map((lesson, index) => {
                const isCompleted = index < completedLessons
                const isCurrent = index === completedLessons
                const isLocked = index > completedLessons
                const isOpen = openLesson === lesson._id

                return (
                  <div key={lesson._id ?? index}>
                    <button
                      onClick={() => {
                        if (!isLocked) setOpenLesson(isOpen ? null : (lesson._id ?? `l${index}`))
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                        isCurrent ? 'bg-orange-50' : 'hover:bg-gray-50'
                      } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                      {/* Status icon */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : isCurrent ? (
                          <Play size={20} style={{ color: '#E8720C' }} />
                        ) : (
                          <Lock size={20} className="text-gray-300" />
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrent ? 'text-[#E8720C]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          {index + 1}. {lesson.title ?? `Lesson ${index + 1}`}
                        </p>
                        {lesson.duration && (
                          <p className="text-xs text-gray-400 mt-0.5">{lesson.duration} min</p>
                        )}
                      </div>

                      {/* Toggle */}
                      {!isLocked && (
                        <div className="shrink-0 text-gray-400">
                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      )}
                    </button>

                    {/* Expanded lesson content */}
                    {isOpen && (
                      <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                        {lesson.videoUrl && (
                          <div className="mb-3 mt-3">
                            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                              <Play size={40} className="text-gray-400" />
                            </div>
                          </div>
                        )}
                        {lesson.content && (
                          <p className="text-sm text-gray-600 leading-relaxed mt-3">{lesson.content}</p>
                        )}
                        {!lesson.videoUrl && !lesson.content && (
                          <p className="text-sm text-gray-400 italic mt-3">Lesson content coming soon.</p>
                        )}
                        {/* Mark complete button — only for current/unlocked, not already completed */}
                        {!isCompleted && (
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="primary"
                              loading={completingLesson === (lesson._id ?? `l${index}`)}
                              icon={<CheckCircle size={14} />}
                              onClick={() => handleMarkComplete(lesson._id ?? `l${index}`)}
                            >
                              Mark as Complete
                            </Button>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                            <CheckCircle size={14} />
                            Completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {(!course.lessons || course.lessons.length === 0) && (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">
                  No lessons available yet.
                </div>
              )}
            </div>
          </div>

          {/* Study Materials */}
          {course.studyMaterials && course.studyMaterials.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={18} style={{ color: '#E8720C' }} />
                  Study Materials
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {course.studyMaterials.map((material, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{material.title}</p>
                        {material.fileSize && (
                          <p className="text-xs text-gray-400">{material.fileSize}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold hover:underline"
                      style={{ color: '#E8720C' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Course info card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Course Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium text-gray-800">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium text-gray-800">{course.lessons?.length ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-800">{course.isPaid ? 'Paid' : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Progress</span>
                <span className="font-semibold" style={{ color: '#E8720C' }}>{progress}%</span>
              </div>
            </div>
          </div>

          {/* Online exam button */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Online Exam</h3>
            <p className="text-xs text-gray-400 mb-4">
              Take the online exam to test your knowledge of this course.
            </p>
            <Link to={`/student/courses/${id}/exam`}>
              <Button variant="primary" size="md" className="w-full">
                Take Online Exam <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Offline paper upload */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Upload Offline Paper</h3>
            <p className="text-xs text-gray-400 mb-4">
              Scanned your answer sheet? Upload it here for evaluation.
            </p>

            {uploadSuccess ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700">
                <CheckCircle size={16} />
                {uploadSuccess}
              </div>
            ) : (
              <>
                <FileUploadZone
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={10}
                  onFile={handleOfflineUpload}
                  label="Upload answer paper"
                  hint="PDF, JPG or PNG — max 10MB"
                />
                {uploadError && (
                  <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                )}
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Spinner size="sm" className="text-[#E8720C]" />
                    Uploading...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
