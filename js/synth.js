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
    this.sfxVolume = 0.70;

    this.settings = {
      masterVolume: 0.70,
      warmthCutoff: 2400,
      spaceMix: 0.38,
      psyDrift: 0.55
    };

    this.brownNoiseBuffer = null;

    // Строго треки уровней (level1.mp3 — level11.mp3) для случайной ротации без повтора 4 треков
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
    this.pausedByGame = false;
    this.lastScrollTickTime = 0;
    this.lastShotSoundTime = 0;

    this.bgmAudio.addEventListener('playing', () => {
      this.updateStatusHint(`▶ Играет: ${this.currentTrackFile}`);
    });

    this.bgmAudio.addEventListener('error', () => {
      this.updateStatusHint(`⚠ Ошибка загрузки ${this.currentTrackFile}`);
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

      if (this.pausedByGame) return;

      if (this.pendingTrack) {
        const t = this.pendingTrack;
        this.pendingTrack = null;
        this.playTrack(t.file, t.fallback, true);
      } else if (this.currentTrackFile && this.bgmAudio.paused && this.musicEnabled && !this.muted) {
        this.bgmAudio.volume = this.getEffectiveMusicVol();
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    };

    window.addEventListener('touchend', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
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

    this.updateStatusHint(`Уровни: level1–11.mp3 • Боссы: boss.mp3, boss2.mp3`);
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
    this.voiceBus.gain.value = 1.0;

    this.masterLowpass = this.ctx.createBiquadFilter();
    this.masterLowpass.type = 'lowpass';
    this.masterLowpass.frequency.value = this.settings.warmthCutoff;
    this.masterLowpass.Q.value = 0.55;

    this.delayLeft = this.ctx.createDelay(1.0);
    this.delayRight = this.ctx.createDelay(1.0);
    this.delayLeft.delayTime.value = 0.28;
    this.delayRight.delayTime.value = 0.39;

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.24;

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.value = this.settings.spaceMix * 0.35;

    this.merger = this.ctx.createChannelMerger(2);

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 10;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.15;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.getEffectiveSfxVol();

    this.voiceBus.connect(this.masterLowpass);
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

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  getEffectiveSfxVol() {
    if (this.muted || !this.sfxEnabled) return 0.0001;
    return Math.max(0.0001, Math.min(1.5, this.sfxVolume * 1.45));
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
      this.delayWetGain.gain.setTargetAtTime(val * 0.35, this.ctx.currentTime, 0.04);
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
    const dur = 0.04;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.005);
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
    const dur = 0.15;
    const baseFreq = 540 * pitchMultiplier * (0.96 + Math.random() * 0.08);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.45, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(160, baseFreq * 0.45), now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.01);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playWarmLaser() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.30;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playPlushRocket() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.42;

    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(220, now);
    sub.frequency.exponentialRampToValueAtTime(380, now + dur * 0.55);
    sub.frequency.exponentialRampToValueAtTime(150, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(gain);
    gain.connect(this.voiceBus);
    sub.start(now);
    sub.stop(now + dur + 0.02);
    this.allocateVoice(dur, () => { try { sub.stop(); } catch (_) {} });
  }

  playNebulaExplosion() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.62;

    const sub = this.ctx.createOscillator();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(210, now);
    sub.frequency.exponentialRampToValueAtTime(55, now + dur * 0.75);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.34, now + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(980, now);
    lp.frequency.exponentialRampToValueAtTime(160, now + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.32, now + 0.025);
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
    const dur = 0.48;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + dur * 0.4);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playCosmicMeow() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.54;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(380, now + dur);

    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = 3.0;
    formant.frequency.setValueAtTime(640, now);
    formant.frequency.exponentialRampToValueAtTime(1120, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(formant); formant.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playShieldHum() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.85;
    [261.63, 329.63, 392.00].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain); gain.connect(this.voiceBus);
      osc.start(now); osc.stop(now + dur);
      this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
    });
  }

  playPurrBoost() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.45;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + dur * 0.7);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  sfxMenuTap() { this.playSoftBullet(1.18); }
  sfxMenuSelect() { this.playStarCollect(); }
  sfxMenuTransition() { this.playPurrBoost(); }
  sfxBuyItem() { this.playCosmicMeow(); setTimeout(() => this.playStarCollect(), 120); }

  sfxShootWeapon(pan = 0, baseWeapon = 'droplet') {
    const nowMs = performance.now();
    if (nowMs - this.lastShotSoundTime < 90) return;
    this.lastShotSoundTime = nowMs;

    if (baseWeapon === 'droplet' || baseWeapon === 'double_shot') this.playSoftBullet(1.05);
    else if (baseWeapon === 'rocket_launcher') this.playPlushRocket();
    else this.playWarmLaser();
  }

  sfxHit() { this.playSoftBullet(0.85); }
  sfxExplosion() { this.playNebulaExplosion(); }

  sfxBossExplosion() {
    this.playNebulaExplosion();
    if (this.muted || !this.sfxEnabled) return;
    try {
      const customBoom = new Audio('music/boss_explode.mp3');
      customBoom.volume = Math.max(0, Math.min(1, this.sfxVolume * 1.3));
      customBoom.play().catch(() => {});
    } catch (e) {}
  }

  sfxIgnite() { this.playPlushRocket(); }
  sfxGravity() { this.playShieldHum(); }
  sfxDisintegrate() { this.playSoftBullet(1.22); }
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
    // Выбираем только из треков level*.mp3, исключая последние 4 проигранных
    const candidates = this.availableTracks.filter(t => !this.recentTracks.includes(t));
    const pool = candidates.length > 0 ? candidates : this.availableTracks;
    if (pool.length === 0) return 'level1.mp3';

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.currentTrackIndex = Math.max(0, this.availableTracks.indexOf(chosen));
    this.recentTracks.push(chosen);
    // Минимум 4 трека не повторяются подряд
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
      if (this.bgmAudio.paused && this.musicEnabled && !this.muted) {
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            this.pendingTrack = { file: filename, fallback: fallbackTrack };
            this.updateStatusHint(`Нажми на экран для запуска: ${filename}`);
          });
        }
      }
      return;
    }

    this.currentTrackFile = filename;
    this.fallbackTrackFile = fallbackTrack;

    try {
      this.bgmAudio.pause();
      this.bgmAudio.src = path;
      this.bgmAudio.load();
      this.bgmAudio.volume = this.getEffectiveMusicVol();

      const playPromise = this.bgmAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          this.pendingTrack = { file: filename, fallback: fallbackTrack };
          this.updateStatusHint(`Нажми на экран для запуска: ${filename}`);
        });
      }
    } catch (e) {}
  }

  pauseMusic() {
    this.pausedByGame = true;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.volume = 0;
        this.bgmAudio.pause();
      } catch (e) {}
    }
  }

  resumeMusic() {
    this.pausedByGame = false;
    if (this.bgmAudio && this.musicEnabled && !this.muted) {
      try {
        this.bgmAudio.volume = this.getEffectiveMusicVol();
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) {}
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
      // Треки боссов играют ТОЛЬКО при выходе босса
      const bossFile = this.bossTracks[(levelId - 1) % this.bossTracks.length] || 'boss.mp3';
      this.playTrack(bossFile, 'boss.mp3', true);
      return;
    }
    // В обычном полёте по уровню — только случайные level1..11.mp3 без повторов 4 трека
    this.playTrack(this.pickNextTrack(), 'level1.mp3', true);
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
    }
    this.currentTrackFile = '';
  }

  updateMusicVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
      if (this.bgmAudio.paused && this.musicEnabled && !this.muted && !this.pausedByGame && this.currentTrackFile) {
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
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
      brownData[i] *= 2.8;
    }
  }
}

const PolySynth = AstraCatSynth;
