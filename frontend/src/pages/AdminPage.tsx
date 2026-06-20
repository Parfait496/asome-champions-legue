import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { matchesApi, newsApi, teamsApi } from '../services/api'
import type { Match, NewsPost, Team, Player } from '../types'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type Section = 'dashboard' | 'matches' | 'teams' | 'players' | 'news' | 'announcements' | 'gallery'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'matches', label: 'Matches', icon: '⚽' },
  { id: 'teams', label: 'Teams', icon: '🏆' },
  { id: 'players', label: 'Players', icon: '👤' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'gallery', label: 'Gallery', icon: '📸' },
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
          <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">⚽</div>
          <h1 className="font-display text-3xl tracking-wide text-white">Panel</h1>
          <p className="text-gray-500 text-sm mt-1">ASOME Champions League</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              placeholder="Enter username" required />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              placeholder="••••••••" required />
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </Card>
    </div>
  )
}

// ── HELPERS ────────────────────────────────────────────
function apiCall(method: string, url: string, body?: any) {
  const token = localStorage.getItem('access_token')
  const sep = url.includes('?') ? '&' : '?'
  return fetch(`${import.meta.env.VITE_API_URL}${url}${sep}_t=${Date.now()}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

function freshFetch(path: string) {
  const sep = path.includes('?') ? '&' : '?'
  return fetch(`${import.meta.env.VITE_API_URL}${path}${sep}_t=${Date.now()}`)
}

function Message({ text }: { text: string }) {
  if (!text) return null
  return (
    <div className={`px-4 py-3 rounded-lg border text-sm mb-4 ${
      text.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>{text}</div>
  )
}

// ── DASHBOARD ──────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ matches: 0, news: 0, teams: 0, players: 0 })
  const [scorers, setScorers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      matchesApi.getAll(),
      newsApi.getAll(),
      teamsApi.getAll(),
      freshFetch('/players/').then(r => r.json()),
      freshFetch('/matches/top_scorers/').then(r => r.json()),
    ]).then(([m, n, t, p, s]) => {
      setStats({
        matches: m.count || 0,
        news: n.count || 0,
        teams: t.length || 0,
        players: Array.isArray(p) ? p.length : p.count || 0,
      })
      setScorers((Array.isArray(s) ? s : s.results || []).slice(0, 8))
    })
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl tracking-wide">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '⚽', val: stats.matches, label: 'Matches' },
          { icon: '👥', val: stats.teams, label: 'Teams' },
          { icon: '👤', val: stats.players, label: 'Players' },
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
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">🥇 Top Scorers</h3>
        {scorers.length === 0 ? <p className="text-gray-500 text-sm">No goals yet.</p> : (
          <div className="space-y-3">
            {scorers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`font-display text-lg min-w-[20px] text-center ${i === 0 ? 'text-gold' : 'text-gray-500'}`}>{i + 1}</div>
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0 bg-pitch">
                  {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" /> : p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.position}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center"><div className="font-display text-lg text-gold">{p.goals}</div><div className="text-xs text-gray-500">G</div></div>
                  <div className="text-center"><div className="font-display text-lg text-gray-400">{p.assists}</div><div className="text-xs text-gray-500">A</div></div>
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
  const [editing, setEditing] = useState<Match | null>(null)
  const [form, setForm] = useState({
    home_team_id: '', away_team_id: '',
    home_placeholder: '', away_placeholder: '',
    match_date: '', matchday: '', venue: 'Campus Ground A', status: 'scheduled',
    home_score: '0', away_score: '0',
  })

  const load = () => Promise.all([matchesApi.getAll(), teamsApi.getAll()])
    .then(([m, t]) => { setMatches(m.results || []); setTeams(t); setLoading(false) })

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({
      home_team_id: '', away_team_id: '',
      home_placeholder: '', away_placeholder: '',
      match_date: '', matchday: '', venue: 'Campus Ground A', status: 'scheduled',
      home_score: '0', away_score: '0',
    })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (m: Match) => {
    setEditing(m)
    setForm({
      home_team_id: m.home_team ? String(m.home_team.id) : '',
      away_team_id: m.away_team ? String(m.away_team.id) : '',
      home_placeholder: m.home_placeholder || '',
      away_placeholder: m.away_placeholder || '',
      match_date: m.match_date.slice(0, 16),
      matchday: String(m.matchday),
      venue: m.venue,
      status: m.status,
      home_score: String(m.home_score),
      away_score: String(m.away_score),
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this match?')) return
    const res = await apiCall('DELETE', `/matches/${id}/`)
    if (res.ok) { setMessage('✅ Match deleted'); load() }
    else setMessage('❌ Failed to delete')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body: any = {
      match_date: form.match_date,
      matchday: Number(form.matchday),
      venue: form.venue,
      status: form.status,
      home_score: Number(form.home_score),
      away_score: Number(form.away_score),
      home_placeholder: form.home_placeholder,
      away_placeholder: form.away_placeholder,
    }
    if (form.home_team_id) body.home_team_id = Number(form.home_team_id)
    if (form.away_team_id) body.away_team_id = Number(form.away_team_id)

    const res = editing
      ? await apiCall('PATCH', `/matches/${editing.id}/`, body)
      : await apiCall('POST', '/matches/', body)

    if (res.ok) {
      setMessage(editing ? '✅ Match updated' : '✅ Match added')
      resetForm(); load()
    } else {
      const errData = await res.json().catch(() => ({}))
      setMessage(`❌ Failed: ${JSON.stringify(errData)}`)
    }
    setSaving(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Matches</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      <Message text={message} />

      {showForm && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {editing ? 'Edit Match' : 'New Match'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                Home Team (leave empty if not decided yet)
              </label>
              <select
                value={form.home_team_id}
                onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              >
                <option value="">— To Be Decided —</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name} Y{t.year_group}</option>
                ))}
              </select>
            </div>

            {!form.home_team_id && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Home Placeholder Text
                </label>
                <input
                  type="text"
                  value={form.home_placeholder}
                  onChange={(e) => setForm({ ...form, home_placeholder: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. Winner of QF1"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                Away Team (leave empty if not decided yet)
              </label>
              <select
                value={form.away_team_id}
                onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              >
                <option value="">— To Be Decided —</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name} Y{t.year_group}</option>
                ))}
              </select>
            </div>

            {!form.away_team_id && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Away Placeholder Text
                </label>
                <input
                  type="text"
                  value={form.away_placeholder}
                  onChange={(e) => setForm({ ...form, away_placeholder: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. Winner of QF2"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Date & Time</label>
                <input type="datetime-local" value={form.match_date}
                  onChange={(e) => setForm({ ...form, match_date: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Matchday</label>
                <input type="number" value={form.matchday}
                  onChange={(e) => setForm({ ...form, matchday: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Venue</label>
                <input type="text" value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="done">Finished</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>
            </div>

            {(form.status === 'live' || form.status === 'done') && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Home Score</label>
                  <input type="number" value={form.home_score}
                    onChange={(e) => setForm({ ...form, home_score: e.target.value })}
                    className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" min="0" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Away Score</label>
                  <input type="number" value={form.away_score}
                    onChange={(e) => setForm({ ...form, away_score: e.target.value })}
                    className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" min="0" />
                </div>
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Match' : 'Save Match'}
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
                  {m.home_team ? `${m.home_team.emoji} ${m.home_team.name}` : `🔲 ${m.home_placeholder || 'TBD'}`}
                  {' vs '}
                  {m.away_team ? `${m.away_team.name} ${m.away_team.emoji}` : `${m.away_placeholder || 'TBD'} 🔲`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  MD{m.matchday} · {new Date(m.match_date).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {(m.status === 'done' || m.status === 'live') && (
                  <span className="font-display text-lg text-gold">{m.home_score}–{m.away_score}</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  m.status === 'live' ? 'bg-red-500/15 text-red-400' :
                  m.status === 'done' ? 'bg-gray-500/15 text-gray-400' : 'bg-gold/10 text-gold'
                }`}>{m.status}</span>
                <button onClick={() => handleEdit(m)}
                  className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(m.id)}
                  className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors">
                  Del
                </button>
              </div>
            </div>
          </Card>
        ))}
        {matches.length === 0 && <p className="text-gray-500 text-center py-8">No matches yet.</p>}
      </div>
    </div>
  )
}

// ── TEAMS MANAGER (elimination toggle) ─────────────────
function TeamsManager() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = () => teamsApi.getAll().then((t) => { setTeams(t); setLoading(false) })
  useEffect(() => { load() }, [])

  const toggleEliminated = async (team: Team) => {
    const res = await apiCall('PATCH', `/teams/${team.id}/`, {
      is_eliminated: !team.is_eliminated,
    })
    if (res.ok) { setMessage('✅ Updated'); load() }
    else setMessage('❌ Failed')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl tracking-wide">Teams — Knockout Status</h2>
      <Message text={message} />
      <p className="text-xs text-gray-500">Mark a team as eliminated once they're knocked out of the tournament. Eliminated teams show in red at the bottom of standings.</p>
      <div className="space-y-2">
        {teams.map((t) => (
          <Card key={t.id} className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: t.bg_color }}>
              {t.emoji}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${t.is_eliminated ? 'text-red-400 line-through' : ''}`}>
                {t.name} Y{t.year_group}
              </div>
              <div className="text-xs text-gray-500">{t.stats.points} pts</div>
            </div>
            <button
              onClick={() => toggleEliminated(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                t.is_eliminated
                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
              }`}
            >
              {t.is_eliminated ? 'Restore' : 'Eliminate'}
            </button>
          </Card>
        ))}
        {teams.length === 0 && <p className="text-gray-500 text-center py-8">No teams yet.</p>}
      </div>
    </div>
  )
}

// ── PLAYERS MANAGER ────────────────────────────────────
function PlayersManager() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<Player | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '', jersey_number: '', position: 'FWD',
    team: '', is_captain: false,
  })

  const load = () => Promise.all([
    freshFetch('/players/').then(r => r.json()),
    teamsApi.getAll(),
  ]).then(([p, t]) => {
    setPlayers(Array.isArray(p) ? p : p.results || [])
    setTeams(t)
    setLoading(false)
  })

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ name: '', jersey_number: '', position: 'FWD', team: '', is_captain: false })
    setEditing(null)
    setPhotoFile(null)
    setShowForm(false)
  }

  const handleEdit = (p: Player) => {
    setEditing(p)
    const teamId = typeof p.team === 'object' ? p.team?.id : p.team
    setForm({
      name: p.name,
      jersey_number: String(p.jersey_number || ''),
      position: p.position,
      team: String(teamId || ''),
      is_captain: p.is_captain,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this player?')) return
    const res = await apiCall('DELETE', `/players/${id}/`)
    if (res.ok) { setMessage('✅ Player deleted'); load() }
    else setMessage('❌ Failed to delete')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('access_token')
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('jersey_number', form.jersey_number)
    formData.append('position', form.position)
    formData.append('team', form.team)
    formData.append('is_captain', String(form.is_captain))
    if (photoFile) formData.append('photo', photoFile)

    const url = editing ? `/players/${editing.id}/` : '/players/'
    const method = editing ? 'PATCH' : 'POST'

    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (res.ok) {
      setMessage(editing ? '✅ Player updated' : '✅ Player added')
      resetForm(); load()
    } else {
      const errData = await res.json().catch(() => ({}))
      setMessage(`❌ Failed: ${JSON.stringify(errData)}`)
    }
    setSaving(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Players</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>
      <Message text={message} />
      {showForm && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {editing ? 'Edit Player' : 'New Player'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="Player name" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Jersey #</label>
                <input type="number" value={form.jersey_number} onChange={(e) => setForm({ ...form, jersey_number: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. 10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Position</label>
                <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="GK">Goalkeeper</option>
                  <option value="DEF">Defender</option>
                  <option value="MID">Midfielder</option>
                  <option value="FWD">Forward</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Team</label>
                <select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" required>
                  <option value="">Select team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name} Y{t.year_group}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_captain}
                  onChange={(e) => setForm({ ...form, is_captain: e.target.checked })}
                  className="w-4 h-4 accent-gold" />
                <span className="text-sm text-gray-300">Team Captain</span>
              </label>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Player Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-gold transition-colors"
              >
                {photoFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <img src={URL.createObjectURL(photoFile)} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm text-gray-300">{photoFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl mb-1">📷</div>
                    <div className="text-xs text-gray-500">Click to upload photo</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Player' : 'Add Player'}
            </button>
          </form>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {players.map((p) => (
          <Card key={p.id} className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0 bg-pitch border border-border">
              {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" alt={p.name} /> : p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold flex items-center gap-1">
                {p.name} {p.is_captain && <span className="text-xs text-gold">©</span>}
              </div>
              <div className="text-xs text-gray-500">{p.position}</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => handleEdit(p)}
                className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)}
                className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors">
                Del
              </button>
            </div>
          </Card>
        ))}
        {players.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">No players yet.</p>}
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
  const [editing, setEditing] = useState<NewsPost | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '', tag: 'general', excerpt: '',
    content: '', emoji: '📰', bg_color: '#0D2E4B',
  })

  const load = () => newsApi.getAll().then((data) => { setPosts(data.results || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ title: '', tag: 'general', excerpt: '', content: '', emoji: '📰', bg_color: '#0D2E4B' })
    setEditing(null)
    setCoverFile(null)
    setShowForm(false)
  }

  const handleEdit = (post: NewsPost) => {
    setEditing(post)
    setForm({
      title: post.title, tag: post.tag, excerpt: post.excerpt,
      content: post.content, emoji: post.emoji, bg_color: post.bg_color,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this article?')) return
    const res = await apiCall('DELETE', `/news/${id}/`)
    if (res.ok) { setMessage('✅ Article deleted'); load() }
    else setMessage('❌ Failed to delete')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('access_token')
      let res: Response

      if (coverFile) {
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('tag', form.tag)
        formData.append('excerpt', form.excerpt)
        formData.append('content', form.content)
        formData.append('emoji', form.emoji)
        formData.append('bg_color', form.bg_color)
        formData.append('cover_image', coverFile)

        const url = editing ? `/news/${editing.id}/` : '/news/'
        const method = editing ? 'PATCH' : 'POST'
        res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
      } else {
        res = editing
          ? await apiCall('PATCH', `/news/${editing.id}/`, form)
          : await apiCall('POST', '/news/', form)
      }

      if (res.ok) {
        setMessage(editing ? '✅ Article updated' : '✅ Article published')
        resetForm()
        load()
      } else {
        const errData = await res.json().catch(() => ({}))
        setMessage(`❌ Failed: ${JSON.stringify(errData)}`)
      }
    } catch {
      setMessage('❌ Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">News</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
          {showForm ? '✕ Cancel' : '+ Article'}
        </button>
      </div>
      <Message text={message} />
      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Article title" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Tag</label>
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="match_report">Match Report</option>
                  <option value="player_spotlight">Player Spotlight</option>
                  <option value="stats">Stats</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Emoji</label>
                <input type="text" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Card Color (used if no cover image)</label>
              <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                className="w-full h-10 bg-dark border border-border rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Cover Image (optional)</label>
              <div
                onClick={() => coverRef.current?.click()}
                className="border border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-gold transition-colors"
              >
                {coverFile ? (
                  <div className="flex items-center gap-2 justify-center">
                    <img src={URL.createObjectURL(coverFile)} className="w-10 h-10 rounded object-cover" />
                    <span className="text-xs text-gray-300">{coverFile.name}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">📷 Click to add cover image</div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Excerpt</label>
              <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Short summary for card" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
                placeholder="Write the full article..." required />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Article' : 'Publish'}
            </button>
          </form>
        </Card>
      )}
      <div className="space-y-2">
        {posts.filter(p => p.tag !== 'announcement').map((post) => (
          <Card key={post.id} className="p-3 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden" style={{ background: post.bg_color }}>
              {post.cover_image_url ? <img src={post.cover_image_url} className="w-full h-full object-cover" /> : post.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{post.title}</div>
              <div className="text-xs text-gray-500 truncate">{post.excerpt}</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => handleEdit(post)}
                className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20">Edit</button>
              <button onClick={() => handleDelete(post.id)}
                className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
            </div>
          </Card>
        ))}
        {posts.filter(p => p.tag !== 'announcement').length === 0 && (
          <p className="text-gray-500 text-center py-8">No articles yet.</p>
        )}
      </div>
    </div>
  )
}

// ── ANNOUNCEMENTS MANAGER ──────────────────────────────
function AnnouncementsManager() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<NewsPost | null>(null)
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', emoji: '📢',
    bg_color: '#1A2810', author_title: 'Tournament Committee',
  })

  const load = () => newsApi.getAll().then((data) => {
    setPosts((data.results || []).filter((p) => p.tag === 'announcement'))
  })
  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', emoji: '📢', bg_color: '#1A2810', author_title: 'Tournament Committee' })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (post: NewsPost) => {
    setEditing(post)
    setForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      emoji: post.emoji, bg_color: post.bg_color,
      author_title: post.author_title || 'Tournament Committee',
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return
    const res = await apiCall('DELETE', `/news/${id}/`)
    if (res.ok) { setMessage('✅ Announcement deleted'); load() }
    else setMessage('❌ Failed to delete')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, tag: 'announcement' }
    const res = editing
      ? await apiCall('PATCH', `/news/${editing.id}/`, body)
      : await apiCall('POST', '/news/', body)
    if (res.ok) {
      setMessage(editing ? '✅ Updated' : '✅ Announcement posted')
      resetForm(); load()
    } else {
      const errData = await res.json().catch(() => ({}))
      setMessage(`❌ Failed: ${JSON.stringify(errData)}`)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Announcements</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
          {showForm ? '✕ Cancel' : '+ New'}
        </button>
      </div>
      <Message text={message} />
      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Announcement title" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Emoji</label>
                <input type="text" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Color</label>
                <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                  className="w-full h-10 bg-dark border border-border rounded-lg cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Sender Title</label>
              <input type="text" value={form.author_title} onChange={(e) => setForm({ ...form, author_title: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="e.g. Minister of Sports, Tournament Director" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Summary</label>
              <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Short summary" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Message</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
                placeholder="Full announcement..." required />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {saving ? 'Posting...' : editing ? 'Update' : 'Post Announcement'}
            </button>
          </form>
        </Card>
      )}
      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: post.bg_color }}>
              {post.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{post.title}</div>
              <div className="text-xs text-gray-500 truncate">{post.excerpt}</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => handleEdit(post)}
                className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20">Edit</button>
              <button onClick={() => handleDelete(post.id)}
                className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
            </div>
          </Card>
        ))}
        {posts.length === 0 && <p className="text-gray-500 text-center py-6">No announcements yet.</p>}
      </div>
    </div>
  )
}

// ── GALLERY MANAGER ────────────────────────────────────
function GalleryManager() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ caption: '', matchday: '', media_type: 'photo' })

  const load = () => freshFetch('/media/').then(r => r.json())
    .then(d => { setItems(Array.isArray(d) ? d : d.results || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this media?')) return
    const res = await apiCall('DELETE', `/media/${id}/`)
    if (res.ok) { setMessage('✅ Deleted'); load() }
    else setMessage('❌ Failed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setMessage('❌ Please select a file'); return }
    setSaving(true)
    const token = localStorage.getItem('access_token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('caption', form.caption)
    formData.append('media_type', form.media_type)
    if (form.matchday) formData.append('matchday', form.matchday)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/media/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (res.ok) {
      setMessage('✅ Uploaded')
      setFile(null); setForm({ caption: '', matchday: '', media_type: 'photo' })
      setShowForm(false); load()
    } else setMessage('❌ Upload failed')
    setSaving(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">Gallery</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gold text-dark text-sm font-bold rounded-lg hover:bg-gold-dark transition-colors">
          {showForm ? '✕ Cancel' : '+ Upload'}
        </button>
      </div>
      <Message text={message} />
      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-gold transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  {file.type.startsWith('image/') && (
                    <img src={URL.createObjectURL(file)} className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <span className="text-sm text-gray-300">{file.name}</span>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">📁</div>
                  <div className="text-sm text-gray-400">Click to select photo or video</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Type</label>
                <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Matchday</label>
                <input type="number" value={form.matchday} onChange={(e) => setForm({ ...form, matchday: e.target.value })}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. 3" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Caption</label>
              <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Describe this photo/video" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {saving ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </Card>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden bg-surface border border-border aspect-square">
            {item.media_type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center text-4xl">🎥</div>
            ) : (
              <img src={item.thumbnail_url || item.file_url} alt={item.caption} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-white text-center px-2">{item.caption}</p>
              <button onClick={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-500/80 text-white text-xs rounded-lg">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <div className="text-4xl mb-3">📸</div>
            <p className="text-gray-500 text-sm">No media uploaded yet.</p>
          </div>
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
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center text-sm">⚽</div>
          <span className="font-display text-sm tracking-widest text-gold">PANEL</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">👋 {user?.username}</span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 p-1">
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-3 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => { setSection(s.id as Section); setMobileMenuOpen(false) }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === s.id ? 'bg-gold/10 text-gold' : 'text-gray-400'
              }`}>
              {s.icon} {s.label}
            </button>
          ))}
          <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 mt-1">
            🚪 Sign Out
          </button>
        </div>
      )}

      <div className="flex flex-1">
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
              <button key={s.id} onClick={() => setSection(s.id as Section)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  section === s.id ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:bg-surface-raised hover:text-white'
                }`}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <div className="border-t border-border pt-4 mt-4">
            <div className="text-xs text-gray-500 px-2 mb-3">👋 {user?.username}</div>
            <button onClick={logout}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              🚪 Sign Out
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {section === 'dashboard' && <Dashboard />}
          {section === 'matches' && <MatchesManager />}
          {section === 'teams' && <TeamsManager />}
          {section === 'players' && <PlayersManager />}
          {section === 'news' && <NewsManager />}
          {section === 'announcements' && <AnnouncementsManager />}
          {section === 'gallery' && <GalleryManager />}
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-50 overflow-x-auto">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => { setSection(s.id as Section); setMobileMenuOpen(false) }}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors min-w-[60px] ${
              section === s.id ? 'text-gold' : 'text-gray-500'
            }`}>
            <span className="text-base">{s.icon}</span>
            <span className="text-[10px]">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="md:hidden h-16" />
    </div>
  )
}