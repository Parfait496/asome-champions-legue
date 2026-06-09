import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { teamsApi } from '../services/api'
import type { Team } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'

const POSITIONS: Record<string, string> = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  FWD: 'Forward',
}

const POSITION_COLOR: Record<string, string> = {
  GK: 'text-yellow-400 bg-yellow-400/10',
  DEF: 'text-blue-400 bg-blue-400/10',
  MID: 'text-green-400 bg-green-400/10',
  FWD: 'text-red-400 bg-red-400/10',
}

export default function TeamDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    teamsApi.getOne(Number(id))
      .then((data) => { setTeam(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Loading team..." />
  if (!team) return (
    <div className="text-center py-20 text-gray-500">Team not found.</div>
  )

  const grouped = {
    GK: team.players?.filter((p) => p.position === 'GK') || [],
    DEF: team.players?.filter((p) => p.position === 'DEF') || [],
    MID: team.players?.filter((p) => p.position === 'MID') || [],
    FWD: team.players?.filter((p) => p.position === 'FWD') || [],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate('/teams')}
        className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 text-sm"
      >
        ← Back to Teams
      </button>

      {/* Team Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: team.bg_color }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="relative flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-5xl border-4 flex-shrink-0"
            style={{ borderColor: team.color + '60' }}
          >
            {team.emoji}
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Year {team.year_group}
            </div>
            <h1 className="font-display text-4xl tracking-wide text-white mb-3">
              {team.name}
            </h1>
            <div className="flex gap-6">
              {[
                { val: team.stats.played, label: 'Played' },
                { val: team.stats.wins, label: 'Won' },
                { val: team.stats.draws, label: 'Drawn' },
                { val: team.stats.losses, label: 'Lost' },
                { val: team.stats.points, label: 'Points' },
                { val: `${team.stats.gf}:${team.stats.ga}`, label: 'Goals' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-2xl text-gold">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Players by position */}
      {Object.entries(grouped).map(([pos, players]) => {
        if (players.length === 0) return null
        return (
          <div key={pos} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${POSITION_COLOR[pos]}`}>
                {POSITIONS[pos]}
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-gray-600">{players.length} players</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {players.map((player) => (
                <Card key={player.id} className="p-4 text-center">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold"
                    style={{ background: team.bg_color, border: `2px solid ${team.color}40` }}
                  >
                    {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  {/* Captain badge */}
                  {player.is_captain && (
                    <div className="text-xs text-gold font-semibold mb-1">© Captain</div>
                  )}

                  {/* Name */}
                  <div className="text-sm font-semibold mb-0.5">{player.name}</div>

                  {/* Jersey */}
                  {player.jersey_number && (
                    <div className="text-xs text-gray-500 mb-3">
                      #{player.jersey_number}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-center gap-4 border-t border-border pt-3">
                    <div className="text-center">
                      <div className="font-display text-lg text-gold">{player.goals}</div>
                      <div className="text-xs text-gray-500">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="font-display text-lg text-gray-400">{player.assists}</div>
                      <div className="text-xs text-gray-500">Assists</div>
                    </div>
                    {(player.yellow_cards > 0 || player.red_cards > 0) && (
                      <div className="text-center">
                        <div className="font-display text-lg text-yellow-400">
                          {player.yellow_cards}
                          {player.red_cards > 0 && (
                            <span className="text-red-400 ml-1">{player.red_cards}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Cards</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Empty state */}
      {team.players?.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500">No players registered yet.</p>
          <p className="text-gray-600 text-xs mt-1">
            Adding players in progress...
          </p>
        </Card>
      )}
    </div>
  )
}