import type { CollectionConfig } from 'payload'

export const TimelineItems: CollectionConfig = {
  slug: 'timeline-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Year or time label (e.g. "2022", "2024", "2025", "2026", "Now").',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Milestone headline.',
      },
    },
    {
      name: 'line',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'One concise line describing the milestone.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Chronological display order.',
      },
    },
  ],
}
