import type { CollectionConfig } from 'payload'

export const NotificationApps: CollectionConfig = {
  slug: 'notification-apps',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'anonymousName', 'icon', 'tileColor'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Real client / system name (shown only when clientPermission is ticked).',
      },
    },
    {
      name: 'anonymousName',
      type: 'text',
      required: true,
      admin: {
        description:
          'Name shown while clientPermission is unticked (e.g. "Plant Nursery", "Photo & Colour Lab"). Never leaks private names.',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'leaf',
      options: [
        { label: 'Leaf (e.g. Nursery, Organic)', value: 'leaf' },
        { label: 'Box (e.g. Inventory, Labs, Logistics)', value: 'box' },
        { label: 'Cap (e.g. Education, Study Abroad)', value: 'cap' },
        { label: 'Page (e.g. Blog, Publishing)', value: 'page' },
        { label: 'Tag (e.g. Retail, Banners, Offers)', value: 'tag' },
        { label: 'Send (e.g. Outreach, CRM, Messages)', value: 'send' },
        { label: 'Shield (e.g. Security, Financial Guard)', value: 'shield' },
        { label: 'Camera (e.g. Photography, Media)', value: 'camera' },
        { label: 'Cart (e.g. E-commerce, Orders)', value: 'cart' },
        { label: 'Chart (e.g. Analytics, Metrics)', value: 'chart' },
      ],
      admin: {
        description: 'Fixed line icon choice for the iOS-style app tile.',
      },
    },
    {
      name: 'tileColor',
      type: 'select',
      required: true,
      defaultValue: '#15803D',
      options: [
        { label: 'Green (#15803D - Nursery)', value: '#15803D' },
        { label: 'Teal (#0F766E - Lab / Brand)', value: '#0F766E' },
        { label: 'Blue (#1E40AF - SKOLAR / Consultancy)', value: '#1E40AF' },
        { label: 'Slate (#334155 - HeyBlog)', value: '#334155' },
        { label: 'Amber (#B45309 - AnandPic)', value: '#B45309' },
        { label: 'Cyan (#0E7490 - Outreach)', value: '#0E7490' },
        { label: 'Gray (#475569 - RevenueLoop)', value: '#475569' },
        { label: 'Emerald (#10B981 - Pulse Accent)', value: '#10B981' },
      ],
      admin: {
        description: 'Tile background color from the fixed brand-safe palette.',
      },
    },
  ],
}
