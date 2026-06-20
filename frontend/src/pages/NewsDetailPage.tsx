import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { NewsPost } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<NewsPost[]>([])

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/news/${id}/`).then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/news/`).then((r) => r.json()),
    ]).then(([postData, allData]) => {
      setPost(postData)
      const all: NewsPost[] = Array.isArray(allData) ? allData : allData.results || []
      setRelated(all.filter((p) => p.id !== Number(id) && p.tag !== 'announcement').slice(0, 3))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!post) return

    document.title = `${post.title} — ASOME Champions League`

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title', post.title)
    setMeta('og:description', post.excerpt)
    setMeta('og:image', post.cover_image_url || 'https://asome-champions-legue.vercel.app/icon-512.png')
    setMeta('og:url', window.location.href)
    setMeta('og:type', 'article')

    return () => {
      document.title = 'ASOME Champions League'
    }
  }, [post])

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/api/og?id=${post?.id}`
    if (navigator.share) {
      navigator.share({ title: post?.title, text: post?.excerpt, url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard! It includes the cover image preview.')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!post) return <div className="text-center py-20 text-gray-500">Article not found.</div>

  const isAnnouncement = post.tag === 'announcement'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-gray-400 hover:text-gold hover:border-gold/30 transition-all"
        >
          🔗 Share
        </button>
      </div>

      {isAnnouncement ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-amber-100 border-b border-amber-200 px-8 py-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-amber-900 text-xs uppercase tracking-widest mb-0.5">
                📢 Official Announcement
              </div>
              <div className="text-amber-600 text-xs">ASOME Champions League</div>
            </div>
            <div className="text-right text-xs text-amber-700">
              {new Date(post.created_at).toLocaleDateString('en-GB', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          </div>
          <div className="px-8 py-8">
            <h1 className="font-bold text-amber-900 text-2xl mb-6 leading-snug">{post.title}</h1>
            <div className="w-12 h-0.5 bg-amber-300 mb-6" />
            <p className="text-amber-800 leading-relaxed whitespace-pre-line">{post.content}</p>
            <div className="mt-10 pt-6 border-t border-amber-200">
              <div className="text-sm text-amber-800">
                <div className="mb-4 text-amber-600 text-xs italic">Signed,</div>
                <div className="font-bold text-amber-900">{post.author_name || 'ASOME Administration'}</div>
                <div className="text-amber-700 text-sm">{post.author_title || 'Tournament Committee'}</div>
                <div className="text-amber-600 text-xs mt-1">
                  {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {post.cover_image_url ? (
            <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="rounded-2xl h-48 flex items-center justify-center text-6xl mb-6"
              style={{ background: post.bg_color }}
            >
              {post.emoji}
            </div>
          )}

          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gold text-dark mb-4">
            {post.tag.replace('_', ' ')}
          </span>

          <h1 className="font-display text-4xl tracking-wide mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-border">
            <span>✍️ {post.author_name || 'ASOME Staff'}</span>
            <span>·</span>
            <span>
              {new Date(post.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>

          <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
            {post.content}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-display text-xl tracking-wide mb-4 text-gray-400">More Articles</h3>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/news/${r.id}`}
                className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl hover:border-gold/30 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                  style={{ background: r.bg_color }}
                >
                  {r.cover_image_url ? <img src={r.cover_image_url} className="w-full h-full object-cover" /> : r.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold group-hover:text-gold transition-colors truncate">{r.title}</div>
                  <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString('en-GB')}</div>
                </div>
                <span className="text-gray-600 group-hover:text-gold transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}