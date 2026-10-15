import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Format slug into clean display title
  const formattedTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          backgroundImage:
            'radial-gradient(circle at 80% 90%, rgba(16, 185, 129, 0.25), transparent 50%), linear-gradient(to bottom, #0A2A2A, #0F172A)',
          padding: '70px 80px',
          color: '#F1F5F9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <span style={{ fontSize: '26px', fontWeight: 600, color: '#A8B3C4' }}>
            Ansh Rajput · HeyGrowin
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34D399',
              fontSize: '18px',
              fontWeight: 600,
              width: 'fit-content',
            }}
          >
            System Story
          </div>
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            {formattedTitle}
          </h1>
          <p
            style={{
              fontSize: '26px',
              color: 'rgba(241, 245, 249, 0.75)',
              margin: 0,
              maxWidth: '850px',
              lineHeight: 1.4,
            }}
          >
            I build the systems small businesses run on, and they keep running.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '24px',
            fontSize: '20px',
            color: 'rgba(241, 245, 249, 0.6)',
          }}
        >
          <span>portfolio.heygrow.in</span>
          <span>Messina, Italy</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
