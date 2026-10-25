'use client'

import React, { useState } from 'react'
import { soundManager } from '@/lib/audio'

// ========================================================
// 1. RAJA NURSERY INTERACTIVE REGISTER & BEFORE/AFTER
// ========================================================
export function RajaNurseryInteractive() {
  const [activeTab, setActiveTab] = useState<'interactive' | 'beforeAfter'>('interactive')
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [cart, setCart] = useState<Array<{ name: string; price: number; icon: string }>>([
    { name: 'Areca Palm', price: 15, icon: '🪴' },
  ])
  const [lastBilled, setLastBilled] = useState<string | null>(null)

  const items = [
    { name: 'Areca Palm', price: 15, icon: '🪴' },
    { name: 'Monstera', price: 18, icon: '🌱' },
    { name: 'Ceramic Pot', price: 8, icon: '🏺' },
    { name: 'Soil 5kg', price: 5, icon: '🪵' },
  ]

  const total = cart.reduce((acc, curr) => acc + curr.price, 0)

  const handleAddItem = (item: typeof items[0], e: React.MouseEvent) => {
    e.stopPropagation()
    soundManager.playSubsequentNotification()
    setCart((prev) => [...prev, item])
    setLastBilled(null)
  }

  const handleCheckout = (e: React.MouseEvent) => {
    e.stopPropagation()
    soundManager.playFirstNotification()
    setLastBilled(`Invoice #${Math.floor(1000 + Math.random() * 9000)} · €${total}.00 Paid · Stock Updated`)
    setCart([])
  }

  return (
    <div
      className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-[#0B151E] to-slate-950 text-white rounded-2xl border border-white/10 shadow-inner select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Mode Switcher */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[12px]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Live POS Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beforeAfter')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'beforeAfter'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Before vs After
          </button>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Prototype</span>
        </span>
      </div>

      {/* MODE 1: Interactive Cashier & Pot Register */}
      {activeTab === 'interactive' && (
        <div className="space-y-3">
          <div className="text-[12px] text-slate-300 flex items-center justify-between">
            <span className="font-semibold text-slate-200">Tap items to bill at the counter:</span>
            <span className="text-emerald-400 font-bold">{cart.length} item(s) in queue</span>
          </div>

          {/* Quick Item Tap Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {items.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={(e) => handleAddItem(item, e)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-left transition-all active:scale-95 cursor-pointer group"
              >
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-[12px] font-bold text-white leading-tight">{item.name}</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">€{item.price}.00</div>
              </button>
            ))}
          </div>

          {/* Cashier Register Bar */}
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Bill</div>
              <div className="text-[18px] font-extrabold text-white leading-tight">€{total}.00</div>
            </div>

            {lastBilled ? (
              <div className="flex-1 text-right">
                <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[12px] font-bold animate-in zoom-in-95 duration-200">
                  {lastBilled}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`px-4 py-2 rounded-xl text-[12px] font-extrabold transition-all cursor-pointer ${
                  cart.length > 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50 active:scale-95'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                ⚡ Generate Counter Bill
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: Visual Before & After Slider */}
      {activeTab === 'beforeAfter' && (
        <div className="space-y-3">
          <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden border border-white/15 select-none bg-slate-950">
            {/* Left: BEFORE (Manual Paper Chaos) */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-br from-amber-950/90 via-slate-900 to-black p-4 flex flex-col justify-between overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-rose-500/30 border border-rose-500/50 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Before: Manual Paper
                </span>
                <p className="text-[13px] text-amber-200/90 font-medium mt-2 leading-relaxed max-w-[26ch]">
                  Handwritten paper pads. Stock counts took 2+ hours after closing. Lost customer slips.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ✖ 40+ min weekend cashier delays
              </div>
            </div>

            {/* Right: AFTER (Cloud Web App) */}
            <div
              className="absolute inset-y-0 right-0 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-black p-4 flex flex-col justify-between items-end text-right overflow-hidden"
              style={{ width: `${100 - sliderPos}%` }}
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  After: HeyGrowin System
                </span>
                <p className="text-[13px] text-emerald-200/90 font-medium mt-2 leading-relaxed max-w-[26ch]">
                  1-tap mobile register. Instant counter receipt. Pot inventory tracked automatically in real time.
                </p>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono font-bold">
                ✔ 0 lost bills · Same-day support
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-950 grid place-items-center text-[10px] font-bold shadow-lg">
                ⇄
              </div>
            </div>
          </div>

          {/* Interactive Range Input */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-rose-400">Paper Slips</span>
            <input
              type="range"
              min="10"
              max="90"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[11px] font-bold text-emerald-400">Automated POS</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================================
// 2. ANSH COLOR LAB INTERACTIVE BARCODE SCANNER & METERS
// ========================================================
export function AnshColorLabInteractive() {
  const [rolls, setRolls] = useState<number>(142)
  const [cyanLevel, setCyanLevel] = useState<number>(88)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [lastScanLog, setLastScanLog] = useState<string | null>(null)
  const [showArch, setShowArch] = useState<boolean>(false)

  const handleScan = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isScanning) return
    setIsScanning(true)
    soundManager.playSubsequentNotification()

    setTimeout(() => {
      setRolls((prev) => Math.max(0, prev - 1))
      setCyanLevel((prev) => Math.max(10, prev - 2))
      setIsScanning(false)
      soundManager.playFirstNotification()
      setLastScanLog(`Barcode #890${Math.floor(100 + Math.random() * 900)} scanned · Stock deducted in 34ms`)
    }, 450)
  }

  return (
    <div
      className="p-4 sm:p-5 bg-gradient-to-br from-[#0F172A] via-[#09111E] to-[#040810] text-white rounded-2xl border border-white/10 shadow-inner select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-white">Live Barcode & Inventory Engine</span>
        </div>

        <button
          type="button"
          onClick={() => setShowArch((prev) => !prev)}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
        >
          {showArch ? 'Hide Architecture' : '📐 Blueprint'}
        </button>
      </div>

      {showArch ? (
        /* Architecture Blueprint Flow */
        <div className="p-3.5 rounded-xl bg-black/60 border border-teal-500/30 text-[12px] space-y-2">
          <div className="text-teal-400 font-bold uppercase tracking-wider text-[11px]">System Architecture</div>
          <div className="flex flex-wrap items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <span className="px-2 py-1 rounded bg-white/10 text-white font-bold">Hardware Scanner</span>
            <span>&rarr;</span>
            <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 font-bold">Local SQLite Cache</span>
            <span>&rarr;</span>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">Cloud Firestore</span>
            <span>&rarr;</span>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold">Replenishment Alert</span>
          </div>
          <p className="text-slate-400 text-[11px] m-0">
            Engineered with zero-bloat local caching: counter staff can scan reels even during broadband drops without losing state.
          </p>
        </div>
      ) : (
        /* Live Inventory Meters & Interactive Scanner */
        <div className="space-y-3.5">
          {/* Live Meter Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Fuji Crystal Paper Stock</span>
                <span className="text-teal-400 font-mono font-bold">{rolls} rolls remaining</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (rolls / 150) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Cyan & Magenta Cartridges</span>
                <span className="text-blue-400 font-mono font-bold">{cyanLevel}% (Optimal)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${cyanLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Scanner Action Trigger */}
          <div className="p-3 rounded-xl bg-black/40 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-auto flex-1">
              {isScanning ? (
                <div className="relative h-9 rounded-lg bg-teal-950/60 border border-teal-400/60 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-y-0 left-0 right-0 bg-red-500/30 animate-pulse" />
                  <div className="h-0.5 w-full bg-red-400 shadow-[0_0_8px_red] animate-bounce" />
                  <span className="absolute text-[11px] font-mono font-bold text-teal-300">READING OPTICAL BARCODE...</span>
                </div>
              ) : (
                <div className="text-[12px] text-slate-300">
                  {lastScanLog ? (
                    <span className="text-emerald-400 font-mono font-semibold">{lastScanLog}</span>
                  ) : (
                    <span>Ready for real-time inventory reconciliation.</span>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleScan}
              disabled={isScanning}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 text-[12px] font-extrabold transition-all cursor-pointer shadow-md shadow-teal-950/40"
            >
              🏷️ Simulate Barcode Scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================================
// 3. SKOLAR INTERACTIVE STUDENT DOSSIER PIPELINE
// ========================================================
export function SkolarInteractive() {
  const [step, setStep] = useState<number>(2)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)

  const steps = [
    { label: 'Intake', detail: 'Student passport uploaded' },
    { label: 'OCR Verification', detail: 'Academic transcripts verified' },
    { label: 'Uni Messina Match', detail: 'Data Analysis eligibility 98%' },
    { label: 'Visa Milestone', detail: 'Consular dossier unlocked' },
  ]

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isVerifying) return
    setIsVerifying(true)
    soundManager.playSubsequentNotification()

    setTimeout(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))
      setIsVerifying(false)
      soundManager.playFirstNotification()
    }, 400)
  }

  return (
    <div
      className="p-4 sm:p-5 bg-gradient-to-br from-blue-950/90 via-[#0B1528] to-slate-950 text-white rounded-2xl border border-blue-500/20 shadow-inner select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold">🎓 Automated Admission Intake Engine</span>
        </div>
        <span className="text-[11px] text-blue-300 font-semibold">Active European Pipeline</span>
      </div>

      {/* Interactive Step Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        {steps.map((s, idx) => {
          const isDone = idx <= step
          const isCurrent = idx === step
          return (
            <div
              key={s.label}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'bg-blue-600/30 border-blue-400 shadow-sm'
                  : isDone
                  ? 'bg-white/5 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.02] border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span>Step {idx + 1}</span>
                {isDone && <span className="text-emerald-400">✓</span>}
              </div>
              <div className="text-[12px] font-bold text-white leading-tight">{s.label}</div>
              <div className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">{s.detail}</div>
            </div>
          )
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-[12px] text-slate-300 font-medium">
          Dossier verification automated without lost WhatsApp threads.
        </span>
        <button
          type="button"
          onClick={handleAdvance}
          disabled={isVerifying}
          className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-slate-950 text-[12px] font-extrabold transition-all cursor-pointer flex-none shadow-md"
        >
          {isVerifying ? 'Processing...' : '▶ Advance Intake Step'}
        </button>
      </div>
    </div>
  )
}

// ========================================================
// 4. WORK SECTION TOP METRICS BAR
// ========================================================
export function WorkMetricsBar() {
  return (
    <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-500/20 backdrop-blur-xl shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-[26px] sm:text-[30px] font-black text-white leading-none tracking-tight">2+ Yrs</div>
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Unbroken Daily Production</div>
      </div>
      <div>
        <div className="text-[26px] sm:text-[30px] font-black text-emerald-400 leading-none tracking-tight">0</div>
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Silent Failures</div>
      </div>
      <div>
        <div className="text-[26px] sm:text-[30px] font-black text-teal-400 leading-none tracking-tight">99.98%</div>
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Verified System Uptime</div>
      </div>
      <div>
        <div className="text-[26px] sm:text-[30px] font-black text-amber-400 leading-none tracking-tight">14</div>
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Autonomous Daily Updates</div>
      </div>
    </div>
  )
}
