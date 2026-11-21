import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Quiz } from '@/components/onboarding/Quiz'
import { Result } from '@/components/onboarding/Result'
import { Skeleton } from '@/components/ui'
import type { User } from '@/types'

export default function Onboarding() {
  const { user, loading, completeOnboarding } = useAuth()
  const [result, setResult] = useState<User | null>(null)

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14 sm:px-6">
        <Skeleton className="h-16 w-40 rounded-card" />
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (result) return <Result user={result} />

  return <Quiz onSubmit={async (answers) => setResult(await completeOnboarding(answers))} />
}
