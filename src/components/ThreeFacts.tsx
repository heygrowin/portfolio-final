'use client'

import React, { useEffect, useRef, useState } from 'react'
import { soundManager } from '../lib/audio'

export interface FactItem {
  statement: string
  sourceNote?: string
}

export interface ThreeFactsProps {
  facts: FactItem[]
  anchorId?: string
}

export function ThreeFacts({ facts, anchorId = 'facts' }: ThreeFactsProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const [activeFactIndex, setActiveFactIndex] = useState(0)
  const [displayedTexts, setDisplayedTexts] = useState<string[]>(() =>
    facts.map(() => '')
  )
  const [isTypingActive, setIsTypingActive] = useState(false)
  const [allFinished, setAllFinished] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // 1. Trigger when user scrolls down into the ThreeFacts section
  useEffect(() => {
    if (typeof window === 'undefined' || hasStarted) return

    const checkScrollAndPosition = () => {
      // Must be scrolled down away from top
      const hasScrolledDown = window.scrollY > 40
      if (!hasScrolledDown) return

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0) {
          setHasStarted(true)
          cleanup()
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && window.scrollY > 40) {
          setHasStarted(true)
          cleanup()
        }
      },
      { threshold: 0.15 }
    )

    const cleanup = () => {
      observer.disconnect()
      window.removeEventListener('scroll', checkScrollAndPosition)
    }

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    window.addEventListener('scroll', checkScrollAndPosition, { passive: true })

    return cleanup
  }, [hasStarted])

  // 2. Sequential typewriter animation with Sound 3 (3.mp3)
  useEffect(() => {
    if (!hasStarted || !facts || facts.length === 0) return

    // If user prefers reduced motion, show all facts instantly with no sound
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayedTexts(facts.map((f) => f.statement))
      setAllFinished(true)
      return
    }

    let isCancelled = false
    let currentFact = 0
    let charIndex = 0

    // Start Sound 3 (typewriter typing audio)
    soundManager.startTypewriterSound()
    setIsTypingActive(true)

    const typeNextChar = () => {
      if (isCancelled) return

      const targetStatement = facts[currentFact]?.statement || ''

      if (charIndex < targetStatement.length) {
        charIndex++
        const typedSlice = targetStatement.slice(0, charIndex)

        setDisplayedTexts((prev) => {
          const next = [...prev]
          next[currentFact] = typedSlice
          return next
        })

        // Continue typing next character (20ms cadence)
        setTimeout(typeNextChar, 20)
      } else {
        // Current fact finished
        if (currentFact < facts.length - 1) {
          currentFact++
          charIndex = 0
          setActiveFactIndex(currentFact)
          // Brief 200ms natural pause before next fact
          setTimeout(typeNextChar, 200)
        } else {
          // All facts finished typing
          setIsTypingActive(false)
          setAllFinished(true)
          soundManager.stopTypewriterSound()
        }
      }
    }

    // Small initial delay after scroll trigger
    const startTimer = setTimeout(typeNextChar, 100)

    return () => {
      isCancelled = true
      clearTimeout(startTimer)
      soundManager.stopTypewriterSound()
    }
  }, [hasStarted, facts])

  if (!facts || facts.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto"
    >
      <div className="grid gap-6 sm:gap-8">
        {facts.map((fact, index) => {
          const text = displayedTexts[index] || ''
          const isCurrentlyTyping =
            isTypingActive && activeFactIndex === index && !allFinished

          return (
            <div
              key={index}
              className="group relative border-l-4 border-teal-500 hover:border-emerald-400 pl-5 sm:pl-7 py-4 transition-all duration-300 bg-slate-900/60 dark:bg-slate-900/80 rounded-r-2xl border border-y-0 border-r-0 border-slate-800 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400">
                  Proof 0{index + 1}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrentlyTyping
                      ? 'bg-emerald-400 animate-ping'
                      : 'bg-emerald-400/80'
                  }`}
                />
              </div>

              <p className="text-[20px] sm:text-[25px] font-bold text-white dark:text-white leading-[1.35] tracking-[-0.015em] m-0 min-h-[1.4em]">
                <span>{text}</span>
                {isCurrentlyTyping && (
                  <span className="inline-block w-2.5 h-5 bg-emerald-400 ml-1 animate-pulse align-middle" />
                )}
              </p>

              {fact.sourceNote && (
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  [{fact.sourceNote}]
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

