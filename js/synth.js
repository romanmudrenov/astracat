'use strict';

/**
 * ============================================================================
 * AstraCatSynth — 128-Voice Polyphonic Cozy Cosmic ASMR Synthesizer
 * Полная интеграция в игру AstraCat + MP3-плеер уровней/боссов + звуки меню
 * ============================================================================
 */
class AstraCatSynth {
  constructor(maxVoices = 128) {
    this.maxVoices = maxVoices;
    this.ctx = null;
    this.isInitialized = false;

    // Пул 128 полифонических голосов
    this.voices = Array.from({ length: maxVoices }, (_, id) => ({
      id,
      active: false,
      endTime: 0,
      stopFn: null
    }));

    // Базовые ASMR-показатели (по умолчанию: Музыка 60%, Эффекты 40%, LPF 2400 Hz, Эхо 42%, Дрейф 55%)
    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.60;
    this.sfxVolume = 0.40;

    this.settings = {
      masterVolume: 0.40,
      warmthCutoff: 2400,
      spaceMix: 0.42,
      psyDrift: 0.55
    };

    // Состояние генеративного космического эмбиента
    this.ambientPlaying = false;
    this.ambientTimer = null;
    this.ambientStep = 0;

    this.brownNoiseBuffer = null;

    // MP3-плеер уровней и боссов
    this.availableTracks = ['level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3'];
    this.bossTracks = ['boss.mp3'];
    this.selectedTrack = 'auto';
    this.recentTracks = [];
    this.currentTrackIndex = 0;
    this.bgmAudio = null;
    this.currentTrackPath = '';
    this.pendingTrack = null;
    this.pausedByGame = false;

    this.scanMusicFolder();
    this.setupAutoUnlock();
  }

  setupAutoUnlock() {
    const unlock = () => {
      this.init();
      if (this.pausedByGame) return;
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
        hint.textContent = `Уровней: ${list.length} • Боссов: ${this.bossTracks.length} • Взрыв: boss_explode.mp3`;
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
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this._createNoiseBuffers();

    // Мастер-цепь 128-Voice Cozy Cosmic ASMR Synth:
    // VoiceBus -> MasterLowpass -> VelvetShelf -> WarmShaper -> Stereo Delay -> Compressor -> MasterGain
    this.voiceBus = this.ctx.createGain();
    this.voiceBus.gain.value = 0.85;

    this.masterLowpass = this.ctx.createBiquadFilter();
    this.masterLowpass.type = 'lowpass';
    this.masterLowpass.frequency.value = this.settings.warmthCutoff;
    this.masterLowpass.Q.value = 0.65;

    this.velvetShelf = this.ctx.createBiquadFilter();
    this.velvetShelf.type = 'highshelf';
    this.velvetShelf.frequency.value = 1600;
    this.velvetShelf.gain.value = -4.5;

    this.warmShaper = this.ctx.createWaveShaper();
    this.warmShaper.curve = this._makeSoftWarmCurve(18);
    this.warmShaper.oversample = '2x';

    // Стерео космическое эхо
    this.delayLeft = this.ctx.createDelay(1.5);
    this.delayRight = this.ctx.createDelay(1.5);
    this.delayLeft.delayTime.value = 0.34;
    this.delayRight.delayTime.value = 0.47;

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.36;

    this.delayFilter = this.ctx.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.value = 1450;

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.value = this.settings.spaceMix * 0.55;

    this.merger = this.ctx.createChannelMerger(2);

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -16;
    this.compressor.knee.value = 18;
    this.compressor.ratio.value = 6;
    this.compressor.attack.value = 0.012;
    this.compressor.release.value = 0.22;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.getEffectiveSfxVol();

    this.voiceBus.connect(this.masterLowpass);
    this.masterLowpass.connect(this.velvetShelf);
    this.velvetShelf.connect(this.warmShaper);
    this.warmShaper.connect(this.compressor);

    this.warmShaper.connect(this.delayFilter);
    this.delayFilter.connect(this.delayLeft);
    this.delayFilter.connect(this.delayRight);
    this.delayLeft.connect(this.delayFeedback);
    this.delayRight.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayFilter);
    this.delayLeft.connect(this.merger, 0, 0);
    this.delayRight.connect(this.merger, 0, 1);
    this.merger.connect(this.delayWetGain);
    this.delayWetGain.connect(this.compressor);

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  getEffectiveSfxVol() {
    if (this.muted || !this.sfxEnabled) return 0.0001;
    return Math.max(0.0001, Math.min(1.5, this.sfxVolume));
  }

  updateSfxVolume() {
    this.settings.masterVolume = this.sfxVolume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.getEffectiveSfxVol(), this.ctx.currentTime, 0.03);
    }
  }

  setMasterVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    this.updateSfxVolume();
  }

  setWarmthCutoff(hz) {
    this.settings.warmthCutoff = hz;
    if (this.masterLowpass && this.ctx) {
      this.masterLowpass.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.04);
    }
  }

  setSpaceMix(val) {
    this.settings.spaceMix = val;
    if (this.delayWetGain && this.ctx) {
      this.delayWetGain.gain.setTargetAtTime(val * 0.55, this.ctx.currentTime, 0.04);
    }
  }

  setPsyDrift(val) {
    this.settings.psyDrift = val;
  }

  allocateVoice(durationSec, stopCallback = null) {
    this.init();
    if (!this.ctx) return null;
    const now = this.ctx.currentTime;

    for (let i = 0; i < this.maxVoices; i++) {
      if (this.voices[i].active && now >= this.voices[i].endTime) {
        this.voices[i].active = false;
        this.voices[i].stopFn = null;
      }
    }

    let chosen = this.voices.find(v => !v.active);
    if (!chosen) {
      chosen = this.voices.reduce((oldest, v) => (v.endTime < oldest.endTime ? v : oldest), this.voices[0]);
      if (chosen.stopFn) {
        try { chosen.stopFn(); } catch (_) {}
      }
    }

    chosen.active = true;
    chosen.endTime = now + durationSec;
    chosen.stopFn = stopCallback;
    return chosen;
  }

  getActiveVoiceCount() {
    if (!this.ctx) return 0;
    const now = this.ctx.currentTime;
    let count = 0;
    for (let i = 0; i < this.maxVoices; i++) {
      if (this.voices[i].active && now < this.voices[i].endTime) {
        count++;
      } else {
        this.voices[i].active = false;
      }
    }
    return count;
  }

  // ============================================================================
  // ОРИГИНАЛЬНЫЕ ТЁПЛЫЕ ЗВУКИ ТВОЕГО 128-VOICE ASMR СИНТЕЗАТОРА
  // ============================================================================

  // 1. Мягкая пулька (пузырёк + бархатный выдох коричневого шума)
  playSoftBullet(pitchMultiplier = 1.0, panVal = null) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.16;

    const randDetune = 0.95 + Math.random() * 0.10;
    const drift = 1 + (Math.random() - 0.5) * 0.08 * this.settings.psyDrift;
    const baseFreq = 260 * pitchMultiplier * randDetune * drift;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this._createPanner(panVal !== null ? panVal : (Math.random() - 0.5) * 0.35);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.45, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(55, baseFreq * 0.42), now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.setValueAtTime(620, now);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.0001, now);
    nGain.gain.linearRampToValueAtTime(0.06, now + 0.008);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(panner);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(panner);
    panner.connect(this.voiceBus);

    osc.start(now);
    osc.stop(now + dur + 0.01);
    noise.start(now, Math.random() * 1.2, 0.08);

    this.allocateVoice(dur, () => {
      try { osc.stop(); noise.stop(); } catch (_) {}
    });
  }

  // 2. Тёплый лазер («вуу-оом» без писка)
  playWarmLaser(panVal = null) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.46;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const panner = this._createPanner(panVal !== null ? panVal : (Math.random() - 0.5) * 0.5);

    osc1.type = 'triangle';
    osc2.type = 'sine';

    const startFreq = 440 + Math.random() * 45;
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(115, now + dur);

    osc2.frequency.setValueAtTime(startFreq * 0.5, now);
    osc2.frequency.exponentialRampToValueAtTime(58, now + dur);

    lfo.type = 'sine';
    lfo.frequency.value = 7.5;
    lfoGain.gain.value = 18 * this.settings.psyDrift;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    filter.type = 'lowpass';
    filter.Q.value = 3.2;
    filter.frequency.setValueAtTime(980, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.voiceBus);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    osc1.stop(now + dur + 0.02);
    osc2.stop(now + dur + 0.02);
    lfo.stop(now + dur + 0.02);

    this.allocateVoice(dur, () => {
      try { osc1.stop(); osc2.stop(); lfo.stop(); } catch (_) {}
    });
  }

  // 3. Плюшевая ракета (глубокий воздушный поток + саб-бас)
  playPlushRocket() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.85;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(520, now + dur * 0.65);
    filter.frequency.exponentialRampToValueAtTime(190, now + dur);

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(68, now);
    sub.frequency.exponentialRampToValueAtTime(135, now + dur * 0.7);
    sub.frequency.exponentialRampToValueAtTime(75, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    sub.connect(gain);
    gain.connect(this.voiceBus);

    noise.start(now, Math.random());
    sub.start(now);
    noise.stop(now + dur + 0.02);
    sub.stop(now + dur + 0.02);

    this.allocateVoice(dur, () => {
      try { noise.stop(); sub.stop(); } catch (_) {}
    });
  }

  // 4. Взрыв в туманности («бууум-шшш»)
  playNebulaExplosion() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 1.1;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(115, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + dur * 0.75);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.36, now + 0.025);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    noise.loop = true;

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 1.1;
    lp.frequency.setValueAtTime(680, now);
    lp.frequency.exponentialRampToValueAtTime(110, now + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.32, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(subGain);
    subGain.connect(this.voiceBus);

    noise.connect(lp);
    lp.connect(noiseGain);
    noiseGain.connect(this.voiceBus);

    sub.start(now);
    noise.start(now, Math.random());
    sub.stop(now + dur);
    noise.stop(now + dur);

    this.allocateVoice(dur, () => {
      try { sub.stop(); noise.stop(); } catch (_) {}
    });
  }

  // 5. Сбор звёздочки / выбора в меню (Rhodes Maj9 перезвон)
  playStarCollect() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const scale = [523.25, 587.33, 659.25, 783.99, 987.77, 1046.50];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    const dur = 0.75;

    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const harmGain = this.ctx.createGain();
    const panner = this._createPanner((Math.random() - 0.5) * 0.6);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2, now);

    harmGain.gain.setValueAtTime(0.04, now);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    harmonic.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(panner);
    panner.connect(this.voiceBus);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + dur);
    harmonic.stop(now + 0.2);

    this.allocateVoice(dur, () => {
      try { osc.stop(); harmonic.stop(); } catch (_) {}
    });
  }

  // 6. Космический «Мрр-мяу»
  playCosmicMeow() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.62;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(490, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(340, now + dur);

    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = 3.6;
    formant.frequency.setValueAtTime(520, now);
    formant.frequency.exponentialRampToValueAtTime(1050, now + 0.22);
    formant.frequency.exponentialRampToValueAtTime(620, now + dur);

    const purrLfo = this.ctx.createOscillator();
    const purrDepth = this.ctx.createGain();
    purrLfo.frequency.value = 26;
    purrDepth.gain.setValueAtTime(22, now);
    purrDepth.gain.exponentialRampToValueAtTime(1, now + 0.25);
    purrLfo.connect(purrDepth);
    purrDepth.connect(osc.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(formant);
    formant.connect(gain);
    gain.connect(this.voiceBus);

    osc.start(now);
    purrLfo.start(now);
    osc.stop(now + dur);
    purrLfo.stop(now + dur);

    this.allocateVoice(dur, () => {
      try { osc.stop(); purrLfo.stop(); } catch (_) {}
    });
  }

  // 7. Пузырь-Щит (Swell аккорд Fmaj9)
  playShieldHum() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 1.4;
    const chord = [174.61, 220.00, 261.63, 329.63, 392.00];

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this._createPanner((idx - 2) * 0.25);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.99, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.01, now + dur);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.voiceBus);

      osc.start(now);
      osc.stop(now + dur);

      this.allocateVoice(dur, () => {
        try { osc.stop(); } catch (_) {}
      });
    });
  }

  // 8. Мурчание двигателя (~26 Гц)
  playPurrBoost() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.7;

    const carrier = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(92, now);
    carrier.frequency.linearRampToValueAtTime(112, now + dur * 0.5);
    carrier.frequency.linearRampToValueAtTime(86, now + dur);

    mod.type = 'sine';
    mod.frequency.value = 26;
    modGain.gain.value = 28;

    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    carrier.connect(gain);
    gain.connect(this.voiceBus);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + dur);
    mod.stop(now + dur);

    this.allocateVoice(dur, () => {
      try { carrier.stop(); mod.stop(); } catch (_) {}
    });
  }

  // Генеративный ASMR-эмбиент
  toggleAmbient() {
    this.init();
    if (this.ambientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (this.ambientPlaying) return;
    this.init();
    this.ambientPlaying = true;
    this.ambientStep = 0;

    const progression = [
      [130.81, 196.00, 246.94, 293.66, 329.63],
      [110.00, 164.81, 220.00, 246.94, 329.63],
      [87.31,  174.61, 220.00, 261.63, 329.63],
      [82.41,  164.81, 196.00, 246.94, 293.66]
    ];

    const playChordStep = () => {
      if (!this.ambientPlaying || !this.ctx) return;
      const chord = progression[this.ambientStep % progression.length];
      const now = this.ctx.currentTime;
      const chordDur = 4.6;

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoDepth = this.ctx.createGain();
        const gain = this.ctx.createGain();
        const panner = this._createPanner((i % 2 === 0 ? -1 : 1) * 0.35);

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        lfo.type = 'sine';
        lfo.frequency.value = 0.25 + i * 0.07;
        lfoDepth.gain.value = (freq * 0.008) * this.settings.psyDrift;
        lfo.connect(lfoDepth);
        lfoDepth.connect(osc.frequency);

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = i === 0 ? 320 : 780;

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.09 : 0.045, now + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDur);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(panner);
        panner.connect(this.voiceBus);

        osc.start(now);
        lfo.start(now);
        osc.stop(now + chordDur);
        lfo.stop(now + chordDur);

        this.allocateVoice(chordDur, () => {
          try { osc.stop(); lfo.stop(); } catch (_) {}
        });
      });

      if (Math.random() > 0.3) {
        setTimeout(() => {
          if (this.ambientPlaying) this.playStarCollect();
        }, 1400 + Math.random() * 1200);
      }

      this.ambientStep++;
      this.ambientTimer = setTimeout(playChordStep, 3800);
    };

    playChordStep();
  }

  stopAmbient() {
    this.ambientPlaying = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  // ============================================================================
  // ЗВУКИ ВСЕХ ДЕЙСТВИЙ В МЕНЮ (НАЖАТИЯ, ВЫБОР, ПЕРЕХОДЫ, ПОКУПКИ В АНГАРЕ)
  // ============================================================================
  sfxMenuTap() {
    this.playSoftBullet(1.18, 0);
  }

  sfxMenuSelect() {
    this.playStarCollect();
  }

  sfxMenuTransition() {
    this.playPurrBoost();
  }

  sfxBuyItem() {
    this.playCosmicMeow();
    setTimeout(() => this.playStarCollect(), 120);
  }

  // ============================================================================
  // ИГРОВЫЕ МОСТЫ (ДЛЯ ОРУЖИЯ, ВЗРЫВОВ, ЩИТА И АНОМАЛИЙ)
  // ============================================================================
  sfxShootWeapon(pan = 0, baseWeapon = 'droplet', secondary = 'none') {
    if (baseWeapon === 'droplet') {
      this.playSoftBullet(1.0, pan);
    } else if (baseWeapon === 'kalimba') {
      this.playSoftBullet(1.15, pan);
    } else if (baseWeapon === 'silk_spread') {
      this.playSoftBullet(0.88, pan);
    } else if (baseWeapon === 'prism_beam') {
      this.playWarmLaser(pan);
    } else {
      // 5-е оружие (Сверхновая Пушка)
      this.playPlushRocket();
    }

    if (secondary === 'fractal_shuriken') {
      this.playSoftBullet(1.3, -pan * 0.5);
    } else if (secondary === 'electric_shock') {
      this.playWarmLaser(-pan * 0.5);
    } else if (secondary === 'wave_cannon') {
      this.playPlushRocket();
    }
  }

  sfxHit(pan = 0) {
    this.playSoftBullet(0.76, pan);
  }

  sfxExplosion(pan = 0, big = false) {
    this.playNebulaExplosion();
    if (big) {
      setTimeout(() => this.playPlushRocket(), 80);
    }
  }

  // Отдельный звук взрыва босса (подхватывает твой файл music/boss_explode.mp3 + даёт ASMR-бас)
  sfxBossExplosion() {
    this.playNebulaExplosion();
    if (this.muted || !this.sfxEnabled) return;
    try {
      const customBoom = new Audio('music/boss_explode.mp3');
      customBoom.volume = Math.max(0, Math.min(1, this.sfxVolume * 1.25));
      customBoom.play().catch(() => {});
    } catch (e) {}
  }

  sfxIgnite() {
    this.playPlushRocket();
  }

  sfxGravity() {
    this.playShieldHum();
  }

  sfxDisintegrate(pan = 0) {
    this.playSoftBullet(1.25, pan);
  }

  sfxUnderwater() {
    this.playSoftBullet(0.92, 0);
  }

  sfxCosmicHum() {
    this.playPurrBoost();
  }

  sfxSticky() {
    this.playSoftBullet(0.7, 0);
  }

  sfxWave() {
    this.playWarmLaser(0);
  }

  sfxPowerup() {
    this.playStarCollect();
    this.playCosmicMeow();
  }

  sfxShieldBlock() {
    this.playShieldHum();
  }

  sfxHurt() {
    this.playWarmLaser(0);
  }

  sfxBossAlarm() {
    this.playShieldHum();
    setTimeout(() => this.playPurrBoost(), 220);
  }

  sfxVictory() {
    this.playCosmicMeow();
    setTimeout(() => this.playStarCollect(), 180);
    setTimeout(() => this.playShieldHum(), 360);
  }

  sfxGameOver() {
    this.playNebulaExplosion();
  }

  // ============================================================================
  // УПРАВЛЕНИЕ ФОНОВОЙ МУЗЫКОЙ MP3 И ПАУЗОЙ
  // ============================================================================
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
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.availableTracks.length;
    const fname = this.availableTracks[this.currentTrackIndex];
    this.playTrack(fname);
    const sel = document.getElementById('track-select');
    if (sel) sel.value = fname;
  }

  prevTrack() {
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
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
    this.pausedByGame = false;
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

  pauseMusic() {
    this.pausedByGame = true;
    if (this.bgmAudio && !this.bgmAudio.paused) {
      try { this.bgmAudio.pause(); } catch (e) {}
    }
  }

  resumeMusic() {
    this.pausedByGame = false;
    if (this.bgmAudio && this.bgmAudio.paused && this.musicEnabled && !this.muted) {
      try { this.bgmAudio.play().catch(() => {}); } catch (e) {}
    }
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
    this.updateSfxVolume();
    this.updateMusicVolume();
    return this.muted;
  }

  _createPanner(panVal) {
    if (this.ctx && this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, panVal));
      return p;
    }
    return this.ctx.createGain();
  }

  _createNoiseBuffers() {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2;
    this.brownNoiseBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const brownData = this.brownNoiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      brownData[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = brownData[i];
      brownData[i] *= 3.2;
    }
  }

  _makeSoftWarmCurve(amount) {
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = Math.tanh(x * (1 + amount * 0.04));
    }
    return curve;
  }
}

// Для обратной совместимости экспортируем и как PolySynth
const PolySynth = AstraCatSynth;
