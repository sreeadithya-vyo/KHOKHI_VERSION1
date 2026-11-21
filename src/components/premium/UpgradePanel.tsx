import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { CheckIcon } from '@/components/icons'
import { Button, LinkButton } from '@/components/ui'
import { inr } from '@/lib/format'
import { PREMIUM_MATCH_THRESHOLD } from '@/lib/plan'
import { ArchWindows } from './ArchWindows'

/** Placeholder blocks that read on the dark panel (the shared Skeleton is tuned for light fields). */
function DarkBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-control bg-brand-500/40 motion-reduce:animate-none ${className}`} />
}

/**
 * The single upgrade action, with its logged-out and already-premium states.
 * A small building: arch windows on a ledge, the action in the rooms below. On Premium every window is lit.
 */
export function UpgradePanel() {
  const { user, loading, upgradeToPremium } = useAuth()
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  async function upgrade() {
    setBusy(true)
    try {
      await upgradeToPremium()
      toast('You are on Premium')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upgrade. Try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const isPremium = !loading && user?.plan === 'premium'

  let body
  if (loading) {
    body = (
      <div className="space-y-3">
        <DarkBlock className="h-6 w-40" />
        <DarkBlock className="h-14 w-full" />
      </div>
    )
  } else if (!user) {
    body = (
      <>
        <h2 className="text-h2 font-black text-white">Log in to upgrade</h2>
        <p className="mt-2 text-brand-200">You need an account to switch plans.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton to="/login" variant="accent">
            Log in
          </LinkButton>
          <Link
            to="/signup"
            className="inline-flex h-11 items-center justify-center rounded-pill px-6 text-body font-bold text-white ring-1 ring-inset ring-white/40 transition-colors duration-200 hover:bg-dusk-deep hover:ring-white"
          >
            Sign up
          </Link>
        </div>
      </>
    )
  } else if (user.plan === 'premium') {
    body = (
      <>
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="arch flex h-14 w-11 shrink-0 items-end justify-center rounded-b-md bg-haldi pb-2 text-ink"
          >
            <CheckIcon className="size-5" strokeWidth={2.4} />
          </span>
          <h2 className="text-h2 font-black text-white">You are on Premium</h2>
        </div>
        <p className="mt-3 text-brand-200">
          Matches at {PREMIUM_MATCH_THRESHOLD}% and above are unlocked, and your connections are unlimited.
        </p>
        <LinkButton to="/discover" variant="accent" className="mt-6">
          See your unlocked matches
        </LinkButton>
      </>
    )
  } else {
    body = (
      <>
        <h2 className="text-h3 font-bold text-brand-200">Premium</h2>
        <p className="mt-1 text-brand-200">
          <span className="text-display font-black leading-none text-haldi">{inr(0)}</span>
          <span className="ml-2 inline-block">in this demo</span>
        </p>
        <Button variant="accent" size="lg" fullWidth className="mt-6" onClick={upgrade} disabled={busy}>
          {busy ? 'Upgrading…' : 'Upgrade to Premium'}
        </Button>
      </>
    )
  }

  return (
    <div aria-live="polite" className="on-dark overflow-hidden rounded-card bg-dusk text-white shadow-lift">
      <div className="px-6 pt-8">
        <ArchWindows litAll={isPremium} />
      </div>
      <div aria-hidden="true" className="h-2 bg-ink" />
      <div className="p-6 sm:p-7">
        {body}
        <p className="mt-6 border-t border-brand-500/40 pt-4 text-caption text-brand-200">
          Demo build: no payment is taken. Upgrading only changes your plan for this browser session.
        </p>
      </div>
    </div>
  )
}
