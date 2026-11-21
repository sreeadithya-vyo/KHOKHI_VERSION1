import type { ReactNode } from 'react'
import type { StayType } from '@/types'
import { cn } from '@/lib/cn'

/**
 * Illustrated stay covers. There are no photos yet, so every stay gets a poster of itself:
 * an arch-topped panel in one flat colour (by property type) holding a small architectural motif.
 * Everything is built from shapes and `var(--color-…)` fills.
 */

type Tone = 'ink' | 'dusk' | 'haldi' | 'haldi-soft' | 'gulabi' | 'gulabi-soft' | 'brand-100' | 'surface'

const TONE_BG: Record<Tone, string> = {
  ink: 'bg-ink',
  dusk: 'bg-dusk',
  haldi: 'bg-haldi',
  'haldi-soft': 'bg-haldi-soft',
  gulabi: 'bg-gulabi',
  'gulabi-soft': 'bg-gulabi-soft',
  'brand-100': 'bg-brand-100',
  surface: 'bg-surface',
}

const v = (t: Tone) => `var(--color-${t})`

interface CoverConfig {
  /** Colour of the big arch. */
  main: Tone
  /** Colour of the small companion arch. */
  small: Tone
  /** Colour of the window pane inside the small arch. */
  pane: Tone
  /** Colour of the sun / lamp circle. */
  sun: Tone
}

const COVERS: Record<StayType, CoverConfig> = {
  PG: { main: 'gulabi', small: 'ink', pane: 'haldi', sun: 'haldi' },
  'Co-living': { main: 'haldi-soft', small: 'dusk', pane: 'haldi', sun: 'gulabi' },
  Hostel: { main: 'brand-100', small: 'haldi', pane: 'ink', sun: 'dusk' },
  Flat: { main: 'haldi', small: 'ink', pane: 'haldi', sun: 'gulabi' },
  'Private room': { main: 'gulabi-soft', small: 'haldi', pane: 'ink', sun: 'gulabi' },
  'Shared room': { main: 'dusk', small: 'gulabi', pane: 'dusk', sun: 'haldi' },
}

export const coverFor = (type: StayType): CoverConfig => COVERS[type] ?? COVERS.Flat
export const toneBg = (t: Tone) => TONE_BG[t]
export const toneVar = v

/** Path of an arch-topped rectangle. (x, y) is its top-left corner. */
const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}Z`

const INK = v('ink')
const DUSK = v('dusk')
const LIT = v('haldi')
const SOFT = v('haldi-soft')
const PINK = v('gulabi')
const WHITE = v('surface')

/** Fill for a window: true = lit. */
const lit = (on: boolean, off = DUSK) => (on ? LIT : off)

function PgMotif() {
  const windows: Array<[number, number, boolean]> = [
    [74, 128, true],
    [130, 128, false],
    [74, 174, false],
    [130, 174, true],
  ]
  return (
    <g>
      <rect x="58" y="112" width="124" height="188" fill={INK} />
      <rect x="50" y="104" width="140" height="10" rx="2" fill={DUSK} />
      {windows.map(([x, y, on]) => (
        <path key={`${x}-${y}`} d={arch(x, y, 36, 38)} fill={lit(on)} />
      ))}
      <path d={arch(108, 232, 24, 68)} fill={LIT} />
    </g>
  )
}

function CoLivingMotif() {
  const cols = [44, 100, 156]
  const rows = [
    [LIT, DUSK, LIT],
    [DUSK, PINK, DUSK],
  ]
  return (
    <g>
      <rect x="26" y="150" width="188" height="150" fill={INK} />
      <rect x="18" y="142" width="204" height="10" rx="2" fill={DUSK} />
      {rows.map((row, r) =>
        row.map((fill, c) => <path key={`${r}-${c}`} d={arch(cols[c]!, 164 + r * 44, 40, 34)} fill={fill} />),
      )}
      {[52, 108, 164].map((x) => (
        <path key={x} d={arch(x, 250, 24, 50)} fill={DUSK} />
      ))}
    </g>
  )
}

function HostelMotif() {
  return (
    <g>
      {/* the window above the bunk */}
      <path d={arch(94, 96, 52, 78)} fill={LIT} stroke={INK} strokeWidth="5" />
      <path d="M120 122V174M94 148H146" stroke={INK} strokeWidth="4" />
      {/* bunk bed */}
      <rect x="44" y="190" width="8" height="110" fill={INK} />
      <rect x="188" y="190" width="8" height="110" fill={INK} />
      <rect x="44" y="214" width="152" height="9" fill={INK} />
      <rect x="54" y="200" width="132" height="14" rx="7" fill={PINK} />
      <rect x="58" y="194" width="30" height="10" rx="5" fill={WHITE} />
      <rect x="44" y="266" width="152" height="9" fill={INK} />
      <rect x="54" y="252" width="132" height="14" rx="7" fill={LIT} />
      <rect x="58" y="246" width="30" height="10" rx="5" fill={WHITE} />
      <path d="M174 223V266M184 223V266M174 232h10M174 244h10M174 256h10" stroke={INK} strokeWidth="3" />
    </g>
  )
}

function FlatMotif() {
  return (
    <g>
      {/* the front door */}
      <path d={arch(70, 116, 100, 184)} fill={INK} />
      <path d={arch(84, 130, 72, 170)} fill={DUSK} />
      <path d={arch(100, 150, 40, 54)} fill={LIT} />
      <path d="M120 176V204M100 190H140" stroke={DUSK} strokeWidth="3" />
      <rect x="104" y="220" width="32" height="18" rx="3" fill={WHITE} />
      <path d="M110 229H130" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="146" cy="262" r="5" fill={LIT} />
      <rect x="56" y="288" width="128" height="12" fill={DUSK} />
      {/* neighbours' windows */}
      <path d={arch(20, 176, 34, 52)} fill={INK} />
      <path d={arch(26, 182, 22, 40)} fill={SOFT} />
      <path d={arch(186, 176, 34, 52)} fill={INK} />
      <path d={arch(192, 182, 22, 40)} fill={SOFT} />
    </g>
  )
}

function PrivateRoomMotif() {
  return (
    <g>
      <path d={arch(90, 92, 60, 88)} fill={LIT} stroke={INK} strokeWidth="5" />
      <path d="M120 122V180M90 150H150" stroke={INK} strokeWidth="4" />
      {/* bed */}
      <rect x="44" y="224" width="12" height="76" fill={INK} />
      <rect x="44" y="266" width="156" height="14" fill={INK} />
      <rect x="50" y="280" width="8" height="20" fill={INK} />
      <rect x="186" y="280" width="8" height="20" fill={INK} />
      <rect x="56" y="246" width="144" height="22" rx="8" fill={DUSK} />
      <rect x="98" y="240" width="102" height="28" rx="9" fill={PINK} />
      <rect x="60" y="236" width="34" height="16" rx="8" fill={WHITE} />
      {/* bedside lamp */}
      <rect x="214" y="262" width="12" height="38" fill={INK} />
      <path d="M208 262 214 242h12l6 20Z" fill={LIT} />
    </g>
  )
}

function SharedRoomMotif() {
  const line = { fill: 'none', stroke: WHITE, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const
  return (
    <g>
      <path d={arch(92, 96, 56, 84)} fill={LIT} stroke={WHITE} strokeWidth="3" />
      <path d="M120 124V180M92 152H148" stroke={DUSK} strokeWidth="4" />
      {/* two beds */}
      <path d="M26 192V268M26 244H108V268M26 268H108" {...line} />
      <rect x="40" y="222" width="30" height="14" rx="7" fill={WHITE} />
      <path d="M214 192V268M214 244H132V268M214 268H132" {...line} />
      <rect x="170" y="222" width="30" height="14" rx="7" fill={WHITE} />
      {/* lamp between the beds */}
      <circle cx="120" cy="236" r="7" fill={LIT} />
      <path d="M120 243V268" {...line} />
      <path d="M16 270H224" stroke={WHITE} strokeWidth="2" strokeOpacity="0.5" />
    </g>
  )
}

const MOTIFS: Record<StayType, () => ReactNode> = {
  PG: PgMotif,
  'Co-living': CoLivingMotif,
  Hostel: HostelMotif,
  Flat: FlatMotif,
  'Private room': PrivateRoomMotif,
  'Shared room': SharedRoomMotif,
}

interface CoverProps {
  type: StayType
  className?: string
  /** Mark the motif as a scroll-linked layer (the stay detail composition moves it a few percent). */
  parallax?: boolean
  children?: ReactNode
}

/** Arch-topped panel in the type's flat colour with its architectural motif. Size it with className. */
export function StayCover({ type, className, parallax, children }: CoverProps) {
  const cfg = coverFor(type)
  const Motif = MOTIFS[type] ?? MOTIFS.Flat
  return (
    <div className={cn('arch relative overflow-hidden rounded-b-lg', TONE_BG[cfg.main], className)}>
      <svg
        viewBox="0 0 240 300"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        focusable="false"
        data-depth={parallax ? '0.05' : undefined}
        data-scale={parallax ? '1.08' : undefined}
        className="absolute inset-0 size-full origin-bottom"
      >
        <Motif />
      </svg>
      {children}
    </div>
  )
}

/** The small companion arch: one window in the facade colour. Used in the stay detail composition. */
export function WindowPanel({ type, className, depth }: { type: StayType; className?: string; depth?: string }) {
  const cfg = coverFor(type)
  return (
    <div data-depth={depth} className={cn('arch relative overflow-hidden rounded-b-lg', TONE_BG[cfg.small], className)}>
      <svg
        viewBox="0 0 100 130"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full"
      >
        <path d={arch(24, 30, 52, 74)} fill={v(cfg.pane)} />
        <path d="M50 56V104M24 78H76" stroke={v(cfg.small)} strokeWidth="3" />
        <rect x="18" y="104" width="64" height="7" rx="2" fill={v(cfg.pane)} />
      </svg>
    </div>
  )
}
