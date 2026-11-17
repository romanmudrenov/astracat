'use strict';

class World3DEngine {
  constructor() {
    this.camX = 0;
    this.targetCamX = 0;
    this.time = 0;

    this.stars = Array.from({ length: 70 }, (_, i) => {
      const layer = i % 3;
      const z = layer === 0 ? 0.25 : (layer === 1 ? 0.55 : 0.90);
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: layer === 0 ? 1.2 : (layer === 1 ? 1.9 : 2.5),
        speed: 0.03 + z * 0.14
      };
    });

    this.geoShapes = Array.from({ length: 9 }, (_, i) => ({
      x: (i + 0.5) / 9 + (Math.random() - 0.5) * 0.08,
      y: Math.random(),
      z: 0.28 + (i % 3) * 0.22,
      kind: i % 4,
      size: 22 + (i % 4) * 11,
      rot: Math.random() * Math.PI * 2,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.25),
      speed: 0.025 + (i % 3) * 0.018,
      phase: i * 1.1
    }));

    this.themeParticles = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + (i % 3) * 0.25,
      kindIdx: i % 3,
      r: 5 + (i % 4) * 2.2,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 2.4,
      speed: 0.04 + (i % 3) * 0.035,
      drift: (Math.random() - 0.5) * 0.06,
      hue: (i * 48) % 360,
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
        ['#080214', '#1f0624', '#380a26'],
        ['#050a1f', '#121d42', '#2e0a24'],
        ['#0a1a12', '#1d3318', '#3d0c19']
      ],
      rainbow: [
        ['#22185c', '#3c2a8c', '#6941b5'],
        ['#2e1a66', '#56329e', '#8f4ec4']
      ],
      underwater: [
        ['#08243d', '#114b6e', '#1c7c94'],
        ['#0b2e4a', '#165e82', '#2694ab']
      ],
      organic: [
        ['#05210e', '#0e4720', '#196e32'],
        ['#082914', '#14592c', '#258544']
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
        const hue = (this.time * 65 + g.phase * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 66%)`;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.30;

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
          for (let k = 0; k < 6; k++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath(); ctx.ellipse(s * 0.45, 0, s * 0.45, s * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else {
          ctx.beginPath();
          for (let t = 0; t < 18; t++) {
            const ang = t * 0.45, rad = t * (s * 0.055);
            if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.stroke();
        }
      } else if (lvl.theme === 'horror') {
        const colors = ['#ff002b', '#ffbe0b', '#06d6a0', '#48dbfb'];
        ctx.strokeStyle = colors[g.kind % colors.length];
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.24;
        ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeRect(-s * 0.65, -s * 0.65, s * 1.3, s * 1.3);
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
        const pastelHue = 175 + Math.sin(g.phase) * 45;
        ctx.strokeStyle = `hsl(${pastelHue}, 95%, 80%)`;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.28;
        ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
      } else if (lvl.theme === 'organic') {
        ctx.strokeStyle = g.kind % 2 === 0 ? '#80ed99' : '#ccff33';
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.28;
        ctx.strokeRect(-s * 0.6, -s * 0.6, s * 1.2, s * 1.2);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // Планета в форме псилоцибинового гриба для 6-го уровня («Грибная Галактика»)
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

    // Ножка планеты-гриба
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

    // Психоделическая шляпка планеты-гриба
    ctx.fillStyle = capCol;
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, Math.PI, 0);
    ctx.quadraticCurveTo(r * 0.95, r * 0.22, 0, r * 0.16);
    ctx.quadraticCurveTo(-r * 0.95, r * 0.22, -r * 0.95, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Светящиеся пятна на шляпке
    ctx.fillStyle = '#ffffff';
    [[-r * 0.42, -r * 0.35, r * 0.16], [r * 0.35, -r * 0.42, r * 0.14], [0, -r * 0.62, r * 0.18], [-r * 0.12, -r * 0.2, r * 0.11]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
  }

  drawSkullPlanet(ctx, px, py, r) {
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = '#ff002b'; ctx.globalAlpha = 0.16;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.fillStyle = '#2b2333'; ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.92, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(r * 0.52, r * 0.82); ctx.lineTo(-r * 0.52, r * 0.82);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#07030a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.05, r * 0.24, r * 0.28, -0.15, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.05, r * 0.24, r * 0.28, 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.05, r * 0.10, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.05, r * 0.10, 0, Math.PI * 2);
    ctx.fill();
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

      if (lvl.theme === 'mushroom') {
        // Парящие галлюциногенные мини-грибочки и споры на 6-м уровне
        ctx.rotate(Math.sin(tp.phase) * 0.35);
        ctx.globalAlpha = 0.85;
        const hue = (tp.hue + this.time * 95) % 360;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-r * 0.22, 0, r * 0.44, r * 0.8);
        ctx.fillStyle = `hsl(${hue}, 100%, 62%)`;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, Math.PI, 0); ctx.fill();
      } else if (lvl.theme === 'horror') {
        const cols = ['#ff002b', '#ffbe0b', '#06d6a0', '#48dbfb'];
        ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(tp.phase * 1.6));
        ctx.fillStyle = cols[tp.kindIdx % cols.length];
        ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2); ctx.fill();
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
        const pastelCol = `hsl(${165 + Math.sin(tp.phase) * 45}, 90%, 80%)`;
        ctx.strokeStyle = pastelCol; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.65;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
      } else if (lvl.theme === 'organic') {
        ctx.rotate(tp.rot); ctx.globalAlpha = 0.80;
        ctx.fillStyle = tp.kindIdx === 0 ? '#ccff33' : '#80ed99';
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
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

    this.drawLevelGeometry(ctx, lvl, W, H);

    if (lvl.theme === 'lsd' || lvl.theme === 'mushroom') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.36;
      ctx.lineCap = 'round';
      const waveConfigs = [
        { yFrac: 0.16, amp: 52, freq: 0.011, speed: 2.3, width: 7, dir: 1 },
        { yFrac: 0.44, amp: 35, freq: 0.018, speed: -1.8, width: 4.5, dir: -1 },
        { yFrac: 0.74, amp: 62, freq: 0.009, speed: 1.5, width: 8.5, dir: 1 }
      ];
      waveConfigs.forEach((cfg, s) => {
        const hue = (this.time * 58 + s * 110) % 360;
        ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
        ctx.lineWidth = cfg.width;
        ctx.beginPath();
        for (let x = -80; x <= W + 80; x += 14) {
          const sy = H * cfg.yFrac + Math.sin(x * cfg.freq + this.time * cfg.speed + s * 1.7) * cfg.amp;
          if (x === -80) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    if (lvl.theme === 'rainbow') {
      ctx.save();
      ctx.globalAlpha = 0.25;
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

    this.drawThemeParticles(ctx, lvl, W, H);
  }
}
