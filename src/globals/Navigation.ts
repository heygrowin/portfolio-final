import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/')
        } catch {
          // ignore
        }
      },
    ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      defaultValue: [
        { label: 'Work', target: '#work' },
        { label: 'About', target: '#about' },
        { label: 'Contact', target: '#contact' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'target',
          type: 'text',
          required: true,
          admin: {
            description: 'Anchor target or URL (e.g. "#work", "#about", "#contact").',
          },
        },
      ],
    },
  ],
}
