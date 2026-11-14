'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    // 3 слоя мягких звёзд разной глубины (z: 0.2 .. 0.9)
    this.stars = Array.from({ length: 85 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.22 : (layer === 1 ? 0.55 : 0.90);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.1 : (layer === 1 ? 1.8 : 2.5),
        speed: 0.03 + z * 0.14,
        phase: Math.random() * Math.PI * 2
      };
    });

    // Далёкие приглушённые 3D-силуэты (без чёрной обводки, полупрозрачные, чтобы не спорить с врагами)
    this.distantBodies = Array.from({ length: 4 }, (_, i) => {
      const z = 0.28 + i * 0.16;
      return {
        baseX: 0.18 + ((i * 0.23) % 0.68),
        y: (i * 0.27) % 1.0,
        z,
        r: 28 + z * 34,
        speed: 0.02 + z * 0.04,
        variant: i
      };
    });

    // Лёгкие линии космического потока для ощущения скорости
    this.dust = Array.from({ length: 16 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 12 + Math.random() * 20,
      speed: 0.34 + Math.random() * 0.24,
      alpha: 0.10 + Math.random() * 0.16
    }));
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const speedMult = turboActive ? 1.75 : 1.0;

    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.2);

    for (const s of this.stars) {
      s.y += s.speed * speedMult * dt;
      if (s.y > 1.02) {
        s.y = -0.02;
        s.x = Math.random();
      }
    }

    for (const b of this.distantBodies) {
      b.y += b.speed * speedMult * dt;
      if (b.y > 1.18) {
        b.y = -0.18;
        b.baseX = 0.15 + Math.random() * 0.70;
      }
    }

    for (const d of this.dust) {
      d.y += d.speed * speedMult * dt;
      if (d.y > 1.05) {
        d.y = -0.05;
        d.x = Math.random();
      }
    }
  }

  drawDistantBody(ctx, lvl, b, W, H) {
    const px = b.baseX * W - this.camX * (b.z * 65);
    const py = b.y * H;
    const r = b.r;

    ctx.save();
    ctx.translate(px, py);
    // Приглушаем силуэт, чтобы фон оставался глубоким и не отвлекал от геймплея
    ctx.globalAlpha = 0.22;

    // 3D-сфера с мягким градиентным освещением и тенью (без обводки!)
    const sphereGrad = ctx.createRadialGradient(-r * 0.32, -r * 0.32, r * 0.1, 0, 0, r);
    sphereGrad.addColorStop(0, lvl.accent);
    sphereGrad.addColorStop(0.55, lvl.skyBot);
    sphereGrad.addColorStop(1, '#090617');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Далёкое мягкое кольцо у части планет
    if (b.variant % 2 === 0) {
      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 2, r * 1.75, r * 0.32, -0.22, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  render(ctx, lvl, W, H, turboActive = false) {
    // 1. Глубокий космический градиент неба
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.55, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 2. Мягкие космические туманности со слабым параллаксом
    const neb1 = ctx.createRadialGradient(
      W * 0.28 - this.camX * 20, H * 0.30, 10,
      W * 0.28 - this.camX * 20, H * 0.30, 210
    );
    neb1.addColorStop(0, lvl.nebula1);
    neb1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, W, H);

    const neb2 = ctx.createRadialGradient(
      W * 0.75 - this.camX * 28, H * 0.68, 10,
      W * 0.75 - this.camX * 28, H * 0.68, 230
    );
    neb2.addColorStop(0, lvl.nebula2);
    neb2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, W, H);

    // 3. Дальние приглушённые 3D-планеты (без сетки и без резких линий)
    for (const b of this.distantBodies) {
      this.drawDistantBody(ctx, lvl, b, W, H);
    }

    // 4. Многослойные звёзды с параллаксом
    for (const s of this.stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(this.time * 3.5 + s.phase);
      const sx = ((s.x * W - this.camX * (s.z * 50)) % W + W) % W;
      const sy = s.y * H;

      ctx.globalAlpha = twinkle * (0.45 + s.z * 0.45);
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 5. Тонкие потоки скорости
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    for (const d of this.dust) {
      const dx = ((d.x * W - this.camX * 105) % W + W) % W;
      const dy = d.y * H;
      ctx.globalAlpha = turboActive ? d.alpha * 1.9 : d.alpha;
      ctx.lineWidth = turboActive ? 2 : 1.2;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx, dy + d.len * (turboActive ? 1.8 : 1));
      ctx.stroke();
    }
    ctx.restore();
  }
}
