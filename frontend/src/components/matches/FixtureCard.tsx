import { useNavigate } from 'react-router-dom'
import type { Match } from '../../types'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

export default function FixtureCard({ match }: { match: Match }) {
  const navigate = useNavigate()
  const isLive = match.status === 'live'
  const isDone = match.status === 'done'
  const hasScore = isLive || isDone

  const homeGoals = match.events?.filter(
    (e) => (e.event_type === 'goal' || e.event_type === 'own_goal') &&
    e.team_name === match.home_team.name
  ) || []

  const awayGoals = match.events?.filter(
    (e) => (e.event_type === 'goal' || e.event_type === 'own_goal') &&
    e.team_name === match.away_team.name
  ) || []

  return (
    <Card hover onClick={() => navigate(`/matches/${match.id}`)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
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
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="text-sm font-semibold">
              {match.home_team.emoji} {match.home_team.name}
            </div>
            <div className="text-xs text-gray-500">Year {match.home_team.year_group}</div>
          </div>
          <div className="text-center min-w-[56px]">
            {hasScore ? (
              <>
                <div className="font-display text-2xl text-white">
                  {match.home_score} – {match.away_score}
                </div>
                {isLive && match.minute && (
                  <div className="text-xs text-accent">{match.minute}'</div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-sm font-medium">vs</div>
            )}
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-semibold">
              {match.away_team.name} {match.away_team.emoji}
            </div>
            <div className="text-xs text-gray-500">Year {match.away_team.year_group}</div>
          </div>
        </div>

        {/* Penalty winner */}
        {match.penalty_winner && (
          <div className="text-xs text-center text-gold mb-2 font-medium">
            🏆 {match.penalty_winner.name} won on penalties
          </div>
        )}

        {/* Goal scorers */}
        {hasScore && (homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="flex gap-2 text-xs text-gray-500 mb-3">
            <div className="flex-1 space-y-0.5">
              {homeGoals.map((e, i) => (
                <div key={i} className="truncate">
                  ⚽ {e.player_name} {e.minute}'
                </div>
              ))}
            </div>
            <div className="flex-1 text-right space-y-0.5">
              {awayGoals.map((e, i) => (
                <div key={i} className="truncate">
                  {e.player_name} {e.minute}' ⚽
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center gap-2">
          <span className="text-xs text-gray-500">📍 {match.venue}</span>
        </div>
      </div>
    </Card>
  )
}