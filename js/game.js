(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_3d_deluxe_v7';

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
      `<div>🛸 <b>Корабли врагов:</b> ${lvl.enemiesDesc}</div>` +
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
  // СОСТОЯНИЕ ИГРЫ, ПРЕПЯТСТВИЯ И НЕСТАНДАРТНЫЕ СИТУАЦИИ НА КАРТЕ
  // =========================================================================
  let score = 0;
  let kills = 0;
  let combo = 1;
  let comboTimer = 0;
  let wave = 1;
  let waveTimer = 0;
  let spawnTimer = 0;
  let obstacleTimer = 4.5;
  let eventTimer = 14.0;
  let activeEvent = null; // { type: 'gravity' | 'wave' | 'sticky' | 'ignite' | 'underwater', timer, x, y, dir }
  let screenShake = 0;
  let warningBannerTimer = 0;
  let globalTime = 0;
  let victoryAnimTimer = 0;

  let player = null;
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let obstacles = [];
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
    obstacles = [];
    bullets = [];
    enemyBullets = [];
    bonuses = [];
    activeEvent = null;
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
      if (lvl.theme === 'underwater') synth.sfxUnderwater(0);
      else synth.sfxCosmicHum();
    }

    score = 0;
    kills = 0;
    combo = 1;
    comboTimer = 0;
    wave = 1;
    waveTimer = 0;
    spawnTimer = 0.45;
    obstacleTimer = 3.5;
    eventTimer = 12.0;
    activeEvent = null;
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
      stickyTimer: 0,
      squashX: 1,
      squashY: 1,
      blinkTimer: 2.5
    };

    bullets = [];
    enemyBullets = [];
    enemies = [];
    obstacles = [];
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

  // Спавн статичных препятствий на карте, которые нужно облетать
  function spawnObstacle() {
    const lvl = LEVELS[selectedLevelIdx];
    const margin = 52;
    const x = margin + Math.random() * (W - margin * 2);
    obstacles.push({
      kind: lvl.obstacleKind || 'tech_bulkhead',
      x,
      y: -45,
      r: 24,
      vy: 95
    });
  }

  // Нестандартные ситуации на протяжении всей карты
  function triggerRandomAnomaly(lvl) {
    const pool = ['gravity', 'wave', 'sticky', 'ignite'];
    if (lvl.theme === 'underwater') pool.push('underwater');
    const type = pool[Math.floor(Math.random() * pool.length)];

    if (type === 'gravity') {
      activeEvent = {
        type: 'gravity',
        timer: 6.5,
        x: W * (0.25 + Math.random() * 0.5),
        y: H * 0.42
      };
      if (synth) synth.sfxGravity(0);
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🌀 ГРАВИТАЦИОННАЯ ВОРОНКА!', '#bdb2ff', 1.15);
    } else if (type === 'wave') {
      activeEvent = {
        type: 'wave',
        timer: 5.5,
        dir: Math.random() > 0.5 ? 1 : -1
      };
      if (synth) synth.sfxWave();
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🌊 ЭНЕРГЕТИЧЕСКАЯ ВОЛНА!', '#48dbfb', 1.15);
    } else if (type === 'sticky') {
      activeEvent = {
        type: 'sticky',
        timer: 6.5,
        x: W * (0.2 + Math.random() * 0.6),
        y: H * 0.65,
        r: 72
      };
      if (synth) synth.sfxSticky(0);
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🍯 ЛИПКАЯ АНОМАЛИЯ!', '#ffafcc', 1.15);
    } else if (type === 'ignite') {
      activeEvent = {
        type: 'ignite',
        timer: 5.0
      };
      if (synth) synth.sfxIgnite(0);
      if (vfx) {
        vfx.triggerFlash('#ff6b35', 0.22);
        vfx.addPopup(W / 2, H * 0.30, '🔥 ВСПЫШКА ВОЗГОРАНИЯ!', '#ff9f1c', 1.15);
      }
      // Выпускаем 4 огненных сгустка сверху
      for (let k = 0; k < 4; k++) {
        enemyBullets.push({
          x: 45 + ((W - 90) * k) / 3,
          y: -20 - k * 35,
          vx: 0,
          vy: 260,
          r: 10,
          color: '#ff6b35'
        });
      }
    } else {
      activeEvent = { type: 'underwater', timer: 5.5, dir: Math.random() > 0.5 ? 1 : -1 };
      if (synth) synth.sfxUnderwater(0);
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🫧 ПОДВОДНОЕ ТЕЧЕНИЕ!', '#00f5d4', 1.15);
    }
  }

  function spawnEnemy() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp;
    const margin = 44;
    const x = margin + Math.random() * (W - margin * 2);

    const types = lvl.enemyTypes || ['lsd_saucer', 'lsd_prism', 'lsd_spinner'];
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
            r: 8, color: '#ff70a6'
          });
        }
        break;
      case 2:
        b.shootTimer = 0.95;
        for (let k = -1; k <= 1; k++) {
          const ang = toPlayer + k * 0.25;
          enemyBullets.push({
            x: b.x + k * 22, y: b.y + 38,
            vx: Math.cos(ang) * (spd * 1.1), vy: Math.sin(ang) * (spd * 1.1),
            r: 9, color: '#ff002b'
          });
        }
        break;
      case 3:
        b.shootTimer = 1.15;
        const rCols = ['#ff5964', '#ff9f1c', '#ffd166', '#06d6a0', '#48dbfb'];
        for (let k = -2; k <= 2; k++) {
          const ang = Math.PI / 2 + k * 0.24;
          enemyBullets.push({
            x: b.x + k * 15, y: b.y + 34,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 8.5, color: rCols[k + 2]
          });
        }
        break;
      case 4:
        b.shootTimer = 0.85;
        for (let k = -1; k <= 1; k++) {
          const ang = Math.PI / 2 + k * 0.35;
          enemyBullets.push({
            x: b.x, y: b.y + 30,
            vx: Math.cos(ang) * (spd * 1.25), vy: Math.sin(ang) * (spd * 1.25),
            r: 7, color: '#48dbfb'
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
      case 7:
        b.shootTimer = 1.25;
        const sporeCount = b.phase === 3 ? 11 : 8;
        for (let k = 0; k < sporeCount; k++) {
          const ang = b.time * 1.5 + (Math.PI * 2 * k) / sporeCount;
          enemyBullets.push({
            x: b.x, y: b.y + 15,
            vx: Math.cos(ang) * (spd * 0.88), vy: Math.sin(ang) * (spd * 0.88),
            r: 8, color: '#00f5d4'
          });
        }
        break;
      case 8:
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
      case 9:
        b.shootTimer = 0.45;
        for (let arm = 0; arm < 2; arm++) {
          const ang = b.time * 3.4 + arm * Math.PI;
          enemyBullets.push({
            x: b.x, y: b.y + 15,
            vx: Math.cos(ang) * (spd * 1.15), vy: Math.sin(ang) * (spd * 1.15),
            r: 7.5, color: '#caf0f8'
          });
        }
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

    // Нестандартные аномалии на протяжении всей карты
    eventTimer -= dt;
    if (eventTimer <= 0 && !activeEvent) {
      eventTimer = 17 + Math.random() * 6;
      triggerRandomAnomaly(lvl);
    }

    if (activeEvent) {
      activeEvent.timer -= dt;
      if (activeEvent.timer <= 0) {
        activeEvent = null;
      }
    }

    // Статичные препятствия на карте (нужно облетать)
    obstacleTimer -= dt;
    if (obstacleTimer <= 0 && !boss) {
      obstacleTimer = 4.2 + Math.random() * 2.2;
      spawnObstacle();
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
    if (p.stickyTimer > 0) p.stickyTimer = Math.max(0, p.stickyTimer - dt);

    p.blinkTimer -= dt;
    if (p.blinkTimer < -0.14) p.blinkTimer = 2.4 + Math.random() * 2;

    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    // Влияние аномалий на корабль игрока
    let speedFactor = 1.0;
    if (activeEvent) {
      if (activeEvent.type === 'gravity') {
        const dx = activeEvent.x - p.x;
        const dy = activeEvent.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10 && dist < 280) {
          p.x += (dx / dist) * 85 * dt;
          p.y += (dy / dist) * 85 * dt;
        }
      } else if (activeEvent.type === 'wave' || activeEvent.type === 'underwater') {
        p.x += activeEvent.dir * 95 * dt;
      } else if (activeEvent.type === 'sticky') {
        const d = Math.hypot(activeEvent.x - p.x, activeEvent.y - p.y);
        if (d < activeEvent.r) {
          speedFactor = 0.45;
          if (p.stickyTimer <= 0) {
            p.stickyTimer = 1.2;
            if (synth) synth.sfxSticky(0);
          }
        }
      }
    }

    const moveSpeed = (p.turboTimer > 0 ? 450 : 355) * speedFactor;
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
      p.x += dx * Math.min(1, dt * 14 * speedFactor);
      p.y += dy * Math.min(1, dt * 14 * speedFactor);
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

    // Обновление препятствий на карте
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const ob = obstacles[i];
      ob.y += ob.vy * dt;

      // Пули игрока расщепляются при попадании в статичное препятствие
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - ob.x, b.y - ob.y) < ob.r + b.r) {
          bullets.splice(j, 1);
          if (synth && Math.random() < 0.35) synth.sfxDisintegrate(((ob.x / W) * 2 - 1) * 0.6);
          if (vfx) vfx.addBurst(b.x, b.y, ['#caf0f8', '#ffffff'], 4, 90);
        }
      }

      // Столкновение корабля игрока с препятствием
      if (Math.hypot(p.x - ob.x, p.y - ob.y) < p.r + ob.r - 4) {
        obstacles.splice(i, 1);
        if (lvl.theme === 'diamond' && synth) synth.sfxDisintegrate(0);
        else if (lvl.theme === 'candy' || lvl.theme === 'organic') { if (synth) synth.sfxSticky(0); }
        else if (lvl.theme === 'volcano') { if (synth) synth.sfxIgnite(0); }
        damagePlayer();
        continue;
      }

      if (ob.y > H + 60) obstacles.splice(i, 1);
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
