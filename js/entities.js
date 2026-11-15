'use strict';

const INK = '#120a28';

const SHIPS_CATALOG = [
  {
    id: 'shuttle',
    name: 'Кото-Шаттл МК-1',
    desc: 'Базовый 3D-шаттл Котовии-17. Отличный баланс брони и манёвра.',
    price: 0,
    hpBonus: 0,
    speedMult: 1.0,
    fireRateMult: 1.0,
    dmgMult: 1.0,
    coinMult: 1.0,
    hullColor: '#e0fbfc',
    wingColor: '#ff5964',
    neonColor: '#48dbfb'
  },
  {
    id: 'interceptor',
    name: 'Неоновый Перехватчик',
    desc: '+25% скорость, +18% скорострельность, +20% монет с врагов.',
    price: 850,
    hpBonus: 1,
    speedMult: 1.25,
    fireRateMult: 0.82,
    dmgMult: 1.15,
    coinMult: 1.2,
    hullColor: '#caf0f8',
    wingColor: '#72efdd',
    neonColor: '#80ffdb'
  },
  {
    id: 'dreadnought',
    name: 'Линкор Котовии-17',
    desc: '+3 брони, +45% урон орудий, двойные турбины и +40% монет.',
    price: 1800,
    hpBonus: 3,
    speedMult: 1.08,
    fireRateMult: 0.88,
    dmgMult: 1.45,
    coinMult: 1.4,
    hullColor: '#ffd6a5',
    wingColor: '#9b5de5',
    neonColor: '#ff9f1c'
  }
];

const WEAPONS_CATALOG = [
  {
    id: 'droplet',
    name: 'Капельная Плазма',
    desc: 'Мягкие ASMR-капли воды с бархатным звуком.',
    price: 0,
    dmgBonus: 1.0,
    bulletColor: '#48dbfb'
  },
  {
    id: 'kalimba',
    name: 'Калимба-Луч',
    desc: 'Сдвоенные кристаллы с мягким ASMR-щелчком (+55% урона).',
    price: 650,
    dmgBonus: 1.55,
    bulletColor: '#72efdd'
  },
  {
    id: 'silk_spread',
    name: 'Шёлковый Дробовик',
    desc: 'Тройной веер импульсов с глухим постукиванием (+110% мощи).',
    price: 1400,
    dmgBonus: 2.1,
    bulletColor: '#ff8fab'
  }
];

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Галлюциногенные корабли переливаются всеми цветами радуги на фоне живых синусоид! Оракул Фракталов бьёт психо-волнами изо рта и лазерами из глаз!',
    enemiesDesc: 'Переливающиеся Психо-Глаза, Гриб-Крейсеры и Фрактал-Медузы',
    bossName: 'Оракул Фракталов',
    bossWeapon: 'Разноцветные психо-волны изо рта и лазеры из глаз',
    theme: 'lsd',
    enemyTypes: ['psy_eye', 'shroom_cruiser', 'fractal_medusa'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 350
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Среди планет-черепов атакуют Корабли-Скелеты с лазерами, Корабли-Летучие Мыши с ракетами и Корабли-Зомби! Впереди — Вампир-Слизняк!',
    enemiesDesc: 'Корабли-Скелеты (лазеры), Летучие Мыши (ракеты) и Корабли-Зомби',
    bossName: 'Вампир-Слизняк Кровожадный',
    bossWeapon: 'Поток адского огня изо рта и кровавые лучи из глаз',
    theme: 'horror',
    enemyTypes: ['skeleton_ship', 'bat_ship', 'zombie_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ff002b', bossColor: '#4a0e2e', hpMult: 1.22, coinReward: 520
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'На фоне широких радужных синусоид, печенья и пончиков атакуют полу-корабли Единороги и Радужки-Мутанты! Облетай неоновые пончики и облачка-мечтания!',
    enemiesDesc: 'Кибер-Единороги (лазеры), Радужки-Мутанты (ракеты) и Пегас-Крейсеры',
    bossName: 'Пончик-Мутант Глазурный',
    bossWeapon: 'Волны радуги изо рта и двойные лазеры из глаз',
    theme: 'rainbow',
    enemyTypes: ['unicorn_lancer', 'iris_mutant', 'pegasus_bomber'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.40, coinReward: 720
  },
  {
    id: 4,
    name: 'Подводный Океан',
    story: 'Корабль Реджа погрузился в инопланетный океан! Облетай глубинные мины и сражайся с батискафами.',
    enemiesDesc: 'Батискафы Пришельцев, Субмарины-Скаты и Гидро-Дроны',
    bossName: 'Глубоководный Левиафан',
    bossWeapon: 'Торпедный залп и пузырьковые волны',
    theme: 'underwater',
    enemyTypes: ['sub_bathyscaphe', 'sub_manta', 'sub_hydro'],
    skyTop: '#041c2c', skyMid: '#08334a', skyBot: '#0e5273',
    accent: '#00f5d4', bossColor: '#0096c7', hpMult: 1.65, coinReward: 950
  },
  {
    id: 5,
    name: 'Органический Мир',
    story: 'Финальный рубеж! Живые био-корабли в мозолях и реакторы защищают Императора Омега-Кракена!',
    enemiesDesc: 'Био-Дредноуты, Споровые Корветы и Клеточные Зонды',
    bossName: 'Император Омега-Кракен',
    bossWeapon: 'Все виды атак + Гипер-Луч',
    theme: 'organic',
    enemyTypes: ['bio_dreadnought', 'bio_corvette', 'bio_cell'],
    skyTop: '#140512', skyMid: '#2e0923', skyBot: '#4f0f3b',
    accent: '#ff006e', bossColor: '#d90429', hpMult: 2.05, coinReward: 1400
  }
];

const DIFFICULTIES = {
  easy:   { label: 'Курсант', playerHp: 7, enemyHp: 0.8, bulletSpeed: 0.82, spawnRate: 1.18, scoreMult: 0.85 },
  normal: { label: 'Пилот',   playerHp: 5, enemyHp: 1.0, bulletSpeed: 1.0,  spawnRate: 1.0,  scoreMult: 1.0 },
  hard:   { label: 'Ас',      playerHp: 3, enemyHp: 1.3, bulletSpeed: 1.22, spawnRate: 0.82, scoreMult: 1.35 }
};

function roundRectPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function drawWarts(ctx, spots, baseCol, hiCol) {
  spots.forEach(([x, y, r]) => {
    ctx.fillStyle = baseCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = hiCol;
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.42, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawRivets(ctx, points) {
  ctx.fillStyle = '#e0fbfc';
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2.0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.12;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const glowColors = {
    green_star:       '#06d6a0',
    red_shield:       '#ff5964',
    fractal_shuriken: '#00f5d4',
    electric_shock:   '#fee440',
    wave_cannon:      '#f15bb5'
  };
  const neonCol = glowColors[bn.type] || '#ffd166';

  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1b1438';
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'green_star' || bn.type === 'red_shield') {
    ctx.fillStyle = bn.type === 'green_star' ? '#06d6a0' : '#ff5964';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x1 = Math.cos(a) * 14;
      const y1 = Math.sin(a) * 14;
      const x2 = Math.cos(a + Math.PI / 5) * 6;
      const y2 = Math.sin(a + Math.PI / 5) * 6;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (bn.type === 'fractal_shuriken') {
    ctx.rotate(bn.phase);
    ctx.fillStyle = '#00f5d4';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6;
      const rad = i % 2 === 0 ? 14 : 5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (bn.type === 'electric_shock') {
    ctx.fillStyle = '#fee440';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(3, -13); ctx.lineTo(-9, 1); ctx.lineTo(-1, 1); ctx.lineTo(-5, 13); ctx.lineTo(9, -2); ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (bn.type === 'wave_cannon') {
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => {
      ctx.beginPath();
      ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });
  } else {
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(11, 9); ctx.lineTo(-11, 9);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  ctx.restore();
}

function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'fractal_shuriken') {
    ctx.rotate(b.rot || 0);
    ctx.fillStyle = 'rgba(0, 245, 212, 0.28)';
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#00f5d4';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6;
      const rad = i % 2 === 0 ? 13 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'electric_bolt') {
    ctx.fillStyle = 'rgba(254, 228, 64, 0.35)';
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#fee440';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(-6, -4); ctx.lineTo(5, 3); ctx.lineTo(0, 14);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.stroke();
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = b.color || '#48dbfb';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.55, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// ПРЕПЯТСТВИЯ НА КАРТЕ:
// - На 3-м уровне («Радужный Поток»): переливающиеся с неоном ПОНЧИКИ, ОБЛАЧКА-МЕЧТАНИЯ и РАДУЖНЫЕ ТУЧКИ!
// - На остальных уровнях: металлические 3D-реакторы, шестерни и пилоны.
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const hue = Math.floor(((ob.phase || 0) * 90) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 66%)`;
  const dynamicNeon2 = `hsl(${(hue + 110) % 360}, 100%, 72%)`;

  if (ob.shape === 'rainbow_donut') {
    // 1. Переливающийся неоновый Пончик-препятствие
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f4a261';
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, ob.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Волнистая переливающаяся глазурь
    ctx.fillStyle = `hsl(${(hue + 40) % 360}, 95%, 62%)`;
    ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.82, 0, Math.PI * 2); ctx.fill();

    // Светящаяся посыпка
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * i) / 3;
      const sx = Math.cos(a) * (ob.r * 0.56);
      const sy = Math.sin(a) * (ob.r * 0.56);
      ctx.beginPath();
      ctx.moveTo(sx - 3, sy - 2);
      ctx.lineTo(sx + 3, sy + 2);
      ctx.stroke();
    }

    // Дырка бублика с неоновым ободком
    ctx.fillStyle = '#1d1447';
    ctx.strokeStyle = dynamicNeon2;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (ob.shape === 'dream_bubble') {
    // 2. Облачко-Мечтание (парящий мыслепузырь с переливающимся неоном и звёздочкой мечты внутри)
    ctx.fillStyle = dynamicNeon;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 11, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Маленькие пузырьки мыслей снизу
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(-14, ob.r + 6, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-8, ob.r + 1, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Пушистый купол облачка-мечтания
    ctx.fillStyle = `hsl(${hue}, 90%, 88%)`;
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 3;
    [[-12, 4, 14], [12, 4, 14], [-6, -8, 15], [8, -8, 15], [0, 2, 16]].forEach(([cx, cy, cr]) => {
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    // Внутренний фон без обводки
    ctx.fillStyle = `hsl(${hue}, 90%, 92%)`;
    ctx.beginPath(); ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2); ctx.fill();

    // Сияющая звёздочка-мечта в центре облачка
    ctx.fillStyle = dynamicNeon2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x1 = Math.cos(a) * 10;
      const y1 = Math.sin(a) * 10;
      const x2 = Math.cos(a + Math.PI / 5) * 4.2;
      const y2 = Math.sin(a + Math.PI / 5) * 4.2;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (ob.shape === 'rainbow_cloud') {
    // 3. Неоновое Радужное Облачко с радужными дугами
    ctx.fillStyle = dynamicNeon2;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Радуга над облачком
    ['#ff3366', '#ffee33', '#33ee88', '#33ccff'].forEach((rc, idx) => {
      ctx.strokeStyle = rc;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 4, ob.r - idx * 3.2, Math.PI, Math.PI * 2);
      ctx.stroke();
    });

    // Переливающееся пушистое основание облачка
    ctx.fillStyle = `hsl(${(hue + 180) % 360}, 95%, 82%)`;
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 2.8;
    [[-14, 6, 11], [0, 5, 13], [14, 6, 11]].forEach(([cx, cy, cr]) => {
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.restore();
    return;
  }

  // Металлические препятствия для остальных уровней
  const neonCol = ob.neonColor || '#00f5d4';
  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.24;
  ctx.beginPath();
  ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.rotate(ob.rot || 0);

  if (ob.shape === 'hex_reactor') {
    for (let layer = 1; layer >= 0; layer--) {
      const oy = layer * 5;
      ctx.fillStyle = layer === 1 ? '#1b263b' : '#415a77';
      ctx.strokeStyle = layer === 0 ? neonCol : INK;
      ctx.lineWidth = layer === 0 ? 2.5 : 3.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * i) / 3;
        const x = Math.cos(a) * ob.r;
        const y = Math.sin(a) * ob.r + oy;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    drawRivets(ctx, [[-14, -8], [14, -8], [-14, 8], [14, 8], [0, -16], [0, 16]]);
  } else if (ob.shape === 'cog_turret') {
    ctx.fillStyle = '#33415c';
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const teeth = 10;
    for (let i = 0; i < teeth * 2; i++) {
      const a = (Math.PI * i) / teeth;
      const rad = i % 2 === 0 ? ob.r + 4 : ob.r - 6;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5c677d';
    ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-10, 0], [10, 0], [0, -10], [0, 10]]);
  } else if (ob.shape === 'tri_pylon') {
    for (let layer = 1; layer >= 0; layer--) {
      const oy = layer * 5;
      ctx.fillStyle = layer === 1 ? '#1d2d44' : '#3e5c76';
      ctx.strokeStyle = layer === 0 ? neonCol : INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI * 2 * i) / 3 - Math.PI / 2;
        const x = Math.cos(a) * (ob.r + 5);
        const y = Math.sin(a) * (ob.r + 5) + oy;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    drawRivets(ctx, [[0, -14], [-12, 8], [12, 8]]);
  } else {
    ctx.fillStyle = '#415a77';
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -ob.r, -10, ob.r * 2, 20, 6);
    ctx.fill(); ctx.stroke();
    roundRectPath(ctx, -10, -ob.r, 20, ob.r * 2, 6);
    ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-ob.r + 7, 0], [ob.r - 7, 0], [0, -ob.r + 7], [0, ob.r - 7]]);
  }

  ctx.fillStyle = neonCol;
  ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-2, -2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// =========================================================================
// ВРАГИ ВСЕХ УРОВНЕЙ (включая Полу-корабли Единороги и Радужки-Мутанты на 3-м уровне)
// =========================================================================
const SHIP_PALETTES = {
  psy_eye:          ['#ff006e', '#9b5de5', '#00f5d4', true,  '#ffd166'],
  shroom_cruiser:   ['#e0aaff', '#7209b7', '#f72585', true,  '#4cc9f0'],
  fractal_medusa:   ['#4cc9f0', '#3a0ca3', '#48dbfb', true,  '#ffafcc'],
  sub_bathyscaphe:  ['#ffbe0b', '#0096c7', '#48dbfb', true,  '#ff5964'],
  sub_manta:        ['#0096c7', '#00f5d4', '#ffd166', true,  '#023e8a'],
  sub_hydro:        ['#48cae4', '#ff5964', '#ffffff', false, '#ffffff'],
  bio_dreadnought:  ['#d90429', '#7209b7', '#ffbe0b', true,  '#ff758f'],
  bio_corvette:     ['#38b000', '#80ed99', '#ffd166', true,  '#007f5f'],
  bio_cell:         ['#9b5de5', '#ff006e', '#00f5d4', true,  '#ffd166']
};

function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 95) % 360);

  // --- УРОВЕНЬ 3: ПОЛУ-КОРАБЛИ / ПОЛУ-РАДУЖНЫЕ ЕДИНОРОГИ И РАДУЖКИ-МУТАНТЫ ---
  if (e.kind === 'unicorn_lancer' || e.kind === 'pegasus_bomber') {
    const isHeavy = e.kind === 'pegasus_bomber';
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    const maneCol = `hsl(${(hue + 90) % 360}, 95%, 64%)`;
    e.wingCol = wingCol;
    e.bodyCol = '#fff8eb';

    // Неоновый радужный ореол
    ctx.fillStyle = wingCol;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Механо-радужные крылья Пегаса/Единорога
    ctx.fillStyle = flash ? '#ffffff' : wingCol;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(isHeavy ? -32 : -27, -14);
    ctx.lineTo(-22, 12);
    ctx.lineTo(0, 16);
    ctx.lineTo(22, 12);
    ctx.lineTo(isHeavy ? 32 : 27, -14);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Развевающаяся радужная грива позади сопла корабля
    ['#ff3366', '#ffee33', '#33ee88', '#33ccff'].forEach((mc, idx) => {
      ctx.fillStyle = mc;
      ctx.beginPath();
      ctx.arc((idx - 1.5) * 4.5, -18 - Math.sin(e.phase * 3 + idx) * 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Корпус полу-корабля / полу-единорога
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, isHeavy ? 16 : 13, 20, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Ушки единорога и мутант-наросты
    ctx.fillStyle = maneCol;
    ctx.beginPath();
    ctx.moveTo(-10, 4); ctx.lineTo(-15, -6); ctx.lineTo(-6, -2);
    ctx.moveTo(10, 4);  ctx.lineTo(15, -6);  ctx.lineTo(6, -2);
    ctx.fill(); ctx.stroke();

    // Длинный витой радужно-золотой РОГ ЕДИНОРОГА спереди (орудие лазера/ракет)
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-5, 16);
    ctx.lineTo(0, 34);
    ctx.lineTo(5, 16);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Витки на роге и сияющий кончик
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-3, 21); ctx.lineTo(3, 23);
    ctx.moveTo(-2, 26); ctx.lineTo(2, 28);
    ctx.stroke();

    // Кибер-глаза единорога
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(-5, 7, 2.8, 0, Math.PI * 2);
    ctx.arc(5, 7, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (e.kind === 'iris_mutant') {
    // РАДУЖКА-МУТАНТ: полу-корабль с огромной переливающейся радужной оболочкой глаза и био-щупальцами
    const irisCol1 = `hsl(${hue}, 100%, 60%)`;
    const irisCol2 = `hsl(${(hue + 120) % 360}, 100%, 65%)`;
    e.wingCol = irisCol1;
    e.bodyCol = irisCol2;

    // Неоновое свечение
    ctx.fillStyle = irisCol1;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Механические закрылки + мутант-щупальца
    ctx.strokeStyle = irisCol2;
    ctx.lineWidth = 4;
    [-18, 18].forEach((tx, idx) => {
      const wave = Math.sin(e.phase * 3 + idx) * 6;
      ctx.beginPath();
      ctx.moveTo(tx * 0.5, -8);
      ctx.quadraticCurveTo(tx + wave, -24, tx * 1.1, -30);
      ctx.stroke();
    });

    // Броне-обод корабля
    ctx.fillStyle = flash ? '#ffffff' : '#2e226b';
    ctx.strokeStyle = irisCol1;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, 0, 21, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Многослойная РАДУЖКА ГЛАЗА в центре корабля
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 2, 14, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = irisCol1;
    ctx.beginPath(); ctx.arc(0, 3, 10, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = irisCol2;
    ctx.beginPath(); ctx.arc(0, 3, 6.5, 0, Math.PI * 2); ctx.fill();

    // Вертикальный зрачок мутанта
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(0, 3, 2.5, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Радужные наросты-мозоли по корпусу
    drawWarts(ctx, [[-17, -6, 3.4], [17, -6, 3.4], [-15, 10, 3.2], [15, 10, 3.2]], irisCol2, '#ffffff');
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 2 (ХОРРОР: СКЕЛЕТ, ЛЕТУЧАЯ МЫШЬ, ЗОМБИ) ---
  if (e.kind === 'skeleton_ship') {
    e.wingCol = '#d8e2dc';
    e.bodyCol = '#4a4e69';
    ctx.strokeStyle = flash ? '#ffffff' : '#d8e2dc';
    ctx.lineWidth = 4;
    [-10, -2, 6].forEach(ry => {
      ctx.beginPath();
      ctx.moveTo(-25, ry - 4);
      ctx.quadraticCurveTo(0, ry + 6, 25, ry - 4);
      ctx.stroke();
    });
    ctx.fillStyle = flash ? '#ffffff' : '#e2ece9';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, -8, 12, 16, 10, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff002b';
    ctx.beginPath(); ctx.arc(-5, 3, 3.6, 0, Math.PI * 2); ctx.arc(5, 3, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (e.kind === 'bat_ship') {
    e.wingCol = '#590d22';
    e.bodyCol = '#1b1026';
    const flap = Math.sin(e.phase * 2.2) * 5;
    ctx.fillStyle = flash ? '#ffffff' : '#590d22';
    ctx.strokeStyle = '#ff0054';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(-30, -14 + flap); ctx.lineTo(-22, 12 + flap); ctx.lineTo(-10, 6);
    ctx.lineTo(0, 20); ctx.lineTo(10, 6); ctx.lineTo(22, 12 + flap); ctx.lineTo(30, -14 + flap);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = flash ? '#ffffff' : '#1b1026';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.ellipse(0, 2, 12, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-5, 18); ctx.lineTo(-3, 25); ctx.lineTo(-1, 18);
    ctx.moveTo(5, 18); ctx.lineTo(3, 25); ctx.lineTo(1, 18);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (e.kind === 'zombie_ship') {
    e.wingCol = '#6a994e';
    e.bodyCol = '#386641';
    ctx.fillStyle = flash ? '#ffffff' : '#6a994e';
    ctx.strokeStyle = '#a7c957';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 6); ctx.lineTo(-26, -10); ctx.lineTo(-18, 16); ctx.lineTo(0, 22); ctx.lineTo(20, 14); ctx.lineTo(24, -12);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = flash ? '#ffffff' : '#386641';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.ellipse(0, 2, 15, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-14, 0, 3.8], [13, 4, 3.5], [-6, -10, 3.2], [7, 11, 3.6]], '#bc4749', '#f2e8cf');
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1 («Туманность Узоров») И ОСТАЛЬНЫЕ УРОВНИ ---
  const isLsd = e.kind === 'psy_eye' || e.kind === 'shroom_cruiser' || e.kind === 'fractal_medusa';
  const pal = SHIP_PALETTES[e.kind] || ['#9b5de5', '#ff006e', '#00f5d4', true, '#ffd166'];
  let [bodyCol, wingCol, domeCol, hasWarts, wartCol] = pal;

  if (isLsd) {
    const hue1 = Math.floor((e.phase * 85) % 360);
    bodyCol = `hsl(${hue1}, 92%, 56%)`;
    wingCol = `hsl(${(hue1 + 110) % 360}, 95%, 60%)`;
    domeCol = `hsl(${(hue1 + 220) % 360}, 95%, 68%)`;
    wartCol = `hsl(${(hue1 + 160) % 360}, 95%, 65%)`;
  }

  e.wingCol = wingCol;
  e.bodyCol = bodyCol;

  ctx.fillStyle = domeCol;
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#140c29';
  ctx.beginPath();
  ctx.moveTo(0, 11); ctx.lineTo(-27, -7); ctx.lineTo(-19, 19); ctx.lineTo(0, 26); ctx.lineTo(19, 19); ctx.lineTo(27, -7);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = flash ? '#ffffff' : wingCol;
  ctx.strokeStyle = domeCol;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, 6); ctx.lineTo(-26, -12); ctx.lineTo(-18, 14); ctx.lineTo(0, 22); ctx.lineTo(18, 14); ctx.lineTo(26, -12);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.8;
  ctx.beginPath(); ctx.ellipse(0, 2, 14, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath(); ctx.ellipse(0, 3, 7.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  if (hasWarts) {
    drawWarts(ctx, [[-16, -2, 3.2], [16, -2, 3.2], [-11, 10, 2.8], [11, 10, 2.8]], wartCol, '#ffffff');
  } else {
    drawRivets(ctx, [[-16, -4], [16, -4], [-12, 10], [12, 10], [0, -12]]);
  }

  if (e.maxHp > 2 && e.hp < e.maxHp) {
    const bw = 34;
    ctx.fillStyle = INK;
    ctx.fillRect(-bw / 2, -e.r - 12, bw, 6);
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(-bw / 2 + 1, -e.r - 11, (bw - 2) * (e.hp / e.maxHp), 4);
  }

  ctx.restore();
}

// =========================================================================
// БОССЫ (Уровень 3 — ПОНЧИК-МУТАНТ, испускающий изо рта волны радуги, а из глаз лазеры!)
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  // ДВОЙНЫЕ ЛАЗЕРЫ ИЗ ГЛАЗ БОССА (Уровни 1, 2, 3)
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = lvl.id === 2 ? 'rgba(255, 0, 43, 0.85)' : 'rgba(255, 230, 109, 0.85)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    [-22, 22].forEach(ex => {
      ctx.beginPath();
      ctx.moveTo(b.x + ex, b.y - 8);
      ctx.lineTo(b.laserX + ex * 0.6, H);
      ctx.stroke();
    });
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    [-22, 22].forEach((ex, idx) => {
      const startX = b.x + ex;
      const startY = b.y - 8;
      const endX = b.laserX + ex * 0.6;
      const beamCol = lvl.id === 2
        ? '#ff002b'
        : `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 62%)`;

      ctx.strokeStyle = beamCol;
      ctx.lineWidth = 22;
      ctx.globalAlpha = 0.44;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, H);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, H);
      ctx.stroke();
    });
    ctx.restore();
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  // --- БОСС УРОВНЯ 3: ПОНЧИК-МУТАНТ ГЛАЗУРНЫЙ ---
  if (lvl.id === 3) {
    const hue = Math.floor((b.time * 75) % 360);
    const icingCol = `hsl(${hue}, 95%, 64%)`;
    const neonCol = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

    // Радужное неоновое свечение вокруг Пончика-Мутанта
    ctx.fillStyle = icingCol;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, 78, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Карамельно-радужные мутант-щупальца снизу пончика
    for (let i = 0; i < 4; i++) {
      const t = i - 1.5;
      const waveX = Math.sin(b.time * 5 + i) * 14;
      ctx.strokeStyle = `hsl(${(hue + i * 65) % 360}, 95%, 62%)`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(t * 24, 34);
      ctx.quadraticCurveTo(t * 26 + waveX, 60, t * 28 - waveX * 0.5, 76);
      ctx.stroke();
    }

    // Тесто гигантского пончика
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Стекающая мутировавшая радужная глазурь
    ctx.fillStyle = flash ? '#ffffff' : icingCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (Math.PI * 2 * i) / 16;
      const r = 48 + Math.sin(b.time * 4 + i * 2) * 5;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Выпуклые мозоли-посыпки разных неоновых цветов на глазури
    drawWarts(
      ctx,
      [[-38, -14, 5.2], [38, -14, 5.2], [-34, 24, 4.8], [34, 24, 4.8], [0, -40, 5.5]],
      neonCol,
      '#ffffff'
    );

    // Центральное кольцо пончика — ЗУБАСТАЯ ПАСТЬ, из которой вылетают волны радуги!
    ctx.fillStyle = '#120824';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 12, 22, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Радужное сияние внутри пасти
    ctx.fillStyle = neonCol;
    ctx.beginPath();
    ctx.arc(0, 12, 11 + Math.sin(b.time * 12) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Зубы по кругу отверстия пончика
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI * 2 * k) / 6;
      const tx = Math.cos(a) * 19;
      const ty = 12 + Math.sin(a) * 19;
      ctx.beginPath();
      ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Безумные глаза Пончика-Мутанта (стреляют лазерами)
    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(ex, -10, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = `hsl(${(hue + idx * 140) % 360}, 100%, 55%)`;
      ctx.beginPath(); ctx.arc(ex + lookX, -8, 6.5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex + lookX - 2, -10, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 2: СТРАШНЫЙ ВАМПИР-СЛИЗНЯК ---
  if (lvl.id === 2) {
    ctx.fillStyle = '#2b0514';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-68, -28); ctx.lineTo(-42, -66); ctx.lineTo(0, -44); ctx.lineTo(42, -66); ctx.lineTo(68, -28);
    ctx.lineTo(52, 24); ctx.lineTo(-52, 24);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    const squish = Math.sin(b.time * 4) * 5;
    ctx.fillStyle = flash ? '#ffffff' : '#590d22';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -6, 54 + squish * 0.4, Math.PI, 0);
    ctx.bezierCurveTo(66, 28, 45, 52, 0, 48 + squish);
    ctx.bezierCurveTo(-45, 52, -66, 28, -54 - squish * 0.4, -6);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    drawWarts(ctx, [[-36, -18, 6.5], [36, -18, 6.5], [-42, 8, 5.5], [42, 8, 5.5], [0, -34, 5.8]], '#800f2f', '#ff4d6d');

    ctx.fillStyle = '#090206';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 3;
    roundRectPath(ctx, -28, 12, 56, 26, 12);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff6b35';
    ctx.beginPath(); ctx.arc(0, 26, 12 + Math.sin(b.time * 18) * 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    [[-18, 12, -13, 28, -8, 12], [8, 12, 13, 28, 18, 12]].forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill(); ctx.stroke();
    });

    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffccd5';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(ex, -6, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(ex + lookX, -4, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex + lookX - 2, -6, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 1 И ОСТАЛЬНЫХ УРОВНЕЙ ---
  const isLsdBoss = lvl.id === 1;
  const bossHue = Math.floor((b.time * 65) % 360);
  const dynamicBossCol = isLsdBoss ? `hsl(${bossHue}, 88%, 54%)` : lvl.bossColor;
  const dynamicAccent = isLsdBoss ? `hsl(${(bossHue + 120) % 360}, 95%, 65%)` : lvl.accent;

  ctx.fillStyle = dynamicAccent;
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.arc(0, 8, 76, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  const tentacleCount = lvl.id === 5 ? 6 : 4;
  for (let i = 0; i < tentacleCount; i++) {
    const t = i - (tentacleCount - 1) / 2;
    const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
    const baseX = t * (lvl.id === 5 ? 20 : 28);
    const tipX = baseX * 1.2 - waveX * 0.6;

    ctx.strokeStyle = INK;
    ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(baseX, 24); ctx.quadraticCurveTo(baseX + waveX, 52, tipX, 74); ctx.stroke();

    ctx.strokeStyle = isLsdBoss ? `hsl(${(bossHue + i * 55) % 360}, 95%, 62%)` : lvl.accent;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  ctx.fillStyle = flash ? '#ffffff' : dynamicBossCol;
  ctx.strokeStyle = dynamicAccent;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 56, Math.PI, 0);
  ctx.quadraticCurveTo(60, 34, 0, 36);
  ctx.quadraticCurveTo(-60, 34, -56, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  drawWarts(ctx, [[-38, -18, 5.5], [38, -18, 5.5], [-42, 6, 4.8], [42, 6, 4.8], [-18, -38, 4.5], [18, -38, 4.5]], '#3c096c', dynamicAccent);

  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(ex, -4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = b.phase >= 2 ? '#ff006e' : INK;
    ctx.beginPath(); ctx.arc(ex + lookX, -2, flash ? 4 : 6, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = INK;
  roundRectPath(ctx, -22, 13, 44, 14, 7);
  ctx.fill();

  ctx.restore();
}
