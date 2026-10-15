'use client'

import React, { useEffect, useState, useRef } from 'react'
import { renderAppIcon } from './Icons'
import { soundManager } from '../lib/audio'

export interface HeroNotificationItem {
  appName: string
  appIcon: string
  appColor: string
  title: string
  body: string
}

export interface HeroProps {
  name?: string
  tagline?: string
  cityLabel?: string
  timezone?: string
  buttonWorkLabel?: string
  buttonWhatsAppLabel?: string
  whatsAppLink?: string
  honestNote?: string
  notifications: HeroNotificationItem[]
  timings?: {
    startInterval?: number
    acceleration?: number
    minimumInterval?: number
  }
  onHeroComplete?: () => void
}

interface CardState {
  id: number
  appName: string
  appIcon: string
  appColor: string
  title: string
  body: string
  height?: number
}

export function Hero({
  name = 'Ansh Rajput',
  tagline = 'Stop looking for the right developer. You just found one.',
  cityLabel = 'Messina',
  timezone = 'Europe/Rome',
  buttonWorkLabel = 'See my work',
  buttonWhatsAppLabel = 'Message me on WhatsApp',
  whatsAppLink = 'https://wa.me/393514930310',
  honestNote = "These are the kinds of updates my clients' systems send every day.",
  notifications,
  timings,
  onHeroComplete,
}: HeroProps) {
  const [timeStr, setTimeStr] = useState<string>('--:--')
  const [dateStr, setDateStr] = useState<string>(cityLabel)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [isListOpen, setIsListOpen] = useState<boolean>(false)
  const [activeCards, setActiveCards] = useState<CardState[]>([])

  const timersRef = useRef<NodeJS.Timeout[]>([])
  const feedRef = useRef<HTMLDivElement>(null)

  const startInterval = timings?.startInterval || 600
  const initialGap = 760
  const acceleration = timings?.acceleration || 0.8
  const minInterval = timings?.minimumInterval || 120

  // 1. Messina Time Clock (Europe/Rome)
  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date()
        const t = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone,
        }).format(now)
        const d = new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          timeZone: timezone,
        }).format(now)

        setTimeStr(t)
        setDateStr(`${d}, ${cityLabel}`)
      } catch {
        setTimeStr('12:00')
        setDateStr(cityLabel)
      }
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 15000)
    return () => clearInterval(clockInterval)
  }, [cityLabel, timezone])

  // 2. Play Sequence
  const finishSequence = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setIsDone(true)
    if (onHeroComplete) onHeroComplete()

    // Clean up cards after exit animation
    setTimeout(() => {
      setActiveCards([])
    }, 700)
  }

  const startSequence = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setIsDone(false)
    setIsListOpen(false)
    setActiveCards([])

    let t = startInterval
    let gap = initialGap

    notifications.forEach((item, index) => {
      const timer = setTimeout(() => {
        // Sound 1 for the first notification, Sound 2 for all subsequent ones
        if (index === 0) {
          soundManager.playFirstNotification()
        } else {
          soundManager.playSubsequentNotification()
        }

        setActiveCards((prev) => {
          const newCard: CardState = {
            id: Date.now() + index,
            appName: item.appName,
            appIcon: item.appIcon,
            appColor: item.appColor,
            title: item.title,
            body: item.body,
          }
          // keep max 6 cards in DOM for performance
          return [newCard, ...prev].slice(0, 6)
        })
      }, t)
      timersRef.current.push(timer)
      t += gap
      gap = Math.max(minInterval, gap * acceleration)
    })

    const finalTimer = setTimeout(() => {
      finishSequence()
    }, t + 650)
    timersRef.current.push(finalTimer)
  }

  // 3. Initial visit check & reduced-motion check
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setIsDone(true)
      if (onHeroComplete) onHeroComplete()
    } else {
      startSequence()
    }

    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className={`hero relative min-h-[100svh] overflow-hidden flex flex-col items-center px-5 pt-[18px] pb-7 text-[#F1F5F9] select-none transition-colors duration-700 ${
        isDone ? 'done' : ''
      }`}
      style={{
        background: `
          radial-gradient(120% 70% at 50% 110%, rgba(16,185,129,0.22), transparent 60%),
          linear-gradient(180deg, var(--night-1) 0%, var(--night-2) 70%)
        `,
      }}
    >
      {/* Top Status Bar with real Messina time and Skip button */}
      <div className="w-full max-w-[440px] flex justify-between items-center text-[13px] font-medium text-[rgba(241,245,249,0.68)]">
        <span id="sbTime" aria-label={`Messina Time: ${timeStr}`}>
          {timeStr}
        </span>
        {!isDone && (
          <button
            type="button"
            id="skip"
            onClick={finishSequence}
            className="skip bg-transparent border-0 text-[rgba(241,245,249,0.68)] hover:text-[#F1F5F9] py-1 px-1 cursor-pointer transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Top Title / Clock Area */}
      <div
        className={`top-container relative w-full max-w-[440px] h-[150px] text-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isDone ? 'mt-[clamp(22px,13svh,140px)]' : 'mt-[22px]'
        }`}
      >
        {/* Lockscreen Clock (Fades into Name) */}
        <div
          className={`clock absolute inset-0 flex flex-col items-center justify-center transition-all duration-600 ease-out ${
            isDone
              ? 'opacity-0 -translate-y-3.5 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
          aria-hidden={isDone}
        >
          <div className="text-[15px] font-medium text-[rgba(241,245,249,0.68)]">
            {dateStr}
          </div>
          <div className="text-[84px] font-semibold tracking-[-0.04em] leading-none mt-0.5 tabular-nums">
            {timeStr}
          </div>
        </div>

        {/* Ansh Rajput Name & Tagline */}
        <div
          className={`name-banner absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDone
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          {/* Subtle Emerald Ambient Halo */}
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Role Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[12px] font-semibold text-emerald-300 mb-2.5 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Founder @ HeyGrowin · Data Analysis, Uni Messina</span>
          </div>

          <h1 className="m-0 text-[clamp(44px,13vw,76px)] font-extrabold tracking-[-0.04em] leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-sm">
            {name}
          </h1>

          <div className="mt-3 flex flex-col items-center gap-1.5 text-center px-4">
            <p className="text-[17px] sm:text-[19px] font-bold leading-[1.3] text-white max-w-[36ch] m-0 drop-shadow-sm">
              {tagline}
            </p>
            <p className="text-[14px] sm:text-[15px] font-medium text-emerald-400/90 max-w-[36ch] m-0 flex items-center justify-center gap-1.5">
              <span>Scroll down. Let the work speak.</span>
              <span className="animate-bounce inline-block text-[12px]">↓</span>
            </p>
          </div>
        </div>
      </div>

      {/* Notification Stream / Stack Area */}
      <div
        ref={feedRef}
        id="feed"
        className={`feed relative w-full max-w-[440px] transition-all duration-500 ease-out ${
          isDone ? 'mt-6 min-h-[80px]' : 'mt-[18px] h-[360px]'
        }`}
      >
        {/* Animated incoming notification cards during the storm */}
        {!isDone &&
          activeCards.map((card, i) => {
            // iOS Stack Layout Calculation
            const isTop3 = i < 3
            const yOffset = isTop3 ? i * 72 : 144 + (i - 2) * 9
            const scale = isTop3 ? 1 : 1 - (i - 2) * 0.05
            const opacity = isTop3 ? 1 : Math.max(0, 1 - (i - 2) * 0.32)
            const zIndex = 100 - i

            return (
              <div
                key={card.id}
                className="card absolute left-0 right-0 top-0 grid grid-cols-[38px_1fr_auto] gap-x-3 gap-y-0.5 items-start p-3 rounded-[20px] bg-[rgba(24,38,52,0.88)] border border-[rgba(255,255,255,0.12)] backdrop-blur-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-[450ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: `translateY(${yOffset}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformOrigin: '50% 100%',
                }}
              >
                {/* App Icon Tile */}
                <span
                  className="row-span-2 w-[38px] h-[38px] rounded-[10px] grid place-items-center text-white shadow-sm"
                  style={{ backgroundColor: card.appColor }}
                >
                  {renderAppIcon(card.appIcon, 'w-5 h-5 stroke-white')}
                </span>

                {/* App Name & 'now' timestamp */}
                <span className="text-[13px] font-semibold text-[#F1F5F9] leading-tight">
                  {card.appName}
                </span>
                <span className="text-[12px] text-[rgba(241,245,249,0.6)]">
                  now
                </span>

                {/* Notification Message */}
                <div className="col-start-2 col-span-2 text-[14px] leading-[1.35] text-[rgba(241,245,249,0.72)]">
                  <b className="block font-semibold text-white">{card.title}</b>
                  <span>{card.body}</span>
                </div>
              </div>
            )
          })}

        {/* Collapsed Group Card after the storm */}
        <div
          className={`group-container transition-all duration-500 ease-out ${
            isDone
              ? 'opacity-100 translate-y-0 pointer-events-auto relative'
              : 'opacity-0 translate-y-3 pointer-events-none absolute inset-0'
          }`}
        >
          <button
            type="button"
            id="groupBtn"
            onClick={() => setIsListOpen((prev) => !prev)}
            aria-expanded={isListOpen}
            aria-controls="hero-notifications-list"
            className="w-full text-left cursor-pointer text-[#F1F5F9] py-3.5 px-4 rounded-[20px] bg-[rgba(255,255,255,0.075)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.12)] backdrop-blur-[18px] flex items-center gap-3 relative transition-colors shadow-sm"
          >
            <span className="pulse-dot flex-none" aria-hidden="true" />
            <div className="flex-1">
              <strong className="block font-semibold text-[15px] text-white">
                {notifications.length} updates from systems I built
              </strong>
              <span className="text-[13px] text-[rgba(241,245,249,0.68)]">
                {isListOpen ? 'Tap to close' : 'Tap to read them'}
              </span>
            </div>
          </button>

          {/* Expanded Readable List */}
          {isListOpen && (
            <div
              id="hero-notifications-list"
              className="mt-3.5 max-h-[320px] overflow-y-auto pr-1 grid gap-2 animate-in fade-in duration-200"
            >
              {[...notifications].reverse().map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[30px_1fr] gap-2.5 items-center p-2.5 rounded-[14px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[14px] text-[rgba(241,245,249,0.72)]"
                >
                  <span
                    className="w-[30px] h-[30px] rounded-[8px] grid place-items-center text-white"
                    style={{ backgroundColor: item.appColor }}
                  >
                    {renderAppIcon(item.appIcon, 'w-4 h-4 stroke-white')}
                  </span>
                  <div>
                    <b className="text-white font-semibold">{item.appName}</b>{' '}
                    <span>
                      {item.title}. {item.body}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Honest Note (fade in when done) */}
      <div
        className={`actions w-full max-w-[440px] mt-auto grid gap-2.5 pt-5 transition-all duration-500 ease-out ${
          isDone
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href="#work"
            className="flex justify-center items-center min-h-[52px] rounded-[16px] text-[16px] font-semibold text-[#04261C] bg-[var(--accent)] hover:bg-[#34D399] transition-colors text-center px-4 shadow-sm"
          >
            {buttonWorkLabel}
          </a>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center min-h-[52px] rounded-[16px] text-[16px] font-semibold text-white bg-transparent border border-[rgba(255,255,255,0.24)] hover:border-[rgba(255,255,255,0.48)] transition-colors text-center px-4"
          >
            {buttonWhatsAppLabel}
          </a>
        </div>

        <p className="text-center text-[13px] text-[rgba(241,245,249,0.68)] mt-1.5 mb-0">
          {honestNote}{' '}
          <button
            type="button"
            id="replay"
            onClick={startSequence}
            className="bg-transparent border-0 text-[rgba(241,245,249,0.72)] hover:text-white underline underline-offset-4 cursor-pointer p-0.5 inline ml-1 font-medium transition-colors"
          >
            Replay
          </button>
        </p>
      </div>
    </section>
  )
}
