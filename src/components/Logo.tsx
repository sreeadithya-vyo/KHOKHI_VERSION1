import { cn } from '@/lib/cn'

/** Lit-window mark (a haldi arch) plus the wordmark in extended black. Inherits text colour. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-h3 font-black leading-none tracking-tight', className)}
      style={{ fontStretch: '125%' }}
    >
      <svg viewBox="0 0 20 26" className="h-6 w-[1.1rem]" aria-hidden="true">
        <path
          d="M3 24V10.5a7 7 0 0 1 14 0V24z"
          fill="var(--color-haldi)"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      KHOKHI
    </span>
  )
}
