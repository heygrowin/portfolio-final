import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import '../globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A2A2A',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.heygrow.in'),
  title: 'Ansh Rajput — I build the systems small businesses run on.',
  description:
    'Single-page portfolio of Ansh Rajput: founder of HeyGrowin and Data Analysis student at University of Messina. Real systems, real client stories, verified results.',
  alternates: {
    canonical: 'https://portfolio.heygrow.in',
  },
  openGraph: {
    title: 'Ansh Rajput — I build the systems small businesses run on.',
    description:
      'I build the systems small businesses run on, and they keep running. Data Analysis student, University of Messina.',
    url: 'https://portfolio.heygrow.in',
    siteName: 'Ansh Rajput Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ansh Rajput — I build the systems small businesses run on.',
    description:
      'I build the systems small businesses run on, and they keep running. Data Analysis student, University of Messina.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ansh Rajput',
    jobTitle: 'Founder of HeyGrowin & Data Analysis Student',
    worksFor: {
      '@type': 'Organization',
      name: 'HeyGrowin',
      url: 'https://heygrow.in',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Messina',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Messina',
        addressCountry: 'Italy',
      },
    },
    url: 'https://portfolio.heygrow.in',
    sameAs: [
      'https://in.linkedin.com/in/ansh-rajput-529328428',
      'https://github.com/heygrowin',
      'https://heygrow.in',
    ],
  }

  return (
    <html lang="en" className={ibmPlexSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  )
}
