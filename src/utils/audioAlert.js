// Gentle Islamic Adhan harmonic chime using Web Audio API
class SoundPlayer {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play a soft spiritual alert chime (for 30m and 10m reminder)
  playChime(type = 'gentle') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Beautiful harmonic frequencies inspired by spiritual chimes (E4, G#4, B4, E5)
      const notes = type === 'urgent' 
        ? [523.25, 659.25, 783.99, 1046.50] // C5 chord for 10 min reminder
        : [329.63, 415.30, 493.88, 659.25]; // E4 meditative chord for 30 min reminder

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        // Gentle attack, smooth decay
        const startTime = now + idx * 0.18;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.85);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Play test sound
  testSound() {
    this.playChime('gentle');
  }

  // Vibration for mobile devices
  vibrate(pattern = [100, 50, 100]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        console.warn('Vibration failed:', err);
      }
    }
  }
}

export const soundPlayer = new SoundPlayer();
