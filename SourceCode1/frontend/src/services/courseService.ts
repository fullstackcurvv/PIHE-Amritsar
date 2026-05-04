import api from './api'
import type { Course, CourseFilters, CoursesResponse } from '@/types/course'

export const getCourses = async (params: CourseFilters = {}): Promise<CoursesResponse> => {
  const res = await api.get('/courses', { params })
  return res.data
}

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await api.get(`/courses/${id}`)
  return res.data.data
}

// Static mock data for when the API isn't connected yet
export const getMockCourses = (): Course[] => [
  {
    _id: '1',
    title: 'Bhagavad Gita Foundation',
    description: 'Understand the timeless wisdom of the Bhagavad Gita and its practical application in modern life.',
    level: 'Beginner',
    price: 0,
    isPaid: false,
    isBestSeller: true,
    lessons: Array(12).fill(null).map((_, i) => ({
      _id: String(i),
      title: `Lesson ${i + 1}`,
      duration: '30 min',
      isLocked: i > 2,
      order: i,
    })),
    enrollmentCount: 1240,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    title: 'Introduction to ISKCON',
    description: 'Discover the history, philosophy and mission of ISKCON and its global impact.',
    level: 'Beginner',
    price: 0,
    isPaid: false,
    isPopular: true,
    lessons: Array(10).fill(null).map((_, i) => ({
      _id: String(i),
      title: `Lesson ${i + 1}`,
      duration: '25 min',
      isLocked: i > 2,
      order: i,
    })),
    enrollmentCount: 985,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '3',
    title: 'Bhakti Yoga Practice',
    description: 'A practical guide to devotional service and spiritual life in the Vaishnava tradition.',
    level: 'Intermediate',
    price: 499,
    isPaid: true,
    lessons: Array(15).fill(null).map((_, i) => ({
      _id: String(i),
      title: `Lesson ${i + 1}`,
      duration: '40 min',
      isLocked: i > 1,
      order: i,
    })),
    enrollmentCount: 756,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '4',
    title: 'Srimad Bhagavatam Overview',
    description: 'Dive deep into the essence of Srimad Bhagavatam — the ripe fruit of the Vedic literature.',
    level: 'Advanced',
    price: 799,
    isPaid: true,
    lessons: Array(18).fill(null).map((_, i) => ({
      _id: String(i),
      title: `Lesson ${i + 1}`,
      duration: '45 min',
      isLocked: i > 1,
      order: i,
    })),
    enrollmentCount: 432,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]
