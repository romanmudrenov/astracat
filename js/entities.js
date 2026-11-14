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
    ctx.ellipse(0, 0, b.r * 0.78, b.r * 1.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  if (ob.kind === 'lsd_shroom') {
    ctx.fillStyle = '#e0aaff';
    roundRectPath(ctx, -10, 0, 20, 24, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(0, 2, 26, Math.PI, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-12, -10, 4], [10, -12, 4.5], [0, -18, 3.5]], '#ffd166', '#ffffff');
  } else if (ob.kind === 'horror_monolith') {
    ctx.fillStyle = '#2b2d42';
    roundRectPath(ctx, -20, -26, 40, 52, 8);
    ctx.fill(); ctx.stroke();
  } else if (ob.kind === 'rainbow_prism' || ob.kind === 'diamond_cluster') {
    ctx.fillStyle = ob.kind === 'diamond_cluster' ? '#4cc9f0' : '#ffd166';
    ctx.beginPath();
    ctx.moveTo(0, -28); ctx.lineTo(24, 0); ctx.lineTo(0, 28); ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (ob.kind === 'coral_reef' || ob.kind === 'bio_cocoon') {
    ctx.fillStyle = ob.kind === 'coral_reef' ? '#ff5964' : '#52b788';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-10, -8, 4.5], [10, -6, 4], [0, 10, 4.5]], '#ffd166', '#ffffff');
  } else {
    ctx.fillStyle = '#3a506b';
    roundRectPath(ctx, -28, -15, 56, 30, 8);
    ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-20, -8], [20, -8], [-20, 8], [20, 8]]);
  }
  ctx.restore();
}

const SHIP_PALETTES = {
  lsd_saucer:       ['#9b5de5', '#ff006e', '#00f5d4', true,  '#ffd166'],
  lsd_prism:        ['#ff006e', '#ffd166', '#00f5d4', true,  '#9b5de5'],
  lsd_spinner:      ['#00bbf9', '#f15bb5', '#fee440', true,  '#00f5d4'],
  horror_fang:      ['#2b2d42', '#8d99ae', '#ff002b', true,  '#590d22'],
  horror_skullship: ['#e2ece9', '#590d22', '#ff002b', true,  '#800f2f'],
  horror_reaper:    ['#1a1423', '#590d22', '#ff002b', false, '#ff002b'],
  rainbow_delta:    ['#ff5964', '#ffd166', '#48dbfb', false, '#ffffff'],
  rainbow_shuttle:  ['#06d6a0', '#bdb2ff', '#ff9f1c', false, '#ffffff'],
  rainbow_orbiter:  ['#48dbfb', '#ff8fab', '#ffd166', false, '#ffffff'],
  tech_interceptor: ['#3a506b', '#5bc0be', '#ffd166', false, '#ffffff'],
  tech_pod:         ['#1c2541', '#48dbfb', '#ff5964', false, '#ffffff'],
  tech_drone:       ['#6fffe9', '#3a506b', '#ffffff', false, '#ffffff'],
  ice_corvette:     ['#90e0ef', '#0077b6', '#ffffff', false, '#ffffff'],
  ice_breaker:      ['#caf0f8', '#48cae4', '#023e8a', false, '#ffffff'],
  ice_probe:        ['#48cae4', '#ade8f4', '#ff9f1c', false, '#ffffff'],
  candy_cruiser:    ['#ffccd5', '#ff70a6', '#ffd166', true,  '#ff4d6d'],
  candy_dart:       ['#ff8fab', '#bde0fe', '#ffffff', false, '#ffffff'],
  candy_donutship:  ['#f4a261', '#ff70a6', '#48dbfb', true,  '#ffd166'],
  sub_bathyscaphe:  ['#ffbe0b', '#0096c7', '#48dbfb', true,  '#ff5964'],
  sub_manta:        ['#0096c7', '#00f5d4', '#ffd166', true,  '#023e8a'],
  sub_hydro:        ['#48cae4', '#ff5964', '#ffffff', false, '#ffffff'],
  lava_bomber:      ['#e63946', '#ffba08', '#370617', true,  '#ff9f1c'],
  lava_shuttle:     ['#9b2226', '#f77f00', '#ffd166', false, '#ffffff'],
  lava_drone:       ['#ff6b35', '#590d22', '#ffbe0b', false, '#ffffff'],
  diamond_wing:     ['#caf0f8', '#4cc9f0', '#ffffff', false, '#ffffff'],
  diamond_cruiser:  ['#90e0ef', '#4361ee', '#ffffff', false, '#ffffff'],
  diamond_shard:    ['#ffffff', '#48dbfb', '#ff70a6', false, '#ffffff'],
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

  ctx.fillStyle = 'rgba(8, 5, 22, 0.34)';
  ctx.beginPath();
  ctx.ellipse(4, e.r + 6, e.r * 0.78, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  // Крылья корабля пришельцев
  ctx.fillStyle = flash ? '#ffffff' : wingCol;
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.lineTo(-26, -12);
  ctx.lineTo(-18, 14);
  ctx.lineTo(0, 22);
  ctx.lineTo(18, 14);
  ctx.lineTo(26, -12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Фюзеляж
  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Носовая пушка
  ctx.fillStyle = '#ffbe0b';
  ctx.beginPath();
  ctx.moveTo(-5, 20); ctx.lineTo(0, 28); ctx.lineTo(5, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Кабина пилота
  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath();
  ctx.arc(0, 2, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Мозоли/бородавки на кораблях пришельцев или заклёпки
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
  if (b.crossLasers && b.crossLasers.active) {
    ctx.save();
    const angle = b.crossLasers.angle;
    [-1, 1].forEach(dir => {
      ctx.save();
      ctx.translate(b.x, b.y + 15);
      ctx.rotate(dir * angle);
      if (b.crossLasers.charging) {
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, H);
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(0, 245, 212, 0.35)';
        ctx.fillRect(-18, 0, 36, H);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-6, 0, 12, H);
      }
      ctx.restore();
    });
    ctx.restore();
  }

  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 110, 0.75)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(b.laserX, b.y + 40); ctx.lineTo(b.laserX, H);
    ctx.stroke();
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

  // Щупальца осьминогов с присосками/мозолями
  const tentacleCount = lvl.id === 10 ? 6 : 4;
  for (let i = 0; i < tentacleCount; i++) {
    const t = i - (tentacleCount - 1) / 2;
    const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
    const baseX = t * (lvl.id === 10 ? 20 : 28);
    const tipX = baseX * 1.2 - waveX * 0.6;

    ctx.strokeStyle = INK;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(baseX, 24);
    ctx.quadraticCurveTo(baseX + waveX, 52, tipX, 74);
    ctx.stroke();

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
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  // Купол осьминога-пожирателя
  ctx.fillStyle = flash ? '#ffffff' : lvl.bossColor;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 56, Math.PI, 0);
  ctx.quadraticCurveTo(60, 34, 0, 36);
  ctx.quadraticCurveTo(-60, 34, -56, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Мозоли на голове осьминога
  drawWarts(
    ctx,
    [[-38, -18, 5.5], [38, -18, 5.5], [-42, 6, 4.8], [42, 6, 4.8], [-18, -38, 4.5], [18, -38, 4.5]],
    '#3c096c',
    lvl.accent
  );

  // Корона
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(-22, -48); ctx.lineTo(-12, -74); ctx.lineTo(0, -54); ctx.lineTo(12, -74); ctx.lineTo(22, -48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Глаза босса
  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ex, -4, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = b.phase === 3 ? '#d90429' : INK;
    ctx.beginPath();
    ctx.arc(ex + lookX, -2, flash ? 4 : 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex + lookX - 2, -4, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-34, -20); ctx.lineTo(-8, -13);
  ctx.moveTo(34, -20); ctx.lineTo(8, -13);
  ctx.stroke();

  ctx.fillStyle = INK;
  roundRectPath(ctx, -20, 14, 40, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, 14, 6, 5);
  ctx.fillRect(7, 14, 6, 5);

  ctx.restore();
}
