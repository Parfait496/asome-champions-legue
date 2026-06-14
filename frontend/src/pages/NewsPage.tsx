import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function NewsPage() {
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    newsApi.getAll()
      .then((data) => { setNews(data.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading news..." />

  const articles = news.filter(n => n.tag !== 'announcement')
  const filtered = filter === 'all' ? articles : articles.filter(n => n.tag === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="News &" highlight="Updates" />

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

      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Card
            key={post.id}
            hover
            onClick={() => navigate(`/news/${post.id}`)}
          >
            {/* Cover */}
            <div className="h-44 rounded-t-xl overflow-hidden relative">
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-5xl"
                  style={{ background: post.bg_color }}
                >
                  {post.emoji}
                </div>
              )}
              <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2 py-0.5 rounded">
                {TAG_LABELS[post.tag] || post.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug mb-2 hover:text-gold transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short',
                  })}
                </div>
                <span className="text-xs text-gold">Read more →</span>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-12">No articles found.</p>
        )}
      </div>
    </div>
  )
}