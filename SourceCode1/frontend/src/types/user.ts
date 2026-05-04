export type Role = 'student' | 'examiner' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: Role
  studentId?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface AuthResponse {
  success:    boolean
  message?:   string
  statusCode?: number
  data: {
    user:        User
    accessToken: string
  }
}
