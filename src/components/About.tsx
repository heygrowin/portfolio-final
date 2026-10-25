'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export interface AboutProps {
  anchorId?: string
  cvModernUrl?: string
  cvEuropassUrl?: string
  whatsAppLink?: string
  email?: string
}

export function About({
  anchorId = 'about',
  cvModernUrl = '/cv-ansh-rajput.pdf',
  cvEuropassUrl = '/cv-europass-ansh-rajput.pdf',
  whatsAppLink = 'https://wa.me/393514930310?text=Hi%20Ansh%2C%20I%20reviewed%20your%20portfolio%20and%20would%20love%20to%20talk.',
  email = 'anshr71t9@outlook.com',
}: AboutProps) {
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  const infoCards = [
    {
      num: '01',
      title: 'IDEAS INTO PRODUCTS',
      desc: 'I turn concepts into software people can actually use.',
      accent: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/30',
      numColor: 'text-emerald-400',
    },
    {
      num: '02',
      title: 'BEYOND THE CODE',
      desc: 'I think about the problem, the people, and the solution.',
      accent: 'from-blue-500/20 to-indigo-500/5',
      border: 'border-blue-500/30',
      numColor: 'text-blue-400',
    },
    {
      num: '03',
      title: 'ALWAYS EXPERIMENTING',
      desc: 'I learn by building, testing, and improving.',
      accent: 'from-amber-500/20 to-orange-500/5',
      border: 'border-amber-500/30',
      numColor: 'text-amber-400',
    },
    {
      num: '04',
      title: 'A GLOBAL PERSPECTIVE',
      desc: 'Studying in Italy, building skills for a world without borders.',
      accent: 'from-purple-500/20 to-pink-500/5',
      border: 'border-purple-500/30',
      numColor: 'text-purple-400',
    },
  ]

  return (
    <>
      <section
        id={anchorId}
        className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto text-slate-100"
      >
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
            <span>EXECUTIVE DOSSIER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
            About Ansh
          </h2>
          <p className="mt-2 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[54ch] font-medium">
            The face and mind behind the systems. An independent developer and creative technologist building software, digital products, and solutions that turn ideas into reality.
          </p>
        </div>

        {/* Main Profile Showcase Card */}
        <div className="relative rounded-[28px] bg-gradient-to-b from-slate-900/90 via-[#0F172A]/90 to-slate-950/95 border border-white/12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden p-6 sm:p-8">
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Row: Photo + Core Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-7">
            {/* Portrait Frame with Glow and Online Ring */}
            <div className="relative flex-none">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/40 bg-slate-800">
                <Image
                  src="/ansh.jpg"
                  alt="Ansh Rajput"
                  fill
                  sizes="128px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Online Indicator Badge */}
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-emerald-500/50 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Messina
                </span>
              </div>
            </div>

            {/* Core Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-[24px] sm:text-[28px] font-extrabold text-white leading-tight m-0">
                    Ansh Rajput
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-emerald-400 font-semibold mt-1 m-0">
                    Independent Developer · Freelancer · Creator
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="self-center sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[12px] font-bold text-slate-200 transition-colors shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 stroke-emerald-400" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Quick Dossier</span>
                </button>
              </div>

              {/* Location & Education Badges */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[12px] font-medium text-slate-300">
                  <span>📍</span>
                  <span>Messina, Sicily, Italy · Originally from Bilaspur, India</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[12px] font-medium text-slate-300">
                  <span>🎓</span>
                  <span>BSc Data Analysis · University of Messina</span>
                </span>
              </div>

              {/* Personal Statement */}
              <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-white/[0.04] border-l-4 border-emerald-400 text-left">
                <p className="text-[14px] leading-relaxed text-slate-200 m-0 italic font-medium">
                  &ldquo;I don&apos;t just write code; I think about the problem, the people, and the possibilities behind every product. I combine engineering, experimentation, and creative thinking to turn ideas into useful digital experiences.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Four Information Cards (01 to 04) */}
          <div className="mt-7 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {infoCards.map((card) => (
                <div
                  key={card.num}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${card.accent} border ${card.border} backdrop-blur-md transition-transform hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[12px] font-black tracking-widest ${card.numColor}`}>
                      {card.num}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-200 m-0 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons Hub */}
          <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={cvModernUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[#34D399] text-[#04261C] font-bold text-[13px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download CV (Modern)</span>
              </a>

              <a
                href={cvEuropassUrl}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-[13px] transition-colors"
              >
                <span>🇪🇺 EU Europass CV</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-[13px] transition-colors"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-[13px] transition-colors"
              >
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          POPUP EXECUTIVE DOSSIER MODAL
          ======================================================== */}
      {isDossierOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ansh Rajput Executive Dossier"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsDossierOpen(false)}
        >
          <div
            className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[28px] bg-[#0F172A] border border-white/20 p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsDossierOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 grid place-items-center cursor-pointer transition-colors"
              aria-label="Close dossier"
            >
              ✕
            </button>

            {/* Dossier Header */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-emerald-500/40 bg-slate-800 flex-none">
                <Image
                  src="/ansh.jpg"
                  alt="Ansh Rajput"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                  EXECUTIVE DOSSIER ●
                </span>
                <h3 className="text-[22px] font-extrabold text-white m-0 leading-tight">
                  Ansh Rajput
                </h3>
                <p className="text-[13px] text-slate-400 m-0">
                  Independent Developer · Freelancer · Creator
                </p>
              </div>
            </div>

            {/* Quick Summary Sections */}
            <div className="space-y-3.5 text-[14px]">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-emerald-300 block mb-1">📍 Location & Education</strong>
                <p className="text-slate-300 m-0 leading-relaxed text-[13px]">
                  Messina, Sicily, Italy · Originally from Bilaspur, India<br />
                  BSc Data Analysis · University of Messina
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-teal-300 block mb-1">🎯 Personal Statement</strong>
                <p className="text-slate-300 m-0 leading-relaxed text-[13px] italic">
                  &ldquo;I don&apos;t just write code; I think about the problem, the people, and the possibilities behind every product. I combine engineering, experimentation, and creative thinking to turn ideas into useful digital experiences.&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-amber-300 block mb-1">⚡ Four Pillars</strong>
                <div className="space-y-1.5 text-[12px] text-slate-300 mt-1">
                  <div><strong>01:</strong> I turn concepts into software people can actually use.</div>
                  <div><strong>02:</strong> I think about the problem, the people, and the solution.</div>
                  <div><strong>03:</strong> I learn by building, testing, and improving.</div>
                  <div><strong>04:</strong> Studying in Italy, building skills for a world without borders.</div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={cvModernUrl}
                download
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[#34D399] text-[#04261C] font-bold text-[13px] text-center transition-colors"
              >
                Download CV (Modern)
              </a>
              <button
                type="button"
                onClick={() => setIsDossierOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
