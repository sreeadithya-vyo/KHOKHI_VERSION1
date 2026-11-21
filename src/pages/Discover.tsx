import { useEffect, useState } from 'react'
import { getCities, getMatches, getProfiles, passProfile } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import type { City, RoommateProfile } from '@/types'
import { Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { FilterBar } from '@/components/discover/FilterBar'
import { LifestyleMatch } from '@/components/discover/LifestyleMatch'
import { PremiumNote } from '@/components/discover/PremiumNote'
import { ProfileCard, ProfileCardSkeleton } from '@/components/discover/ProfileCard'

const grid = 'grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2'

export default function Discover() {
  const { user, loading: authLoading } = useAuth()
  const toast = useToast()

  const [cities, setCities] = useState<City[] | null>(null)
  const [cityChoice, setCityChoice] = useState<City | 'All' | null>(null)
  const [budgetMax, setBudgetMax] = useState<number | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [profiles, setProfiles] = useState<RoommateProfile[] | null>(null)
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set())

  // Until the member picks a city, start from their own city when the feed has people there.
  const homeCity = user?.answers?.city
  const city = cityChoice ?? (homeCity && cities?.includes(homeCity) ? homeCity : 'All')
  const ready = !authLoading && cities !== null

  useEffect(() => {
    let live = true
    getCities().then((list) => live && setCities(list))
    getMatches().then((matches) => live && setConnectedIds(new Set(matches.map((m) => m.profileId))))
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    let live = true
    setProfiles(null)
    getProfiles({ city, budgetMax, tags }).then((result) => live && setProfiles(result))
    return () => {
      live = false
    }
  }, [ready, city, budgetMax, tags])

  function clearFilters() {
    setCityChoice('All')
    setBudgetMax(undefined)
    setTags([])
  }

  async function pass(profile: RoommateProfile) {
    await passProfile(profile.id)
    setProfiles((list) => list && list.filter((p) => p.id !== profile.id))
    toast(`Passed on ${profile.name.split(' ')[0]}`)
  }

  const markConnected = (profileId: string) => setConnectedIds((ids) => new Set(ids).add(profileId))

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
      <header>
        <h1 className="text-balance text-display font-black text-ink">Find your people</h1>
        <div className="mt-6 flex flex-col gap-5 sm:mt-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="max-w-md text-h3 font-normal text-ink-soft">
            Roommates ranked by how well their sleep, cleanliness and social habits fit yours.
          </p>
          {!authLoading && (
            <div className="md:shrink-0">
              <LifestyleMatch user={user} />
            </div>
          )}
        </div>
      </header>

      {user?.plan === 'free' && (
        <div className="mt-8">
          <PremiumNote />
        </div>
      )}

      <div className="h-6 sm:h-8" aria-hidden="true" />

      <FilterBar
        cities={cities ?? []}
        city={city}
        onCity={setCityChoice}
        budgetMax={budgetMax}
        onBudget={setBudgetMax}
        tags={tags}
        onTags={setTags}
        onClear={clearFilters}
      />

      <section aria-label="Matching people" aria-busy={profiles === null} className="mt-6">
        {profiles === null ? (
          <>
            <p className="sr-only" role="status">
              Loading people
            </p>
            <div className={grid}>
              {[0, 1, 2, 3].map((i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : profiles.length === 0 ? (
          <EmptyState
            title="No one matches these filters"
            description="Try a different city, a higher budget, or fewer lifestyle choices."
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <>
            <p className="mb-5 text-body font-semibold text-ink-soft" role="status">
              {profiles.length} {profiles.length === 1 ? 'person' : 'people'}, best matches first
            </p>
            <ul className={grid}>
              {profiles.map((p, i) => (
                <Reveal as="li" key={p.id} delay={(i % 2) * 90} className="flex">
                  <ProfileCard
                    profile={p}
                    connected={connectedIds.has(p.id)}
                    onConnected={markConnected}
                    onPass={pass}
                  />
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
