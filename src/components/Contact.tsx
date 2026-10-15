'use client'

import React, { useState } from 'react'

export interface ContactProps {
  activeAudience?: 'hire' | 'client' | 'build'
  hireHeading?: string
  clientHeading?: string
  buildHeading?: string
  defaultHeading?: string
  subtext?: string
  email?: string
  whatsApp?: string
  whatsAppLink?: string
  cvModernUrl?: string
  cvEuropassUrl?: string
  privacyNote?: string
  anchorId?: string
}

export function Contact({
  activeAudience,
  hireHeading = "Looking for an intern who ships? Let's talk.",
  clientHeading = "Tell me what's costing your business time or money.",
  buildHeading = "Building something? Let's build it properly.",
  defaultHeading = 'Say hello.',
  subtext = 'I usually respond within a few hours. Direct WhatsApp or email works best.',
  email = 'anshr71t9@outlook.com',
  whatsApp = '+39 351 493 0310',
  whatsAppLink = 'https://wa.me/393514930310',
  cvModernUrl = '/cv-ansh-rajput.pdf',
  cvEuropassUrl = '/cv-europass-ansh-rajput.pdf',
  privacyNote = 'Privacy: This form stores your name, email, and message only for me to reply to you. You can ask for complete deletion at any time.',
  anchorId = 'contact',
}: ContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  let currentHeading = defaultHeading
  if (activeAudience === 'hire') currentHeading = hireHeading
  else if (activeAudience === 'client') currentHeading = clientHeading
  else if (activeAudience === 'build') currentHeading = buildHeading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const mailtoUrl = `mailto:${email}?subject=Contact from ${encodeURIComponent(
        formState.name
      )} (${activeAudience || 'General'})&body=${encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
      )}`
      window.location.href = mailtoUrl
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Dynamic Heading */}
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
          Direct Line
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {currentHeading}
        </h2>
        <p className="mt-2.5 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[50ch] font-medium">
          {subtext}
        </p>
      </div>

      {/* Direct Contact Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 min-h-[54px] px-6 rounded-[16px] text-[16px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>💬</span>
          <span>Message on WhatsApp</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-center justify-center gap-2.5 min-h-[54px] px-6 rounded-[16px] text-[16px] font-bold bg-white dark:bg-[#111827] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 hover:border-teal-500 transition-all shadow-sm cursor-pointer"
        >
          <span>✉️</span>
          <span>Email me</span>
        </a>
      </div>

      {/* CV Download Buttons */}
      <div className="p-5 sm:p-6 rounded-[20px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="block text-[15px] font-bold text-slate-900 dark:text-white">
            Curriculum Vitae (PDF)
          </span>
          <span className="text-[13px] text-slate-500 dark:text-slate-400">
            Updated for European internship & engineering applications
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={cvModernUrl}
            download="cv-ansh-rajput.pdf"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-xs"
          >
            Download CV
          </a>
          <a
            href={cvEuropassUrl}
            download="cv-europass-ansh-rajput.pdf"
            className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-teal-400 underline underline-offset-2 transition-colors"
          >
            Europass version
          </a>
        </div>
      </div>

      {/* Optional Short Contact Form */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900 dark:text-white m-0 mb-4">
          Send a direct message
        </h3>

        {status === 'sent' ? (
          <div className="p-4 rounded-[14px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Thank you! Your email client has opened. I will reply as soon as possible.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-[15px]"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-[15px]"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-[15px]"
                placeholder="Tell me what you are building or what your business needs..."
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[50px] rounded-[14px] text-[15px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}

        {/* Privacy Note */}
        <p className="mt-4 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed m-0">
          {privacyNote}
        </p>
      </div>
    </section>
  )
}
