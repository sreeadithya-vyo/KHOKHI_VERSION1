import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as api from '@/lib/api'
import type { SignUpInput } from '@/lib/api'
import type { OnboardingAnswers, User } from '@/types'

interface AuthValue {
  user: User | null
  loading: boolean
  signUp: (input: SignUpInput) => Promise<User>
  logIn: (email: string, password: string) => Promise<User>
  logOut: () => Promise<void>
  completeOnboarding: (answers: OnboardingAnswers) => Promise<User>
  upgradeToPremium: () => Promise<User>
}

const AuthContext = createContext<AuthValue | null>(null)

/** Thin React wrapper over src/lib/api auth functions. Holds no auth logic of its own. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    api.getCurrentUser().then((u) => {
      if (!live) return
      setUser(u)
      setLoading(false)
    })
    return () => {
      live = false
    }
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const u = await api.signUp(input)
    setUser(u)
    return u
  }, [])

  const logIn = useCallback(async (email: string, password: string) => {
    const u = await api.logIn(email, password)
    setUser(u)
    return u
  }, [])

  const logOut = useCallback(async () => {
    await api.logOut()
    setUser(null)
  }, [])

  const completeOnboarding = useCallback(async (answers: OnboardingAnswers) => {
    const u = await api.completeOnboarding(answers)
    setUser(u)
    return u
  }, [])

  const upgradeToPremium = useCallback(async () => {
    const u = await api.upgradeToPremium()
    setUser(u)
    return u
  }, [])

  const value = useMemo(
    () => ({ user, loading, signUp, logIn, logOut, completeOnboarding, upgradeToPremium }),
    [user, loading, signUp, logIn, logOut, completeOnboarding, upgradeToPremium],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
