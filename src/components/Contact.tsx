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

    // Local client-side mailto fallback or simple mock submit
    try {
      // In production, Payload Form Builder or API endpoint handles this
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
        <h2 className="text-[32px] sm:text-[40px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-tight m-0">
          {currentHeading}
        </h2>
        <p className="mt-2 text-[17px] text-[var(--muted)] leading-relaxed max-w-[50ch]">
          {subtext}
        </p>
      </div>

      {/* Direct Contact Buttons (Large, thumb-sized) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 min-h-[54px] px-6 rounded-[16px] text-[16px] font-semibold bg-[var(--accent)] text-[#04261C] hover:bg-[#34D399] transition-colors shadow-sm"
        >
          <span>Message on WhatsApp</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-center justify-center gap-2.5 min-h-[54px] px-6 rounded-[16px] text-[16px] font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors shadow-sm"
        >
          <span>Email me</span>
        </a>
      </div>

      {/* CV Download Buttons */}
      <div className="p-5 rounded-[18px] bg-[var(--surface)] border border-[var(--line)] mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="block text-[15px] font-semibold text-[var(--ink)]">
            Curriculum Vitae (PDF)
          </span>
          <span className="text-[13px] text-[var(--muted)]">
            Updated for European internship applications
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={cvModernUrl}
            download
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 transition-colors shadow-sm"
          >
            Download CV
          </a>
          <a
            href={cvEuropassUrl}
            download
            className="text-[13px] text-[var(--muted)] hover:text-[var(--brand)] underline underline-offset-2 transition-colors"
          >
            Europass version
          </a>
        </div>
      </div>

      {/* Optional Short Contact Form */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-[var(--surface)] border border-[var(--line)] shadow-sm">
        <h3 className="text-[20px] font-bold text-[var(--ink)] m-0 mb-4">
          Send a direct message
        </h3>

        {status === 'sent' ? (
          <div className="p-4 rounded-[12px] bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
            Thank you! Your message client has been opened. I will reply soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-[13px] font-medium text-[var(--muted)] mb-1">
                Your name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-white dark:bg-[#1E293B] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none text-[15px]"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-[13px] font-medium text-[var(--muted)] mb-1">
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-white dark:bg-[#1E293B] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none text-[15px]"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-[13px] font-medium text-[var(--muted)] mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 rounded-[12px] bg-white dark:bg-[#1E293B] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none text-[15px]"
                placeholder="Tell me what you are building or what your business needs..."
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-[14px] text-[15px] font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 transition-colors shadow-sm cursor-pointer"
            >
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}

        {/* Privacy Note */}
        <p className="mt-4 text-[12px] text-[var(--muted)] leading-relaxed m-0">
          {privacyNote}
        </p>
      </div>
    </section>
  )
}
