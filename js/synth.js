'use strict';

class AstraCatSynth {
  constructor(maxVoices = 32) {
    this.maxVoices = maxVoices;
    this.ctx = null;
    this.isInitialized = false;
    this.audioUnlocked = false;
    this.samplesLoaded = false;

    this.voices = Array.from({ length: maxVoices }, (_, id) => ({
      id,
      active: false,
      endTime: 0,
      stopFn: null
    }));

    this.buffers = {};

    this.muted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    this.musicVolume = 0.60;
    this.sfxVolume = 0.50;

    this.settings = {
      masterVolume: 0.50,
      warmthCutoff: 1550,
      spaceMix: 0.22,
      psyDrift: 0.55
    };

    this.brownNoiseBuffer = null;

    this.warmScale = [146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63];
    this.cyberScale = [220.00, 246.94, 293.66, 329.63, 392.00];
    this.collectStep = 0;
    this.woodStep = 0;
    this.shotStep = 0;
    this.cyberStep = 0;

    // Список треков от level1.mp3 до level30.mp3 (уточняется автосканированием)
    this.maxTrackCount = 30;
    this.availableTracks = Array.from({ length: 11 }, (_, i) => ({
      num: i + 1,
      file: `level${i + 1}.mp3`,
      label: `Трек ${i + 1}`
    }));

    this.bossTracks = ['boss.mp3', 'boss2.mp3'];

    this.recentTracks = [];
    this.currentTrackIndex = 0;

    this.bgmAudio = new Audio();
    this.bgmAudio.loop = false;
    this.bgmAudio.preload = 'auto';

    this.currentTrackFile = '';
    this.fallbackTrackFile = null;
    this.pendingTrack = null;
    this.isPlayRequestInFlight = false;
    this.pausedByGame = false;

    this.lastScrollTickTime = 0;
    this.lastShotSoundTime = 0;
    this.lastCyberSoundTime = 0;
    this.lastDroneShotTime = 0;
    this.lastExplosionTime = 0;
    this.lastHitTime = 0;
    this.lastPortalTime = 0;
    this.lastCoinSampleTime = 0;

    this.bgmAudio.addEventListener('playing', () => {
      this.isPlayRequestInFlight = false;
      this.pendingTrack = null;
      this.syncCockpitPlayerUI();
    });

    this.bgmAudio.addEventListener('pause', () => {
      this.syncCockpitPlayerUI();
    });

    this.bgmAudio.addEventListener('ended', () => {
      if (this.pausedByGame || !this.musicEnabled || this.muted || !this.currentTrackFile) return;
      // Если играл трек из плейлиста level1..30 — ставим следующий случайный без повтора 4 раз
      const isLevelTrack = /^level\d+\.mp3$/i.test(this.currentTrackFile);
      if (isLevelTrack && this.availableTracks.length > 1) {
        this.playTrack(this.pickNextTrack(), 'level1.mp3', true);
      } else {
        this.bgmAudio.currentTime = 0;
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    });

    this.bgmAudio.addEventListener('error', () => {
      this.isPlayRequestInFlight = false;
      // Удаляем недоступный трек из пула, если он не найден
      const brokenIdx = this.availableTracks.findIndex(t => t.file === this.currentTrackFile);
      if (brokenIdx !== -1 && this.availableTracks.length > 1) {
        this.availableTracks.splice(brokenIdx, 1);
        this.renderCockpitTrackGrid();
        this.playTrack(this.pickNextTrack(), 'level1.mp3', true);
        return;
      }
      if (this.fallbackTrackFile && this.currentTrackFile !== this.fallbackTrackFile) {
        const fb = this.fallbackTrackFile;
        this.fallbackTrackFile = null;
        this.playTrack(fb, 'level1.mp3', true);
      }
    });

    this.syncDefaultSlidersUI();
    this.bindCockpitControls();
    this.scanMusicFolder();
    this.setupAutoUnlock();
  }

  getTrackDisplayLabel(filename) {
    if (!filename) return 'Трек 1';
    const match = filename.match(/^level(\d+)\.mp3$/i);
    if (match) return `Трек ${match[1]}`;
    const cur = this.availableTracks[this.currentTrackIndex];
    return cur ? cur.label : 'Трек 1';
  }

  syncDefaultSlidersUI() {
    const musicSlider = document.getElementById('music-vol');
    const musicVal = document.getElementById('val-music-vol');
    if (musicSlider) musicSlider.value = '60';
    if (musicVal) musicVal.textContent = '60%';

    const sfxSlider = document.getElementById('sfx-vol');
    const sfxVal = document.getElementById('val-sfx-vol');
    if (sfxSlider) sfxSlider.value = '50';
    if (sfxVal) sfxVal.textContent = '50%';

    const warmthSlider = document.getElementById('ctrl-warmth');
    const warmthVal = document.getElementById('val-warmth');
    if (warmthSlider) warmthSlider.value = String(this.settings.warmthCutoff);
    if (warmthVal) warmthVal.textContent = `${this.settings.warmthCutoff} Hz`;
  }

  bindCockpitControls() {
    document.getElementById('cockpit-prev-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.init();
      this.prevTrack();
    });
    document.getElementById('cockpit-next-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.init();
      this.nextTrack();
    });
  }

  renderCockpitTrackGrid() {
    const grid = document.getElementById('cockpit-track-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.availableTracks.forEach((tr, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cockpit-key' + (this.currentTrackFile === tr.file ? ' active' : '');
      btn.textContent = tr.label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.init();
        this.sfxMenuSelect();
        this.pausedByGame = false;
        this.currentTrackIndex = idx;
        this.playTrack(tr.file, 'level1.mp3', true);
      });
      grid.appendChild(btn);
    });

    this.syncCockpitPlayerUI();
  }

  syncCockpitPlayerUI() {
    const titleEl = document.getElementById('cockpit-track-title');
    const eqEl = document.getElementById('cockpit-eq');
    const isPlaying = Boolean(this.bgmAudio && !this.bgmAudio.paused && this.musicEnabled && !this.muted);

    if (titleEl) {
      titleEl.textContent = this.getTrackDisplayLabel(this.currentTrackFile);
    }
    if (eqEl) {
      eqEl.classList.toggle('playing', isPlaying);
    }

    const keys = document.querySelectorAll('#cockpit-track-grid .cockpit-key');
    keys.forEach((btn, idx) => {
      const tr = this.availableTracks[idx];
      btn.classList.toggle('active', Boolean(tr && tr.file === this.currentTrackFile));
    });
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
            this.syncCockpitPlayerUI();
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: this.currentTrackFile, fallback: this.fallbackTrackFile };
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

  async scanMusicFolder() {
    this.renderCockpitTrackGrid();

    const probes = Array.from({ length: this.maxTrackCount }, (_, i) => {
      const num = i + 1;
      const file = `level${num}.mp3`;
      return fetch(`music/${file}`, { method: 'HEAD' })
        .then(resp => {
          const ctype = (resp.headers.get('content-type') || '').toLowerCase();
          if (resp.ok && !ctype.includes('text/html')) {
            return { num, file, label: `Трек ${num}` };
          }
          return null;
        })
        .catch(() => null);
    });

    const results = await Promise.all(probes);
    const found = results.filter(Boolean).sort((a, b) => a.num - b.num);

    if (found.length > 0) {
      this.availableTracks = found;
      const curIdx = this.availableTracks.findIndex(t => t.file === this.currentTrackFile);
      if (curIdx !== -1) this.currentTrackIndex = curIdx;
    }

    this.renderCockpitTrackGrid();
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
      if (!this.samplesLoaded) {
        this.loadSfxAssets();
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
    this.voiceBus.gain.value = 1.22;

    this.speakerProtectFilter = this.ctx.createBiquadFilter();
    this.speakerProtectFilter.type = 'highpass';
    this.speakerProtectFilter.frequency.value = 105;
    this.speakerProtectFilter.Q.value = 0.5;

    this.masterLowpass = this.ctx.createBiquadFilter();
    this.masterLowpass.type = 'lowpass';
    this.masterLowpass.frequency.value = this.settings.warmthCutoff;
    this.masterLowpass.Q.value = 0.45;

    this.delayLeft = this.ctx.createDelay(1.0);
    this.delayRight = this.ctx.createDelay(1.0);
    this.delayLeft.delayTime.value = 0.16;
    this.delayRight.delayTime.value = 0.22;

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.09;

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.value = this.settings.spaceMix * 0.16;

    this.merger = this.ctx.createChannelMerger(2);

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
    this.loadSfxAssets();
  }

  async loadSfxAssets() {
    if (!this.ctx || this.samplesLoaded) return;
    this.samplesLoaded = true;

    const files = {
      meow:         'music/meow.mp3',
      coin:         'music/coin.mp3',
      powerup:      'music/powerup.mp3',
      laser:        'music/laser.mp3',
      blaster:      'music/blaster.mp3',
      boom_small:   'music/boom_small.mp3',
      boss_alarm:   'music/boss_alarm.mp3',
      boss_explode: 'music/boss_explode.mp3',
      drone_bullet: 'music/drone_bullet.mp3',
      drone_wave:   'music/drone_wave.mp3',
      rocket_boom:  'music/rocket_boom.mp3'
    };

    await Promise.all(Object.entries(files).map(async ([key, url]) => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return;
        const arrayBuf = await resp.arrayBuffer();
        this.buffers[key] = await this.ctx.decodeAudioData(arrayBuf);
      } catch (_) {}
    }));
  }

  playSample(name, { volume = 0.5, pitch = 1.0, pitchJitter = 0.04, dry = false, offset = 0, duration = null } = {}) {
    if (!this.ctx || this.muted || !this.sfxEnabled) return false;
    const buf = this.buffers[name];
    if (!buf) return false;

    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const jitter = 1 + (Math.random() * 2 - 1) * pitchJitter;
    const rate = Math.max(0.65, Math.min(1.45, pitch * jitter));
    src.playbackRate.setValueAtTime(rate, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);

    src.connect(gain);
    gain.connect(dry ? this.compressor : this.voiceBus);

    const availDur = Math.max(0.05, buf.duration - offset);
    const playDur = duration ? Math.min(availDur, duration) : availDur;

    if (duration) {
      gain.gain.setValueAtTime(volume, now + Math.max(0.01, playDur - 0.04));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + playDur);
      src.start(now, offset, playDur);
    } else {
      src.start(now, offset);
    }

    this.allocateVoice(playDur / rate, () => { try { src.stop(); } catch (_) {} });
    return true;
  }

  getEffectiveSfxVol() {
    if (this.muted || !this.sfxEnabled) return 0.0001;
    return Math.max(0.0001, Math.min(1.38, this.sfxVolume * 1.24));
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
      this.delayWetGain.gain.setTargetAtTime(val * 0.16, this.ctx.currentTime, 0.04);
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

  playWoodTap(pitch = 1.0, volumeScale = 1.0, exactFreq = null) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.095;

    const scaleMults = [0.88, 0.96, 1.04, 1.12, 1.18];
    const stepMult = scaleMults[this.woodStep % scaleMults.length];
    this.woodStep++;

    const rawFreq = exactFreq || (215 * pitch * stepMult);
    const baseFreq = Math.min(315, Math.max(145, rawFreq));

    const bodyOsc = this.ctx.createOscillator();
    const barOsc = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(baseFreq * 1.16, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.56, now + dur);

    barOsc.type = 'triangle';
    barOsc.frequency.setValueAtTime(baseFreq * 2.0, now);
    barOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + dur * 0.55);

    const barGain = this.ctx.createGain();
    barGain.gain.setValueAtTime(0.09, now);
    barGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.48);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(680, now);
    lp.Q.value = 0.65;

    const peak = 0.28 * volumeScale;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    bodyOsc.connect(lp);
    barOsc.connect(barGain);
    barGain.connect(lp);
    lp.connect(gain);
    gain.connect(this.voiceBus);

    bodyOsc.start(now);
    barOsc.start(now);
    bodyOsc.stop(now + dur + 0.01);
    barOsc.stop(now + dur + 0.01);

    this.allocateVoice(dur, () => {
      try { bodyOsc.stop(); barOsc.stop(); } catch (_) {}
    });
  }

  playWaterDroplet(pitch = 1.0, volumeScale = 1.0, exactFreq = null) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.16;

    const drift = 1 + (Math.random() - 0.5) * 0.06 * (0.4 + this.settings.psyDrift);
    const rawFreq = exactFreq || (195 * pitch * drift);
    const startFreq = Math.min(285, Math.max(145, rawFreq));
    const peakFreq = Math.min(365, startFreq * 1.44);

    const osc = this.ctx.createOscillator();
    const subHarmonic = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq * 0.92, now);
    osc.frequency.exponentialRampToValueAtTime(peakFreq, now + dur * 0.68);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.18, now + dur);

    subHarmonic.type = 'sine';
    subHarmonic.frequency.setValueAtTime(startFreq * 0.5, now);
    subHarmonic.frequency.exponentialRampToValueAtTime(peakFreq * 0.5, now + dur * 0.72);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.11, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(720, now);
    lp.Q.value = 0.55;

    const peak = 0.30 * volumeScale;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(lp);
    subHarmonic.connect(subGain);
    subGain.connect(lp);
    lp.connect(gain);
    gain.connect(this.voiceBus);

    osc.start(now);
    subHarmonic.start(now);
    osc.stop(now + dur + 0.01);
    subHarmonic.stop(now + dur + 0.01);

    this.allocateVoice(dur, () => {
      try { osc.stop(); subHarmonic.stop(); } catch (_) {}
    });
  }

  sfxScrollTick() {
    const nowMs = performance.now();
    if (nowMs - this.lastScrollTickTime < 55) return;
    this.lastScrollTickTime = nowMs;
    if (navigator.vibrate) { try { navigator.vibrate(4); } catch (_) {} }
    this.playWoodTap(0.95, 0.80);
  }

  playSoftBullet(pitchMultiplier = 1.0) {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.115;

    const intervals = [0.92, 1.0, 1.08, 0.96];
    const mult = intervals[this.shotStep % intervals.length];
    this.shotStep++;

    const baseFreq = Math.min(315, 255 * pitchMultiplier * mult);

    const osc = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.15, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(115, baseFreq * 0.48), now + dur);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(720, now);
    lp.Q.value = 0.45;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.voiceBus);
    osc.start(now);
    osc.stop(now + dur + 0.01);
    this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
  }

  // Приятный кибернетический импульс для пушки с молниями и 3-го дрона
  playCyberElectric(volumeScale = 1.0) {
    const nowMs = performance.now();
    if (nowMs - this.lastCyberSoundTime < 95) return;
    this.lastCyberSoundTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const dur = 0.165;
    const base = this.cyberScale[this.cyberStep % this.cyberScale.length];
    this.cyberStep++;

    // Основной кибернетический синтезаторный голос
    const carrier = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const modLfo = this.ctx.createOscillator();
    const modDepth = this.ctx.createGain();

    const bp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(base, now);
    carrier.frequency.exponentialRampToValueAtTime(base * 1.48, now + 0.032);
    carrier.frequency.exponentialRampToValueAtTime(base * 0.78, now + dur);

    // Мягкая верхняя гармоника с лёгкой кибер-модуляцией 52 Гц
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(base * 2.0, now);
    harmonic.frequency.exponentialRampToValueAtTime(base * 2.5, now + 0.035);
    harmonic.frequency.exponentialRampToValueAtTime(base * 1.25, now + dur);

    modLfo.type = 'sine';
    modLfo.frequency.setValueAtTime(52, now);
    modDepth.gain.setValueAtTime(16, now);

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.14, now);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    bp.type = 'lowpass';
    bp.frequency.setValueAtTime(1250, now);
    bp.frequency.exponentialRampToValueAtTime(620, now + dur);
    bp.Q.value = 1.8;

    const peak = 0.25 * volumeScale;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    modLfo.connect(modDepth);
    modDepth.connect(harmonic.frequency);

    carrier.connect(bp);
    harmonic.connect(harmGain);
    harmGain.connect(bp);
    bp.connect(gain);
    gain.connect(this.voiceBus);

    carrier.start(now);
    harmonic.start(now);
    modLfo.start(now);

    carrier.stop(now + dur + 0.01);
    harmonic.stop(now + dur + 0.01);
    modLfo.stop(now + dur + 0.01);

    this.allocateVoice(dur, () => {
      try { carrier.stop(); harmonic.stop(); modLfo.stop(); } catch (_) {}
    });
  }

  playPortalPass() {
    const nowMs = performance.now();
    if (nowMs - this.lastPortalTime < 115) return;
    this.lastPortalTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const dur = 0.105;
    const note = this.warmScale[this.collectStep % 4];
    this.collectStep++;

    const osc = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);
    osc.frequency.exponentialRampToValueAtTime(note * 1.38, now + dur);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(680, now);
    lp.Q.value = 0.4;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.21, now + 0.014);
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
    const dur = 0.21;
    const startNote = this.warmScale[(this.shotStep + 2) % 5] * 1.15;

    [0, 3.5].forEach((detuneHz) => {
      const osc = this.ctx.createOscillator();
      const lp = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startNote + detuneHz, now);
      osc.frequency.exponentialRampToValueAtTime(132 + detuneHz, now + dur);

      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(700, now);
      lp.Q.value = 0.5;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.voiceBus);
      osc.start(now);
      osc.stop(now + dur + 0.02);
      this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
    });
  }

  playPlushRocket() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    this.playSample('rocket_boom', { volume: 0.28, pitch: 1.08, pitchJitter: 0.06, duration: 0.45 });

    const now = this.ctx.currentTime;
    const dur = 0.27;

    const sub = this.ctx.createOscillator();
    const fifth = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    sub.type = 'sine';
    sub.frequency.setValueAtTime(155, now);
    sub.frequency.exponentialRampToValueAtTime(215, now + dur * 0.5);
    sub.frequency.exponentialRampToValueAtTime(125, now + dur);

    fifth.type = 'sine';
    fifth.frequency.setValueAtTime(232, now);
    fifth.frequency.exponentialRampToValueAtTime(310, now + dur * 0.5);
    fifth.frequency.exponentialRampToValueAtTime(185, now + dur);

    const fifthGain = this.ctx.createGain();
    fifthGain.gain.value = 0.35;

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(620, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(lp);
    fifth.connect(fifthGain);
    fifthGain.connect(lp);
    lp.connect(gain);
    gain.connect(this.voiceBus);

    sub.start(now);
    fifth.start(now);
    sub.stop(now + dur + 0.02);
    fifth.stop(now + dur + 0.02);
    this.allocateVoice(dur, () => { try { sub.stop(); fifth.stop(); } catch (_) {} });
  }

  playNebulaExplosion() {
    const nowMs = performance.now();
    if (nowMs - this.lastExplosionTime < 75) return;
    this.lastExplosionTime = nowMs;

    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    this.playSample('boom_small', { volume: 0.42, pitch: 0.98, pitchJitter: 0.08 });

    const now = this.ctx.currentTime;
    const dur = 0.38;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(175, now);
    sub.frequency.exponentialRampToValueAtTime(105, now + dur * 0.8);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.26, now + 0.015);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.brownNoiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(520, now);
    lp.frequency.exponentialRampToValueAtTime(150, now + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.20, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    sub.connect(subGain); subGain.connect(this.voiceBus);
    noise.connect(lp); lp.connect(noiseGain); noiseGain.connect(this.voiceBus);

    sub.start(now); noise.start(now, Math.random());
    sub.stop(now + dur); noise.stop(now + dur);
    this.allocateVoice(dur, () => { try { sub.stop(); noise.stop(); } catch (_) {} });
  }

  playStarCollect() {
    const note = this.warmScale[this.collectStep % this.warmScale.length];
    this.collectStep++;

    this.playWaterDroplet(1.0, 0.95, note);
    this.playWoodTap(1.0, 0.70, note * 0.75);

    const nowMs = performance.now();
    if (nowMs - this.lastCoinSampleTime >= 75) {
      this.lastCoinSampleTime = nowMs;
      this.playSample('coin', { volume: 0.34, pitch: 0.98, pitchJitter: 0.05 });
    }
  }

  playCosmicMeow() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;

    const hasMeowSample = this.playSample('meow', { volume: 0.65, pitch: 1.0, pitchJitter: 0.03 });
    if (hasMeowSample) return;

    const now = this.ctx.currentTime;
    const dur = 0.36;

    const osc = this.ctx.createOscillator();
    const fifth = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.13);
    osc.frequency.exponentialRampToValueAtTime(246.94, now + dur);

    fifth.type = 'sine';
    fifth.frequency.setValueAtTime(164.81, now);
    fifth.frequency.exponentialRampToValueAtTime(220.00, now + 0.13);
    fifth.frequency.exponentialRampToValueAtTime(196.00, now + dur);

    const fifthGain = this.ctx.createGain();
    fifthGain.gain.value = 0.45;

    const softFilter = this.ctx.createBiquadFilter();
    softFilter.type = 'lowpass';
    softFilter.Q.value = 0.5;
    softFilter.frequency.setValueAtTime(680, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(softFilter);
    fifth.connect(fifthGain);
    fifthGain.connect(softFilter);
    softFilter.connect(gain);
    gain.connect(this.voiceBus);

    osc.start(now);
    fifth.start(now);
    osc.stop(now + dur);
    fifth.stop(now + dur);
    this.allocateVoice(dur, () => { try { osc.stop(); fifth.stop(); } catch (_) {} });
  }

  playShieldHum() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.40;
    [174.61, 220.00, 261.63, 329.63].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const lp = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.025);
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(660, now);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.025);
      gain.gain.linearRampToValueAtTime(0.095, now + idx * 0.025 + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.voiceBus);
      osc.start(now + idx * 0.025);
      osc.stop(now + dur + 0.02);
      this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
    });
  }

  playPurrBoost() {
    this.init();
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const dur = 0.32;

    [164.81, 246.94].forEach((base, i) => {
      const osc = this.ctx.createOscillator();
      const lp = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.48, now + dur * 0.72);
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(640, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(i === 0 ? 0.22 : 0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.voiceBus);
      osc.start(now);
      osc.stop(now + dur);
      this.allocateVoice(dur, () => { try { osc.stop(); } catch (_) {} });
    });
  }

  sfxMenuTap() { this.playWoodTap(1.05, 0.95); }
  sfxMenuSelect() {
    const note = this.warmScale[this.collectStep % 5];
    this.collectStep++;
    this.playWaterDroplet(1.0, 1.0, note);
  }
  sfxMenuTransition() { this.playPurrBoost(); }

  sfxBuyItem() {
    this.playWoodTap(1.0, 1.0, 220.00);
    setTimeout(() => this.playCosmicMeow(), 90);
    setTimeout(() => this.playSample('coin', { volume: 0.40, pitch: 1.05 }), 220);
  }

  sfxShootWeapon(pan = 0, baseWeapon = 'droplet') {
    const nowMs = performance.now();
    if (nowMs - this.lastShotSoundTime < 105) return;
    this.lastShotSoundTime = nowMs;

    if (baseWeapon === 'droplet') {
      this.playSoftBullet(0.98);
    } else if (baseWeapon === 'double_shot') {
      this.playSoftBullet(1.04);
      this.playSample('drone_bullet', { volume: 0.22, pitch: 1.0, pitchJitter: 0.05 });
    } else if (baseWeapon === 'rocket_launcher') {
      this.playPlushRocket();
    } else if (baseWeapon === 'electric_arc') {
      this.playCyberElectric(1.05);
    } else {
      this.playWarmLaser();
    }
  }

  sfxDroneShoot(droneWeapon = 'bullet') {
    const nowMs = performance.now();
    if (nowMs - this.lastDroneShotTime < 150) return;
    this.lastDroneShotTime = nowMs;

    if (droneWeapon === 'bullet') {
      this.playSample('drone_bullet', { volume: 0.18, pitch: 1.12, pitchJitter: 0.06 });
      this.playSoftBullet(1.15);
    } else if (droneWeapon === 'wave') {
      this.playSample('drone_wave', { volume: 0.18, pitch: 0.95, pitchJitter: 0.05, offset: 0.04, duration: 0.32 });
      this.playWarmLaser();
    } else if (droneWeapon === 'electric') {
      this.playCyberElectric(0.88);
    }
  }

  sfxDroneSpecial() {
    this.playPurrBoost();
    this.playSample('powerup', { volume: 0.26, pitch: 0.95 });
  }

  sfxHit() {
    const nowMs = performance.now();
    if (nowMs - this.lastHitTime < 65) return;
    this.lastHitTime = nowMs;
    this.playWoodTap(0.86, 0.90);
  }

  sfxExplosion() { this.playNebulaExplosion(); }

  sfxBossExplosion() {
    this.playNebulaExplosion();
    this.playSample('rocket_boom', { volume: 0.45, pitch: 0.92 });
    this.playSample('boss_explode', { volume: 0.72, pitch: 0.98, pitchJitter: 0.03 });
  }

  sfxIgnite() { this.playPlushRocket(); }
  sfxGravity() { this.playPortalPass(); }
  sfxDisintegrate() { this.playWaterDroplet(0.92, 0.90); }
  sfxUnderwater() { this.playWaterDroplet(0.88, 0.95); }
  sfxCosmicHum() { this.playPurrBoost(); }
  sfxSticky() { this.playWoodTap(0.82, 0.90); }
  sfxWave() { this.playWarmLaser(); }

  sfxPowerup() {
    const note = this.warmScale[(this.collectStep + 2) % this.warmScale.length];
    this.collectStep++;
    this.playWaterDroplet(1.0, 0.95, note);
    this.playSample('powerup', { volume: 0.36, pitch: 1.0, pitchJitter: 0.04 });
  }

  sfxShieldBlock() { this.playShieldHum(); }
  sfxHurt() { this.playWarmLaser(); }

  sfxBossAlarm() {
    this.playShieldHum();
    this.playSample('boss_alarm', { volume: 0.45, pitch: 0.98, pitchJitter: 0.02 });
  }

  sfxVictory() {
    this.playCosmicMeow();
    setTimeout(() => this.playSample('powerup', { volume: 0.42, pitch: 1.02 }), 220);
  }

  sfxGameOver() { this.playNebulaExplosion(); }

  recordRecentTrack(filename) {
    if (!filename || !/^level\d+\.mp3$/i.test(filename)) return;
    this.recentTracks = this.recentTracks.filter(f => f !== filename);
    this.recentTracks.push(filename);
    if (this.recentTracks.length > 4) this.recentTracks.shift();
  }

  // Случайный выбор из level1..30 без повтора минимум 4 раза подряд и без привязки к уровню
  pickNextTrack() {
    if (!this.availableTracks.length) return 'level1.mp3';
    const historyLimit = Math.min(4, Math.max(0, this.availableTracks.length - 1));
    const blocked = this.recentTracks.slice(-historyLimit);
    const candidates = this.availableTracks.filter(t => !blocked.includes(t.file));
    const pool = candidates.length > 0 ? candidates : this.availableTracks;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.currentTrackIndex = Math.max(0, this.availableTracks.findIndex(t => t.file === chosen.file));
    return chosen.file;
  }

  nextTrack() {
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.availableTracks.length;
    const item = this.availableTracks[this.currentTrackIndex];
    this.playTrack(item.file, 'level1.mp3', true);
  }

  prevTrack() {
    this.sfxMenuTap();
    if (!this.availableTracks.length) return;
    this.pausedByGame = false;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.availableTracks.length) % this.availableTracks.length;
    const item = this.availableTracks[this.currentTrackIndex];
    this.playTrack(item.file, 'level1.mp3', true);
  }

  getEffectiveMusicVol() {
    if (this.muted || !this.musicEnabled || this.pausedByGame) return 0;
    return Math.max(0, Math.min(0.85, this.musicVolume * 0.85));
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
            this.syncCockpitPlayerUI();
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: filename, fallback: fallbackTrack };
          });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
      this.syncCockpitPlayerUI();
      return;
    }

    this.currentTrackFile = filename;
    this.fallbackTrackFile = fallbackTrack;
    this.pendingTrack = null;
    this.recordRecentTrack(filename);

    const idx = this.availableTracks.findIndex(t => t.file === filename);
    if (idx !== -1) this.currentTrackIndex = idx;
    this.syncCockpitPlayerUI();

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
            this.syncCockpitPlayerUI();
          }).catch(() => {
            this.isPlayRequestInFlight = false;
            this.pendingTrack = { file: filename, fallback: fallbackTrack };
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
    this.syncCockpitPlayerUI();
  }

  resumeMusic() {
    this.pausedByGame = false;
    if (this.bgmAudio && this.musicEnabled && !this.muted && this.currentTrackFile) {
      try {
        this.bgmAudio.volume = this.getEffectiveMusicVol();
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => { this.isPlayRequestInFlight = false; this.syncCockpitPlayerUI(); })
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
    this.playTrack('intro.mp3', this.pickNextTrack(), false);
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
    // Всегда случайный трек из level1..30 без привязки к номеру уровня
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
    this.syncCockpitPlayerUI();
  }

  updateMusicVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.getEffectiveMusicVol();
      if (this.bgmAudio.paused && this.musicEnabled && !this.muted && !this.pausedByGame && this.currentTrackFile && !this.isPlayRequestInFlight) {
        this.isPlayRequestInFlight = true;
        const p = this.bgmAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => { this.isPlayRequestInFlight = false; this.syncCockpitPlayerUI(); })
           .catch(() => { this.isPlayRequestInFlight = false; });
        } else {
          this.isPlayRequestInFlight = false;
        }
      }
    }
    this.syncCockpitPlayerUI();
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
