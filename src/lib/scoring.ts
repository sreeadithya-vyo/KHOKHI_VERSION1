import type { CompatibilityResult, OnboardingAnswers } from '@/types'

/*
 * PREFERENCE-BASED, NOT A SCIENTIFIC ASSESSMENT.
 *
 * The archetype is a friendly label picked by simple rules from a few of the quiz answers.
 * The score is a rough measure of how widely your answers fit other people: middle-of-the-road
 * habits, more interests and a wider budget leave you open to more pairings, so they score
 * higher. It is not a personality test and says nothing about any individual.
 */

interface Archetype {
  name: string
  summary: string
  fits: (a: OnboardingAnswers) => boolean
}

const ARCHETYPES: Archetype[] = [
  {
    name: 'Quiet Curator',
    summary: 'You keep a calm, orderly home and recharge in it. You do best with someone who respects quiet and shares your standards.',
    fits: (a) => a.cleanliness === 'Spotless' && a.socialCadence === 'Homebody',
  },
  {
    name: 'Night Spark',
    summary: 'Late nights, full calendars, friends over. You pair well with someone who enjoys the energy or at least keeps the same hours.',
    fits: (a) => a.socialCadence === 'Social butterfly' && a.sleepSchedule === 'Night owl',
  },
  {
    name: 'Social Connector',
    summary: 'You like a lively home. You click with people who enjoy company and are happy to plan shared evenings.',
    fits: (a) => a.socialCadence === 'Social butterfly',
  },
  {
    name: 'Sunrise Organizer',
    summary: 'Early starts and a tidy kitchen. You match with people who value routine and an orderly morning.',
    fits: (a) => a.sleepSchedule === 'Early bird' && a.cleanliness !== 'Relaxed',
  },
  {
    name: 'Easy Rhythm',
    summary: 'You are relaxed about mess and schedules. You suit people who care more about good company than a spotless flat.',
    fits: (a) => a.cleanliness === 'Relaxed',
  },
  {
    name: 'Cozy Homebody',
    summary: 'Home is your reset. You do well with a considerate roommate who treats the evening as downtime.',
    fits: (a) => a.socialCadence === 'Homebody',
  },
]

const FALLBACK: Omit<Archetype, 'fits'> = {
  name: 'Zen Harmonizer',
  summary: 'Balanced, considerate and adaptable. You fit a wide range of people as long as everyone communicates openly.',
}

/** How open each answer leaves you to other people, from 0 to 1. */
function openness(a: OnboardingAnswers): number {
  const cleanliness = { Relaxed: 0.7, Tidy: 1, Spotless: 0.6 }[a.cleanliness]
  const sleep = a.sleepSchedule === 'Flexible' ? 1 : 0.7
  const social = a.socialCadence === 'Balanced' ? 1 : 0.75
  const smoking = { 'Fine outside': 1, 'Smoke-free home': 0.7, 'I smoke': 0.6 }[a.smoking]
  const interests = Math.min(1, 0.6 + 0.08 * a.interests.length)
  const budget = Math.min(1, 0.6 + (0.4 * (a.budgetMax - a.budgetMin)) / 8000)
  return (cleanliness + sleep + social + smoking + interests + budget) / 6
}

export function computeCompatibility(answers: OnboardingAnswers): CompatibilityResult {
  const archetype = ARCHETYPES.find((x) => x.fits(answers)) ?? FALLBACK
  return {
    archetype: archetype.name,
    score: Math.min(98, Math.round(openness(answers) * 100)),
    summary: archetype.summary,
  }
}
