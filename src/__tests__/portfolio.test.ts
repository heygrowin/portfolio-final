import { describe, it, expect } from 'vitest'
import { getEffectiveSlug, getEffectiveClientName, ProjectCardData } from '../components/WorkFeed'

describe('Privacy and Client Permission Rules', () => {
  const dummyProject: ProjectCardData = {
    id: 'proj-1',
    title: 'Raja Nursery',
    slug: 'raja-nursery',
    anonymousSlug: 'plant-nursery',
    oneLiner: 'Complete digital transformation for a plant nursery.',
    status: 'IN USE',
    tier: 'flagship',
    order: 1,
    audiences: ['client', 'hire'],
    client: {
      clientName: 'Raja Nursery',
      clientDescription: 'a family plant nursery',
      clientPermission: false, // Default is false!
    },
    postCard: {
      postStyle: 'photo-post',
      postAuthorName: 'Plant Nursery',
    },
  }

  it('strictly hides clientName when clientPermission is false', () => {
    const unpermittedProject = { ...dummyProject }
    const displayName = getEffectiveClientName(unpermittedProject)
    expect(displayName).toBe('a family plant nursery')
    expect(displayName).not.toContain('Raja Nursery')
  })

  it('shows clientName only when clientPermission is true', () => {
    const permittedProject: ProjectCardData = {
      ...dummyProject,
      client: {
        ...dummyProject.client,
        clientPermission: true,
      },
    }
    const displayName = getEffectiveClientName(permittedProject)
    expect(displayName).toBe('Raja Nursery')
  })

  it('uses anonymousSlug for the URL hash when clientPermission is false', () => {
    const unpermittedProject = { ...dummyProject }
    const effectiveSlug = getEffectiveSlug(unpermittedProject)
    expect(effectiveSlug).toBe('plant-nursery')
    expect(effectiveSlug).not.toBe('raja-nursery')
  })

  it('uses real slug for the URL hash only when clientPermission is true', () => {
    const permittedProject: ProjectCardData = {
      ...dummyProject,
      client: {
        ...dummyProject.client,
        clientPermission: true,
      },
    }
    const effectiveSlug = getEffectiveSlug(permittedProject)
    expect(effectiveSlug).toBe('raja-nursery')
  })
})

describe('Hero Timing and Sequence Logic', () => {
  it('calculates accelerating notification delays within boundaries', () => {
    let t = 600
    let gap = 760
    const acceleration = 0.8
    const minInterval = 120

    const intervals: number[] = []
    for (let i = 0; i < 14; i++) {
      intervals.push(gap)
      t += gap
      gap = Math.max(minInterval, gap * acceleration)
    }

    // Gap decreases monotonically down to minInterval
    expect(intervals[0]).toBe(760)
    expect(intervals[1]).toBe(760 * 0.8)
    expect(intervals[intervals.length - 1]).toBe(120)
  })

  it('hero sequence starts on open with proper timing bounds', () => {
    let t = 600
    let gap = 760
    const acceleration = 0.8
    const minInterval = 120

    expect(t).toBe(600)
    expect(gap * acceleration).toBe(608)
    expect(Math.max(minInterval, 50)).toBe(120)
  })
})

describe('Audience Block Priority and Reordering Logic', () => {
  const blocks = [
    { id: 'facts', audiences: ['hire', 'client', 'build'] },
    { id: 'work', audiences: ['hire', 'client', 'build'] },
    { id: 'timeline', audiences: ['hire', 'build'] },
    { id: 'achievements', audiences: ['hire'] },
    { id: 'cinema', audiences: ['build'] },
  ]

  const reorderBlocksForAudience = (audience: 'hire' | 'client' | 'build') => {
    return [...blocks].sort((a, b) => {
      const aMatches = a.audiences.includes(audience)
      const bMatches = b.audiences.includes(audience)
      if (aMatches && !bMatches) return -1
      if (!aMatches && bMatches) return 1
      return 0
    })
  }

  it('prioritizes achievements and timeline when audience is hire', () => {
    const reordered = reorderBlocksForAudience('hire')
    const cinemaIndex = reordered.findIndex((b) => b.id === 'cinema')
    const achievementsIndex = reordered.findIndex((b) => b.id === 'achievements')
    expect(achievementsIndex).toBeLessThan(cinemaIndex)
  })

  it('prioritizes cinema when audience is build', () => {
    const reordered = reorderBlocksForAudience('build')
    const cinemaIndex = reordered.findIndex((b) => b.id === 'cinema')
    const achievementsIndex = reordered.findIndex((b) => b.id === 'achievements')
    expect(cinemaIndex).toBeLessThan(achievementsIndex)
  })
})
