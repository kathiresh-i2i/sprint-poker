import type { ReactElement } from 'react'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-7 text-center shadow-(--shadow-xs)">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-accent-soft)">
        <i className={`pi ${icon} text-(--color-accent)`} />
      </div>
      <p className="text-sm font-semibold text-(--color-text-primary)">{title}</p>
      <p className="text-xs text-(--color-text-secondary)">{description}</p>
    </div>
  )
}

export default FeatureCard
