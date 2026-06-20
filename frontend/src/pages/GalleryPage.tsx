import { useState, useEffect } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'

interface MediaItem {
  id: number
  file: string
  file_url: string | null
  thumbnail: string | null
  thumbnail_url: string | null
  caption: string
  media_type: 'photo' | 'video'
  matchday: number | null
  created_at: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [matchdays, setMatchdays] = useState<number[]>([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/media/`)
      .then((r) => r.json())
      .then((data) => {
        const list: MediaItem[] = Array.isArray(data) ? data : data.results || []
        setItems(list)
        const days = [...new Set(list.map((i) => i.matchday).filter(Boolean))] as number[]
        setMatchdays(days.sort((a, b) => b - a))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? items
    : filter === 'video'
    ? items.filter((i) => i.media_type === 'video')
    : items.filter((i) => i.matchday === Number(filter))

  if (loading) return <LoadingSpinner text="Loading gallery..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Match" highlight="Gallery" />

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-gold text-dark font-bold'
              : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'video'
              ? 'bg-gold text-dark font-bold'
              : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
          }`}
        >
          🎥 Videos
        </button>
        {matchdays.map((md) => (
          <button
            key={md}
            onClick={() => setFilter(String(md))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === String(md)
                ? 'bg-gold text-dark font-bold'
                : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
            }`}
          >
            Matchday {md}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📸</div>
          <p className="text-gray-500 text-sm">No media uploaded yet.</p>
          <p className="text-gray-600 text-xs mt-1">
            Upload photos and videos through the admin panel.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreview(item)}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-border group relative bg-surface hover:-translate-y-0.5 transition-all duration-200"
          >
            {item.media_type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-surface-raised">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎥</div>
                  <div className="text-xs text-gray-500 px-2 line-clamp-2">{item.caption}</div>
                </div>
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-dark text-xl">
                    ▶
                  </div>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={item.thumbnail_url || item.file_url || ''}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-3 w-full">
                    <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-dark/95 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {preview.media_type === 'video' ? (
              <video
                src={preview.file_url || ''}
                controls
                autoPlay
                className="w-full rounded-xl max-h-[70vh]"
              />
            ) : (
              <img
                src={preview.file_url || ''}
                alt={preview.caption}
                className="w-full rounded-xl max-h-[70vh] object-contain"
              />
            )}
            {preview.caption && (
              <p className="text-center text-gray-300 text-sm mt-4">{preview.caption}</p>
            )}
            <p className="text-center text-gray-600 text-xs mt-2">Click outside to close</p>
          </div>
        </div>
      )}
    </div>
  )
}