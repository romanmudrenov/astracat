'use strict';

class VFXEngine {
  constructor() {
    this.particles = [];
    this.fireballs = [];
    this.sparks = [];
    this.debris = [];
    this.lightnings = [];
    this.shockwaves = [];
    this.popups = [];
    this.trails = [];
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
  }

  clear() {
    this.particles = [];
    this.fireballs = [];
    this.sparks = [];
    this.debris = [];
    this.lightnings = [];
    this.shockwaves = [];
    this.popups = [];
    this.trails = [];
    this.flashAlpha = 0;
  }

  triggerFlash(color = '#ffffff', alpha = 0.25) {
    this.flashColor = color;
    this.flashAlpha = Math.max(this.flashAlpha, alpha);
  }

  addShockwave(x, y, color = '#48dbfb', maxR = 85, duration = 0.38) {
    if (this.shockwaves.length > 24) this.shockwaves.shift();
    this.shockwaves.push({
      x, y, r: 8, maxR, color, life: duration, maxLife: duration
    });
  }

  // Яркие направленные искры при попадании снаряда в броню корабля или препятствие
  addHitSparks(x, y, color = '#80ffdb', count = 10) {
    for (let i = 0; i < count; i++) {
      if (this.sparks.length > 140) this.sparks.shift();
      const ang = Math.PI * 0.2 + Math.random() * Math.PI * 0.6 + (Math.random() - 0.5) * 1.8;
      const spd = 140 + Math.random() * 260;
      const life = 0.14 + Math.random() * 0.16;
      this.sparks.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        len: 7 + Math.random() * 9,
        color: i % 2 === 0 ? '#ffffff' : color,
        life,
        maxLife: life
      });
    }
  }

  // Электрическая дуга молнии между двумя точками (для оружия «Электрический удар»)
  addLightningArc(x1, y1, x2, y2, color = '#72efdd') {
    if (this.lightnings.length > 16) this.lightnings.shift();
    const segments = 7;
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const bx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 26;
      const by = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 26;
      pts.push({ x: bx, y: by });
    }
    pts.push({ x: x2, y: y2 });
    this.lightnings.push({ pts, color, life: 0.22, maxLife: 0.22 });
  }

  addBurst(x, y, colors, count = 14, speed = 200) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 150) this.particles.shift();
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.25 + Math.random() * 0.85) * speed;
      const life = 0.26 + Math.random() * 0.32;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 2.5 + Math.random() * 4.5,
        color: colors[i % colors.length],
        life,
        maxLife: life,
        drag: 0.92,
        glow: true
      });
    }
  }

  // РЕАЛИСТИЧНЫЙ ВЗРЫВ КОРАБЛЯ: Огненные клубы + Разлетающиеся 3D-детали корабля + Искры
  addRealisticExplosion(x, y, accent = '#ff9f1c', scale = 1.0, wingCol = '#ff5964', bodyCol = '#3a506b') {
    this.addShockwave(x, y, accent, 95 * scale, 0.42);
    if (scale >= 1.1) {
      this.addShockwave(x, y, '#ffd166', 145 * scale, 0.56);
    }

    // 1. Клубы настоящего огня (переход: белое ядро -> жёлтое пламя -> оранжевый огонь -> тёмный дым)
    const fireCount = Math.round(14 * scale);
    for (let i = 0; i < fireCount; i++) {
      if (this.fireballs.length > 90) this.fireballs.shift();
      const ang = Math.random() * Math.PI * 2;
      const spd = (20 + Math.random() * 115) * scale;
      const life = 0.35 + Math.random() * 0.35;
      this.fireballs.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 18,
        r: (10 + Math.random() * 12) * scale,
        life,
        maxLife: life
      });
    }

    // 2. Снопы раскалённых искр
    this.addHitSparks(x, y, accent, Math.round(16 * scale));

    // 3. Различающиеся детали разрушенного вражеского корабля (крылья, турбины, бронелисты, кабина)
    const partTypes = ['wing_left', 'wing_right', 'turbine', 'hull_plate', 'dome_shard'];
    const partsCount = Math.min(8, Math.round(5 * scale));
    for (let i = 0; i < partsCount; i++) {
      if (this.debris.length > 45) this.debris.shift();
      const ang = (Math.PI * 2 * i) / partsCount + (Math.random() - 0.5) * 0.5;
      const spd = (75 + Math.random() * 135) * scale;
      this.debris.push({
        part: partTypes[i % partTypes.length],
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 15,
        size: (8 + Math.random() * 5) * Math.min(1.4, scale),
        primaryCol: i % 2 === 0 ? wingCol : bodyCol,
        accentCol: accent,
        life: 0.65 + Math.random() * 0.35,
        maxLife: 1.0
      });
    }
  }

  addSmoke(x, y) {
    if (this.fireballs.length > 90) this.fireballs.shift();
    this.fireballs.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 28,
      vy: -30 - Math.random() * 30,
      r: 9 + Math.random() * 8,
      life: 0.42,
      maxLife: 0.85
    });
  }

  addTrail(x, y, color, r = 5, life = 0.2) {
    if (this.trails.length > 55) this.trails.shift();
    this.trails.push({ x, y, color, r, life, maxLife: life });
  }

  addPopup(x, y, text, color = '#ffd166', scale = 1) {
    if (this.popups.length > 16) this.popups.shift();
    this.popups.push({
      x, y, text, color, scale, vy: -54, life: 0.95, maxLife: 0.95
    });
  }

  update(dt) {
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 1.8);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life -= dt;
      if (sw.life <= 0) { this.shockwaves.splice(i, 1); continue; }
      const t = 1 - sw.life / sw.maxLife;
      sw.r = 8 + (sw.maxR - 8) * (1 - Math.pow(1 - t, 3));
    }

    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const fb = this.fireballs[i];
      fb.life -= dt;
      if (fb.life <= 0) { this.fireballs.splice(i, 1); continue; }
      fb.x += fb.vx * dt;
      fb.y += fb.vy * dt;
      fb.vx *= 0.92;
      fb.vy *= 0.92;
      fb.r += dt * 16;
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.life -= dt;
      if (sp.life <= 0) { this.sparks.splice(i, 1); continue; }
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vx *= 0.90;
      sp.vy *= 0.90;
    }

    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      this.lightnings[i].life -= dt;
      if (this.lightnings[i].life <= 0) this.lightnings.splice(i, 1);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) { this.particles.splice(i, 1); continue; }
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vx *= pt.drag;
      pt.vy *= pt.drag;
    }

    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      if (d.life <= 0) { this.debris.splice(i, 1); continue; }
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vx *= 0.95;
      d.vy *= 0.95;
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
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const tr of this.trails) {
      const alpha = Math.max(0, tr.life / tr.maxLife);
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderForeground(ctx, W, H) {
    // 1. Детали разрушенных кораблей (объёмные обломки)
    for (const d of this.debris) {
      const alpha = Math.max(0, d.life / d.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.strokeStyle = '#140c29';
      ctx.lineWidth = 1.8;

      const s = d.size;
      if (d.part === 'wing_left' || d.part === 'wing_right') {
        ctx.fillStyle = d.primaryCol;
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.6);
        ctx.lineTo(s * 1.1, 0);
        ctx.lineTo(-s * 0.4, s * 0.8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e0fbfc';
        ctx.beginPath(); ctx.arc(-s * 0.3, 0, 1.4, 0, Math.PI * 2); ctx.fill();
      } else if (d.part === 'turbine') {
        ctx.fillStyle = '#4a5759';
        ctx.fillRect(-s * 0.6, -s * 0.4, s * 1.2, s * 0.8);
        ctx.strokeRect(-s * 0.6, -s * 0.4, s * 1.2, s * 0.8);
        ctx.fillStyle = d.accentCol;
        ctx.beginPath(); ctx.arc(s * 0.6, 0, s * 0.35, 0, Math.PI * 2); ctx.fill();
      } else if (d.part === 'dome_shard') {
        ctx.fillStyle = '#90e0ef';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.65, 0, Math.PI * 1.2);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = d.primaryCol;
        ctx.fillRect(-s * 0.7, -s * 0.5, s * 1.4, s);
        ctx.strokeRect(-s * 0.7, -s * 0.5, s * 1.4, s);
      }
      ctx.restore();
    }

    // 2. Огненные шары и клубы пламени (с переходом в дым)
    for (const fb of this.fireballs) {
      const ratio = fb.life / fb.maxLife;
      ctx.save();
      if (ratio > 0.35) {
        ctx.globalCompositeOperation = 'lighter';
      }
      ctx.globalAlpha = Math.min(1, ratio * 1.25);
      if (ratio > 0.75) ctx.fillStyle = '#ffffff';
      else if (ratio > 0.52) ctx.fillStyle = '#ffe169';
      else if (ratio > 0.30) ctx.fillStyle = '#ff6b35';
      else ctx.fillStyle = 'rgba(32, 22, 54, 0.72)';

      ctx.beginPath();
      ctx.arc(fb.x, fb.y, fb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Неоновые ударные волны, искры попаданий и дуги молний (Additive Glow)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const sw of this.shockwaves) {
      const alpha = Math.max(0, sw.life / sw.maxLife);
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 4 * alpha + 1.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const sp of this.sparks) {
      const alpha = Math.max(0, sp.life / sp.maxLife);
      const spd = Math.hypot(sp.vx, sp.vy) || 1;
      const dx = (sp.vx / spd) * sp.len;
      const dy = (sp.vy / spd) * sp.len;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(sp.x - dx, sp.y - dy);
      ctx.stroke();
    }

    for (const lt of this.lightnings) {
      const alpha = Math.max(0, lt.life / lt.maxLife);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = lt.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      lt.pts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (const pt of this.particles) {
      const alpha = Math.max(0, pt.life / pt.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Всплывающий текст очков и бонусов
    ctx.save();
    ctx.textAlign = 'center';
    for (const pop of this.popups) {
      const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.4);
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${Math.round(15 * pop.scale)}px 'Segoe UI', sans-serif`;
      ctx.strokeStyle = '#120a2a';
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
