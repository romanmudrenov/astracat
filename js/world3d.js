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

  // Отрисовка мрачной 3D-планеты в форме ЧЕРЕПА для 2-го уровня (Хоррор)
  drawSkullPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);

    // Кроваво-чёрная аура вокруг планеты-черепа
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.32, 0, Math.PI * 2);
    ctx.fill();

    // Тёмный рельеф костяного черепа
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

    // Светлая 3D-выпуклость лба черепа
    ctx.fillStyle = '#4a3e56';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.25, r * 0.62, 0, Math.PI * 2);
    ctx.fill();

    // Зловещие провалы глазниц
    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.05, r * 0.24, r * 0.28, -0.15, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.05, r * 0.24, r * 0.28, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Пульсирующие красные зрачки в глазницах планеты
    const glow = 0.45 + 0.45 * Math.sin(this.time * 3 + px);
    ctx.fillStyle = `rgba(255, 0, 43, ${glow})`;
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Треугольная носовая впадина
    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.12);
    ctx.lineTo(-r * 0.14, r * 0.38);
    ctx.lineTo(r * 0.14, r * 0.38);
    ctx.closePath();
    ctx.fill();

    // Зубы челюсти планеты-черепа
    ctx.strokeStyle = '#07030a';
    ctx.lineWidth = 2.5;
    for (let k = -2; k <= 2; k++) {
      const tx = k * (r * 0.18);
      ctx.beginPath();
      ctx.moveTo(tx, r * 0.52);
      ctx.lineTo(tx, r * 0.80);
      ctx.stroke();
    }

    // Трещина на виске
    ctx.beginPath();
    ctx.moveTo(r * 0.45, -r * 0.65);
    ctx.lineTo(r * 0.22, -r * 0.42);
    ctx.lineTo(r * 0.35, -r * 0.28);
    ctx.stroke();

    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 55);
    const py = p.y * H;
    const r = p.r;

    // На 2-м уровне (Хоррор) все планеты рендерятся как жуткие планеты-черепа!
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
    if (lvl.theme === 'lsd') {
      const h1 = (this.time * 35 + p.hueShift) % 360;
      pal = [`hsl(${h1}, 80%, 32%)`, `hsl(${(h1 + 45) % 360}, 90%, 55%)`, `hsl(${(h1 + 95) % 360}, 95%, 72%)`];
    } else if (lvl.theme === 'rainbow') {
      pal = ['#3a0ca3', '#4361ee', '#4cc9f0'];
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

    if (p.kind === 'crater') {
      ctx.fillStyle = pal[0];
      [[-r * 0.25, r * 0.2, r * 0.18], [r * 0.3, -r * 0.1, r * 0.14], [r * 0.1, r * 0.35, r * 0.12]].forEach(([cx, cy, cr]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (p.kind === 'twin_moon') {
      const mx = Math.cos(this.time * 1.4) * (r * 1.45);
      const my = Math.sin(this.time * 1.4) * (r * 0.55);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(mx, my, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
    }

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

  render(ctx, lvl, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.5, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Мрачные багровые полосы тумана на 2-м уровне
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

    // Движущиеся за планетами синусоиды и фракталы на 1-м уровне («Туманность Узоров»)
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
  }
}
