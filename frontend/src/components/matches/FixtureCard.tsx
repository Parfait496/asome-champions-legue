import { useNavigate } from 'react-router-dom'
import type { Match } from '../../types'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

export default function FixtureCard({ match }: { match: Match }) {
  const navigate = useNavigate()
  const isLive = match.status === 'live'
  const isDone = match.status === 'done'
  const hasScore = isLive || isDone

  return (
    <Card hover onClick={() => navigate(`/matches/${match.id}`)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Matchday {match.matchday}
          </span>
          {isLive ? (
            <Badge variant="live">● LIVE</Badge>
          ) : isDone ? (
            <Badge variant="done">FT</Badge>
          ) : (
            <Badge variant="upcoming">
              {new Date(match.match_date).toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'short',
              })}
            </Badge>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold">{match.home_team.emoji} {match.home_team.name}</div>
            <div className="text-xs text-gray-500">Year {match.home_team.year_group}</div>
          </div>
          <div className="text-center min-w-[60px]">
            {hasScore ? (
              <div className="font-display text-2xl text-white">
                {match.home_score} – {match.away_score}
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-medium">vs</div>
            )}
            {isLive && match.minute && (
              <div className="text-xs text-accent">{match.minute}'</div>
            )}
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-semibold">{match.away_team.name} {match.away_team.emoji}</div>
            <div className="text-xs text-gray-500">Year {match.away_team.year_group}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
          <span className="text-xs text-gray-500">📍</span>
          <span className="text-xs text-gray-500">{match.venue}</span>
        </div>
      </div>
    </Card>
  )
}