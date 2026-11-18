'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;
    this.bgScrollY = 0;

    // Состояние боя для динамики 4 волн, интерактива и воронки босса
    this.currentWave = 1;
    this.playerX = 240;
    this.playerY = 650;
    this.bossVortex = 0;
    this.pulses = [];

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
        r: layer === 0 ? 1.3 : (layer === 1 ? 2.0 : 2.8),
        speed: 0.035 + z * 0.14,
        phase: Math.random() * Math.PI * 2,
        blinkSpd: 2.8 + (i % 5) * 1.2
      };
    });

    // 16 крупных пастельных узоров / мандал (меняют рисунок каждую волну)
    this.geoShapes = Array.from({ length: 16 }, (_, i) => ({
      x: ((i % 4) + 0.5) / 4 + (Math.random() - 0.5) * 0.12,
      y: (i / 16) + Math.random() * 0.05,
      z: 0.28 + (i % 3) * 0.22,
      kind: i % 4,
      size: 28 + (i % 4) * 11,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.55 + (i % 3) * 0.32),
      speed: 0.034 + (i % 3) * 0.02,
      phase: i * 0.95
    }));

    // 48 элементов уникальной «погоды сектора»
    this.weatherItems = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.26,
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0.045 + (i % 4) * 0.026,
      r: 4.5 + (i % 4) * 2.2,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.9 + Math.random() * 1.6),
      phase: Math.random() * Math.PI * 2,
      offsetX: 0,
      offsetY: 0
    }));

    // 3 тематические планеты в пастельной палитре (если не загружена картинка фона)
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

  getWaveSpeedMultiplier() {
    // Нарастающая скорость потока с каждой волной: 1.0 -> 1.28 -> 1.56 -> 1.85
    return 1 + (this.currentWave - 1) * 0.28;
  }

  triggerPulse(x, y, color = '#ffd6ff') {
    if (this.pulses.length > 8) this.pulses.shift();
    this.pulses.push({
      x,
      y,
      color,
      r: 14,
      maxR: 195,
      alpha: 0.52
    });
  }

  update(dt, turboActive = false) {
    const waveMult = this.getWaveSpeedMultiplier();
    const mult = waveMult * (turboActive ? 1.65 : 1.0) * (1 + this.bossVortex * 1.3);

    this.time += dt * (0.85 + this.currentWave * 0.15);
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);
    this.bgScrollY = (this.bgScrollY + 32 * mult * dt) % 4096;

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
      g.rot += g.vrot * waveMult * dt;
      g.phase += dt * 2.8;
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
      pl.r += 240 * dt;
      pl.alpha -= 0.72 * dt;
      if (pl.alpha <= 0 || pl.r >= pl.maxR) this.pulses.splice(i, 1);
    }
  }

  getDynamicSkyColors(lvl) {
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
        ['#4a3563', '#7d5a8a', '#d4a5b8'],
        ['#543d70', '#8c6699', '#deb0c2']
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

  getPastelWaveColors(theme) {
    if (theme === 'rainbow') {
      return ['#fff3d6', '#ffc2d1', '#ffcfd2', '#e0c3fc', '#d8f3dc', '#fde4cf'];
    }
    if (theme === 'lsd') {
      return ['#f3c4fb', '#bdb2ff', '#a0c4ff', '#ffc6ff', '#fdffb6'];
    }
    if (theme === 'horror') {
      return ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#bdb2ff'];
    }
    if (theme === 'underwater') {
      return ['#caf0f8', '#ade8f4', '#90e0ef', '#b8f2e6', '#ffd6ff'];
    }
    if (theme === 'organic') {
      return ['#d8f3dc', '#b7e4c7', '#e9edc9', '#fefae0', '#ffc2d1'];
    }
    return ['#ffc6ff', '#e0aaff', '#ffccd5', '#bde0fe', '#ffd6a5'];
  }

  // Чётко различимые пастельные синусоиды с тёмной подложкой, меняющие форму каждую из 4 волн
  drawThemeSineWaves(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getPastelWaveColors(lvl.theme);
    const count = waveNum === 1 ? 4 : (waveNum === 2 ? 5 : 6);

    ctx.save();
    ctx.lineCap = 'round';

    for (let s = 0; s < count; s++) {
      const yBase = H * (0.10 + (s / count) * 0.84);
      const dir = s % 2 === 0 ? 1 : -1;
      const col = cols[s % cols.length];

      // Строим кривую волны
      const pts = [];
      for (let x = -30; x <= W + 30; x += 14) {
        let sy = yBase;
        if (waveNum === 1) {
          // Волна 1: широкие плавные пастельные дуги
          sy += Math.sin(x * 0.011 + this.time * 1.6 * dir + s) * 32;
        } else if (waveNum === 2) {
          // Волна 2: двойная волна-косичка
          sy += Math.sin(x * 0.014 + this.time * 2.1 * dir + s * 1.3) * 26
              + Math.cos(x * 0.028 - this.time * 1.6 * dir) * 14;
        } else if (waveNum === 3) {
          // Волна 3: лепестковая пульсация
          const env = 0.55 + 0.55 * Math.sin(x * 0.009 + this.time * 1.3);
          sy += Math.sin(x * 0.019 + this.time * 2.4 * dir + s) * 36 * env;
        } else {
          // Волна 4: высокочастотная пред-боссовая гармоника
          sy += Math.sin(x * 0.016 + this.time * 3.0 * dir + s * 0.9) * 28
              + Math.sin(x * 0.038 + this.time * 4.0) * 11;
        }

        if (this.bossVortex > 0) {
          const vy = H * 0.22;
          sy += (vy - sy) * (this.bossVortex * 0.38);
        }
        pts.push([x, sy]);
      }

      // 1) Мягкая тёмная подложка под волной, чтобы её было хорошо видно на любом фоне
      ctx.strokeStyle = 'rgba(10, 4, 24, 0.52)';
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      pts.forEach(([x, sy], idx) => (idx === 0 ? ctx.moveTo(x, sy) : ctx.lineTo(x, sy)));
      ctx.stroke();

      // 2) Яркая пастельная линия поверх подложки
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.56;
      ctx.lineWidth = waveNum === 4 ? 3.2 : 4.0;
      ctx.beginPath();
      pts.forEach(([x, sy], idx) => (idx === 0 ? ctx.moveTo(x, sy) : ctx.lineTo(x, sy)));
      ctx.stroke();

      // На волнах 2–4 добавляем жемчужные бусины на гребнях
      if (waveNum >= 2) {
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.65;
        const step = waveNum === 2 ? 120 : 85;
        for (let nx = 35; nx < W; nx += step) {
          const ny = yBase + Math.sin(nx * 0.015 + this.time * 2.2 * dir + s) * 28;
          ctx.beginPath();
          ctx.arc(nx, ny, waveNum === 4 ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // Явная смена геометрических узоров от 1-й к 4-й волне
  drawLevelGeometry(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getPastelWaveColors(lvl.theme);
    const symmetry = 4 + waveNum * 2; // 6 -> 8 -> 10 -> 12 лучей

    ctx.save();
    for (const g of this.geoShapes) {
      let gx = ((g.x * W - this.camX * (g.z * 38)) % W + W) % W;
      let gy = g.y * H;

      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        const dx = gx - cx, dy = gy - cy;
        const ang = Math.atan2(dy, dx) + this.bossVortex * 1.8;
        const dist = Math.hypot(dx, dy) * (1 - this.bossVortex * 0.45);
        gx = cx + Math.cos(ang) * dist;
        gy = cy + Math.sin(ang) * dist;
      }

      const pulse = 1 + Math.sin(g.phase * 2.2) * 0.14;
      const s = g.size * pulse * (0.95 + waveNum * 0.08);
      const col = cols[g.kind % cols.length];

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      // Тёмный ореол под узором для читаемости на фоновой картинке
      ctx.fillStyle = 'rgba(10, 4, 24, 0.34)';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.92, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.50 + 0.15 * Math.abs(Math.sin(g.phase));

      if (waveNum === 1) {
        // ВОЛНА 1: Двойные концентрические кольца и сакральные знаки
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.92, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.54, 0, Math.PI * 2);
        ctx.stroke();
        if (lvl.theme === 'lsd') {
          ctx.font = `bold ${Math.round(s * 0.85)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 1);
        }
      } else if (waveNum === 2) {
        // ВОЛНА 2: Вращающиеся восьмиконечные звёзды и ромбы
        for (let r = 0; r < 2; r++) {
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-s * 0.64, -s * 0.64, s * 1.28, s * 1.28);
        }
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (waveNum === 3) {
        // ВОЛНА 3: Раскрытые лепестковые лотосы-мандалы
        for (let k = 0; k < symmetry; k++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          ctx.beginPath();
          ctx.ellipse(s * 0.52, 0, s * 0.45, s * 0.18, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // ВОЛНА 4: Многолучевые калейдоскопы со спиралью в центре
        for (let k = 0; k < symmetry; k++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          ctx.beginPath();
          ctx.moveTo(s * 0.18, 0);
          ctx.lineTo(s * 0.98, 0);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
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

  drawSectorWeather(ctx, lvl, W, H) {
    const cols = this.getPastelWaveColors(lvl.theme);
    ctx.save();

    for (let i = 0; i < this.weatherItems.length; i++) {
      const w = this.weatherItems[i];
      let px = ((w.x * W - this.camX * (w.z * 48)) % W + W) % W + w.offsetX;
      let py = w.y * H + w.offsetY;

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

      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        px += (cx - px) * (this.bossVortex * 0.42);
        py += (cy - py) * (this.bossVortex * 0.42);
      }

      const col = cols[i % cols.length];
      const blink = 0.40 + 0.32 * Math.sin(w.phase);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(w.rot);
      ctx.globalAlpha = blink;

      if (lvl.theme === 'lsd') {
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 1.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      } else if (lvl.theme === 'horror') {
        ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ffadad';
        ctx.beginPath();
        ctx.ellipse(0, 0, w.r * 1.25, w.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'rainbow') {
        ctx.fillStyle = i % 2 === 0 ? '#fff3d6' : '#ffc2d1';
        ctx.beginPath();
        ctx.arc(-w.r * 0.5, 0, w.r * 0.85, 0, Math.PI * 2);
        ctx.arc(w.r * 0.5, 0, w.r * 0.85, 0, Math.PI * 2);
        ctx.arc(0, -w.r * 0.4, w.r * 0.95, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'underwater') {
        ctx.strokeStyle = '#caf0f8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-w.r * 0.32, -w.r * 0.32, w.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'organic') {
        ctx.fillStyle = i % 2 === 0 ? '#d8f3dc' : '#fefae0';
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, w.r * 1.15, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (lvl.theme === 'underwater') {
      ctx.strokeStyle = 'rgba(202, 240, 248, 0.16)';
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

  drawBossPreSpawnVortex(ctx, lvl, W, H) {
    if (this.bossVortex <= 0) return;
    const cx = W / 2;
    const cy = H * 0.22;
    const v = this.bossVortex;
    const cols = this.getPastelWaveColors(lvl.theme);

    ctx.save();
    const vig = ctx.createRadialGradient(cx, cy, 20, cx, cy, H * 0.75);
    vig.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vig.addColorStop(1, `rgba(8, 2, 20, ${0.48 * v})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    ctx.translate(cx, cy);
    for (let ring = 0; ring < 4; ring++) {
      ctx.save();
      ctx.rotate(this.time * (3.5 + ring) * (ring % 2 === 0 ? 1 : -1));
      ctx.strokeStyle = cols[ring % cols.length];
      ctx.globalAlpha = 0.65 * v;
      ctx.lineWidth = 3.8 - ring * 0.5;
      ctx.setLineDash([18, 12]);
      const rad = (24 + ring * 22) * (0.4 + v * 0.75);
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 56 * v);
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.88 * v})`);
    coreGrad.addColorStop(0.5, `rgba(255, 198, 255, ${0.48 * v})`);
    coreGrad.addColorStop(1, 'rgba(255, 198, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 56 * v, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    // 1. Чёткий фон на 100% разрешения
    const bgEntry = this.bgImages[lvl.id];
    if (bgEntry && bgEntry.ready && bgEntry.img) {
      const img = bgEntry.img;
      const drawW = W * 1.08;
      const drawH = Math.max(H, (img.naturalHeight / Math.max(1, img.naturalWidth)) * drawW);
      const offsetX = -W * 0.04 - this.camX * 10;
      const yOffset = this.bgScrollY % drawH;

      ctx.drawImage(img, offsetX, yOffset - drawH, drawW, drawH);
      ctx.drawImage(img, offsetX, yOffset, drawW, drawH);

      ctx.fillStyle = lvl.theme === 'rainbow'
        ? 'rgba(42, 22, 64, 0.24)'
        : 'rgba(10, 4, 24, 0.28)';
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

    // 2. Пастельные синусоиды с тёмной подложкой (чётко видны и меняются каждую волну)
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
      ctx.globalAlpha = blink * 0.70;
      ctx.fillStyle = '#fff8eb';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4. Пастельные геометрические узоры (меняют форму с 1-й по 4-ю волну)
    this.drawLevelGeometry(ctx, lvl, W, H);

    // 5. Планеты (если нет фонового изображения)
    if (!(bgEntry && bgEntry.ready)) {
      for (const p of this.planets) {
        this.drawPlanet3D(ctx, p, lvl, W, H);
      }
    }

    // 6. Пастельные волны-реакции от побед над врагами и препятствиями
    for (const pl of this.pulses) {
      ctx.save();
      ctx.strokeStyle = pl.color;
      ctx.globalAlpha = Math.max(0, pl.alpha);
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Уникальная погода каждого из 6 секторов
    this.drawSectorWeather(ctx, lvl, W, H);

    // 8. Гравитационный разлом перед выходом босса
    this.drawBossPreSpawnVortex(ctx, lvl, W, H);
  }
}
