import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'

export default function Footer() {
  const navigate = useNavigate()
  const [clicks, setClicks] = useState(0)

  const handleSecretClick = useCallback(() => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) {
      setClicks(0)
      navigate('/x7k9-admin')
    }
    setTimeout(() => setClicks(0), 3000)
  }, [clicks, navigate])

  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-dark font-display text-lg">
              ⚽
            </div>
            <div>
              <div className="font-display text-xl tracking-widest text-gold">ASOME CL</div>
              <div className="text-xs text-gray-500">Campus Champions League</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/matches" className="hover:text-gold transition-colors">Matches</Link>
            <Link to="/teams" className="hover:text-gold transition-colors">Teams</Link>
            <Link to="/news" className="hover:text-gold transition-colors">News</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Copyright — secret admin trigger */}
          <div
            onClick={handleSecretClick}
            className="text-xs text-gray-600 cursor-default select-none"
          >
            © 2025 ASOME Champions League. All rights reserved.
          </div>

          {/* Designed by */}
          <div className="text-xs text-gray-600 flex items-center gap-1.5">
            Designed & Developed by{' '}
            
              href="https://www.linkedin.com/in/ndizihiwe-parfait-250884283"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-dark transition-colors font-medium"
            <a>
              Ndizihiwe Parfait
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}