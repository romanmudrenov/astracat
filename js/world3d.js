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

    // Разнообразные 3D-планеты на фоне, сменяющие друг друга по ходу полёта
    this.planets = [
      { x: 0.22, y: 0.18, z: 0.35, r: 54, kind: 'ringed', speed: 0.022, hueShift: 0 },
      { x: 0.78, y: 0.58, z: 0.50, r: 38, kind: 'crater', speed: 0.032, hueShift: 90 },
      { x: 0.45, y: 0.88, z: 0.28, r: 44, kind: 'glow_orb', speed: 0.018, hueShift: 180 }
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
      if (p.y > 1.22) {
        p.y = -0.22;
        p.x = 0.15 + Math.random() * 0.70;
        p.kind = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        p.hueShift = (p.hueShift + 65) % 360;
      }
    }
  }

  // Отрисовка объёмных 3D-планет с кольцами, кратерами и атмосферой
  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 55);
    const py = p.y * H;
    const r = p.r;

    ctx.save();
    ctx.translate(px, py);

    // Неоновое атмосферное свечение вокруг планеты
    ctx.fillStyle = lvl.accent;
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2);
    ctx.fill();

    // Задняя дуга колец для Сатурноподобных гигантов
    if (p.kind === 'ringed') {
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    // Сферический 3D-корпус планеты
    ctx.globalAlpha = 0.82;
    const bodyCols = {
      lsd: ['#7209b7', '#f72585', '#4cc9f0'],
      horror: ['#2b091e', '#590d22', '#800f2f'],
      rainbow: ['#3a0ca3', '#4361ee', '#4cc9f0'],
      underwater: ['#023e8a', '#0077b6', '#00b4d8'],
      organic: ['#1b4332', '#2d6a4f', '#52b788']
    };
    const pal = bodyCols[lvl.theme] || bodyCols.lsd;

    ctx.fillStyle = pal[0];
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Освещённый 3D-серп планеты сверху слева
    ctx.fillStyle = pal[1];
    ctx.beginPath();
    ctx.arc(-r * 0.14, -r * 0.14, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = pal[2];
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.28, r * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // Детали рельефа планеты (кратеры или экваториальные пояса)
    if (p.kind === 'crater') {
      ctx.fillStyle = pal[0];
      [[-r * 0.25, r * 0.2, r * 0.18], [r * 0.3, -r * 0.1, r * 0.14], [r * 0.1, r * 0.35, r * 0.12]].forEach(([cx, cy, cr]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (p.kind === 'twin_moon') {
      // Малый спутник на орбите планеты
      const mx = Math.cos(this.time * 1.4) * (r * 1.45);
      const my = Math.sin(this.time * 1.4) * (r * 0.55);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(mx, my, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
    }

    // Передняя дуга колец поверх планеты
    if (p.kind === 'ringed') {
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.85, r * 0.42, -0.28, 0, Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  render(ctx, lvl, W, H) {
    // 1. Фон неба, плавно меняющий оттенок по мере прохождения уровня
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.5, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Плавная смена космического пейзажа по ходу уровня (4 фазы: Туманность -> Пояс колец -> Энерго-шторм -> Ядро)
    const phase = Math.floor((this.time * 0.045) % 4);
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = phase % 2 === 0 ? lvl.accent : (lvl.bossColor || '#7209b7');
    ctx.beginPath();
    ctx.ellipse(
      W * 0.5 - this.camX * 25,
      H * (0.25 + 0.2 * Math.sin(this.time * 0.3)),
      W * 0.65,
      H * 0.22,
      phase * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // 2. ДЛЯ 1-ГО УРОВНЯ (ЛСД): ЗА ПЛАНЕТАМИ ДВИЖУТСЯ НЕОНОВЫЕ СИНУСОИДЫ И ФРАКТАЛЫ
    if (lvl.theme === 'lsd') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.34;

      // Бегущие неоновые синусоиды на заднем плане
      for (let s = 0; s < 5; s++) {
        const hue = (this.time * 42 + s * 72) % 360;
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

      // Вращающиеся фрактальные мандалы за планетами
      for (let f = 0; f < 3; f++) {
        const fx = W * (0.22 + f * 0.28) - this.camX * 22;
        const fy = ((H * (0.25 + f * 0.32) + this.time * 24) % (H + 120)) - 60;
        const hue = (this.time * 55 + f * 120) % 360;
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

    // 3. Звёзды дальнего плана
    for (const s of this.stars) {
      const sx = ((s.x * W - this.camX * (s.z * 45)) % W + W) % W;
      const sy = s.y * H;
      ctx.globalAlpha = 0.35 + s.z * 0.45;
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.fillRect(sx, sy, s.r * 1.5, s.r * 1.5);
    }
    ctx.globalAlpha = 1;

    // 4. 3D-Планеты перед синусоидами и звёздами
    for (const p of this.planets) {
      this.drawPlanet3D(ctx, p, lvl, W, H);
    }
  }
}
