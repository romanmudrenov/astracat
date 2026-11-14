'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.delayNode = null;
    this.noiseBuffer = null;

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    // Базовая громкость: 50% для музыки, 60% для спецэффектов
    this.musicVolume = 0.50;
    this.sfxVolume = 0.60;
    this.timbre = 'space';

    this.bgmAudio = null;
    this.currentTrackPath = '';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.22, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1150, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.compressor);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 0.92, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < sampleRate; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        data[i] = (b0 + b1 + b2 + white * 0.22) * 0.52;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getEffectiveMusicVol() {
    if (this.muted || !this.musicEnabled) return 0;
    return Math.max(0, Math.min(1, this.musicVolume));
  }

  playTrack(filename) {
    this.init();
    const path = `music/${filename}`;
    if (this.currentTrackPath === path && this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }
    this.stopMusic();
    this.currentTrackPath = path;

    try {
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = this.getEffectiveMusicVol();
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      this.bgmAudio = audio;
    } catch (e) {}
  }

  startMusic(mode = 'normal', levelId = 1) {
    const file = mode === 'boss' ? 'boss.mp3' : `level${levelId}.mp3`;
    this.playTrack(file);
  }

  setMusicMode(mode, levelId = 1) {
    this.startMusic(mode, levelId);
  }

  stopMusic() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {}
      this.bgmAudio = null;
    }
    this.currentTrackPath = '';
  }

  updateMusicVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.92, now, 0.02);
    }
    this.updateMusicVolume();
    return this.muted;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  resolveWave(requestedType) {
    if (this.timbre === 'chiptune') return 'triangle';
    if (this.timbre === 'space') return 'sine';
    return requestedType;
  }

  playVoice({
    freq = 440,
    slideTo = null,
    type = 'sine',
    detune = 0,
    time = null,
    duration = 0.18,
    attack = 0.012,
    decay = 0.07,
    sustain = 0.4,
    release = 0.10,
    gain = 0.12,
    filterFreq = 1650,
    sendDelay = false,
    pan = 0
  }) {
    if (!this.ctx || this.muted) return;
    if (!this.sfxEnabled || this.sfxVolume <= 0.01) return;

    const t0 = time !== null ? time : this.ctx.currentTime;
    const tStop = t0 + duration + release;

    const osc = this.ctx.createOscillator();
    osc.type = this.resolveWave(type);
    osc.frequency.setValueAtTime(freq, t0);
    if (detune) osc.detune.setValueAtTime(detune, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, slideTo), t0 + duration);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(0.95, t0);
    const maxCut = this.timbre === 'space' ? 1350 : (this.timbre === 'classic' ? 1750 : 2100);
    filter.frequency.setValueAtTime(Math.min(filterFreq, maxCut), t0);

    const env = this.ctx.createGain();
    const peak = Math.max(0.001, gain * this.sfxVolume);
    const sustLevel = Math.max(0.0005, peak * sustain);

    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + attack);
    env.gain.exponentialRampToValueAtTime(sustLevel, t0 + attack + decay);
    env.gain.setValueAtTime(sustLevel, t0 + duration);
    env.gain.exponentialRampToValueAtTime(0.0001, tStop);

    let lastNode = env;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, pan)), t0);
      env.connect(panner);
      lastNode = panner;
    }

    osc.connect(filter);
    filter.connect(env);
    lastNode.connect(this.compressor);

    if (sendDelay && this.delayNode) {
      const sendGain = this.ctx.createGain();
      sendGain.gain.setValueAtTime(0.28, t0);
      lastNode.connect(sendGain);
      sendGain.connect(this.delayNode);
    }

    osc.start(t0);
    osc.stop(tStop + 0.01);
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  playChord(midiNotes, opts = {}) {
    midiNotes.forEach((m, idx) => {
      this.playVoice({
        ...opts,
        freq: this.midiToFreq(m),
        detune: idx % 2 === 0 ? -5 : 5,
        pan: ((idx / Math.max(1, midiNotes.length - 1)) - 0.5) * 0.45
      });
    });
  }

  playNoise({
    time = null,
    duration = 0.18,
    gain = 0.14,
    filterType = 'lowpass',
    filterFreq = 950,
    filterEnd = 160
  }) {
    if (!this.ctx || !this.noiseBuffer || this.muted) return;
    if (!this.sfxEnabled || this.sfxVolume <= 0.01) return;

    const t0 = time !== null ? time : this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, filterEnd), t0 + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(Math.max(0.001, gain * this.sfxVolume), t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter);
    filter.connect(env);
    env.connect(this.compressor);

    src.start(t0);
    src.stop(t0 + duration + 0.01);
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  sfxShoot(pan = 0, upgraded = false) {
    this.playVoice({
      freq: upgraded ? 580 : 510,
      slideTo: upgraded ? 190 : 160,
      type: 'sine',
      duration: 0.085,
      attack: 0.007,
      decay: 0.04,
      sustain: 0.2,
      release: 0.05,
      gain: 0.09,
      filterFreq: 1450,
      pan
    });
    if (upgraded) {
      this.playVoice({
        freq: 820,
        slideTo: 320,
        type: 'triangle',
        duration: 0.075,
        attack: 0.006,
        decay: 0.035,
        sustain: 0.15,
        release: 0.04,
        gain: 0.055,
        filterFreq: 1650,
        pan
      });
    }
  }

  sfxHit(pan = 0) {
    this.playVoice({
      freq: 250,
      slideTo: 105,
      type: 'sine',
      duration: 0.065,
      attack: 0.006,
      decay: 0.035,
      sustain: 0.1,
      release: 0.03,
      gain: 0.085,
      filterFreq: 900,
      pan
    });
  }

  // Сочный многослойный взрыв: саб-удар + шипящий хруст + осколки
  sfxExplosion(pan = 0, big = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = big ? 0.65 : 0.32;

    // 1. Плотный шумовой хлопок
    this.playNoise({
      time: now,
      duration: dur,
      gain: big ? 0.28 : 0.18,
      filterType: 'lowpass',
      filterFreq: big ? 820 : 1050,
      filterEnd: 85
    });

    // 2. Глубокий саб-бас удар
    this.playVoice({
      time: now,
      freq: big ? 130 : 175,
      slideTo: 34,
      type: 'sine',
      duration: dur,
      attack: 0.008,
      decay: dur * 0.55,
      sustain: 0.12,
      release: 0.10,
      gain: big ? 0.28 : 0.19,
      filterFreq: 420,
      pan
    });

    // 3. Вторичный хрустящий отзвук осколков (через 45 мс)
    this.playNoise({
      time: now + 0.045,
      duration: dur * 0.65,
      gain: big ? 0.16 : 0.10,
      filterType: 'bandpass',
      filterFreq: 950,
      filterEnd: 280
    });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [60, 64, 67, 71, 74, 79].forEach((m, i) => {
      this.playVoice({
        freq: this.midiToFreq(m),
        type: 'sine',
        time: now + i * 0.048,
        duration: 0.22,
        attack: 0.014,
        decay: 0.08,
        sustain: 0.35,
        release: 0.16,
        gain: 0.11,
        filterFreq: 1850,
        sendDelay: true
      });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([67, 74, 79, 83], {
      type: 'sine',
      duration: 0.24,
      attack: 0.012,
      decay: 0.1,
      sustain: 0.25,
      release: 0.14,
      gain: 0.10,
      sendDelay: true
    });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({
      freq: 220,
      slideTo: 75,
      type: 'triangle',
      duration: 0.30,
      attack: 0.015,
      decay: 0.12,
      sustain: 0.3,
      release: 0.10,
      gain: 0.17,
      filterFreq: 800
    });
    this.playNoise({ duration: 0.24, gain: 0.15, filterType: 'lowpass', filterFreq: 560, filterEnd: 90 });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({
        freq: 196,
        slideTo: 294,
        type: 'sine',
        time: now + i * 0.36,
        duration: 0.28,
        attack: 0.03,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
        gain: 0.13,
        filterFreq: 1000,
        sendDelay: true
      });
    }
  }

  sfxVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { notes: [60, 64, 67], t: 0.00, d: 0.18 },
      { notes: [65, 69, 72], t: 0.22, d: 0.26 },
      { notes: [67, 71, 74], t: 0.52, d: 0.24 },
      { notes: [72, 76, 79, 83], t: 0.80, d: 0.65 }
    ].forEach(step => {
      this.playChord(step.notes, {
        time: now + step.t,
        type: 'sine',
        duration: step.d,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.6,
        release: 0.22,
        gain: 0.12,
        filterFreq: 1950,
        sendDelay: true
      });
    });
  }

  sfxGameOver() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { m: 64, t: 0.00, d: 0.25 },
      { m: 62, t: 0.28, d: 0.25 },
      { m: 60, t: 0.56, d: 0.28 },
      { m: 55, t: 0.88, d: 0.55 }
    ].forEach(s => {
      this.playVoice({
        freq: this.midiToFreq(s.m),
        slideTo: s.m === 55 ? this.midiToFreq(52) : null,
        type: 'sine',
        time: now + s.t,
        duration: s.d,
        attack: 0.025,
        decay: 0.12,
        sustain: 0.5,
        release: 0.18,
        gain: 0.14,
        filterFreq: 1400,
        sendDelay: true
      });
    });
  }
}
