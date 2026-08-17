import type { ReactElement } from 'react'

interface AvatarProps {
  name: string
  variant?: 'neutral' | 'accent'
  size?: 'sm' | 'md'
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-xs',
}

const VARIANT_CLASSES: Record<NonNullable<AvatarProps['variant']>, string> = {
  neutral: 'bg-(--color-neutral-soft) text-(--color-text-secondary)',
  accent: 'bg-(--color-accent) text-(--color-accent-contrast)',
}

function Avatar({ name, variant = 'neutral', size = 'md' }: AvatarProps): ReactElement {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default Avatar
