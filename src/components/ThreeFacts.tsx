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
  delay = 0,
  shouldStart,
}: {
  statement: string
  delay?: number
  shouldStart: boolean
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (!shouldStart) return

    // If reduced motion is requested, display immediately
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
      }, 26) // Smooth 26ms per character cadence

      return () => clearInterval(typingInterval)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [statement, shouldStart, delay])

  return (
    <div className="border-l-3 border-[var(--brand)] pl-5 sm:pl-7 py-2 transition-all duration-300 hover:border-[var(--accent)] bg-slate-900/30 dark:bg-slate-900/50 rounded-r-2xl p-4 border border-y-0 border-r-0 border-slate-800/40">
      <p className="text-[20px] sm:text-[25px] font-bold text-white dark:text-white leading-[1.35] tracking-[-0.015em] m-0 min-h-[1.4em]">
        <span>{displayedText}</span>
        {isTyping && (
          <span className="inline-block w-2 h-5 bg-[var(--accent)] ml-1 animate-pulse align-middle" />
        )}
      </p>
    </div>
  )
}

export function ThreeFacts({ facts, anchorId = 'facts' }: ThreeFactsProps) {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!facts || facts.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto"
    >
      <div className="grid gap-6 sm:gap-8">
        {facts.map((fact, index) => (
          <TypewriterFact
            key={index}
            statement={fact.statement}
            delay={index * 550}
            shouldStart={inView}
          />
        ))}
      </div>
    </section>
  )
}
