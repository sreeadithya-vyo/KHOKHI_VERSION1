import type { User } from '@/types'
import { inr } from '@/lib/format'
import { LinkButton } from '@/components/ui'
import { ScoreRing } from '@/components/ScoreRing'
import { Rise } from './Rise'

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-dusk px-3.5 py-1.5 text-caption font-semibold text-white ring-1 ring-inset ring-white/15">
      {children}
    </span>
  )
}

export function Result({ user }: { user: User }) {
  const { compatibility, answers } = user
  if (!compatibility || !answers) return null

  return (
    <div className="on-dark overflow-hidden bg-ink text-white">
      <div className="mx-auto grid min-h-[calc(100dvh_-_4rem_-_1px_-_var(--banner-h,0px))] max-w-6xl content-center gap-x-16 gap-y-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <Rise index={0}>
            <p className="text-h3 font-normal text-white/80">{user.name.split(' ')[0]}, your lifestyle profile is</p>
          </Rise>
          <Rise index={1}>
            <h1 className="mt-3 text-balance text-display font-black text-white">{compatibility.archetype}</h1>
          </Rise>
          <Rise index={2}>
            <p className="mt-6 max-w-xl text-h3 font-normal text-white/80">{compatibility.summary}</p>
          </Rise>
        </div>

        {/* The score sits in a white doorway with a haldi frame so the ink arc reads on the dark field. */}
        <Rise index={3} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="arch mx-auto w-full max-w-72 rounded-b-3xl bg-haldi p-2.5">
            <div className="arch flex flex-col items-center rounded-b-[1.15rem] bg-surface px-6 pb-8 pt-16 text-center text-ink">
              <ScoreRing score={compatibility.score} animate large />
              <p className="mt-4 text-h3 font-extrabold">Lifestyle match score</p>
              <p className="mt-2 text-caption text-muted">
                It shows how widely your answers fit other people. Flexible habits score higher. It is not a grade.
              </p>
            </div>
          </div>
        </Rise>

        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <Rise index={4}>
            <div className="flex flex-wrap gap-2">
              <Pill>{answers.sleepSchedule}</Pill>
              <Pill>{answers.cleanliness}</Pill>
              <Pill>{answers.socialCadence}</Pill>
              <Pill>{`${answers.communication} communicator`}</Pill>
              <Pill>{answers.smoking}</Pill>
              <Pill>{answers.city}</Pill>
              <Pill>{`${inr(answers.budgetMin)} to ${inr(answers.budgetMax)}`}</Pill>
            </div>
          </Rise>
          <Rise index={5}>
            <LinkButton to="/discover" variant="accent" size="lg" className="mt-9">
              See who matches you
            </LinkButton>
          </Rise>
          <Rise index={6}>
            <p className="mt-8 max-w-md border-t border-white/20 pt-5 text-caption text-white/75">
              This is a preference-based match built from your answers. It is not a scientific or psychological
              assessment, and it says nothing about any individual.
            </p>
          </Rise>
        </div>
      </div>
    </div>
  )
}
