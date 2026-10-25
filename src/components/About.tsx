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

  return (
    <>
      <section
        id={anchorId}
        className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto text-slate-100"
      >
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
            <span>Executive Dossier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
            About Ansh
          </h2>
          <p className="mt-2 text-[17px] text-slate-300 leading-relaxed max-w-[52ch] font-medium">
            The face and mind behind the systems. 19-year-old engineer in Messina, Italy, building software small businesses run on.
          </p>
        </div>

        {/* Main Profile Showcase Card */}
        <div className="relative rounded-[28px] bg-gradient-to-b from-slate-900/90 via-[#0F172A]/90 to-slate-950/95 border border-white/12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden p-6 sm:p-8">
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Row: Photo + Instant Summary */}
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

            {/* Core Identity Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-[24px] sm:text-[26px] font-extrabold text-white leading-tight m-0">
                    Ansh Rajput
                  </h3>
                  <p className="text-[14px] text-emerald-400 font-semibold mt-0.5 m-0">
                    Full-Stack Engineer & Founder @ HeyGrowin
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

              {/* Geo & Education Pill Row */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[12px] font-medium text-slate-300">
                  <span>📍</span>
                  <span>Messina, Sicily (CET) · Bilaspur, India</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[12px] font-medium text-slate-300">
                  <span>🎓</span>
                  <span>BSc Data Analysis, Uni Messina</span>
                </span>
              </div>

              {/* Short Bio */}
              <p className="mt-3.5 text-[14px] sm:text-[15px] leading-relaxed text-slate-300/90 m-0 font-normal">
                I don’t just write code; I take chaotic, paper-heavy operations and turn them into quiet, reliable software. Running production systems for 2+ years with zero silent failures.
              </p>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="mt-7 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="block text-[22px] font-extrabold text-white leading-none">19</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Years Old</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="block text-[22px] font-extrabold text-emerald-400 leading-none">2+ Yrs</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Daily Production</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="block text-[22px] font-extrabold text-teal-400 leading-none">0</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Quiet Failures</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="block text-[22px] font-extrabold text-amber-400 leading-none">AIR 275</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Cyber Olympiad</span>
            </div>
          </div>

          {/* Quick Action Button Hub */}
          <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={cvModernUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[#34D399] text-[#04261C] font-bold text-[13px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download CV (Modern)</span>
              </a>

              <a
                href={cvEuropassUrl}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-[13px] transition-colors"
              >
                <span>🇪🇺 Europass CV</span>
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
          POPUP EXECUTIVE DOSSIER MODAL (The Quick Recruiter/Client View)
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
                  Candidate Dossier · High-Yield Summary
                </span>
                <h3 className="text-[22px] font-extrabold text-white m-0 leading-tight">
                  Ansh Rajput
                </h3>
                <p className="text-[13px] text-slate-400 m-0">
                  Data Analysis Undergrad @ Uni Messina · Full-Stack Builder
                </p>
              </div>
            </div>

            {/* Quick Summary Sections */}
            <div className="space-y-4 text-[14px]">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-emerald-300 block mb-1">🎯 What I Bring</strong>
                <p className="text-slate-300 m-0 leading-relaxed text-[13px]">
                  End-to-end full-stack craftsmanship. I bridge raw business problems with production software: Next.js, TypeScript, Firebase, Python pipelines, and clean relational databases.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-teal-300 block mb-1">📍 Availability & Location</strong>
                <p className="text-slate-300 m-0 leading-relaxed text-[13px]">
                  Resident in Messina, Italy (CET timezone). Open for European software engineering / data internships (hybrid or remote) and high-impact client systems. Dual phone support (Italy & India).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-amber-300 block mb-1">⚡ Core Tech Arsenal</strong>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['TypeScript', 'Next.js', 'React', 'Node.js', 'Firebase', 'Python', 'PostgreSQL', 'Tailwind CSS', 'System Design'].map((tech) => (
                    <span key={tech} className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 text-[12px] font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <strong className="text-purple-300 block mb-1">🗣️ Languages</strong>
                <p className="text-slate-300 m-0 leading-relaxed text-[13px]">
                  • <strong>English:</strong> Professional Working & Fluent<br />
                  • <strong>Italian:</strong> Elementary / In-country Immersion (Uni Messina)<br />
                  • <strong>Hindi:</strong> Native
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={cvModernUrl}
                download
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[#34D399] text-[#04261C] font-bold text-[13px] text-center transition-colors"
              >
                Download CV (1-Page)
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
