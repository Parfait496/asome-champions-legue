import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { matchesApi, newsApi, playersApi } from '../services/api'
import type { Match, StandingsEntry, NewsPost, Player } from '../types'
import LiveMatchCard from '../components/home/LiveMatchCard'
import FixtureCard from '../components/matches/FixtureCard'
import StandingsTable from '../components/matches/StandingsTable'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import { announcementsApi } from '../services/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [liveMatches, setLiveMatches] = useState<Match[]>([])
  const [upcoming, setUpcoming] = useState<Match[]>([])
  const [standings, setStandings] = useState<StandingsEntry[]>([])
  const [news, setNews] = useState<NewsPost[]>([])
  const [scorers, setScorers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<NewsPost[]>([])

  useEffect(() => {
    Promise.all([
      matchesApi.getLive(),
      matchesApi.getAll({ status: 'scheduled' }),
      matchesApi.getStandings(),
      newsApi.getAll(),
      playersApi.getTopScorers(),
      announcementsApi.getAll(),
    ]).then(([live, upcomingData, standingsData, newsData, scorersData, announcementsData]) => {
      setLiveMatches(live)
      setUpcoming(upcomingData.results?.slice(0, 3) || [])
      setStandings(standingsData)
      setNews(newsData.results?.slice(0, 3) || [])
      setScorers(scorersData.slice(0, 6))
      setLoading(false)
      setAnnouncements(announcementsData.results?.slice(0, 3) || [])
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading tournament data..." />

  return (
    <div>
      {/* HERO */}
      <div className="relative bg-pitch overflow-hidden">
        {/* Pitch lines background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 40% at 50% 50%, transparent 58%, #4CAF50 59%, transparent 61%),
              linear-gradient(90deg, transparent 49.5%, #4CAF50 49.5%, #4CAF50 50.5%, transparent 50.5%)
            `
          }} />
        </div>
        {/* Gold glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left content */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Season 2026 · ASOME Campus Cup
              </div>
              <h1 className="font-display text-6xl md:text-8xl leading-none tracking-wide mb-4">
                ASOME<br />
                <span className="text-gold">Champions</span><br />
                League
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                The ultimate campus football tournament. 6 teams. One champion.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/matches')}
                  className="px-6 py-3 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
                >
                  View Fixtures
                </button>
                <button
                  onClick={() => navigate('/teams')}
                  className="px-6 py-3 bg-transparent text-white border border-border rounded-lg font-semibold hover:border-gray-500 hover:bg-surface transition-all duration-200"
                >
                  Meet The Teams
                </button>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { val: '6', label: 'Teams' },
                  { val: '5+', label: 'Matches' },
                  { val: '250+', label: 'Students' },
                  { val: '6', label: 'Year Groups' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl text-gold">{s.val}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live match card */}
            {liveMatches.length > 0 && (
              <div className="flex-shrink-0">
                <LiveMatchCard match={liveMatches[0]} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* THEME VERSE BANNER */}
<div className="relative bg-pitch-light overflow-hidden py-12">
  {/* Background pattern */}
  <div className="absolute inset-0 opacity-5"
    style={{
      backgroundImage: 'radial-gradient(circle, #F5C842 1px, transparent 1px)',
      backgroundSize: '32px 32px'
    }}
  />
  {/* Gold top border */}
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
  {/* Gold bottom border */}
  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

  <div className="relative max-w-4xl mx-auto px-4 text-center">
    {/* Trophy icon */}
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 text-3xl mb-6">
      🏆
    </div>

    {/* Tournament theme label */}
    <div className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
      Tournament Theme
    </div>

    {/* Verse */}
    <blockquote className="font-display text-2xl md:text-4xl tracking-wide text-white leading-tight mb-4">
      "Let us run with perseverance<br className="hidden md:block" />
      <span className="text-gold"> the race marked out for us."</span>
    </blockquote>

    {/* Reference */}
    <cite className="text-gray-400 text-sm not-italic font-medium">
      — Hebrews 12:1
    </cite>

    {/* Divider */}
    <div className="flex items-center gap-4 my-6 max-w-xs mx-auto">
      <div className="flex-1 h-px bg-border" />
      <div className="text-gold text-xs">⚽</div>
      <div className="flex-1 h-px bg-border" />
    </div>

    {/* Tagline */}
    <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
      More than a tournament — a celebration of unity, discipline, and the spirit
      of competition among the students of ASOME.
    </p>

    {/* Stats row */}
    <div className="flex items-center justify-center gap-8 mt-8">
      {[
        { icon: '🤝', label: 'Unity' },
        { icon: '💪', label: 'Perseverance' },
        { icon: '🌟', label: 'Excellence' },
        { icon: '❤️', label: 'Community' },
      ].map((v) => (
        <div key={v.label} className="text-center">
          <div className="text-2xl mb-1">{v.icon}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{v.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* ANNOUNCEMENTS BANNER */}
{announcements.length > 0 && (
  <div className="bg-gold/10 border-y border-gold/20 py-4">
    <div className="max-w-7xl mx-auto px-4 space-y-2">
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => navigate(`/news/${a.id}`)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
          <span className="text-gold text-lg flex-shrink-0">📢</span>
          <span className="font-semibold text-gold text-sm">{a.title}</span>
          <span className="text-gray-400 text-sm hidden md:block">— {a.excerpt}</span>
          <span className="text-gray-600 text-xs ml-auto flex-shrink-0">
            {new Date(a.created_at).toLocaleDateString('en-GB')}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

      {/* STANDINGS PREVIEW */}
      <div className="bg-surface-raised py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="League"
            highlight="Standings"
            action={{ label: 'Full table', onClick: () => navigate('/matches') }}
          />
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <StandingsTable data={standings.slice(0, 6)} />
          </div>
        </div>
      </div>

      {/* UPCOMING FIXTURES */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Upcoming"
            highlight="Fixtures"
            action={{ label: 'All matches', onClick: () => navigate('/matches') }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((m) => <FixtureCard key={m.id} match={m} />)}
            {upcoming.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">No upcoming matches scheduled.</p>
            )}
          </div>
        </div>
      </div>

      {/* TOP SCORERS + NEWS */}
      <div className="bg-surface-raised py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Scorers */}
            <div>
              <SectionHeader title="Top" highlight="Scorers" />
              <div className="space-y-3">
                {scorers.map((p, i) => (
                  <Card key={p.id} hover className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`font-display text-2xl min-w-[28px] text-center ${i === 0 ? 'text-gold' : 'text-gray-500'}`}>
                        {i + 1}
                      </div>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: '#0D2E4B' }}
                      >
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.position}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl text-gold">{p.goals}</div>
                        <div className="text-xs text-gray-500">goals</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div>
              <SectionHeader
                title="Latest"
                highlight="News"
                action={{ label: 'All news', onClick: () => navigate('/news') }}
              />
              <div className="space-y-3">
                  {news.map((post) => (
                    <Card key={post.id} hover onClick={() => navigate(`/news/${post.id}`)} className="flex gap-3 p-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                        style={{ background: post.bg_color }}
                      >
                        {post.cover_image_url
                          ? <img src={post.cover_image_url} className="w-full h-full object-cover" />
                          : post.emoji
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold leading-snug line-clamp-2 hover:text-gold transition-colors">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(post.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short',
                          })}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}