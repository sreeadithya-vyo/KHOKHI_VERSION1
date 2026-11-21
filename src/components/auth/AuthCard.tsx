import type { ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { ArchFacade, ArchStrip } from './ArchFacade'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
  /** Short line of white copy on the ink panel. */
  panelTitle?: string
  panelText?: string
}

/**
 * Split auth layout. From `lg` the left half is a full-height ink panel with a skyline of lit arch
 * windows; below it collapses to a slim ink strip. The form sits on the canvas, no card around it.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  panelTitle = 'Every window is someone’s room.',
  panelText = 'KHOKHI helps you find the ones that fit.',
}: Props) {
  return (
    <div className="grid min-h-[calc(100dvh_-_4rem_-_1px_-_var(--banner-h,0px))] lg:grid-cols-2">
      <aside className="on-dark relative overflow-hidden bg-ink text-white">
        {/* Small screens: slim header strip */}
        <div className="flex items-end justify-between gap-4 px-4 pt-5 sm:px-6 lg:hidden">
          <p className="pb-4 text-body font-bold" style={{ fontStretch: '112%' }}>
            {panelTitle}
          </p>
          <ArchStrip />
        </div>

        {/* lg and up: full-height panel */}
        <div className="hidden h-full flex-col px-12 pt-12 lg:flex xl:px-16 xl:pt-14">
          <Logo className="text-white" />
          <h2 className="mt-12 max-w-md text-h1 font-black text-white xl:mt-16">{panelTitle}</h2>
          <p className="mt-4 max-w-sm text-h3 font-normal text-white/80">{panelText}</p>
          <div className="mt-10 min-h-56 flex-1">
            <ArchFacade />
          </div>
        </div>
      </aside>

      <section className="flex items-center px-4 py-10 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-h1 font-black">{title}</h1>
          <p className="mt-3 text-ink-soft">{subtitle}</p>
          <div className="mt-9">{children}</div>
          <p className="mt-8 border-t border-line pt-6 text-ink-soft">{footer}</p>
        </div>
      </section>
    </div>
  )
}
