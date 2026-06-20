import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/matches', label: 'Matches' },
  { to: '/teams', label: 'Teams' },
  { to: '/news', label: 'News' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/submit', label: 'Feedback' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, setTheme, themes } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-dark font-display text-lg">
            ⚽
          </div>
          <span className="font-display text-xl tracking-widest text-gold">
            ASOME CL
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? 'text-gold bg-gold/10'
                  : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Theme switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-gold/30 transition-all"
            >
              🎨
            </button>
            {themeOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeOpen(false)}
                />
                <div className="absolute right-0 top-12 bg-surface border border-border rounded-xl p-2 w-44 z-50">
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => { setTheme(key as any); setThemeOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        theme === key ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:bg-surface-raised'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.accent }} />
                      {t.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">👋 {user?.username}</span>
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

          <div className="px-4 py-2.5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Theme</div>
            <div className="flex gap-2">
              {Object.entries(themes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as any)}
                  className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                    theme === key ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ background: t.accent }}
                />
              ))}
            </div>
          </div>

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