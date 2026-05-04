export interface Lesson {
  _id: string
  title: string
  duration?: string
  videoUrl?: string
  content?: string
  isLocked?: boolean
  order?: number
}

export interface StudyMaterial {
  _id?: string
  title: string
  fileUrl?: string
  url?: string
  fileType?: 'pdf' | 'doc' | 'video'
  fileSize?: string
  requiresLogin?: boolean
}

export interface Course {
  _id: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  isPaid: boolean
  isBestSeller?: boolean
  isPopular?: boolean
  thumbnail?: string
  lessons: Lesson[]
  studyMaterials?: StudyMaterial[]
  enrollmentCount: number
  badge?: string
  category?: string
  instructor?: string
  createdAt: string
  updatedAt: string
}

export interface CourseFilters {
  page?: number
  limit?: number
  search?: string
  level?: string
  isPaid?: boolean
  featured?: boolean
  category?: string
  sort?: string
}

export interface CoursePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CoursesResponse {
  success: boolean
  data: Course[]
  pagination: CoursePagination
}
