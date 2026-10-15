import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Home: GlobalConfig = {
  slug: 'home',
  admin: {
    group: 'Content',
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
    // Hero configuration
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heroName',
          type: 'text',
          defaultValue: 'Ansh Rajput',
          required: true,
          admin: {
            description: 'Hero lockscreen transformed title.',
          },
        },
        {
          name: 'heroTagline',
          type: 'text',
          defaultValue: 'Stop looking for the right developer. You just found one.',
          required: true,
          localized: true,
          admin: {
            description: 'Core tagline displayed beneath the name.',
          },
        },
        {
          name: 'cityLabel',
          type: 'text',
          defaultValue: 'Messina',
          admin: {
            description: 'Lockscreen clock city label.',
          },
        },
        {
          name: 'timezone',
          type: 'text',
          defaultValue: 'Europe/Rome',
          admin: {
            description: 'IANA Timezone for live clock display (e.g. Europe/Rome).',
          },
        },
        {
          name: 'buttonWorkLabel',
          type: 'text',
          defaultValue: 'See my work',
          localized: true,
        },
        {
          name: 'buttonWhatsAppLabel',
          type: 'text',
          defaultValue: 'Message me on WhatsApp',
          localized: true,
        },
        {
          name: 'whatsAppLink',
          type: 'text',
          defaultValue: 'https://wa.me/393514930310',
        },
        {
          name: 'honestNote',
          type: 'text',
          defaultValue: "These are the kinds of updates my clients' systems send every day.",
          localized: true,
        },
        {
          name: 'notifications',
          type: 'array',
          fields: [
            {
              name: 'app',
              type: 'relationship',
              relationTo: 'notification-apps',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'body',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'timings',
          type: 'group',
          fields: [
            {
              name: 'startInterval',
              type: 'number',
              defaultValue: 1200,
              admin: { description: 'Starting delay between cards in ms.' },
            },
            {
              name: 'acceleration',
              type: 'number',
              defaultValue: 0.88,
              admin: { description: 'Multiplier for each subsequent card delay.' },
            },
            {
              name: 'minimumInterval',
              type: 'number',
              defaultValue: 350,
              admin: { description: 'Minimum delay between cards in ms.' },
            },
          ],
        },
      ],
    },

    // Dynamic blocks layout
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        // 1. Three Facts
        {
          slug: 'threeFacts',
          labels: {
            singular: 'Three Facts Block',
            plural: 'Three Facts Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'facts' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'facts',
              type: 'array',
              fields: [
                {
                  name: 'statement',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'sourceNote',
                  type: 'text',
                  admin: {
                    description: 'Visible to you in admin only; never shown on public site.',
                  },
                },
              ],
            },
          ],
        },

        // 2. Work Feed
        {
          slug: 'workFeed',
          labels: {
            singular: 'Work Feed Block',
            plural: 'Work Feed Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'work' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Work',
              localized: true,
            },
            {
              name: 'description',
              type: 'text',
              defaultValue: 'Real systems solving real problems for real people.',
              localized: true,
            },
          ],
        },

        // 3. Growth Timeline
        {
          slug: 'growthTimeline',
          labels: {
            singular: 'Growth Timeline Block',
            plural: 'Growth Timeline Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'timeline' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Growth',
              localized: true,
            },
          ],
        },

        // 4. Audience Tabs ("What I can do for you")
        {
          slug: 'audienceTabs',
          labels: {
            singular: 'Audience Tabs Block',
            plural: 'Audience Tabs Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'services' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'What I can do for you',
              localized: true,
            },
            // Hire me tab
            {
              name: 'hireHeading',
              type: 'text',
              defaultValue: 'Hire me',
              localized: true,
            },
            {
              name: 'hireText',
              type: 'textarea',
              defaultValue:
                'I ship working systems and I can explain every decision. Looking for an internship in data, software or applied AI.',
              localized: true,
            },
            {
              name: 'hireButtonText',
              type: 'text',
              defaultValue: 'Download my CV',
              localized: true,
            },
            {
              name: 'hireButtonLink',
              type: 'text',
              defaultValue: '#contact',
            },

            // Your business tab
            {
              name: 'clientHeading',
              type: 'text',
              defaultValue: 'Your business',
              localized: true,
            },
            {
              name: 'clientText',
              type: 'textarea',
              defaultValue:
                "Tell me what's costing you time or money. I'll build the system that fixes it, and I stay to support it.",
              localized: true,
            },
            {
              name: 'clientButtonText',
              type: 'text',
              defaultValue: 'Message me on WhatsApp',
              localized: true,
            },
            {
              name: 'clientButtonLink',
              type: 'text',
              defaultValue: 'https://wa.me/393514930310',
            },

            // Build together tab
            {
              name: 'buildHeading',
              type: 'text',
              defaultValue: 'Build together',
              localized: true,
            },
            {
              name: 'buildText',
              type: 'textarea',
              defaultValue: 'Building something? I like hard problems with real users.',
              localized: true,
            },
            {
              name: 'buildButtonText',
              type: 'text',
              defaultValue: 'Email me',
              localized: true,
            },
            {
              name: 'buildButtonLink',
              type: 'text',
              defaultValue: 'mailto:anshr71t9@outlook.com',
            },
          ],
        },

        // 5. Cinema Block (optional)
        {
          slug: 'cinema',
          labels: {
            singular: 'Cinema Block',
            plural: 'Cinema Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: false },
            { name: 'anchorId', type: 'text', defaultValue: 'cinema' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Crossing the Genesis',
            },
            {
              name: 'credit',
              type: 'text',
              defaultValue: 'Written and directed by Harshita & Ansh Rajput',
            },
            {
              name: 'line',
              type: 'text',
              defaultValue:
                'An AI-generated sci-fi film made for the Future Vision XPRIZE competition.',
              localized: true,
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                description: 'Direct MP4/WebM video stream URL.',
              },
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'filmUrl',
              type: 'text',
              defaultValue: 'https://heygrow.in',
            },
          ],
        },

        // 6. Achievements Block
        {
          slug: 'achievements',
          labels: {
            singular: 'Achievements Block',
            plural: 'Achievements Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'achievements' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Achievements',
              localized: true,
            },
          ],
        },

        // 7. Contact Block
        {
          slug: 'contact',
          labels: {
            singular: 'Contact Block',
            plural: 'Contact Blocks',
          },
          fields: [
            { name: 'visible', type: 'checkbox', defaultValue: true },
            { name: 'anchorId', type: 'text', defaultValue: 'contact' },
            {
              name: 'audiences',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hire', value: 'hire' },
                { label: 'Client', value: 'client' },
                { label: 'Build', value: 'build' },
              ],
            },
            {
              name: 'hireHeading',
              type: 'text',
              defaultValue: "Looking for an intern who ships? Let's talk.",
              localized: true,
            },
            {
              name: 'clientHeading',
              type: 'text',
              defaultValue: "Tell me what's costing your business time or money.",
              localized: true,
            },
            {
              name: 'buildHeading',
              type: 'text',
              defaultValue: "Building something? Let's build it properly.",
              localized: true,
            },
            {
              name: 'defaultHeading',
              type: 'text',
              defaultValue: 'Say hello.',
              localized: true,
            },
            {
              name: 'subtext',
              type: 'textarea',
              defaultValue:
                'I usually respond within a few hours. Direct WhatsApp or email works best.',
              localized: true,
            },
            {
              name: 'email',
              type: 'text',
              defaultValue: 'anshr71t9@outlook.com',
            },
            {
              name: 'whatsApp',
              type: 'text',
              defaultValue: '+39 351 493 0310',
            },
            {
              name: 'privacyNote',
              type: 'text',
              defaultValue:
                'Privacy: This form stores your name, email, and message only for me to reply to you. You can ask for complete deletion at any time.',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
