'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.masterFilter = null;
    this.delayNode = null;
    this.noiseBuffer = null;

    this.maxVoices = 64;
    this.activeVoices = [];

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    // Стандартная громкость: Музыка 60%, Эффекты 40%
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
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(28, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(5.0, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.012, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.22, this.ctx.currentTime);

      // Глобальный бархатный фильтр на мастер-шине: полностью отсекает любые резкие и пищащие частоты выше 620 Гц
      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.setValueAtTime(620, this.ctx.currentTime);
      this.masterFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.19, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(480, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.compressor);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 0.95, this.ctx.currentTime);

      this.compressor.connect(this.masterFilter);
      this.masterFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Очень мягкий коричнево-розовый шум (без высокочастотного шипения)
      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate * 2, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.035 * white)) / 1.035;
        lastOut = data[i];
        data[i] *= 2.4;
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
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.95, now, 0.02);
    }
    this.updateMusicVolume();
    return this.muted;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
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
    freq = 160,
    slideTo = null,
    type = 'sine',
    detune = 0,
    time = null,
    duration = 0.11,
    attack = 0.014,
    decay = 0.05,
    sustain = 0.20,
    release = 0.08,
    gain = 0.07,
    filterFreq = 420,
    sendDelay = false,
    pan = 0
  }) {
    if (!this.ctx || this.muted) return;
    if (!this.sfxEnabled || this.sfxVolume <= 0.01) return;

    const t0 = time !== null ? time : this.ctx.currentTime;
    const tStop = t0 + duration + release;

    const osc = this.ctx.createOscillator();
    osc.type = type === 'triangle' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (detune) osc.detune.setValueAtTime(detune, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, slideTo), t0 + duration);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(0.6, t0);
    filter.frequency.setValueAtTime(Math.min(filterFreq, 540), t0);

    const env = this.ctx.createGain();
    const peak = Math.max(0.0006, gain * this.sfxVolume);
    const sustLevel = Math.max(0.0003, peak * sustain);

    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + attack);
    env.gain.exponentialRampToValueAtTime(sustLevel, t0 + attack + decay);
    env.gain.setValueAtTime(sustLevel, t0 + duration);
    env.gain.exponentialRampToValueAtTime(0.0001, tStop);

    let lastNode = env;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.8, Math.min(0.8, pan)), t0);
      env.connect(panner);
      lastNode = panner;
    }

    osc.connect(filter);
    filter.connect(env);
    lastNode.connect(this.compressor);

    if (sendDelay && this.delayNode) {
      const sendGain = this.ctx.createGain();
      sendGain.gain.setValueAtTime(0.14, t0);
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

  playNoise({
    time = null,
    duration = 0.16,
    gain = 0.10,
    filterType = 'lowpass',
    filterFreq = 380,
    filterEnd = 85
  }) {
    if (!this.ctx || !this.noiseBuffer || this.muted) return;
    if (!this.sfxEnabled || this.sfxVolume <= 0.01) return;

    const t0 = time !== null ? time : this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(Math.min(filterFreq, 520), t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(38, filterEnd), t0 + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(Math.max(0.0006, gain * this.sfxVolume), t0 + 0.016);
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

  // --- МЯГКИЕ ASMR-ВЫСТРЕЛЫ: Капля воды, глухой ASMR-щелчок и бархатное постукивание ---
  sfxShootWeapon(pan = 0, baseWeapon = 'droplet', secondary = 'none') {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (baseWeapon === 'droplet') {
      // 1. Тёплая глубокая капля воды (мягкий восходящий синус 135 -> 245 Гц)
      this.playVoice({
        time: now, freq: 135, slideTo: 245, type: 'sine',
        duration: 0.065, attack: 0.012, decay: 0.03, sustain: 0.15, release: 0.05,
        gain: 0.055, filterFreq: 360, sendDelay: true, pan
      });
    } else if (baseWeapon === 'kalimba') {
      // 2. Мягкий деревянный ASMR-щелчок / постукивание по дереву (175 -> 78 Гц)
      this.playVoice({
        time: now, freq: 175, slideTo: 78, type: 'sine',
        duration: 0.055, attack: 0.009, decay: 0.025, sustain: 0.12, release: 0.04,
        gain: 0.060, filterFreq: 340, sendDelay: false, pan
      });
    } else {
      // 3. Глухое бархатное касание + мягкий выдох
      this.playNoise({
        time: now, duration: 0.06, gain: 0.04,
        filterType: 'lowpass', filterFreq: 320, filterEnd: 110
      });
      this.playVoice({
        time: now, freq: 145, slideTo: 68, type: 'sine',
        duration: 0.06, attack: 0.012, decay: 0.03, sustain: 0.12, release: 0.04,
        gain: 0.055, filterFreq: 310, sendDelay: false, pan
      });
    }

    if (secondary !== 'none') {
      // Очень тихий глухой тактильный отклик второго оружия
      this.playVoice({
        time: now + 0.02, freq: 195, slideTo: 115, type: 'sine',
        duration: 0.05, attack: 0.01, decay: 0.02, sustain: 0.1, release: 0.04,
        gain: 0.038, filterFreq: 350, sendDelay: false, pan: -pan * 0.5
      });
    }
  }

  // Глухое мягкое постукивание при попадании снаряда
  sfxHit(pan = 0) {
    const pitch = 115 + Math.random() * 25;
    this.playVoice({
      freq: pitch, slideTo: 55, type: 'sine',
      duration: 0.055, attack: 0.008, decay: 0.025, sustain: 0.1, release: 0.04,
      gain: 0.055, filterFreq: 290, sendDelay: false, pan
    });
  }

  // Приглушённый бархатный взрыв (глубокий саб-бас 90 -> 26 Гц + мягкий тёплый шум)
  sfxExplosion(pan = 0, big = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = big ? 0.75 : 0.38;

    this.playVoice({
      time: now, freq: big ? 82 : 105, slideTo: 26, type: 'sine',
      duration: dur, attack: 0.014, decay: dur * 0.5, sustain: 0.15, release: 0.15,
      gain: big ? 0.24 : 0.16, filterFreq: 240, sendDelay: false, pan
    });
    this.playNoise({
      time: now, duration: dur, gain: big ? 0.22 : 0.14,
      filterType: 'lowpass', filterFreq: big ? 360 : 420, filterEnd: 55
    });
  }

  sfxIgnite(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise({ time: now, duration: 0.30, gain: 0.13, filterType: 'lowpass', filterFreq: 380, filterEnd: 120 });
    this.playVoice({ time: now, freq: 95, slideTo: 165, type: 'sine', duration: 0.22, attack: 0.02, decay: 0.08, sustain: 0.2, release: 0.1, gain: 0.08, filterFreq: 340, pan });
  }

  sfxGravity(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 78, slideTo: 42, type: 'sine', duration: 0.45, attack: 0.06, decay: 0.18, sustain: 0.35, release: 0.18, gain: 0.15, filterFreq: 220, sendDelay: true, pan });
  }

  sfxDisintegrate(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 190, slideTo: 95, type: 'sine', duration: 0.09, attack: 0.012, decay: 0.04, sustain: 0.12, release: 0.06, gain: 0.055, filterFreq: 360, pan });
  }

  sfxUnderwater(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.07].forEach((offset, idx) => {
      const base = 140 + idx * 40;
      this.playVoice({ time: now + offset, freq: base, slideTo: base * 1.55, type: 'sine', duration: 0.08, attack: 0.012, decay: 0.03, sustain: 0.15, release: 0.05, gain: 0.075, filterFreq: 380, pan });
    });
  }

  sfxCosmicHum() {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 65, slideTo: 98, type: 'sine', duration: 0.55, attack: 0.15, decay: 0.2, sustain: 0.35, release: 0.25, gain: 0.075, filterFreq: 260, sendDelay: true });
  }

  sfxSticky(pan = 0) {
    if (!this.ctx) return;
    this.playVoice({ time: this.ctx.currentTime, freq: 120, slideTo: 210, type: 'sine', duration: 0.11, attack: 0.015, decay: 0.04, sustain: 0.15, release: 0.06, gain: 0.08, filterFreq: 340, pan });
  }

  sfxWave() {
    if (!this.ctx) return;
    this.playNoise({ time: this.ctx.currentTime, duration: 0.55, gain: 0.12, filterType: 'lowpass', filterFreq: 280, filterEnd: 95 });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [48, 52, 55, 60].forEach((m, i) => {
      this.playVoice({ freq: this.midiToFreq(m), type: 'sine', time: now + i * 0.05, duration: 0.16, attack: 0.016, decay: 0.06, sustain: 0.25, release: 0.1, gain: 0.07, filterFreq: 420, sendDelay: true });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playVoice({ freq: 150, slideTo: 90, type: 'sine', duration: 0.18, attack: 0.015, decay: 0.08, sustain: 0.2, release: 0.1, gain: 0.085, filterFreq: 350, sendDelay: true });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({ freq: 135, slideTo: 52, type: 'triangle', duration: 0.22, attack: 0.015, decay: 0.09, sustain: 0.2, release: 0.08, gain: 0.14, filterFreq: 340 });
    this.playNoise({ duration: 0.18, gain: 0.12, filterType: 'lowpass', filterFreq: 320, filterEnd: 65 });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({ freq: 110, slideTo: 165, type: 'sine', time: now + i * 0.34, duration: 0.24, attack: 0.03, decay: 0.08, sustain: 0.35, release: 0.1, gain: 0.10, filterFreq: 380, sendDelay: true });
    }
  }

  sfxVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [48, 52, 55, 60].forEach((m, idx) => {
      this.playVoice({ time: now + idx * 0.12, freq: this.midiToFreq(m), type: 'sine', duration: 0.28, attack: 0.02, decay: 0.08, sustain: 0.35, release: 0.15, gain: 0.085, filterFreq: 460, sendDelay: true });
    });
  }

  sfxGameOver() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [55, 53, 50, 45].forEach((m, idx) => {
      this.playVoice({ time: now + idx * 0.20, freq: this.midiToFreq(m), type: 'sine', duration: 0.26, attack: 0.02, decay: 0.09, sustain: 0.35, release: 0.14, gain: 0.09, filterFreq: 380, sendDelay: true });
    });
  }
}
