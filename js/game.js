(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_hangar_v27';
  const BORDER_INK = typeof INK !== 'undefined' ? INK : '#120826';

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        bestScore: raw.bestScore || 0,
        endlessBest: raw.endlessBest || 0,
        coins: typeof raw.coins === 'number' ? raw.coins : 0,
        completed: Array.isArray(raw.completed) ? raw.completed : [],
        unlockedShips: Array.isArray(raw.unlockedShips) && raw.unlockedShips.length ? raw.unlockedShips : ['shuttle'],
        equippedShip: raw.equippedShip || 'shuttle',
        unlockedWeapons: Array.isArray(raw.unlockedWeapons) && raw.unlockedWeapons.length ? raw.unlockedWeapons : ['droplet'],
        equippedWeapon: raw.equippedWeapon || 'droplet',
        unlockedDrones: Array.isArray(raw.unlockedDrones) && raw.unlockedDrones.length ? raw.unlockedDrones : ['none'],
        equippedDrone: raw.equippedDrone || 'none',
        loreSeen: Boolean(raw.loreSeen)
      };
    } catch (e) {
      return {
        bestScore: 0, endlessBest: 0, coins: 0, completed: [],
        unlockedShips: ['shuttle'], equippedShip: 'shuttle',
        unlockedWeapons: ['droplet'], equippedWeapon: 'droplet',
        unlockedDrones: ['none'], equippedDrone: 'none',
        loreSeen: false
      };
    }
  }

  function saveProgress(prog) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prog)); } catch (e) {}
  }

  const canvas = document.getElementById('game');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const menuParticlesCanvas = document.getElementById('menu-particles-canvas');
  const mpCtx = menuParticlesCanvas ? menuParticlesCanvas.getContext('2d') : null;

  const synth = typeof AstraCatSynth !== 'undefined' ? new AstraCatSynth(36) : null;
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
  const ultBtn = document.getElementById('ult-btn');

  let progress = loadProgress();
  let selectedLevelIdx = 0;
  let selectedDiffKey = 'normal';
  let W = 480, H = 800, dpr = 1;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(320, Math.min(520, rect.width || window.innerWidth));
    H = Math.max(480, rect.height || window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (menuParticlesCanvas && mpCtx) {
      menuParticlesCanvas.width = Math.floor(W * dpr);
      menuParticlesCanvas.height = Math.floor(H * dpr);
      mpCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  const menuFloats = Array.from({ length: 8 }, (_, i) => ({
    x: (i + 0.5) / 8,
    y: Math.random(),
    kind: i % 3 === 0 ? 'fish' : (i % 3 === 1 ? 'cat' : 'donut'),
    size: 11 + (i % 2) * 2,
    vy: 14 + (i % 3) * 5,
    vx: (i % 2 === 0 ? 1 : -1) * 8,
    rot: Math.random() * Math.PI * 2,
    vrot: (i % 2 === 0 ? 0.7 : -0.7),
    phase: i * 1.3
  }));

  function updateAndRenderMenuParticles(dt) {
    if (!menuParticlesCanvas || !mpCtx) return;
    const isMenuVisible =
      !startOverlay.classList.contains('hidden') ||
      !loreOverlay.classList.contains('hidden') ||
      !introOverlay.classList.contains('hidden') ||
      !settingsOverlay.classList.contains('hidden') ||
      !endOverlay.classList.contains('hidden');

    menuParticlesCanvas.style.display = isMenuVisible ? 'block' : 'none';
    if (!isMenuVisible) return;

    mpCtx.clearRect(0, 0, W, H);
    for (const p of menuFloats) {
      p.y -= (p.vy * dt) / H;
      p.x += (p.vx * dt) / W;
      p.rot += p.vrot * dt;
      p.phase += dt * 2.5;

      if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); }
      if (p.x < -0.06) p.x = 1.06;
      if (p.x > 1.06) p.x = -0.06;

      const px = p.x * W + Math.sin(p.phase) * 6;
      const py = p.y * H;
      const r = p.size;

      mpCtx.save();
      mpCtx.translate(px, py);
      mpCtx.rotate(Math.sin(p.phase * 0.6) * 0.2);
      mpCtx.globalAlpha = 0.42;
      mpCtx.lineJoin = 'round';
      mpCtx.lineCap = 'round';

      if (p.kind === 'fish') {
        mpCtx.fillStyle = '#90e0ef'; mpCtx.strokeStyle = '#ffffff'; mpCtx.lineWidth = 1.4;
        mpCtx.beginPath(); mpCtx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2); mpCtx.fill(); mpCtx.stroke();
        mpCtx.beginPath(); mpCtx.moveTo(-r * 0.85, 0); mpCtx.lineTo(-r * 1.45, -r * 0.5); mpCtx.lineTo(-r * 1.45, r * 0.5); mpCtx.closePath(); mpCtx.fill();
      } else if (p.kind === 'cat') {
        mpCtx.fillStyle = '#ffd166'; mpCtx.strokeStyle = '#ffffff'; mpCtx.lineWidth = 1.4;
        mpCtx.beginPath();
        mpCtx.moveTo(-r * 0.75, -r * 0.2); mpCtx.lineTo(-r * 0.85, -r * 1.05); mpCtx.lineTo(-r * 0.2, -r * 0.65);
        mpCtx.moveTo(r * 0.75, -r * 0.2);  mpCtx.lineTo(r * 0.85, -r * 1.05);  mpCtx.lineTo(r * 0.2, -r * 0.65);
        mpCtx.closePath(); mpCtx.fill(); mpCtx.stroke();
        mpCtx.beginPath(); mpCtx.arc(0, 0, r * 0.82, 0, Math.PI * 2); mpCtx.fill(); mpCtx.stroke();
      } else {
        mpCtx.rotate(p.rot);
        mpCtx.fillStyle = '#f4a261'; mpCtx.beginPath(); mpCtx.arc(0, 0, r * 0.9, 0, Math.PI * 2); mpCtx.fill();
        mpCtx.fillStyle = '#ff85a1'; mpCtx.beginPath(); mpCtx.arc(0, 0, r * 0.72, 0, Math.PI * 2); mpCtx.fill();
        mpCtx.fillStyle = '#3d216e'; mpCtx.beginPath(); mpCtx.arc(0, 0, r * 0.28, 0, Math.PI * 2); mpCtx.fill();
      }
      mpCtx.restore();
    }
  }

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
      probe.onload = () => { imgEl.src = src; imgEl.style.display = 'block'; };
      probe.onerror = tryNext;
      probe.src = src;
    };
    tryNext();
  }

  function setupMenuBackgrounds() {
    const titleBox = document.getElementById('splash-fallback-title');
    if (titleBox) titleBox.style.display = 'none';
    resolveImageToElement(document.getElementById('splash-bg-img'), ['img/splash.jpg', 'img/1000036349.jpg'], () => {
      if (titleBox) titleBox.style.display = 'block';
    });
    ['menu-outer-bg', 'hangar-outer-bg', 'lore-outer-bg', 'intro-outer-bg'].forEach(id => {
      resolveImageToElement(document.getElementById(id), ['img/menu_bg.jpg', 'img/1000036350.jpg']);
    });
    resolveImageToElement(document.getElementById('end-outer-bg'), ['img/transition_out.jpg', 'img/1000036352.jpg']);
    ['menu-inner-bg', 'hangar-inner-bg', 'settings-inner-bg'].forEach(id => {
      resolveImageToElement(document.getElementById(id), ['img/hangar_bg.jpg', 'img/1000036353.jpg']);
    });
    resolveImageToElement(document.getElementById('settings-outer-bg'), ['img/transition_in.jpg', 'img/1000036354.jpg']);
  }
  setupMenuBackgrounds();
  syncTopHudVisibility();
  if (synth) synth.startIntroMusic();

  function applySiteTheme(lvl) {
    document.body.classList.toggle('theme-organic', Boolean(lvl && lvl.theme === 'organic'));
  }

  document.getElementById('prev-track-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) { synth.init(); synth.prevTrack(); }
  });
  document.getElementById('next-track-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) { synth.init(); synth.nextTrack(); }
  });

  document.getElementById('splash-enter-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (synth) { synth.init(); synth.sfxMenuTransition(); synth.startIntroMusic(); }
    splashOverlay.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  });

  function getActiveShip() {
    return SHIPS_CATALOG.find(s => s.id === progress.equippedShip) || SHIPS_CATALOG[0];
  }

  function getActiveBaseWeapon() {
    return WEAPONS_CATALOG.find(w => w.id === progress.equippedWeapon) || WEAPONS_CATALOG[0];
  }

  function getActiveDrone() {
    const list = typeof DRONES_CATALOG !== 'undefined' ? DRONES_CATALOG : [{ id: 'none', name: 'Без дрона', desc: '', price: 0 }];
    return list.find(d => d.id === progress.equippedDrone) || list[0];
  }

  function updateCoinsUI() {
    const mEl = document.getElementById('menu-coins');
    const hEl = document.getElementById('hangar-coins');
    if (mEl) mEl.textContent = `🐟 ${progress.coins}`;
    if (hEl) hEl.textContent = `🐟 ${progress.coins}`;
  }

  // =========================================================================
  // АНГАР (3 РАЗДЕЛА: КОРАБЛИ / ОРУЖИЕ / ДРОНЫ-КОМПАНЬОНЫ)
  // =========================================================================
  let hangarShipCanvases = [];
  let hangarWeaponCanvases = [];
  let hangarDroneCanvases = [];
  let activeHangarTab = 'ships';

  const tabShipsBtn = document.getElementById('tab-ships-btn');
  const tabWeaponsBtn = document.getElementById('tab-weapons-btn');
  const tabDronesBtn = document.getElementById('tab-drones-btn');
  const secShips = document.getElementById('hangar-section-ships');
  const secWeapons = document.getElementById('hangar-section-weapons');
  const secDrones = document.getElementById('hangar-section-drones');

  function switchHangarTab(tab) {
    activeHangarTab = tab;
    if (tabShipsBtn) tabShipsBtn.classList.toggle('active', tab === 'ships');
    if (tabWeaponsBtn) tabWeaponsBtn.classList.toggle('active', tab === 'weapons');
    if (tabDronesBtn) tabDronesBtn.classList.toggle('active', tab === 'drones');
    if (secShips) secShips.classList.toggle('hidden', tab !== 'ships');
    if (secWeapons) secWeapons.classList.toggle('hidden', tab !== 'weapons');
    if (secDrones) secDrones.classList.toggle('hidden', tab !== 'drones');
  }

  tabShipsBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) synth.sfxMenuSelect(); switchHangarTab('ships'); });
  tabWeaponsBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) synth.sfxMenuSelect(); switchHangarTab('weapons'); });
  tabDronesBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) synth.sfxMenuSelect(); switchHangarTab('drones'); });

  function scrollCarouselToIdx(carouselEl, idx) {
    if (!carouselEl || !carouselEl.children[idx]) return;
    const card = carouselEl.children[idx];
    carouselEl.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
  }

  function drawDroneIcon(ctx, droneId, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (droneId === 'spark') {
      drawGlossyCircle(ctx, 0, 0, 10, '#48dbfb');
      ctx.fillStyle = '#fee440'; ctx.beginPath(); ctx.arc(0, -3, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (droneId === 'magnet') {
      drawGlossyCircle(ctx, 0, 0, 11, '#ff70a6');
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🐟', 0, 1);
    } else if (droneId === 'guard') {
      ctx.rotate(t * 5);
      drawGlossyCircle(ctx, 0, 0, 10, '#ffd166');
      ctx.strokeStyle = '#ff006e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 1.5); ctx.stroke();
    }
    ctx.restore();
  }

  function renderHangar() {
    updateCoinsUI();
    const shipsCarousel = document.getElementById('ships-carousel');
    const weaponsCarousel = document.getElementById('weapons-carousel');
    const dronesCarousel = document.getElementById('drones-carousel');
    if (!shipsCarousel || !weaponsCarousel || !dronesCarousel) return;

    hangarShipCanvases = [];
    hangarWeaponCanvases = [];
    hangarDroneCanvases = [];

    shipsCarousel.innerHTML = '';
    SHIPS_CATALOG.forEach((ship, idx) => {
      const owned = progress.unlockedShips.includes(ship.id);
      const equipped = progress.equippedShip === ship.id;
      const card = document.createElement('div');
      card.className = 'media-card' + (equipped ? ' equipped' : '');
      const btnClass = equipped ? 'active' : (owned ? 'equip' : 'buy');
      const btnLabel = equipped ? 'ВЫБРАН ✔' : (owned ? 'ВЫБРАТЬ' : `${ship.price} 🐟`);

      card.innerHTML = `
        <div class="media-viewport"><span class="viewport-badge">МОДЕЛЬ ${idx + 1}/5</span><canvas width="260" height="170"></canvas></div>
        <div class="media-card-title">🚀 ${ship.name}</div>
        <div class="media-card-desc">${ship.desc}</div>
        <button class="shop-action-btn ${btnClass}">${btnLabel}</button>
      `;
      const cvs = card.querySelector('canvas');
      hangarShipCanvases.push({ cvs, ctx: cvs.getContext('2d'), ship, idx });

      card.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); if (synth) synth.init();
        if (equipped) { if (synth) synth.sfxMenuTap(); return; }
        if (owned) {
          progress.equippedShip = ship.id; saveProgress(progress);
          if (synth) synth.sfxMenuSelect(); renderHangar();
        } else if (progress.coins >= ship.price) {
          progress.coins -= ship.price; progress.unlockedShips.push(ship.id); progress.equippedShip = ship.id;
          saveProgress(progress); if (synth) synth.sfxBuyItem(); renderHangar();
        } else if (synth) synth.sfxHurt();
      });
      shipsCarousel.appendChild(card);
    });

    weaponsCarousel.innerHTML = '';
    const activeShip = getActiveShip();
    WEAPONS_CATALOG.forEach((wp, idx) => {
      const owned = progress.unlockedWeapons.includes(wp.id);
      const equipped = progress.equippedWeapon === wp.id;
      const card = document.createElement('div');
      card.className = 'media-card' + (equipped ? ' equipped' : '');
      const btnClass = equipped ? 'active' : (owned ? 'equip' : 'buy');
      const btnLabel = equipped ? 'УСТАНОВЛЕНО ✔' : (owned ? 'ВЫБРАТЬ' : `${wp.price} 🐟`);

      card.innerHTML = `
        <div class="media-viewport"><span class="viewport-badge">ТЕСТ ЗАЛПА</span><canvas width="260" height="170"></canvas></div>
        <div class="media-card-title">🔫 ${wp.name}</div>
        <div class="media-card-desc">${wp.desc}</div>
        <button class="shop-action-btn ${btnClass}">${btnLabel}</button>
      `;
      const cvs = card.querySelector('canvas');
      hangarWeaponCanvases.push({ cvs, ctx: cvs.getContext('2d'), wp, ship: activeShip, idx });

      card.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); if (synth) synth.init();
        if (equipped) { if (synth) synth.sfxMenuTap(); return; }
        if (owned) {
          progress.equippedWeapon = wp.id; saveProgress(progress);
          if (synth) synth.sfxMenuSelect(); renderHangar();
        } else if (progress.coins >= wp.price) {
          progress.coins -= wp.price; progress.unlockedWeapons.push(wp.id); progress.equippedWeapon = wp.id;
          saveProgress(progress); if (synth) synth.sfxBuyItem(); renderHangar();
        } else if (synth) synth.sfxHurt();
      });
      weaponsCarousel.appendChild(card);
    });

    dronesCarousel.innerHTML = '';
    const dronesList = typeof DRONES_CATALOG !== 'undefined' ? DRONES_CATALOG : [];
    dronesList.forEach((dr, idx) => {
      const owned = progress.unlockedDrones.includes(dr.id);
      const equipped = progress.equippedDrone === dr.id;
      const card = document.createElement('div');
      card.className = 'media-card' + (equipped ? ' equipped' : '');
      const btnClass = equipped ? 'active' : (owned ? 'equip' : 'buy');
      const btnLabel = equipped ? 'АКТИВЕН ✔' : (owned ? 'ВЫБРАТЬ' : `${dr.price} 🐟`);

      card.innerHTML = `
        <div class="media-viewport"><span class="viewport-badge">ДРОН ${idx + 1}/4</span><canvas width="260" height="170"></canvas></div>
        <div class="media-card-title">🤖 ${dr.name}</div>
        <div class="media-card-desc">${dr.desc}</div>
        <button class="shop-action-btn ${btnClass}">${btnLabel}</button>
      `;
      const cvs = card.querySelector('canvas');
      hangarDroneCanvases.push({ cvs, ctx: cvs.getContext('2d'), dr, ship: activeShip, idx });

      card.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); if (synth) synth.init();
        if (equipped) { if (synth) synth.sfxMenuTap(); return; }
        if (owned) {
          progress.equippedDrone = dr.id; saveProgress(progress);
          if (synth) synth.sfxMenuSelect(); renderHangar();
        } else if (progress.coins >= dr.price) {
          progress.coins -= dr.price; progress.unlockedDrones.push(dr.id); progress.equippedDrone = dr.id;
          saveProgress(progress); if (synth) synth.sfxBuyItem(); renderHangar();
        } else if (synth) synth.sfxHurt();
      });
      dronesCarousel.appendChild(card);
    });

    switchHangarTab(activeHangarTab);
    const eqShipIdx = Math.max(0, SHIPS_CATALOG.findIndex(s => s.id === progress.equippedShip));
    const eqWpIdx = Math.max(0, WEAPONS_CATALOG.findIndex(w => w.id === progress.equippedWeapon));
    const eqDrIdx = Math.max(0, dronesList.findIndex(d => d.id === progress.equippedDrone));
    setTimeout(() => {
      scrollCarouselToIdx(shipsCarousel, eqShipIdx);
      scrollCarouselToIdx(weaponsCarousel, eqWpIdx);
      scrollCarouselToIdx(dronesCarousel, eqDrIdx);
    }, 30);
  }

  function setupCarouselControls(carouselId, prevBtnId, nextBtnId, counterId, totalCount) {
    const el = document.getElementById(carouselId);
    const counter = document.getElementById(counterId);
    if (!el || totalCount <= 0) return;

    let currentIdx = 0;
    const updateCounter = () => {
      const cardW = el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : 260;
      currentIdx = Math.max(0, Math.min(totalCount - 1, Math.round(el.scrollLeft / cardW)));
      if (counter) counter.textContent = `${currentIdx + 1} / ${totalCount}`;
    };

    el.addEventListener('scroll', () => { updateCounter(); if (synth) synth.sfxScrollTick(); }, { passive: true });
    document.getElementById(prevBtnId)?.addEventListener('click', (e) => {
      e.stopPropagation(); if (synth) synth.sfxMenuTap();
      currentIdx = (currentIdx - 1 + totalCount) % totalCount; scrollCarouselToIdx(el, currentIdx);
    });
    document.getElementById(nextBtnId)?.addEventListener('click', (e) => {
      e.stopPropagation(); if (synth) synth.sfxMenuTap();
      currentIdx = (currentIdx + 1) % totalCount; scrollCarouselToIdx(el, currentIdx);
    });
  }

  setupCarouselControls('ships-carousel', 'ship-prev-btn', 'ship-next-btn', 'ship-counter', SHIPS_CATALOG.length);
  setupCarouselControls('weapons-carousel', 'weapon-prev-btn', 'weapon-next-btn', 'weapon-counter', WEAPONS_CATALOG.length);
  setupCarouselControls('drones-carousel', 'drone-prev-btn', 'drone-next-btn', 'drone-counter', (typeof DRONES_CATALOG !== 'undefined' ? DRONES_CATALOG.length : 4));

  function renderHangarLivePreviews(t) {
    if (hangarOverlay.classList.contains('hidden')) return;

    if (activeHangarTab === 'ships') {
      hangarShipCanvases.forEach(({ cvs, ctx: c, ship, idx }) => {
        const w = cvs.width, h = cvs.height;
        c.clearRect(0, 0, w, h);
        c.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let s = 0; s < 10; s++) {
          const sx = ((s * 37 + idx * 19) % (w - 20)) + 10;
          const sy = ((t * (55 + (s % 3) * 20) + s * 28) % h);
          c.fillRect(sx, sy, 2, 5);
        }
        const hoverY = h * 0.48 + Math.sin(t * 3.4 + idx) * 7;
        const swayX = Math.cos(t * 2.1 + idx) * 12;
        c.save(); c.translate(w / 2 + swayX, hoverY); c.rotate(Math.sin(t * 2.1 + idx) * 0.14); c.scale(1.62, 1.62);
        drawPlayerShipModel(c, ship, t, 0, { weaponId: progress.equippedWeapon });
        c.restore();
      });
    } else if (activeHangarTab === 'weapons') {
      hangarWeaponCanvases.forEach(({ cvs, ctx: c, wp, ship, idx }) => {
        const w = cvs.width, h = cvs.height;
        c.clearRect(0, 0, w, h);
        const shipX = w / 2, shipY = h * 0.74;
        const hp = getShipHardpoints(ship.id);
        const cycle = (t * 2.4 + idx * 0.4) % 1;
        const shotY = shipY - 22 - cycle * 110;

        c.save();
        if (wp.id === 'double_shot') {
          [-hp.pairX * 1.3, hp.pairX * 1.3].forEach(ox => { c.fillStyle = wp.bulletColor; c.beginPath(); c.ellipse(shipX + ox, shotY, 4, 9, 0, 0, Math.PI * 2); c.fill(); });
        } else if (wp.id === 'rocket_launcher') {
          [-hp.wingX * 1.3, hp.wingX * 1.3].forEach(ox => { c.fillStyle = '#ff9f1c'; roundRectPath(c, shipX + ox - 3.5, shotY - 7, 7, 14, 3); c.fill(); });
        } else if (wp.id === 'wave_amp') {
          c.strokeStyle = wp.bulletColor; c.lineWidth = 4.5; c.beginPath(); c.arc(shipX, shotY + 10, 14 + cycle * 24, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
        } else if (wp.id === 'electric_arc') {
          c.strokeStyle = '#fee440'; c.lineWidth = 3.2;
          [-hp.pairX * 1.3, hp.pairX * 1.3].forEach(ox => { c.beginPath(); c.moveTo(shipX + ox, shipY - 16); c.lineTo(shipX + ox - 5, shipY - 52); c.lineTo(shipX + ox + 5, shipY - 88); c.lineTo(shipX + ox, 12); c.stroke(); });
        } else {
          c.fillStyle = wp.bulletColor; c.beginPath(); c.ellipse(shipX, shotY, 4.5, 10, 0, 0, Math.PI * 2); c.fill();
        }
        c.restore();

        c.save(); c.translate(shipX, shipY); c.scale(1.36, 1.36);
        drawPlayerShipModel(c, ship, t, 0, { weaponId: wp.id });
        c.restore();
      });
    } else {
      hangarDroneCanvases.forEach(({ cvs, ctx: c, dr, ship }) => {
        const w = cvs.width, h = cvs.height;
        c.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h * 0.54;
        c.save(); c.translate(cx, cy); c.scale(1.3, 1.3);
        drawPlayerShipModel(c, ship, t, 0, {});
        c.restore();

        if (dr.id !== 'none') {
          const dx = cx + Math.cos(t * 3.2) * 52;
          const dy = cy + Math.sin(t * 3.2) * 24;
          drawDroneIcon(c, dr.id, dx, dy, t);
        }
      });
    }
  }

  function closeHangarToMenu() {
    if (synth) synth.sfxMenuSelect();
    hangarOverlay.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  }

  document.getElementById('hangar-open-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) { synth.init(); synth.sfxMenuTransition(); }
    renderHangar(); startOverlay.classList.add('hidden'); hangarOverlay.classList.remove('hidden'); syncTopHudVisibility();
  });

  const hangarCloseBtn = document.getElementById('hangar-close-btn');
  if (hangarCloseBtn) {
    hangarCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeHangarToMenu(); });
    hangarCloseBtn.addEventListener('pointerup', (e) => { e.stopPropagation(); closeHangarToMenu(); });
  }
  const LORE_SLIDES = [
    { baseName: 'slide1', rawFallback: 'img/1000036324.jpg', title: 'ПЛАНЕТА КОТОВИЯ-17', text: 'На родной планете Котовия-17 заканчивается еда. Рыбка, колбаска и сметана выдаются только по талонам!' },
    { baseName: 'slide2', rawFallback: 'img/1000036326.jpg', title: 'СЕКРЕТНЫЙ ОТРЯД «АСТРО-КОТ»', text: 'Редж отправляется в дальний космос за провизией для всей планеты!' },
    { baseName: 'slide3', rawFallback: 'img/1000036323.jpg', title: 'БИТВА С ПОЖИРАТЕЛЯМИ КОСМОСА', text: 'Добывай рыбку 🐟 в боях, открывай 5 кораблей, 5 орудий и 4 дрона в Ангаре!' }
  ];
  let loreSlideIdx = 0;

  function renderLoreSlide() {
    if (loreOverlay.classList.contains('hidden')) return;
    const slide = LORE_SLIDES[loreSlideIdx];
    document.getElementById('lore-title').textContent = slide.title;
    document.getElementById('lore-text').textContent = slide.text;
    document.getElementById('lore-next-btn').textContent = loreSlideIdx < LORE_SLIDES.length - 1 ? 'ДАЛЬШЕ ➔' : 'В МЕНЮ ИГРЫ 🚀';
    document.querySelectorAll('#lore-dots .dot').forEach((d, i) => d.classList.toggle('active', i === loreSlideIdx));
    const loreImg = document.getElementById('lore-img');
    if (loreImg) {
      loreImg.classList.remove('hidden');
      const lc = document.getElementById('lore-canvas');
      if (lc) lc.style.display = 'none';
      resolveImageToElement(loreImg, [`img/${slide.baseName}.jpg`, slide.rawFallback]);
    }
  }

  document.getElementById('lore-open-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); loreSlideIdx = 0;
    if (synth) { synth.init(); synth.sfxMenuTransition(); }
    startOverlay.classList.add('hidden'); loreOverlay.classList.remove('hidden');
    renderLoreSlide(); syncTopHudVisibility();
  });

  document.getElementById('lore-next-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) synth.sfxMenuTap();
    if (loreSlideIdx < LORE_SLIDES.length - 1) { loreSlideIdx++; renderLoreSlide(); }
    else { progress.loreSeen = true; saveProgress(progress); loreOverlay.classList.add('hidden'); renderLevelGrid(); startOverlay.classList.remove('hidden'); syncTopHudVisibility(); }
  });

  document.getElementById('lore-skip-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) synth.sfxMenuTap();
    progress.loreSeen = true; saveProgress(progress); loreOverlay.classList.add('hidden'); renderLevelGrid(); startOverlay.classList.remove('hidden'); syncTopHudVisibility();
  });

  function renderLevelGrid() {
    updateCoinsUI();
    const grid = document.getElementById('levels-grid');
    if (!grid) return;
    grid.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      btn.className = 'lvl-btn' + (idx === selectedLevelIdx ? ' active' : '');
      const done = progress.completed.includes(lvl.id);
      btn.innerHTML = `<span>${lvl.id}</span><span class="star">${done ? '★' : '☆'}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); if (synth) { synth.init(); synth.sfxMenuSelect(); }
        selectedLevelIdx = idx; applySiteTheme(LEVELS[selectedLevelIdx]); renderLevelGrid();
      });
      grid.appendChild(btn);
    });

    const cur = LEVELS[selectedLevelIdx];
    applySiteTheme(cur);
    const ship = getActiveShip();
    const dr = getActiveDrone();
    const diff = DIFFICULTIES[selectedDiffKey];
    const bossCountLabel = diff.twoBosses ? '2 БОССА ПОДРЯД!' : cur.bossName;
    document.getElementById('selected-level-info').innerHTML =
      `<strong>Уровень ${cur.id}: ${cur.name}</strong> (+${cur.coinReward} 🐟)<br><span>Босс: ${bossCountLabel} • ${ship.name} • ${dr.name}</span>`;
    document.getElementById('start-best').textContent =
      `Рекорд: ${progress.bestScore} • Бесконечный: ${progress.endlessBest} • Пройдено: ${progress.completed.length}/${LEVELS.length}`;
  }
  renderLevelGrid();

  document.querySelectorAll('#diff-row .pill-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); if (synth) { synth.init(); synth.sfxMenuSelect(); }
      selectedDiffKey = btn.dataset.diff;
      document.querySelectorAll('#diff-row .pill-3d').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); renderLevelGrid();
    });
  });

  function showIntro(idx) {
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
      `<div>🛸 <b>Враги:</b> ${lvl.enemiesDesc}</div><div>👑 <b>Босс:</b> ${diff.twoBosses ? lvl.bossName + ' (x2)' : lvl.bossName}</div><div>🐟 <b>Награда:</b> +${lvl.coinReward} рыбок</div>`;

    startOverlay.classList.add('hidden'); endOverlay.classList.add('hidden'); introOverlay.classList.remove('hidden');
    syncTopHudVisibility();
  }

  document.getElementById('start-btn')?.addEventListener('click', (e) => { e.stopPropagation(); showIntro(selectedLevelIdx); });
  document.getElementById('endless-btn')?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) { synth.init(); synth.sfxMenuSelect(); } startLevel(0, true); });
  document.getElementById('intro-launch-btn')?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) synth.sfxMenuSelect(); startLevel(selectedLevelIdx, false); });
  document.getElementById('intro-back-btn')?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) synth.sfxMenuTap(); introOverlay.classList.add('hidden'); startOverlay.classList.remove('hidden'); syncTopHudVisibility(); });

  let state = 'START', prevStateBeforeSettings = 'START';

  function openSettings() {
    if (synth) { synth.init(); synth.sfxMenuTap(); }
    prevStateBeforeSettings = state;
    if (state === 'PLAYING') { state = 'PAUSED'; if (synth) synth.pauseMusic(); }
    settingsOverlay.classList.remove('hidden'); syncTopHudVisibility();
  }

  function closeSettings() {
    if (synth) synth.sfxMenuSelect();
    settingsOverlay.classList.add('hidden');
    if (prevStateBeforeSettings === 'PLAYING') { state = 'PLAYING'; if (synth) synth.resumeMusic(); }
    syncTopHudVisibility();
  }

  document.getElementById('settings-open-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
  document.getElementById('menu-sound-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
  document.getElementById('settings-close-btn')?.addEventListener('click', (e) => { e.stopPropagation(); closeSettings(); });

  const toggleMusicBtn = document.getElementById('toggle-music');
  toggleMusicBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); if (!synth) return; synth.init();
    synth.musicEnabled = !synth.musicEnabled;
    toggleMusicBtn.textContent = synth.musicEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleMusicBtn.classList.toggle('off', !synth.musicEnabled);
    synth.updateMusicVolume(); synth.sfxMenuTap();
  });

  document.getElementById('track-select')?.addEventListener('change', (e) => {
    if (!synth) return; synth.init(); synth.sfxMenuSelect();
    synth.selectedTrack = e.target.value;
    if (synth.selectedTrack !== 'auto') synth.playTrack(synth.selectedTrack);
    else if (state === 'PLAYING') synth.startMusic('normal');
  });

  const toggleSfxBtn = document.getElementById('toggle-sfx');
  toggleSfxBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); if (!synth) return; synth.init();
    synth.sfxEnabled = !synth.sfxEnabled;
    toggleSfxBtn.textContent = synth.sfxEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleSfxBtn.classList.toggle('off', !synth.sfxEnabled);
    synth.updateSfxVolume(); if (synth.sfxEnabled) synth.sfxMenuTap();
  });

  document.getElementById('music-vol')?.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    document.getElementById('val-music-vol').textContent = `${v}%`;
    if (synth) { synth.musicVolume = v / 100; synth.updateMusicVolume(); }
  });

  document.getElementById('sfx-vol')?.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    document.getElementById('val-sfx-vol').textContent = `${v}%`;
    if (synth) synth.setMasterVolume(v / 100);
  });

  document.getElementById('ctrl-warmth')?.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    document.getElementById('val-warmth').textContent = `${v} Hz`;
    if (synth) synth.setWarmthCutoff(v);
  });

  document.getElementById('ctrl-space')?.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    document.getElementById('val-space').textContent = `${v}%`;
    if (synth) synth.setSpaceMix(v / 100);
  });

  document.getElementById('ctrl-psy')?.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    document.getElementById('val-psy').textContent = `${v}%`;
    if (synth) synth.setPsyDrift(v / 100);
  });

  document.getElementById('test-chord-btn')?.addEventListener('click', (e) => { e.stopPropagation(); if (synth) { synth.init(); synth.playCosmicMeow(); } });
  muteBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (!synth) return; muteBtn.textContent = synth.toggleMute() ? '🔇' : '🔊'; });

  // =========================================================================
  // ИГРОВОЙ ПРОЦЕСС: УЛЬТА «КОШАЧЬЯ ЯРОСТЬ», ДРОНЫ, МОДУЛИ БОССОВ, БЕСКОНЕЧНЫЙ РЕЖИМ
  // =========================================================================
  let score = 0, runCoins = 0, kills = 0, combo = 1, comboTimer = 0, wave = 1, waveTimer = 0;
  let spawnTimer = 0, obstacleTimer = 4.0, propTimer = 6.5, droneFireTimer = 0.5;
  let screenShake = 0, warningBannerTimer = 0, globalTime = 0, midBossDefeated = false;
  let psySlowTimer = 0, fishRainTimer = 0, fishRainSpawnTimer = 0, formationCounter = 0;
  let activeQuest = null, isEndless = false, endlessTimer = 0, endlessMult = 1.0;
  let ultCharge = 0, ultActiveTimer = 0, lastTapTime = 0;

  let player = null, bullets = [], enemyBullets = [], enemies = [], obstacles = [], bonuses = [], interactiveProps = [], fishRainItems = [], boss = null;

  const keys = {};
  const pointer = { active: false, x: 0, y: 0, isTouch: false };

  function addUltCharge(amount) {
    if (ultActiveTimer > 0) return;
    ultCharge = Math.min(100, ultCharge + amount);
    if (ultBtn) ultBtn.classList.toggle('hidden', ultCharge < 100 || state !== 'PLAYING');
  }

  function activateCatFury() {
    if (state !== 'PLAYING' || ultCharge < 100 || !player) return;
    ultCharge = 0;
    ultActiveTimer = 2.6;
    if (ultBtn) ultBtn.classList.add('hidden');
    screenShake = 16;
    if (synth) { synth.playCosmicMeow(); synth.playWarmLaser(); }
    if (vfx) {
      vfx.triggerFlash('#ffd166', 0.45);
      vfx.addPopup(W / 2, H * 0.38, '⚡ КОШАЧЬЯ ЯРОСТЬ! ⚡', '#ffd166', 1.35);
    }
    for (let k = -4; k <= 4; k++) {
      const ang = k * 0.14;
      bullets.push({ kind: 'heart_shot', homing: true, x: player.x, y: player.y - 20, vx: Math.sin(ang) * 680, vy: -Math.cos(ang) * 680, r: 10, dmg: 3.5, color: '#ff006e' });
    }
  }

  ultBtn?.addEventListener('click', (e) => { e.stopPropagation(); activateCatFury(); });
  ultBtn?.addEventListener('pointerdown', (e) => { e.stopPropagation(); activateCatFury(); });

  function initLevelQuest(lvl) {
    const quests = [
      { id: 'kills', label: 'Сбить 8 кораблей', target: 8, cur: 0, reward: 250, done: false },
      { id: 'props', label: 'Активировать 2 объекта сектора', target: 2, cur: 0, reward: 250, done: false },
      { id: 'rain',  label: 'Собрать 5 рыбок в дожде', target: 5, cur: 0, reward: 250, done: false }
    ];
    activeQuest = quests[lvl.id % quests.length];
  }

  function advanceQuest(type, amount = 1) {
    if (!activeQuest || activeQuest.done || activeQuest.id !== type) return;
    activeQuest.cur = Math.min(activeQuest.target, activeQuest.cur + amount);
    if (activeQuest.cur >= activeQuest.target) {
      activeQuest.done = true; runCoins += activeQuest.reward; score += 500;
      if (synth) synth.sfxVictory();
      if (vfx) vfx.addPopup(W / 2, H * 0.28, `🎯 ЗАДАНИЕ ВЫПОЛНЕНО! +${activeQuest.reward} 🐟`, '#ffd166', 1.25);
    }
  }

  function togglePause() {
    if (state === 'PLAYING') {
      state = 'PAUSED'; pointer.active = false;
      if (synth) { synth.sfxMenuTap(); synth.pauseMusic(); }
      if (ultBtn) ultBtn.classList.add('hidden');
      pauseOverlay.classList.remove('hidden'); syncTopHudVisibility();
    } else if (state === 'PAUSED' && settingsOverlay.classList.contains('hidden')) {
      state = 'PLAYING';
      if (synth) { synth.sfxMenuSelect(); synth.resumeMusic(); }
      if (ultBtn && ultCharge >= 100) ultBtn.classList.remove('hidden');
      pauseOverlay.classList.add('hidden'); syncTopHudVisibility();
    }
  }

  pauseBtn?.addEventListener('click', (e) => { e.stopPropagation(); togglePause(); });
  document.getElementById('resume-btn')?.addEventListener('click', (e) => { e.stopPropagation(); togglePause(); });

  function returnToMenu() {
    state = 'START'; pointer.active = false; boss = null; enemies = []; obstacles = []; bullets = []; enemyBullets = []; bonuses = []; interactiveProps = []; fishRainItems = [];
    if (vfx) vfx.clear(); if (synth) { synth.sfxMenuTap(); synth.startIntroMusic(); }
    if (ultBtn) ultBtn.classList.add('hidden');
    [pauseOverlay, endOverlay, settingsOverlay, introOverlay, loreOverlay, hangarOverlay, splashOverlay, pauseBtn].forEach(el => el.classList.add('hidden'));
    renderLevelGrid(); startOverlay.classList.remove('hidden'); syncTopHudVisibility();
  }

  ['pause-menu-btn', 'end-menu-btn'].forEach(id => document.getElementById(id)?.addEventListener('click', (e) => { e.stopPropagation(); returnToMenu(); }));

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyM' && synth) muteBtn.textContent = synth.toggleMute() ? '🔇' : '🔊';
    if ((e.code === 'KeyP' || e.code === 'Escape') && (state === 'PLAYING' || state === 'PAUSED')) togglePause();
    if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') && state === 'PLAYING') activateCatFury();
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  canvas.addEventListener('pointerdown', (e) => {
    if (state !== 'PLAYING') return;
    if (synth) synth.init();
    const now = performance.now();
    if (now - lastTapTime < 260 && ultCharge >= 100) activateCatFury();
    lastTapTime = now;

    pointer.active = true; pointer.isTouch = e.pointerType === 'touch';
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

  function startLevel(idx, endlessMode = false) {
    resize();
    isEndless = endlessMode;
    endlessTimer = 0;
    endlessMult = 1.0;
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const ship = getActiveShip();
    const wp = getActiveBaseWeapon();
    const dr = getActiveDrone();

    applySiteTheme(lvl);
    if (synth) { synth.init(); synth.startMusic('normal', lvl.id); synth.sfxCosmicHum(); }

    score = 0; runCoins = 0; kills = 0; combo = 1; comboTimer = 0; wave = 1; waveTimer = 0;
    spawnTimer = 0.5; obstacleTimer = 3.5; propTimer = 5.0; droneFireTimer = 0.45;
    screenShake = 0; warningBannerTimer = 0; midBossDefeated = false; psySlowTimer = 0; fishRainTimer = 0; formationCounter = 0;
    ultCharge = 0; ultActiveTimer = 0;
    if (ultBtn) ultBtn.classList.add('hidden');

    initLevelQuest(lvl);

    const totalHp = diff.playerHp + (ship.hpBonus || 0);
    player = {
      x: W / 2, y: H - 105, vx: 0, vy: 0, r: 20, hp: totalHp, maxHp: totalHp,
      ship, baseWeapon: wp, drone: dr, invuln: 0, fireCooldown: 0, secondaryWeapon: 'none', secondaryLevel: 1,
      shield: false, turboTimer: 0, stickyTimer: 0, squashX: 1, squashY: 1, shotCycle: 0
    };

    bullets = []; enemyBullets = []; enemies = []; obstacles = []; bonuses = []; interactiveProps = []; fishRainItems = []; boss = null;
    if (vfx) vfx.clear();

    state = 'PLAYING';
    [startOverlay, introOverlay, loreOverlay, hangarOverlay, endOverlay, pauseOverlay, settingsOverlay, splashOverlay].forEach(el => el.classList.add('hidden'));
    pauseBtn.classList.remove('hidden');
    syncTopHudVisibility();

    if (world3d) world3d.setCameraFromPlayer(player.x, W);
    const titleBanner = isEndless ? '♾ БЕСКОНЕЧНЫЙ КОСМОС!' : `УРОВЕНЬ ${lvl.id}: ${lvl.name.toUpperCase()}`;
    if (vfx) vfx.addPopup(W / 2, H * 0.34, titleBanner, lvl.accent, 1.15);
  }

  document.getElementById('next-level-btn')?.addEventListener('click', (e) => {
    e.stopPropagation(); if (synth) synth.sfxMenuSelect();
    if (isEndless) startLevel(0, true);
    else if (state === 'VICTORY') showIntro((selectedLevelIdx + 1) % LEVELS.length);
    else startLevel(selectedLevelIdx, false);
  });

  function spawnSectorInteractiveProp() {
    const lvl = LEVELS[selectedLevelIdx];
    const pType = lvl.interactiveType || 'mirror_portal';
    if (pType === 'mirror_portal') {
      const yPos = 140 + Math.random() * 140;
      const p1 = { id: Math.random(), pairIdx: 0, type: 'mirror_portal', x: W * 0.22, y: yPos, r: 24, vy: 28, phase: 0, cooldown: 0 };
      const p2 = { id: Math.random(), pairIdx: 1, type: 'mirror_portal', x: W * 0.78, y: yPos, r: 24, vy: 28, phase: 1.5, cooldown: 0 };
      p1.partner = p2; p2.partner = p1;
      interactiveProps.push(p1, p2);
    } else {
      const x = 60 + Math.random() * (W - 120);
      interactiveProps.push({ type: pType, x, y: -40, r: 24, vy: 78, phase: Math.random() * Math.PI * 2, hp: 2 });
    }
  }

  function spawnObstacle() {
    const lvl = LEVELS[selectedLevelIdx];
    const x = 56 + Math.random() * (W - 112);
    let shape = 'om_fractal';
    if (lvl.theme === 'lsd') shape = Math.random() < 0.55 ? 'om_fractal' : 'neon_star_obstacle';
    else if (lvl.theme === 'horror') shape = Math.random() < 0.65 ? 'skull_bones' : 'blood_pentagram';
    else if (lvl.theme === 'rainbow') shape = ['rainbow_donut', 'dream_bubble', 'rainbow_cloud'][Math.floor(Math.random() * 3)];
    else if (lvl.theme === 'underwater') shape = Math.random() < 0.55 ? 'neon_coral' : 'seaweed_kelp';
    else if (lvl.theme === 'organic') shape = 'tentacle_seaweed';
    else if (lvl.theme === 'mushroom') shape = Math.random() < 0.55 ? 'mushroom_box' : 'spore_crystal';

    obstacles.push({
      shape, neonColor: lvl.accent || '#00f5d4', x, y: -48, r: 25, vy: 96,
      rot: 0, vrot: shape === 'tentacle_seaweed' ? 0 : 1.5, phase: Math.random() * Math.PI * 2
    });
  }

  function spawnEnemyFormation() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp * endlessMult;
    const types = lvl.enemyTypes || ['fractal_ship', 'mini_stamp', 'rubik_cube'];

    formationCounter++;
    const isVFormation = (wave === 1 && formationCounter % 2 === 0);
    const count = isVFormation ? 3 : 1;
    const baseX = 75 + Math.random() * (W - 150);

    for (let k = 0; k < count; k++) {
      const offsetX = isVFormation ? (k - 1) * 58 : 0;
      const offsetY = isVFormation ? -Math.abs(k - 1) * 32 : 0;
      const kind = types[Math.floor(Math.random() * types.length)];
      const isMiniBoss = kind.startsWith('mini_');
      const isElite = (wave >= 2 && k === 0 && Math.random() < 0.28);

      const baseHp = (isMiniBoss ? 5 : 2.6) * (isElite ? 1.8 : 1.0);
      const hp = Math.max(1, Math.round(baseHp * hpScale));
      const patterns = ['zigzag', 'dash', 'figure8', 'erratic'];

      enemies.push({
        kind, isElite, stunTimer: 0,
        movePattern: isVFormation ? 'figure8' : patterns[Math.floor(Math.random() * patterns.length)],
        x: Math.max(40, Math.min(W - 40, baseX + offsetX)),
        y: -38 + offsetY,
        r: isElite ? 25 : (isMiniBoss ? 24 : 20),
        hp, maxHp: hp,
        baseVy: (isMiniBoss ? 102 : 132) * diff.bulletSpeed,
        vy: (isMiniBoss ? 102 : 132) * diff.bulletSpeed,
        vx: (Math.random() - 0.5) * 130,
        rot: 0, vrot: (Math.random() - 0.5) * 4.0,
        phase: Math.random() * Math.PI * 2,
        freq: 2.2 + Math.random() * 2.2,
        amp: 60 + Math.random() * 55,
        turnTimer: 0.5 + Math.random() * 1.1,
        shootTimer: (isMiniBoss ? 1.25 : 1.65) + Math.random() * 0.7,
        hitFlash: 0,
        points: isElite ? 350 : (isMiniBoss ? 220 : 120),
        coinValue: isElite ? 100 : (isMiniBoss ? 36 : 18)
      });
    }
  }

  function spawnBoss(isMidBoss = false) {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const mult = (isMidBoss ? 0.58 : (diff.twoBosses ? 1.35 : 1.0)) * endlessMult;
    const bScale = isMidBoss ? 0.82 : (diff.twoBosses ? 1.24 : 1.0);
    const totalHp = Math.round(240 * lvl.hpMult * diff.enemyHp * mult);
    const modHp = Math.round(totalHp * 0.22);

    boss = {
      isMidBoss, bossScale: bScale, x: W / 2, y: -110, targetY: Math.min(155, H * 0.22),
      r: 62 * bScale, hp: totalHp, maxHp: totalHp, phase: 1, time: 0, hitFlash: 0,
      smokeTimer: 0, shootTimer: 0.95, specialTimer: 3.2, laserState: 'idle', laserTimer: 0, laserX: W / 2,
      parts: [
        { side: -1, ox: -68 * bScale, oy: 12 * bScale, r: 22 * bScale, hp: modHp, maxHp: modHp, alive: true },
        { side: 1,  ox: 68 * bScale,  oy: 12 * bScale, r: 22 * bScale, hp: modHp, maxHp: modHp, alive: true }
      ]
    };
    warningBannerTimer = 2.4;
    if (synth) { synth.sfxBossAlarm(); synth.setMusicMode('boss', lvl.id); }
    if (vfx) vfx.triggerFlash(lvl.accent, 0.28);
  }

  function maybeDropFoodBonus(x, y, guaranteed = false) {
    if (!guaranteed && Math.random() > 0.20) return;
    const pool = ['fractal_shuriken', 'electric_shock', 'wave_cannon', 'red_shield'];
    bonuses.push({ type: pool[Math.floor(Math.random() * pool.length)], x, y, r: 18, vy: 105, phase: Math.random() * Math.PI * 2 });
  }

  function firePlayerWeapon(p) {
    p.shotCycle = (p.shotCycle || 0) + 1;
    const pan = ((p.x / W) * 2 - 1) * 0.7;
    const baseId = p.baseWeapon.id;
    const shipId = p.ship.id;
    const hp = getShipHardpoints(shipId);
    const dmgScale = (p.ship.dmgMult || 1) * (p.baseWeapon.dmgBonus || 1);

    if (synth) synth.sfxShootWeapon(pan, baseId);

    if (baseId === 'droplet') {
      bullets.push({ kind: 'plasma', x: p.x, y: p.y + hp.noseY, vx: 0, vy: -780, r: 6.5, dmg: 1.05 * dmgScale, color: '#48dbfb' });
    } else if (baseId === 'double_shot') {
      [-hp.pairX, hp.pairX].forEach(ox => { bullets.push({ kind: 'plasma', x: p.x + ox, y: p.y + hp.pairY, vx: 0, vy: -820, r: 6.2, dmg: 0.90 * dmgScale, color: '#72efdd' }); });
    } else if (baseId === 'rocket_launcher') {
      [-hp.wingX, hp.wingX].forEach(ox => { bullets.push({ kind: 'player_rocket', homing: true, x: p.x + ox, y: p.y + hp.wingY, vx: ox * 3, vy: -640, r: 8, dmg: 1.15 * dmgScale, color: '#ff9f1c' }); });
    } else if (baseId === 'wave_amp') {
      bullets.push({ kind: 'wave_pulse', pierce: 3, x: p.x, y: p.y + hp.noseY - 4, vx: 0, vy: -680, r: 28, dmg: 1.75 * dmgScale, color: '#f15bb5' });
    } else if (baseId === 'electric_arc') {
      [-hp.pairX, hp.pairX].forEach(ox => { bullets.push({ kind: 'electric_bolt', chainLightning: true, x: p.x + ox, y: p.y + hp.pairY, vx: 0, vy: -900, r: 7.5, dmg: 1.35 * dmgScale, color: '#fee440' }); });
    }

    if (psySlowTimer > 0) {
      [-0.35, 0.35].forEach(ang => { bullets.push({ kind: 'plasma', x: p.x, y: p.y - 20, vx: Math.sin(ang) * 760, vy: -Math.cos(ang) * 760, r: 7, dmg: 1.1 * dmgScale, color: '#ffd166' }); });
    }

    if (shipId === 'green_hawk' && p.shotCycle % 2 === 0) {
      [-19, 19].forEach(rx => bullets.push({ kind: 'player_rocket', homing: true, x: p.x + rx, y: p.y - 4, vx: rx * 2, vy: -660, r: 7, dmg: 0.85 * dmgScale, color: '#80ed99' }));
    } else if (shipId === 'blue_fish' && p.shotCycle % 2 === 0) {
      bullets.push({ kind: 'vortex_ring', pierce: 2, rot: 0, x: p.x, y: p.y - 24, vx: 0, vy: -650, r: 16, dmg: 1.15 * dmgScale, color: '#90e0ef' });
    } else if (shipId === 'heart_ship') {
      bullets.push({ kind: 'heart_shot', homing: true, x: p.x, y: p.y - 22, vx: 0, vy: -720, r: 9, dmg: 1.25 * dmgScale, color: '#ff4d6d' });
    } else if (shipId === 'stealth_wing') {
      [-27, 27].forEach(lx => bullets.push({ kind: 'wing_laser', x: p.x + lx, y: p.y - 2, vx: 0, vy: -920, r: 5.5, dmg: 0.95 * dmgScale, color: '#f72585' }));
      if (p.shotCycle % 2 === 0) [-14, 14].forEach(rx => bullets.push({ kind: 'player_rocket', homing: true, x: p.x + rx, y: p.y - 8, vx: 0, vy: -680, r: 7.5, dmg: 1.05 * dmgScale, color: '#ffd166' }));
    }

    const lv2 = p.secondaryLevel >= 2;
    if (p.secondaryWeapon === 'fractal_shuriken') {
      (lv2 ? [-0.26, 0, 0.26] : [-0.18, 0.18]).forEach(ang => bullets.push({ kind: 'fractal_shuriken', homing: true, x: p.x, y: p.y - 20, vx: Math.sin(ang) * 620, vy: -Math.cos(ang) * 620, rot: 0, r: 10, dmg: 1.35 * dmgScale, color: '#00f5d4' }));
    } else if (p.secondaryWeapon === 'electric_shock') {
      (lv2 ? [-18, 0, 18] : [-14, 14]).forEach(ox => bullets.push({ kind: 'electric_bolt', chainLightning: true, x: p.x + ox, y: p.y - 22, vx: 0, vy: -880, r: 8, dmg: 1.35 * dmgScale, color: '#fee440' }));
    } else if (p.secondaryWeapon === 'wave_cannon') {
      bullets.push({ kind: 'wave_pulse', pierce: lv2 ? 4 : 3, x: p.x, y: p.y - 24, vx: 0, vy: -640, r: lv2 ? 32 : 24, dmg: 1.65 * dmgScale, color: '#f15bb5' });
    }
  }

  function applyFoodBonus(bn) {
    if (synth) synth.sfxPowerup();
    player.squashX = 1.28; player.squashY = 1.28;
    if (vfx) {
      vfx.addShockwave(bn.x, bn.y, '#80ffdb', 85, 0.42);
      vfx.addBurst(bn.x, bn.y, ['#ffd166', '#06d6a0', '#48dbfb', '#ffffff'], 14, 190);
    }
    if (bn.type === 'red_shield') {
      player.shield = true; score += 250;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🛡 ЭНЕРГО-ЩИТ АКТИВЕН!', '#ff5964', 1.15);
      return;
    }
    if (player.secondaryWeapon === bn.type) { player.secondaryLevel = 2; score += 350; }
    else { player.secondaryWeapon = bn.type; player.secondaryLevel = 1; score += 250; }

    const titles = { fractal_shuriken: '💠 ФРАКТАЛЬНЫЕ СЮРИКЕНЫ', electric_shock: '⚡ ЭЛЕКТРИЧЕСКИЙ УДАР', wave_cannon: '〰️ ВОЛНОВАЯ ПУШКА' };
    if (vfx) vfx.addPopup(bn.x, bn.y, (titles[bn.type] || 'БОНУС') + (player.secondaryLevel === 2 ? ' (УР.2!)' : ''), '#80ffdb', 1.15);
  }

  function fireUniqueBossWeapon(b, lvl, diff) {
    const spd = 225 * diff.bulletSpeed;
    const toPlayer = player ? Math.atan2(player.y - b.y, player.x - b.x) : Math.PI / 2;
    const leftAlive = b.parts && b.parts[0] && b.parts[0].alive;
    const rightAlive = b.parts && b.parts[1] && b.parts[1].alive;

    if (lvl.id === 1) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.92 : 1.18;
      [-22, 22].forEach((ex, i) => {
        if ((i === 0 && !leftAlive) || (i === 1 && !rightAlive)) return;
        const eyeAng = Math.atan2(player.y - (b.y - 14), player.x - (b.x + ex));
        enemyBullets.push({ kind: 'green_spin_star', rot: 0, x: b.x + ex, y: b.y - 14, vx: Math.cos(eyeAng) * (spd * 1.05), vy: Math.sin(eyeAng) * (spd * 1.05), r: 12, color: '#06d6a0' });
      });
      [-0.28, 0, 0.28].forEach((offsetAng, idx) => {
        const ang = Math.PI / 2 + offsetAng + Math.sin(b.time * 3) * 0.15;
        enemyBullets.push({ kind: 'psy_wave', hue: (b.time * 180 + idx * 110) % 360, x: b.x, y: b.y + 24, vx: Math.cos(ang) * (spd * 0.95), vy: Math.sin(ang) * (spd * 0.95), ang, r: 20, color: '#ff006e' });
      });
    } else if (lvl.id === 2) {
      if (synth) synth.sfxIgnite();
      b.shootTimer = b.phase === 3 ? 0.68 : 0.92;
      [-0.22, 0.22].forEach((offsetAng, i) => {
        if ((i === 0 && !leftAlive) || (i === 1 && !rightAlive)) return;
        const ang = toPlayer + offsetAng;
        enemyBullets.push({ kind: 'fireball', x: b.x, y: b.y + 30, vx: Math.cos(ang) * (spd * 1.12), vy: Math.sin(ang) * (spd * 1.12), r: 12, color: '#ffbe0b' });
      });
      enemyBullets.push({ kind: 'laser_shuriken', rot: 0, x: b.x, y: b.y + 24, vx: Math.cos(toPlayer) * (spd * 1.22), vy: Math.sin(toPlayer) * (spd * 1.22), r: 14, color: '#ff002b' });
    } else if (lvl.id === 3) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.95 : 1.22;
      [-85, 85].forEach((hx, i) => {
        if ((i === 0 && !leftAlive) || (i === 1 && !rightAlive)) return;
        const handAng = Math.atan2(player.y - (b.y + 18), player.x - (b.x + hx));
        enemyBullets.push({ kind: 'thrown_donut', rot: 0, x: b.x + hx, y: b.y + 18, vx: Math.cos(handAng) * spd, vy: Math.sin(handAng) * spd, r: 12, color: '#ff70a6' });
      });
      enemyBullets.push({ kind: 'psy_wave', hue: (b.time * 140) % 360, x: b.x, y: b.y + 18, vx: Math.cos(toPlayer) * (spd * 0.95), vy: Math.sin(toPlayer) * (spd * 0.95), ang: toPlayer, r: 22, color: '#00f5d4' });
    } else if (lvl.id === 4) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.95 : 1.22;
      enemyBullets.push({ kind: 'psy_wave', hue: 185, x: b.x, y: b.y + 20, vx: Math.cos(toPlayer) * spd, vy: Math.sin(toPlayer) * spd, ang: toPlayer, r: 24, color: '#9bf6ff' });
      [-45, 45].forEach((ox, i) => {
        if ((i === 0 && !leftAlive) || (i === 1 && !rightAlive)) return;
        const ang = Math.atan2(player.y - (b.y + 55), player.x - (b.x + ox));
        enemyBullets.push({ kind: 'enemy_laser', x: b.x + ox, y: b.y + 55, vx: Math.cos(ang) * (spd * 1.25), vy: Math.sin(ang) * (spd * 1.25), ang, r: 6.5, color: '#9bf6ff' });
      });
    } else if (lvl.id === 5) {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.92 : 1.18;
      [-0.28, 0.28].forEach((offsetAng, i) => {
        if ((i === 0 && !leftAlive) || (i === 1 && !rightAlive)) return;
        const ang = toPlayer + offsetAng;
        enemyBullets.push({ kind: 'laser_flower', rot: 0, x: b.x, y: b.y + 24, vx: Math.cos(ang) * (spd * 0.92), vy: Math.sin(ang) * (spd * 0.92), r: 16, color: '#ff006e' });
      });
      enemyBullets.push({ kind: 'vine_whip', x: b.x, y: b.y + 30, vx: Math.cos(toPlayer) * (spd * 1.18), vy: Math.sin(toPlayer) * (spd * 1.18), ang: toPlayer, r: 11, color: '#80ed99' });
    } else {
      if (synth) synth.sfxWave();
      b.shootTimer = b.phase === 3 ? 0.85 : 1.10;
      [-0.25, 0, 0.25].forEach((offsetAng, idx) => {
        if ((idx === 0 && !leftAlive) || (idx === 2 && !rightAlive)) return;
        const ang = toPlayer + offsetAng;
        enemyBullets.push({ kind: 'mini_mushroom_shot', hue: (b.time * 160 + idx * 90) % 360, rot: 0, x: b.x, y: b.y + 38, vx: Math.cos(ang) * (spd * 1.08), vy: Math.sin(ang) * (spd * 1.08), r: 12, color: '#ff006e' });
      });
    }
  }

  function updateInteractiveProps(dt) {
    for (let i = interactiveProps.length - 1; i >= 0; i--) {
      const pr = interactiveProps[i];
      pr.y += pr.vy * dt;
      pr.phase += dt * 2.5;
      if (pr.cooldown > 0) pr.cooldown = Math.max(0, pr.cooldown - dt);

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (b.propCooldown > 0) continue;
        if (Math.hypot(b.x - pr.x, b.y - pr.y) < pr.r + b.r) {
          if (pr.type === 'mirror_portal' && pr.partner) {
            b.x = pr.partner.x; b.y = pr.partner.y; b.propCooldown = 0.45;
            if (synth) synth.sfxGravity();
            if (vfx) vfx.addShockwave(pr.partner.x, pr.partner.y, '#00f5d4', 45, 0.25);
            advanceQuest('props', 1); addUltCharge(8);
          } else if (pr.type === 'pinata_skull') {
            bullets.splice(j, 1);
            if (synth) synth.sfxVictory();
            if (vfx) {
              vfx.addRealisticExplosion(pr.x, pr.y, '#ffbe0b', 1.4, '#ff006e', '#06d6a0');
              vfx.addPopup(pr.x, pr.y, '🎉 ПИНЬЯТА! ОГЛУШЕНИЕ +80 🐟', '#ffd166', 1.15);
            }
            runCoins += 80; addUltCharge(14);
            enemies.forEach(en => { if (Math.hypot(en.x - pr.x, en.y - pr.y) < 220) en.stunTimer = 3.0; });
            advanceQuest('props', 1); interactiveProps.splice(i, 1); break;
          } else if (pr.type === 'flower_bumper') {
            b.propCooldown = 0.35;
            const target = enemies[0] || boss;
            if (target) {
              const ang = Math.atan2(target.y - b.y, target.x - b.x);
              const spd = Math.hypot(b.vx, b.vy);
              b.vx = Math.cos(ang) * spd; b.vy = Math.sin(ang) * spd;
            } else b.vx = (Math.random() - 0.5) * 500;
            if (synth) synth.sfxStarCollect();
            if (vfx) vfx.addShockwave(pr.x, pr.y, '#fee440', 45, 0.25);
            advanceQuest('props', 1); addUltCharge(8);
          }
        }
      }

      if (!interactiveProps[i]) continue;

      if (Math.hypot(player.x - pr.x, player.y - pr.y) < player.r + pr.r) {
        if (pr.type === 'candy_booster') {
          player.turboTimer = 4.5;
          if (synth) synth.sfxPurrBoost();
          if (vfx) vfx.addPopup(pr.x, pr.y, '🌈 РАДУЖНЫЙ УСКОРИТЕЛЬ!', '#ffd166', 1.15);
          advanceQuest('props', 1); addUltCharge(12); interactiveProps.splice(i, 1); continue;
        } else if (pr.type === 'giant_bubble') {
          player.shield = true;
          if (synth) synth.sfxShieldBlock();
          if (vfx) vfx.addPopup(pr.x, pr.y, '🫧 ПУЗЫРЬ-ЩИТ!', '#9bf6ff', 1.15);
          advanceQuest('props', 1); addUltCharge(12); interactiveProps.splice(i, 1); continue;
        } else if (pr.type === 'psy_spore') {
          psySlowTimer = 5.0;
          if (synth) synth.sfxVictory();
          if (vfx) { vfx.triggerFlash('#ffd166', 0.28); vfx.addPopup(pr.x, pr.y, '🍄 ПСИХО-СПОРА: ЗАМЕДЛЕНИЕ + ВЕЕР!', '#ffd166', 1.2); }
          advanceQuest('props', 1); addUltCharge(15); interactiveProps.splice(i, 1); continue;
        }
      }

      if (pr.type === 'giant_bubble') {
        for (let k = enemies.length - 1; k >= 0; k--) {
          const en = enemies[k];
          if (!en.isElite && Math.hypot(en.x - pr.x, en.y - pr.y) < pr.r + en.r) {
            if (vfx) vfx.addPopup(en.x, en.y, '🫧 ПОЙМАН В ПУЗЫРЬ! +30 🐟', '#9bf6ff');
            runCoins += 30; enemies.splice(k, 1); advanceQuest('props', 1); break;
          }
        }
      }

      if (pr.y > H + 60) interactiveProps.splice(i, 1);
    }
  }

  function updateDrones(dt) {
    if (!player || !player.drone || player.drone.id === 'none') return;
    const dId = player.drone.id;
    const dx = player.x + Math.cos(globalTime * 3.5) * 44;
    const dy = player.y + Math.sin(globalTime * 3.5) * 20;

    if (dId === 'spark') {
      droneFireTimer -= dt;
      if (droneFireTimer <= 0 && (enemies.length > 0 || boss)) {
        droneFireTimer = 0.55;
        const target = enemies[0] || boss;
        const ang = Math.atan2(target.y - dy, target.x - dx);
        bullets.push({ kind: 'plasma', x: dx, y: dy, vx: Math.cos(ang) * 760, vy: Math.sin(ang) * 760, r: 5, dmg: 0.75, color: '#48dbfb' });
      }
    } else if (dId === 'magnet') {
      [...bonuses, ...fishRainItems].forEach(item => {
        const dist = Math.hypot(player.x - item.x, player.y - item.y);
        if (dist < 260 && dist > 5) {
          item.x += ((player.x - item.x) / dist) * 260 * dt;
          item.y += ((player.y - item.y) / dist) * 260 * dt;
        }
      });
    } else if (dId === 'guard') {
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        if (Math.hypot(eb.x - dx, eb.y - dy) < 22 + eb.r) {
          if (vfx) vfx.addHitSparks(eb.x, eb.y, '#ffd166', 6);
          enemyBullets.splice(i, 1);
        }
      }
    }
  }

  function update(dt) {
    globalTime += dt;
    updateAndRenderMenuParticles(dt);

    if (synth && !settingsOverlay.classList.contains('hidden')) {
      const badge = document.getElementById('voice-pool-badge');
      if (badge) badge.textContent = `Голоса: ${synth.getActiveVoiceCount()} / 36`;
    }

    if (!hangarOverlay.classList.contains('hidden')) renderHangarLivePreviews(globalTime);

    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    if (world3d) world3d.update(dt, player && player.turboTimer > 0);
    if (vfx) vfx.update(dt);
    if (state !== 'PLAYING') return;

    if (player && player.hp === 1 && synth) synth.playLowHpHeartbeat();

    if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 28);
    if (warningBannerTimer > 0) warningBannerTimer = Math.max(0, warningBannerTimer - dt);
    if (psySlowTimer > 0) psySlowTimer = Math.max(0, psySlowTimer - dt);
    if (comboTimer > 0) { comboTimer -= dt; if (comboTimer <= 0) combo = 1; }

    // Режим «Бесконечный Космос»: каждые 25 сек смена мира и рост сложности
    if (isEndless) {
      endlessTimer += dt;
      if (endlessTimer >= 25) {
        endlessTimer = 0;
        endlessMult += 0.16;
        selectedLevelIdx = (selectedLevelIdx + 1) % LEVELS.length;
        const nextLvl = LEVELS[selectedLevelIdx];
        applySiteTheme(nextLvl);
        if (synth) synth.startMusic('normal', nextLvl.id);
        if (vfx) vfx.addPopup(W / 2, H * 0.32, `🌌 СЕКТОР: ${nextLvl.name.toUpperCase()} (x${endlessMult.toFixed(1)})`, nextLvl.accent, 1.2);
      }
    }

    // Активный мега-луч «Кошачья Ярость»
    if (ultActiveTimer > 0) {
      ultActiveTimer -= dt;
      screenShake = Math.max(screenShake, 5);
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (Math.abs(enemyBullets[i].x - player.x) < 42 && enemyBullets[i].y < player.y) enemyBullets.splice(i, 1);
      }
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (Math.abs(e.x - player.x) < 44 + e.r && e.y < player.y) {
          e.hp -= 18 * dt; e.hitFlash = 1;
          if (e.hp <= 0) {
            if (vfx) vfx.addRealisticExplosion(e.x, e.y, '#ffd166', 1.1, e.wingCol, e.bodyCol);
            score += e.points; runCoins += e.coinValue; kills++; enemies.splice(i, 1);
          }
        }
      }
      if (boss && Math.abs(boss.x - player.x) < 55 + boss.r) {
        boss.hp -= 35 * dt; boss.hitFlash = 1;
      }
    }

    propTimer -= dt;
    if (propTimer <= 0 && !boss && fishRainTimer <= 0) {
      propTimer = 8.5 + Math.random() * 3.0;
      spawnSectorInteractiveProp();
    }

    obstacleTimer -= dt;
    if (obstacleTimer <= 0 && !boss && fishRainTimer <= 0) {
      obstacleTimer = (wave === 2 ? 2.2 : 3.8) + Math.random() * 1.4;
      spawnObstacle();
    }

    const dMult = diff.durationMult || 1.0;
    waveTimer += dt;
    if (!boss) {
      if (isEndless) {
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnEnemyFormation();
          spawnTimer = Math.max(0.45, 0.95 / endlessMult);
        }
        if (waveTimer > 38) {
          waveTimer = 0;
          spawnBoss(true);
        }
      } else {
        if (wave === 1 && waveTimer > 20 * dMult) {
          wave = 2;
          if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 2 / 4: МЕТЕОРНЫЙ СЛАЛОМ!', lvl.accent, 1.15);
        } else if (wave === 2 && waveTimer > 40 * dMult) {
          if (diff.twoBosses && !midBossDefeated) spawnBoss(true);
          else {
            wave = 3;
            if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 3 / 4: ЭЛИТА В КОРОНАХ!', '#ffd166', 1.2);
          }
        } else if (wave === 3 && waveTimer > 62 * dMult) {
          wave = 4;
          fishRainTimer = 8.0;
          if (synth) synth.sfxVictory();
          if (vfx) vfx.addPopup(W / 2, H * 0.34, '🐟 БОНУС: РЫБНЫЙ ДОЖДЬ! 🐟', '#ffd166', 1.25);
        } else if (wave === 4 && fishRainTimer <= 0 && waveTimer > 71 * dMult) {
          wave = 5;
          spawnBoss(false);
        }

        if (wave <= 3) {
          spawnTimer -= dt;
          if (spawnTimer <= 0) {
            spawnEnemyFormation();
            spawnTimer = ([0, 1.15, 1.25, 0.90][wave] || 1.0) * diff.spawnRate;
          }
        }
      }
    }

    if (fishRainTimer > 0) {
      fishRainTimer -= dt;
      fishRainSpawnTimer -= dt;
      if (fishRainSpawnTimer <= 0) {
        fishRainSpawnTimer = 0.36;
        const emojis = ['🐟', '🥛', '🍖', '🍤'];
        fishRainItems.push({
          x: 40 + Math.random() * (W - 80), y: -25, vy: 165 + Math.random() * 60,
          emoji: emojis[Math.floor(Math.random() * emojis.length)], phase: Math.random() * Math.PI * 2
        });
      }
    }

    for (let i = fishRainItems.length - 1; i >= 0; i--) {
      const fr = fishRainItems[i];
      fr.y += fr.vy * dt; fr.phase += dt * 4;
      if (Math.hypot(player.x - fr.x, player.y - fr.y) < player.r + 22) {
        runCoins += 25; score += 100;
        if (synth) synth.playStarCollect();
        if (vfx) vfx.addPopup(fr.x, fr.y, `+25 ${fr.emoji}`, '#ffd166');
        advanceQuest('rain', 1); addUltCharge(5);
        fishRainItems.splice(i, 1); continue;
      }
      if (fr.y > H + 30) fishRainItems.splice(i, 1);
    }

    updateInteractiveProps(dt);
    updateDrones(dt);

    const p = player;
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
    if (p.turboTimer > 0) p.turboTimer = Math.max(0, p.turboTimer - dt);
    if (p.stickyTimer > 0) p.stickyTimer = Math.max(0, p.stickyTimer - dt);
    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    let speedFactor = (p.ship.speedMult || 1.0) * (p.turboTimer > 0 ? 1.28 : 1.0);
    const moveSpeed = 355 * speedFactor;
    let ix = 0, iy = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) ix -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) ix += 1;
    if (keys['ArrowUp'] || keys['KeyW']) iy -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) iy += 1;

    if (ix !== 0 || iy !== 0) {
      const len = Math.hypot(ix, iy);
      p.vx = (ix / len) * moveSpeed; p.vy = (iy / len) * moveSpeed;
      p.x += p.vx * dt; p.y += p.vy * dt;
    } else if (pointer.active) {
      const dx = pointer.x - p.x, dy = pointer.y - p.y;
      p.vx = dx * 12; p.vy = dy * 12;
      p.x += dx * Math.min(1, dt * 14); p.y += dy * Math.min(1, dt * 14);
    } else { p.vx *= 0.82; p.vy *= 0.82; }

    p.x = Math.max(24, Math.min(W - 24, p.x));
    p.y = Math.max(54, Math.min(H - 24, p.y));
    if (world3d) world3d.setCameraFromPlayer(p.x, W);

    p.fireCooldown -= dt;
    const baseCd = p.turboTimer > 0 ? 0.11 : 0.18;
    if ((keys['Space'] || keys['KeyZ'] || pointer.active) && p.fireCooldown <= 0) {
      p.fireCooldown = baseCd * (p.ship.fireRateMult || 1.0);
      p.squashX = 1.12; p.squashY = 0.90;
      firePlayerWeapon(p);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const ob = obstacles[i];
      ob.y += ob.vy * dt; ob.rot += (ob.vrot || 0) * dt; ob.phase += dt * 2.5;
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - ob.x, b.y - ob.y) < ob.r + b.r) {
          if (vfx) vfx.addHitSparks(b.x, b.y, ob.neonColor, 8);
          if (!b.pierce) bullets.splice(j, 1);
          if (synth && Math.random() < 0.35) synth.sfxDisintegrate();
        }
      }
      if (Math.hypot(p.x - ob.x, p.y - ob.y) < p.r + ob.r - 4) {
        if (vfx) vfx.addRealisticExplosion(ob.x, ob.y, ob.neonColor, 1.0);
        obstacles.splice(i, 1); damagePlayer(); continue;
      }
      if (ob.y > H + 60) obstacles.splice(i, 1);
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      if (b.propCooldown > 0) b.propCooldown = Math.max(0, b.propCooldown - dt);
      b.rot = (b.rot || 0) + dt * 16;
      if (b.homing) {
        let target = boss, bestDist = boss ? Math.hypot(boss.x - b.x, boss.y - b.y) : 9999;
        for (const e of enemies) {
          const d = Math.hypot(e.x - b.x, e.y - b.y);
          if (d < bestDist) { bestDist = d; target = e; }
        }
        if (target && bestDist < 440) {
          const ang = Math.atan2(target.y - b.y, target.x - b.x);
          b.vx += Math.cos(ang) * 1800 * dt; b.vy += Math.sin(ang) * 1800 * dt;
          const spd = Math.hypot(b.vx, b.vy);
          if (spd > 700) { b.vx = (b.vx / spd) * 700; b.vy = (b.vy / spd) * 700; }
        }
      }
      if (b.kind === 'wave_pulse') b.r = Math.min(68, b.r + dt * 55);
      if (b.kind === 'vortex_ring') b.r = Math.min(34, b.r + dt * 28);
      b.x += b.vx * dt; b.y += b.vy * dt;

      if (vfx && vfx.trails.length < 50) vfx.addTrail(b.x, b.y + 6, b.color, Math.min(8, b.r * 0.5), 0.15);
      if (b.y < -40 || b.x < -40 || b.x > W + 40) bullets.splice(i, 1);
    }

    const slowMult = psySlowTimer > 0 ? 0.55 : 1.0;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.phase += dt * e.freq; e.rot += e.vrot * dt;
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6);

      if (e.stunTimer > 0) e.stunTimer -= dt;
      else {
        const edt = dt * slowMult;
        if (e.movePattern === 'zigzag') {
          e.turnTimer -= edt;
          if (e.turnTimer <= 0) { e.turnTimer = 0.55 + Math.random() * 0.85; e.vx = (Math.random() > 0.5 ? 1 : -1) * (110 + Math.random() * 110); }
          e.x += e.vx * edt; e.y += e.baseVy * edt;
        } else if (e.movePattern === 'dash') {
          e.y += e.baseVy * (0.45 + Math.max(0, Math.sin(e.phase * 1.4)) * 1.45) * edt;
          e.x += Math.cos(e.phase * 1.3) * e.amp * 1.15 * edt;
        } else if (e.movePattern === 'figure8') {
          e.y += (e.baseVy + Math.sin(e.phase * 2) * 85) * edt;
          e.x += Math.cos(e.phase) * e.amp * 1.35 * edt;
        } else {
          e.turnTimer -= edt;
          if (e.turnTimer <= 0) {
            e.turnTimer = 0.65 + Math.random() * 0.9;
            e.vx = Math.random() < 0.45 && player ? Math.sign(player.x - e.x) * (120 + Math.random() * 90) : (Math.random() - 0.5) * 260;
            e.vy = e.baseVy * (0.7 + Math.random() * 0.85);
          }
          e.x += e.vx * edt; e.y += e.vy * edt;
        }

        if (e.x < e.r + 10) { e.x = e.r + 10; e.vx = Math.abs(e.vx); }
        else if (e.x > W - e.r - 10) { e.x = W - e.r - 10; e.vx = -Math.abs(e.vx); }

        e.shootTimer -= edt;
        if (e.shootTimer <= 0 && e.y > 40 && e.y < H * 0.68) {
          e.shootTimer = 1.80 / diff.bulletSpeed;
          const ang = Math.atan2(p.y - e.y, p.x - e.x);
          const spd = 225 * diff.bulletSpeed;

          if (e.kind === 'evil_flyagaric') {
            for (let s = 0; s < 6; s++) {
              const sa = e.phase + (Math.PI * 2 * s) / 6;
              enemyBullets.push({ x: e.x, y: e.y + 8, vx: Math.cos(sa) * (spd * 0.85), vy: Math.sin(sa) * (spd * 0.85), r: 7, color: '#ffbe0b' });
            }
          } else if (e.kind === 'fractal_ship') {
            enemyBullets.push({ kind: 'mini_spiral', rot: 0, x: e.x, y: e.y + 16, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, r: 10, color: '#00f5d4' });
          } else if (e.kind === 'rubik_cube') {
            const rCols = ['#ff3366', '#ffd166', '#06d6a0', '#48dbfb'];
            enemyBullets.push({ kind: 'rubik_square', rot: 0, x: e.x, y: e.y + 16, vx: Math.cos(ang) * (spd * 1.25), vy: Math.sin(ang) * (spd * 1.25), r: 7.5, color: rCols[Math.floor(Math.random() * rCols.length)] });
          } else if (['skeleton_ship', 'rainbow_spiral', 'crab_ship', 'starfish_ship', 'shroom_starship', 'oracle_eye'].includes(e.kind)) {
            enemyBullets.push({ kind: 'enemy_laser', x: e.x, y: e.y + 18, vx: Math.cos(ang) * (spd * 1.42), vy: Math.sin(ang) * (spd * 1.42), ang, r: 6.5, color: lvl.accent });
          } else if (['bat_ship', 'spider_ship', 'lollipop_ship', 'octopus_ship', 'octopus_bio', 'bacteria_shroom', 'seahorse_torpedo'].includes(e.kind)) {
            enemyBullets.push({ kind: 'enemy_missile', homing: true, life: 2.7, x: e.x, y: e.y + 18, vx: Math.cos(ang) * (spd * 0.88), vy: Math.sin(ang) * (spd * 0.88), r: 8.5, color: '#ff5964' });
          } else if (['manta_wave', 'jellyfish_ship', 'hypno_jellyfish', 'venus_flytrap'].includes(e.kind)) {
            enemyBullets.push({ kind: 'psy_wave', hue: 145, x: e.x, y: e.y + 18, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, ang, r: 18, color: lvl.accent });
          } else {
            const bCol = `hsl(${Math.floor(e.phase * 140) % 360}, 100%, 64%)`;
            enemyBullets.push({ x: e.x, y: e.y + e.r * 0.7, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, r: 7.5, color: bCol });
          }
        }
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + b.r) {
          e.hp -= b.dmg; e.hitFlash = 1;
          if (vfx) vfx.addHitSparks(b.x, b.y, b.color || lvl.accent, 11);

          if (b.chainLightning && vfx) {
            for (const other of enemies) {
              if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 170) {
                other.hp -= b.dmg * 0.65; other.hitFlash = 1;
                vfx.addLightningArc(e.x, e.y, other.x, other.y, '#fee440');
                break;
              }
            }
          }

          if (b.pierce && b.pierce > 0) b.pierce--;
          else bullets.splice(j, 1);

          if (e.hp <= 0) {
            if (synth) { synth.sfxExplosion(); synth.playComboNote(combo); }
            if (vfx) vfx.addRealisticExplosion(e.x, e.y, lvl.accent, 1.05, e.wingCol, e.bodyCol);

            score += Math.round(e.points * combo * diff.scoreMult);
            const earnedFood = Math.round(e.coinValue * (p.ship.coinMult || 1));
            runCoins += earnedFood; kills++; combo = Math.min(8, combo + 1); comboTimer = 3.2;
            advanceQuest('kills', 1);
            addUltCharge(e.isElite ? 18 : 8);

            const label = e.isElite ? `👑 ЭЛИТА! +${earnedFood} 🐟` : `+${earnedFood} ${['🐟', '🍖', '🥛'][kills % 3]}`;
            if (vfx) vfx.addPopup(e.x, e.y, label, e.isElite ? '#ffd166' : '#ffd6a5', e.isElite ? 1.15 : 1.0);
            maybeDropFoodBonus(e.x, e.y, e.isElite);
            enemies.splice(i, 1); screenShake = Math.max(screenShake, 7);
          } else if (synth) synth.sfxHit();
          break;
        }
      }

      if (!enemies[i]) continue;
      if (Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r - 4) {
        if (vfx) vfx.addRealisticExplosion(e.x, e.y, '#ff5964', 1.1, e.wingCol, e.bodyCol);
        enemies.splice(i, 1); damagePlayer(); continue;
      }
      if (e.y > H + 50) enemies.splice(i, 1);
    }

    if (boss) updateBoss(dt);

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];
      const ebDt = dt * slowMult;
      if (eb.homing && eb.life > 0) {
        eb.life -= ebDt;
        const ang = Math.atan2(p.y - eb.y, p.x - eb.x);
        eb.vx += Math.cos(ang) * 190 * ebDt; eb.vy += Math.sin(ang) * 190 * ebDt;
        if (vfx && Math.random() < 0.4) vfx.addTrail(eb.x, eb.y, eb.color || '#ff758f', 4.5, 0.15);
      }
      if (eb.kind === 'psy_wave') { eb.hue = (eb.hue + ebDt * 220) % 360; eb.r = Math.min(36, eb.r + ebDt * 12); }
      else if (['laser_flower', 'green_spin_star', 'laser_shuriken', 'mini_spiral', 'rubik_square', 'thrown_donut', 'mini_mushroom_shot'].includes(eb.kind)) {
        eb.rot = (eb.rot || 0) + ebDt * 9;
      }

      eb.x += eb.vx * ebDt; eb.y += eb.vy * ebDt;
      if (Math.hypot(eb.x - p.x, eb.y - p.y) < p.r + eb.r - 5) {
        if (vfx) vfx.addHitSparks(eb.x, eb.y, '#ff5964', 10);
        enemyBullets.splice(i, 1); damagePlayer(); continue;
      }
      if (eb.y > H + 40 || eb.y < -50 || eb.x < -40 || eb.x > W + 40) enemyBullets.splice(i, 1);
    }

    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bn = bonuses[i];
      bn.phase += dt * 5; bn.y += bn.vy * dt;
      if (Math.hypot(p.x - bn.x, p.y - bn.y) < p.r + bn.r + 6) {
        applyFoodBonus(bn); bonuses.splice(i, 1); continue;
      }
      if (bn.y > H + 30) bonuses.splice(i, 1);
    }
  }

  function updateBoss(dt) {
    const b = boss, lvl = LEVELS[selectedLevelIdx], diff = DIFFICULTIES[selectedDiffKey];
    b.time += dt;
    if (b.hitFlash > 0) b.hitFlash = Math.max(0, b.hitFlash - dt * 7);
    if (b.y < b.targetY) { b.y += 95 * dt; return; }

    const hpRatio = b.hp / b.maxHp;
    b.phase = hpRatio > 0.65 ? 1 : (hpRatio > 0.30 ? 2 : 3);
    if (b.phase === 3 && vfx) { b.smokeTimer -= dt; if (b.smokeTimer <= 0) { b.smokeTimer = 0.16; vfx.addSmoke(b.x, b.y); } }

    const sweepSpeed = (b.phase === 3 ? 2.1 : (b.phase === 2 ? 1.55 : 1.15)) + selectedLevelIdx * 0.05;
    b.x = W / 2 + Math.sin(b.time * sweepSpeed) * Math.max(60, W / 2 - b.r - 24);

    b.shootTimer -= dt;
    if (b.shootTimer <= 0) fireUniqueBossWeapon(b, lvl, diff);

    b.specialTimer -= dt;
    if (b.specialTimer <= 0) {
      if (b.laserState === 'idle') { b.laserState = 'charge'; b.laserTimer = 0.95; b.laserX = player.x; if (synth) synth.sfxBossAlarm(); }
      else { b.specialTimer = 4.5; if (enemies.length < 3) spawnEnemyFormation(); maybeDropFoodBonus(b.x, b.y + 45, true); }
    }

    if (b.laserState === 'charge') {
      b.laserTimer -= dt; b.laserX += (player.x - b.laserX) * Math.min(1, dt * 3.8);
      if (b.laserTimer <= 0) { b.laserState = 'fire'; b.laserTimer = 0.78; if (synth) synth.sfxExplosion(); if (vfx) vfx.triggerFlash(lvl.accent, 0.24); screenShake = 9; }
    } else if (b.laserState === 'fire') {
      b.laserTimer -= dt;
      if (Math.abs(player.x - b.laserX) < 28 + player.r * 0.6 && player.y > b.y) damagePlayer();
      if (b.laserTimer <= 0) { b.laserState = 'idle'; b.specialTimer = 3.5; }
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const bul = bullets[j];
      let hitModule = false;

      // Проверка попадания по разрушаемым боковым модулям босса
      if (b.parts) {
        for (const pt of b.parts) {
          if (!pt.alive) continue;
          const px = b.x + pt.ox, py = b.y + pt.oy;
          if (Math.hypot(bul.x - px, bul.y - py) < pt.r + bul.r) {
            pt.hp -= bul.dmg;
            hitModule = true;
            if (vfx) vfx.addHitSparks(bul.x, bul.y, '#ffd166', 10);
            bullets.splice(j, 1);
            if (pt.hp <= 0) {
              pt.alive = false;
              runCoins += 150;
              score += 600;
              addUltCharge(20);
              if (synth) synth.sfxExplosion();
              if (vfx) {
                vfx.addRealisticExplosion(px, py, '#ffd166', 1.5);
                vfx.addPopup(px, py, '💥 МОДУЛЬ УНИЧТОЖЕН! +150 🐟', '#ffd166', 1.15);
              }
            }
            break;
          }
        }
      }
      if (hitModule) continue;

      if (Math.hypot(bul.x - b.x, bul.y - b.y) < b.r + bul.r - 6) {
        b.hp -= bul.dmg; b.hitFlash = 1; score += 25;
        addUltCharge(2);
        if (vfx) {
          vfx.addHitSparks(bul.x, bul.y, bul.color || lvl.accent, 10);
          if (bul.chainLightning) vfx.addLightningArc(bul.x, bul.y, b.x + (Math.random() - 0.5) * 50, b.y, '#fee440');
        }
        bullets.splice(j, 1);

        if (b.hp <= 0) {
          if (synth) synth.sfxBossExplosion();
          if (vfx) { vfx.triggerFlash('#ffffff', 0.65); vfx.addRealisticExplosion(b.x, b.y, lvl.accent, 2.3, lvl.bossColor, '#ffd166'); }
          screenShake = 22;

          if (isEndless) {
            score += 2000; runCoins += 300; kills++;
            if (player.hp < player.maxHp) player.hp++;
            boss = null;
            if (synth) synth.startMusic('normal', lvl.id);
            if (vfx) vfx.addPopup(W / 2, H * 0.35, '👑 БОСС ПОВЕРЖЕН! +300 🐟 И +1 ❤!', '#80ffdb', 1.2);
            return;
          }

          if (b.isMidBoss) {
            midBossDefeated = true; score += 1800; runCoins += Math.round((lvl.coinReward || 380) * 0.5); kills++;
            maybeDropFoodBonus(b.x, b.y, true); boss = null; wave = 3;
            if (synth) synth.startMusic('normal', lvl.id);
            if (vfx) vfx.addPopup(W / 2, H * 0.35, '1-Й БОСС ПОВЕРЖЕН! ВПЕРЕДИ МЕГА-БОСС!', '#80ffdb', 1.2);
            return;
          }

          score += Math.round((2500 + lvl.id * 400) * diff.scoreMult);
          runCoins += Math.round((lvl.coinReward || 380) * (player.ship.coinMult || 1));
          kills++; boss = null; enemyBullets = []; enemies = [];
          finishGame(true); return;
        }
      }
    }
  }

  function damagePlayer() {
    if (player.invuln > 0 || ultActiveTimer > 0 || state !== 'PLAYING') return;
    if (player.shield) {
      player.shield = false; player.invuln = 1.1; player.squashX = 1.3; player.squashY = 0.75;
      if (synth) synth.sfxShieldBlock();
      if (vfx) { vfx.addShockwave(player.x, player.y, '#48dbfb', 95, 0.42); vfx.addHitSparks(player.x, player.y, '#48dbfb', 16); vfx.addPopup(player.x, player.y - 20, 'ЩИТ ПОГЛОТИЛ УДАР!', '#48dbfb'); }
      screenShake = 6; return;
    }
    player.hp--; player.invuln = 1.5; player.squashX = 0.72; player.squashY = 1.32;
    if (player.secondaryLevel > 1) player.secondaryLevel = 1; else player.secondaryWeapon = 'none';
    combo = 1; screenShake = 12;
    if (synth) synth.sfxHurt();
    if (vfx) { vfx.triggerFlash('#ff5964', 0.35); vfx.addRealisticExplosion(player.x, player.y, '#ff5964', 1.1); }
    if (player.hp <= 0) finishGame(false);
  }

  function finishGame(victory) {
    state = victory ? 'VICTORY' : 'GAMEOVER';
    pointer.active = false; pauseBtn.classList.add('hidden');
    if (ultBtn) ultBtn.classList.add('hidden');
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

    if (isEndless && score > progress.endlessBest) progress.endlessBest = score;
    if (score > progress.bestScore) progress.bestScore = score;
    saveProgress(progress);

    document.getElementById('end-badge').textContent = isEndless ? 'Режим: Бесконечный Космос' : (victory ? `Уровень ${lvl.id} пройден!` : `Уровень ${lvl.id}: Корабль подбит`);
    document.getElementById('end-title').textContent = isEndless ? 'ПОЛЁТ ЗАВЕРШЁН ♾' : (victory ? (lvl.id === 6 ? 'ВСЕ 6 ГАЛАКТИК СПАСЕНЫ! 👑' : 'ПОБЕДА! 🏆') : 'ИГРА ОКОНЧЕНА');
    document.getElementById('end-subtitle').textContent = victory ? `${lvl.bossName} повержен! Загляни в Ангар!` : `Ты добыл +${runCoins} 🐟 провизии!`;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-coins').textContent = `+${runCoins} 🐟`;
    document.getElementById('final-kills').textContent = kills;
    document.getElementById('next-level-btn').textContent = isEndless ? 'ЕЩЁ РАЗ ♾' : (victory ? (selectedLevelIdx < LEVELS.length - 1 ? 'ДАЛЬШЕ ➔' : 'ЗАНОВО С 1-ГО ➔') : 'ЕЩЁ РАЗ 🔄');

    setTimeout(() => { endOverlay.classList.remove('hidden'); syncTopHudVisibility(); }, victory ? 480 : 320);
  }

  function drawFoodBonus(ctx, bn) {
    ctx.save(); ctx.translate(bn.x, bn.y);
    const pulse = 1 + Math.sin(bn.phase) * 0.12; ctx.scale(pulse, pulse);
    const glowColors = { red_shield: '#ff5964', fractal_shuriken: '#00f5d4', electric_shock: '#fee440', wave_cannon: '#f15bb5' };
    const neonCol = glowColors[bn.type] || '#ffd166';
    drawGlossyCircle(ctx, 0, 0, bn.r, '#1b1438');
    ctx.strokeStyle = neonCol; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 0, bn.r + 1, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = neonCol; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const icon = bn.type === 'red_shield' ? '🛡' : (bn.type === 'electric_shock' ? '⚡' : (bn.type === 'wave_cannon' ? '〰️' : '💠'));
    ctx.fillText(icon, 0, 1);
    ctx.restore();
  }

  function drawPlayerBullet(ctx, b) {
    ctx.save(); ctx.translate(b.x, b.y);
    if (b.kind === 'heart_shot') {
      ctx.fillStyle = '#ff4d6d'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.beginPath();
      ctx.moveTo(0, -8); ctx.bezierCurveTo(6, -14, 13, -6, 0, 8); ctx.bezierCurveTo(-13, -6, -6, -14, 0, -8); ctx.fill(); ctx.stroke();
    } else if (b.kind === 'vortex_ring') {
      ctx.rotate(b.rot || 0); ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 1.6); ctx.stroke();
    } else if (b.kind === 'player_rocket') {
      ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2); ctx.fillStyle = '#e0fbfc'; ctx.strokeStyle = BORDER_INK; ctx.lineWidth = 1.6;
      roundRectPath(ctx, -3.5, -9, 7, 16, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff5964'; ctx.beginPath(); ctx.arc(0, -9, 3.6, Math.PI, 0); ctx.fill();
    } else if (b.kind === 'wave_pulse') {
      ctx.strokeStyle = b.color || '#f15bb5'; ctx.lineWidth = 5.5; ctx.beginPath(); ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else {
      ctx.fillStyle = b.color || '#48dbfb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawBossModules(ctx, b) {
    if (!b || !b.parts) return;
    b.parts.forEach(pt => {
      if (!pt.alive) return;
      const px = b.x + pt.ox, py = b.y + pt.oy;
      ctx.save();
      ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.arc(px, py, pt.r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      const w = 28, fill = Math.max(0, w * (pt.hp / pt.maxHp));
      ctx.fillStyle = BORDER_INK; ctx.fillRect(px - w / 2, py + pt.r + 3, w, 4);
      ctx.fillStyle = '#ffd166'; ctx.fillRect(px - w / 2, py + pt.r + 3, fill, 4);
      ctx.restore();
    });
  }

  function drawPlayer(p) {
    if (p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0) return;

    // Гигантский радужный мега-луч «Кошачьей Ярости»
    if (ultActiveTimer > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const hue = Math.floor((globalTime * 360) % 360);
      ctx.fillStyle = `hsla(${hue}, 100%, 62%, 0.45)`;
      ctx.fillRect(p.x - 36, 0, 72, p.y - 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x - 14, 0, 28, p.y - 16);
      ctx.restore();
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.max(-0.24, Math.min(0.24, p.vx * 0.00055)));
    ctx.scale(p.squashX, p.squashY);

    drawPlayerShipModel(ctx, p.ship, globalTime, p.vx, { weaponId: p.baseWeapon.id });

    if (p.shield) {
      const pulse = 31 + Math.sin(globalTime * 8) * 2.5;
      ctx.strokeStyle = '#ff5964'; ctx.fillStyle = 'rgba(255, 89, 100, 0.20)'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(0, 0, pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    if (p.turboTimer > 0) {
      ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();

    if (p.drone && p.drone.id !== 'none') {
      const dx = p.x + Math.cos(globalTime * 3.5) * 44;
      const dy = p.y + Math.sin(globalTime * 3.5) * 20;
      drawDroneIcon(ctx, p.drone.id, dx, dy, globalTime);
    }
  }

  function drawCatLifeIcon(ctx, x, y, active) {
    ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = active ? '#ffb703' : 'rgba(255, 255, 255, 0.18)';
    ctx.strokeStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-7, -2); ctx.lineTo(-8, -10); ctx.lineTo(-2, -6);
    ctx.moveTo(7, -2);  ctx.lineTo(8, -10);  ctx.lineTo(2, -6);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (active) {
      ctx.fillStyle = '#120a28';
      ctx.beginPath(); ctx.arc(-2.8, -1, 1.3, 0, Math.PI * 2); ctx.arc(2.8, -1, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff5964';
      ctx.beginPath(); ctx.arc(0, 1.8, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawHUD() {
    if ((state !== 'PLAYING' && state !== 'PAUSED') || !player) return;
    const lvl = LEVELS[selectedLevelIdx];
    ctx.save();
    for (let i = 0; i < player.maxHp; i++) drawCatLifeIcon(ctx, 22 + i * 21, 26, i < player.hp);

    ctx.fillStyle = '#fff8eb'; ctx.strokeStyle = BORDER_INK; ctx.lineWidth = 4; ctx.font = '900 20px sans-serif'; ctx.textAlign = 'left';
    ctx.strokeText(`${score}  •  🐟 ${runCoins}`, 18, 60); ctx.fillText(`${score}  •  🐟 ${runCoins}`, 18, 60);

    ctx.fillStyle = lvl.accent; ctx.font = '800 12px sans-serif';
    const waveLabel = isEndless ? `♾ БЕСКОНЕЧНОСТЬ (x${endlessMult.toFixed(1)})` : (boss ? (boss.isMidBoss ? 'МИНИ-БОСС' : 'МЕГА-БОСС') : (fishRainTimer > 0 ? '🐟 РЫБНЫЙ ДОЖДЬ!' : `ВОЛНА ${Math.min(4, wave)}/4`));
    const subHud = combo > 1 ? `УРОВЕНЬ ${lvl.id} • ${waveLabel} • x${combo}` : `УРОВЕНЬ ${lvl.id} • ${waveLabel}`;
    ctx.strokeText(subHud, 18, 78); ctx.fillText(subHud, 18, 78);

    // Полоска энергии «Кошачьей Ярости»
    const ultW = 110, ultX = 18, ultY = 86;
    roundRectPath(ctx, ultX, ultY, ultW, 8, 4); ctx.fillStyle = BORDER_INK; ctx.fill();
    if (ultCharge > 0) {
      roundRectPath(ctx, ultX + 1, ultY + 1, (ultW - 2) * (ultCharge / 100), 6, 3);
      ctx.fillStyle = ultCharge >= 100 ? '#ffd166' : '#ff006e'; ctx.fill();
    }

    if (activeQuest) {
      ctx.fillStyle = activeQuest.done ? '#06d6a0' : '#ffd166';
      ctx.font = '800 11px sans-serif';
      const qText = activeQuest.done ? `✔ Цель выполнена (+${activeQuest.reward} 🐟)` : `🎯 ${activeQuest.label}: ${activeQuest.cur}/${activeQuest.target}`;
      ctx.strokeText(qText, 18, 110); ctx.fillText(qText, 18, 110);
    }

    if (boss) {
      const bw = Math.min(240, W - 210), bx = (W - bw) / 2 - 18, by = 18;
      ctx.fillStyle = '#ffd166'; ctx.font = '900 11px sans-serif'; ctx.textAlign = 'center';
      const bTitle = boss.isMidBoss ? `АВАНГАРД: ${lvl.bossName.toUpperCase()}` : lvl.bossName.toUpperCase();
      ctx.strokeText(bTitle, bx + bw / 2, by + 32); ctx.fillText(bTitle, bx + bw / 2, by + 32);
      roundRectPath(ctx, bx, by, bw, 15, 8); ctx.fillStyle = BORDER_INK; ctx.fill();
      const fillW = Math.max(0, (bw - 6) * (boss.hp / boss.maxHp));
      if (fillW > 0) { roundRectPath(ctx, bx + 3, by + 3, fillW, 9, 5); ctx.fillStyle = boss.phase === 3 ? '#ff006e' : '#ff5964'; ctx.fill(); }
    }

    if (warningBannerTimer > 0 && Math.floor(warningBannerTimer * 6) % 2 === 0) {
      ctx.fillStyle = '#ff5964'; ctx.strokeStyle = BORDER_INK; ctx.lineWidth = 5; ctx.font = '900 24px sans-serif'; ctx.textAlign = 'center';
      ctx.strokeText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44); ctx.fillText('⚠ ВНИМАНИЕ: ПОЖИРАТЕЛЬ! ⚠', W / 2, H * 0.44);
    }
    ctx.restore();
  }

  function drawEnemyBullet(ctx, eb) {
    ctx.save(); ctx.translate(eb.x, eb.y);
    if (eb.kind === 'thrown_donut') {
      ctx.rotate(eb.rot || 0);
      ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff70a6'; ctx.beginPath(); ctx.arc(0, 0, 8.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1447'; ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (eb.kind === 'mini_mushroom_shot') {
      ctx.rotate(eb.rot || 0);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, 0, 6, 9);
      ctx.fillStyle = `hsl(${eb.hue || 350}, 100%, 58%)`; ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI, 0); ctx.fill();
    } else if (eb.kind === 'mini_spiral') {
      ctx.rotate(eb.rot || 0); ctx.strokeStyle = '#00f5d4'; ctx.lineWidth = 2.6; ctx.beginPath();
      for (let t = 0; t < 14; t++) { const a = t * 0.6, r = t * 0.7; if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.stroke();
    } else if (eb.kind === 'rubik_square') {
      ctx.rotate(eb.rot || 0); ctx.fillStyle = eb.color || '#ffd166'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
      roundRectPath(ctx, -6, -6, 12, 12, 2.5); ctx.fill(); ctx.stroke();
    } else if (eb.kind === 'psy_wave') {
      ctx.rotate((eb.ang || Math.PI / 2) - Math.PI / 2);
      ctx.strokeStyle = `hsl(${eb.hue || 0}, 100%, 62%)`; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, -6, eb.r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else if (eb.kind === 'enemy_laser') {
      ctx.rotate(Math.atan2(eb.vy, eb.vx) - Math.PI / 2); ctx.fillStyle = eb.color || '#ff002b'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6;
      roundRectPath(ctx, -3.5, -14, 7, 28, 3.5); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = eb.color || '#ff5964'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, eb.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function render() {
    const lvl = LEVELS[selectedLevelIdx];
    ctx.save();
    if (screenShake > 0) ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    if (world3d) world3d.render(ctx, lvl, W, H);
    else { ctx.fillStyle = lvl.skyMid; ctx.fillRect(0, 0, W, H); }

    if (vfx) vfx.renderTrails(ctx);
    for (const pr of interactiveProps) drawInteractiveProp(ctx, pr);
    for (const ob of obstacles) drawObstacle(ctx, ob);
    for (const fr of fishRainItems) drawFishRainItem(ctx, fr);
    for (const bn of bonuses) drawFoodBonus(ctx, bn);
    for (const b of bullets) drawPlayerBullet(ctx, b);
    for (const e of enemies) drawUniqueEnemy(ctx, e, player);
    if (boss) {
      drawUniqueBoss(ctx, boss, lvl, player, H);
      drawBossModules(ctx, boss);
    }
    for (const eb of enemyBullets) drawEnemyBullet(ctx, eb);
    if (player && state !== 'GAMEOVER' && state !== 'START') drawPlayer(player);
    if (vfx) vfx.renderForeground(ctx, W, H);
    drawHUD();
    ctx.restore();
  }

  let lastTime = performance.now();
  (function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    try { update(dt); render(); } catch (err) { console.error(err); }
    requestAnimationFrame(loop);
  })(performance.now());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pointer.active = false;
    else lastTime = performance.now();
  });
})();
