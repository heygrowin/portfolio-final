import React from 'react'

export interface FactItem {
  statement: string
  sourceNote?: string
}

export interface ThreeFactsProps {
  facts: FactItem[]
  anchorId?: string
}

export function ThreeFacts({ facts, anchorId = 'facts' }: ThreeFactsProps) {
  if (!facts || facts.length === 0) return null

  return (
    <section id={anchorId} className="w-full py-14 sm:py-20 px-5 max-w-[680px] mx-auto">
      <div className="grid gap-6 sm:gap-8">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="border-l-2 border-[var(--brand)] pl-5 sm:pl-6 py-1 transition-all"
          >
            <p className="text-[20px] sm:text-[24px] font-semibold text-[var(--ink)] leading-[1.35] tracking-[-0.015em] m-0">
              {fact.statement}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
