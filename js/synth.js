'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.delayNode = null;
    this.noiseBuffer = null;

    // 64-голосная полифония
    this.maxVoices = 64;
    this.activeVoices = [];

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.50;
    this.sfxVolume = 1.08;
    this.timbre = 'space';

    this.availableTracks = ['level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3'];
    this.selectedTrack = 'auto';
    this.recentTracks = [];

    this.bgmAudio = null;
    this.currentTrackPath = '';
    this.shotStep = 0;

    this.scanMusicFolder();
  }

  scanMusicFolder() {
    const candidates = [];
    for (let i = 1; i <= 15; i++) {
      candidates.push(`level${i}.mp3`);
      candidates.push(`track${i}.mp3`);
      candidates.push(`${i}.mp3`);
    }

    const found = new Set(this.availableTracks);
    let pending = candidates.length;

    const refreshSelectUI = () => {
      const list = Array.from(found);
      this.availableTracks = list;
      const sel = document.getElementById('track-select');
      const hint = document.getElementById('tracks-found-hint');
      if (sel) {
        const curVal = sel.value || 'auto';
        sel.innerHTML = `<option value="auto">🎲 Авто (${list.length} треков, без повтора 4 ур.)</option>`;
        list.forEach((fname, idx) => {
          const opt = document.createElement('option');
          opt.value = fname;
          opt.textContent = `Трек ${idx + 1} (${fname})`;
          sel.appendChild(opt);
        });
        sel.value = curVal;
      }
      if (hint) {
        hint.textContent = `Треков в music/: ${list.length} (+ boss.mp3 для боссов)`;
      }
    };

    candidates.forEach(fname => {
      fetch(`music/${fname}`, { method: 'HEAD' })
        .then(res => { if (res.ok) found.add(fname); })
        .catch(() => {})
        .finally(() => {
          pending--;
          if (pending <= 0) refreshSelectUI();
        });
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-15, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(22, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.28, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.compressor);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 1.35, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate * 2, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.998 * b0 + white * 0.025;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        b3 = 0.850 * b3 + white * 0.080;
        data[i] = (b0 + b1 + b2 + b3 + white * 0.14) * 0.52;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  pickNextTrack() {
    if (this.selectedTrack && this.selectedTrack !== 'auto') {
      return this.selectedTrack;
    }
    const candidates = this.availableTracks.filter(t => !this.recentTracks.includes(t));
    const pool = candidates.length > 0 ? candidates : this.availableTracks;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    this.recentTracks.push(chosen);
    if (this.recentTracks.length >= 4) {
      this.recentTracks.shift();
    }
    return chosen;
  }

  getEffectiveMusicVol() {
    if (this.muted || !this.musicEnabled) return 0;
    return Math.max(0, Math.min(1, this.musicVolume));
  }

  playTrack(filename, fallbackTrack = null) {
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
        playPromise.catch(() => {
          if (fallbackTrack) this.playTrack(fallbackTrack);
        });
      }
      this.bgmAudio = audio;
    } catch (e) {}
  }

  startMusic(mode = 'normal') {
    if (mode === 'boss') {
      const prevTrack = this.recentTracks[this.recentTracks.length - 1] || 'level1.mp3';
      this.playTrack('boss.mp3', prevTrack);
      return;
    }
    const chosen = this.pickNextTrack();
    this.playTrack(chosen);
  }

  setMusicMode(mode) {
    if (mode === 'boss') this.startMusic('boss');
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
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 1.35, now, 0.02);
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

  allocateVoice(osc, filter, env, stopTime) {
    const now = this.ctx.currentTime;
    this.activeVoices = this.activeVoices.filter(v => v.stopTime > now);
    if (this.activeVoices.length >= this.maxVoices) {
      const oldest = this.activeVoices.shift();
      try {
        oldest.env.gain.cancelScheduledValues(now);
        oldest.env.gain.setTargetAtTime(0.0001, now, 0.01);
        oldest.osc.stop(now + 0.03);
      } catch (e) {}
    }
    this.activeVoices.push({ osc, filter, env, stopTime });
  }

  playVoice({
    freq = 440,
    slideTo = null,
    type = 'sine',
    detune = 0,
    time = null,
    duration = 0.22,
    attack = 0.018,
    decay = 0.08,
    sustain = 0.35,
    release = 0.15,
    gain = 0.11,
    filterFreq = 1450,
    sendDelay = true,
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
    filter.Q.setValueAtTime(0.85, t0);
    const maxCut = this.timbre === 'space' ? 1350 : (this.timbre === 'classic' ? 1750 : 2050);
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

    this.allocateVoice(osc, filter, env, tStop);
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
        detune: idx % 2 === 0 ? -6 : 6,
        pan: ((idx / Math.max(1, midiNotes.length - 1)) - 0.5) * 0.55
      });
    });
  }

  playNoise({
    time = null,
    duration = 0.22,
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
    env.gain.linearRampToValueAtTime(Math.max(0.001, gain * this.sfxVolume), t0 + 0.016);
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

  // --- ЧИСТЫЕ МЕЛОДИЧНЫЕ ASMR-ВЫСТРЕЛЫ БЕЗ СИНХРОНИЗАЦИИ ---
  sfxShootWeapon(pan = 0, baseWeapon = 'droplet', secondary = 'none') {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const notes = [60, 64, 67, 71, 74, 76, 79];
    const noteMidi = notes[this.shotStep % notes.length];
    this.shotStep++;
    const f = this.midiToFreq(noteMidi);

    if (baseWeapon === 'droplet') {
      this.playVoice({
        time: now, freq: f * 0.75, slideTo: f * 1.4, type: 'sine',
        duration: 0.12, attack: 0.012, decay: 0.05, sustain: 0.2, release: 0.12,
        gain: 0.09, filterFreq: 1400, sendDelay: true, pan
      });
    } else if (baseWeapon === 'kalimba') {
      this.playChord([noteMidi, noteMidi + 7], {
        time: now, type: 'sine',
        duration: 0.16, attack: 0.01, decay: 0.06, sustain: 0.25, release: 0.14,
        gain: 0.08, filterFreq: 1600, sendDelay: true, pan
      });
    } else {
      this.playChord([noteMidi - 12, noteMidi], {
        time: now, type: 'sine',
        duration: 0.15, attack: 0.014, decay: 0.06, sustain: 0.25, release: 0.13,
        gain: 0.075, filterFreq: 1300, sendDelay: true, pan
      });
      this.playNoise({
        time: now, duration: 0.08, gain: 0.04,
        filterType: 'bandpass', filterFreq: 900, filterEnd: 400
      });
    }

    if (secondary !== 'none') {
      this.playVoice({
        time: now + 0.025, freq: this.midiToFreq(noteMidi + 12), type: 'sine',
        duration: 0.12, attack: 0.012, decay: 0.05, sustain: 0.2, release: 0.12,
        gain: 0.05, filterFreq: 1650, sendDelay: true, pan: -pan * 0.6
      });
    }
  }

  sfxHit(pan = 0) {
    const pitch = 210 + Math.random() * 45;
    this.playVoice({
      freq: pitch, slideTo: pitch * 0.55, type: 'sine',
      duration: 0.08, attack: 0.01, decay: 0.035, sustain: 0.15, release: 0.06,
      gain: 0.08, filterFreq: 900, sendDelay: false, pan
    });
  }

  sfxExplosion(pan = 0, big = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = big ? 0.95 : 0.48;

    this.playVoice({
      time: now, freq: big ? 110 : 145, slideTo: 28, type: 'sine',
      duration: dur, attack: 0.008, decay: dur * 0.5, sustain: 0.15, release: 0.18,
      gain: big ? 0.36 : 0.24, filterFreq: 380, sendDelay: false, pan
    });
    this.playNoise({
      time: now, duration: dur * 1.1, gain: big ? 0.36 : 0.24,
      filterType: 'lowpass', filterFreq: big ? 1100 : 1350, filterEnd: 75
    });
    this.playNoise({
      time: now + 0.055, duration: dur * 0.85, gain: big ? 0.25 : 0.16,
      filterType: 'bandpass', filterFreq: 780, filterEnd: 190
    });
    this.playNoise({
      time: now + 0.11, duration: dur * 0.65, gain: big ? 0.16 : 0.10,
      filterType: 'bandpass', filterFreq: 1650, filterEnd: 450
    });
  }

  sfxIgnite(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise({ time: now, duration: 0.38, gain: 0.22, filterType: 'bandpass', filterFreq: 1350, filterEnd: 380 });
    this.playVoice({ time: now, freq: 130, slideTo: 340, type: 'triangle', duration: 0.28, attack: 0.025, decay: 0.1, sustain: 0.3, release: 0.14, gain: 0.14, filterFreq: 1050, pan });
  }

  sfxGravity(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playVoice({ time: now, freq: 88, slideTo: 46, type: 'sine', duration: 0.55, attack: 0.08, decay: 0.2, sustain: 0.5, release: 0.25, gain: 0.24, filterFreq: 320, sendDelay: true, pan });
  }

  sfxDisintegrate(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [84, 88, 91, 96].forEach((m, idx) => {
      this.playVoice({ time: now + idx * 0.035, freq: this.midiToFreq(m), type: 'sine', duration: 0.18, attack: 0.012, decay: 0.07, sustain: 0.2, release: 0.14, gain: 0.10, filterFreq: 1900, sendDelay: true, pan });
    });
  }

  sfxUnderwater(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.08, 0.16].forEach((offset, idx) => {
      const base = 310 + idx * 105 + Math.random() * 50;
      this.playVoice({ time: now + offset, freq: base, slideTo: base * 1.8, type: 'sine', duration: 0.09, attack: 0.012, decay: 0.035, sustain: 0.2, release: 0.06, gain: 0.13, filterFreq: 1250, sendDelay: true, pan });
    });
  }

  sfxCosmicHum() {
    if (!this.ctx) return;
    this.playChord([48, 55, 60], { time: this.ctx.currentTime, type: 'sine', duration: 0.75, attack: 0.18, decay: 0.25, sustain: 0.55, release: 0.35, gain: 0.12, filterFreq: 450, sendDelay: true });
  }

  sfxSticky(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 185, slideTo: 390, type: 'sine', duration: 0.15, attack: 0.018, decay: 0.06, sustain: 0.25, release: 0.08, gain: 0.14, filterFreq: 900, pan });
  }

  sfxWave() {
    if (!this.ctx) return;
    this.playNoise({ time: this.ctx.currentTime, duration: 0.7, gain: 0.20, filterType: 'lowpass', filterFreq: 240, filterEnd: 880 });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [60, 64, 67, 71, 74, 79].forEach((m, i) => {
      this.playVoice({ freq: this.midiToFreq(m), type: 'sine', time: now + i * 0.048, duration: 0.22, attack: 0.015, decay: 0.08, sustain: 0.35, release: 0.16, gain: 0.12, filterFreq: 1850, sendDelay: true });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([67, 74, 79, 83], { type: 'sine', duration: 0.26, attack: 0.015, decay: 0.1, sustain: 0.25, release: 0.16, gain: 0.12, sendDelay: true });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({ freq: 210, slideTo: 72, type: 'triangle', duration: 0.30, attack: 0.018, decay: 0.12, sustain: 0.3, release: 0.10, gain: 0.20, filterFreq: 800 });
    this.playNoise({ duration: 0.24, gain: 0.18, filterType: 'lowpass', filterFreq: 560, filterEnd: 90 });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({ freq: 196, slideTo: 294, type: 'sine', time: now + i * 0.36, duration: 0.28, attack: 0.03, decay: 0.1, sustain: 0.5, release: 0.12, gain: 0.15, filterFreq: 1050, sendDelay: true });
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
      this.playChord(step.notes, { time: now + step.t, type: 'sine', duration: step.d, attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.22, gain: 0.14, filterFreq: 1950, sendDelay: true });
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
      this.playVoice({ freq: this.midiToFreq(s.m), slideTo: s.m === 55 ? this.midiToFreq(52) : null, type: 'sine', time: now + s.t, duration: s.d, attack: 0.025, decay: 0.12, sustain: 0.5, release: 0.18, gain: 0.16, filterFreq: 1450, sendDelay: true });
    });
  }
}
