import { useState } from 'react'
import type { ReactElement } from 'react'

interface CopyLinkChipProps {
  link: string
  displayPath: string
}

function CopyLinkChip({ link, displayPath }: CopyLinkChipProps): ReactElement {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex max-w-[220px] items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface-sunken) px-3 py-1.5 text-sm text-(--color-text-secondary) transition-colors hover:border-(--color-accent-border) hover:text-(--color-accent)"
    >
      <i className="pi pi-link text-xs" />
      <span className="truncate">{displayPath}</span>
      <i className={copied ? 'pi pi-check text-xs text-(--color-success)' : 'pi pi-copy text-xs'} />
    </button>
  )
}

export default CopyLinkChip
