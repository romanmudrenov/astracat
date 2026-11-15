'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.delayNode = null;
    this.noiseBuffer = null;

    this.maxVoices = 64;
    this.activeVoices = [];

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    // Стандартная громкость при первом запуске: Музыка 60%, Эффекты 40%
    this.musicVolume = 0.60;
    this.sfxVolume = 0.40;
    this.timbre = 'space';

    this.availableTracks = ['level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3'];
    this.bossTracks = ['boss.mp3'];
    this.selectedTrack = 'auto';
    this.recentTracks = [];
    this.currentTrackIndex = 0;

    this.bgmAudio = null;
    this.currentTrackPath = '';
    this.pendingTrack = null;
    this.shotStep = 0;

    this.scanMusicFolder();
    this.setupAutoUnlock();
  }

  setupAutoUnlock() {
    const unlock = () => {
      this.init();
      if (this.pendingTrack && (!this.bgmAudio || this.bgmAudio.paused)) {
        const t = this.pendingTrack;
        this.pendingTrack = null;
        this.playTrack(t.file, t.fallback);
      } else if (this.bgmAudio && this.bgmAudio.paused && this.musicEnabled && !this.muted) {
        this.bgmAudio.play().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  scanMusicFolder() {
    const levelCandidates = [];
    const bossCandidates = ['boss.mp3'];
    for (let i = 1; i <= 15; i++) {
      levelCandidates.push(`level${i}.mp3`);
      levelCandidates.push(`track${i}.mp3`);
      levelCandidates.push(`${i}.mp3`);
      bossCandidates.push(`boss${i}.mp3`);
    }

    const foundLevels = new Set(this.availableTracks);
    const foundBosses = new Set(this.bossTracks);
    let pending = levelCandidates.length + bossCandidates.length;

    const refreshSelectUI = () => {
      const list = Array.from(foundLevels);
      this.availableTracks = list;
      this.bossTracks = Array.from(foundBosses);

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
        hint.textContent = `Уровней: ${list.length} • Треков боссов: ${this.bossTracks.length}`;
      }
    };

    levelCandidates.forEach(fname => {
      fetch(`music/${fname}`, { method: 'HEAD' })
        .then(res => { if (res.ok) foundLevels.add(fname); })
        .catch(() => {})
        .finally(() => {
          pending--;
          if (pending <= 0) refreshSelectUI();
        });
    });

    bossCandidates.forEach(fname => {
      fetch(`music/${fname}`, { method: 'HEAD' })
        .then(res => { if (res.ok) foundBosses.add(fname); })
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
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4.0, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.22, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(900, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.22, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.compressor);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 1.0, this.ctx.currentTime);

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
        data[i] = (b0 + b1 + b2 + b3 + white * 0.12) * 0.50;
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

    this.currentTrackIndex = Math.max(0, this.availableTracks.indexOf(chosen));
    this.recentTracks.push(chosen);
    if (this.recentTracks.length >= 4) {
      this.recentTracks.shift();
    }
    return chosen;
  }

  // Переключение треков кнопками мини-плеера (вперёд / назад)
  nextTrack() {
    if (!this.availableTracks.length) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.availableTracks.length;
    const fname = this.availableTracks[this.currentTrackIndex];
    this.playTrack(fname);
    const sel = document.getElementById('track-select');
    if (sel) sel.value = fname;
  }

  prevTrack() {
    if (!this.availableTracks.length) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.availableTracks.length) % this.availableTracks.length;
    const fname = this.availableTracks[this.currentTrackIndex];
    this.playTrack(fname);
    const sel = document.getElementById('track-select');
    if (sel) sel.value = fname;
  }

  getEffectiveMusicVol() {
    if (this.muted || !this.musicEnabled) return 0;
    return Math.max(0, Math.min(1, this.musicVolume));
  }

  playTrack(filename, fallbackTrack = null) {
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

      audio.onerror = () => {
        if (fallbackTrack && filename !== fallbackTrack) {
          this.playTrack(fallbackTrack, 'boss.mp3');
        }
      };

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          this.pendingTrack = { file: filename, fallback: fallbackTrack };
        });
      }
      this.bgmAudio = audio;
    } catch (e) {}
  }

  startIntroMusic() {
    this.playTrack('intro.mp3', 'level1.mp3');
  }

  // Запуск музыки уровня или индивидуального трека босса (boss.mp3, boss2.mp3, boss3.mp3...)
  startMusic(mode = 'normal', levelId = 1) {
    if (mode === 'intro') {
      this.startIntroMusic();
      return;
    }
    if (mode === 'boss') {
      const specificBoss = levelId === 1 ? 'boss.mp3' : `boss${levelId}.mp3`;
      const fallbackBoss = this.bossTracks.length > 0
        ? this.bossTracks[(levelId - 1) % this.bossTracks.length]
        : 'boss.mp3';
      this.playTrack(specificBoss, fallbackBoss);
      return;
    }
    const chosen = this.pickNextTrack();
    this.playTrack(chosen);
  }

  setMusicMode(mode, levelId = 1) {
    if (mode === 'boss') this.startMusic('boss', levelId);
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
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 1.0, now, 0.02);
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
    freq = 220,
    slideTo = null,
    type = 'sine',
    detune = 0,
    time = null,
    duration = 0.14,
    attack = 0.016,
    decay = 0.06,
    sustain = 0.25,
    release = 0.10,
    gain = 0.08,
    filterFreq = 650,
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
    filter.Q.setValueAtTime(0.7, t0);
    filter.frequency.setValueAtTime(Math.min(filterFreq, 950), t0);

    const env = this.ctx.createGain();
    const peak = Math.max(0.0008, gain * this.sfxVolume);
    const sustLevel = Math.max(0.0004, peak * sustain);

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
      sendGain.gain.setValueAtTime(0.18, t0);
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
        detune: idx % 2 === 0 ? -4 : 4,
        pan: ((idx / Math.max(1, midiNotes.length - 1)) - 0.5) * 0.45
      });
    });
  }

  playNoise({
    time = null,
    duration = 0.18,
    gain = 0.12,
    filterType = 'lowpass',
    filterFreq = 750,
    filterEnd = 140
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
    env.gain.linearRampToValueAtTime(Math.max(0.0008, gain * this.sfxVolume), t0 + 0.016);
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

  // ПРИГЛУШЁННЫЕ БАРХАТНЫЕ ВЫСТРЕЛЫ (низкие частоты 140–280 Гц, без писка, не мешают музыке)
  sfxShootWeapon(pan = 0, baseWeapon = 'droplet', secondary = 'none') {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (baseWeapon === 'droplet') {
      // Мягкий приглушённый саб-импульс («тумп»)
      this.playVoice({
        time: now, freq: 210, slideTo: 95, type: 'sine',
        duration: 0.08, attack: 0.012, decay: 0.04, sustain: 0.15, release: 0.06,
        gain: 0.065, filterFreq: 480, sendDelay: false, pan
      });
    } else if (baseWeapon === 'kalimba') {
      // Тёплый низкий деревянный тембр
      this.playVoice({
        time: now, freq: 260, slideTo: 140, type: 'sine',
        duration: 0.09, attack: 0.012, decay: 0.04, sustain: 0.18, release: 0.07,
        gain: 0.065, filterFreq: 540, sendDelay: false, pan
      });
    } else {
      // Бархатный воздушный выдох (шёлковый дробовик)
      this.playNoise({
        time: now, duration: 0.07, gain: 0.045,
        filterType: 'lowpass', filterFreq: 520, filterEnd: 180
      });
      this.playVoice({
        time: now, freq: 185, slideTo: 82, type: 'sine',
        duration: 0.08, attack: 0.014, decay: 0.04, sustain: 0.15, release: 0.06,
        gain: 0.06, filterFreq: 450, sendDelay: false, pan
      });
    }

    if (secondary === 'fractal_shuriken') {
      this.playNoise({
        time: now, duration: 0.06, gain: 0.035,
        filterType: 'bandpass', filterFreq: 580, filterEnd: 260
      });
    } else if (secondary === 'electric_shock') {
      this.playVoice({
        time: now, freq: 240, slideTo: 110, type: 'triangle',
        duration: 0.07, attack: 0.01, decay: 0.03, sustain: 0.15, release: 0.05,
        gain: 0.055, filterFreq: 520, sendDelay: false, pan
      });
    } else if (secondary === 'wave_cannon') {
      this.playVoice({
        time: now, freq: 160, slideTo: 68, type: 'sine',
        duration: 0.12, attack: 0.015, decay: 0.05, sustain: 0.2, release: 0.08,
        gain: 0.07, filterFreq: 420, sendDelay: false, pan
      });
    }
  }

  sfxHit(pan = 0) {
    const pitch = 155 + Math.random() * 30;
    this.playVoice({
      freq: pitch, slideTo: pitch * 0.55, type: 'sine',
      duration: 0.065, attack: 0.01, decay: 0.03, sustain: 0.12, release: 0.05,
      gain: 0.06, filterFreq: 480, sendDelay: false, pan
    });
  }

  sfxExplosion(pan = 0, big = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = big ? 0.90 : 0.45;

    this.playVoice({
      time: now, freq: big ? 105 : 135, slideTo: 28, type: 'sine',
      duration: dur, attack: 0.01, decay: dur * 0.5, sustain: 0.15, release: 0.16,
      gain: big ? 0.32 : 0.20, filterFreq: 340, sendDelay: false, pan
    });
    this.playNoise({
      time: now, duration: dur, gain: big ? 0.30 : 0.20,
      filterType: 'lowpass', filterFreq: big ? 880 : 980, filterEnd: 70
    });
  }

  sfxIgnite(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise({ time: now, duration: 0.35, gain: 0.18, filterType: 'bandpass', filterFreq: 780, filterEnd: 260 });
    this.playVoice({ time: now, freq: 120, slideTo: 240, type: 'triangle', duration: 0.25, attack: 0.02, decay: 0.1, sustain: 0.25, release: 0.12, gain: 0.11, filterFreq: 650, pan });
  }

  sfxGravity(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 85, slideTo: 44, type: 'sine', duration: 0.5, attack: 0.06, decay: 0.2, sustain: 0.4, release: 0.2, gain: 0.20, filterFreq: 300, sendDelay: true, pan });
  }

  sfxDisintegrate(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 320, slideTo: 140, type: 'sine', duration: 0.12, attack: 0.012, decay: 0.05, sustain: 0.15, release: 0.08, gain: 0.07, filterFreq: 620, pan });
  }

  sfxUnderwater(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.08].forEach((offset, idx) => {
      const base = 220 + idx * 60;
      this.playVoice({ time: now + offset, freq: base, slideTo: base * 1.45, type: 'sine', duration: 0.09, attack: 0.012, decay: 0.035, sustain: 0.2, release: 0.06, gain: 0.10, filterFreq: 680, pan });
    });
  }

  sfxCosmicHum() {
    if (!this.ctx) return;
    this.playChord([48, 55], { time: this.ctx.currentTime, type: 'sine', duration: 0.65, attack: 0.16, decay: 0.2, sustain: 0.45, release: 0.3, gain: 0.09, filterFreq: 380, sendDelay: true });
  }

  sfxSticky(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 165, slideTo: 290, type: 'sine', duration: 0.14, attack: 0.018, decay: 0.06, sustain: 0.2, release: 0.08, gain: 0.11, filterFreq: 600, pan });
  }

  sfxWave() {
    if (!this.ctx) return;
    this.playNoise({ time: this.ctx.currentTime, duration: 0.65, gain: 0.16, filterType: 'lowpass', filterFreq: 220, filterEnd: 680 });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [55, 60, 64, 67].forEach((m, i) => {
      this.playVoice({ freq: this.midiToFreq(m), type: 'sine', time: now + i * 0.05, duration: 0.18, attack: 0.015, decay: 0.07, sustain: 0.3, release: 0.12, gain: 0.09, filterFreq: 850, sendDelay: true });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([55, 62, 67], { type: 'sine', duration: 0.22, attack: 0.015, decay: 0.1, sustain: 0.25, release: 0.14, gain: 0.10, sendDelay: true });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({ freq: 180, slideTo: 65, type: 'triangle', duration: 0.26, attack: 0.015, decay: 0.1, sustain: 0.25, release: 0.10, gain: 0.18, filterFreq: 580 });
    this.playNoise({ duration: 0.22, gain: 0.15, filterType: 'lowpass', filterFreq: 480, filterEnd: 85 });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({ freq: 146, slideTo: 220, type: 'sine', time: now + i * 0.36, duration: 0.28, attack: 0.03, decay: 0.1, sustain: 0.45, release: 0.12, gain: 0.14, filterFreq: 680, sendDelay: true });
    }
  }

  sfxVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { notes: [55, 60, 64], t: 0.00, d: 0.18 },
      { notes: [57, 62, 65], t: 0.22, d: 0.24 },
      { notes: [60, 64, 67, 72], t: 0.50, d: 0.55 }
    ].forEach(step => {
      this.playChord(step.notes, { time: now + step.t, type: 'sine', duration: step.d, attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.2, gain: 0.11, filterFreq: 900, sendDelay: true });
    });
  }

  sfxGameOver() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { m: 60, t: 0.00, d: 0.24 },
      { m: 58, t: 0.26, d: 0.24 },
      { m: 55, t: 0.52, d: 0.26 },
      { m: 48, t: 0.82, d: 0.50 }
    ].forEach(s => {
      this.playVoice({ freq: this.midiToFreq(s.m), type: 'sine', time: now + s.t, duration: s.d, attack: 0.025, decay: 0.1, sustain: 0.45, release: 0.16, gain: 0.13, filterFreq: 750, sendDelay: true });
    });
  }
}
