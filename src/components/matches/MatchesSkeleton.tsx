import { Skeleton } from '@/components/ui'

export function MatchesSkeleton() {
  return (
    <ul aria-hidden="true" className="divide-y divide-line border-y border-line">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:gap-8 sm:py-8">
          <div className="flex flex-1 items-center gap-4 sm:gap-6">
            <Skeleton className="h-20 w-16 shrink-0 rounded-b-lg rounded-t-full" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-6 w-48 max-w-full" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-14 w-full sm:w-72" />
        </li>
      ))}
    </ul>
  )
}
