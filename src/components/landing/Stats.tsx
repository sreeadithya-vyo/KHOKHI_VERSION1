import { Reveal } from '@/components/Reveal'

/*
 * TODO(client): these values are PLACEHOLDERS. Replace them with the figures from the
 * KHOKHI pitch deck. Display text only: nothing else on the site reads these.
 */
const STATS = [
  { value: 'XX Cr', label: 'students enrolled in higher education in India' },
  { value: 'XX Cr', label: 'people moving to Indian cities for study and work' },
  { value: 'XX%', label: 'yearly growth of the co-living market' },
]

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-36">
      <h2 className="max-w-3xl text-display font-black">Millions relocate for study and work</h2>
      <dl className="mt-14 grid gap-12 border-t-[3px] border-ink pt-10 md:grid-cols-3 md:gap-0">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 110} className={`flex flex-col ${i > 0 ? 'md:border-l md:border-ink/20 md:pl-8' : 'md:pr-8'}`}>
            <dd className="text-display font-black tabular-nums" style={{ fontStretch: '125%' }}>
              {s.value}
            </dd>
            <dt className="order-2 mt-3 max-w-[16rem] text-ink-soft">{s.label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
