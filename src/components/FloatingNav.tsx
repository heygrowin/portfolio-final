'use client'

import React, { useEffect, useState } from 'react'

export interface NavItem {
  label: string
  target: string
}

export interface FloatingNavProps {
  items: NavItem[]
  isHeroComplete: boolean
  isSheetOpen: boolean
}

export function FloatingNav({
  items = [
    { label: 'Work', target: '#work' },
    { label: 'About', target: '#timeline' },
    { label: 'Services', target: '#services' },
    { label: 'Contact', target: '#contact' },
  ],
  isHeroComplete,
  isSheetOpen,
}: FloatingNavProps) {
  const [activeSection, setActiveSection] = useState<string>('#work')

  // Scroll spy to highlight active section in the nav bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const sections = items.map((item) => {
        const id = item.target.replace('#', '')
        const el = document.getElementById(id)
        if (!el) return { id: item.target, top: 0, bottom: 0 }
        const rect = el.getBoundingClientRect()
        return {
          id: item.target,
          top: rect.top + scrollY - 200,
          bottom: rect.bottom + scrollY - 200,
        }
      })

      const current = sections.find(
        (s) => scrollY >= s.top && scrollY < s.bottom
      )
      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  // Hidden while hero sequence is running or while a story sheet is open
  if (!isHeroComplete || isSheetOpen) {
    return null
  }

  // Helper icons for each nav item
  const renderNavIcon = (label: string, isActive: boolean) => {
    const l = label.toLowerCase()
    const strokeClass = isActive ? 'stroke-[var(--accent)]' : 'stroke-current'

    if (l.includes('work')) {
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
    if (l.includes('about')) {
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
    if (l.includes('growth') || l.includes('timeline')) {
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    }
    if (l.includes('service') || l.includes('tab')) {
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    }
    // Default to contact/message icon
    return (
      <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  }

  return (
    <>
      {/* 📱 Mobile: Ultra-sleek Floating Glass Island */}
      <nav
        aria-label="Mobile bottom navigation"
        className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] animate-in fade-in slide-in-from-bottom-6 duration-400 ease-out"
      >
        <div className="relative flex items-center gap-1 p-1.5 rounded-full bg-[#0F172A]/90 dark:bg-[#0B1220]/95 backdrop-blur-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
          {items.map((item) => {
            const isActive = activeSection === item.target
            return (
              <a
                key={item.target}
                href={item.target}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 select-none ${
                  isActive
                    ? 'text-white bg-[rgba(16,185,129,0.22)] border border-[rgba(16,185,129,0.4)] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {renderNavIcon(item.label, isActive)}
                <span>{item.label}</span>
              </a>
            )
          })}

          {/* Quick WhatsApp pulse action */}
          <a
            href="https://wa.me/393514930310"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct message on WhatsApp"
            className="w-8 h-8 rounded-full bg-[var(--accent)] hover:bg-[#34D399] text-[#04261C] grid place-items-center ml-0.5 flex-none transition-transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.302c-.087.087-.178.182-.077.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.861.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* 💻 Desktop: Slim Floating Glass Bar */}
      <nav
        aria-label="Desktop top navigation"
        className="hidden sm:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-4xl px-4 py-2 rounded-full bg-[#0F172A]/85 dark:bg-[#0B1220]/90 backdrop-blur-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.35)] justify-between items-center gap-8 animate-in fade-in duration-300"
      >
        <a
          href="#hero"
          className="flex items-center gap-2 pl-2 text-[14px] font-bold text-white tracking-tight hover:text-[var(--accent)] transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>Ansh Rajput</span>
        </a>

        <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-300">
          {items.map((item) => {
            const isActive = activeSection === item.target
            return (
              <a
                key={item.target}
                href={item.target}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[rgba(16,185,129,0.22)] border border-[rgba(16,185,129,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        <a
          href="https://wa.me/393514930310"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-[#04261C] hover:bg-[#34D399] transition-transform hover:scale-105 active:scale-95 shadow-sm"
        >
          <span>Message on WhatsApp</span>
        </a>
      </nav>
    </>
  )
}
