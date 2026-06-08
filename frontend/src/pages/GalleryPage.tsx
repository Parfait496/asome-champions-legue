import { useState } from 'react'
import SectionHeader from '../components/ui/SectionHeader'

const GALLERY_ITEMS = [
  { emoji: '🦅', bg: '#0A2540', caption: 'Eagles celebrate a goal' },
  { emoji: '⚽', bg: '#0D3B2E', caption: 'Match winning strike' },
  { emoji: '🏟️', bg: '#1A1200', caption: 'Campus Ground A packed' },
  { emoji: '🦁', bg: '#1A1500', caption: 'Lions on the attack' },
  { emoji: '🤝', bg: '#1A0D0D', caption: 'Fair play moment' },
  { emoji: '🏆', bg: '#1A1400', caption: 'Trophy presentation' },
  { emoji: '🦅', bg: '#05101A', caption: 'Header attempt' },
  { emoji: '🐯', bg: '#1A0D00', caption: 'Tigers goalkeeper save' },
  { emoji: '🎉', bg: '#0A1A0A', caption: 'End of match celebration' },
  { emoji: '🐺', bg: '#1A0A2A', caption: 'Wolves press forward' },
  { emoji: '⚡', bg: '#1A1A0A', caption: 'Fast break attack' },
  { emoji: '🌟', bg: '#0A1A1A', caption: 'Player of the match' },
]

export default function GalleryPage() {
  const [preview, setPreview] = useState<typeof GALLERY_ITEMS[0] | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Match" highlight="Gallery" />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['All Photos', 'Matchday 4', 'Matchday 3', 'Matchday 2'].map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              i === 0
                ? 'bg-gold text-dark font-bold'
                : 'bg-surface border border-border text-gray-400 hover:border-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={i}
            onClick={() => setPreview(item)}
            className="aspect-square rounded-xl flex items-center justify-center text-5xl cursor-pointer border border-border group relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: item.bg }}
          >
            {item.emoji}
            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">🔍</div>
                <div className="text-xs text-white px-2 text-center">{item.caption}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-80 h-80 rounded-2xl flex items-center justify-center text-8xl border border-border"
            style={{ background: preview.bg }}
            onClick={(e) => e.stopPropagation()}
          >
            {preview.emoji}
          </div>
          <div className="absolute bottom-10 text-center">
            <p className="text-white font-medium">{preview.caption}</p>
            <p className="text-gray-500 text-sm mt-1">Click outside to close</p>
          </div>
        </div>
      )}
    </div>
  )
}