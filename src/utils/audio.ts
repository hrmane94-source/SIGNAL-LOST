// Web Audio API procedural sound synthesizer
// Completely self-contained, zero external audio assets, strictly user-initiated

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopDrone();
    } else {
      this.startDrone();
      this.playBlip(880, 'sine', 0.08, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopDrone();
    } else {
      this.initContext();
      this.startDrone();
    }
  }

  // Deep space ambient drone
  private startDrone() {
    if (this.isMuted || !this.ctx || this.droneGain) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.035, now + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      // Low sub drone 55Hz (A1)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      // Detuned companion 55.4Hz for subtle phasing
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.6, now);

      // LFO for slow breathing movement
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(25, now);
      this.lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.lfo.start(now);
    } catch (e) {
      console.warn('Audio drone error:', e);
    }
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.lfo?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.lfo?.disconnect();
          this.droneGain?.disconnect();
        } catch {
          // ignore
        }
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.lfo = null;
        this.droneGain = null;
      }, 900);
    } catch {
      // ignore
    }
  }

  // Short sci-fi UI blip / chirp
  public playBlip(freq: number = 800, type: OscillatorType = 'sine', duration: number = 0.06, vol: number = 0.04) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch {
      // ignore
    }
  }

  // Tactical click on button interactions
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Transmission packet decode burst (synthetic noise burst)
  public playTransmissionBurst() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms burst
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 4.0;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Mission Initiation Sequence audio (rising frequency sweep + confirmation chime)
  public playInitiateSequence() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Rising charge oscillator
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.8);

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(300, now);
      filter1.frequency.exponentialRampToValueAtTime(3000, now + 0.8);

      gain1.gain.setValueAtTime(0.02, now);
      gain1.gain.linearRampToValueAtTime(0.06, now + 0.7);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.85);

      // Confirmation chord at t + 0.8s
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const chimeTime = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.5]; // C5 major
        chords.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, chimeTime + idx * 0.05);

          gain.gain.setValueAtTime(0.04, chimeTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + idx * 0.05 + 0.9);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(chimeTime + idx * 0.05);
          osc.stop(chimeTime + idx * 0.05 + 1.0);
        });
      }, 800);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
