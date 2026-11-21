import { useState } from 'react'
import { connectWithProfile } from '@/lib/api'
import { PlanLimitError, isPremiumLocked } from '@/lib/plan'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import type { Match, RoommateProfile } from '@/types'
import { Button, LinkButton } from '@/components/ui'

interface Props {
  profile: RoommateProfile
  /** True once a connection (requested or matched) already exists for this profile. */
  connected?: boolean
  onConnected?: (match: Match) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

/**
 * The single place that decides what "Connect" does: already connected, Premium-locked (free member
 * and an 80%+ match), or a live connect via the api. Use it on every profile card and profile page.
 */
export function ConnectButton({ profile, connected, onConnected, size, className, fullWidth }: Props) {
  const { user } = useAuth()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const firstName = profile.name.split(' ')[0]!

  if (connected) {
    return (
      <Button variant="secondary" size={size} className={className} fullWidth={fullWidth} disabled>
        Requested
      </Button>
    )
  }

  if (user && isPremiumLocked(user.plan, profile.compatibilityScore)) {
    return (
      <LinkButton to="/premium" variant="secondary" size={size} className={className} fullWidth={fullWidth}>
        Unlock with Premium
      </LinkButton>
    )
  }

  async function connect() {
    setBusy(true)
    try {
      const match = await connectWithProfile(profile.id)
      toast(`Connection request sent to ${firstName}.`)
      onConnected?.(match)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not connect. Try again.'
      toast(message, err instanceof PlanLimitError ? 'info' : 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button size={size} className={className} fullWidth={fullWidth} onClick={connect} disabled={busy}>
      {busy ? 'Connecting…' : 'Connect'}
    </Button>
  )
}
