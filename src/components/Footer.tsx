'use client'

import React from 'react'

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800/90 pt-16 pb-12 px-5">
      <div className="max-w-[680px] mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider shadow-sm">
            <span>🌐</span>
            <span>Let&apos;s Connect</span>
          </div>
          <h3 className="text-[26px] sm:text-[32px] font-extrabold text-white tracking-[-0.03em] m-0">
            Social Profiles & Direct Channels
          </h3>
          <p className="mt-2 text-[15px] sm:text-[16px] text-slate-400 m-0">
            Open to European internships, HeyGrowin client inquiries, and technical collaborations.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {/* ========================================================
              DIRECT PHONE & WHATSAPP LINES
              ======================================================== */}
          {/* 🇮🇹 Italian Line */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  🇮🇹 Italian Line (Direct / WhatsApp)
                </span>
                <div className="text-[17px] font-extrabold text-white mt-0.5">
                  +39 351 493 0310
                </div>
                <span className="text-[12px] text-slate-400">
                  Messina, Sicily · UTC+1
                </span>
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30">
                💬
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <a
                href="https://wa.me/393514930310"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[12px] text-center transition-all"
              >
                WhatsApp ↗
              </a>
              <a
                href="tel:+393514930310"
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[12px] text-center transition-all"
              >
                Call 📞
              </a>
            </div>
          </div>

          {/* 🇮🇳 Indian Line */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  🇮🇳 Indian Line (Direct / WhatsApp)
                </span>
                <div className="text-[17px] font-extrabold text-white mt-0.5">
                  +91 91110 05300
                </div>
                <span className="text-[12px] text-slate-400">
                  Bilaspur, CG · IST (UTC+5:30)
                </span>
              </div>
              <span className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-500/30">
                💬
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <a
                href="https://wa.me/919111005300"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[12px] text-center transition-all"
              >
                WhatsApp ↗
              </a>
              <a
                href="tel:+919111005300"
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[12px] text-center transition-all"
              >
                Call 📞
              </a>
            </div>
          </div>

          {/* ========================================================
              EMAIL CHANNELS
              ======================================================== */}
          {/* Professional Mail */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between gap-3 group">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                💼 Professional & Business Mail
              </span>
              <div className="text-[15px] sm:text-[16px] font-extrabold text-white mt-1 break-all">
                heygrowteam@gmail.com
              </div>
              <span className="text-[12px] text-slate-400 block mt-0.5">
                For client inquiries, estimates & studio projects
              </span>
            </div>
            <a
              href="mailto:heygrowteam@gmail.com?subject=Inquiry%20from%20Portfolio"
              className="py-2 px-3 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-[12px] text-center transition-all"
            >
              Compose Email ↗
            </a>
          </div>

          {/* Direct / Personal Mail */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between gap-3 group">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                👤 Direct / Academic Mail
              </span>
              <div className="text-[15px] sm:text-[16px] font-extrabold text-white mt-1 break-all">
                anshr71t9@outlook.com
              </div>
              <span className="text-[12px] text-slate-400 block mt-0.5">
                For recruiters, internships & research discussions
              </span>
            </div>
            <a
              href="mailto:anshr71t9@outlook.com?subject=Hello%20Ansh%20-%20From%20Portfolio"
              className="py-2 px-3 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white font-bold text-[12px] text-center transition-all"
            >
              Compose Email ↗
            </a>
          </div>

          {/* ========================================================
              SOCIAL & CODE REPOSITORIES
              ======================================================== */}
          {/* LinkedIn */}
          <a
            href="https://in.linkedin.com/in/ansh-rajput-529328428"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 grid place-items-center text-lg font-bold border border-blue-500/30">
                in
              </span>
              <div>
                <div className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors">
                  LinkedIn
                </div>
                <div className="text-[12px] text-slate-400">
                  ansh-rajput-529328428
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-white transition-colors text-sm font-bold">
              Connect ↗
            </span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/heygrowin"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 grid place-items-center text-lg font-bold border border-purple-500/30">
                🐙
              </span>
              <div>
                <div className="text-[15px] font-bold text-white group-hover:text-purple-400 transition-colors">
                  GitHub
                </div>
                <div className="text-[12px] text-slate-400">
                  github.com/heygrowin
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-white transition-colors text-sm font-bold">
              Follow ↗
            </span>
          </a>

          {/* Instagram (Personal) */}
          <a
            href="https://instagram.com/ansh__3070"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 grid place-items-center text-lg font-bold border border-rose-500/30">
                📸
              </span>
              <div>
                <div className="text-[15px] font-bold text-white group-hover:text-rose-400 transition-colors">
                  Instagram (Personal)
                </div>
                <div className="text-[12px] text-slate-400">
                  @ansh__3070
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-white transition-colors text-sm font-bold">
              Follow ↗
            </span>
          </a>

          {/* Instagram (HeyGrowin) */}
          <a
            href="https://instagram.com/hey.growin"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 grid place-items-center text-lg font-bold border border-amber-500/30">
                🌱
              </span>
              <div>
                <div className="text-[15px] font-bold text-white group-hover:text-amber-400 transition-colors">
                  Instagram (HeyGrowin)
                </div>
                <div className="text-[12px] text-slate-400">
                  @hey.growin
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-white transition-colors text-sm font-bold">
              Follow ↗
            </span>
          </a>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="text-center sm:text-left">
            <p className="m-0 text-slate-300 font-medium">
              Ansh Rajput · HeyGrowin · Messina, Italy & Bilaspur, India
            </p>
            <p className="m-0 text-[12px] text-slate-500 mt-1">
              Honest by design. Client names displayed only with verified permission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="px-3 py-2 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white text-[12px] font-medium transition-all flex items-center gap-1"
              title="Open Payload CMS Admin Panel"
            >
              <span>⚙️ CMS Admin</span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="px-4 py-2 rounded-full border border-slate-800 hover:border-teal-500 bg-slate-900 text-slate-300 hover:text-white text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>↑ Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
