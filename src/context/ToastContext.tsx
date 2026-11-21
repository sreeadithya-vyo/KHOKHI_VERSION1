import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  tone: Tone
}

type ShowToast = (message: string, tone?: Tone) => void

const ToastContext = createContext<ShowToast | null>(null)

const TONE_STYLES: Record<Tone, string> = {
  success: 'bg-ink text-white',
  error: 'bg-danger text-white',
  info: 'bg-brand-800 text-white',
}

/** `const toast = useToast(); toast('Connection request sent')`. Toasts clear themselves after 4 seconds. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const show = useCallback<ShowToast>((message, tone = 'success') => {
    const id = ++counter.current
    setItems((list) => [...list, { id, message, tone }])
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 4000)
  }, [])

  const value = useMemo(() => show, [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn('pointer-events-auto max-w-md rounded-control px-4 py-3 text-body font-medium shadow-lift', TONE_STYLES[t.tone])}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
