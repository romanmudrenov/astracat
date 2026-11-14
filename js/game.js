(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_3d_deluxe_v6';

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        bestScore: raw.bestScore || 0,
        completed: Array.isArray(raw.completed) ? raw.completed : [],
        loreSeen: Boolean(raw.loreSeen)
      };
    } catch (e) {
      return { bestScore: 0, completed: [], loreSeen: false };
    }
  }

  function saveProgress(prog) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {}
  }

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });

  const synth = typeof PolySynth !== 'undefined' ? new PolySynth() : null;
  const world3d = typeof World3DEngine !== 'undefined' ? new World3DEngine() : null;
  const vfx = typeof VFXEngine !== 'undefined' ? new VFXEngine() : null;

  const startOverlay = document.getElementById('start-overlay');
  const loreOverlay = document.getElementById('lore-overlay');
  const introOverlay = document.getElementById('intro-overlay');
  const settingsOverlay = document.getElementById('settings-overlay');
  const pauseOverlay = document.getElementById('pause-overlay');
  const endOverlay = document.getElementById('end-overlay');
  const pauseBtn = document.getElementById('pause-btn');
  const muteBtn = document.getElementById('mute-btn');

  let progress = loadProgress();
  let selectedLevelIdx = 0;
  let selectedDiffKey = 'normal';

  let W = 480;
  let H = 800;
  let dpr = 1;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(320, rect.width || window.innerWidth);
    H = Math.max(480, rect.height || window.innerHeight);
    // Оптимальный DPR для плавных 60 FPS на смартфонах
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // =========================================================================
  // ВЕРТИКАЛЬНЫЕ СЛАЙДЫ КОМИКСА (img/slide1.jpg, slide2.jpg, slide3.jpg)
  // =========================================================================
  const LORE_SLIDES = [
    {
      img: 'img/slide1.jpg',
      title: 'ПЛАНЕТА КОТОВИЯ-17',
      text: 'На родной планете Котовия-17 у кота по имени Редж заканчивается еда. Еда выдаётся только по талонам, а миски пустеют!'
    },
    {
      img: 'img/slide2.jpg',
      title: 'СЕКРЕТНЫЙ ОТРЯД «АСТРО-КОТ»',
      text: 'Редж — один из 10 отважных котов, отобранных для секретной программы освоения запасов еды дальнего космоса. Его ракета готова к старту!'
    },
    {
      img: 'img/slide3.jpg',
      title: 'БИТВА С ПОЖИРАТЕЛЯМИ КОСМОСА',
      text: 'Реджу предстоит исследовать 10 галактик и сразиться со злобными Пожирателями Космоса, чтобы наладить отправку вкусной еды на родную планету!'
    }
  ];

  let loreSlideIdx = 0;
  let lastRenderedSlideIdx = -1;
  let hasCustomSlideImg = false;
  const loreImg = document.getElementById('lore-img');
  const loreCanvas = document.getElementById('lore-canvas');
  const loreCtx = loreCanvas ? loreCanvas.getContext('2d') : null;

  function loadSlideImageIfExists(src) {
    if (!loreImg) return;
    hasCustomSlideImg = false;
    loreImg.classList.add('hidden');
    if (loreCanvas) loreCanvas.style.display = 'block';

    const probe = new Image();
    probe.onload = () => {
      hasCustomSlideImg = true;
      loreImg.src = src;
      loreImg.classList.remove('hidden');
      if (loreCanvas) loreCanvas.style.display = 'none';
    };
    probe.src = src;
  }

  function renderLoreSlide() {
    if (loreOverlay.classList.contains('hidden')) return;
    const slide = LORE_SLIDES[loreSlideIdx];
    if (lastRenderedSlideIdx !== loreSlideIdx) {
      lastRenderedSlideIdx = loreSlideIdx;
      document.getElementById('lore-title').textContent = slide.title;
      document.getElementById('lore-text').textContent = slide.text;
      document.getElementById('lore-next-btn').textContent =
        loreSlideIdx < LORE_SLIDES.length - 1 ? 'ДАЛЬШЕ ➔' : 'В МЕНЮ ИГРЫ 🚀';

      const dots = document.querySelectorAll('#lore-dots .dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === loreSlideIdx));
      loadSlideImageIfExists(slide.img);
    }

    if (hasCustomSlideImg || !loreCtx) return;
    const lw = loreCanvas.width;
    const lh = loreCanvas.height;
    loreCtx.fillStyle = '#140d33';
    loreCtx.fillRect(0, 0, lw, lh);
    drawPortraitCat(loreCtx, lw / 2, lh / 2, 1.3, loreSlideIdx > 0);
  }

  function drawPortraitCat(c, x, y, scale = 1, happy = true) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    c.lineJoin = 'round';
    c.lineCap = 'round';

    c.fillStyle = 'rgba(72, 219, 251, 0.24)';
    c.strokeStyle = '#48dbfb';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(0, 0, 42, 0, Math.PI * 2);
    c.fill(); c.stroke();

    c.fillStyle = '#ffb703';
    c.strokeStyle = INK;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-24, -14); c.lineTo(-20, -36); c.lineTo(-6, -22);
    c.moveTo(24, -14); c.lineTo(20, -36); c.lineTo(6, -22);
    c.fill(); c.stroke();

    c.beginPath();
    c.arc(0, 2, 28, 0, Math.PI * 2);
    c.fill(); c.stroke();

    c.strokeStyle = INK;
    c.lineWidth = 3.2;
    if (happy) {
      c.beginPath(); c.arc(-11, 0, 5.5, Math.PI, 0); c.stroke();
      c.beginPath(); c.arc(11, 0, 5.5, Math.PI, 0); c.stroke();
    } else {
      c.fillStyle = INK;
      c.beginPath(); c.arc(-11, 0, 3.8, 0, Math.PI * 2); c.arc(11, 0, 3.8, 0, Math.PI * 2); c.fill();
    }

    c.fillStyle = '#ff5964';
    c.beginPath(); c.arc(0, 6, 3.2, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  function openLoreSlides() {
    loreSlideIdx = 0;
    lastRenderedSlideIdx = -1;
    if (synth) { synth.init(); synth.sfxPowerup(); }
    startOverlay.classList.add('hidden');
    loreOverlay.classList.remove('hidden');
    renderLoreSlide();
  }

  document.getElementById('lore-open-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openLoreSlides();
  });

  document.getElementById('lore-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxHit(0);
    if (loreSlideIdx < LORE_SLIDES.length - 1) {
      loreSlideIdx++;
      renderLoreSlide();
    } else {
      finishLoreSlides();
    }
  });

  document.getElementById('lore-skip-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    finishLoreSlides();
  });

  function finishLoreSlides() {
    progress.loreSeen = true;
    saveProgress(progress);
    loreOverlay.classList.add('hidden');
    startOverlay.classList.remove('hidden');
  }

  // =========================================================================
  // МЕНЮ И НАСТРОЙКИ
  // =========================================================================
  const levelsGrid = document.getElementById('levels-grid');
  const selectedLevelInfo = document.getElementById('selected-level-info');

  function renderLevelGrid() {
    if (typeof LEVELS === 'undefined') return;
    levelsGrid.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      btn.className = 'lvl-btn' + (idx === selectedLevelIdx ? ' active' : '');
      const done = progress.completed.includes(lvl.id);
      btn.innerHTML = `<span>${lvl.id}</span><span class="star">${done ? '★' : '☆'}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (synth) { synth.init(); synth.sfxHit(0); }
        selectedLevelIdx = idx;
        renderLevelGrid();
      });
      levelsGrid.appendChild(btn);
    });

    const cur = LEVELS[selectedLevelIdx];
    selectedLevelInfo.innerHTML =
      `<strong>Сектор ${cur.id}: ${cur.name}</strong><br>` +
      `<span>Босс: ${cur.bossName}</span>`;
    document.getElementById('start-best').textContent =
      `Общий рекорд: ${progress.bestScore} • Пройдено: ${progress.completed.length}/10`;
  }
  renderLevelGrid();

  document.querySelectorAll('#diff-row .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) { synth.init(); synth.sfxHit(0); }
      selectedDiffKey = btn.dataset.diff;
      document.querySelectorAll('#diff-row .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function showIntro(idx) {
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    if (synth) { synth.init(); synth.sfxPowerup(); }

    document.getElementById('intro-sector-tag').textContent = `СЕКТОР ${lvl.id} / 10`;
    document.getElementById('intro-title').textContent = lvl.name.toUpperCase();
    document.getElementById('intro-story').textContent = lvl.story;
    document.getElementById('intro-hero-art').style.background =
      `radial-gradient(circle at 50% 35%, ${lvl.skyBot} 0%, ${lvl.skyTop} 100%)`;
    document.getElementById('intro-intel').innerHTML =
      `<div>👾 <b>Враги сектора:</b> ${lvl.enemiesDesc}</div>` +
      `<div>👑 <b>Пожиратель:</b> ${lvl.bossName}</div>` +
      `<div>⚡ <b>Оружие босса:</b> ${lvl.bossWeapon}</div>`;

    startOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    introOverlay.classList.remove('hidden');
  }

  document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    showIntro(selectedLevelIdx);
  });

  document.getElementById('intro-launch-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    startLevel(selectedLevelIdx);
  });

  document.getElementById('intro-back-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    introOverlay.classList.add('hidden');
    startOverlay.classList.remove('hidden');
  });

  let state = 'START';
  let prevStateBeforeSettings = 'START';

  function openSettings() {
    if (synth) synth.init();
    prevStateBeforeSettings = state;
    if (state === 'PLAYING') state = 'PAUSED';
    settingsOverlay.classList.remove('hidden');
  }

  function closeSettings() {
    settingsOverlay.classList.add('hidden');
    if (prevStateBeforeSettings === 'PLAYING') state = 'PLAYING';
  }

  document.getElementById('settings-open-btn').addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
  document.getElementById('menu-sound-btn').addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
  document.getElementById('settings-close-btn').addEventListener('click', (e) => { e.stopPropagation(); closeSettings(); });

  const toggleMusicBtn = document.getElementById('toggle-music');
  toggleMusicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!synth) return;
    synth.init();
    synth.musicEnabled = !synth.musicEnabled;
    toggleMusicBtn.textContent = synth.musicEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleMusicBtn.classList.toggle('off', !synth.musicEnabled);
    synth.updateMusicVolume();
  });

  const trackSelect = document.getElementById('track-select');
  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      if (!synth) return;
      synth.init();
      synth.selectedTrack = e.target.value;
      if (synth.selectedTrack !== 'auto') {
        synth.playTrack(synth.selectedTrack);
      } else if (state === 'PLAYING' || state === 'PAUSED') {
        synth.startMusic('normal');
      }
    });
  }

  const toggleSfxBtn = document.getElementById('toggle-sfx');
  toggleSfxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!synth) return;
    synth.init();
    synth.sfxEnabled = !synth.sfxEnabled;
    toggleSfxBtn.textContent = synth.sfxEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleSfxBtn.classList.toggle('off', !synth.sfxEnabled);
  });

  document.getElementById('music-vol').addEventListener('input', (e) => {
    if (synth) {
      synth.musicVolume = Number(e.target.value) / 100;
      synth.updateMusicVolume();
    }
  });

  document.getElementById('sfx-vol').addEventListener('input', (e) => {
    if (synth) synth.sfxVolume = Number(e.target.value) / 100;
  });

  document.querySelectorAll('#timbre-row .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!synth) return;
      synth.init();
      synth.timbre = btn.dataset.timbre;
      document.querySelectorAll('#timbre-row .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      synth.sfxPowerup();
    });
  });

  document.getElementById('test-chord-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) { synth.init(); synth.sfxExplosion(0, false); }
  });

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!synth) return;
    const muted = synth.toggleMute();
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

  // =========================================================================
  // СОСТОЯНИЕ ИГРЫ
  // =========================================================================
  let score = 0;
  let kills = 0;
  let combo = 1;
  let comboTimer = 0;
  let wave = 1;
  let waveTimer = 0;
  let spawnTimer = 0;
  let screenShake = 0;
  let warningBannerTimer = 0;
  let globalTime = 0;
  let victoryAnimTimer = 0;

  let player = null;
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let bonuses = [];
  let boss = null;

  const keys = {};
  const pointer = { active: false, x: 0, y: 0, isTouch: false };

  function togglePause() {
    if (state === 'PLAYING') {
      state = 'PAUSED';
      pointer.active = false;
      pauseOverlay.classList.remove('hidden');
    } else if (state === 'PAUSED' && settingsOverlay.classList.contains('hidden')) {
      state = 'PLAYING';
      pauseOverlay.classList.add('hidden');
    }
  }

  pauseBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePause(); });
  document.getElementById('resume-btn').addEventListener('click', (e) => { e.stopPropagation(); togglePause(); });

  function returnToMenu() {
    state = 'START';
    pointer.active = false;
    boss = null;
    enemies = [];
    bullets = [];
    enemyBullets = [];
    bonuses = [];
    if (vfx) vfx.clear();
    if (synth) synth.stopMusic();

    pauseOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    introOverlay.classList.add('hidden');
    loreOverlay.classList.add('hidden');
    pauseBtn.classList.add('hidden');

    renderLevelGrid();
    startOverlay.classList.remove('hidden');
  }

  ['pause-menu-btn', 'end-menu-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); returnToMenu(); });
  });

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyM' && synth) {
      const muted = synth.toggleMute();
      muteBtn.textContent = muted ? '🔇' : '🔊';
    }
    if (e.code === 'KeyP' || e.code === 'Escape') {
      if (state === 'PLAYING' || state === 'PAUSED') togglePause();
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  canvas.addEventListener('pointerdown', (e) => {
    if (state !== 'PLAYING') return;
    if (synth) synth.init();
    pointer.active = true;
    pointer.isTouch = e.pointerType === 'touch';
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top - (pointer.isTouch ? 48 : 0);
  });

  window.addEventListener('pointermove', (e) => {
    if (!pointer.active || state !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top - (pointer.isTouch ? 48 : 0);
  });

  window.addEventListener('pointerup', () => { pointer.active = false; });

  function startLevel(idx) {
    resize();
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];

    if (synth) {
      synth.init();
      synth.startMusic('normal');
    }

    score = 0;
    kills = 0;
    combo = 1;
    comboTimer = 0;
    wave = 1;
    waveTimer = 0;
    spawnTimer = 0.45;
    screenShake = 0;
    warningBannerTimer = 0;

    player = {
      x: W / 2,
      y: H - 105,
      vx: 0,
      vy: 0,
      r: 23,
      hp: diff.playerHp,
      maxHp: diff.playerHp,
      invuln: 0,
      fireCooldown: 0,
      secondaryWeapon: 'none',
      secondaryLevel: 1,
      shield: false,
      turboTimer: 0,
      squashX: 1,
      squashY: 1,
      blinkTimer: 2.5
    };

    bullets = [];
    enemyBullets = [];
    enemies = [];
    bonuses = [];
    boss = null;
    if (vfx) vfx.clear();

    state = 'PLAYING';
    startOverlay.classList.add('hidden');
    introOverlay.classList.add('hidden');
    loreOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    pauseBtn.classList.remove('hidden');

    if (world3d) world3d.setCameraFromPlayer(player.x, W);
    if (vfx) vfx.addPopup(W / 2, H * 0.36, `СЕКТОР ${lvl.id}: ВОЛНА 1 / 4`, lvl.accent, 1.15);
  }

  document.getElementById('next-level-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'VICTORY') {
      showIntro((selectedLevelIdx + 1) % LEVELS.length);
    } else {
      startLevel(selectedLevelIdx);
    }
  });

  function spawnEnemy() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp;
    const margin = 44;
    const x = margin + Math.random() * (W - margin * 2);

    const types = lvl.enemyTypes || ['ufo', 'meteor', 'space_fish'];
    const typeIdx = Math.floor(Math.random() * types.length);
    const kind = types[typeIdx];
    const isHeavy = typeIdx === 1;
    const hp = Math.max(1, Math.round((isHeavy ? 4 : 2) * hpScale));

    const patterns = ['zigzag', 'dash', 'figure8', 'erratic'];
    const movePattern = patterns[Math.floor(Math.random() * patterns.length)];

    enemies.push({
      kind,
      movePattern,
      x,
      y: -38,
      r: isHeavy ? 25 : 21,
      hp,
      maxHp: hp,
      baseVy: (isHeavy ? 105 : 138) * diff.bulletSpeed,
      vy: (isHeavy ? 105 : 138) * diff.bulletSpeed,
      vx: (Math.random() - 0.5) * 140,
      rot: 0,
      vrot: (Math.random() - 0.5) * 4.2,
      phase: Math.random() * Math.PI * 2,
      freq: 2.2 + Math.random() * 2.4,
      amp: 65 + Math.random() * 60,
      turnTimer: 0.5 + Math.random() * 1.1,
      shootTimer: (isHeavy ? 1.45 : 1.85) + Math.random() * 0.9,
      hitFlash: 0,
      points: isHeavy ? 180 : 120
    });
  }

  function spawnBoss() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const totalHp = Math.round(230 * lvl.hpMult * diff.enemyHp);

    boss = {
      x: W / 2,
      y: -110,
      targetY: Math.min(150, H * 0.22),
      r: 62,
      hp: totalHp,
      maxHp: totalHp,
      phase: 1,
      time: 0,
      hitFlash: 0,
      smokeTimer: 0,
      shootTimer: 1.1,
      specialTimer: 4.5,
      laserState: 'idle',
      laserTimer: 0,
      laserX: W / 2,
      crossLasers: { active: false, charging: false, timer: 0, angle: 0.35 }
    };
    warningBannerTimer = 2.4;
    if (synth) { synth.sfxBossAlarm(); synth.setMusicMode('boss'); }
    if (vfx) vfx.triggerFlash(lvl.accent, 0.28);
  }

  function maybeDropFoodBonus(x, y, guaranteed = false) {
    if (!guaranteed && Math.random() > 0.14) return;
    const foods = ['pizza', 'sushi', 'donut', 'burger', 'milk'];
    const chosen = foods[Math.floor(Math.random() * foods.length)];
    bonuses.push({ type: chosen, x, y, r: 18, vy: 108, phase: Math.random() * Math.PI * 2 });
  }

  function firePlayerWeapon(p, lvl) {
    const pan = ((p.x / W) * 2 - 1) * 0.7;
    if (synth) synth.sfxShootWeapon(pan, p.secondaryWeapon, p.secondaryLevel);

    bullets.push({
      kind: 'plasma',
      x: p.x,
      y: p.y - 25,
      vx: 0,
      vy: -710,
      r: 6.5,
      dmg: 1.1,
      color: lvl.accent
    });

    const lv2 = p.secondaryLevel >= 2;

    if (p.secondaryWeapon === 'pizza') {
      const angles = lv2 ? [-0.28, -0.14, 0.14, 0.28] : [-0.20, 0.20];
      angles.forEach(ang => {
        bullets.push({
          kind: 'pizza_slice',
          x: p.x,
          y: p.y - 22,
          vx: Math.sin(ang) * 670,
          vy: -Math.cos(ang) * 670,
          r: 7.5,
          dmg: 1.15,
          color: '#ffd166'
        });
      });
    } else if (p.secondaryWeapon === 'sushi') {
      const offsets = lv2 ? [-22, -12, 12, 22] : [-18, 18];
      offsets.forEach(ox => {
        bullets.push({
          kind: 'shuriken',
          homing: true,
          x: p.x + ox,
          y: p.y - 18,
          vx: ox * 4.5,
          vy: -610,
          rot: 0,
          r: 8.5,
          dmg: 1.4,
          color: '#06d6a0'
        });
      });
    } else if (p.secondaryWeapon === 'donut') {
      const offsets = lv2 ? [-26, -15, 15, 26] : [-20, 20];
      offsets.forEach(ox => {
        bullets.push({
          kind: 'laser_bolt',
          pierce: lv2 ? 3 : 2,
          x: p.x + ox,
          y: p.y - 20,
          vx: 0,
          vy: -890,
          r: 6.5,
          dmg: 1.35,
          color: '#ff70a6'
        });
      });
    } else if (p.secondaryWeapon === 'burger') {
      const offsets = lv2 ? [-16, 16] : [0];
      offsets.forEach(ox => {
        bullets.push({
          kind: 'burger_rocket',
          explosive: true,
          x: p.x + ox,
          y: p.y - 30,
          vx: 0,
          vy: -580,
          r: 11,
          dmg: 3.1,
          color: '#ff9f1c'
        });
      });
    }
  }

  function applyFoodBonus(bn) {
    if (synth) synth.sfxPowerup();
    player.squashX = 1.3;
    player.squashY = 1.3;
    if (vfx) {
      vfx.addShockwave(bn.x, bn.y, '#ffd166', 85, 0.42);
      vfx.addBurst(bn.x, bn.y, ['#ffd166', '#06d6a0', '#48dbfb', '#ffffff'], 14, 190);
    }

    if (bn.type === 'milk') {
      player.shield = true;
      score += 250;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🥛 МОЛОКО: ПЛАЗМО-ЩИТ!', '#48dbfb', 1.1);
      return;
    }

    if (bn.type === 'donut') player.turboTimer = 14;
    if (bn.type === 'burger' && player.hp < player.maxHp) player.hp++;

    if (player.secondaryWeapon === bn.type) {
      player.secondaryLevel = 2;
      score += 350;
    } else {
      player.secondaryWeapon = bn.type;
      player.secondaryLevel = 1;
      score += 250;
    }

    const titles = {
      pizza:  '🍕 +ОГНЕННЫЙ ВЕЕР',
      sushi:  '🍣 +АВТО-СЮРИКЕНЫ',
      donut:  '🍩 +ГИПЕР-ЛАЗЕРЫ',
      burger: '🍔 +БУРГЕР-РАКЕТЫ'
    };
    const suffix = player.secondaryLevel === 2 ? ' (УР.2!)' : '';
    if (vfx) vfx.addPopup(bn.x, bn.y, titles[bn.type] + suffix, '#ffd166', 1.12);
  }

  function fireUniqueBossWeapon(b, lvl, diff) {
    const pan = ((b.x / W) * 2 - 1) * 0.7;
    if (synth) synth.sfxHit(pan);
    const spd = 235 * diff.bulletSpeed;
    const toPlayer = player ? Math.atan2(player.y - b.y, player.x - b.x) : Math.PI / 2;

    switch (lvl.id) {
      case 1:
        b.shootTimer = b.phase === 3 ? 0.85 : 1.15;
        for (let k = -2; k <= 2; k++) {
          const ang = Math.PI / 2 + k * 0.22;
          enemyBullets.push({
            x: b.x + k * 12, y: b.y + 40,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 8, color: '#48dbfb'
          });
        }
        break;
      case 2:
        b.shootTimer = 1.05;
        for (let k = -1; k <= 1; k++) {
          const ang = toPlayer + k * 0.28;
          enemyBullets.push({
            x: b.x + k * 24, y: b.y + 38,
            vx: Math.cos(ang) * (spd * 0.9), vy: Math.sin(ang) * (spd * 0.9),
            r: 12, color: '#ffafcc'
          });
        }
        break;
      case 3:
        b.shootTimer = 1.25;
        [-45, -27, -9, 9, 27, 45].forEach(ox => {
          enemyBullets.push({
            x: b.x + ox, y: b.y + 32,
            vx: ox * 0.8, vy: spd * 1.15,
            r: 8.5, color: '#ff5964'
          });
        });
        break;
      case 4:
        b.shootTimer = 1.35;
        const sporeCount = b.phase === 3 ? 12 : 9;
        for (let k = 0; k < sporeCount; k++) {
          const ang = b.time * 1.5 + (Math.PI * 2 * k) / sporeCount;
          enemyBullets.push({
            x: b.x, y: b.y + 15,
            vx: Math.cos(ang) * (spd * 0.88), vy: Math.sin(ang) * (spd * 0.88),
            r: 7.5, color: '#80ed99'
          });
        }
        break;
      case 5:
        b.shootTimer = 0.72;
        [-18, 18].forEach(ox => {
          enemyBullets.push({
            x: b.x + ox, y: b.y + 35,
            vx: Math.cos(toPlayer) * (spd * 1.35),
            vy: Math.sin(toPlayer) * (spd * 1.35),
            r: 7.5, color: '#90e0ef'
          });
        });
        break;
      case 6:
        b.shootTimer = 0.95;
        [-58, 58].forEach(cx => {
          enemyBullets.push({
            x: b.x + cx, y: b.y + 24,
            vx: Math.cos(toPlayer) * spd, vy: Math.sin(toPlayer) * spd,
            r: 9, color: '#ffba08'
          });
        });
        enemyBullets.push({
          x: 40 + Math.random() * (W - 80), y: -15,
          vx: 0, vy: spd * 1.1,
          r: 10, color: '#ff5964'
        });
        break;
      case 7:
        b.shootTimer = 0.85;
        for (let k = -1; k <= 1; k++) {
          const ang = Math.PI / 2 + k * 0.35;
          enemyBullets.push({
            x: b.x, y: b.y + 30,
            vx: Math.cos(ang) * (spd * 1.25), vy: Math.sin(ang) * (spd * 1.25),
            r: 7, color: '#00f5d4'
          });
        }
        break;
      case 8:
        b.shootTimer = 0.42;
        for (let arm = 0; arm < 2; arm++) {
          const ang = b.time * 3.4 + arm * Math.PI;
          enemyBullets.push({
            x: b.x, y: b.y + 15,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 8, color: '#ffd166'
          });
        }
        break;
      case 9:
        b.shootTimer = 1.15;
        [-32, 32].forEach(ox => {
          enemyBullets.push({
            homing: true,
            life: 3.4,
            x: b.x + ox, y: b.y + 28,
            vx: ox * 1.5, vy: spd * 0.85,
            r: 9, color: '#bdb2ff'
          });
        });
        break;
      case 10:
      default:
        b.shootTimer = 0.68;
        for (let k = -2; k <= 2; k++) {
          const ang = toPlayer + k * 0.19;
          enemyBullets.push({
            x: b.x, y: b.y + 36,
            vx: Math.cos(ang) * (spd * 1.15), vy: Math.sin(ang) * (spd * 1.15),
            r: 8, color: '#ff006e'
          });
        }
        break;
    }
  }

  function update(dt) {
    globalTime += dt;

    if (state === 'VICTORY' && !endOverlay.classList.contains('hidden')) {
      victoryAnimTimer += dt;
      if (victoryAnimTimer > 0.05) {
        victoryAnimTimer = 0;
        renderVictoryCat(globalTime);
      }
    }

    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];

    if (world3d) world3d.update(dt, player && player.turboTimer > 0);
    if (vfx) vfx.update(dt);

    if (state !== 'PLAYING') return;

    if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 28);
    if (warningBannerTimer > 0) warningBannerTimer = Math.max(0, warningBannerTimer - dt);

    if (comboTimer > 0) {
      comboTimer -= dt;
      if (comboTimer <= 0) combo = 1;
    }

    waveTimer += dt;
    if (!boss) {
      if (wave === 1 && waveTimer > 22) {
        wave = 2;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 2 / 4!', lvl.accent, 1.2);
      } else if (wave === 2 && waveTimer > 44) {
        wave = 3;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 3 / 4: ШТУРМ!', lvl.accent, 1.2);
      } else if (wave === 3 && waveTimer > 66) {
        wave = 4;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 4 / 4: ЭЛИТА!', '#ffd166', 1.25);
      } else if (wave === 4 && waveTimer > 85) {
        wave = 5;
        spawnBoss();
      }

      if (wave <= 4) {
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnEnemy();
          const rates = [0, 0.95, 0.82, 0.70, 0.58];
          spawnTimer = (rates[wave] || 0.75) * diff.spawnRate;
        }
      }
    }

    const p = player;
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
    if (p.turboTimer > 0) p.turboTimer = Math.max(0, p.turboTimer - dt);

    p.blinkTimer -= dt;
    if (p.blinkTimer < -0.14) p.blinkTimer = 2.4 + Math.random() * 2;

    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    const moveSpeed = p.turboTimer > 0 ? 450 : 355;
    let ix = 0, iy = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) ix -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) ix += 1;
    if (keys['ArrowUp'] || keys['KeyW']) iy -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) iy += 1;

    if (ix !== 0 || iy !== 0) {
      const len = Math.hypot(ix, iy);
      p.vx = (ix / len) * moveSpeed;
      p.vy = (iy / len) * moveSpeed;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    } else if (pointer.active) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      p.vx = dx * 12;
      p.vy = dy * 12;
      p.x += dx * Math.min(1, dt * 14);
      p.y += dy * Math.min(1, dt * 14);
    } else {
      p.vx *= 0.82;
      p.vy *= 0.82;
    }

    const pad = 28;
    p.x = Math.max(pad, Math.min(W - pad, p.x));
    p.y = Math.max(pad + 30, Math.min(H - pad, p.y));

    if (world3d) world3d.setCameraFromPlayer(p.x, W);

    p.fireCooldown -= dt;
    const wantsFire = keys['Space'] || keys['KeyZ'] || pointer.active;
    const fireInterval = p.turboTimer > 0 ? 0.13 : 0.18;

    if (wantsFire && p.fireCooldown <= 0) {
      p.fireCooldown = fireInterval;
      p.squashX = 1.13;
      p.squashY = 0.89;
      firePlayerWeapon(p, lvl);
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      if (b.homing) {
        b.rot = (b.rot || 0) + dt * 16;
        let target = boss;
        let bestDist = boss ? Math.hypot(boss.x - b.x, boss.y - b.y) : 9999;
        for (const e of enemies) {
          const d = Math.hypot(e.x - b.x, e.y - b.y);
          if (d < bestDist) { bestDist = d; target = e; }
        }
        if (target && bestDist < 420) {
          const ang = Math.atan2(target.y - b.y, target.x - b.x);
          b.vx += Math.cos(ang) * 1650 * dt;
          b.vy += Math.sin(ang) * 1650 * dt;
          const spd = Math.hypot(b.vx, b.vy);
          if (spd > 680) { b.vx = (b.vx / spd) * 680; b.vy = (b.vy / spd) * 680; }
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (vfx && b.kind !== 'plasma' && vfx.trails.length < 45) {
        vfx.addTrail(b.x, b.y + 6, b.color, b.r * 0.65, 0.16);
      }

      if (b.y < -30 || b.x < -30 || b.x > W + 30) bullets.splice(i, 1);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.phase += dt * e.freq;
      e.rot += e.vrot * dt;

      if (e.movePattern === 'zigzag') {
        e.turnTimer -= dt;
        if (e.turnTimer <= 0) {
          e.turnTimer = 0.55 + Math.random() * 0.85;
          e.vx = (Math.random() > 0.5 ? 1 : -1) * (110 + Math.random() * 110);
        }
        e.x += e.vx * dt;
        e.y += e.baseVy * dt;
      } else if (e.movePattern === 'dash') {
        const burst = 0.45 + Math.max(0, Math.sin(e.phase * 1.4)) * 1.45;
        e.y += e.baseVy * burst * dt;
        e.x += Math.cos(e.phase * 1.3) * e.amp * 1.15 * dt;
      } else if (e.movePattern === 'figure8') {
        e.y += (e.baseVy + Math.sin(e.phase * 2) * 85) * dt;
        e.x += Math.cos(e.phase) * e.amp * 1.35 * dt;
      } else {
        e.turnTimer -= dt;
        if (e.turnTimer <= 0) {
          e.turnTimer = 0.65 + Math.random() * 0.9;
          const towardsPlayer = Math.random() < 0.45 && player;
          if (towardsPlayer) {
            e.vx = Math.sign(player.x - e.x) * (120 + Math.random() * 90);
          } else {
            e.vx = (Math.random() - 0.5) * 260;
          }
          e.vy = e.baseVy * (0.7 + Math.random() * 0.85);
        }
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }

      if (e.x < e.r + 10) {
        e.x = e.r + 10;
        e.vx = Math.abs(e.vx);
      } else if (e.x > W - e.r - 10) {
        e.x = W - e.r - 10;
        e.vx = -Math.abs(e.vx);
      }

      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6);

      e.shootTimer -= dt;
      if (e.shootTimer <= 0 && e.y > 40 && e.y < H * 0.68) {
        e.shootTimer = 1.85 / diff.bulletSpeed;
        const ang = Math.atan2(p.y - e.y, p.x - e.x);
        const spd = 225 * diff.bulletSpeed;
        enemyBullets.push({
          x: e.x, y: e.y + e.r * 0.7,
          vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
          r: 7, color: lvl.accent
        });
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + b.r) {
          e.hp -= b.dmg;
          e.hitFlash = 1;

          if (b.explosive) {
            if (vfx) {
              vfx.triggerFlash('#ffbe0b', 0.14);
              vfx.addShockwave(b.x, b.y, '#ff9f1c', 85, 0.36);
              vfx.addBurst(b.x, b.y, ['#ff9f1c', '#ff5964', '#ffd166', '#ffffff'], 12, 210);
            }
            bullets.splice(j, 1);
          } else if (b.pierce && b.pierce > 0) {
            b.pierce--;
            if (vfx) vfx.addBurst(b.x, b.y, ['#ff70a6', '#ffffff'], 4, 100);
          } else {
            if (vfx) vfx.addBurst(b.x, b.y, ['#ffd166', '#ffffff'], 5, 110);
            bullets.splice(j, 1);
          }

          if (e.hp <= 0) {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            if (synth) synth.sfxExplosion(pan, false);
            if (vfx) {
              vfx.addShockwave(e.x, e.y, lvl.accent, 75, 0.36);
              vfx.addBurst(e.x, e.y, ['#ff5964', '#ffd166', lvl.accent, '#ffffff'], 15, 225);
            }
            const pts = Math.round(e.points * combo * diff.scoreMult);
            score += pts;
            kills++;
            combo = Math.min(5, combo + 1);
            comboTimer = 3.2;
            if (vfx) vfx.addPopup(e.x, e.y, `+${pts}`, '#ffd166');
            maybeDropFoodBonus(e.x, e.y, false);
            enemies.splice(i, 1);
            screenShake = Math.max(screenShake, 5.5);
          } else {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            if (synth) synth.sfxHit(pan);
          }
          break;
        }
      }

      if (!enemies[i]) continue;

      if (Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r - 4) {
        enemies.splice(i, 1);
        if (vfx) {
          vfx.addShockwave(e.x, e.y, '#ff5964', 70, 0.35);
          vfx.addBurst(e.x, e.y, ['#ff5964', '#ffd166', '#ffffff'], 14, 200);
        }
        damagePlayer();
        continue;
      }

      if (e.y > H + 50) enemies.splice(i, 1);
    }

    if (boss) updateBoss(dt);

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];

      if (eb.homing && eb.life > 0) {
        eb.life -= dt;
        const ang = Math.atan2(p.y - eb.y, p.x - eb.x);
        eb.vx += Math.cos(ang) * 260 * dt;
        eb.vy += Math.sin(ang) * 260 * dt;
      }

      eb.x += eb.vx * dt;
      eb.y += eb.vy * dt;

      if (Math.hypot(eb.x - p.x, eb.y - p.y) < p.r + eb.r - 4) {
        enemyBullets.splice(i, 1);
        damagePlayer();
        continue;
      }
      if (eb.y > H + 25 || eb.y < -40 || eb.x < -25 || eb.x > W + 25) {
        enemyBullets.splice(i, 1);
      }
    }

    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bn = bonuses[i];
      bn.phase += dt * 5;
      bn.y += bn.vy * dt;

      if (p.turboTimer > 0) {
        const dx = p.x - bn.x;
        const dy = p.y - bn.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 1) {
          bn.x += (dx / dist) * 340 * dt;
          bn.y += (dy / dist) * 340 * dt;
        }
      }

      if (Math.hypot(p.x - bn.x, p.y - bn.y) < p.r + bn.r + 5) {
        applyFoodBonus(bn);
        bonuses.splice(i, 1);
        continue;
      }
      if (bn.y > H + 30) bonuses.splice(i, 1);
    }
  }

  function updateBoss(dt) {
    const b = boss;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];

    b.time += dt;
    if (b.hitFlash > 0) b.hitFlash = Math.max(0, b.hitFlash - dt * 7);

    if (b.y < b.targetY) {
      b.y += 95 * dt;
      return;
    }

    const hpRatio = b.hp / b.maxHp;
    b.phase = hpRatio > 0.65 ? 1 : (hpRatio > 0.30 ? 2 : 3);

    if (b.phase === 3 && vfx) {
      b.smokeTimer -= dt;
      if (b.smokeTimer <= 0) {
        b.smokeTimer = 0.16;
        vfx.addSmoke(b.x, b.y);
      }
    }

    const sweepSpeed = (b.phase === 3 ? 2.1 : (b.phase === 2 ? 1.55 : 1.15)) + selectedLevelIdx * 0.05;
    const span = Math.max(60, W / 2 - b.r - 24);
    b.x = W / 2 + Math.sin(b.time * sweepSpeed) * span;

    b.shootTimer -= dt;
    if (b.shootTimer <= 0) {
      fireUniqueBossWeapon(b, lvl, diff);
    }

    b.specialTimer -= dt;
    if (b.specialTimer <= 0) {
      if (b.phase === 2) {
        b.specialTimer = 5.4;
        if (enemies.length < 3) spawnEnemy();
        maybeDropFoodBonus(b.x, b.y + 45, true);
      } else if (b.phase === 3) {
        if (lvl.id === 7 && !b.crossLasers.active) {
          b.crossLasers.active = true;
          b.crossLasers.charging = true;
          b.crossLasers.timer = 1.1;
          b.crossLasers.angle = 0.48;
          if (synth) synth.sfxBossAlarm();
        } else if (b.laserState === 'idle') {
          b.laserState = 'charge';
          b.laserTimer = 1.1;
          b.laserX = player.x;
          if (synth) synth.sfxBossAlarm();
        }
      }
    }

    if (b.crossLasers.active) {
      b.crossLasers.timer -= dt;
      if (b.crossLasers.charging) {
        if (b.crossLasers.timer <= 0) {
          b.crossLasers.charging = false;
          b.crossLasers.timer = 1.2;
          if (synth) synth.sfxExplosion(0, true);
        }
      } else {
        b.crossLasers.angle = Math.max(0.08, b.crossLasers.angle - dt * 0.28);
        const dy = player.y - (b.y + 15);
        if (dy > 0) {
          const beamOffset = Math.tan(b.crossLasers.angle) * dy;
          if (Math.abs(Math.abs(player.x - b.x) - beamOffset) < 22 + player.r * 0.5) {
            damagePlayer();
          }
        }
        if (b.crossLasers.timer <= 0) {
          b.crossLasers.active = false;
          b.specialTimer = 4.2;
        }
      }
    }

    if (b.laserState === 'charge') {
      b.laserTimer -= dt;
      b.laserX += (player.x - b.laserX) * Math.min(1, dt * 3.5);
      if (b.laserTimer <= 0) {
        b.laserState = 'fire';
        b.laserTimer = 0.72;
        if (synth) synth.sfxExplosion(0, true);
        if (vfx) vfx.triggerFlash('#ff006e', 0.3);
        screenShake = 8;
      }
    } else if (b.laserState === 'fire') {
      b.laserTimer -= dt;
      if (Math.abs(player.x - b.laserX) < 26 + player.r * 0.6 && player.y > b.y) {
        damagePlayer();
      }
      if (b.laserTimer <= 0) {
        b.laserState = 'idle';
        b.specialTimer = 4.2;
      }
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const bul = bullets[j];
      if (Math.hypot(bul.x - b.x, bul.y - b.y) < b.r + bul.r - 6) {
        bullets.splice(j, 1);
        b.hp -= bul.dmg;
        b.hitFlash = 1;
        score += 25;
        if (vfx) {
          if (bul.explosive) vfx.addShockwave(bul.x, bul.y, '#ff9f1c', 90, 0.38);
          vfx.addBurst(bul.x, bul.y, ['#ffd166', lvl.accent, '#ffffff'], 6, 150);
        }

        if (b.hp <= 0) {
          score += Math.round((2500 + lvl.id * 400) * diff.scoreMult);
          kills++;
          if (synth) synth.sfxExplosion(0, true);
          if (vfx) {
            vfx.triggerFlash('#ffffff', 0.55);
            vfx.addShockwave(b.x, b.y, '#ffd166', 200, 0.65);
            vfx.addBurst(b.x, b.y, ['#ff5964', '#ffd166', '#06d6a0', lvl.accent, '#ffffff'], 36, 330);
          }
          screenShake = 18;
          boss = null;
          enemyBullets = [];
          enemies = [];
          finishGame(true);
          return;
        }
      }
    }
  }

  function damagePlayer() {
    if (player.invuln > 0 || state !== 'PLAYING') return;

    if (player.shield) {
      player.shield = false;
      player.invuln = 1.1;
      player.squashX = 1.3;
      player.squashY = 0.75;
      if (synth) synth.sfxShieldBlock();
      if (vfx) {
        vfx.addShockwave(player.x, player.y, '#48dbfb', 95, 0.42);
        vfx.addBurst(player.x, player.y, ['#48dbfb', '#ffffff'], 15, 210);
        vfx.addPopup(player.x, player.y - 20, 'ЩИТ ПОГЛОТИЛ УДАР!', '#48dbfb');
      }
      screenShake = 6;
      return;
    }

    player.hp--;
    player.invuln = 1.5;
    player.squashX = 0.72;
    player.squashY = 1.32;
    if (player.secondaryLevel > 1) player.secondaryLevel = 1;
    else player.secondaryWeapon = 'none';
    combo = 1;
    screenShake = 12;
    if (synth) synth.sfxHurt();
    if (vfx) {
      vfx.triggerFlash('#ff5964', 0.35);
      vfx.addBurst(player.x, player.y, ['#ff5964', '#ffd166', '#ffffff'], 16, 210);
    }

    if (player.hp <= 0) finishGame(false);
  }

  const victoryCatCanvas = document.getElementById('victory-cat-canvas');
  const victoryCatCtx = victoryCatCanvas ? victoryCatCanvas.getContext('2d') : null;

  function renderVictoryCat(t) {
    if (!victoryCatCtx) return;
    const vw = victoryCatCanvas.width;
    const vh = victoryCatCanvas.height;
    victoryCatCtx.clearRect(0, 0, vw, vh);

    if (typeof drawFoodBonus === 'function') {
      drawFoodBonus(victoryCatCtx, { type: 'pizza', x: 64, y: 52 + Math.sin(t * 4) * 6, r: 16, phase: t * 3 });
      drawFoodBonus(victoryCatCtx, { type: 'sushi', x: 74, y: 105 + Math.cos(t * 4) * 6, r: 16, phase: t * 3 + 1 });
      drawFoodBonus(victoryCatCtx, { type: 'burger', x: 256, y: 54 + Math.cos(t * 4) * 6, r: 16, phase: t * 3 + 2 });
      drawFoodBonus(victoryCatCtx, { type: 'donut', x: 246, y: 106 + Math.sin(t * 4) * 6, r: 16, phase: t * 3 + 3 });
    }

    const jumpY = vh / 2 + 4 + Math.abs(Math.sin(t * 5)) * -8;
    drawPortraitCat(victoryCatCtx, vw / 2, jumpY, 1.15, true);

    victoryCatCtx.fillStyle = '#72efdd';
    victoryCatCtx.font = '900 12px sans-serif';
    victoryCatCtx.textAlign = 'center';
    victoryCatCtx.fillText('МУР-МЯУ! ЕДА ДЛЯ КОТОВИИ-17!', vw / 2, 18);
  }

  function finishGame(victory) {
    state = victory ? 'VICTORY' : 'GAMEOVER';
    pointer.active = false;
    pauseBtn.classList.add('hidden');
    if (synth) synth.stopMusic();

    const lvl = LEVELS[selectedLevelIdx];
    const victoryWrap = document.getElementById('victory-cat-wrap');

    if (victory) {
      if (synth) synth.sfxVictory();
      if (!progress.completed.includes(lvl.id)) progress.completed.push(lvl.id);
      if (victoryWrap) {
        victoryWrap.classList.remove('hidden');
        renderVictoryCat(globalTime);
      }
    } else {
      if (synth) synth.sfxGameOver();
      if (victoryWrap) victoryWrap.classList.add('hidden');
    }

    if (score > progress.bestScore) progress.bestScore = score;
    saveProgress(progress);

    document.getElementById('end-badge').textContent = victory
      ? `Сектор ${lvl.id} зачищен!`
      : `Сектор ${lvl.id}: Корабль подбит`;
    document.getElementById('end-title').textContent = victory
      ? (lvl.id === 10 ? 'КОТОВИЯ-17 СПАСЕНА! 👑' : 'МИССИЯ ВЫПОЛНЕНА! 🏆')
      : 'ИГРА ОКОНЧЕНА';
    document.getElementById('end-subtitle').textContent = victory
      ? `${lvl.bossName} повержен! Редж отправил груз еды на родную планету!`
      : 'Попробуй ещё раз — подбери блюдо, чтобы получить второе орудие!';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-best').textContent = progress.bestScore;
    document.getElementById('final-kills').textContent = kills;

    const nextBtn = document.getElementById('next-level-btn');
    if (victory) {
      nextBtn.textContent = lvl.id < 10 ? `СЕКТОР ${lvl.id + 1} ➔` : 'ЗАНОВО С 1-ГО ➔';
    } else {
      nextBtn.textContent = 'ЕЩЁ РАЗ 🔄';
    }

    setTimeout(() => { endOverlay.classList.remove('hidden'); }, victory ? 480 : 320);
  }

  function drawPlayer(p) {
    if (p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    const tilt = Math.max(-0.24, Math.min(0.24, p.vx * 0.00055));
    ctx.rotate(tilt);
    ctx.scale(p.squashX, p.squashY);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.fillStyle = 'rgba(8, 5, 22, 0.36)';
    ctx.beginPath();
    ctx.ellipse(5, 27, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const flameH = 16 + Math.sin(globalTime * 38) * 5 + (p.turboTimer > 0 ? 10 : 0);
    [-11, 11].forEach(ox => {
      ctx.fillStyle = p.turboTimer > 0 ? '#06d6a0' : '#ff9f1c';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox - 6, 18);
      ctx.lineTo(ox, 18 + flameH);
      ctx.lineTo(ox + 6, 18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    });

    ctx.fillStyle = '#ff5964';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -2); ctx.lineTo(-32, 16); ctx.lineTo(-12, 20);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(14, -2); ctx.lineTo(32, 16); ctx.lineTo(12, 20);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    if (p.secondaryWeapon !== 'none') {
      ctx.fillStyle = '#ffd166';
      [-24, 24].forEach(wx => {
        roundRectPath(ctx, wx - 4, -2, 8, 16, 4);
        ctx.fill(); ctx.stroke();
      });
    }

    ctx.fillStyle = '#fff8eb';
    ctx.beginPath();
    ctx.ellipse(0, 2, 18, 26, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, -14, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#48dbfb';
    ctx.beginPath();
    ctx.arc(0, -1, 13, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(-8, -4); ctx.lineTo(-6, -11); ctx.lineTo(-2, -6);
    ctx.moveTo(8, -4); ctx.lineTo(6, -11); ctx.lineTo(2, -6);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = INK;
    if (p.blinkTimer < 0) {
      ctx.fillRect(-5, -1, 3.5, 1.5);
      ctx.fillRect(1.5, -1, 3.5, 1.5);
    } else {
      ctx.beginPath();
      ctx.arc(-3.2, -1, 1.7, 0, Math.PI * 2);
      ctx.arc(3.2, -1, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, 1.8, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-5, -6, 4, 2.2, -0.5, 0, Math.PI * 2);
    ctx.fill();

    if (p.shield) {
      const pulse = 34 + Math.sin(globalTime * 8) * 2.5;
      ctx.strokeStyle = '#48dbfb';
      ctx.fillStyle = 'rgba(72, 219, 251, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulse, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  function drawHUD() {
    if ((state !== 'PLAYING' && state !== 'PAUSED') || !player) return;
    const lvl = LEVELS[selectedLevelIdx];

    ctx.save();
    for (let i = 0; i < player.maxHp; i++) {
      const hx = 22 + i * 24;
      const hy = 26;
      ctx.fillStyle = i < player.hp ? '#ff5964' : 'rgba(255,255,255,0.2)';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(hx - 4, hy, 5.5, 0, Math.PI * 2);
      ctx.arc(hx + 4, hy, 5.5, 0, Math.PI * 2);
      ctx.moveTo(hx - 9, hy + 2);
      ctx.lineTo(hx, hy + 11);
      ctx.lineTo(hx + 9, hy + 2);
      ctx.fill(); ctx.stroke();
    }

    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.font = '900 21px sans-serif';
    ctx.textAlign = 'left';
    ctx.strokeText(`${score}`, 18, 62);
    ctx.fillText(`${score}`, 18, 62);

    ctx.fillStyle = lvl.accent;
    ctx.font = '800 12px sans-serif';
    const waveLabel = boss ? 'БОСС' : `ВОЛНА ${Math.min(4, wave)}/4`;
    const subHud = combo > 1
      ? `СЕКТОР ${lvl.id} • ${waveLabel} • x${combo}`
      : `СЕКТОР ${lvl.id} • ${waveLabel}`;
    ctx.strokeText(subHud, 18, 80);
    ctx.fillText(subHud, 18, 80);

    if (player.secondaryWeapon !== 'none') {
      const wLabels = {
        pizza:  '🍕 ПЛАЗМА + ВЕЕР',
        sushi:  '🍣 ПЛАЗМА + СЮРИКЕНЫ',
        donut:  '🍩 ПЛАЗМА + ЛАЗЕРЫ',
        burger: '🍔 ПЛАЗМА + РАКЕТЫ'
      };
      ctx.fillStyle = '#ffd166';
      ctx.font = '900 12px sans-serif';
      const wText = wLabels[player.secondaryWeapon] + (player.secondaryLevel === 2 ? ' (УР.2)' : '');
      ctx.strokeText(wText, 18, 98);
      ctx.fillText(wText, 18, 98);
    }

    if (boss) {
      const bw = Math.min(320, W - 170);
      const bx = (W - bw) / 2;
      const by = 18;

      ctx.fillStyle = '#ffd166';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(lvl.bossName.toUpperCase(), W / 2, by + 32);
      ctx.fillText(lvl.bossName.toUpperCase(), W / 2, by + 32);

      roundRectPath(ctx, bx, by, bw, 15, 8);
      ctx.fillStyle = INK;
      ctx.fill();

      const fillW = Math.max(0, (bw - 6) * (boss.hp / boss.maxHp));
      if (fillW > 0) {
        roundRectPath(ctx, bx + 3, by + 3, fillW, 9, 5);
        ctx.fillStyle = boss.phase === 3 ? '#ff006e' : '#ff5964';
        ctx.fill();
      }
    }

    if (warningBannerTimer > 0 && Math.floor(warningBannerTimer * 6) % 2 === 0) {
      ctx.fillStyle = '#ff5964';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.font = '900 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44);
      ctx.fillText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44);
    }

    ctx.restore();
  }

  function render() {
    const lvl = LEVELS[selectedLevelIdx];
    ctx.save();
    if (screenShake > 0) {
      ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    }

    if (world3d) {
      world3d.render(ctx, lvl, W, H, player && player.turboTimer > 0);
    } else {
      ctx.fillStyle = lvl.skyMid;
      ctx.fillRect(0, 0, W, H);
    }

    if (vfx) vfx.renderTrails(ctx);

    for (const bn of bonuses) {
      if (typeof drawFoodBonus === 'function') drawFoodBonus(ctx, bn);
    }

    for (const b of bullets) {
      if (typeof drawPlayerBullet === 'function') drawPlayerBullet(ctx, b);
    }

    for (const e of enemies) {
      if (typeof drawUniqueEnemy === 'function') drawUniqueEnemy(ctx, e);
    }
    if (boss && typeof drawUniqueBoss === 'function') {
      drawUniqueBoss(ctx, boss, lvl, player, H);
    }

    for (const eb of enemyBullets) {
      ctx.fillStyle = eb.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, eb.r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eb.x - 2, eb.y - 2, eb.r * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    if (player && state !== 'GAMEOVER' && state !== 'START') {
      drawPlayer(player);
    }

    if (vfx) vfx.renderForeground(ctx, W, H);

    drawHUD();
    ctx.restore();
  }

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    try {
      update(dt);
      render();
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pointer.active = false;
    else lastTime = performance.now();
  });

  // Автоматический запуск вертикального комикса при открытии ссылки
  loreOverlay.classList.remove('hidden');
  startOverlay.classList.add('hidden');
  renderLoreSlide();

  requestAnimationFrame(loop);
})();
