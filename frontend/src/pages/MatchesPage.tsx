import { useEffect, useState } from 'react'
import { matchesApi } from '../services/api'
import type { Match, StandingsEntry } from '../types'
import FixtureCard from '../components/matches/FixtureCard'
import StandingsTable from '../components/matches/StandingsTable'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const FILTERS = ['All', 'Live', 'Upcoming', 'Completed']

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [standings, setStandings] = useState<StandingsEntry[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      matchesApi.getAll(),
      matchesApi.getStandings(),
    ]).then(([matchData, standingsData]) => {
      setMatches(matchData.results || [])
      setStandings(standingsData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = matches.filter((m) => {
    if (filter === 'All') return true
    if (filter === 'Live') return m.status === 'live'
    if (filter === 'Upcoming') return m.status === 'scheduled'
    if (filter === 'Completed') return m.status === 'done'
    return true
  })

  if (loading) return <LoadingSpinner text="Loading matches..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Matches */}
      <SectionHeader title="All" highlight="Matches" />
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-gold text-dark font-bold'
                : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {filtered.map((m) => <FixtureCard key={m.id} match={m} />)}
        {filtered.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-12">No matches found.</p>
        )}
      </div>

      {/* Standings */}
      <SectionHeader title="Full" highlight="Standings" />
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <StandingsTable data={standings} />
      </div>
    </div>
  )
}