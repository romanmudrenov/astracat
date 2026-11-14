'use strict';

class VFXEngine {
  constructor() {
    this.particles = [];
    this.shockwaves = [];
    this.popups = [];
    this.trails = [];
    this.debris = [];
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
  }

  clear() {
    this.particles = [];
    this.shockwaves = [];
    this.popups = [];
    this.trails = [];
    this.debris = [];
    this.flashAlpha = 0;
  }

  triggerFlash(color = '#ffffff', alpha = 0.25) {
    this.flashColor = color;
    this.flashAlpha = Math.max(this.flashAlpha, alpha);
  }

  addShockwave(x, y, color = '#48dbfb', maxR = 80, duration = 0.35) {
    if (this.shockwaves.length > 25) this.shockwaves.shift();
    this.shockwaves.push({
      x, y,
      r: 8,
      maxR,
      color,
      life: duration,
      maxLife: duration
    });
  }

  addBurst(x, y, colors, count = 14, speed = 200) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 160) this.particles.shift();
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.25 + Math.random() * 0.85) * speed;
      const life = 0.25 + Math.random() * 0.32;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 2.5 + Math.random() * 4.5,
        color: colors[i % colors.length],
        life,
        maxLife: life,
        drag: 0.92,
        shape: i % 3 === 0 ? 'star' : 'circle'
      });
    }
  }

  // Реалистичный 4-слойный взрыв (ядро вспышки + двойная волна + раскалённые обломки + клубы дыма)
  addRealisticExplosion(x, y, accent = '#ff9f1c', scale = 1.0) {
    // 1. Ослепительное горячее ядро
    this.particles.push({
      x, y, vx: 0, vy: 0,
      r: 28 * scale,
      color: '#ffffff',
      life: 0.16,
      maxLife: 0.16,
      drag: 1,
      shape: 'core'
    });

    // 2. Двойная ударная волна
    this.addShockwave(x, y, accent, 85 * scale, 0.38);
    if (scale >= 1.2) {
      this.addShockwave(x, y, '#ffd166', 135 * scale, 0.52);
    }

    // 3. Раскалённые искры и пламя
    this.addBurst(
      x, y,
      ['#ffffff', '#ffd166', '#ff9f1c', '#ff5964', accent],
      Math.round(16 * scale),
      230 * scale
    );

    // 4. Вращающиеся обломки корпуса и густой дым
    const debrisCount = Math.round(7 * scale);
    for (let i = 0; i < debrisCount; i++) {
      if (this.debris.length > 45) this.debris.shift();
      const ang = Math.random() * Math.PI * 2;
      const spd = (60 + Math.random() * 140) * scale;
      this.debris.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 14,
        size: (4 + Math.random() * 5) * Math.min(1.5, scale),
        color: i % 2 === 0 ? '#3a3059' : '#ff6b35',
        life: 0.55 + Math.random() * 0.35,
        maxLife: 0.9
      });
    }

    for (let s = 0; s < Math.round(4 * scale); s++) {
      this.addSmoke(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
    }
  }

  addSmoke(x, y) {
    if (this.particles.length > 160) this.particles.shift();
    this.particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 32,
      vy: -25 - Math.random() * 35,
      r: 8 + Math.random() * 9,
      color: 'rgba(30, 22, 51, 0.68)',
      life: 0.52,
      maxLife: 0.52,
      drag: 0.96,
      shape: 'smoke'
    });
  }

  addTrail(x, y, color, r = 5, life = 0.2) {
    if (this.trails.length > 50) this.trails.shift();
    this.trails.push({ x, y, color, r, life, maxLife: life });
  }

  addPopup(x, y, text, color = '#ffd166', scale = 1) {
    if (this.popups.length > 16) this.popups.shift();
    this.popups.push({
      x, y,
      text,
      color,
      scale,
      vy: -54,
      life: 0.95,
      maxLife: 0.95
    });
  }

  update(dt) {
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 1.6);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life -= dt;
      if (sw.life <= 0) { this.shockwaves.splice(i, 1); continue; }
      const t = 1 - sw.life / sw.maxLife;
      sw.r = 8 + (sw.maxR - 8) * (1 - Math.pow(1 - t, 3));
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) { this.particles.splice(i, 1); continue; }
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vx *= pt.drag;
      pt.vy *= pt.drag;
      if (pt.shape === 'smoke') pt.r += dt * 18;
      if (pt.shape === 'core') pt.r += dt * 95;
    }

    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      if (d.life <= 0) { this.debris.splice(i, 1); continue; }
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vx *= 0.94;
      d.vy *= 0.94;
      d.rot += d.vrot * dt;
    }

    for (let i = this.trails.length - 1; i >= 0; i--) {
      const tr = this.trails[i];
      tr.life -= dt;
      if (tr.life <= 0) this.trails.splice(i, 1);
    }

    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life -= dt;
      if (pop.life <= 0) { this.popups.splice(i, 1); continue; }
      pop.y += pop.vy * dt;
      pop.vy *= 0.95;
    }
  }

  renderTrails(ctx) {
    for (const tr of this.trails) {
      const alpha = Math.max(0, tr.life / tr.maxLife);
      ctx.globalAlpha = alpha * 0.45;
      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  renderForeground(ctx, W, H) {
    for (const sw of this.shockwaves) {
      const alpha = Math.max(0, sw.life / sw.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 4 * alpha + 1;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const d of this.debris) {
      const alpha = Math.max(0, d.life / d.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillStyle = d.color;
      ctx.strokeStyle = '#1e1633';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.65);
      ctx.strokeRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.65);
      ctx.restore();
    }

    for (const pt of this.particles) {
      const alpha = Math.max(0, pt.life / pt.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(pt.x, pt.y);
      ctx.fillStyle = pt.color;

      if (pt.shape === 'smoke' || pt.shape === 'core') {
        ctx.beginPath();
        ctx.arc(0, 0, pt.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.shape === 'star') {
        const r = pt.r * (0.4 + alpha * 0.6);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * i) / 4;
          const rad = i % 2 === 0 ? r * 1.4 : r * 0.5;
          if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, pt.r * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.textAlign = 'center';
    for (const pop of this.popups) {
      const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.4);
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${Math.round(15 * pop.scale)}px 'Segoe UI', sans-serif`;
      ctx.strokeStyle = '#1e1633';
      ctx.lineWidth = 4;
      ctx.strokeText(pop.text, pop.x, pop.y);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, pop.x, pop.y);
    }
    ctx.restore();

    if (this.flashAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }
}
