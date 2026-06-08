import type { Match } from '../../types'
import { useNavigate } from 'react-router-dom'

export default function LiveMatchCard({ match }: { match: Match }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/matches/${match.id}`)}
      className="bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-gold/30 transition-all duration-200 w-72"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">Matchday {match.matchday}</span>
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
          ● LIVE
        </span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 border-2"
            style={{ background: match.home_team.bg_color, borderColor: match.home_team.color + '40' }}
          >
            {match.home_team.emoji}
          </div>
          <div className="text-xs font-semibold text-gray-300">{match.home_team.name}</div>
          <div className="text-xs text-gray-500">Y{match.home_team.year_group}</div>
        </div>
        <div className="text-center">
          <div className="font-display text-4xl text-white leading-none">
            {match.home_score} – {match.away_score}
          </div>
          {match.minute && (
            <div className="text-xs text-accent mt-1">{match.minute}'</div>
          )}
        </div>
        <div className="flex-1 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 border-2"
            style={{ background: match.away_team.bg_color, borderColor: match.away_team.color + '40' }}
          >
            {match.away_team.emoji}
          </div>
          <div className="text-xs font-semibold text-gray-300">{match.away_team.name}</div>
          <div className="text-xs text-gray-500">Y{match.away_team.year_group}</div>
        </div>
      </div>
      {match.events.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1.5">
          {match.events.filter((e) => e.event_type === 'goal').slice(0, 3).map((e) => (
            <div key={e.id} className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              ⚽ {e.player_name} {e.minute}'
            </div>
          ))}
        </div>
      )}
    </div>
  )
}