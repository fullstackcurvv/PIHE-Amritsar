import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import * as authService from '@/services/authService'
import type { RegisterPayload, LoginPayload } from '@/services/authService'

const ROLE_REDIRECT: Record<string, string> = {
  student:  '/student/dashboard',
  examiner: '/examiner/dashboard',
  admin:    '/admin/dashboard',
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const navigate = useNavigate()
  const { setAuth, clearAuth, isAuthenticated, user, setShowStudentIdModal } = useAuthStore()

  const register = async (data: RegisterPayload & { confirmPassword?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      // Strip confirmPassword before sending
      const { confirmPassword: _, ...payload } = data
      const res = await authService.registerUser(payload)
      setAuth(res.data.user, res.data.accessToken)
      // Show student ID modal ONLY on first registration (not on every login)
      if (res.data.user?.studentId) {
        setShowStudentIdModal(true)
      }
      navigate('/student/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.loginUser(data)
      setAuth(res.data.user, res.data.accessToken)
      const redirect = ROLE_REDIRECT[res.data.user.role] ?? '/'
      navigate(redirect)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logoutUser()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return { register, login, logout, isLoading, error, isAuthenticated, user }
}
