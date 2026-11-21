import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button, Input } from '@/components/ui'

export default function Login() {
  const { user, logIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Signed in (just now, or already): returning members go to Discover, others finish onboarding.
  if (user) return <Navigate to={user.onboarded ? '/discover' : '/onboarding'} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await logIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.')
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your matches and messages."
      footer={
        <>
          New to KHOKHI?{' '}
          <Link to="/signup" className="font-bold text-ink underline decoration-2 underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="rounded-control bg-danger-soft px-3.5 py-2.5 text-caption font-medium text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </Button>
        <p className="text-caption text-muted">
          Demo build: log in as aditi@example.com with any password to see a returning member. Passwords are not
          checked.
        </p>
      </form>
    </AuthCard>
  )
}
