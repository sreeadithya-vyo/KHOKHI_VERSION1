import { useEffect, useRef, useState } from 'react'

const KEY = 'khokhi.demo-banner-dismissed'

function wasDismissed() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Makes clear that everything in this build is demonstration content. Dismissible for the session. */
export function DemoBanner() {
  const [hidden, setHidden] = useState(wasDismissed)
  const ref = useRef<HTMLDivElement>(null)

  // Screens that size themselves to the viewport (Messages) subtract this variable.
  useEffect(() => {
    const root = document.documentElement
    const el = ref.current
    if (hidden || !el) {
      root.style.setProperty('--banner-h', '0px')
      return
    }
    const sync = () => root.style.setProperty('--banner-h', `${el.offsetHeight}px`)
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => {
      observer.disconnect()
      root.style.setProperty('--banner-h', '0px')
    }
  }, [hidden])

  if (hidden) return null

  function dismiss() {
    setHidden(true)
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage unavailable: the banner just returns on the next visit */
    }
  }

  return (
    <div ref={ref} role="region" aria-label="Demo notice" className="on-dark bg-ink">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5 sm:px-6">
        <p className="flex-1 text-caption text-white/80">
          <span className="font-bold text-haldi">Demo build.</span> Profiles, listings, verification badges and
          payments are placeholders, not real.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss demo notice"
          className="-my-1.5 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <span aria-hidden="true" className="text-h2 leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  )
}
