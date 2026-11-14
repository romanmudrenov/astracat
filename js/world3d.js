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
        speed: 0.03 + z * 0.14,
        phase: Math.random() * Math.PI * 2
      };
    });

    this.bgElements = Array.from({ length: 6 }, (_, i) => ({
      x: 0.12 + ((i * 0.19) % 0.78),
      y: (i * 0.18) % 1.0,
      z: 0.3 + (i % 3) * 0.2,
      r: 26 + (i % 3) * 16,
      speed: 0.025 + (i % 3) * 0.025,
      phase: i * 1.1
    }));
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
    for (const el of this.bgElements) {
      el.y += el.speed * mult * dt;
      if (el.y > 1.15) { el.y = -0.15; el.x = 0.12 + Math.random() * 0.76; }
    }
  }

  render(ctx, lvl, W, H, turboActive = false) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.5, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    const theme = lvl.theme;

    if (theme === 'lsd') {
      // 1. ЛСД-СТИЛЬ: Движущиеся за планетами синусоиды и вращающиеся фракталы с неоновой подсветкой
      ctx.globalAlpha = 0.30;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 40);
        const py = el.y * H;
        // Планета на заднем плане
        ctx.fillStyle = '#4a154b';
        ctx.beginPath();
        ctx.arc(px, py, el.r * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Синусоидальные волны за планетами
      ctx.lineWidth = 6;
      for (let s = 0; s < 4; s++) {
        const waveHue = (this.time * 30 + s * 90) % 360;
        ctx.strokeStyle = `hsl(${waveHue}, 80%, 70%)`;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 15) {
          const sy = H * (0.2 + s * 0.2) + Math.sin(x * 0.012 + this.time * 2 + s) * 45 - this.camX * 20;
          if (x === 0) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }

      // Вращающиеся фрактальные кольца
      ctx.globalAlpha = 0.22;
      for (let i = 0; i < 3; i++) {
        const cx = W * (0.25 + i * 0.25) - this.camX * 30;
        const cy = H * (0.3 + i * 0.25);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.time * (i % 2 === 0 ? 0.6 : -0.6));
        ctx.strokeStyle = i === 0 ? '#9bf6ff' : (i === 1 ? '#ffadad' : '#ffd6a5');
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const r1 = 35 + Math.sin(this.time * 3 + a) * 12;
          const r2 = 55;
          ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        }
        ctx.stroke();
        ctx.restore();
      }
    } else if (theme === 'horror') {
      ctx.globalAlpha = 0.25;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#07020a';
        ctx.beginPath();
        ctx.arc(px, py, el.r * 1.4, 0, Math.PI * 2);
        ctx.fill();
        if (Math.sin(this.time * 2 + el.phase) > 0.2) {
          ctx.fillStyle = '#ff002b';
          ctx.beginPath();
          ctx.arc(px - 8, py, 2.5, 0, Math.PI * 2);
          ctx.arc(px + 8, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (theme === 'rainbow') {
      const rainbowCols = ['#ff5964', '#ff9f1c', '#ffd166', '#06d6a0', '#48dbfb', '#bdb2ff'];
      ctx.globalAlpha = 0.16;
      rainbowCols.forEach((c, idx) => {
        ctx.fillStyle = c;
        const waveX = Math.sin(this.time * 1.5 + idx * 0.5) * 30 - this.camX * 25;
        ctx.fillRect(waveX + (idx * W) / 6, 0, W / 6 + 12, H);
      });
    } else if (theme === 'underwater') {
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#90e0ef';
      for (let i = 0; i < 4; i++) {
        const rx = W * (0.15 + i * 0.24) - this.camX * 30;
        ctx.beginPath();
        ctx.moveTo(rx, 0); ctx.lineTo(rx + 45, 0); ctx.lineTo(rx + 110, H); ctx.lineTo(rx - 35, H);
        ctx.closePath(); ctx.fill();
      }
    } else {
      ctx.globalAlpha = 0.22;
      for (const el of this.bgElements) {
        const pulse = 1 + Math.sin(this.time * 3 + el.phase) * 0.12;
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#52b788';
        ctx.beginPath(); ctx.arc(px, py, el.r * pulse, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();

    for (const s of this.stars) {
      const sx = ((s.x * W - this.camX * (s.z * 45)) % W + W) % W;
      const sy = s.y * H;
      ctx.globalAlpha = 0.35 + s.z * 0.45;
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.fillRect(sx, sy, s.r * 1.5, s.r * 1.5);
    }
    ctx.globalAlpha = 1;
  }
}
