interface BadgeProps {
  children: React.ReactNode
  variant?: 'live' | 'upcoming' | 'done' | 'gold' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    live: 'bg-red-500/15 text-red-400 border border-red-500/20',
    upcoming: 'bg-gold/10 text-gold border border-gold/20',
    done: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    gold: 'bg-gold text-dark',
    default: 'bg-surface text-gray-400 border border-border',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}