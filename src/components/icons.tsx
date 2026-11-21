import type { SVGProps } from 'react'

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

type P = SVGProps<SVGSVGElement>

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const ShieldCheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
)
export const CapIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m2.5 9.5 9.5-5 9.5 5-9.5 5z" />
    <path d="M6.5 12v4.2c0 .9 2.5 2.3 5.5 2.3s5.5-1.4 5.5-2.3V12" />
  </svg>
)
export const BriefcaseIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3 13h18" />
  </svg>
)
export const HomeCheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="m9 14 2 2 4-4" />
  </svg>
)
