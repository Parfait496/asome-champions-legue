import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NewsPost } from '../types'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AnnouncementsPage() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/news/?tag=announcement`)
      .then((r) => r.json())
      .then((d) => {
        setAnnouncements(Array.isArray(d) ? d : d.results || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading announcements..." />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SectionHeader title="Official" highlight="Announcements" />

      {announcements.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📢</div>
          <p className="text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/news/${post.id}`)}
              className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 flex items-center justify-between">
                <span className="text-amber-800 font-bold text-xs uppercase tracking-widest">
                  📢 Official Announcement
                </span>
                <span className="text-amber-600 text-xs">
                  {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="px-6 py-5">
                <h3 className="font-bold text-amber-900 text-lg mb-2">{post.title}</h3>
                <p className="text-amber-800 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="border-t border-amber-200 pt-3 flex items-center justify-between">
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">{post.author_name || 'ASOME Administration'}</span>
                    <br />
                    <span className="text-amber-600">{post.author_title || 'Tournament Committee'}</span>
                  </div>
                  <span className="text-amber-700 text-sm font-medium">Read more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}