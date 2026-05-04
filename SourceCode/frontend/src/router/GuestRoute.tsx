import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'

const ROLE_REDIRECT: Record<string, string> = {
  student:  '/student/dashboard',
  examiner: '/examiner/dashboard',
  admin:    '/admin/dashboard',
}

/**
 * Mirrors the ProtectedRoute hydration guard — waits for Zustand to finish
 * loading from localStorage before deciding whether to redirect to a dashboard
 * or render the guest page (login / register).
 *
 * Without this guard, a briefly-unauthenticated ProtectedRoute redirects the
 * user to /login, then GuestRoute immediately redirects them back to the
 * dashboard once the store hydrates — creating the redirect bounce that
 * causes the blank page.
 */
export function GuestRoute() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()

  // ── Hold here until Zustand has finished reading from localStorage ──────────
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFAF5' }}>
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    const redirect = ROLE_REDIRECT[user.role] ?? '/'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
