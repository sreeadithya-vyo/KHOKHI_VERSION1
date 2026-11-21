import { cn } from '@/lib/cn'

/** Small decorative trio of arches for the page header: one dark facade with a lit window, haldi, gulabi. */
export function OwnerArches({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('items-end gap-3', className)}>
      <span className="arch relative flex h-28 w-16 items-start justify-center rounded-b-md bg-ink pt-6">
        <span className="arch block h-12 w-7 rounded-b-sm bg-haldi" />
      </span>
      <span className="arch block h-36 w-16 rounded-b-md bg-haldi" />
      <span className="arch block h-20 w-16 rounded-b-md bg-gulabi" />
    </div>
  )
}
