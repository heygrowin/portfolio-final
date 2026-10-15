'use client'

import React, { useRef, useState, useEffect } from 'react'

export interface EducationProps {
  anchorId?: string
}

export function Education({ anchorId = 'education' }: EducationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto border-t border-slate-800/80"
    >
      {/* Section Header */}
      <div className="mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[12px] font-bold mb-3 uppercase tracking-wider shadow-sm">
          <span>🎓</span>
          <span>Academic Background</span>
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          Education & Training
        </h2>
        <p className="mt-2.5 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[50ch] font-medium">
          Formal university coursework in data analysis, foundational computer science, and technology leadership.
        </p>
      </div>

      <div
        className={`flex flex-col gap-6 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* ========================================================
            CARD 1: UNIVERSITY OF MESSINA (DEGREE)
            ======================================================== */}
        <div className="relative rounded-[24px] p-6 sm:p-7 bg-white dark:bg-[#111827] border-2 border-blue-500/40 shadow-xl overflow-hidden group hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
              <span>🏛️</span>
              <span>2026 – Current · In Progress</span>
            </span>
            <span className="text-[12px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">
              EQF Level 6
            </span>
          </div>

          <div>
            <h3 className="text-[20px] sm:text-[23px] font-extrabold text-slate-900 dark:text-white leading-snug m-0">
              Bachelor&apos;s Degree in Data Analysis
            </h3>
            <p className="mt-1 text-[15px] font-semibold text-blue-600 dark:text-blue-400 m-0">
              University of Messina (Università degli Studi di Messina) · Messina, Italy 🇮🇹
            </p>
            <p className="mt-2.5 text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed m-0">
              Academic training covering statistical analysis, database architecture, mathematical foundations, and software systems. Running HeyGrowin systems studio while pursuing full-time studies.
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-[12px]">
            {['Data Analysis', 'Statistical Inference', 'Python', 'Relational Databases', 'Algorithms'].map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================
            CARD 2: KRISHNA PUBLIC SCHOOL (SECONDARY SCHOOL)
            ======================================================== */}
        <div className="relative rounded-[24px] p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              <span>🏫</span>
              <span>Graduated 2026</span>
            </span>
            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
              CBSE Class XII · EQF Level 4
            </span>
          </div>

          <div>
            <h3 className="text-[19px] sm:text-[21px] font-extrabold text-slate-900 dark:text-white leading-snug m-0">
              Higher Secondary School Certificate (CBSE)
            </h3>
            <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-emerald-600 dark:text-emerald-400 m-0">
              Krishna Public School · Bilaspur, India 🇮🇳
            </p>
          </div>

          <ul className="mt-3.5 space-y-2.5 text-[14px] text-slate-600 dark:text-slate-300 list-none p-0 m-0">
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">▸</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Cyber In-Charge:</strong> Managed school technical systems and organised inter-school technology competitions including EVOLV 2025.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">▸</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Organised EVOLV 2025:</strong> Spearheaded EVOLV 2025, an inter-school technology competition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">▸</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Technical Lead:</strong> Video editing, stage animation, and web production for annual school functions (Certified 2022 & 2023).
              </span>
            </li>
          </ul>
        </div>

        {/* ========================================================
            CARD 3: LANGUAGE SKILLS
            ======================================================== */}
        <div className="p-5 sm:p-6 rounded-[20px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-white m-0 mb-3 flex items-center gap-2">
            <span>🌐</span>
            <span>Language Proficiencies</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                English
              </div>
              <div className="text-[15px] font-extrabold text-slate-900 dark:text-white mt-0.5">
                B2 Independent
              </div>
              <div className="text-[12px] text-teal-600 dark:text-teal-400 font-medium">
                IELTS Band 6.0 (12/2025)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Hindi
              </div>
              <div className="text-[15px] font-extrabold text-slate-900 dark:text-white mt-0.5">
                Native Speaker
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                Mother tongue
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Italian
              </div>
              <div className="text-[15px] font-extrabold text-slate-900 dark:text-white mt-0.5">
                Conversational
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                Living in Messina, Sicily
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
