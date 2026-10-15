'use client'

import React, { useState, useEffect } from 'react'
import {
  DEFAULT_PROJECTS,
  DEFAULT_TIMELINE,
  DEFAULT_SETTINGS,
  getFirebaseProjects,
  getFirebaseTimeline,
  getFirebaseSettings,
  saveFirebaseProject,
  saveFirebaseTimelineItem,
  saveFirebaseSettings,
  seedAllToFirebase,
  getFirebaseInquiries,
} from '@/lib/firebaseDb'
import { FullProjectStory } from '@/components/StorySheet'
import { TimelineItemData } from '@/components/GrowthTimeline'

export default function FirebaseAdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'projects' | 'timeline' | 'settings' | 'inquiries' | 'firestore'
  >('projects')

  // Data States
  const [projects, setProjects] = useState<FullProjectStory[]>(DEFAULT_PROJECTS)
  const [timeline, setTimeline] = useState<TimelineItemData[]>(DEFAULT_TIMELINE)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [inquiries, setInquiries] = useState<any[]>([])

  // UI States
  const [selectedProject, setSelectedProject] = useState<FullProjectStory | null>(
    DEFAULT_PROJECTS[0] || null
  )
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  // Load from Firebase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [proj, tl, set, inq] = await Promise.all([
          getFirebaseProjects(),
          getFirebaseTimeline(),
          getFirebaseSettings(),
          getFirebaseInquiries(),
        ])
        if (proj && proj.length > 0) {
          setProjects(proj)
          setSelectedProject(proj[0])
        }
        if (tl && tl.length > 0) setTimeline(tl)
        if (set) setSettings(set)
        if (inq) setInquiries(inq)
      } catch (err) {
        console.warn('Initial Firebase fetch, using defaults:', err)
      }
    }
    loadData()
  }, [])

  // 1. Save Project
  const handleSaveProject = async () => {
    if (!selectedProject) return
    setSaveStatus('Saving to Firebase...')
    try {
      await saveFirebaseProject(selectedProject)
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? selectedProject : p))
      )
      setSaveStatus('✅ Project successfully saved to Firebase!')
      setTimeout(() => setSaveStatus(null), 3500)
    } catch (err: any) {
      setSaveStatus(`⚠️ Saved locally (Firestore sync pending: ${err?.message || 'Check Firestore'})`)
      setTimeout(() => setSaveStatus(null), 4000)
    }
  }

  // 2. Save Settings
  const handleSaveSettings = async () => {
    setSaveStatus('Saving settings to Firebase...')
    try {
      await saveFirebaseSettings(settings)
      setSaveStatus('✅ Site settings saved to Firebase!')
      setTimeout(() => setSaveStatus(null), 3500)
    } catch (err: any) {
      setSaveStatus(`⚠️ Saved locally (Firestore sync pending: ${err?.message || 'Check Firestore'})`)
      setTimeout(() => setSaveStatus(null), 4000)
    }
  }

  // 3. One-Click Firebase Sync
  const handleSyncAll = async () => {
    setIsSyncing(true)
    setSyncStatus('Synchronizing all baseline data to Cloud Firestore...')
    try {
      const res = await seedAllToFirebase()
      setSyncStatus(res.message)
    } catch (err: any) {
      setSyncStatus(`Sync attempted: ${err?.message || String(err)}`)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                HeyGrowin Firebase Admin
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400 font-mono">
                  Project: final-portfolio-516cc
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 text-xs font-bold transition-all border border-teal-500/30 flex items-center gap-1.5"
            >
              <span>{isSyncing ? '⏳' : '⚡'}</span>
              <span>{isSyncing ? 'Syncing...' : 'Sync to Firestore'}</span>
            </button>

            <a
              href="https://console.firebase.google.com/project/final-portfolio-516cc/firestore"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1"
            >
              <span>Firebase Console ↗</span>
            </a>

            <a
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-extrabold transition-all"
            >
              View Portfolio ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Alerts / Status Banner */}
        {saveStatus && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-teal-500/50 text-teal-300 text-sm font-medium flex items-center justify-between animate-in fade-in">
            <span>{saveStatus}</span>
          </div>
        )}

        {syncStatus && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-sm font-medium flex items-center justify-between animate-in fade-in">
            <span>{syncStatus}</span>
            <button
              onClick={() => setSyncStatus(null)}
              className="text-slate-400 hover:text-white text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 mb-8 pb-px">
          {[
            { id: 'projects' as const, label: '💼 Projects & Privacy', count: projects.length },
            { id: 'timeline' as const, label: '📈 Growth Timeline', count: timeline.length },
            { id: 'settings' as const, label: '⚙️ Hero & Settings' },
            { id: 'inquiries' as const, label: '💬 Inquiries Inbox', count: inquiries.length },
            { id: 'firestore' as const, label: '☁️ Firestore Setup' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: PROJECTS & PRIVACY */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Projects List */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Managed Systems
              </h2>
              {projects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-base">
                        {proj.title}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
                          proj.client?.clientPermission
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {proj.client?.clientPermission ? 'Public' : 'Hidden Name'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {proj.oneLiner}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5 text-[11px] font-mono text-slate-500">
                      <span>/{proj.slug}</span>
                      <span>·</span>
                      <span className="text-slate-400 font-bold">
                        Anon: /{proj.anonymousSlug}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column: Project Detail & Privacy Editor */}
            {selectedProject && (
              <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      Edit: {selectedProject.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure privacy rules, slugs, and live client permission
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProject}
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-sm transition-all"
                  >
                    Save Project
                  </button>
                </div>

                {/* Privacy Rule Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-amber-300">
                        🔒 Client Name Privacy Permission
                      </span>
                      <p className="text-xs text-slate-400">
                        When unticked, public visitors see &quot;{selectedProject.client?.clientDescription}&quot; and anonymous slug &quot;/{selectedProject.anonymousSlug}&quot;. Real name is never exposed.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedProject.client?.clientPermission)}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            client: {
                              ...selectedProject.client,
                              clientPermission: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={selectedProject.title || ''}
                      onChange={(e) =>
                        setSelectedProject({ ...selectedProject, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Status Badge
                    </label>
                    <input
                      type="text"
                      value={selectedProject.status || 'IN USE'}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Real Slug (when permitted)
                    </label>
                    <input
                      type="text"
                      value={selectedProject.slug || ''}
                      onChange={(e) =>
                        setSelectedProject({ ...selectedProject, slug: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Anonymous Slug (privacy-safe)
                    </label>
                    <input
                      type="text"
                      value={selectedProject.anonymousSlug || ''}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          anonymousSlug: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    One-Liner Summary
                  </label>
                  <textarea
                    rows={2}
                    value={selectedProject.oneLiner || ''}
                    onChange={(e) =>
                      setSelectedProject({ ...selectedProject, oneLiner: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Story: Struggle & Problem Solved
                  </label>
                  <textarea
                    rows={3}
                    value={selectedProject.story?.struggle || ''}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        story: {
                          ...selectedProject.story,
                          struggle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GROWTH TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">Growth Timeline Milestones</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Milestones that dynamically illuminate and play Sound 2 on scroll
                </p>
              </div>
              <button
                onClick={async () => {
                  setSaveStatus('Saving timeline to Firebase...')
                  for (const item of timeline) {
                    await saveFirebaseTimelineItem(item)
                  }
                  setSaveStatus('✅ Timeline milestones saved to Firebase!')
                  setTimeout(() => setSaveStatus(null), 3500)
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-sm transition-all"
              >
                Save Timeline
              </button>
            </div>

            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
                >
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Year / Marker
                    </label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const next = [...timeline]
                        next[idx].year = e.target.value
                        setTimeline(next)
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Milestone Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...timeline]
                        next[idx].title = e.target.value
                        setTimeline(next)
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Milestone Summary
                    </label>
                    <input
                      type="text"
                      value={item.line}
                      onChange={(e) => {
                        const next = [...timeline]
                        next[idx].line = e.target.value
                        setTimeline(next)
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">Global Portfolio Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update Hero tagline, Messina time coordinates, contact phone lines, and emails
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-sm transition-all"
              >
                Save Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={settings.heroTagline}
                  onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  🇮🇹 Italian Line / WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsAppItaly}
                  onChange={(e) => setSettings({ ...settings, whatsAppItaly: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  🇮🇳 Indian Line / WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsAppIndia}
                  onChange={(e) => setSettings({ ...settings, whatsAppIndia: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  👤 Personal / Academic Email
                </label>
                <input
                  type="email"
                  value={settings.emailPersonal}
                  onChange={(e) => setSettings({ ...settings, emailPersonal: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  💼 Professional / Business Email
                </label>
                <input
                  type="email"
                  value={settings.emailBusiness}
                  onChange={(e) => setSettings({ ...settings, emailBusiness: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  value={settings.githubUrl}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INQUIRIES INBOX */}
        {activeTab === 'inquiries' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-xl font-extrabold text-white">Direct Client & Recruiter Inquiries</h3>
            {inquiries.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                <span className="text-3xl block mb-2">📫</span>
                <p className="font-medium text-white">No inquiries received yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Messages submitted on the portfolio contact form will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq, i) => (
                  <div key={inq.id || i} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{inq.name}</span>
                      <span className="text-xs font-mono text-slate-500">{inq.email}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-2">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FIRESTORE SETUP GUIDE */}
        {activeTab === 'firestore' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">☁️</span>
              <div>
                <h3 className="text-xl font-extrabold text-white">Cloud Firestore Database Status</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Project: final-portfolio-516cc
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider">
                How to activate Cloud Firestore in 2 clicks:
              </h4>
              <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2 leading-relaxed">
                <li>
                  Open the{' '}
                  <a
                    href="https://console.firebase.google.com/project/final-portfolio-516cc/firestore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline font-bold"
                  >
                    Firebase Console Firestore Page ↗
                  </a>
                </li>
                <li>Click <strong>&quot;Create database&quot;</strong>.</li>
                <li>Choose <strong>&quot;Start in test mode&quot;</strong> and click <strong>Enable</strong>.</li>
                <li>
                  Come back here and click{' '}
                  <button
                    onClick={handleSyncAll}
                    className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30"
                  >
                    Sync to Firestore
                  </button>{' '}
                  to automatically write all your portfolio projects, timeline, and settings into your cloud database!
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
