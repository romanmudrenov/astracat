javascript
'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    this.stars = Array.from({ length: 80 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.55 : 0.90);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.2 : (layer === 1 ? 1.9 : 2.6),
        speed: 0.03 + z * 0.14
      };
    });

    // Увеличенный пул геометрических фигур (16 штук) для насыщенных уровней 4 и 5
    this.geoShapes = Array.from({ length: 16 }, (_, i) => ({
      x: (i + 0.5) / 16 + (Math.random() - 0.5) * 0.06,
      y: Math.random(),
      z: 0.25 + (i % 4) * 0.18,
      kind: i % 5,
      size: 20 + (i % 4) * 10,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.4 + (i % 3) * 0.28),
      speed: 0.025 + (i % 3) * 0.02,
      phase: i * 0.95
    }));

    // Увеличенный пул тематических частиц (42 штуки) для живой атмосферы
    this.themeParticles = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.30 + (i % 4) * 0.20,
      kindIdx: i % 4,
      r: 5 + (i % 4) * 2.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.6,
      speed: 0.04 + (i % 4) * 0.032,
      drift: (Math.random() - 0.5) * 0.07,
      hue: (i * 48) % 360,
      phase: Math.random() * Math.PI * 2
    }));

    this.planets = [
      { x: 0.22, y: 0.18, z: 0.35, r: 54, kind: 'ringed', speed: 0.022, hueShift: 0 },
      { x: 0.76, y: 0.54, z: 0.50, r: 44, kind: 'crater', speed: 0.030, hueShift: 90 },
      { x: 0.46, y: 0.86, z: 0.28, r: 48, kind: 'twin_moon', speed: 0.018, hueShift: 180 }
    ];
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const mult = turboActive ? 1.75 : 1.0;
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);

    for (const s of this.stars) {
      s.y += s.speed * mult * dt;
      if (s.y > 1.02) { s.y = -0.02; s.x = Math.random(); }
    }

    for (const g of this.geoShapes) {
      g.y += g.speed * mult * dt;
      g.rot += g.vrot * dt;
      g.phase += dt * 2.4;
      if (g.y > 1.12) {
        g.y = -0.12;
        g.x = 0.06 + Math.random() * 0.88;
      }
    }

    for (const tp of this.themeParticles) {
      tp.y += tp.speed * mult * dt;
      tp.x = (tp.x + tp.drift * dt + 1.0) % 1.0;
      tp.rot += tp.vrot * dt;
      tp.phase += dt * 4.2;
      if (tp.y > 1.08) {
        tp.y = -0.08;
        tp.x = Math.random();
      }
    }

    const planetTypes = ['ringed', 'crater', 'glow_orb', 'twin_moon'];
    for (const p of this.planets) {
      p.y += p.speed * mult * dt;
      if (p.y > 1.25) {
        p.y = -0.25;
        p.x = 0.15 + Math.random() * 0.70;
        p.kind = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        p.hueShift = (p.hueShift + 65) % 360;
      }
    }
  }

  getDynamicSkyColors(lvl) {
    const palettesByTheme = {
      lsd: [
        ['#190538', '#420c75', '#7a1285'],
        ['#10154a', '#35167a', '#8c1478'],
        ['#260645', '#5e0e7a', '#a31c8c']
      ],
      horror: [
        ['#0c021c', '#290636', '#4d0a3b'],
        ['#071029', '#1b114d', '#4a0838'],
        ['#140426', '#380945', '#610c3e']
      ],
      rainbow: [
        ['#22185c', '#3c2a8c', '#6941b5'],
        ['#2e1a66', '#56329e', '#8f4ec4']
      ],
      underwater: [
        ['#052642', '#0e567d', '#198ca6'],
        ['#073252', '#136c94', '#22a6bd']
      ],
      organic: [
        ['#042610', '#0d5425', '#19823a'],
        ['#073316', '#146b31', '#259c48']
      ],
      mushroom: [
        ['#1a0436', '#4a0866', '#8a1278'],
        ['#0c1844', '#3c096c', '#9d0258']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const idx = Math.floor((this.time / 12) % list.length);
    return list[idx];
  }

  // Отрисовка уникальных волн и синусоид для 1, 2, 4 и 5 уровней
  drawThemeWavesAndSines(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    if (lvl.theme === 'lsd') {
      // УРОВЕНЬ 1: Больше синусоид и разноцветных психо-волн (без классической радуги!)
      const lsdPalette = ['#ff007f', '#00f5d4', '#b5179e', '#ccff00', '#3a86ff', '#ff5400'];
      const sineConfigs = [
        { yFrac: 0.14, amp: 48, freq: 0.014, speed: 2.6, width: 6.5 },
        { yFrac: 0.28, amp: 34, freq: 0.022, speed: -2.1, width: 4.5 },
        { yFrac: 0.45, amp: 56, freq: 0.011, speed: 1.9, width: 7.5 },
        { yFrac: 0.62, amp: 38, freq: 0.025, speed: -2.8, width: 4.5 },
        { yFrac: 0.78, amp: 52, freq: 0.013, speed: 2.2, width: 6.5 },
        { yFrac: 0.90, amp: 30, freq: 0.019, speed: -1.7, width: 5.0 }
      ];
      sineConfigs.forEach((cfg, idx) => {
        const colIdx = (idx + Math.floor(this.time * 0.6)) % lsdPalette.length;
        ctx.strokeStyle = lsdPalette[colIdx];
        ctx.globalAlpha = 0.36;
        ctx.lineWidth = cfg.width;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const sy = H * cfg.yFrac
            + Math.sin(x * cfg.freq + this.time * cfg.speed + idx * 1.4) * cfg.amp
            + Math.cos(x * cfg.freq * 1.8 - this.time * 1.5) * (cfg.amp * 0.28);
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

    } else if (lvl.theme === 'horror') {
      // УРОВЕНЬ 2: Неоновые волны в мексиканском стиле (фуксия, бирюза, золото мариголд, неон-лайм)
      const fiestaCols = ['#ff006e', '#00f5d4', '#ffbe0b', '#8338ec'];
      fiestaCols.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.34;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 14) {
          const sy = H * (0.20 + idx * 0.21) + Math.sin(x * 0.015 + this.time * (2.0 + idx * 0.3) + idx) * 42;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

    } else if (lvl.theme === 'underwater') {
      // УРОВЕНЬ 4: Океанические синусоиды и биолюминесцентные волны
      const aquaCols = ['#00f5d4', '#48cae4', '#90e0ef', '#f72585', '#72efdd'];
      aquaCols.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.34;
        ctx.lineWidth = idx % 2 === 0 ? 6 : 4;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const sy = H * (0.16 + idx * 0.17)
            + Math.sin(x * (0.013 + idx * 0.002) + this.time * (1.8 + idx * 0.25)) * 44;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

    } else if (lvl.theme === 'organic') {
      // УРОВЕНЬ 5: Растительные волны и синусоиды лиан (изумруд, лайм, золотая пыльца, мята)
      const floraCols = ['#80ed99', '#ccff33', '#38b000', '#ffd166', '#52b788'];
      floraCols.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.34;
        ctx.lineWidth = idx % 2 === 0 ? 6 : 4;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const sy = H * (0.16 + idx * 0.17)
            + Math.sin(x * (0.014 + idx * 0.002) + this.time * (1.9 + idx * 0.2)) * 42
            + Math.sin(x * 0.03 - this.time * 2.2) * 10;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

    } else if (lvl.theme === 'mushroom') {
      const waveConfigs = [
        { yFrac: 0.20, amp: 48, freq: 0.012, speed: 2.2, width: 6.5 },
        { yFrac: 0.52, amp: 38, freq: 0.017, speed: -1.8, width: 5.0 },
        { yFrac: 0.80, amp: 54, freq: 0.010, speed: 1.6, width: 7.0 }
      ];
      waveConfigs.forEach((cfg, s) => {
        ctx.strokeStyle = `hsl(${(this.time * 60 + s * 115) % 360}, 95%, 65%)`;
        ctx.globalAlpha = 0.32;
        ctx.lineWidth = cfg.width;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 14) {
          const sy = H * cfg.yFrac + Math.sin(x * cfg.freq + this.time * cfg.speed + s * 1.7) * cfg.amp;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
    } else if (lvl.theme === 'rainbow') {
      ctx.globalAlpha = 0.24;
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'];
      rainbowBands.forEach((col, bIdx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 11;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 16) {
          const sy = H * 0.35 + bIdx * 11 + Math.sin(x * 0.011 + this.time * 1.8) * 50;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  drawLevelGeometry(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Для уровней 4 и 5 показываем все 16 геометрических фигур, для остальных — 9
    const activeCount = (lvl.theme === 'underwater' || lvl.theme === 'organic') ? this.geoShapes.length : 9;

    for (let idx = 0; idx < activeCount; idx++) {
      const g = this.geoShapes[idx];
      const gx = ((g.x * W - this.camX * (g.z * 38)) % W + W) % W;
      const gy = g.y * H;
      const s = g.size;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      if (lvl.theme === 'lsd' || lvl.theme === 'mushroom') {
        const lsdCols = ['#ff007f', '#00f5d4', '#ccff00', '#9d4edd'];
        ctx.strokeStyle = lsdCols[g.kind % lsdCols.length];
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.28;

        for (let dir of [1, -1]) {
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const a = (Math.PI * 2 * k) / 3 - (Math.PI / 2) * dir;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        // Мексиканские неоновые ромбы и звёзды Калаверы
        const colors = ['#ff006e', '#ffbe0b', '#00f5d4', '#8338ec'];
        ctx.strokeStyle = colors[g.kind % colors.length];
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.28;
        ctx.strokeRect(-s * 0.65, -s * 0.65, s * 1.3, s * 1.3);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-s * 0.65, -s * 0.65, s * 1.3, s * 1.3);
      } else if (lvl.theme === 'underwater') {
        // УРОВЕНЬ 4: Богатая водная геометрия (октагоны, звёзды, двойные кольца, ромбы)
        const aquaPalette = ['#00f5d4', '#48cae4', '#f72585', '#90e0ef', '#ffd166'];
        ctx.strokeStyle = aquaPalette[g.kind % aquaPalette.length];
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.34;

        if (g.kind === 0) {
          // Октагон
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const a = (Math.PI * k) / 4;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (g.kind === 1) {
          // Сакральная звезда
          ctx.beginPath();
          for (let k = 0; k < 10; k++) {
            const a = (Math.PI * k) / 5;
            const r = k % 2 === 0 ? s : s * 0.45;
            if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (g.kind === 2) {
          // Концентрические сонар-кольца
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2); ctx.stroke();
        } else {
          // Треугольник + вписанный круг
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const a = (Math.PI * 2 * k) / 3 - Math.PI / 2;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (lvl.theme === 'organic') {
        // УРОВЕНЬ 5: Растительная геометрия (гексагоны-соты, лепестки, био-кристаллы, спирали)
        const plantPalette = ['#80ed99', '#ccff33', '#38b000', '#ffd166', '#00f5d4'];
        ctx.strokeStyle = plantPalette[g.kind % plantPalette.length];
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.34;

        if (g.kind === 0) {
          // Гексагон (растительная клетка)
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI * k) / 3;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (g.kind === 1) {
          // Геометрический цветок (6 лепестков)
          for (let k = 0; k < 6; k++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(s * 0.45, 0, s * 0.45, s * 0.2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (g.kind === 2) {
          // Ромб-лист с прожилкой
          ctx.beginPath();
          ctx.moveTo(0, -s); ctx.lineTo(s * 0.65, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.65, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
        } else {
          // Двойной поворотный квадрат-бутон
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
        }
      } else {
        const hue = (this.time * 70 + g.phase * 50) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 72%)`;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.26;
        ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // Неоновый мексиканский череп-планета (Калавера) для 2-го уровня
  drawMexicanSkullPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);

    const neonRings = ['#ff006e', '#00f5d4', '#ffbe0b'];
    const ringCol = neonRings[Math.floor((hueShift / 60) % neonRings.length)];

    // Неоновое свечение вокруг черепа-планеты
    ctx.fillStyle = ringCol;
    ctx.globalAlpha = 0.22;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.38, 0, Math.PI * 2); ctx.fill();

    // Планетарное неоновое кольцо с узорами вокруг черепа
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = ringCol;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.08, r * 1.55, r * 0.34, -0.22, 0, Math.PI * 2);
    ctx.stroke();

    // Силуэт черепа Калаверы
    ctx.fillStyle = '#1b0933';
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -r * 0.12, r * 0.88, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(r * 0.48, r * 0.78);
    ctx.lineTo(-r * 0.48, r * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Неоновый цветок Мариголд на лбу черепа
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.arc(0, -r * 0.56, r * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff006e';
    ctx.beginPath(); ctx.arc(0, -r * 0.56, r * 0.08, 0, Math.PI * 2); ctx.fill();

    // Глазницы-цветы в мексиканском стиле
    [-r * 0.32, r * 0.32].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff006e' : '#ffbe0b';
      ctx.beginPath(); ctx.arc(ex, -r * 0.08, r * 0.24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#090214';
      ctx.beginPath(); ctx.arc(ex, -r * 0.08, r * 0.14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#00f5d4';
      ctx.beginPath(); ctx.arc(ex, -r * 0.08, r * 0.06, 0, Math.PI * 2); ctx.fill();
    });

    // Перевёрнутое сердечко-нос
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.12);
    ctx.lineTo(r * 0.11, r * 0.28);
    ctx.lineTo(-r * 0.11, r * 0.28);
    ctx.closePath();
    ctx.fill();

    // Неоновые зубы
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(-r * 0.32, r * 0.44, r * 0.64, r * 0.22);
    [-r * 0.16, 0, r * 0.16].forEach(tx => {
      ctx.beginPath(); ctx.moveTo(tx, r * 0.44); ctx.lineTo(tx, r * 0.66); ctx.stroke();
    });

    ctx.restore();
  }

  drawMushroomPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 55 + hueShift) % 360;
    const capCol = `hsl(${hue}, 95%, 56%)`;
    const glowCol = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

    ctx.fillStyle = glowCol;
    ctx.globalAlpha = 0.24;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.90;

    ctx.fillStyle = '#f8edeb';
    ctx.strokeStyle = '#14052b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.26, 0);
    ctx.quadraticCurveTo(-r * 0.34, r * 0.65, -r * 0.20, r * 0.95);
    ctx.lineTo(r * 0.20, r * 0.95);
    ctx.quadraticCurveTo(r * 0.34, r * 0.65, r * 0.26, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = capCol;
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.95, r * 0.22, 0, r * 0.16);
    ctx.quadraticCurveTo(-r * 0.95, r * 0.22, -r * 0.95, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    [[-r * 0.42, -r * 0.35, r * 0.16], [r * 0.35, -r * 0.42, r * 0.14], [0, -r * 0.62, r * 0.18]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 55);
    const py = p.y * H;
    const r = p.r;

    if (lvl.theme === 'mushroom') {
      this.drawMushroomPlanet(ctx, px, py, r, p.hueShift);
      return;
    }

    if (lvl.theme === 'horror') {
      this.drawMexicanSkullPlanet(ctx, px, py, r, p.hueShift);
      return;
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = lvl.accent; ctx.globalAlpha = 0.20;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.32, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.88;
    let pal = ['#7209b7', '#f72585', '#4cc9f0'];
    if (lvl.theme === 'lsd') {
      const sets = [
        ['#3a0ca3', '#ff007f', '#00f5d4'],
        ['#480ca8', '#ccff00', '#f72585']
      ];
      pal = sets[Math.floor((p.hueShift / 90) % sets.length)];
    } else if (lvl.theme === 'rainbow') {
      const h1 = (this.time * 40 + p.hueShift) % 360;
      pal = [`hsl(${h1}, 80%, 38%)`, `hsl(${(h1 + 45) % 360}, 90%, 60%)`, `hsl(${(h1 + 95) % 360}, 95%, 76%)`];
    } else if (lvl.theme === 'underwater') {
      pal = ['#023e8a', '#00b4d8', '#90e0ef'];
    } else if (lvl.theme === 'organic') {
      pal = ['#083d18', '#2d6a4f', '#80ed99'];
    }

    ctx.fillStyle = pal[0]; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.arc(-r * 0.14, -r * 0.14, r * 0.84, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[2]; ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.28, r * 0.52, 0, Math.PI * 2); ctx.fill();

    if (p.kind === 'ringed') {
      ctx.strokeStyle = pal[2];
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 2, r * 1.55, r * 0.32, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    // На 4-м и 5-м уровнях генерируем максимум частиц (42), на остальных — 26
    const pCount = (lvl.theme === 'underwater' || lvl.theme === 'organic') ? this.themeParticles.length : 26;

    for (let idx = 0; idx < pCount; idx++) {
      const tp = this.themeParticles[idx];
      const px = ((tp.x * W - this.camX * (tp.z * 48)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r;

      ctx.save();
      ctx.translate(px, py);

      if (lvl.theme === 'lsd') {
        const lsdCols = ['#ff007f', '#00f5d4', '#ccff00', '#9d4edd'];
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.80;
        ctx.strokeStyle = lsdCols[tp.kindIdx % lsdCols.length];
        ctx.lineWidth = 2;
        ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
      } else if (lvl.theme === 'horror') {
        // Неоновые мексиканские черепа (Калаверы) на заднем фоне!
        const neonCols = ['#ff006e', '#00f5d4', '#ffbe0b', '#8338ec'];
        const col = neonCols[tp.kindIdx % neonCols.length];
        ctx.rotate(Math.sin(tp.phase * 0.6) * 0.22);
        ctx.globalAlpha = 0.78;
        ctx.strokeStyle = col;
        ctx.fillStyle = 'rgba(20, 5, 43, 0.75)';
        ctx.lineWidth = 1.8;

        const sr = r * 1.15;
        ctx.beginPath();
        ctx.arc(0, -sr * 0.1, sr * 0.85, Math.PI * 0.8, Math.PI * 2.2);
        ctx.lineTo(sr * 0.45, sr * 0.75);
        ctx.lineTo(-sr * 0.45, sr * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Неоновые глазки черепа
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(-sr * 0.3, -sr * 0.08, sr * 0.18, 0, Math.PI * 2);
        ctx.arc(sr * 0.3, -sr * 0.08, sr * 0.18, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'underwater') {
        // УРОВЕНЬ 4: Богатая генерация частиц (светящиеся пузыри, мини-медузы, искры планктона)
        const aquaCols = ['#00f5d4', '#90e0ef', '#f72585', '#ffd166'];
        const col = aquaCols[tp.kindIdx % aquaCols.length];
        ctx.globalAlpha = 0.78;

        if (tp.kindIdx === 0) {
          // Светящийся мыльный пузырь
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, Math.PI * 2); ctx.fill();
        } else if (tp.kindIdx === 1) {
          // Неоновая мини-медуза
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.85, Math.PI, 0); ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = 1.4;
          [-r * 0.4, 0, r * 0.4].forEach(tx => {
            ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx + Math.sin(tp.phase) * 3, r * 0.95); ctx.stroke();
          });
        } else {
          // Биолюминесцентная искра
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
        }
      } else if (lvl.theme === 'organic') {
        // УРОВЕНЬ 5: Богатая генерация растительных частиц (листья, лепестки цветов, золотая пыльца)
        const plantCols = ['#80ed99', '#ccff33', '#ffd166', '#38b000'];
        const col = plantCols[tp.kindIdx % plantCols.length];
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.84;

        if (tp.kindIdx === 0 || tp.kindIdx === 1) {
          // Светящийся листок
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.ellipse(0, 0, r * 1.15, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
        } else if (tp.kindIdx === 2) {
          // Мини-цветок
          ctx.fillStyle = '#ffd166';
          for (let p = 0; p < 5; p++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath(); ctx.arc(r * 0.55, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#ff5964';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2); ctx.fill();
        } else {
          // Золотая спора / пыльца
          ctx.fillStyle = '#ccff33';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
        }
      } else if (lvl.theme === 'mushroom') {
        ctx.rotate(Math.sin(tp.phase) * 0.35);
        ctx.globalAlpha = 0.85;
        const hue = (tp.hue + this.time * 95) % 360;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-r * 0.22, 0, r * 0.44, r * 0.8);
        ctx.fillStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, Math.PI, 0); ctx.fill();
      } else {
        ctx.rotate(tp.rot); ctx.globalAlpha = 0.78;
        ctx.fillStyle = `hsl(${(tp.hue + this.time * 90) % 360}, 100%, 74%)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a + Math.PI / 5) * (r * 0.42), Math.sin(a + Math.PI / 5) * (r * 0.42));
        }
        ctx.closePath(); ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    const [topC, midC, botC] = this.getDynamicSkyColors(lvl);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, topC);
    grad.addColorStop(0.5, midC);
    grad.addColorStop(1, botC);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 1. Волновые синусоиды сектора
    this.drawThemeWavesAndSines(ctx, lvl, W, H);

    // 2. Геометрические фигуры сектора
    this.drawLevelGeometry(ctx, lvl, W, H);

    // 3. Звёзды параллакса
    for (const s of this.stars) {
      const sx = ((s.x * W - this.camX * (s.z * 45)) % W + W) % W;
      const sy = s.y * H;
      ctx.globalAlpha = 0.35 + s.z * 0.45;
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.fillRect(sx, sy, s.r * 1.5, s.r * 1.5);
    }
    ctx.globalAlpha = 1;

    // 4. Уникальные планеты сектора
    for (const p of this.planets) {
      this.drawPlanet3D(ctx, p, lvl, W, H);
    }

    // 5. Тематические частицы сектора
    this.drawThemeParticles(ctx, lvl, W, H);
  }
}
