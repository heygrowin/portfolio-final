import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
      name: 'name',
      type: 'text',
      defaultValue: 'Ansh Rajput',
      required: true,
    },
    {
      name: 'roleLine',
      type: 'text',
      defaultValue:
        'Founder of HeyGrowin · Data Analysis student, University of Messina',
      localized: true,
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Messina, Italy',
      localized: true,
    },
    {
      name: 'email',
      type: 'text',
      defaultValue: 'anshr71t9@outlook.com',
      required: true,
    },
    {
      name: 'whatsApp',
      type: 'text',
      defaultValue: '+39 351 493 0310',
      required: true,
    },
    {
      name: 'whatsAppLink',
      type: 'text',
      defaultValue: 'https://wa.me/393514930310',
      required: true,
    },
    {
      name: 'linkedIn',
      type: 'text',
      defaultValue: 'https://in.linkedin.com/in/ansh-rajput-529328428',
    },
    {
      name: 'github',
      type: 'text',
      defaultValue: 'https://github.com/heygrowin',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'businessSiteUrl',
      type: 'text',
      defaultValue: 'https://heygrow.in',
    },
    {
      name: 'cvModern',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Modern PDF version of Ansh CV.',
      },
    },
    {
      name: 'cvModernUrl',
      type: 'text',
      admin: {
        description: 'Fallback direct download link for Modern CV.',
      },
    },
    {
      name: 'cvEuropass',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Europass PDF version of Ansh CV.',
      },
    },
    {
      name: 'cvEuropassUrl',
      type: 'text',
      admin: {
        description: 'Fallback direct download link for Europass CV.',
      },
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          defaultValue:
            'Ansh Rajput — I build the systems small businesses run on.',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue:
            'Portfolio of Ansh Rajput: founder of HeyGrowin and Data Analysis student at University of Messina. Real systems, real client stories, verified results.',
          localized: true,
        },
      ],
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'analyticsToggle',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle cookieless Vercel Web Analytics.',
      },
    },
  ],
}
