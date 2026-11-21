import type { ReportTarget } from '@/types'
import { delay } from './delay'
import { demo, newId, persist } from './state'

/** Mock report. Recorded in session state only; nothing is sent anywhere. */
export async function reportTarget(target: ReportTarget, reason: string): Promise<void> {
  demo.reports.push({ id: newId('rep'), kind: target.kind, targetId: target.id, reason, createdAt: new Date().toISOString() })
  persist()
  return delay(undefined, 400)
}

/** Blocks a profile (hidden from feed, matches, messages) or a stay (hidden from listings). */
export async function blockTarget(target: ReportTarget): Promise<void> {
  const list = target.kind === 'profile' ? demo.blockedProfileIds : demo.blockedStayIds
  if (!list.includes(target.id)) list.push(target.id)
  persist()
  return delay(undefined, 300)
}
