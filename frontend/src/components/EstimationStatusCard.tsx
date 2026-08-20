import type { ReactElement } from 'react'
import AdminToolbar from './AdminToolbar'
import CopyLinkChip from './CopyLinkChip'

interface EstimationStatusCardProps {
  headline: string
  subtext: string
  votedCount: number
  participantCount: number
  hasVotes: boolean
  shareLink: string
  shareDisplayPath: string
  onReveal: () => void
  onReset: () => void
}

function EstimationStatusCard({
  headline,
  subtext,
  votedCount,
  participantCount,
  hasVotes,
  shareLink,
  shareDisplayPath,
  onReveal,
  onReset,
}: EstimationStatusCardProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">{headline}</h1>
        <p className="mt-3 text-sm text-(--color-text-secondary)">{subtext}</p>
      </div>

      {participantCount === 0 ? (
        <CopyLinkChip link={shareLink} displayPath={shareDisplayPath} />
      ) : (
        <>
          {hasVotes && (
            <p className="text-sm font-medium text-(--color-text-secondary)">
              {votedCount} of {participantCount} voted
            </p>
          )}
          <AdminToolbar revealed={false} hasVotes={hasVotes} onReveal={onReveal} onReset={onReset} />
        </>
      )}
    </div>
  )
}

export default EstimationStatusCard
