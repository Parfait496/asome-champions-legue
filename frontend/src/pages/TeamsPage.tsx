import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { teamsApi, playersApi } from '../services/api'
import type { Team, Player } from '../types'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'

const POSITIONS: Record<string, string> = {
  GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward',
}

export default function TeamsPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([teamsApi.getAll(), playersApi.getAll()])
      .then(([t, p]) => { setTeams(t); setPlayers(p); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading teams..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="The" highlight="Teams" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {teams.map((team) => (
          <Card
            key={team.id}
            hover
            onClick={() => navigate(`/teams/${team.id}`)}
            className="p-4 text-center"
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl border-2"
              style={{ background: team.bg_color, borderColor: team.color + '40' }}
            >
              {team.emoji}
            </div>
            <div className="font-semibold text-sm">{team.name}</div>
            <div className="text-xs text-gray-500 mb-3">{team.year_group === 1 ? 'Year 1' : `Year ${team.year_group}`}</div>
            <div className="flex justify-center gap-3">
              <div className="text-center">
                <div className="font-display text-xl text-gold">{team.stats.points}</div>
                <div className="text-xs text-gray-500">Pts</div>
              </div>
              <div className="text-center">
                <div className="font-display text-xl text-gold">{team.stats.wins}</div>
                <div className="text-xs text-gray-500">W</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader title="Player" highlight="Roster" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {players.map((p) => (
          <Card key={p.id} hover className="p-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold"
              style={{ background: '#0D2E4B' }}
            >
              {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            {p.is_captain && (
              <div className="text-xs text-gold mb-1">© Captain</div>
            )}
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="text-xs text-gray-500 mb-3">{POSITIONS[p.position]}</div>
            <div className="flex justify-center gap-3">
              <div>
                <div className="font-display text-lg text-gold">{p.goals}</div>
                <div className="text-xs text-gray-500">G</div>
              </div>
              <div>
                <div className="font-display text-lg text-gold">{p.assists}</div>
                <div className="text-xs text-gray-500">A</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}