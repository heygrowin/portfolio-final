'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  buildSchedule,
  FIRST_CARD_DELAY,
  formatCount,
  SEEN_KEY,
  DEFAULT_TIMINGS,
  type HeroTimings,
} from '@/lib/hero'
import { soundManager } from '@/lib/audio'
import './hero.css'

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
  dateLocale?: string
  buttonWorkLabel?: string
  buttonWhatsAppLabel?: string
  whatsAppLink?: string
  honestNote?: string
  notifications: HeroNotificationItem[]
  timings?: HeroTimings
  onHeroComplete?: () => void
}

const ICON_SVG_PATHS: Record<string, string> = {
  leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>',
  box: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  page: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h4"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  cart: '<path d="M3 4h2l2.5 11h11L21 7H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17.5" cy="19.5" r="1.3"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
}

function getIconSvg(icon: string): string {
  return (
    ICON_SVG_PATHS[icon] ||
    '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'
  )
}

export function Hero({
  name = 'Ansh Rajput',
  tagline = 'Stop looking for the right developer. You just found one.',
  cityLabel = 'Messina',
  timezone = 'Europe/Rome',
  dateLocale = 'en-GB',
  buttonWorkLabel = 'See my work',
  buttonWhatsAppLabel = 'Message me on WhatsApp',
  whatsAppLink = 'https://wa.me/393514930310',
  honestNote = "These are the kinds of updates my clients' systems send every day.",
  notifications,
  timings = DEFAULT_TIMINGS,
  onHeroComplete,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState<boolean>(false)
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false)

  useEffect(() => {
    setIsSoundActive(soundManager.isUnlockedState())
    const unsubscribe = soundManager.onUnlock((unlocked) => {
      setIsSoundActive(unlocked)
    })
    return () => unsubscribe()
  }, [])

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    soundManager.unlock()
    soundManager.playFirstNotification()
    setIsSoundActive(true)
  }

  const handleHeroClick = () => {
    if (!isSoundActive) {
      soundManager.unlock()
      soundManager.playFirstNotification()
      setIsSoundActive(true)
    }
  }

  useEffect(() => {
    const hero = heroRef.current
    const feed = feedRef.current
    if (!hero || !feed) return
    const html = document.documentElement

    const skipBtn = hero.querySelector<HTMLButtonElement>('.skip')
    const replayBtn = hero.querySelector<HTMLButtonElement>('.replay')
    const groupBtn = hero.querySelector<HTMLButtonElement>('.group button')

    // 1. Live Messina Time on lockscreen
    const tick = () => {
      try {
        const now = new Date()
        const t = new Intl.DateTimeFormat(dateLocale, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone,
        }).format(now)
        const d = new Intl.DateTimeFormat(dateLocale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          timeZone: timezone,
        }).format(now)

        const timeEl = hero.querySelector<HTMLElement>('.time')
        const sbTimeEl = hero.querySelector<HTMLElement>('.sb-time')
        const dateEl = hero.querySelector<HTMLElement>('.date')

        if (timeEl) timeEl.textContent = t
        if (sbTimeEl) sbTimeEl.textContent = t
        if (dateEl) dateEl.textContent = `${d}, ${cityLabel}`
      } catch {
        // Fallback gracefully
      }
    }
    tick()
    const clockTimer = window.setInterval(tick, 15000)

    let cards: HTMLElement[] = []
    let timers: number[] = []

    // 2. Hardware-accelerated stack layout
    // The top 3 cards are readable; older cards compress smoothly behind.
    function layout() {
      const gap = 8
      let y = 0
      let bottom3 = 0
      cards.forEach((el, i) => {
        const h = el.offsetHeight
        if (i < 3) {
          el.style.transform = `translateY(${y}px) scale(1)`
          el.style.opacity = '1'
          el.classList.remove('stacked')
          y += h + gap
          bottom3 = y - gap
        } else {
          const d = i - 2
          const s = 1 - d * 0.05
          el.style.transform = `translateY(${bottom3 - h + d * 9}px) scale(${s})`
          el.style.opacity = String(Math.max(0, 1 - d * 0.32))
          el.classList.add('stacked')
        }
        el.style.zIndex = String(100 - i)
      })
      cards.slice(6).forEach((el) => el.remove())
      cards = cards.slice(0, 6)
    }

    // 3. Push incoming card with CSS slide-down animation & sounds
    function push(n: HeroNotificationItem, index: number) {
      if (index === 0) {
        soundManager.playFirstNotification()
      } else {
        soundManager.playSubsequentNotification()
      }

      const el = document.createElement('div')
      el.className = 'card'
      el.setAttribute('aria-hidden', 'true')

      const ico = document.createElement('span')
      ico.className = 'ico'
      ico.style.background = n.appColor
      ico.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${getIconSvg(
        n.appIcon
      )}</svg>`

      const app = document.createElement('span')
      app.className = 'app'
      app.textContent = n.appName

      const when = document.createElement('span')
      when.className = 'when'
      when.textContent = 'now'

      const msg = document.createElement('div')
      msg.className = 'msg'

      const title = document.createElement('b')
      title.textContent = n.title

      const body = document.createTextNode(n.body)
      msg.append(title, body)

      el.append(ico, app, when, msg)

      // Start position: slightly above and scaled down
      el.style.transform = 'translateY(-30px) scale(.94)'
      el.style.opacity = '0'

      feed!.prepend(el)
      cards.unshift(el)
      void el.offsetHeight // Commit start position to GPU compositor
      layout()
    }

    // 4. Finish sequence: cards glide up and hero transitions to final state
    function finish() {
      timers.forEach(clearTimeout)
      timers = []
      hero!.dataset.state = 'done'
      html.dataset.hero = 'done'
      if (onHeroComplete) onHeroComplete()

      try {
        localStorage.removeItem(SEEN_KEY)
      } catch {
        // Private mode safety
      }

      // Allow cards exit animation to complete before removing from DOM
      timers.push(
        window.setTimeout(() => {
          cards.forEach((c) => c.remove())
          cards = []
        }, 700)
      )
    }

    // 5. Play notification storm
    function play(alreadyWaited = 0) {
      timers.forEach(clearTimeout)
      timers = []
      hero!.dataset.state = 'intro'
      html.dataset.hero = 'playing'
      setIsListOpen(false)

      cards.forEach((c) => c.remove())
      cards = []

      const { times, finishAt } = buildSchedule(notifications.length, timings)
      const at = (ms: number) => Math.max(0, ms - alreadyWaited)

      notifications.forEach((n, i) => {
        timers.push(window.setTimeout(() => push(n, i), at(times[i])))
      })

      timers.push(window.setTimeout(finish, at(finishAt)))
    }

    const handleSkip = () => finish()
    const handleReplay = () => play(0)

    if (skipBtn) skipBtn.addEventListener('click', handleSkip)
    if (replayBtn) replayBtn.addEventListener('click', handleReplay)

    // Visibility observer to notify page of hero visibility
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio >= 0.3) {
          html.dataset.heroInView = ''
        } else {
          delete html.dataset.heroInView
        }
      },
      { threshold: [0, 0.3] }
    )
    visibility.observe(hero)

    // Check if initial intro should play
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasHash =
      typeof window !== 'undefined' &&
      window.location.hash.replace('#', '') !== ''

    if (reduce || hasHash) {
      finish()
    } else {
      play(0)
    }

    return () => {
      timers.forEach(clearTimeout)
      window.clearInterval(clockTimer)
      visibility.disconnect()
      if (skipBtn) skipBtn.removeEventListener('click', handleSkip)
      if (replayBtn) replayBtn.removeEventListener('click', handleReplay)
      cards.forEach((c) => c.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  const newestFirst = [...notifications].reverse()

  return (
    <>
      <section
        ref={heroRef}
        id="hero"
        aria-label="Introduction"
        className="hero"
        onClick={handleHeroClick}
        data-state="intro"
        data-tz={timezone}
        data-city={cityLabel}
        data-locale={dateLocale}
        suppressHydrationWarning
      >
        {/* Top Status Bar with real Messina time, Sound toggle, and Skip button */}
        <div className="status" onClick={(e) => e.stopPropagation()}>
          <span className="sb-time" aria-label={`Messina Time`} suppressHydrationWarning>
            --:--
          </span>
          <button
            type="button"
            className="sound-toggle"
            onClick={handleSoundToggle}
            aria-label="Sound status"
          >
            {isSoundActive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sound ON</span>
              </>
            ) : (
              <>
                <span>🔔</span>
                <span>Enable Sound</span>
              </>
            )}
          </button>
          <button type="button" className="skip">
            Skip
          </button>
        </div>

        {/* Top Title / Clock Area */}
        <div className="top">
          {/* Lockscreen Clock */}
          <div className="clock" aria-hidden="true">
            <div className="date" suppressHydrationWarning>
              {cityLabel}
            </div>
            <div className="time" suppressHydrationWarning>
              --:--
            </div>
          </div>

          {/* Ansh Rajput Name & Title Banner */}
          <div className="name">
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
        <div className="feed" aria-live="off">
          <div className="cards" ref={feedRef} />

          {/* Collapsed Group Card after the storm */}
          <div className="group">
            <button
              type="button"
              onClick={() => setIsListOpen((prev) => !prev)}
              aria-expanded={isListOpen}
              aria-controls="hero-notifications-list"
            >
              <span className="pulse flex-none" aria-hidden="true" />
              <div className="flex-1">
                <strong>
                  {formatCount(
                    '{count} updates from systems I built',
                    notifications.length
                  )}
                </strong>
                <span className="sub">
                  {isListOpen ? 'Tap to close' : 'Tap to read them'}
                </span>
              </div>
            </button>

            {/* Expanded Readable List */}
            <div
              id="hero-notifications-list"
              className={`list ${isListOpen ? 'open' : ''}`}
            >
              {newestFirst.map((item, idx) => (
                <div key={idx} className="row">
                  <span
                    className="ico"
                    style={{ backgroundColor: item.appColor }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: getIconSvg(item.appIcon),
                      }}
                    />
                  </span>
                  <div>
                    <b>{item.appName}</b> {item.title}. {item.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons & Honest Note */}
        <div className="actions">
          <a href="#work" className="btn primary">
            {buttonWorkLabel}
          </a>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ghost"
          >
            {buttonWhatsAppLabel}
          </a>

          <p className="note">
            {honestNote}{' '}
            <button type="button" className="replay">
              Replay
            </button>
          </p>
        </div>
      </section>

      {/* Synchronous Boot Script: runs before first paint to prevent layout flicker */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
var h=document.getElementById('hero');if(!h)return;
try{localStorage.removeItem('${SEEN_KEY}');}catch(e){}
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasHash=location.hash.replace('#','')!=='';
if(reduce||hasHash){
  h.setAttribute('data-state','done');
  document.documentElement.setAttribute('data-hero','done');
}else{
  h.setAttribute('data-state','intro');
  document.documentElement.setAttribute('data-hero','playing');
}
try{
  var n=new Date(),tz=h.getAttribute('data-tz')||'Europe/Rome',loc=h.getAttribute('data-locale')||'en-GB';
  var t=new Intl.DateTimeFormat(loc,{hour:'2-digit',minute:'2-digit',timeZone:tz}).format(n);
  var d=new Intl.DateTimeFormat(loc,{weekday:'long',day:'numeric',month:'long',timeZone:tz}).format(n);
  var tm=h.querySelector('.time');if(tm)tm.textContent=t;
  var sb=h.querySelector('.sb-time');if(sb)sb.textContent=t;
  var dt=h.querySelector('.date');if(dt)dt.textContent=d+', '+(h.getAttribute('data-city')||'Messina');
}catch(e){}
})();`,
        }}
      />
    </>
  )
}
