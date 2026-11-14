'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0; // Текущее смещение камеры по горизонтали (-1 .. +1)
    this.targetCamX = 0;
    this.time = 0;

    // 3 слоя звёзд разной глубины (z: 0.25 - дальние, 0.55 - средние, 0.95 - ближние)
    this.stars = Array.from({ length: 75 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.58 : 0.95);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.3 : (layer === 1 ? 2.1 : 3.0),
        speed: 0.04 + z * 0.16,
        phase: Math.random() * Math.PI * 2
      };
    });

    // Объёмные 2.5D-объекты на заднем плане с координатой глубины z
    this.props = Array.from({ length: 7 }, (_, i) => {
      const z = 0.35 + (i % 3) * 0.24; // 0.35 .. 0.83
      return {
        baseX: 0.12 + ((i * 0.17) % 0.78),
        y: (i * 0.16) % 1.0,
        z,
        r: 22 + z * 28,
        speed: 0.03 + z * 0.065,
        rot: Math.random() * Math.PI * 2,
        vrot: (i % 2 === 0 ? 1 : -1) * (0.25 + z * 0.35),
        variant: i
      };
    });

    // Ближние потоки скорости (пыль / искры / снежинки)
    this.dust = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 10 + Math.random() * 18,
      speed: 0.38 + Math.random() * 0.28,
      alpha: 0.15 + Math.random() * 0.25
    }));
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    // Нормализованное отклонение от центра (-1 .. +1)
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const speedMult = turboActive ? 1.85 : 1.0;

    // Плавная инерция камеры 2.5D
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);

    for (const s of this.stars) {
      s.y += s.speed * speedMult * dt;
      if (s.y > 1.02) {
        s.y = -0.02;
        s.x = Math.random();
      }
    }

    for (const pr of this.props) {
      pr.y += pr.speed * speedMult * dt;
      pr.rot += pr.vrot * dt;
      if (pr.y > 1.15) {
        pr.y = -0.15;
        pr.baseX = 0.1 + Math.random() * 0.8;
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

  // Перспективная 2.5D-сетка / рельеф в нижней части экрана
  drawPerspectiveFloor(ctx, lvl, W, H, turboActive) {
    const horizonY = H * 0.28;
    const vanishX = W * 0.5 - this.camX * (W * 0.18);
    const speed = (turboActive ? 2.4 : 1.2) * this.time;

    ctx.save();
    // Мягкая дымка горизонта
    const fog = ctx.createLinearGradient(0, horizonY - 30, 0, H);
    fog.addColorStop(0, 'rgba(0,0,0,0)');
    fog.addColorStop(0.35, lvl.nebula1);
    fog.addColorStop(1, lvl.nebula2);
    ctx.fillStyle = fog;
    ctx.fillRect(0, horizonY - 30, W, H - horizonY + 30);

    // Продольные перспективные лучи (уходят в точку схода)
    const rayCount = 10;
    ctx.strokeStyle = lvl.accent;
    ctx.lineWidth = 1.4;
    for (let i = -rayCount; i <= rayCount; i++) {
      const spread = (i / rayCount) * W * 1.45;
      const bottomX = W * 0.5 + spread - this.camX * (W * 0.32);
      ctx.globalAlpha = lvl.theme === 'cyber' ? 0.22 : 0.08;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizonY);
      ctx.lineTo(bottomX, H);
      ctx.stroke();
    }

    // Поперечные линии глубины с квадратичным ускорением к зрителю (эффект 3D-скорости)
    const rowCount = 9;
    for (let r = 0; r < rowCount; r++) {
      const tRaw = ((r + (speed % 1)) / rowCount);
      const tPersp = Math.pow(tRaw, 2.1); // Нелинейное перспективное приближение
      const y = horizonY + tPersp * (H - horizonY);
      ctx.globalAlpha = (lvl.theme === 'cyber' ? 0.26 : 0.09) * tPersp;
      ctx.lineWidth = 1 + tPersp * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Отрисовка объёмного 2.5D-объекта с тенью, толщиной и смещением перспективы
  drawProp25D(ctx, lvl, pr, W, H) {
    // Смещение X зависит от глубины z и угла поворота камеры camX
    const parallaxOffset = -this.camX * (pr.z * 95);
    const px = pr.baseX * W + parallaxOffset;
    const py = pr.y * H;

    // Лёгкое перспективное увеличение по мере приближения к нижней части экрана
    const perspScale = 0.85 + pr.y * 0.28;
    const r = pr.r * perspScale;

    // Вектор 2.5D-экструзии (толщины) зависит от положения объекта относительно камеры
    const extX = ((px - W * 0.5) / W) * 14 * pr.z;
    const extY = 7 * pr.z;

    ctx.save();
    ctx.translate(px, py);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (lvl.theme === 'candy') {
      // Объёмный 2.5D леденец с толщиной карамели
      ctx.rotate(pr.rot);
      // Палочка с тенью
      ctx.fillStyle = '#d8cbb8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.fillRect(-3 + extX * 0.4, r * 0.5, 7, r * 0.95);
      ctx.strokeRect(-3 + extX * 0.4, r * 0.5, 7, r * 0.95);

      // Задний объёмный слой карамели
      ctx.fillStyle = '#c9184a';
      ctx.beginPath();
      ctx.arc(extX, extY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Лицевой диск
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ff4d6d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.62, 0, Math.PI * 1.4);
      ctx.stroke();

    } else if (lvl.theme === 'donuts') {
      // Объёмный 2.5D космический пончик
      ctx.rotate(pr.rot);
      // Нижняя поджаристая часть пончика (3D-толщина)
      ctx.fillStyle = '#bc6c25';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(extX, extY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Основное тесто
      ctx.fillStyle = '#f4a261';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Глазурь
      ctx.fillStyle = pr.variant % 2 === 0 ? '#ff70a6' : '#4cc9f0';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
      ctx.fill();

      // Отверстие в центре
      ctx.fillStyle = lvl.skyMid;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    } else if (lvl.theme === 'jungle') {
      // Объёмная космо-медуза со светящимся куполом
      const pulse = Math.sin(this.time * 3.2 + pr.variant) * 3.5;
      ctx.strokeStyle = '#c7f9cc';
      ctx.lineWidth = 3;
      [-12, -4, 4, 12].forEach((ox, idx) => {
        ctx.beginPath();
        ctx.moveTo(ox, 0);
        ctx.quadraticCurveTo(
          ox + Math.sin(this.time * 4 + idx) * 6,
          r * 0.6,
          ox - Math.sin(this.time * 4 + idx) * 5,
          r * 1.1
        );
        ctx.stroke();
      });

      // Тень купола
      ctx.fillStyle = '#2d6a4f';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(extX * 0.6, extY * 0.7, r + pulse, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Купол
      ctx.fillStyle = '#80ed99';
      ctx.beginPath();
      ctx.arc(0, 0, r + pulse, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (lvl.theme === 'ice') {
      // 3D-кристалл льда с тремя гранями
      ctx.rotate(pr.rot);
      const topY = -r * 1.15;
      const botY = r * 1.05;
      const sideX = r * 0.72;

      // Левая теневая грань
      ctx.fillStyle = '#48cae4';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, topY);
      ctx.lineTo(-sideX, 0);
      ctx.lineTo(0, botY);
      ctx.lineTo(extX * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Правая светлая грань
      ctx.fillStyle = '#caf0f8';
      ctx.beginPath();
      ctx.moveTo(0, topY);
      ctx.lineTo(sideX, 0);
      ctx.lineTo(0, botY);
      ctx.lineTo(extX * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (lvl.theme === 'lava') {
      // 2.5D-вулканический метеор с раскалённым ядром
      ctx.fillStyle = '#1f030c';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(extX, extY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#590d22';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ffba08';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -5);
      ctx.lineTo(-4, 6);
      ctx.lineTo(12, -5);
      ctx.lineTo(r * 0.65, 8);
      ctx.stroke();

    } else if (lvl.theme === 'cyber') {
      // 3D-каркасный куб (соединяем передний и задний квадраты рёбрами)
      ctx.rotate(pr.rot);
      const s = r * 0.65;
      const bx = extX * 1.3;
      const by = extY * 1.3;

      ctx.strokeStyle = '#f15bb5';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-s + bx, -s + by, s * 2, s * 2);

      // Рёбра глубины
      const corners = [[-s, -s], [s, -s], [s, s], [-s, s]];
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.55)';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + bx, cy + by);
        ctx.stroke();
      });

      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 3;
      ctx.strokeRect(-s, -s, s * 2, s * 2);

    } else if (lvl.theme === 'desert') {
      // Настоящая 2.5D-пирамида со смещением вершины при движении камеры
      const apexX = -this.camX * 22 * pr.z;
      const apexY = -r * 0.95;
      const baseLeftX = -r * 1.05;
      const baseRightX = r * 1.05;
      const baseY = r * 0.72;

      // Теневая грань пирамиды
      ctx.fillStyle = '#ca6702';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.lineTo(baseRightX, baseY);
      ctx.lineTo(0, baseY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Освещённая грань пирамиды
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.lineTo(baseLeftX, baseY);
      ctx.lineTo(0, baseY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (lvl.theme === 'ghost') {
      // Двойное 2.5D-руническое кольцо
      ctx.rotate(pr.rot);
      ctx.strokeStyle = 'rgba(114, 239, 221, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(extX, extY, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#bdb2ff';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (lvl.theme === 'citadel') {
      // Объёмная 2.5D-шестерня Цитадели
      ctx.rotate(pr.rot);
      const drawGear = (ox, oy, fill) => {
        ctx.fillStyle = fill;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        const teeth = 8;
        ctx.beginPath();
        for (let i = 0; i < teeth * 2; i++) {
          const a = (Math.PI * i) / teeth;
          const rad = i % 2 === 0 ? r * 1.05 : r * 0.78;
          const gx = ox + Math.cos(a) * rad;
          const gy = oy + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      drawGear(extX, extY, '#2b0510');
      drawGear(0, 0, '#590d22');

      ctx.fillStyle = '#ff006e';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    } else {
      // Сектор 1: Объёмная 2.5D-планета с тенью полумесяца и наклонным 3D-кольцом
      const planetColor = pr.variant % 2 === 0 ? '#ff8fab' : '#4cc9f0';
      const shadowColor = pr.variant % 2 === 0 ? '#c9184a' : '#0077b6';

      // Задняя дуга кольца
      if (pr.variant % 2 === 0) {
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 2, r * 1.68, r * 0.36, -0.25, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      // Сфера планеты
      ctx.fillStyle = planetColor;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Объёмная тень внутри сферы (clip)
      ctx.save();
      ctx.clip();
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      ctx.arc(r * 0.38 + extX * 0.5, r * 0.25, r * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Блик сверху слева
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Повторная обводка контура планеты
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Передняя дуга кольца (перекрывает планету — настоящий 2.5D эффект)
      if (pr.variant % 2 === 0) {
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 2, r * 1.68, r * 0.36, -0.25, 0, Math.PI);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  render(ctx, lvl, W, H, turboActive = false) {
    // 1. Базовый градиент неба
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lvl.skyTop);
    grad.addColorStop(0.55, lvl.skyMid);
    grad.addColorStop(1, lvl.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 2. Дальние туманности со слабым параллаксом
    ctx.fillStyle = lvl.nebula1;
    ctx.beginPath();
    ctx.arc(W * 0.25 - this.camX * 22, H * 0.28, 185, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lvl.nebula2;
    ctx.beginPath();
    ctx.arc(W * 0.78 - this.camX * 30, H * 0.65, 210, 0, Math.PI * 2);
    ctx.fill();

    // 3. Перспективная 2.5D-плоскость внизу
    this.drawPerspectiveFloor(ctx, lvl, W, H, turboActive);

    // 4. Многослойные звёзды с параллаксом по глубине z
    for (const s of this.stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(this.time * 4 + s.phase);
      const sx = ((s.x * W - this.camX * (s.z * 55)) % W + W) % W;
      const sy = s.y * H;

      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.z > 0.8 ? lvl.accent : '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 5. Объёмные 2.5D-объекты, отсортированные от дальних к ближним (Painter's algorithm)
    const sortedProps = [...this.props].sort((a, b) => a.z - b.z);
    for (const pr of sortedProps) {
      this.drawProp25D(ctx, lvl, pr, W, H);
    }

    // 6. Ближние линии скорости (эффект полёта сквозь пространство)
    ctx.save();
    ctx.strokeStyle = lvl.accent;
    ctx.lineCap = 'round';
    for (const d of this.dust) {
      const dx = ((d.x * W - this.camX * 115) % W + W) % W;
      const dy = d.y * H;
      ctx.globalAlpha = turboActive ? d.alpha * 1.8 : d.alpha;
      ctx.lineWidth = turboActive ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx, dy + d.len * (turboActive ? 1.8 : 1));
      ctx.stroke();
    }
    ctx.restore();
  }
}
