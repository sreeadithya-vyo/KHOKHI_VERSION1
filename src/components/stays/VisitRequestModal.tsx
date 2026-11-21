import { useState, type FormEvent } from 'react'
import { sendStayEnquiry } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import { Button, Input, Modal, Textarea } from '@/components/ui'

interface Props {
  open: boolean
  onClose: () => void
  stayId: string
  stayTitle: string
}

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

export function VisitRequestModal({ open, onClose, stayId, stayTitle }: Props) {
  const toast = useToast()
  const [message, setMessage] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      setError('Write a short message so the owner knows who is asking.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await sendStayEnquiry(stayId, { message: message.trim(), visitDate: visitDate || undefined })
      setMessage('')
      setVisitDate('')
      onClose()
      toast('Visit request sent')
    } catch {
      toast('Could not send the request. Try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request a visit">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <p className="text-ink-soft">Tell the owner of {stayTitle} a little about yourself and when you could drop by.</p>
        <div className="flex flex-col gap-1.5">
          <Textarea
            label="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (error) setError('')
            }}
            placeholder="Hi, I am moving to the city next month and would like to see the room."
            required
            aria-required="true"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'visit-message-error' : undefined}
          />
          {error && (
            <p id="visit-message-error" role="alert" className="text-caption font-medium text-danger">
              {error}
            </p>
          )}
        </div>
        <Input
          label="Preferred date (optional)"
          type="date"
          min={today()}
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />
        <div className="flex flex-col gap-4 border-t border-line pt-4">
          <p className="text-caption text-muted">Demo build: nothing is sent to the owner. The request is only recorded for this session.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send request'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
