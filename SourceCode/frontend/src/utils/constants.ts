export const ROLES = {
  STUDENT: 'student',
  EXAMINER: 'examiner',
  ADMIN: 'admin',
} as const

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

export const LEVEL_COLORS = {
  Beginner:     { bg: 'bg-success/10',  text: 'text-success' },
  Intermediate: { bg: 'bg-blue-50',     text: 'text-blue-600' },
  Advanced:     { bg: 'bg-purple-50',   text: 'text-purple-600' },
} as const

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN:    '/auth/login',
    ME:       '/auth/me',
    LOGOUT:   '/auth/logout',
    REFRESH:  '/auth/refresh',
  },
  COURSES: {
    LIST:   '/courses',
    DETAIL: (id: string) => `/courses/${id}`,
  },
  ENROLLMENTS: {
    MY:      '/enrollments/my',
    ENROLL:  (courseId: string) => `/enrollments/${courseId}`,
  },
} as const

export const STATS = [
  { value: '25K+',  label: 'Students Enrolled' },
  { value: '120+',  label: 'Courses Available' },
  { value: '10K+',  label: 'Exams Completed' },
  { value: '8K+',   label: 'Certificates Issued' },
] as const

export const NAV_LINKS = [
  { label: 'Home',                 to: '/' },
  { label: 'About Us',             to: '/about' },
  { label: 'Courses',              to: '/courses' },
  { label: 'How It Works',         to: '/how-it-works' },
  { label: 'Exam Guidelines',      to: '/exam-guidelines' },
  { label: 'Contact Us',           to: '/contact' },
  { label: 'Temple Registration',  to: '/temple-registration' },
] as const
