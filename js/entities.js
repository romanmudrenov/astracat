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

// Объёмные мозоли / бородавки на кораблях пришельцев и осьминогах
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
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
}

// =========================================================================
// 1. БОНУСЫ ИЗ КОСМИЧЕСКОЙ ЕДЫ
// =========================================================================
function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.08;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const auraColors = {
    pizza:  'rgba(255, 183, 3, 0.32)',
    sushi:  'rgba(6, 214, 160, 0.32)',
    donut:  'rgba(255, 112, 166, 0.34)',
    burger: 'rgba(247, 127, 0, 0.32)',
    milk:   'rgba(72, 219, 251, 0.34)'
  };

  ctx.fillStyle = auraColors[bn.type] || 'rgba(255,255,255,0.28)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 5, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  if (bn.type === 'pizza') {
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(13, 10); ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e07a5f';
    roundRectPath(ctx, -14, 8, 28, 5, 2.5);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-3, 2, 2.6, 0, Math.PI * 2);
    ctx.arc(4, 4, 2.4, 0, Math.PI * 2);
    ctx.arc(0, -5, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (bn.type === 'sushi') {
    ctx.fillStyle = '#1e1633';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -13, -10, 26, 20, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff8eb';
    roundRectPath(ctx, -10, -7, 20, 14, 6);
    ctx.fill();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-2, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(4, 1, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (bn.type === 'donut') {
    ctx.fillStyle = '#f4a261';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
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
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    ctx.fillStyle = '#f4a261';
    roundRectPath(ctx, -13, 5, 26, 6, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -14, 0, 28, 6, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8ac926';
    ctx.fillRect(-14, -2, 28, 3);
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, -1, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = '#edf2f4';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -9, -7, 18, 20, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#48dbfb';
    ctx.fillRect(-7, -1, 14, 8);
    ctx.fillStyle = '#ff5964';
    roundRectPath(ctx, -6, -12, 12, 5, 2);
    ctx.fill(); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-7, -8, 4.5, 2.2, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =========================================================================
// 2. СНАРЯДЫ ИГРОКА
// =========================================================================
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
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, 1, 2.4, 0, Math.PI * 2);
    ctx.fill();
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
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.kind === 'burger_rocket') {
    ctx.fillStyle = '#ff9f1c';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -7, -12, 14, 24, 7);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, -8, 7, Math.PI, 0);
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
    ctx.ellipse(0, 0, b.r * 0.78, b.r * 1.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  ctx.restore();
}

// =========================================================================
// 3. СТАТИЧНЫЕ ПРЕПЯТСТВИЯ НА КАРТЕ (ДЛЯ КАЖДОГО ИЗ 10 МИРОВ — НУЖНО ОБЛЕТАТЬ)
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Тень под препятствием
  ctx.fillStyle = 'rgba(6, 4, 18, 0.42)';
  ctx.beginPath();
  ctx.ellipse(5, ob.r + 6, ob.r * 0.85, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3.2;

  switch (ob.kind) {
    case 'lsd_shroom':
      // Галлюциногенный кислотный гриб с мозолями
      ctx.fillStyle = '#e0aaff';
      roundRectPath(ctx, -10, 0, 20, 24, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff006e';
      ctx.beginPath();
      ctx.arc(0, 2, 26, Math.PI, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-12, -10, 4], [10, -12, 4.5], [0, -18, 3.5]], '#ffd166', '#ffffff');
      break;

    case 'horror_monolith':
      // Мрачный надгробный монолит с трещинами и черепом
      ctx.fillStyle = '#2b2d42';
      roundRectPath(ctx, -20, -26, 40, 52, 8);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#ff002b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, -12); ctx.lineTo(0, 0); ctx.lineTo(-6, 14);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      break;

    case 'rainbow_prism':
      // Радужный треугольный барьер
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(0, -26); ctx.lineTo(26, 22); ctx.lineTo(-26, 22);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#48dbfb';
      ctx.beginPath();
      ctx.moveTo(0, -12); ctx.lineTo(14, 15); ctx.lineTo(-14, 15);
      ctx.closePath();
      ctx.fill();
      break;

    case 'tech_bulkhead':
      // Бронированная энерго-переборка звездолёта
      ctx.fillStyle = '#3a506b';
      roundRectPath(ctx, -32, -14, 64, 28, 6);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-25, -8], [25, -8], [-25, 8], [25, 8]]);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(-18, -5, 36, 10);
      break;

    case 'ice_berg':
      // Ледяной айсберг
      ctx.fillStyle = '#90e0ef';
      ctx.beginPath();
      ctx.moveTo(-24, 18); ctx.lineTo(-16, -22); ctx.lineTo(4, -28); ctx.lineTo(24, -10); ctx.lineTo(20, 20);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-12, -18); ctx.lineTo(2, -24); ctx.lineTo(-2, -6);
      ctx.closePath();
      ctx.fill();
      break;

    case 'candy_pillar':
      // Карамельный леденцовый столб
      ctx.fillStyle = '#ffffff';
      roundRectPath(ctx, -16, -24, 32, 48, 12);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff70a6';
      ctx.fillRect(-14, -12, 28, 8);
      ctx.fillRect(-14, 6, 28, 8);
      break;

    case 'coral_reef':
      // Подводный коралловый риф с пузырьками
      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(-12, 4, 14, 0, Math.PI * 2);
      ctx.arc(12, 6, 13, 0, Math.PI * 2);
      ctx.arc(0, -10, 15, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-12, 2, 3.5], [12, 4, 3.5], [0, -12, 4]], '#ffd166', '#ffffff');
      break;

    case 'volcano_rock':
      // Вулканическая скала с лавой
      ctx.fillStyle = '#370617';
      ctx.beginPath();
      ctx.moveTo(-24, 20); ctx.lineTo(-10, -24); ctx.lineTo(12, -20); ctx.lineTo(25, 18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#ff9f1c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-6, -14); ctx.lineTo(2, 2); ctx.lineTo(-4, 15);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      break;

    case 'diamond_cluster':
      // Огромный бриллиантовый кристалл
      ctx.fillStyle = '#4cc9f0';
      ctx.beginPath();
      ctx.moveTo(0, -28); ctx.lineTo(22, -6); ctx.lineTo(0, 28); ctx.lineTo(-22, -6);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#caf0f8';
      ctx.beginPath();
      ctx.moveTo(0, -28); ctx.lineTo(10, -6); ctx.lineTo(0, 28); ctx.lineTo(-10, -6);
      ctx.closePath();
      ctx.fill();
      break;

    case 'bio_cocoon':
    default:
      // Органический био-кокон с мозолями
      ctx.fillStyle = '#52b788';
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 27, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-10, -10, 4.5], [11, -6, 4], [-8, 12, 4], [9, 11, 4.5]], '#2d6a4f', '#b7e4c7');
      break;
  }

  ctx.restore();
}

// =========================================================================
// 4. 30 ВРАГОВ В ФОРМЕ КОСМИЧЕСКИХ КОРАБЛЕЙ (С МОЗОЛЯМИ И ЗАКЛЁПКАМИ)
// =========================================================================
function drawShipHull(ctx, col, bodyColor, wingColor, domeColor, hasWarts = false, wartCol = '#ffd166') {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  // Крылья корабля
  ctx.fillStyle = col(wingColor);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.lineTo(-26, -12);
  ctx.lineTo(-18, 14);
  ctx.lineTo(0, 22);
  ctx.lineTo(18, 14);
  ctx.lineTo(26, -12);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Основной фюзеляж корабля
  ctx.fillStyle = col(bodyColor);
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 22, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Носовое орудие / таран снизу
  ctx.fillStyle = '#ffbe0b';
  ctx.beginPath();
  ctx.moveTo(-5, 20); ctx.lineTo(0, 28); ctx.lineTo(5, 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Кабина пилота
  ctx.fillStyle = col(domeColor);
  ctx.beginPath();
  ctx.arc(0, 2, 7.5, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Заклёпки или мозоли/наросты на корпусе корабля пришельцев
  if (hasWarts) {
    drawWarts(ctx, [[-16, -2, 3.2], [16, -2, 3.2], [-11, 10, 2.8], [11, 10, 2.8]], wartCol, '#ffffff');
  } else {
    drawRivets(ctx, [[-16, -4], [16, -4], [-12, 10], [12, 10], [0, -12]]);
  }
}

function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const col = (c) => (flash ? '#ffffff' : c);

  // Тень под кораблём
  ctx.fillStyle = 'rgba(8, 5, 22, 0.34)';
  ctx.beginPath();
  ctx.ellipse(4, e.r + 6, e.r * 0.78, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (e.kind) {
    // 1. ЛСД-стиль: галлюциногенные корабли с мозолями
    case 'lsd_saucer':
      ctx.fillStyle = col('#9b5de5');
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 5, 26, 11, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#00f5d4');
      ctx.beginPath();
      ctx.arc(0, 1, 13, Math.PI, 0);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-16, 4, 3.4], [16, 4, 3.4], [0, 8, 3.6]], '#ff006e', '#ffd166');
      break;
    case 'lsd_prism':
      drawShipHull(ctx, col, '#ff006e', '#ffd166', '#00f5d4', true, '#9b5de5');
      break;
    case 'lsd_spinner':
      ctx.rotate(e.rot || 0);
      drawShipHull(ctx, col, '#00bbf9', '#f15bb5', '#fee440', true, '#00f5d4');
      ctx.rotate(-(e.rot || 0));
      break;

    // 2. Хоррор-уровень: костяные корабли-призраки
    case 'horror_fang':
      drawShipHull(ctx, col, '#2b2d42', '#8d99ae', '#ff002b', true, '#590d22');
      break;
    case 'horror_skullship':
      ctx.fillStyle = col('#e2ece9');
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-24, -10); ctx.lineTo(24, -10); ctx.lineTo(16, 18); ctx.lineTo(-16, 18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-14, 4, 3.5], [14, 4, 3.5]], '#800f2f', '#ff002b');
      ctx.fillStyle = '#ff002b';
      ctx.beginPath();
      ctx.arc(-7, 2, 4, 0, Math.PI * 2);
      ctx.arc(7, 2, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'horror_reaper':
      drawShipHull(ctx, col, '#1a1423', '#590d22', '#ff002b', false);
      break;

    // 3. Радужный уровень
    case 'rainbow_delta':
      drawShipHull(ctx, col, '#ff5964', '#ffd166', '#48dbfb', false);
      break;
    case 'rainbow_shuttle':
      drawShipHull(ctx, col, '#06d6a0', '#bdb2ff', '#ff9f1c', false);
      break;
    case 'rainbow_orbiter':
      drawShipHull(ctx, col, '#48dbfb', '#ff8fab', '#ffd166', false);
      break;

    // 4. Внутри звездолёта
    case 'tech_interceptor':
      drawShipHull(ctx, col, '#3a506b', '#5bc0be', '#ffd166', false);
      break;
    case 'tech_pod':
      drawShipHull(ctx, col, '#1c2541', '#48dbfb', '#ff5964', false);
      break;
    case 'tech_drone':
      drawShipHull(ctx, col, '#6fffe9', '#3a506b', '#ffffff', false);
      break;

    // 5. Замёрзшие планеты
    case 'ice_corvette':
      drawShipHull(ctx, col, '#90e0ef', '#0077b6', '#ffffff', false);
      break;
    case 'ice_breaker':
      drawShipHull(ctx, col, '#caf0f8', '#48cae4', '#023e8a', false);
      break;
    case 'ice_probe':
      drawShipHull(ctx, col, '#48cae4', '#ade8f4', '#ff9f1c', false);
      break;

    // 6. Сахарная вата и конфеты
    case 'candy_cruiser':
      drawShipHull(ctx, col, '#ffccd5', '#ff70a6', '#ffd166', true, '#ff4d6d');
      break;
    case 'candy_dart':
      drawShipHull(ctx, col, '#ff8fab', '#bde0fe', '#ffffff', false);
      break;
    case 'candy_donutship':
      drawShipHull(ctx, col, '#f4a261', '#ff70a6', '#48dbfb', true, '#ffd166');
      break;

    // 7. Подводный уровень: батискафы и субмарины пришельцев
    case 'sub_bathyscaphe':
      ctx.fillStyle = col('#ffbe0b');
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 2, 22, 16, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-15, 0], [15, 0], [0, -10], [0, 13]]);
      ctx.fillStyle = '#48dbfb';
      ctx.beginPath();
      ctx.arc(0, 3, 8, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;
    case 'sub_manta':
      drawShipHull(ctx, col, '#0
