(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_hangar_v11';
  const BORDER_INK = typeof INK !== 'undefined' ? INK : '#100824';

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
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const synth = typeof AstraCatSynth !== 'undefined' ? new AstraCatSynth(128) : null;
  const world3d = typeof World3DEngine !== 'undefined' ? new World3DEngine() : null;
  const vfx = typeof VFXEngine !== 'undefined' ? new VFXEngine() : null;

  const hudTopBar = document.getElementById('hud-top-bar');
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
    W = Math.max(320, Math.min(520, rect.width || window.innerWidth));
    H = Math.max(480, rect.height || window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function syncTopHudVisibility() {
    if (!hudTopBar) return;
    const hideInMenus =
      !splashOverlay.classList.contains('hidden') ||
      !hangarOverlay.classList.contains('hidden') ||
      !settingsOverlay.classList.contains('hidden') ||
      !loreOverlay.classList.contains('hidden') ||
      !introOverlay.classList.contains('hidden');
    hudTopBar.classList.toggle('hidden-hud', hideInMenus);
  }

  document.querySelectorAll('.scrollable-card').forEach(cardEl => {
    let lastScrollTop = 0;
    cardEl.addEventListener('scroll', () => {
      if (Math.abs(cardEl.scrollTop - lastScrollTop) >= 18) {
        lastScrollTop = cardEl.scrollTop;
        if (synth) synth.sfxScrollTick();
      }
    }, { passive: true });
  });

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

  function setupMenuBackgrounds() {
    const splashCandidates = ['img/splash.jpg', 'img/1000036349.jpg'];
    const outerMenuCandidates = ['img/menu_bg.jpg', 'img/1000036350.jpg'];
    const innerCardCandidates = ['img/hangar_bg.jpg', 'img/card_bg.jpg', 'img/1000036353.jpg'];
    const settingsCandidates = ['img/transition_in.jpg', 'img/settings_bg.jpg', 'img/1000036354.jpg'];
    const outCandidates = ['img/transition_out.jpg', 'img/1000036352.jpg'];

    const titleBox = document.getElementById('splash-fallback-title');
    if (titleBox) titleBox.style.display = 'none';
    resolveImageToElement(document.getElementById('splash-bg-img'), splashCandidates, () => {
      if (titleBox) titleBox.style.display = 'block';
    });

    resolveImageToElement(document.getElementById('menu-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('hangar-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('lore-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('intro-outer-bg'), outerMenuCandidates);
    resolveImageToElement(document.getElementById('end-outer-bg'), outCandidates);

    resolveImageToElement(document.getElementById('menu-inner-bg'), innerCardCandidates);
    resolveImageToElement(document.getElementById('hangar-inner-bg'), innerCardCandidates);

    resolveImageToElement(document.getElementById('settings-outer-bg'), settingsCandidates);
    resolveImageToElement(document.getElementById('settings-inner-bg'), innerCardCandidates);
  }
  setupMenuBackgrounds();
  syncTopHudVisibility();

  if (synth) {
    synth.startIntroMusic();
  }

  function applySiteTheme(lvl) {
    if (lvl && lvl.theme === 'organic') {
      document.body.classList.add('theme-organic');
    } else {
      document.body.classList.remove('theme-organic');
    }
  }

  const prevTrackBtn = document.getElementById('prev-track-btn');
  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) { synth.init(); synth.prevTrack(); }
    });
  }

  const nextTrackBtn = document.getElementById('next-track-btn');
  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) { synth.init(); synth.nextTrack(); }
    });
  }

  const splashEnterBtn = document.getElementById('splash-enter-btn');
  if (splashEnterBtn) {
    splashEnterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) {
        synth.init();
        synth.sfxMenuTransition();
        synth.startIntroMusic();
      }
      splashOverlay.classList.add('hidden');
      renderLevelGrid();
      startOverlay.classList.remove('hidden');
      syncTopHudVisibility();
    });
  }

  function getActiveShip() {
    if (typeof SHIPS_CATALOG === 'undefined') return { id: 'shuttle', hpBonus: 0, speedMult: 1, fireRateMult: 1, dmgMult: 1, coinMult: 1, gunMounts: 1, hullColor: '#e0fbfc', hullDark: '#98c1d9', wingColor: '#ff5964', neonColor: '#48dbfb' };
    return SHIPS_CATALOG.find(s => s.id === progress.equippedShip) || SHIPS_CATALOG[0];
  }

  function getActiveBaseWeapon() {
    if (typeof WEAPONS_CATALOG === 'undefined') return { id: 'droplet', dmgBonus: 1, bulletColor: '#48dbfb' };
    return WEAPONS_CATALOG.find(w => w.id === progress.equippedWeapon) || WEAPONS_CATALOG[0];
  }

  function updateCoinsUI() {
    const mEl = document.getElementById('menu-coins');
    const hEl = document.getElementById('hangar-coins');
    if (mEl) mEl.textContent = `🐟 ${progress.coins}`;
    if (hEl) hEl.textContent = `🐟 ${progress.coins}`;
  }

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
      else { btnClass += 'buy'; btnLabel = `${ship.price} 🐟`; }

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
        if (equipped) {
          if (synth) synth.sfxMenuTap();
          return;
        }
        if (owned) {
          progress.equippedShip = ship.id;
          saveProgress(progress);
          if (synth) synth.sfxMenuSelect();
          renderHangar();
        } else if (progress.coins >= ship.price) {
          progress.coins -= ship.price;
          progress.unlockedShips.push(ship.id);
          progress.equippedShip = ship.id;
          saveProgress(progress);
          if (synth) synth.sfxBuyItem();
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
      else { btnClass += 'buy'; btnLabel = `${wp.price} 🐟`; }

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
        if (equipped) {
          if (synth) synth.sfxMenuTap();
          return;
        }
        if (owned) {
          progress.equippedWeapon = wp.id;
          saveProgress(progress);
          if (synth) synth.sfxMenuSelect();
          renderHangar();
        } else if (progress.coins >= wp.price) {
          progress.coins -= wp.price;
          progress.unlockedWeapons.push(wp.id);
          progress.equippedWeapon = wp.id;
          saveProgress(progress);
          if (synth) synth.sfxBuyItem();
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
    if (synth) { synth.init(); synth.sfxMenuTransition(); }
    renderHangar();
    startOverlay.classList.add('hidden');
    hangarOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  });

  document.getElementById('hangar-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuSelect();
    hangarOverlay.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  });

  const LORE_SLIDES = [
    {
      baseName: 'slide1',
      rawFallback: 'img/1000036324.jpg',
      title: 'ПЛАНЕТА КОТОВИЯ-17',
      text: 'На родной планете Котовия-17 у кота по имени Редж заканчивается еда. Рыбка, колбаска и сметана выдаются только по талонам!'
    },
    {
      baseName: 'slide2',
      rawFallback: 'img/1000036326.jpg',
      title: 'СЕКРЕТНЫЙ ОТРЯД «АСТРО-КОТ»',
      text: 'Редж — один из 10 отважных котов, отобранных для секретной программы добычи провизии в дальнем космосе!'
    },
    {
      baseName: 'slide3',
      rawFallback: 'img/1000036323.jpg',
      title: 'БИТВА С ПОЖИРАТЕЛЯМИ КОСМОСА',
      text: 'Добывай космическую рыбку 🐟 в боях, открывай 5 кораблей и 5 видов оружия в Ангаре и накорми родную планету!'
    }
  ];

  let loreSlideIdx = 0;
  let lastRenderedSlideIdx = -1;
  const loreImg = document.getElementById('lore-img');
  const loreCanvas = document.getElementById('lore-canvas');

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

      if (loreImg) {
        loreImg.classList.remove('hidden');
        if (loreCanvas) loreCanvas.style.display = 'none';
        resolveImageToElement(loreImg, [`img/${slide.baseName}.jpg`, slide.rawFallback]);
      }
    }
  }

  function openLoreSlides() {
    loreSlideIdx = 0;
    lastRenderedSlideIdx = -1;
    if (synth) { synth.init(); synth.sfxMenuTransition(); }
    startOverlay.classList.add('hidden');
    loreOverlay.classList.remove('hidden');
    renderLoreSlide();
    syncTopHudVisibility();
  }

  document.getElementById('lore-open-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openLoreSlides();
  });

  document.getElementById('lore-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuTap();
    if (loreSlideIdx < LORE_SLIDES.length - 1) {
      loreSlideIdx++;
      renderLoreSlide();
    } else {
      finishLoreSlides();
    }
  });

  document.getElementById('lore-skip-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuTap();
    finishLoreSlides();
  });

  function finishLoreSlides() {
    progress.loreSeen = true;
    saveProgress(progress);
    loreOverlay.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  }

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
        if (synth) { synth.init(); synth.sfxMenuSelect(); }
        selectedLevelIdx = idx;
        applySiteTheme(LEVELS[selectedLevelIdx]);
        renderLevelGrid();
      });
      levelsGrid.appendChild(btn);
    });

    const cur = LEVELS[selectedLevelIdx];
    applySiteTheme(cur);
    const ship = getActiveShip();
    const diff = DIFFICULTIES[selectedDiffKey];
    const bossCountLabel = diff && diff.twoBosses ? '2 БОССА ПОДРЯД!' : cur.bossName;
    selectedLevelInfo.innerHTML =
      `<strong>Уровень ${cur.id}: ${cur.name}</strong> (+${cur.coinReward} 🐟)<br>` +
      `<span>Босс: ${bossCountLabel} • ${ship.name}</span>`;
    document.getElementById('start-best').textContent =
      `Рекорд: ${progress.bestScore} • Пройдено: ${progress.completed.length}/${LEVELS.length}`;
  }
  renderLevelGrid();

  document.querySelectorAll('#diff-row .pill-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (synth) { synth.init(); synth.sfxMenuSelect(); }
      selectedDiffKey = btn.dataset.diff;
      document.querySelectorAll('#diff-row .pill-3d').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLevelGrid();
    });
  });

  function showIntro(idx) {
    if (typeof LEVELS === 'undefined') return;
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    applySiteTheme(lvl);
    if (synth) { synth.init(); synth.sfxMenuTransition(); }

    resolveImageToElement(document.getElementById('intro-stage-img'), [`img/level${lvl.id}_in.jpg`, 'img/transition_in.jpg', 'img/1000036354.jpg']);

    const diff = DIFFICULTIES[selectedDiffKey];
    document.getElementById('intro-sector-tag').textContent = `УРОВЕНЬ ${lvl.id} • ${diff.label.toUpperCase()}`;
    document.getElementById('intro-title').textContent = lvl.name.toUpperCase();
    document.getElementById('intro-story').textContent = lvl.story;
    document.getElementById('intro-intel').innerHTML =
      `<div>🛸 <b>Враги:</b> ${lvl.enemiesDesc}</div>` +
      `<div>👑 <b>Босс:</b> ${diff.twoBosses ? lvl.bossName + ' (x2: Средний + Мега-Босс!)' : lvl.bossName}</div>` +
      `<div>🐟 <b>Награда провизией:</b> +${lvl.coinReward} рыбок</div>`;

    startOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    introOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  }

  document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    showIntro(selectedLevelIdx);
  });

  document.getElementById('intro-launch-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuSelect();
    startLevel(selectedLevelIdx);
  });

  document.getElementById('intro-back-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuTap();
    introOverlay.classList.add('hidden');
    startOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  });

  let state = 'START';
  let prevStateBeforeSettings = 'START';

  function openSettings() {
    if (synth) { synth.init(); synth.sfxMenuTap(); }
    prevStateBeforeSettings = state;
    if (state === 'PLAYING') {
      state = 'PAUSED';
      if (synth) synth.pauseMusic();
    }
    settingsOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  }

  function closeSettings() {
    if (synth) synth.sfxMenuSelect();
    settingsOverlay.classList.add('hidden');
    if (prevStateBeforeSettings === 'PLAYING') {
      state = 'PLAYING';
      if (synth) synth.resumeMusic();
    }
    syncTopHudVisibility();
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
    synth.sfxMenuTap();
  });

  const trackSelect = document.getElementById('track-select');
  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      if (!synth) return;
      synth.init();
      synth.sfxMenuSelect();
      synth.selectedTrack = e.target.value;
      if (synth.selectedTrack !== 'auto') {
        synth.playTrack(synth.selectedTrack);
      } else if (state === 'PLAYING') {
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
    synth.updateSfxVolume();
    if (synth.sfxEnabled) synth.sfxMenuTap();
  });

  const musicVolInput = document.getElementById('music-vol');
  if (musicVolInput) {
    musicVolInput.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      const lbl = document.getElementById('val-music-vol');
      if (lbl) lbl.textContent = `${v}%`;
      if (synth) {
        synth.musicVolume = v / 100;
        synth.updateMusicVolume();
      }
    });
  }

  const sfxVolInput = document.getElementById('sfx-vol');
  if (sfxVolInput) {
    sfxVolInput.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      const lbl = document.getElementById('val-sfx-vol');
      if (lbl) lbl.textContent = `${v}%`;
      if (synth) synth.setMasterVolume(v / 100);
    });
  }

  const ctrlWarmth = document.getElementById('ctrl-warmth');
  if (ctrlWarmth) {
    ctrlWarmth.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      const lbl = document.getElementById('val-warmth');
      if (lbl) lbl.textContent = `${v} Hz`;
      if (synth) synth.setWarmthCutoff(v);
    });
  }

  const ctrlSpace = document.getElementById('ctrl-space');
  if (ctrlSpace) {
    ctrlSpace.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      const lbl = document.getElementById('val-space');
      if (lbl) lbl.textContent = `${v}%`;
      if (synth) synth.setSpaceMix(v / 100);
    });
  }

  const ctrlPsy = document.getElementById('ctrl-psy');
  if (ctrlPsy) {
    ctrlPsy.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      const lbl = document.getElementById('val-psy');
      if (lbl) lbl.textContent = `${v}%`;
      if (synth) synth.setPsyDrift(v / 100);
    });
  }

  document.getElementById('test-chord-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) { synth.init(); synth.playCosmicMeow(); }
  });

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!synth) return;
    const muted = synth.toggleMute();
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

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
  let midBossDefeated = false;

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
      if (synth) { synth.sfxMenuTap(); synth.pauseMusic(); }
      pauseOverlay.classList.remove('hidden');
      syncTopHudVisibility();
    } else if (state === 'PAUSED' && settingsOverlay.classList.contains('hidden')) {
      state = 'PLAYING';
      if (synth) { synth.sfxMenuSelect(); synth.resumeMusic(); }
      pauseOverlay.classList.add('hidden');
      syncTopHudVisibility();
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
    if (synth) { synth.sfxMenuTap(); synth.startIntroMusic(); }

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
    syncTopHudVisibility();
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

    applySiteTheme(lvl);

    if (synth) {
      synth.init();
      synth.startMusic('normal', lvl.id);
      synth.sfxCosmicHum();
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
    midBossDefeated = false;

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
    syncTopHudVisibility();

    if (world3d) world3d.setCameraFromPlayer(player.x, W);
    if (vfx) vfx.addPopup(W / 2, H * 0.36, `УРОВЕНЬ ${lvl.id}: ${lvl.name.toUpperCase()}`, lvl.accent, 1.15);
  }

  document.getElementById('next-level-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) synth.sfxMenuSelect();
    if (state === 'VICTORY') {
      showIntro((selectedLevelIdx + 1) % LEVELS.length);
    } else {
      startLevel(selectedLevelIdx);
    }
  });

  function spawnObstacle() {
    const lvl = LEVELS[selectedLevelIdx];
    const margin = 56;
    const x = margin + Math.random() * (W - margin * 2);

    let shape = 'om_fractal';
    if (lvl.theme === 'lsd') {
      shape = Math.random() < 0.55 ? 'om_fractal' : 'neon_star_obstacle';
    } else if (lvl.theme === 'horror') {
      shape = Math.random() < 0.65 ? 'skull_bones' : 'blood_pentagram';
    } else if (lvl.theme === 'rainbow') {
      const rShapes = ['rainbow_donut', 'dream_bubble', 'rainbow_cloud'];
      shape = rShapes[Math.floor(Math.random() * rShapes.length)];
    } else if (lvl.theme === 'underwater') {
      shape = Math.random() < 0.55 ? 'neon_coral' : 'seaweed_kelp';
    } else if (lvl.theme === 'organic') {
      shape = 'thorn_pod';
    }

    obstacles.push({
      shape,
      neonColor: lvl.accent || '#00f5d4',
      x,
      y: -48,
      r: 26,
      vy: 96,
      rot: 0,
      vrot: 1.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  function triggerRandomAnomaly(lvl) {
    const pool = ['gravity', 'wave', 'sticky', 'ignite'];
    if (lvl.theme === 'underwater') pool.push('underwater');
    const type = pool[Math.floor(Math.random() * pool.length)];

    if (type === 'gravity') {
      activeEvent = { type: 'gravity', timer: 6.5, x: W * (0.25 + Math.random() * 0.5), y: H * 0.42 };
      if (synth) synth.sfxGravity();
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🌀 ГРАВИТАЦИОННАЯ ВОРОНКА!', '#bdb2ff', 1.15);
    } else if (type === 'wave') {
      activeEvent = { type: 'wave', timer: 5.5, dir: Math.random() > 0.5 ? 1 : -1 };
      if (synth) synth.sfxWave();
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🌊 ЭНЕРГЕТИЧЕСКАЯ ВОЛНА!', '#48dbfb', 1.15);
    } else if (type === 'sticky') {
      activeEvent = { type: 'sticky', timer: 6.5, x: W * (0.2 + Math.random() * 0.6), y: H * 0.65, r: 72 };
      if (synth) synth.sfxSticky();
      if (vfx) vfx.addPopup(W / 2, H * 0.30, '🍯 ЛИПКАЯ АНОМАЛИЯ!', '#ffafcc', 1.15);
    } else {
      activeEvent = { type: 'ignite', timer: 5.0 };
      if (synth) synth.sfxIgnite();
      if (vfx) {
        vfx.triggerFlash('#ff6b35', 0.22);
        vfx.addPopup(W / 2, H * 0.30, '🔥 ВСПЫШКА ВОЗГОРАНИЯ!', '#ff9f1c', 1.15);
      }
      for (let k = 0; k < 4; k++) {
        enemyBullets.push({ kind: 'fireball', x: 45 + ((W - 90) * k) / 3, y: -20 - k * 35, vx: 0, vy: 260, r: 10, color: '#ff6b35' });
      }
    }
  }

  function spawnEnemy() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp;
    const margin = 44;
    const x = margin + Math.random() * (W - margin * 2);

    const types = lvl.enemyTypes || ['psy_eye', 'shroom_cruiser', 'fractal_medusa'];
    const typeIdx = Math.floor(Math.random() * types.length);
    const kind = types[typeIdx];
    const isHeavy = typeIdx === 1;
    const hp = Math.max(1, Math.round((isHeavy ? 4.5 : 2.2) * hpScale));

    const patterns = ['zigzag', 'dash', 'figure8', 'erratic'];
    const movePattern = patterns[Math.floor(Math.random() * patterns.length)];

    enemies.push({
      kind, movePattern, x, y: -38, r: isHeavy ? 25 : 21, hp, maxHp: hp,
      baseVy: (isHeavy ? 105 : 138) * diff.bulletSpeed,
      vy: (isHeavy ? 105 : 138) * diff.bulletSpeed,
      vx: (Math.random() - 0.5) * 140,
      rot: 0, vrot: (Math.random() - 0.5) * 4.2,
      phase: Math.random() * Math.PI * 2,
      freq: 2.2 + Math.random() * 2.4,
      amp: 65 + Math.random() * 60,
      turnTimer: 0.5 + Math.random() * 1.1,
      shootTimer: (isHeavy ? 1.25 : 1.65) + Math.random() * 0.7,
      hitFlash: 0,
      points: isHeavy ? 180 : 120,
      coinValue: isHeavy ? 32 : 18
    });
  }

  function spawnBoss(isMidBoss = false) {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const mult = isMidBoss ? 0.58 : (diff.twoBosses ? 1.35 : 1.0);
    const bScale = isMidBoss ? 0.82 : (diff.twoBosses ? 1.24 : 1.0);
    const totalHp = Math.round(240 * lvl.hpMult * diff.enemyHp * mult);

    boss = {
      isMidBoss,
      bossScale: bScale,
      x: W / 2,
      y: -110,
      targetY: Math.min(155, H * 0.22),
      r: 62 * bScale,
      hp: totalHp,
      maxHp: totalHp,
      phase: 1,
      time: 0,
      hitFlash: 0,
      smokeTimer: 0,
      shootTimer: 0.95,
      specialTimer: 3.2,
      laserState: 'idle',
      laserTimer: 0,
      laserX: W / 2
    };
    warningBannerTimer = 2.4;
    if (synth) { synth.sfxBossAlarm(); synth.setMusicMode('boss', lvl.id); }
    if (vfx) vfx.triggerFlash(lvl.accent, 0.28);
  }

  function maybeDropFoodBonus(x, y, guaranteed = false) {
    if (!guaranteed && Math.random() > 0.20) return;
    const pool = [
      'fractal_shuriken',
      'electric_shock',
      'wave_cannon',
      'green_star',
      'red_shield'
    ];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    bonuses.push({ type: chosen, x, y, r: 18, vy: 105, phase: Math.random() * Math.PI * 2 });
  }

  function firePlayerWeapon(p) {
    const pan = ((p.x / W) * 2 - 1) * 0.7;
    const baseId = p.baseWeapon.id;
    const dmgScale = (p.ship.dmgMult || 1) * (p.baseWeapon.dmgBonus || 1) * (p.giantTimer > 0 ? 1.35 : 1.0);
    const mounts = p.ship.gunMounts || 1;

    if (synth) synth.sfxShootWeapon(pan, baseId, p.secondaryWeapon);

    let mountConfigs = [[0, 0]];
    if (mounts === 2) mountConfigs = [[-13, 0], [13, 0]];
    else if (mounts === 3) mountConfigs = [[-16, -0.08], [0, 0], [16, 0.08]];
    else if (mounts === 4) mountConfigs = [[-22, -0.14], [-8, -0.03], [8, 0.03], [22, 0.14]];
    else if (mounts >= 5) mountConfigs = [[-26, -0.20], [-13, -0.09], [0, 0], [13, 0.09], [26, 0.20]];

    const bulletKind = baseId === 'prism_beam' ? 'prism_spear' : (baseId === 'nova_pulse' ? 'nova_star' : 'plasma');
    const bulletSpeed = baseId === 'prism_beam' ? 890 : 770;
    const bulletColor = p.baseWeapon.bulletColor || '#48dbfb';

    mountConfigs.forEach(([ox, ang]) => {
      bullets.push({
        kind: bulletKind,
        pierce: baseId === 'prism_beam' ? 2 : 0,
        x: p.x + ox,
        y: p.y - 24,
        vx: Math.sin(ang) * bulletSpeed,
        vy: -Math.cos(ang) * bulletSpeed,
        rot: 0,
        r: baseId === 'nova_pulse' ? 8.5 : 6.5,
        dmg: 0.92 * dmgScale,
        color: bulletColor
      });
    });

    const lv2 = p.secondaryLevel >= 2;
    if (p.secondaryWeapon === 'fractal_shuriken') {
      const angles = lv2 ? [-0.26, 0, 0.26] : [-0.18, 0.18];
      angles.forEach(ang => {
        bullets.push({
          kind: 'fractal_shuriken', homing: true,
          x: p.x, y: p.y - 22,
          vx: Math.sin(ang) * 620, vy: -Math.cos(ang) * 620,
          rot: 0, r: 10, dmg: 1.45 * dmgScale, color: '#00f5d4'
        });
      });
    } else if (p.secondaryWeapon === 'electric_shock') {
      const offsets = lv2 ? [-18, 0, 18] : [-14, 14];
      offsets.forEach(ox => {
        bullets.push({
          kind: 'electric_bolt', chainLightning: true,
          x: p.x + ox, y: p.y - 24, vx: 0, vy: -880,
          r: 8, dmg: 1.40 * dmgScale, color: '#fee440'
        });
      });
    } else if (p.secondaryWeapon === 'wave_cannon') {
      bullets.push({
        kind: 'wave_pulse', pierce: lv2 ? 4 : 3,
        x: p.x, y: p.y - 28, vx: 0, vy: -640,
        r: lv2 ? 34 : 26, dmg: 1.75 * dmgScale, color: '#f15bb5'
      });
    }
  }

  function applyFoodBonus(bn) {
    if (synth) synth.sfxPowerup();
    player.squashX = 1.3;
    player.squashY = 1.3;
    if (vfx) {
      vfx.addShockwave(bn.x, bn.y, '#80ffdb', 85, 0.42);
      vfx.addBurst(bn.x, bn.y, ['#ffd166', '#06d6a0', '#48dbfb', '#ffffff'], 14, 190);
    }

    if (bn.type === 'green_star') {
      player.giantTimer = 11.0;
      score += 300;
      if (vfx) vfx.addPopup(bn.x, bn.y, '⭐ МЕГА-КОРАБЛЬ (+УРОН)!', '#06d6a0', 1.2);
      return;
    }

    if (bn.type === 'red_shield') {
      player.shield = true;
      score += 250;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🛡 ЭНЕРГО-ЩИТ АКТИВЕН!', '#ff5964', 1.15);
      return;
    }

    if (player.secondaryWeapon === bn.type) {
      player.secondaryLevel = 2;
      score += 350;
    } else {
      player.secondaryWeapon = bn.type;
      player.secondaryLevel = 1;
      score += 250;
    }

    const titles = {
      fractal_shuriken: '💠 ФРАКТАЛЬНЫЕ СЮРИКЕНЫ',
      electric_shock:   '⚡ ЭЛЕКТРИЧЕСКИЙ УДАР',
      wave_cannon:      '〰️ ВОЛНОВАЯ ПУШКА'
    };
    const suffix = player.secondaryLevel === 2 ? ' (УР.2!)' : '';
    if (vfx) vfx.addPopup(bn.x, bn.y, (titles[bn.type] || 'БОНУС') + suffix, '#80ffdb', 1.15);
  }

  function fireUniqueBossWeapon(b, lvl, diff) {
    const spd = 225 * diff.bulletSpeed;
    const toPlayer = player ? Math.atan2(player.y - b.y, player.x - b.x) : Math.PI / 2;

    if (lvl.id === 1) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.92 : 1.18;

      [-22, 22].forEach(ex => {
        const eyeAng = Math.atan2(player.y - (b.y - 14), player.x - (b.x + ex));
        enemyBullets.push({
          kind: 'green_spin_star',
          rot: 0,
          x: b.x + ex,
          y: b.y - 14,
          vx: Math.cos(eyeAng) * (spd * 1.05),
          vy: Math.sin(eyeAng) * (spd * 1.05),
          r: 12,
          color: '#06d6a0'
        });
      });

      [-0.28, 0, 0.28].forEach((offsetAng, idx) => {
        const ang = Math.PI / 2 + offsetAng + Math.sin(b.time * 3) * 0.15;
        enemyBullets.push({
          kind: 'psy_wave',
          hue: (b.time * 180 + idx * 110) % 360,
          x: b.x,
          y: b.y + 24,
          vx: Math.cos(ang) * (spd * 0.95),
          vy: Math.sin(ang) * (spd * 0.95),
          ang,
          r: 20,
          color: '#ff006e'
        });
      });

    } else if (lvl.id === 2) {
      if (synth) synth.sfxIgnite();
      b.shootTimer = b.phase === 3 ? 0.68 : 0.92;

      [-0.22, 0.22].forEach(offsetAng => {
        const ang = toPlayer + offsetAng;
        enemyBullets.push({
          kind: 'fireball',
          x: b.x,
          y: b.y + 30,
          vx: Math.cos(ang) * (spd * 1.12),
          vy: Math.sin(ang) * (spd * 1.12),
          r: 12,
          color: '#ffbe0b'
        });
      });

      enemyBullets.push({
        kind: 'laser_shuriken',
        rot: 0,
        x: b.x,
        y: b.y + 24,
        vx: Math.cos(toPlayer) * (spd * 1.22),
        vy: Math.sin(toPlayer) * (spd * 1.22),
        r: 14,
        color: '#ff002b'
      });

    } else if (lvl.id === 3) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 1.05 : 1.32;
      [-0.36, 0, 0.36].forEach((offsetAng, idx) => {
        const ang = Math.PI / 2 + offsetAng + Math.sin(b.time * 2.5) * 0.16;
        enemyBullets.push({
          kind: 'psy_wave',
          hue: (b.time * 140 + idx * 110) % 360,
          x: b.x, y: b.y + 16,
          vx: Math.cos(ang) * (spd * 0.92),
          vy: Math.sin(ang) * (spd * 0.92),
          ang, r: 22, color: '#00f5d4'
        });
      });
    } else if (lvl.id === 4) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.95 : 1.22;
      enemyBullets.push({
        kind: 'psy_wave', hue: 185,
        x: b.x, y: b.y + 20,
        vx: Math.cos(toPlayer) * spd, vy: Math.sin(toPlayer) * spd,
        ang: toPlayer, r: 24, color: '#9bf6ff'
      });
      [-45, 45].forEach(ox => {
        const ang = Math.atan2(player.y - (b.y + 55), player.x - (b.x + ox));
        enemyBullets.push({
          kind: 'enemy_laser',
          x: b.x + ox, y: b.y + 55,
          vx: Math.cos(ang) * (spd * 1.25), vy: Math.sin(ang) * (spd * 1.25),
          ang, r: 6.5, color: '#9bf6ff'
        });
      });
    } else {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.92 : 1.18;
      [-0.28, 0.28].forEach(offsetAng => {
        const ang = toPlayer + offsetAng;
        enemyBullets.push({
          kind: 'laser_flower', rot: 0,
          x: b.x, y: b.y + 24,
          vx: Math.cos(ang) * (spd * 0.92), vy: Math.sin(ang) * (spd * 0.92),
          r: 16, color: '#ff006e'
        });
      });
      enemyBullets.push({
        kind: 'vine_whip',
        x: b.x, y: b.y + 30,
        vx: Math.cos(toPlayer) * (spd * 1.18), vy: Math.sin(toPlayer) * (spd * 1.18),
        ang: toPlayer, r: 11, color: '#80ed99'
      });
    }
  }

  function update(dt) {
    globalTime += dt;

    if (synth && !settingsOverlay.classList.contains('hidden')) {
      const badge = document.getElementById('voice-pool-badge');
      if (badge) badge.textContent = `Голоса: ${synth.getActiveVoiceCount()} / 128`;
    }

    if (typeof LEVELS === 'undefined' || typeof DIFFICULTIES === 'undefined') return;
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

    eventTimer -= dt;
    if (eventTimer <= 0 && !activeEvent) {
      eventTimer = 17 + Math.random() * 6;
      triggerRandomAnomaly(lvl);
    }

    if (activeEvent) {
      activeEvent.timer -= dt;
      if (activeEvent.timer <= 0) activeEvent = null;
    }

    obstacleTimer -= dt;
    if (obstacleTimer <= 0 && !boss) {
      obstacleTimer = 3.6 + Math.random() * 1.8;
      spawnObstacle();
    }

    const dMult = diff.durationMult || 1.0;
    waveTimer += dt;
    if (!boss) {
      if (wave === 1 && waveTimer > 22 * dMult) {
        wave = 2;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 2 / 4!', lvl.accent, 1.2);
      } else if (wave === 2 && waveTimer > 44 * dMult) {
        if (diff.twoBosses && !midBossDefeated) {
          spawnBoss(true);
        } else {
          wave = 3;
          if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 3 / 4: ШТУРМ!', lvl.accent, 1.2);
        }
      } else if (wave === 3 && waveTimer > 66 * dMult) {
        wave = 4;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 4 / 4: ЭЛИТА!', '#ffd166', 1.25);
      } else if (wave === 4 && waveTimer > 85 * dMult) {
        wave = 5;
        spawnBoss(false);
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
    if (p.giantTimer > 0) p.giantTimer = Math.max(0, p.giantTimer - dt);

    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    let speedFactor = p.ship.speedMult || 1.0;
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
          speedFactor *= 0.45;
          if (p.stickyTimer <= 0) {
            p.stickyTimer = 1.2;
            if (synth) synth.sfxSticky();
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
      p.x += dx * Math.min(1, dt * 14 * (speedFactor / (p.ship.speedMult || 1)));
      p.y += dy * Math.min(1, dt * 14 * (speedFactor / (p.ship.speedMult || 1)));
    } else {
      p.vx *= 0.82;
      p.vy *= 0.82;
    }

    const pad = p.giantTimer > 0 ? 42 : 28;
    p.x = Math.max(pad, Math.min(W - pad, p.x));
    p.y = Math.max(pad + 30, Math.min(H - pad, p.y));

    if (world3d) world3d.setCameraFromPlayer(p.x, W);

    p.fireCooldown -= dt;
    const wantsFire = keys['Space'] || keys['KeyZ'] || pointer.active;
    const baseInterval = p.turboTimer > 0 ? 0.13 : 0.18;
    const fireInterval = baseInterval * (p.ship.fireRateMult || 1.0);

    if (wantsFire && p.fireCooldown <= 0) {
      p.fireCooldown = fireInterval;
      p.squashX = 1.13;
      p.squashY = 0.89;
      firePlayerWeapon(p);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const ob = obstacles[i];
      ob.y += ob.vy * dt;
      ob.rot = (ob.rot || 0) + (ob.vrot || 0.5) * dt;
      ob.phase = (ob.phase || 0) + dt * 2.5;

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - ob.x, b.y - ob.y) < ob.r + b.r) {
          if (vfx) vfx.addHitSparks(b.x, b.y, ob.neonColor, 8);
          if (!b.pierce) bullets.splice(j, 1);
          if (synth && Math.random() < 0.35) synth.sfxDisintegrate(((ob.x / W) * 2 - 1) * 0.6);
        }
      }

      const activeRadius = (p.giantTimer > 0 ? p.r * 1.45 : p.r) + ob.r - 4;
      if (Math.hypot(p.x - ob.x, p.y - ob.y) < activeRadius) {
        if (vfx) vfx.addRealisticExplosion(ob.x, ob.y, ob.neonColor, 1.0);
        obstacles.splice(i, 1);
        damagePlayer();
        continue;
      }

      if (ob.y > H + 60) obstacles.splice(i, 1);
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.rot = (b.rot || 0) + dt * 16;
      if (b.homing) {
        let target = boss;
        let bestDist = boss ? Math.hypot(boss.x - b.x, boss.y - b.y) : 9999;
        for (const e of enemies) {
          const d = Math.hypot(e.x - b.x, e.y - b.y);
          if (d < bestDist) { bestDist = d; target = e; }
        }
        if (target && bestDist < 440) {
          const ang = Math.atan2(target.y - b.y, target.x - b.x);
          b.vx += Math.cos(ang) * 1750 * dt;
          b.vy += Math.sin(ang) * 1750 * dt;
          const spd = Math.hypot(b.vx, b.vy);
          if (spd > 690) { b.vx = (b.vx / spd) * 690; b.vy = (b.vy / spd) * 690; }
        }
      }

      if (b.kind === 'wave_pulse') {
        b.r = Math.min(68, b.r + dt * 55);
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (vfx && vfx.trails.length < 50) {
        vfx.addTrail(b.x, b.y + 6, b.color, Math.min(9, b.r * 0.55), 0.16);
      }

      if (b.y < -40 || b.x < -40 || b.x > W + 40) bullets.splice(i, 1);
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
          if (towardsPlayer) e.vx = Math.sign(player.x - e.x) * (120 + Math.random() * 90);
          else e.vx = (Math.random() - 0.5) * 260;
          e.vy = e.baseVy * (0.7 + Math.random() * 0.85);
        }
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }

      if (e.x < e.r + 10) { e.x = e.r + 10; e.vx = Math.abs(e.vx); }
      else if (e.x > W - e.r - 10) { e.x = W - e.r - 10; e.vx = -Math.abs(e.vx); }

      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6);

      e.shootTimer -= dt;
      if (e.shootTimer <= 0 && e.y > 40 && e.y < H * 0.68) {
        e.shootTimer = 1.80 / diff.bulletSpeed;
        const ang = Math.atan2(p.y - e.y, p.x - e.x);
        const spd = 225 * diff.bulletSpeed;

        if (e.kind === 'skeleton_ship' || e.kind === 'cookie_eye' || e.kind === 'fish_ship' || e.kind === 'starfish_ship') {
          const lCol = e.kind === 'starfish_ship' ? '#80ed99' : (e.kind === 'cookie_eye' ? '#ffd166' : (e.kind === 'fish_ship' ? '#9bf6ff' : '#ff002b'));
          enemyBullets.push({
            kind: 'enemy_laser',
            x: e.x, y: e.y + 18,
            vx: Math.cos(ang) * (spd * 1.42),
            vy: Math.sin(ang) * (spd * 1.42),
            ang, r: 6.5, color: lCol
          });
        } else if (e.kind === 'bat_ship' || e.kind === 'spider_ship' || e.kind === 'octopus_ship' || e.kind === 'octopus_bio' || e.kind === 'pegasus_bomber') {
          const mCol = e.kind === 'octopus_bio' ? '#70e000' : (e.kind === 'octopus_ship' ? '#9bf6ff' : '#ff5964');
          enemyBullets.push({
            kind: 'enemy_missile',
            homing: true, life: 2.7,
            x: e.x, y: e.y + 18,
            vx: Math.cos(ang) * (spd * 0.88),
            vy: Math.sin(ang) * (spd * 0.88),
            r: 8.5, color: mCol
          });
        } else if (e.kind === 'rainbow_spiral' || e.kind === 'manta_wave' || e.kind === 'jellyfish_ship') {
          const wHue = e.kind === 'jellyfish_ship' ? 135 : (e.kind === 'manta_wave' ? 185 : Math.floor((e.phase * 120) % 360));
          enemyBullets.push({
            kind: 'psy_wave', hue: wHue,
            x: e.x, y: e.y + 18,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            ang, r: 18, color: lvl.accent
          });
        } else {
          enemyBullets.push({
            x: e.x, y: e.y + e.r * 0.7,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 7.5, color: lvl.accent
          });
        }
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + b.r) {
          e.hp -= b.dmg;
          e.hitFlash = 1;

          if (vfx) vfx.addHitSparks(b.x, b.y, b.color || lvl.accent, 11);

          if (b.chainLightning && vfx) {
            for (const other of enemies) {
              if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 170) {
                other.hp -= b.dmg * 0.65;
                other.hitFlash = 1;
                vfx.addLightningArc(e.x, e.y, other.x, other.y, '#fee440');
                break;
              }
            }
          }

          if (b.pierce && b.pierce > 0) {
            b.pierce--;
          } else {
            bullets.splice(j, 1);
          }

          if (e.hp <= 0) {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            if (synth) synth.sfxExplosion(pan, false);
            if (vfx) vfx.addRealisticExplosion(e.x, e.y, lvl.accent, 1.05, e.wingCol, e.bodyCol);

            const pts = Math.round(e.points * combo * diff.scoreMult);
            const earnedFood = Math.round(e.coinValue * (p.ship.coinMult || 1));
            score += pts;
            runCoins += earnedFood;
            kills++;
            combo = Math.min(5, combo + 1);
            comboTimer = 3.2;
            const foodIcons = ['🐟', '🍖', '🥛'];
            const fIcon = foodIcons[kills % foodIcons.length];
            if (vfx) vfx.addPopup(e.x, e.y, `+${earnedFood} ${fIcon}`, '#ffd6a5');
            maybeDropFoodBonus(e.x, e.y, false);
            enemies.splice(i, 1);
            screenShake = Math.max(screenShake, 7);
          } else {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            if (synth) synth.sfxHit(pan);
          }
          break;
        }
      }

      if (!enemies[i]) continue;

      const activeRadius = (p.giantTimer > 0 ? p.r * 1.5 : p.r) + e.r - 4;
      if (Math.hypot(p.x - e.x, p.y - e.y) < activeRadius) {
        if (vfx) vfx.addRealisticExplosion(e.x, e.y, '#ff5964', 1.1, e.wingCol, e.bodyCol);
        enemies.splice(i, 1);
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
        eb.vx += Math.cos(ang) * 190 * dt;
        eb.vy += Math.sin(ang) * 190 * dt;
        if (vfx && Math.random() < 0.4) vfx.addTrail(eb.x, eb.y, eb.color || '#ff758f', 4.5, 0.15);
      }

      if (eb.kind === 'psy_wave') {
        eb.hue = (eb.hue + dt * 220) % 360;
        eb.r = Math.min(36, eb.r + dt * 12);
      } else if (eb.kind === 'laser_flower' || eb.kind === 'green_spin_star' || eb.kind === 'laser_shuriken') {
        eb.rot = (eb.rot || 0) + dt * 9;
      }

      eb.x += eb.vx * dt;
      eb.y += eb.vy * dt;

      const activeRadius = (p.giantTimer > 0 ? p.r * 1.5 : p.r) + eb.r - 5;
      if (Math.hypot(eb.x - p.x, eb.y - p.y) < activeRadius) {
        if (vfx) vfx.addHitSparks(eb.x, eb.y, '#ff5964', 10);
        enemyBullets.splice(i, 1);
        damagePlayer();
        continue;
      }
      if (eb.y > H + 40 || eb.y < -50 || eb.x < -40 || eb.x > W + 40) enemyBullets.splice(i, 1);
    }

    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bn = bonuses[i];
      bn.phase += dt * 5;
      bn.y += bn.vy * dt;

      if (Math.hypot(p.x - bn.x, p.y - bn.y) < (p.giantTimer > 0 ? p.r * 1.5 : p.r) + bn.r + 6) {
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
    if (b.shootTimer <= 0) fireUniqueBossWeapon(b, lvl, diff);

    b.specialTimer -= dt;
    if (b.specialTimer <= 0) {
      if (b.laserState === 'idle') {
        b.laserState = 'charge';
        b.laserTimer = 0.95;
        b.laserX = player.x;
        if (synth) synth.sfxBossAlarm();
      } else {
        b.specialTimer = 4.5;
        if (enemies.length < 3) spawnEnemy();
        maybeDropFoodBonus(b.x, b.y + 45, true);
      }
    }

    if (b.laserState === 'charge') {
      b.laserTimer -= dt;
      b.laserX += (player.x - b.laserX) * Math.min(1, dt * 3.8);
      if (b.laserTimer <= 0) {
        b.laserState = 'fire';
        b.laserTimer = 0.78;
        if (synth) synth.sfxExplosion(0, true);
        if (vfx) vfx.triggerFlash(lvl.accent, 0.24);
        screenShake = 9;
      }
    } else if (b.laserState === 'fire') {
      b.laserTimer -= dt;
      if (Math.abs(player.x - b.laserX) < 28 + player.r * 0.6 && player.y > b.y) damagePlayer();
      if (b.laserTimer <= 0) {
        b.laserState = 'idle';
        b.specialTimer = 3.5;
      }
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const bul = bullets[j];
      if (Math.hypot(bul.x - b.x, bul.y - b.y) < b.r + bul.r - 6) {
        b.hp -= bul.dmg;
        b.hitFlash = 1;
        score += 25;
        if (vfx) {
          vfx.addHitSparks(bul.x, bul.y, bul.color || lvl.accent, 10);
          if (bul.chainLightning) vfx.addLightningArc(bul.x, bul.y, b.x + (Math.random() - 0.5) * 50, b.y, '#fee440');
        }
        bullets.splice(j, 1);

        if (b.hp <= 0) {
          if (synth) synth.sfxBossExplosion();
          if (vfx) {
            vfx.triggerFlash('#ffffff', 0.65);
            vfx.addRealisticExplosion(b.x, b.y, lvl.accent, 2.3, lvl.bossColor, '#ffd166');
          }
          screenShake = 22;

          if (b.isMidBoss) {
            midBossDefeated = true;
            score += 1800;
            runCoins += Math.round((lvl.coinReward || 380) * 0.5);
            kills++;
            maybeDropFoodBonus(b.x, b.y, true);
            boss = null;
            wave = 3;
            if (synth) synth.startMusic('normal', lvl.id);
            if (vfx) vfx.addPopup(W / 2, H * 0.35, '1-Й БОСС ПОВЕРЖЕН! ВПЕРЕДИ МЕГА-БОСС!', '#80ffdb', 1.2);
            return;
          }

          score += Math.round((2500 + lvl.id * 400) * diff.scoreMult);
          runCoins += Math.round((lvl.coinReward || 380) * (player.ship.coinMult || 1));
          kills++;
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
        vfx.addHitSparks(player.x, player.y, '#48dbfb', 16);
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
      vfx.addRealisticExplosion(player.x, player.y, '#ff5964', 1.1);
    }

    if (player.hp <= 0) finishGame(false);
  }

  function finishGame(victory) {
    state = victory ? 'VICTORY' : 'GAMEOVER';
    pointer.active = false;
    pauseBtn.classList.add('hidden');
    if (synth) synth.stopMusic();

    const lvl = LEVELS[selectedLevelIdx];
    const victoryStageBox = document.getElementById('victory-stage-box');

    progress.coins += runCoins;

    if (victory) {
      if (synth) synth.sfxVictory();
      if (!progress.completed.includes(lvl.id)) progress.completed.push(lvl.id);
      if (victoryStageBox) {
        victoryStageBox.classList.remove('hidden');
        resolveImageToElement(document.getElementById('end-stage-img'), [`img/level${lvl.id}_out.jpg`, 'img/transition_out.jpg', 'img/1000036352.jpg']);
      }
    } else {
      if (synth) synth.sfxGameOver();
      if (victoryStageBox) victoryStageBox.classList.add('hidden');
    }

    if (score > progress.bestScore) progress.bestScore = score;
    saveProgress(progress);

    document.getElementById('end-badge').textContent = victory
      ? `Уровень ${lvl.id} пройден!`
      : `Уровень ${lvl.id}: Корабль подбит`;
    document.getElementById('end-title').textContent = victory
      ? (lvl.id === 5 ? 'КОТОВИЯ-17 НАКОРМЛЕНА! 👑' : 'ПОБЕДА! 🏆')
      : 'ИГРА ОКОНЧЕНА';
    document.getElementById('end-subtitle').textContent = victory
      ? `${lvl.bossName} повержен! Загляни в Ангар, чтобы обменять рыбку на новый корабль!`
      : `Ты добыл +${runCoins} 🐟 провизии! Прокачай флот в Ангаре!`;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-coins').textContent = `+${runCoins} 🐟`;
    document.getElementById('final-kills').textContent = kills;

    const nextBtn = document.getElementById('next-level-btn');
    if (victory) {
      nextBtn.textContent = selectedLevelIdx < LEVELS.length - 1 ? 'ДАЛЬШЕ ➔' : 'ЗАНОВО С 1-ГО ➔';
    } else {
      nextBtn.textContent = 'ЕЩЁ РАЗ 🔄';
    }

    setTimeout(() => { endOverlay.classList.remove('hidden'); }, victory ? 480 : 320);
  }

  function drawActiveAnomaly(ctx) {
    if (!activeEvent) return;
    ctx.save();
    if (activeEvent.type === 'gravity') {
      const r = 45 + Math.sin(globalTime * 8) * 10;
      ctx.strokeStyle = 'rgba(189, 178, 255, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(activeEvent.x, activeEvent.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(activeEvent.x, activeEvent.y, r * 1.8, 0, Math.PI * 2); ctx.stroke();
    } else if (activeEvent.type === 'sticky') {
      ctx.fillStyle = 'rgba(255, 175, 204, 0.22)';
      ctx.strokeStyle = 'rgba(255, 112, 166, 0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(activeEvent.x, activeEvent.y, activeEvent.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer(p) {
    if (p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    const tilt = Math.max(-0.24, Math.min(0.24, p.vx * 0.00055));
    ctx.rotate(tilt);

    const scaleFactor = (p.giantTimer > 0 ? 1.5 : 1.0);
    ctx.scale(p.squashX * scaleFactor, p.squashY * scaleFactor);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const shipId = p.ship.id;
    const hullCol = p.ship.hullColor || '#e0fbfc';
    const wingCol = p.ship.wingColor || '#ff5964';
    const neonCol = p.ship.neonColor || '#48dbfb';

    ctx.fillStyle = neonCol;
    ctx.globalAlpha = 0.24;
    ctx.beginPath(); ctx.arc(0, 2, 36, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (shipId === 'emperor') {
      ctx.strokeStyle = '#fee440';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 2, 37, globalTime * 3, globalTime * 3 + Math.PI * 1.4); ctx.stroke();
    }

    const flameH = 19 + Math.sin(globalTime * 42) * 6;
    [-11, 11].forEach(ox => {
      ctx.fillStyle = '#2b2d42';
      roundRectPath(ctx, ox - 5, 14, 10, 7, 3);
      ctx.fill();

      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath();
      ctx.moveTo(ox - 5, 20);
      ctx.quadraticCurveTo(ox, 20 + flameH * 1.25, ox + 5, 20);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(ox - 2.5, 20);
      ctx.quadraticCurveTo(ox, 20 + flameH * 0.65, ox + 2.5, 20);
      ctx.closePath(); ctx.fill();
    });

    ctx.fillStyle = wingCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.4;

    if (shipId === 'interceptor' || shipId === 'valkyrie' || shipId === 'emperor') {
      const span = shipId === 'emperor' ? 43 : (shipId === 'valkyrie' ? 40 : 37);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.bezierCurveTo(-span * 0.6, -12, -span, 2, -span * 0.82, 18);
      ctx.quadraticCurveTo(-span * 0.35, 13, 0, 17);
      ctx.quadraticCurveTo(span * 0.35, 13, span * 0.82, 18);
      ctx.bezierCurveTo(span, 2, span * 0.6, -12, 0, -14);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.bezierCurveTo(-22, -6, -36, 6, -32, 19);
      ctx.quadraticCurveTo(-15, 16, 0, 19);
      ctx.quadraticCurveTo(15, 16, 32, 19);
      ctx.bezierCurveTo(36, 6, 22, -6, 0, -10);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    const hw = (shipId === 'dreadnought' || shipId === 'emperor') ? 20 : 17;
    ctx.fillStyle = hullCol;
    ctx.strokeStyle = BORDER_INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0, -29);
    ctx.bezierCurveTo(hw * 1.15, -18, hw * 1.15, 14, 0, 26);
    ctx.bezierCurveTo(-hw * 1.15, 14, -hw * 1.15, -18, 0, -29);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-hw * 0.42, -2, hw * 0.28, 15, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = wingCol;
    ctx.beginPath();
    ctx.moveTo(0, -29);
    ctx.quadraticCurveTo(hw * 0.72, -19, hw * 0.68, -13);
    ctx.quadraticCurveTo(0, -17, -hw * 0.68, -13);
    ctx.quadraticCurveTo(-hw * 0.72, -19, 0, -29);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#48dbfb';
    ctx.beginPath(); ctx.ellipse(0, 1, 12, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(-7, -3); ctx.lineTo(-5, -10); ctx.lineTo(-2, -5);
    ctx.moveTo(7, -3);  ctx.lineTo(5, -10);  ctx.lineTo(2, -5);
    ctx.fill();
    ctx.beginPath(); ctx.arc(0, 1, 8, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath(); ctx.ellipse(-4, -5, 3.5, 6, -0.35, 0, Math.PI * 2); ctx.fill();

    if (p.shield) {
      const pulse = 36 + Math.sin(globalTime * 8) * 2.5;
      ctx.strokeStyle = '#ff5964';
      ctx.fillStyle = 'rgba(255, 89, 100, 0.20)';
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, 0, pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    if (p.giantTimer > 0) {
      ctx.strokeStyle = '#06d6a0';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.arc(0, 0, 39, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  function drawCatLifeIcon(ctx, x, y, active) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.fillStyle = active ? '#ffb703' : 'rgba(255, 255, 255, 0.18)';
    ctx.strokeStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    ctx.moveTo(-7, -2); ctx.lineTo(-8, -10); ctx.lineTo(-2, -6);
    ctx.moveTo(7, -2);  ctx.lineTo(8, -10);  ctx.lineTo(2, -6);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    if (active) {
      ctx.fillStyle = '#120a28';
      ctx.beginPath();
      ctx.arc(-2.8, -1, 1.3, 0, Math.PI * 2);
      ctx.arc(2.8, -1, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(0, 1.8, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawHUD() {
    if ((state !== 'PLAYING' && state !== 'PAUSED') || !player) return;
    const lvl = LEVELS[selectedLevelIdx];

    ctx.save();
    for (let i = 0; i < player.maxHp; i++) {
      drawCatLifeIcon(ctx, 22 + i * 21, 26, i < player.hp);
    }

    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = BORDER_INK;
    ctx.lineWidth = 4;
    ctx.font = '900 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.strokeText(`${score}  •  🐟 ${runCoins}`, 18, 60);
    ctx.fillText(`${score}  •  🐟 ${runCoins}`, 18, 60);

    ctx.fillStyle = lvl.accent;
    ctx.font = '800 12px sans-serif';
    const waveLabel = boss ? (boss.isMidBoss ? 'МИНИ-БОСС' : 'МЕГА-БОСС') : `ВОЛНА ${Math.min(4, wave)}/4`;
    const subHud = combo > 1
      ? `УРОВЕНЬ ${lvl.id} • ${waveLabel} • x${combo}`
      : `УРОВЕНЬ ${lvl.id} • ${waveLabel}`;
    ctx.strokeText(subHud, 18, 78);
    ctx.fillText(subHud, 18, 78);

    if (boss) {
      const bw = Math.min(240, W - 210);
      const bx = (W - bw) / 2 - 18;
      const by = 18;

      ctx.fillStyle = '#ffd166';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      const bTitle = boss.isMidBoss ? `АВАНГАРД: ${lvl.bossName.toUpperCase()}` : lvl.bossName.toUpperCase();
      ctx.strokeText(bTitle, bx + bw / 2, by + 32);
      ctx.fillText(bTitle, bx + bw / 2, by + 32);

      roundRectPath(ctx, bx, by, bw, 15, 8);
      ctx.fillStyle = BORDER_INK;
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
      ctx.strokeStyle = BORDER_INK;
      ctx.lineWidth = 5;
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44);
      ctx.fillText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44);
    }

    ctx.restore();
  }

  function drawEnemyBullet(ctx, eb) {
    ctx.save();
    ctx.translate(eb.x, eb.y);

    if (eb.kind === 'green_spin_star') {
      ctx.rotate(eb.rot || 0);
      ctx.fillStyle = 'rgba(6, 214, 160, 0.35)';
      ctx.beginPath(); ctx.arc(0, 0, eb.r + 5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#06d6a0';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * (eb.r + 2), Math.sin(a) * (eb.r + 2));
        ctx.lineTo(Math.cos(a + Math.PI / 5) * (eb.r * 0.45), Math.sin(a + Math.PI / 5) * (eb.r * 0.45));
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();

    } else if (eb.kind === 'laser_shuriken') {
      ctx.rotate(eb.rot || 0);
      ctx.fillStyle = 'rgba(255, 0, 43, 0.35)';
      ctx.beginPath(); ctx.arc(0, 0, eb.r + 6, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ff002b';
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * i) / 4;
        const rad = i % 2 === 0 ? eb.r + 2 : eb.r * 0.42;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();

    } else if (eb.kind === 'psy_wave') {
      ctx.rotate((eb.ang || Math.PI / 2) - Math.PI / 2);
      const col1 = `hsl(${eb.hue || 0}, 100%, 62%)`;
      const col2 = `hsl(${((eb.hue || 0) + 90) % 360}, 100%, 72%)`;

      ctx.strokeStyle = col1;
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, -6, eb.r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

      ctx.strokeStyle = col2;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, -2, eb.r * 0.72, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    } else if (eb.kind === 'laser_flower') {
      ctx.rotate(eb.rot || 0);
      ctx.fillStyle = '#ff006e';
      ctx.strokeStyle = '#80ed99';
      ctx.lineWidth = 2.2;
      for (let k = 0; k < 6; k++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.ellipse(9, 0, 8, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill();

    } else if (eb.kind === 'vine_whip') {
      ctx.rotate((eb.ang || Math.PI / 2) - Math.PI / 2);
      ctx.strokeStyle = '#80ed99';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(0, -14); ctx.quadraticCurveTo(6, -4, -5, 6); ctx.quadraticCurveTo(5, 12, 0, 18);
      ctx.stroke();

    } else if (eb.kind === 'enemy_laser') {
      ctx.rotate(Math.atan2(eb.vy, eb.vx) - Math.PI / 2);
      ctx.fillStyle = eb.color || '#ff002b';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      roundRectPath(ctx, -3.5, -14, 7, 28, 3.5);
      ctx.fill(); ctx.stroke();

    } else if (eb.kind === 'enemy_missile') {
      ctx.rotate(Math.atan2(eb.vy, eb.vx) - Math.PI / 2);
      ctx.fillStyle = '#4a4e69';
      ctx.strokeStyle = eb.color || '#ff0054';
      ctx.lineWidth = 2;
      roundRectPath(ctx, -5, -10, 10, 20, 5);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();

    } else if (eb.kind === 'fireball') {
      ctx.fillStyle = 'rgba(255, 107, 53, 0.45)';
      ctx.beginPath(); ctx.arc(0, 0, eb.r * 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath(); ctx.arc(0, 0, eb.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-2, -2, eb.r * 0.45, 0, Math.PI * 2); ctx.fill();

    } else {
      ctx.fillStyle = eb.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, eb.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  function render() {
    const lvl = typeof LEVELS !== 'undefined' ? LEVELS[selectedLevelIdx] : { skyMid: '#1b1442', accent: '#48dbfb' };
    ctx.save();
    if (screenShake > 0) {
      ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    }

    if (world3d) {
      world3d.render(ctx, lvl, W, H);
    } else {
      ctx.fillStyle = lvl.skyMid;
      ctx.fillRect(0, 0, W, H);
    }

    drawActiveAnomaly(ctx);

    if (vfx) vfx.renderTrails(ctx);

    for (const ob of obstacles) {
      if (typeof drawObstacle === 'function') drawObstacle(ctx, ob);
    }

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
      drawEnemyBullet(ctx, eb);
    }

    if (player && state !== 'GAMEOVER' && state !== 'START') {
      drawPlayer(player);
    }

    if (vfx) vfx.renderForeground(ctx, W, H);

    drawHUD();
    ctx.restore();
  }

  let lastTime = performance.now();

  (function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    try {
      update(dt);
      render();
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame(loop);
  })(performance.now());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pointer.active = false;
    else lastTime = performance.now();
  });
})();
