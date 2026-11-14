(() => {
  'use strict';

  const STORAGE_KEY = 'astro_cat_10_sectors_deluxe_v1';

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
  const synth = new PolySynth();

  const startOverlay = document.getElementById('start-overlay');
  const settingsOverlay = document.getElementById('settings-overlay');
  const pauseOverlay = document.getElementById('pause-overlay');
  const endOverlay = document.getElementById('end-overlay');
  const pauseBtn = document.getElementById('pause-btn');
  const muteBtn = document.getElementById('mute-btn');

  let progress = loadProgress();
  let selectedLevelIdx = 0; // 0..9
  let selectedDiffKey = 'normal';

  let W = 480;
  let H = 800;
  let dpr = 1;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(320, rect.width);
    H = Math.max(480, rect.height);
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
    levelsGrid.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      btn.className = 'lvl-btn' + (idx === selectedLevelIdx ? ' active' : '');
      const done = progress.completed.includes(lvl.id);
      btn.innerHTML = `<span>${lvl.id}</span><span class="star">${done ? '★' : '☆'}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        synth.init();
        synth.sfxHit(0);
        selectedLevelIdx = idx;
        renderLevelGrid();
      });
      levelsGrid.appendChild(btn);
    });

    const cur = LEVELS[selectedLevelIdx];
    selectedLevelInfo.innerHTML = `<strong>Сектор ${cur.id}: ${cur.name}</strong><br><span>Босс: ${cur.bossName}</span>`;
    document.getElementById('start-best').textContent =
      `Общий рекорд: ${progress.bestScore} • Пройдено: ${progress.completed.length}/10`;
  }
  renderLevelGrid();

  document.querySelectorAll('#diff-row .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      synth.init();
      synth.sfxHit(0);
      selectedDiffKey = btn.dataset.diff;
      document.querySelectorAll('#diff-row .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  let state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER'
  let prevStateBeforeSettings = 'START';

  function openSettings() {
    synth.init();
    prevStateBeforeSettings = state;
    if (state === 'PLAYING') state = 'PAUSED';
    settingsOverlay.classList.remove('hidden');
  }

  function closeSettings() {
    settingsOverlay.classList.add('hidden');
    if (prevStateBeforeSettings === 'PLAYING') {
      state = 'PLAYING';
    }
  }

  document.getElementById('settings-open-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openSettings();
  });
  document.getElementById('menu-sound-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openSettings();
  });
  document.getElementById('settings-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    closeSettings();
  });

  const toggleMusicBtn = document.getElementById('toggle-music');
  toggleMusicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    synth.init();
    synth.musicEnabled = !synth.musicEnabled;
    toggleMusicBtn.textContent = synth.musicEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleMusicBtn.classList.toggle('off', !synth.musicEnabled);
  });

  const toggleSfxBtn = document.getElementById('toggle-sfx');
  toggleSfxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    synth.init();
    synth.sfxEnabled = !synth.sfxEnabled;
    toggleSfxBtn.textContent = synth.sfxEnabled ? 'ВКЛ' : 'ВЫКЛ';
    toggleSfxBtn.classList.toggle('off', !synth.sfxEnabled);
  });

  document.getElementById('music-vol').addEventListener('input', (e) => {
    synth.musicVolume = Number(e.target.value) / 100;
  });

  document.getElementById('sfx-vol').addEventListener('input', (e) => {
    synth.sfxVolume = Number(e.target.value) / 100;
  });

  document.querySelectorAll('#timbre-row .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      synth.init();
      synth.timbre = btn.dataset.timbre;
      document.querySelectorAll('#timbre-row .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      synth.sfxPowerup();
    });
  });

  document.getElementById('test-chord-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    synth.init();
    synth.sfxPowerup();
  });

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const muted = synth.toggleMute();
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

  // =========================================================================
  // СОСТОЯНИЕ ИГРЫ И ОБЪЕКТЫ
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

  const stars = Array.from({ length: 58 }, (_, i) => ({
    x: Math.random() * 1200,
    y: Math.random() * 1200,
    r: i % 3 === 0 ? 2.7 : 1.5,
    speed: 35 + (i % 3) * 45,
    phase: Math.random() * Math.PI * 2
  }));

  const props = Array.from({ length: 5 }, (_, i) => ({
    xRatio: 0.14 + (i * 0.19) % 0.76,
    y: i * 175 + 60,
    r: 24 + (i % 3) * 11,
    speed: 14 + (i % 3) * 6,
    rot: Math.random() * Math.PI * 2,
    vrot: (i % 2 === 0 ? 1 : -1) * 0.35,
    variant: i
  }));

  let player = null;
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let bonuses = [];
  let particles = [];
  let popups = [];
  let boss = null;

  // Управление
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

  pauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePause();
  });
  document.getElementById('resume-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    togglePause();
  });

  function returnToMenu() {
    state = 'START';
    pointer.active = false;
    boss = null;
    enemies = [];
    bullets = [];
    enemyBullets = [];
    bonuses = [];
    particles = [];
    popups = [];

    synth.stopMusic();

    pauseOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    pauseBtn.classList.add('hidden');

    renderLevelGrid();
    startOverlay.classList.remove('hidden');
  }

  ['pause-menu-btn', 'end-menu-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        returnToMenu();
      });
    }
  });

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyM') {
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

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (state !== 'PLAYING') return;
    synth.init();
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

  window.addEventListener('pointerup', () => {
    pointer.active = false;
  });

  function startLevel(idx) {
    selectedLevelIdx = idx;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];

    synth.init();
    synth.startMusic('normal', lvl.bpm, lvl.rootOffset, lvl.songStyle);

    score = 0;
    kills = 0;
    combo = 1;
    comboTimer = 0;
    wave = 1;
    waveTimer = 0;
    spawnTimer = 0.5;
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
      weaponLevel: 1,
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
    particles = [];
    popups = [];
    boss = null;

    state = 'PLAYING';
    startOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
    pauseBtn.classList.remove('hidden');

    addPopup(W / 2, H * 0.36, `СЕКТОР ${lvl.id}: ${lvl.name.toUpperCase()}`, lvl.accent);
  }

  document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    startLevel(selectedLevelIdx);
  });
  document.getElementById('next-level-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'VICTORY') {
      const nextIdx = (selectedLevelIdx + 1) % LEVELS.length;
      startLevel(nextIdx);
    } else {
      startLevel(selectedLevelIdx);
    }
  });

  // =========================================================================
  // СПАВН ВРАГОВ, БОНУСОВ И БОССОВ
  // =========================================================================
  function spawnEnemy() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const hpScale = lvl.hpMult * diff.enemyHp;
    const margin = 44;
    const x = margin + Math.random() * (W - margin * 2);
    const roll = Math.random();

    if (wave === 1 && roll < 0.65) {
      const hp = Math.max(1, Math.round(2 * hpScale));
      enemies.push({
        kind: 'ufo',
        x, y: -36, r: 22, hp, maxHp: hp,
        vy: (118 + Math.random() * 32) * diff.bulletSpeed,
        phase: Math.random() * Math.PI * 2,
        amp: 58 + Math.random() * 35,
        shootTimer: 1.5 + Math.random() * 1.2,
        hitFlash: 0,
        points: 100
      });
    } else if (roll < 0.36) {
      const hp = Math.max(2, Math.round(3 * hpScale));
      enemies.push({
        kind: 'wasp',
        x, y: -36, r: 21, hp, maxHp: hp,
        vy: (152 + Math.random() * 35) * diff.bulletSpeed,
        phase: Math.random() * Math.PI * 2,
        amp: 82,
        shootTimer: 1.1 + Math.random() * 0.85,
        hitFlash: 0,
        points: 160
      });
    } else if (roll < 0.72) {
      const hp = Math.max(3, Math.round(5 * hpScale));
      enemies.push({
        kind: 'crab',
        x, y: -42, r: 27, hp, maxHp: hp,
        vy: (92 + Math.random() * 24) * diff.bulletSpeed,
        phase: Math.random() * Math.PI * 2,
        amp: 48,
        shootTimer: 1.4 + Math.random() * 0.9,
        hitFlash: 0,
        points: 230
      });
    } else {
      const hp = Math.max(2, Math.round(3 * hpScale));
      enemies.push({
        kind: 'meteor',
        x, y: -40, r: 25, hp, maxHp: hp,
        vy: (132 + Math.random() * 36) * diff.bulletSpeed,
        vx: (Math.random() - 0.5) * 65,
        rot: 0,
        vrot: (Math.random() - 0.5) * 3.5,
        shootTimer: 99,
        hitFlash: 0,
        points: 120
      });
    }
  }

  function spawnBoss() {
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];
    const totalHp = Math.round(170 * lvl.hpMult * diff.enemyHp);

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
      shootTimer: 1.1,
      specialTimer: 4.5,
      laserState: 'idle',
      laserTimer: 0,
      laserX: W / 2
    };
    warningBannerTimer = 2.4;
    synth.sfxBossAlarm();
    synth.setMusicMode('boss');
  }

  function maybeDropBonus(x, y, guaranteed = false) {
    if (!guaranteed && Math.random() > 0.28) return;
    const types = ['weapon', 'shield', 'turbo', 'heart'];
    let chosen = types[Math.floor(Math.random() * types.length)];
    if (chosen === 'heart' && player && player.hp >= player.maxHp) {
      chosen = Math.random() < 0.6 ? 'weapon' : 'turbo';
    }
    bonuses.push({
      type: chosen,
      x, y, r: 18, vy: 115,
      phase: Math.random() * Math.PI * 2
    });
  }

  function addBurst(x, y, colors, count = 14, speed = 180) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = speed * (0.4 + Math.random() * 0.75);
      particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 4 + Math.random() * 4.5,
        color: colors[i % colors.length],
        life: 0.34 + Math.random() * 0.25,
        maxLife: 0.6
      });
    }
  }

  function addPopup(x, y, text, color = '#ffd166') {
    popups.push({ x, y, text, color, life: 0.95 });
  }

  // =========================================================================
  // ОБНОВЛЕНИЕ ФИЗИКИ И ИГРОВОЙ ЛОГИКИ
  // =========================================================================
  function update(dt) {
    globalTime += dt;
    const lvl = LEVELS[selectedLevelIdx];
    const diff = DIFFICULTIES[selectedDiffKey];

    for (const s of stars) {
      s.y += s.speed * dt;
      if (s.y > H + 10) {
        s.y = -10;
        s.x = Math.random() * W;
      }
    }
    for (const pr of props) {
      pr.y += pr.speed * dt;
      pr.rot += pr.vrot * dt;
      if (pr.y > H + pr.r + 40) pr.y = -pr.r - 40;
    }

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
        addPopup(W / 2, H * 0.35, 'ВОЛНА 2!', lvl.accent);
      } else if (wave === 2 && waveTimer > 27) {
        wave = 3;
        spawnBoss();
      }

      if (wave < 3) {
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnEnemy();
          const baseRate = wave === 1 ? 0.98 : 0.76;
          spawnTimer = baseRate * diff.spawnRate;
        }
      }
    }

    // Игрок
    const p = player;
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
    if (p.weaponTimer > 0) {
      p.weaponTimer -= dt;
      if (p.weaponTimer <= 0) p.weaponLevel = 1;
    }
    if (p.turboTimer > 0) p.turboTimer = Math.max(0, p.turboTimer - dt);

    p.blinkTimer -= dt;
    if (p.blinkTimer < -0.14) p.blinkTimer = 2.4 + Math.random() * 2;

    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    const moveSpeed = p.turboTimer > 0 ? 450 : 350;
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

    // Выстрелы игрока
    p.fireCooldown -= dt;
    const wantsFire = keys['Space'] || keys['KeyZ'] || pointer.active;
    const fireInterval = p.turboTimer > 0 ? 0.12 : 0.17;
    if (wantsFire && p.fireCooldown <= 0) {
      p.fireCooldown = fireInterval;
      p.squashX = 1.14;
      p.squashY = 0.88;

      const pan = ((p.x / W) * 2 - 1) * 0.7;
      synth.sfxShoot(pan, p.weaponLevel);

      if (p.weaponLevel === 1) {
        bullets.push({ x: p.x, y: p.y - 24, vx: 0, vy: -680, r: 6, dmg: 1, color: lvl.accent });
      } else if (p.weaponLevel === 2) {
        bullets.push({ x: p.x - 10, y: p.y - 20, vx: -55, vy: -670, r: 6, dmg: 1, color: '#ffd166' });
        bullets.push({ x: p.x,      y: p.y - 26, vx: 0,   vy: -700, r: 7, dmg: 1, color: '#ff6b6b' });
        bullets.push({ x: p.x + 10, y: p.y - 20, vx: 55,  vy: -670, r: 6, dmg: 1, color: '#ffd166' });
      } else {
        [-0.26, -0.13, 0, 0.13, 0.26].forEach((a, idx) => {
          bullets.push({
            x: p.x + (idx - 2) * 6,
            y: p.y - 22,
            vx: Math.sin(a) * 690,
            vy: -Math.cos(a) * 690,
            r: idx === 2 ? 7.5 : 5.5,
            dmg: 1,
            color: idx === 2 ? '#ff5964' : '#ffd166'
          });
        });
      }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -20 || b.x < -20 || b.x > W + 20) bullets.splice(i, 1);
    }

    // Враги
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
        e.shootTimer = (e.kind === 'wasp' ? 1.45 : 2.05) / diff.bulletSpeed;
        const ang = Math.atan2(p.y - e.y, p.x - e.x);
        const spd = (e.kind === 'wasp' ? 265 : 210) * diff.bulletSpeed;
        enemyBullets.push({
          x: e.x, y: e.y + e.r * 0.7,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: 7,
          color: e.kind === 'wasp' ? '#ffbe0b' : '#ff5964'
        });
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + b.r) {
          bullets.splice(j, 1);
          e.hp -= b.dmg;
          e.hitFlash = 1;
          addBurst(b.x, b.y, ['#ffd166', '#ffffff'], 5, 110);

          if (e.hp <= 0) {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            synth.sfxExplosion(pan, false);
            addBurst(e.x, e.y, ['#ff5964', '#ffd166', lvl.accent, '#ffffff'], 15, 205);
            const pts = Math.round(e.points * combo * diff.scoreMult);
            score += pts;
            kills++;
            combo = Math.min(5, combo + 1);
            comboTimer = 3.2;
            addPopup(e.x, e.y, `+${pts}`, '#ffd166');
            maybeDropBonus(e.x, e.y, false);
            enemies.splice(i, 1);
            screenShake = Math.max(screenShake, 4);
          } else {
            const pan = ((e.x / W) * 2 - 1) * 0.8;
            synth.sfxHit(pan);
          }
          break;
        }
      }

      if (!enemies[i]) continue;

      if (Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r - 4) {
        enemies.splice(i, 1);
        addBurst(e.x, e.y, ['#ff5964', '#ffd166'], 14, 180);
        damagePlayer();
        continue;
      }

      if (e.y > H + 50) enemies.splice(i, 1);
    }

    if (boss) updateBoss(dt);

    // Вражеские снаряды
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

    // Бонусы
    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bn = bonuses[i];
      bn.phase += dt * 5;
      bn.y += bn.vy * dt;

      if (p.turboTimer > 0) {
        const dx = p.x - bn.x;
        const dy = p.y - bn.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 240 && dist > 1) {
          bn.x += (dx / dist) * 320 * dt;
          bn.y += (dy / dist) * 320 * dt;
        }
      }

      if (Math.hypot(p.x - bn.x, p.y - bn.y) < p.r + bn.r + 4) {
        applyBonus(bn);
        bonuses.splice(i, 1);
        continue;
      }
      if (bn.y > H + 30) bonuses.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vx *= 0.94;
      pt.vy *= 0.94;
      pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }

    for (let i = popups.length - 1; i >= 0; i--) {
      const pp = popups[i];
      pp.y -= 42 * dt;
      pp.life -= dt;
      if (pp.life <= 0) popups.splice(i, 1);
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

    const sweepSpeed = (b.phase === 3 ? 2.1 : (b.phase === 2 ? 1.55 : 1.15)) + selectedLevelIdx * 0.05;
    const span = Math.max(60, W / 2 - b.r - 24);
    b.x = W / 2 + Math.sin(b.time * sweepSpeed) * span;

    b.shootTimer -= dt;
    if (b.shootTimer <= 0) {
      const pan = ((b.x / W) * 2 - 1) * 0.7;
      synth.sfxHit(pan);
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
        b.specialTimer = 5.4;
        if (enemies.length < 3) spawnEnemy();
        maybeDropBonus(b.x, b.y + 45, true);
      } else if (b.phase === 3 && b.laserState === 'idle') {
        b.laserState = 'charge';
        b.laserTimer = 1.1;
        b.laserX = player.x;
        synth.sfxBossAlarm();
      }
    }

    if (b.laserState === 'charge') {
      b.laserTimer -= dt;
      b.laserX += (player.x - b.laserX) * Math.min(1, dt * 3.5);
      if (b.laserTimer <= 0) {
        b.laserState = 'fire';
        b.laserTimer = 0.72;
        synth.sfxExplosion(0, true);
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
        addBurst(bul.x, bul.y, ['#ffd166', lvl.accent, '#ffffff'], 5, 130);

        if (b.hp <= 0) {
          score += Math.round((2000 + lvl.id * 350) * diff.scoreMult);
          kills++;
          synth.sfxExplosion(0, true);
          addBurst(b.x, b.y, ['#ff5964', '#ffd166', '#06d6a0', lvl.accent, '#ffffff'], 42, 320);
          screenShake = 16;
          boss = null;
          enemyBullets = [];
          enemies = [];
          finishGame(true);
          return;
        }
      }
    }
  }

  function applyBonus(bn) {
    synth.sfxPowerup();
    player.squashX = 1.28;
    player.squashY = 1.28;
    addBurst(bn.x, bn.y, ['#ffd166', '#06d6a0', '#48dbfb', '#ffffff'], 14, 170);

    if (bn.type === 'weapon') {
      player.weaponLevel = Math.min(3, player.weaponLevel + 1);
      player.weaponTimer = 14;
      score += 200;
      addPopup(bn.x, bn.y, player.weaponLevel === 3 ? 'СУПЕР-ВЕЕР!' : 'ТРОЙНОЙ ЗАЛП!', '#ffb703');
    } else if (bn.type === 'shield') {
      player.shield = true;
      score += 200;
      addPopup(bn.x, bn.y, 'ПЛАЗМО-ЩИТ!', '#48dbfb');
    } else if (bn.type === 'turbo') {
      player.turboTimer = 11;
      score += 200;
      addPopup(bn.x, bn.y, 'ТУРБО + МАГНИТ!', '#06d6a0');
    } else if (bn.type === 'heart') {
      if (player.hp < player.maxHp) {
        player.hp++;
        addPopup(bn.x, bn.y, '+1 ЖИЗНЬ!', '#ff758f');
      } else {
        score += 500;
        addPopup(bn.x, bn.y, '+500 ОЧКОВ!', '#ffd166');
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
      synth.sfxShieldBlock();
      addBurst(player.x, player.y, ['#48dbfb', '#ffffff'], 18, 220);
      addPopup(player.x, player.y - 20, 'ЩИТ ПОГЛОТИЛ УДАР!', '#48dbfb');
      screenShake = 6;
      return;
    }

    player.hp--;
    player.invuln = 1.5;
    player.squashX = 0.72;
    player.squashY = 1.32;
    combo = 1;
    screenShake = 11;
    synth.sfxHurt();
    addBurst(player.x, player.y, ['#ff5964', '#ffd166', '#ffffff'], 20, 220);

    if (player.hp <= 0) finishGame(false);
  }

  function finishGame(victory) {
    state = victory ? 'VICTORY' : 'GAMEOVER';
    pointer.active = false;
    pauseBtn.classList.add('hidden');
    synth.stopMusic();

    const lvl = LEVELS[selectedLevelIdx];

    if (victory) {
      synth.sfxVictory();
      if (!progress.completed.includes(lvl.id)) {
        progress.completed.push(lvl.id);
      }
    } else {
      synth.sfxGameOver();
    }

    if (score > progress.bestScore) {
      progress.bestScore = score;
    }
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
      : 'Попробуй ещё раз — собирай бонусы и береги щит!';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-best').textContent = progress.bestScore;
    document.getElementById('final-kills').textContent = kills;

    const nextBtn = document.getElementById('next-level-btn');
    if (victory) {
      nextBtn.textContent = lvl.id < 10 ? `СЕКТОР ${lvl.id + 1} ➔` : 'ЗАНОВО С 1-ГО ➔';
    } else {
      nextBtn.textContent = 'ЕЩЁ РАЗ 🔄';
    }

    setTimeout(() => {
      endOverlay.classList.remove('hidden');
    }, victory ? 520 : 340);
  }

  // =========================================================================
  // ОТРИСОВКА ИГРОКА, ВРАГОВ, БОНУСОВ И HUD
  // =========================================================================
  function drawPlayer(p) {
    if (p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    const tilt = Math.max(-0.22, Math.min(0.22, p.vx * 0.0005));
    ctx.rotate(tilt);
    ctx.scale(p.squashX, p.squashY);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

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

    if (p.weaponLevel > 1) {
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

    // Астро-Кот в кабине
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

  function drawEnemy(e) {
    const lvl = LEVELS[selectedLevelIdx];
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const flash = e.hitFlash > 0;

    if (e.kind === 'ufo') {
      ctx.fillStyle = flash ? '#ffffff' : lvl.enemyTint;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 5, 24, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = flash ? '#ffffff' : '#bde0fe';
      ctx.beginPath();
      ctx.arc(0, 1, 13, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -3, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(Math.sin(e.phase) * 2, -3, 2.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.kind === 'meteor') {
      ctx.rotate(e.rot);
      ctx.fillStyle = flash ? '#ffffff' : '#e07a5f';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const pts = 9;
      for (let i = 0; i < pts; i++) {
        const a = (Math.PI * 2 * i) / pts;
        const rad = e.r * (i % 2 === 0 ? 1.04 : 0.86);
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-7, -3, 4.5, 0, Math.PI * 2);
      ctx.arc(7, -3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-7, -3, 2, 0, Math.PI * 2);
      ctx.arc(7, -3, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.kind === 'wasp') {
      ctx.fillStyle = flash ? '#ffffff' : lvl.bossColor;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(-22, -12);
      ctx.lineTo(0, -4);
      ctx.lineTo(22, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fee440';
      ctx.beginPath();
      ctx.arc(0, 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = flash ? '#ffffff' : lvl.accent;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRectPath(ctx, -26, -18, 52, 34, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(-24, 14, 8, 0, Math.PI * 2);
      ctx.arc(24, 14, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-9, -2, 5.5, 0, Math.PI * 2);
      ctx.arc(9, -2, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-9, -1, 2.4, 0, Math.PI * 2);
      ctx.arc(9, -1, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (e.maxHp > 2 && e.hp < e.maxHp) {
      const bw = 34;
      ctx.fillStyle = INK;
      ctx.fillRect(-bw / 2, -e.r - 12, bw, 6);
      ctx.fillStyle = '#06d6a0';
      ctx.fillRect(-bw / 2 + 1, -e.r - 11, (bw - 2) * (e.hp / e.maxHp), 4);
    }

    ctx.restore();
  }

  function drawBonus(bn) {
    ctx.save();
    ctx.translate(bn.x, bn.y);
    const s = 1 + Math.sin(bn.phase) * 0.1;
    ctx.scale(s, s);

    const styles = {
      weapon: { bg: '#ffb703', label: 'W' },
      shield: { bg: '#48dbfb', label: 'S' },
      turbo:  { bg: '#06d6a0', label: '⚡' },
      heart:  { bg: '#ff758f', label: '♥' }
    };
    const st = styles[bn.type];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, bn.r + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = st.bg;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, bn.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.font = '900 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(st.label, 0, 1);

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

    drawLevelBackground(ctx, lvl, W, H, stars, props, globalTime);

    for (const bn of bonuses) drawBonus(bn);

    for (const b of bullets) {
      ctx.fillStyle = b.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.r * 0.75, b.r * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    for (const e of enemies) drawEnemy(e);
    if (boss) drawUniqueBoss(ctx, boss, lvl, player, H);

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

    for (const pt of particles) {
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (const pp of popups) {
      ctx.globalAlpha = Math.min(1, pp.life * 1.5);
      ctx.fillStyle = pp.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(pp.text, pp.x, pp.y);
      ctx.fillText(pp.text, pp.x, pp.y);
    }
    ctx.globalAlpha = 1;

    drawHUD();
    ctx.restore();
  }

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pointer.active = false;
    else lastTime = performance.now();
  });

  requestAnimationFrame(loop);
})();
