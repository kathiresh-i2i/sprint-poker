import type { ReactElement } from 'react'

interface LogoProps {
  size?: 'sm' | 'lg'
  variant?: 'accent' | 'white'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8 w-8 rounded-lg text-sm',
  lg: 'h-14 w-14 rounded-2xl text-2xl',
}

const VARIANT_CLASSES: Record<NonNullable<LogoProps['variant']>, string> = {
  accent: 'bg-(--color-accent-soft) text-(--color-accent)',
  white: 'bg-white/15 text-white',
}

function Logo({ size = 'sm', variant = 'accent', className = '' }: LogoProps): ReactElement {
  return (
    <div
      className={`flex items-center justify-center ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <i className="pi pi-table" />
    </div>
  )
}

export default Logo
