(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_hangar_v4';
  const BORDER_INK = typeof INK !== 'undefined' ? INK : '#120a28';

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        bestScore: raw.bestScore || 0,
        coins: typeof raw.coins === 'number' ? raw.coins : 0,
        completed: Array.isArray(raw.completed) ? raw.completed : [],
        unlockedShips: Array.isArray(raw.unlockedShips) && raw.unlockedShips.length ? raw.unlockedShips : ['shuttle'],
        equippedShip: raw.equippedShip || 'shuttle',
        unlockedWeapons: Array.isArray(raw.unlockedWeapons) && raw.unlockedWeapons.length ? raw.unlockedWeapons : ['droplet'],
        equippedWeapon: raw.equippedWeapon || 'droplet',
        loreSeen: Boolean(raw.loreSeen)
      };
    } catch (e) {
      return {
        bestScore: 0, coins: 0, completed: [],
        unlockedShips: ['shuttle'], equippedShip: 'shuttle',
        unlockedWeapons: ['droplet'], equippedWeapon: 'droplet',
        loreSeen: false
      };
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

  const splashOverlay = document.getElementById('splash-overlay');
  const startOverlay = document.getElementById('start-overlay');
  const hangarOverlay = document.getElementById('hangar-overlay');
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

  // Универсальный загрузчик картинок (проверяет переименованные файлы и исходные имена со смартфона)
  function resolveImageToElement(imgEl, candidates, onFail = null) {
    if (!imgEl) return;
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        imgEl.style.display = 'none';
        if (onFail) onFail();
        return;
      }
      const src = candidates[idx++];
      const probe = new Image();
      probe.onload = () => {
        imgEl.src = src;
        imgEl.style.display = 'block';
      };
      probe.onerror = tryNext;
      probe.src = src;
    };
    tryNext();
  }

  // Назначаем разные фоновые изображения для внешнего меню, информационного окна и настроек
  function setupMenuBackgrounds() {
    const splashCandidates = ['img/splash.jpg', 'img/Splash.jpg', 'img/splash.png', 'img/1000036349.jpg'];
    const outerMenuCandidates = ['img/menu_bg.jpg', 'img/Menu_bg.jpg', 'img/menu_bg.png', 'img/1000036350.jpg'];
    const innerCardCandidates = ['img/card_bg.jpg', 'img/hangar_bg.jpg', 'img/card_bg.png', 'img/1000036353.jpg'];
    const settingsCandidates = ['img/settings_bg.jpg', 'img/transition_in.jpg', 'img/settings_bg.png', 'img/1000036354.jpg'];
    const outCandidates = ['img/transition_out.jpg', 'img/1000036352.jpg'];

    const titleBox = document.getElementById('splash-fallback-title');
    if (titleBox) titleBox.style.display = 'none';
    resolveImageToElement(document.getElementById('splash-bg-img'), splashCandidates, () => {
      if (titleBox) titleBox.style.display = 'block';
    });

    // Большой внешний фон меню и ангара (неоновый космодром)
    resolveImageToElement(document.getElementById('menu-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('hangar-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('lore-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('intro-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('end-outer-bg'), outCandidates);

    // Внутренний фон окна информации (парящие астероиды с неоновой площадкой)
    resolveImageToElement(document.getElementById('menu-inner-bg'), innerCardCandidates);
    resolveImageToElement(document.getElementById('hangar-inner-bg'), innerCardCandidates);

    // Фон меню Настроек (кот в кабине корабля перед галактикой)
    resolveImageToElement(document.getElementById('settings-outer-bg'), settingsCandidates);
    resolveImageToElement(document.getElementById('settings-inner-bg'), innerCardCandidates);
  }
  setupMenuBackgrounds();

  function setStageArtImage(imgEl, primaryBase, fallbackList) {
    const candidates = [
      `img/${primaryBase}.jpg`,
      `img/${primaryBase}.png`,
      ...fallbackList
    ];
    resolveImageToElement(imgEl, candidates);
  }

  // Запускаем музыку заставки сразу при переходе по ссылке
  if (synth) {
    synth.startIntroMusic();
  }

  const splashEnterBtn = document.getElementById('splash-enter-btn');
  if (splashEnterBtn) {
    splashEnterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) {
        synth.init();
        synth.sfxPowerup();
        synth.startIntroMusic();
      }
      splashOverlay.classList.add('hidden');
      renderLevelGrid();
      startOverlay.classList.remove('hidden');
    });
  }

  function getActiveShip() {
    if (typeof SHIPS_CATALOG === 'undefined') return { id: 'shuttle', hpBonus: 0, speedMult: 1, fireRateMult: 1, dmgMult: 1, coinMult: 1, hullColor: '#e0fbfc', wingColor: '#ff5964', neonColor: '#48dbfb' };
    return SHIPS_CATALOG.find(s => s.id === progress.equippedShip) || SHIPS_CATALOG[0];
  }

  function getActiveBaseWeapon() {
    if (typeof WEAPONS_CATALOG === 'undefined') return { id: 'droplet', dmgBonus: 1, bulletColor: '#48dbfb' };
    return WEAPONS_CATALOG.find(w => w.id === progress.equippedWeapon) || WEAPONS_CATALOG[0];
  }

  function updateCoinsUI() {
    const mEl = document.getElementById('menu-coins');
    const hEl = document.getElementById('hangar-coins');
    if (mEl) mEl.textContent = `🪙 ${progress.coins}`;
    if (hEl) hEl.textContent = `🪙 ${progress.coins}`;
  }

  // =========================================================================
  // АНГАР И ПРОКАЧКА
  // =========================================================================
  function renderHangar() {
    updateCoinsUI();
    const shipsList = document.getElementById('ships-list');
    const weaponsList = document.getElementById('weapons-list');
    if (!shipsList || !weaponsList || typeof SHIPS_CATALOG === 'undefined' || typeof WEAPONS_CATALOG === 'undefined') return;

    shipsList.innerHTML = '';
    SHIPS_CATALOG.forEach(ship => {
      const owned = progress.unlockedShips.includes(ship.id);
      const equipped = progress.equippedShip === ship.id;
      const item = document.createElement('div');
      item.className = 'shop-item' + (equipped ? ' equipped' : '');

      let btnClass = 'shop-action-btn ';
      let btnLabel = '';
      if (equipped) { btnClass += 'active'; btnLabel = 'ВЫБРАН ✔'; }
      else if (owned) { btnClass += 'equip'; btnLabel = 'ВЫБРАТЬ'; }
      else { btnClass += 'buy'; btnLabel = `${ship.price} 🪙`; }

      item.innerHTML = `
        <div class="shop-info">
          <strong>🚀 ${ship.name}</strong>
          <span>${ship.desc}</span>
        </div>
        <button class="${btnClass}">${btnLabel}</button>
      `;

      item.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        if (synth) synth.init();
        if (equipped) return;
        if (owned) {
          progress.equippedShip = ship.id;
          saveProgress(progress);
          if (synth) synth.sfxPowerup();
          renderHangar();
        } else if (progress.coins >= ship.price) {
          progress.coins -= ship.price;
          progress.unlockedShips.push(ship.id);
          progress.equippedShip = ship.id;
          saveProgress(progress);
          if (synth) synth.sfxVictory();
          renderHangar();
        } else {
          if (synth) synth.sfxHurt();
        }
      });
      shipsList.appendChild(item);
    });

    weaponsList.innerHTML = '';
    WEAPONS_CATALOG.forEach(wp => {
      const owned = progress.unlockedWeapons.includes(wp.id);
      const equipped = progress.equippedWeapon === wp.id;
      const item = document.createElement('div');
      item.className = 'shop-item' + (equipped ? ' equipped' : '');

      let btnClass = 'shop-action-btn ';
      let btnLabel = '';
      if (equipped) { btnClass += 'active'; btnLabel = 'УСТАНОВЛЕНО ✔'; }
      else if (owned) { btnClass += 'equip'; btnLabel = 'ВЫБРАТЬ'; }
      else { btnClass += 'buy'; btnLabel = `${wp.price} 🪙`; }

      item.innerHTML = `
        <div class="shop-info">
          <strong>🔫 ${wp.name}</strong>
          <span>${wp.desc}</span>
        </div>
        <button class="${btnClass}">${btnLabel}</button>
      `;

      item.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        if (synth) synth.init();
        if (equipped) return;
        if (owned) {
          progress.equippedWeapon = wp.id;
          saveProgress(progress);
          if (synth) synth.sfxPowerup();
          renderHangar();
        } else if (progress.coins >= wp.price) {
          progress.coins -= wp.price;
          progress.unlockedWeapons.push(wp.id);
          progress.equippedWeapon = wp.id;
          saveProgress(progress);
          if (synth) synth.sfxVictory();
          renderHangar();
        } else {
          if (synth) synth.sfxHurt();
        }
      });
      weaponsList.appendChild(item);
    });
  }

  document.getElementById('hangar-open-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) { synth.init(); synth.sfxHit(0); }
    renderHangar();
    startOverlay.classList.add('hidden');
    hangarOverlay.classList.remove('hidden');
  });

  document.getElementById('hangar-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxHit(0);
    hangarOverlay.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
  });

  // =========================================================================
  // КОМИКС ПРЕДЫСТОРИИ
  // =========================================================================
  const LORE_SLIDES = [
    {
      baseName: 'slide1',
      rawFallback: 'img/1000036324.jpg',
      title: 'ПЛАНЕТА КОТОВИЯ-17',
      text: 'На родной планете Котовия-17 у кота по имени Редж заканчивается еда. Еда выдаётся только по талонам, а миски пустеют!'
    },
    {
      baseName: 'slide2',
      rawFallback: 'img/1000036326.jpg',
      title: 'СЕКРЕТНЫЙ ОТРЯД «АСТРО-КОТ»',
      text: 'Редж — один из 10 отважных котов, отобранных для секретной программы освоения запасов еды дальнего космоса. Его ракета готова к старту!'
    },
    {
      baseName: 'slide3',
      rawFallback: 'img/1000036323.jpg',
      title: 'БИТВА С ПОЖИРАТЕЛЯМИ КОСМОСА',
      text: 'Реджу предстоит исследовать 5 галактик и сразиться со злобными Пожирателями Космоса, зарабатывая монеты на улучшение флота!'
    }
  ];

  let loreSlideIdx = 0;
  let lastRenderedSlideIdx = -1;
  let hasCustomSlideImg = false;
  const loreImg = document.getElementById('lore-img');
  const loreCanvas = document.getElementById('lore-canvas');
  const loreCtx = loreCanvas ? loreCanvas.getContext('2d') : null;

  function loadSlideImageIfExists(slide) {
    if (!loreImg) return;
    hasCustomSlideImg = false;
    loreImg.classList.add('hidden');
    if (loreCanvas) loreCanvas.style.display = 'block';

    const variants = [
      `img/${slide.baseName}.jpg`,
      `img/${slide.baseName}.png`,
      `img/${slide.baseName}.jpeg`,
      slide.rawFallback
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= variants.length) return;
      const src = variants[idx++];
      const probe = new Image();
      probe.onload = () => {
        hasCustomSlideImg = true;
        loreImg.src = src;
        loreImg.classList.remove('hidden');
        if (loreCanvas) loreCanvas.style.display = 'none';
      };
      probe.onerror = tryNext;
      probe.src = src;
    };
    tryNext();
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
      loadSlideImageIfExists(slide);
    }

    if (hasCustomSlideImg || !loreCtx) return;
    const lw = loreCanvas.width;
    const lh = loreCanvas.height;
    loreCtx.fillStyle = '#140d33';
    loreCtx.fillRect(0, 0, lw, lh);
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
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
  }

  // =========================================================================
  // МЕНЮ И ВХОДНОЙ БРИФИНГ ПЕРЕД УРОВНЕМ
  // =========================================================================
  const levelsGrid = document.getElementById('levels-grid');
  const selectedLevelInfo = document.getElementById('selected-level-info');

  function renderLevelGrid() {
    updateCoinsUI();
    if (typeof LEVELS === 'undefined') return;
    if (selectedLevelIdx >= LEVELS.length) selectedLevelIdx = 0;

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
    const ship = getActiveShip();
    const wp = getActiveBaseWeapon();
    selectedLevelInfo.innerHTML =
      `<strong>Уровень ${cur.id}: ${cur.name}</strong> (Награда: +${cur.coinReward} 🪙)<br>` +
      `<span>Корабль: ${ship.name} • Оружие: ${wp.name}</span>`;
    document.getElementById('start-best').textContent =
      `Рекорд: ${progress.bestScore} • Пройдено: ${progress.completed.length}/${LEVELS.length}`;
  }
  renderLevelGrid();

  document.querySelectorAll('#diff-row .pill-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) { synth.init(); synth.sfxHit(0); }
      selectedDiffKey = btn.dataset.diff;
      document.querySelectorAll('#diff-row .pill-3d').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function showIntro(idx) {
    if (typeof LEVELS === 'undefined') return;
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    if (synth) { synth.init(); synth.sfxPowerup(); }

    setStageArtImage(document.getElementById('intro-stage-img'), `level${lvl.id}_in`, ['img/transition_in.jpg', 'img/settings_bg.jpg', 'img/1000036354.jpg']);

    document.getElementById('intro-sector-tag').textContent = `УРОВЕНЬ ${lvl.id}`;
    document.getElementById('intro-title').textContent = lvl.name.toUpperCase();
    document.getElementById('intro-story').textContent = lvl.story;
    document.getElementById('intro-intel').innerHTML =
      `<div>🛸 <b>Враги:</b> ${lvl.enemiesDesc}</div>` +
      `<div>👑 <b>Пожиратель:</b> ${lvl.bossName}</div>` +
      `<div>⚡ <b>Спец-оружие:</b> Сюрикены, Электро-удар, Волновая пушка</div>`;

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

  // =========================================================================
  // НАСТРОЙКИ ЗВУКА
  // =========================================================================
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

  document.querySelectorAll('#timbre-row .pill-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!synth) return;
      synth.init();
      synth.timbre = btn.dataset.timbre;
      document.querySelectorAll('#timbre-row .pill-3d').forEach(b => b.classList.remove('active'));
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
  // ИГРОВОЙ ПРОЦЕСС, 3 НОВЫХ ОРУЖИЯ 1-ГО УРОВНЯ И ПРЕПЯТСТВИЯ РАЗНЫХ ФОРМ
  // =========================================================================
  let score = 0;
  let runCoins = 0;
  let kills = 0;
  let combo = 1;
  let comboTimer = 0;
  let wave = 1;
  let waveTimer = 0;
  let spawnTimer = 0;
  let obstacleTimer = 4.0;
  let eventTimer = 14.0;
  let activeEvent = null;
  let screenShake = 0;
  let warningBannerTimer = 0;
  let globalTime = 0;

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
    if (synth) synth.startIntroMusic();

    pauseOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    introOverlay.classList.add('hidden');
    loreOverlay.classList.add('hidden');
    hangarOverlay.classList.add('hidden');
    splashOverlay.classList.add('hidden');
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
    if (typeof LEVELS === 'undefined' || typeof DIFFICULTIES === 'undefined') return;
    resize();
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const ship = getActiveShip();
    const wp = getActiveBaseWeapon();

    if (synth) {
      synth.init();
      synth.startMusic('normal');
      if (lvl.theme === 'underwater') synth.sfxUnderwater(0);
      else synth.sfxCosmicHum();
    }

    score = 0;
    runCoins = 0;
    kills = 0;
    combo = 1;
    comboTimer = 0;
    wave = 1;
    waveTimer = 0;
    spawnTimer = 0.45;
    obstacleTimer = 3.2;
    eventTimer = 12.0;
    activeEvent = null;
    screenShake = 0;
    warningBannerTimer = 0;

    const totalHp = diff.playerHp + (ship.hpBonus || 0);

    player = {
      x: W / 2,
      y: H - 105,
      vx: 0,
      vy: 0,
      r: 23,
      hp: totalHp,
      maxHp: totalHp,
      ship,
      baseWeapon: wp,
      invuln: 0,
      fireCooldown: 0,
      secondaryWeapon: 'none',
      secondaryLevel: 1,
      shield: false,
      giantTimer: 0,
      turboTimer: 0,
      stickyTimer: 0,
      squashX: 1,
      squashY: 1
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
    hangarOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    splashOverlay.classList.add('hidden');
    pauseBtn.classList.remove('hidden');

    if (world3d) world3d.setCameraFromPlayer(player.x, W);
    if (vfx) vfx.addPopup(W / 2, H * 0.36, `УРОВЕНЬ ${lvl.id}: ВОЛНА 1 / 4`, lvl.accent, 1.15);
  }

  document.getElementById('next-level-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'VICTORY') {
      showIntro((selectedLevelIdx + 1) % LEVELS.length);
    } else {
      startLevel(selectedLevelIdx);
    }
  });

  // Спавн металлических светящихся препятствий разных форм (шестигранник, шестерня, пилон, крест)
  function spawnObstacle() {
    const lvl = LEVELS[selectedLevelIdx];
    const margin = 56;
    const x = margin + Math.random() * (W - margin * 2);
    const shapes = ['hex_reactor', 'cog_turret', 'tri_pylon', 'cross_gen'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const neonColors = ['#00f5d4', '#ff70a6', '#fee440', '#72efdd'];

    obstacles.push({
      shape,
      neonColor: lvl.accent || neonColors[Math.floor(Math.random() * neonColors.length)],
      x,
      y: -48,
      r: 26,
      vy: 98,
      rot: Math.random() * Math.PI * 2,
      vrot: shape === 'cog_turret' ? 1.8 : 0.45
    });
  }

  function triggerRandomAnomaly(lvl) {
    const pool = ['gravity', 'wave', 'sticky', 'ignite'];
    if (lvl.theme === 'underwater') pool.push('underwater');
    const type = pool[Math.floor(Math.random() * pool.length)];

    if (type === '
