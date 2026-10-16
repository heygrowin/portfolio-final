// Timing and state rules for the hero sequence. Pure functions.

export type HeroTimings = {
  startInterval: number // gap after the first card, ms
  acceleration: number // each gap = previous gap * this (below 1 = speeding up)
  minInterval: number // gaps never get shorter than this, ms
}

// Same constants as reference/hero-prototype.html.
export const FIRST_CARD_DELAY = 600
export const FINISH_DELAY = 650
export const SEEN_KEY = 'hg-hero-seen'

export const DEFAULT_TIMINGS: HeroTimings = {
  startInterval: 760,
  acceleration: 0.8,
  minInterval: 120,
}

// When each notification appears, and when the clock turns into the name.
export function buildSchedule(count: number, timings: HeroTimings = DEFAULT_TIMINGS) {
  const times: number[] = []
  let t = FIRST_CARD_DELAY
  let gap = timings.startInterval
  for (let i = 0; i < count; i++) {
    times.push(t)
    t += gap
    gap = Math.max(timings.minInterval, gap * timings.acceleration)
  }
  return { times, finishAt: t + FINISH_DELAY }
}

// The sequence only plays on a first visit, with motion allowed, and when the
// visitor didn't arrive on a link to somewhere else on the page (#work, #contact, etc.).
export function shouldPlaySequence(opts: { seen: boolean; reducedMotion: boolean; hash: string }) {
  return !opts.seen && !opts.reducedMotion && opts.hash.replace('#', '') === ''
}

// "{count} updates from systems I built" -> "14 updates from systems I built"
export function formatCount(template: string, count: number) {
  return template.replace('{count}', String(count))
}

// Fill in CMS timings, falling back to the prototype's values when a field is empty.
export function normaliseTimings(
  input?: Partial<Record<keyof HeroTimings, number | null>> | null
): HeroTimings {
  return {
    startInterval: input?.startInterval || DEFAULT_TIMINGS.startInterval,
    acceleration: input?.acceleration || DEFAULT_TIMINGS.acceleration,
    minInterval: input?.minInterval || DEFAULT_TIMINGS.minInterval,
  }
}
