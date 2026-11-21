import { PlanComparison } from '@/components/premium/PlanComparison'
import { UpgradePanel } from '@/components/premium/UpgradePanel'
import { useAuth } from '@/context/AuthContext'
import { FREE_CONNECTION_LIMIT, PREMIUM_MATCH_THRESHOLD } from '@/lib/plan'

export default function Premium() {
  const { user } = useAuth()

  return (
    <>
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <h1 className="max-w-2xl text-display font-black text-white">See every match, not just the first few</h1>
            <p className="mt-6 max-w-xl text-h3 font-normal text-brand-200">
              On the free plan, matches at {PREMIUM_MATCH_THRESHOLD}% and above stay locked. Premium opens them up, lifts
              the connection limit and puts your profile in front of more people.
            </p>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-brand-500/40 pt-6">
              <div>
                <dt className="text-caption text-brand-200">Matches opened up</dt>
                <dd className="mt-1 text-h1 font-black text-haldi">{PREMIUM_MATCH_THRESHOLD}%+</dd>
              </div>
              <div>
                <dt className="text-caption text-brand-200">Connections, up from {FREE_CONNECTION_LIMIT}</dt>
                <dd className="mt-1 text-h1 font-black text-haldi">Unlimited</dd>
              </div>
            </dl>
          </div>
          <UpgradePanel />
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-24">
        <h2 id="compare-heading" className="mb-8 max-w-4xl text-h1 font-black lg:mb-12">
          Free and Premium side by side
        </h2>
        <PlanComparison plan={user?.plan ?? null} />
      </section>
    </>
  )
}
