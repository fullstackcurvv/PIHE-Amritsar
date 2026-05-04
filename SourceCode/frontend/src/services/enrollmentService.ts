import api from './api'
import type { Enrollment } from '@/store/courseStore'

export const getMyEnrollments = async (): Promise<Enrollment[]> => {
  const res = await api.get('/enrollments/my')
  return res.data.data
}

export const enrollInCourse = async (courseId: string): Promise<Enrollment> => {
  const res = await api.post('/enrollments', { courseId })
  return res.data.data
}

export const updateLessonProgress = async (
  enrollmentId: string,
  lessonId: string
): Promise<Enrollment> => {
  const res = await api.patch(`/enrollments/${enrollmentId}/progress`, { lessonId })
  return res.data.data
}
