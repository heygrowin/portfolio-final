'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  DEFAULT_PROJECTS,
  DEFAULT_TIMELINE,
  DEFAULT_SETTINGS,
  DEFAULT_FACTS,
  getFirebaseProjects,
  getFirebaseTimeline,
  getFirebaseSettings,
  saveFirebaseProject,
  deleteFirebaseProject,
  saveFirebaseTimelineItem,
  deleteFirebaseTimelineItem,
  saveFirebaseSettings,
  seedAllToFirebase,
  getFirebaseInquiries,
} from '@/lib/firebaseDb'
import { FullProjectStory } from '@/components/StorySheet'
import { TimelineItemData } from '@/components/GrowthTimeline'

export default function FirebaseAdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'timeline' | 'settings' | 'inquiries' | 'firestore'
  >('overview')

  // Data States
  const [projects, setProjects] = useState<FullProjectStory[]>(DEFAULT_PROJECTS)
  const [timeline, setTimeline] = useState<TimelineItemData[]>(DEFAULT_TIMELINE)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [inquiries, setInquiries] = useState<any[]>([])

  // UI / Selection States
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    DEFAULT_PROJECTS[0]?.id || ''
  )
  const [toastMessage, setToastMessage] = useState<{
    text: string
    type: 'success' | 'info' | 'error'
  } | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  // Load from Firebase on Mount
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
          setSelectedProjectId(proj[0].id || '')
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

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 3500)
  }

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || projects[0],
    [projects, selectedProjectId]
  )

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects
    const q = searchQuery.toLowerCase()
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.anonymousSlug.toLowerCase().includes(q)
    )
  }, [projects, searchQuery])

  // 1. Toggle Client Privacy Permission directly from card or editor
  const handleTogglePrivacy = async (projectId: string, currentPermission: boolean) => {
    const nextPermission = !currentPermission
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          client: {
            ...p.client,
            clientPermission: nextPermission,
          },
        }
      }
      return p
    })
    setProjects(updated)

    const target = updated.find((p) => p.id === projectId)
    if (target) {
      try {
        await saveFirebaseProject(target)
        showToast(
          nextPermission
            ? `🔓 "${target.title}" is now PUBLIC (real name visible on site)`
            : `🔒 "${target.title}" is now ANONYMOUS (real name hidden on site)`,
          'success'
        )
      } catch {
        showToast('Updated locally (Pending Firestore sync)', 'info')
      }
    }
  }

  // 2. Save Selected Project
  const handleSaveCurrentProject = async () => {
    if (!selectedProject) return
    try {
      await saveFirebaseProject(selectedProject)
      showToast(`✅ "${selectedProject.title}" saved to Firebase!`, 'success')
    } catch {
      showToast('Saved locally (Pending Firestore sync)', 'info')
    }
  }

  // 3. Add New Project
  const handleCreateNewProject = () => {
    const newId = `proj-${Date.now()}`
    const newProj: FullProjectStory = {
      id: newId,
      title: 'New Client System',
      slug: `client-system-${projects.length + 1}`,
      anonymousSlug: `system-${projects.length + 1}`,
      oneLiner: 'Automated platform solving operational bottlenecks.',
      status: 'IN USE',
      tier: 'supporting',
      order: projects.length + 1,
      audiences: ['client', 'hire'],
      client: {
        clientName: 'Client Name Here',
        clientDescription: 'a growing business',
        clientPermission: false,
      },
      postCard: {
        postStyle: 'photo-post',
        postAuthorName: 'Client System',
        postHeadline: 'Live operational deployment',
        postText: 'Core workflow running automatically without manual errors.',
        postTime: 'now',
      },
      atAGlance: {
        role: 'Sole architect & engineer',
        duration: 'Live in production',
        stack: [{ tag: 'Next.js' }, { tag: 'Firebase' }, { tag: 'Tailwind' }],
        result: 'Immediate speedup and reduced manual labor.',
      },
      story: {
        person: 'The business founder.',
        struggle: 'Repetitive manual tasks causing lost time.',
        built: 'A custom, tailored web platform.',
        turningPoint: 'The first week of zero manual data entry.',
        today: 'Active and running reliably.',
      },
      tradeOffs: [],
    }

    setProjects([newProj, ...projects])
    setSelectedProjectId(newId)
    setIsNewProjectModalOpen(false)
    showToast('✨ New project draft created! Configure it below.', 'info')
  }

  // 4. Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await deleteFirebaseProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (selectedProjectId === id) {
        setSelectedProjectId(projects[0]?.id || '')
      }
      showToast(`Deleted "${title}"`, 'info')
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      showToast(`Removed "${title}" locally`, 'info')
    }
  }

  // 5. Save Global Settings
  const handleSaveSettings = async () => {
    try {
      await saveFirebaseSettings(settings)
      showToast('✅ Global settings successfully saved to Firebase!', 'success')
    } catch {
      showToast('Settings saved locally (Pending Firestore sync)', 'info')
    }
  }

  // 6. One-Click Cloud Firestore Sync
  const handleSyncAll = async () => {
    setIsSyncing(true)
    try {
      const res = await seedAllToFirebase()
      showToast(res.message, res.success ? 'success' : 'error')
    } catch (err: any) {
      showToast(`Sync error: ${err?.message || 'Check Firestore'}`, 'error')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 text-sm font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-500/20'
              : 'bg-slate-900/90 text-teal-300 border-teal-500/50 shadow-teal-500/20'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================
          LEFT NAVIGATION SIDEBAR
          ======================================================== */}
      <aside className="w-full md:w-64 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <div className="font-extrabold text-[16px] text-white tracking-tight leading-none">
                HeyGrowin
              </div>
              <div className="text-[12px] font-mono text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Control
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview' as const, label: 'Overview', icon: '📊' },
              { id: 'projects' as const, label: 'Projects & Privacy', icon: '💼', count: projects.length },
              { id: 'timeline' as const, label: 'Growth Milestones', icon: '📈', count: timeline.length },
              { id: 'settings' as const, label: 'Hero & Contacts', icon: '⚙️' },
              { id: 'inquiries' as const, label: 'Inquiries Inbox', icon: '💬', count: inquiries.length },
              { id: 'firestore' as const, label: 'Cloud Database', icon: '☁️' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile & Live Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 flex items-center justify-between text-xs font-bold transition-all"
          >
            <span className="flex items-center gap-2">
              <span>🌐</span>
              <span>View Public Portfolio</span>
            </span>
            <span className="text-slate-400">↗</span>
          </a>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-500/15 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/30 flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer"
          >
            <span>{isSyncing ? '⏳' : '⚡'}</span>
            <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
          </button>

          <div className="px-2 pt-2 text-[11px] font-mono text-slate-500">
            Project: <span className="text-slate-400">final-portfolio-516cc</span>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="px-6 sm:px-8 py-5 border-b border-slate-800/80 bg-[#0B1120]/70 backdrop-blur-md sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight capitalize m-0">
              {activeTab === 'overview' && '📊 Dashboard Overview'}
              {activeTab === 'projects' && '💼 Projects & Privacy Controls'}
              {activeTab === 'timeline' && '📈 Growth Timeline Milestones'}
              {activeTab === 'settings' && '⚙️ Hero Tagline & Direct Contacts'}
              {activeTab === 'inquiries' && '💬 Direct Client Inquiries'}
              {activeTab === 'firestore' && '☁️ Cloud Firestore Status'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant live editing connected directly to your Firebase Firestore database
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'projects' && (
              <button
                onClick={handleCreateNewProject}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span>
                <span>Add Project</span>
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ansh Rajput</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* ========================================================
              TAB: OVERVIEW
              ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Live Systems</span>
                    <span className="text-emerald-400 text-base">💼</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {projects.length}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Projects running in production
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Privacy Status</span>
                    <span className="text-amber-400 text-base">🔒</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {projects.filter((p) => !p.client?.clientPermission).length} / {projects.length}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Clients currently anonymized
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Milestones</span>
                    <span className="text-teal-400 text-base">📈</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {timeline.length}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Illuminated on Growth scroll
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Inquiries</span>
                    <span className="text-blue-400 text-base">💬</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {inquiries.length}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct messages in Firebase
                  </p>
                </div>
              </div>

              {/* Quick Jump Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Tagline Quick Card */}
                <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                      Live Hero Tagline
                    </span>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Edit ↗
                    </button>
                  </div>
                  <p className="text-lg font-bold text-white leading-snug">
                    &ldquo;{settings.heroTagline}&rdquo;
                  </p>
                  <div className="text-xs font-mono text-slate-500">
                    Location: {settings.cityLabel} ({settings.timezone})
                  </div>
                </div>

                {/* Privacy Rule Quick Control */}
                <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Client Privacy Enforcement
                    </span>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Manage ↗
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Client names are protected by default. Toggle client permission on any project to reveal their real company name.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span>✓ Privacy engine active & URL hash masking enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: PROJECTS & PRIVACY
              ======================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Search projects by title, slug, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-sm">
                    🔍
                  </span>
                </div>
              </div>

              {/* Master-Detail Projects View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Project Cards (4 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  {filteredProjects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id
                    const isPermitted = Boolean(proj.client?.clientPermission)

                    return (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProjectId(proj.id || '')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-500 shadow-xl ring-1 ring-emerald-500'
                            : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        {/* Header: Title + Instant Privacy Switch */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-white text-[16px]">
                              {proj.title}
                            </div>
                            <div className="text-[12px] text-slate-400 font-mono mt-0.5">
                              {isPermitted ? `/${proj.slug}` : `/#${proj.anonymousSlug}`}
                            </div>
                          </div>

                          {/* Instant 1-Click Privacy Switch */}
                          <button
                            type="button"
                            title={
                              isPermitted
                                ? 'Permission verified: Click to hide client name'
                                : 'Hidden by default: Click to grant permission and reveal name'
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePrivacy(proj.id || '', isPermitted)
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isPermitted
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            }`}
                          >
                            <span>{isPermitted ? '🔓 Public' : '🔒 Hidden'}</span>
                          </button>
                        </div>

                        {/* One-Liner */}
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {proj.oneLiner}
                        </p>

                        {/* Footer Badges */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {proj.status || 'IN USE'}
                          </span>
                          <span>
                            {isPermitted ? 'Name revealed' : proj.client?.clientDescription}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right: Active Project Editor (7 cols) */}
                {selectedProject && (
                  <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                          Editing System
                        </span>
                        <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                          {selectedProject.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleDeleteProject(
                              selectedProject.id || '',
                              selectedProject.title
                            )
                          }
                          className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleSaveCurrentProject}
                          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>

                    {/* Prominent Privacy Control Switch Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {selectedProject.client?.clientPermission ? '🔓' : '🔒'}
                          </span>
                          <span className="font-extrabold text-white text-sm">
                            Client Identity & Permission
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-[44ch] leading-relaxed">
                          {selectedProject.client?.clientPermission
                            ? 'Client name is currently PUBLIC. Real company name and slug are displayed on the public portfolio.'
                            : 'Client name is currently HIDDEN. Public visitors see the anonymous description and anonymous slug.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePrivacy(
                            selectedProject.id || '',
                            Boolean(selectedProject.client?.clientPermission)
                          )
                        }
                        className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 border ${
                          selectedProject.client?.clientPermission
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {selectedProject.client?.clientPermission
                          ? '✓ Public Name'
                          : '🔒 Anonymous Mode'}
                      </button>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={selectedProject.title || ''}
                          onChange={(e) => {
                            const updated = { ...selectedProject, title: e.target.value }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Status Badge
                        </label>
                        <select
                          value={selectedProject.status || 'IN USE'}
                          onChange={(e) => {
                            const updated = {
                              ...selectedProject,
                              status: e.target.value as any,
                            }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="IN USE">IN USE</option>
                          <option value="LIVE">LIVE</option>
                          <option value="RUNNING">RUNNING</option>
                          <option value="BUILDING">BUILDING</option>
                          <option value="CONCEPT">CONCEPT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Real Slug (When Permitted)
                        </label>
                        <input
                          type="text"
                          value={selectedProject.slug || ''}
                          onChange={(e) => {
                            const updated = { ...selectedProject, slug: e.target.value }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Anonymous Slug (Privacy Safe)
                        </label>
                        <input
                          type="text"
                          value={selectedProject.anonymousSlug || ''}
                          onChange={(e) => {
                            const updated = {
                              ...selectedProject,
                              anonymousSlug: e.target.value,
                            }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Hidden Client Description (Shown when privacy is ON)
                        </label>
                        <input
                          type="text"
                          value={selectedProject.client?.clientDescription || ''}
                          onChange={(e) => {
                            const updated = {
                              ...selectedProject,
                              client: {
                                ...selectedProject.client,
                                clientDescription: e.target.value,
                              },
                            }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          One-Liner Hook
                        </label>
                        <textarea
                          rows={2}
                          value={selectedProject.oneLiner || ''}
                          onChange={(e) => {
                            const updated = {
                              ...selectedProject,
                              oneLiner: e.target.value,
                            }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Problem / Struggle Solved
                        </label>
                        <textarea
                          rows={3}
                          value={selectedProject.story?.struggle || ''}
                          onChange={(e) => {
                            const updated = {
                              ...selectedProject,
                              story: {
                                ...selectedProject.story,
                                struggle: e.target.value,
                              },
                            }
                            setProjects(
                              projects.map((p) =>
                                p.id === selectedProject.id ? updated : p
                              )
                            )
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: GROWTH TIMELINE
              ======================================================== */}
          {activeTab === 'timeline' && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Timeline Milestones</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    These milestones glow and trigger Sound 2 as the user scrolls
                  </p>
                </div>
                <button
                  onClick={async () => {
                    for (const item of timeline) {
                      await saveFirebaseTimelineItem(item)
                    }
                    showToast('✅ Timeline milestones saved to Firebase!', 'success')
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Save Timeline
                </button>
              </div>

              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const next = [...timeline]
                          next[idx].year = e.target.value
                          setTimeline(next)
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold font-mono"
                      />
                    </div>

                    <div className="sm:col-span-4">
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

                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Summary Line
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

          {/* ========================================================
              TAB: SETTINGS & HERO
              ======================================================== */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Hero Tagline & Direct Contacts</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Values here update your Hero lockscreen and website contact channels live
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Hero Main Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.heroTagline}
                    onChange={(e) =>
                      setSettings({ ...settings, heroTagline: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-base font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    🇮🇹 Italian Phone / WhatsApp Line
                  </label>
                  <input
                    type="text"
                    value={settings.whatsAppItaly}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsAppItaly: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    🇮🇳 Indian Phone / WhatsApp Line
                  </label>
                  <input
                    type="text"
                    value={settings.whatsAppIndia}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsAppIndia: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    👤 Personal / Academic Email
                  </label>
                  <input
                    type="email"
                    value={settings.emailPersonal}
                    onChange={(e) =>
                      setSettings({ ...settings, emailPersonal: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    💼 Professional / Business Email
                  </label>
                  <input
                    type="email"
                    value={settings.emailBusiness}
                    onChange={(e) =>
                      setSettings({ ...settings, emailBusiness: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.linkedinUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    GitHub Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.githubUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, githubUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: INQUIRIES INBOX
              ======================================================== */}
          {activeTab === 'inquiries' && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Client & Recruiter Inquiries</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages captured through your website contact form in Firestore
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
                  {inquiries.length} Messages
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-400 space-y-2">
                  <span className="text-4xl block mb-2">📫</span>
                  <p className="font-extrabold text-white text-base">Your inbox is clean</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When visitors submit inquiries on your site, they are saved directly into Firestore and listed here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq, idx) => (
                    <div
                      key={inq.id || idx}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-xs">
                            {inq.name ? inq.name.charAt(0).toUpperCase() : '?'}
                          </span>
                          <div>
                            <span className="font-extrabold text-white text-sm block">
                              {inq.name || 'Anonymous Visitor'}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {inq.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${inq.email}`}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all"
                          >
                            Reply Email ↗
                          </a>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: CLOUD FIRESTORE SETUP
              ======================================================== */}
          {activeTab === 'firestore' && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/30">
                  ☁️
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Cloud Firestore Connection Guide
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Project ID: final-portfolio-516cc
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider">
                  How to link your Cloud Database in 2 simple clicks:
                </h4>
                <ol className="list-decimal list-inside text-sm text-slate-300 space-y-3 leading-relaxed">
                  <li>
                    Open your{' '}
                    <a
                      href="https://console.firebase.google.com/project/final-portfolio-516cc/firestore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-bold underline"
                    >
                      Firebase Console Firestore Page ↗
                    </a>
                  </li>
                  <li>
                    Click the blue <strong>&quot;Create database&quot;</strong> button.
                  </li>
                  <li>
                    Select <strong>&quot;Start in test mode&quot;</strong> and click <strong>Enable</strong>.
                  </li>
                  <li>
                    Return to this page and click the button below to upload all your projects and settings into your cloud database:
                  </li>
                </ol>

                <div className="pt-2">
                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                  >
                    <span>{isSyncing ? '⏳' : '⚡'}</span>
                    <span>{isSyncing ? 'Synchronizing with Firestore...' : 'Sync All Data to Firestore Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
