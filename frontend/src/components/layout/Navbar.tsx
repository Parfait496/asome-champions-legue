import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/matches', label: 'Matches' },
  { to: '/teams', label: 'Teams' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/submit', label: 'Feedback' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-dark font-display text-lg">
            ⚽
          </div>
          <span className="font-display text-xl tracking-widest text-gold">
            ASOME CL
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? 'text-gold bg-gold/10'
                  : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                👋 {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-400 border border-border rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-all duration-200"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === l.to ? 'text-gold bg-gold/10' : 'text-gray-400'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setOpen(false) }}
              className="mt-2 px-4 py-2.5 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg text-center"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2.5 bg-gold text-dark text-sm font-bold rounded-lg text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}