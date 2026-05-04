import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

interface AuthState {
  user:               User | null
  accessToken:        string | null
  isAuthenticated:    boolean
  showStudentIdModal: boolean

  /**
   * True once the `persist` middleware has finished reading from localStorage.
   * Until this is true, ProtectedRoute and GuestRoute render a loading spinner
   * instead of making routing decisions — preventing the premature redirect
   * that causes the blank-page bounce: /student/dashboard → /login → /student/dashboard.
   *
   * NOTE: NOT included in partialize so it is never persisted to localStorage.
   */
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void

  // Actions
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  setShowStudentIdModal: (show: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:               null,
      accessToken:        null,
      isAuthenticated:    false,
      showStudentIdModal: false,
      _hasHydrated:       false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          // NOTE: showStudentIdModal is NOT set here.
          // It is only set to true inside the register flow (authService → register)
          // to avoid the modal popping up on every subsequent login.
        }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      clearAuth: () =>
        set({
          user:               null,
          accessToken:        null,
          isAuthenticated:    false,
          showStudentIdModal: false,
        }),

      setShowStudentIdModal: (show) =>
        set({ showStudentIdModal: show }),
    }),
    {
      name: 'iskcon-auth',

      // Only persist auth fields — never _hasHydrated (it's runtime state only)
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),

      // Called once localStorage has been read and the store is fully rehydrated.
      // Flipping _hasHydrated to true unblocks ProtectedRoute/GuestRoute.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
