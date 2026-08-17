import type { ReactElement } from 'react'

interface StepItemProps {
  index: number
  title: string
  description: string
}

function StepItem({ index, title, description }: StepItemProps): ReactElement {
  return (
    <div className="flex flex-col gap-2 text-center sm:text-left">
      <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-(--color-accent) text-sm font-bold text-(--color-accent-contrast) sm:mx-0">
        {index}
      </span>
      <h3 className="font-semibold text-(--color-text-primary)">{title}</h3>
      <p className="text-sm text-(--color-text-secondary)">{description}</p>
    </div>
  )
}

export default StepItem
