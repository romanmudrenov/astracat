'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;
    this.levelProgress = 0;

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

    // Специальные частицы для Радужного уровня (маленькие звёздочки, шоколадное печенье и глазированные пончики)
    this.sweetParticles = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.25,
      kind: i % 3 === 0 ? 'donut' : (i % 3 === 1 ? 'cookie' : 'star'),
      r: 6 + (i % 3) * 2.5,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.2,
      speed: 0.045 + (i % 3) * 0.035,
      hue: (i * 55) % 360
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
    this.levelProgress += dt * 0.012;
    const mult = turboActive ? 1.75 : 1.0;
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);

    for (const s of this.stars) {
      s.y += s.speed * mult * dt;
      if (s.y > 1.02) { s.y = -0.02; s.x = Math.random(); }
    }

    for (const sp of this.sweetParticles) {
      sp.y += sp.speed * mult * dt;
      sp.rot += sp.vrot * dt;
      if (sp.y > 1.06) {
        sp.y = -0.06;
        sp.x = Math.random();
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

    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.fillStyle = '#2b2333';
    ctx.strokeStyle = '#09040e';
    ctx.lineWidth = 3;
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

    const glow = 0.45 + 0.45 * Math.sin(this.time * 3 + px);
    ctx.fillStyle = `rgba(255, 0, 43, ${glow})`;
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.05, r * 0.09, 0, Math.PI * 2);
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
      pal = ['#023e8a', '#0077b6', '#00b4d8'];
    } else if (lvl.theme === 'organic') {
      pal = ['#1b4332', '#2d6a4f', '#52b788'];
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
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, 0, Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Отрисовка фоновых частиц звёздочек, шоколадного печенья и глазированных пончиков для Радужного уровня
  drawRainbowParticles(ctx, W, H) {
    ctx.save();
    for (const sp of this.sweetParticles) {
      const px = ((sp.x * W - this.camX * (sp.z * 48)) % W + W) % W;
      const py = sp.y * H;
      const r = sp.r;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(sp.rot);
      ctx.globalAlpha = 0.78;

      if (sp.kind === 'donut') {
        // Маленький пончик с розово-неоновой глазурью
        ctx.fillStyle = '#f4a261';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsl(${(sp.hue + this.time * 60) % 360}, 95%, 68%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1d1447';
        ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
      } else if (sp.kind === 'cookie') {
        // Печенье с шоколадной крошкой
        ctx.fillStyle = '#e09f3e';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3d1e05';
        [[-r * 0.35, -r * 0.25], [r * 0.3, -r * 0.2], [0, r * 0.35], [-r * 0.25, r * 0.25]].forEach(([cx, cy]) => {
          ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2); ctx.fill();
        });
      } else {
        // Маленькая неоновая звёздочка
        ctx.fillStyle = `hsl(${(sp.hue + this.time * 90) % 360}, 100%, 72%)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x1 = Math.cos(a) * r;
          const y1 = Math.sin(a) * r;
          const x2 = Math.cos(a + Math.PI / 5) * (r * 0.42);
          const y2 = Math.sin(a + Math.PI / 5) * (r * 0.42);
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
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

    // 1. УРОВЕНЬ 3 («Радужный Поток»): ШИРОКИЕ СИНУСОИДЫ В ВИДЕ РАДУГ ВО ВЕСЬ ФОН
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
          for (let x = -20; x <= W + 20; x += 18) {
            const sy = baseY + bIdx * 12 +
              Math.sin(x * 0.011 + this.time * 1.8 + ribbon * 2.1) * 58 -
              this.camX * 26;
            if (x === -20) ctx.moveTo(x, sy);
            else ctx.lineTo(x, sy);
          }
          ctx.stroke();
        });
      }
      ctx.restore();
    }

    if (lvl.theme === 'horror') {
      ctx.save();
      ctx.globalAlpha = 0.22;
      for (let i = 0; i < 4; i++) {
        const fy = ((this.time * (18 + i * 7) + i * 190) % (H + 160)) - 80;
        ctx.fillStyle = i % 2 === 0 ? '#3d000e' : '#050108';
        ctx.beginPath();
        ctx.ellipse(W * 0.5 + Math.sin(this.time + i) * 40, fy, W * 0.75, 42, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (lvl.theme === 'lsd') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.36;

      for (let s = 0; s < 5; s++) {
        const hue = (this.time * 48 + s * 72) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 14) {
          const sy = H * (0.14 + s * 0.18) +
            Math.sin(x * 0.016 + this.time * (2.2 + s * 0.3) + s) * 38 -
            this.camX * 18;
          if (x === 0) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }

      for (let f = 0; f < 3; f++) {
        const fx = W * (0.22 + f * 0.28) - this.camX * 22;
        const fy = ((H * (0.25 + f * 0.32) + this.time * 24) % (H + 120)) - 60;
        const hue = (this.time * 60 + f * 120) % 360;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(this.time * (f % 2 === 0 ? 0.55 : -0.55));
        ctx.strokeStyle = `hsl(${hue}, 95%, 68%)`;
        ctx.lineWidth = 2.5;
        const petals = 8;
        for (let k = 0; k < petals; k++) {
          ctx.rotate((Math.PI * 2) / petals);
          ctx.beginPath();
          ctx.ellipse(26, 0, 22, 9, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
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

    // Генерация частиц звёздочек, печенья и пончиков поверх фона на 3-м уровне
    if (lvl.theme === 'rainbow') {
      this.drawRainbowParticles(ctx, W, H);
    }
  }
}
