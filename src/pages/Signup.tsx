import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button, Input, Select } from '@/components/ui'
import type { UserType } from '@/types'

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'professional', label: 'Working professional' },
]

export default function Signup() {
  const { user, signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<Exclude<UserType, 'owner'>>('student')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // A brand-new account lands here with onboarded=false, so this sends it to the quiz.
  if (user) return <Navigate to={user.onboarded ? '/discover' : '/onboarding'} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signUp({ name, email, password, userType })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.')
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="It takes a minute, then a short quiz about how you like to live."
      panelTitle="Someone’s room is waiting."
      panelText="Answer a short quiz about how you live and see who fits."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-ink underline decoration-2 underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Input label="Full name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          label="I am a"
          options={ROLES}
          value={userType}
          onChange={(e) => setUserType(e.target.value as Exclude<UserType, 'owner'>)}
        />
        {error && (
          <p role="alert" className="rounded-control bg-danger-soft px-3.5 py-2.5 text-caption font-medium text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
        <p className="text-caption text-muted">Demo build: no real account is created and nothing is sent anywhere.</p>
      </form>
    </AuthCard>
  )
}
