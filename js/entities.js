'use strict';

const INK = '#120826';

const SHIPS_CATALOG = [
  {
    id: 'shuttle',
    name: '1. Кото-Шаттл МК-1',
    desc: 'Миниатюрный обтекаемый шаттл Котовии-17 • Базовый баланс скорости и брони.',
    price: 0,
    hpBonus: 0,
    speedMult: 1.0,
    fireRateMult: 1.0,
    dmgMult: 1.0,
    coinMult: 1.0,
    hullColor: '#e0fbfc',
    hullDark: '#98c1d9',
    wingColor: '#ff5964',
    neonColor: '#48dbfb'
  },
  {
    id: 'green_hawk',
    name: '2. Изумрудный Сокол',
    desc: 'Зелёный с аэро-крыльями и ракетами • +22% скорость, бортовые мини-ракеты.',
    price: 750,
    hpBonus: 1,
    speedMult: 1.22,
    fireRateMult: 0.90,
    dmgMult: 1.25,
    coinMult: 1.25,
    hullColor: '#80ed99',
    hullDark: '#38b000',
    wingColor: '#2d6a4f',
    neonColor: '#70e000'
  },
  {
    id: 'blue_fish',
    name: '3. Синяя Рыбка «Аква-Вихрь»',
    desc: 'Обтекаемый корпус-рыбка • Носовая воронковая пушка (вихревые кольца) +2 брони.',
    price: 1650,
    hpBonus: 2,
    speedMult: 1.18,
    fireRateMult: 0.85,
    dmgMult: 1.50,
    coinMult: 1.45,
    hullColor: '#48cae4',
    hullDark: '#0077b6',
    wingColor: '#00b4d8',
    neonColor: '#90e0ef'
  },
  {
    id: 'heart_ship',
    name: '4. Алое Сердце «Любовь»',
    desc: 'Стилизованный корпус-сердце • Стреляет самонаводящимися сердцами • +3 брони.',
    price: 2900,
    hpBonus: 3,
    speedMult: 1.28,
    fireRateMult: 0.80,
    dmgMult: 1.85,
    coinMult: 1.75,
    hullColor: '#ff758f',
    hullDark: '#c9184a',
    wingColor: '#ff4d6d',
    neonColor: '#ffb3c1'
  },
  {
    id: 'stealth_wing',
    name: '5. Крыло Архонта «Феникс»',
    desc: 'В форме крыла с лазерными и ракетными пушками • +38% скорость, +135% урон!',
    price: 4600,
    hpBonus: 4,
    speedMult: 1.38,
    fireRateMult: 0.72,
    dmgMult: 2.35,
    coinMult: 2.20,
    hullColor: '#ffd166',
    hullDark: '#f77f00',
    wingColor: '#7209b7',
    neonColor: '#f72585'
  }
];

const WEAPONS_CATALOG = [
  {
    id: 'droplet',
    name: '1. Капельная Плазма (Урон x1.0)',
    desc: 'Исходное оружие: мягкие неоновые капли плазмы с бархатным звуком.',
    price: 0,
    dmgBonus: 1.0,
    bulletColor: '#48dbfb'
  },
  {
    id: 'double_shot',
    name: '2. Двойной Выстрел (Урон x1.55)',
    desc: 'Синхронный залп из двух стволов, адаптированных под крылья корабля.',
    price: 600,
    dmgBonus: 1.55,
    bulletColor: '#72efdd'
  },
  {
    id: 'rocket_launcher',
    name: '3. Ракетница «Кото-Залп» (Урон x2.20)',
    desc: 'Самонаводящиеся ракеты с дымным следом с подвесок корабля.',
    price: 1350,
    dmgBonus: 2.20,
    bulletColor: '#ff9f1c'
  },
  {
    id: 'wave_amp',
    name: '4. Волновая Усиленная Пушка (x2.95)',
    desc: 'Широкие пробивающие волны энергии, усиливающие калибр корабля.',
    price: 2500,
    dmgBonus: 2.95,
    bulletColor: '#f15bb5'
  },
  {
    id: 'electric_arc',
    name: '5. Электрические Разряды (Урон x3.90)',
    desc: 'Высоковольтные разряды с цепной молнией по соседним врагам!',
    price: 4100,
    dmgBonus: 3.90,
    bulletColor: '#fee440'
  }
];

// 4 ДРОНА-КОМПАНЬОНА
const DRONES_CATALOG = [
  {
    id: 'none',
    name: '1. Без дрона',
    desc: 'Стандартный полёт без компаньона.',
    price: 0
  },
  {
    id: 'spark',
    name: '2. Дрон-Стрелок «Искра»',
    desc: 'Автоматически ведёт лазерный огонь по ближайшим врагам.',
    price: 500
  },
  {
    id: 'magnet',
    name: '3. Дрон-Магнит «Рыбка»',
    desc: 'Притягивает всю провизию 🐟 и бонусы с экрана прямо к кораблю.',
    price: 1100
  },
  {
    id: 'guard',
    name: '4. Дрон-Страж «Клубок»',
    desc: 'Вращается вокруг корабля, перехватывая вражеские снаряды.',
    price: 2000
  }
];

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Зеркальные Порталы, Глаза-Оракулы и гео-препятствия Янтры! Босс — Почтовая Марка!',
    enemiesDesc: 'Фрактал-Корабли, Мини-Марки, Кубики Рубика и Глаза-Оракулы',
    bossName: 'Психо-Марка Оракула',
    theme: 'lsd',
    interactiveType: 'mirror_portal',
    enemyTypes: ['fractal_ship', 'mini_stamp', 'rubik_cube', 'oracle_eye'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Черепа-пиньяты, Призраки-Сомбреро и костяные преграды! Босс — Калавера-Паук!',
    enemiesDesc: 'Мыши, Пауки, Скелеты, Сомбреро и Мини-Черепа',
    bossName: 'Калавера-Паук Инферно',
    theme: 'horror',
    interactiveType: 'pinata_skull',
    enemyTypes: ['bat_ship', 'spider_ship', 'skeleton_ship', 'sombrero_ghost', 'mini_skull'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ffbe0b', bossColor: '#ff002b', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Карамельные ускорители, Единороги-Капкейки и зефирные преграды! Босс — Пончик-Метатель!',
    enemiesDesc: 'Клоуны, Леденцы, Единороги-Капкейки, Радуги и Мини-Пончики',
    bossName: 'Пончик-Метатель Глазурный',
    theme: 'rainbow',
    interactiveType: 'candy_booster',
    enemyTypes: ['clown_ship', 'lollipop_ship', 'cupcake_unicorn', 'rainbow_spiral', 'mini_donut'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Мыльные пузыри, Морские Коньки-Торпеды и тетраэдры! Босс — Пастельный Кракен!',
    enemiesDesc: 'Крабы, Осьминоги, Морские Коньки, Скат-Зонды и Мини-Кракены',
    bossName: 'Пастельный Кракен Глубин',
    theme: 'underwater',
    interactiveType: 'giant_bubble',
    enemyTypes: ['crab_ship', 'octopus_ship', 'seahorse_torpedo', 'manta_wave', 'mini_kraken'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#9bf6ff', bossColor: '#48cae4', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудный Мир Био-Флоры',
    story: 'Цветки-батуты, Хищные Мухоловки и спирали ДНК! Босс — Подсолнух!',
    enemiesDesc: 'Медузы, Био-Осьминоги, Мухоловки, Морские Звёзды и Мини-Подсолнухи',
    bossName: 'Император Флоры «Подсолнух»',
    theme: 'organic',
    interactiveType: 'flower_bumper',
    enemyTypes: ['jellyfish_ship', 'octopus_bio', 'venus_flytrap', 'starfish_ship', 'mini_flower'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#80ed99', bossColor: '#38b000', hpMult: 2.05, coinReward: 1500
  },
  {
    id: 6,
    name: 'Грибная Галактика',
    story: 'Психо-споры, Злобные Мухоморы, Гипно-Медузы и фрактальные торы! Босс — Мега-Мухомор!',
    enemiesDesc: 'Злобные Мухоморы, Гриб-Корабли, Гипно-Медузы, Бактерии и Мухоморы',
    bossName: 'Владыка Спор «Мега-Мухомор»',
    theme: 'mushroom',
    interactiveType: 'psy_spore',
    enemyTypes: ['evil_flyagaric', 'shroom_starship', 'hypno_jellyfish', 'bacteria_shroom', 'mini_flyagaric'],
    skyTop: '#1a0436', skyMid: '#4a0866', skyBot: '#8a1278',
    accent: '#ff006e', bossColor: '#d90429', hpMult: 2.45, coinReward: 2200
  }
];

const DIFFICULTIES = {
  easy:      { label: 'Курсант', playerHp: 7, enemyHp: 0.8,  bulletSpeed: 0.82, spawnRate: 1.18, scoreMult: 0.85, durationMult: 1.0, twoBosses: false },
  normal:    { label: 'Пилот',   playerHp: 5, enemyHp: 1.0,  bulletSpeed: 1.0,  spawnRate: 1.0,  scoreMult: 1.0,  durationMult: 1.0, twoBosses: false },
  hard:      { label: 'Ас',      playerHp: 3, enemyHp: 1.3,  bulletSpeed: 1.22, spawnRate: 0.82, scoreMult: 1.35, durationMult: 1.0, twoBosses: false },
  nightmare: { label: 'Безумие', playerHp: 4, enemyHp: 1.55, bulletSpeed: 1.32, spawnRate: 0.64, scoreMult: 1.85, durationMult: 1.20, twoBosses: true }
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

function getShipHardpoints(shipId) {
  if (shipId === 'green_hawk') return { noseY: -22, pairX: 14, pairY: -6, wingX: 22, wingY: 2 };
  if (shipId === 'blue_fish')  return { noseY: -23, pairX: 11, pairY: -8, wingX: 17, wingY: 0 };
  if (shipId === 'heart_ship') return { noseY: -21, pairX: 11, pairY: -12, wingX: 16, wingY: -4 };
  if (shipId === 'stealth_wing') return { noseY: -16, pairX: 14, pairY: -6, wingX: 27, wingY: 3 };
  return { noseY: -22, pairX: 10, pairY: -8, wingX: 19, wingY: 2 };
}

function drawGlossyCircle(ctx, x, y, r, mainCol) {
  ctx.fillStyle = mainCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(18, 8, 38, 0.24)';
  ctx.beginPath(); ctx.arc(x, y + r * 0.14, r * 0.86, 0.15 * Math.PI, 0.85 * Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.28, y - r * 0.36, r * 0.42, r * 0.22, -0.35, 0, Math.PI * 2); ctx.fill();
}

function drawCartoonEyes(ctx, e, leftX, rightX, eyeY, eyeR, irisCol = '#ff006e', player = null) {
  const hurt = e.hitFlash > 0.25;
  if (hurt) {
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath();
    ctx.moveTo(leftX - eyeR * 0.8, eyeY - eyeR * 0.6); ctx.lineTo(leftX + eyeR * 0.5, eyeY); ctx.lineTo(leftX - eyeR * 0.8, eyeY + eyeR * 0.6);
    ctx.moveTo(rightX + eyeR * 0.8, eyeY - eyeR * 0.6); ctx.lineTo(rightX - eyeR * 0.5, eyeY); ctx.lineTo(rightX + eyeR * 0.8, eyeY + eyeR * 0.6);
    ctx.stroke(); return;
  }
  let lookX = 0, lookY = 1;
  if (player) {
    const ang = Math.atan2(player.y - e.y, player.x - e.x);
    lookX = Math.cos(ang) * (eyeR * 0.36); lookY = Math.sin(ang) * (eyeR * 0.36);
  }
  [leftX, rightX].forEach(ex => {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = irisCol; ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.58, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(ex + lookX - eyeR * 0.22, eyeY + lookY - eyeR * 0.22, eyeR * 0.22, 0, Math.PI * 2); ctx.fill();
  });
}

function drawEliteCrown(ctx, yTop) {
  ctx.save(); ctx.translate(0, yTop);
  ctx.fillStyle = '#ffd166'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-11, 0); ctx.lineTo(-13, -11); ctx.lineTo(-5, -5); ctx.lineTo(0, -14); ctx.lineTo(5, -5); ctx.lineTo(13, -11); ctx.lineTo(11, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(0, -4, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawPlayerShipModel(ctx, ship, time, vx = 0, opts = {}) {
  const shipId = ship.id || 'shuttle';
  const hullCol = ship.hullColor || '#e0fbfc', hullDark = ship.hullDark || '#98c1d9';
  const wingCol = ship.wingColor || '#ff5964', neonCol = ship.neonColor || '#48dbfb';

  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = neonCol; ctx.globalAlpha = 0.24; ctx.beginPath(); ctx.arc(0, 1, 28, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;

  const flameH = 14 + Math.sin(time * 42) * 4.5;
  const thrusters = shipId === 'blue_fish' ? [0] : (shipId === 'stealth_wing' ? [-14, 0, 14] : [-7, 7]);
  thrusters.forEach(ox => {
    ctx.fillStyle = '#ff9f1c'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(ox - 4, 13); ctx.quadraticCurveTo(ox, 13 + flameH * 1.25, ox + 4, 13); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.moveTo(ox - 2, 13); ctx.quadraticCurveTo(ox, 13 + flameH * 0.65, ox + 2, 13); ctx.closePath(); ctx.fill();
  });

  if (shipId === 'green_hawk') {
    ctx.fillStyle = wingCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.bezierCurveTo(-18, -10, -29, 0, -25, 13); ctx.quadraticCurveTo(-11, 9, 0, 13);
    ctx.quadraticCurveTo(11, 9, 25, 13); ctx.bezierCurveTo(29, 0, 18, -10, 0, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
    [-19, 19].forEach(rx => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
      roundRectPath(ctx, rx - 2.8, -5, 5.6, 14, 2.8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff0054'; ctx.beginPath(); ctx.arc(rx, -5, 2.8, Math.PI, 0); ctx.fill();
    });
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -22); ctx.bezierCurveTo(13, -12, 13, 10, 0, 19); ctx.bezierCurveTo(-13, 10, -13, -12, 0, -22); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (shipId === 'blue_fish') {
    const tailWag = Math.sin(time * 12) * 3.5;
    ctx.fillStyle = wingCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.3;
    ctx.beginPath(); ctx.moveTo(0, 14); ctx.quadraticCurveTo(-11 + tailWag, 21, -9 + tailWag, 26); ctx.quadraticCurveTo(0, 21, 9 + tailWag, 26); ctx.quadraticCurveTo(11 + tailWag, 21, 0, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, -2); ctx.quadraticCurveTo(-24, 2, -18, 12); ctx.quadraticCurveTo(-11, 9, -10, 5);
    ctx.moveTo(10, -2);  ctx.quadraticCurveTo(24, 2, 18, 12);  ctx.quadraticCurveTo(11, 9, 10, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(15, -13, 15, 8, 0, 17); ctx.bezierCurveTo(-15, 8, -15, -13, 0, -21); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#03045e'; ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-4, -19); ctx.lineTo(-6, -24); ctx.lineTo(6, -24); ctx.lineTo(4, -19); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (shipId === 'heart_ship') {
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(10, -10, 23, -3, 21, 9); ctx.bezierCurveTo(19, 19, 6, 20, 0, 12);
    ctx.bezierCurveTo(-6, 20, -19, 19, -21, 9); ctx.bezierCurveTo(-23, -3, -10, -10, 0, -21); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hullDark; ctx.beginPath(); ctx.moveTo(0, -16); ctx.bezierCurveTo(7, -8, 16, -2, 14, 7); ctx.bezierCurveTo(12, 13, 4, 14, 0, 8);
    ctx.bezierCurveTo(-4, 14, -12, 13, -14, 7); ctx.bezierCurveTo(-16, -2, -7, -8, 0, -16); ctx.closePath(); ctx.fill();
  } else if (shipId === 'stealth_wing') {
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -16); ctx.bezierCurveTo(14, -12, 26, -3, 31, 12); ctx.quadraticCurveTo(16, 8, 8, 13);
    ctx.lineTo(0, 9); ctx.lineTo(-8, 13); ctx.quadraticCurveTo(-16, 8, -31, 12); ctx.bezierCurveTo(-26, -3, -14, -12, 0, -16); ctx.closePath(); ctx.fill(); ctx.stroke();
    [-27, 27].forEach(lx => { ctx.fillStyle = '#f72585'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6; roundRectPath(ctx, lx - 2.5, -2, 5, 13, 2.5); ctx.fill(); ctx.stroke(); });
    [-14, 14].forEach(rx => { ctx.fillStyle = '#7209b7'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6; roundRectPath(ctx, rx - 3.2, -8, 6.4, 12, 2.5); ctx.fill(); ctx.stroke(); });
  } else {
    ctx.fillStyle = wingCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(0, -9); ctx.bezierCurveTo(-15, -5, -24, 4, -21, 14); ctx.quadraticCurveTo(-10, 12, 0, 14);
    ctx.quadraticCurveTo(10, 12, 21, 14); ctx.bezierCurveTo(24, 4, 15, -5, 0, -9); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(13, -12, 13, 10, 0, 19); ctx.bezierCurveTo(-13, 10, -13, -12, 0, -21); ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'; ctx.beginPath(); ctx.ellipse(-5.5, -3, 2.8, 9, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#48dbfb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, 0, 8.8, 10.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffb703';
  ctx.beginPath(); ctx.moveTo(-5.5, -3); ctx.lineTo(-4.5, -8.5); ctx.lineTo(-1, -4); ctx.moveTo(5.5, -3); ctx.lineTo(4.5, -8.5); ctx.lineTo(1, -4); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0.5, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-2.2, 0, 1.1, 0, Math.PI * 2); ctx.arc(2.2, 0, 1.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'; ctx.beginPath(); ctx.ellipse(-3.2, -4.2, 2.6, 4.4, -0.35, 0, Math.PI * 2); ctx.fill();

  if (opts.weaponId) {
    const hp = getShipHardpoints(shipId);
    if (opts.weaponId === 'double_shot') {
      ctx.fillStyle = '#72efdd'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
      [-hp.pairX, hp.pairX].forEach(wx => { roundRectPath(ctx, wx - 2.5, hp.pairY - 5, 5, 10, 2.5); ctx.fill(); ctx.stroke(); });
    } else if (opts.weaponId === 'rocket_launcher') {
      ctx.fillStyle = '#ff9f1c'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
      [-hp.wingX, hp.wingX].forEach(wx => { roundRectPath(ctx, wx - 3.5, hp.wingY - 6, 7, 12, 3); ctx.fill(); ctx.stroke(); });
    } else if (opts.weaponId === 'wave_amp') {
      ctx.strokeStyle = '#f15bb5'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(0, hp.noseY - 2, 7.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (opts.weaponId === 'electric_arc') {
      ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
      [-hp.pairX, hp.pairX].forEach(wx => { ctx.beginPath(); ctx.arc(wx, hp.pairY - 4, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }
  }
  ctx.restore();
}
function drawInteractiveProp(ctx, pr) {
  ctx.save(); ctx.translate(pr.x, pr.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const pulse = 1 + Math.sin(pr.phase * 4) * 0.08; ctx.scale(pulse, pulse);

  if (pr.type === 'mirror_portal') {
    ctx.rotate(pr.phase * 2.5);
    ctx.strokeStyle = pr.pairIdx === 0 ? '#00f5d4' : '#f72585'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, pr.r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([8, 6]); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, pr.r * 0.68, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  } else if (pr.type === 'pinata_skull') {
    ctx.rotate(Math.sin(pr.phase * 3) * 0.2);
    drawGlossyCircle(ctx, 0, -2, 20, '#ffbe0b');
    ctx.fillStyle = '#ff006e'; ctx.fillRect(-14, -4, 28, 5);
    ctx.fillStyle = '#06d6a0'; ctx.fillRect(-12, 4, 24, 5);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-6, -5, 3.5, 0, Math.PI * 2); ctx.arc(6, -5, 3.5, 0, Math.PI * 2); ctx.fill();
  } else if (pr.type === 'candy_booster') {
    ['#ff3366', '#ffee33', '#33ee88', '#33ccff'].forEach((c, idx) => {
      ctx.strokeStyle = c; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0, 0, pr.r - idx * 4, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.fillStyle = '#ffffff'; ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚡', 0, 1);
  } else if (pr.type === 'giant_bubble') {
    ctx.fillStyle = 'rgba(155, 246, 255, 0.25)'; ctx.strokeStyle = '#9bf6ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, pr.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; ctx.beginPath(); ctx.ellipse(-pr.r * 0.35, -pr.r * 0.35, pr.r * 0.28, pr.r * 0.14, -0.5, 0, Math.PI * 2); ctx.fill();
  } else if (pr.type === 'flower_bumper') {
    ctx.rotate(pr.phase * 1.5);
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3); ctx.fillStyle = '#80ed99'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(14, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 12, '#fee440');
  } else if (pr.type === 'psy_spore') {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.32)'; ctx.beginPath(); ctx.arc(0, 0, pr.r + 8, 0, Math.PI * 2); ctx.fill();
    drawGlossyCircle(ctx, 0, 0, 16, '#ffd166');
    ctx.fillStyle = '#ff006e'; ctx.font = '900 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🍄', 0, 1);
  }
  ctx.restore();
}

function drawFishRainItem(ctx, item) {
  ctx.save(); ctx.translate(item.x, item.y); ctx.rotate(Math.sin(item.phase * 4) * 0.2);
  drawGlossyCircle(ctx, 0, 0, 16, '#ffd166');
  ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(item.emoji || '🐟', 0, 1);
  ctx.restore();
}

function drawObstacle(ctx, ob) {
  ctx.save(); ctx.translate(ob.x, ob.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const hue = Math.floor(((ob.phase || 0) * 95) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 66%)`, dynamicNeon2 = `hsl(${(hue + 140) % 360}, 100%, 72%)`;

  if (ob.shape === 'mushroom_box') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = 'rgba(26, 4, 54, 0.88)'; ctx.strokeStyle = dynamicNeon; ctx.lineWidth = 3;
    roundRectPath(ctx, -23, -23, 46, 46, 10); ctx.fill(); ctx.stroke();
    [[-8, 3, 0.85], [9, 6, 0.7]].forEach(([mx, my, sc]) => {
      ctx.save(); ctx.translate(mx, my); ctx.scale(sc, sc);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, 0, 6, 11);
      ctx.fillStyle = dynamicNeon2; ctx.beginPath(); ctx.arc(0, 0, 11, Math.PI, 0); ctx.fill(); ctx.restore();
    });
    ctx.restore(); return;
  }

  if (ob.shape === 'spore_crystal' || ob.shape === 'neon_star_obstacle') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.6; ctx.beginPath();
    const pts = ob.shape === 'spore_crystal' ? 4 : 5;
    for (let i = 0; i < pts; i++) {
      const a = (Math.PI * 2 * i) / pts - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * (ob.r + 4), Math.sin(a) * (ob.r + 4));
      ctx.lineTo(Math.cos(a + Math.PI / pts) * (ob.r * 0.45), Math.sin(a + Math.PI / pts) * (ob.r * 0.45));
    }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); return;
  }

  if (ob.shape === 'om_fractal') {
    ctx.save(); ctx.rotate(ob.rot || 0); ctx.strokeStyle = dynamicNeon; ctx.lineWidth = 2.5;
    for (let k = 0; k < 8; k++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(12, 0); ctx.quadraticCurveTo(22, -9, 30, 0); ctx.quadraticCurveTo(22, 9, 12, 0); ctx.stroke(); }
    ctx.restore();
    drawGlossyCircle(ctx, 0, 0, 17, '#1b0933');
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 21px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ॐ', 0, 1);
    ctx.restore(); return;
  }

  if (ob.shape === 'skull_bones' || ob.shape === 'blood_pentagram') {
    ctx.rotate(ob.rot || 0);
    ctx.strokeStyle = '#e2ece9'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-24, -24); ctx.lineTo(24, 24); ctx.moveTo(24, -24); ctx.lineTo(-24, 24); ctx.stroke();
    drawGlossyCircle(ctx, 0, -2, 18, '#2b2333');
    ctx.fillStyle = '#06d6a0'; ctx.beginPath(); ctx.arc(-6, -3, 4.5, 0, Math.PI * 2); ctx.arc(6, -3, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'rainbow_donut' || ob.shape === 'dream_bubble' || ob.shape === 'rainbow_cloud') {
    ctx.rotate(ob.rot || 0); drawGlossyCircle(ctx, 0, 0, ob.r, '#f4a261');
    ctx.fillStyle = '#ff70a6'; ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.78, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1447'; ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'neon_coral' || ob.shape === 'seaweed_kelp') {
    ctx.strokeStyle = '#9bf6ff'; ctx.lineWidth = 7;
    [[-14, -18], [0, -24], [14, -16]].forEach(([bx, by]) => { ctx.beginPath(); ctx.moveTo(0, 16); ctx.quadraticCurveTo(bx * 0.5, 0, bx, by); ctx.stroke(); });
    ctx.restore(); return;
  }

  for (let t = -2; t <= 2; t++) {
    const sway = Math.sin((ob.phase || 0) * 3.5 + t * 1.3) * 9;
    ctx.strokeStyle = t % 2 === 0 ? '#38b000' : '#80ed99'; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(t * 4, 14); ctx.bezierCurveTo(t * 8 - sway, 2, t * 10 + sway, -12, t * 11 + sway, -22); ctx.stroke();
  }
  drawGlossyCircle(ctx, 0, 12, 13, '#1b4332'); ctx.restore();
}

function drawUniqueEnemy(ctx, e, player = null) {
  ctx.save(); ctx.translate(e.x, e.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (e.isElite) ctx.scale(1.18, 1.18);
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 105) % 360);

  if (e.isElite) {
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(0, 0, e.r + 8, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }

  // Новые враги для каждого уровня (+1 к каждому)
  if (e.kind === 'oracle_eye') {
    drawGlossyCircle(ctx, 0, 0, 18, flash ? '#ffffff' : '#ffd166');
    drawCartoonEyes(ctx, e, -5, 5, 0, 5, '#7209b7', player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }
  if (e.kind === 'sombrero_ghost') {
    drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : '#3a86ff');
    ctx.fillStyle = '#ff002b'; ctx.fillRect(-16, -4, 32, 4);
    drawCartoonEyes(ctx, e, -5, 5, -2, 4.2, '#ffd166', player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }
  if (e.kind === 'cupcake_unicorn') {
    drawGlossyCircle(ctx, 0, 0, 16, flash ? '#ffffff' : '#ffafcc');
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(-4, -24); ctx.lineTo(4, -24); ctx.closePath(); ctx.fill();
    drawCartoonEyes(ctx, e, -5, 5, 1, 4, '#3a86ff', player);
    if (e.isElite) drawEliteCrown(ctx, -17);
    ctx.restore(); return;
  }
  if (e.kind === 'seahorse_torpedo') {
    drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : '#48cae4');
    ctx.fillStyle = '#90e0ef'; ctx.beginPath(); ctx.arc(-12, 4, 6, 0, Math.PI * 2); ctx.fill();
    drawCartoonEyes(ctx, e, -5, 5, -1, 4.2, '#03045e', player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }
  if (e.kind === 'venus_flytrap') {
    drawGlossyCircle(ctx, 0, 0, 18, flash ? '#ffffff' : '#38b000');
    ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI, 0); ctx.fill();
    drawCartoonEyes(ctx, e, -5, 5, 2, 4, '#fee440', player);
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }
  if (e.kind === 'hypno_jellyfish') {
    drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : '#9d4edd');
    ctx.strokeStyle = '#c77dff'; ctx.lineWidth = 2.5;
    [-8, 0, 8].forEach(ox => { ctx.beginPath(); ctx.moveTo(ox, 10); ctx.lineTo(ox, 24); ctx.stroke(); });
    drawCartoonEyes(ctx, e, -5, 5, -2, 4.2, '#00f5d4', player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  // Обычные враги
  if (e.kind === 'evil_flyagaric' || e.kind === 'mini_flyagaric') {
    const capCol = e.kind === 'mini_flyagaric' ? `hsl(${hue}, 95%, 56%)` : '#ff002b';
    e.wingCol = capCol; e.bodyCol = '#ffffff';
    const breathe = 1 + Math.sin(e.phase * 4) * 0.06; ctx.scale(breathe, 2 - breathe);
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -8, 0, 16, 21, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = flash ? '#ffffff' : capCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.quadraticCurveTo(22, 9, 0, 7); ctx.quadraticCurveTo(-22, 9, -21, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; [[-10, -8, 3.4], [10, -7, 3], [0, -13, 4]].forEach(([sx, sy, sr]) => { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
    drawCartoonEyes(ctx, e, -5.5, 5.5, 11, 4.2, '#ff006e', player);
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }

  if (e.kind === 'shroom_starship' || e.kind === 'polyp_mushroom' || e.kind === 'bacteria_shroom') {
    const c1 = `hsl(${hue}, 95%, 60%)`, c2 = `hsl(${(hue + 140) % 360}, 95%, 68%)`;
    e.wingCol = c1; e.bodyCol = c2;
    ctx.fillStyle = flash ? '#ffffff' : c2; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(-26, 4, -20, 18); ctx.lineTo(0, 12); ctx.lineTo(20, 18); ctx.quadraticCurveTo(26, 4, 0, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
    drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : c1);
    drawCartoonEyes(ctx, e, -6, 6, 2, 4.5, '#7209b7', player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  if (e.kind === 'fractal_ship') {
    const c1 = `hsl(${hue}, 95%, 62%)`, c2 = `hsl(${(hue + 140) % 360}, 95%, 68%)`;
    e.wingCol = c1; e.bodyCol = c2;
    ctx.save(); ctx.rotate(Math.sin(e.phase * 1.5) * 0.35);
    ctx.fillStyle = flash ? '#ffffff' : c1; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(18, -9, 26, 0); ctx.quadraticCurveTo(18, 9, 6, 0); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    drawGlossyCircle(ctx, 0, 0, 14, flash ? '#ffffff' : c2);
    drawCartoonEyes(ctx, e, -5, 5, 0, 4, '#ff006e', player);
    if (e.isElite) drawEliteCrown(ctx, -16);
    ctx.restore(); return;
  }

  if (e.kind === 'mini_stamp') {
    const c1 = `hsl(${hue}, 95%, 60%)`;
    e.wingCol = c1; e.bodyCol = '#14052b';
    ctx.fillStyle = flash ? '#ffffff' : c1; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    roundRectPath(ctx, -18, -20, 36, 40, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1b0933'; roundRectPath(ctx, -13, -15, 26, 30, 5); ctx.fill();
    drawCartoonEyes(ctx, e, -6, 6, -2, 4.5, '#06d6a0', player);
    if (e.isElite) drawEliteCrown(ctx, -22);
    ctx.restore(); return;
  }

  if (e.kind === 'rubik_cube') {
    e.wingCol = '#ff5964'; e.bodyCol = '#48dbfb';
    ctx.rotate(Math.sin(e.phase * 1.4) * 0.25);
    const size = 34, half = 17, cell = size / 3;
    const cubeColors = ['#ff3366', '#ffd166', '#06d6a0', '#48dbfb', '#ffffff', '#ff9f1c'];
    ctx.fillStyle = INK; roundRectPath(ctx, -half - 2, -half - 2, size + 4, size + 4, 7); ctx.fill();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = flash ? '#ffffff' : cubeColors[(row * 3 + col + Math.floor(e.phase * 2)) % cubeColors.length];
        roundRectPath(ctx, -half + col * cell + 1, -half + row * cell + 1, cell - 2, cell - 2, 3); ctx.fill();
      }
    }
    drawCartoonEyes(ctx, e, -6, 6, 2, 4.2, '#3a86ff', player);
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  if (e.kind === 'bat_ship' || e.kind === 'spider_ship' || e.kind === 'skeleton_ship' || e.kind === 'mini_skull') {
    const palette2 = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    const cMain = palette2[Math.floor(e.phase * 1.5) % palette2.length];
    const cSub = palette2[(Math.floor(e.phase * 1.5) + 1) % palette2.length];
    e.wingCol = cMain; e.bodyCol = cSub;

    drawGlossyCircle(ctx, 0, 0, 16, flash ? '#ffffff' : (e.kind === 'mini_skull' || e.kind === 'skeleton_ship' ? '#fff8eb' : cSub));
    drawCartoonEyes(ctx, e, -6, 6, 1, 4.5, cMain, player);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  if (e.kind === 'clown_ship' || e.kind === 'lollipop_ship' || e.kind === 'rainbow_spiral' || e.kind === 'mini_donut') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    e.wingCol = wingCol; e.bodyCol = '#fff8eb';
    drawGlossyCircle(ctx, 0, 0, 18, flash ? '#ffffff' : wingCol);
    drawCartoonEyes(ctx, e, -6, 6, -2, 4.4, '#ff006e', player);
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  const mainCol = `hsl(${175 + (hue % 45)}, 90%, 72%)`;
  e.wingCol = mainCol; e.bodyCol = '#ffffff';
  drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : mainCol);
  drawCartoonEyes(ctx, e, -6, 6, -1, 4.5, '#14213d', player);
  if (e.isElite) drawEliteCrown(ctx, -19);
  ctx.restore();
}

// ДЕТАЛИЗИРОВАННЫЕ БОССЫ С РАЗРУШАЕМЫМИ МОДУЛЯМИ
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(bScale, bScale); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;
  const hue = Math.floor((b.time * 110) % 360);

  if (lvl.id === 1) {
    const stampW = 122, stampH = 136, halfW = 61, halfH = 68;
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${hue}, 95%, 60%)`;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 74%)`; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-halfW, -halfH);
    for (let i = 0; i < 8; i++) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, -halfH, 4.5, Math.PI, 0, true);
    ctx.lineTo(halfW, -halfH);
    for (let i = 0; i < 9; i++) ctx.arc(halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(halfW, halfH);
    for (let i = 7; i >= 0; i--) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, halfH, 4.5, 0, Math.PI, true);
    ctx.lineTo(-halfW, halfH);
    for (let i = 8; i >= 0; i--) ctx.arc(-halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#14052b'; roundRectPath(ctx, -halfW + 11, -halfH + 11, stampW - 22, stampH - 22, 8); ctx.fill();
    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.arc(ex, -14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff006e'; ctx.beginPath(); ctx.arc(ex + lookX, -13, 7.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#090214'; roundRectPath(ctx, -30, 14, 60, 28, 12); ctx.fill(); ctx.stroke();
    ctx.restore(); return;
  }

  if (lvl.id === 2) {
    const legCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const wave = Math.sin(b.time * 6 + l * 1.4) * 10, baseY = -12 + l * 12;
        ctx.strokeStyle = legCols[l]; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(side * 42, baseY); ctx.quadraticCurveTo(side * 76, baseY - 22 + wave, side * 92, baseY + 24 - wave); ctx.stroke();
      }
    }
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = '#ff002b'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -14, 52, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(26, 52); ctx.lineTo(-26, 52); ctx.closePath(); ctx.fill(); ctx.stroke();
    [-21, 21].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#3a86ff'; ctx.beginPath(); ctx.arc(ex, -6, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#090206'; ctx.beginPath(); ctx.arc(ex, -6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#ff002b'; roundRectPath(ctx, -22, 28, 44, 20, 6); ctx.fill();
    ctx.restore(); return;
  }

  if (lvl.id === 3) {
    [-1, 1].forEach(side => {
      const armWave = Math.sin(b.time * 5 + side) * 14;
      ctx.strokeStyle = '#ff70a6'; ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(side * 52, 8); ctx.quadraticCurveTo(side * 82, -10 + armWave, side * 90, 18 - armWave); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(side * 90, 18 - armWave, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = flash ? '#ffffff' : '#ff70a6'; ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    [-21, 21].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, -12, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(ex + lookX, -11, 6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#120824'; ctx.beginPath(); ctx.arc(0, 16, 21, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (lvl.id === 4) {
    const seaHue = 175 + Math.sin(b.time * 3.5) * 45;
    for (let i = 0; i < 8; i++) {
      const t = i - 3.5, waveX = Math.sin(b.time * 5 + i * 0.9) * 16;
      ctx.strokeStyle = `hsl(${(seaHue + i * 28) % 360}, 95%, 74%)`; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(t * 14, 22); ctx.quadraticCurveTo(t * 18 + waveX, 54, t * 21 - waveX * 0.5, 78); ctx.stroke();
    }
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${seaHue}, 92%, 72%)`; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, -4, 54, Math.PI, 0); ctx.quadraticCurveTo(58, 32, 0, 34); ctx.quadraticCurveTo(-58, 32, -54, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, -8, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#03045e'; ctx.beginPath(); ctx.arc(ex + lookX, -7, 6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#03045e'; roundRectPath(ctx, -22, 12, 44, 16, 8); ctx.fill();
    ctx.restore(); return;
  }

  if (lvl.id === 5) {
    ctx.strokeStyle = '#38b000'; ctx.lineWidth = 10;
    for (let v = 0; v < 4; v++) {
      const t = v - 1.5, whipX = Math.sin(b.time * 4.5 + v * 1.3) * 32;
      ctx.beginPath(); ctx.moveTo(t * 24, 24); ctx.bezierCurveTo(t * 36 + whipX, 55, t * 20 - whipX, 82, t * 32 + whipX * 0.6, 100); ctx.stroke();
    }
    ctx.save(); ctx.rotate(b.time * 0.5);
    for (let i = 0; i < 14; i++) {
      ctx.rotate((Math.PI * 2) / 14);
      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ff9f1c'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, 32); ctx.quadraticCurveTo(14, 58, 0, 74); ctx.quadraticCurveTo(-14, 58, 0, 32); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = flash ? '#ffffff' : '#3d1e05'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [-16, 16].forEach(ex => { ctx.fillStyle = '#fee440'; ctx.beginPath(); ctx.arc(ex, -8, 11, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore(); return;
  }

  const capCol = flash ? '#ffffff' : `hsl(${hue}, 100%, 54%)`;
  ctx.fillStyle = '#f8edeb'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-28, 0); ctx.quadraticCurveTo(-36, 36, -24, 62); ctx.lineTo(24, 62); ctx.quadraticCurveTo(36, 36, 28, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = capCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 4, 66, Math.PI, 0); ctx.quadraticCurveTo(70, 22, 0, 16); ctx.quadraticCurveTo(-70, 22, -66, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  [[-36, -24, 9], [36, -24, 9], [0, -44, 11]].forEach(([sx, sy, sr]) => { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
  [-15, 15].forEach(ex => {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.arc(ex, 22, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, 22, 4.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#14052b'; roundRectPath(ctx, -18, 36, 36, 18, 8); ctx.fill();
  ctx.restore();
}
