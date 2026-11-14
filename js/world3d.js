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
    // 1. Базовый фон неба / среды
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.5, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    const theme = lvl.theme;

    if (theme === 'lsd') {
      // 1. ЛСД-стиль: плавные психоделические фрактальные волны и спиральные круги на фоне
      ctx.globalAlpha = 0.24;
      for (let i = 0; i < 5; i++) {
        const hue = (this.time * 45 + i * 72) % 360;
        const cx = W * 0.5 + Math.sin(this.time * 1.2 + i) * (W * 0.32) - this.camX * 35;
        const cy = H * (0.2 + i * 0.18);
        const rad = 75 + Math.sin(this.time * 2.5 + i) * 25;
        ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `hsl(${(hue + 140) % 360}, 85%, 65%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, rad * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (theme === 'horror') {
      // 2. Мрачный хоррор: кровавый туман, ползущие тени и жуткие силуэты глаз в темноте
      ctx.globalAlpha = 0.25;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#07020a';
        ctx.beginPath();
        ctx.arc(px, py, el.r * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Светящиеся красные глаза в тумане
        if (Math.sin(this.time * 2 + el.phase) > 0.2) {
          ctx.fillStyle = '#ff002b';
          ctx.beginPath();
          ctx.arc(px - 8, py, 2.5, 0, Math.PI * 2);
          ctx.arc(px + 8, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (theme === 'rainbow') {
      // 3. Радужный уровень: мягкие диагональные радужные ленты
      const rainbowCols = ['#ff5964', '#ff9f1c', '#ffd166', '#06d6a0', '#48dbfb', '#bdb2ff'];
      ctx.globalAlpha = 0.16;
      rainbowCols.forEach((c, idx) => {
        ctx.fillStyle = c;
        const waveX = Math.sin(this.time * 1.5 + idx * 0.5) * 30 - this.camX * 25;
        ctx.fillRect(waveX + (idx * W) / 6, 0, W / 6 + 12, H);
      });
    } else if (theme === 'ship_interior') {
      // 4. Технологичный объект внутри звездолёта: переборки, шлюзы и бегущие энерго-шины
      ctx.globalAlpha = 0.26;
      ctx.strokeStyle = '#48dbfb';
      ctx.lineWidth = 3;
      const offsetX = -this.camX * 40;
      // Боковые стены коридора корабля
      ctx.fillStyle = '#0d1b2a';
      ctx.fillRect(0, 0, 26 + offsetX * 0.3, H);
      ctx.fillRect(W - 26 + offsetX * 0.3, 0, 26 - offsetX * 0.3, H);

      // Поперечные секции палубы
      const stepY = 120;
      const scrollY = (this.time * (turboActive ? 160 : 85)) % stepY;
      for (let y = -stepY; y < H + stepY; y += stepY) {
        const py = y + scrollY;
        ctx.beginPath();
        ctx.moveTo(26, py);
        ctx.lineTo(W - 26, py);
        ctx.stroke();
        ctx.strokeRect(W * 0.25 + offsetX * 0.5, py + 20, W * 0.5, 65);
      }
    } else if (theme === 'frozen') {
      // 5. Замёрзшие планеты: ледяные гиганты и снежная вьюга
      ctx.globalAlpha = 0.24;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 55);
        const py = el.y * H;
        ctx.fillStyle = '#90e0ef';
        ctx.beginPath();
        ctx.arc(px, py, el.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px - el.r * 0.2, py - el.r * 0.2, el.r * 0.5, 0, Math.PI);
        ctx.stroke();
      }
    } else if (theme === 'candy') {
      // 6. Сахарная вата и конфеты: мягкие пастельные облака ваты
      ctx.globalAlpha = 0.22;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#ffc8dd';
        ctx.beginPath();
        ctx.arc(px, py, el.r, 0, Math.PI * 2);
        ctx.arc(px - el.r * 0.6, py + 6, el.r * 0.7, 0, Math.PI * 2);
        ctx.arc(px + el.r * 0.6, py + 6, el.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'underwater') {
      // 7. Подводный уровень: лучи света сквозь толщу воды и поднимающиеся пузыри
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#90e0ef';
      for (let i = 0; i < 4; i++) {
        const rx = W * (0.15 + i * 0.24) - this.camX * 30;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx + 45, 0);
        ctx.lineTo(rx + 110, H);
        ctx.lineTo(rx - 35, H);
        ctx.closePath();
        ctx.fill();
      }
      // Пузыри поднимаются вверх
      ctx.globalAlpha = 0.30;
      ctx.strokeStyle = '#caf0f8';
      ctx.lineWidth = 2;
      for (const el of this.bgElements) {
        const px = el.x * W + Math.sin(this.time * 3 + el.phase) * 14 - this.camX * 45;
        const py = H - ((el.y * H + this.time * 60) % H);
        ctx.beginPath();
        ctx.arc(px, py, el.r * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (theme === 'volcano') {
      // 8. Вулканный уровень: раскалённые трещины магмы и поднимающийся пепел
      ctx.globalAlpha = 0.24;
      ctx.strokeStyle = '#ff9f1c';
      ctx.lineWidth = 3;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#370617';
        ctx.beginPath();
        ctx.arc(px, py, el.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px - el.r * 0.6, py);
        ctx.lineTo(px, py + 8);
        ctx.lineTo(px + el.r * 0.6, py - 5);
        ctx.stroke();
      }
    } else if (theme === 'diamond') {
      // 9. Бриллиантовый уровень: сверкающие огранённые ромбы на фоне
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = 'rgba(202, 240, 248, 0.25)';
      ctx.lineWidth = 2;
      for (const el of this.bgElements) {
        const px = el.x * W - this.camX * (el.z * 55);
        const py = el.y * H;
        const r = el.r * 0.85;
        ctx.beginPath();
        ctx.moveTo(px, py - r);
        ctx.lineTo(px + r * 0.75, py);
        ctx.lineTo(px, py + r);
        ctx.lineTo(px - r * 0.75, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // 10. Органический уровень: пульсирующие био-мембраны и клетки
      ctx.globalAlpha = 0.22;
      for (const el of this.bgElements) {
        const pulse = 1 + Math.sin(this.time * 3 + el.phase) * 0.12;
        const px = el.x * W - this.camX * (el.z * 50);
        const py = el.y * H;
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.arc(px, py, el.r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.arc(px + 6, py + 4, el.r * 0.35 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Звёзды / частицы среды
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
