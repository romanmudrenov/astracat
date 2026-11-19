'use strict';

class VFXEngine {
  constructor() {
    this.particles = [];
    this.trails = [];
    this.shockwaves = [];
    this.popups = [];
    this.arcs = [];
    this.flashColor = '#ffffff';
    this.flashAlpha = 0;

    this.maxParticles = 95;
    this.maxTrails = 45;
    this.maxShockwaves = 10;
    this.maxPopups = 14;
  }

  clear() {
    this.particles = [];
    this.trails = [];
    this.shockwaves = [];
    this.popups = [];
    this.arcs = [];
    this.flashAlpha = 0;
  }

  triggerFlash(color = '#ffffff', alpha = 0.28) {
    this.flashColor = color;
    this.flashAlpha = Math.min(0.45, Math.max(this.flashAlpha, alpha));
  }

  addTrail(x, y, color = '#48dbfb', r = 4, life = 0.14) {
    if (this.trails.length >= this.maxTrails) this.trails.shift();
    this.trails.push({ x, y, color, r, life, maxLife: life });
  }

  addShockwave(x, y, color = '#ffffff', maxR = 85, dur = 0.36) {
    if (this.shockwaves.length >= this.maxShockwaves) this.shockwaves.shift();
    this.shockwaves.push({ x, y, color, r: 8, maxR, life: dur, maxLife: dur });
  }

  addPopup(x, y, text, color = '#ffd166', scale = 1.0) {
    if (this.popups.length >= this.maxPopups) this.popups.shift();
    this.popups.push({
      x,
      y,
      vy: -46,
      text,
      color,
      scale,
      life: 0.95,
      maxLife: 0.95
    });
  }

  addLightningArc(x1, y1, x2, y2, color = '#fee440') {
    if (this.arcs.length > 8) this.arcs.shift();
    const pts = [{ x: x1, y: y1 }];
    const steps = 4;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 26,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 26
      });
    }
    pts.push({ x: x2, y: y2 });
    this.arcs.push({ pts, color, life: 0.16, maxLife: 0.16 });
  }

  addBurst(x, y, colors = ['#ffd166', '#ffffff'], count = 10, speed = 170) {
    const allowed = Math.min(count, Math.max(0, this.maxParticles - this.particles.length));
    for (let i = 0; i < allowed; i++) {
      const ang = (Math.PI * 2 * i) / Math.max(1, count) + (Math.random() - 0.5) * 0.5;
      const spd = speed * (0.45 + Math.random() * 0.65);
      const life = 0.28 + Math.random() * 0.22;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 2.6 + Math.random() * 2.8,
        color: colors[i % colors.length],
        life,
        maxLife: life,
        drag: 0.92
      });
    }
  }

  addHitSparks(x, y, color = '#ffd166', count = 7) {
    this.addBurst(x, y, [color, '#ffffff'], Math.min(7, count), 155);
  }

  addSmoke(x, y) {
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push({
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 25,
      vy: -35 - Math.random() * 25,
      r: 7 + Math.random() * 5,
      color: 'rgba(180, 170, 200, 0.55)',
      life: 0.45,
      maxLife: 0.45,
      drag: 0.96
    });
  }

  addRealisticExplosion(x, y, accent = '#ffbe0b', scale = 1.0, c1 = null, c2 = null) {
    const palette = [accent, '#ffffff', '#ffd166'];
    if (c1) palette.push(c1);
    if (c2) palette.push(c2);

    this.addShockwave(x, y, accent, 68 * Math.min(1.8, scale), 0.34);
    const count = Math.min(16, Math.round(10 * scale));
    this.addBurst(x, y, palette, count, 185 * Math.min(1.4, scale));
  }

  update(dt) {
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 1.4);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    for (let i = this.trails.length - 1; i >= 0; i--) {
      const t = this.trails[i];
      t.life -= dt;
      if (t.life <= 0) this.trails.splice(i, 1);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life -= dt;
      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }
      const prog = 1 - sw.life / sw.maxLife;
      sw.r = 8 + (sw.maxR - 8) * prog;
    }

    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const a = this.arcs[i];
      a.life -= dt;
      if (a.life <= 0) this.arcs.splice(i, 1);
    }

    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life -= dt;
      if (pop.life <= 0) {
        this.popups.splice(i, 1);
        continue;
      }
      pop.y += pop.vy * dt;
      pop.vy *= 0.95;
    }
  }

  renderTrails(ctx) {
    if (!this.trails.length) return;
    ctx.save();
    for (let i = 0; i < this.trails.length; i++) {
      const t = this.trails[i];
      const alpha = (t.life / t.maxLife) * 0.42;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * (t.life / t.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderForeground(ctx, W, H) {
    ctx.save();

    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      const alpha = (sw.life / sw.maxLife) * 0.72;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const ratio = p.life / p.maxLife;
      ctx.globalAlpha = Math.min(1, ratio * 1.15);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.2, p.r * ratio), 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < this.arcs.length; i++) {
      const a = this.arcs[i];
      ctx.globalAlpha = a.life / a.maxLife;
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      a.pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
    }

    if (this.popups.length) {
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#120826';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < this.popups.length; i++) {
        const pop = this.popups[i];
        const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.4);
        ctx.globalAlpha = alpha;
        ctx.font = `900 ${Math.round(14 * (pop.scale || 1))}px sans-serif`;
        ctx.strokeText(pop.text, pop.x, pop.y);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, pop.x, pop.y);
      }
    }

    if (this.flashAlpha > 0) {
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.restore();
  }
}
