import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-dark font-display text-lg">
              ⚽
            </div>
            <div>
              <div className="font-display text-xl tracking-widest text-gold">ASOME CL</div>
              <div className="text-xs text-gray-500">Campus Champions League</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/matches" className="hover:text-gold transition-colors">Matches</Link>
            <Link to="/teams" className="hover:text-gold transition-colors">Teams</Link>
            <Link to="/news" className="hover:text-gold transition-colors">News</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
          </div>
          <div className="text-xs text-gray-600">
            © 2025 ASOME Champions League. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}