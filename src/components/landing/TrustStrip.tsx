import { CapIcon, HomeCheckIcon, ShieldCheckIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

const ITEMS = [
  {
    Icon: ShieldCheckIcon,
    title: 'Identity verified',
    body: 'Members confirm who they are before they can connect.',
  },
  {
    Icon: CapIcon,
    title: 'College or work verified',
    body: 'Student and employer details are checked, so a profile says what it means.',
  },
  {
    Icon: HomeCheckIcon,
    title: 'Verified listings',
    body: 'Every stay is reviewed before it goes live.',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="How KHOKHI builds trust" className="border-y border-ink/15">
      <ul className="mx-auto grid max-w-6xl divide-y divide-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0">
        {ITEMS.map(({ Icon, title, body }, i) => (
          <Reveal as="li" key={title} delay={i * 90} className="flex gap-5 px-4 py-8 sm:px-6 md:py-12">
            <span className="arch flex h-14 w-11 shrink-0 items-end justify-center rounded-b-md bg-haldi pb-2.5 text-ink">
              <Icon className="size-5" />
            </span>
            <div>
              <h3 className="text-h3 font-extrabold">{title}</h3>
              <p className="mt-1.5 text-ink-soft">{body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
