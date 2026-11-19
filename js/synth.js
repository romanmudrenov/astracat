'use strict';

class AstraCatSynth {
  constructor(maxVoices = 32) {
    this.maxVoices = maxVoices;
    this.ctx = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.lpf = null;
    this.delayNode = null;
    this.delayGain = null;
    this.compressor = null;

    // Базовая громкость при входе: музыка 50%, спецэффекты 30% + доп. ослабление SFX на 30%
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.50;
    this.sfxVolume = 0.30;
    this.sfxAttenuation = 0.70;
    this.warmthCutoff = 1550;
    this.spaceMix = 0.22;
    this.psyDrift = 0.55;
    this.muted = false;

    this.activeVoices = 0;
    this.musicTimer = null;
    this.musicMode = 'intro';
    this.levelId = 1;
    this.step = 0;
    this.currentTrackIdx = 0;
    this.recentTracks = [];

    this.tracks = [
      { name: 'Трек 1 • Котовия-17', bpm: 108, root: 146.83, scale: [0, 3, 5, 7, 10, 12, 15] },
      { name: 'Трек 2 • Туманность Ом', bpm: 112, root: 130.81, scale: [0, 3, 7, 10, 12, 14, 17] },
      { name: 'Трек 3 • Калавера Даб', bpm: 104, root: 110.00, scale: [0, 3, 5, 7, 8, 12, 15] },
      { name: 'Трек 4 • Ванильный Грув', bpm: 116, root: 164.81, scale: [0, 4, 7, 9, 11, 14, 16] },
      { name: 'Трек 5 • Аква-Лагуна', bpm: 102, root: 138.59, scale: [0, 2, 5, 7, 9, 12, 14] },
      { name: 'Трек 6 • Джа-Регги Космос', bpm: 96, root: 123.47, scale: [0, 3, 5, 7, 10, 12, 14] },
      { name: 'Трек 7 • Споровый Транс', bpm: 120, root: 146.83, scale: [0, 1, 5, 7, 8, 12, 13] },
      { name: 'Трек 8 • Мурчащий Бас', bpm: 110, root: 98.00, scale: [0, 3, 5, 7, 10, 12, 15] }
    ];

    this._syncVolumeSlidersUI();
    this._bindCockpitUI();
  }

  _syncVolumeSlidersUI() {
    const mSlider = document.getElementById('music-vol');
    const mVal = document.getElementById('val-music-vol');
    if (mSlider) mSlider.value = String(Math.round(this.musicVolume * 100));
    if (mVal) mVal.textContent = `${Math.round(this.musicVolume * 100)}%`;

    const sSlider = document.getElementById('sfx-vol');
    const sVal = document.getElementById('val-sfx-vol');
    if (sSlider) sSlider.value = String(Math.round(this.sfxVolume * 100));
    if (sVal) sVal.textContent = `${Math.round(this.sfxVolume * 100)}%`;
  }

  _bindCockpitUI() {
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

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -22;
      this.compressor.knee.value = 20;
      this.compressor.ratio.value = 8;
      this.compressor.attack.value = 0.004;
      this.compressor.release.value = 0.18;

      this.lpf = this.ctx.createBiquadFilter();
      this.lpf.type = 'lowpass';
      this.lpf.frequency.value = this.warmthCutoff;
      this.lpf.Q.value = 0.75;

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.value = 0.27;
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.value = this.spaceMix * 0.42;
      const delayFb = this.ctx.createGain();
      delayFb.gain.value = 0.24;
      this.delayNode.connect(delayFb);
      delayFb.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.68;

      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();

      this.musicBus.connect(this.lpf);
      this.sfxBus.connect(this.lpf);
      this.lpf.connect(this.compressor);
      this.lpf.connect(this.delayNode);
      this.delayGain.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateMusicVolume();
      this.updateSfxVolume();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  updateMusicVolume() {
    if (!this.musicBus || !this.ctx) return;
    const target = (this.musicEnabled && !this.muted) ? (this.musicVolume * 0.48) : 0;
    this.musicBus.gain.setTargetAtTime(target, this.ctx.currentTime, 0.04);
  }

  updateSfxVolume() {
    if (!this.sfxBus || !this.ctx) return;
    const target = (this.sfxEnabled && !this.muted) ? (this.sfxVolume * this.sfxAttenuation * 0.58) : 0;
    this.sfxBus.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
  }

  setMasterVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    this.updateSfxVolume();
  }

  setWarmthCutoff(hz) {
    this.warmthCutoff = hz;
    if (this.lpf && this.ctx) {
      this.lpf.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.05);
    }
  }

  setSpaceMix(mix) {
    this.spaceMix = mix;
    if (this.delayGain && this.ctx) {
      this.delayGain.gain.setTargetAtTime(mix * 0.42, this.ctx.currentTime, 0.05);
    }
  }

  setPsyDrift(drift) {
    this.psyDrift = drift;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.68, this.ctx.currentTime, 0.03);
    }
    this.updateMusicVolume();
    this.updateSfxVolume();
    return this.muted;
  }

  getActiveVoiceCount() {
    return this.activeVoices;
  }

  _playVoice({
    bus = 'sfx',
    type = 'triangle',
    freq = 220,
    freqEnd = null,
    dur = 0.22,
    gain = 0.13,
    attack = 0.01,
    pan = 0,
    cutoff = null
  }) {
    if (!this.ctx || this.muted) return;
    if (bus === 'sfx' && !this.sfxEnabled) return;
    if (bus === 'music' && !this.musicEnabled) return;
    if (this.activeVoices >= this.maxVoices) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;

    const drift = this.psyDrift > 0 ? (Math.random() - 0.5) * 4 * this.psyDrift : 0;
    const f0 = Math.max(30, freq + drift);
    osc.frequency.setValueAtTime(f0, now);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(28, freqEnd), now + dur);
    }

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(Math.max(0.001, gain), now + Math.min(attack, dur * 0.4));
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    let tail = env;
    if (cutoff) {
      const flt = this.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = cutoff;
      osc.connect(flt);
      flt.connect(env);
    } else {
      osc.connect(env);
    }

    if (this.ctx.createStereoPanner && pan !== 0) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      env.connect(panner);
      tail = panner;
    }

    tail.connect(bus === 'music' ? this.musicBus : this.sfxBus);
    this.activeVoices++;
    osc.onended = () => {
      this.activeVoices = Math.max(0, this.activeVoices - 1);
      try { osc.disconnect(); } catch (e) {}
    };

    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  _playSoftNoise({ dur = 0.18, gain = 0.09, cutoff = 620, pan = 0 }) {
    if (!this.ctx || this.muted || !this.sfxEnabled || this.activeVoices >= this.maxVoices) return;
    const now = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.55;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const flt = this.ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.value = cutoff;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(Math.max(0.001, gain), now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(flt);
    flt.connect(env);
    env.connect(this.sfxBus);

    this.activeVoices++;
    src.onended = () => {
      this.activeVoices = Math.max(0, this.activeVoices - 1);
      try { src.disconnect(); } catch (e) {}
    };
    src.start(now);
    src.stop(now + dur + 0.02);
  }

  // --- Бортовой музыкальный плеер ---
  renderCockpitTrackGrid() {
    const titleEl = document.getElementById('cockpit-track-title');
    if (titleEl) titleEl.textContent = this.tracks[this.currentTrackIdx]?.name || 'Трек 1';

    const grid = document.getElementById('cockpit-track-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.tracks.forEach((tr, idx) => {
      const btn = document.createElement('button');
      btn.className = 'cockpit-track-chip' + (idx === this.currentTrackIdx ? ' active' : '');
      btn.textContent = `${idx + 1}`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.init();
        this.selectTrack(idx);
      });
      grid.appendChild(btn);
    });
  }

  selectTrack(idx) {
    this.currentTrackIdx = (idx + this.tracks.length) % this.tracks.length;
    this.recentTracks.push(this.currentTrackIdx);
    if (this.recentTracks.length > 4) this.recentTracks.shift();
    this.renderCockpitTrackGrid();
    this.sfxMenuSelect();
    if (this.musicTimer) this._restartSequencer();
  }

  prevTrack() {
    this.selectTrack(this.currentTrackIdx - 1);
  }

  nextTrack() {
    this.selectTrack(this.currentTrackIdx + 1);
  }

  startIntroMusic() {
    this.musicMode = 'intro';
    this._restartSequencer();
  }

  startMusic(mode = 'normal', levelId = 1) {
    this.musicMode = mode;
    this.levelId = levelId;
    const targetIdx = (levelId - 1) % this.tracks.length;
    if (this.currentTrackIdx !== targetIdx) {
      this.currentTrackIdx = targetIdx;
      this.renderCockpitTrackGrid();
    }
    this._restartSequencer();
  }

  setMusicMode(mode, levelId = this.levelId) {
    this.musicMode = mode;
    this.levelId = levelId;
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  pauseMusic() {
    this.stopMusic();
  }

  resumeMusic() {
    if (!this.musicTimer && this.musicEnabled) this._restartSequencer();
  }

  _restartSequencer() {
    this.stopMusic();
    this.renderCockpitTrackGrid();
    const tr = this.tracks[this.currentTrackIdx] || this.tracks[0];
    const stepMs = Math.round((60 / tr.bpm / 2) * 1000);
    this.step = 0;

    this.musicTimer = setInterval(() => {
      if (!this.ctx || !this.musicEnabled || this.muted) return;
      const track = this.tracks[this.currentTrackIdx] || this.tracks[0];
      const sc = track.scale;
      const s = this.step % 16;

      // Мягкий ASMR-бас
      if (s % 4 === 0 || (this.musicMode === 'boss' && s % 2 === 0)) {
        const deg = sc[(s / 2) % sc.length] || 0;
        const bassFreq = (track.root * 0.5) * Math.pow(2, deg / 12);
        this._playVoice({
          bus: 'music',
          type: 'sine',
          freq: bassFreq,
          dur: 0.34,
          gain: 0.14,
          attack: 0.02,
          cutoff: 400
        });
      }

      // Бархатный арпеджио-перебор
      if (s % 2 === 0) {
        const noteDeg = sc[(s + Math.floor(this.step / 16)) % sc.length];
        const leadFreq = track.root * Math.pow(2, (noteDeg + 12) / 12);
        this._playVoice({
          bus: 'music',
          type: 'triangle',
          freq: leadFreq,
          dur: 0.26,
          gain: 0.068,
          attack: 0.02,
          pan: Math.sin(this.step * 0.5) * 0.35,
          cutoff: 1150
        });
      }

      this.step++;
      if (this.step >= 128) {
        this.step = 0;
        this.nextTrack();
      }
    }, stepMs);
  }

  // --- Мягкие ASMR-спецэффекты (без писков и перегруза мобильного динамика) ---
  sfxScrollTick() {
    this._playVoice({ type: 'sine', freq: 310, freqEnd: 250, dur: 0.04, gain: 0.035, cutoff: 680 });
  }

  sfxMenuTap() {
    this._playVoice({ type: 'sine', freq: 360, freqEnd: 440, dur: 0.08, gain: 0.07, cutoff: 880 });
  }

  sfxMenuSelect() {
    this._playVoice({ type: 'triangle', freq: 350, freqEnd: 520, dur: 0.12, gain: 0.08, cutoff: 1050 });
  }

  sfxMenuTransition() {
    this._playVoice({ type: 'sine', freq: 230, freqEnd: 460, dur: 0.22, gain: 0.08, cutoff: 920 });
  }

  sfxBuyItem() {
    [440, 554, 659].forEach((f, idx) => {
      setTimeout(() => this._playVoice({ type: 'triangle', freq: f, dur: 0.18, gain: 0.08, cutoff: 1150 }), idx * 55);
    });
  }

  sfxCosmicHum() {
    this._playVoice({ type: 'sine', freq: 110, freqEnd: 165, dur: 0.45, gain: 0.09, cutoff: 480 });
  }

  playCosmicMeow() {
    this._playVoice({ type: 'triangle', freq: 300, freqEnd: 500, dur: 0.22, gain: 0.10, cutoff: 1050 });
    setTimeout(() => {
      this._playVoice({ type: 'sine', freq: 500, freqEnd: 280, dur: 0.32, gain: 0.095, cutoff: 920 });
    }, 170);
  }

  sfxShootWeapon(pan = 0, weaponId = 'droplet') {
    if (weaponId === 'electric_arc') {
      this._playVoice({ type: 'triangle', freq: 400, freqEnd: 200, dur: 0.09, gain: 0.055, pan, cutoff: 1050 });
    } else if (weaponId === 'wave_amp') {
      this._playVoice({ type: 'sine', freq: 280, freqEnd: 145, dur: 0.13, gain: 0.07, pan, cutoff: 820 });
    } else if (weaponId === 'rocket_launcher') {
      this._playVoice({ type: 'triangle', freq: 210, freqEnd: 105, dur: 0.14, gain: 0.07, pan, cutoff: 720 });
    } else {
      this._playVoice({ type: 'sine', freq: 440, freqEnd: 220, dur: 0.08, gain: 0.055, pan, cutoff: 950 });
    }
  }

  playCyberElectric(intensity = 0.7) {
    this._playVoice({ type: 'triangle', freq: 360, freqEnd: 185, dur: 0.12, gain: 0.06 * intensity, cutoff: 1020 });
  }

  sfxDroneShoot(kind = 'bullet') {
    const f = kind === 'electric' ? 380 : (kind === 'wave' ? 290 : 420);
    this._playVoice({ type: 'sine', freq: f, freqEnd: f * 0.55, dur: 0.07, gain: 0.04, cutoff: 860 });
  }

  sfxDroneSpecial() {
    this._playVoice({ type: 'sine', freq: 320, freqEnd: 640, dur: 0.25, gain: 0.08, cutoff: 1000 });
  }

  sfxHit() {
    this._playVoice({ type: 'sine', freq: 175, freqEnd: 92, dur: 0.08, gain: 0.065, cutoff: 620 });
  }

  sfxDisintegrate() {
    this._playSoftNoise({ dur: 0.10, gain: 0.05, cutoff: 580 });
  }

  sfxExplosion() {
    this._playVoice({ type: 'sine', freq: 130, freqEnd: 40, dur: 0.26, gain: 0.12, cutoff: 400 });
    this._playSoftNoise({ dur: 0.22, gain: 0.075, cutoff: 540 });
  }

  sfxBossExplosion() {
    this._playVoice({ type: 'sine', freq: 105, freqEnd: 32, dur: 0.55, gain: 0.15, cutoff: 360 });
    this._playSoftNoise({ dur: 0.45, gain: 0.10, cutoff: 580 });
  }

  sfxHurt() {
    this._playVoice({ type: 'triangle', freq: 205, freqEnd: 92, dur: 0.28, gain: 0.12, cutoff: 620 });
  }

  sfxShieldBlock() {
    this._playVoice({ type: 'sine', freq: 270, freqEnd: 500, dur: 0.18, gain: 0.085, cutoff: 960 });
  }

  sfxPowerup() {
    [392, 494, 587].forEach((f, idx) => {
      setTimeout(() => this._playVoice({ type: 'sine', freq: f, dur: 0.16, gain: 0.08, cutoff: 1100 }), idx * 50);
    });
  }

  sfxStarCollect() {
    this._playVoice({ type: 'sine', freq: 500, freqEnd: 650, dur: 0.12, gain: 0.07, cutoff: 1150 });
  }

  playStarCollect() {
    this.sfxStarCollect();
  }

  sfxPurrBoost() {
    this._playVoice({ type: 'triangle', freq: 135, freqEnd: 230, dur: 0.28, gain: 0.085, cutoff: 580 });
  }

  sfxGravity() {
    this._playVoice({ type: 'sine', freq: 250, freqEnd: 125, dur: 0.22, gain: 0.08, cutoff: 720 });
  }

  sfxWave() {
    this._playVoice({ type: 'sine', freq: 235, freqEnd: 135, dur: 0.18, gain: 0.07, cutoff: 680 });
  }

  sfxIgnite() {
    this._playSoftNoise({ dur: 0.16, gain: 0.068, cutoff: 700 });
  }

  sfxBossAlarm() {
    [215, 180].forEach((f, idx) => {
      setTimeout(() => this._playVoice({ type: 'triangle', freq: f, freqEnd: f * 0.85, dur: 0.24, gain: 0.10, cutoff: 680 }), idx * 220);
    });
  }

  sfxVictory() {
    [392, 494, 587, 784].forEach((f, idx) => {
      setTimeout(() => this._playVoice({ type: 'triangle', freq: f, dur: 0.24, gain: 0.085, cutoff: 1180 }), idx * 80);
    });
  }

  sfxGameOver() {
    [330, 277, 220, 165].forEach((f, idx) => {
      setTimeout(() => this._playVoice({ type: 'sine', freq: f, dur: 0.26, gain: 0.085, cutoff: 740 }), idx * 110);
    });
  }
}
