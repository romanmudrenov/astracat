(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_25d_deluxe_v1';

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        bestScore: raw.bestScore || 0,
        completed: Array.isArray(raw.completed) ? raw.completed : []
      };
    } catch (e) {
      return { bestScore: 0, completed: [] };
    }
  }

  function saveProgress(prog) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {}
  }

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  // Безопасная инициализация модулей
  const synth = typeof PolySynth !== 'undefined' ? new PolySynth() : null;
  const world3d = typeof World3DEngine !== 'undefined' ? new World3DEngine() : null;
  const vfx = typeof VFXEngine !== 'undefined' ? new VFXEngine() : null;

  const startOverlay = document.getElementById('start-overlay');
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
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

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
      `<span>${cur.enemiesDesc ? 'Враги: ' + cur.enemiesDesc + ' • ' : ''}Босс: ${cur.bossName}</span>`;
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
  });

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
    if (synth) synth.musicVolume = Number(e.target.value) / 100;
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
    if (synth) { synth.init(); synth.sfxPowerup(); }
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
  let runtimeError = null;

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
      synth.startMusic('normal', lvl.bpm, lvl.rootOffset, lvl.songStyle || 0);
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
    runtimeError = null;

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
      weaponType: 'default',
      weaponTimer: 0,
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
    endOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    pauseBtn.classList.remove('hidden');

    if (world3d) world3d.setCameraFromPlayer(player.x, W);
    if (vfx) vfx.addPopup(W / 2, H * 0.36, `СЕКТОР ${lvl.id}: ${lvl.name.toUpperCase()}`, lvl.accent, 1.15);
  }

  document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    startLevel(selectedLevelIdx);
  });
  document.getElementById('next-level-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'VICTORY') {
      startLevel((selectedLevelIdx + 1) % LEVELS.length);
    } else {
      startLevel(selectedLevelIdx);
    }
  });

  // =========================================================================
  // СПАВН И ОРУЖИЕ
  // =========================================================================
  function spawnEnemy() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp;
    const margin = 44;
    const x = margin + Math.random() * (W - margin * 2);

    const types = lvl.enemyTypes || ['ufo', 'meteor'];
    const isHeavy = Math.random() < (wave === 1 ? 0.35 : 0.55);
    const kind = isHeavy ? types[1] : types[0];
    const hp = Math.max(1, Math.round((isHeavy ? 4 : 2) * hpScale));

    enemies.push({
      kind,
      x,
      y: -38,
      r: isHeavy ? 25 : 21,
      hp,
      maxHp: hp,
      vy: (isHeavy ? 105 : 138) * diff.bulletSpeed,
      vx: kind === 'meteor' ? (Math.random() - 0.5) * 75 : 0,
      rot: 0,
      vrot: (Math.random() - 0.5) * 3.5,
      phase: Math.random() * Math.PI * 2,
      amp: isHeavy ? 52 : 78,
      shootTimer: (isHeavy ? 1.35 : 1.75) + Math.random() * 0.9,
      hitFlash: 0,
      points: isHeavy ? 180 : 110
    });
  }

  function spawnBoss() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const totalHp = Math.round(175 * lvl.hpMult * diff.enemyHp);

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
      laserX: W / 2
    };
    warningBannerTimer = 2.4;
    if (synth) { synth.sfxBossAlarm(); synth.setMusicMode('boss'); }
    if (vfx) vfx.triggerFlash(lvl.accent, 0.28);
  }

  function maybeDropFoodBonus(x, y, guaranteed = false) {
    if (!guaranteed && Math.random() > 0.34) return;
    const foods = ['pizza', 'sushi', 'donut', 'burger', 'milk'];
    const chosen = foods[Math.floor(Math.random() * foods.length)];
    bonuses.push({ type: chosen, x, y, r: 18, vy: 112, phase: Math.random() * Math.PI * 2 });
  }

  function firePlayerWeapon(p, lvl) {
    const pan = ((p.x / W) * 2 - 1) * 0.7;
    const upgraded = p.weaponType !== 'default';
    if (synth) synth.sfxShoot(pan, upgraded ? 2 : 1);

    if (p.weaponType === 'pizza') {
      [-0.30, -0.15, 0, 0.15, 0.30].forEach((ang, idx) => {
        bullets.push({
          kind: 'pizza_slice',
          x: p.x + (idx - 2) * 5, y: p.y - 22,
          vx: Math.sin(ang) * 670, vy: -Math.cos(ang) * 670,
          r: 8, dmg: 1.2, color: '#ffd166'
        });
      });
    } else if (p.weaponType === 'sushi') {
      [-14, 14].forEach(ox => {
        bullets.push({
          kind: 'shuriken', homing: true,
          x: p.x + ox, y: p.y - 20,
          vx: ox * 4, vy: -620, rot: 0,
          r: 9, dmg: 1.5, color: '#06d6a0'
        });
      });
    } else if (p.weaponType === 'donut') {
      [-9, 9].forEach(ox => {
        bullets.push({
          kind: 'laser_bolt', pierce: 2,
          x: p.x + ox, y: p.y - 26,
          vx: 0, vy: -880,
          r: 7, dmg: 1.35, color: '#ff70a6'
        });
      });
    } else if (p.weaponType === 'burger') {
      bullets.push({
        kind: 'burger_rocket', explosive: true,
        x: p.x, y: p.y - 28,
        vx: 0, vy: -560,
        r: 11, dmg: 3.2, color: '#ff9f1c'
      });
    } else {
      bullets.push({
        kind: 'plasma',
        x: p.x, y: p.y - 24,
        vx: 0, vy: -690,
        r: 6, dmg: 1, color: lvl.accent
      });
    }
  }

  function applyFoodBonus(bn) {
    if (synth) synth.sfxPowerup();
    player.squashX = 1.3;
    player.squashY = 1.3;
    if (vfx) {
      vfx.addShockwave(bn.x, bn.y, '#ffd166', 75, 0.38);
      vfx.addBurst(bn.x, bn.y, ['#ffd166', '#06d6a0', '#48dbfb', '#ffffff'], 16, 190);
    }

    if (bn.type === 'pizza') {
      player.weaponType = 'pizza';
      player.weaponTimer = 14;
      score += 220;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🍕 ПИЦЦА: ОГНЕННЫЙ ВЕЕР!', '#ffb703', 1.1);
    } else if (bn.type === 'sushi') {
      player.weaponType = 'sushi';
      player.weaponTimer = 14;
      score += 220;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🍣 СУШИ: АВТО-СЮРИКЕНЫ!', '#06d6a0', 1.1);
    } else if (bn.type === 'donut') {
      player.weaponType = 'donut';
      player.weaponTimer = 13;
      player.turboTimer = 13;
      score += 220;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🍩 ПОНЧИК: ГИПЕР-ЛАЗЕР!', '#ff70a6', 1.1);
    } else if (bn.type === 'burger') {
      player.weaponType = 'burger';
      player.weaponTimer = 14;
      if (player.hp < player.maxHp) player.hp++;
      score += 250;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🍔 БУРГЕР: РАКЕТЫ +1 HP!', '#ff9f1c', 1.1);
    } else if (bn.type === 'milk') {
      player.shield = true;
      score += 200;
      if (vfx) vfx.addPopup(bn.x, bn.y, '🥛 МОЛОКО: ПЛАЗМО-ЩИТ!', '#48dbfb', 1.1);
    }
  }

  // =========================================================================
  // ОБНОВЛЕНИЕ ФИЗИКИ
  // =========================================================================
  function update(dt) {
    globalTime += dt;
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
      if (wave === 1 && waveTimer > 13) {
        wave = 2;
        if (vfx) vfx.addPopup(W / 2, H * 0.35, 'ВОЛНА 2!', lvl.accent, 1.2);
      } else if (wave === 2 && waveTimer > 27) {
        wave = 3;
        spawnBoss();
      }

      if (wave < 3) {
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnEnemy();
          spawnTimer = (wave === 1 ? 0.96 : 0.74) * diff.spawnRate;
        }
      }
    }

    const p = player;
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
    if (p.weaponTimer > 0) {
      p.weaponTimer -= dt;
      if (p.weaponTimer <= 0) p.weaponType = 'default';
    }
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
    const fireRates = { default: 0.17, pizza: 0.20, sushi: 0.18, donut: 0.11, burger: 0.28 };
    const fireInterval = fireRates[p.weaponType] || 0.17;

    if (wantsFire && p.fireCooldown <= 0) {
      p.fireCooldown = fireInterval;
      p.squashX = 1.14;
      p.squashY = 0.88;
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
          b.vx += Math.cos(ang) * 1600 * dt;
          b.vy += Math.sin(ang) * 1600 * dt;
          const spd = Math.hypot(b.vx, b.vy);
          if (spd > 680) { b.vx = (b.vx / spd) * 680; b.vy = (b.vy / spd) * 680; }
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (vfx && b.kind !== 'plasma') {
        vfx.addTrail(b.x, b.y + 6, b.color, b.r * 0.65, 0.18);
      }

      if (b.y < -30 || b.x < -30 || b.x > W + 30) bullets.splice(i, 1);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.phase += dt * 2.6;
      e.y += e.vy * dt;
      if (e.kind === 'meteor') {
        e.x += e.vx * dt;
        e.rot += e.vrot * dt;
        if (e.x < e.r || e.x > W - e.r) e.vx *= -1;
      } else {
        e.x += Math.cos(e.phase) * e.amp * dt;
        e.x = Math.max(e.r + 10, Math.min(W - e.r - 10, e.x));
      }

      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6);

      e.shootTimer -= dt;
      if (e.shootTimer <= 0 && e.y > 40 && e.y < H * 0.68) {
        e.shootTimer = 1.75 / diff.bulletSpeed;
        const ang = Math.atan2(p.y - e.y, p.x - e.x);
        const spd = 230 * diff.bulletSpeed;
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
              vfx.addShockwave(b.x, b.y, '#ff9f1c', 70, 0.32);
              vfx.addBurst(b.x, b.y, ['#ff9f1c', '#ff5964', '#ffd166'], 12, 180);
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
              vfx.addShockwave(e.x, e.y, lvl.accent, 65, 0.35);
              vfx.addBurst(e.x, e.y, ['#ff5964', '#ffd166', lvl.accent, '#ffffff'], 16, 210);
            }
            const pts = Math.round(e.points * combo * diff.scoreMult);
            score += pts;
            kills++;
            combo = Math.min(5, combo + 1);
            comboTimer = 3.2;
            if (vfx) vfx.addPopup(e.x, e.y, `+${pts}`, '#ffd166');
            maybeDropFoodBonus(e.x, e.y, false);
            enemies.splice(i, 1);
            screenShake = Math.max(screenShake, 4.5);
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
        if (vfx) vfx.addBurst(e.x, e.y, ['#ff5964', '#ffd166'], 14, 180);
        damagePlayer();
        continue;
      }

      if (e.y > H + 50) enemies.splice(i, 1);
    }

    if (boss) updateBoss(dt);

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];
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
        b.smokeTimer = 0.14;
        vfx.addSmoke(b.x, b.y);
      }
    }

    const sweepSpeed = (b.phase === 3 ? 2.1 : (b.phase === 2 ? 1.55 : 1.15)) + selectedLevelIdx * 0.05;
    const span = Math.max(60, W / 2 - b.r - 24);
    b.x = W / 2 + Math.sin(b.time * sweepSpeed) * span;

    b.shootTimer -= dt;
    if (b.shootTimer <= 0) {
      const pan = ((b.x / W) * 2 - 1) * 0.7;
      if (synth) synth.sfxHit(pan);
      const spd = 235 * diff.bulletSpeed;

      if (b.phase === 1) {
        b.shootTimer = 1.12;
        const spread = selectedLevelIdx >= 5 ? 3 : 2;
        for (let k = -spread; k <= spread; k++) {
          const ang = Math.PI / 2 + k * 0.21;
          enemyBullets.push({
            x: b.x + k * 12, y: b.y + 40,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 8, color: '#ff5964'
          });
        }
      } else if (b.phase === 2) {
        b.shootTimer = 0.82;
        const baseAng = Math.sin(b.time * 3.5) * 0.5 + Math.PI / 2;
        for (let k = -2; k <= 2; k++) {
          const ang = baseAng + k * 0.27;
          enemyBullets.push({
            x: b.x, y: b.y + 40,
            vx: Math.cos(ang) * (spd + 25), vy: Math.sin(ang) * (spd + 25),
            r: 8, color: '#ffbe0b'
          });
        }
      } else {
        b.shootTimer = 0.70;
        const count = 8 + Math.floor(selectedLevelIdx / 3);
        for (let k = 0; k < count; k++) {
          const ang = b.time * 2.2 + (Math.PI * 2 * k) / count;
          enemyBullets.push({
            x: b.x, y: b.y + 20,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            r: 7.5, color: lvl.accent
          });
        }
      }
    }

    b.specialTimer -= dt;
    if (b.specialTimer <= 0) {
      if (b.phase === 2) {
        b.specialTimer = 5.2;
        if (enemies.length < 3) spawnEnemy();
        maybeDropFoodBonus(b.x, b.y + 45, true);
      } else if (b.phase === 3 && b.laserState === 'idle') {
        b.laserState = 'charge';
        b.laserTimer = 1.1;
        b.laserX = player.x;
        if (synth) synth.sfxBossAlarm();
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
          if (bul.explosive) vfx.addShockwave(bul.x, bul.y, '#ff9f1c', 80, 0.35);
          vfx.addBurst(bul.x, bul.y, ['#ffd166', lvl.accent, '#ffffff'], 6, 140);
        }

        if (b.hp <= 0) {
          score += Math.round((2000 + lvl.id * 350) * diff.scoreMult);
          kills++;
          if (synth) synth.sfxExplosion(0, true);
          if (vfx) {
            vfx.triggerFlash('#ffffff', 0.55);
            vfx.addShockwave(b.x, b.y, '#ffd166', 190, 0.65);
            vfx.addBurst(b.x, b.y, ['#ff5964', '#ffd166', '#06d6a0', lvl.accent, '#ffffff'], 45, 340);
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
        vfx.addBurst(player.x, player.y, ['#48dbfb', '#ffffff'], 18, 220);
        vfx.addPopup(player.x, player.y - 20, 'ЩИТ ПОГЛОТИЛ УДАР!', '#48dbfb');
      }
      screenShake = 6;
      return;
    }

    player.hp--;
    player.invuln = 1.5;
    player.squashX = 0.72;
    player.squashY = 1.32;
    combo = 1;
    screenShake = 12;
    if (synth) synth.sfxHurt();
    if (vfx) {
      vfx.triggerFlash('#ff5964', 0.35);
      vfx.addBurst(player.x, player.y, ['#ff5964', '#ffd166', '#ffffff'], 20, 220);
    }

    if (player.hp <= 0) finishGame(false);
  }

  function finishGame(victory) {
    state = victory ? 'VICTORY' : 'GAMEOVER';
    pointer.active = false;
    pauseBtn.classList.add('hidden');
    if (synth) synth.stopMusic();

    const lvl = LEVELS[selectedLevelIdx];

    if (victory) {
      if (synth) synth.sfxVictory();
      if (!progress.completed.includes(lvl.id)) progress.completed.push(lvl.id);
    } else {
      if (synth) synth.sfxGameOver();
    }

    if (score > progress.bestScore) progress.bestScore = score;
    saveProgress(progress);

    document.getElementById('end-badge').textContent = victory
      ? `Сектор ${lvl.id} зачищен!`
      : `Сектор ${lvl.id}: Корабль подбит`;
    document.getElementById('end-badge').style.background = victory ? '#06d6a0' : '#ffd166';
    document.getElementById('end-title').textContent = victory
      ? (lvl.id === 10 ? 'ГАЛАКТИКА СПАСЕНА! 👑' : 'ПОБЕДА! 🏆')
      : 'ИГРА ОКОНЧЕНА';
    document.getElementById('end-subtitle').textContent = victory
      ? `${lvl.bossName} повержен! Готов лететь дальше?`
      : 'Попробуй ещё раз — собирай космическую еду и береги щит!';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-best').textContent = progress.bestScore;
    document.getElementById('final-kills').textContent = kills;

    const nextBtn = document.getElementById('next-level-btn');
    if (victory) {
      nextBtn.textContent = lvl.id < 10 ? `СЕКТОР ${lvl.id + 1} ➔` : 'ЗАНОВО С 1-ГО ➔';
    } else {
      nextBtn.textContent = 'ЕЩЁ РАЗ 🔄';
    }

    setTimeout(() => { endOverlay.classList.remove('hidden'); }, victory ? 550 : 350);
  }

  // =========================================================================
  // ОТРИСОВКА ИГРОКА И HUD
  // =========================================================================
  function drawPlayer(p) {
    if (p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    const tilt = Math.max(-0.24, Math.min(0.24, p.vx * 0.00055));
    ctx.rotate(tilt);
    ctx.scale(p.squashX, p.squashY);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.fillStyle = 'rgba(12, 8, 28, 0.35)';
    ctx.beginPath();
    ctx.ellipse(6, 26, 20, 9, 0, 0, Math.PI * 2);
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
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = '#ff5964';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -2);
    ctx.lineTo(-32, 16);
    ctx.lineTo(-12, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(14, -2);
    ctx.lineTo(32, 16);
    ctx.lineTo(12, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (p.weaponType !== 'default') {
      ctx.fillStyle = '#ffd166';
      [-24, 24].forEach(wx => {
        roundRectPath(ctx, wx - 4, -2, 8, 16, 4);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.fillStyle = '#fff8eb';
    ctx.beginPath();
    ctx.ellipse(0, 2, 18, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, -14, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#48dbfb';
    ctx.beginPath();
    ctx.arc(0, -1, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-6, -11);
    ctx.lineTo(-2, -6);
    ctx.moveTo(8, -4);
    ctx.lineTo(6, -11);
    ctx.lineTo(2, -6);
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

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(-5, -6, 3.5, 2, -0.5, 0, Math.PI * 2);
    ctx.fill();

    if (p.shield) {
      const pulse = 34 + Math.sin(globalTime * 8) * 2.5;
      ctx.strokeStyle = '#48dbfb';
      ctx.fillStyle = 'rgba(72, 219, 251, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
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
      ctx.fill();
      ctx.stroke();
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
    const subHud = combo > 1 ? `СЕКТОР ${lvl.id} • x${combo} КОМБО` : `СЕКТОР ${lvl.id}: ${lvl.name}`;
    ctx.strokeText(subHud, 18, 80);
    ctx.fillText(subHud, 18, 80);

    if (player.weaponType !== 'default') {
      const labels = {
        pizza: '🍕 ОГНЕННЫЙ ВЕЕР',
        sushi: '🍣 АВТО-СЮРИКЕНЫ',
        donut: '🍩 ГИПЕР-ЛАЗЕР',
        burger: '🍔 БУРГЕР-РАКЕТЫ'
      };
      ctx.fillStyle = '#ffd166';
      ctx.font = '900 12px sans-serif';
      const wText = `${labels[player.weaponType]} (${Math.ceil(player.weaponTimer)}с)`;
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
      ctx.strokeText('⚠ ВНИМАНИЕ: БОСС! ⚠', W / 2, H * 0.44);
      ctx.fillText('⚠ ВНИМАНИЕ: БОСС! ⚠', W / 2, H * 0.44);
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
      ctx.fill();
      ctx.stroke();

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

    if (runtimeError) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(10, H - 70, W - 20, 50);
      ctx.fillStyle = '#ff5964';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('Ошибка: ' + runtimeError, 20, H - 40);
    }

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
      runtimeError = err.message;
      console.error(err);
    }
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pointer.active = false;
    else lastTime = performance.now();
  });

  requestAnimationFrame(loop);
})();
