'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.delayFilter = null;
    this.noiseBuffer = null;

    // Настройки пользователя
    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.75;
    this.sfxVolume = 0.85;
    this.timbre = 'classic'; // 'classic' | 'chiptune' | 'space'

    // Секвенсор (64 шага = 8 полных тактов)
    this.seqTimer = null;
    this.isPlayingMusic = false;
    this.musicMode = 'normal'; // 'normal' | 'boss'
    this.songStyle = 0;
    this.bpm = 122;
    this.rootOffset = 0;
    this.stepIndex = 0;
    this.nextNoteTime = 0;

    // 4 полноценные 64-шаговые композиции (лид + бас + аккорды для арпеджио и пэдов)
    this.songs = [
      // 0: Звёздная Бухта / Джунгли (Мелодичный космический фьюжн, Cmaj9 -> Am9 -> Fmaj9 -> G13)
      {
        lead: [
          76, 0,  79, 83,  84, 0,  83, 79,   76, 0,  74, 0,  72, 0,  0,  0,
          72, 0,  76, 79,  81, 0,  79, 76,   74, 0,  72, 0,  71, 0,  0,  0,
          69, 0,  72, 76,  79, 0,  81, 83,   84, 0,  83, 81, 79, 0,  76, 0,
          74, 0,  76, 79,  77, 0,  74, 71,   72, 0,  0,  0,  0,  0,  0,  0
        ],
        bass: [
          48, 0,  0,  48,  55, 0,  48, 0,    48, 0,  0,  48, 52, 0,  55, 0,
          45, 0,  0,  45,  52, 0,  45, 0,    45, 0,  0,  45, 48, 0,  52, 0,
          41, 0,  0,  41,  48, 0,  41, 0,    41, 0,  0,  41, 45, 0,  48, 0,
          43, 0,  0,  43,  50, 0,  43, 0,    47, 0,  50, 0,  55, 0,  43, 0
        ],
        chords: {
          0:  [60, 64, 67, 71, 74], // Cmaj9
          16: [57, 60, 64, 67, 71], // Am9
          32: [53, 57, 60, 64, 67], // Fmaj9
          48: [55, 59, 62, 65, 69]  // G13
        }
      },

      // 1: Сахарная Вата / Пончики (Солнечная светлая аркада, Fmaj7 -> G6 -> Em7 -> Am7)
      {
        lead: [
          81, 0,  84, 0,   88, 86, 84, 81,   79, 0,  81, 83, 84, 0,  0,  0,
          79, 0,  83, 0,   86, 84, 83, 79,   76, 0,  79, 81, 79, 0,  0,  0,
          76, 0,  79, 0,   83, 81, 79, 76,   74, 0,  76, 79, 81, 0,  0,  0,
          77, 0,  81, 0,   84, 83, 81, 79,   76, 0,  72, 0,  0,  0,  0,  0
        ],
        bass: [
          41, 0,  53, 0,   41, 0,  48, 0,    41, 0,  53, 0,  48, 0,  53, 0,
          43, 0,  55, 0,   43, 0,  50, 0,    43, 0,  55, 0,  50, 0,  55, 0,
          40, 0,  52, 0,   40, 0,  47, 0,    45, 0,  57, 0,  52, 0,  57, 0,
          41, 0,  53, 0,   43, 0,  55, 0,    48, 0,  60, 0,  55, 0,  48, 0
        ],
        chords: {
          0:  [65, 69, 72, 76], // Fmaj7
          16: [67, 71, 74, 76], // G6
          32: [64, 67, 71, 74], // Em7
          48: [60, 64, 67, 72]  // C
        }
      },

      // 2: Ледяная Комета / Призрачный сектор / Пустыня (Атмосферный космос, Dm9 -> Bbmaj7 -> Gm9 -> A7sus4)
      {
        lead: [
          74, 0,  77, 81,  84, 0,  81, 77,   76, 0,  74, 0,  72, 0,  0,  0,
          70, 0,  74, 77,  81, 0,  79, 77,   76, 0,  74, 0,  72, 0,  0,  0,
          67, 0,  70, 74,  77, 0,  79, 81,   82, 0,  81, 79, 77, 0,  74, 0,
          76, 0,  79, 81,  85, 0,  81, 79,   74, 0,  0,  0,  0,  0,  0,  0
        ],
        bass: [
          38, 0,  0,  38,  45, 0,  38, 0,    38, 0,  0,  38, 41, 0,  45, 0,
          34, 0,  0,  34,  41, 0,  34, 0,    34, 0,  0,  34, 38, 0,  41, 0,
          31, 0,  0,  31,  38, 0,  31, 0,    31, 0,  0,  31, 34, 0,  38, 0,
          33, 0,  0,  33,  40, 0,  33, 0,    37, 0,  40, 0,  45, 0,  33, 0
        ],
        chords: {
          0:  [62, 65, 69, 72, 76], // Dm9
          16: [58, 62, 65, 69, 72], // Bbmaj9
          32: [55, 58, 62, 65, 69], // Gm9
          48: [57, 62, 64, 67, 73]  // A7sus4 -> A7
        }
      },

      // 3: Кибер-Сити / Вулкан / Цитадель (Мелодичный синтвейв, Cm9 -> Abmaj7 -> Fm9 -> G7sus4)
      {
        lead: [
          72, 0,  75, 79,  82, 0,  79, 75,   74, 0,  72, 0,  70, 0,  67, 0,
          68, 0,  72, 75,  79, 0,  77, 75,   74, 0,  72, 0,  70, 0,  0,  0,
          65, 0,  68, 72,  75, 0,  77, 79,   80, 0,  79, 77, 75, 0,  72, 0,
          74, 0,  75, 79,  83, 0,  79, 77,   72, 0,  0,  0,  0,  0,  0,  0
        ],
        bass: [
          36, 48, 36, 48,  36, 48, 43, 48,   36, 48, 36, 48, 39, 48, 43, 48,
          32, 44, 32, 44,  32, 44, 39, 44,   32, 44, 32, 44, 34, 46, 39, 46,
          29, 41, 29, 41,  29, 41, 36, 41,   29, 41, 29, 41, 32, 44, 36, 44,
          31, 43, 31, 43,  31, 43, 38, 43,   35, 47, 38, 47, 43, 0,  31, 0
        ],
        chords: {
          0:  [60, 63, 67, 70, 74], // Cm9
          16: [56, 60, 63, 67, 70], // Abmaj9
          32: [53, 56, 60, 63, 67], // Fm9
          48: [55, 60, 62, 65, 71]  // G7sus4 -> G7
        }
      }
    ];

    // Эпичная, но музыкальная тема босса (32 шага)
    this.bossSong = {
      lead: [
        69, 0,  72, 76,  81, 0,  79, 76,
        77, 0,  76, 74,  76, 0,  72, 0,
        74, 0,  77, 81,  83, 0,  81, 79,
        76, 0,  75, 0,   76, 0,  81, 0
      ],
      bass: [
        45, 45, 57, 45,  45, 45, 57, 45,
        41, 41, 53, 41,  41, 41, 53, 41,
        38, 38, 50, 38,  40, 40, 52, 40,
        40, 52, 40, 52,  40, 0,  52, 0
      ],
      chords: {
        0:  [57, 60, 64, 69],
        8:  [53, 57, 60, 65],
        16: [50, 53, 57, 62],
        24: [52, 56, 59, 64]
      }
    };
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Мастер-компрессор для плотного, ровного звучания
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(22, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.006, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

      // Стерео-эхо (Delay) с мягким фильтром для объёма мелодии
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);

      this.delayFilter = this.ctx.createBiquadFilter();
      this.delayFilter.type = 'lowpass';
      this.delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.28, this.ctx.currentTime);

      this.delayNode.connect(this.delayFilter);
      this.delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayFilter.connect(this.compressor);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 0.88, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Буфер шума
      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < sampleRate; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.88, now, 0.02);
    }
    return this.muted;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  resolveWave(requestedType, role) {
    if (this.timbre === 'chiptune') {
      if (role === 'bass') return 'triangle';
      if (role === 'pad') return 'triangle';
      return 'square';
    }
    if (this.timbre === 'space') {
      return 'sine';
    }
    // 'classic' — мягкий мультяшный полисинт
    if (role === 'bass') return 'triangle';
    if (role === 'pad') return 'sine';
    return requestedType;
  }

  playVoice({
    freq = 440,
    slideTo = null,
    type = 'triangle',
    role = 'lead',
    channel = 'sfx',
    detune = 0,
    time = null,
    duration = 0.22,
    attack = 0.015,
    decay = 0.08,
    sustain = 0.5,
    release = 0.12,
    gain = 0.12,
    filterFreq = 2000,
    sendDelay = false,
    pan = 0
  }) {
    if (!this.ctx || this.muted) return;
    if (channel === 'music' && (!this.musicEnabled || this.musicVolume <= 0.01)) return;
    if (channel === 'sfx' && (!this.sfxEnabled || this.sfxVolume <= 0.01)) return;

    const volScale = channel === 'music' ? this.musicVolume : this.sfxVolume;
    const t0 = time !== null ? time : this.ctx.currentTime;
    const tStop = t0 + duration + release;

    const osc = this.ctx.createOscillator();
    osc.type = this.resolveWave(type, role);
    osc.frequency.setValueAtTime(freq, t0);
    if (detune) osc.detune.setValueAtTime(detune, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + duration);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(1.1, t0);

    // Смягчаем верхние частоты, чтобы звук был бархатным и не резал слух
    let cutoff = filterFreq;
    if (this.timbre === 'space') cutoff = Math.min(cutoff, 1400);
    else if (this.timbre === 'chiptune') cutoff = Math.min(cutoff, 2100);
    else cutoff = Math.min(cutoff, 2200);
    filter.frequency.setValueAtTime(cutoff, t0);

    const env = this.ctx.createGain();
    const peak = Math.max(0.001, gain * volScale);
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
      const delaySendGain = this.ctx.createGain();
      delaySendGain.gain.setValueAtTime(0.28, t0);
      lastNode.connect(delaySendGain);
      delaySendGain.connect(this.delayNode);
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
        detune: idx % 2 === 0 ? -6 : 6,
        pan: ((idx / Math.max(1, midiNotes.length - 1)) - 0.5) * 0.5
      });
    });
  }

  playNoise({
    time = null,
    channel = 'sfx',
    duration = 0.15,
    gain = 0.14,
    filterType = 'bandpass',
    filterFreq = 1200,
    filterEnd = 300
  }) {
    if (!this.ctx || !this.noiseBuffer || this.muted) return;
    if (channel === 'music' && (!this.musicEnabled || this.musicVolume <= 0.01)) return;
    if (channel === 'sfx' && (!this.sfxEnabled || this.sfxVolume <= 0.01)) return;

    const volScale = channel === 'music' ? this.musicVolume : this.sfxVolume;
    const t0 = time !== null ? time : this.ctx.currentTime;

    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, filterEnd), t0 + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(Math.max(0.001, gain * volScale), t0);
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

  // --- МЯГКАЯ ПЕРКУССИЯ ДЛЯ МУЗЫКИ ---
  playKick(time) {
    this.playVoice({
      channel: 'music',
      role: 'bass',
      type: 'sine',
      freq: 120,
      slideTo: 42,
      time,
      duration: 0.12,
      attack: 0.004,
      decay: 0.06,
      sustain: 0.1,
      release: 0.05,
      gain: 0.12,
      filterFreq: 320
    });
  }

  playSnare(time) {
    this.playNoise({
      channel: 'music',
      time,
      duration: 0.08,
      gain: 0.042,
      filterType: 'bandpass',
      filterFreq: 1500,
      filterEnd: 650
    });
    this.playVoice({
      channel: 'music',
      role: 'pad',
      type: 'triangle',
      freq: 195,
      slideTo: 105,
      time,
      duration: 0.045,
      attack: 0.003,
      decay: 0.025,
      sustain: 0.1,
      release: 0.02,
      gain: 0.045,
      filterFreq: 950
    });
  }

  // --- ЗВУКОВЫЕ ЭФФЕКТЫ (SFX) ---
  sfxShoot(pan = 0, weaponLevel = 1) {
    this.playVoice({
      channel: 'sfx',
      freq: weaponLevel > 1 ? 820 : 690,
      slideTo: weaponLevel > 1 ? 240 : 190,
      type: 'triangle',
      duration: 0.075,
      attack: 0.004,
      decay: 0.035,
      sustain: 0.15,
      release: 0.03,
      gain: 0.075,
      filterFreq: 2100,
      pan
    });
    if (weaponLevel >= 2) {
      this.playVoice({
        channel: 'sfx',
        freq: 1180,
        slideTo: 380,
        type: 'sine',
        duration: 0.06,
        attack: 0.003,
        decay: 0.03,
        sustain: 0.1,
        release: 0.02,
        gain: 0.05,
        filterFreq: 2200,
        pan
      });
    }
  }

  sfxHit(pan = 0) {
    this.playVoice({
      channel: 'sfx',
      freq: 210,
      slideTo: 80,
      type: 'triangle',
      duration: 0.055,
      attack: 0.003,
      decay: 0.03,
      sustain: 0.1,
      release: 0.02,
      gain: 0.07,
      filterFreq: 900,
      pan
    });
  }

  sfxExplosion(pan = 0, big = false) {
    const dur = big ? 0.50 : 0.22;
    this.playNoise({
      channel: 'sfx',
      duration: dur,
      gain: big ? 0.22 : 0.13,
      filterType: 'lowpass',
      filterFreq: big ? 880 : 1200,
      filterEnd: 85
    });
    this.playVoice({
      channel: 'sfx',
      freq: big ? 125 : 175,
      slideTo: 34,
      type: 'sine',
      duration: dur,
      attack: 0.005,
      decay: dur * 0.6,
      sustain: 0.1,
      release: 0.07,
      gain: big ? 0.22 : 0.14,
      filterFreq: 450,
      pan
    });
  }

  sfxPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [60, 64, 67, 72, 76].forEach((m, i) => {
      this.playVoice({
        channel: 'sfx',
        freq: this.midiToFreq(m),
        type: 'sine',
        time: now + i * 0.045,
        duration: 0.15,
        attack: 0.008,
        decay: 0.06,
        sustain: 0.4,
        release: 0.10,
        gain: 0.11,
        filterFreq: 2400,
        sendDelay: true
      });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([72, 79, 84], {
      channel: 'sfx',
      type: 'sine',
      duration: 0.18,
      attack: 0.006,
      decay: 0.08,
      sustain: 0.2,
      release: 0.1,
      gain: 0.10,
      sendDelay: true
    });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({
      channel: 'sfx',
      freq: 290,
      slideTo: 90,
      type: 'sawtooth',
      duration: 0.28,
      attack: 0.01,
      decay: 0.12,
      sustain: 0.3,
      release: 0.08,
      gain: 0.14,
      filterFreq: 950
    });
    this.playNoise({
      channel: 'sfx',
      duration: 0.2,
      gain: 0.12,
      filterType: 'lowpass',
      filterFreq: 650,
      filterEnd: 110
    });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({
        channel: 'sfx',
        freq: 310,
        slideTo: 466,
        type: 'triangle',
        time: now + i * 0.32,
        duration: 0.24,
        attack: 0.02,
        decay: 0.08,
        sustain: 0.6,
        release: 0.06,
        gain: 0.11,
        filterFreq: 1300
      });
    }
  }

  sfxVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { notes: [60, 64, 67], t: 0.00, d: 0.15 },
      { notes: [60, 64, 67], t: 0.17, d: 0.15 },
      { notes: [65, 69, 72], t: 0.35, d: 0.25 },
      { notes: [67, 71, 74], t: 0.64, d: 0.23 },
      { notes: [72, 76, 79, 84], t: 0.90, d: 0.55 }
    ].forEach(step => {
      this.playChord(step.notes, {
        channel: 'sfx',
        time: now + step.t,
        type: 'triangle',
        duration: step.d,
        attack: 0.012,
        decay: 0.08,
        sustain: 0.6,
        release: 0.16,
        gain: 0.11,
        filterFreq: 2400,
        sendDelay: true
      });
    });
  }

  sfxGameOver() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { m: 64, t: 0.00, d: 0.22 },
      { m: 62, t: 0.24, d: 0.22 },
      { m: 60, t: 0.48, d: 0.24 },
      { m: 55, t: 0.74, d: 0.50 }
    ].forEach(s => {
      this.playVoice({
        channel: 'sfx',
        freq: this.midiToFreq(s.m),
        slideTo: s.m === 55 ? this.midiToFreq(52) : null,
        type: 'sine',
        time: now + s.t,
        duration: s.d,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.5,
        release: 0.15,
        gain: 0.13,
        filterFreq: 1600,
        sendDelay: true
      });
    });
  }

  // --- УПРАВЛЕНИЕ СЕКВЕНСОРОМ ---
  startMusic(mode = 'normal', bpm = 122, rootOffset = 0, songStyle = 0) {
    this.init();
    if (!this.ctx) return;
    this.musicMode = mode;
    this.bpm = bpm;
    this.rootOffset = rootOffset;
    this.songStyle = songStyle % this.songs.length;
    this.stepIndex = 0;

    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.seqTimer = setInterval(() => this.scheduler(), 25);
  }

  setMusicMode(mode) {
    this.musicMode = mode;
    this.stepIndex = 0;
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.seqTimer) {
      clearInterval(this.seqTimer);
      this.seqTimer = null;
    }
  }

  scheduler() {
    if (!this.isPlayingMusic || !this.ctx) return;
    const lookahead = 0.14;
    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      this.scheduleStep(this.stepIndex, this.nextNoteTime);
      const curBpm = this.musicMode === 'boss' ? Math.max(138, this.bpm + 12) : this.bpm;
      const eighth = 60 / curBpm / 2;
      this.nextNoteTime += eighth;
      const maxSteps = this.musicMode === 'boss' ? 32 : 64;
      this.stepIndex = (this.stepIndex + 1) % maxSteps;
    }
  }

  scheduleStep(step, time) {
    const isBoss = this.musicMode === 'boss';
    const track = isBoss ? this.bossSong : this.songs[this.songStyle];
    const shift = isBoss ? 0 : this.rootOffset;

    // 1. Ударные
    const beatInBar = step % 8;
    if (beatInBar === 0 || beatInBar === 4) this.playKick(time);
    if (beatInBar === 2 || beatInBar === 6) this.playSnare(time);
    if (step % 2 === 1) {
      this.playNoise({
        channel: 'music',
        time,
        duration: 0.028,
        gain: 0.018,
        filterType: 'highpass',
        filterFreq: 6200,
        filterEnd: 4800
      });
    }

    // 2. Тёплый полифонический пэд на начало каждого 2-тактового аккорда
    const blockStart = Math.floor(step / 16) * 16;
    const chordKey = isBoss ? Math.floor(step / 8) * 8 : blockStart;
    const currentChord = track.chords[chordKey];

    if (track.chords[step]) {
      this.playChord(track.chords[step].map(n => n + shift), {
        channel: 'music',
        role: 'pad',
        time,
        type: 'sine',
        duration: isBoss ? 0.65 : 1.35,
        attack: 0.08,
        decay: 0.25,
        sustain: 0.5,
        release: 0.35,
        gain: 0.045,
        filterFreq: 1350
      });
    }

    // 3. Переливающийся фоновый арпеджиатор по нотам текущего аккорда
    if (currentChord && !isBoss) {
      const arpNote = currentChord[step % currentChord.length] + shift;
      this.playVoice({
        channel: 'music',
        role: 'pad',
        type: 'sine',
        freq: this.midiToFreq(arpNote),
        time,
        duration: 0.14,
        attack: 0.015,
        decay: 0.06,
        sustain: 0.25,
        release: 0.09,
        gain: 0.032,
        filterFreq: 1700,
        sendDelay: true,
        pan: Math.sin(step * 0.7) * 0.45
      });
    }

    // 4. Глубокий округлый бас
    const bassMidi = track.bass[step];
    if (bassMidi > 0) {
      this.playVoice({
        channel: 'music',
        role: 'bass',
        freq: this.midiToFreq(bassMidi + shift),
        type: 'triangle',
        time,
        duration: 0.18,
        attack: 0.01,
        decay: 0.07,
        sustain: 0.45,
        release: 0.07,
        gain: isBoss ? 0.085 : 0.105,
        filterFreq: 680
      });
    }

    // 5. Двухголосная лид-мелодия со стерео-хорусом и мягким эхом
    const leadMidi = track.lead[step];
    if (leadMidi > 0) {
      const f = this.midiToFreq(leadMidi + shift);
      this.playVoice({
        channel: 'music',
        role: 'lead',
        freq: f,
        type: isBoss ? 'triangle' : 'sine',
        time,
        duration: 0.20,
        attack: 0.018,
        decay: 0.07,
        sustain: 0.55,
        release: 0.11,
        gain: isBoss ? 0.065 : 0.082,
        filterFreq: 2000,
        sendDelay: true,
        pan: -0.16
      });
      this.playVoice({
        channel: 'music',
        role: 'lead',
        freq: f,
        detune: 6,
        type: 'triangle',
        time,
        duration: 0.20,
        attack: 0.02,
        decay: 0.07,
        sustain: 0.45,
        release: 0.11,
        gain: 0.048,
        filterFreq: 1850,
        pan: 0.16
      });
    }
  }
}
