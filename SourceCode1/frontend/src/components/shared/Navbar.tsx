import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/utils/constants'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow">
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-[#E8720C] rounded-full flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              ISKCON<br />COURSE PORTAL
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-semibold transition-colors ${
                  pathname === to
                    ? 'text-[#E8720C] border-b-2 border-[#E8720C] pb-0.5'
                    : 'text-gray-600 hover:text-[#E8720C]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Register</Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 px-3 rounded-lg text-sm font-semibold ${
                pathname === to ? 'bg-orange-50 text-[#E8720C]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">Login</Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">Register</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
