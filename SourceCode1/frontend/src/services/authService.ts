import api from './api'
import type { User, AuthResponse } from '@/types/user'

export interface RegisterPayload {
  name:     string
  email:    string
  phone?:   string
  password: string
}

export interface LoginPayload {
  email:    string
  password: string
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', payload)
  return res.data
}

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
  const res = await api.post('/auth/refresh')
  return res.data.data
}

export const getProfile = async (): Promise<User> => {
  const res = await api.get('/auth/me')
  return res.data.data
}

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email })
}
