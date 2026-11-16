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
