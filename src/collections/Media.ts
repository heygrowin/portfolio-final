import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'isConcept', 'updatedAt'],
  },
  access: {
    read: () => true, // Publicly readable for images
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1280,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Required screen-reader alt text for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional display caption.',
      },
    },
    {
      name: 'isConcept',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Tick for AI-generated or illustrative images that are not real screenshots or photos. An automatic "Concept visual" badge will appear.',
      },
    },
  ],
}
