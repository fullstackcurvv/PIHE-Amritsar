import { useState, Suspense, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  ClipboardList,
  Award,
  BarChart3,
  LogOut,
  Menu,
  X,
  Flower2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logoutUser }  from '@/services/authService'
import { Spinner }     from '@/components/ui/Spinner'

// ── Nav structure (grouped) ───────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/reports',      icon: BarChart3,        label: 'Reports' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/courses',      icon: BookOpen,         label: 'Courses' },
      { to: '/admin/exams',        icon: FileText,         label: 'Exams' },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/students',     icon: GraduationCap,    label: 'Students' },
      { to: '/admin/examiners',    icon: UserCheck,        label: 'Examiners' },
    ],
  },
  {
    label: 'Assessment',
    items: [
      { to: '/admin/submissions',  icon: ClipboardList,    label: 'Submissions' },
      { to: '/admin/certificates', icon: Award,            label: 'Certificates' },
    ],
  },
]

// ── Error boundary (keeps sidebar alive on render errors) ─────────────────────
interface EBState { hasError: boolean; message: string }
class AdminErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message }
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('[AdminErrorBoundary]', err, info)
  }
  handleRetry = () => this.setState({ hasError: false, message: '' })
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <div className="text-4xl">⚠️</div>
          <p className="text-lg font-semibold text-gray-800">Something went wrong</p>
          <p className="text-sm text-gray-500">{this.state.message}</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Page loader ───────────────────────────────────────────────────────────────
function AdminPageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )
}

// ── Sidebar content (defined at module level to avoid unmount/remount) ─────────
interface SidebarProps {
  collapsed: boolean
  onCollapse: () => void
  user: { name: string; email: string; avatar?: string } | null
  onLogout: () => void
}

function SidebarContent({ collapsed, onCollapse, user, onLogout }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overview: true, Content: true, People: true, Assessment: true,
  })

  const toggleGroup = (label: string) =>
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))

  return (
    <aside
      className={`
        flex flex-col h-full bg-[#1A1A2E] text-white transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <Flower2 className="text-orange-400 shrink-0" size={22} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-orange-400 truncate leading-tight">ISKCON Admin</p>
              <p className="text-[10px] text-gray-400 truncate">Control Panel</p>
            </div>
          </div>
        )}
        {collapsed && <Flower2 className="text-orange-400 mx-auto" size={22} />}
        <button
          onClick={onCollapse}
          className="text-gray-400 hover:text-white transition-colors shrink-0 ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-white/10">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            {/* Group label / toggle */}
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
              >
                {group.label}
                {openGroups[group.label]
                  ? <ChevronDown size={12} />
                  : <ChevronRight size={12} />
                }
              </button>
            )}

            {/* Items */}
            {(collapsed || openGroups[group.label]) && group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`
            flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400
            hover:bg-red-500/10 hover:text-red-300 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const user     = useAuthStore(s => s.user)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logoutUser() } catch { /* ignore */ }
    useAuthStore.getState().logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-[#FFFAF5] overflow-hidden">
      <SidebarContent
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-500">ISKCON Amritsar — PIHE</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
              Admin
            </span>
            {user && (
              <span className="text-sm text-gray-600 font-medium hidden sm:block">
                {user.name}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AdminErrorBoundary>
            <Suspense fallback={<AdminPageLoader />}>
              <Outlet />
            </Suspense>
          </AdminErrorBoundary>
        </div>
      </main>
    </div>
  )
}
