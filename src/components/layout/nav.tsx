import type { ComponentType, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const Compass = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
)
const Heart = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
)
const Home = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
  </svg>
)
const Chat = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  </svg>
)
const Star = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
)

export interface NavItem {
  to: string
  label: string
  Icon: ComponentType<IconProps>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/discover', label: 'Discover', Icon: Compass },
  { to: '/matches', label: 'Matches', Icon: Heart },
  { to: '/stays', label: 'Stays', Icon: Home },
  { to: '/messages', label: 'Messages', Icon: Chat },
  { to: '/premium', label: 'Premium', Icon: Star },
]
