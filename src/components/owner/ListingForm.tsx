import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { createStay, getCities } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import { CheckIcon } from '@/components/icons'
import { Button, FilterChip, Input, Select, Textarea } from '@/components/ui'
import type { City, GenderPolicy, StayType } from '@/types'
import { AMENITY_OPTIONS, GENDER_POLICIES, STAY_TYPES } from './options'

interface RoomRow {
  key: number
  name: string
  occupancy: string
  rent: string
}

interface Values {
  title: string
  area: string
  city: City | ''
  type: StayType | ''
  genderPolicy: GenderPolicy | ''
  distanceNote: string
  description: string
  amenities: string[]
}

const EMPTY: Values = {
  title: '',
  area: '',
  city: '',
  type: '',
  genderPolicy: '',
  distanceNote: '',
  description: '',
  amenities: [],
}

const isWholeNumber = (v: string) => /^\d+$/.test(v.trim()) && Number(v) > 0

type Errors = Partial<Record<'title' | 'area' | 'city' | 'type' | 'genderPolicy' | 'description', string>> & {
  rooms: Record<number, { name?: string; occupancy?: string; rent?: string }>
}

function validate(v: Values, rooms: RoomRow[]): Errors {
  const e: Errors = { rooms: {} }
  if (!v.title.trim()) e.title = 'Add a title for your listing.'
  if (!v.area.trim()) e.area = 'Add the area or neighbourhood.'
  if (!v.city) e.city = 'Choose a city.'
  if (!v.type) e.type = 'Choose a property type.'
  if (!v.genderPolicy) e.genderPolicy = 'Choose who the space is for.'
  if (!v.description.trim()) e.description = 'Add a short description.'
  for (const r of rooms) {
    const re: Errors['rooms'][number] = {}
    if (!r.name.trim()) re.name = 'Name this room type.'
    if (!isWholeNumber(r.occupancy)) re.occupancy = 'Enter a whole number, 1 or more.'
    if (!isWholeNumber(r.rent)) re.rent = 'Enter the monthly rent as a whole number above 0.'
    if (Object.keys(re).length) e.rooms[r.key] = re
  }
  return e
}

const hasErrors = (e: Errors) => Object.keys(e).length > 1 || Object.keys(e.rooms).length > 0

function FieldError({ children }: { children?: string }) {
  return children ? <p className="mt-1.5 text-caption font-medium text-danger">{children}</p> : null
}

/**
 * One chapter of the form: a numbered lit arch and a large heading on the left (sticky on wide screens),
 * the fields on the right, a heavy ink rule between chapters.
 */
function Section({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description?: string
  children: ReactNode
}) {
  const headingId = useId()
  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="grid gap-6 border-t-2 border-ink py-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:py-12"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <span
          aria-hidden="true"
          className="arch flex h-14 w-11 items-end justify-center rounded-b-md bg-haldi pb-2 text-h3 font-black text-ink"
        >
          {step}
        </span>
        <h2 id={headingId} className="mt-4 text-h1 font-black">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-xs text-ink-soft">{description}</p>}
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </div>
  )
}

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export function ListingForm({ onPublished }: { onPublished: () => void }) {
  const toast = useToast()
  const nextKey = useRef(2)
  const [cities, setCities] = useState<City[]>([])
  const [values, setValues] = useState<Values>(EMPTY)
  const [rooms, setRooms] = useState<RoomRow[]>([{ key: 1, name: '', occupancy: '1', rent: '' }])
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    getCities().then((c) => live && setCities(c))
    return () => {
      live = false
    }
  }, [])

  const errors = submitted ? validate(values, rooms) : ({ rooms: {} } as Errors)

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }))
  const setRoom = (key: number, patch: Partial<RoomRow>) =>
    setRooms((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  const toggleAmenity = (a: string) =>
    setValues((v) => ({
      ...v,
      amenities: v.amenities.includes(a) ? v.amenities.filter((x) => x !== a) : [...v.amenities, a],
    }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFailure(null)
    if (hasErrors(validate(values, rooms))) return
    setBusy(true)
    try {
      await createStay({
        title: values.title,
        area: values.area,
        city: values.city as City,
        type: values.type as StayType,
        genderPolicy: values.genderPolicy as GenderPolicy,
        description: values.description,
        amenities: values.amenities,
        distanceNote: values.distanceNote,
        roomTypes: rooms.map((r) => ({ name: r.name.trim(), occupancy: Number(r.occupancy), rent: Number(r.rent) })),
      })
      toast('Listing published')
      setValues(EMPTY)
      setRooms([{ key: nextKey.current++, name: '', occupancy: '1', rent: '' }])
      setSubmitted(false)
      onPublished()
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not publish the listing. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const invalid = (msg?: string) => (msg ? { 'aria-invalid': true } : {})

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex items-start gap-4 rounded-card bg-haldi-soft px-5 py-4 text-ink sm:items-center sm:px-6">
        <span
          aria-hidden="true"
          className="arch mt-0.5 flex h-10 w-8 shrink-0 items-end justify-center rounded-b-sm bg-haldi pb-2 sm:mt-0"
        >
          <span className="size-2 rounded-full bg-ink" />
        </span>
        <p>
          New listings start as <strong>Pending verification</strong>. Renters will see them in Stays straight away, and
          the verified badge is added once the space has been checked.
        </p>
      </div>

      <div className="mt-8 lg:mt-10">
        <Section step={1} title="The space">
          <div>
            <Input
              label="Title"
              placeholder="e.g. Sunrise PG for working women"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              {...invalid(errors.title)}
            />
            <FieldError>{errors.title}</FieldError>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Input
                label="Area"
                placeholder="e.g. Koramangala"
                value={values.area}
                onChange={(e) => set('area', e.target.value)}
                {...invalid(errors.area)}
              />
              <FieldError>{errors.area}</FieldError>
            </div>
            <div>
              <Select
                label="City"
                value={values.city}
                onChange={(e) => set('city', e.target.value as City | '')}
                options={[{ value: '', label: 'Select a city' }, ...cities.map((c) => ({ value: c, label: c }))]}
                {...invalid(errors.city)}
              />
              <FieldError>{errors.city}</FieldError>
            </div>
            <div>
              <Select
                label="Property type"
                value={values.type}
                onChange={(e) => set('type', e.target.value as StayType | '')}
                options={[{ value: '', label: 'Select a type' }, ...STAY_TYPES.map((t) => ({ value: t, label: t }))]}
                {...invalid(errors.type)}
              />
              <FieldError>{errors.type}</FieldError>
            </div>
            <div>
              <Select
                label="Who is it for"
                value={values.genderPolicy}
                onChange={(e) => set('genderPolicy', e.target.value as GenderPolicy | '')}
                options={[
                  { value: '', label: 'Select a policy' },
                  ...GENDER_POLICIES.map((g) => ({ value: g, label: g })),
                ]}
                {...invalid(errors.genderPolicy)}
              />
              <FieldError>{errors.genderPolicy}</FieldError>
            </div>
          </div>
          <Input
            label="Distance or location note (optional)"
            placeholder="e.g. 10 minutes walk from the metro"
            value={values.distanceNote}
            onChange={(e) => set('distanceNote', e.target.value)}
          />
        </Section>

        <Section
          step={2}
          title="Rooms and rent"
          description="Add each kind of room you offer. The lowest rent is shown as the starting rent."
        >
          <ul className="divide-y divide-line">
            {rooms.map((r, i) => {
              const re = errors.rooms[r.key] ?? {}
              return (
                <li key={r.key} className="py-6 first:pt-0">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-h3 font-bold text-ink">Room type {i + 1}</p>
                    {rooms.length > 1 && (
                      <Button
                        variant="ghost"
                        onClick={() => setRooms((rs) => rs.filter((x) => x.key !== r.key))}
                        aria-label={`Remove room type ${i + 1}${r.name ? `: ${r.name}` : ''}`}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_8rem_10rem]">
                    <div>
                      <Input
                        label="Room name"
                        placeholder="e.g. Single occupancy"
                        value={r.name}
                        onChange={(e) => setRoom(r.key, { name: e.target.value })}
                        {...invalid(re.name)}
                      />
                      <FieldError>{re.name}</FieldError>
                    </div>
                    <div>
                      <Input
                        label="Occupancy"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        value={r.occupancy}
                        onChange={(e) => setRoom(r.key, { occupancy: e.target.value })}
                        {...invalid(re.occupancy)}
                      />
                      <FieldError>{re.occupancy}</FieldError>
                    </div>
                    <div>
                      <Input
                        label="Monthly rent (₹)"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        placeholder="e.g. 9500"
                        value={r.rent}
                        onChange={(e) => setRoom(r.key, { rent: e.target.value })}
                        {...invalid(re.rent)}
                      />
                      <FieldError>{re.rent}</FieldError>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setRooms((rs) => [...rs, { key: nextKey.current++, name: '', occupancy: '1', rent: '' }])}
          >
            <PlusIcon />
            Add another room type
          </Button>
        </Section>

        <Section step={3} title="Amenities" description="Choose everything the space offers.">
          <div className="flex flex-wrap gap-2.5">
            {AMENITY_OPTIONS.map((a) => {
              const active = values.amenities.includes(a)
              return (
                <FilterChip key={a} active={active} onClick={() => toggleAmenity(a)} className="h-11 gap-1.5 px-5">
                  {active && <CheckIcon className="size-4" strokeWidth={2.6} />}
                  {a}
                </FilterChip>
              )
            })}
          </div>
        </Section>

        <Section step={4} title="Description" description="Tell renters what the space is like and who it suits.">
          <div>
            <Textarea
              label="Description"
              placeholder="What is the space like, and who will it suit?"
              rows={6}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              {...invalid(errors.description)}
            />
            <FieldError>{errors.description}</FieldError>
          </div>
        </Section>
      </div>

      {submitted && hasErrors(errors) && (
        <p role="alert" className="mb-4 rounded-control bg-danger-soft px-4 py-3 text-caption font-medium text-danger">
          Some details are missing or need fixing. Check the fields marked above.
        </p>
      )}
      {failure && (
        <p role="alert" className="mb-4 rounded-control bg-danger-soft px-4 py-3 text-caption font-medium text-danger">
          {failure}
        </p>
      )}

      {/* On phones the publish action stays in reach above the tab bar. */}
      <div className="sticky bottom-14 z-30 -mx-4 border-t border-line bg-canvas px-4 py-3 sm:-mx-6 sm:px-6 md:static md:mx-0 md:border-t-2 md:border-ink md:bg-transparent md:px-0 md:py-8">
        <Button type="submit" size="lg" disabled={busy} className="w-full md:w-auto">
          {busy ? 'Publishing…' : 'Publish listing'}
        </Button>
      </div>
    </form>
  )
}
