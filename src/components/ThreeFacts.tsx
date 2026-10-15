'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface FactItem {
  statement: string
  sourceNote?: string
}

export interface ThreeFactsProps {
  facts: FactItem[]
  anchorId?: string
}

function TypewriterFact({
  statement,
  sourceNote,
  delay = 0,
  index,
}: {
  statement: string
  sourceNote?: string
  delay?: number
  index: number
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the user has actually scrolled down from the landing page
    const checkScrollAndVisibility = () => {
      if (typeof window === 'undefined') return

      // Must be scrolled down away from the initial landing screen
      const hasScrolledDown = window.scrollY > 60
      if (!hasScrolledDown) return

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        // Card is well inside viewport
        if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
          setHasStarted(true)
          cleanup()
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger if intersecting AND user has scrolled down from the landing screen
        if (entries[0].isIntersecting && window.scrollY > 60) {
          setHasStarted(true)
          cleanup()
        }
      },
      { threshold: 0.25 }
    )

    const cleanup = () => {
      observer.disconnect()
      window.removeEventListener('scroll', checkScrollAndVisibility)
    }

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    window.addEventListener('scroll', checkScrollAndVisibility, { passive: true })

    return cleanup
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    // If reduced motion is requested, display text immediately
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayedText(statement)
      setIsFinished(true)
      return
    }

    const startTimer = setTimeout(() => {
      setIsTyping(true)
      let currentIdx = 0
      const totalChars = statement.length

      const typingInterval = setInterval(() => {
        currentIdx++
        setDisplayedText(statement.slice(0, currentIdx))

        if (currentIdx >= totalChars) {
          clearInterval(typingInterval)
          setIsTyping(false)
          setIsFinished(true)
        }
      }, 22) // Crisp 22ms per character cadence

      return () => clearInterval(typingInterval)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [statement, hasStarted, delay])

  return (
    <div
      ref={cardRef}
      className="group relative border-l-4 border-teal-500 hover:border-emerald-400 pl-5 sm:pl-7 py-4 transition-all duration-300 bg-slate-900/60 dark:bg-slate-900/80 rounded-r-2xl border border-y-0 border-r-0 border-slate-800 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400">
          Proof 0{index + 1}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
      </div>

      <p className="text-[20px] sm:text-[25px] font-bold text-white dark:text-white leading-[1.35] tracking-[-0.015em] m-0 min-h-[1.4em]">
        <span>{displayedText}</span>
        {isTyping && (
          <span className="inline-block w-2 h-5 bg-emerald-400 ml-1 animate-pulse align-middle" />
        )}
      </p>

      {sourceNote && (
        <span className="text-[11px] text-slate-500 font-mono mt-1 block">
          [{sourceNote}]
        </span>
      )}
    </div>
  )
}

export function ThreeFacts({ facts, anchorId = 'facts' }: ThreeFactsProps) {
  if (!facts || facts.length === 0) return null

  return (
    <section
      id={anchorId}
      className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto"
    >
      <div className="grid gap-6 sm:gap-8">
        {facts.map((fact, index) => (
          <TypewriterFact
            key={index}
            statement={fact.statement}
            sourceNote={fact.sourceNote}
            delay={index * 350}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
