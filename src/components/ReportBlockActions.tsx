import { useState } from 'react'
import { blockTarget, reportTarget } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import type { ReportTarget } from '@/types'
import { Button, Modal, Select } from '@/components/ui'

const REASONS = [
  { value: 'Fake or misleading', label: 'Fake or misleading' },
  { value: 'Inappropriate behaviour', label: 'Inappropriate behaviour' },
  { value: 'Spam', label: 'Spam' },
  { value: 'Something else', label: 'Something else' },
]

interface Props {
  target: ReportTarget
  /** Shown in the confirmations, e.g. "Ananya Rao" or "Greenleaf PG". */
  name: string
  /** Called after a successful block so the page can navigate away. */
  onBlocked?: () => void
}

/** Report and Block buttons with confirmation modals and toasts. Mock actions via the api layer. */
export function ReportBlockActions({ target, name, onBlocked }: Props) {
  const toast = useToast()
  const [open, setOpen] = useState<'report' | 'block' | null>(null)
  const [reason, setReason] = useState(REASONS[0]!.value)
  const [busy, setBusy] = useState(false)

  const noun = target.kind === 'profile' ? 'profile' : 'listing'
  const close = () => setOpen(null)

  async function sendReport() {
    setBusy(true)
    try {
      await reportTarget(target, reason)
      toast(`Report sent. Thanks for flagging this ${noun}.`)
      close()
    } catch {
      toast('Could not send the report. Try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  async function confirmBlock() {
    setBusy(true)
    try {
      await blockTarget(target)
      toast(`Blocked ${name}.`)
      close()
      onBlocked?.()
    } catch {
      toast('Could not block. Try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen('report')}>
          Report
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen('block')}>
          Block
        </Button>
      </div>

      <Modal open={open === 'report'} onClose={close} title={`Report ${name}`}>
        <div className="flex flex-col gap-5">
          <Select label="What is wrong?" options={REASONS} value={reason} onChange={(e) => setReason(e.target.value)} />
          <p className="text-caption text-muted">Demo build: reports are recorded for this session only.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={sendReport} disabled={busy}>
              {busy ? 'Sending…' : 'Send report'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={open === 'block'} onClose={close} title={`Block ${name}?`}>
        <div className="flex flex-col gap-5">
          <p className="text-ink-soft">
            {target.kind === 'profile'
              ? `${name} will disappear from your feed, matches and messages.`
              : `${name} will no longer appear in listings.`}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmBlock} disabled={busy}>
              {busy ? 'Blocking…' : 'Block'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
