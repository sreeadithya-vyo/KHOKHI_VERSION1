import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/cn'
import { BriefcaseIcon, CapIcon, HomeCheckIcon } from '@/components/icons'
import { LinkButton } from '@/components/ui'
import { RevealLines } from './RevealLines'

const AUDIENCES = [
  {
    title: 'For students',
    body: 'Starting college in a new city? Find a roommate with the same study hours, and a PG or hostel that has been checked.',
    cta: 'Start as a student',
    to: '/signup',
    Icon: CapIcon,
    tone: 'bg-haldi text-ink',
    dark: false,
    speed: 40,
  },
  {
    title: 'For professionals',
    body: 'Relocating for work? Match with people who keep your hours, and find a stay close to your office.',
    cta: 'Start as a professional',
    to: '/signup',
    Icon: BriefcaseIcon,
    tone: 'bg-gulabi text-ink',
    dark: false,
    speed: 90,
  },
  {
    title: 'For owners',
    body: 'Have a room to fill? List a verified space and reach renters looking for exactly that.',
    cta: 'List your space',
    to: '/list-your-space',
    Icon: HomeCheckIcon,
    tone: 'bg-ink text-white on-dark',
    dark: true,
    speed: 20,
  },
]

/** Three doorways, three audiences. The arches drift at different speeds on desktop. */
export function Audiences() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.aud').forEach((el, i) => {
          const speed = AUDIENCES[i]!.speed
          gsap.fromTo(
            el,
            { y: speed },
            {
              y: -speed,
              ease: 'none',
              scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} className="overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealLines lines={['Built for how', 'you are moving']} className="text-display font-black" />

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:items-end">
          {AUDIENCES.map((a, i) => (
            <div
              key={a.title}
              className={cn(
                'aud arch flex flex-col rounded-b-card px-7 pb-8 pt-24',
                a.tone,
                i === 1 ? 'md:min-h-[38rem]' : 'md:min-h-[34rem]',
                i === 0 && 'min-h-[30rem]',
                i > 0 && 'min-h-[28rem]',
              )}
            >
              <a.Icon className="size-9" />
              <h3 className="mt-6 text-[1.75rem] font-black leading-[1.05] sm:text-[1.9rem]">{a.title}</h3>
              <p className={cn('mt-3 flex-1', a.dark ? 'text-white/80' : 'text-ink-soft')}>{a.body}</p>
              <LinkButton to={a.to} variant={a.dark ? 'accent' : 'primary'} className="mt-8 w-fit">
                {a.cta}
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
