interface SectionHeaderProps {
  title: string
  highlight?: string
  action?: { label: string; onClick: () => void }
}

export default function SectionHeader({ title, highlight, action }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <h2 className="font-display text-3xl tracking-wide">
        {title} {highlight && <span className="text-gold">{highlight}</span>}
      </h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-gray-400 hover:text-gold transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  )
}