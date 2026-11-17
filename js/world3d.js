'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    // 110 мигающих неоновых звёзд и искр
    this.stars = Array.from({ length: 110 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.58 : 0.92);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.3 : (layer === 1 ? 2.1 : 2.9),
        speed: 0.035 + z * 0.16,
        phase: Math.random() * Math.PI * 2,
        blinkSpd: 3.0 + (i % 5) * 1.4,
        hueOffset: (i * 37) % 360
      };
    });

    // 14 крупных вращающихся фракталов, мандал и тематических узоров
    this.geoShapes = Array.from({ length: 14 }, (_, i) => ({
      x: ((i % 4) + 0.5) / 4 + (Math.random() - 0.5) * 0.12,
      y: (i / 14) + Math.random() * 0.06,
      z: 0.28 + (i % 3) * 0.24,
      kind: i % 4,
      size: 24 + (i % 4) * 11,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.55 + (i % 3) * 0.35),
      speed: 0.032 + (i % 3) * 0.02,
      phase: i * 0.95
    }));

    // 52 тематические светящиеся частицы для плотного потока на каждом уровне
    this.themeParticles = Array.from({ length: 52 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.32 + (i % 3) * 0.28,
      kindIdx: i % 4,
      r: 4.5 + (i % 4) * 2.1,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (1.2 + Math.random() * 2.4),
      speed: 0.05 + (i % 4) * 0.035,
      drift: (Math.random() - 0.5) * 0.08,
      hue: (i * 43) % 360,
      phase: Math.random() * Math.PI * 2
    }));

    // 3 крупные тематические планеты с орбитальными кольцами
    this.planets = [
      { x: 0.24, y: 0.18, z: 0.36, r: 56, kind: 'main', speed: 0.024, hueShift: 0 },
      { x: 0.77, y: 0.54, z: 0.52, r: 44, kind: 'secondary', speed: 0.032, hueShift: 110 },
      { x: 0.42, y: 0.88, z: 0.28, r: 48, kind: 'tertiary', speed: 0.020, hueShift: 220 }
    ];
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const mult = turboActive ? 1.85 : 1.0;
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);

    for (const s of this.stars) {
      s.y += s.speed * mult * dt;
      s.phase += s.blinkSpd * dt;
      if (s.y > 1.03) {
        s.y = -0.03;
        s.x = Math.random();
      }
    }

    for (const g of this.geoShapes) {
      g.y += g.speed * mult * dt;
      g.rot += g.vrot * dt;
      g.phase += dt * 3.0;
      if (g.y > 1.14) {
        g.y = -0.14;
        g.x = 0.08 + Math.random() * 0.84;
      }
    }

    for (const tp of this.themeParticles) {
      tp.y += tp.speed * mult * dt;
      tp.x = (tp.x + tp.drift * dt + 1.0) % 1.0;
      tp.rot += tp.vrot * dt;
      tp.phase += dt * 4.8;
      if (tp.y > 1.08) {
        tp.y = -0.08;
        tp.x = Math.random();
      }
    }

    for (const p of this.planets) {
      p.y += p.speed * mult * dt;
      if (p.y > 1.26) {
        p.y = -0.26;
        p.x = 0.16 + Math.random() * 0.68;
        p.hueShift = (p.hueShift + 75) % 360;
      }
    }
  }

  getDynamicSkyColors(lvl) {
    const palettesByTheme = {
      lsd: [
        ['#1b053b', '#4a0c7a', '#8c1482'],
        ['#2b064d', '#6b0d85', '#b5198c'],
        ['#111552', '#39198a', '#7c1899']
      ],
      horror: [
        ['#160429', '#3b0836', '#6e0d2e'],
        ['#1c0633', '#4d0a3b', '#801326'],
        ['#120830', '#2d0c4f', '#6b0b38']
      ],
      rainbow: [
        ['#26186b', '#482ba3', '#7d44c7'],
        ['#341b75', '#6434b5', '#a352d6']
      ],
      underwater: [
        ['#062642', '#0e557d', '#198ca6'],
        ['#093254', '#146b94', '#22a6bf']
      ],
      organic: [
        ['#042610', '#0d5426', '#19823b'],
        ['#073017', '#136933', '#229c4e']
      ],
      mushroom: [
        ['#210442', '#590878', '#a31288'],
        ['#111954', '#490982', '#b80468'],
        ['#28053b', '#6d18b0', '#cc18ad']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const idx = Math.floor((this.time / 8) % list.length);
    return list[idx];
  }

  // =========================================================================
  // МНОГОСЛОЙНЫЕ СВЕТЯЩИЕСЯ СИНУСОИДЫ И ВОЛНЫ ДЛЯ КАЖДОГО УРОВНЯ
  // =========================================================================
  drawThemeSineWaves(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    if (lvl.theme === 'lsd') {
      // 1. ЛСД: 6 переливающихся радужно-неоновых синусоид + светящиеся узлы
      for (let s = 0; s < 6; s++) {
        const yBase = H * (0.12 + s * 0.155);
        const amp = 34 + (s % 3) * 18;
        const freq = 0.011 + (s % 2) * 0.006;
        const speed = (s % 2 === 0 ? 1 : -1) * (2.1 + s * 0.35);
        const hue = (this.time * 95 + s * 60) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.globalAlpha = 0.44;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 12) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        // Тонкая неоновая сердцевина
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.32;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    } else if (lvl.theme === 'horror') {
      // 2. Мексиканский стиль: яркие праздничные синусоиды Калавера с цветами
      const fiestaCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 32 + (s % 2) * 18;
        const freq = 0.013 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.2 : -1.9);
        const col = fiestaCols[s % fiestaCols.length];

        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s * 1.4) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        // Мигающие огоньки-бархатцы вдоль волны
        ctx.fillStyle = fiestaCols[(s + 1) % fiestaCols.length];
        ctx.globalAlpha = 0.55 + 0.35 * Math.sin(this.time * 6 + s);
        for (let x = 25; x < W; x += 85) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s * 1.4) * amp;
          ctx.beginPath();
          ctx.arc(x, sy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (lvl.theme === 'rainbow') {
      // 3. Радужный и конфетный мир: 2 мощные 6-полосные радуги + карамельные волны
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#c77dff'];
      [0.24, 0.68].forEach((yFrac, rIdx) => {
        const dir = rIdx === 0 ? 1 : -1;
        rainbowBands.forEach((col, bIdx) => {
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.34;
          ctx.lineWidth = 9;
          ctx.beginPath();
          for (let x = -40; x <= W + 40; x += 14) {
            const sy = H * yFrac + bIdx * 9 + Math.sin(x * 0.011 + this.time * 2.1 * dir + rIdx) * 48;
            if (x === -40) ctx.moveTo(x, sy);
            else ctx.lineTo(x, sy);
          }
          ctx.stroke();
        });
      });
    } else if (lvl.theme === 'underwater') {
      // 4. Пастельный океан: 6 светящихся синусоид морских волн с гребнями
      const seaCols = ['#00f5d4', '#48cae4', '#9bf6ff', '#72efdd', '#64dfdf', '#b8c0ff'];
      for (let s = 0; s < 6; s++) {
        const yBase = H * (0.12 + s * 0.155);
        const amp = 26 + (s % 3) * 14;
        const freq = 0.014 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.4 : -1.8);

        ctx.strokeStyle = seaCols[s % seaCols.length];
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 12) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp + Math.cos(x * 0.025 - this.time * 2) * 8;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    } else if (lvl.theme === 'organic') {
      // 5. Био-флора: 5 вьющихся растительных синусоид-лиан с листьями на волнах
      const plantCols = ['#38b000', '#80ed99', '#ccff33', '#06d6a0', '#ffd166'];
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 36 + (s % 2) * 16;
        const freq = 0.012 + s * 0.002;
        const speed = (s % 2 === 0 ? 1.9 : -1.6);

        ctx.strokeStyle = plantCols[s % plantCols.length];
        ctx.globalAlpha = 0.44;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        // Светящиеся листочки вдоль лианы
        ctx.fillStyle = '#ccff33';
        ctx.globalAlpha = 0.48;
        for (let x = 30; x < W; x += 75) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          ctx.beginPath();
          ctx.ellipse(x, sy - 6, 8, 4, Math.sin(this.time * 3 + x) * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (lvl.theme === 'mushroom') {
      // 6. Грибная галактика: 5 грибных синусоид со светящимися шляпками на гребнях
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 38 + (s % 2) * 18;
        const freq = 0.012 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.3 : -2.0);
        const hue = (this.time * 80 + s * 72) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        // Светящиеся мини-грибочки на волне
        ctx.fillStyle = `hsl(${(hue + 130) % 360}, 100%, 68%)`;
        ctx.globalAlpha = 0.55;
        for (let x = 35; x < W; x += 90) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          ctx.beginPath();
          ctx.arc(x, sy - 2, 8, Math.PI, 0);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // ВРАЩАЮЩИЕСЯ ФРАКТАЛЫ, МАНДАЛЫ И ТЕМАТИЧЕСКИЕ УЗОРЫ
  // =========================================================================
  drawLevelGeometry(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const g of this.geoShapes) {
      const gx = ((g.x * W - this.camX * (g.z * 42)) % W + W) % W;
      const gy = g.y * H;
      const pulse = 1 + Math.sin(g.phase * 2.2) * 0.14;
      const s = g.size * pulse;
      const blinkAlpha = 0.24 + 0.20 * Math.abs(Math.sin(g.phase * 1.8));

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      if (lvl.theme === 'lsd') {
        // ЛСД: значки Ом (ॐ), мандалы лотоса, звёзды Меркаба и спирали
        const hue = (this.time * 90 + g.phase * 65) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 66%)`;
        ctx.fillStyle = `hsl(${(hue + 140) % 360}, 100%, 68%)`;
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = blinkAlpha + 0.08;

        if (g.kind === 0) {
          // Вращающийся знак Ом в неоновой мандале
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.92, 0, Math.PI * 2);
          ctx.stroke();
          for (let k = 0; k < 8; k++) {
            const a = (Math.PI * k) / 4;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * s * 0.92, Math.sin(a) * s * 0.92, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.font = `bold ${Math.round(s * 0.95)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 2);
        } else if (g.kind === 1) {
          // Звезда Меркаба
          for (const dir of [1, -1]) {
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
              const a = (Math.PI * 2 * k) / 3 - (Math.PI / 2) * dir;
              if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
              else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            }
            ctx.closePath();
            ctx.stroke();
          }
        } else if (g.kind === 2) {
          // 8-лепестковая мандала
          for (let k = 0; k < 8; k++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.ellipse(s * 0.5, 0, s * 0.45, s * 0.18, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Гипно-спираль
          ctx.beginPath();
          for (let t = 0; t < 22; t++) {
            const ang = t * 0.45;
            const rad = t * (s * 0.045);
            if (t === 0) ctx.moveTo(0, 0);
            else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        // Мексиканский стиль: узоры Калавера, цветы бархатцев и неоновые черепа-медальоны
        const colors = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
        const c1 = colors[g.kind % colors.length];
        const c2 = colors[(g.kind + 2) % colors.length];
        ctx.strokeStyle = c1;
        ctx.fillStyle = c2;
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = blinkAlpha + 0.08;

        if (g.kind === 0) {
          // Мексиканский цветок бархатцев (10 лепестков)
          for (let k = 0; k < 10; k++) {
            ctx.rotate(Math.PI / 5);
            ctx.beginPath();
            ctx.ellipse(s * 0.52, 0, s * 0.42, s * 0.2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else if (g.kind === 1) {
          // Светящийся мексиканский череп-узор
          ctx.beginPath();
          ctx.arc(0, -s * 0.1, s * 0.65, Math.PI * 0.85, Math.PI * 2.15);
          ctx.lineTo(s * 0.35, s * 0.62);
          ctx.lineTo(-s * 0.35, s * 0.62);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(-s * 0.24, -s * 0.08, s * 0.16, 0, Math.PI * 2);
          ctx.arc(s * 0.24, -s * 0.08, s * 0.16, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Кружевной ромб-мандала Дня Мёртвых
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
          ctx.rotate(Math.PI / 4);
          ctx.strokeStyle = c2;
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
        }
      } else if (lvl.theme === 'rainbow') {
        // Конфетная тематика: леденцы-спирали, пончики, звёзды и карамельные узоры
        const hue = (this.time * 95 + g.phase * 55) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.fillStyle = `hsl(${(hue + 160) % 360}, 100%, 74%)`;
        ctx.lineWidth = 2.8;
        ctx.globalAlpha = blinkAlpha + 0.08;

        if (g.kind === 0) {
          // Спиральный леденец на палочке
          ctx.beginPath();
          ctx.moveTo(0, s * 0.75);
          ctx.lineTo(0, s * 1.45);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.78, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          for (let t = 0; t < 18; t++) {
            const a = t * 0.5;
            const r = t * (s * 0.04);
            if (t === 0) ctx.moveTo(0, 0);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.stroke();
        } else if (g.kind === 1) {
          // Неоновый пончик с посыпкой
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Сахарная звезда-вертушка
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI * i) / 3;
            ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            ctx.lineTo(Math.cos(a + Math.PI / 6) * (s * 0.42), Math.sin(a + Math.PI / 6) * (s * 0.42));
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else if (lvl.theme === 'underwater') {
        // Морские узоры: ракушки-спирали, кораллы, морские звёзды и круги на воде
        const seaHue = 175 + Math.sin(g.phase) * 35;
        ctx.strokeStyle = `hsl(${seaHue}, 100%, 76%)`;
        ctx.fillStyle = `hsl(${(seaHue + 40) % 360}, 100%, 80%)`;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = blinkAlpha + 0.07;

        if (g.kind === 0) {
          // Морская звезда
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            ctx.lineTo(Math.cos(a + Math.PI / 5) * (s * 0.4), Math.sin(a + Math.PI / 5) * (s * 0.4));
          }
          ctx.closePath();
          ctx.stroke();
        } else if (g.kind === 1) {
          // Ракушка Наутилус
          ctx.beginPath();
          for (let t = 0; t < 20; t++) {
            const a = t * 0.42;
            const r = t * (s * 0.048);
            if (t === 0) ctx.moveTo(0, 0);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.stroke();
        } else {
          // Концентрическая водная рябь
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.52, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (lvl.theme === 'organic') {
        // Растительные узоры: цветочные мандалы, листья и лотосы
        ctx.strokeStyle = g.kind % 2 === 0 ? '#80ed99' : '#ccff33';
        ctx.fillStyle = '#ffd166';
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = blinkAlpha + 0.08;

        if (g.kind === 0 || g.kind === 1) {
          // 6-лепестковый неоновый цветок
          for (let k = 0; k < 6; k++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(s * 0.52, 0, s * 0.44, s * 0.22, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Венок из 4 листьев
          for (let k = 0; k < 4; k++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.5, -s * 0.4, s, 0);
            ctx.quadraticCurveTo(s * 0.5, s * 0.4, 0, 0);
            ctx.stroke();
          }
        }
      } else if (lvl.theme === 'mushroom') {
        // Грибные узоры: калейдоскоп из грибов, грибница и неоновые мухоморы
        const hue = (this.time * 85 + g.phase * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 66%)`;
        ctx.fillStyle = `hsl(${(hue + 140) % 360}, 100%, 70%)`;
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = blinkAlpha + 0.09;

        if (g.kind === 0) {
          // Калейдоскоп из 4 грибов
          for (let k = 0; k < 4; k++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.arc(0, -s * 0.45, s * 0.42, Math.PI, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.strokeRect(-s * 0.1, -s * 0.45, s * 0.2, s * 0.32);
          }
        } else {
          // Светящийся гриб с пятнами
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.85, Math.PI, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.strokeRect(-s * 0.22, 0, s * 0.44, s * 0.65);
          ctx.beginPath();
          ctx.arc(-s * 0.35, -s * 0.35, s * 0.14, 0, Math.PI * 2);
          ctx.arc(s * 0.32, -s * 0.38, s * 0.12, 0, Math.PI * 2);
          ctx.arc(0, -s * 0.55, s * 0.16, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // =========================================================================
  // 6 УНИКАЛЬНЫХ ПЛАНЕТ С ОРБИТАЛЬНЫМИ КОЛЬЦАМИ ПО МОТИВАМ АРТОВ
  // =========================================================================
  drawLsdPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 75 + hueShift) % 360;

    // Неоновое гало
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Тело планеты с фрактальными полосами
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = `hsl(${hue}, 90%, 45%)`;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsl(${(hue + 95) % 360}, 95%, 60%)`;
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.12, r * 0.74, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsl(${(hue + 200) % 360}, 100%, 68%)`;
    ctx.beginPath();
    ctx.arc(r * 0.18, r * 0.16, r * 0.44, 0, Math.PI * 2);
    ctx.fill();

    // Вращающееся радужное кольцо
    ctx.rotate(-0.32 + Math.sin(this.time * 0.8 + hueShift) * 0.12);
    ctx.strokeStyle = `hsl(${(hue + 150) % 360}, 100%, 70%)`;
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.65, r * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.48, r * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawCalaveraPlanet(ctx, px, py, r, hueShift) {
    // Планета-череп в мексиканском стиле (как на арте lvl2_in.jpg)
    ctx.save();
    ctx.translate(px, py);
    const pulseHue = (this.time * 90 + hueShift) % 360;

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `hsl(${pulseHue}, 100%, 55%)`;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.42, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -r * 0.12, r * 0.92, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(r * 0.48, r * 0.86);
    ctx.lineTo(-r * 0.48, r * 0.86);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Узоры на лбу черепа
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(0, -r * 0.56, r * 0.16, 0, Math.PI * 2);
    ctx.fill();

    // Глазницы-цветы бархатцев
    [-r * 0.34, r * 0.34].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff002b' : '#3a86ff';
      ctx.beginPath();
      ctx.arc(ex, -r * 0.08, r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.arc(ex, -r * 0.08, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Зубы Калавера
    ctx.strokeStyle = '#14052b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.32, r * 0.56);
    ctx.lineTo(r * 0.32, r * 0.56);
    for (let tx = -0.2; tx <= 0.2; tx += 0.2) {
      ctx.moveTo(r * tx, r * 0.42);
      ctx.lineTo(r * tx, r * 0.72);
    }
    ctx.stroke();

    // Светящееся мексиканское кольцо вокруг черепа
    ctx.rotate(-0.28);
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.05, r * 1.65, r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawCandyPlanet(ctx, px, py, r, hueShift) {
    // Планета-пончик с глазурью, посыпкой и конфетным кольцом (как на lvl3_in.jpg)
    ctx.save();
    ctx.translate(px, py);

    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Розовая глазурь
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(0, -r * 0.08, r * 0.92, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.85, r * 0.45, r * 0.35, r * 0.25);
    ctx.quadraticCurveTo(0, r * 0.55, -r * 0.35, r * 0.25);
    ctx.quadraticCurveTo(-r * 0.85, r * 0.45, -r * 0.92, -r * 0.08);
    ctx.fill();

    // Разноцветная кондитерская посыпка
    const sprinkleCols = ['#ffee33', '#00f5d4', '#ffffff', '#7209b7'];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      ctx.fillStyle = sprinkleCols[i % sprinkleCols.length];
      ctx.fillRect(Math.cos(a) * r * 0.55 - 3, Math.sin(a) * r * 0.45 - 2, 6, 3);
    }

    // Орбитальное кольцо из конфет и печенек
    ctx.rotate(-0.3);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.65, r * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawOceanPlanet(ctx, px, py, r) {
    // Водная планета с океанскими вихрями и ледяным кольцом (как на lvl4_in.jpg)
    ctx.save();
    ctx.translate(px, py);

    ctx.fillStyle = '#0077b6';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f5d4';
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.18, r * 0.68, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.9;
    ctx.rotate(-0.3);
    ctx.strokeStyle = '#9bf6ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.65, r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawOrganicPlanet(ctx, px, py, r) {
    // Изумрудная планета-джунгли с кольцом из листьев (как на lvl5_in.jpg)
    ctx.save();
    ctx.translate(px, py);

    ctx.fillStyle = '#1b4332';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.2, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(-0.28);
    ctx.strokeStyle = '#ccff33';
    ctx.lineWidth = 4.5;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.62, r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawMushroomPlanet(ctx, px, py, r, hueShift) {
    // Гигантская биолюминесцентная планета-гриб с кольцом спор (как на lvl6_in.jpg)
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 70 + hueShift) % 360;
    const capCol = `hsl(${hue}, 100%, 58%)`;
    const glowCol = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

    ctx.fillStyle = glowCol;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.94;

    // Светящаяся ножка и корни
    ctx.fillStyle = '#f8edeb';
    ctx.strokeStyle = '#14052b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.28, 0);
    ctx.quadraticCurveTo(-r * 0.36, r * 0.65, -r * 0.22, r * 0.98);
    ctx.lineTo(r * 0.22, r * 0.98);
    ctx.quadraticCurveTo(r * 0.36, r * 0.65, r * 0.28, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Психоделическая шляпка
    ctx.fillStyle = capCol;
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.98, r * 0.24, 0, r * 0.18);
    ctx.quadraticCurveTo(-r * 0.98, r * 0.24, -r * 0.98, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Светящиеся пятна на шляпке
    ctx.fillStyle = '#ffffff';
    [
      [-r * 0.44, -r * 0.36, r * 0.17],
      [r * 0.36, -r * 0.44, r * 0.15],
      [0, -r * 0.64, r * 0.19],
      [-r * 0.12, -r * 0.22, r * 0.12]
    ].forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Орбитальное кольцо спор
    ctx.rotate(-0.26);
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.15, r * 1.62, r * 0.32, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 58);
    const py = p.y * H;
    const r = p.r;

    if (lvl.theme === 'lsd') return this.drawLsdPlanet(ctx, px, py, r, p.hueShift);
    if (lvl.theme === 'horror') return this.drawCalaveraPlanet(ctx, px, py, r, p.hueShift);
    if (lvl.theme === 'rainbow') return this.drawCandyPlanet(ctx, px, py, r, p.hueShift);
    if (lvl.theme === 'underwater') return this.drawOceanPlanet(ctx, px, py, r);
    if (lvl.theme === 'organic') return this.drawOrganicPlanet(ctx, px, py, r);
    if (lvl.theme === 'mushroom') return this.drawMushroomPlanet(ctx, px, py, r, p.hueShift);
  }

  // =========================================================================
  // ТЕМАТИЧЕСКИЕ МИГАЮЩИЕ И КРУТЯЩИЕСЯ ЧАСТИЦЫ ДЛЯ КАЖДОГО УРОВНЯ
  // =========================================================================
  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const tp of this.themeParticles) {
      const px = ((tp.x * W - this.camX * (tp.z * 52)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r;
      const blink = 0.55 + 0.45 * Math.sin(tp.phase * 2.2);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tp.rot);
      ctx.globalAlpha = blink;

      if (lvl.theme === 'lsd') {
        // ЛСД: неоновые спирали, ромбы и психо-искры
        const hue = (tp.hue + this.time * 130) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 66%)`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.2);
        ctx.lineTo(r * 0.85, 0);
        ctx.lineTo(0, r * 1.2);
        ctx.lineTo(-r * 0.85, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (lvl.theme === 'horror') {
        // Мексиканский стиль: яркие бархатцы, мини-черепки и огни фиесты
        const cols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
        ctx.fillStyle = cols[tp.kindIdx % cols.length];
        if (tp.kindIdx % 2 === 0) {
          // Цветок бархатцев
          for (let k = 0; k < 5; k++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.arc(r * 0.5, 0, r * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (lvl.theme === 'rainbow') {
        // Конфетная тематика: леденцы, разноцветная посыпка, звёзды и сердечки
        const hue = (tp.hue + this.time * 120) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 72%)`;
        if (tp.kindIdx === 0) {
          // Звезда
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 1.15);
            ctx.lineTo(Math.cos(a + Math.PI / 5) * (r * 0.48), Math.sin(a + Math.PI / 5) * (r * 0.48));
          }
          ctx.closePath();
          ctx.fill();
        } else if (tp.kindIdx === 1) {
          // Карамельная палочка-посыпка
          ctx.fillRect(-r * 0.9, -r * 0.35, r * 1.8, r * 0.7);
        } else {
          // Круглая конфетка
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (lvl.theme === 'underwater') {
        // Океан: светящиеся пузырьки, мини-медузы и планктон
        const col = `hsl(${175 + Math.sin(tp.phase) * 40}, 100%, 78%)`;
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = 1.8;
        if (tp.kindIdx === 0) {
          // Мини-медуза
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, Math.PI, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-r * 0.4, 0);
          ctx.lineTo(-r * 0.5, r * 1.1);
          ctx.moveTo(r * 0.4, 0);
          ctx.lineTo(r * 0.5, r * 1.1);
          ctx.stroke();
        } else {
          // Пузырёк
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (lvl.theme === 'organic') {
        // Био-флора: светящиеся листья, лепестки и золотая пыльца
        ctx.fillStyle = tp.kindIdx % 2 === 0 ? '#ccff33' : '#80ed99';
        if (tp.kindIdx === 0) {
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.25, r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffd166';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (lvl.theme === 'mushroom') {
        // Грибная галактика: парящие светящиеся мини-грибочки и споры
        const hue = (tp.hue + this.time * 125) % 360;
        if (tp.kindIdx % 2 === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-r * 0.25, 0, r * 0.5, r * 0.85);
          ctx.fillStyle = `hsl(${hue}, 100%, 64%)`;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.95, Math.PI, 0);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsl(${(hue + 120) % 360}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
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

    // 1. Многослойные светящиеся синусоиды и волны сектора
    this.drawThemeSineWaves(ctx, lvl, W, H);

    // 2. Мигающие разноцветные звёзды и искры
    for (const s of this.stars) {
      const sx = ((s.x * W - this.camX * (s.z * 48)) % W + W) % W;
      const sy = s.y * H;
      const blink = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
      ctx.globalAlpha = blink * (0.45 + s.z * 0.55);
      ctx.fillStyle = s.z > 0.7 ? `hsl(${(this.time * 110 + s.hueOffset) % 360}, 100%, 74%)` : '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 3. Вращающиеся фракталы, мандалы и тематические значки
    this.drawLevelGeometry(ctx, lvl, W, H);

    // 4. Крупные тематические планеты с орбитальными кольцами
    for (const p of this.planets) {
      this.drawPlanet3D(ctx, p, lvl, W, H);
    }

    // 5. Плотный поток тематических частиц
    this.drawThemeParticles(ctx, lvl, W, H);
  }
}
