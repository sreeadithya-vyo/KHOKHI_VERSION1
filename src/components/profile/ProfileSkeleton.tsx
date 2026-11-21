import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui'

/** Poster-shaped placeholder: the pink field with an arch rising from its edge, then the two columns. */
export function ProfileSkeleton({ back }: { back?: ReactNode }) {
  return (
    <div>
      <div className="bg-gulabi">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {back}
          <div aria-hidden="true" className="grid grid-cols-[auto_1fr] items-end gap-x-5 pt-4 lg:grid-cols-[auto_1fr_auto] lg:gap-x-10 lg:pt-10">
            <div className="order-1 col-span-2 flex flex-col gap-4 pb-8 lg:order-none lg:col-span-1 lg:pb-14">
              <Skeleton className="h-12 w-4/5 max-w-md lg:h-16" />
              <Skeleton className="h-5 w-64 max-w-full" />
              <Skeleton className="h-7 w-44" />
            </div>
            <Skeleton className="order-2 h-44 w-32 rounded-b-none rounded-t-full sm:h-60 sm:w-44 lg:order-first" />
            <Skeleton className="order-3 mb-6 size-40 justify-self-end rounded-card lg:mb-12 lg:size-52" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-14 w-full max-w-sm rounded-pill" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full max-w-prose" />
            <Skeleton className="mt-4 h-52 w-full" />
          </div>
          <Skeleton className="h-96 rounded-card" />
        </div>
      </div>
    </div>
  )
}
