import type { ReactNode } from 'react'
import { CheckIcon } from '@/components/icons'
import { cn } from '@/lib/cn'
import type { Plan } from '@/types'
import { COMPARISON, type ComparisonRow, type PlanCell } from './comparison'
import { useLitOnView } from './useLitOnView'

/** The lit window: a small arch that fills with haldi (ink tick) once its row scrolls into view. */
function LitMark() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'arch flex h-10 w-8 shrink-0 items-end justify-center rounded-b-md bg-dusk pb-2 text-brand-300',
        'transition-colors duration-700 ease-out motion-reduce:transition-none',
        'group-data-[lit=true]:bg-haldi group-data-[lit=true]:text-ink',
      )}
    >
      <CheckIcon className="size-4" strokeWidth={2.6} />
    </span>
  )
}

/** Free column: quiet. A small lock and plain text, nothing that asks for attention. */
function QuietMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function FreeCell({ cell }: { cell: PlanCell }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-medium text-ink-soft">
      {cell.included ? <CheckIcon className="size-4 shrink-0 text-ink" aria-hidden="true" /> : <QuietMark />}
      {cell.text}
    </span>
  )
}

function PremiumCell({ cell }: { cell: PlanCell }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-h3 font-bold text-brand-200 transition-colors duration-700 motion-reduce:transition-none',
        'group-data-[lit=true]:text-white',
      )}
    >
      <LitMark />
      {cell.text}
    </span>
  )
}

function YourPlan({ show }: { show: boolean }) {
  return show ? (
    <span className="inline-flex items-center rounded-pill bg-haldi px-3 py-1 text-caption font-bold text-ink">
      Your plan
    </span>
  ) : null
}

function TableRow({ row, last }: { row: ComparisonRow; last: boolean }) {
  const { ref, lit } = useLitOnView<HTMLTableRowElement>()
  return (
    <tr ref={ref} data-lit={lit} className="group">
      <th scope="row" className="border-b border-line py-6 pr-6 align-top font-normal">
        <span className="block text-h3 font-bold text-ink">{row.feature}</span>
        <span className="mt-1 block max-w-sm text-caption text-muted">{row.detail}</span>
      </th>
      <td className="border-b border-line px-6 py-6 align-top">
        <FreeCell cell={row.free} />
      </td>
      <td
        className={cn(
          'bg-ink px-6 py-6 align-top',
          last ? 'rounded-b-card border-b border-ink' : 'border-b border-brand-500/30',
        )}
      >
        <PremiumCell cell={row.premium} />
      </td>
    </tr>
  )
}

function StackedRow({ row, plan }: { row: ComparisonRow; plan: 'free' | 'premium' }) {
  const { ref, lit } = useLitOnView<HTMLDivElement>()
  const cell = row[plan]
  return (
    <div ref={ref} data-lit={lit} className="group py-4">
      <dt className={cn('text-caption', plan === 'premium' ? 'text-brand-200' : 'text-muted')}>{row.feature}</dt>
      <dd className="mt-1.5">{plan === 'premium' ? <PremiumCell cell={cell} /> : <FreeCell cell={cell} />}</dd>
    </div>
  )
}

function PlanName({ children }: { children: ReactNode }) {
  return <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.75rem] font-black lg:text-h1">{children}</span>
}

/** Free vs Premium. A real table from md up; two stacked plan panels on phones. Rows light up as they enter view. */
export function PlanComparison({ plan }: { plan: Plan | null }) {
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">Free compared with Premium</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[38%] border-b-2 border-ink py-6 pr-6 align-bottom text-caption font-bold text-muted">
                What you get
              </th>
              <th scope="col" className="w-[27%] border-b-2 border-ink px-6 py-6 align-bottom">
                <PlanName>
                  <span className="text-ink">Free</span> <YourPlan show={plan === 'free'} />
                </PlanName>
              </th>
              <th
                scope="col"
                className="on-dark rounded-t-[3rem] border-b border-brand-500/30 bg-ink px-6 pb-6 pt-10 align-bottom"
              >
                <PlanName>
                  <span className="text-white">Premium</span> <YourPlan show={plan === 'premium'} />
                </PlanName>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <TableRow key={row.feature} row={row} last={i === COMPARISON.length - 1} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-5 md:hidden">
        {(
          [
            { id: 'free', name: 'Free' },
            { id: 'premium', name: 'Premium' },
          ] as const
        ).map((p) => (
          <section
            key={p.id}
            aria-label={`${p.name} plan`}
            className={cn(
              p.id === 'premium'
                ? 'on-dark rounded-b-card rounded-t-[3rem] bg-ink px-6 pb-4 pt-9'
                : 'rounded-card border border-line px-6 py-6',
            )}
          >
            <h3 className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 text-h2 font-black', p.id === 'premium' ? 'text-white' : 'text-ink')}>
              {p.name} <YourPlan show={plan === p.id} />
            </h3>
            <dl className={cn('mt-3 divide-y', p.id === 'premium' ? 'divide-brand-500/30' : 'divide-line')}>
              {COMPARISON.map((row) => (
                <StackedRow key={row.feature} row={row} plan={p.id} />
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  )
}
