import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { matchesApi, newsApi, teamsApi } from '../services/api'
import type { Match, NewsPost, Team } from '../types'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type Section = 'dashboard' | 'matches' | 'news' | 'announcements'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'matches', label: 'Matches', icon: '⚽' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
]

// ── LOGIN ──────────────────────────────────────────────
function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
            ⚽
          </div>
          <h1 className="font-display text-3xl tracking-wide text-white">Panel</h1>
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
              placeholder="Enter username"
              required
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
              required
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </Card>
    </div>
  )
}

// ── DASHBOARD ──────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ matches: 0, news: 0, teams: 0 })
  const [scorers, setScorers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      matchesApi.getAll(),
      newsApi.getAll(),
      teamsApi.getAll(),
      fetch(`${import.meta.env.VITE_API_URL}/matches/top_scorers/`)
        .then((r) => r.json())
        .then((d) => Array.isArray(d) ? d : d.results || []),
    ]).then(([m, n, t, s]) => {
      setStats({ matches: m.count || 0, news: n.count || 0, teams: t.length || 0 })
      setScorers(s.slice(0, 10))
    })
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl tracking-wide">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { icon: '⚽', val: stats.matches, label: 'Matches' },
          { icon: '👥', val: stats.teams, label: 'Teams' },
          { icon: '📰', val: stats.news, label: 'Articles' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display text-3xl text-gold">{s.val}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          🥇 Top Scorers
        </h3>
        {scorers.length === 0 ? (
          <p className="text-gray-500 text-sm">No goals recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {scorers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`font-display text-lg min-w-[20px] text-center ${i === 0 ? 'text-gold' : 'text-gray-500'}`}>
                  {i + 1}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-pitch">
                  {p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.position}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center">
                    <div className="font-display text-lg text-gold">{p.goals}</div>
                    <div className="text-xs text-gray-500">G</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-lg text-gray-400">{p.assists}</div>
                    <div className="text-xs text-gray-500">A</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── MATCHES MANAGER ────────────────────────────────────
function MatchesManager() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    matchday: '',
    venue: 'Campus Ground A',
    status: 'scheduled',
    home_score: '0',
    away_score: '0',
  })

  useEffect(() => {
    Promise.all([matchesApi.getAll(), teamsApi.getAll()])
      .then(([m, t]) => { setMatches(m.results || []); setTeams(t); setLoading(false) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/matches/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          matchday: Number(form.matchday),
          home_score: Number(form.home_score),
          away_score: Number(form.away_score),
        }),
      })
      if (res.ok) {
        setMessage('✅ Match added')
        setShowForm(false)
        const updated = await matchesApi.getAll()
        setMatches(updated.results || [])
      } else {
        setMessage('❌ Failed to add match')
      }
    } catch {
      setMessage('❌ Error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Matches</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg bg-surface border border-border text-sm text-gray-300">
          {message}
        </div>
      )}

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Home Team</label>
              <select
                value={form.home_team_id}
                onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                required
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name} Y{t.year_group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Away Team</label>
              <select
                value={form.away_team_id}
                onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                required
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name} Y{t.year_group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={form.match_date}
                onChange={(e) => setForm({ ...form, match_date: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Matchday</label>
                <input
                  type="number"
                  value={form.matchday}
                  onChange={(e) => setForm({ ...form, matchday: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. 5"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="done">Finished</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Venue</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>
            {(form.status === 'live' || form.status === 'done') && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Home Score</label>
                  <input
                    type="number"
                    value={form.home_score}
                    onChange={(e) => setForm({ ...form, home_score: e.target.value })}
                    className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Away Score</label>
                  <input
                    type="number"
                    value={form.away_score}
                    onChange={(e) => setForm({ ...form, away_score: e.target.value })}
                    className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                    min="0"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Match'}
            </button>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {matches.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {m.home_team.emoji} {m.home_team.name} vs {m.away_team.name} {m.away_team.emoji}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  MD{m.matchday} · {new Date(m.match_date).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {(m.status === 'done' || m.status === 'live') && (
                  <span className="font-display text-lg text-gold">
                    {m.home_score}–{m.away_score}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  m.status === 'live' ? 'bg-red-500/15 text-red-400' :
                  m.status === 'done' ? 'bg-gray-500/15 text-gray-400' :
                  'bg-gold/10 text-gold'
                }`}>
                  {m.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
        {matches.length === 0 && (
          <p className="text-gray-500 text-center py-8">No matches yet.</p>
        )}
      </div>
    </div>
  )
}

// ── NEWS MANAGER ───────────────────────────────────────
function NewsManager() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '', tag: 'general', excerpt: '',
    content: '', emoji: '📰', bg_color: '#0D2E4B',
  })

  useEffect(() => {
    newsApi.getAll().then((data) => { setPosts(data.results || []); setLoading(false) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/news/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMessage('✅ Article published')
        setShowForm(false)
        setForm({ title: '', tag: 'general', excerpt: '', content: '', emoji: '📰', bg_color: '#0D2E4B' })
        const updated = await newsApi.getAll()
        setPosts(updated.results || [])
      } else {
        setMessage('❌ Failed to publish')
      }
    } catch {
      setMessage('❌ Error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">News</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Article'}
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg bg-surface border border-border text-sm text-gray-300">
          {message}
        </div>
      )}

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Article title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                >
                  <option value="match_report">Match Report</option>
                  <option value="announcement">Announcement</option>
                  <option value="player_spotlight">Player Spotlight</option>
                  <option value="stats">Stats</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Emoji</label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="📰"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Card Color</label>
              <input
                type="color"
                value={form.bg_color}
                onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                className="w-full h-10 bg-dark border border-border rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Short Summary</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Brief summary for card"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={5}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
                placeholder="Write the full article..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className="p-3 flex gap-3 items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: post.bg_color }}
            >
              {post.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{post.title}</div>
              <div className="text-xs text-gray-500 truncate">{post.excerpt}</div>
            </div>
            <div className="text-xs text-gray-600 flex-shrink-0">
              {new Date(post.created_at).toLocaleDateString('en-GB')}
            </div>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500 text-center py-8">No articles yet.</p>
        )}
      </div>
    </div>
  )
}

// ── ANNOUNCEMENTS ──────────────────────────────────────
function AnnouncementsManager() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', emoji: '📢', bg_color: '#1A2810',
  })

  useEffect(() => {
    newsApi.getAll().then((data) => {
      setPosts((data.results || []).filter((p) => p.tag === 'announcement'))
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/news/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tag: 'announcement' }),
      })
      if (res.ok) {
        setMessage('✅ Announcement posted')
        setShowForm(false)
        setForm({ title: '', excerpt: '', content: '', emoji: '📢', bg_color: '#1A2810' })
        const updated = await newsApi.getAll()
        setPosts((updated.results || []).filter((p) => p.tag === 'announcement'))
      } else {
        setMessage('❌ Failed to post')
      }
    } catch {
      setMessage('❌ Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Announcements</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ New'}
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg bg-surface border border-border text-sm text-gray-300">
          {message}
        </div>
      )}

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Announcement title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Emoji</label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Color</label>
                <input
                  type="color"
                  value={form.bg_color}
                  onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                  className="w-full h-10 bg-dark border border-border rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Summary</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Short summary"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Message</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
                placeholder="Full announcement details..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className="p-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: post.bg_color }}
            >
              {post.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{post.title}</div>
              <div className="text-xs text-gray-500 truncate">{post.excerpt}</div>
            </div>
            <div className="text-xs text-gray-600 flex-shrink-0">
              {new Date(post.created_at).toLocaleDateString('en-GB')}
            </div>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500 text-center py-6">No announcements yet.</p>
        )}
      </div>
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────
export default function AdminPage() {
  const { isAuthenticated, logout, user } = useAuth()
  const [section, setSection] = useState<Section>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!isAuthenticated) return <LoginScreen />

  return (
    <div className="min-h-screen bg-dark flex flex-col">

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center text-sm">⚽</div>
          <span className="font-display text-sm tracking-widest text-gold">PANEL</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">👋 {user?.username}</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 p-1"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-3 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSection(s.id as Section); setMobileMenuOpen(false) }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === s.id ? 'bg-gold/10 text-gold' : 'text-gray-400'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 mt-1"
          >
            🚪 Sign Out
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden md:flex w-56 bg-surface border-r border-border p-4 flex-col flex-shrink-0">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center">⚽</div>
            <div>
              <div className="font-display text-sm tracking-widest text-gold">ASOME CL</div>
              <div className="text-xs text-gray-600">Panel</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-3 px-2">Menu</div>
          <div className="flex-1 space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id as Section)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  section === s.id ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:bg-surface-raised hover:text-white'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <div className="border-t border-border pt-4 mt-4">
            <div className="text-xs text-gray-500 px-2 mb-3">👋 {user?.username}</div>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {section === 'dashboard' && <Dashboard />}
          {section === 'matches' && <MatchesManager />}
          {section === 'news' && <NewsManager />}
          {section === 'announcements' && <AnnouncementsManager />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-50">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSection(s.id as Section); setMobileMenuOpen(false) }}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-medium transition-colors ${
              section === s.id ? 'text-gold' : 'text-gray-500'
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  )
}