javascript
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

    this.geoShapes = Array.from({ length: 12 }, (_, i) => ({
      x: (i + 0.5) / 12 + (Math.random() - 0.5) * 0.08,
      y: Math.random(),
      z: 0.26 + (i % 3) * 0.22,
      kind: i % 4,
      size: 24 + (i % 4) * 11,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.25),
      speed: 0.025 + (i % 3) * 0.018,
      phase: i * 1.15
    }));

    this.themeParticles = Array.from({ length: 34 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.25,
      kindIdx: i % 4,
      r: 5.5 + (i % 4) * 2.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.4,
      speed: 0.04 + (i % 3) * 0.035,
      drift: (Math.random() - 0.5) * 0.06,
      hue: (i * 42) % 360,
      phase: Math.random() * Math.PI * 2
    }));

    this.planets = [
      { x: 0.22, y: 0.18, z: 0.35, r: 52, kind: 'ringed', speed: 0.022, hueShift: 0 },
      { x: 0.76, y: 0.56, z: 0.50, r: 42, kind: 'crater', speed: 0.030, hueShift: 90 },
      { x: 0.45, y: 0.88, z: 0.28, r: 46, kind: 'twin_moon', speed: 0.018, hueShift: 180 }
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

    for (const g of this.geoShapes) {
      g.y += g.speed * mult * dt;
      g.rot += g.vrot * dt;
      g.phase += dt * 2.2;
      if (g.y > 1.12) {
        g.y = -0.12;
        g.x = 0.08 + Math.random() * 0.84;
      }
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

  getDynamicSkyColors(lvl) {
    const palettesByTheme = {
      lsd: [
        ['#180633', '#3b0d66', '#6b1475'],
        ['#260742', '#590d73', '#9b1d85'],
        ['#0f1242', '#2b196e', '#691882']
      ],
      horror: [
        ['#0a0217', '#24072b', '#420a2e'],
        ['#060c24', '#16214d', '#380b2b'],
        ['#0d1c16', '#213b20', '#4a0d22']
      ],
      rainbow: [
        ['#22185c', '#3c2a8c', '#6941b5'],
        ['#2e1a66', '#56329e', '#8f4ec4']
      ],
      underwater: [
        ['#062038', '#0e486b', '#197994'],
        ['#092b47', '#13597d', '#228fa8']
      ],
      organic: [
        ['#041f0d', '#0c451e', '#176b30'],
        ['#072613', '#125429', '#228040']
      ],
      mushroom: [
        ['#1a0436', '#4a0866', '#8a1278'],
        ['#0c1844', '#3c096c', '#9d0258'],
        ['#1f052e', '#5a189a', '#b5179e']
      ]
    };
    const list = palettesByTheme[lvl.theme] || [[lvl.skyTop, lvl.skyMid, lvl.skyBot]];
    const idx = Math.floor((this.time / 12) % list.length);
    return list[idx];
  }

  drawThemeLights(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const lightConfigs = {
      lsd:        ['#ff006e', '#00f5d4', '#fee440', '#8338ec'],
      horror:     ['#ff006e', '#ffbe0b', '#06d6a0', '#00f5d4'],
      rainbow:    ['#ff3366', '#ffee33', '#33ee88', '#33ccff'],
      underwater: ['#9bf6ff', '#48cae4', '#80ffdb', '#bdb2ff'],
      organic:    ['#80ed99', '#ccff33', '#ffd166', '#38b000'],
      mushroom:   ['#ff006e', '#ffd166', '#9d4edd', '#00f5d4']
    };
    const cols = lightConfigs[lvl.theme] || ['#ffffff', lvl.accent];

    for (let i = 0; i < 6; i++) {
      const lx = W * (0.15 + 0.7 * ((Math.sin(this.time * 0.45 + i * 1.7) + 1) * 0.5));
      const ly = H * ((0.12 + i * 0.16 + this.time * 0.04) % 1.0);
      const rad = 45 + Math.sin(this.time * 2.2 + i) * 18;
      const g = ctx.createRadialGradient(lx, ly, 2, lx, ly, rad);
      g.addColorStop(0, cols[i % cols.length]);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(lx, ly, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    if (lvl.theme === 'underwater') {
      ctx.globalAlpha = 0.09;
      for (let r = 0; r < 4; r++) {
        const topX = W * (0.18 + r * 0.22) + Math.sin(this.time * 0.8 + r) * 28;
        ctx.fillStyle = '#9bf6ff';
        ctx.beginPath();
        ctx.moveTo(topX - 18, 0);
        ctx.lineTo(topX + 18, 0);
        ctx.lineTo(topX + 75, H);
        ctx.lineTo(topX - 45, H);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawThemeSineWaves(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lvl.theme === 'lsd' || lvl.theme === 'mushroom') {
      const waveConfigs = [
        { yFrac: 0.15, amp: 64, freq: 0.010, speed: 2.2, width: 22 },
        { yFrac: 0.36, amp: 48, freq: 0.014, speed: -1.9, width: 18 },
        { yFrac: 0.58, amp: 70, freq: 0.0085, speed: 1.6, width: 26 },
        { yFrac: 0.80, amp: 52, freq: 0.013, speed: -2.1, width: 20 }
      ];
      waveConfigs.forEach((cfg, s) => {
        const hue = (this.time * 72 + s * 88) % 360;
        const hue2 = (hue + 140) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.lineWidth = cfg.width;
        ctx.globalAlpha = 0.26;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * cfg.yFrac
            + Math.sin(x * cfg.freq + this.time * cfg.speed + s * 1.5) * cfg.amp
            + Math.cos(x * cfg.freq * 2.1 - this.time * 1.4) * (cfg.amp * 0.24);
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        ctx.strokeStyle = `hsl(${hue2}, 100%, 74%)`;
        ctx.lineWidth = cfg.width * 0.32;
        ctx.globalAlpha = 0.45;
        ctx.stroke();
      });

    } else if (lvl.theme === 'horror') {
      const fiestaWaves = [
        { yFrac: 0.20, amp: 38, freq: 0.018, speed: 2.0, col: '#ff006e', w: 6 },
        { yFrac: 0.48, amp: 44, freq: 0.014, speed: -1.7, col: '#ffbe0b', w: 7 },
        { yFrac: 0.76, amp: 36, freq: 0.020, speed: 2.3, col: '#06d6a0', w: 6 }
      ];
      fiestaWaves.forEach((fw, idx) => {
        ctx.strokeStyle = fw.col;
        ctx.lineWidth = fw.w;
        ctx.globalAlpha = 0.30;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const base = Math.sin(x * fw.freq + this.time * fw.speed + idx);
          const sy = H * fw.yFrac + base * fw.amp;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        ctx.fillStyle = idx % 2 === 0 ? '#00f5d4' : '#ffbe0b';
        ctx.globalAlpha = 0.42;
        for (let x = 20; x < W; x += 56) {
          const sy = H * fw.yFrac + Math.sin(x * fw.freq + this.time * fw.speed + idx) * fw.amp;
          ctx.beginPath();
          ctx.arc(x, sy, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

    } else if (lvl.theme === 'underwater') {
      const oceanWaves = [
        { yFrac: 0.18, amp: 32, freq: 0.015, speed: 2.1, col: '#48cae4', width: 12 },
        { yFrac: 0.38, amp: 42, freq: 0.012, speed: -1.6, col: '#9bf6ff', width: 15 },
        { yFrac: 0.60, amp: 36, freq: 0.016, speed: 1.9, col: '#80ffdb', width: 13 },
        { yFrac: 0.82, amp: 46, freq: 0.011, speed: -1.4, col: '#00b4d8', width: 16 }
      ];
      oceanWaves.forEach((ow, idx) => {
        ctx.strokeStyle = ow.col;
        ctx.lineWidth = ow.width;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const phase = x * ow.freq + this.time * ow.speed + idx * 1.4;
          const sy = H * ow.yFrac + Math.sin(phase) * ow.amp - Math.cos(phase * 2) * (ow.amp * 0.22);
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.36;
        ctx.stroke();
      });

    } else if (lvl.theme === 'organic') {
      const vineWaves = [
        { yFrac: 0.22, amp: 44, freq: 0.013, speed: 1.5, vineCol: '#38b000', leafCol: '#80ed99', budCol: '#ffd166' },
        { yFrac: 0.50, amp: 52, freq: 0.011, speed: -1.3, vineCol: '#70e000', leafCol: '#ccff33', budCol: '#ff85a1' },
        { yFrac: 0.78, amp: 40, freq: 0.015, speed: 1.7, vineCol: '#2d6a4f', leafCol: '#9ef01a', budCol: '#fee440' }
      ];
      vineWaves.forEach((vw, idx) => {
        ctx.strokeStyle = vw.vineCol;
        ctx.lineWidth = 7;
        ctx.globalAlpha = 0.32;
        ctx.beginPath();
        for (let x = -60; x <= W + 60; x += 12) {
          const sy = H * vw.yFrac + Math.sin(x * vw.freq + this.time * vw.speed + idx * 2) * vw.amp;
          if (x === -60) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();

        for (let x = 24; x < W; x += 52) {
          const phase = x * vw.freq + this.time * vw.speed + idx * 2;
          const sy = H * vw.yFrac + Math.sin(phase) * vw.amp;
          const slope = Math.cos(phase) * vw.amp * vw.freq;

          ctx.save();
          ctx.translate(x, sy);
          ctx.rotate(Math.atan(slope));
          ctx.fillStyle = vw.leafCol;
          ctx.globalAlpha = 0.36;
          ctx.beginPath();
          ctx.ellipse(0, -8, 9, 4.5, -0.5, 0, Math.PI * 2);
          ctx.ellipse(6, 8, 9, 4.5, 0.5, 0, Math.PI * 2);
          ctx.fill();

          if (Math.floor(x / 52) % 2 === 0) {
            ctx.fillStyle = vw.budCol;
            ctx.globalAlpha = 0.48;
            ctx.beginPath();
            ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

    } else if (lvl.theme === 'rainbow') {
      ctx.globalAlpha = 0.26;
      const rainbowBands = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'];
      rainbowBands.forEach((col, bIdx) => {
        ctx.strokeStyle = col; ctx.lineWidth = 13;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 16) {
          const sy = H * 0.35 + bIdx * 12 + Math.sin(x * 0.011 + this.time * 1.8) * 55;
          if (x === -80) ctx.moveTo(x, sy); else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  drawBgCalaveraIcon(ctx, s, col1, col2, col3) {
    ctx.strokeStyle = col1;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -s * 0.12, s * 0.72, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(s * 0.38, s * 0.65);
    ctx.lineTo(-s * 0.38, s * 0.65);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = col2;
    ctx.lineWidth = 1.8;
    [-s * 0.26, s * 0.26].forEach(ex => {
      ctx.beginPath(); ctx.arc(ex, -s * 0.06, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    });

    ctx.fillStyle = col3;
    ctx.beginPath(); ctx.arc(0, -s * 0.42, s * 0.14, 0, Math.PI * 2); ctx.fill();
  }

  drawLevelGeometry(ctx, lvl, W, H) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const g of this.geoShapes) {
      const gx = ((g.x * W - this.camX * (g.z * 38)) % W + W) % W;
      const gy = g.y * H;
      const s = g.size;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(g.rot);

      if (lvl.theme === 'lsd' || lvl.theme === 'mushroom') {
        const hue = (this.time * 75 + g.phase * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 66%)`;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.34;

        if (g.kind === 0) {
          for (let dir of [1, -1]) {
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
              const a = (Math.PI * 2 * k) / 3 - (Math.PI / 2) * dir;
              if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
              else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            }
            ctx.closePath(); ctx.stroke();
          }
        } else if (g.kind === 1) {
          for (let k = 0; k < 8; k++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath(); ctx.ellipse(s * 0.45, 0, s * 0.45, s * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else {
          ctx.beginPath();
          for (let t = 0; t < 20; t++) {
            const ang = t * 0.45, rad = t * (s * 0.052);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        const colors = ['#ff006e', '#ffbe0b', '#06d6a0', '#00f5d4'];
        const c1 = colors[g.kind % colors.length];
        const c2 = colors[(g.kind + 1) % colors.length];
        const c3 = colors[(g.kind + 2) % colors.length];
        ctx.globalAlpha = 0.34;
        if (g.kind % 2 === 0) {
          ctx.rotate(-g.rot * 0.7);
          this.drawBgCalaveraIcon(ctx, s, c1, c2, c3);
        } else {
          ctx.strokeStyle = c2;
          ctx.lineWidth = 2.2;
          for (let p = 0; p < 8; p++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath(); ctx.arc(s * 0.45, 0, s * 0.25, 0, Math.PI * 2); ctx.stroke();
          }
        }
      } else if (lvl.theme === 'rainbow') {
        const hue = (this.time * 70 + g.phase * 50) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 72%)`;
        ctx.lineWidth = 2.6;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI * k) / 3;
          if (k === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
          else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        }
        ctx.closePath(); ctx.stroke();
      } else if (lvl.theme === 'underwater') {
        const pastelHue = 175 + Math.sin(g.phase) * 35;
        ctx.strokeStyle = `hsl(${pastelHue}, 95%, 78%)`;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.32;
        if (g.kind % 2 === 0) {
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, s * 0.58, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.beginPath();
          for (let t = 0; t < 16; t++) {
            const ang = t * 0.5, rad = t * (s * 0.06);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'organic') {
        ctx.strokeStyle = g.kind % 2 === 0 ? '#80ed99' : '#ccff33';
        ctx.lineWidth = 2.3;
        ctx.globalAlpha = 0.34;
        const petals = g.kind % 2 === 0 ? 6 : 8;
        for (let k = 0; k < petals; k++) {
          ctx.rotate((Math.PI * 2) / petals);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(s * 0.45, -s * 0.25, s * 0.9, 0);
          ctx.quadraticCurveTo(s * 0.45, s * 0.25, 0, 0);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawMushroomPlanet(ctx, px, py, r, hueShift) {
    ctx.save();
    ctx.translate(px, py);
    const hue = (this.time * 55 + hueShift) % 360;
    const capCol = `hsl(${hue}, 95%, 56%)`;
    const glowCol = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

    ctx.fillStyle = glowCol;
    ctx.globalAlpha = 0.24;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.90;

    ctx.fillStyle = '#f8edeb';
    ctx.strokeStyle = '#14052b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.26, 0);
    ctx.quadraticCurveTo(-r * 0.34, r * 0.65, -r * 0.20, r * 0.95);
    ctx.lineTo(r * 0.20, r * 0.95);
    ctx.quadraticCurveTo(r * 0.34, r * 0.65, r * 0.26, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = capCol;
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.95, r * 0.22, 0, r * 0.16);
    ctx.quadraticCurveTo(-r * 0.95, r * 0.22, -r * 0.95, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    [[-r * 0.42, -r * 0.35, r * 0.16], [r * 0.35, -r * 0.42, r * 0.14], [0, -r * 0.62, r * 0.18], [-r * 0.12, -r * 0.2, r * 0.11]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
  }

  drawSkullPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = '#ff006e'; ctx.globalAlpha = 0.20;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#241436'; ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.92, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(r * 0.52, r * 0.82); ctx.lineTo(-r * 0.52, r * 0.82);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    [-r * 0.34, r * 0.34].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff006e' : '#00f5d4';
      for (let p = 0; p < 8; p++) {
        const a = (Math.PI * 2 * p) / 8;
        ctx.beginPath();
        ctx.arc(ex + Math.cos(a) * (r * 0.28), -r * 0.05 + Math.sin(a) * (r * 0.28), r * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#07030a';
      ctx.beginPath(); ctx.arc(ex, -r * 0.05, r * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath(); ctx.arc(ex, -r * 0.05, r * 0.10, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#06d6a0';
    ctx.beginPath(); ctx.arc(0, -r * 0.52, r * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawPlanet3D(ctx, p, lvl, W, H) {
    const px = p.x * W - this.camX * (p.z * 55);
    const py = p.y * H;
    const r = p.r;

    if (lvl.theme === 'mushroom') {
      this.drawMushroomPlanet(ctx, px, py, r, p.hueShift);
      return;
    }

    if (lvl.theme === 'horror') {
      this.drawSkullPlanet(ctx, px, py, r);
      return;
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = lvl.accent; ctx.globalAlpha = 0.18;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.85;
    let pal = ['#7209b7', '#f72585', '#4cc9f0'];
    if (lvl.theme === 'lsd' || lvl.theme === 'rainbow') {
      const h1 = (this.time * 40 + p.hueShift) % 360;
      pal = [`hsl(${h1}, 80%, 38%)`, `hsl(${(h1 + 45) % 360}, 90%, 60%)`, `hsl(${(h1 + 95) % 360}, 95%, 76%)`];
    } else if (lvl.theme === 'underwater') {
      const h1 = 175 + Math.sin(this.time + p.hueShift) * 25;
      pal = [`hsl(${h1}, 75%, 36%)`, `hsl(${h1 + 20}, 85%, 62%)`, `hsl(${h1 + 40}, 95%, 82%)`];
    } else if (lvl.theme === 'organic') {
      pal = ['#083d18', '#2d6a4f', '#80ed99'];
    }

    ctx.fillStyle = pal[0]; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.arc(-r * 0.14, -r * 0.14, r * 0.84, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal[2]; ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.28, r * 0.52, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawThemeParticles(ctx, lvl, W, H) {
    ctx.save();
    for (const tp of this.themeParticles) {
      const px = ((tp.x * W - this.camX * (tp.z * 48)) % W + W) % W;
      const py = tp.y * H;
      const r = tp.r;

      ctx.save();
      ctx.translate(px, py);

      if (lvl.theme === 'lsd') {
        ctx.rotate(tp.rot);
        ctx.globalAlpha = 0.85;
        const hue = (tp.hue + this.time * 120) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 68%)`;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'mushroom') {
        ctx.rotate(Math.sin(tp.phase) * 0.35);
        ctx.globalAlpha = 0.85;
        const hue = (tp.hue + this.time * 95) % 360;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-r * 0.22, 0, r * 0.44, r * 0.8);
        ctx.fillStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, Math.PI, 0); ctx.fill();
      } else if (lvl.theme === 'horror') {
        const cols = ['#ff006e', '#ffbe0b', '#06d6a0', '#00f5d4'];
        ctx.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(tp.phase * 1.4));
        if (tp.kindIdx === 0) {
          this.drawBgCalaveraIcon(ctx, r * 1.2, cols[0], cols[1], cols[2]);
        } else {
          ctx.fillStyle = cols[tp.kindIdx % cols.length];
          ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2); ctx.fill();
        }
      } else if (lvl.theme === 'rainbow') {
        ctx.rotate(tp.rot); ctx.globalAlpha = 0.78;
        ctx.fillStyle = `hsl(${(tp.hue + this.time * 90) % 360}, 100%, 74%)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a + Math.PI / 5) * (r * 0.42), Math.sin(a + Math.PI / 5) * (r * 0.42));
        }
        ctx.closePath(); ctx.fill();
      } else if (lvl.theme === 'underwater') {
        const pastelCol = `hsl(${165 + Math.sin(tp.phase) * 45}, 90%, 82%)`;
        ctx.strokeStyle = pastelCol; ctx.lineWidth = 1.8; ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.25, r * 0.22, 0, Math.PI * 2); ctx.fill();
      } else if (lvl.theme === 'organic') {
        ctx.rotate(tp.rot); ctx.globalAlpha = 0.85;
        if (tp.kindIdx % 2 === 0) {
          ctx.fillStyle = '#80ed99';
          ctx.beginPath(); ctx.ellipse(0, 0, r * 1.15, r * 0.48, 0, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = '#ffd166';
          ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
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

    this.drawThemeLights(ctx, lvl, W, H);
    this.drawLevelGeometry(ctx, lvl, W, H);
    this.drawThemeSineWaves(ctx, lvl, W, H);

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
