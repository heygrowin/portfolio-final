import { getPayload } from 'payload'
import config from '../src/payload.config'

export async function seedDatabase() {
  console.log('--- Starting Idempotent Database Seed ---')
  const payload = await getPayload({ config })

  // 1. Seed Admin User
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: 'anshr71t9@outlook.com' } },
  })

  if (existingUsers.totalDocs === 0) {
    console.log('Creating Admin User: anshr71t9@outlook.com')
    await payload.create({
      collection: 'users',
      data: {
        email: 'anshr71t9@outlook.com',
        name: 'Ansh Rajput',
        password: 'Password123!',
      },
    })
  } else {
    console.log('Admin user already exists.')
  }

  // 2. Seed Notification Apps
  const appsData = [
    {
      name: 'Raja Nursery',
      anonymousName: 'Plant Nursery',
      icon: 'leaf' as const,
      tileColor: '#15803D' as const,
    },
    {
      name: 'Ansh Color Lab',
      anonymousName: 'Photo & Colour Lab',
      icon: 'box' as const,
      tileColor: '#0F766E' as const,
    },
    {
      name: 'SKOLAR',
      anonymousName: 'Study Abroad Consultancy',
      icon: 'cap' as const,
      tileColor: '#1E40AF' as const,
    },
    {
      name: 'HeyBlog',
      anonymousName: 'Autonomous Publishing Blog',
      icon: 'page' as const,
      tileColor: '#334155' as const,
    },
    {
      name: 'AnandPic',
      anonymousName: 'Store System',
      icon: 'tag' as const,
      tileColor: '#B45309' as const,
    },
    {
      name: 'HeyGrowin Outreach',
      anonymousName: 'Outreach & CRM Engine',
      icon: 'send' as const,
      tileColor: '#0E7490' as const,
    },
    {
      name: 'RevenueLoop',
      anonymousName: 'Spending Guard System',
      icon: 'shield' as const,
      tileColor: '#475569' as const,
    },
  ]

  const appMap: Record<string, any> = {}

  for (const app of appsData) {
    const existing = await payload.find({
      collection: 'notification-apps',
      where: { name: { equals: app.name } },
    })

    if (existing.totalDocs > 0) {
      appMap[app.name] = existing.docs[0].id
    } else {
      const created = await payload.create({
        collection: 'notification-apps',
        data: app,
      })
      appMap[app.name] = created.id
      console.log(`Created NotificationApp: ${app.name}`)
    }
  }

  // 3. Seed Projects
  const projectsData = [
    {
      title: 'Raja Nursery',
      slug: 'raja-nursery',
      anonymousSlug: 'plant-nursery',
      oneLiner:
        'From zero online presence to a complete digital store, billing software and pot tracking.',
      status: 'IN USE' as const,
      tier: 'flagship' as const,
      order: 1,
      audiences: ['client' as const, 'hire' as const],
      client: {
        clientName: 'Raja Nursery',
        clientDescription: 'a family plant nursery',
        clientPermission: false, // Hidden until confirmed
      },
      postCard: {
        postStyle: 'photo-post' as const,
        postAuthorName: 'Plant Nursery',
        postHeadline: 'Family plant nursery digital transition',
        postText:
          'Plants leaving the counter today are billed, inventoried, and tracked automatically. No paper slips lost.',
        postTime: 'now',
      },
      atAGlance: {
        role: 'Designed, built and supports everything',
        duration: '[confirm: Duration in use]',
        stack: [
          { tag: 'Next.js' },
          { tag: 'Node.js' },
          { tag: 'Tailwind' },
          { tag: 'PostgreSQL' },
        ],
        result:
          'From no website to an online store with custom billing and pot tracking.',
      },
      story: {
        person:
          'A hardworking family running a beloved local nursery, whose passion for plants deserved a modern system.',
        struggle:
          'Counter sales were noted on paper pads, pot stock counts took hours after closing, and local plant lovers had no way to browse inventory online.',
        built:
          'A mobile-friendly catalogue, counter billing system, and a live pot-tracking register that anyone on the team can operate without technical training.',
        turningPoint:
          'The first Saturday rush where counter lines moved twice as fast and online pre-orders were ready for pickup without confusion.',
        today:
          'Both the e-commerce store and internal counter software run daily, supported with same-day fixes whenever needed.',
      },
      tradeOffs: [
        {
          point:
            'Chose an intuitive single-screen cashier interface over complex enterprise ERP features to keep training time to under 10 minutes.',
        },
      ],
      links: [],
    },
    {
      title: 'Ansh Color Lab',
      slug: 'ansh-color-lab',
      anonymousSlug: 'color-lab',
      oneLiner:
        'Inventory management system running non-stop for 2+ years with same-day support.',
      status: 'IN USE' as const,
      tier: 'flagship' as const,
      order: 2,
      audiences: ['client' as const, 'hire' as const],
      client: {
        clientName: 'Ansh Color Lab',
        clientDescription: 'a local photo and colour lab [confirm]',
        clientPermission: false,
      },
      postCard: {
        postStyle: 'team-message' as const,
        postAuthorName: 'Photo & Colour Lab',
        postHeadline: 'Operations & Inventory',
        postText:
          'Stock reconciled for the day. Paper rolls, inks, and prints logged without manual counts.',
        postTime: '2h ago',
      },
      atAGlance: {
        role: 'Built and supports it',
        duration: '2+ years in continuous daily use',
        stack: [
          { tag: 'TypeScript' },
          { tag: 'React' },
          { tag: 'PostgreSQL' },
          { tag: 'Node.js' },
        ],
        result: 'Daily inventory runs on it without interruption.',
      },
      story: {
        person:
          'A printing and colour laboratory where timing, chemical supplies, and high-grade photo paper mean everything.',
        struggle:
          'High seasonal demand caused sudden shortages of key print materials because paper usage was tracked on physical clipboards.',
        built:
          'A real-time stock tracking dashboard that decrements materials automatically as printing jobs are completed.',
        turningPoint:
          'During peak wedding season when zero printing jobs were delayed due to stock shortages for the first time in years.',
        today:
          'Now in its third consecutive year of continuous daily operation, backed by same-day fixes whenever a new need arises.',
      },
      tradeOffs: [
        {
          point:
            'Prioritized offline-first resilience so operations never stall during internet dropouts.',
        },
      ],
    },
    {
      title: 'SKOLAR',
      slug: 'skolar',
      anonymousSlug: 'study-abroad',
      oneLiner:
        'Conversion website and student workflow management portal for studying in Italy.',
      status: 'LIVE' as const,
      tier: 'flagship' as const,
      order: 3,
      audiences: ['client' as const, 'hire' as const],
      client: {
        clientName: 'SKOLAR',
        clientDescription: 'a study-abroad consultancy in Italy',
        clientPermission: false,
      },
      postCard: {
        postStyle: 'pro-post' as const,
        postAuthorName: 'Study Abroad Consultancy',
        postHeadline: 'International Student Advisory · Italy',
        postText:
          'New student enquiry received for European Master’s programmes. Document pipeline ready for verification.',
        postTime: '4h ago',
      },
      atAGlance: {
        role: 'Web platform & student workflow management',
        duration: '[confirm: Duration]',
        stack: [
          { tag: 'Next.js' },
          { tag: 'TypeScript' },
          { tag: 'Tailwind' },
          { tag: 'PostgreSQL' },
        ],
        result: 'Brings qualified student leads and manages document workflows.',
      },
      story: {
        person:
          'Academic advisors helping ambitious students navigate Italian university admissions, visas, and documentation.',
        struggle:
          'Student documents were scattered across email threads and WhatsApp chats, creating risk of missed embassy deadlines.',
        built:
          'An authoritative marketing website paired with a structured internal portal for student records and workflow tracking.',
        turningPoint:
          'When advisors could see the exact document status for every applicant in one clean screen.',
        today:
          'Active student cohorts progress through verified milestones with zero misplaced paperwork.',
      },
      tradeOffs: [
        {
          point:
            'Kept document upload requirements strict and validated on upload to avoid embassy rejections later.',
        },
      ],
    },
    {
      title: 'HeyBlog',
      slug: 'heyblog',
      anonymousSlug: 'autonomous-blog',
      oneLiner:
        'A blog that writes, checks, and publishes itself at zero running cost on a Mac mini.',
      status: 'RUNNING' as const,
      tier: 'flagship' as const,
      order: 4,
      audiences: ['hire' as const, 'build' as const],
      client: {
        clientName: 'HeyBlog',
        clientDescription: 'autonomous editorial system',
        clientPermission: true,
      },
      postCard: {
        postStyle: 'thread' as const,
        postAuthorName: 'Ansh Rajput',
        postHeadline: 'Autonomous Systems Experiment',
        postText:
          'How HeyBlog runs 100% autonomously on an 8 GB Mac mini at zero API cost:',
        threadPosts: [
          {
            text: '1/ Trending topics scored & ranked locally -> Ollama draft generation.',
          },
          {
            text: '2/ Three-model evaluation gate: writing quality, harmful content check, duplicate detection.',
          },
          {
            text: '3/ Automatically published to Google Search. Appearing for 300+ search queries.',
          },
        ],
        postTime: 'yesterday',
      },
      atAGlance: {
        role: 'Designed, built and tested',
        duration: 'Autonomous continuous run',
        stack: [
          { tag: 'Python' },
          { tag: 'Ollama' },
          { tag: 'Local LLMs' },
          { tag: 'Next.js' },
        ],
        result:
          'Zero manual steps, zero API cost, ranked for 300+ search queries.',
      },
      story: {
        person:
          'An engineering experiment by Ansh to discover the true limits of autonomous content pipelines without paid API subscriptions.',
        struggle:
          'Most automated blogs produce hallucinated spam or run up unsustainable cloud API costs.',
        built:
          'An end-to-end local system running on an 8 GB Mac mini: trend discovery, Ollama generation, three-model gate, duplicate check, and instant static publication.',
        turningPoint:
          'When the system automatically auto-started on boot, resumed interrupted generation runs, and Google indexed 300+ queries.',
        today:
          'Running reliably. Taught me that search impressions do not equal engaged human readers, which refocused my effort on mission-critical client software.',
      },
      tradeOffs: [
        {
          point:
            'Chose strict multi-model quality gates and zero running cost over volume and speed.',
        },
      ],
      links: [{ label: 'Visit HeyBlog', url: 'https://heygrow.in/blog' }],
    },
    {
      title: 'AnandPic',
      slug: 'anandpic',
      anonymousSlug: 'festive-store',
      oneLiner:
        'Zero-code website control for banners, categories, and festive sales at zero running cost.',
      status: 'LIVE' as const,
      tier: 'supporting' as const,
      order: 5,
      audiences: ['client' as const],
      client: {
        clientName: 'AnandPic',
        clientDescription: 'a retail business [confirm]',
        clientPermission: false,
      },
      postCard: {
        postStyle: 'chat' as const,
        postAuthorName: 'Store System',
        postText:
          'The owner updated festive banner and discount codes directly from phone. No code needed.',
        chatBubbles: [
          { sender: 'them' as const, text: 'Can we change the banner for the festival tonight?' },
          { sender: 'me' as const, text: 'You can tap Edit Banners in your dashboard right now — changes go live instantly.' },
        ],
        postTime: '3d ago',
      },
      atAGlance: {
        role: 'Architect and builder',
        duration: 'From launch day',
        stack: [{ tag: 'Next.js' }, { tag: 'Tailwind' }, { tag: 'Headless CMS' }],
        result: 'Full owner autonomy without recurring hosting bills.',
      },
      story: {
        person:
          'A retail business owner wanting total control over seasonal banners and promotions.',
        struggle:
          'Every promotion or image update previously required waiting on a developer.',
        built:
          'A streamlined content management setup where banners, sales, and products can be updated in seconds from a phone.',
        turningPoint:
          'When the owner launched their festive discount campaign independently with zero developer intervention.',
        today: 'Active and running with zero ongoing software costs.',
      },
      tradeOffs: [
        {
          point:
            'Designed a simplified admin interface with zero technical jargon.',
        },
      ],
    },
    {
      title: 'RevenueLoop',
      slug: 'revenueloop',
      anonymousSlug: 'spending-guard',
      oneLiner:
        'Deterministic spending control system where AI agents cannot spend money on their own.',
      status: 'BUILDING' as const,
      tier: 'supporting' as const,
      order: 6,
      audiences: ['hire' as const, 'build' as const],
      client: {
        clientName: 'RevenueLoop',
        clientDescription: 'deterministic financial control system',
        clientPermission: true,
      },
      postCard: {
        postStyle: 'commit' as const,
        postAuthorName: 'Ansh Rajput',
        postHeadline: 'Deterministic Safety Core',
        postText:
          'Language models only propose; deterministic code owns money, permissions and risk.',
        codeSnippet:
          'class SpendGuard:\n    def evaluate(self, proposal: Action) -> Decision:\n        if proposal.amount > 0 and not proposal.has_human_approval:\n            return Decision.BLOCK_PENDING_APPROVAL',
        postTime: 'yesterday',
      },
      atAGlance: {
        role: 'Creator & protocol architect',
        duration: 'Active development',
        stack: [
          { tag: 'Python' },
          { tag: 'SQLite' },
          { tag: 'Append-only Ledger' },
          { tag: 'Sandboxing' },
        ],
        result: '138/138 tests passing across ~2,440 lines of core code.',
      },
      story: {
        person:
          'An AI safety architecture designed for financial operations by Ansh Rajput.',
        struggle:
          'Autonomous LLMs are inherently non-deterministic and must never have unchecked authority over financial balances.',
        built:
          'A strict separation where LLMs propose actions, but an immutable append-only ledger and deterministic permission gates enforce human approvals.',
        turningPoint:
          'Achieving 138/138 passing test cases simulating adversarial agent spending attempts.',
        today: 'Core engine complete; UI integration in progress.',
      },
      tradeOffs: [
        {
          point:
            'Refused full agent autonomy in favour of strict human-in-the-loop safety guarantees.',
        },
      ],
    },
    {
      title: 'Drop',
      slug: 'drop',
      anonymousSlug: 'p2p-transfer',
      oneLiner:
        'Open-source local PC↔phone file transfer with zero cloud dependency and token authentication.',
      status: 'BUILDING' as const,
      tier: 'supporting' as const,
      order: 7,
      audiences: ['hire' as const, 'build' as const],
      client: {
        clientName: 'Drop',
        clientDescription: 'open-source peer-to-peer file transfer',
        clientPermission: true,
      },
      postCard: {
        postStyle: 'commit' as const,
        postAuthorName: 'Ansh Rajput',
        postHeadline: 'P2P Transfer Protocol',
        postText:
          'Pair once and devices discover each other on local network. 25/25 cross-language tests passing.',
        codeSnippet:
          '// Drop Handshake Protocol\nboolean authenticate(Token token, NetworkPeer peer) {\n    return crypto.verify(peer.publicKey(), token);\n}',
        postTime: '3d ago',
      },
      atAGlance: {
        role: 'Protocol designer & reference client author',
        duration: 'Open source project',
        stack: [
          { tag: 'Python' },
          { tag: 'Java' },
          { tag: 'mDNS' },
          { tag: 'Android' },
        ],
        result:
          'Specification written, Java reference client complete, 25/25 cross-language tests passing.',
      },
      story: {
        person:
          'An open-source tool solving daily friction in moving large files across operating systems locally.',
        struggle:
          'AirDrop is locked to Apple ecosystems, while cloud drives upload sensitive files to third-party servers.',
        built:
          'A zero-cloud local network protocol: pair once with secure tokens, and devices find each other automatically.',
        turningPoint:
          'Passing 25/25 cross-language interoperability tests between the Python daemon and Java client.',
        today: 'Android native application actively under development.',
      },
      tradeOffs: [
        {
          point:
            'Chose local network mDNS discovery over relay servers to guarantee privacy.',
        },
      ],
    },
    {
      title: 'HeyGrowin Outreach Engine',
      slug: 'outreach-engine',
      anonymousSlug: 'crm-engine',
      oneLiner:
        'The bespoke CRM and outreach engine I built to discover, track, and support clients.',
      status: 'RUNNING' as const,
      tier: 'supporting' as const,
      order: 8,
      audiences: ['client' as const, 'build' as const],
      client: {
        clientName: 'HeyGrowin Outreach Engine',
        clientDescription: 'internal CRM and outreach engine',
        clientPermission: true,
      },
      postCard: {
        postStyle: 'team-message' as const,
        postAuthorName: 'Outreach Engine',
        postHeadline: 'Client Acquisition & Relationship Tracker',
        postText:
          'Follow-ups synced across WhatsApp, phone calls, and email. No lead slips through.',
        postTime: '1d ago',
      },
      atAGlance: {
        role: 'Creator & operator',
        duration: 'In active daily use',
        stack: [{ tag: 'Node.js' }, { tag: 'PostgreSQL' }, { tag: 'WhatsApp API' }],
        result: 'Powers client acquisition and relationship management for HeyGrowin.',
      },
      story: {
        person:
          'The internal engine behind HeyGrowin, keeping client relationships organized and attentive.',
        struggle:
          'Generic CRMs were overloaded with enterprise bloat and lacked unified tracking across multi-channel communication.',
        built:
          'A lightweight, focused pipeline tracking B2B leads, follow-up dates, and client check-ins.',
        turningPoint:
          'When every client received timely check-ins without maintaining manual spreadsheets.',
        today: 'Continuously active, driving growth for HeyGrowin.',
      },
      tradeOffs: [
        {
          point:
            'Private lead and contact counts are kept strictly confidential by design.',
        },
      ],
    },
  ]

  for (const project of projectsData) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'projects',
        data: project as any,
      })
      console.log(`Created Project: ${project.title}`)
    } else {
      console.log(`Project ${project.title} already exists.`)
    }
  }

  // 4. Seed Timeline Items
  const timelineItemsData = [
    {
      year: '2022',
      title: 'Tech behind the stage',
      line: "Video editing, animation and web work for my school's annual functions (certified 2022 and 2023).",
      order: 1,
    },
    {
      year: '2024',
      title: 'First client system',
      line: 'An inventory system still in use today.',
      order: 2,
    },
    {
      year: '2025',
      title: 'NGO internship',
      line: "Led digital outreach for Samarpit's Girl Rising Project (4 months).",
      order: 3,
    },
    {
      year: '2026',
      title: 'Moved to Messina for a Bachelor’s in Data Analysis',
      line: 'HeyGrowin takes on clients in India and Italy.',
      order: 4,
    },
    {
      year: 'Now',
      title: 'Building, studying, and looking for an internship',
      line: 'In data, software or applied AI.',
      order: 5,
    },
  ]

  for (const item of timelineItemsData) {
    const existing = await payload.find({
      collection: 'timeline-items',
      where: { title: { equals: item.title } },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'timeline-items',
        data: item,
      })
      console.log(`Created TimelineItem: ${item.title}`)
    }
  }

  // 5. Seed Achievements
  const achievementsData = [
    {
      title: 'SOF National Cyber Olympiad 2023–24',
      detail:
        'Gold Medal of Distinction; International Rank 275, Zonal Rank 24, School Rank 1.',
      year: '2023–24',
      order: 1,
    },
    {
      title: '2nd place, AI & Robotics competition',
      detail: 'Krishna Public School (2025–26).',
      year: '2025–26',
      order: 2,
    },
    {
      title: '2nd place, Snapshot photography competition',
      detail: 'Krishna Public School (2025–26).',
      year: '2025–26',
      order: 3,
    },
    {
      title: '3rd place, Video Making',
      detail: '"Kalam Within Me" inter-school competition.',
      year: '2024',
      order: 4,
    },
    {
      title: 'School Cyber In-charge',
      detail: 'Organised inter-school events including EVOLV 2025.',
      year: '2025',
      order: 5,
    },
  ]

  for (const item of achievementsData) {
    const existing = await payload.find({
      collection: 'achievements',
      where: { title: { equals: item.title } },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'achievements',
        data: item,
      })
      console.log(`Created Achievement: ${item.title}`)
    }
  }

  // 6. Seed Home Global (Hero notifications & blocks)
  const heroNotifications = [
    {
      app: appMap['Raja Nursery'],
      title: 'New online order',
      body: 'Someone just ordered plants from the website.',
    },
    {
      app: appMap['Ansh Color Lab'],
      title: 'Stock updated',
      body: "Today's sales are already in the inventory.",
    },
    {
      app: appMap['SKOLAR'],
      title: 'New student enquiry',
      body: 'A student wants to study in Italy.',
    },
    {
      app: appMap['HeyBlog'],
      title: 'Article published',
      body: 'Written, checked and published. Nobody touched it.',
    },
    {
      app: appMap['AnandPic'],
      title: 'Homepage updated',
      body: 'The owner changed the festive banner. No code needed.',
    },
    {
      app: appMap['Raja Nursery'],
      title: 'Bill generated',
      body: 'Invoice ready at the counter.',
    },
    {
      app: appMap['HeyGrowin Outreach'],
      title: 'Follow-up due',
      body: 'A business is waiting for a reply today.',
    },
    {
      app: appMap['SKOLAR'],
      title: 'Application moved forward',
      body: 'Documents complete. Next step unlocked.',
    },
    {
      app: appMap['Raja Nursery'],
      title: 'Pots logged',
      body: 'Every pot that left today is tracked.',
    },
    {
      app: appMap['RevenueLoop'],
      title: 'Spend blocked',
      body: 'No money moves without a human yes.',
    },
    {
      app: appMap['Ansh Color Lab'],
      title: 'Stock updated',
      body: 'Evening sales synced.',
    },
    {
      app: appMap['HeyBlog'],
      title: 'Duplicate caught',
      body: 'Too close to an older post, so it was skipped.',
    },
    {
      app: appMap['Raja Nursery'],
      title: 'New online order',
      body: 'Another order from the website.',
    },
    {
      app: appMap['SKOLAR'],
      title: 'New student enquiry',
      body: 'A family is asking about Master’s programmes.',
    },
  ].filter((n) => Boolean(n.app))

  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero: {
        heroName: 'Ansh Rajput',
        heroTagline: 'Stop looking for the right developer. You just found one.',
        cityLabel: 'Messina',
        timezone: 'Europe/Rome',
        buttonWorkLabel: 'See my work',
        buttonWhatsAppLabel: 'Message me on WhatsApp',
        whatsAppLink: 'https://wa.me/393514930310',
        honestNote:
          "These are the kinds of updates my clients' systems send every day.",
        notifications: heroNotifications as any,
        timings: {
          startInterval: 600,
          acceleration: 0.8,
          minimumInterval: 120,
        },
      },
      layout: [
        {
          blockType: 'threeFacts',
          visible: true,
          anchorId: 'facts',
          audiences: ['hire', 'client', 'build'],
          facts: [
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
          ],
        },
        {
          blockType: 'workFeed',
          visible: true,
          anchorId: 'work',
          audiences: ['hire', 'client', 'build'],
          heading: 'Work',
          description: 'Real systems solving real problems for real people.',
        },
        {
          blockType: 'growthTimeline',
          visible: true,
          anchorId: 'timeline',
          audiences: ['hire', 'build'],
          heading: 'Growth',
        },
        {
          blockType: 'audienceTabs',
          visible: true,
          anchorId: 'services',
          audiences: ['hire', 'client', 'build'],
          heading: 'What I can do for you',
          hireHeading: 'Hire me',
          hireText:
            'I ship working systems and I can explain every decision. Looking for an internship in data, software or applied AI.',
          hireButtonText: 'Download my CV',
          hireButtonLink: '#contact',
          clientHeading: 'Your business',
          clientText:
            "Tell me what's costing you time or money. I'll build the system that fixes it, and I stay to support it.",
          clientButtonText: 'Message me on WhatsApp',
          clientButtonLink: 'https://wa.me/393514930310',
          buildHeading: 'Build together',
          buildText:
            'Building something? I like hard problems with real users.',
          buildButtonText: 'Email me',
          buildButtonLink: 'mailto:anshr71t9@outlook.com',
        },
        {
          blockType: 'cinema',
          visible: false,
          anchorId: 'cinema',
          audiences: ['build'],
          title: 'Crossing the Genesis',
          credit: 'Written and directed by Harshita & Ansh Rajput',
          line:
            'An AI-generated sci-fi film made for the Future Vision XPRIZE competition.',
          filmUrl: 'https://heygrow.in',
        },
        {
          blockType: 'achievements',
          visible: true,
          anchorId: 'achievements',
          audiences: ['hire'],
          heading: 'Achievements',
        },
        {
          blockType: 'contact',
          visible: true,
          anchorId: 'contact',
          audiences: ['hire', 'client', 'build'],
          hireHeading: "Looking for an intern who ships? Let's talk.",
          clientHeading: "Tell me what's costing your business time or money.",
          buildHeading: "Building something? Let's build it properly.",
          defaultHeading: 'Say hello.',
          subtext:
            'I usually respond within a few hours. Direct WhatsApp or email works best.',
          email: 'anshr71t9@outlook.com',
          whatsApp: '+39 351 493 0310',
          privacyNote:
            'Privacy: This form stores your name, email, and message only for me to reply to you. You can ask for complete deletion at any time.',
        },
      ],
    },
  })
  console.log('Home Global updated successfully.')

  // 7. Seed SiteSettings Global
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: 'Ansh Rajput',
      roleLine:
        'Founder of HeyGrowin · Data Analysis student, University of Messina',
      location: 'Messina, Italy',
      email: 'anshr71t9@outlook.com',
      whatsApp: '+39 351 493 0310',
      whatsAppLink: 'https://wa.me/393514930310',
      linkedIn: 'https://in.linkedin.com/in/ansh-rajput-529328428',
      github: 'https://github.com/heygrowin',
      businessSiteUrl: 'https://heygrow.in',
      cvModernUrl: '/cv-ansh-rajput.pdf',
      cvEuropassUrl: '/cv-europass-ansh-rajput.pdf',
      seoDefaults: {
        metaTitle: 'Ansh Rajput — I build the systems small businesses run on.',
        metaDescription:
          'Portfolio of Ansh Rajput: founder of HeyGrowin and Data Analysis student at University of Messina. Real systems, real client stories, verified results.',
      },
      analyticsToggle: true,
    },
  })
  console.log('SiteSettings Global updated successfully.')

  // 8. Seed Navigation Global
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label: 'Work', target: '#work' },
        { label: 'About', target: '#timeline' },
        { label: 'Contact', target: '#contact' },
      ],
    },
  })
  console.log('Navigation Global updated successfully.')

  console.log('--- Idempotent Seed Complete! ---')
}

// Allow direct CLI execution: tsx scripts/seed.ts
if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err)
      process.exit(1)
    })
}
