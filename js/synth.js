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
    this.musicVolume = 0.50;
    // Базовая громкость SFX выше на 50% (0.72 * 1.5 = 1.08)
    this.sfxVolume = 1.08;
    this.timbre = 'space';

    // Автоматически пополняемый список всех треков из папки music/
    this.availableTracks = ['level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3'];
    this.selectedTrack = 'auto';
    this.recentTracks = [];

    this.bgmAudio = null;
    this.currentTrackPath = '';
    this.ambientOsc = null;
    this.ambientGain = null;

    this.scanMusicFolder();
  }

  // Автоматически находим все загруженные треки (level1..level15, track1..track15, 1..15) в папке music/
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
        hint.textContent = `Найдено треков в music/: ${list.length} (+ boss.mp3 для боссов)`;
      }
    };

    candidates.forEach(fname => {
      fetch(`music/${fname}`, { method: 'HEAD' })
        .then(res => {
          if (res.ok) found.add(fname);
        })
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
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(20, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.008, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.21, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1350, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.compressor);

      // Усиленный мастер-канал для громких и чётких SFX (+50%)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 1.35, this.ctx.currentTime);

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
        data[i] = (b0 + b1 + b2 + white * 0.26) * 0.58;
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
      // Для босса всегда включаем залитый файл music/boss.mp3
      const prevTrack = this.recentTracks[this.recentTracks.length - 1] || 'level1.mp3';
      this.playTrack('boss.mp3', prevTrack);
      return;
    }
    const chosen = this.pickNextTrack();
    this.playTrack(chosen);
  }

  setMusicMode(mode) {
    if (mode === 'boss') {
      this.startMusic('boss');
    }
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

  playVoice({
    freq = 440,
    slideTo = null,
    type = 'sine',
    detune = 0,
    time = null,
    duration = 0.16,
    attack = 0.010,
    decay = 0.06,
    sustain = 0.35,
    release = 0.09,
    gain = 0.14,
    filterFreq = 1800,
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
    const maxCut = this.timbre === 'space' ? 1600 : (this.timbre === 'classic' ? 2000 : 2400);
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
    duration = 0.16,
    gain = 0.16,
    filterType = 'lowpass',
    filterFreq = 1050,
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

  // --- УНИКАЛЬНЫЕ ASMR-ЗВУКИ ДЛЯ КАЖДОГО ОРУЖИЯ ---
  sfxShootWeapon(pan = 0, secondary = 'none', level = 1) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (secondary === 'none') {
      this.playVoice({
        time: now, freq: 520, slideTo: 165, type: 'sine',
        duration: 0.08, attack: 0.007, decay: 0.04, sustain: 0.2, release: 0.04,
        gain: 0.11, filterFreq: 1450, pan
      });
    } else if (secondary === 'pizza') {
      this.playNoise({
        time: now, duration: 0.09, gain: 0.09,
        filterType: 'bandpass', filterFreq: 1350, filterEnd: 520
      });
      this.playVoice({
        time: now, freq: level >= 2 ? 640 : 560, slideTo: 220, type: 'triangle',
        duration: 0.09, attack: 0.008, decay: 0.04, sustain: 0.2, release: 0.05,
        gain: 0.11, filterFreq: 1650, pan
      });
    } else if (secondary === 'sushi') {
      this.playVoice({
        time: now, freq: 987.77, slideTo: 880, type: 'sine',
        duration: 0.10, attack: 0.005, decay: 0.05, sustain: 0.25, release: 0.07,
        gain: 0.10, filterFreq: 2100, sendDelay: true, pan: pan - 0.15
      });
      this.playVoice({
        time: now + 0.025, freq: level >= 2 ? 1318.5 : 1174.6, slideTo: 1046.5, type: 'sine',
        duration: 0.09, attack: 0.005, decay: 0.04, sustain: 0.2, release: 0.06,
        gain: 0.09, filterFreq: 2100, pan: pan + 0.15
      });
    } else if (secondary === 'donut') {
      this.playVoice({
        time: now, freq: 1120, slideTo: 340, type: 'sine',
        duration: 0.075, attack: 0.004, decay: 0.035, sustain: 0.15, release: 0.04,
        gain: 0.105, filterFreq: 1950, pan
      });
      this.playVoice({
        time: now, freq: 560, slideTo: 170, type: 'triangle',
        duration: 0.075, attack: 0.004, decay: 0.035, sustain: 0.15, release: 0.04,
        gain: 0.08, filterFreq: 1450, pan
      });
    } else if (secondary === 'burger') {
      this.playVoice({
        time: now, freq: 240, slideTo: 62, type: 'sine',
        duration: 0.15, attack: 0.008, decay: 0.07, sustain: 0.25, release: 0.07,
        gain: 0.15, filterFreq: 750, pan
      });
      this.playNoise({
        time: now, duration: 0.13, gain: 0.11,
        filterType: 'lowpass', filterFreq: 950, filterEnd: 240
      });
    }
  }

  sfxHit(pan = 0) {
    const pitch = 230 + Math.random() * 55;
    this.playVoice({
      freq: pitch, slideTo: pitch * 0.48, type: 'sine',
      duration: 0.06, attack: 0.005, decay: 0.03, sustain: 0.1, release: 0.03,
      gain: 0.11, filterFreq: 980, pan
    });
  }

  // 1. ВЗРЫВЫ
  sfxExplosion(pan = 0, big = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = big ? 0.68 : 0.32;

    this.playNoise({
      time: now, duration: dur, gain: big ? 0.34 : 0.22,
      filterType: 'lowpass', filterFreq: big ? 900 : 1150, filterEnd: 85
    });
    this.playVoice({
      time: now, freq: big ? 135 : 180, slideTo: 34, type: 'sine',
      duration: dur, attack: 0.008, decay: dur * 0.55, sustain: 0.12, release: 0.10,
      gain: big ? 0.34 : 0.23, filterFreq: 440, pan
    });
    this.playNoise({
      time: now + 0.045, duration: dur * 0.6, gain: big ? 0.20 : 0.13,
      filterType: 'bandpass', filterFreq: 1020, filterEnd: 300
    });
  }

  // 2. ВОЗГОРАНИЕ (треск и вспышка огня на вулканическом и лавовых событиях)
  sfxIgnite(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise({
      time: now, duration: 0.34, gain: 0.22,
      filterType: 'bandpass', filterFreq: 1400, filterEnd: 420
    });
    this.playVoice({
      time: now, freq: 140, slideTo: 390, type: 'sawtooth',
      duration: 0.26, attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.12,
      gain: 0.14, filterFreq: 1100, pan
    });
  }

  // 3. ГРАВИТАЦИЯ (низкий вибрирующий варп-импульс притяжения)
  sfxGravity(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playVoice({
      time: now, freq: 92, slideTo: 48, type: 'sine',
      duration: 0.48, attack: 0.06, decay: 0.18, sustain: 0.5, release: 0.22,
      gain: 0.24, filterFreq: 340, sendDelay: true, pan
    });
    this.playVoice({
      time: now + 0.03, freq: 138, slideTo: 72, type: 'triangle',
      duration: 0.45, attack: 0.06, decay: 0.18, sustain: 0.4, release: 0.2,
      gain: 0.14, filterFreq: 420, pan
    });
  }

  // 4. РАСЩЕПЛЕНИЕ (кристаллический / бриллиантовый перезвон-дезинтеграция)
  sfxDisintegrate(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [1318, 1568, 1975, 2349].forEach((f, idx) => {
      this.playVoice({
        time: now + idx * 0.032, freq: f, slideTo: f * 0.65, type: 'sine',
        duration: 0.14, attack: 0.005, decay: 0.06, sustain: 0.2, release: 0.08,
        gain: 0.11, filterFreq: 2200, sendDelay: true, pan
      });
    });
  }

  // 5. ПОДВОДНЫЕ ЗВУКИ (булькающие пузыри с восходящим питчем)
  sfxUnderwater(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.07, 0.15].forEach((offset, idx) => {
      const base = 320 + idx * 110 + Math.random() * 60;
      this.playVoice({
        time: now + offset, freq: base, slideTo: base * 1.85, type: 'sine',
        duration: 0.08, attack: 0.008, decay: 0.03, sustain: 0.2, release: 0.04,
        gain: 0.14, filterFreq: 1300, sendDelay: true, pan
      });
    });
  }

  // 6. КОСМИЧЕСКИЙ ГУЛ (глубокий обволакивающий дроун при смене аномалии)
  sfxCosmicHum() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [65.41, 98.00, 130.81].forEach((f, idx) => {
      this.playVoice({
        time: now, freq: f, slideTo: f * 1.04, type: 'sine',
        duration: 0.75, attack: 0.18, decay: 0.25, sustain: 0.6, release: 0.35,
        gain: 0.14, filterFreq: 420, sendDelay: true, pan: (idx - 1) * 0.4
      });
    });
  }

  // 7. ЗАЛИПАНИЕ (вязкий сахарный / органический чмок при попадании в липкую зону)
  sfxSticky(pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playVoice({
      time: now, freq: 190, slideTo: 420, type: 'triangle',
      duration: 0.14, attack: 0.015, decay: 0.06, sustain: 0.25, release: 0.06,
      gain: 0.15, filterFreq: 950, pan
    });
    this.playVoice({
      time: now + 0.09, freq: 380, slideTo: 150, type: 'sine',
      duration: 0.12, attack: 0.01, decay: 0.05, sustain: 0.2, release: 0.05,
      gain: 0.13, filterFreq: 850, pan
    });
  }

  // 8. ВОЛНА (накатывающий шум прибоя / энергетической волны)
  sfxWave() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise({
      time: now, duration: 0.65, gain: 0.20,
      filterType: 'lowpass', filterFreq: 260, filterEnd: 920
    });
    this.playNoise({
      time: now + 0.35, duration: 0.55, gain: 0.15,
      filterType: 'lowpass', filterFreq: 880, filterEnd: 180
    });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [60, 64, 67, 71, 74, 79].forEach((m, i) => {
      this.playVoice({
        freq: this.midiToFreq(m), type: 'sine', time: now + i * 0.045,
        duration: 0.20, attack: 0.012, decay: 0.07, sustain: 0.35, release: 0.14,
        gain: 0.135, filterFreq: 1950, sendDelay: true
      });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([67, 74, 79, 83], {
      type: 'sine', duration: 0.24, attack: 0.012, decay: 0.1, sustain: 0.25, release: 0.14,
      gain: 0.13, sendDelay: true
    });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({
      freq: 220, slideTo: 75, type: 'triangle', duration: 0.28,
      attack: 0.015, decay: 0.12, sustain: 0.3, release: 0.09, gain: 0.21, filterFreq: 850
    });
    this.playNoise({ duration: 0.22, gain: 0.19, filterType: 'lowpass', filterFreq: 580, filterEnd: 90 });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({
        freq: 196, slideTo: 294, type: 'sine', time: now + i * 0.36,
        duration: 0.28, attack: 0.03, decay: 0.1, sustain: 0.5, release: 0.1,
        gain: 0.16, filterFreq: 1100, sendDelay: true
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
        time: now + step.t, type: 'sine', duration: step.d,
        attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.22,
        gain: 0.15, filterFreq: 2000, sendDelay: true
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
        freq: this.midiToFreq(s.m), slideTo: s.m === 55 ? this.midiToFreq(52) : null,
        type: 'sine', time: now + s.t, duration: s.d,
        attack: 0.025, decay: 0.12, sustain: 0.5, release: 0.18,
        gain: 0.17, filterFreq: 1500, sendDelay: true
      });
    });
  }
}
