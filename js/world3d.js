'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    this.stars = Array.from({ length: 75 }, (_, i) => {
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

    // Универсальный пул тематических фоновых частиц (угли на Ур.2, сладости на Ур.3, пузырьки/рыбки на Ур.4, лепестки/цветки на Ур.5)
    this.themeParticles = Array.from({ length: 32 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.25,
      kindIdx: i % 3,
      r: 5 + (i % 4) * 2.5,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.4,
      speed: 0.04 + (i % 3) * 0.035,
      drift: (Math.random() - 0.5) * 0.06,
      hue: (i * 48) % 360,
      phase: Math.random() * Math.PI * 2
    }));

    this.planets = [
      { x: 0.22, y: 0.18, z: 0.35, r: 54, kind: 'ringed', speed: 0.022, hueShift: 0 },
      { x: 0.76, y: 0.56, z: 0.50, r: 44, kind: 'crater', speed: 0.030, hueShift: 90 },
      { x: 0.45, y: 0.88, z: 0.28, r: 48, kind: 'twin_moon', speed: 0.018, hueShift: 180 }
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

  drawSkullPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);

    const pulse = 0.14 + 0.12 * Math.sin(this.time * 4 + px);
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.fillStyle = '#2b2333';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.92, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(r * 0.52, r * 0.82);
    ctx.lineTo(-r * 0.52, r * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4a3e56';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.25, r * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.05, r * 0.24, r * 0.28, -0.15, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.05, r * 0.24, r * 0.28, 0.15, 0, Math.PI * 2);
    ctx.fill();

    const glow = 0.5 + 0.5 * Math.sin(this.time * 5 + px);
    ctx.fillStyle = `rgba(255, 0, 43, ${glow})`;
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.05, r * 0.11, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.05, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.12);
    ctx.lineTo(-r * 0.14, r * 0.38);
    ctx.lineTo(r * 0.14, r * 0.38);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#07030a';
    ctx.lineWidth = 2.5;
    for (let k = -2; k <= 2; k++) {
      const tx = k * (r * 0.18);
      ctx.beginPath();
      ctx.moveTo(tx, r * 0.52);
      ctx.lineTo(tx, r * 0.80);
      ctx.stroke();
    }

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
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2);
    ctx.fill();

    if (p.kind === 'ringed') {
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.85;
    let pal = ['#7209b7', '#f72585', '#4cc9f0'];
    if (lvl.theme === 'lsd' || lvl.theme === 'rainbow') {
      const h1 = (this.time * 35 + p.hueShift) % 360;
      pal = [`hsl(${h1}, 80%, 36%)`, `hsl(${(h1 + 45) % 360}, 90%, 58%)`, `hsl(${(h1 + 95) % 360}, 95%, 74%)`];
    } else if (lvl.theme === 'underwater') {
      const h1 = 175 + Math.sin(this.time + p.hueShift) * 25;
      pal = [`hsl(${h1}, 75%, 32%)`, `hsl(${h1 + 20}, 85%, 58%)`, `hsl(${h1 + 40}, 95%, 80%)`];
    } else if (lvl.theme === 'organic') {
      pal = ['#083d18', '#2d6a4f', '#80ed99'];
    }

    ctx.fillStyle = pal[0];
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = pal[1];
    ctx.beginPath();
    ctx.arc(-r * 0.14, -r * 0.14, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = pal[2];
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.28, r * 0.52, 0, Math.PI * 2);
    ctx.fill();

    if (p.kind === 'ringed') {
      ctx.globalAlpha = 0.68;
      ctx.strokeStyle = lvl.theme === 'organic' ? '#80ed99' : '#ffd166';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, 0, Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Генератор тематических частиц для уровней 2, 3, 4 и 5
  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    for (const tp of this.themeParticles) {
      const px = ((tp.x * W - this.camX * (tp.z * 48)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r;

      ctx.save();
      ctx.translate(px, py);

      if (lvl.theme === 'horror') {
        // УРОВЕНЬ 2: Тлеющие и мигающие раскалённые угли (Embers)
        const flicker = 0.35 + 0.65 * Math.abs(Math.sin(tp.phase * 1.6));
        ctx.globalAlpha = flicker;
        ctx.fillStyle = tp.kindIdx === 0 ? '#ff002b' : (tp.kindIdx === 1 ? '#ff6b35' : '#ffd166');
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

      } else if (lvl.theme === 'rainbow') {
        // УРОВЕНЬ 3: Звёздочки, печенье и пончики
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.78;
        if (tp.kindIdx === 0) {
          ctx.fillStyle = '#f4a261';
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `hsl(${(tp.hue + this.time * 60) % 360}, 95%, 68%)`;
          ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1d1447';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
        } else if (tp.kindIdx === 1) {
          ctx.fillStyle = '#e09f3e';
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#3d1e05';
          [[-r * 0.35, -r * 0.25], [r * 0.3, -r * 0.2], [0, r * 0.35]].forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2); ctx.fill();
          });
        } else {
          ctx.fillStyle = `hsl(${(tp.hue + this.time * 90) % 360}, 100%, 72%)`;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.lineTo(Math.cos(a + Math.PI / 5) * (r * 0.42), Math.sin(a + Math.PI / 5) * (r * 0.42));
          }
          ctx.closePath();
          ctx.fill();
        }

      } else if (lvl.theme === 'underwater') {
        // УРОВЕНЬ 4: Переливающиеся пастельные пузырьки и стайки мелких рыбок
        const pastelCol = `hsl(${165 + Math.sin(tp.phase) * 45}, 90%, 78%)`;
        if (tp.kindIdx === 0) {
          // Мелкая неоновая рыбка
          ctx.fillStyle = pastelCol;
          ctx.globalAlpha = 0.72;
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.1, r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-r * 0.9, 0);
          ctx.lineTo(-r * 1.6, -r * 0.5);
          ctx.lineTo(-r * 1.6, r * 0.5);
          ctx.closePath();
          ctx.fill();
        } else {
          // Переливающийся воздушный пузырёк
          ctx.strokeStyle = pastelCol;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (lvl.theme === 'organic') {
        // УРОВЕНЬ 5: Светящиеся неоновые лепестки и цветки
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.80;
        if (tp.kindIdx === 0) {
          // 5-лепестковый неоновый цветок
          ctx.fillStyle = `hsl(${110 + (tp.hue % 65)}, 95%, 64%)`;
          for (let k = 0; k < 5; k++) {
            const a = (Math.PI * 2 * k) / 5;
            ctx.beginPath();
            ctx.ellipse(Math.cos(a) * (r * 0.65), Math.sin(a) * (r * 0.65), r * 0.55, r * 0.32, a, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fee440';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
        } else {
          // Изумрудный неоновый лепесток
          ctx.fillStyle = '#80ed99';
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.1, r * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.5, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 1. УРОВЕНЬ 1 («Туманность Узоров»): Асинхронные синусоиды разной ширины и амплитуды СТРОГО ОТ КРАЯ ДО КРАЯ
    if (lvl.theme === 'lsd') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.38;
      ctx.lineCap = 'round';

      const waveConfigs = [
        { yFrac: 0.14, amp: 52, freq: 0.011, speed: 2.3, width: 7.5, dir: 1 },
        { yFrac: 0.31, amp: 28, freq: 0.019, speed: -1.7, width: 3.5, dir: -1 },
        { yFrac: 0.50, amp: 68, freq: 0.008, speed: 1.4, width: 9.0, dir: 1 },
        { yFrac: 0.69, amp: 36, freq: 0.015, speed: -2.6, width: 4.5, dir: -1 },
        { yFrac: 0.86, amp: 48, freq: 0.013, speed: 1.9, width: 6.0, dir: 1 }
      ];

      waveConfigs.forEach((cfg, s) => {
        const hue = (this.time * 48 + s * 72) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
        ctx.lineWidth = cfg.width;
        ctx.beginPath();
        // Идём с запасом от -80 до W + 80, чтобы справа и слева никогда не было обрыва!
        for (let x = -80; x <= W + 80; x += 12) {
          const sy = H * cfg.yFrac +
            Math.sin(x * cfg.freq + this.time * cfg.speed + s * 1.7) * cfg.amp +
            Math.cos(x * cfg.freq * 0.5 - this.time * 1.1) * (cfg.amp * 0.35);
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

      for (let f = 0; f < 3; f++) {
        const fx = W * (0.22 + f * 0.28) - this.camX * 22;
        const fy = ((H * (0.25 + f * 0.32) + this.time * 24) % (H + 120)) - 60;
        const hue = (this.time * 60 + f * 120) % 360;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(this.time * (f % 2 === 0 ? 0.55 : -0.55));
        ctx.strokeStyle = `hsl(${hue}, 95%, 68%)`;
        ctx.lineWidth = 2.5;
        for (let k = 0; k < 8; k++) {
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.ellipse(26, 0, 22, 9, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }

    // 2. УРОВЕНЬ 2 («Сектор Кошмаров»): Мрачные мигающие синусоиды и геометрические фигуры на фоне
    if (lvl.theme === 'horror') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < 4; s++) {
        const pulseAlpha = 0.12 + 0.22 * Math.abs(Math.sin(this.time * (2.5 + s * 0.6) + s));
        ctx.globalAlpha = pulseAlpha;
        ctx.strokeStyle = s % 2 === 0 ? '#ff002b' : '#9d0208';
        ctx.lineWidth = 3 + (s % 2) * 3;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * (0.18 + s * 0.22) +
            Math.sin(x * 0.014 + this.time * (s % 2 === 0 ? 2.1 : -1.8) + s) * (35 + s * 10);
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }

      // Мигающие мрачные геометрические ромбы и гексаграммы на фоне
      for (let g = 0; g < 3; g++) {
        const gx = W * (0.2 + g * 0.3) - this.camX * 20;
        const gy = ((H * (0.2 + g * 0.34) + this.time * 20) % (H + 140)) - 70;
        const blink = 0.14 + 0.24 * Math.abs(Math.sin(this.time * 3.8 + g * 2));
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(this.time * (g % 2 === 0 ? 0.4 : -0.4));
        ctx.globalAlpha = blink;
        ctx.strokeStyle = '#ff002b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-28, -28, 56, 56);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-28, -28, 56, 56);
        ctx.restore();
      }
      ctx.restore();
    }

    // 3. УРОВЕНЬ 3 («Радужный Поток»): Широкие радужные синусоиды от края до края
    if (lvl.theme === 'rainbow') {
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.lineCap = 'round';
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'];

      for (let ribbon = 0; ribbon < 2; ribbon++) {
        const baseY = H * (0.28 + ribbon * 0.44);
        rainbowBands.forEach((col, bIdx) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 14;
          ctx.beginPath();
          for (let x = -80; x <= W + 80; x += 16) {
            const sy = baseY + bIdx * 12 +
              Math.sin(x * 0.011 + this.time * (ribbon === 0 ? 1.8 : -1.5) + ribbon * 2.1) * 58;
            if (x === -80) ctx.moveTo(x, sy);
            else ctx.lineTo(x, sy);
          }
          ctx.stroke();
        });
      }
      ctx.restore();
    }

    // 4. УРОВЕНЬ 4 («Подводный Океан»): Пастельные синусоиды-волны и геометрические фигуры-пузыри
    if (lvl.theme === 'underwater') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.30;
      const pastelWaves = ['#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#caffbf'];

      pastelWaves.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 5 + (idx % 3) * 2.5;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * (0.15 + idx * 0.18) +
            Math.sin(x * (0.010 + idx * 0.002) + this.time * (idx % 2 === 0 ? 1.6 : -1.4) + idx) * (34 + idx * 7);
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });

      // Геометрические пастельные кольца-пузыри
      for (let b = 0; b < 4; b++) {
        const bx = W * (0.18 + b * 0.22) - this.camX * 24;
        const by = H - (((this.time * 26 + b * 190) % (H + 140)) - 70);
        const hue = 170 + Math.sin(this.time * 2 + b) * 45;
        ctx.strokeStyle = `hsl(${hue}, 95%, 78%)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(bx, by, 28 + (b % 2) * 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. УРОВЕНЬ 5 («Органический Мир»): Неоновые синусоиды-лианы с листочками от края до края
    if (lvl.theme === 'organic') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.34;
      const vineCols = ['#38b000', '#70e000', '#80ed99', '#ccff33'];

      vineCols.forEach((col, vIdx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 6 + (vIdx % 2) * 3;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * (0.18 + vIdx * 0.21) +
            Math.sin(x * 0.013 + this.time * (vIdx % 2 === 0 ? 1.5 : -1.7) + vIdx) * (42 + vIdx * 6);
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
