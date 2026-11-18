'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;
    this.bgScrollY = 0;

    this.currentWave = 1;
    this.playerX = 240;
    this.playerY = 650;
    this.bossVortex = 0;
    this.pulses = [];

    this.bgImages = {};
    this._preloadBackgroundImages();

    // 110 мерцающих звёзд
    this.stars = Array.from({ length: 110 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.58 : 0.92);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.3 : (layer === 1 ? 2.1 : 2.9),
        speed: 0.035 + z * 0.14,
        phase: Math.random() * Math.PI * 2,
        blinkSpd: 2.8 + (i % 5) * 1.2,
        hueOffset: (i * 37) % 360
      };
    });

    // 16 крупных тематических узоров на заднем плане
    this.geoShapes = Array.from({ length: 16 }, (_, i) => ({
      x: ((i % 4) + 0.5) / 4 + (Math.random() - 0.5) * 0.12,
      y: (i / 16) + Math.random() * 0.05,
      z: 0.28 + (i % 3) * 0.22,
      kind: i % 4,
      size: 28 + (i % 4) * 10,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.45 + (i % 3) * 0.28),
      speed: 0.034 + (i % 3) * 0.02,
      phase: i * 0.95
    }));

    // 54 тематические частицы (по 3 вида на каждый уровень)
    this.weatherItems = Array.from({ length: 54 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.26,
      kind: i % 3,
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0.045 + (i % 4) * 0.025,
      r: 5.5 + (i % 4) * 2.1,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.9 + Math.random() * 1.5),
      phase: Math.random() * Math.PI * 2,
      hueOffset: (i * 47) % 360,
      offsetX: 0,
      offsetY: 0
    }));

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
      probe.onload = () => { entry.img = probe; entry.ready = true; };
      probe.onerror = () => {
        const pngProbe = new Image();
        pngProbe.onload = () => { entry.img = pngProbe; entry.ready = true; };
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
    return 1 + (this.currentWave - 1) * 0.28;
  }

  triggerPulse(x, y, color = '#ffd6ff') {
    if (this.pulses.length > 8) this.pulses.shift();
    this.pulses.push({ x, y, color, r: 14, maxR: 205, alpha: 0.72 });
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
      if (s.y > 1.03) { s.y = -0.03; s.x = Math.random(); }
    }

    for (const g of this.geoShapes) {
      g.y += g.speed * mult * dt;
      g.rot += g.vrot * waveMult * dt;
      g.phase += dt * 2.8;
      if (g.y > 1.14) { g.y = -0.14; g.x = 0.08 + Math.random() * 0.84; }
    }

    for (const w of this.weatherItems) {
      w.y += w.vy * mult * dt;
      w.x = (w.x + w.vx * dt + 1.0) % 1.0;
      w.rot += w.vrot * dt;
      w.phase += dt * 3.8;
      w.offsetX *= Math.pow(0.08, dt);
      w.offsetY *= Math.pow(0.08, dt);
      if (w.y > 1.08) { w.y = -0.08; w.x = Math.random(); w.offsetX = 0; w.offsetY = 0; }
    }

    for (const p of this.planets) {
      p.y += p.speed * mult * dt;
      if (p.y > 1.26) { p.y = -0.26; p.x = 0.16 + Math.random() * 0.68; p.hueShift = (p.hueShift + 75) % 360; }
    }

    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pl = this.pulses[i];
      pl.r += 245 * dt;
      pl.alpha -= 0.72 * dt;
      if (pl.alpha <= 0 || pl.r >= pl.maxR) this.pulses.splice(i, 1);
    }
  }

  getDynamicSkyColors(lvl) {
    const palettesByTheme = {
      lsd:        [['#1b0b38', '#361963', '#562982'], ['#220e42', '#421d73', '#673096']],
      horror:     [['#180929', '#33123d', '#541b4a'], ['#1e0c30', '#3d1647', '#612152']],
      rainbow:    [['#2d1b54', '#563480', '#8f5b9e'], ['#362163', '#643d91', '#9e68ad']],
      underwater: [['#08243d', '#124669', '#1e6b8c'], ['#0b2c4a', '#16527a', '#247ba0']],
      organic:    [['#1f0c14', '#2e2408', '#0a331c'], ['#291019', '#3b2e0a', '#0f4225']],
      mushroom:   [['#210b3b', '#471869', '#73298c'], ['#280e45', '#541e78', '#85349c']]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    return list[Math.floor((this.time / 9) % list.length)];
  }

  getMagicPastelColors(theme) {
    if (theme === 'rainbow')    return ['#ff8fab', '#ffb5a7', '#fff0c2', '#b9fbc0', '#90e0ef', '#d8b4fe'];
    if (theme === 'lsd')        return ['#f19cff', '#a78bfa', '#7dd3fc', '#f9a8d4', '#fde047'];
    if (theme === 'horror')     return ['#ff8fa3', '#ffb703', '#80ed99', '#90e0ef', '#c77dff'];
    if (theme === 'underwater') return ['#72efdd', '#64dfdf', '#90e0ef', '#bde0fe', '#ffafcc'];
    if (theme === 'organic')    return ['#ff4d6d', '#ffd166', '#06d6a0', '#ff85a1', '#80ed99']; // Растаманская палитра!
    return ['#f19cff', '#c77dff', '#ff85a1', '#72efdd', '#ffd166'];
  }

  // Вспомогательные мини-фигуры для узоров и частиц
  _drawHempLeafPath(ctx, r) {
    const angles = [-1.15, -0.75, -0.36, 0, 0.36, 0.75, 1.15];
    const lengths = [0.48, 0.72, 0.90, 1.12, 0.90, 0.72, 0.48];
    angles.forEach((a, idx) => {
      ctx.save();
      ctx.rotate(a);
      const len = r * lengths[idx];
      const wid = len * 0.22;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-wid, -len * 0.55, 0, -len);
      ctx.quadraticCurveTo(wid, -len * 0.55, 0, 0);
      ctx.fill();
      ctx.restore();
    });
    ctx.fillRect(-r * 0.05, 0, r * 0.1, r * 0.38);
  }

  _drawSpiderIcon(ctx, r, strokeOnly = false) {
    ctx.beginPath();
    ctx.arc(0, -r * 0.25, r * 0.34, 0, Math.PI * 2);
    ctx.arc(0, r * 0.25, r * 0.26, 0, Math.PI * 2);
    if (strokeOnly) ctx.stroke(); else ctx.fill();

    for (const side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const y0 = -r * 0.15 + l * (r * 0.16);
        ctx.beginPath();
        ctx.moveTo(side * r * 0.22, y0);
        ctx.lineTo(side * r * 0.68, y0 - r * 0.22);
        ctx.lineTo(side * r * 0.92, y0 + r * 0.18);
        ctx.stroke();
      }
    }
  }

  _drawSkullIcon(ctx, r, strokeOnly = false) {
    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 0.58, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(r * 0.32, r * 0.58);
    ctx.lineTo(-r * 0.32, r * 0.58);
    ctx.closePath();
    if (strokeOnly) {
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-r * 0.22, -r * 0.08, r * 0.16, 0, Math.PI * 2);
      ctx.arc(r * 0.22, -r * 0.08, r * 0.16, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }

  _drawHeartIcon(ctx, r, strokeOnly = false) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.28);
    ctx.bezierCurveTo(r * 0.45, -r * 0.78, r * 0.98, -r * 0.15, 0, r * 0.65);
    ctx.bezierCurveTo(-r * 0.98, -r * 0.15, -r * 0.45, -r * 0.78, 0, -r * 0.28);
    ctx.closePath();
    if (strokeOnly) ctx.stroke(); else ctx.fill();
  }

  _drawCandyIcon(ctx, r, strokeOnly = false) {
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.55, r * 0.36, 0, 0, Math.PI * 2);
    ctx.moveTo(-r * 0.52, 0); ctx.lineTo(-r * 0.95, -r * 0.35); ctx.lineTo(-r * 0.95, r * 0.35); ctx.closePath();
    ctx.moveTo(r * 0.52, 0); ctx.lineTo(r * 0.95, -r * 0.35); ctx.lineTo(r * 0.95, r * 0.35); ctx.closePath();
    if (strokeOnly) ctx.stroke(); else ctx.fill();
  }

  _drawFishIcon(ctx, r, strokeOnly = false) {
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, 0, r * 0.62, r * 0.34, 0, 0, Math.PI * 2);
    ctx.moveTo(r * 0.48, 0); ctx.lineTo(r * 0.95, -r * 0.35); ctx.lineTo(r * 0.95, r * 0.35); ctx.closePath();
    if (strokeOnly) ctx.stroke(); else ctx.fill();
  }

  _drawStarIcon(ctx, r, pts = 5, strokeOnly = false) {
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a = (Math.PI * i) / pts - Math.PI / 2;
      const rad = i % 2 === 0 ? r * 0.88 : r * 0.40;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    if (strokeOnly) ctx.stroke(); else ctx.fill();
  }

  _drawDaisyIcon(ctx, r, strokeOnly = false) {
    for (let k = 0; k < 6; k++) {
      ctx.save();
      ctx.rotate((Math.PI * k) / 3);
      ctx.beginPath();
      ctx.ellipse(r * 0.46, 0, r * 0.36, r * 0.18, 0, 0, Math.PI * 2);
      if (strokeOnly) ctx.stroke(); else ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
    if (strokeOnly) ctx.stroke(); else ctx.fill();
  }

  _drawMushroomIcon(ctx, r, pointy = false, strokeOnly = false) {
    ctx.beginPath();
    if (pointy) {
      ctx.moveTo(-r * 0.72, 0);
      ctx.quadraticCurveTo(-r * 0.55, -r * 0.85, 0, -r * 0.95);
      ctx.quadraticCurveTo(r * 0.55, -r * 0.85, r * 0.72, 0);
    } else {
      ctx.arc(0, 0, r * 0.75, Math.PI, 0);
    }
    ctx.closePath();
    if (strokeOnly) {
      ctx.stroke();
      ctx.strokeRect(-r * 0.18, 0, r * 0.36, r * 0.55);
    } else {
      ctx.fill();
      ctx.fillRect(-r * 0.18, 0, r * 0.36, r * 0.55);
    }
  }

  // Широкие волнообразные синусоиды разной амплитуды на всех 6 уровнях
  drawThemeSineWaves(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getMagicPastelColors(lvl.theme);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';

    // 3-й уровень: широкие 6-полосные радужные синусоиды в пастельном неоне
    if (lvl.theme === 'rainbow') {
      const ribbonYFracs = waveNum >= 3 ? [0.18, 0.50, 0.80] : [0.24, 0.66];
      ribbonYFracs.forEach((yFrac, rIdx) => {
        const dir = rIdx % 2 === 0 ? 1 : -1;
        const ampScale = 1.0 + rIdx * 0.22;
        cols.forEach((col, bandIdx) => {
          const bandOffset = (bandIdx - 2.5) * 10.5;
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.54;
          ctx.lineWidth = 11.5;
          ctx.beginPath();

          for (let x = -30; x <= W + 30; x += 14) {
            let sy = H * yFrac + bandOffset;
            const mod = 0.75 + 0.45 * Math.sin(x * 0.007 + this.time * 1.1 + rIdx);
            sy += Math.sin(x * 0.011 + this.time * (1.7 + waveNum * 0.25) * dir + rIdx) * 48 * ampScale * mod;
            if (waveNum >= 2) {
              sy += Math.cos(x * 0.023 - this.time * 1.6 * dir) * (12 + waveNum * 3);
            }
            if (this.bossVortex > 0) sy += (H * 0.22 - sy) * (this.bossVortex * 0.38);
            if (x === -30) ctx.moveTo(x, sy); else ctx.lineTo(x, sy);
          }
          ctx.stroke();
        });
      });
      ctx.restore();
      return;
    }

    // Остальные 5 уровней: широкие, волнообразные синусоиды с разной амплитудой каждой ленты
    const count = 4 + Math.min(2, waveNum - 1);
    const amplitudes = [34, 56, 26, 64, 42, 52];
    const freqs = [0.009, 0.013, 0.017, 0.010, 0.015, 0.012];

    for (let s = 0; s < count; s++) {
      const yBase = H * (0.11 + (s / count) * 0.82);
      const dir = s % 2 === 0 ? 1 : -1;
      const col = cols[s % cols.length];
      const baseAmp = amplitudes[s % amplitudes.length] * (0.95 + waveNum * 0.08);
      const freq = freqs[s % freqs.length];

      const pts = [];
      for (let x = -30; x <= W + 30; x += 14) {
        // Плавная модуляция амплитуды вдоль волны, чтобы она была живой и волнообразной
        const env = 0.65 + 0.50 * Math.sin(x * 0.006 + this.time * 0.9 + s * 1.7);
        let sy = yBase + Math.sin(x * freq + this.time * (1.5 + waveNum * 0.25) * dir + s * 1.2) * baseAmp * env;

        if (waveNum >= 2) {
          sy += Math.cos(x * (freq * 2.1) - this.time * 1.7 * dir) * (10 + (s % 3) * 5);
        }
        if (this.bossVortex > 0) sy += (H * 0.22 - sy) * (this.bossVortex * 0.38);
        pts.push([x, sy]);
      }

      // 1) Широкий светящийся шлейф
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.26;
      ctx.lineWidth = 15;
      ctx.beginPath();
      pts.forEach(([x, sy], idx) => (idx === 0 ? ctx.moveTo(x, sy) : ctx.lineTo(x, sy)));
      ctx.stroke();

      // 2) Основная широкая волна
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.68;
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      pts.forEach(([x, sy], idx) => (idx === 0 ? ctx.moveTo(x, sy) : ctx.lineTo(x, sy)));
      ctx.stroke();

      // Для Раста-уровня (5) рисуем маленькие листики на гребнях волн начиная со 2-й волны
      if (lvl.theme === 'organic' && waveNum >= 2) {
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.65;
        for (let nx = 45; nx < W; nx += 115) {
          const ny = yBase + Math.sin(nx * freq + this.time * (1.5 + waveNum * 0.25) * dir + s * 1.2) * baseAmp * 0.8;
          ctx.save();
          ctx.translate(nx, ny);
          ctx.rotate(Math.sin(this.time * 2 + nx) * 0.4);
          this._drawHempLeafPath(ctx, 8);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }

  // Тематические узоры для каждого из 6 уровней (меняют композицию каждую волну)
  drawLevelGeometry(ctx, lvl, W, H) {
    const waveNum = this.currentWave;
    const cols = this.getMagicPastelColors(lvl.theme);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < this.geoShapes.length; i++) {
      const g = this.geoShapes[i];
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
      const s = g.size * pulse * (0.95 + waveNum * 0.06);
      const col = cols[(g.kind + waveNum) % cols.length];
      const patternSlot = (g.kind + waveNum) % 4;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.58 + 0.18 * Math.abs(Math.sin(g.phase));

      if (lvl.theme === 'lsd') {
        // 1) Мандалы, знак Ом, фракталы
        if (patternSlot === 0) {
          for (let k = 0; k < 8; k++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath(); ctx.ellipse(s * 0.52, 0, s * 0.44, s * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else if (patternSlot === 1) {
          ctx.beginPath(); ctx.arc(0, 0, s * 0.88, 0, Math.PI * 2); ctx.stroke();
          ctx.font = `bold ${Math.round(s * 0.92)}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 1);
        } else {
          // Фрактал (вложенные треугольники и спираль)
          for (const dir of [1, -1]) {
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
              const a = (Math.PI * 2 * k) / 3 - (Math.PI / 2) * dir;
              if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
              else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            }
            ctx.closePath(); ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        // 2) Пауки, мексиканские черепа, звёзды
        if (patternSlot === 0) {
          this._drawSpiderIcon(ctx, s * 0.95, true);
        } else if (patternSlot === 1) {
          this._drawSkullIcon(ctx, s * 0.95, true);
        } else {
          this._drawStarIcon(ctx, s, 6, true);
          ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (lvl.theme === 'rainbow') {
        // 3) Конфеты, сердца, пастельные спирали
        if (patternSlot === 0 || patternSlot === 2) {
          this._drawCandyIcon(ctx, s * 0.95, true);
        } else if (patternSlot === 1) {
          this._drawHeartIcon(ctx, s * 0.95, true);
        } else {
          ctx.beginPath();
          for (let t = 0; t < 20; t++) {
            const a = t * 0.48, rad = t * (s * 0.045);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'underwater') {
        // 4) Волны, рыбки, звёзды
        if (patternSlot === 0) {
          [-s * 0.35, 0, s * 0.35].forEach(wy => {
            ctx.beginPath();
            ctx.moveTo(-s * 0.8, wy);
            ctx.quadraticCurveTo(-s * 0.4, wy - s * 0.28, 0, wy);
            ctx.quadraticCurveTo(s * 0.4, wy + s * 0.28, s * 0.8, wy);
            ctx.stroke();
          });
        } else if (patternSlot === 1) {
          this._drawFishIcon(ctx, s * 0.95, true);
        } else {
          this._drawStarIcon(ctx, s * 0.95, 5, true);
        }
      } else if (lvl.theme === 'organic') {
        // 5) Растаманский уровень: цветки/ромашки, синусоиды-лианы, листья конопли, раста-солнца
        if (patternSlot === 0) {
          this._drawDaisyIcon(ctx, s * 0.95, true);
        } else if (patternSlot === 1) {
          ctx.globalAlpha = 0.42;
          this._drawHempLeafPath(ctx, s * 0.95);
        } else if (patternSlot === 2) {
          // Спираль-лиана с листочками
          ctx.beginPath();
          for (let t = 0; t < 18; t++) {
            const a = t * 0.5, rad = t * (s * 0.048);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.stroke();
        } else {
          this._drawStarIcon(ctx, s * 0.95, 8, true);
          ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.stroke();
        }
      } else {
        // 6) Грибы разных видов, глаз в пирамиде (масонский), спиральный портал
        if (patternSlot === 0) {
          this._drawMushroomIcon(ctx, s * 0.95, false, true);
        } else if (patternSlot === 1) {
          this._drawMushroomIcon(ctx, s * 0.95, true, true);
        } else if (patternSlot === 2) {
          // Всевидящий глаз в пирамиде
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.9);
          ctx.lineTo(s * 0.85, s * 0.65);
          ctx.lineTo(-s * 0.85, s * 0.65);
          ctx.closePath();
          ctx.stroke();
          // Глаз внутри пирамиды
          ctx.beginPath();
          ctx.ellipse(0, s * 0.1, s * 0.36, s * 0.20, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, s * 0.1, s * 0.11, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let t = 0; t < 22; t++) {
            const a = t * 0.45, rad = t * (s * 0.042);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.stroke();
        }
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 50);
    const py = p.y * H;
    const r = p.r;
    const cols = this.getMagicPastelColors(lvl.theme);
    const mainCol = cols[Math.floor(p.hueShift / 100) % cols.length];
    const ringCol = cols[(Math.floor(p.hueShift / 100) + 1) % cols.length];

    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.68;
    ctx.fillStyle = mainCol;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(-0.28 + Math.sin(this.time * 0.7 + p.hueShift) * 0.08);
    ctx.strokeStyle = ringCol; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.62, r * 0.34, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // Тематические частицы для каждого из 6 уровней
  drawSectorWeather(ctx, lvl, W, H) {
    const cols = this.getMagicPastelColors(lvl.theme);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < this.weatherItems.length; i++) {
      const w = this.weatherItems[i];
      let px = ((w.x * W - this.camX * (w.z * 48)) % W + W) % W + w.offsetX;
      let py = w.y * H + w.offsetY;

      if (lvl.theme === 'organic') {
        const dx = px - this.playerX, dy = py - this.playerY;
        const dist = Math.hypot(dx, dy);
        if (dist < 115 && dist > 1) {
          const push = ((115 - dist) / 115) * 14;
          w.offsetX += (dx / dist) * push; w.offsetY += (dy / dist) * push;
          px += (dx / dist) * push; py += (dy / dist) * push;
        }
      }

      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        px += (cx - px) * (this.bossVortex * 0.42);
        py += (cy - py) * (this.bossVortex * 0.42);
      }

      const col = cols[i % cols.length];
      const blink = 0.56 + 0.32 * Math.sin(w.phase);
      const r = w.r;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(w.rot);
      ctx.globalAlpha = blink;
      ctx.fillStyle = col;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.6;

      if (lvl.theme === 'lsd') {
        // 1) Маленькие значки Ом, значки Мир, разноцветные блёстки
        if (w.kind === 0) {
          ctx.font = `bold ${Math.round(r * 2.1)}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 0);
        } else if (w.kind === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
          ctx.moveTo(0, -r * 1.1); ctx.lineTo(0, r * 1.1);
          ctx.moveTo(0, 0); ctx.lineTo(-r * 0.78, r * 0.78);
          ctx.moveTo(0, 0); ctx.lineTo(r * 0.78, r * 0.78);
          ctx.stroke();
        } else {
          this._drawStarIcon(ctx, r * 0.9, 4, false);
        }
      } else if (lvl.theme === 'horror') {
        // 2) Черепки, паучки, разноцветные конфетки
        if (w.kind === 0) {
          this._drawSkullIcon(ctx, r * 1.15, false);
        } else if (w.kind === 1) {
          this._drawSpiderIcon(ctx, r * 1.15, false);
        } else {
          this._drawCandyIcon(ctx, r * 1.25, false);
        }
      } else if (lvl.theme === 'rainbow') {
        // 3) Сердечки, пончики, облачка
        if (w.kind === 0) {
          this._drawHeartIcon(ctx, r * 1.15, false);
        } else if (w.kind === 1) {
          ctx.lineWidth = 3.2;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(-r * 0.5, 0, r * 0.75, 0, Math.PI * 2);
          ctx.arc(r * 0.5, 0, r * 0.75, 0, Math.PI * 2);
          ctx.arc(0, -r * 0.35, r * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (lvl.theme === 'underwater') {
        // 4) Рыбки, звёздочки, пузырики
        if (w.kind === 0) {
          this._drawFishIcon(ctx, r * 1.25, false);
        } else if (w.kind === 1) {
          this._drawStarIcon(ctx, r * 1.05, 5, false);
        } else {
          ctx.beginPath(); ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
        }
      } else if (lvl.theme === 'organic') {
        // 5) Растаманский уровень: ромашки, лепестки конопли, тлеющие угольки
        if (w.kind === 0) {
          this._drawDaisyIcon(ctx, r * 1.15, false);
        } else if (w.kind === 1) {
          this._drawHempLeafPath(ctx, r * 1.35);
        } else {
          // Тлеющие красно-золотые угольки
          ctx.fillStyle = i % 2 === 0 ? '#ff4d6d' : '#ffd166';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
        }
      } else {
        // 6) Маленькие грибочки разных форм, споры, парящие третьи глаза / кристаллы
        if (w.kind === 0) {
          this._drawMushroomIcon(ctx, r * 1.15, i % 2 === 0, false);
        } else if (w.kind === 1) {
          // Светящиеся споры
          ctx.beginPath(); ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2); ctx.fill();
        } else {
          // Астральный третий глаз
          ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.58, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawBossPreSpawnVortex(ctx, lvl, W, H) {
    if (this.bossVortex <= 0) return;
    const cx = W / 2, cy = H * 0.22, v = this.bossVortex;
    const cols = this.getMagicPastelColors(lvl.theme);

    ctx.save();
    const vig = ctx.createRadialGradient(cx, cy, 20, cx, cy, H * 0.75);
    vig.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vig.addColorStop(1, `rgba(8, 2, 20, ${0.45 * v})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    ctx.translate(cx, cy);
    for (let ring = 0; ring < 4; ring++) {
      ctx.save();
      ctx.rotate(this.time * (3.5 + ring) * (ring % 2 === 0 ? 1 : -1));
      ctx.strokeStyle = cols[ring % cols.length];
      ctx.globalAlpha = 0.78 * v;
      ctx.lineWidth = 4.0 - ring * 0.5;
      ctx.setLineDash([18, 12]);
      const rad = (24 + ring * 22) * (0.4 + v * 0.75);
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 56 * v);
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.90 * v})`);
    coreGrad.addColorStop(0.5, `rgba(241, 156, 255, ${0.55 * v})`);
    coreGrad.addColorStop(1, 'rgba(241, 156, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath(); ctx.arc(0, 0, 56 * v, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    const bgEntry = this.bgImages[lvl.id];
    if (bgEntry && bgEntry.ready && bgEntry.img) {
      const img = bgEntry.img;
      const drawW = W * 1.08;
      const drawH = Math.max(H, (img.naturalHeight / Math.max(1, img.naturalWidth)) * drawW);
      const offsetX = -W * 0.04 - this.camX * 10;
      const yOffset = this.bgScrollY % drawH;

      ctx.drawImage(img, offsetX, yOffset - drawH, drawW, drawH);
      ctx.drawImage(img, offsetX, yOffset, drawW, drawH);

      ctx.fillStyle = lvl.theme === 'rainbow' ? 'rgba(42, 22, 64, 0.14)' : 'rgba(10, 4, 24, 0.16)';
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

    this.drawThemeSineWaves(ctx, lvl, W, H);

    for (const s of this.stars) {
      let sx = ((s.x * W - this.camX * (s.z * 44)) % W + W) % W;
      let sy = s.y * H;
      if (this.bossVortex > 0) {
        const cx = W / 2, cy = H * 0.22;
        sx += (cx - sx) * (this.bossVortex * 0.32);
        sy += (cy - sy) * (this.bossVortex * 0.32);
      }
      const blink = 0.40 + 0.60 * Math.abs(Math.sin(s.phase));
      ctx.globalAlpha = blink * 0.80;
      ctx.fillStyle = `hsl(${(this.time * 90 + s.hueOffset) % 360}, 95%, 80%)`;
      ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    this.drawLevelGeometry(ctx, lvl, W, H);

    if (!(bgEntry && bgEntry.ready)) {
      for (const p of this.planets) this.drawPlanet3D(ctx, p, lvl, W, H);
    }

    for (const pl of this.pulses) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = pl.color;
      ctx.globalAlpha = Math.max(0, pl.alpha);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    this.drawSectorWeather(ctx, lvl, W, H);
    this.drawBossPreSpawnVortex(ctx, lvl, W, H);
  }
}
