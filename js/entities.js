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
    desc: 'Мягкие ASMR-капли плазмы с неоновым следом.',
    price: 0,
    dmgBonus: 1.0,
    bulletColor: '#48dbfb'
  },
  {
    id: 'kalimba',
    name: 'Калимба-Луч',
    desc: 'Сдвоенные кристаллы с ASMR-перезвоном (+55% урона).',
    price: 650,
    dmgBonus: 1.55,
    bulletColor: '#72efdd'
  },
  {
    id: 'silk_spread',
    name: 'Шёлковый Дробовик',
    desc: 'Тройной веер импульсов (+110% общей мощи).',
    price: 1400,
    dmgBonus: 2.1,
    bulletColor: '#ff8fab'
  }
];

const LEVELS = [
  {
    id: 1,
    name: 'ЛСД-Туманность',
    story: 'За планетами пульсируют синусоиды и фракталы! Подбирай Фрактальные сюрикены, Электрический удар, Волновую пушку и волшебные звёздочки!',
    enemiesDesc: 'Психо-Глаза, Гриб-Крейсеры и Фрактал-Медузы',
    bossName: 'Доктор Кракен-Бот',
    bossWeapon: 'Психоделический веер и Мега-Луч',
    theme: 'lsd',
    enemyTypes: ['psy_eye', 'shroom_cruiser', 'fractal_medusa'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 350
  },
  {
    id: 2,
    name: 'Сектор Кошмаров',
    story: 'Кровавый туман окутал заброшенный флот. Из темноты атакуют костяные корабли-призраки!',
    enemiesDesc: 'Костяные Истребители, Череп-Крейсеры и Тёмные Зонды',
    bossName: 'Кошмарный Жнец',
    bossWeapon: 'Кровавые сгустки и костяные иглы',
    theme: 'horror',
    enemyTypes: ['horror_fang', 'horror_skullship', 'horror_reaper'],
    skyTop: '#08030c', skyMid: '#17071c', skyBot: '#2b091e',
    accent: '#ff002b', bossColor: '#590d22', hpMult: 1.18, coinReward: 500
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Ослепительная радуга накрыла сектор! Облетай светящиеся металлические реакторы и эскадрильи.',
    enemiesDesc: 'Радужные Дельты, Спектр-Шаттлы и Призма-Дроны',
    bossName: 'Призматический Адмирал',
    bossWeapon: 'Семицветный лазерный веер',
    theme: 'rainbow',
    enemyTypes: ['rainbow_delta', 'rainbow_shuttle', 'rainbow_orbiter'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.38, coinReward: 700
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

// =========================================================================
// 1. ПРЕДМЕТЫ, ЗВЁЗДОЧКИ И 3 НОВЫХ ОРУЖИЯ 1-ГО УРОВНЯ (3D ВИД СВЕРХУ С НЕОНОМ)
// =========================================================================
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

  // Неоновый ореол вокруг капсулы предмета
  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 3D-подложка капсулы
  ctx.fillStyle = '#1b1438';
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'green_star' || bn.type === 'red_shield') {
    // Волшебная 3D-звёздочка (зелёная — гигантский корабль, красная — энерго-щит)
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
    // Оружие 1: Фрактальные сюрикены
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
    // Оружие 2: Электрический удар (молния)
    ctx.fillStyle = '#fee440';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(3, -13);
    ctx.lineTo(-9, 1);
    ctx.lineTo(-1, 1);
    ctx.lineTo(-5, 13);
    ctx.lineTo(9, -2);
    ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

  } else if (bn.type === 'wave_cannon') {
    // Оружие 3: Волновая пушка (концентрические дуги)
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => {
      ctx.beginPath();
      ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });

  } else {
    // Космическая еда (пицца / бургер / суши / пончик)
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

// =========================================================================
// 2. СНАРЯДЫ ИГРОКА (С НЕОНОВЫМ СВЕЧЕНИЕМ)
// =========================================================================
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

  } else if (b.kind === 'shuriken') {
    ctx.rotate(b.rot || 0);
    ctx.fillStyle = '#06d6a0';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * i) / 4;
      const rad = i % 2 === 0 ? 11 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();

  } else if (b.kind === 'burger_rocket') {
    ctx.fillStyle = '#ff9f1c';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    roundRectPath(ctx, -6, -12, 12, 24, 6);
    ctx.fill(); ctx.stroke();

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
// 3. ЗАМЕТНЫЕ МЕТАЛЛИЧЕСКИЕ ПРЕПЯТСТВИЯ РАЗНЫХ ФОРМ С НЕОНОВЫМ СВЕЧЕНИЕМ
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const neonCol = ob.neonColor || '#00f5d4';

  // Внешнее неоновое свечение вокруг металлического объекта
  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.24;
  ctx.beginPath();
  ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 3D-толщина (нижний тёмный металлический ярус)
  ctx.fillStyle = '#141b29';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  ctx.rotate(ob.rot || 0);

  if (ob.shape === 'hex_reactor') {
    // 1. Шестигранный металлический реактор с неоновым ядром
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
    // 2. Зубчатая металлическая шестерня-турель
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
    // 3. Треугольный бронированный пилон с силовыми шинами
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
    // 4. Крестообразный генератор щита с металлической оковкой
    ctx.fillStyle = '#415a77';
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -ob.r, -10, ob.r * 2, 20, 6);
    ctx.fill(); ctx.stroke();
    roundRectPath(ctx, -10, -ob.r, 20, ob.r * 2, 6);
    ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-ob.r + 7, 0], [ob.r - 7, 0], [0, -ob.r + 7], [0, ob.r - 7]]);
  }

  // Яркое неоновое энергетическое ядро в центре каждого препятствия
  ctx.fillStyle = neonCol;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-2, -2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =========================================================================
// 4. 3D-КОРАБЛИ ВРАГОВ ВИД СВЕРХУ С НЕОНОВЫМ СВЕЧЕНИЕМ И ДЕТАЛЯМИ
// =========================================================================
const SHIP_PALETTES = {
  psy_eye:          ['#ff006e', '#9b5de5', '#00f5d4', true,  '#ffd166'],
  shroom_cruiser:   ['#e0aaff', '#7209b7', '#f72585', true,  '#4cc9f0'],
  fractal_medusa:   ['#4cc9f0', '#3a0ca3', '#48dbfb', true,  '#ffafcc'],
  horror_fang:      ['#2b2d42', '#8d99ae', '#ff002b', true,  '#590d22'],
  horror_skullship: ['#e2ece9', '#590d22', '#ff002b', true,  '#800f2f'],
  horror_reaper:    ['#1a1423', '#590d22', '#ff002b', false, '#ff002b'],
  rainbow_delta:    ['#ff5964', '#ffd166', '#48dbfb', false, '#ffffff'],
  rainbow_shuttle:  ['#06d6a0', '#bdb2ff', '#ff9f1c', false, '#ffffff'],
  rainbow_orbiter:  ['#48dbfb', '#ff8fab', '#ffd166', false, '#ffffff'],
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
  const pal = SHIP_PALETTES[e.kind] || ['#9b5de5', '#ff006e', '#00f5d4', true, '#ffd166'];
  const [bodyCol, wingCol, domeCol, hasWarts, wartCol] = pal;

  // Сохраняем цвета на объекте врага, чтобы при взрыве разлетались обломки именно его цвета
  e.wingCol = wingCol;
  e.bodyCol = bodyCol;

  // 1. Неоновое свечение двигателей и контура (3D Top-Down Glow)
  ctx.fillStyle = domeCol;
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.arc(0, 0, e.r + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 2. Две реактивные турбины сверху (вид сверху)
  ctx.fillStyle = '#2b2d42';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  [-11, 11].forEach(tx => {
    roundRectPath(ctx, tx - 4, -22, 8, 12, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#00f5d4';
    ctx.beginPath(); ctx.arc(tx, -22, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b2d42';
  });

  // 3. Нижний 3D-ярус крыльев (создаёт эффект толщины корпуса сверху)
  ctx.fillStyle = '#140c29';
  ctx.beginPath();
  ctx.moveTo(0, 11); ctx.lineTo(-27, -7); ctx.lineTo(-19, 19); ctx.lineTo(0, 26); ctx.lineTo(19, 19); ctx.lineTo(27, -7);
  ctx.closePath();
  ctx.fill();

  // 4. Верхний 3D-ярус крыльев с неоновой кромкой
  ctx.fillStyle = flash ? '#ffffff' : wingCol;
  ctx.strokeStyle = domeCol;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, 6); ctx.lineTo(-26, -12); ctx.lineTo(-18, 14); ctx.lineTo(0, 22); ctx.lineTo(18, 14); ctx.lineTo(26, -12);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // 5. Выпуклый центральный фюзеляж (вид сверху)
  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 21, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // 6. Стеклянная 3D-кабина пилота с бликом
  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath();
  ctx.ellipse(0, 3, 7.5, 10, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-2.5, 0, 2.2, 4.5, -0.2, 0, Math.PI * 2);
  ctx.fill();

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

function drawUniqueBoss(ctx, b, lvl, player, H) {
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 110, 0.75)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(b.laserX, b.y + 40); ctx.lineTo(b.laserX, H); ctx.stroke();
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 110, 0.35)';
    ctx.fillRect(b.laserX - 32, b.y + 35, 64, H - b.y);
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(b.laserX - 15, b.y + 35, 30, H - b.y);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.laserX - 5, b.y + 35, 10, H - b.y);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  // Неоновый ореол вокруг босса
  ctx.fillStyle = lvl.accent;
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.arc(0, 8, 72, 0, Math.PI * 2);
  ctx.fill();
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

    ctx.strokeStyle = lvl.accent;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    [
      [baseX + waveX * 0.25, 38, 3.2],
      [baseX + waveX * 0.65, 54, 2.8],
      [tipX, 68, 2.4]
    ].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
  }

  ctx.fillStyle = flash ? '#ffffff' : lvl.bossColor;
  ctx.strokeStyle = lvl.accent;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 56, Math.PI, 0);
  ctx.quadraticCurveTo(60, 34, 0, 36);
  ctx.quadraticCurveTo(-60, 34, -56, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  drawWarts(
    ctx,
    [[-38, -18, 5.5], [38, -18, 5.5], [-42, 6, 4.8], [42, 6, 4.8], [-18, -38, 4.5], [18, -38, 4.5]],
    '#3c096c',
    lvl.accent
  );

  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-22, -48); ctx.lineTo(-12, -74); ctx.lineTo(0, -54); ctx.lineTo(12, -74); ctx.lineTo(22, -48);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(ex, -4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = b.phase === 3 ? '#d90429' : INK;
    ctx.beginPath(); ctx.arc(ex + lookX, -2, flash ? 4 : 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ex + lookX - 2, -4, 2.2, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = INK;
  roundRectPath(ctx, -20, 14, 40, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, 14, 6, 5); ctx.fillRect(7, 14, 6, 5);

  ctx.restore();
}
