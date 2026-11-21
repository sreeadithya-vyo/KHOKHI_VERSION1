import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Avatar, LinkButton, Skeleton } from '@/components/ui'

export function AccountMenu() {
  const { user, loading, logOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (loading) return <Skeleton className="size-8 rounded-full" />
  if (!user) {
    return (
      <LinkButton to="/login" size="sm" variant="secondary">
        Log in
      </LinkButton>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full"
      >
        <Avatar name={user.name} size="sm" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 rounded-card border border-line bg-surface p-2 shadow-lift">
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-caption text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex h-10 w-full items-center rounded-control px-3 text-left font-semibold text-ink-soft hover:bg-canvas"
            onClick={async () => {
              setOpen(false)
              await logOut()
              navigate('/')
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
