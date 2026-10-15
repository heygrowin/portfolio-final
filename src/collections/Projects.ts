import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'tier', 'order', 'clientPermission'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/')
        } catch {
          // Ignore outside Next.js request context
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Project title (e.g. Raja Nursery).',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Real URL hash when clientPermission is ticked (e.g. "raja-nursery"). Used in /#slug.',
      },
    },
    {
      name: 'anonymousSlug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Safe anonymous hash when clientPermission is unticked (e.g. "plant-nursery"). Never leaks the client name.',
      },
    },
    {
      name: 'oneLiner',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Punchy one-sentence summary.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'IN USE',
      options: [
        { label: 'IN USE', value: 'IN USE' },
        { label: 'LIVE', value: 'LIVE' },
        { label: 'RUNNING', value: 'RUNNING' },
        { label: 'BUILDING', value: 'BUILDING' },
        { label: 'PIVOTED', value: 'PIVOTED' },
        { label: 'CONCEPT', value: 'CONCEPT' },
      ],
      admin: {
        description: 'Honest system status pill displayed on the card.',
      },
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'supporting',
      options: [
        { label: 'Flagship (shown first)', value: 'flagship' },
        { label: 'Supporting (revealed under "More work")', value: 'supporting' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Display order in the feed.',
      },
    },
    {
      name: 'audiences',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Hire (Recruiters / Engineering)', value: 'hire' },
        { label: 'Client (Business owners)', value: 'client' },
        { label: 'Build (Founders / Collaborators)', value: 'build' },
      ],
      admin: {
        description: 'Audiences this project appeals to for ?for= tab filtering/reordering.',
      },
    },

    // Post card group
    {
      name: 'postCard',
      type: 'group',
      fields: [
        {
          name: 'postStyle',
          type: 'select',
          required: true,
          defaultValue: 'photo-post',
          options: [
            { label: 'Photo Post (Instagram-style: avatar row, square image, caption)', value: 'photo-post' },
            { label: 'Team Message (Slack-style: avatar, name, time, preview image)', value: 'team-message' },
            { label: 'Professional Post (LinkedIn-style: avatar, name+headline, text, image)', value: 'pro-post' },
            { label: 'Thread (X/Twitter-style: connected short posts with line)', value: 'thread' },
            { label: 'Chat (WhatsApp-style: message bubbles)', value: 'chat' },
            { label: 'Commit Card (GitHub-style: dark card, commit msg, tests badge, code)', value: 'commit' },
          ],
        },
        {
          name: 'postAuthorName',
          type: 'text',
          admin: {
            description: 'Author name (e.g. "Ansh Rajput" or client name if permitted).',
          },
        },
        {
          name: 'postAuthorAvatar',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'postHeadline',
          type: 'text',
          admin: {
            description: 'One-line headline under name for pro-post.',
          },
        },
        {
          name: 'postText',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'threadPosts',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
          admin: {
            description: 'Used when postStyle is "thread" to render connected post items.',
          },
        },
        {
          name: 'chatBubbles',
          type: 'array',
          fields: [
            {
              name: 'sender',
              type: 'select',
              options: [
                { label: 'Client / Other', value: 'them' },
                { label: 'Me (Ansh)', value: 'me' },
              ],
              defaultValue: 'them',
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
          admin: {
            description: 'Used when postStyle is "chat" to render WhatsApp-style bubbles.',
          },
        },
        {
          name: 'postImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'postTime',
          type: 'text',
          defaultValue: 'now',
          admin: {
            description: 'Time label (e.g. "now", "2h", "yesterday").',
          },
        },
        {
          name: 'codeSnippet',
          type: 'textarea',
          admin: {
            description: 'Code snippet or commit diff for "commit" post style.',
          },
        },
      ],
    },

    // Client group
    {
      name: 'client',
      type: 'group',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          admin: {
            description: 'Real client name (e.g. "Raja Nursery").',
          },
        },
        {
          name: 'clientDescription',
          type: 'text',
          required: true,
          admin: {
            description:
              'Description used while permission is unticked (e.g. "a family plant nursery").',
          },
        },
        {
          name: 'clientPermission',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'CRITICAL: If unticked, clientName is strictly hidden everywhere, and the safe anonymousSlug is used.',
          },
        },
      ],
    },

    // At a glance
    {
      name: 'atAGlance',
      type: 'group',
      fields: [
        {
          name: 'role',
          type: 'text',
          localized: true,
        },
        {
          name: 'duration',
          type: 'text',
          localized: true,
        },
        {
          name: 'stack',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'result',
          type: 'text',
          localized: true,
        },
      ],
    },

    // Story chapters (result first, then the human story)
    {
      name: 'story',
      type: 'group',
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Hero image of the real result shown at top of the sheet.',
          },
        },
        {
          name: 'person',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Chapter 1: The person — who they are, in human words (20-50 words).',
          },
        },
        {
          name: 'struggle',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Chapter 2: The struggle — what was hurting (20-50 words).',
          },
        },
        {
          name: 'built',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Chapter 3: What I built — in plain words (20-50 words).',
          },
        },
        {
          name: 'turningPoint',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Chapter 4: The moment it changed — the turning point (20-50 words).',
          },
        },
        {
          name: 'today',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Chapter 5: Today — what is still running (20-50 words).',
          },
        },
      ],
    },

    // Gallery
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },

    // Customer Quote
    {
      name: 'quote',
      type: 'group',
      fields: [
        {
          name: 'quoteText',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'quoteName',
          type: 'text',
        },
        {
          name: 'quotePhoto',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'quotePermission',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Quote is strictly HIDDEN unless this permission is ticked.',
          },
        },
      ],
    },

    // Trade-offs
    {
      name: 'tradeOffs',
      type: 'array',
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },

    // Links
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
