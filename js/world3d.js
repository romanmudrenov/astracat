'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;
    this.bgScrollY = 0;

    // Offscreen-буфер для оптического расфокуса дальнего плана (Depth of Field без потери FPS)
    this.dofCanvas = document.createElement('canvas');
    this.dofCtx = this.dofCanvas.getContext('2d', { alpha: false });

    // Автоподгрузка фоновых картинок img/bg1.jpg .. img/bg6.jpg
    this.bgImages = {};
    this._preloadBackgroundImages();

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

    // 52 тематические светящиеся частицы переднего атмосферного слоя
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

  _preloadBackgroundImages() {
    for (let id = 1; id <= 6; id++) {
      const entry = { img: null, ready: false };
      this.bgImages[id] = entry;
      const probe = new Image();
      probe.onload = () => {
        entry.img = probe;
        entry.ready = true;
      };
      probe.onerror = () => {
        const pngProbe = new Image();
        pngProbe.onload = () => {
          entry.img = pngProbe;
          entry.ready = true;
        };
        pngProbe.src = `img/bg${id}.png`;
      };
      probe.src = `img/bg${id}.jpg`;
    }
  }

  setCameraFromPlayer(playerX, W) {
    if (!W) return;
    this.targetCamX = ((playerX / W) - 0.5) * 2;
  }

  update(dt, turboActive = false) {
    this.time += dt;
    const mult = turboActive ? 1.85 : 1.0;
    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 4.5);
    this.bgScrollY = (this.bgScrollY + 22 * mult * dt) % 2048;

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
        ['#14042e', '#36095c', '#660e61'],
        ['#1f053b', '#4d0a63', '#821266'],
        ['#0d1040', '#2b1369', '#5e1278']
      ],
      horror: [
        ['#120321', '#2e062b', '#540a24'],
        ['#17052b', '#3b082e', '#630e1e'],
        ['#0e0626', '#23093d', '#52082b']
      ],
      rainbow: [
        ['#1c1152', '#372080', '#5e3299'],
        ['#261459', '#4b268c', '#7a3ca3']
      ],
      underwater: [
        ['#041c33', '#0a3f5e', '#12697d'],
        ['#072540', '#0f5070', '#187d91']
      ],
      organic: [
        ['#031c0c', '#093d1c', '#12612c'],
        ['#052411', '#0e4f26', '#19753b']
      ],
      mushroom: [
        ['#180333', '#420659', '#7a0d66'],
        ['#0c1240', '#360763', '#8a034e'],
        ['#1e042e', '#521187', '#991282']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const idx = Math.floor((this.time / 8) % list.length);
    return list[idx];
  }

  drawThemeSineWaves(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';

    if (lvl.theme === 'lsd') {
      for (let s = 0; s < 6; s++) {
        const yBase = H * (0.12 + s * 0.155);
        const amp = 34 + (s % 3) * 18;
        const freq = 0.011 + (s % 2) * 0.006;
        const speed = (s % 2 === 0 ? 1 : -1) * (2.1 + s * 0.35);
        const hue = (this.time * 95 + s * 60) % 360;

        ctx.strokeStyle = `hsl(${hue}, 90%, 56%)`;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    } else if (lvl.theme === 'horror') {
      const fiestaCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 32 + (s % 2) * 18;
        const freq = 0.013 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.2 : -1.9);
        const col = fiestaCols[s % fiestaCols.length];

        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 16) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s * 1.4) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    } else if (lvl.theme === 'rainbow') {
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#c77dff'];
      [0.24, 0.68].forEach((yFrac, rIdx) => {
        const dir = rIdx === 0 ? 1 : -1;
        rainbowBands.forEach((col, bIdx) => {
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.22;
          ctx.lineWidth = 8.5;
          ctx.beginPath();
          for (let x = -40; x <= W + 40; x += 16) {
            const sy = H * yFrac + bIdx * 9 + Math.sin(x * 0.011 + this.time * 2.1 * dir + rIdx) * 48;
            if (x === -40) ctx.moveTo(x, sy);
            else ctx.lineTo(x, sy);
          }
          ctx.stroke();
        });
      });
    } else if (lvl.theme === 'underwater') {
      const seaCols = ['#00f5d4', '#48cae4', '#9bf6ff', '#72efdd', '#64dfdf', '#b8c0ff'];
      for (let s = 0; s < 6; s++) {
        const yBase = H * (0.12 + s * 0.155);
        const amp = 26 + (s % 3) * 14;
        const freq = 0.014 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.4 : -1.8);

        ctx.strokeStyle = seaCols[s % seaCols.length];
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp + Math.cos(x * 0.025 - this.time * 2) * 8;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    } else if (lvl.theme === 'organic') {
      const plantCols = ['#38b000', '#80ed99', '#ccff33', '#06d6a0', '#ffd166'];
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 36 + (s % 2) * 16;
        const freq = 0.012 + s * 0.002;
        const speed = (s % 2 === 0 ? 1.9 : -1.6);

        ctx.strokeStyle = plantCols[s % plantCols.length];
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 16) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    } else if (lvl.theme === 'mushroom') {
      for (let s = 0; s < 5; s++) {
        const yBase = H * (0.14 + s * 0.18);
        const amp = 38 + (s % 2) * 18;
        const freq = 0.012 + s * 0.002;
        const speed = (s % 2 === 0 ? 2.3 : -2.0);
        const hue = (this.time * 80 + s * 72) % 360;

        ctx.strokeStyle = `hsl(${hue}, 90%, 56%)`;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 16) {
          const sy = yBase + Math.sin(x * freq + this.time * speed + s) * amp;
          if (x === -40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawLevelGeometry(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (const g of this.geoShapes) {
      const gx = ((g.x * W - this.camX * (g.z * 42)) % W + W) % W;
      const gy = g.y * H;
      const pulse = 1 + Math.sin(g.phase * 2.2) * 0.14;
      const s = g.size * pulse;
      const blinkAlpha = 0.15 + 0.12 * Math.abs(Math.sin(g.phase * 1.8));

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      if (lvl.theme === 'lsd') {
        const hue = (this.time * 90 + g.phase * 65) % 360;
        ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
        ctx.fillStyle = `hsl(${(hue + 140) % 360}, 90%, 62%)`;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = blinkAlpha + 0.05;

        if (g.kind === 0) {
          ctx.beginPath(); ctx.arc(0, 0, s * 0.92, 0, Math.PI * 2); ctx.stroke();
          ctx.font = `bold ${Math.round(s * 0.95)}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('ॐ', 0, 2);
        } else if (g.kind === 1) {
          for (const dir of [1, -1]) {
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
              const a = (Math.PI * 2 * k) / 3 - (Math.PI / 2) * dir;
              if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
              else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            }
            ctx.closePath(); ctx.stroke();
          }
        } else if (g.kind === 2) {
          for (let k = 0; k < 8; k++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath(); ctx.ellipse(s * 0.5, 0, s * 0.45, s * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else {
          ctx.beginPath();
          for (let t = 0; t < 22; t++) {
            const ang = t * 0.45, rad = t * (s * 0.045);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        const colors = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
        const c1 = colors[g.kind % colors.length];
        const c2 = colors[(g.kind + 2) % colors.length];
        ctx.strokeStyle = c1; ctx.fillStyle = c2; ctx.lineWidth = 2.4;
        ctx.globalAlpha = blinkAlpha + 0.05;

        if (g.kind === 0) {
          for (let k = 0; k < 10; k++) {
            ctx.rotate(Math.PI / 5);
            ctx.beginPath(); ctx.ellipse(s * 0.52, 0, s * 0.42, s * 0.2, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else {
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
          ctx.rotate(Math.PI / 4);
          ctx.strokeStyle = c2;
          ctx.strokeRect(-s * 0.62, -s * 0.62, s * 1.24, s * 1.24);
        }
      } else if (lvl.theme === 'rainbow') {
        const hue = (this.time * 95 + g.phase * 55) % 360;
        ctx.strokeStyle = `hsl(${hue}, 90%, 66%)`; ctx.lineWidth = 2.5;
        ctx.globalAlpha = blinkAlpha + 0.05;
        ctx.beginPath(); ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2); ctx.stroke();
      } else if (lvl.theme === 'underwater') {
        const seaHue = 175 + Math.sin(g.phase) * 35;
        ctx.strokeStyle = `hsl(${seaHue}, 90%, 70%)`; ctx.lineWidth = 2.3;
        ctx.globalAlpha = blinkAlpha + 0.05;
        ctx.beginPath(); ctx.arc(0, 0, s * 0.9, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, s * 0.52, 0, Math.PI * 2); ctx.stroke();
      } else if (lvl.theme === 'organic') {
        ctx.strokeStyle = g.kind % 2 === 0 ? '#80ed99' : '#ccff33'; ctx.lineWidth = 2.4;
        ctx.globalAlpha = blinkAlpha + 0.05;
        for (let k = 0; k < 6; k++) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath(); ctx.ellipse(s * 0.52, 0, s * 0.44, s * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (lvl.theme === 'mushroom') {
        const hue = (this.time * 85 + g.phase * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`; ctx.lineWidth = 2.4;
        ctx.globalAlpha = blinkAlpha + 0.05;
        ctx.beginPath(); ctx.arc(0, 0, s * 0.85, Math.PI, 0); ctx.closePath(); ctx.stroke();
        ctx.strokeRect(-s * 0.22, 0, s * 0.44, s * 0.65);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawLsdPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 75 + hueShift) % 360;

    ctx.globalAlpha = 0.72;
    ctx.fillStyle = `hsl(${hue}, 78%, 38%)`;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = `hsl(${(hue + 95) % 360}, 82%, 50%)`;
    ctx.beginPath(); ctx.arc(-r * 0.15, -r * 0.12, r * 0.74, 0, Math.PI * 2); ctx.fill();

    ctx.rotate(-0.32 + Math.sin(this.time * 0.8 + hueShift) * 0.12);
    ctx.strokeStyle = `hsl(${(hue + 150) % 360}, 88%, 62%)`;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.65, r * 0.36, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawCalaveraPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = '#d9cfc1';
    ctx.strokeStyle = '#b5179e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -r * 0.12, r * 0.92, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(r * 0.48, r * 0.86);
    ctx.lineTo(-r * 0.48, r * 0.86);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    [-r * 0.34, r * 0.34].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#c9184a' : '#2b59c3';
      ctx.beginPath(); ctx.arc(ex, -r * 0.08, r * 0.25, 0, Math.PI * 2); ctx.fill();
    });

    ctx.rotate(-0.28);
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, r * 0.05, r * 1.65, r * 0.34, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawCandyPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = '#c97b3d';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#d6497a';
    ctx.beginPath();
    ctx.arc(0, -r * 0.08, r * 0.92, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.85, r * 0.45, r * 0.35, r * 0.25);
    ctx.quadraticCurveTo(0, r * 0.55, -r * 0.35, r * 0.25);
    ctx.quadraticCurveTo(-r * 0.85, r * 0.45, -r * 0.92, -r * 0.08);
    ctx.fill();

    ctx.rotate(-0.3);
    ctx.strokeStyle = '#e0a943';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.65, r * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawOceanPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = '#005b8f';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#00bfa6';
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.18, r * 0.68, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.72;
    ctx.rotate(-0.3);
    ctx.strokeStyle = '#7bdff2';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.65, r * 0.34, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawOrganicPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = '#143627';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#3d8f68';
    ctx.beginPath(); ctx.arc(-r * 0.22, -r * 0.2, r * 0.65, 0, Math.PI * 2); ctx.fill();

    ctx.rotate(-0.28);
    ctx.strokeStyle = '#aacc00';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 6]);
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.62, r * 0.34, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawMushroomPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 70 + hueShift) % 360;
    const capCol = `hsl(${hue}, 82%, 48%)`;
    const glowCol = `hsl(${(hue + 140) % 360}, 85%, 58%)`;

    ctx.globalAlpha = 0.74;
    ctx.fillStyle = '#d9cfc1';
    ctx.beginPath();
    ctx.moveTo(-r * 0.28, 0);
    ctx.quadraticCurveTo(-r * 0.36, r * 0.65, -r * 0.22, r * 0.98);
    ctx.lineTo(r * 0.22, r * 0.98);
    ctx.quadraticCurveTo(r * 0.36, r * 0.65, r * 0.28, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = capCol;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.98, r * 0.24, 0, r * 0.18);
    ctx.quadraticCurveTo(-r * 0.98, r * 0.24, -r * 0.98, 0);
    ctx.closePath();
    ctx.fill();

    ctx.rotate(-0.26);
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.ellipse(0, -r * 0.15, r * 1.62, r * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 58);
    const py = p.y * H;
    const r = p.r;

    if (lvl.theme === 'lsd') return this.drawLsdPlanet(ctx, px, py, r, p.hueShift);
    if (lvl.theme === 'horror') return this.drawCalaveraPlanet(ctx, px, py, r, p.hueShift);
    if (lvl.theme === 'rainbow') return this.drawCandyPlanet(ctx, px, py, r);
    if (lvl.theme === 'underwater') return this.drawOceanPlanet(ctx, px, py, r);
    if (lvl.theme === 'organic') return this.drawOrganicPlanet(ctx, px, py, r);
    if (lvl.theme === 'mushroom') return this.drawMushroomPlanet(ctx, px, py, r, p.hueShift);
  }

  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const tp of this.themeParticles) {
      const px = ((tp.x * W - this.camX * (tp.z * 52)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r * 0.85;
      const blink = 0.35 + 0.35 * Math.sin(tp.phase * 2.2);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tp.rot);
      ctx.globalAlpha = blink;

      if (lvl.theme === 'lsd') {
        const hue = (tp.hue + this.time * 130) % 360;
        ctx.fillStyle = `hsl(${hue}, 95%, 64%)`;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.1); ctx.lineTo(r * 0.8, 0); ctx.lineTo(0, r * 1.1); ctx.lineTo(-r * 0.8, 0);
        ctx.closePath(); ctx.fill();
      } else if (lvl.theme === 'horror') {
        const cols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff', '#ff006e'];
        ctx.fillStyle = cols[tp.kindIdx % cols.length];
        ctx.beginPath(); ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2); ctx.fill();
      } else if (lvl.theme === 'rainbow') {
        const hue = (tp.hue + this.time * 120) % 360;
        ctx.fillStyle = `hsl(${hue}, 95%, 70%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.fill();
      } else if (lvl.theme === 'underwater') {
        ctx.strokeStyle = `hsl(${175 + Math.sin(tp.phase) * 40}, 95%, 74%)`;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.stroke();
      } else if (lvl.theme === 'organic') {
        ctx.fillStyle = tp.kindIdx % 2 === 0 ? '#ccff33' : '#80ed99';
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      } else if (lvl.theme === 'mushroom') {
        const hue = (tp.hue + this.time * 125) % 360;
        ctx.fillStyle = `hsl(${(hue + 120) % 360}, 95%, 66%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // Отрисовка дальнего плана в offscreen-буфер с оптическим расфокусом (Depth of Field)
  renderFarPlaneDOF(lvl, W, H) {
    const dofScale = 0.42;
    const dw = Math.max(160, Math.floor(W * dofScale));
    const dh = Math.max(240, Math.floor(H * dofScale));

    if (this.dofCanvas.width !== dw || this.dofCanvas.height !== dh) {
      this.dofCanvas.width = dw;
      this.dofCanvas.height = dh;
    }

    const dctx = this.dofCtx;
    dctx.save();
    dctx.setTransform(dofScale, 0, 0, dofScale, 0, 0);

    // 1. Небо или пользовательский арт-фон img/bg1..6.jpg с бесшовным скроллом
    const bgEntry = this.bgImages[lvl.id];
    if (bgEntry && bgEntry.ready && bgEntry.img) {
      const img = bgEntry.img;
      const drawW = W * 1.12;
      const drawH = Math.max(H, (img.naturalHeight / Math.max(1, img.naturalWidth)) * drawW);
      const offsetX = -W * 0.06 - this.camX * 14;
      const yOffset = this.bgScrollY % drawH;

      dctx.drawImage(img, offsetX, yOffset - drawH, drawW, drawH);
      dctx.drawImage(img, offsetX, yOffset, drawW, drawH);
    } else {
      const [topC, midC, botC] = this.getDynamicSkyColors(lvl);
      const grad = dctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, topC);
      grad.addColorStop(0.5, midC);
      grad.addColorStop(1, botC);
      dctx.fillStyle = grad;
      dctx.fillRect(0, 0, W, H);
    }

    // 2. Волны дальнего плана
    this.drawThemeSineWaves(dctx, lvl, W, H);

    // 3. Дальние звёзды
    for (const s of this.stars) {
      if (s.z >= 0.7) continue;
      const sx = ((s.x * W - this.camX * (s.z * 48)) % W + W) % W;
      const sy = s.y * H;
      const blink = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
      dctx.globalAlpha = blink * 0.55;
      dctx.fillStyle = '#ffffff';
      dctx.beginPath();
      dctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      dctx.fill();
    }
    dctx.globalAlpha = 1;

    // 4. Вращающиеся фракталы и мандалы
    this.drawLevelGeometry(dctx, lvl, W, H);

    // 5. Планеты с орбитами
    for (const p of this.planets) {
      this.drawPlanet3D(dctx, p, lvl, W, H);
    }

    // 6. Атмосферная дымка глубины (отделяет фон от боевого плана)
    dctx.fillStyle = 'rgba(8, 3, 20, 0.30)';
    dctx.fillRect(0, 0, W, H);

    dctx.restore();
  }

  render(ctx, lvl, W, H) {
    // 1. Рендерим дальний план с оптическим расфокусом (Вариант 2)
    this.renderFarPlaneDOF(lvl, W, H);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.dofCanvas, 0, 0, W, H);
    ctx.restore();

    // 2. Чёткие ближние звёзды и атмосферные частицы переднего слоя
    for (const s of this.stars) {
      if (s.z < 0.7) continue;
      const sx = ((s.x * W - this.camX * (s.z * 48)) % W + W) % W;
      const sy = s.y * H;
      const blink = 0.35 + 0.55 * Math.abs(Math.sin(s.phase));
      ctx.globalAlpha = blink * 0.65;
      ctx.fillStyle = `hsl(${(this.time * 110 + s.hueOffset) % 360}, 95%, 72%)`;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    this.drawThemeParticles(ctx, lvl, W, H);
  }
}
