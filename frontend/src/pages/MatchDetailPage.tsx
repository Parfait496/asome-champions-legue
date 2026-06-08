import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { matchesApi } from '../services/api'
import type { Match } from '../types'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  assist: '🅰️',
  yellow_card: '🟨',
  red_card: '🟥',
  substitution: '🔄',
  own_goal: '⚽',
}

export default function MatchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    matchesApi.getOne(Number(id))
      .then((data) => { setMatch(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!match) return (
    <div className="text-center py-20 text-gray-500">Match not found.</div>
  )

  const hasScore = match.status === 'done' || match.status === 'live'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 text-sm"
      >
        ← Back to Matches
      </button>

      {/* Match Hero */}
      <div className="relative bg-pitch rounded-2xl p-8 mb-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #4CAF50 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-5xl mb-2">{match.home_team.emoji}</div>
              <div className="font-display text-xl tracking-wide">{match.home_team.name}</div>
              <div className="text-xs text-gray-400">Year {match.home_team.year_group}</div>
            </div>
            <div className="text-center">
              {hasScore ? (
                <div className="font-display text-7xl leading-none">
                  {match.home_score} – {match.away_score}
                </div>
              ) : (
                <div className="font-display text-4xl text-gray-400">vs</div>
              )}
              <div className="mt-2">
                {match.status === 'live' ? (
                  <Badge variant="live">● LIVE {match.minute && `· ${match.minute}'`}</Badge>
                ) : match.status === 'done' ? (
                  <Badge variant="done">Full Time</Badge>
                ) : (
                  <Badge variant="upcoming">
                    {new Date(match.match_date).toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{match.away_team.emoji}</div>
              <div className="font-display text-xl tracking-wide">{match.away_team.name}</div>
              <div className="text-xs text-gray-400">Year {match.away_team.year_group}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">📍 {match.venue}</div>
        </div>
      </div>

      {/* Events */}
      {match.events.length > 0 && (
        <Card className="p-5 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Match Events
          </h3>
          <div className="space-y-3">
            {match.events.map((e) => (
              <div key={e.id} className="flex items-center gap-3 text-sm">
                <span className="text-gold font-semibold min-w-[36px] text-right">{e.minute}'</span>
                <span className="text-lg">{EVENT_ICONS[e.event_type]}</span>
                <div>
                  <span className="font-medium">{e.player_name}</span>
                  <span className="text-gray-500 text-xs ml-2">{e.team_name}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Match Info */}
      <Card className="p-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Match Info
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Date & Time</div>
            <div>{new Date(match.match_date).toLocaleString('en-GB')}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Venue</div>
            <div>{match.venue}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Matchday</div>
            <div>Matchday {match.matchday}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Status</div>
            <div className="capitalize">{match.status}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}