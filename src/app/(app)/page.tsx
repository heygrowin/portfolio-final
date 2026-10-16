import React from 'react'
import { PortfolioPage } from '@/components/PortfolioPage'
import {
  getFirebaseProjects,
  getFirebaseTimeline,
  getFirebaseAchievements,
  getFirebaseSettings,
  getFirebaseFacts,
} from '@/lib/firebaseDb'
import { HeroNotificationItem } from '@/components/Hero'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    for?: 'hire' | 'client' | 'build'
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const { for: audienceParam } = await searchParams

  // 1. Fetch live data from Firebase (with instant fallback defaults)
  const [
    projects,
    timelineItems,
    achievements,
    settings,
    facts,
  ] = await Promise.all([
    getFirebaseProjects(),
    getFirebaseTimeline(),
    getFirebaseAchievements(),
    getFirebaseSettings(),
    getFirebaseFacts(),
  ])

  // 2. Full set of 14 system notifications from the original prototype
  const heroNotifications: HeroNotificationItem[] = [
    {
      appName: 'Raja Nursery',
      appIcon: 'leaf',
      appColor: '#15803D',
      title: 'New online order',
      body: 'Someone just ordered plants from the website.',
    },
    {
      appName: 'Ansh Color Lab',
      appIcon: 'box',
      appColor: '#0F766E',
      title: 'Stock updated',
      body: "Today's sales are already in the inventory.",
    },
    {
      appName: 'SKOLAR',
      appIcon: 'cap',
      appColor: '#1E40AF',
      title: 'New student enquiry',
      body: 'A student wants to study in Italy.',
    },
    {
      appName: 'HeyBlog',
      appIcon: 'page',
      appColor: '#334155',
      title: 'Article published',
      body: 'Written, checked and published. Nobody touched it.',
    },
    {
      appName: 'AnandPic',
      appIcon: 'tag',
      appColor: '#B45309',
      title: 'Homepage updated',
      body: 'The owner changed the festive banner. No code needed.',
    },
    {
      appName: 'Raja Nursery',
      appIcon: 'leaf',
      appColor: '#15803D',
      title: 'Bill generated',
      body: 'Invoice ready at the counter.',
    },
    {
      appName: 'HeyGrowin Outreach',
      appIcon: 'send',
      appColor: '#0E7490',
      title: 'Follow-up due',
      body: 'A business is waiting for a reply today.',
    },
    {
      appName: 'SKOLAR',
      appIcon: 'cap',
      appColor: '#1E40AF',
      title: 'Application moved forward',
      body: 'Documents complete. Next step unlocked.',
    },
    {
      appName: 'Raja Nursery',
      appIcon: 'leaf',
      appColor: '#15803D',
      title: 'Pots logged',
      body: 'Every pot that left today is tracked.',
    },
    {
      appName: 'RevenueLoop',
      appIcon: 'shield',
      appColor: '#475569',
      title: 'Spend blocked',
      body: 'No money moves without a human yes.',
    },
    {
      appName: 'Ansh Color Lab',
      appIcon: 'box',
      appColor: '#0F766E',
      title: 'Stock updated',
      body: 'Evening sales synced.',
    },
    {
      appName: 'HeyBlog',
      appIcon: 'page',
      appColor: '#334155',
      title: 'Duplicate caught',
      body: 'Too close to an older post, so it was skipped.',
    },
    {
      appName: 'Raja Nursery',
      appIcon: 'leaf',
      appColor: '#15803D',
      title: 'New online order',
      body: 'Another order from the website.',
    },
    {
      appName: 'SKOLAR',
      appIcon: 'cap',
      appColor: '#1E40AF',
      title: 'New student enquiry',
      body: "A family is asking about Master's programmes.",
    },
  ]

  // 3. Hero Props
  const heroProps = {
    name: settings.heroName || 'Ansh Rajput',
    tagline: settings.heroTagline || 'Stop looking for the right developer. You just found one.',
    cityLabel: settings.cityLabel || 'Messina',
    timezone: settings.timezone || 'Europe/Rome',
    buttonWorkLabel: 'See my work',
    buttonWhatsAppLabel: 'Message me on WhatsApp',
    whatsAppLink: `https://wa.me/${settings.whatsAppItaly.replace(/[^0-9]/g, '')}`,
    honestNote: "These are the kinds of updates my clients' systems send every day.",
    notifications: heroNotifications,
  }

  // 4. Audience Tabs Data
  const audienceTabsData = {
    heading: 'What I can do for you',
    hire: {
      heading: 'Hire me',
      text: 'I ship working systems and I can explain every decision. Looking for an internship in data, software or applied AI.',
      buttonText: 'Download my CV',
      buttonLink: '#contact',
    },
    client: {
      heading: 'Your business',
      text: "Tell me what's costing you time or money. I'll build the system that fixes it, and I stay to support it.",
      buttonText: 'Message me on WhatsApp',
      buttonLink: `https://wa.me/${settings.whatsAppItaly.replace(/[^0-9]/g, '')}`,
    },
    build: {
      heading: 'Build together',
      text: 'Building something? I like hard problems with real users.',
      buttonText: 'Email me',
      buttonLink: `mailto:${settings.emailPersonal}`,
    },
  }

  // 5. Cinema props
  const cinema = {
    title: 'Crossing the Genesis',
    credit: 'Written and directed by Harshita & Ansh Rajput',
    line: 'An AI-generated sci-fi film made for the Future Vision XPRIZE competition.',
    videoUrl: undefined,
    posterUrl: undefined,
    filmUrl: 'https://heygrow.in',
    hidden: true,
  }

  // 6. Contact props
  const contactProps = {
    hireHeading: "Looking for an intern who ships? Let's talk.",
    clientHeading: "Tell me what's costing your business time or money.",
    buildHeading: "Building something? Let's build it properly.",
    defaultHeading: 'Say hello.',
    subtext: 'I usually respond within a few hours. Direct WhatsApp or email works best.',
    email: settings.emailPersonal,
    whatsApp: settings.whatsAppItaly,
    whatsAppLink: `https://wa.me/${settings.whatsAppItaly.replace(/[^0-9]/g, '')}`,
    cvModernUrl: '/cv-ansh-rajput.pdf',
    cvEuropassUrl: '/cv-europass-ansh-rajput.pdf',
    privacyNote:
      'Privacy: This form stores your name, email, and message only for me to reply to you. You can ask for complete deletion at any time.',
  }

  const navItems = [
    { label: 'Work', target: '#work' },
    { label: 'Growth', target: '#timeline' },
    { label: 'Contact', target: '#contact' },
  ]

  return (
    <PortfolioPage
      hero={heroProps}
      facts={facts}
      projects={projects}
      timelineItems={timelineItems}
      achievements={achievements}
      cinema={cinema}
      audienceTabsData={audienceTabsData}
      contact={contactProps}
      navItems={navItems}
      initialAudience={audienceParam || 'hire'}
    />
  )
}
