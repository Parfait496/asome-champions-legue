import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'

const SECTIONS = ['Dashboard', 'Matches', 'Teams', 'Players', 'News', 'Media']

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [section, setSection] = useState('Dashboard')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      setError('')
    } catch {
      setError('Invalid username or password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4">
              ⚙
            </div>
            <h1 className="font-display text-3xl tracking-wide">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">ASOME Champions League</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors"
            >
              Sign In
            </button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-52 bg-surface border-r border-border p-4 flex-shrink-0">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 px-2">Management</div>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
              section === s
                ? 'bg-gold/10 text-gold'
                : 'text-gray-400 hover:bg-surface-raised hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 mt-4 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl tracking-wide">{section}</h1>
          <button className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
            + Add New
          </button>
        </div>

        {section === 'Dashboard' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '🏟️', val: '9', label: 'Matches Played' },
                { icon: '⚽', val: '18', label: 'Total Goals' },
                { icon: '👥', val: '31', label: 'Registered Players' },
                { icon: '📰', val: '5', label: 'News Articles' },
              ].map((s) => (
                <Card key={s.label} className="p-4">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-display text-3xl text-gold">{s.val}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </Card>
              ))}
            </div>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Quick Actions
              </h3>
              <p className="text-gray-500 text-sm">
                Use the sidebar to manage matches, teams, players, news and media.
                All data updates immediately via the REST API.
              </p>
            </Card>
          </div>
        )}

        {section !== 'Dashboard' && (
          <Card className="p-6">
            <p className="text-gray-500 text-sm">
              {section} management panel. Connect this to the API endpoints at{' '}
              <code className="text-gold text-xs bg-dark px-1.5 py-0.5 rounded">
                /api/{section.toLowerCase()}/
              </code>{' '}
              to add full CRUD functionality.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}