'use strict';

class PolySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.noiseBuffer = null;

    // Пользовательские настройки
    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.75;
    this.sfxVolume = 0.85;
    this.timbre = 'classic'; // 'classic' | 'chiptune' | 'space'

    // Секвенсор
    this.seqTimer = null;
    this.isPlayingMusic = false;
    this.musicMode = 'normal'; // 'normal' | 'boss'
    this.songStyle = 0; // 0..3
    this.bpm = 126;
    this.rootOffset = 0;
    this.stepIndex = 0;
    this.nextNoteTime = 0;

    // 4 уникальные музыкальные темы (32 шага = 4 такта по 8 восьмых нот)
    this.songs = [
      // 0: Классический героический космос (C major / A minor)
      {
        lead: [
          72, 0, 76, 79,  84, 0, 79, 76,
          74, 0, 77, 81,  79, 0, 76, 0,
          69, 0, 72, 76,  81, 0, 79, 76,
          74, 76, 77, 79, 76, 0, 0,  0
        ],
        bass: [
          48, 0, 48, 0,  48, 0, 55, 0,
          45, 0, 45, 0,  45, 0, 52, 0,
          41, 0, 41, 0,  41, 0, 48, 0,
          43, 0, 43, 0,  47, 0, 55, 0
        ],
        chords: {
          0:  [60, 64, 67, 71],
          8:  [57, 60, 64, 67],
          16: [53, 57, 60, 64],
          24: [55, 59, 62, 65]
        }
      },
      // 1: Прыгучая весёлая тема (Сахарная вата / Пончики)
      {
        lead: [
          76, 79, 84, 79,  76, 72, 74, 76,
          77, 81, 86, 81,  79, 76, 74, 0,
          76, 79, 84, 88,  86, 84, 81, 79,
          77, 76, 74, 71,  72, 0,  0,  0
        ],
        bass: [
          48, 60, 48, 60,  48, 60, 55, 60,
          41, 53, 41, 53,  43, 55, 43, 55,
          45, 57, 45, 57,  41, 53, 41, 53,
          43, 55, 43, 55,  48, 0,  48, 0
        ],
        chords: {
          0:  [60, 64, 67],
          8:  [53, 57, 60, 64],
          16: [57, 60, 64, 67],
          24: [55, 59, 62, 67]
        }
      },
      // 2: Загадочный космос (Ледяная комета / Призрачный сектор)
      {
        lead: [
          69, 0, 72, 76,  79, 0, 76, 72,
          71, 0, 74, 77,  76, 0, 72, 0,
          68, 0, 71, 76,  81, 0, 79, 77,
          76, 74, 72, 71, 69, 0, 0,  0
        ],
        bass: [
          45, 0, 52, 0,  45, 0, 52, 0,
          43, 0, 50, 0,  48, 0, 55, 0,
          40, 0, 47, 0,  45, 0, 52, 0,
          41, 0, 40, 0,  45, 0, 0,  0
        ],
        chords: {
          0:  [57, 60, 64, 67],
          8:  [55, 59, 62, 65],
          16: [52, 56, 59, 64],
          24: [53, 57, 60, 64]
        }
      },
      // 3: Драйвовый синтвейв (Кибер-Сити / Вулкан / Цитадель)
      {
        lead: [
          72, 72, 79, 72,  77, 72, 75, 74,
          72, 72, 79, 72,  80, 79, 77, 75,
          74, 74, 81, 74,  79, 74, 77, 75,
          79, 77, 75, 74,  72, 0,  79, 0
        ],
        bass: [
          36, 48, 36, 48,  36, 48, 36, 48,
          32, 44, 32, 44,  34, 46, 34, 46,
          29, 41, 29, 41,  29, 41, 29, 41,
          31, 43, 31, 43,  36, 48, 36, 0
        ],
        chords: {
          0:  [60, 63, 67],
          8:  [56, 60, 63],
          16: [53, 56, 60],
          24: [55, 59, 62]
        }
      }
    ];

    // Тема битвы с боссом
    this.bossSong = {
      lead: [
        69, 69, 72, 69,  76, 0, 75, 0,
        69, 69, 72, 69,  77, 0, 76, 0,
        74, 72, 71, 69,  68, 0, 71, 0,
        76, 0,  75, 0,   76, 0, 81, 0
      ],
      bass: [
        45, 45, 57, 45,  45, 45, 57, 45,
        41, 41, 53, 41,  41, 41, 53, 41,
        38, 38, 50, 38,  40, 40, 52, 40,
        40, 52, 40, 52,  40, 0,  52, 0
      ],
      chords: {
        0:  [57, 60, 64],
        8:  [53, 57, 60],
        16: [50, 53, 57],
        24: [52, 56, 59]
      }
    };
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Компрессор на мастер-шине для чистого полифонического микса
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(18, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.16, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0001 : 0.85, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Буфер белого шума для ударных и взрывов
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
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.85, now, 0.02);
    }
    return this.muted;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  resolveWave(requestedType, role) {
    if (this.timbre === 'chiptune') {
      return role === 'bass' ? 'triangle' : 'square';
    }
    if (this.timbre === 'space') {
      return role === 'bass' ? 'sine' : 'triangle';
    }
    return requestedType;
  }

  // Полифонический голос с ADSR, фильтром и стереопанорамой
  playVoice({
    freq = 440,
    slideTo = null,
    type = 'triangle',
    role = 'lead',
    channel = 'sfx',
    detune = 0,
    time = null,
    duration = 0.2,
    attack = 0.01,
    decay = 0.06,
    sustain = 0.5,
    release = 0.08,
    gain = 0.14,
    filterFreq = 2600,
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
    filter.Q.setValueAtTime(1.3, t0);
    const fCutoff = this.timbre === 'space' ? Math.min(filterFreq, 1750) : filterFreq;
    filter.frequency.setValueAtTime(fCutoff, t0);

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
      panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, pan)), t0);
      env.connect(panner);
      lastNode = panner;
    }

    osc.connect(filter);
    filter.connect(env);
    lastNode.connect(this.compressor);

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
        detune: idx % 2 === 0 ? -5 : 5
      });
    });
  }

  playNoise({
    time = null,
    channel = 'sfx',
    duration = 0.15,
    gain = 0.15,
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

  // --- СИНТЕЗИРОВАННЫЕ УДАРНЫЕ ДЛЯ СЕКВЕНСОРА ---
  playKick(time) {
    this.playVoice({
      channel: 'music',
      role: 'bass',
      type: 'sine',
      freq: 135,
      slideTo: 42,
      time,
      duration: 0.11,
      attack: 0.003,
      decay: 0.05,
      sustain: 0.1,
      release: 0.04,
      gain: 0.13,
      filterFreq: 420
    });
  }

  playSnare(time) {
    this.playNoise({
      channel: 'music',
      time,
      duration: 0.09,
      gain: 0.06,
      filterType: 'bandpass',
      filterFreq: 1800,
      filterEnd: 750
    });
    this.playVoice({
      channel: 'music',
      role: 'lead',
      type: 'triangle',
      freq: 210,
      slideTo: 110,
      time,
      duration: 0.05,
      attack: 0.002,
      decay: 0.03,
      sustain: 0.1,
      release: 0.02,
      gain: 0.06,
      filterFreq: 1200
    });
  }

  // --- ИГРОВЫЕ ЗВУКОВЫЕ ЭФФЕКТЫ (SFX) ---
  sfxShoot(pan = 0, weaponLevel = 1) {
    this.playVoice({
      channel: 'sfx',
      freq: weaponLevel > 1 ? 940 : 780,
      slideTo: weaponLevel > 1 ? 260 : 210,
      type: 'triangle',
      duration: 0.08,
      attack: 0.004,
      decay: 0.04,
      sustain: 0.2,
      release: 0.03,
      gain: 0.095,
      filterFreq: 3400,
      pan
    });
    if (weaponLevel >= 2) {
      this.playVoice({
        channel: 'sfx',
        freq: 1420,
        slideTo: 440,
        type: 'sine',
        duration: 0.065,
        attack: 0.003,
        decay: 0.03,
        sustain: 0.1,
        release: 0.02,
        gain: 0.06,
        pan
      });
    }
  }

  sfxHit(pan = 0) {
    this.playVoice({
      channel: 'sfx',
      freq: 230,
      slideTo: 85,
      type: 'square',
      duration: 0.055,
      attack: 0.003,
      decay: 0.03,
      sustain: 0.1,
      release: 0.02,
      gain: 0.08,
      filterFreq: 950,
      pan
    });
  }

  sfxExplosion(pan = 0, big = false) {
    const dur = big ? 0.48 : 0.22;
    this.playNoise({
      channel: 'sfx',
      duration: dur,
      gain: big ? 0.24 : 0.15,
      filterType: 'lowpass',
      filterFreq: big ? 950 : 1400,
      filterEnd: 85
    });
    this.playVoice({
      channel: 'sfx',
      freq: big ? 130 : 185,
      slideTo: 35,
      type: 'triangle',
      duration: dur,
      attack: 0.005,
      decay: dur * 0.6,
      sustain: 0.1,
      release: 0.06,
      gain: big ? 0.22 : 0.14,
      filterFreq: 520,
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
        type: 'triangle',
        time: now + i * 0.042,
        duration: 0.13,
        attack: 0.005,
        decay: 0.05,
        sustain: 0.4,
        release: 0.08,
        gain: 0.12,
        filterFreq: 4200
      });
    });
  }

  sfxShieldBlock() {
    if (!this.ctx) return;
    this.playChord([72, 79, 84], {
      channel: 'sfx',
      type: 'sine',
      duration: 0.17,
      attack: 0.005,
      decay: 0.08,
      sustain: 0.2,
      release: 0.09,
      gain: 0.11
    });
  }

  sfxHurt() {
    if (!this.ctx) return;
    this.playVoice({
      channel: 'sfx',
      freq: 320,
      slideTo: 95,
      type: 'sawtooth',
      duration: 0.28,
      attack: 0.01,
      decay: 0.12,
      sustain: 0.3,
      release: 0.08,
      gain: 0.16,
      filterFreq: 1100
    });
    this.playNoise({
      channel: 'sfx',
      duration: 0.2,
      gain: 0.14,
      filterType: 'lowpass',
      filterFreq: 700,
      filterEnd: 120
    });
  }

  sfxBossAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      this.playVoice({
        channel: 'sfx',
        freq: 330,
        slideTo: 494,
        type: 'sawtooth',
        time: now + i * 0.32,
        duration: 0.24,
        attack: 0.02,
        decay: 0.08,
        sustain: 0.6,
        release: 0.06,
        gain: 0.12,
        filterFreq: 1500
      });
    }
  }

  sfxVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { notes: [60, 64, 67], t: 0.00, d: 0.14 },
      { notes: [60, 64, 67], t: 0.16, d: 0.14 },
      { notes: [65, 69, 72], t: 0.34, d: 0.24 },
      { notes: [67, 71, 74], t: 0.62, d: 0.22 },
      { notes: [72, 76, 79, 84], t: 0.88, d: 0.52 }
    ].forEach(step => {
      this.playChord(step.notes, {
        channel: 'sfx',
        time: now + step.t,
        type: 'triangle',
        duration: step.d,
        attack: 0.01,
        decay: 0.08,
        sustain: 0.6,
        release: 0.14,
        gain: 0.12,
        filterFreq: 3800
      });
    });
  }

  sfxGameOver() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { m: 64, t: 0.00, d: 0.20 },
      { m: 62, t: 0.22, d: 0.20 },
      { m: 60, t: 0.44, d: 0.22 },
      { m: 55, t: 0.68, d: 0.48 }
    ].forEach(s => {
      this.playVoice({
        channel: 'sfx',
        freq: this.midiToFreq(s.m),
        slideTo: s.m === 55 ? this.midiToFreq(52) : null,
        type: 'triangle',
        time: now + s.t,
        duration: s.d,
        attack: 0.015,
        decay: 0.09,
        sustain: 0.5,
        release: 0.12,
        gain: 0.14,
        filterFreq: 1800
      });
    });
  }

  // --- УПРАВЛЕНИЕ СЕКВЕНСОРОМ ---
  startMusic(mode = 'normal', bpm = 126, rootOffset = 0, songStyle = 0) {
    this.init();
    if (!this.ctx) return;
    this.musicMode = mode;
    this.bpm = bpm;
    this.rootOffset = rootOffset;
    this.songStyle = songStyle % this.songs.length;

    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.stepIndex = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.seqTimer = setInterval(() => this.scheduler(), 25);
  }

  setMusicMode(mode) {
    this.musicMode = mode;
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
    const lookahead = 0.12;
    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      this.scheduleStep(this.stepIndex, this.nextNoteTime);
      const curBpm = this.musicMode === 'boss' ? Math.max(142, this.bpm + 12) : this.bpm;
      const eighth = 60 / curBpm / 2;
      this.nextNoteTime += eighth;
      this.stepIndex = (this.stepIndex + 1) % 32;
    }
  }

  scheduleStep(step, time) {
    const isBoss = this.musicMode === 'boss';
    const track = isBoss ? this.bossSong : this.songs[this.songStyle];
    const shift = isBoss ? 0 : this.rootOffset;

    // 1. Ударные: бочка на 0, 4; снэйр на 2, 6; хэт на нечётные
    const beatInBar = step % 8;
    if (beatInBar === 0 || beatInBar === 4) this.playKick(time);
    if (beatInBar === 2 || beatInBar === 6) this.playSnare(time);
    if (step % 2 === 1) {
      this.playNoise({
        channel: 'music',
        time,
        duration: 0.03,
        gain: 0.026,
        filterType: 'highpass',
        filterFreq: 6800,
        filterEnd: 5200
      });
    }

    // 2. Полифонические аккорды (пэд)
    if (track.chords[step]) {
      this.playChord(track.chords[step].map(n => n + shift), {
        channel: 'music',
        role: 'lead',
        time,
        type: 'sine',
        duration: 0.65,
        attack: 0.04,
        decay: 0.2,
        sustain: 0.45,
        release: 0.2,
        gain: 0.048,
        filterFreq: 1650
      });
    }

    // 3. Басовая линия
    const bassMidi = track.bass[step];
    if (bassMidi > 0) {
      this.playVoice({
        channel: 'music',
        role: 'bass',
        freq: this.midiToFreq(bassMidi + shift),
        type: isBoss ? 'sawtooth' : 'triangle',
        time,
        duration: 0.16,
        attack: 0.008,
        decay: 0.06,
        sustain: 0.4,
        release: 0.05,
        gain: isBoss ? 0.07 : 0.09,
        filterFreq: isBoss ? 720 : 880
      });
    }

    // 4. Двухголосная лид-мелодия с лёгким детюном
    const leadMidi = track.lead[step];
    if (leadMidi > 0) {
      const f = this.midiToFreq(leadMidi + shift);
      this.playVoice({
        channel: 'music',
        role: 'lead',
        freq: f,
        type: isBoss ? 'square' : 'triangle',
        time,
        duration: 0.17,
        attack: 0.01,
        decay: 0.06,
        sustain: 0.5,
        release: 0.07,
        gain: isBoss ? 0.058 : 0.078,
        filterFreq: isBoss ? 2200 : 3000,
        pan: -0.15
      });
      this.playVoice({
        channel: 'music',
        role: 'lead',
        freq: f,
        detune: 7,
        type: 'sine',
        time,
        duration: 0.17,
        attack: 0.01,
        decay: 0.06,
        sustain: 0.45,
        release: 0.07,
        gain: 0.048,
        pan: 0.15
      });
    }
  }
}
