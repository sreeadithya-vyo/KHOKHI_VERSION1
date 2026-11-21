import { useEffect, useState, type ReactNode } from 'react'
import { getCities } from '@/lib/api'
import { inr } from '@/lib/format'
import type {
  City,
  Cleanliness,
  CommunicationStyle,
  OnboardingAnswers,
  SleepSchedule,
  SmokingPreference,
  SocialCadence,
} from '@/types'
import { cn } from '@/lib/cn'
import { Button, ChoiceGroup, FilterChip, Select, Skeleton, type Option } from '@/components/ui'

/**
 * ChoiceGroup is shared, so its look is adjusted from a wrapper: bigger corners, and a chosen answer
 * lights up in haldi-soft with an ink edge (like a window with the lamp on).
 */
function Question({ children }: { children: ReactNode }) {
  return (
    <div className="border-t-2 border-ink pt-6 [&_label]:rounded-2xl [&_label]:has-[:checked]:border-ink [&_label]:has-[:checked]:bg-haldi-soft [&_legend]:text-h3 [&_legend]:font-extrabold">
      {children}
    </div>
  )
}

const CLEANLINESS: Option<Cleanliness>[] = [
  { value: 'Relaxed', label: 'Relaxed', hint: 'Cleaned when it needs it' },
  { value: 'Tidy', label: 'Tidy', hint: 'Wiped down and put away daily' },
  { value: 'Spotless', label: 'Spotless', hint: 'Everything has a place, always' },
]
const SLEEP: Option<SleepSchedule>[] = [
  { value: 'Early bird', label: 'Early bird', hint: 'Up early, asleep by 10:30' },
  { value: 'Flexible', label: 'Flexible', hint: 'Depends on the day' },
  { value: 'Night owl', label: 'Night owl', hint: 'Most active after 10 pm' },
]
const SOCIAL: Option<SocialCadence>[] = [
  { value: 'Homebody', label: 'Homebody', hint: 'Mostly quiet, guests now and then' },
  { value: 'Balanced', label: 'Balanced', hint: 'Friends over sometimes' },
  { value: 'Social butterfly', label: 'Social butterfly', hint: 'Often, and the more the better' },
]
const COMMUNICATION: Option<CommunicationStyle>[] = [
  { value: 'Direct', label: 'Direct', hint: 'Talk it through face to face' },
  { value: 'Gentle', label: 'Gentle', hint: 'Pick the right moment and soften it' },
  { value: 'In writing', label: 'In writing', hint: 'Send a message so everyone can think' },
]
const SMOKING: Option<SmokingPreference>[] = [
  { value: 'Smoke-free home', label: 'Smoke-free home', hint: 'I do not smoke and prefer none' },
  { value: 'Fine outside', label: 'Fine outside', hint: 'A balcony or outdoors is okay' },
  { value: 'I smoke', label: 'I smoke', hint: 'And I will say so up front' },
]

const INTERESTS = [
  'Running', 'Cooking', 'Gaming', 'Music', 'Reading', 'Travel', 'Football', 'Cricket',
  'Yoga', 'Photography', 'Movies', 'Coffee', 'Board games', 'Hiking', 'Art', 'Fitness',
]
const MAX_INTERESTS = 5

const BUDGET_STEPS = [4000, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000, 18000, 20000, 25000, 30000]
const BUDGET_OPTIONS = BUDGET_STEPS.map((v) => ({ value: String(v), label: inr(v) }))

interface Draft {
  cleanliness?: Cleanliness
  sleepSchedule?: SleepSchedule
  socialCadence?: SocialCadence
  communication?: CommunicationStyle
  smoking?: SmokingPreference
  interests: string[]
  budgetMin: number
  budgetMax: number
  city?: City
}

const STEP_TITLES = ['Your home habits', 'Living with others', 'What you enjoy', 'Budget and city']

interface Props {
  onSubmit: (answers: OnboardingAnswers) => Promise<void>
}

export function Quiz({ onSubmit }: Props) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({ interests: [], budgetMin: 8000, budgetMax: 16000 })
  const [cities, setCities] = useState<City[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    getCities().then((c) => live && setCities(c))
    return () => {
      live = false
    }
  }, [])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const budgetValid = draft.budgetMax >= draft.budgetMin

  const stepComplete = [
    !!draft.cleanliness && !!draft.sleepSchedule,
    !!draft.socialCadence && !!draft.communication && !!draft.smoking,
    draft.interests.length > 0,
    budgetValid && !!draft.city,
  ][step]!

  const last = step === STEP_TITLES.length - 1

  async function finish() {
    const { cleanliness, sleepSchedule, socialCadence, communication, smoking, city } = draft
    if (!cleanliness || !sleepSchedule || !socialCadence || !communication || !smoking || !city) return
    setBusy(true)
    setError(null)
    try {
      await onSubmit({
        cleanliness, sleepSchedule, socialCadence, communication, smoking, city,
        interests: draft.interests,
        budgetMin: draft.budgetMin,
        budgetMax: draft.budgetMax,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your answers.')
      setBusy(false)
    }
  }

  const toggleInterest = (name: string) =>
    set(
      'interests',
      draft.interests.includes(name)
        ? draft.interests.filter((i) => i !== name)
        : draft.interests.length < MAX_INTERESTS
          ? [...draft.interests, name]
          : draft.interests,
    )

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-end gap-5">
        <div
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={1}
          aria-valuemax={STEP_TITLES.length}
          aria-valuenow={step + 1}
          className="flex items-end gap-2.5"
        >
          {STEP_TITLES.map((title, i) => (
            <span
              key={title}
              aria-hidden="true"
              className={cn(
                'arch relative h-16 w-11 overflow-hidden rounded-b-md border-2 bg-surface transition-colors duration-500 motion-reduce:transition-none',
                i <= step ? 'border-ink' : 'border-ink/25',
              )}
            >
              <span
                className="absolute inset-x-0 bottom-0 bg-haldi transition-[height] duration-500 ease-out motion-reduce:transition-none"
                style={{ height: i < step ? '100%' : i === step ? '38%' : '0%' }}
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-1.5 text-center text-caption font-extrabold tabular-nums',
                  i <= step ? 'text-ink' : 'text-muted',
                )}
              >
                {i + 1}
              </span>
            </span>
          ))}
        </div>
        <p className="pb-1 text-caption font-semibold text-ink-soft">
          Step {step + 1} of {STEP_TITLES.length}
        </p>
      </div>

      <h1 className="mt-10 text-balance text-display font-black">{STEP_TITLES[step]}</h1>

      <div className="mt-10 flex flex-col gap-10">
        {step === 0 && (
          <>
            <Question>
              <ChoiceGroup legend="How tidy do you keep shared spaces?" name="cleanliness" options={CLEANLINESS}
                value={draft.cleanliness} onChange={(v) => set('cleanliness', v)} />
            </Question>
            <Question>
              <ChoiceGroup legend="When does your day run?" name="sleep" options={SLEEP}
                value={draft.sleepSchedule} onChange={(v) => set('sleepSchedule', v)} />
            </Question>
          </>
        )}

        {step === 1 && (
          <>
            <Question>
              <ChoiceGroup legend="How often is home a social space?" name="social" options={SOCIAL}
                value={draft.socialCadence} onChange={(v) => set('socialCadence', v)} />
            </Question>
            <Question>
              <ChoiceGroup legend="How do you handle a disagreement?" name="communication" options={COMMUNICATION}
                value={draft.communication} onChange={(v) => set('communication', v)} />
            </Question>
            <Question>
              <ChoiceGroup legend="How do you feel about smoking at home?" name="smoking" options={SMOKING}
                value={draft.smoking} onChange={(v) => set('smoking', v)} />
            </Question>
          </>
        )}

        {step === 2 && (
          <Question><fieldset>
            <legend className="text-h3 font-bold">What do you like doing?</legend>
            <p className="mt-1 text-ink-soft">
              Pick up to {MAX_INTERESTS}. Shared interests make the first message easier.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {INTERESTS.map((name) => (
                <FilterChip
                  key={name}
                  active={draft.interests.includes(name)}
                  disabled={!draft.interests.includes(name) && draft.interests.length >= MAX_INTERESTS}
                  onClick={() => toggleInterest(name)}
                  className="disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {name}
                </FilterChip>
              ))}
            </div>
            <p className="mt-3 text-caption text-muted" aria-live="polite">
              {draft.interests.length} of {MAX_INTERESTS} selected
            </p>
          </fieldset></Question>
        )}

        {step === 3 && (
          <>
            <Question><fieldset>
              <legend className="text-h3 font-bold">What can you spend on rent each month?</legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Select
                  label="From"
                  options={BUDGET_OPTIONS}
                  value={String(draft.budgetMin)}
                  onChange={(e) => set('budgetMin', Number(e.target.value))}
                />
                <Select
                  label="To"
                  options={BUDGET_OPTIONS}
                  value={String(draft.budgetMax)}
                  onChange={(e) => set('budgetMax', Number(e.target.value))}
                />
              </div>
              {!budgetValid && (
                <p role="alert" className="mt-3 text-caption font-medium text-danger">
                  The top of your range needs to be at least {inr(draft.budgetMin)}.
                </p>
              )}
            </fieldset></Question>

            <Question><fieldset>
              <legend className="text-h3 font-bold">Which city are you moving to?</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {cities
                  ? cities.map((c) => (
                      <FilterChip key={c} active={draft.city === c} onClick={() => set('city', c)}>
                        {c}
                      </FilterChip>
                    ))
                  : [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-pill" />)}
              </div>
            </fieldset></Question>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-control bg-danger-soft px-3.5 py-2.5 text-caption font-medium text-danger">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={busy}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button size="lg" disabled={!stepComplete || busy} onClick={last ? finish : () => setStep(step + 1)}>
          {last ? (busy ? 'Working out your match…' : 'See my result') : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
