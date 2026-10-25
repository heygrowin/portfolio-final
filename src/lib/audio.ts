'use client'

class SoundManager {
  private audio1: HTMLAudioElement | null = null
  private audio2: HTMLAudioElement | null = null
  private audio3: HTMLAudioElement | null = null
  private audioCtx: AudioContext | null = null
  private isTypewriterPlaying: boolean = false
  private typewriterFadeTimer: NodeJS.Timeout | null = null
  private pendingFirstSound: boolean = false
  private isUnlocked: boolean = false

  private unlockListeners: Array<(unlocked: boolean) => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      // Clear any previous mute preferences - sounds must ALWAYS play
      try {
        localStorage.removeItem('sound_muted')
      } catch {
        // ignore
      }

      // Preload audio elements
      try {
        this.audio1 = new Audio('/1.mp3')
        this.audio1.preload = 'auto'
        this.audio1.volume = 0.85

        this.audio2 = new Audio('/2.mp3')
        this.audio2.preload = 'auto'
        this.audio2.volume = 0.75

        this.audio3 = new Audio('/3.mp3')
        this.audio3.preload = 'auto'
        this.audio3.loop = true
        this.audio3.volume = 0.65
      } catch {
        // Fallback gracefully if Audio not supported
      }

      const autoUnlock = () => {
        this.unlock()
        window.removeEventListener('pointerdown', autoUnlock, true)
        window.removeEventListener('touchstart', autoUnlock, true)
        window.removeEventListener('click', autoUnlock, true)
        window.removeEventListener('keydown', autoUnlock, true)
        window.removeEventListener('scroll', autoUnlock, true)
        window.removeEventListener('wheel', autoUnlock, true)
        window.removeEventListener('mousemove', autoUnlock, true)
        window.removeEventListener('pointermove', autoUnlock, true)
      }

      window.addEventListener('pointerdown', autoUnlock, { capture: true, passive: true })
      window.addEventListener('touchstart', autoUnlock, { capture: true, passive: true })
      window.addEventListener('click', autoUnlock, { capture: true, passive: true })
      window.addEventListener('keydown', autoUnlock, { capture: true, passive: true })
      window.addEventListener('scroll', autoUnlock, { capture: true, passive: true })
      window.addEventListener('wheel', autoUnlock, { capture: true, passive: true })
      window.addEventListener('mousemove', autoUnlock, { capture: true, passive: true })
      window.addEventListener('pointermove', autoUnlock, { capture: true, passive: true })
    }
  }

  public onUnlock(listener: (unlocked: boolean) => void): () => void {
    this.unlockListeners.push(listener)
    if (this.isUnlocked) {
      try {
        listener(true)
      } catch {
        // ignore
      }
    }
    return () => {
      this.unlockListeners = this.unlockListeners.filter((l) => l !== listener)
    }
  }

  public isUnlockedState(): boolean {
    return this.isUnlocked
  }

  public unlock() {
    if (this.isUnlocked) return
    this.isUnlocked = true

    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass()
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {})
      }
    } catch {
      // ignore
    }

    try {
      if (this.audio1) this.audio1.load()
      if (this.audio2) this.audio2.load()
      if (this.audio3) this.audio3.load()
    } catch {
      // ignore
    }

    // If a notification arrived before user interaction, play it immediately now
    if (this.pendingFirstSound) {
      this.pendingFirstSound = false
      this.playFirstNotification()
    }

    this.unlockListeners.forEach((l) => {
      try {
        l(true)
      } catch {
        // ignore
      }
    })
  }

  // ========================================================
  // WEB AUDIO SYNTHESIZED NOTIFICATION CHIME (Zero-latency fallback)
  // ========================================================
  public playSynthesizedChime(type: 'first' | 'subsequent' = 'subsequent') {
    if (typeof window === 'undefined') return
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass()
        }
      }
      if (!this.audioCtx) return
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {})
      }

      const now = this.audioCtx.currentTime
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()

      osc.type = 'sine'
      if (type === 'first') {
        // Elegant Apple-like two-stage chime (A5 -> E6)
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08)
        gain.gain.setValueAtTime(0.35, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
        osc.connect(gain)
        gain.connect(this.audioCtx.destination)
        osc.start(now)
        osc.stop(now + 0.46)
      } else {
        // Quick subtle glass chime (C6 -> G6)
        osc.frequency.setValueAtTime(1046.5, now)
        osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.05)
        gain.gain.setValueAtTime(0.25, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.connect(gain)
        gain.connect(this.audioCtx.destination)
        osc.start(now)
        osc.stop(now + 0.31)
      }
    } catch {
      // Audio context error safety
    }
  }

  // ========================================================
  // SOUND 1: FIRST NOTIFICATION (public/1.mp3)
  // Plays on the first notification in the hero animation
  // ========================================================
  public playFirstNotification() {
    if (typeof window === 'undefined') return

    try {
      if (this.audio1) {
        this.audio1.currentTime = 0
        this.audio1.volume = 0.85
        const promise = this.audio1.play()
        if (promise !== undefined) {
          promise.catch(() => {
            this.pendingFirstSound = true
            this.playSynthesizedChime('first')
          })
        }
      } else {
        const a = new Audio('/1.mp3')
        a.volume = 0.85
        a.play().catch(() => {
          this.pendingFirstSound = true
          this.playSynthesizedChime('first')
        })
      }
    } catch {
      this.pendingFirstSound = true
      this.playSynthesizedChime('first')
    }
  }

  // ========================================================
  // SOUND 2: FURTHER NOTIFICATIONS (public/2.mp3)
  // Plays on each subsequent notification in the hero animation
  // ========================================================
  public playSubsequentNotification() {
    if (typeof window === 'undefined') return

    try {
      if (this.audio2) {
        const clone = this.audio2.cloneNode(true) as HTMLAudioElement
        clone.volume = 0.75
        const promise = clone.play()
        if (promise !== undefined) {
          promise.catch(() => {
            this.playSynthesizedChime('subsequent')
          })
        }
      } else {
        const a = new Audio('/2.mp3')
        a.volume = 0.75
        a.play().catch(() => {
          this.playSynthesizedChime('subsequent')
        })
      }
    } catch {
      this.playSynthesizedChime('subsequent')
    }
  }

  // ========================================================
  // SOUND 3: TYPEWRITER (public/3.mp3)
  // Starts when typewriter runs on scroll, smoothly fades out when typing ends
  // ========================================================
  public startTypewriterSound() {
    if (typeof window === 'undefined') return

    if (this.typewriterFadeTimer) {
      clearInterval(this.typewriterFadeTimer)
      this.typewriterFadeTimer = null
    }

    if (this.isTypewriterPlaying && this.audio3 && !this.audio3.paused) {
      this.audio3.volume = 0.65
      return
    }

    try {
      if (!this.audio3) {
        this.audio3 = new Audio('/3.mp3')
        this.audio3.loop = true
      }
      this.audio3.currentTime = 0
      this.audio3.volume = 0.65
      const promise = this.audio3.play()
      if (promise !== undefined) {
        promise
          .then(() => {
            this.isTypewriterPlaying = true
          })
          .catch(() => {
            // Autoplay safety
          })
      }
    } catch {
      // Autoplay safety
    }
  }

  public stopTypewriterSound() {
    if (!this.audio3 || typeof window === 'undefined') return

    if (this.typewriterFadeTimer) {
      clearInterval(this.typewriterFadeTimer)
      this.typewriterFadeTimer = null
    }

    try {
      let vol = this.audio3.volume
      this.typewriterFadeTimer = setInterval(() => {
        vol = Math.max(0, vol - 0.12)
        if (this.audio3) this.audio3.volume = vol
        if (vol <= 0.05) {
          if (this.typewriterFadeTimer) {
            clearInterval(this.typewriterFadeTimer)
            this.typewriterFadeTimer = null
          }
          if (this.audio3) {
            this.audio3.pause()
            this.audio3.currentTime = 0
            this.audio3.volume = 0.65
          }
          this.isTypewriterPlaying = false
        }
      }, 40)
    } catch {
      if (this.audio3) {
        this.audio3.pause()
        this.audio3.currentTime = 0
      }
      this.isTypewriterPlaying = false
    }
  }

  public playTypewriterKey() {
    this.startTypewriterSound()
  }

  // Kept for backward compatibility if called anywhere
  public toggleMute(): boolean {
    return false
  }

  public getMuted(): boolean {
    return false
  }

  public setMuted(_muted: boolean): void {
    // Sound is permanently enabled
  }
}

export const soundManager = new SoundManager()
