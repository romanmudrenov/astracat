'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    this.stars = Array.from({ length: 70 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.55 : 0.90);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.2 : (layer === 1 ? 1.9 : 2.5),
        speed: 0.03 + z * 0.14
      };
    });

    // Слой крупных вращающихся геометрических фигур в стиле каждого уровня
    this.geoShapes = Array.from({ length: 9 }, (_, i) => ({
      x: (i + 0.5) / 9 + (Math.random() - 0.5) * 0.08,
      y: Math.random(),
      z: 0.28 + (i % 3) * 0.22,
      kind: i % 4,
      size: 22 + (i % 4) * 11,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.25),
      speed: 0.025 + (i % 3) * 0.018,
      phase: i * 1.1
    }));

    // Тематические мелкие частицы (угли, сладости, рыбки/пузыри, лепестки/цветки)
    this.themeParticles = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.25,
      kindIdx: i % 3,
      r: 5 + (i % 4) * 2.2,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.4,
      speed: 0.04 + (i % 3) * 0.035,
      drift: (Math.random() - 0.5) * 0.06,
      hue: (i * 48) % 360,
      phase: Math.random() * Math.PI * 2
    }));

    this.planets = [
      { x: 0.22, y: 0.18, z: 0.35, r: 52, kind: 'ringed', speed: 0.022, hueShift: 0 },
      { x: 0.76, y: 0.56, z: 0.50, r: 42, kind: 'crater', speed: 0.030, hueShift: 90 },
      { x: 0.45, y: 0.88, z: 0.28, r: 46, kind: 'twin_moon', speed: 0.018, hueShift: 180 }
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
      g.phase += dt * 2.2;
      if (g.y > 1.12) {
        g.y = -0.12;
        g.x = 0.08 + Math.random() * 0.84;
      }
    }

    for (const tp of this.themeParticles) {
      tp.y += tp.speed * mult * dt;
      tp.x = (tp.x + tp.drift * dt + 1.0) % 1.0;
      tp.rot += tp.vrot * dt;
      tp.phase += dt * 4;
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

  // Плавная смена цветовых фаз неба каждые 14 секунд для каждого уровня
  getDynamicSkyColors(lvl) {
    const palettesByTheme = {
      lsd: [
        ['#180633', '#3b0d66', '#6b1475'],
        ['#260742', '#590d73', '#9b1d85'],
        ['#0f1242', '#2b196e', '#691882'],
        ['#2b063b', '#6e0d57', '#a81c6b']
      ],
      horror: [
        ['#05010a', '#17030c', '#2e0612'],
        ['#0d0208', '#26040e', '#470816'],
        ['#070212', '#1c041a', '#38071f']
      ],
      rainbow: [
        ['#22185c', '#3c2a8c', '#6941b5'],
        ['#2e1a66', '#56329e', '#8f4ec4'],
        ['#1a2463', '#2e3f9e', '#5a63c9']
      ],
      underwater: [
        ['#08243d', '#114b6e', '#1c7c94'],
        ['#0b2e4a', '#165e82', '#2694ab'],
        ['#0e284d', '#1e4b85', '#3278b5']
      ],
      organic: [
        ['#05210e', '#0e4720', '#196e32'],
        ['#082914', '#14592c', '#258544'],
        ['#062619', '#0f5238', '#1d7d57']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const cycle = (this.time / 14) % list.length;
    const idx = Math.floor(cycle);
    return list[idx];
  }

  // Тематические геометрические фигуры для каждого уровня
  drawLevelGeometry(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const g of this.geoShapes) {
      const gx = ((g.x * W - this.camX * (g.z * 38)) % W + W) % W;
      const gy = g.y * H;
      const s = g.size;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      if (lvl.theme === 'lsd') {
        // УРОВЕНЬ 1: Сакральные треугольники Шри-Янтры, лепестковые мандалы и фрактальные спирали
        const hue = (this.time * 55 + g.phase * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 66%)`;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.28;

        if (g.kind === 0) {
          // Пересекающиеся треугольники янтры
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
        } else if (g.kind === 1) {
          // 6-лепестковая геометрическая мандала
          for (let k = 0; k < 6; k++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(s * 0.45, 0, s * 0.45, s * 0.18, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Концентрический фрактальный ромб
          ctx.strokeRect(-s * 0.65, -s * 0.65, s * 1.3, s * 1.3);
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-s * 0.45, -s * 0.45, s * 0.9, s * 0.9);
        }

      } else if (lvl.theme === 'horror') {
        // УРОВЕНЬ 2: Мигающие готические гексаграммы, острые кристаллы и рунические кольца
        const blink = 0.16 + 0.22 * Math.abs(Math.sin(g.phase * 1.8));
        ctx.strokeStyle = g.kind % 2 === 0 ? '#ff002b' : '#ff9f1c';
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = blink;

        if (g.kind === 0) {
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            const a = (Math.PI * 4 * k) / 5 - Math.PI / 2;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath(); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.2); ctx.lineTo(s * 0.7, 0); ctx.lineTo(0, s * 1.2); ctx.lineTo(-s * 0.7, 0);
          ctx.closePath(); ctx.stroke();
        }

      } else if (lvl.theme === 'rainbow') {
        // УРОВЕНЬ 3: Радужные призмы, шестиугольные кристаллы и звёздчатые многогранники
        const hue = (this.time * 70 + g.phase * 50) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 72%)`;
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = 0.30;

        ctx.beginPath();
        const sides = g.kind === 0 ? 6 : (g.kind === 1 ? 5 : 8);
        for (let k = 0; k < sides; k++) {
          const a = (Math.PI * 2 * k) / sides;
          if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
          else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        }
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2); ctx.stroke();

      } else if (lvl.theme === 'underwater') {
        // УРОВЕНЬ 4: Пастельные сферы-пузыри, морские спирали-раковины и волновые кольца
        const pastelHue = 175 + Math.sin(g.phase) * 45;
        ctx.strokeStyle = `hsl(${pastelHue}, 95%, 80%)`;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.28;

        if (g.kind === 0) {
          // Спираль Фибоначчи (раковина наутилуса)
          ctx.beginPath();
          for (let t = 0; t < 20; t++) {
            const ang = t * 0.45;
            const rad = t * (s * 0.05);
            if (t === 0) ctx.moveTo(0, 0);
            else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        } else {
          // Двойной пастельный пузырь с бликом
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.3, s * 0.25, 0, Math.PI * 2); ctx.stroke();
        }

      } else if (lvl.theme === 'organic') {
        // УРОВЕНЬ 5: Изумрудные био-соты, спирали ДНК и клеточные ядра
        ctx.strokeStyle = g.kind % 2 === 0 ? '#80ed99' : '#ccff33';
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.28;

        if (g.kind === 0) {
          // Двойная спираль ДНК
          for (let strand of [-1, 1]) {
            ctx.beginPath();
            for (let y = -s; y <= s; y += 6) {
              const x = Math.sin(y * 0.14 + g.phase) * (s * 0.45) * strand;
              if (y === -s) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        } else {
          // Клеточный гексагон с ядром
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI * k) / 3;
            if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2); ctx.stroke();
        }
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawSkullPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = 0.16;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.fillStyle = '#2b2333';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.92, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(r * 0.52, r * 0.82);
    ctx.lineTo(-r * 0.52, r * 0.82);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.05, r * 0.24, r * 0.28, -0.15, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.05, r * 0.24, r * 0.28, 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff002b';
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.05, r * 0.10, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.05, r * 0.10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 55);
    const py = p.y * H;
    const r = p.r;

    if (lvl.theme === 'horror') {
      this.drawSkullPlanet(ctx, px, py, r);
      return;
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = lvl.accent;
    ctx.globalAlpha = 0.18;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.85;
    let pal = ['#7209b7', '#f72585', '#4cc9f0'];
    if (lvl.theme === 'lsd' || lvl.theme === 'rainbow') {
      const h1 = (this.time * 40 + p.hueShift) % 360;
      pal = [`hsl(${h1}, 80%, 38%)`, `hsl(${(h1 + 45) % 360}, 90%, 60%)`, `hsl(${(h1 + 95) % 360}, 95%, 76%)`];
    } else if (lvl.theme === 'underwater') {
      const h1 = 175 + Math.sin(this.time + p.hueShift) * 25;
      pal = [`hsl(${h1}, 75%, 36%)`, `hsl(${h1 + 20}, 85%, 62%)`, `hsl(${h1 + 40}, 95%, 82%)`];
    } else if (lvl.theme === 'organic') {
      pal = ['#083d18', '#2d6a4f', '#80ed99'];
    }

    ctx.fillStyle = pal[0];
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[1];
    ctx.beginPath(); ctx.arc(-r * 0.14, -r * 0.14, r * 0.84, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[2];
    ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.28, r * 0.52, 0, Math.PI * 2); ctx.fill();

    if (p.kind === 'ringed') {
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = lvl.theme === 'organic' ? '#80ed99' : '#ffd166';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, 0, Math.PI); ctx.stroke();
    }
    ctx.restore();
  }

  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    for (const tp of this.themeParticles) {
      const px = ((tp.x * W - this.camX * (tp.z * 48)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r;

      ctx.save();
      ctx.translate(px, py);

      if (lvl.theme === 'horror') {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(tp.phase * 1.6));
        ctx.fillStyle = tp.kindIdx === 0 ? '#ff002b' : (tp.kindIdx === 1 ? '#ff6b35' : '#ffd166');
        ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2); ctx.fill();
      } else if (lvl.theme === 'rainbow') {
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.78;
        if (tp.kindIdx === 0) {
          ctx.fillStyle = '#f4a261';
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ff70a6';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#22185c';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = `hsl(${(tp.hue + this.time * 90) % 360}, 100%, 74%)`;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.lineTo(Math.cos(a + Math.PI / 5) * (r * 0.42), Math.sin(a + Math.PI / 5) * (r * 0.42));
          }
          ctx.closePath(); ctx.fill();
        }
      } else if (lvl.theme === 'underwater') {
        const pastelCol = `hsl(${165 + Math.sin(tp.phase) * 45}, 90%, 80%)`;
        if (tp.kindIdx === 0) {
          ctx.fillStyle = pastelCol; ctx.globalAlpha = 0.72;
          ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-r * 0.9, 0); ctx.lineTo(-r * 1.6, -r * 0.5); ctx.lineTo(-r * 1.6, r * 0.5); ctx.closePath(); ctx.fill();
        } else {
          ctx.strokeStyle = pastelCol; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.65;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (lvl.theme === 'organic') {
        ctx.rotate(tp.rot); ctx.globalAlpha = 0.80;
        ctx.fillStyle = tp.kindIdx === 0 ? '#ccff33' : '#80ed99';
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
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

    // Отрисовка тематических геометрических фигур для каждого уровня
    this.drawLevelGeometry(ctx, lvl, W, H);

    // Асинхронные синусоиды от края до края на 1-м уровне
    if (lvl.theme === 'lsd') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.34;
      ctx.lineCap = 'round';
      const waveConfigs = [
        { yFrac: 0.16, amp: 50, freq: 0.011, speed: 2.3, width: 7, dir: 1 },
        { yFrac: 0.42, amp: 32, freq: 0.018, speed: -1.8, width: 4, dir: -1 },
        { yFrac: 0.72, amp: 60, freq: 0.009, speed: 1.5, width: 8, dir: 1 }
      ];
      waveConfigs.forEach((cfg, s) => {
        const hue = (this.time * 48 + s * 110) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
        ctx.lineWidth = cfg.width;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * cfg.yFrac + Math.sin(x * cfg.freq + this.time * cfg.speed + s * 1.7) * cfg.amp;
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    if (lvl.theme === 'rainbow') {
      ctx.save();
      ctx.globalAlpha = 0.25;
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'];
      rainbowBands.forEach((col, bIdx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 13;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 16) {
          const sy = H * 0.35 + bIdx * 12 + Math.sin(x * 0.011 + this.time * 1.8) * 55;
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    for (const s of this.stars) {
      const sx = ((s.x * W - this.camX * (s.z * 45)) % W + W) % W;
      const sy = s.y * H;
      ctx.globalAlpha = 0.35 + s.z * 0.45;
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.fillRect(sx, sy, s.r * 1.5, s.r * 1.5);
    }
    ctx.globalAlpha = 1;

    for (const p of this.planets) {
      this.drawPlanet3D(ctx, p, lvl, W, H);
    }

    this.drawThemeParticles(ctx, lvl, W, H);
  }
}
