import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import type { Role } from '@/types/user'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

/**
 * Waits for Zustand persist rehydration before making any routing decision.
 * Without this guard, the store starts with isAuthenticated=false on every
 * hard refresh — causing an instant redirect to /login — and then immediately
 * back to the dashboard once localStorage is read, producing a blank-page bounce.
 *
 * After hydration:
 *   - Unauthenticated → redirect to /login (with `from` state for post-login return)
 *   - Wrong role → 403 page
 *   - Authenticated + correct role → render children via <Outlet />
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const location = useLocation()

  // ── Hold here until Zustand has finished reading from localStorage ──────────
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFAF5' }}>
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" style={{ backgroundColor: '#FFFAF5' }}>
        <h1 className="text-5xl font-bold text-red-500">403</h1>
        <p className="text-xl text-gray-600">Access Denied</p>
        <p className="text-gray-400 max-w-xs">You don't have permission to view this page.</p>
        <a href="/" className="text-[#E8720C] underline">Go home</a>
      </div>
    )
  }

  return <Outlet />
}
