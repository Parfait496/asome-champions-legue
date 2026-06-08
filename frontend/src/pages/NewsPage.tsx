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

export default function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<NewsPost | null>(null)

  useEffect(() => {
    newsApi.getAll()
      .then((data) => { setNews(data.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading news..." />

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 text-sm"
        >
          ← Back to News
        </button>
        <div
          className="h-48 rounded-xl flex items-center justify-center text-6xl mb-6"
          style={{ background: selected.bg_color }}
        >
          {selected.emoji}
        </div>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-gold text-dark mb-4">
          {TAG_LABELS[selected.tag] || selected.tag}
        </div>
        <h1 className="font-display text-4xl tracking-wide mb-4">{selected.title}</h1>
        <div className="text-gray-500 text-sm mb-6">
          By {selected.author_name} · {new Date(selected.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </div>
        <p className="text-gray-300 leading-relaxed">{selected.content}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="News &" highlight="Updates" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((post) => (
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
        {news.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-12">No news yet.</p>
        )}
      </div>
    </div>
  )
}