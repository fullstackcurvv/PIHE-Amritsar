import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import { getProfile }   from '@/services/authService'
import { Spinner }      from '@/components/ui/Spinner'

/**
 * Handles the Google OAuth callback.
 * URL: /auth/callback?token=<accessToken>&role=<role>
 * Sets access token in store → fetches full user profile → redirects to dashboard.
 */
const ROLE_REDIRECT: Record<string, string> = {
  student:  '/student/dashboard',
  examiner: '/examiner/dashboard',
  admin:    '/admin/dashboard',
}

export default function OAuthCallbackPage() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    const role  = params.get('role') ?? 'student'
    const error = params.get('error')

    if (error || !token) {
      navigate('/login?error=oauth_failed', { replace: true })
      return
    }

    // Store token temporarily so api.ts interceptor can use it
    const raw   = localStorage.getItem('iskcon-auth') ?? '{}'
    try {
      const state = JSON.parse(raw)
      state.state = { ...state.state, accessToken: token }
      localStorage.setItem('iskcon-auth', JSON.stringify(state))
    } catch { /* ignore */ }

    // Fetch full user profile
    getProfile()
      .then(user => {
        setAuth(user, token)
        const redirect = ROLE_REDIRECT[role] ?? '/'
        navigate(redirect, { replace: true })
      })
      .catch(() => {
        navigate('/login?error=oauth_failed', { replace: true })
      })
  }, [params, navigate, setAuth])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#FFFAF5' }}>
      <Spinner size="lg" className="text-[#E8720C]" />
      <p className="text-gray-500 text-sm">Completing sign-in…</p>
    </div>
  )
}
