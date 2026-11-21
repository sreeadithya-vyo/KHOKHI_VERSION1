import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'
import { AccountMenu } from './AccountMenu'
import { DemoBanner } from './DemoBanner'
import { NAV_ITEMS } from './nav'

/** Routes that render without the bottom tab bar (marketing + auth flow). */
const BARE_ROUTES = ['/', '/login', '/signup', '/onboarding']

export function AppShell() {
  const { pathname } = useLocation()
  const showTabBar = !BARE_ROUTES.includes(pathname)

  // New screen, new scroll position (the SPA would otherwise keep the previous page's offset).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="KHOKHI home" className="inline-flex h-11 items-center text-ink">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-pill px-4 py-2 text-body font-bold transition-colors duration-200',
                    isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-brand-100 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <AccountMenu />
        </div>
      </header>

      <main className={cn('flex-1', showTabBar && 'pb-20 md:pb-0')}>
        <Outlet />
      </main>

      {showTabBar && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line/70 bg-canvas/90 backdrop-blur-md md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-bold',
                  isActive ? 'text-ink' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={cn('arch absolute top-0 h-1 w-8 rounded-b-none bg-haldi transition-opacity', isActive ? 'opacity-100' : 'opacity-0')}
                  />
                  <item.Icon className="size-5" />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
