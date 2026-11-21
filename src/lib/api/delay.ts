/** Simulates network latency so loading states are real. Removed when the backend lands. */
export const delay = <T>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))
