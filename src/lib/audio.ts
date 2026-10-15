'use client'

class SoundManager {
  private isMuted: boolean = false
  private audio1: HTMLAudioElement | null = null
  private audio2: HTMLAudioElement | null = null
  private audio3: HTMLAudioElement | null = null
  private isTypewriterPlaying: boolean = false
  private typewriterFadeTimer: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('sound_muted')
      this.isMuted = storedMute === 'true'

      // Preload audio elements for 1.mp3, 2.mp3, 3.mp3
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
        // Fallback gracefully if Audio not supported in environment
      }

      // Unlock autoplay on first user interaction (click, touch, scroll, pointer)
      const unlockAudio = () => {
        try {
          if (this.audio1) this.audio1.load()
          if (this.audio2) this.audio2.load()
          if (this.audio3) this.audio3.load()
        } catch {
          // ignore
        }

        window.removeEventListener('pointerdown', unlockAudio)
        window.removeEventListener('touchstart', unlockAudio)
        window.removeEventListener('click', unlockAudio)
        window.removeEventListener('keydown', unlockAudio)
        window.removeEventListener('scroll', unlockAudio)
      }

      window.addEventListener('pointerdown', unlockAudio, { passive: true })
      window.addEventListener('touchstart', unlockAudio, { passive: true })
      window.addEventListener('click', unlockAudio, { passive: true })
      window.addEventListener('keydown', unlockAudio, { passive: true })
      window.addEventListener('scroll', unlockAudio, { passive: true })
    }
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_muted', String(muted))
    }
    if (muted && this.audio3) {
      this.audio3.pause()
      this.isTypewriterPlaying = false
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted)
    return this.isMuted
  }

  // ========================================================
  // SOUND 1: FIRST NOTIFICATION (public/1.mp3)
  // Plays on the first notification in the hero animation
  // ========================================================
  public playFirstNotification() {
    if (this.isMuted || typeof window === 'undefined') return
    try {
      if (this.audio1) {
        this.audio1.currentTime = 0
        this.audio1.volume = 0.85
        this.audio1.play().catch(() => {})
      } else {
        const a = new Audio('/1.mp3')
        a.volume = 0.85
        a.play().catch(() => {})
      }
    } catch {
      // Autoplay safety
    }
  }

  // ========================================================
  // SOUND 2: FURTHER NOTIFICATIONS (public/2.mp3)
  // Plays on each subsequent notification in the hero animation
  // Uses cloned audio for overlapping rapid chimes
  // ========================================================
  public playSubsequentNotification() {
    if (this.isMuted || typeof window === 'undefined') return
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
      // Autoplay safety
    }
  }

  // ========================================================
  // SOUND 3: TYPEWRITER (public/3.mp3)
  // Starts when typewriter runs on scroll, smoothly fades out when typing ends
  // ========================================================
  public startTypewriterSound() {
    if (this.isMuted || typeof window === 'undefined') return

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
      this.audio3
        .play()
        .then(() => {
          this.isTypewriterPlaying = true
        })
        .catch(() => {
          // Autoplay handled on next user gesture
        })
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

  // Keystroke safety fallback (ensures typewriter sound is running)
  public playTypewriterKey() {
    this.startTypewriterSound()
  }
}

export const soundManager = new SoundManager()

