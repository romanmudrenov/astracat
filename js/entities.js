'use strict';

const INK = '#120826';

const SHIPS_CATALOG = [
  {
    id: 'shuttle',
    name: '1. Кото-Шаттл МК-1',
    desc: 'Миниатюрный обтекаемый шаттл Котовии-17 • Базовый баланс скорости и брони.',
    price: 0, hpBonus: 0, speedMult: 1.0, fireRateMult: 1.0, dmgMult: 1.0, coinMult: 1.0,
    hullColor: '#e0fbfc', hullDark: '#98c1d9', wingColor: '#ff5964', neonColor: '#48dbfb'
  },
  {
    id: 'green_hawk',
    name: '2. Изумрудный Сокол',
    desc: 'Зелёный с аэро-крыльями и ракетами • +22% скорость, бортовые мини-ракеты.',
    price: 750, hpBonus: 1, speedMult: 1.22, fireRateMult: 0.90, dmgMult: 1.25, coinMult: 1.25,
    hullColor: '#80ed99', hullDark: '#38b000', wingColor: '#2d6a4f', neonColor: '#70e000'
  },
  {
    id: 'blue_fish',
    name: '3. Синяя Рыбка «Аква-Вихрь»',
    desc: 'Обтекаемый корпус-рыбка • Носовая воронковая пушка (вихревые кольца) +2 брони.',
    price: 1650, hpBonus: 2, speedMult: 1.18, fireRateMult: 0.85, dmgMult: 1.50, coinMult: 1.45,
    hullColor: '#48cae4', hullDark: '#0077b6', wingColor: '#00b4d8', neonColor: '#90e0ef'
  },
  {
    id: 'heart_ship',
    name: '4. Алое Сердце «Любовь»',
    desc: 'Стилизованный корпус-сердце • Стреляет самонаводящимися сердцами • +3 брони.',
    price: 2900, hpBonus: 3, speedMult: 1.28, fireRateMult: 0.80, dmgMult: 1.85, coinMult: 1.75,
    hullColor: '#ff758f', hullDark: '#c9184a', wingColor: '#ff4d6d', neonColor: '#ffb3c1'
  },
  {
    id: 'stealth_wing',
    name: '5. Крыло Архонта «Феникс»',
    desc: 'В форме крыла с лазерными и ракетными пушками • +38% скорость, +135% урон!',
    price: 4600, hpBonus: 4, speedMult: 1.38, fireRateMult: 0.72, dmgMult: 2.35, coinMult: 2.20,
    hullColor: '#ffd166', hullDark: '#f77f00', wingColor: '#7209b7', neonColor: '#f72585'
  }
];

const WEAPONS_CATALOG = [
  { id: 'droplet', name: '1. Капельная Плазма (Урон x1.0)', desc: 'Исходное оружие: мягкие неоновые капли плазмы с бархатным звуком.', price: 0, dmgBonus: 1.0, bulletColor: '#48dbfb' },
  { id: 'double_shot', name: '2. Двойной Выстрел (Урон x1.55)', desc: 'Синхронный залп из двух стволов, адаптированных под крылья корабля.', price: 600, dmgBonus: 1.55, bulletColor: '#72efdd' },
  { id: 'rocket_launcher', name: '3. Ракетница «Кото-Залп» (Урон x2.20)', desc: 'Самонаводящиеся ракеты с дымным следом с подвесок корабля.', price: 1350, dmgBonus: 2.20, bulletColor: '#ff9f1c' },
  { id: 'wave_amp', name: '4. Волновая Усиленная Пушка (x2.95)', desc: 'Широкие пробивающие волны энергии, усиливающие калибр корабля.', price: 2500, dmgBonus: 2.95, bulletColor: '#f15bb5' },
  { id: 'electric_arc', name: '5. Электрические Разряды (Урон x3.90)', desc: 'Высоковольтные разряды с цепной молнией по соседним врагам!', price: 4100, dmgBonus: 3.90, bulletColor: '#fee440' }
];

const DRONES_CATALOG = [
  { id: 'none', name: 'Без дрона', desc: 'Полёт в одиночку без орбитального спутника.', price: 0, weaponType: 'none', accent: '#98c1d9' },
  { id: 'wing_vanguard', name: '1. Крыло-Перехватчик', desc: 'Летит впереди корабля, тараном снимает HP врагам и стреляет плазменными пульками.', price: 900, weaponType: 'bullet', accent: '#48dbfb' },
  { id: 'twin_fishes', name: '2. Рыбки-Близнецы (x2)', desc: 'Две неоновые рыбки кружат вокруг корабля и бьют широкими волновыми импульсами.', price: 2200, weaponType: 'wave', accent: '#f15bb5' },
  { id: 'cat_bowl', name: '3. Космо-Миска Котовии', desc: 'Притягивает рыбку и бонусы, лечит +1 HP кормом и бьёт длинными электро-разрядами!', price: 3800, weaponType: 'electric', accent: '#fee440' }
];

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Стреляй в Зеркальные Порталы, чтобы бить врагов в спину! Впереди 2 Босса — Архи-Марки!',
    enemiesDesc: 'Злобные Марки, Психо-Подсолнухи и Кубики Рубика',
    bossName: 'Архи-Марка Оракула',
    theme: 'lsd',
    interactiveType: 'mirror_portal',
    enemyTypes: ['mini_stamp', 'sunflower_lsd', 'rubik_cube'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#f3c4fb', bossColor: '#bdb2ff', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Сбивай Черепа-Пиньяты для взрыва конфетти и оглушения врагов! Впереди 2 Черепа-Паука!',
    enemiesDesc: 'Черепки Калавера, Психо-Мыши и Неоновые Пауки',
    bossName: 'Калавера-Паук Инферно',
    theme: 'horror',
    interactiveType: 'pinata_skull',
    enemyTypes: ['mini_skull', 'bat_ship', 'spider_ship', 'skeleton_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ffd6a5', bossColor: '#ffadad', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Ванильно-Пастельный Поток',
    story: 'Залетай в Карамельные Ускорители для турбо-стрельбы! Впереди 2 Ванильных Мега-Вкусняша!',
    enemiesDesc: 'Ванильные Леденцы, Сахарная Вата, Пончики и Арлекины',
    bossName: 'Ванильный Мега-Вкусняш',
    theme: 'rainbow',
    interactiveType: 'candy_booster',
    enemyTypes: ['lollipop_ship', 'cotton_candy', 'mini_donut', 'clown_ship'],
    skyTop: '#4a3563', skyMid: '#7d5a8a', skyBot: '#d4a5b8',
    accent: '#fff3d6', bossColor: '#ffc2d1', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Лови врагов в Гигантские Мыльные Пузыри или ныряй в них за щитом! Впереди 2 Осьминога!',
    enemiesDesc: 'Осьминоги, Неоновые Медузы, Кальмары и Крабы',
    bossName: 'Психоделический Осьминог',
    theme: 'underwater',
    interactiveType: 'giant_bubble',
    enemyTypes: ['octopus_ship', 'jellyfish_ocean', 'squid_ship', 'crab_ship'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#caf0f8', bossColor: '#90e0ef', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудный Мир Био-Флоры',
    story: 'Используй Цветки-Батуты для рикошета пуль под углом! Впереди 2 Подсолнуха со Щупальцами!',
    enemiesDesc: 'Злобные Лианы, Хищные Ростки и Цветки-Мухоловки',
    bossName: 'Подсолнух со Щупальцами',
    theme: 'organic',
    interactiveType: 'flower_bumper',
    enemyTypes: ['vine_beast', 'sprout_hunter', 'mini_flower', 'starfish_ship'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#d8f3dc', bossColor: '#b7e4c7', hpMult: 2.05, coinReward: 1500
  },
  {
    id: 6,
    name: 'Грибная Галактика',
    story: 'Собирай Золотые Психо-Споры для замедления времени и веерного залпа! Впереди 2 Мухомора!',
    enemiesDesc: 'Грибы со Щупальцами, Злобные Мухоморы и Психо-Грибы',
    bossName: 'Владыка Мухомор-Сколопендра',
    theme: 'mushroom',
    interactiveType: 'psy_spore',
    enemyTypes: ['tentacle_shroom', 'evil_flyagaric', 'psy_mushroom', 'mini_flyagaric'],
    skyTop: '#1a0436', skyMid: '#4a0866', skyBot: '#8a1278',
    accent: '#ffc6ff', bossColor: '#e0aaff', hpMult: 2.45, coinReward: 2200
  }
];

const DIFFICULTIES = {
  easy:      { label: 'Курсант', playerHp: 7, enemyHp: 0.8,  bulletSpeed: 0.82, spawnRate: 1.18, scoreMult: 0.85, durationMult: 1.0, twoBosses: true },
  normal:    { label: 'Пилот',   playerHp: 5, enemyHp: 1.0,  bulletSpeed: 1.0,  spawnRate: 1.0,  scoreMult: 1.0,  durationMult: 1.0, twoBosses: true },
  hard:      { label: 'Ас',      playerHp: 3, enemyHp: 1.3,  bulletSpeed: 1.22, spawnRate: 0.82, scoreMult: 1.35, durationMult: 1.0, twoBosses: true },
  nightmare: { label: 'Безумие', playerHp: 4, enemyHp: 1.55, bulletSpeed: 1.32, spawnRate: 0.64, scoreMult: 1.85, durationMult: 1.15, twoBosses: true }
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
  ctx.fillStyle = mainCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3.2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(18, 8, 38, 0.24)';
  ctx.beginPath(); ctx.arc(x, y + r * 0.14, r * 0.86, 0.15 * Math.PI, 0.85 * Math.PI); ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.56)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.28, y - r * 0.36, r * 0.42, r * 0.22, -0.35, 0, Math.PI * 2); ctx.fill();
}

function drawCartoonEyes(ctx, e, leftX, rightX, eyeY, eyeR, irisCol = '#ff006e', player = null, angry = true) {
  const hurt = e.hitFlash > 0.25;
  if (hurt) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(leftX - eyeR * 0.8, eyeY - eyeR * 0.6); ctx.lineTo(leftX + eyeR * 0.5, eyeY); ctx.lineTo(leftX - eyeR * 0.8, eyeY + eyeR * 0.6);
    ctx.moveTo(rightX + eyeR * 0.8, eyeY - eyeR * 0.6); ctx.lineTo(rightX - eyeR * 0.5, eyeY); ctx.lineTo(rightX + eyeR * 0.8, eyeY + eyeR * 0.6);
    ctx.stroke();
    return;
  }

  let lookX = 0, lookY = 1;
  if (player) {
    const ang = Math.atan2(player.y - e.y, player.x - e.x);
    lookX = Math.cos(ang) * (eyeR * 0.36);
    lookY = Math.sin(ang) * (eyeR * 0.36);
  }

  [leftX, rightX].forEach((ex, idx) => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = irisCol;
    ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.58, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.30, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ex + lookX - eyeR * 0.22, eyeY + lookY - eyeR * 0.22, eyeR * 0.22, 0, Math.PI * 2); ctx.fill();

    if (angry) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      if (idx === 0) {
        ctx.moveTo(ex - eyeR * 0.95, eyeY - eyeR * 0.95);
        ctx.lineTo(ex + eyeR * 0.85, eyeY - eyeR * 0.45);
      } else {
        ctx.moveTo(ex + eyeR * 0.95, eyeY - eyeR * 0.95);
        ctx.lineTo(ex - eyeR * 0.85, eyeY - eyeR * 0.45);
      }
      ctx.stroke();
    }
  });
}

function drawFangedMouth(ctx, y, w, h) {
  ctx.fillStyle = '#14052b';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, -w / 2, y, w, h, h * 0.45);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  [-w * 0.28, w * 0.28].forEach(fx => {
    ctx.beginPath();
    ctx.moveTo(fx - 2.4, y);
    ctx.lineTo(fx, y + h * 0.65);
    ctx.lineTo(fx + 2.4, y);
    ctx.closePath();
    ctx.fill();
  });
}

function drawEliteCrown(ctx, yTop) {
  ctx.save();
  ctx.translate(0, yTop);
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-11, 0); ctx.lineTo(-13, -11); ctx.lineTo(-5, -5); ctx.lineTo(0, -14); ctx.lineTo(5, -5); ctx.lineTo(13, -11); ctx.lineTo(11, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff006e';
  ctx.beginPath(); ctx.arc(0, -4, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// =========================================================================
// ОТРИСОВКА 3 БОЕВЫХ ДРОНОВ
// =========================================================================
function drawDroneModel(ctx, droneId, time, subIdx = 0) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (droneId === 'wing_vanguard') {
    ctx.fillStyle = 'rgba(72, 219, 251, 0.25)';
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#48dbfb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -13); ctx.lineTo(17, 6); ctx.lineTo(7, 4); ctx.lineTo(0, 10); ctx.lineTo(-7, 4); ctx.lineTo(-17, 6);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = '#72efdd'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(0, -3, 14, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, -2, 3.8, 0, Math.PI * 2); ctx.fill();
  } else if (droneId === 'twin_fishes') {
    const wag = Math.sin(time * 14 + subIdx * 2) * 3.5;
    const bodyCol = subIdx === 0 ? '#ff70a6' : '#72efdd';
    const finCol = subIdx === 0 ? '#ffd166' : '#48cae4';

    ctx.fillStyle = bodyCol; ctx.globalAlpha = 0.22;
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = finCol; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 8); ctx.lineTo(-6 + wag, 15); ctx.lineTo(0, 12); ctx.lineTo(6 + wag, 15);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-6, 0); ctx.lineTo(-12, 4); ctx.lineTo(-6, 5);
    ctx.moveTo(6, 0);  ctx.lineTo(12, 4);  ctx.lineTo(6, 5);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = bodyCol;
    ctx.beginPath(); ctx.ellipse(0, -1, 7.5, 10.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-2.8, -5, 2.2, 0, Math.PI * 2); ctx.arc(2.8, -5, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-2.8, -5.5, 1.1, 0, Math.PI * 2); ctx.arc(2.8, -5.5, 1.1, 0, Math.PI * 2); ctx.fill();
  } else if (droneId === 'cat_bowl') {
    const pulse = 1 + Math.sin(time * 5) * 0.06;
    ctx.scale(pulse, pulse);

    ctx.strokeStyle = 'rgba(254, 228, 64, 0.45)'; ctx.lineWidth = 1.8; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f4a261'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -2, 11, Math.PI, 0); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#90e0ef';
    ctx.beginPath(); ctx.ellipse(0, -6, 5, 2.6, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff5964'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-13, -2); ctx.lineTo(13, -2); ctx.lineTo(16, 9); ctx.lineTo(-16, 9); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, 4.5, 2.5, 0, Math.PI * 2); ctx.fill();
    [-3.2, 0, 3.2].forEach((px, idx) => {
      ctx.beginPath(); ctx.arc(px, idx === 1 ? 1.2 : 1.8, 1.1, 0, Math.PI * 2); ctx.fill();
    });
  }

  ctx.restore();
}

// =========================================================================
// 5 КОРАБЛЕЙ ИГРОКА
// =========================================================================
function drawPlayerShipModel(ctx, ship, time, vx = 0, opts = {}) {
  const shipId = ship.id || 'shuttle';
  const hullCol = ship.hullColor || '#e0fbfc';
  const hullDark = ship.hullDark || '#98c1d9';
  const wingCol = ship.wingColor || '#ff5964';
  const neonCol = ship.neonColor || '#48dbfb';

  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  ctx.fillStyle = neonCol; ctx.globalAlpha = 0.24;
  ctx.beginPath(); ctx.arc(0, 1, 28, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  const flameH = 14 + Math.sin(time * 42) * 4.5;
  const thrusters = shipId === 'blue_fish' ? [0] : (shipId === 'stealth_wing' ? [-14, 0, 14] : [-7, 7]);
  thrusters.forEach(ox => {
    ctx.fillStyle = '#ff9f1c'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(ox - 4, 13); ctx.quadraticCurveTo(ox, 13 + flameH * 1.25, ox + 4, 13); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath(); ctx.moveTo(ox - 2, 13); ctx.quadraticCurveTo(ox, 13 + flameH * 0.65, ox + 2, 13); ctx.closePath(); ctx.fill();
  });

  if (shipId === 'green_hawk') {
    ctx.fillStyle = wingCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.bezierCurveTo(-18, -10, -29, 0, -25, 13); ctx.quadraticCurveTo(-11, 9, 0, 13);
    ctx.quadraticCurveTo(11, 9, 25, 13); ctx.bezierCurveTo(29, 0, 18, -10, 0, -12);
    ctx.closePath(); ctx.fill(); ctx.stroke();

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
    ctx.beginPath();
    ctx.moveTo(0, 14); ctx.quadraticCurveTo(-11 + tailWag, 21, -9 + tailWag, 26); ctx.quadraticCurveTo(0, 21, 9 + tailWag, 26); ctx.quadraticCurveTo(11 + tailWag, 21, 0, 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, -2); ctx.quadraticCurveTo(-24, 2, -18, 12); ctx.quadraticCurveTo(-11, 9, -10, 5);
    ctx.moveTo(10, -2);  ctx.quadraticCurveTo(24, 2, 18, 12);  ctx.quadraticCurveTo(11, 9, 10, 5);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(15, -13, 15, 8, 0, 17); ctx.bezierCurveTo(-15, 8, -15, -13, 0, -21); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#03045e'; ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-4, -19); ctx.lineTo(-6, -24); ctx.lineTo(6, -24); ctx.lineTo(4, -19); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (shipId === 'heart_ship') {
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -21); ctx.bezierCurveTo(10, -10, 23, -3, 21, 9); ctx.bezierCurveTo(19, 19, 6, 20, 0, 12);
    ctx.bezierCurveTo(-6, 20, -19, 19, -21, 9); ctx.bezierCurveTo(-23, -3, -10, -10, 0, -21);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = hullDark;
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.bezierCurveTo(7, -8, 16, -2, 14, 7); ctx.bezierCurveTo(12, 13, 4, 14, 0, 8);
    ctx.bezierCurveTo(-4, 14, -12, 13, -14, 7); ctx.bezierCurveTo(-16, -2, -7, -8, 0, -16);
    ctx.closePath(); ctx.fill();
  } else if (shipId === 'stealth_wing') {
    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.bezierCurveTo(14, -12, 26, -3, 31, 12); ctx.quadraticCurveTo(16, 8, 8, 13);
    ctx.lineTo(0, 9); ctx.lineTo(-8, 13); ctx.quadraticCurveTo(-16, 8, -31, 12); ctx.bezierCurveTo(-26, -3, -14, -12, 0, -16);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    [-27, 27].forEach(lx => { ctx.fillStyle = '#f72585'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6; roundRectPath(ctx, lx - 2.5, -2, 5, 13, 2.5); ctx.fill(); ctx.stroke(); });
    [-14, 14].forEach(rx => { ctx.fillStyle = '#7209b7'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6; roundRectPath(ctx, rx - 3.2, -8, 6.4, 12, 2.5); ctx.fill(); ctx.stroke(); });
  } else {
    ctx.fillStyle = wingCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -9); ctx.bezierCurveTo(-15, -5, -24, 4, -21, 14); ctx.quadraticCurveTo(-10, 12, 0, 14);
    ctx.quadraticCurveTo(10, 12, 21, 14); ctx.bezierCurveTo(24, 4, 15, -5, 0, -9);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = hullCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(13, -12, 13, 10, 0, 19); ctx.bezierCurveTo(-13, 10, -13, -12, 0, -21); ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath(); ctx.ellipse(-5.5, -3, 2.8, 9, -0.2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#48dbfb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.ellipse(0, 0, 8.8, 10.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffb703';
  ctx.beginPath();
  ctx.moveTo(-5.5, -3); ctx.lineTo(-4.5, -8.5); ctx.lineTo(-1, -4);
  ctx.moveTo(5.5, -3);  ctx.lineTo(4.5, -8.5);  ctx.lineTo(1, -4);
  ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0.5, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(-2.2, 0, 1.1, 0, Math.PI * 2); ctx.arc(2.2, 0, 1.1, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.beginPath(); ctx.ellipse(-3.2, -4.2, 2.6, 4.4, -0.35, 0, Math.PI * 2); ctx.fill();

  if (opts.weaponId) {
    const hp = getShipHardpoints(shipId);
    if (opts.weaponId === 'double_shot') {
      ctx.fillStyle = '#72efdd'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
      [-hp.pairX, hp.pairX].forEach(wx => { roundRectPath(ctx, wx - 2.5, hp.pairY - 5, 5, 10, 2.5); ctx.fill(); ctx.stroke(); });
    } else if (opts.weaponId === 'rocket_launcher') {
      ctx.fillStyle = '#ff9f1c'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
      [-hp.wingX, hp.wingX].forEach(wx => { roundRectPath(ctx, wx - 3.5, hp.wingY - 6, 7, 12, 3); ctx.fill(); ctx.stroke(); });
    } else if (opts.weaponId === 'wave_amp') {
      ctx.strokeStyle = '#f15bb5'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, hp.noseY - 2, 7.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (opts.weaponId === 'electric_arc') {
      ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
      [-hp.pairX, hp.pairX].forEach(wx => { ctx.beginPath(); ctx.arc(wx, hp.pairY - 4, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }
  }

  ctx.restore();
}

function drawInteractiveProp(ctx, pr) {
  ctx.save();
  ctx.translate(pr.x, pr.y);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const pulse = 1 + Math.sin(pr.phase * 4) * 0.08;
  ctx.scale(pulse, pulse);

  if (pr.type === 'mirror_portal') {
    ctx.rotate(pr.phase * 2.5);
    ctx.strokeStyle = pr.pairIdx === 0 ? '#00f5d4' : '#f72585'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, pr.r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([8, 6]); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, pr.r * 0.68, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  } else if (pr.type === 'pinata_skull') {
    ctx.rotate(Math.sin(pr.phase * 3) * 0.2);
    drawGlossyCircle(ctx, 0, -2, 20, '#ffbe0b');
    ctx.fillStyle = '#ff006e'; ctx.fillRect(-14, -4, 28, 5);
    ctx.fillStyle = '#06d6a0'; ctx.fillRect(-12, 4, 24, 5);
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-6, -5, 3.5, 0, Math.PI * 2); ctx.arc(6, -5, 3.5, 0, Math.PI * 2); ctx.fill();
  } else if (pr.type === 'candy_booster') {
    ['#fff3d6', '#ffc2d1', '#bde0fe', '#d8f3dc'].forEach((c, idx) => {
      ctx.strokeStyle = c; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, 0, pr.r - idx * 4, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.fillStyle = '#ffffff'; ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 0, 1);
  } else if (pr.type === 'giant_bubble') {
    ctx.fillStyle = 'rgba(155, 246, 255, 0.25)'; ctx.strokeStyle = '#9bf6ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, pr.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath(); ctx.ellipse(-pr.r * 0.35, -pr.r * 0.35, pr.r * 0.28, pr.r * 0.14, -0.5, 0, Math.PI * 2); ctx.fill();
  } else if (pr.type === 'flower_bumper') {
    ctx.rotate(pr.phase * 1.5);
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillStyle = '#80ed99'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(14, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 12, '#fee440');
  } else if (pr.type === 'psy_spore') {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.32)';
    ctx.beginPath(); ctx.arc(0, 0, pr.r + 8, 0, Math.PI * 2); ctx.fill();
    drawGlossyCircle(ctx, 0, 0, 16, '#ffd166');
    ctx.fillStyle = '#ff006e'; ctx.font = '900 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🍄', 0, 1);
  }
  ctx.restore();
}

function drawFishRainItem(ctx, item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(Math.sin(item.phase * 4) * 0.2);
  drawGlossyCircle(ctx, 0, 0, 16, '#ffd166');
  ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(item.emoji || '🐟', 0, 1);
  ctx.restore();
}

function drawFoodBonus(ctx, bn) {
  ctx.save(); ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.12; ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const glowColors = { red_shield: '#ff5964', fractal_shuriken: '#00f5d4', electric_shock: '#fee440', wave_cannon: '#f15bb5' };
  const neonCol = glowColors[bn.type] || '#ffd166';

  ctx.fillStyle = neonCol; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = '#1b1438'; ctx.strokeStyle = neonCol; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  if (bn.type === 'red_shield') {
    ctx.fillStyle = '#ff5964'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14); ctx.lineTo(Math.cos(a + Math.PI / 5) * 6, Math.sin(a + Math.PI / 5) * 6);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (bn.type === 'fractal_shuriken') {
    ctx.rotate(bn.phase); ctx.fillStyle = '#00f5d4'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6, rad = i % 2 === 0 ? 14 : 5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (bn.type === 'electric_shock') {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.beginPath();
    ctx.moveTo(3, -13); ctx.lineTo(-9, 1); ctx.lineTo(-1, 1); ctx.lineTo(-5, 13); ctx.lineTo(9, -2); ctx.lineTo(1, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    ctx.strokeStyle = '#f15bb5'; ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => { ctx.beginPath(); ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
  }
  ctx.restore();
}

function drawPlayerBullet(ctx, b) {
  ctx.save(); ctx.translate(b.x, b.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (b.kind === 'heart_shot') {
    ctx.fillStyle = '#ff4d6d'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.beginPath();
    ctx.moveTo(0, -8); ctx.bezierCurveTo(6, -14, 13, -6, 0, 8); ctx.bezierCurveTo(-13, -6, -6, -14, 0, -8); ctx.fill(); ctx.stroke();
  } else if (b.kind === 'vortex_ring') {
    ctx.rotate(b.rot || 0); ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 1.6); ctx.stroke();
  } else if (b.kind === 'player_rocket') {
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2); ctx.fillStyle = '#e0fbfc'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    roundRectPath(ctx, -3.5, -9, 7, 16, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964'; ctx.beginPath(); ctx.arc(0, -9, 3.6, Math.PI, 0); ctx.fill();
  } else if (b.kind === 'fractal_shuriken') {
    ctx.rotate(b.rot || 0); ctx.fillStyle = '#00f5d4'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6, rad = i % 2 === 0 ? 13 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (b.kind === 'electric_bolt') {
    const len = b.longBolt ? 24 : 14;
    ctx.strokeStyle = '#fee440'; ctx.lineWidth = b.longBolt ? 4.2 : 3.5;
    ctx.beginPath(); ctx.moveTo(0, -len); ctx.lineTo(-7, -len * 0.35); ctx.lineTo(6, len * 0.35); ctx.lineTo(0, len); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6; ctx.stroke();
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = b.color || '#f15bb5'; ctx.lineWidth = 5.5; ctx.beginPath(); ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (b.kind === 'wing_laser') {
    ctx.fillStyle = '#f72585'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; roundRectPath(ctx, -2.5, -14, 5, 26, 2.5); ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = b.color || '#48dbfb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// 18 УНИКАЛЬНЫХ МИГАЮЩИХ ПРЕПЯТСТВИЙ (ПО 3 НА КАЖДЫЙ УРОВЕНЬ 1–6)
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const ph = ob.phase || 0;
  const hue = Math.floor((ph * 110) % 360);
  const strobe = Math.sin(ph * 9) > 0;
  const blinkCol = strobe ? '#ffffff' : `hsl(${hue}, 100%, 66%)`;
  const blinkCol2 = `hsl(${(hue + 140) % 360}, 100%, 70%)`;

  // --- УРОВЕНЬ 1: 1) Звезда со знаком Ом, 2) Хиппи-символ мира, 3) Вращающаяся мандала ---
  if (ob.shape === 'om_star') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = blinkCol2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 26, Math.sin(a) * 26);
      ctx.lineTo(Math.cos(a + Math.PI / 6) * 14, Math.sin(a + Math.PI / 6) * 14);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawGlossyCircle(ctx, 0, 0, 14, '#1b0933');
    ctx.fillStyle = blinkCol;
    ctx.font = 'bold 19px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', 0, 1);
    ctx.restore(); return;
  }

  if (ob.shape === 'hippie_peace') {
    ctx.rotate(Math.sin(ph * 2.2) * 0.35);
    drawGlossyCircle(ctx, 0, 0, 23, strobe ? '#ff70a6' : '#00f5d4');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.moveTo(0, -18); ctx.lineTo(0, 18);
    ctx.moveTo(0, 0);   ctx.lineTo(-12.5, 12.5);
    ctx.moveTo(0, 0);   ctx.lineTo(12.5, 12.5);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore(); return;
  }

  if (ob.shape === 'spinning_mandala') {
    ctx.rotate(ob.rot || 0);
    for (let ring = 2; ring >= 0; ring--) {
      const rOuter = 10 + ring * 7.5;
      ctx.fillStyle = ring % 2 === 0 ? blinkCol : blinkCol2;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      for (let k = 0; k < 8; k++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(rOuter * 0.65, 0, rOuter * 0.45, rOuter * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    drawGlossyCircle(ctx, 0, 0, 7, '#ffd166');
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 2: 1) Мексиканский череп с костями, 2) Пиньята-осёл, 3) Мигающее сомбреро ---
  if (ob.shape === 'mexican_skull_bones') {
    ctx.rotate(Math.sin(ph * 2.5) * 0.22);
    // Скрещённые неоновые кости
    ctx.strokeStyle = strobe ? '#ffbe0b' : '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-23, -21); ctx.lineTo(23, 21); ctx.moveTo(23, -21); ctx.lineTo(-23, 21); ctx.stroke();

    // Череп Калавера
    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, -4, 15, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(9, 15); ctx.lineTo(-9, 15); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Цветочные глазницы и зубы
    [-5.5, 5.5].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff002b' : '#06d6a0';
      ctx.beginPath(); ctx.arc(ex, -3, 4.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(ex, -3, 2.2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(-6, 10); ctx.lineTo(6, 10); ctx.moveTo(0, 7.5); ctx.lineTo(0, 13); ctx.stroke();
    ctx.restore(); return;
  }

  if (ob.shape === 'donkey_pinata') {
    ctx.rotate(Math.sin(ph * 4) * 0.25);
    const stripes = ['#ff006e', '#ffbe0b', '#06d6a0', '#3a86ff', '#9b5de5'];
    const c1 = stripes[Math.floor(ph * 3) % stripes.length];
    const c2 = stripes[(Math.floor(ph * 3) + 2) % stripes.length];

    // Ноги и туловище пиньяты-ослика
    ctx.fillStyle = c1;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    roundRectPath(ctx, -14, -4, 26, 14, 5); ctx.fill(); ctx.stroke();
    // Шея и голова с длинными ушами
    roundRectPath(ctx, 4, -17, 13, 15, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c2;
    roundRectPath(ctx, 5, -26, 4, 10, 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, 11, -26, 4, 10, 2); ctx.fill(); ctx.stroke();
    // Ножки снизу
    roundRectPath(ctx, -12, 9, 5, 11, 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, 5, 9, 5, 11, 2); ctx.fill(); ctx.stroke();
    // Глазик и полоска конфетти
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(12, -12, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(12.5, -12, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'blinking_sombrero') {
    ctx.rotate(Math.sin(ph * 3) * 0.22);
    const hatCol = strobe ? '#ffbe0b' : '#ff006e';
    const trimCol = strobe ? '#06d6a0' : '#3a86ff';

    // Высокая тулья сомбреро
    ctx.fillStyle = hatCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-11, 4); ctx.quadraticCurveTo(-9, -22, 0, -22); ctx.quadraticCurveTo(9, -22, 11, 4);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Широкие загнутые поля сомбреро
    ctx.fillStyle = trimCol;
    ctx.beginPath();
    ctx.ellipse(0, 6, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Мигающие помпоны по краю полей
    [-20, -10, 0, 10, 20].forEach((px, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffee33' : '#ffffff';
      ctx.beginPath(); ctx.arc(px, 12, 2.6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 3 (ВАНИЛЬНО-ПАСТЕЛЬНЫЙ): 1) Облачка с молниями, 2) Пончик, 3) Радужный фрактал ---
  if (ob.shape === 'cotton_candy_storm') {
    // Розовые пастельные облачка сахарной ваты
    const puffs = [[-12, -2, 11], [12, -2, 11], [-6, -10, 12], [7, -9, 11], [0, -1, 13]];
    puffs.forEach(([px, py, pr], idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffc2d1' : '#ffe5ec';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    // Мигающие пастельно-золотые молнии снизу облака
    if (strobe) {
      ctx.strokeStyle = '#fff3b0';
      ctx.lineWidth = 3;
      [-8, 8].forEach(lx => {
        ctx.beginPath();
        ctx.moveTo(lx, 7); ctx.lineTo(lx - 4, 15); ctx.lineTo(lx + 2, 15); ctx.lineTo(lx - 2, 24);
        ctx.stroke();
      });
    }
    ctx.restore(); return;
  }

  if (ob.shape === 'pastel_donut') {
    ctx.rotate(ob.rot || 0);
    drawGlossyCircle(ctx, 0, 0, 23, '#f3d5b5');
    ctx.fillStyle = strobe ? '#ffc2d1' : '#ffccd5';
    ctx.beginPath(); ctx.arc(0, 0, 18.5, 0, Math.PI * 2); ctx.fill();
    const spCols = ['#fff3d6', '#bde0fe', '#d8f3dc', '#e0c3fc'];
    for (let k = 0; k < 8; k++) {
      const a = (Math.PI * 2 * k) / 8;
      ctx.fillStyle = spCols[k % spCols.length];
      ctx.fillRect(Math.cos(a) * 13 - 2, Math.sin(a) * 13 - 1.5, 4, 3);
    }
    ctx.fillStyle = '#4a3563'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'pastel_fractal') {
    ctx.rotate(ob.rot || 0);
    const pCols = ['#fff3d6', '#ffc2d1', '#e0c3fc', '#bde0fe', '#d8f3dc'];
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillStyle = pCols[(k + (strobe ? 1 : 0)) % pCols.length];
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(17, -7); ctx.lineTo(25, 0); ctx.lineTo(17, 7);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 8, '#fff3d6');
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 4: 1) Живые водоросли, 2) Ракушка, 3) Розовые кораллы ---
  if (ob.shape === 'moving_seaweed') {
    for (let t = -2; t <= 2; t++) {
      const sway = Math.sin(ph * 4.5 + t * 1.4) * 11;
      ctx.strokeStyle = t % 2 === 0 ? '#06d6a0' : '#9bf6ff';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(t * 4, 18);
      ctx.bezierCurveTo(t * 7 - sway, 4, t * 9 + sway, -10, t * 10 + sway, -22);
      ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 16, 11, '#0077b6');
    ctx.restore(); return;
  }

  if (ob.shape === 'spiral_seashell') {
    ctx.rotate(Math.sin(ph * 2.5) * 0.25);
    ctx.fillStyle = strobe ? '#ffccd5' : '#caf0f8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, 2, 21, Math.PI, 0);
    ctx.lineTo(12, 18); ctx.lineTo(-12, 18); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Рельефные рёбра ракушки
    ctx.strokeStyle = '#90e0ef';
    ctx.lineWidth = 2;
    [-10, -4, 4, 10].forEach(rx => {
      ctx.beginPath(); ctx.moveTo(0, 16); ctx.lineTo(rx * 1.4, -14); ctx.stroke();
    });
    ctx.restore(); return;
  }

  if (ob.shape === 'pink_corals') {
    const coralCol = strobe ? '#ff85a1' : '#ff70a6';
    ctx.strokeStyle = coralCol;
    ctx.lineWidth = 7;
    [[-16, -16], [-6, -24], [6, -23], [16, -15]].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(bx * 0.4, 2, bx, by);
      ctx.stroke();
      ctx.fillStyle = '#fff3d6';
      ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    drawGlossyCircle(ctx, 0, 16, 10, '#c9184a');
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 5: 1) Живой цветок с листьями, 2) Растительная клетка, 3) Игольчатое растение ---
  if (ob.shape === 'living_flower') {
    // Живые колышущиеся листья снизу
    const leafW = Math.sin(ph * 5) * 4;
    [-1, 1].forEach(side => {
      ctx.fillStyle = '#38b000'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(side * 14, 12 + leafW * side, 11, 5.5, side * 0.4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });

    // Дышащие лепестки цветка
    const petalScale = 1 + Math.sin(ph * 6) * 0.08;
    ctx.save();
    ctx.scale(petalScale, petalScale);
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillStyle = strobe ? '#ff70a6' : '#ccff33';
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(12, 0, 9, 5.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 9, '#ffd166');
    ctx.restore();
    ctx.restore(); return;
  }

  if (ob.shape === 'plant_cell') {
    ctx.rotate(ob.rot || 0);
    // Шестиугольная клеточная стенка
    ctx.fillStyle = '#1b4332';
    ctx.strokeStyle = strobe ? '#ccff33' : '#80ed99';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI * 2 * k) / 6;
      const vx = Math.cos(a) * 24, vy = Math.sin(a) * 24;
      if (k === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Ядро клетки и зелёные хлоропласты
    drawGlossyCircle(ctx, -4, -3, 8, '#ff70a6');
    [[10, -7], [9, 8], [-9, 10]].forEach(([cx, cy]) => {
      ctx.fillStyle = '#70e000';
      ctx.beginPath(); ctx.ellipse(cx, cy, 5, 3, 0.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore(); return;
  }

  if (ob.shape === 'spiky_plant') {
    // Кактус-шар с мигающими золотыми иголками и цветком на макушке
    drawGlossyCircle(ctx, 0, 2, 18, '#2d6a4f');
    ctx.strokeStyle = strobe ? '#ffee33' : '#ccff33';
    ctx.lineWidth = 2.6;
    for (let k = 0; k < 10; k++) {
      const a = (Math.PI * 2 * k) / 10;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 16, 2 + Math.sin(a) * 16);
      ctx.lineTo(Math.cos(a) * 26, 2 + Math.sin(a) * 26);
      ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, -15, 6.5, '#ff006e');
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 6: 1) Фигурный мухомор, 2) Псилоцибиновый разноцветный гриб, 3) Круглый психо-гриб ---
  if (ob.shape === 'fly_agaric_obs') {
    ctx.rotate(Math.sin(ph * 3) * 0.2);
    ctx.fillStyle = '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -7, 0, 14, 20, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = strobe ? '#ff002b' : '#d90429';
    ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.quadraticCurveTo(22, 8, 0, 6); ctx.quadraticCurveTo(-22, 8, -21, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    [[-10, -7, 3.2], [10, -6, 3], [0, -13, 3.8]].forEach(([sx, sy, sr]) => { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore(); return;
  }

  if (ob.shape === 'psilocybin_shroom') {
    ctx.rotate(Math.sin(ph * 3.5) * 0.25);
    // Изогнутая радужная ножка и заострённая шляпка псилоцибинового гриба
    ctx.strokeStyle = blinkCol2; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(8, 11, -3, 22); ctx.stroke();

    ctx.fillStyle = blinkCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-20, 2); ctx.quadraticCurveTo(-16, -22, 0, -24); ctx.quadraticCurveTo(16, -22, 20, 2);
    ctx.quadraticCurveTo(0, 7, -20, 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore(); return;
  }

  // Круглый фигурный психоделический гриб (round_psy_shroom)
  ctx.rotate(ob.rot || 0);
  ctx.fillStyle = '#e0aaff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
  roundRectPath(ctx, -6, 6, 12, 15, 5); ctx.fill(); ctx.stroke();
  drawGlossyCircle(ctx, 0, -3, 19, blinkCol);
  ctx.strokeStyle = blinkCol2; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(0, -3, 12, 0, Math.PI * 1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -3, 6, Math.PI * 0.5, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// =========================================================================
// ДЕТАЛИЗИРОВАННЫЕ МИГАЮЩИЕ ВРАГИ (БЕЗ КРУГОВ ВОКРУГ)
// =========================================================================
function drawUniqueEnemy(ctx, e, player = null) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (e.isElite) ctx.scale(1.18, 1.18);

  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 120) % 360);
  const strobe = Math.sin(e.phase * 10) > 0;
  const neonRim = strobe ? '#ffffff' : `hsl(${hue}, 100%, 66%)`;

  // --- УРОВЕНЬ 1: ЗЛОБНАЯ МАРКА, ПСИХО-ПОДСОЛНУХ, КУБИК РУБИКА ---
  if (e.kind === 'mini_stamp') {
    const stampCol = flash ? '#ffffff' : `hsl(${hue}, 95%, 56%)`;
    e.wingCol = stampCol; e.bodyCol = '#14052b';

    ctx.fillStyle = stampCol;
    ctx.strokeStyle = neonRim;
    ctx.lineWidth = 3;
    const w = 38, h = 44, hw = 19, hh = 22;
    ctx.beginPath();
    ctx.moveTo(-hw, -hh);
    for (let i = 0; i < 4; i++) ctx.arc(-hw + (w * (i + 0.5)) / 4, -hh, 2.3, Math.PI, 0, true);
    ctx.lineTo(hw, -hh);
    for (let i = 0; i < 5; i++) ctx.arc(hw, -hh + (h * (i + 0.5)) / 5, 2.3, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(hw, hh);
    for (let i = 3; i >= 0; i--) ctx.arc(-hw + (w * (i + 0.5)) / 4, hh, 2.3, 0, Math.PI, true);
    ctx.lineTo(-hw, hh);
    for (let i = 4; i >= 0; i--) ctx.arc(-hw, -hh + (h * (i + 0.5)) / 5, 2.3, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#120529';
    roundRectPath(ctx, -14, -17, 28, 34, 4);
    ctx.fill();

    ctx.strokeStyle = `hsl(${(hue + 140) % 360}, 100%, 65%)`;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = '900 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('666 ॐ', 0, -10);

    drawCartoonEyes(ctx, e, -6.5, 6.5, -1, 4.3, '#ff006e', player, true);
    drawFangedMouth(ctx, 7, 16, 6.5);
    if (e.isElite) drawEliteCrown(ctx, -24);
    ctx.restore(); return;
  }

  if (e.kind === 'sunflower_lsd' || e.kind === 'fractal_ship') {
    const petalCol = flash ? '#ffffff' : (strobe ? '#ffd166' : '#ff9f1c');
    const innerPetal = `hsl(${hue}, 100%, 62%)`;
    e.wingCol = petalCol; e.bodyCol = '#3d1e05';

    ctx.save();
    ctx.rotate(Math.sin(e.phase * 2) * 0.25);
    for (let k = 0; k < 12; k++) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = k % 2 === 0 ? petalCol : innerPetal;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.quadraticCurveTo(21, -5.5, 27, 0);
      ctx.quadraticCurveTo(21, 5.5, 10, 0);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    drawGlossyCircle(ctx, 0, 0, 14.5, flash ? '#ffffff' : '#3d1e05');
    ctx.fillStyle = '#ffbe0b';
    for (let s = 0; s < 8; s++) {
      const sa = (Math.PI * 2 * s) / 8 + e.phase;
      ctx.beginPath(); ctx.arc(Math.cos(sa) * 10.5, Math.sin(sa) * 10.5, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    drawCartoonEyes(ctx, e, -5.5, 5.5, -2, 4.2, '#06d6a0', player, true);
    drawFangedMouth(ctx, 5.5, 14, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  if (e.kind === 'rubik_cube') {
    e.wingCol = '#ff5964'; e.bodyCol = '#48dbfb';
    ctx.rotate(Math.sin(e.phase * 1.4) * 0.22);
    const size = 34, half = 17, cell = size / 3;
    const cubeColors = ['#ff3366', '#ffd166', '#06d6a0', '#48dbfb', '#ffffff', '#ff9f1c'];
    ctx.fillStyle = INK; ctx.strokeStyle = neonRim; ctx.lineWidth = 2.8;
    roundRectPath(ctx, -half - 2, -half - 2, size + 4, size + 4, 6); ctx.fill(); ctx.stroke();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = flash ? '#ffffff' : cubeColors[(row * 3 + col + Math.floor(e.phase * 3)) % cubeColors.length];
        roundRectPath(ctx, -half + col * cell + 1, -half + row * cell + 1, cell - 2, cell - 2, 2.5); ctx.fill();
      }
    }
    drawCartoonEyes(ctx, e, -6, 6, -1, 4.2, '#ff006e', player, true);
    drawFangedMouth(ctx, 7, 15, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -21);
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 2: МЕКСИКАНСКИЕ ЧЕРЕПКИ, ЗЛОБНЫЕ ЛЕТУЧИЕ МЫШИ, НЕОНОВЫЕ ПАУКИ ---
  if (e.kind === 'mini_skull' || e.kind === 'skeleton_ship') {
    e.wingCol = '#ff006e'; e.bodyCol = '#fff8eb';
    const skullCol = flash ? '#ffffff' : '#fff8eb';

    ctx.fillStyle = skullCol;
    ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff006e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -4, 17, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(10, 17);
    ctx.lineTo(-10, 17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = strobe ? '#06d6a0' : '#ff006e';
    ctx.beginPath(); ctx.arc(0, -13, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a86ff';
    ctx.beginPath(); ctx.arc(-9, -11, 2.4, 0, Math.PI * 2); ctx.arc(9, -11, 2.4, 0, Math.PI * 2); ctx.fill();

    [-6.5, 6.5].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff002b' : '#06d6a0';
      ctx.beginPath(); ctx.arc(ex, -2, 5.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(ex, -2, 3.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath(); ctx.arc(ex, -2, 1.8, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(-2.5, 7); ctx.lineTo(2.5, 7); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(-7, 12); ctx.lineTo(7, 12);
    [-4, 0, 4].forEach(tx => { ctx.moveTo(tx, 9.5); ctx.lineTo(tx, 15); });
    ctx.stroke();

    if (e.isElite) drawEliteCrown(ctx, -22);
    ctx.restore(); return;
  }

  if (e.kind === 'bat_ship') {
    const flap = Math.sin(e.phase * 5.5) * 8;
    const batCol = flash ? '#ffffff' : '#3a0ca3';
    const veinCol = strobe ? '#ffbe0b' : '#ff006e';
    e.wingCol = batCol; e.bodyCol = '#7209b7';

    ctx.fillStyle = batCol;
    ctx.strokeStyle = veinCol;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-16, -18 + flap * 0.4);
    ctx.lineTo(-32, -8 + flap);
    ctx.lineTo(-24, 4 + flap * 0.7);
    ctx.lineTo(-17, 11 + flap * 0.4);
    ctx.lineTo(-9, 8);
    ctx.lineTo(0, 14);
    ctx.lineTo(9, 8);
    ctx.lineTo(17, 11 + flap * 0.4);
    ctx.lineTo(24, 4 + flap * 0.7);
    ctx.lineTo(32, -8 + flap);
    ctx.lineTo(16, -18 + flap * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#560bad';
    ctx.beginPath();
    ctx.moveTo(-7, -8); ctx.lineTo(-10, -21); ctx.lineTo(-2, -11);
    ctx.moveTo(7, -8);  ctx.lineTo(10, -21);  ctx.lineTo(2, -11);
    ctx.fill();
    drawGlossyCircle(ctx, 0, -1, 11, flash ? '#ffffff' : '#7209b7');
    drawCartoonEyes(ctx, e, -4.5, 4.5, -2, 3.6, '#ffbe0b', player, true);
    drawFangedMouth(ctx, 4, 11, 5);
    if (e.isElite) drawEliteCrown(ctx, -23);
    ctx.restore(); return;
  }

  if (e.kind === 'spider_ship') {
    const legCol = strobe ? '#06d6a0' : '#ff002b';
    e.wingCol = legCol; e.bodyCol = '#14052b';

    ctx.strokeStyle = legCol;
    ctx.lineWidth = 3;
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const w = Math.sin(e.phase * 7 + l * 1.4) * 5;
        const y0 = -6 + l * 4.5;
        ctx.beginPath();
        ctx.moveTo(side * 9, y0);
        ctx.lineTo(side * 22, y0 - 8 + w);
        ctx.lineTo(side * 29, y0 + 8 - w);
        ctx.stroke();
      }
    }

    drawGlossyCircle(ctx, 0, -7, 11, flash ? '#ffffff' : '#240046');
    ctx.fillStyle = legCol;
    ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(4, -7); ctx.lineTo(0, -2); ctx.lineTo(-4, -7); ctx.closePath(); ctx.fill();

    drawGlossyCircle(ctx, 0, 6, 12, flash ? '#ffffff' : '#3c096c');
    drawCartoonEyes(ctx, e, -5, 5, 5, 3.8, '#ffbe0b', player, true);
    ctx.fillStyle = '#ff002b';
    ctx.beginPath(); ctx.arc(-3, 0, 1.8, 0, Math.PI * 2); ctx.arc(3, 0, 1.8, 0, Math.PI * 2); ctx.fill();
    drawFangedMouth(ctx, 11, 12, 4.5);
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 3 (ВАНИЛЬНО-ПАСТЕЛЬНЫЙ): ЛЕДЕНЕЦ, САХАРНАЯ ВАТА, ПОНЧИК, АРЛЕКИН ---
  if (e.kind === 'lollipop_ship') {
    e.wingCol = '#ffc2d1'; e.bodyCol = '#fff3d6';
    ctx.fillStyle = '#fff3d6'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -4, 6, 8, 22, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffafcc'; ctx.fillRect(-3, 11, 6, 4); ctx.fillRect(-3, 19, 6, 4);

    drawGlossyCircle(ctx, 0, -4, 18.5, flash ? '#ffffff' : '#ffafcc');
    ctx.strokeStyle = strobe ? '#fff3d6' : '#bde0fe';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let t = 0; t < 16; t++) {
      const a = t * 0.55 + e.phase * 2, r = t * 0.95;
      if (t === 0) ctx.moveTo(0, -4); else ctx.lineTo(Math.cos(a) * r, -4 + Math.sin(a) * r);
    }
    ctx.stroke();
    drawCartoonEyes(ctx, e, -6, 6, -6, 4.2, '#9d4edd', player, true);
    drawFangedMouth(ctx, 2, 14, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -24);
    ctx.restore(); return;
  }

  if (e.kind === 'cotton_candy') {
    e.wingCol = '#ffc2d1'; e.bodyCol = '#fff3d6';
    ctx.fillStyle = '#f3d5b5'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(8, 6); ctx.lineTo(0, 24); ctx.closePath(); ctx.fill(); ctx.stroke();

    const puffs = [[-11, 0, 11], [11, 0, 11], [-8, -11, 11], [8, -11, 11], [0, -14, 12], [0, -3, 14]];
    puffs.forEach(([px, py, pr], idx) => {
      const col = idx % 2 === 0 ? '#ffc2d1' : '#fff3d6';
      ctx.fillStyle = flash ? '#ffffff' : col;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = '#bde0fe';
    ctx.beginPath(); ctx.arc(-10, -12, 2.2, 0, Math.PI * 2); ctx.arc(11, -10, 2.2, 0, Math.PI * 2); ctx.fill();

    drawCartoonEyes(ctx, e, -6, 6, -5, 4.2, '#f72585', player, true);
    drawFangedMouth(ctx, 2, 13, 5);
    if (e.isElite) drawEliteCrown(ctx, -26);
    ctx.restore(); return;
  }

  if (e.kind === 'mini_donut') {
    e.wingCol = '#ffc2d1'; e.bodyCol = '#f3d5b5';
    drawGlossyCircle(ctx, 0, 0, 19, flash ? '#ffffff' : '#f3d5b5');
    ctx.fillStyle = flash ? '#ffffff' : (strobe ? '#ffc2d1' : '#ffccd5');
    ctx.beginPath(); ctx.arc(0, 0, 15.5, 0, Math.PI * 2); ctx.fill();
    const spCols = ['#fff3d6', '#bde0fe', '#d8f3dc', '#e0c3fc'];
    for (let k = 0; k < 8; k++) {
      const a = (Math.PI * 2 * k) / 8 + e.phase;
      ctx.fillStyle = spCols[k % spCols.length];
      ctx.fillRect(Math.cos(a) * 11 - 2, Math.sin(a) * 11 - 1.5, 4, 3);
    }
    ctx.fillStyle = '#4a3563'; ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill();
    drawCartoonEyes(ctx, e, -7, 7, -4, 4, '#5a189a', player, true);
    if (e.isElite) drawEliteCrown(ctx, -21);
    ctx.restore(); return;
  }

  if (e.kind === 'clown_ship') {
    e.wingCol = '#bde0fe'; e.bodyCol = '#fff3d6';
    ctx.fillStyle = '#fff3d6'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.ellipse(0, 12, 19, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = strobe ? '#ffc2d1' : '#bde0fe';
    ctx.beginPath(); ctx.arc(-17, -7, 6.5, 0, Math.PI * 2); ctx.arc(17, -7, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawGlossyCircle(ctx, 0, -1, 15.5, flash ? '#ffffff' : '#fff8eb');
    drawCartoonEyes(ctx, e, -6, 6, -4, 4.1, '#7209b7', player, true);
    ctx.fillStyle = strobe ? '#ffafcc' : '#f72585';
    ctx.beginPath(); ctx.arc(0, 2, 4.8, 0, Math.PI * 2); ctx.fill();
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 4: ОСЬМИНОГИ, МЕДУЗЫ, КАЛЬМАРЫ, КРАБЫ ---
  if (e.kind === 'octopus_ship') {
    const octCol = flash ? '#ffffff' : '#7209b7';
    const spotCol = strobe ? '#00f5d4' : '#ff70a6';
    e.wingCol = octCol; e.bodyCol = spotCol;

    ctx.strokeStyle = octCol; ctx.lineWidth = 4.5;
    for (let k = -2.5; k <= 2.5; k += 1) {
      const w = Math.sin(e.phase * 5 + k * 1.4) * 6;
      ctx.beginPath();
      ctx.moveTo(k * 4.5, 6);
      ctx.quadraticCurveTo(k * 6 + w, 17, k * 7.5 - w * 0.5, 27);
      ctx.stroke();
      ctx.fillStyle = spotCol;
      ctx.beginPath(); ctx.arc(k * 6 + w * 0.6, 17, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    drawGlossyCircle(ctx, 0, -4, 16.5, octCol);
    ctx.fillStyle = spotCol;
    ctx.beginPath(); ctx.arc(-8, -12, 3, 0, Math.PI * 2); ctx.arc(8, -12, 3, 0, Math.PI * 2); ctx.fill();
    drawCartoonEyes(ctx, e, -6, 6, -2, 4.4, '#00f5d4', player, true);
    if (e.isElite) drawEliteCrown(ctx, -22);
    ctx.restore(); return;
  }

  if (e.kind === 'jellyfish_ocean') {
    const jCol = flash ? '#ffffff' : '#00b4d8';
    const tentCol = strobe ? '#ff70a6' : '#9bf6ff';
    e.wingCol = jCol; e.bodyCol = tentCol;

    ctx.strokeStyle = tentCol; ctx.lineWidth = 2.8;
    for (let k = -2; k <= 2; k++) {
      const w = Math.sin(e.phase * 6 + k * 1.6) * 7;
      ctx.beginPath(); ctx.moveTo(k * 5, 4); ctx.bezierCurveTo(k * 5 + w, 13, k * 5 - w, 21, k * 5 + w * 0.5, 29); ctx.stroke();
    }
    ctx.fillStyle = jCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.arc(0, 2, 18, Math.PI, 0); ctx.quadraticCurveTo(18, 8, 0, 6); ctx.quadraticCurveTo(-18, 8, -18, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    drawCartoonEyes(ctx, e, -6, 6, -4, 4.1, '#ff006e', player, true);
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }

  if (e.kind === 'squid_ship') {
    const sqCol = flash ? '#ffffff' : '#f72585';
    e.wingCol = sqCol; e.bodyCol = '#4cc9f0';

    ctx.strokeStyle = '#4cc9f0'; ctx.lineWidth = 3.2;
    [-10, 10].forEach((sx, idx) => {
      const w = Math.sin(e.phase * 6 + idx * 2) * 6;
      ctx.beginPath(); ctx.moveTo(sx * 0.6, 8); ctx.quadraticCurveTo(sx + w, 19, sx * 1.2, 29); ctx.stroke();
    });
    ctx.fillStyle = sqCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -24); ctx.lineTo(18, -8); ctx.lineTo(10, -4); ctx.lineTo(11, 10); ctx.lineTo(-11, 10); ctx.lineTo(-10, -4); ctx.lineTo(-18, -8);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    drawCartoonEyes(ctx, e, -5.5, 5.5, 2, 4.2, '#ffee33', player, true);
    if (e.isElite) drawEliteCrown(ctx, -25);
    ctx.restore(); return;
  }

  if (e.kind === 'crab_ship') {
    const crCol = flash ? '#ffffff' : '#ff5964';
    e.wingCol = crCol; e.bodyCol = '#ffd166';
    [-16, 16].forEach(cx => {
      ctx.fillStyle = crCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(cx, -12, 7.5, 0.2 * Math.PI, 1.8 * Math.PI); ctx.lineTo(cx, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    drawGlossyCircle(ctx, 0, 2, 16.5, crCol);
    drawCartoonEyes(ctx, e, -6, 6, 0, 4.3, '#14213d', player, true);
    drawFangedMouth(ctx, 8, 14, 5);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 5: ЗЛОБНЫЕ ЛИАНЫ, РОСТКИ И ХИЩНЫЕ ЦВЕТКИ ---
  if (e.kind === 'vine_beast') {
    const vCol = flash ? '#ffffff' : '#38b000';
    const thornCol = strobe ? '#ffee33' : '#ff006e';
    e.wingCol = vCol; e.bodyCol = thornCol;

    ctx.strokeStyle = vCol; ctx.lineWidth = 5;
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI * 2 * k) / 6 + e.phase * 1.4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.quadraticCurveTo(Math.cos(a + 0.5) * 20, Math.sin(a + 0.5) * 20, Math.cos(a) * 26, Math.sin(a) * 26);
      ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 15, flash ? '#ffffff' : '#1b4332');
    drawCartoonEyes(ctx, e, -5.5, 5.5, -3, 4.1, thornCol, player, true);
    drawFangedMouth(ctx, 4.5, 15, 6);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  if (e.kind === 'sprout_hunter') {
    const spCol = flash ? '#ffffff' : '#70e000';
    e.wingCol = spCol; e.bodyCol = '#ff006e';
    ctx.strokeStyle = '#38b000'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(0, 8); ctx.quadraticCurveTo(Math.sin(e.phase * 5) * 8, 18, 0, 26); ctx.stroke();

    [-1, 1].forEach(side => {
      ctx.fillStyle = spCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(side * 16, -16, side * 24, -2); ctx.quadraticCurveTo(side * 14, 6, 0, 4); ctx.fill(); ctx.stroke();
    });
    drawGlossyCircle(ctx, 0, -2, 14.5, flash ? '#ffffff' : '#ff006e');
    drawCartoonEyes(ctx, e, -5.5, 5.5, -4, 4, '#ccff33', player, true);
    drawFangedMouth(ctx, 3.5, 14, 6);
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }

  if (e.kind === 'mini_flower' || e.kind === 'starfish_ship') {
    const fCol = flash ? '#ffffff' : (strobe ? '#ff006e' : '#ccff33');
    e.wingCol = fCol; e.bodyCol = '#38b000';
    for (let k = 0; k < 5; k++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.fillStyle = fCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(18, -7); ctx.lineTo(25, 0); ctx.lineTo(18, 7); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 13.5, flash ? '#ffffff' : '#2d6a4f');
    drawCartoonEyes(ctx, e, -5, 5, -2, 4, '#ffee33', player, true);
    drawFangedMouth(ctx, 4.5, 13, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -18);
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 6: ГРИБЫ СО ЩУПАЛЬЦАМИ, ЗЛОБНЫЕ МУХОМОРЫ, ПСИХО-ГРИБЫ ---
  if (e.kind === 'tentacle_shroom') {
    const capCol = flash ? '#ffffff' : `hsl(${hue}, 100%, 58%)`;
    const tentCol = strobe ? '#00f5d4' : '#ffbe0b';
    e.wingCol = capCol; e.bodyCol = tentCol;

    ctx.strokeStyle = tentCol; ctx.lineWidth = 3.8;
    for (let k = -2.5; k <= 2.5; k += 1) {
      const w = Math.sin(e.phase * 6 + k * 1.5) * 6;
      ctx.beginPath(); ctx.moveTo(k * 4.5, 2); ctx.quadraticCurveTo(k * 6 + w, 15, k * 7.5 - w * 0.5, 26); ctx.stroke();
    }
    ctx.fillStyle = capCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.arc(0, 2, 20, Math.PI, 0); ctx.quadraticCurveTo(20, 8, 0, 6); ctx.quadraticCurveTo(-20, 8, -20, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    drawCartoonEyes(ctx, e, -6, 6, -4, 4.2, '#14052b', player, true);
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  const capCol = e.kind === 'psy_mushroom' ? `hsl(${hue}, 100%, 56%)` : (strobe ? '#ff002b' : '#d90429');
  e.wingCol = capCol; e.bodyCol = '#fff8eb';
  const breathe = 1 + Math.sin(e.phase * 4.5) * 0.06;
  ctx.scale(breathe, 2 - breathe);

  ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
  roundRectPath(ctx, -8.5, 0, 17, 21, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd6a5'; ctx.fillRect(-10, 6, 20, 3.5);

  ctx.fillStyle = flash ? '#ffffff' : capCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.8;
  ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.quadraticCurveTo(22, 9, 0, 7); ctx.quadraticCurveTo(-22, 9, -21, 2); ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  [[-10, -8, 3.5], [10, -7, 3.3], [0, -13, 4.2]].forEach(([sx, sy, sr]) => { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
  drawCartoonEyes(ctx, e, -5.5, 5.5, 11, 4.1, '#ff006e', player, true);
  drawFangedMouth(ctx, 16.5, 12, 4.5);
  if (e.isElite) drawEliteCrown(ctx, -20);
  ctx.restore();
}

// =========================================================================
// 6 ДЕТАЛИЗИРОВАННЫХ БОССОВ С КОНЕЧНОСТЯМИ (УР. 3 — ВАНИЛЬНО-ПАСТЕЛЬНЫЙ)
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;

  if (b.laserState === 'charge') {
    ctx.save(); ctx.strokeStyle = 'rgba(255, 209, 102, 0.85)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    [-22 * bScale, 22 * bScale].forEach(ex => { ctx.beginPath(); ctx.moveTo(b.x + ex, b.y - 6); ctx.lineTo(b.laserX + ex * 0.6, H); ctx.stroke(); });
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [-22 * bScale, 22 * bScale].forEach((ex, idx) => {
      const startX = b.x + ex, startY = b.y - 6, endX = b.laserX + ex * 0.6;
      ctx.strokeStyle = `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 64%)`; ctx.lineWidth = 22 * bScale; ctx.globalAlpha = 0.44;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6 * bScale; ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
    });
    ctx.restore();
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.scale(bScale, bScale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;
  const hue = Math.floor((b.time * 130) % 360);
  const strobe = Math.sin(b.time * 11) > 0;

  // 1. БОСС УР. 1 — ЗЛОБНАЯ АРХИ-МАРКА С 4 КОНЕЧНОСТЯМИ-МАНИПУЛЯТОРАМИ
  if (lvl.id === 1) {
    for (let side of [-1, 1]) {
      [-24, 22].forEach((ay, idx) => {
        const swing = Math.sin(b.time * 5 + idx * 1.5 + side) * 14;
        ctx.strokeStyle = strobe ? '#00f5d4' : '#ff006e';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(side * 56, ay);
        ctx.lineTo(side * 82, ay - 16 + swing);
        ctx.lineTo(side * 96, ay + 12 - swing);
        ctx.stroke();
        ctx.fillStyle = '#ffd166';
        ctx.beginPath(); ctx.arc(side * 96, ay + 12 - swing, 7, 0, Math.PI * 2); ctx.fill();
      });
    }

    const stampW = 122, stampH = 136, halfW = 61, halfH = 68;
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${hue}, 95%, 56%)`;
    ctx.strokeStyle = strobe ? '#ffffff' : '#00f5d4';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(-halfW, -halfH);
    for (let i = 0; i < 8; i++) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, -halfH, 4.5, Math.PI, 0, true);
    ctx.lineTo(halfW, -halfH);
    for (let i = 0; i < 9; i++) ctx.arc(halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(halfW, halfH);
    for (let i = 7; i >= 0; i--) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, halfH, 4.5, 0, Math.PI, true);
    ctx.lineTo(-halfW, halfH);
    for (let i = 8; i >= 0; i--) ctx.arc(-halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#120426'; roundRectPath(ctx, -halfW + 11, -halfH + 11, stampW - 22, stampH - 22, 8); ctx.fill();
    ctx.save(); ctx.rotate(b.time * 4.5);
    ctx.strokeStyle = `hsl(${(hue + 90) % 360}, 100%, 62%)`; ctx.lineWidth = 4; ctx.beginPath();
    for (let t = 0; t < 38; t++) { const ang = t * 0.45, rad = t * 1.25; if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); }
    ctx.stroke(); ctx.restore();

    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.arc(ex, -14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff006e'; ctx.beginPath(); ctx.arc(ex + lookX, -13, 7.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ff002b'; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(ex - (idx === 0 ? 14 : -14), -29); ctx.lineTo(ex + (idx === 0 ? 12 : -12), -21); ctx.stroke();
    });
    drawFangedMouth(ctx, 18, 56, 22);
    ctx.restore(); return;
  }

  // 2. БОСС УР. 2 — МЕКСИКАНСКИЙ ЧЕРЕП-ПАУК С 8 СУСТАВЧАТЫМИ ЛАПАМИ
  if (lvl.id === 2) {
    const legCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const wave = Math.sin(b.time * 7 + l * 1.4) * 12, baseY = -14 + l * 12;
        ctx.strokeStyle = strobe ? '#ffffff' : legCols[l];
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(side * 42, baseY); ctx.lineTo(side * 76, baseY - 24 + wave); ctx.lineTo(side * 96, baseY + 26 - wave); ctx.stroke();
      }
    }
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff002b'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, -14, 52, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(26, 52); ctx.lineTo(-26, 52); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(0, -42, 10, 0, Math.PI * 2); ctx.fill();
    [-21, 21].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#3a86ff'; ctx.beginPath(); ctx.arc(ex, -6, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#090206'; ctx.beginPath(); ctx.arc(ex, -6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 26, 46, 20);
    ctx.restore(); return;
  }

  // 3. БОСС УР. 3 — ВАНИЛЬНО-ПАСТЕЛЬНЫЙ ВКУСНЯШ С РУКАМИ И НОГАМИ
  if (lvl.id === 3) {
    [-26, 26].forEach((lx, idx) => {
      const step = Math.sin(b.time * 7 + idx * Math.PI) * 10;
      ctx.strokeStyle = '#fff3d6'; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(lx, 46); ctx.lineTo(lx * 1.15, 74 + step); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#ffc2d1' : '#bde0fe'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      roundRectPath(ctx, lx * 1.15 - 14, 68 + step, 28, 15, 7); ctx.fill(); ctx.stroke();
    });

    [-1, 1].forEach(side => {
      const armWave = Math.sin(b.time * 6 + side) * 16;
      ctx.strokeStyle = '#e0c3fc'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(side * 52, 4); ctx.quadraticCurveTo(side * 82, -16 + armWave, side * 92, 16 - armWave); ctx.stroke();
      ctx.fillStyle = '#fff3d6'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(side * 92, 16 - armWave, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    ctx.fillStyle = '#bde0fe'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    roundRectPath(ctx, -7, -76, 14, 22, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = strobe ? '#fff3d6' : '#ffc2d1';
    ctx.beginPath(); ctx.arc(0, -84, 9, 0, Math.PI * 2); ctx.fill();

    const bodyPastel = flash ? '#ffffff' : (strobe ? '#ffc2d1' : '#ffccd5');
    ctx.fillStyle = '#f3d5b5'; ctx.strokeStyle = INK; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = bodyPastel;
    ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();

    // Ванильные кремовые волны сверху
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath(); ctx.arc(0, -8, 42, Math.PI, 0); ctx.fill();

    [-21, 21].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, -12, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#9d4edd'; ctx.beginPath(); ctx.arc(ex + lookX, -11, 6, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 12, 44, 18);
    ctx.restore(); return;
  }

  // 4. БОСС УР. 4 — ПСИХОДЕЛИЧЕСКИЙ ОСЬМИНОГ С 8 ЩУПАЛЬЦАМИ И ПРИСОСКАМИ
  if (lvl.id === 4) {
    const seaHue = (b.time * 125) % 360;
    for (let i = 0; i < 8; i++) {
      const t = i - 3.5, waveX = Math.sin(b.time * 5.5 + i * 0.9) * 18;
      const tCol = `hsl(${(seaHue + i * 42) % 360}, 98%, 66%)`;
      ctx.strokeStyle = tCol; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(t * 14, 22); ctx.quadraticCurveTo(t * 18 + waveX, 56, t * 22 - waveX * 0.5, 84); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(t * 17 + waveX * 0.6, 52, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${seaHue}, 94%, 64%)`;
    ctx.strokeStyle = strobe ? '#ffffff' : '#9bf6ff';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, -4, 54, Math.PI, 0); ctx.quadraticCurveTo(58, 32, 0, 34); ctx.quadraticCurveTo(-58, 32, -54, -4); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffee33'; ctx.beginPath(); ctx.arc(0, -30, 8, 0, Math.PI * 2); ctx.fill();
    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, -8, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#03045e'; ctx.beginPath(); ctx.arc(ex + lookX, -7, 6, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 12, 42, 16);
    ctx.restore(); return;
  }

  // 5. БОСС УР. 5 — ПОДСОЛНУХ СО ЩУПАЛЬЦАМИ-ЛИАНАМИ
  if (lvl.id === 5) {
    for (let v = 0; v < 6; v++) {
      const t = v - 2.5, whipX = Math.sin(b.time * 5 + v * 1.2) * 30;
      ctx.strokeStyle = v % 2 === 0 ? '#38b000' : '#ccff33';
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(t * 18, 22); ctx.bezierCurveTo(t * 28 + whipX, 55, t * 18 - whipX, 82, t * 28 + whipX * 0.6, 102); ctx.stroke();
    }
    ctx.save(); ctx.rotate(b.time * 0.6);
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.fillStyle = (i + (strobe ? 1 : 0)) % 2 === 0 ? '#ffd166' : '#ff9f1c';
      ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(0, 32); ctx.quadraticCurveTo(14, 60, 0, 76); ctx.quadraticCurveTo(-14, 60, 0, 32); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = flash ? '#ffffff' : '#3d1e05'; ctx.strokeStyle = strobe ? '#ffffff' : '#80ed99'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [-16, 16].forEach(ex => {
      ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(ex, -10, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, -10, 5, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 10, 42, 18);
    ctx.restore(); return;
  }

  // 6. БОСС УР. 6 — ПОЛУ-МУХОМОР, ПОЛУ-СКОЛОПЕНДРА
  for (let seg = 4; seg >= 0; seg--) {
    const sy = 18 + seg * 15;
    const sx = Math.sin(b.time * 7 + seg * 0.9) * 14;
    const segCol = seg % 2 === 0 ? '#7209b7' : '#ff006e';

    for (let side of [-1, 1]) {
      const legKick = Math.sin(b.time * 12 + seg * 1.3 + side) * 9;
      ctx.strokeStyle = strobe ? '#ffee33' : '#00f5d4';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(sx + side * 14, sy);
      ctx.lineTo(sx + side * 34, sy - 6 + legKick);
      ctx.lineTo(sx + side * 42, sy + 10 - legKick);
      ctx.stroke();
    }

    ctx.fillStyle = flash ? '#ffffff' : segCol;
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.ellipse(sx, sy, 22 - seg * 1.5, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  const capCol = flash ? '#ffffff' : (strobe ? '#ff002b' : `hsl(${hue}, 100%, 54%)`);
  ctx.fillStyle = capCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.arc(0, 2, 66, Math.PI, 0); ctx.quadraticCurveTo(70, 20, 0, 14); ctx.quadraticCurveTo(-70, 20, -66, 2); ctx.closePath(); ctx.fill(); ctx.stroke();

  [[-36, -24, 9], [36, -24, 9], [0, -44, 11], [-18, -36, 6], [18, -36, 6]].forEach(([sx, sy, sr]) => {
    ctx.fillStyle = strobe ? '#ffee33' : '#ffffff';
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  });

  [-17, 17].forEach(ex => {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.arc(ex, 16, 10.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, 16, 4.8, 0, Math.PI * 2); ctx.fill();
  });
  drawFangedMouth(ctx, 30, 38, 15);
  ctx.restore();
}
