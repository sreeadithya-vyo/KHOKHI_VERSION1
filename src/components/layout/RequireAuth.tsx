import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui'

/** Wraps routes that only make sense for a signed-in member (matches, messages). */
export function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6" aria-hidden="true">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
