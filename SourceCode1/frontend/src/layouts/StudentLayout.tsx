import { useState, Suspense, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  BarChart2,
  Award,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Flower2,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logoutUser } from '@/services/authService'
import { Spinner } from '@/components/ui/Spinner'

// ── Error boundary — keeps the sidebar alive if a portal page throws ─────────
interface EBState { hasError: boolean; message: string }
class PortalErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message }
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    // Log to console in dev; swap for a real logger in production
    console.error('[PortalErrorBoundary]', err, info)
  }
  handleRetry = () => this.setState({ hasError: false, message: '' })
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">{this.state.message || 'An unexpected error occurred on this page.'}</p>
          <button
            onClick={this.handleRetry}
            className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#E8720C' }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const navItems = [
  { to: '/student/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile',      icon: User,            label: 'My Profile' },
  { to: '/student/courses',      icon: BookOpen,        label: 'My Courses' },
  { to: '/student/exam',         icon: FileText,        label: 'Exam Section' },
  { to: '/student/results',      icon: BarChart2,       label: 'Results' },
  { to: '/student/certificates', icon: Award,           label: 'Certificates' },
  { to: '/student/support',      icon: MessageCircle,   label: 'Support' },
]

function PortalPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" className="text-[#E8720C]" />
    </div>
  )
}

// ── Extracted to module level to prevent unmount/remount on every render ──────
interface SidebarContentProps {
  user: { name?: string; studentId?: string } | null
  onNavClick: () => void
  onLogout: () => void
}

function SidebarContent({ user, onNavClick, onLogout }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E8720C' }}
          >
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
              ISKCON PORTAL
            </p>
            <p className="text-white/50 text-xs mt-0.5">Student</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#E8720C' }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'Student'}</p>
            <p className="text-white/50 text-xs truncate">{user?.studentId ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 border-r-4 border-[#E8720C] text-white font-semibold'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white w-full transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch { /* ignore */ }
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFAF5' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 h-full overflow-hidden"
        style={{ backgroundColor: '#1A1A2E' }}
      >
        <SidebarContent
          user={user}
          onNavClick={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative z-50 flex flex-col w-64 h-full shadow-2xl"
            style={{ backgroundColor: '#1A1A2E' }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
            <SidebarContent
              user={user}
              onNavClick={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header
          className="lg:hidden flex items-center gap-4 px-4 py-3 shadow-sm"
          style={{ backgroundColor: '#1A1A2E' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1 rounded-lg hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
            ISKCON PORTAL
          </span>
        </header>

        {/* Page content — ErrorBoundary + Suspense scoped here so the sidebar
            never disappears due to a lazy-load spinner or a page-level crash */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <PortalErrorBoundary>
            <Suspense fallback={<PortalPageLoader />}>
              <Outlet />
            </Suspense>
          </PortalErrorBoundary>
        </main>
      </div>
    </div>
  )
}
