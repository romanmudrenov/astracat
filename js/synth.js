'use strict';

class AstraCatSynth {
  constructor(maxVoices = 32) {
    this.maxVoices = maxVoices;
    this.ctx = null;
    this.isInitialized = false;
    this.audioUnlocked = false;

    this.voices = Array.from({ length: maxVoices }, (_, id) => ({
      id,
      active: false,
      endTime: 0,
      stopFn: null
    }));

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.55;
    this.sfxVolume = 0.75;

    this.settings = {
      masterVolume: 0.75,
      warmthCutoff: 2500,
      spaceMix: 0.20,
      psyDrift: 0.55
    };

    this.brownNoiseBuffer = null;

    // Треки уровней (level1.mp3 — level11.mp3) для случайной ротации без повтора минимум 4 треков
    this.availableTracks = [
      'level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3',
      'level5.mp3', 'level6.mp3', 'level7.mp3', 'level8.mp3',
      'level9.mp3', 'level10.mp3', 'level11.mp3'
    ];

    // Треки боссов — включаются ТОЛЬКО при появлении босса
    this.bossTracks = ['boss.mp3', 'boss2.mp3'];

    this.selectedTrack = 'auto';
    this.recentTracks = [];
    this.currentTrackIndex = 0;

    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.preload = 'auto';

    this.currentTrackFile = '';
    this.fallbackTrackFile = null;
    this.pendingTrack = null;
    this.isPlayRequestInFlight = false;
    this.pausedByGame = false;

    // Защита от наложения одинаковых звуков в один момент времени
    this.lastScrollTickTime = 0;
    this.lastShotSoundTime = 0;
    this.lastExplosionTime = 0;
    this.lastHitTime = 0;
    this.lastPortalTime = 0;

    this.bgmAudio.addEventListener('playing', () => {
      this.isPlayRequestInFlight = false;
      this.pendingTrack = null;
      this.updateStatusHint(`▶ Играет: ${this.currentTrackFile}`);
    });

    this.bgmAudio.addEventListener('ended', () => {
      if (!this.pausedByGame && this.musicEnabled && !this.muted && this.currentTrackFile) {
        this.bgmAudio.currentTime = 0;
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    });

    this.bgmAudio.addEventListener('error', () => {
      this.isPlayRequestInFlight = false;
      this.updateStatusHint(`⚠ Ошибка файла ${this.currentTrackFile}`);
      if (this.fallbackTrackFile && this.currentTrackFile !== this.fallbackTrackFile) {
        const fb = this.fallbackTrackFile;
        this.fallbackTrackFile = null;
        this.playTrack(fb, 'level1.mp3', true);
      }
    });

    this.scanMusicFolder();
    this.setupAutoUnlock();
  }

  updateStatusHint(text) {
    const hint = document.getElementById('tracks-found-hint');
    if (hint) hint.textContent = text;
  }

  setupAutoUnlock() {
    const unlock = () => {
      this.init();

      if (this.ctx) {
        if (this.ctx.state !== 'running') {
          this.ctx.resume().catch(() => {});
        }
        if (!this.audioUnlocked && this.ctx.state === 'running') {
          try {
            const silentBuf = this.ctx.createBuffer(1, 1, 22050);
            const src = this.ctx.createBufferSource();
            src.buffer = silentBuf;
            src.connect(this.ctx.destination);
            src.start(0);
            this.audioUnlocked = true;
          } catch (_) {}
        }
      }

      if (this.pausedByGame || !this.musicEnabled || this.muted) return;
      if (this.isPlayRequestInFlight) return;

      if (this.pendingTrack) {
        const t = this.pendingTrack;
        this.pendingTrack = null;
        this.playTrack(t.file, t.fallback, false);
      } else if (this.currentTrackFile && this.bgmAudio.paused) {
        this.bgmAudio.volume = this.getEffectiveMusicVol();
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this.isPlayRequestInFlight = false;
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: this.currentTrackFile, fallback: this.fallbackTrackFile };
            this.updateStatusHint(`Нажми на экран для запуска: ${this.currentTrackFile}`);
          });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchend', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  scanMusicFolder() {
    const list = this.availableTracks;
    const sel = document.getElementById('track-select');

    if (sel) {
      const curVal = sel.value || 'auto';
      sel.innerHTML = `<option value="auto">🎲 Авто (${list.length} треков level, без повтора 4 ур.)</option>`;
      list.forEach((fname, idx) => {
        const opt = document.createElement('option');
        opt.value = fname;
        opt.textContent = `Уровень ${idx + 1} (${fname})`;
        sel.appendChild(opt);
      });
      sel.value = curVal;
    }

    this.updateStatusHint(`Меню: intro.mp3 • Уровни: level1–11.mp3 • Боссы: boss.mp3, boss2.mp3`);
  }

  _makeSoftClipCurve(amount = 1.15) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const norm = Math.tanh(amount);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = (Math.tanh(x * amount) / norm) * 0.96;
    }
    return curve;
  }

  init() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state !== 'running') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      this.ctx = new AudioCtx();
    } catch (e) {
      return;
    }

    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }

    this._createNoiseBuffers();

    this.voiceBus = this.ctx.createGain();
    this.voiceBus.gain.value = 1.25;

    // Фильтр защиты динамика телефона от инфра-баса ниже 105 Гц
    this.speakerProtectFilter = this.ctx.createBiquadFilter();
    this.speakerProtectFilter.type = 'highpass';
    this.speakerProtectFilter.frequency.value = 105;
    this.speakerProtectFilter.Q.value = 0.5;

    this.masterLowpass = this.ctx.createBiquadFilter();
    this.masterLowpass.type = 'lowpass';
    this.masterLowpass.frequency.value = this.settings.warmthCutoff;
    this.masterLowpass.Q.value = 0.5;

    // Короткое стерео-эхо только для основных эффектов
    this.delayLeft = this.ctx.createDelay(1.0);
    this.delayRight = this.ctx.createDelay(1.0);
    this.delayLeft.delayTime.value = 0.16;
    this.delayRight.delayTime.value = 0.22;

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.08;

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.value = this.settings.spaceMix * 0.14;

    this.merger = this.ctx.createChannelMerger(2);

    // Мягкий ограничитель пиков (сатуратор) без треска на высокой громкости
    this.softClipper = this.ctx.createWaveShaper();
    this.softClipper.curve = this._makeSoftClipCurve(1.15);
    this.softClipper.oversample = '2x';

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -10;
    this.compressor.knee.value = 10;
    this.compressor.ratio.value = 8;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.12;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.getEffectiveSfxVol();

    this.voiceBus.connect(this.speakerProtectFilter);
    this.speakerProtectFilter.connect(this.masterLowpass);
    this.masterLowpass.connect(this.compressor);

    this.masterLowpass.connect(this.delayLeft);
    this.masterLowpass.connect(this.delayRight);
    this.delayLeft.connect(this.delayFeedback);
    this.delayRight.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayLeft);
    this.delayLeft.connect(this.merger, 0, 0);
    this.delayRight.connect(this.merger, 0, 1);
    this.merger.connect(this.delayWetGain);
    this.delayWetGain.connect(this.compressor);

    this.compressor.connect(this.softClipper);
    this.softClipper.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  getEffectiveSfxVol() {
    if (this.muted || !this.sfxEnabled) return 0.0001;
    // Базовая внутренняя громкость эффектов уменьшена на 30% (с 2.1 до 1.47)
    return Math.max(0.0001, Math.min(1.55, this.sfxVolume * 1.47));
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
      this.delayWetGain.gain.setTargetAtTime(val * 0.14, this.ctx.currentTime, 0.04);
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
      if (this.voices[i].active && now < this.voices[i].endTime) count++;
      else this.voices[i].active = false;
    }
    return count;
  }

  sfxScrollTick() {
    const nowMs = performance.now();
    if (nowMs - this.lastScrollTickTime < 55) return;
    this.lastScrollTickTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    if (navigator.vibrate) { try { navigator.vibrate(4); } catch (_) {} }

    const now = this.ctx.currentTime;
    const dur = 0.032;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.005);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playSoftBullet(pitchMultiplier = 1.0) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.12;
    const baseFreq = 390 * pitchMultiplier * (0.96 + Math.random() * 0.08);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.35, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(150, baseFreq * 0.48), now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.01);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  // Мягкий, сухой звук для пролёта пуль через зеркальные порталы (полностью БЕЗ реверба и гула)
  playPortalPass() {
    const nowMs = performance.now();
    if (nowMs - this.lastPortalTime < 115) return;
    this.lastPortalTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const dur = 0.095;
    const startFreq = 350 + Math.random() * 45;

    const osc = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.42, now + dur);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(950, now);
    lp.Q.value = 0.4;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.compressor);

    osc.start(now);
    osc.stop(now + dur + 0.01);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playWarmLaser() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.18;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playPlushRocket() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.28;

    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(185, now);
    sub.frequency.exponentialRampToValueAtTime(260, now + dur * 0.55);
    sub.frequency.exponentialRampToValueAtTime(150, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(gain);
    gain.connect(this.voiceBus);
    sub.start(now);
    sub.stop(now + dur + 0.02);
    this.allocateVoice(dur, () => { try { sub.stop(); } catch (_) {} });
  }

  playNebulaExplosion() {
    const nowMs = performance.now();
    if (nowMs - this.lastExplosionTime < 75) return;
    this.lastExplosionTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.42;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(195, now);
    sub.frequency.exponentialRampToValueAtTime(115, now + dur * 0.8);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.34, now + 0.015);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(640, now);
    lp.frequency.exponentialRampToValueAtTime(180, now + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.30, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(subGain); subGain.connect(this.voiceBus);
    noise.connect(lp); lp.connect(noiseGain); noiseGain.connect(this.voiceBus);

    sub.start(now); noise.start(now, Math.random());
    sub.stop(now + dur); noise.stop(now + dur);
    this.allocateVoice(dur, () => { try { sub.stop(); noise.stop(); } catch (_) {} });
  }

  playStarCollect() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const scale = [587.33, 659.25, 783.99, 880.00, 1046.50];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    const dur = 0.36;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + dur * 0.4);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playCosmicMeow() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.34;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(360, now + dur);

    const softFilter = this.ctx.createBiquadFilter();
    softFilter.type = 'lowpass';
    softFilter.Q.value = 0.5;
    softFilter.frequency.setValueAtTime(900, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.30, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(softFilter);
    softFilter.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playShieldHum() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.36;
    [329.63, 392.00, 523.25].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain);
      gain.connect(this.voiceBus);
      osc.start(now);
      osc.stop(now + dur);
      this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
    });
  }

  playPurrBoost() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.30;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + dur * 0.7);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  sfxMenuTap() { this.playSoftBullet(1.15); }
  sfxMenuSelect() { this.playStarCollect(); }
  sfxMenuTransition() { this.playPurrBoost(); }
  sfxBuyItem() { this.playCosmicMeow(); setTimeout(() => this.playStarCollect(), 120); }

  sfxShootWeapon(pan = 0, baseWeapon = 'droplet') {
    const nowMs = performance.now();
    if (nowMs - this.lastShotSoundTime < 100) return;
    this.lastShotSoundTime = nowMs;

    if (baseWeapon === 'droplet' || baseWeapon === 'double_shot') this.playSoftBullet(1.02);
    else if (baseWeapon === 'rocket_launcher') this.playPlushRocket();
    else this.playWarmLaser();
  }

  sfxHit() {
    const nowMs = performance.now();
    if (nowMs - this.lastHitTime < 65) return;
    this.lastHitTime = nowMs;
    this.playSoftBullet(0.85);
  }

  sfxExplosion() { this.playNebulaExplosion(); }

  sfxBossExplosion() {
    this.playNebulaExplosion();
    if (this.muted || !this.sfxEnabled) return;
    try {
      const customBoom = new Audio('music/boss_explode.mp3');
      customBoom.volume = Math.max(0, Math.min(1, this.sfxVolume * 0.7));
      customBoom.play().catch(() => {});
    } catch (e) {}
  }

  sfxIgnite() { this.playPlushRocket(); }
  // Используется при пролёте пуль через порталы 1-го уровня: мягкий, сухой, без реверба
  sfxGravity() { this.playPortalPass(); }
  sfxDisintegrate() { this.playSoftBullet(1.18); }
  sfxUnderwater() { this.playSoftBullet(0.95); }
  sfxCosmicHum() { this.playPurrBoost(); }
  sfxSticky() { this.playSoftBullet(0.8); }
  sfxWave() { this.playWarmLaser(); }
  sfxPowerup() { this.playStarCollect(); }
  sfxShieldBlock() { this.playShieldHum(); }
  sfxHurt() { this.playWarmLaser(); }
  sfxBossAlarm() { this.playShieldHum(); }
  sfxVictory() { this.playCosmicMeow(); setTimeout(() => this.playStarCollect(), 180); }
  sfxGameOver() { this.playNebulaExplosion(); }

  pickNextTrack() {
    if (this.selectedTrack && this.selectedTrack !== 'auto') return this.selectedTrack;
    const candidates = this.availableTracks.filter(t => !this.recentTracks.includes(t));
    const pool = candidates.length > 0 ? candidates : this.availableTracks;
    if (pool.length === 0) return 'level1.mp3';

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.currentTrackIndex = Math.max(0, this.availableTracks.indexOf(chosen));
    this.recentTracks.push(chosen);
    if (this.recentTracks.length > 4) this.recentTracks.shift();
    return chosen;
  }

  nextTrack() {
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.availableTracks.length;
    const fname = this.availableTracks[this.currentTrackIndex];
    this.playTrack(fname, 'level1.mp3', true);
    const sel = document.getElementById('track-select');
    if (sel) sel.value = fname;
  }

  prevTrack() {
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.availableTracks.length) % this.availableTracks.length;
    const fname = this.availableTracks[this.currentTrackIndex];
    this.playTrack(fname, 'level1.mp3', true);
    const sel = document.getElementById('track-select');
    if (sel) sel.value = fname;
  }

  getEffectiveMusicVol() {
    if (this.muted || !this.musicEnabled || this.pausedByGame) return 0;
    return Math.max(0, Math.min(1, this.musicVolume));
  }

  playTrack(filename, fallbackTrack = null, forceRestart = false) {
    this.pausedByGame = false;
    if (!filename) return;

    const path = `music/${filename}`;

    if (!forceRestart && this.currentTrackFile === filename) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
      if (this.bgmAudio.paused && this.musicEnabled && !this.muted && !this.isPlayRequestInFlight) {
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this.isPlayRequestInFlight = false;
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: filename, fallback: fallbackTrack };
            this.updateStatusHint(`Нажми на экран для запуска: ${filename}`);
          });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
      return;
    }

    this.currentTrackFile = filename;
    this.fallbackTrackFile = fallbackTrack;
    this.pendingTrack = null;

    try {
      this.bgmAudio.pause();
      this.bgmAudio.src = path;
      this.bgmAudio.load();
      this.bgmAudio.volume = this.getEffectiveMusicVol();

      if (this.musicEnabled && !this.muted) {
        this.isPlayRequestInFlight = true;
        const playPromise = this.bgmAudio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            this.isPlayRequestInFlight = false;
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: filename, fallback: fallbackTrack };
            this.updateStatusHint(`Нажми на экран для запуска: ${filename}`);
          });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
    } catch (e) {
      this.isPlayRequestInFlight = false;
    }
  }

  pauseMusic() {
    this.pausedByGame = true;
    this.isPlayRequestInFlight = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.volume = 0;
        this.bgmAudio.pause();
      } catch (e) {}
    }
  }

  resumeMusic() {
    this.pausedByGame = false;
    if (this.bgmAudio && this.musicEnabled && !this.muted && this.currentTrackFile) {
      try {
        this.bgmAudio.volume = this.getEffectiveMusicVol();
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => { this.isPlayRequestInFlight = false; })
           .catch(() => { this.isPlayRequestInFlight = false; });
        } else {
          this.isPlayRequestInFlight = false;
        }
      } catch (e) {
        this.isPlayRequestInFlight = false;
      }
    }
  }

  startIntroMusic() {
    this.playTrack('intro.mp3', 'level1.mp3', false);
  }

  startMusic(mode = 'normal', levelId = 1) {
    if (mode === 'intro') {
      this.startIntroMusic();
      return;
    }
    if (mode === 'boss') {
      const bossFile = this.bossTracks[(levelId - 1) % this.bossTracks.length] || 'boss.mp3';
      this.playTrack(bossFile, 'boss.mp3', true);
      return;
    }
    this.playTrack(this.pickNextTrack(), 'level1.mp3', true);
  }

  setMusicMode(mode, levelId = 1) {
    if (mode === 'boss') this.startMusic('boss', levelId);
  }

  stopMusic() {
    this.isPlayRequestInFlight = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {}
    }
    this.currentTrackFile = '';
  }

  updateMusicVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
      if (this.bgmAudio.paused && this.musicEnabled && !this.muted && !this.pausedByGame && this.currentTrackFile && !this.isPlayRequestInFlight) {
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => { this.isPlayRequestInFlight = false; })
           .catch(() => { this.isPlayRequestInFlight = false; });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    this.updateSfxVolume();
    this.updateMusicVolume();
    return this.muted;
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
      brownData[i] = Math.max(-0.85, Math.min(0.85, brownData[i] * 0.95));
    }
  }
}

const PolySynth = AstraCatSynth;
