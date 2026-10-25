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

      // Proactive unlock on ANY user touch, click, scroll, key, or pointerdown
      const unlock = () => {
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

        // If the first notification arrived before user interaction, play it immediately now
        if (this.pendingFirstSound) {
          this.pendingFirstSound = false
          this.playFirstNotification()
        }

        window.removeEventListener('pointerdown', unlock, true)
        window.removeEventListener('touchstart', unlock, true)
        window.removeEventListener('click', unlock, true)
        window.removeEventListener('keydown', unlock, true)
        window.removeEventListener('scroll', unlock, true)
        window.removeEventListener('wheel', unlock, true)
        window.removeEventListener('mousemove', unlock, true)
        window.removeEventListener('pointermove', unlock, true)
      }

      window.addEventListener('pointerdown', unlock, { capture: true, passive: true })
      window.addEventListener('touchstart', unlock, { capture: true, passive: true })
      window.addEventListener('click', unlock, { capture: true, passive: true })
      window.addEventListener('keydown', unlock, { capture: true, passive: true })
      window.addEventListener('scroll', unlock, { capture: true, passive: true })
      window.addEventListener('wheel', unlock, { capture: true, passive: true })
      window.addEventListener('mousemove', unlock, { capture: true, passive: true })
      window.addEventListener('pointermove', unlock, { capture: true, passive: true })
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
            // If browser autoplay policy blocked it because user hasn't interacted yet,
            // mark it so the very first tap/scroll plays it instantly
            this.pendingFirstSound = true
          })
        }
      } else {
        const a = new Audio('/1.mp3')
        a.volume = 0.85
        a.play().catch(() => {
          this.pendingFirstSound = true
        })
      }
    } catch {
      this.pendingFirstSound = true
    }
  }

  // ========================================================
  // SOUND 2: FURTHER NOTIFICATIONS (public/2.mp3)
  // Plays on each subsequent notification in the hero animation
  // Uses cloned audio nodes for crisp overlapping chimes
  // ========================================================
  public playSubsequentNotification() {
    if (typeof window === 'undefined') return

    try {
      if (this.audio2) {
        const clone = this.audio2.cloneNode(true) as HTMLAudioElement
        clone.volume = 0.75
        clone.play().catch(() => {})
      } else {
        const a = new Audio('/2.mp3')
        a.volume = 0.75
        a.play().catch(() => {})
      }
    } catch {
      // ignore
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
