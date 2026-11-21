import type { OnboardingAnswers, User, UserType } from '@/types'
import { mockCurrentUser } from '@/lib/mock/social'
import { computeCompatibility } from '@/lib/scoring'
import { delay } from './delay'

/*
 * Mock auth. Accounts live in sessionStorage so state survives a refresh for the session.
 * Passwords are neither stored nor checked here; the Supabase phase replaces all of this.
 */

interface Store {
  accounts: User[]
  currentId: string | null
}

const KEY = 'khokhi.session'

function load(): Store {
  const raw = sessionStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as Store) : { accounts: [mockCurrentUser], currentId: null }
}

let store = load()

const save = () => sessionStorage.setItem(KEY, JSON.stringify(store))
const current = () => store.accounts.find((u) => u.id === store.currentId) ?? null

export interface SignUpInput {
  name: string
  email: string
  password: string
  userType: Exclude<UserType, 'owner'>
}

export async function getCurrentUser(): Promise<User | null> {
  return delay(current(), 150)
}

export async function signUp({ name, email, userType }: SignUpInput): Promise<User> {
  const normalised = email.trim().toLowerCase()
  if (store.accounts.some((u) => u.email === normalised)) {
    throw new Error('An account with this email already exists. Log in instead.')
  }
  const user: User = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    email: normalised,
    userType,
    plan: 'free',
    onboarded: false,
  }
  store.accounts.push(user)
  store.currentId = user.id
  save()
  return delay(user, 350)
}

export async function logIn(email: string, _password: string): Promise<User> {
  const user = store.accounts.find((u) => u.email === email.trim().toLowerCase())
  if (!user) throw new Error('No account found with that email. Sign up to create one.')
  store.currentId = user.id
  save()
  return delay(user, 350)
}

export async function logOut(): Promise<void> {
  store.currentId = null
  save()
  return delay(undefined, 100)
}

/** Simulated upgrade: flips the current member's plan to premium. No payment happens. */
export async function upgradeToPremium(): Promise<User> {
  const user = current()
  if (!user) throw new Error('Log in to upgrade.')
  const updated: User = { ...user, plan: 'premium' }
  store = { ...store, accounts: store.accounts.map((u) => (u.id === user.id ? updated : u)) }
  save()
  return delay(updated, 800)
}

export async function completeOnboarding(answers: OnboardingAnswers): Promise<User> {
  const user = current()
  if (!user) throw new Error('You need to be logged in to finish onboarding.')
  const updated: User = { ...user, answers, compatibility: computeCompatibility(answers), onboarded: true }
  store = { ...store, accounts: store.accounts.map((u) => (u.id === user.id ? updated : u)) }
  save()
  return delay(updated, 600)
}
