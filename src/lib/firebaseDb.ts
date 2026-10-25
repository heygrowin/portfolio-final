import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { FullProjectStory } from '@/components/StorySheet'
import { TimelineItemData } from '@/components/GrowthTimeline'
import { AchievementItemData } from '@/components/Achievements'
import { FactItem } from '@/components/ThreeFacts'

// ========================================================
// DEFAULT SEED DATA (Used for instant fallback & initial Firestore sync)
// ========================================================
export const DEFAULT_PROJECTS: FullProjectStory[] = [
  {
    id: 'proj-raja-nursery',
    title: 'Raja Nursery',
    slug: 'raja-nursery',
    anonymousSlug: 'plant-nursery',
    oneLiner:
      'From zero online presence to a complete digital store, billing software and pot tracking.',
    status: 'IN USE',
    tier: 'flagship',
    order: 1,
    audiences: ['client', 'hire'],
    client: {
      clientName: 'Raja Nursery',
      clientDescription: 'a family plant nursery in Bilaspur, India',
      clientPermission: true,
    },
    postCard: {
      postStyle: 'photo-post',
      postAuthorName: 'Raja Nursery',
      postHeadline: 'Family plant nursery digital transition',
      postText:
        'Plants leaving the counter today in Bilaspur are billed, inventoried, and tracked automatically. No paper slips lost.',
      postTime: 'now',
    },
    atAGlance: {
      role: 'Designed, built and supports everything',
      duration: 'Ongoing daily production',
      stack: [
        { tag: 'Next.js' },
        { tag: 'Node.js' },
        { tag: 'Tailwind' },
        { tag: 'Firebase' },
      ],
      result:
        'From no website to an online store with custom billing and pot tracking.',
    },
    story: {
      person:
        'A hardworking family running a beloved local nursery in Bilaspur, India, whose passion for plants deserved a modern system.',
      struggle:
        'Counter sales were noted on paper pads, pot stock counts took hours after closing, and local plant lovers had no way to browse inventory online.',
      built:
        'A mobile-friendly catalogue, counter billing system, and a live pot-tracking register that anyone on the team can operate without technical training.',
      turningPoint:
        'The first Saturday rush where counter lines moved twice as fast and online pre-orders were ready for pickup without confusion.',
      today:
        'Both the e-commerce store and internal counter software run daily in Bilaspur, supported with same-day fixes whenever needed.',
    },
    tradeOffs: [
      {
        point:
          'Chose an intuitive single-screen cashier interface over complex enterprise ERP features to keep training time to under 10 minutes.',
      },
    ],
  },
  {
    id: 'proj-ansh-color-lab',
    title: 'Ansh Color Lab',
    slug: 'ansh-color-lab',
    anonymousSlug: 'photo-colour-lab',
    oneLiner:
      'Inventory tracking running daily for 2+ years without a single quiet failure.',
    status: 'IN USE',
    tier: 'flagship',
    order: 2,
    audiences: ['client', 'hire', 'build'],
    client: {
      clientName: 'Ansh Color Lab',
      clientDescription: 'a high-volume photo & print studio in Bilaspur, India',
      clientPermission: true,
    },
    postCard: {
      postStyle: 'team-message',
      postAuthorName: 'Ansh Color Lab',
      postHeadline: 'Daily inventory synchronisation in Bilaspur',
      postText:
        "Today's printing paper, ink cartridges, and chemical stocks reconciled before closing time.",
      postTime: '2h ago',
    },
    atAGlance: {
      role: 'Sole architect and maintainer',
      duration: '2+ years uninterrupted',
      stack: [
        { tag: 'TypeScript' },
        { tag: 'Express' },
        { tag: 'Firebase' },
        { tag: 'Tailwind' },
      ],
      result:
        'Eliminated stockout emergencies during peak wedding and portrait seasons in Bilaspur.',
    },
    story: {
      person:
        'The studio master craftsman who prints thousands of bespoke memories every week in Bilaspur, India.',
      struggle:
        'Running out of premium photopaper on Friday evenings stopped print production until emergency reorders arrived.',
      built:
        'A zero-bloat barcode inventory manager with predictive replenishment alerts and offline-first cache.',
      turningPoint:
        'The first busy holiday season with zero material stockouts and automated daily ledger reconciliations.',
      today:
        '2+ years in continuous daily production with 99.98% uptime.',
    },
    tradeOffs: [
      {
        point:
          'Built lightweight local caching so counter staff can scan stock even during broadband fluctuations in Bilaspur.',
      },
    ],
  },
  {
    id: 'proj-skolar',
    title: 'SKOLAR',
    slug: 'skolar',
    anonymousSlug: 'study-abroad-consultancy',
    oneLiner:
      'Automated European university application intake, student tracking and document pipeline.',
    status: 'IN USE',
    tier: 'flagship',
    order: 3,
    audiences: ['client', 'hire'],
    client: {
      clientName: 'SKOLAR',
      clientDescription: 'an overseas education consultancy',
      clientPermission: true,
    },
    postCard: {
      postStyle: 'pro-post',
      postAuthorName: 'SKOLAR',
      postHeadline: 'International Study Advisory · University Admissions in Italy & Europe',
      postText:
        'Automated document verification and admissions pipeline active for European university intakes.',
      postTime: '4h ago',
    },
    atAGlance: {
      role: 'Full-stack lead developer',
      duration: '1+ year production',
      stack: [
        { tag: 'React' },
        { tag: 'Next.js' },
        { tag: 'Firebase' },
        { tag: 'Tailwind CSS' },
      ],
      result:
        'Streamlined hundreds of student application dossiers across Italian & European universities.',
    },
    story: {
      person:
        'Consultants guiding international students through complex European university admission criteria.',
      struggle:
        'Lost emails, missing transcripts, and manual status tracking across WhatsApp chats.',
      built:
        'A structured intake portal where students upload translated transcripts, track admission eligibility, and receive automated milestone alerts.',
      turningPoint:
        'Handling triple the volume of applicants during peak Italian university visa deadlines with zero dropped records.',
      today:
        'Actively processing global student cohorts aiming for European higher education.',
    },
    tradeOffs: [
      {
        point:
          'Prioritised mobile upload simplicity over multi-step forms so students in rural areas can easily photograph and submit documents.',
      },
    ],
  },
  {
    id: 'proj-heyblog',
    title: 'HeyBlog',
    slug: 'heyblog',
    anonymousSlug: 'autonomous-publishing-blog',
    oneLiner:
      'Autonomous publishing platform generating 300+ Google search impressions.',
    status: 'IN USE',
    tier: 'supporting',
    order: 4,
    audiences: ['build', 'hire'],
    client: {
      clientName: 'HeyBlog',
      clientDescription: 'an autonomous markdown publishing & SEO platform',
      clientPermission: true,
    },
    postCard: {
      postStyle: 'thread',
      postAuthorName: 'HeyBlog Automation',
      postHeadline: 'Autonomous Markdown Publishing & Google Indexing Engine',
      postText:
        'Structured markdown compiled, indexed, and deployed to Edge with zero manual intervention.',
      postTime: '1d ago',
    },
    atAGlance: {
      role: 'Creator & Developer',
      duration: 'Live system',
      stack: [
        { tag: 'Next.js' },
        { tag: 'Edge Functions' },
        { tag: 'SEO Automation' },
        { tag: 'Tailwind' },
      ],
      result: 'Hundreds of search rankings achieved programmatically.',
    },
    story: {
      person: 'Content writers and technical enthusiasts.',
      struggle: 'Manual formatting, image optimization, and repetitive CMS workflows.',
      built: 'An automated pipeline transforming markdown into high-speed SEO pages.',
      turningPoint: 'Seeing articles rank on Google first page without manual SEO tuning.',
      today: 'Continuously active, driving organic discoverability.',
    },
    tradeOffs: [],
  },
]

export const DEFAULT_TIMELINE: TimelineItemData[] = [
  {
    id: 'tl-2022',
    year: '2022',
    title: 'Tech behind the stage',
    line: "Video editing, animation and web production for my school's annual functions (certified 2022 & 2023).",
    order: 1,
  },
  {
    id: 'tl-2024',
    year: '2024',
    title: 'First client system',
    line: 'Architected high-volume photo lab inventory tracker, still running daily with 2+ years uptime.',
    order: 2,
  },
  {
    id: 'tl-2025',
    year: '2025',
    title: 'NGO leadership & Cyber In-Charge',
    line: "Led digital outreach for Samarpit's Girl Rising Project; organised inter-school technology competitions including EVOLV 2025.",
    order: 3,
  },
  {
    id: 'tl-2026',
    year: '2026',
    title: 'Moved to Messina for BSc in Data Analysis',
    line: 'Expanded HeyGrowin studio across India & Italy, delivering mission-critical web platforms.',
    order: 4,
  },
  {
    id: 'tl-now',
    year: 'Now',
    title: 'Actively building & open for internships',
    line: 'Seeking European internships in software engineering, data analytics, and applied AI.',
    order: 5,
  },
]

export const DEFAULT_ACHIEVEMENTS: AchievementItemData[] = [
  {
    id: 'ach-1',
    title: 'SOF National Cyber Olympiad 2023–24',
    detail: 'Gold Medal of Distinction; International Rank 275, Zonal Rank 24, School Rank 1.',
    year: '2023–24',
    order: 1,
  },
  {
    id: 'ach-2',
    title: '2nd Place — AI & Robotics Competition',
    detail: 'Krishna Public School, Bilaspur.',
    year: '2025–26',
    order: 2,
  },
  {
    id: 'ach-3',
    title: 'EVOLV 2025 & Cyber In-Charge',
    detail: 'Managed school technical infrastructure and led annual inter-school tech summit.',
    year: '2025',
    order: 3,
  },
  {
    id: 'ach-4',
    title: '3rd Place — Video Making',
    detail: '"Kalam Within Me" state-level competition.',
    year: '2024',
    order: 4,
  },
  {
    id: 'ach-5',
    title: '2nd Place — Snapshot Photography',
    detail: 'Creative visual production and framing.',
    year: '2025–26',
    order: 5,
  },
]

export const DEFAULT_FACTS: FactItem[] = [
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

export const DEFAULT_SETTINGS = {
  heroName: 'Ansh Rajput',
  heroTagline: 'Stop looking for the right developer. You just found one.',
  cityLabel: 'Messina',
  timezone: 'Europe/Rome',
  whatsAppItaly: '+39 351 493 0310',
  whatsAppIndia: '+91 91110 05300',
  emailPersonal: 'anshr71t9@outlook.com',
  emailBusiness: 'heygrowteam@gmail.com',
  linkedinUrl: 'https://in.linkedin.com/in/ansh-rajput-529328428',
  githubUrl: 'https://github.com/heygrowin',
  instagramPersonal: 'https://instagram.com/ansh__3070',
  instagramStudio: 'https://instagram.com/hey.growin',
}

// ========================================================
// FIRESTORE ASYNC READ METHODS (With graceful fallback)
// ========================================================

export async function getFirebaseProjects(): Promise<FullProjectStory[]> {
  try {
    const colRef = collection(db, 'projects')
    const q = query(colRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return DEFAULT_PROJECTS
    }
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as FullProjectStory[]
  } catch (err) {
    console.warn('Firebase getProjects fallback to defaults:', err)
    return DEFAULT_PROJECTS
  }
}

export async function getFirebaseTimeline(): Promise<TimelineItemData[]> {
  try {
    const colRef = collection(db, 'timeline')
    const q = query(colRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return DEFAULT_TIMELINE
    }
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as TimelineItemData[]
  } catch (err) {
    console.warn('Firebase getTimeline fallback to defaults:', err)
    return DEFAULT_TIMELINE
  }
}

export async function getFirebaseAchievements(): Promise<AchievementItemData[]> {
  try {
    const colRef = collection(db, 'achievements')
    const q = query(colRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return DEFAULT_ACHIEVEMENTS
    }
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as AchievementItemData[]
  } catch (err) {
    console.warn('Firebase getAchievements fallback to defaults:', err)
    return DEFAULT_ACHIEVEMENTS
  }
}

export async function getFirebaseSettings(): Promise<typeof DEFAULT_SETTINGS> {
  try {
    const docRef = doc(db, 'settings', 'main')
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) {
      return DEFAULT_SETTINGS
    }
    return { ...DEFAULT_SETTINGS, ...snapshot.data() }
  } catch (err) {
    console.warn('Firebase getSettings fallback to defaults:', err)
    return DEFAULT_SETTINGS
  }
}

export async function getFirebaseFacts(): Promise<FactItem[]> {
  try {
    const docRef = doc(db, 'settings', 'facts')
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists() || !snapshot.data()?.facts) {
      return DEFAULT_FACTS
    }
    return snapshot.data().facts as FactItem[]
  } catch (err) {
    console.warn('Firebase getFacts fallback to defaults:', err)
    return DEFAULT_FACTS
  }
}

// ========================================================
// FIRESTORE WRITE / MUTATION METHODS
// ========================================================

export async function saveFirebaseProject(project: FullProjectStory): Promise<void> {
  const docId = project.id || `proj-${project.slug}`
  const docRef = doc(db, 'projects', docId)
  await setDoc(docRef, { ...project, id: docId, updatedAt: serverTimestamp() }, { merge: true })
}

export async function deleteFirebaseProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id))
}

export async function saveFirebaseTimelineItem(item: TimelineItemData): Promise<void> {
  const docId = item.id || `tl-${item.year.toLowerCase().replace(/[^a-z0-9]/g, '')}`
  const docRef = doc(db, 'timeline', docId)
  await setDoc(docRef, { ...item, id: docId, updatedAt: serverTimestamp() }, { merge: true })
}

export async function deleteFirebaseTimelineItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'timeline', id))
}

export async function saveFirebaseSettings(settings: Partial<typeof DEFAULT_SETTINGS>): Promise<void> {
  const docRef = doc(db, 'settings', 'main')
  await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true })
}

export async function saveFirebaseInquiry(inquiry: {
  name: string
  email: string
  message: string
  audience?: string
}): Promise<string> {
  const colRef = collection(db, 'inquiries')
  const res = await addDoc(colRef, {
    ...inquiry,
    createdAt: serverTimestamp(),
  })
  return res.id
}

export async function getFirebaseInquiries(): Promise<any[]> {
  try {
    const colRef = collection(db, 'inquiries')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
  } catch (err) {
    console.warn('Error fetching inquiries:', err)
    return []
  }
}

// ========================================================
// SEED ALL BASELINE DATA TO FIRESTORE
// ========================================================
export async function seedAllToFirebase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Projects
    for (const p of DEFAULT_PROJECTS) {
      await saveFirebaseProject(p)
    }

    // 2. Timeline
    for (const t of DEFAULT_TIMELINE) {
      await saveFirebaseTimelineItem(t)
    }

    // 3. Achievements
    for (const a of DEFAULT_ACHIEVEMENTS) {
      const docRef = doc(db, 'achievements', a.id || `ach-${a.order}`)
      await setDoc(docRef, a, { merge: true })
    }

    // 4. Settings
    await saveFirebaseSettings(DEFAULT_SETTINGS)

    // 5. Facts
    const factsRef = doc(db, 'settings', 'facts')
    await setDoc(factsRef, { facts: DEFAULT_FACTS, updatedAt: serverTimestamp() }, { merge: true })

    return {
      success: true,
      message: 'All projects, timeline items, achievements, and settings successfully synchronized to Firebase Firestore!',
    }
  } catch (err: any) {
    console.error('Error seeding to Firebase:', err)
    return {
      success: false,
      message: `Firebase Sync Failed: ${err?.message || String(err)}`,
    }
  }
}
