import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Award / achievement title.',
      },
    },
    {
      name: 'detail',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Specific credential, ranking, or role detail.',
      },
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Year (e.g. "2023–24", "2025–26", "2025").',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Display order in the list.',
      },
    },
  ],
}
