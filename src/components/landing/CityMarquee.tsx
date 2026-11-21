import { useEffect, useState } from 'react'
import { getCities } from '@/lib/api'
import type { City } from '@/types'

function ArchGlyph() {
  return (
    <svg viewBox="0 0 20 26" className="h-[0.7em] w-[0.55em] shrink-0" aria-hidden="true">
      <path d="M2 24V10.5a8 8 0 0 1 16 0V24z" fill="var(--color-ink)" />
    </svg>
  )
}

/** A slow band of the cities KHOKHI covers. Pauses on hover; still for reduced motion. */
export function CityMarquee() {
  const [cities, setCities] = useState<City[]>([])
  useEffect(() => {
    let live = true
    getCities().then((c) => live && setCities(c))
    return () => {
      live = false
    }
  }, [])

  const half = [...cities, ...cities]

  return (
    <section aria-label="Cities" className="marquee overflow-hidden bg-haldi py-5 text-ink sm:py-7">
      <p className="sr-only">Cities covered: {cities.join(', ')}</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {half.map((city, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center gap-6 pr-6 text-display font-black sm:gap-10 sm:pr-10"
                style={{ fontStretch: '125%' }}
              >
                {city}
                <ArchGlyph />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
