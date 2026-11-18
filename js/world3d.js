'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;
    this.bgScrollY = 0;

    // Состояние боя для динамики волн, интерактива и воронки босса
    this.currentWave = 1;
    this.playerX = 240;
    this.playerY = 650;
    this.bossVortex = 0; // 0..1 — сила гравитационного разлома перед выходом босса
    this.pulses = [];    // Пастельные волны на фоне от сбитых элит и препятствий

    // Автоподгрузка чётких бесшовных фонов img/bg1.jpg .. img/bg6.jpg
    this.bgImages = {};
    this._preloadBackgroundImages();

    // 105 мерцающих звёзд
    this.stars = Array.from({ length: 105 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.58 : 0.92);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.2 : (layer === 1 ? 1.9 : 2.6),
        speed: 0.032 + z * 0.14,
        phase: Math.random() * Math.PI * 2,
        blinkSpd: 2.8 + (i % 5) * 1.2,
        hueOffset: (i * 37) % 360
      };
    });

    // 14 пастельных геометрических узоров / мандал (меняют форму каждую волну)
    this.geoShapes = Array.from({ length: 14 }, (_, i) => ({
      x: ((i % 4) + 0.5) / 4 + (Math.random() - 0.5) * 0.12,
      y: (i / 14) + Math.random() * 0.06,
      z: 0.28 + (i % 3) * 0.22,
      kind: i % 4,
      size: 24 + (i % 4) * 10,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.45 + (i % 3) * 0.28),
      speed: 0.030 + (i % 3) * 0.018,
      phase: i * 0.95
    }));

    // 48 элементов уникальной «погоды сектора» (Идея 1)
    this.weatherItems = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.26,
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0.04 + (i % 4) * 0.025,
      r: 4 + (i % 4) * 2.2,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.9 + Math.random() * 1.6),
      phase: Math.random() * Math.PI * 2,
      hue: (i * 47) % 360,
      offsetX: 0,
      offsetY: 0
    }));

    // 3 тематические планеты в мягкой пастельной обработке
    this.planets = [
      { x: 0.24, y: 0.18, z: 0.36, r: 52, speed: 0.022, hueShift: 0 },
      { x: 0.77, y: 0.54, z: 0.50, r: 42, speed: 0.028, hueShift: 110 },
      { x: 0.42, y: 0.88, z: 0.28, r: 46, speed: 0.018, hueShift: 220 }
    ];
  }

  _preloadBackgroundImages() {
    for (let id = 1; id <= 6; id++) {
      const entry = { img: null, ready: false };
      this.bgImages[id] = entry;
      const probe = new Image();
      probe.onload = () => {
        entry.img = probe;
        entry.ready = true;
      };
      probe.onerror = () => {
        const pngProbe = new Image();
        pngProbe.onload = () => {
          entry.img = pngProbe;
          entry.ready = true;
        };
        pngProbe.src = `img/bg${id}.png`;
      };
      probe.src = `img/bg${id}.jpg`;
    }
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    this.playerX = playerX;
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  setBattleState({ wave = 1, playerX = null, playerY = null, bossVortex = 0 } = {}) {
    this.currentWave = Math.max(1, Math.min(4, wave));
    if (typeof playerX === 'number') this.playerX = playerX;
    if (typeof playerY === 'number') this.playerY = playerY;
    this.bossVortex = Math.max(0, Math.min(1, bossVortex));
  }

  // Идея 3: Пастельная волна-реакция на фоне при уничтожении элиты или препятствия
  triggerPulse(x, y, color = '#ffd6ff') {
    if (this.pulses.length > 8) this.pulses.shift();
    this.pulses.push({
      x,
      y,
      color,
      r: 14,
      maxR: 185,
      alpha: 0.45
    });
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const mult = (turboActive ? 1.8 : 1.0) * (1 + this.bossVortex * 1.4);
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);
    this.bgScrollY = (this.bgScrollY + 26 * mult * dt) % 4096;

    for (const s of this.stars) {
      s.y += s.speed * mult * dt;
      s.phase += s.blinkSpd * dt;
      if (s.y > 1.03) {
        s.y = -0.03;
        s.x = Math.random();
      }
    }

    for (const g of this.geoShapes) {
      g.y += g.speed * mult * dt;
      g.rot += g.vrot * (1 + this.currentWave * 0.15) * dt;
      g.phase += dt * 2.6;
      if (g.y > 1.14) {
        g.y = -0.14;
        g.x = 0.08 + Math.random() * 0.84;
      }
    }

    for (const w of this.weatherItems) {
      w.y += w.vy * mult * dt;
      w.x = (w.x + w.vx * dt + 1.0) % 1.0;
      w.rot += w.vrot * dt;
      w.phase += dt * 3.8;
      w.offsetX *= Math.pow(0.08, dt);
      w.offsetY *= Math.pow(0.08, dt);

      if (w.y > 1.08) {
        w.y = -0.08;
        w.x = Math.random();
        w.offsetX = 0;
        w.offsetY = 0;
      }
    }

    for (const p of this.planets) {
      p.y += p.speed * mult * dt;
      if (p.y > 1.26) {
        p.y = -0.26;
        p.x = 0.16 + Math.random() * 0.68;
        p.hueShift = (p.hueShift + 75) % 360;
      }
    }

    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pl = this.pulses[i];
      pl.r += 230 * dt;
      pl.alpha -= 0.75 * dt;
      if (pl.alpha <= 0 || pl.r >= pl.maxR) this.pulses.splice(i, 1);
    }
  }

  getDynamicSkyColors(lvl) {
    // Уровень 3 — нежный ванильно-пастельный!
    const palettesByTheme = {
      lsd: [
        ['#1b0b38', '#361963', '#562982'],
        ['#220e42', '#421d73', '#673096']
      ],
      horror: [
        ['#180929', '#33123d', '#541b4a'],
        ['#1e0c30', '#3d1647', '#612152']
      ],
      rainbow: [
        ['#3c2a5e', '#6d4c8c', '#b5839d'],
        ['#453169', '#7a5699', '#c492a8']
      ],
      underwater: [
        ['#08243d', '#124669', '#1e6b8c'],
        ['#0b2c4a', '#16527a', '#247ba0']
      ],
      organic: [
        ['#082616', '#134a2c', '#216e43'],
        ['#0b301c', '#185936', '#28804f']
      ],
      mushroom: [
        ['#210b3b', '#471869', '#73298c'],
        ['#280e45', '#541e78', '#85349c']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const idx = Math.floor((this.time / 9) % list.length);
    return list[idx];
  }

  // Пастельные синусоиды, меняющие рисунок каждую из 4 волн!
  getPastelWaveColors(theme) {
    if (theme === 'rainbow') {
      // Ванильно-пастельная палитра Уровня 3
      return ['#fff3d6', '#ffc2d1', '#ffcfd2', '#e0c3fc', '#d8f3dc', '#fde4cf'];
    }
    if (theme === 'lsd') {
      return ['#f3c4fb', '#bdb2ff', '#a0c4ff', '#ffc6ff', '#fdffb6'];
    }
    if (theme === 'horror') {
      return ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#bdb2ff'];
    }
    if (theme === 'underwater') {
      return ['#caf0f8', '#ade8f4', '#90e0ef', '#b8f2e6', '#d8e2dc'];
    }
    if (theme === 'organic') {
      return ['#d8f3dc', '#b7e4c7', '#e9edc9', '#fefae0', '#ccd5ae'];
    }
    return ['#ffc6ff', '#e0aaff', '#ffccd5', '#bde0fe', '#ffd6a5'];
  }

  drawThemeSineWaves(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getPastelWaveColors(lvl.theme);
    const count = waveNum === 1 ? 4 : (waveNum === 2 ? 5 : 6);

    ctx.save();
    ctx.lineCap = 'round';

    for (let s = 0; s < count; s++) {
      const yBase = H * (0.11 + (s / count) * 0.82);
      const dir = s % 2 === 0 ? 1 : -1;
      const col = cols[s % cols.length];

      ctx.strokeStyle = col;
      ctx.globalAlpha = lvl.theme === 'rainbow' ? 0.30 : 0.22;
      ctx.lineWidth = waveNum === 4 ? 4.5 : 5.5;

      ctx.beginPath();
      for (let x = -30; x <= W + 30; x += 14) {
        let sy = yBase;
        if (waveNum === 1) {
          // Волна 1: плавные широкие пастельные ленты
          sy += Math.sin(x * 0.011 + this.time * 1.5 * dir + s) * 28;
        } else if (waveNum === 2) {
          // Волна 2: двойная косичка (интерференция двух гармоник)
          sy += Math.sin(x * 0.013 + this.time * 1.9 * dir + s * 1.3) * 24
              + Math.cos(x * 0.024 - this.time * 1.4 * dir) * 12;
        } else if (waveNum === 3) {
          // Волна 3: лепестковая модуляция с узелками
          const env = 0.65 + 0.45 * Math.sin(x * 0.008 + this.time);
          sy += Math.sin(x * 0.018 + this.time * 2.2 * dir + s) * 32 * env;
        } else {
          // Волна 4: пульсирующие пред-боссовые гармонические волны
          sy += Math.sin(x * 0.015 + this.time * 2.8 * dir + s * 0.9) * 26
              + Math.sin(x * 0.032 + this.time * 3.5) * 9;
        }

        // Идея 2: Затягивание волн в воронку при появлении босса
        if (this.bossVortex > 0) {
          const vx = W / 2, vy = H * 0.22;
          sy += (vy - sy) * (this.bossVortex * 0.35);
        }

        if (x === -30) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.stroke();

      // На 3-й и 4-й волне рисуем пастельные жемчужные узелки на гребнях волн
      if (waveNum >= 3) {
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.34;
        for (let nx = 40; nx < W; nx += 95) {
          const ny = yBase + Math.sin(nx * 0.016 + this.time * 2.2 * dir + s) * 26;
          ctx.beginPath();
          ctx.arc(nx, ny, waveNum === 4 ? 4 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // Пастельные геометрические узоры, усложняющиеся от 1-й к 4-й волне
  drawLevelGeometry(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getPastelWaveColors(lvl.theme);
    const symmetry = 4 + waveNum * 2; // 6 -> 8 -> 10 -> 12 лучей с каждой волной

    ctx.save();
    for (const g of this.geoShapes) {
      let gx = ((g.x * W - this.camX * (g.z * 38)) % W + W) % W;
      let gy = g.y * H;

      // Идея 2: Спиральное затягивание узоров к центру появления босса
      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        const dx = gx - cx, dy = gy - cy;
        const ang = Math.atan2(dy, dx) + this.bossVortex * 1.8;
        const dist = Math.hypot(dx, dy) * (1 - this.bossVortex * 0.45);
        gx = cx + Math.cos(ang) * dist;
        gy = cy + Math.sin(ang) * dist;
      }

      const pulse = 1 + Math.sin(g.phase * 2.0) * 0.12;
      const s = g.size * pulse * (0.9 + waveNum * 0.06);
      const col = cols[g.kind % cols.length];

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.22 + 0.08 * Math.abs(Math.sin(g.phase));

      if (waveNum === 1) {
        // Волна 1: лёгкие пастельные кольца и созвездия
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        if (lvl.theme === 'lsd') {
          ctx.font = `bold ${Math.round(s * 0.85)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 1);
        }
      } else if (waveNum === 2) {
        // Волна 2: двойные пересекающиеся многоугольники
        for (let r = 0; r < 2; r++) {
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-s * 0.58, -s * 0.58, s * 1.16, s * 1.16);
        }
      } else if (waveNum === 3) {
        // Волна 3: лепестковые пастельные мандалы
        for (let k = 0; k < symmetry; k++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          ctx.beginPath();
          ctx.ellipse(s * 0.48, 0, s * 0.42, s * 0.16, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Волна 4: многолучевые калейдоскопы со спиралью в центре
        for (let k = 0; k < symmetry; k++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          ctx.beginPath();
          ctx.moveTo(s * 0.2, 0);
          ctx.lineTo(s * 0.95, 0);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 50);
    const py = p.y * H;
    const r = p.r;
    const cols = this.getPastelWaveColors(lvl.theme);
    const mainCol = cols[Math.floor(p.hueShift / 100) % cols.length];
    const ringCol = cols[(Math.floor(p.hueShift / 100) + 1) % cols.length];

    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.48;

    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(18, 8, 38, 0.25)';
    ctx.beginPath();
    ctx.arc(r * 0.16, r * 0.16, r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(-0.28 + Math.sin(this.time * 0.7 + p.hueShift) * 0.08);
    ctx.strokeStyle = ringCol;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.62, r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // Идея 1: Уникальная пастельная погода для каждого из 6 секторов
  drawSectorWeather(ctx, lvl, W, H) {
    const cols = this.getPastelWaveColors(lvl.theme);
    ctx.save();

    for (let i = 0; i < this.weatherItems.length; i++) {
      const w = this.weatherItems[i];
      let px = ((w.x * W - this.camX * (w.z * 48)) % W + W) % W + w.offsetX;
      let py = w.y * H + w.offsetY;

      // Идея 1 (Ур. 5): Интерактивная био-пыльца разлетается от корабля игрока!
      if (lvl.theme === 'organic') {
        const dx = px - this.playerX;
        const dy = py - this.playerY;
        const dist = Math.hypot(dx, dy);
        if (dist < 115 && dist > 1) {
          const push = ((115 - dist) / 115) * 14;
          w.offsetX += (dx / dist) * push;
          w.offsetY += (dy / dist) * push;
          px += (dx / dist) * push;
          py += (dy / dist) * push;
        }
      }

      // Идея 2: Затягивание частиц погоды в воронку босса
      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        px += (cx - px) * (this.bossVortex * 0.42);
        py += (cy - py) * (this.bossVortex * 0.42);
      }

      const col = cols[i % cols.length];
      const blink = 0.32 + 0.28 * Math.sin(w.phase);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(w.rot);
      ctx.globalAlpha = blink;

      if (lvl.theme === 'lsd') {
        // Ур. 1: Плавающие пастельные линзы калейдоскопа
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 1.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      } else if (lvl.theme === 'horror') {
        // Ур. 2: Падающие светящиеся лепестки мексиканских бархатцев (семпасучиль)
        ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ffadad';
        ctx.beginPath();
        ctx.ellipse(0, 0, w.r * 1.25, w.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'rainbow') {
        // Ур. 3: Ванильные облачка сахарной пудры и тёплые кремовые блики
        ctx.fillStyle = i % 2 === 0 ? '#fff3d6' : '#ffc2d1';
        ctx.beginPath();
        ctx.arc(-w.r * 0.5, 0, w.r * 0.85, 0, Math.PI * 2);
        ctx.arc(w.r * 0.5, 0, w.r * 0.85, 0, Math.PI * 2);
        ctx.arc(0, -w.r * 0.4, w.r * 0.95, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'underwater') {
        // Ур. 4: Жемчужные пузырьки с бликом
        ctx.strokeStyle = '#caf0f8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-w.r * 0.32, -w.r * 0.32, w.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'organic') {
        // Ур. 5: Светящаяся био-пыльца
        ctx.fillStyle = i % 2 === 0 ? '#d8f3dc' : '#fefae0';
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 0.75, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Ур. 6: Мерцающие кольца спор и нити грибницы
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 1.15, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Дополнительный слой Ур. 4: солнечные блики каустики на воде
    if (lvl.theme === 'underwater') {
      ctx.strokeStyle = 'rgba(202, 240, 248, 0.14)';
      ctx.lineWidth = 14;
      for (let c = 0; c < 3; c++) {
        const cx = W * (0.2 + c * 0.3) + Math.sin(this.time * 1.2 + c) * 35;
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.quadraticCurveTo(cx + 30, H * 0.45, cx - 20, H);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Идея 2: Гравитационный разлом / портал перед выходом босса
  drawBossPreSpawnVortex(ctx, lvl, W, H) {
    if (this.bossVortex <= 0) return;
    const cx = W / 2;
    const cy = H * 0.22;
    const v = this.bossVortex;
    const cols = this.getPastelWaveColors(lvl.theme);

    ctx.save();
    // Мягкое затемнение краёв экрана для акцента на портале босса
    const vig = ctx.createRadialGradient(cx, cy, 20, cx, cy, H * 0.75);
    vig.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vig.addColorStop(1, `rgba(8, 2, 20, ${0.48 * v})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Вращающиеся пастельно-неоновые кольца разлома в точке появления босса
    ctx.translate(cx, cy);
    for (let ring = 0; ring < 4; ring++) {
      ctx.save();
      ctx.rotate(this.time * (3.5 + ring) * (ring % 2 === 0 ? 1 : -1));
      ctx.strokeStyle = cols[ring % cols.length];
      ctx.globalAlpha = 0.55 * v;
      ctx.lineWidth = 3.5 - ring * 0.5;
      ctx.setLineDash([18, 12]);
      const rad = (24 + ring * 22) * (0.4 + v * 0.75);
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Светящееся ядро портала
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 56 * v);
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * v})`);
    coreGrad.addColorStop(0.5, `rgba(255, 198, 255, ${0.45 * v})`);
    coreGrad.addColorStop(1, 'rgba(255, 198, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 56 * v, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    // 1. Чёткий фон на 100% разрешения (бесшовная прокрутка img/bg1..6.jpg или пастельное небо)
    const bgEntry = this.bgImages[lvl.id];
    if (bgEntry && bgEntry.ready && bgEntry.img) {
      const img = bgEntry.img;
      const drawW = W * 1.08;
      const drawH = Math.max(H, (img.naturalHeight / Math.max(1, img.naturalWidth)) * drawW);
      const offsetX = -W * 0.04 - this.camX * 10;
      const yOffset = this.bgScrollY % drawH;

      ctx.drawImage(img, offsetX, yOffset - drawH, drawW, drawH);
      ctx.drawImage(img, offsetX, yOffset, drawW, drawH);

      // Лёгкая атмосферная вуаль без потери чёткости деталей картинки
      ctx.fillStyle = lvl.theme === 'rainbow'
        ? 'rgba(42, 22, 64, 0.20)'
        : 'rgba(10, 4, 24, 0.24)';
      ctx.fillRect(0, 0, W, H);
    } else {
      const [topC, midC, botC] = this.getDynamicSkyColors(lvl);
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, topC);
      grad.addColorStop(0.5, midC);
      grad.addColorStop(1, botC);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Пастельные синусоиды (меняются каждую из 4 волн)
    this.drawThemeSineWaves(ctx, lvl, W, H);

    // 3. Звёзды
    for (const s of this.stars) {
      let sx = ((s.x * W - this.camX * (s.z * 44)) % W + W) % W;
      let sy = s.y * H;

      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        sx += (cx - sx) * (this.bossVortex * 0.32);
        sy += (cy - sy) * (this.bossVortex * 0.32);
      }

      const blink = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
      ctx.globalAlpha = blink * 0.65;
      ctx.fillStyle = '#fff8eb';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4. Пастельные геометрические узоры (усложняются с 1-й по 4-ю волну)
    this.drawLevelGeometry(ctx, lvl, W, H);

    // 5. Планеты (если не загружена пользовательская картинка фона, чтобы не перекрывать арт)
    if (!(bgEntry && bgEntry.ready)) {
      for (const p of this.planets) {
        this.drawPlanet3D(ctx, p, lvl, W, H);
      }
    }

    // 6. Идея 3: Пастельные импульсы на фоне от побед над врагами и препятствиями
    for (const pl of this.pulses) {
      ctx.save();
      ctx.strokeStyle = pl.color;
      ctx.globalAlpha = Math.max(0, pl.alpha);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Идея 1: Уникальная погода каждого из 6 секторов
    this.drawSectorWeather(ctx, lvl, W, H);

    // 8. Идея 2: Вихрь-портал перед выходом босса
    this.drawBossPreSpawnVortex(ctx, lvl, W, H);
  }
}
