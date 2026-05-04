import { create } from 'zustand'
import type { Course } from '@/types/course'

export interface Enrollment {
  _id: string
  course: Course
  student: string
  status: 'active' | 'completed' | 'dropped'
  progress: number
  enrolledAt: string
  completedAt?: string
}

interface CourseState {
  courses: Course[]
  enrollments: Enrollment[]
  currentCourse: Course | null
  isLoading: boolean
  pagination: {
    page: number
    total: number
    totalPages: number
  }

  // Actions
  setCourses: (courses: Course[], pagination: CourseState['pagination']) => void
  setCurrentCourse: (course: Course | null) => void
  setEnrollments: (enrollments: Enrollment[]) => void
  addEnrollment: (enrollment: Enrollment) => void
  updateProgress: (enrollmentId: string, progress: number) => void
  setLoading: (loading: boolean) => void
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  enrollments: [],
  currentCourse: null,
  isLoading: false,
  pagination: { page: 1, total: 0, totalPages: 0 },

  setCourses: (courses, pagination) => set({ courses, pagination }),

  setCurrentCourse: (currentCourse) => set({ currentCourse }),

  setEnrollments: (enrollments) => set({ enrollments }),

  addEnrollment: (enrollment) =>
    set((state) => ({ enrollments: [...state.enrollments, enrollment] })),

  updateProgress: (enrollmentId, progress) =>
    set((state) => ({
      enrollments: state.enrollments.map((e) =>
        e._id === enrollmentId ? { ...e, progress } : e
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}))
