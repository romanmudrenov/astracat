'use strict';

class VFXEngine {
  constructor() {
    this.particles = [];
    this.shockwaves = [];
    this.trails = [];
    this.popups = [];
    this.screenFlash = 0;
    this.flashColor = '#ffffff';
  }

  clear() {
    this.particles = [];
    this.shockwaves = [];
    this.trails = [];
    this.popups = [];
    this.screenFlash = 0;
  }

  triggerFlash(color = '#ffffff', intensity = 0.35) {
    this.flashColor = color;
    this.screenFlash = Math.min(0.6, Math.max(this.screenFlash, intensity));
  }

  addShockwave(x, y, color = '#48dbfb', maxRadius = 85, duration = 0.42) {
    this.shockwaves.push({
      x,
      y,
      color,
      radius: 8,
      maxRadius,
      life: duration,
      maxLife: duration
    });
  }

  addTrail(x, y, color = '#ffd166', r = 5, life = 0.22) {
    this.trails.push({
      x,
      y,
      color,
      r,
      life,
      maxLife: life
    });
  }

  addBurst(x, y, colors, count = 14, speed = 190, shape = 'circle') {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const spd = speed * (0.35 + Math.random() * 0.8);
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 10,
        color: colors[i % colors.length],
        shape: i % 3 === 0 ? 'star' : shape,
        life: 0.36 + Math.random() * 0.3,
        maxLife: 0.66
      });
    }
  }

  addSmoke(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 35,
      vy: -45 - Math.random() * 35,
      r: 7 + Math.random() * 6,
      rot: 0,
      vrot: 0,
      color: 'rgba(40, 32, 68, 0.65)',
      shape: 'smoke',
      life: 0.55,
      maxLife: 0.55
    });
  }

  addPopup(x, y, text, color = '#ffd166', scale = 1.0) {
    this.popups.push({
      x,
      y,
      text,
      color,
      scale,
      life: 1.05
    });
  }

  update(dt) {
    if (this.screenFlash > 0) {
      this.screenFlash = Math.max(0, this.screenFlash - dt * 1.6);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life -= dt;
      const progress = 1 - Math.max(0, sw.life / sw.maxLife);
      sw.radius = 8 + (sw.maxRadius - 8) * (1 - Math.pow(1 - progress, 2.5));
      if (sw.life <= 0) this.shockwaves.splice(i, 1);
    }

    for (let i = this.trails.length - 1; i >= 0; i--) {
      const tr = this.trails[i];
      tr.life -= dt;
      if (tr.life <= 0) this.trails.splice(i, 1);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.shape === 'smoke') {
        pt.r += dt * 14;
      } else {
        pt.vx *= 0.93;
        pt.vy *= 0.93;
        pt.rot += pt.vrot * dt;
      }
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pp = this.popups[i];
      pp.y -= 44 * dt;
      pp.life -= dt;
      if (pp.life <= 0) this.popups.splice(i, 1);
    }
  }

  renderTrails(ctx) {
    for (const tr of this.trails) {
      const ratio = Math.max(0, tr.life / tr.maxLife);
      ctx.save();
      ctx.globalAlpha = ratio * 0.65;
      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.r * ratio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  renderForeground(ctx, W, H) {
    // Ударные волны
    for (const sw of this.shockwaves) {
      const ratio = Math.max(0, sw.life / sw.maxLife);
      ctx.save();
      ctx.globalAlpha = ratio * 0.85;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 4 * ratio + 1;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Частицы взрывов, звёздочки и дым
    for (const pt of this.particles) {
      const ratio = Math.max(0, pt.life / pt.maxLife);
      ctx.save();
      ctx.globalAlpha = ratio;
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.rot);

      if (pt.shape === 'smoke') {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(0, 0, pt.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.shape === 'star') {
        ctx.fillStyle = pt.color;
        ctx.strokeStyle = '#1e1633';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const rad = k % 2 === 0 ? pt.r * 1.25 : pt.r * 0.5;
          const a = (Math.PI * k) / 4;
          if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = pt.color;
        ctx.strokeStyle = '#1e1633';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // Всплывающие надписи и очки
    for (const pp of this.popups) {
      const ratio = Math.min(1, pp.life * 1.5);
      ctx.save();
      ctx.globalAlpha = ratio;
      ctx.translate(pp.x, pp.y);
      ctx.scale(pp.scale, pp.scale);
      ctx.fillStyle = pp.color;
      ctx.strokeStyle = '#1e1633';
      ctx.lineWidth = 3.8;
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(pp.text, 0, 0);
      ctx.fillText(pp.text, 0, 0);
      ctx.restore();
    }

    // Вспышка экрана при мощном попадании или суператаке
    if (this.screenFlash > 0) {
      ctx.save();
      ctx.globalAlpha = this.screenFlash;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }
}
