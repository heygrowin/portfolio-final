import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { NotificationApps } from './collections/NotificationApps'
import { Projects } from './collections/Projects'
import { TimelineItems } from './collections/TimelineItems'
import { Achievements } from './collections/Achievements'

import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isPostgres =
  Boolean(process.env.DATABASE_URI) &&
  (process.env.DATABASE_URI!.startsWith('postgres://') ||
    process.env.DATABASE_URI!.startsWith('postgresql://'))

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— HeyGrowin Admin',
    },
  },
  collections: [
    Users,
    Media,
    NotificationApps,
    Projects,
    TimelineItems,
    Achievements,
  ],
  globals: [Home, SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ||
    'ansh-rajput-portfolio-payload-3-secret-key-development-32chars',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI!,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./payload.db',
        },
      }),
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Italian', code: 'it' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT,
            },
          }),
        ]
      : []),
  ],
})
