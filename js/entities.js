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
    story: 'Стреляй в Призмы-Калейдоскопы для веера из 5 лучей! Главный босс — Крылатая Марка Хофмана!',
    enemiesDesc: 'Злобные Марки, Психо-Подсолнухи и Кубики Рубика',
    midBossName: 'Крылатый Глаз-Штемпель',
    bossName: 'Марка Хофмана «День Велосипеда»',
    theme: 'lsd',
    interactiveType: 'prism_kaleidoscope',
    enemyTypes: ['mini_stamp', 'sunflower_lsd', 'rubik_cube'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#f3c4fb', bossColor: '#bdb2ff', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Подрывай Тотемные Барабаны Фиесты для огненной волны! Главный босс — Некро-Паук с Марионетками!',
    enemiesDesc: 'Черепки Калавера, Психо-Мыши и Неоновые Пауки',
    midBossName: 'Костяной Нетопырь Калавера',
    bossName: 'Некро-Паук с Марионетками',
    theme: 'horror',
    interactiveType: 'fiesta_drum',
    enemyTypes: ['mini_skull', 'bat_ship', 'spider_ship', 'skeleton_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ffd6a5', bossColor: '#ffadad', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Ванильно-Пастельный Поток',
    story: 'Взрывай Зефирные Бомбы, чтобы превратить вражеские пули в сладкие конфеты! Босс — Торт-Левиафан!',
    enemiesDesc: 'Ванильные Леденцы, Сахарная Вата, Пончики и Арлекины',
    midBossName: 'Зубастый Зефирный Червь',
    bossName: 'Многоглазый Торт-Левиафан',
    theme: 'rainbow',
    interactiveType: 'marshmallow_bomb',
    enemyTypes: ['lollipop_ship', 'cotton_candy', 'mini_donut', 'clown_ship'],
    skyTop: '#4a3563', skyMid: '#7d5a8a', skyBot: '#d4a5b8',
    accent: '#fff3d6', bossColor: '#ffc2d1', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Подлетай или стреляй в Медуз-Генераторов для цепной аква-молнии! Главный босс — Кракен-Удильщик!',
    enemiesDesc: 'Осьминоги, Неоновые Медузы, Кальмары и Крабы',
    midBossName: 'Астральная Медуза-Гипнотизёр',
    bossName: 'Глубоководный Кракен-Удильщик',
    theme: 'underwater',
    interactiveType: 'jelly_generator',
    enemyTypes: ['octopus_ship', 'jellyfish_ocean', 'squid_ship', 'crab_ship'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#caf0f8', bossColor: '#90e0ef', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Раста-Туманность Джа-Космос',
    story: 'Врубай Космо-Бумбоксы Регги для замедления врагов и золотых нот! Главный босс — Мега-Лев Джа!',
    enemiesDesc: 'Барабаны Джембе, Психо-Хамелеоны и Раста-Солнца',
    midBossName: 'Дредастый Хамелеон-Гипнотизёр',
    bossName: 'Мега-Лев Джа с Дредами',
    theme: 'organic',
    interactiveType: 'reggae_boombox',
    enemyTypes: ['rasta_djembe', 'rasta_chameleon', 'rasta_sun'],
    skyTop: '#1f0c14', skyMid: '#2e2408', skyBot: '#0a331c',
    accent: '#ffd166', bossColor: '#06d6a0', hpMult: 2.05, coinReward: 1500
  },
  {
    id: 6,
    name: 'Грибная Галактика',
    story: 'Взрывай Споровые Мины-Дождевики для ядовитого облака! Главный босс — Владыка Мухомор-Сколопендра!',
    enemiesDesc: 'Грибы со Щупальцами, Злобные Мухоморы и Психо-Грибы',
    midBossName: 'Споровая Мини-Сколопендра',
    bossName: 'Владыка Мухомор-Сколопендра',
    theme: 'mushroom',
    interactiveType: 'spore_puffball',
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

function drawHempLeafShape(ctx, r, fillCol) {
  const angles = [-1.15, -0.75, -0.36, 0, 0.36, 0.75, 1.15];
  const lengths = [0.48, 0.72, 0.90, 1.12, 0.90, 0.72, 0.48];
  ctx.fillStyle = fillCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  angles.forEach((a, idx) => {
    ctx.save();
    ctx.rotate(a);
    const len = r * lengths[idx];
    const wid = len * 0.22;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-wid, -len * 0.55, 0, -len);
    ctx.quadraticCurveTo(wid, -len * 0.55, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  roundRectPath(ctx, -r * 0.06, 0, r * 0.12, r * 0.40, 2);
  ctx.fill();
  ctx.stroke();
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

// =========================================================================
// 6 НОВЫХ ИНТЕРАКТИВНЫХ ОБЪЕКТОВ СЕКТОРА (ВКЛЮЧАЯ КОСМО-БУМБОКС РЕГГИ)
// =========================================================================
function drawInteractiveProp(ctx, pr) {
  ctx.save();
  ctx.translate(pr.x, pr.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const pulse = 1 + Math.sin(pr.phase * 4) * 0.08;
  ctx.scale(pulse, pulse);

  if (pr.type === 'prism_kaleidoscope') {
    ctx.rotate(pr.phase * 1.6);
    const cols = ['#f3c4fb', '#bdb2ff', '#a0c4ff', '#fdffb6', '#ffc6ff'];
    for (let k = 0; k < 5; k++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.fillStyle = cols[k]; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, -7); ctx.lineTo(24, 0); ctx.lineTo(14, 7); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 9, '#ffffff');
  } else if (pr.type === 'fiesta_drum') {
    ctx.rotate(Math.sin(pr.phase * 3) * 0.18);
    ctx.fillStyle = '#ff006e'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -17, -14, 34, 28, 8); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-14, -8); ctx.lineTo(0, 8); ctx.lineTo(14, -8); ctx.stroke();
    ctx.fillStyle = '#fff8eb';
    ctx.beginPath(); ctx.ellipse(0, -14, 17, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (pr.type === 'marshmallow_bomb') {
    ctx.rotate(Math.sin(pr.phase * 2.5) * 0.2);
    ctx.fillStyle = '#ffc2d1'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -18, -16, 36, 32, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff3d6';
    roundRectPath(ctx, -12, -10, 24, 20, 8); ctx.fill();
    ctx.fillStyle = '#f72585'; ctx.font = '900 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🍬', 0, 1);
  } else if (pr.type === 'jelly_generator') {
    ctx.strokeStyle = '#caf0f8'; ctx.lineWidth = 2.6;
    for (let k = -1; k <= 1; k++) {
      const w = Math.sin(pr.phase * 6 + k) * 5;
      ctx.beginPath(); ctx.moveTo(k * 7, 4); ctx.quadraticCurveTo(k * 7 + w, 14, k * 7 - w, 24); ctx.stroke();
    }
    ctx.fillStyle = '#48cae4'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(0, 2, 18, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fee440'; ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('⚡', 0, -4);
  } else if (pr.type === 'reggae_boombox') {
    // Ур. 5 (Раста): Космо-Бумбокс Регги!
    ctx.rotate(Math.sin(pr.phase * 3.5) * 0.14);
    // Ручка сверху
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-12, -20); ctx.lineTo(12, -20); ctx.lineTo(12, -12); ctx.stroke();
    // Корпус бумбокса в цветах раста
    ctx.fillStyle = '#06d6a0'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -22, -12, 44, 26, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-20, -10, 40, 6);
    ctx.fillStyle = '#ffd166'; ctx.fillRect(-20, -4, 40, 5);
    // Два басовых динамика
    [-12, 12].forEach(sx => {
      ctx.fillStyle = '#14052b'; ctx.beginPath(); ctx.arc(sx, 4, 7.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 1.6; ctx.stroke();
    });
  } else if (pr.type === 'spore_puffball') {
    ctx.fillStyle = 'rgba(224, 170, 255, 0.28)';
    ctx.beginPath(); ctx.arc(0, 0, pr.r + 7, 0, Math.PI * 2); ctx.fill();
    drawGlossyCircle(ctx, 0, 0, 17, '#9d4edd');
    ctx.fillStyle = '#ccff33';
    [[-6, -5], [6, -4], [0, 6], [-5, 4], [5, 5]].forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 2.4, 0, Math.PI * 2); ctx.fill();
    });
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
// 18 УНИКАЛЬНЫХ МИГАЮЩИХ ПРЕПЯТСТВИЙ (УР. 5 — РАСТАМАНСКИЕ)
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

  // Ур. 1
  if (ob.shape === 'om_star') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = blinkCol2; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 26, Math.sin(a) * 26);
      ctx.lineTo(Math.cos(a + Math.PI / 6) * 14, Math.sin(a + Math.PI / 6) * 14);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    drawGlossyCircle(ctx, 0, 0, 14, '#1b0933');
    ctx.fillStyle = blinkCol; ctx.font = 'bold 19px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', 0, 1);
    ctx.restore(); return;
  }

  if (ob.shape === 'hippie_peace') {
    ctx.rotate(Math.sin(ph * 2.2) * 0.35);
    drawGlossyCircle(ctx, 0, 0, 23, strobe ? '#ff70a6' : '#00f5d4');
    ctx.strokeStyle = INK; ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.moveTo(0, -18); ctx.lineTo(0, 18);
    ctx.moveTo(0, 0);   ctx.lineTo(-12.5, 12.5);
    ctx.moveTo(0, 0);   ctx.lineTo(12.5, 12.5);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore(); return;
  }

  if (ob.shape === 'spinning_mandala') {
    ctx.rotate(ob.rot || 0);
    for (let ring = 2; ring >= 0; ring--) {
      const rOuter = 10 + ring * 7.5;
      ctx.fillStyle = ring % 2 === 0 ? blinkCol : blinkCol2;
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      for (let k = 0; k < 8; k++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath(); ctx.ellipse(rOuter * 0.65, 0, rOuter * 0.45, rOuter * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
    drawGlossyCircle(ctx, 0, 0, 7, '#ffd166');
    ctx.restore(); return;
  }

  // Ур. 2
  if (ob.shape === 'mexican_skull_bones') {
    ctx.rotate(Math.sin(ph * 2.5) * 0.22);
    ctx.strokeStyle = strobe ? '#ffbe0b' : '#ffffff'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-23, -21); ctx.lineTo(23, 21); ctx.moveTo(23, -21); ctx.lineTo(-23, 21); ctx.stroke();
    ctx.fillStyle = '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, -4, 15, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(9, 15); ctx.lineTo(-9, 15); ctx.closePath(); ctx.fill(); ctx.stroke();
    [-5.5, 5.5].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff002b' : '#06d6a0';
      ctx.beginPath(); ctx.arc(ex, -3, 4.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex, -3, 2.2, 0, Math.PI * 2); ctx.fill();
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
    ctx.fillStyle = c1; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -14, -4, 26, 14, 5); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, 4, -17, 13, 15, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c2;
    roundRectPath(ctx, 5, -26, 4, 10, 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, 11, -26, 4, 10, 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, -12, 9, 5, 11, 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, 5, 9, 5, 11, 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(12, -12, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(12.5, -12, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'blinking_sombrero') {
    ctx.rotate(Math.sin(ph * 3) * 0.22);
    const hatCol = strobe ? '#ffbe0b' : '#ff006e';
    const trimCol = strobe ? '#06d6a0' : '#3a86ff';
    ctx.fillStyle = hatCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-11, 4); ctx.quadraticCurveTo(-9, -22, 0, -22); ctx.quadraticCurveTo(9, -22, 11, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = trimCol; ctx.beginPath(); ctx.ellipse(0, 6, 26, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [-20, -10, 0, 10, 20].forEach((px, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffee33' : '#ffffff';
      ctx.beginPath(); ctx.arc(px, 12, 2.6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore(); return;
  }

  // Ур. 3
  if (ob.shape === 'cotton_candy_storm') {
    const puffs = [[-12, -2, 11], [12, -2, 11], [-6, -10, 12], [7, -9, 11], [0, -1, 13]];
    puffs.forEach(([px, py, pr], idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffc2d1' : '#ffe5ec';
      ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    if (strobe) {
      ctx.strokeStyle = '#fff3b0'; ctx.lineWidth = 3;
      [-8, 8].forEach(lx => {
        ctx.beginPath(); ctx.moveTo(lx, 7); ctx.lineTo(lx - 4, 15); ctx.lineTo(lx + 2, 15); ctx.lineTo(lx - 2, 24); ctx.stroke();
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
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(17, -7); ctx.lineTo(25, 0); ctx.lineTo(17, 7); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 0, 8, '#fff3d6');
    ctx.restore(); return;
  }

  // Ур. 4
  if (ob.shape === 'moving_seaweed') {
    for (let t = -2; t <= 2; t++) {
      const sway = Math.sin(ph * 4.5 + t * 1.4) * 11;
      ctx.strokeStyle = t % 2 === 0 ? '#06d6a0' : '#9bf6ff'; ctx.lineWidth = 5.5;
      ctx.beginPath(); ctx.moveTo(t * 4, 18); ctx.bezierCurveTo(t * 7 - sway, 4, t * 9 + sway, -10, t * 10 + sway, -22); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, 16, 11, '#0077b6');
    ctx.restore(); return;
  }

  if (ob.shape === 'spiral_seashell') {
    ctx.rotate(Math.sin(ph * 2.5) * 0.25);
    ctx.fillStyle = strobe ? '#ffccd5' : '#caf0f8'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.lineTo(12, 18); ctx.lineTo(-12, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 2;
    [-10, -4, 4, 10].forEach(rx => { ctx.beginPath(); ctx.moveTo(0, 16); ctx.lineTo(rx * 1.4, -14); ctx.stroke(); });
    ctx.restore(); return;
  }

  if (ob.shape === 'pink_corals') {
    const coralCol = strobe ? '#ff85a1' : '#ff70a6';
    ctx.strokeStyle = coralCol; ctx.lineWidth = 7;
    [[-16, -16], [-6, -24], [6, -23], [16, -15]].forEach(([bx, by]) => {
      ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(bx * 0.4, 2, bx, by); ctx.stroke();
      ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    drawGlossyCircle(ctx, 0, 16, 10, '#c9184a');
    ctx.restore(); return;
  }

  // --- УРОВЕНЬ 5 (РАСТАМАНСКИЙ): 1) 7-листник конопли, 2) Винил-пластинка регги, 3) Раста-солнце в очках ---
  if (ob.shape === 'rasta_hemp_leaf') {
    ctx.rotate(Math.sin(ph * 3) * 0.28);
    ctx.translate(0, 10);
    const leafCol = strobe ? '#06d6a0' : '#ffd166';
    drawHempLeafShape(ctx, 24, leafCol);
    ctx.restore(); return;
  }

  if (ob.shape === 'reggae_vinyl') {
    ctx.rotate(ob.rot || 0);
    drawGlossyCircle(ctx, 0, 0, 23, '#14052b');
    ctx.strokeStyle = '#4a4e69'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.stroke();
    // Красно-жёлто-зелёное яблоко пластинки
    ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#06d6a0'; ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'rasta_sun_shades') {
    const rayCols = ['#ff4d6d', '#ffd166', '#06d6a0'];
    for (let k = 0; k < 9; k++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * k) / 9 + ph * 0.6);
      ctx.fillStyle = rayCols[(k + (strobe ? 1 : 0)) % 3];
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(14, -4); ctx.lineTo(25, 0); ctx.lineTo(14, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    drawGlossyCircle(ctx, 0, 0, 15, '#ffd166');
    // Тёмные солнцезащитные очки
    ctx.fillStyle = '#120826';
    roundRectPath(ctx, -11, -5, 9, 6, 2); ctx.fill();
    roundRectPath(ctx, 2, -5, 9, 6, 2); ctx.fill();
    ctx.fillRect(-3, -4, 6, 2);
    ctx.restore(); return;
  }

  // Ур. 6
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
    ctx.strokeStyle = blinkCol2; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(8, 11, -3, 22); ctx.stroke();
    ctx.fillStyle = blinkCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-20, 2); ctx.quadraticCurveTo(-16, -22, 0, -24); ctx.quadraticCurveTo(16, -22, 20, 2); ctx.quadraticCurveTo(0, 7, -20, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore(); return;
  }

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
// ДЕТАЛИЗИРОВАННЫЕ МИГАЮЩИЕ ВРАГИ (ВКЛЮЧАЯ 3 РАСТА-ВРАГА УР. 5)
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

  // Ур. 1
  if (e.kind === 'mini_stamp') {
    const stampCol = flash ? '#ffffff' : `hsl(${hue}, 95%, 56%)`;
    e.wingCol = stampCol; e.bodyCol = '#14052b';
    ctx.fillStyle = stampCol; ctx.strokeStyle = neonRim; ctx.lineWidth = 3;
    const w = 38, h = 44, hw = 19, hh = 22;
    ctx.beginPath(); ctx.moveTo(-hw, -hh);
    for (let i = 0; i < 4; i++) ctx.arc(-hw + (w * (i + 0.5)) / 4, -hh, 2.3, Math.PI, 0, true);
    ctx.lineTo(hw, -hh);
    for (let i = 0; i < 5; i++) ctx.arc(hw, -hh + (h * (i + 0.5)) / 5, 2.3, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(hw, hh);
    for (let i = 3; i >= 0; i--) ctx.arc(-hw + (w * (i + 0.5)) / 4, hh, 2.3, 0, Math.PI, true);
    ctx.lineTo(-hw, hh);
    for (let i = 4; i >= 0; i--) ctx.arc(-hw, -hh + (h * (i + 0.5)) / 5, 2.3, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#120529'; roundRectPath(ctx, -14, -17, 28, 34, 4); ctx.fill();
    ctx.strokeStyle = `hsl(${(hue + 140) % 360}, 100%, 65%)`; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ffd166'; ctx.font = '900 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('666 ॐ', 0, -10);
    drawCartoonEyes(ctx, e, -6.5, 6.5, -1, 4.3, '#ff006e', player, true);
    drawFangedMouth(ctx, 7, 16, 6.5);
    if (e.isElite) drawEliteCrown(ctx, -24);
    ctx.restore(); return;
  }

  if (e.kind === 'sunflower_lsd' || e.kind === 'fractal_ship') {
    const petalCol = flash ? '#ffffff' : (strobe ? '#ffd166' : '#ff9f1c');
    const innerPetal = `hsl(${hue}, 100%, 62%)`;
    e.wingCol = petalCol; e.bodyCol = '#3d1e05';
    ctx.save(); ctx.rotate(Math.sin(e.phase * 2) * 0.25);
    for (let k = 0; k < 12; k++) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = k % 2 === 0 ? petalCol : innerPetal; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(10, 0); ctx.quadraticCurveTo(21, -5.5, 27, 0); ctx.quadraticCurveTo(21, 5.5, 10, 0); ctx.fill(); ctx.stroke();
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

  // Ур. 2
  if (e.kind === 'mini_skull' || e.kind === 'skeleton_ship') {
    e.wingCol = '#ff006e'; e.bodyCol = '#fff8eb';
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff006e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -4, 17, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(10, 17); ctx.lineTo(-10, 17); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = strobe ? '#06d6a0' : '#ff006e'; ctx.beginPath(); ctx.arc(0, -13, 4, 0, Math.PI * 2); ctx.fill();
    [-6.5, 6.5].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff002b' : '#06d6a0'; ctx.beginPath(); ctx.arc(ex, -2, 5.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex, -2, 3.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(ex, -2, 1.8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(-7, 12); ctx.lineTo(7, 12); [-4, 0, 4].forEach(tx => { ctx.moveTo(tx, 9.5); ctx.lineTo(tx, 15); }); ctx.stroke();
    if (e.isElite) drawEliteCrown(ctx, -22);
    ctx.restore(); return;
  }

  if (e.kind === 'bat_ship') {
    const flap = Math.sin(e.phase * 5.5) * 8;
    const batCol = flash ? '#ffffff' : '#3a0ca3';
    e.wingCol = batCol; e.bodyCol = '#7209b7';
    ctx.fillStyle = batCol; ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff006e'; ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(-16, -18 + flap * 0.4); ctx.lineTo(-32, -8 + flap); ctx.lineTo(-24, 4 + flap * 0.7); ctx.lineTo(-17, 11 + flap * 0.4);
    ctx.lineTo(-9, 8); ctx.lineTo(0, 14); ctx.lineTo(9, 8); ctx.lineTo(17, 11 + flap * 0.4); ctx.lineTo(24, 4 + flap * 0.7); ctx.lineTo(32, -8 + flap); ctx.lineTo(16, -18 + flap * 0.4);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    drawGlossyCircle(ctx, 0, -1, 11, flash ? '#ffffff' : '#7209b7');
    drawCartoonEyes(ctx, e, -4.5, 4.5, -2, 3.6, '#ffbe0b', player, true);
    drawFangedMouth(ctx, 4, 11, 5);
    if (e.isElite) drawEliteCrown(ctx, -23);
    ctx.restore(); return;
  }

  if (e.kind === 'spider_ship') {
    const legCol = strobe ? '#06d6a0' : '#ff002b';
    e.wingCol = legCol; e.bodyCol = '#14052b';
    ctx.strokeStyle = legCol; ctx.lineWidth = 3;
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const w = Math.sin(e.phase * 7 + l * 1.4) * 5, y0 = -6 + l * 4.5;
        ctx.beginPath(); ctx.moveTo(side * 9, y0); ctx.lineTo(side * 22, y0 - 8 + w); ctx.lineTo(side * 29, y0 + 8 - w); ctx.stroke();
      }
    }
    drawGlossyCircle(ctx, 0, -7, 11, flash ? '#ffffff' : '#240046');
    drawGlossyCircle(ctx, 0, 6, 12, flash ? '#ffffff' : '#3c096c');
    drawCartoonEyes(ctx, e, -5, 5, 5, 3.8, '#ffbe0b', player, true);
    drawFangedMouth(ctx, 11, 12, 4.5);
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  // Ур. 3
  if (e.kind === 'lollipop_ship') {
    e.wingCol = '#ffc2d1'; e.bodyCol = '#fff3d6';
    ctx.fillStyle = '#fff3d6'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -4, 6, 8, 22, 4); ctx.fill(); ctx.stroke();
    drawGlossyCircle(ctx, 0, -4, 18.5, flash ? '#ffffff' : '#ffafcc');
    ctx.strokeStyle = strobe ? '#fff3d6' : '#bde0fe'; ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let t = 0; t < 16; t++) { const a = t * 0.55 + e.phase * 2, r = t * 0.95; if (t === 0) ctx.moveTo(0, -4); else ctx.lineTo(Math.cos(a) * r, -4 + Math.sin(a) * r); }
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
    [[-11, 0, 11], [11, 0, 11], [-8, -11, 11], [8, -11, 11], [0, -14, 12], [0, -3, 14]].forEach(([px, py, pr], idx) => {
      ctx.fillStyle = flash ? '#ffffff' : (idx % 2 === 0 ? '#ffc2d1' : '#fff3d6');
      ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
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
    ctx.fillStyle = strobe ? '#ffafcc' : '#f72585'; ctx.beginPath(); ctx.arc(0, 2, 4.8, 0, Math.PI * 2); ctx.fill();
    if (e.isElite) drawEliteCrown(ctx, -19);
    ctx.restore(); return;
  }

  // Ур. 4
  if (e.kind === 'octopus_ship') {
    const octCol = flash ? '#ffffff' : '#7209b7';
    const spotCol = strobe ? '#00f5d4' : '#ff70a6';
    e.wingCol = octCol; e.bodyCol = spotCol;
    ctx.strokeStyle = octCol; ctx.lineWidth = 4.5;
    for (let k = -2.5; k <= 2.5; k += 1) {
      const w = Math.sin(e.phase * 5 + k * 1.4) * 6;
      ctx.beginPath(); ctx.moveTo(k * 4.5, 6); ctx.quadraticCurveTo(k * 6 + w, 17, k * 7.5 - w * 0.5, 27); ctx.stroke();
    }
    drawGlossyCircle(ctx, 0, -4, 16.5, octCol);
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
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(18, -8); ctx.lineTo(10, -4); ctx.lineTo(11, 10); ctx.lineTo(-11, 10); ctx.lineTo(-10, -4); ctx.lineTo(-18, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
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

  // --- УРОВЕНЬ 5 (РАСТАМАНСКИЙ): 1) Барабан Джембе в раста-шапке, 2) Психо-Хамелеон, 3) Раста-Солнце ---
  if (e.kind === 'rasta_djembe') {
    e.wingCol = '#ff4d6d'; e.bodyCol = '#ffd166';
    // Дреды по бокам барабана
    for (let side of [-1, 1]) {
      [-4, 4].forEach((dy, idx) => {
        const w = Math.sin(e.phase * 6 + idx + side) * 4;
        ctx.strokeStyle = idx === 0 ? '#ff4d6d' : '#06d6a0';
        ctx.lineWidth = 4.2;
        ctx.beginPath(); ctx.moveTo(side * 14, -6 + dy); ctx.quadraticCurveTo(side * 23, 6 + w, side * 20, 20 - w); ctx.stroke();
      });
    }
    // Корпус барабана джембе
    ctx.fillStyle = flash ? '#ffffff' : '#bc6c25';
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-14, -6); ctx.lineTo(14, -6); ctx.lineTo(8, 8); ctx.lineTo(11, 20); ctx.lineTo(-11, 20); ctx.lineTo(-8, 8);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Вязаная раста-шапка (красный, жёлтый, зелёный) сверху
    ctx.fillStyle = '#06d6a0'; ctx.beginPath(); ctx.arc(0, -10, 15, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd166'; ctx.fillRect(-15, -11, 30, 4);
    ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-15, -7, 30, 4);

    drawCartoonEyes(ctx, e, -5.5, 5.5, 1, 4, '#ffd166', player, true);
    drawFangedMouth(ctx, 9, 14, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -26);
    ctx.restore(); return;
  }

  if (e.kind === 'rasta_chameleon') {
    const rCols = ['#ff4d6d', '#ffd166', '#06d6a0'];
    const chCol = flash ? '#ffffff' : rCols[Math.floor(e.phase * 2.5) % 3];
    const chCol2 = rCols[(Math.floor(e.phase * 2.5) + 1) % 3];
    e.wingCol = chCol; e.bodyCol = chCol2;

    // Закрученный спиральный хвост снизу
    ctx.strokeStyle = chCol2; ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, 12); ctx.quadraticCurveTo(14, 24, 4, 28); ctx.quadraticCurveTo(-6, 28, -2, 21);
    ctx.stroke();

    // Зубчатый гребень на голове и тело хамелеона
    drawGlossyCircle(ctx, 0, -2, 16, chCol);
    ctx.fillStyle = chCol2;
    [-6, 0, 6].forEach(sx => {
      ctx.beginPath(); ctx.moveTo(sx - 3, -16); ctx.lineTo(sx, -24); ctx.lineTo(sx + 3, -16); ctx.closePath(); ctx.fill();
    });

    drawCartoonEyes(ctx, e, -7, 7, -3, 4.6, '#ff002b', player, true);
    drawFangedMouth(ctx, 5, 14, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -26);
    ctx.restore(); return;
  }

  if (e.kind === 'rasta_sun') {
    const rCols = ['#ff4d6d', '#ffd166', '#06d6a0'];
    e.wingCol = '#ffd166'; e.bodyCol = '#ff4d6d';
    ctx.save();
    ctx.rotate(e.phase * 0.8);
    for (let k = 0; k < 12; k++) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = rCols[(k + (strobe ? 1 : 0)) % 3];
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(12, -4); ctx.lineTo(25, 0); ctx.lineTo(12, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    drawGlossyCircle(ctx, 0, 0, 15, flash ? '#ffffff' : '#ffd166');
    // Тёмные очки раста-солнца
    ctx.fillStyle = '#120826';
    roundRectPath(ctx, -11, -5, 9, 6, 2); ctx.fill();
    roundRectPath(ctx, 2, -5, 9, 6, 2); ctx.fill();
    ctx.fillRect(-3, -4, 6, 2);
    drawFangedMouth(ctx, 4, 14, 5.5);
    if (e.isElite) drawEliteCrown(ctx, -22);
    ctx.restore(); return;
  }

  // Ур. 6
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
// 12 УНИКАЛЬНЫХ АНИМИРОВАННЫХ БОССОВ (ВКЛЮЧАЯ МАРКУ ХОФМАНА И МЕГА-ЛЬВА ДЖА)
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

  // 1. УРОВЕНЬ 1: КРЫЛАТЫЙ ГЛАЗ-ШТЕМПЕЛЬ / КРЫЛАТАЯ МАРКА АЛЬБЕРТА ХОФМАНА
  if (lvl.id === 1) {
    const flap = Math.sin(b.time * 7.5) * 16;

    if (b.isMidBoss) {
      for (let side of [-1, 1]) {
        ctx.fillStyle = strobe ? '#f3c4fb' : '#00f5d4';
        ctx.strokeStyle = INK; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(side * 42, -10);
        ctx.quadraticCurveTo(side * 96, -48 + flap, side * 105, -6 + flap);
        ctx.quadraticCurveTo(side * 86, 22 + flap * 0.6, side * 42, 16);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : '#9b5de5';
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5;
      roundRectPath(ctx, -46, -50, 92, 100, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -8, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `hsl(${hue}, 100%, 55%)`;
      ctx.beginPath(); ctx.arc(lookX * 1.5, -8, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(lookX * 1.5, -8, 6.5, 0, Math.PI * 2); ctx.fill();
      drawFangedMouth(ctx, 22, 46, 16);
      ctx.restore(); return;
    }

    // Шлейф двойников
    for (let g = 2; g >= 1; g--) {
      ctx.save();
      ctx.translate(-Math.cos(b.time * 1.6) * g * 12, -g * 4);
      ctx.globalAlpha = 0.22 / g;
      ctx.strokeStyle = `hsl(${(hue + g * 110) % 360}, 100%, 65%)`;
      ctx.lineWidth = 4;
      roundRectPath(ctx, -64, -72, 128, 144, 8);
      ctx.stroke();
      ctx.restore();
    }

    // Крылья марки Хофмана
    for (let side of [-1, 1]) {
      ctx.save();
      ctx.fillStyle = `hsl(${(hue + (side > 0 ? 60 : 200)) % 360}, 95%, 62%)`;
      ctx.strokeStyle = INK; ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo(side * 58, -22);
      ctx.bezierCurveTo(side * 105, -78 + flap, side * 136, -34 + flap, side * 124, 6 + flap * 0.8);
      ctx.bezierCurveTo(side * 116, 36 + flap * 0.5, side * 86, 46, side * 58, 28);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = strobe ? '#fff3d6' : '#00f5d4';
      ctx.beginPath(); ctx.ellipse(side * 92, -12 + flap * 0.7, 18, 9, side * -0.35, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Зубчатая рамка марки
    const stampW = 126, stampH = 142, halfW = 63, halfH = 71;
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
    ctx.strokeStyle = strobe ? '#ffee33' : '#ff006e';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-halfW, -halfH);
    for (let i = 0; i < 8; i++) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, -halfH, 4.5, Math.PI, 0, true);
    ctx.lineTo(halfW, -halfH);
    for (let i = 0; i < 9; i++) ctx.arc(halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(halfW, halfH);
    for (let i = 7; i >= 0; i--) ctx.arc(-halfW + (stampW * (i + 0.5)) / 8, halfH, 4.5, 0, Math.PI, true);
    ctx.lineTo(-halfW, halfH);
    for (let i = 8; i >= 0; i--) ctx.arc(-halfW, -halfH + (stampH * (i + 0.5)) / 9, 4.5, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.save();
    roundRectPath(ctx, -52, -60, 104, 120, 6);
    ctx.clip();

    ctx.fillStyle = '#240046'; ctx.fillRect(-52, -60, 104, 120);
    ctx.save(); ctx.translate(0, -28); ctx.rotate(b.time * 1.4);
    for (let r = 0; r < 12; r++) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = r % 2 === 0 ? '#ff9f1c' : '#ff006e';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(75, -10); ctx.lineTo(75, 10); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = '#ffee33'; ctx.beginPath(); ctx.arc(0, -28, 16, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#7209b7'; ctx.beginPath(); ctx.moveTo(-54, 16); ctx.lineTo(-22, -14); ctx.lineTo(12, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3a0ca3'; ctx.beginPath(); ctx.moveTo(-8, 16); ctx.lineTo(26, -18); ctx.lineTo(56, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#06d6a0'; ctx.fillRect(-52, 14, 104, 46);
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(-45, 60); ctx.lineTo(-10, 14); ctx.lineTo(14, 14); ctx.lineTo(48, 60); ctx.closePath(); ctx.fill();

    const wheelRot = b.time * 8;
    [-22, 22].forEach(wx => {
      ctx.save(); ctx.translate(wx, 22); ctx.rotate(wheelRot);
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = strobe ? '#00f5d4' : '#ff006e'; ctx.lineWidth = 2;
      for (let sp = 0; sp < 6; sp++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(13, 0); ctx.stroke(); }
      ctx.restore();
    });

    ctx.strokeStyle = '#ff002b'; ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-22, 22); ctx.lineTo(-4, 22); ctx.lineTo(14, 8); ctx.lineTo(-8, 8); ctx.closePath();
    ctx.moveTo(14, 8); ctx.lineTo(22, 22); ctx.moveTo(14, 8); ctx.lineTo(11, -1); ctx.lineTo(18, -3);
    ctx.stroke();

    const pedal = Math.sin(b.time * 11) * 4;
    ctx.strokeStyle = INK; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(-6, 4); ctx.lineTo(-2, 16 + pedal); ctx.lineTo(-4, 24 + pedal); ctx.stroke();
    ctx.fillStyle = '#1b0933'; roundRectPath(ctx, -12, -16, 16, 22, 5); ctx.fill();
    ctx.strokeStyle = '#ff006e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-2, -12); ctx.lineTo(-14 - pedal, -8); ctx.stroke();
    ctx.strokeStyle = '#1b0933'; ctx.lineWidth = 3.8;
    ctx.beginPath(); ctx.moveTo(-2, -12); ctx.lineTo(14, -2); ctx.stroke();
    ctx.fillStyle = '#ffe5d9'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-2, -24, 9.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-7, -27, 5, 0, Math.PI * 2); ctx.arc(-10, -22, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(1 + lookX * 0.5, -25, 2.2, 0, Math.PI * 2); ctx.arc(5 + lookX * 0.5, -25, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = '900 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('1943 • BICYCLE DAY', 0, -48);
    ctx.restore();

    drawFangedMouth(ctx, 43, 52, 16);
    ctx.restore(); return;
  }

  // 2. УРОВЕНЬ 2
  if (lvl.id === 2) {
    if (b.isMidBoss) {
      const flap = Math.sin(b.time * 8) * 18;
      ctx.fillStyle = '#240046'; ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff006e'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.lineTo(-42, -42 + flap * 0.4); ctx.lineTo(-86, -18 + flap); ctx.lineTo(-64, 16 + flap * 0.6); ctx.lineTo(-30, 14);
      ctx.lineTo(0, 26); ctx.lineTo(30, 14); ctx.lineTo(64, 16 + flap * 0.6); ctx.lineTo(86, -18 + flap); ctx.lineTo(42, -42 + flap * 0.4);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -6, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      [-11, 11].forEach((ex, idx) => {
        ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff002b'; ctx.beginPath(); ctx.arc(ex, -8, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lookX, -8, 4, 0, Math.PI * 2); ctx.fill();
      });
      drawFangedMouth(ctx, 10, 32, 14);
      ctx.restore(); return;
    }

    const legCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const wave = Math.sin(b.time * 7 + l * 1.4) * 12, baseY = -14 + l * 12;
        ctx.strokeStyle = strobe ? '#ffffff' : legCols[l]; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(side * 42, baseY); ctx.lineTo(side * 78, baseY - 26 + wave); ctx.lineTo(side * 98, baseY + 26 - wave); ctx.stroke();
      }
      const swing = Math.sin(b.time * 4.5 + side) * 14;
      const mx = side * 74 + swing, my = 48 + Math.cos(b.time * 4.5) * 8;
      ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(side * 54, 16); ctx.lineTo(mx, my); ctx.stroke();
      drawGlossyCircle(ctx, mx, my, 13, '#fff8eb');
      ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(mx - 4, my - 2, 3, 0, Math.PI * 2); ctx.arc(mx + 4, my - 2, 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = strobe ? '#ffbe0b' : '#ff002b'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, -14, 52, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(26, 52); ctx.lineTo(-26, 52); ctx.closePath(); ctx.fill(); ctx.stroke();

    if (b.phase === 3) {
      const hBeat = 1 + Math.sin(b.time * 16) * 0.2;
      ctx.save(); ctx.translate(0, -34); ctx.scale(hBeat, hBeat);
      ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(0, -42, 10, 0, Math.PI * 2); ctx.fill();
    }

    [-21, 21].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#3a86ff'; ctx.beginPath(); ctx.arc(ex, -6, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#090206'; ctx.beginPath(); ctx.arc(ex, -6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 26, 46, 20);
    ctx.restore(); return;
  }

  // 3. УРОВЕНЬ 3
  if (lvl.id === 3) {
    if (b.isMidBoss) {
      for (let seg = 4; seg >= 0; seg--) {
        const sy = -24 + seg * 15, sx = Math.sin(b.time * 6 + seg * 0.9) * 16, r = 24 - seg * 2.5;
        drawGlossyCircle(ctx, sx, sy, r, seg % 2 === 0 ? '#ffc2d1' : '#fff3d6');
      }
      ctx.fillStyle = '#f3d5b5'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(-18, -36); ctx.lineTo(18, -36); ctx.lineTo(0, -68); ctx.closePath(); ctx.fill(); ctx.stroke();
      [-10, 10].forEach(ex => {
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(ex, -24, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#9d4edd'; ctx.beginPath(); ctx.arc(ex + lookX, -24, 4, 0, Math.PI * 2); ctx.fill();
      });
      drawFangedMouth(ctx, -10, 28, 12);
      ctx.restore(); return;
    }

    for (let side of [-1, 1]) {
      for (let l = 0; l < 3; l++) {
        const kick = Math.sin(b.time * 8 + l * 1.5 + side) * 11, y0 = 10 + l * 14;
        ctx.strokeStyle = l % 2 === 0 ? '#ffc2d1' : '#fff3d6'; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(side * 48, y0); ctx.lineTo(side * 78, y0 - 10 + kick); ctx.lineTo(side * 94, y0 + 22 - kick); ctx.stroke();
      }
    }
    const tiers = [
      { y: 26, w: 112, h: 32, col: '#ffc2d1' },
      { y: -4, w: 88,  h: 28, col: '#fff3d6' },
      { y: -30, w: 62, h: 24, col: '#e0c3fc' }
    ];
    tiers.forEach((tr, idx) => {
      const shift = Math.sin(b.time * 4 + idx * 2) * 5;
      ctx.fillStyle = flash ? '#ffffff' : tr.col; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      roundRectPath(ctx, -tr.w / 2 + shift, tr.y - tr.h / 2, tr.w, tr.h, 12); ctx.fill(); ctx.stroke();
    });
    [-16, 0, 16].forEach((cx, idx) => {
      ctx.fillStyle = '#bde0fe'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      roundRectPath(ctx, cx - 4, -58, 8, 18, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = strobe ? '#fff3d6' : '#ff85a1';
      ctx.beginPath(); ctx.arc(cx, -64 - (idx === 1 ? 3 : 0), 6, 0, Math.PI * 2); ctx.fill();
    });
    [[-24, 24], [0, 24], [24, 24], [-18, -5], [18, -5]].forEach(([ex, ey]) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(ex, ey, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7209b7'; ctx.beginPath(); ctx.arc(ex + lookX, ey, 4.2, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 36, 48, 16);
    ctx.restore(); return;
  }

  // 4. УРОВЕНЬ 4
  if (lvl.id === 4) {
    if (b.isMidBoss) {
      for (let k = -3; k <= 3; k++) {
        const w = Math.sin(b.time * 6 + k) * 12;
        ctx.strokeStyle = k % 2 === 0 ? '#caf0f8' : '#ff70a6'; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(k * 9, 10); ctx.quadraticCurveTo(k * 11 + w, 38, k * 13 - w * 0.5, 66); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(72, 202, 228, 0.72)'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, 6, 44, Math.PI, 0); ctx.quadraticCurveTo(46, 18, 0, 14); ctx.quadraticCurveTo(-46, 18, -44, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
      const brPulse = 1 + Math.sin(b.time * 10) * 0.14;
      ctx.save(); ctx.translate(0, -14); ctx.scale(brPulse, brPulse);
      ctx.fillStyle = '#ff70a6'; ctx.beginPath(); ctx.ellipse(-7, 0, 11, 8, 0, 0, Math.PI * 2); ctx.ellipse(7, 0, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      [-14, 14].forEach(ex => {
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(ex, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lookX, 0, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore(); return;
    }

    const seaHue = (b.time * 125) % 360;
    for (let i = 0; i < 8; i++) {
      const t = i - 3.5, waveX = Math.sin(b.time * 5.5 + i * 0.9) * 18;
      ctx.strokeStyle = `hsl(${(seaHue + i * 42) % 360}, 98%, 66%)`; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(t * 14, 22); ctx.quadraticCurveTo(t * 18 + waveX, 56, t * 22 - waveX * 0.5, 86); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(t * 17 + waveX * 0.6, 52, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${seaHue}, 94%, 64%)`;
    ctx.strokeStyle = strobe ? '#ffffff' : '#9bf6ff'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, -4, 54, Math.PI, 0); ctx.quadraticCurveTo(58, 32, 0, 34); ctx.quadraticCurveTo(-58, 32, -54, -4); ctx.closePath(); ctx.fill(); ctx.stroke();

    const lureX = Math.sin(b.time * 3.5) * 32;
    ctx.strokeStyle = '#caf0f8'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, -54); ctx.quadraticCurveTo(lureX * 0.5, -88, lureX, -66); ctx.stroke();
    ctx.fillStyle = strobe ? '#ffffff' : '#ffee33';
    ctx.beginPath(); ctx.arc(lureX, -62, 10, 0, Math.PI * 2); ctx.fill();

    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, -8, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#03045e'; ctx.beginPath(); ctx.arc(ex + lookX, -7, 6, 0, Math.PI * 2); ctx.fill();
    });
    drawFangedMouth(ctx, 12, 42, 16);
    ctx.restore(); return;
  }

  // =======================================================================
  // 5. УРОВЕНЬ 5 (РАСТАМАНСКИЙ):
  // МАЛЫЙ — ДРЕДАСТЫЙ ХАМЕЛЕОН-ГИПНОТИЗЁР | БОЛЬШОЙ — МЕГА-ЛЕВ ДЖА С ДРЕДАМИ
  // =======================================================================
  if (lvl.id === 5) {
    const rCols = ['#ff4d6d', '#ffd166', '#06d6a0'];

    if (b.isMidBoss) {
      // МАЛЫЙ БОСС УР. 5: Дредастый Хамелеон-Гипнотизёр на 6 лапах
      for (let side of [-1, 1]) {
        for (let l = 0; l < 3; l++) {
          const step = Math.sin(b.time * 8 + l * 1.6 + side) * 10;
          ctx.strokeStyle = rCols[l]; ctx.lineWidth = 5.5;
          ctx.beginPath(); ctx.moveTo(side * 28, -10 + l * 14); ctx.lineTo(side * 56, -18 + l * 14 + step); ctx.lineTo(side * 68, 8 + l * 14 - step); ctx.stroke();
        }
      }
      // Гипно-спираль хвоста снизу
      ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(0, 28); ctx.quadraticCurveTo(28, 54, 6, 62); ctx.quadraticCurveTo(-14, 62, -6, 46); ctx.stroke();

      const chCol = flash ? '#ffffff' : rCols[Math.floor(b.time * 3) % 3];
      drawGlossyCircle(ctx, 0, -4, 38, chCol);
      // Дреды на макушке
      [-16, -6, 6, 16].forEach((dx, idx) => {
        ctx.strokeStyle = rCols[idx % 3]; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(dx, -36); ctx.quadraticCurveTo(dx * 1.8, -54, dx * 2.2, -32); ctx.stroke();
      });
      [-16, 16].forEach(ex => {
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(ex, -8, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, -8, 5, 0, Math.PI * 2); ctx.fill();
      });
      drawFangedMouth(ctx, 10, 34, 14);
      ctx.restore(); return;
    }

    // БОЛЬШОЙ БОСС УР. 5: МЕГА-ЛЕВ ДЖА С ДРЕДАМИ И РАСТА-КОРОНОЙ
    // 6 толстых извивающихся красно-жёлто-зелёных дредов-щупалец
    for (let d = 0; d < 6; d++) {
      const side = d < 3 ? -1 : 1;
      const idx = d % 3;
      const wave = Math.sin(b.time * 5.5 + d * 1.1) * 20;
      const startX = side * (36 + idx * 12);
      ctx.strokeStyle = rCols[idx];
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(startX, -8 + idx * 12);
      ctx.bezierCurveTo(startX + side * 34 + wave, 24, startX + side * 16 - wave, 62, startX + side * 38 + wave * 0.7, 94);
      ctx.stroke();

      // Золотые кольца-бусины на дредах
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.arc(startX + side * 24, 48 + wave * 0.4, 5.5, 0, Math.PI * 2); ctx.fill();
    }

    // Пышная грива Льва Джа
    ctx.save();
    ctx.rotate(Math.sin(b.time * 2) * 0.08);
    for (let m = 0; m < 14; m++) {
      ctx.rotate((Math.PI * 2) / 14);
      ctx.fillStyle = rCols[m % 3];
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(28, -10); ctx.lineTo(66, 0); ctx.lineTo(28, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    // Морда Льва Джа
    drawGlossyCircle(ctx, 0, 2, 44, flash ? '#ffffff' : '#f4a261');

    // Вязаная раста-шапка / корона сверху
    ctx.fillStyle = '#06d6a0'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -30, 34, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd166'; ctx.fillRect(-34, -32, 68, 7);
    ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-34, -25, 68, 7);

    // Круглые радужные очки Льва
    [-17, 17].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#ff4d6d' : '#06d6a0';
      ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -4, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex + lookX, -4, 4.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.stroke();

    // Львиный нос и рычащая клыкастая пасть
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(-7, 10); ctx.lineTo(7, 10); ctx.lineTo(0, 18); ctx.closePath(); ctx.fill();
    drawFangedMouth(ctx, 21, 44, 17);
    ctx.restore(); return;
  }

  // 6. УРОВЕНЬ 6: СПОРОВАЯ МИНИ-СКОЛОПЕНДРА / ВЛАДЫКА МУХОМОР-СКОЛОПЕНДРА
  const segCount = b.isMidBoss ? 3 : 5;
  for (let seg = segCount - 1; seg >= 0; seg--) {
    const sy = (b.isMidBoss ? 12 : 18) + seg * (b.isMidBoss ? 13 : 15);
    const sx = Math.sin(b.time * (b.isMidBoss ? 9 : 7) + seg * 0.9) * (b.isMidBoss ? 18 : 14);
    const segCol = seg % 2 === 0 ? '#7209b7' : '#ff006e';

    for (let side of [-1, 1]) {
      const legKick = Math.sin(b.time * 13 + seg * 1.3 + side) * 9;
      ctx.strokeStyle = strobe ? '#ffee33' : '#00f5d4';
      ctx.lineWidth = b.isMidBoss ? 3.5 : 4.5;
      ctx.beginPath();
      ctx.moveTo(sx + side * 12, sy);
      ctx.lineTo(sx + side * (b.isMidBoss ? 26 : 34), sy - 6 + legKick);
      ctx.lineTo(sx + side * (b.isMidBoss ? 32 : 42), sy + 10 - legKick);
      ctx.stroke();
    }

    ctx.fillStyle = flash ? '#ffffff' : segCol;
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.ellipse(sx, sy, (b.isMidBoss ? 16 : 22) - seg * 1.5, b.isMidBoss ? 9 : 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  const capR = b.isMidBoss ? 44 : 66;
  const capCol = flash ? '#ffffff' : (strobe ? '#ff002b' : `hsl(${hue}, 100%, 54%)`);
  ctx.fillStyle = capCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = b.isMidBoss ? 3.5 : 4.5;
  ctx.beginPath(); ctx.arc(0, 2, capR, Math.PI, 0); ctx.quadraticCurveTo(capR + 4, 18, 0, 14); ctx.quadraticCurveTo(-capR - 4, 18, -capR, 2); ctx.closePath(); ctx.fill(); ctx.stroke();

  const spots = b.isMidBoss ? [[-22, -16, 6], [22, -16, 6], [0, -28, 7]] : [[-36, -24, 9], [36, -24, 9], [0, -44, 11], [-18, -36, 6], [18, -36, 6]];
  spots.forEach(([sx, sy, sr]) => {
    ctx.fillStyle = strobe ? '#ffee33' : '#ffffff';
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  });

  const eyeOff = b.isMidBoss ? 12 : 17;
  [-eyeOff, eyeOff].forEach(ex => {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(ex, 14, b.isMidBoss ? 8 : 10.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, 14, b.isMidBoss ? 3.8 : 4.8, 0, Math.PI * 2); ctx.fill();
  });
  drawFangedMouth(ctx, b.isMidBoss ? 24 : 30, b.isMidBoss ? 28 : 38, b.isMidBoss ? 12 : 15);
  ctx.restore();
}
