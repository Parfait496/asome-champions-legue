import { useEffect, useState } from 'react'
import { newsApi } from '../services/api'
import type { NewsPost } from '../types'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'

const TAG_LABELS: Record<string, string> = {
  match_report: 'Match Report',
  announcement: 'Announcement',
  player_spotlight: 'Player Spotlight',
  stats: 'Stats',
  general: 'General',
}

function AnnouncementCard({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-amber-50 border border-amber-200 rounded-xl overflow-hidden hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
    >
      <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-800 font-bold text-xs uppercase tracking-widest">
            📢 Official Announcement
          </span>
        </div>
        <span className="text-amber-600 text-xs">
          {new Date(post.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </span>
      </div>
      <div className="px-6 py-5">
        <h3 className="font-bold text-amber-900 text-lg mb-2 leading-snug">{post.title}</h3>
        <p className="text-amber-800 text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <div className="border-t border-amber-200 pt-3 flex items-center justify-between">
          <div className="text-xs text-amber-700">
            <span className="font-semibold">{post.author_name || 'ASOME Administration'}</span>
            <br />
            <span className="text-amber-600">Tournament Committee</span>
          </div>
          <div className="text-amber-800 text-lg">{post.emoji}</div>
        </div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<NewsPost | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    newsApi.getAll()
      .then((data) => { setNews(data.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading news..." />

  const filtered = filter === 'all' ? news : news.filter((n) => n.tag === filter)
  const announcements = news.filter((n) => n.tag === 'announcement')
  const others = filtered.filter((n) => n.tag !== 'announcement')

  if (selected) {
    const isAnnouncement = selected.tag === 'announcement'
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 text-sm"
        >
          ← Back to News
        </button>

        {isAnnouncement ? (
          // Official announcement full view
          <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-amber-100 border-b border-amber-200 px-8 py-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-900 text-xs uppercase tracking-widest mb-0.5">
                  📢 Official Announcement
                </div>
                <div className="text-amber-600 text-xs">ASOME Champions League</div>
              </div>
              <div className="text-right text-xs text-amber-700">
                <div>{new Date(selected.created_at).toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}</div>
              </div>
            </div>
            <div className="px-8 py-8">
              <h1 className="font-bold text-amber-900 text-2xl mb-6 leading-snug">{selected.title}</h1>
              <div className="w-12 h-0.5 bg-amber-300 mb-6" />
              <p className="text-amber-800 leading-relaxed whitespace-pre-line">{selected.content}</p>
              <div className="mt-10 pt-6 border-t border-amber-200">
                <div className="text-sm text-amber-800">
                  <div className="mb-4 text-amber-600 text-xs italic">Signed,</div>
                  <div className="font-bold text-amber-900">{selected.author_name || 'Tournament Committee'}</div>
                  <div className="text-amber-700 text-sm">ASOME Champions League Administration</div>
                  <div className="text-amber-600 text-xs mt-1">
                    {new Date(selected.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Regular article full view
          <div>
            <div
              className="h-48 rounded-xl flex items-center justify-center text-6xl mb-6"
              style={{ background: selected.bg_color }}
            >
              {selected.emoji}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-gold text-dark mb-4">
              {TAG_LABELS[selected.tag] || selected.tag}
            </span>
            <h1 className="font-display text-4xl tracking-wide mb-4">{selected.title}</h1>
            <div className="text-gray-500 text-sm mb-6">
              By {selected.author_name} · {new Date(selected.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
            <p className="text-gray-300 leading-relaxed">{selected.content}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="News &" highlight="Updates" />

      {/* Announcements section */}
      {announcements.length > 0 && filter === 'all' && (
        <div className="mb-10">
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-4">
            📢 Official Announcements
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((post) => (
              <AnnouncementCard key={post.id} post={post} onClick={() => setSelected(post)} />
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'match_report', 'player_spotlight', 'stats', 'general'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-gold text-dark font-bold'
                : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
            }`}
          >
            {f === 'all' ? 'All News' : TAG_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Regular news */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((post) => (
          <Card key={post.id} hover onClick={() => setSelected(post)}>
            <div
              className="h-36 rounded-t-xl flex items-center justify-center text-5xl relative"
              style={{ background: post.bg_color }}
            >
              {post.emoji}
              <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2 py-0.5 rounded">
                {TAG_LABELS[post.tag] || post.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug mb-2">{post.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="text-xs text-gray-600">
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short',
                })}
              </div>
            </div>
          </Card>
        ))}
        {others.length === 0 && filter !== 'all' && (
          <p className="text-gray-500 col-span-3 text-center py-12">No articles in this category.</p>
        )}
      </div>
    </div>
  )
}