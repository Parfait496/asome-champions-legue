import { useNavigate } from 'react-router-dom'
import type { StandingsEntry } from '../../types'

const FORM_COLORS: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-yellow-500',
  L: 'bg-red-500',
}

export default function StandingsTable({ data }: { data: StandingsEntry[] }) {
  const navigate = useNavigate()

  const getForm = (entry: StandingsEntry) => {
    const results: string[] = []
    if (entry.wins > 0) for (let i = 0; i < Math.min(entry.wins, 2); i++) results.push('W')
    if (entry.draws > 0) results.push('D')
    if (entry.losses > 0) results.push('L')
    return results.slice(0, 5)
  }

  const posClass = (i: number, eliminated: boolean) => {
    if (eliminated) return 'bg-red-500/10 text-red-400'
    if (i === 0) return 'bg-gold/20 text-gold'
    if (i === 1) return 'bg-gray-400/15 text-gray-300'
    if (i === 2) return 'bg-amber-700/15 text-amber-600'
    return 'bg-surface text-gray-500'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Form', 'Pts'].map((h) => (
              <th
                key={h}
                className={`py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  h === 'Team' ? 'text-left' : 'text-center'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => {
            const eliminated = entry.team.is_eliminated
            return (
              <tr
                key={entry.team.id}
                onClick={() => navigate(`/teams/${entry.team.id}`)}
                className={`border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                  eliminated ? 'opacity-60' : ''
                }`}
              >
                <td className="py-3 px-3 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${posClass(i, eliminated)}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 px-3 text-left">
                  <span className="mr-2">{entry.team.emoji}</span>
                  <span className={`font-semibold text-sm ${eliminated ? 'text-red-400 line-through' : ''}`}>
                    {entry.team.name}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">Y{entry.team.year_group}</span>
                  {eliminated && <span className="ml-2 text-xs text-red-400">❌ Eliminated</span>}
                </td>
                <td className="py-3 px-3 text-center text-sm text-gray-400">{entry.played}</td>
                <td className="py-3 px-3 text-center text-sm text-gray-400">{entry.wins}</td>
                <td className="py-3 px-3 text-center text-sm text-gray-400">{entry.draws}</td>
                <td className="py-3 px-3 text-center text-sm text-gray-400">{entry.losses}</td>
                <td className={`py-3 px-3 text-center text-sm font-medium ${entry.gd > 0 ? 'text-green-400' : entry.gd < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {entry.gd > 0 ? '+' : ''}{entry.gd}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    {getForm(entry).map((r, j) => (
                      <div key={j} className={`w-2 h-2 rounded-full ${FORM_COLORS[r]}`} />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3 text-center font-bold text-gold">{entry.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}