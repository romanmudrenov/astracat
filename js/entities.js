'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'ЛСД-Туманность Галлюцинаций',
    story: 'Кислотные вихри искажают пространство! Психоделические корабли пришельцев в ярких мозолях пытаются сбить Реджа с курса.',
    enemiesDesc: 'ЛСД-Тарелки, Калейдоскоп-Боты и Фрактал-Шаттлы',
    bossName: 'Доктор Кракен-Бот',
    bossWeapon: 'Психоделический веер и Мега-Луч',
    theme: 'lsd',
    enemyTypes: ['lsd_saucer', 'lsd_prism', 'lsd_spinner'],
    obstacleKind: 'lsd_shroom',
    skyTop: '#1a0633', skyMid: '#3b0d5e', skyBot: '#6b1275',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Кровавый туман окутал заброшенный флот. Из темноты атакуют костяные корабли-призраки и мрачные монолиты!',
    enemiesDesc: 'Костяные Истребители, Череп-Крейсеры и Тёмные Зонды',
    bossName: 'Кошмарный Жнец',
    bossWeapon: 'Кровавые сгустки и костяные иглы',
    theme: 'horror',
    enemyTypes: ['horror_fang', 'horror_skullship', 'horror_reaper'],
    obstacleKind: 'horror_monolith',
    skyTop: '#08030c', skyMid: '#17071c', skyBot: '#2b091e',
    accent: '#ff002b', bossColor: '#590d22', hpMult: 1.12
  },
  {
    id: 3,
    name: 'Радужный Гиперпоток',
    story: 'Ослепительная радуга накрыла сектор! Облетай радужные призмы и уворачивайся от разноцветных эскадрилий.',
    enemiesDesc: 'Радужные Дельты, Спектр-Шаттлы и Призма-Дроны',
    bossName: 'Призматический Адмирал',
    bossWeapon: 'Семицветный лазерный веер',
    theme: 'rainbow',
    enemyTypes: ['rainbow_delta', 'rainbow_shuttle', 'rainbow_orbiter'],
    obstacleKind: 'rainbow_prism',
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.24
  },
  {
    id: 4,
    name: 'Внутри Мега-Звездолёта',
    story: 'Редж проник внутрь гигантского техно-корабля! Облетай энерго-переборки отсеков и сражайся с охранными ботами.',
    enemiesDesc: 'Патрульные Перехватчики, Броне-Капсулы и Ремонт-Дроны',
    bossName: 'Ядро Центрального ИИ',
    bossWeapon: 'Перекрёстные лазерные резаки',
    theme: 'ship_interior',
    enemyTypes: ['tech_interceptor', 'tech_pod', 'tech_drone'],
    obstacleKind: 'tech_bulkhead',
    skyTop: '#0b132b', skyMid: '#1c2541', skyBot: '#3a506b',
    accent: '#48dbfb', bossColor: '#00b4d8', hpMult: 1.36
  },
  {
    id: 5,
    name: 'Орбита Замёрзших Планет',
    story: 'Ледяные глыбы дрейфуют в морозном вакууме. Облетай айсберги и остерегайся крио-кораблей Фрост-9!',
    enemiesDesc: 'Крио-Корветы, Ледоколы и Морозные Зонды',
    bossName: 'Ледяной Титан Фрост-9',
    bossWeapon: 'Скоростные ледяные иглы',
    theme: 'frozen',
    enemyTypes: ['ice_corvette', 'ice_breaker', 'ice_probe'],
    obstacleKind: 'ice_berg',
    skyTop: '#08192b', skyMid: '#103454', skyBot: '#184e77',
    accent: '#90e0ef', bossColor: '#48cae4', hpMult: 1.48
  },
  {
    id: 6,
    name: 'Империя Сахарной Ваты',
    story: 'Липкие облака ваты и карамельные столбы преграждают путь! Остерегайся залипания и сладких бомбардировщиков.',
    enemiesDesc: 'Зефирные Крейсеры, Леденцовые Истребители и Пончик-Боты',
    bossName: 'Королева Зефира',
    bossWeapon: 'Тройные липкие зефирные пузыри',
    theme: 'candy',
    enemyTypes: ['candy_cruiser', 'candy_dart', 'candy_donutship'],
    obstacleKind: 'candy_pillar',
    skyTop: '#2b0e26', skyMid: '#521b48', skyBot: '#7d296e',
    accent: '#ffafcc', bossColor: '#ff70a6', hpMult: 1.60
  },
  {
    id: 7,
    name: 'Бездна Подводного Океана',
    story: 'Корабль Реджа погрузился в инопланетный океан! Облетай коралловые рифы и сражайся с вражескими батискафами.',
    enemiesDesc: 'Батискафы Пришельцев, Субмарины-Скаты и Гидро-Дроны',
    bossName: 'Глубоководный Левиафан',
    bossWeapon: 'Торпедный залп и пузырьковые волны',
    theme: 'underwater',
    enemyTypes: ['sub_bathyscaphe', 'sub_manta', 'sub_hydro'],
    obstacleKind: 'coral_reef',
    skyTop: '#041c2c', skyMid: '#08334a', skyBot: '#0e5273',
    accent: '#00f5d4', bossColor: '#0096c7', hpMult: 1.72
  },
  {
    id: 8,
    name: 'Вулканический Каньон Магмы',
    story: 'Раскалённые скалы и вспышки пламени! Облетай вулканические пики и уворачивайся от огненных бомбардировщиков.',
    enemiesDesc: 'Магма-Бомбардировщики, Пепельные Шаттлы и Пиро-Дроны',
    bossName: 'Инферно-Краб Вулкан',
    bossWeapon: 'Магматический дождь и клешни',
    theme: 'volcano',
    enemyTypes: ['lava_bomber', 'lava_shuttle', 'lava_drone'],
    obstacleKind: 'volcano_rock',
    skyTop: '#1f0606', skyMid: '#3d0d0d', skyBot: '#631717',
    accent: '#ff6b35', bossColor: '#e63946', hpMult: 1.85
  },
  {
    id: 9,
    name: 'Бриллиантовая Галактика',
    story: 'Ослепительные грани алмазных астероидов! Облетай бриллиантовые глыбы и берегись расщепляющих лучей.',
    enemiesDesc: 'Алмазные Перехватчики, Кристалл-Линкоры и Грани-Дроны',
    bossName: 'Алмазный Император',
    bossWeapon: 'Расщепляющие лучи и кристаллы',
    theme: 'diamond',
    enemyTypes: ['diamond_wing', 'diamond_cruiser', 'diamond_shard'],
    obstacleKind: 'diamond_cluster',
    skyTop: '#0d1b2a', skyMid: '#1b263b', skyBot: '#2c3e50',
    accent: '#caf0f8', bossColor: '#4cc9f0', hpMult: 2.0
  },
  {
    id: 10,
    name: 'Живой Органический Мир',
    story: 'Финальный сектор! Живые био-корабли в мозолях и пульсирующие коконы защищают Императора Омега-Кракена!',
    enemiesDesc: 'Био-Дредноуты, Споровые Корветы и Клеточные Зонды',
    bossName: 'Император Омега-Кракен',
    bossWeapon: 'Все виды атак + Гипер-Луч',
    theme: 'organic',
    enemyTypes: ['bio_dreadnought', 'bio_corvette', 'bio_cell'],
    obstacleKind: 'bio_cocoon',
    skyTop: '#140512', skyMid: '#2e0923', skyBot: '#4f0f3b',
    accent: '#ff006e', bossColor: '#d90429', hpMult: 2.25
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
    ctx.fill();
    ctx.stroke();

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
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.08;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const auraColors = {
    pizza: 'rgba(255, 183, 3, 0.32)',
    sushi: 'rgba(6, 214, 160, 0.32)',
    donut: 'rgba(255, 112, 166, 0.34)',
    burger: 'rgba(247, 127, 0, 0.32)',
    milk: 'rgba(72, 219, 251, 0.34)'
  };

  ctx.fillStyle = auraColors[bn.type] || 'rgba(255,255,255,0.28)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;

  if (bn.type === 'pizza') {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(13, 10); ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e07a5f';
    roundRectPath(ctx, -14, 8, 28, 5, 2.5);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-3, 2, 2.5, 0, Math.PI * 2);
    ctx.arc(4, 4, 2.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (bn.type === 'sushi') {
    ctx.fillStyle = '#1e1633';
    roundRectPath(ctx, -13, -10, 26, 20, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff8eb';
    roundRectPath(ctx, -10, -7, 20, 14, 6);
    ctx.fill();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-2, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (bn.type === 'donut') {
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (bn.type === 'burger') {
    ctx.fillStyle = '#f4a261';
    roundRectPath(ctx, -13, 5, 26, 6, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -14, 0, 28, 6, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, -1, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = '#edf2f4';
    roundRectPath(ctx, -9, -7, 18, 20, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#48dbfb';
    ctx.fillRect(-7, -1, 14, 8);
  }
  ctx.restore();
}

function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'pizza_slice') {
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -11); ctx.lineTo(8, 8); ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'shuriken') {
    ctx.rotate(b.rot || 0);
    ctx.fillStyle = '#06d6a0';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * i) / 4;
      const rad = i % 2 === 0 ? 11 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'burger_rocket') {
    ctx.fillStyle = '#ff9f1c';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -7, -12, 14, 24, 7);
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'laser_bolt') {
    ctx.fillStyle = '#ff70a6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    roundRectPath(ctx, -4, -18, 8, 36, 4);
    ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = b.color;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.78
