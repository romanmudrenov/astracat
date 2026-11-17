'use strict';

class AstraCatSynth {
  constructor(maxVoices = 32) {
    this.maxVoices = maxVoices;
    this.ctx = null;
    this.isInitialized = false;

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
    // Базовая громкость ASMR-эффектов увеличена на +30% (с 0.40 до 0.70)
    this.sfxVolume = 0.70;

    this.settings = {
      masterVolume: 0.70,
      warmthCutoff: 2400,
      spaceMix: 0.38,
      psyDrift: 0.55
    };

    this.brownNoiseBuffer = null;
    this.availableTracks = ['level1.mp3', 'level2.mp3', 'level3.mp3', 'level4.mp3'];
    this.bossTracks = ['boss.mp3'];
    this.selectedTrack = 'auto';
    this.recentTracks = [];
    this.currentTrackIndex = 0;
    this.bgmAudio = null;
    this.currentTrackPath = '';
    this.pendingTrack = null;
    this.pausedByGame = false;
    this.lastScrollTickTime = 0;
    this.lastShotSoundTime = 0;

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
        this.bgmAudio.volume = this.getEffectiveMusicVol();
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
      levelCandidates.push(`level${i}.mp3`, `track${i}.mp3`, `${i}.mp3`);
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
        .finally(() => { pending--; if (pending <= 0) refreshSelectUI(); });
    });

    bossCandidates.forEach(fname => {
      fetch(`music/${fname}`, { method: 'HEAD' })
        .then(res => { if (res.ok) foundBosses.add(fname); })
        .catch(() => {})
        .finally(() => { pending--; if (pending <= 0) refreshSelectUI(); });
    });
  }

  init() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this._createNoiseBuffers();

    // Усиленная шина голосов (+30% чистой громкости без клиппинга)
    this.voiceBus = this.ctx.createGain();
    this.voiceBus.gain.value = 0.88;

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
    return Math.max(0.0001, Math.min(1.45, this.sfxVolume * 1.30));
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
    const dur = 0.032;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.004);
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
    const dur = 0.14;
    const baseFreq = 245 * pitchMultiplier * (0.96 + Math.random() * 0.08);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.4, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(55, baseFreq * 0.45), now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.012);
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
    const dur = 0.34;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(390, now);
    osc.frequency.exponentialRampToValueAtTime(105, now + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(780, now);
    filter.frequency.exponentialRampToValueAtTime(210, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.025);
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
    const dur = 0.48;

    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(78, now);
    sub.frequency.exponentialRampToValueAtTime(135, now + dur * 0.6);
    sub.frequency.exponentialRampToValueAtTime(65, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
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
    const dur = 0.68;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + dur * 0.75);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.24, now + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(520, now);
    lp.frequency.exponentialRampToValueAtTime(95, now + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.03);
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
    const scale = [523.25, 587.33, 659.25, 783.99, 987.77];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    const dur = 0.55;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.015);
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
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(340, now + dur);

    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = 3.2;
    formant.frequency.setValueAtTime(540, now);
    formant.frequency.exponentialRampToValueAtTime(980, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.21, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(formant); formant.connect(gain); gain.connect(this.voiceBus);
    osc.start(now); osc.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  playShieldHum() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.95;
    [174.61, 261.63, 329.63].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.25);
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
    const dur = 0.5;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(115, now + dur * 0.5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.1);
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

  sfxHit() { this.playSoftBullet(0.78); }
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
  sfxUnderwater() { this.playSoftBullet(0.92); }
  sfxCosmicHum() { this.playPurrBoost(); }
  sfxSticky() { this.playSoftBullet(0.7); }
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
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.currentTrackIndex = Math.max(0, this.availableTracks.indexOf(chosen));
    this.recentTracks.push(chosen);
    if (this.recentTracks.length >= 4) this.recentTracks.shift();
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
    if (this.muted || !this.musicEnabled || this.pausedByGame) return 0;
    return Math.max(0, Math.min(1, this.musicVolume));
  }

  playTrack(filename, fallbackTrack = null) {
    this.pausedByGame = false;
    const path = `music/${filename}`;
    if (this.currentTrackPath === path && this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
      return;
    }
    this.stopMusic();
    this.currentTrackPath = path;

    try {
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = this.getEffectiveMusicVol();
      audio.onerror = () => { if (fallbackTrack && filename !== fallbackTrack) this.playTrack(fallbackTrack, 'boss.mp3'); };
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { this.pendingTrack = { file: filename, fallback: fallbackTrack }; });
      }
      this.bgmAudio = audio;
    } catch (e) {}
  }

  pauseMusic() {
    this.pausedByGame = true;
    if (this.bgmAudio) {
      try { this.bgmAudio.volume = 0; this.bgmAudio.pause(); } catch (e) {}
    }
  }

  resumeMusic() {
    this.pausedByGame = false;
    if (this.bgmAudio && this.musicEnabled && !this.muted) {
      try { this.bgmAudio.volume = this.getEffectiveMusicVol(); this.bgmAudio.play().catch(() => {}); } catch (e) {}
    }
  }

  startIntroMusic() { this.playTrack('intro.mp3', 'level1.mp3'); }

  startMusic(mode = 'normal', levelId = 1) {
    if (mode === 'intro') { this.startIntroMusic(); return; }
    if (mode === 'boss') {
      const specificBoss = levelId === 1 ? 'boss.mp3' : `boss${levelId}.mp3`;
      const fallbackBoss = this.bossTracks.length > 0 ? this.bossTracks[(levelId - 1) % this.bossTracks.length] : 'boss.mp3';
      this.playTrack(specificBoss, fallbackBoss);
      return;
    }
    this.playTrack(this.pickNextTrack());
  }

  setMusicMode(mode, levelId = 1) { if (mode === 'boss') this.startMusic('boss', levelId); }

  stopMusic() {
    if (this.bgmAudio) {
      try { this.bgmAudio.pause(); this.bgmAudio.currentTime = 0; } catch (e) {}
      this.bgmAudio = null;
    }
    this.currentTrackPath = '';
  }

  updateMusicVolume() { if (this.bgmAudio) this.bgmAudio.volume = this.getEffectiveMusicVol(); }

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
-------
'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'Звёздная Бухта',
    bossName: 'Доктор Кракен-Бот',
    theme: 'space',
    skyTop: '#171136', skyMid: '#241954', skyBot: '#311f6b',
    nebula1: 'rgba(255, 107, 157, 0.12)', nebula2: 'rgba(72, 219, 251, 0.11)',
    accent: '#48dbfb', bossColor: '#9b5de5', enemyTint: '#8ac926',
    songStyle: 0, bpm: 126, rootOffset: 0, hpMult: 1.0
  },
  {
    id: 2,
    name: 'Туманность Сахарной Ваты',
    bossName: 'Королева Зефира',
    theme: 'candy',
    skyTop: '#4a1942', skyMid: '#893168', skyBot: '#c8558c',
    nebula1: 'rgba(255, 214, 232, 0.22)', nebula2: 'rgba(255, 230, 109, 0.15)',
    accent: '#ffafcc', bossColor: '#ff70a6', enemyTint: '#ff9ebb',
    songStyle: 1, bpm: 130, rootOffset: 2, hpMult: 1.12
  },
  {
    id: 3,
    name: 'Пояс Пончиковых Астероидов',
    bossName: 'Мега-Бургер Дредноут',
    theme: 'donuts',
    skyTop: '#2b193d', skyMid: '#48284a', skyBot: '#7a3b69',
    nebula1: 'rgba(255, 183, 3, 0.15)', nebula2: 'rgba(251, 86, 7, 0.13)',
    accent: '#ffb703', bossColor: '#f77f00', enemyTint: '#fcbf49',
    songStyle: 1, bpm: 132, rootOffset: 4, hpMult: 1.24
  },
  {
    id: 4,
    name: 'Изумрудные Джунгли Орбиты',
    bossName: 'Споровый Левиафан',
    theme: 'jungle',
    skyTop: '#0b2e26', skyMid: '#134e3f', skyBot: '#1f7a5c',
    nebula1: 'rgba(128, 237, 153, 0.18)', nebula2: 'rgba(255, 209, 102, 0.12)',
    accent: '#06d6a0', bossColor: '#38b000', enemyTint: '#70e000',
    songStyle: 0, bpm: 128, rootOffset: 5, hpMult: 1.36
  },
  {
    id: 5,
    name: 'Ледяная Комета Криона',
    bossName: 'Ледяной Титан Фрост-9',
    theme: 'ice',
    skyTop: '#0d253f', skyMid: '#184e77', skyBot: '#1e6091',
    nebula1: 'rgba(144, 224, 239, 0.22)', nebula2: 'rgba(202, 240, 248, 0.18)',
    accent: '#90e0ef', bossColor: '#48cae4', enemyTint: '#ade8f4',
    songStyle: 2, bpm: 134, rootOffset: -2, hpMult: 1.48
  },
  {
    id: 6,
    name: 'Вулканическая Кузница Магмы',
    bossName: 'Инферно-Краб Вулкан',
    theme: 'lava',
    skyTop: '#2b0909', skyMid: '#591414', skyBot: '#942911',
    nebula1: 'rgba(255, 107, 53, 0.22)', nebula2: 'rgba(255, 190, 11, 0.16)',
    accent: '#ff6b35', bossColor: '#e63946', enemyTint: '#f77f00',
    songStyle: 3, bpm: 138, rootOffset: -5, hpMult: 1.60
  },
  {
    id: 7,
    name: 'Кибер-Сити Неонополис',
    bossName: 'Кибер-Сфинкс MK-IV',
    theme: 'cyber',
    skyTop: '#0f0726', skyMid: '#1d1147', skyBot: '#361973',
    nebula1: 'rgba(0, 245, 212, 0.18)', nebula2: 'rgba(241, 91, 181, 0.18)',
    accent: '#00f5d4', bossColor: '#f15bb5', enemyTint: '#00bbf9',
    songStyle: 3, bpm: 140, rootOffset: 1, hpMult: 1.72
  },
  {
    id: 8,
    name: 'Золотая Пустыня Дюн',
    bossName: 'Фараон-Скарабей',
    theme: 'desert',
    skyTop: '#3d2516', skyMid: '#774926', skyBot: '#b57436',
    nebula1: 'rgba(255, 209, 102, 0.22)', nebula2: 'rgba(255, 159, 28, 0.15)',
    accent: '#ffd166', bossColor: '#e09f3e', enemyTint: '#f4a261',
    songStyle: 2, bpm: 132, rootOffset: 3, hpMult: 1.85
  },
  {
    id: 9,
    name: 'Призрачный Сектор Эфира',
    bossName: 'Призрачный Адмирал',
    theme: 'ghost',
    skyTop: '#161329', skyMid: '#2a234d', skyBot: '#433878',
    nebula1: 'rgba(189, 178, 255, 0.20)', nebula2: 'rgba(114, 239, 221, 0.15)',
    accent: '#bdb2ff', bossColor: '#7209b7', enemyTint: '#a0c4ff',
    songStyle: 2, bpm: 136, rootOffset: -3, hpMult: 2.0
  },
  {
    id: 10,
    name: 'Цитадель Императора Кракена',
    bossName: 'Император Омега-Кракен',
    theme: 'citadel',
    skyTop: '#1b0718', skyMid: '#3d0c2e', skyBot: '#6e1447',
    nebula1: 'rgba(255, 0, 110, 0.22)', nebula2: 'rgba(255, 190, 11, 0.18)',
    accent: '#ff006e', bossColor: '#d90429', enemyTint: '#ff4d6d',
    songStyle: 3, bpm: 144, rootOffset: 0, hpMult: 2.25
  }
];

const DIFFICULTIES = {
  easy:   { label: 'Курсант', playerHp: 7, enemyHp: 0.8, bulletSpeed: 0.82, spawnRate: 1.18, scoreMult: 0.85 },
  normal: { label: 'Пилот',   playerHp: 5, enemyHp: 1.0, bulletSpeed: 1.0,  spawnRate: 1.0,  scoreMult: 1.0 },
  hard:   { label: 'Ас',      playerHp: 3, enemyHp: 1.3, bulletSpeed: 1.22, spawnRate: 0.82, scoreMult: 1.35 }
};

function roundRectPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// =========================================================================
// ДЕКОРАЦИИ И ФОНЫ ДЛЯ КАЖДОГО ИЗ 10 СЕКТОРОВ
// =========================================================================
function drawThemeProp(ctx, lvl, pr, W, globalTime) {
  const px = pr.xRatio * W;
  ctx.save();
  ctx.translate(px, pr.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (lvl.theme === 'candy') {
    // Полосатый леденец на палочке
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.fillRect(-3, pr.r * 0.6, 6, pr.r * 0.9);
    ctx.strokeRect(-3, pr.r * 0.6, 6, pr.r * 0.9);

    ctx.fillStyle = '#ffccd5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.62, 0, Math.PI * 1.35);
    ctx.stroke();

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.3, Math.PI, Math.PI * 2.3);
    ctx.stroke();

  } else if (lvl.theme === 'donuts') {
    // Космический пончик с розовой глазурью и цветной посыпкой
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#f4a261';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Посыпка
    const sprinkles = ['#ffd166', '#48dbfb', '#06d6a0', '#ffffff'];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      ctx.fillStyle = sprinkles[i % sprinkles.length];
      ctx.fillRect(Math.cos(a) * pr.r * 0.58 - 2, Math.sin(a) * pr.r * 0.58 - 2, 5, 3);
    }

    ctx.fillStyle = lvl.skyMid;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.theme === 'jungle') {
    // Биолюминесцентная космо-медуза
    const pulse = Math.sin(globalTime * 3.2 + pr.variant) * 3.5;
    ctx.strokeStyle = '#c7f9cc';
    ctx.lineWidth = 3;
    [-12, -4, 4, 12].forEach((ox, idx) => {
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.quadraticCurveTo(
        ox + Math.sin(globalTime * 4 + idx) * 6,
        pr.r * 0.55,
        ox - Math.sin(globalTime * 4 + idx) * 5,
        pr.r * 1.05
      );
      ctx.stroke();
    });

    ctx.fillStyle = '#80ed99';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r + pulse, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(-pr.r * 0.35, -pr.r * 0.42, pr.r * 0.22, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'ice') {
    // Граненый кристалл льда
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#caf0f8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r * 1.15);
    ctx.lineTo(pr.r * 0.72, -pr.r * 0.2);
    ctx.lineTo(pr.r * 0.55, pr.r * 0.9);
    ctx.lineTo(-pr.r * 0.55, pr.r * 0.9);
    ctx.lineTo(-pr.r * 0.72, -pr.r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r * 0.9);
    ctx.lineTo(0, pr.r * 0.7);
    ctx.stroke();

  } else if (lvl.theme === 'lava') {
    // Раскаленный магматический астероид
    ctx.rotate(pr.rot * 0.5);
    ctx.fillStyle = '#370617';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffba08';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-pr.r * 0.65, -5);
    ctx.lineTo(-5, 6);
    ctx.lineTo(10, -4);
    ctx.lineTo(pr.r * 0.68, 7);
    ctx.stroke();

  } else if (lvl.theme === 'cyber') {
    // Неоновый голографический маяк
    ctx.rotate(pr.rot);
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(-pr.r * 0.65, -pr.r * 0.65, pr.r * 1.3, pr.r * 1.3);

    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-pr.r * 0.52, -pr.r * 0.52, pr.r * 1.04, pr.r * 1.04);

  } else if (lvl.theme === 'desert') {
    // Золотая пирамида с глазом Гора
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r);
    ctx.lineTo(pr.r * 1.05, pr.r * 0.72);
    ctx.lineTo(-pr.r * 1.05, pr.r * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, pr.r * 0.12, pr.r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(0, pr.r * 0.12, pr.r * 0.11, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'ghost') {
    // Призрачный фонарь / рунический круг
    ctx.rotate(pr.rot);
    ctx.strokeStyle = '#bdb2ff';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(114, 239, 221, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.45, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'citadel') {
    // Боевая шестерня Цитадели
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#590d22';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    const teeth = 8;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (Math.PI * i) / teeth;
      const rad = i % 2 === 0 ? pr.r * 1.05 : pr.r * 0.78;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else {
    // Сектор 1: Планета с кольцами и кратерами
    ctx.fillStyle = pr.variant % 2 === 0 ? '#ff8fab' : '#4cc9f0';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.arc(-pr.r * 0.3, -pr.r * 0.3, pr.r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    if (pr.variant % 2 === 0) {
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 2, pr.r * 1.62, pr.r * 0.36, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawLevelBackground(ctx, lvl, W, H, stars, props, globalTime) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, lvl.skyTop);
  grad.addColorStop(0.55, lvl.skyMid);
  grad.addColorStop(1, lvl.skyBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Тематические фоновые эффекты
  if (lvl.theme === 'cyber') {
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.13)';
    ctx.lineWidth = 1.5;
    const step = 46;
    const offset = (globalTime * 48) % step;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = offset; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  } else if (lvl.theme === 'ice') {
    // Северное сияние
    ctx.fillStyle = 'rgba(114, 239, 221, 0.09)';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.22 + Math.sin(globalTime * 1.5) * 18, W * 0.55, 65, -0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Туманности
  ctx.fillStyle = lvl.nebula1;
  ctx.beginPath();
  ctx.arc(W * 0.25, H * 0.28, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = lvl.nebula2;
  ctx.beginPath();
  ctx.arc(W * 0.78, H * 0.66, 205, 0, Math.PI * 2);
  ctx.fill();

  for (const pr of props) {
    drawThemeProp(ctx, lvl, pr, W, globalTime);
  }

  for (const s of stars) {
    const twinkle = 0.6 + 0.4 * Math.sin(globalTime * 4 + s.phase);
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = s.r > 2 ? lvl.accent : '#ffffff';
    ctx.beginPath();
    ctx.arc(s.x % W, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// =========================================================================
// УНИКАЛЬНАЯ ОТРИСОВКА КАЖДОГО ИЗ 10 БОССОВ
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  // 1. Луч мега-лазера (если активен)
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 110, 0.75)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(b.laserX, b.y + 40);
    ctx.lineTo(b.laserX, H);
    ctx.stroke();
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 110, 0.35)';
    ctx.fillRect(b.laserX - 32, b.y + 35, 64, H - b.y);
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(b.laserX - 15, b.y + 35, 30, H - b.y);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.laserX - 5, b.y + 35, 10, H - b.y);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const flash = b.hitFlash > 0;
  const mainCol = flash ? '#ffffff' : (b.phase === 3 ? '#ff4d6d' : lvl.bossColor);
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  // Уникальные силуэты и детали по номеру уровня (1..10)
  if (lvl.id === 2) {
    // Королева Зефира: пышное зефирное облако + золотая тиара
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const puffs = [
      { x: -36, y: 12, r: 26 },
      { x: 36,  y: 12, r: 26 },
      { x: -22, y: -16, r: 28 },
      { x: 22,  y: -16, r: 28 },
      { x: 0,   y: 8,  r: 38 }
    ];
    puffs.forEach(pf => {
      ctx.beginPath();
      ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Тиара-леденец
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -38);
    ctx.lineTo(-12, -62);
    ctx.lineTo(0, -45);
    ctx.lineTo(12, -62);
    ctx.lineTo(22, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 3) {
    // Мега-Бургер Дредноут: булки, котлета, сыр и пушки
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;

    // Нижняя булка
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261';
    roundRectPath(ctx, -54, 16, 108, 22, 11);
    ctx.fill();
    ctx.stroke();

    // Котлета и лист салата
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -58, 2, 116, 16, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#8ac926';
    roundRectPath(ctx, -60, -6, 120, 10, 5);
    ctx.fill();
    ctx.stroke();

    // Верхняя булка с кунжутом
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, -4, 54, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff8eb';
    [-22, 0, 22].forEach(sx => {
      ctx.beginPath();
      ctx.ellipse(sx, -28, 4, 2, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });

  } else if (lvl.id === 4) {
    // Споровый Левиафан: хищный цветок с лепестками
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const a = b.time * 0.7 + (Math.PI * 2 * i) / 6;
      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#80ed99';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 44, Math.sin(a) * 34, 22, 14, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 5) {
    // Ледяной Титан Фрост-9: ромбовидный кристалл с ледяными шипами
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -64);
    ctx.lineTo(58, -10);
    ctx.lineTo(38, 44);
    ctx.lineTo(-38, 44);
    ctx.lineTo(-58, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#caf0f8';
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.lineTo(30, -8);
    ctx.lineTo(0, 26);
    ctx.lineTo(-30, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 6) {
    // Инферно-Краб Вулкан: массивный панцирь и две огромные клешни
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const clawWave = Math.sin(b.time * 4) * 6;
    [-64, 64].forEach((cx, idx) => {
      ctx.fillStyle = '#ffba08';
      ctx.beginPath();
      ctx.arc(cx, 18 + (idx === 0 ? clawWave : -clawWave), 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = mainCol;
    roundRectPath(ctx, -56, -34, 112, 66, 26);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 7) {
    // Кибер-Сфинкс MK-IV: неоновый треугольный дрон с лазерными крыльями
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.moveTo(-72, -16);
    ctx.lineTo(72, -16);
    ctx.lineTo(48, 18);
    ctx.lineTo(-48, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.lineTo(46, 36);
    ctx.lineTo(-46, 36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 8) {
    // Фараон-Скарабей: золотой жук с солнечным диском
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath();
    ctx.arc(0, -46, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.ellipse(0, 4, 56, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, 44);
    ctx.stroke();

  } else if (lvl.id === 9) {
    // Призрачный Адмирал: треуголка + волнистый призрачный шлейф
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, 0, 48, Math.PI, 0);
    ctx.lineTo(48, 38);
    ctx.lineTo(24, 24);
    ctx.lineTo(0, 40);
    ctx.lineTo(-24, 24);
    ctx.lineTo(-48, 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Пиратская шляпа адмирала
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.moveTo(-58, -24);
    ctx.quadraticCurveTo(0, -64, 58, -24);
    ctx.quadraticCurveTo(0, -14, -58, -24);
    ctx.fill();
    ctx.stroke();

  } else {
    // Сектор 1 и Сектор 10: Кракен-Бот / Император Омега-Кракен
    const tentacleCount = lvl.id === 10 ? 6 : 4;
    for (let i = 0; i < tentacleCount; i++) {
      const t = i - (tentacleCount - 1) / 2;
      const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
      const baseX = t * (lvl.id === 10 ? 20 : 28);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(baseX, 24);
      ctx.quadraticCurveTo(baseX + waveX, 52, baseX * 1.2 - waveX * 0.6, 74);
      ctx.stroke();

      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, Math.PI, 0);
    ctx.quadraticCurveTo(60, 34, 0, 36);
    ctx.quadraticCurveTo(-60, 34, -56, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -48);
    ctx.lineTo(-12, -74);
    ctx.lineTo(0, -54);
    ctx.lineTo(12, -74);
    ctx.lineTo(22, -48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Общие выразительные глаза и злодейская улыбка босса
  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ex, -4, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = b.phase === 3 ? '#d90429' : INK;
    ctx.beginPath();
    ctx.arc(ex + lookX, -2, flash ? 4 : 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex + lookX - 2, -4, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Хмурые брови
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-34, -20);
  ctx.lineTo(-8, -13);
  ctx.moveTo(34, -20);
  ctx.lineTo(8, -13);
  ctx.stroke();

  // Зубастая ухмылка
  ctx.fillStyle = INK;
  roundRectPath(ctx, -20, 14, 40, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, 14, 6, 5);
  ctx.fillRect(7, 14, 6, 5);

  ctx.restore();
}
