import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { PortfolioPage } from '@/components/PortfolioPage'
import { FullProjectStory } from '@/components/StorySheet'
import { HeroNotificationItem } from '@/components/Hero'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    for?: 'hire' | 'client' | 'build'
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const { for: audienceParam } = await searchParams
  const payload = await getPayloadClient()

  // 1. Fetch CMS Globals
  let homeData: any = null
  let siteSettings: any = null
  let navigationData: any = null

  try {
    homeData = await payload.findGlobal({ slug: 'home', depth: 2 })
  } catch (err) {
    console.warn('Home global not found yet:', err)
  }

  try {
    siteSettings = await payload.findGlobal({ slug: 'site-settings', depth: 2 })
  } catch (err) {
    console.warn('SiteSettings global not found yet:', err)
  }

  try {
    navigationData = await payload.findGlobal({ slug: 'navigation', depth: 1 })
  } catch (err) {
    console.warn('Navigation global not found yet:', err)
  }

  // 2. Fetch Projects Collection
  let projectsData: any[] = []
  try {
    const res = await payload.find({
      collection: 'projects',
      depth: 2,
      sort: 'order',
      limit: 100,
    })
    projectsData = res.docs || []
  } catch (err) {
    console.warn('Projects collection not found yet:', err)
  }

  // 3. Fetch TimelineItems Collection
  let timelineDocs: any[] = []
  try {
    const res = await payload.find({
      collection: 'timeline-items',
      sort: 'order',
      limit: 100,
    })
    timelineDocs = res.docs || []
  } catch (err) {
    console.warn('Timeline items not found yet:', err)
  }

  // 4. Fetch Achievements Collection
  let achievementDocs: any[] = []
  try {
    const res = await payload.find({
      collection: 'achievements',
      sort: 'order',
      limit: 100,
    })
    achievementDocs = res.docs || []
  } catch (err) {
    console.warn('Achievements not found yet:', err)
  }

  // Map Hero Notifications from CMS
  // Client Privacy Rule: if clientPermission is not verified, use anonymousName!
  const rawNotifications = homeData?.hero?.notifications || []
  const notifications: HeroNotificationItem[] = rawNotifications.map((n: any) => {
    const appObj = typeof n.app === 'object' ? n.app : {}
    // Determine whether to use permitted name or anonymousName
    const appName = appObj?.anonymousName || appObj?.name || 'Client System'
    const appIcon = appObj?.icon || 'leaf'
    const appColor = appObj?.tileColor || '#0F766E'

    return {
      appName,
      appIcon,
      appColor,
      title: n.title,
      body: n.body,
    }
  })

  // Hero Props
  const heroProps = {
    name: homeData?.hero?.heroName || 'Ansh Rajput',
    tagline:
      homeData?.hero?.heroTagline ||
      'I build the systems small businesses run on.',
    cityLabel: homeData?.hero?.cityLabel || 'Messina',
    timezone: homeData?.hero?.timezone || 'Europe/Rome',
    buttonWorkLabel: homeData?.hero?.buttonWorkLabel || 'See my work',
    buttonWhatsAppLabel:
      homeData?.hero?.buttonWhatsAppLabel || 'Message me on WhatsApp',
    whatsAppLink:
      homeData?.hero?.whatsAppLink ||
      siteSettings?.whatsAppLink ||
      'https://wa.me/393514930310',
    honestNote:
      homeData?.hero?.honestNote ||
      "These are the kinds of updates my clients' systems send every day.",
    notifications:
      notifications.length > 0
        ? notifications
        : [
            {
              appName: 'Plant Nursery',
              appIcon: 'leaf',
              appColor: '#15803D',
              title: 'New online order',
              body: 'Someone just ordered plants from the website.',
            },
            {
              appName: 'Photo & Colour Lab',
              appIcon: 'box',
              appColor: '#0F766E',
              title: 'Stock updated',
              body: "Today's sales are already in the inventory.",
            },
            {
              appName: 'Study Abroad Consultancy',
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
          ],
    timings: homeData?.hero?.timings,
  }

  // Map Projects
  const mappedProjects: FullProjectStory[] = projectsData.map((doc: any) => {
    const postCard = doc.postCard || {}
    const client = doc.client || {}
    const atAGlance = doc.atAGlance || {}
    const story = doc.story || {}
    const quote = doc.quote || {}

    return {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      anonymousSlug: doc.anonymousSlug || doc.slug,
      oneLiner: doc.oneLiner,
      status: doc.status || 'IN USE',
      tier: doc.tier || 'supporting',
      order: doc.order || 1,
      audiences: doc.audiences || ['hire', 'client', 'build'],
      client: {
        clientName: client.clientName,
        clientDescription: client.clientDescription || 'a local business',
        clientPermission: Boolean(client.clientPermission),
      },
      postCard: {
        postStyle: postCard.postStyle || 'photo-post',
        postAuthorName: postCard.postAuthorName,
        postAuthorAvatarUrl: postCard.postAuthorAvatar?.url,
        postHeadline: postCard.postHeadline,
        postText: postCard.postText,
        threadPosts: postCard.threadPosts,
        chatBubbles: postCard.chatBubbles,
        postImageUrl: postCard.postImage?.url,
        postImageAlt: postCard.postImage?.alt,
        postImageIsConcept: Boolean(postCard.postImage?.isConcept),
        postTime: postCard.postTime,
        codeSnippet: postCard.codeSnippet,
      },
      atAGlance: {
        role: atAGlance.role,
        duration: atAGlance.duration,
        stack: atAGlance.stack,
        result: atAGlance.result,
      },
      story: {
        heroImageUrl: story.heroImage?.url || postCard.postImage?.url,
        heroImageAlt: story.heroImage?.alt || postCard.postImage?.alt,
        heroImageIsConcept: Boolean(story.heroImage?.isConcept),
        person: story.person,
        struggle: story.struggle,
        built: story.built,
        turningPoint: story.turningPoint,
        today: story.today,
      },
      gallery: (doc.gallery || []).map((g: any) => ({
        imageUrl: g.image?.url || '',
        caption: g.caption,
        alt: g.image?.alt,
        isConcept: Boolean(g.image?.isConcept),
      })),
      quote: {
        quoteText: quote.quoteText,
        quoteName: quote.quoteName,
        quotePhotoUrl: quote.quotePhoto?.url,
        quotePermission: Boolean(quote.quotePermission),
      },
      tradeOffs: doc.tradeOffs,
      links: doc.links,
    }
  })

  // Extract blocks from homeData layout if configured
  const layoutBlocks = homeData?.layout || []
  const factsBlock = layoutBlocks.find((b: any) => b.blockType === 'threeFacts')
  const cinemaBlock = layoutBlocks.find((b: any) => b.blockType === 'cinema')
  const audienceTabsBlock = layoutBlocks.find(
    (b: any) => b.blockType === 'audienceTabs'
  )
  const contactBlock = layoutBlocks.find((b: any) => b.blockType === 'contact')

  const facts = factsBlock?.facts || [
    {
      statement: '4 businesses run on systems I built',
      sourceNote: 'Raja Nursery, Ansh Color Lab, SKOLAR, AnandPic',
    },
    {
      statement: '2+ years — my longest-running system, still in daily use',
      sourceNote: 'Ansh Color Lab inventory tracker since 2024',
    },
    {
      statement: '300+ Google search queries my pages appear for',
      sourceNote: 'HeyBlog organic search impressions',
    },
  ]

  const timelineItems =
    timelineDocs.length > 0
      ? timelineDocs.map((t) => ({
          id: t.id,
          year: t.year,
          title: t.title,
          line: t.line,
          order: t.order,
        }))
      : [
          {
            year: '2022',
            title: 'Tech behind the stage',
            line: "Video editing, animation and web work for my school's annual functions (certified 2022 and 2023).",
          },
          {
            year: '2024',
            title: 'First client system',
            line: 'An inventory system still in use today.',
          },
          {
            year: '2025',
            title: 'NGO internship',
            line: "Led digital outreach for Samarpit's Girl Rising Project (4 months).",
          },
          {
            year: '2026',
            title: 'Moved to Messina for Bachelor’s in Data Analysis',
            line: 'HeyGrowin takes on clients in India and Italy.',
          },
          {
            year: 'Now',
            title: 'Building, studying, and looking for an internship',
            line: 'In data, software or applied AI.',
          },
        ]

  const achievements =
    achievementDocs.length > 0
      ? achievementDocs.map((a) => ({
          id: a.id,
          title: a.title,
          detail: a.detail,
          year: a.year,
          order: a.order,
        }))
      : [
          {
            title: 'SOF National Cyber Olympiad 2023–24',
            detail:
              'Gold Medal of Distinction; International Rank 275, Zonal Rank 24, School Rank 1.',
            year: '2023–24',
          },
          {
            title: '2nd place, AI & Robotics competition',
            detail: 'Krishna Public School.',
            year: '2025–26',
          },
          {
            title: '2nd place, Snapshot photography competition',
            detail: 'Krishna Public School.',
            year: '2025–26',
          },
          {
            title: '3rd place, Video Making',
            detail: '"Kalam Within Me" inter-school competition.',
            year: '2024',
          },
          {
            title: 'School Cyber In-charge',
            detail: 'Organised inter-school events including EVOLV 2025.',
            year: '2025',
          },
        ]

  const audienceTabsData = {
    heading: audienceTabsBlock?.heading || 'What I can do for you',
    hire: {
      heading: audienceTabsBlock?.hireHeading || 'Hire me',
      text:
        audienceTabsBlock?.hireText ||
        'I ship working systems and I can explain every decision. Looking for an internship in data, software or applied AI.',
      buttonText: audienceTabsBlock?.hireButtonText || 'Download my CV',
      buttonLink: audienceTabsBlock?.hireButtonLink || '#contact',
    },
    client: {
      heading: audienceTabsBlock?.clientHeading || 'Your business',
      text:
        audienceTabsBlock?.clientText ||
        "Tell me what's costing you time or money. I'll build the system that fixes it, and I stay to support it.",
      buttonText:
        audienceTabsBlock?.clientButtonText || 'Message me on WhatsApp',
      buttonLink:
        audienceTabsBlock?.clientButtonLink || 'https://wa.me/393514930310',
    },
    build: {
      heading: audienceTabsBlock?.buildHeading || 'Build together',
      text:
        audienceTabsBlock?.buildText ||
        'Building something? I like hard problems with real users.',
      buttonText: audienceTabsBlock?.buildButtonText || 'Email me',
      buttonLink:
        audienceTabsBlock?.buildButtonLink || 'mailto:anshr71t9@outlook.com',
    },
  }

  const cinema = {
    title: cinemaBlock?.title || 'Crossing the Genesis',
    credit:
      cinemaBlock?.credit ||
      'Written and directed by Harshita & Ansh Rajput',
    line:
      cinemaBlock?.line ||
      'An AI-generated sci-fi film made for the Future Vision XPRIZE competition.',
    videoUrl: cinemaBlock?.videoUrl,
    posterUrl: cinemaBlock?.poster?.url,
    filmUrl: cinemaBlock?.filmUrl || 'https://heygrow.in',
    hidden: cinemaBlock?.hidden ?? true,
  }

  const contactProps = {
    hireHeading:
      contactBlock?.hireHeading ||
      "Looking for an intern who ships? Let's talk.",
    clientHeading:
      contactBlock?.clientHeading ||
      "Tell me what's costing your business time or money.",
    buildHeading:
      contactBlock?.buildHeading ||
      "Building something? Let's build it properly.",
    defaultHeading: contactBlock?.defaultHeading || 'Say hello.',
    subtext:
      contactBlock?.subtext ||
      'I usually respond within a few hours. Direct WhatsApp or email works best.',
    email: siteSettings?.email || contactBlock?.email || 'anshr71t9@outlook.com',
    whatsApp:
      siteSettings?.whatsApp || contactBlock?.whatsApp || '+39 351 493 0310',
    whatsAppLink:
      siteSettings?.whatsAppLink || 'https://wa.me/393514930310',
    cvModernUrl:
      siteSettings?.cvModern?.url ||
      siteSettings?.cvModernUrl ||
      '/cv-ansh-rajput.pdf',
    cvEuropassUrl:
      siteSettings?.cvEuropass?.url ||
      siteSettings?.cvEuropassUrl ||
      '/cv-europass-ansh-rajput.pdf',
    privacyNote:
      contactBlock?.privacyNote ||
      'Privacy: This form stores your name, email, and message only for me to reply to you. You can ask for complete deletion at any time.',
  }

  const navItems = navigationData?.items?.length
    ? navigationData.items
    : [
        { label: 'Work', target: '#work' },
        { label: 'About', target: '#timeline' },
        { label: 'Contact', target: '#contact' },
      ]

  return (
    <PortfolioPage
      hero={heroProps}
      facts={facts}
      projects={mappedProjects}
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
