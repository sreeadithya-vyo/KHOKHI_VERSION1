import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/discover', label: 'Discover people' },
      { to: '/matches', label: 'Matches' },
      { to: '/stays', label: 'Stays' },
      { to: '/premium', label: 'Premium' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Log in' },
      { to: '/signup', label: 'Sign up' },
      { to: '/list-your-space', label: 'List your space' },
    ],
  },
]

/** Ink footer. It sits directly under the skyline so the arches appear to grow out of it. */
export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo className="text-white" />
          <p className="mt-4 max-w-xs text-caption text-white/75">
            KHOKHI is an early product. Profiles, listings and verification you see here are still being built and
            tested.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-body font-bold text-haldi">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex min-h-8 items-center text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-caption text-white/70 sm:px-6">&copy; 2026 KHOKHI</p>
      </div>
    </footer>
  )
}
