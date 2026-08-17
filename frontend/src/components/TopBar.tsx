import { Tag } from 'primereact/tag'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import type { ConnectionStatus } from '../hooks/useRoomSocket'
import CopyLinkChip from './CopyLinkChip'
import Logo from './Logo'
import UserBadge from './UserBadge'

interface TopBarProps {
  status: ConnectionStatus
  shareLink: string
  shareDisplayPath: string
  myName: string
  isAdmin: boolean
}

function TopBar({ status, shareLink, shareDisplayPath, myName, isAdmin }: TopBarProps): ReactElement {
  return (
    <header className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-6 py-3">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="sm" variant="accent" />
          <span className="font-semibold text-(--color-text-primary)">Sprint Poker</span>
        </Link>
        {status !== 'open' && (
          <Tag
            severity="warning"
            value={status === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
            icon="pi pi-spin pi-spinner"
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        <CopyLinkChip link={shareLink} displayPath={shareDisplayPath} />
        <UserBadge name={myName} isAdmin={isAdmin} />
      </div>
    </header>
  )
}

export default TopBar
