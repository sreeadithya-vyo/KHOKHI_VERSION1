import { useState } from 'react'
import { ListingForm } from '@/components/owner/ListingForm'
import { MyListings } from '@/components/owner/MyListings'
import { OwnerArches } from '@/components/owner/OwnerArches'
import { LinkButton, Skeleton, Tabs } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'

type Tab = 'add' | 'mine'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'add', label: 'Add a listing' },
  { id: 'mine', label: 'My listings' },
]

export default function ListYourSpace() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('add')

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-16">
      <header className="flex items-end justify-between gap-8">
        <div>
          <h1 className="text-display font-black">List your space</h1>
          <p className="mt-4 max-w-2xl text-h3 font-normal text-ink-soft">
            Add a PG, room, flat or hostel and reach renters who are moving to your city.
          </p>
        </div>
        <OwnerArches className="hidden shrink-0 md:flex" />
      </header>

      <div className="mt-10 lg:mt-14">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-72" />
            <Skeleton className="h-40 w-full max-w-3xl" />
          </div>
        ) : !user ? (
          <div className="max-w-xl rounded-card bg-gulabi p-6 text-ink sm:p-8">
            <span
              aria-hidden="true"
              className="arch mb-5 flex h-16 w-12 items-end justify-center rounded-b-md bg-surface pb-3"
            >
              <span className="size-3.5 rounded-full bg-haldi" />
            </span>
            <h2 className="text-h1 font-black">Log in to list your space</h2>
            <p className="mt-3 text-ink">
              You need an account so we can show your listings back to you and tell you when someone enquires.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/login">Log in</LinkButton>
              <LinkButton to="/signup" variant="secondary">
                Sign up
              </LinkButton>
            </div>
          </div>
        ) : (
          <>
            <Tabs label="Owner listings" tabs={TABS} value={tab} onChange={setTab} />
            <div role="tabpanel" className="mt-10">
              {tab === 'add' ? (
                <ListingForm onPublished={() => setTab('mine')} />
              ) : (
                <MyListings onAdd={() => setTab('add')} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
