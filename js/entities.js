'use strict';

const INK = '#120826';

// 5 МИНИАТЮРНЫХ ОБТЕКАЕМЫХ КОРАБЛЕЙ С ЯРКИМИ МУЛЬТЯШНЫМИ ДЕТАЛЯМИ
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

// 5 АДАПТИРУЮЩИХСЯ ВИДОВ ОРУЖИЯ
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

// 6 УРОВНЕЙ (включая новый 6-й уровень «Грибная Галактика»)
const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Атакуют Фрактал-Корабли со спиралями, Мини-Почтовые Марки с пульками и Кубики Рубика! Босс — Огромная Почтовая Марка!',
    enemiesDesc: 'Фрактал-Корабли (спирали), Мини-Марки (пули) и Кубики Рубика (квадраты)',
    bossName: 'Психо-Марка Оракула',
    bossWeapon: 'Переливающиеся лучи изо рта и крутящиеся зелёные звёзды из глаз',
    theme: 'lsd',
    enemyTypes: ['fractal_ship', 'mini_stamp', 'rubik_cube'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Яркие неоновые Летучие Мыши, Пауки и Скелеты в красных, жёлтых, зелёных и синих тонах! Босс — Мексиканский Череп с паучьими ногами!',
    enemiesDesc: 'Летучие Мыши, Пауки, Скелеты и Мини-Мексиканские Черепа',
    bossName: 'Калавера-Паук Инферно',
    bossWeapon: 'Потоки огня, лазеры и лазерные сюрикены',
    theme: 'horror',
    enemyTypes: ['bat_ship', 'spider_ship', 'skeleton_ship', 'mini_skull'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ffbe0b', bossColor: '#ff002b', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Атакуют Корабли-Клоуны, Леденцы, Радуги со спиральным глазом и Мини-Пончики! Босс — Огромный Пончик с зубами и руками!',
    enemiesDesc: 'Клоуны (пули), Леденцы (ракеты), Радуги (лазеры) и Мини-Пончики',
    bossName: 'Пончик-Метатель Глазурный',
    bossWeapon: 'Броски пончиков руками, волны радуги и лазеры из глаз',
    theme: 'rainbow',
    enemyTypes: ['clown_ship', 'lollipop_ship', 'rainbow_spiral', 'mini_donut'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Среди пастельных волн и рыбок плывут Корабли-Крабы, Осьминоги и Мини-Кракены! Босс — Огромный Злобный Осьминог!',
    enemiesDesc: 'Корабли-Крабы, Осьминоги, Скат-Зонды и Мини-Кракены',
    bossName: 'Пастельный Кракен Глубин',
    bossWeapon: 'Лучи из 8 щупалец, волновые удары и молнии из глаз',
    theme: 'underwater',
    enemyTypes: ['crab_ship', 'octopus_ship', 'manta_wave', 'mini_kraken'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#9bf6ff', bossColor: '#48cae4', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудный Мир Био-Флоры',
    story: 'В изумрудных глубинах дрейфуют Водоросли со щупальцами и атакуют Медузы, Осьминоги и Морские Звёзды! Босс — Титан-Подсолнух!',
    enemiesDesc: 'Медузы, Био-Осьминоги, Морские Звёзды и Мини-Подсолнухи',
    bossName: 'Император Флоры «Подсолнух»',
    bossWeapon: 'Вращающиеся цветки, хлещущие лианы и био-лазеры',
    theme: 'organic',
    enemyTypes: ['jellyfish_ship', 'octopus_bio', 'starfish_ship', 'mini_flower'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#80ed99', bossColor: '#38b000', hpMult: 2.05, coinReward: 1500
  },
  {
    id: 6,
    name: 'Грибная Галактика',
    story: 'Финальный псилоцибиновый трип! Злобные Мухоморы, Вытянутые Грибы-Корабли, Полип-Грибы и Грибы-Бактерии! Босс — Огромный Страшный Мухомор!',
    enemiesDesc: 'Злобные Мухоморы (споры), Грибы-Корабли (лазеры), Полип-Грибы и Грибы-Бактерии',
    bossName: 'Владыка Спор «Мега-Мухомор»',
    bossWeapon: 'Радужные лазеры и залпы маленьких мухоморчиков изо рта',
    theme: 'mushroom',
    enemyTypes: ['evil_flyagaric', 'shroom_starship', 'polyp_mushroom', 'bacteria_shroom', 'mini_flyagaric'],
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

// =========================================================================
// 5 МУЛЬТЯШНЫХ ОБТЕКАЕМЫХ КОРАБЛЕЙ С ЖИРНЫМИ КОНТУРАМИ И БЛИКАМИ
// =========================================================================
function drawPlayerShipModel(ctx, ship, time, vx = 0, opts = {}) {
  const shipId = ship.id || 'shuttle';
  const hullCol = ship.hullColor || '#e0fbfc';
  const hullDark = ship.hullDark || '#98c1d9';
  const wingCol = ship.wingColor || '#ff5964';
  const neonCol = ship.neonColor || '#48dbfb';

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Мягкая неоновая тень-подсветка
  ctx.fillStyle = neonCol; ctx.globalAlpha = 0.24;
  ctx.beginPath(); ctx.arc(0, 1, 28, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Мультяшное пламя сопел
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

  // Мультяшный блик на левом борту
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath(); ctx.ellipse(-5.5, -3, 2.8, 9, -0.2, 0, Math.PI * 2); ctx.fill();

  // Купол кабины с Астро-Котом
  ctx.fillStyle = '#48dbfb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.ellipse(0, 0, 8.8, 10.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffb703';
  ctx.beginPath();
  ctx.moveTo(-5.5, -3); ctx.lineTo(-4.5, -8.5); ctx.lineTo(-1, -4);
  ctx.moveTo(5.5, -3);  ctx.lineTo(4.5, -8.5);  ctx.lineTo(1, -4);
  ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0.5, 6, 0, Math.PI * 2); ctx.fill();

  // Глазки котика в шлеме
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

function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.12;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  const glowColors = { red_shield: '#ff5964', fractal_shuriken: '#00f5d4', electric_shock: '#fee440', wave_cannon: '#f15bb5' };
  const neonCol = glowColors[bn.type] || '#ffd166';

  ctx.fillStyle = neonCol; ctx.globalAlpha = 0.28;
  ctx.beginPath(); ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1b1438'; ctx.strokeStyle = neonCol; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  if (bn.type === 'red_shield') {
    ctx.fillStyle = '#ff5964'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.lineTo(Math.cos(a + Math.PI / 5) * 6, Math.sin(a + Math.PI / 5) * 6);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (bn.type === 'fractal_shuriken') {
    ctx.rotate(bn.phase); ctx.fillStyle = '#00f5d4'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6, rad = i % 2 === 0 ? 14 : 5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (bn.type === 'electric_shock') {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(3, -13); ctx.lineTo(-9, 1); ctx.lineTo(-1, 1); ctx.lineTo(-5, 13); ctx.lineTo(9, -2); ctx.lineTo(1, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    ctx.strokeStyle = '#f15bb5'; ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => { ctx.beginPath(); ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
  }
  ctx.restore();
}

function drawPlayerBullet(ctx, b) {
  ctx.save(); ctx.translate(b.x, b.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  if (b.kind === 'heart_shot') {
    ctx.fillStyle = '#ff4d6d'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.bezierCurveTo(6, -14, 13, -6, 0, 8); ctx.bezierCurveTo(-13, -6, -6, -14, 0, -8); ctx.fill(); ctx.stroke();
  } else if (b.kind === 'vortex_ring') {
    ctx.rotate(b.rot || 0); ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 1.6); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(0, 0, b.r * 0.55, Math.PI, Math.PI * 2.5); ctx.stroke();
  } else if (b.kind === 'player_rocket') {
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = '#e0fbfc'; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    roundRectPath(ctx, -3.5, -9, 7, 16, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964'; ctx.beginPath(); ctx.arc(0, -9, 3.6, Math.PI, 0); ctx.fill();
  } else if (b.kind === 'fractal_shuriken') {
    ctx.rotate(b.rot || 0); ctx.fillStyle = '#00f5d4'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6, rad = i % 2 === 0 ? 13 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (b.kind === 'electric_bolt') {
    ctx.strokeStyle = '#fee440'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-6, -4); ctx.lineTo(5, 3); ctx.lineTo(0, 14); ctx.stroke();
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = b.color || '#f15bb5'; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (b.kind === 'wing_laser') {
    ctx.fillStyle = '#f72585'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, -2.5, -14, 5, 26, 2.5); ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = b.color || '#48dbfb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// =========================================================================
// ПРЕПЯТСТВИЯ НА ПУТИ (включая Блок с грибами и Спору-кристалл для 6-го уровня)
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const hue = Math.floor(((ob.phase || 0) * 95) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 66%)`;
  const dynamicNeon2 = `hsl(${(hue + 140) % 360}, 100%, 72%)`;

  // --- УРОВЕНЬ 6: ВРАЩАЮЩИЙСЯ БЛОК С ГРИБАМИ ВНУТРИ И ПРЫГАЮЩАЯ СПОРА-КРИСТАЛЛ ---
  if (ob.shape === 'mushroom_box') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon; ctx.globalAlpha = 0.25;
    roundRectPath(ctx, -28, -28, 56, 56, 12); ctx.fill();
    ctx.globalAlpha = 1;

    // Неоновый куб-контейнер
    ctx.fillStyle = 'rgba(26, 4, 54, 0.88)';
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 3;
    roundRectPath(ctx, -23, -23, 46, 46, 10);
    ctx.fill(); ctx.stroke();

    // Два светящихся мухоморчика внутри блока
    [[-8, 3, 0.85], [9, 6, 0.7]].forEach(([mx, my, sc]) => {
      ctx.save(); ctx.translate(mx, my); ctx.scale(sc, sc);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, 0, 6, 11);
      ctx.fillStyle = dynamicNeon2;
      ctx.beginPath(); ctx.arc(0, 0, 11, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-4, -4, 2, 0, Math.PI * 2); ctx.arc(4, -5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    ctx.restore();
    return;
  }

  if (ob.shape === 'spore_crystal') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon2; ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = dynamicNeon; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * i) / 4, rad = i % 2 === 0 ? ob.r + 4 : ob.r * 0.45;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (ob.shape === 'om_fractal') {
    ctx.fillStyle = dynamicNeon; ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save(); ctx.rotate(ob.rot || 0);
    ctx.strokeStyle = dynamicNeon; ctx.lineWidth = 2.5;
    for (let k = 0; k < 8; k++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.quadraticCurveTo(22, -9, 30, 0); ctx.quadraticCurveTo(22, 9, 12, 0); ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = '#1b0933'; ctx.strokeStyle = dynamicNeon2; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 21px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', 0, 1);
    ctx.restore();
    return;
  }

  if (ob.shape === 'neon_star_obstacle') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon2; ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = dynamicNeon; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * (ob.r + 4), Math.sin(a) * (ob.r + 4));
      ctx.lineTo(Math.cos(a + Math.PI / 5) * (ob.r * 0.45), Math.sin(a + Math.PI / 5) * (ob.r * 0.45));
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (ob.shape === 'skull_bones' || ob.shape === 'blood_pentagram') {
    ctx.rotate(ob.rot || 0);
    const col = Math.sin(ob.phase || 0) > 0 ? '#ff002b' : '#ffbe0b';
    ctx.fillStyle = col; ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#e2ece9'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-24, -24); ctx.lineTo(24, 24); ctx.moveTo(24, -24); ctx.lineTo(-24, 24); ctx.stroke();

    ctx.fillStyle = '#2b2333'; ctx.strokeStyle = col; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.arc(0, -4, 18, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(8, 17); ctx.lineTo(-8, 17); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#06d6a0';
    ctx.beginPath(); ctx.arc(-6, -3, 4.5, 0, Math.PI * 2); ctx.arc(6, -3, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (ob.shape === 'rainbow_donut' || ob.shape === 'dream_bubble' || ob.shape === 'rainbow_cloud') {
    ctx.fillStyle = dynamicNeon; ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'rainbow_donut') {
      ctx.rotate(ob.rot || 0);
      ctx.fillStyle = '#f4a261'; ctx.strokeStyle = dynamicNeon; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, ob.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `hsl(${(hue + 40) % 360}, 95%, 62%)`;
      ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.82, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1447';
      ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (ob.shape === 'dream_bubble') {
      ctx.fillStyle = `hsl(${hue}, 90%, 88%)`; ctx.strokeStyle = dynamicNeon; ctx.lineWidth = 3;
      [[-12, 4, 14], [12, 4, 14], [-6, -8, 15], [8, -8, 15], [0, 2, 16]].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
    } else {
      ['#ff3366', '#ffee33', '#33ee88', '#33ccff'].forEach((rc, idx) => {
        ctx.strokeStyle = rc; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.arc(0, 4, ob.r - idx * 3.2, Math.PI, Math.PI * 2); ctx.stroke();
      });
      ctx.fillStyle = '#ffffff';
      [[-14, 6, 11], [0, 5, 13], [14, 6, 11]].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
      });
    }
    ctx.restore();
    return;
  }

  if (ob.shape === 'neon_coral' || ob.shape === 'seaweed_kelp') {
    const seaCol1 = `hsl(${165 + Math.sin(ob.phase || 0) * 45}, 95%, 68%)`;
    const seaCol2 = `hsl(${290 + Math.cos(ob.phase || 0) * 40}, 95%, 74%)`;
    ctx.fillStyle = seaCol1; ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = seaCol2; ctx.lineWidth = 7;
    [[-14, -18], [0, -24], [14, -16], [-20, -4], [20, -4]].forEach(([bx, by]) => {
      ctx.beginPath(); ctx.moveTo(0, 16); ctx.quadraticCurveTo(bx * 0.5, 0, bx, by); ctx.stroke();
      ctx.fillStyle = seaCol1; ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // Водоросль со щупальцами (Уровень 5)
  ctx.fillStyle = '#80ed99'; ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.arc(0, 0, ob.r + 11, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  for (let t = -2; t <= 2; t++) {
    const sway = Math.sin((ob.phase || 0) * 3.5 + t * 1.3) * 9;
    const tipX = t * 11 + sway, tipY = -24 + Math.abs(t) * 3;
    ctx.strokeStyle = t % 2 === 0 ? '#38b000' : '#80ed99'; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(t * 4, 14); ctx.bezierCurveTo(t * 8 - sway, 2, t * 10 + sway, -12, tipX, tipY); ctx.stroke();
    ctx.fillStyle = '#ccff33'; ctx.beginPath(); ctx.arc(tipX, tipY, 3.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#1b4332'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.ellipse(0, 14, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// =========================================================================
// ВРАГИ УРОВНЕЙ 1–6 (включая 4 вида грибных врагов 6-го уровня и яркие цвета 2-го)
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 105) % 360);

  // --- УРОВЕНЬ 6: ГРИБНАЯ ГАЛАКТИКА (Мухомор, Вытянутый Гриб-Корабль, Полип-Гриб, Гриб-Бактерия) ---
  if (e.kind === 'evil_flyagaric' || e.kind === 'mini_flyagaric') {
    const isMini = e.kind === 'mini_flyagaric';
    const capHue = isMini ? hue : 350;
    const capCol = isMini ? `hsl(${capHue}, 95%, 56%)` : '#ff002b';
    e.wingCol = capCol; e.bodyCol = '#ffffff';

    // Ножка мухомора с юбочкой
    ctx.fillStyle = flash ? '#ffffff' : '#f8edeb';
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    roundRectPath(ctx, -7, 0, 14, 20, 5); ctx.fill(); ctx.stroke();

    // Злобная шляпка мухомора
    ctx.fillStyle = flash ? '#ffffff' : capCol;
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 2, isMini ? 22 : 20, Math.PI, 0);
    ctx.quadraticCurveTo(22, 8, 0, 6);
    ctx.quadraticCurveTo(-22, 8, -22, 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Белые пятна на шляпке
    ctx.fillStyle = '#ffffff';
    [[-10, -8, 3.2], [10, -7, 3], [0, -13, 3.8]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    });

    // Злобные глаза и зубы
    ctx.fillStyle = '#fee440';
    ctx.beginPath(); ctx.arc(-5, 9, 2.8, 0, Math.PI * 2); ctx.arc(5, 9, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (e.kind === 'shroom_starship') {
    // Вытянутый галлюциногенный гриб, похожий на космический корабль
    const c1 = `hsl(${hue}, 95%, 60%)`;
    const c2 = `hsl(${(hue + 140) % 360}, 95%, 68%)`;
    e.wingCol = c1; e.bodyCol = c2;

    // Крылья-спорангии по бокам
    ctx.fillStyle = flash ? '#ffffff' : c2;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -4); ctx.quadraticCurveTo(-26, 4, -20, 18); ctx.lineTo(0, 12);
    ctx.lineTo(20, 18); ctx.quadraticCurveTo(26, 4, 0, -4);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Вытянутый обтекаемый корпус-гриб
    ctx.fillStyle = flash ? '#ffffff' : c1;
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -24); ctx.bezierCurveTo(14, -12, 10, 14, 0, 24); ctx.bezierCurveTo(-10, 14, -14, -12, 0, -24);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (e.kind === 'polyp_mushroom') {
    // Гриб с полиповидными отростками
    const c1 = `hsl(${(hue + 60) % 360}, 95%, 62%)`;
    e.wingCol = c1; e.bodyCol = '#7209b7';

    // Полиповидные отростки вокруг шляпки
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI + (Math.PI * k) / 6;
      const px = Math.cos(a) * 24, py = Math.sin(a) * 20;
      ctx.strokeStyle = c1; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(px, py); ctx.stroke();
      ctx.fillStyle = '#fee440'; ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = flash ? '#ffffff' : '#7209b7'; ctx.strokeStyle = c1; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 4, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (e.kind === 'bacteria_shroom') {
    // Многоголовый гриб, похожий на бактерию
    const c1 = `hsl(${(hue + 190) % 360}, 95%, 64%)`;
    e.wingCol = c1; e.bodyCol = '#06d6a0';

    [[-12, -4, 11], [12, -4, 11], [0, -12, 13], [0, 8, 12]].forEach(([bx, by, br], idx) => {
      ctx.fillStyle = flash ? '#ffffff' : `hsl(${(hue + idx * 55) % 360}, 90%, 60%)`;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1: ФРАКТАЛ-КОРАБЛЬ, МИНИ-ПОЧТОВАЯ МАРКА, КУБИК РУБИКА ---
  if (e.kind === 'fractal_ship') {
    const c1 = `hsl(${hue}, 95%, 62%)`, c2 = `hsl(${(hue + 140) % 360}, 95%, 68%)`;
    e.wingCol = c1; e.bodyCol = c2;
    ctx.rotate(Math.sin(e.phase * 1.5) * 0.35);
    ctx.fillStyle = flash ? '#ffffff' : c1; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(18, -9, 26, 0); ctx.quadraticCurveTo(18, 9, 6, 0); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = flash ? '#ffffff' : c2; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (e.kind === 'mini_stamp') {
    const c1 = `hsl(${hue}, 95%, 60%)`, c2 = `hsl(${(hue + 180) % 360}, 100%, 72%)`;
    e.wingCol = c1; e.bodyCol = c2;
    ctx.fillStyle = flash ? '#ffffff' : c1; ctx.strokeStyle = c2; ctx.lineWidth = 2.6;
    roundRectPath(ctx, -18, -20, 36, 40, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#14052b'; roundRectPath(ctx, -14, -16, 28, 32, 4); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-6, -4, 4.2, 0, Math.PI * 2); ctx.arc(6, -4, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath(); ctx.arc(-6, -4, 2, 0, Math.PI * 2); ctx.arc(6, -4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (e.kind === 'rubik_cube') {
    e.wingCol = '#ff5964'; e.bodyCol = '#48dbfb';
    ctx.rotate(Math.sin(e.phase * 1.4) * 0.35);
    const size = 34, half = 17, cell = size / 3;
    const cubeColors = ['#ff3366', '#ffd166', '#06d6a0', '#48dbfb', '#ffffff', '#ff9f1c'];
    ctx.fillStyle = INK; roundRectPath(ctx, -half - 2, -half - 2, size + 4, size + 4, 6); ctx.fill();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cIdx = (row * 3 + col + Math.floor(e.phase * 2)) % cubeColors.length;
        ctx.fillStyle = flash ? '#ffffff' : cubeColors[cIdx];
        roundRectPath(ctx, -half + col * cell + 1, -half + row * cell + 1, cell - 2, cell - 2, 2.5); ctx.fill();
      }
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 2: ЯРКИЕ РАЗНОЦВЕТНЫЕ ВРАГИ (КРАСНЫЙ, ЖЁЛТЫЙ, ЗЕЛЁНЫЙ, СИНИЙ) + МИНИ-КАЛАВЕРА ---
  if (e.kind === 'bat_ship' || e.kind === 'spider_ship' || e.kind === 'skeleton_ship' || e.kind === 'mini_skull') {
    const palette2 = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    const cMain = palette2[Math.floor(e.phase * 1.5) % palette2.length];
    const cSub = palette2[(Math.floor(e.phase * 1.5) + 1) % palette2.length];
    e.wingCol = cMain; e.bodyCol = cSub;

    ctx.fillStyle = cMain; ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'mini_skull') {
      ctx.fillStyle = flash ? '#ffffff' : '#f8edeb'; ctx.strokeStyle = cMain; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, -4, 17, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(9, 17); ctx.lineTo(-9, 17); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = cSub;
      ctx.beginPath(); ctx.arc(-6, -3, 4.5, 0, Math.PI * 2); ctx.arc(6, -3, 4.5, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'bat_ship') {
      const flap = Math.sin(e.phase * 3.2) * 7;
      ctx.fillStyle = flash ? '#ffffff' : cMain; ctx.strokeStyle = cSub; ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -6); ctx.bezierCurveTo(-18, -22, -32, -16 + flap, -30, 6 + flap); ctx.quadraticCurveTo(-20, 4 + flap, -15, 14 + flap);
      ctx.quadraticCurveTo(-8, 8, 0, 20); ctx.quadraticCurveTo(8, 8, 15, 14 + flap); ctx.quadraticCurveTo(20, 4 + flap, 30, 6 + flap);
      ctx.bezierCurveTo(32, -16 + flap, 18, -22, 0, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#240b36'; ctx.beginPath(); ctx.ellipse(0, 2, 12, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(-5, 4, 3.6, 0, Math.PI * 2); ctx.arc(5, 4, 3.6, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'spider_ship') {
      const legMove = Math.sin(e.phase * 4) * 4;
      ctx.strokeStyle = flash ? '#ffffff' : cSub; ctx.lineWidth = 3.2;
      [-12, -4, 4, 12].forEach((ly, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(-10, ly); ctx.quadraticCurveTo(-24, ly - 10 + legMove * dir, -28, ly + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, ly);  ctx.quadraticCurveTo(24, ly - 10 - legMove * dir, 28, ly + 8); ctx.stroke();
      });
      ctx.fillStyle = flash ? '#ffffff' : cMain; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, -4, 15, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#06d6a0'; ctx.beginPath(); ctx.arc(-5, 8, 3, 0, Math.PI * 2); ctx.arc(5, 8, 3, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = flash ? '#ffffff' : cSub; ctx.lineWidth = 4;
      [-10, -2, 6].forEach(ry => { ctx.beginPath(); ctx.moveTo(-25, ry - 4); ctx.bezierCurveTo(-12, ry + 8, 12, ry + 8, 25, ry - 4); ctx.stroke(); });
      ctx.fillStyle = flash ? '#ffffff' : '#f8edeb'; ctx.strokeStyle = cMain; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 2, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3a86ff'; ctx.beginPath(); ctx.arc(-5, 3, 3.8, 0, Math.PI * 2); ctx.arc(5, 3, 3.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: КЛОУН, ЛЕДЕНЕЦ, РАДУГА, МИНИ-ПОНЧИК ---
  if (e.kind === 'clown_ship' || e.kind === 'lollipop_ship' || e.kind === 'rainbow_spiral' || e.kind === 'mini_donut') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    e.wingCol = wingCol; e.bodyCol = '#fff8eb';

    if (e.kind === 'mini_donut') {
      ctx.fillStyle = flash ? '#ffffff' : '#f4a261'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = wingCol; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#120824'; ctx.beginPath(); ctx.arc(0, 4, 6.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-6, -5, 3.8, 0, Math.PI * 2); ctx.arc(6, -5, 3.8, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'clown_ship') {
      ctx.fillStyle = flash ? '#ffffff' : wingCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, 4); ctx.bezierCurveTo(-28, -14, -32, 14, -14, 18); ctx.quadraticCurveTo(0, 24, 14, 18); ctx.bezierCurveTo(32, 14, 28, -14, 0, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00f5d4'; ctx.beginPath(); ctx.arc(-16, -6, 6, 0, Math.PI * 2); ctx.arc(16, -6, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(0, 2, 4.5, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'lollipop_ship') {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      roundRectPath(ctx, -4, 6, 8, 22, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = flash ? '#ffffff' : '#ff70a6'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, -4, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'].forEach((rc, idx) => {
        ctx.strokeStyle = flash ? '#ffffff' : rc; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 10, 26 - idx * 3, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      });
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 4, 10, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 4: КРАБ, ОСЬМИНОГ И МИНИ-КРАКЕН ---
  if (e.kind === 'crab_ship' || e.kind === 'octopus_ship' || e.kind === 'manta_wave' || e.kind === 'mini_kraken') {
    const seaHue = 170 + Math.sin(e.phase * 2.5) * 45;
    const pastel1 = `hsl(${seaHue}, 95%, 74%)`, pastel2 = `hsl(${(seaHue + 80) % 360}, 95%, 78%)`;
    e.wingCol = pastel1; e.bodyCol = pastel2;

    if (e.kind === 'crab_ship') {
      ctx.strokeStyle = pastel2; ctx.lineWidth = 3.2;
      [-8, -1, 6].forEach((ly, idx) => {
        const w = Math.sin(e.phase * 4 + idx) * 3;
        ctx.beginPath(); ctx.moveTo(-16, ly); ctx.quadraticCurveTo(-26, ly - 4 + w, -29, ly + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16, ly);  ctx.quadraticCurveTo(26, ly - 4 - w, 29, ly + 6);  ctx.stroke();
      });
      ctx.fillStyle = flash ? '#ffffff' : pastel1; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-7, 10, 2.5, 0, Math.PI * 2); ctx.arc(7, 10, 2.5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = pastel2; ctx.lineWidth = 4.5;
      for (let k = -2; k <= 2; k++) {
        const wave = Math.sin(e.phase * 3 + k) * 5;
        ctx.beginPath(); ctx.moveTo(k * 5, 6); ctx.quadraticCurveTo(k * 8 + wave, 18, k * 9, 26); ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : pastel1; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, -2, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: МЕДУЗЫ, ОСЬМИНОГИ, МОРСКИЕ ЗВЁЗДЫ И МИНИ-ПОДСОЛНУХИ ---
  const bioHue = 115 + Math.sin(e.phase * 3) * 35;
  const bioCol1 = `hsl(${bioHue}, 95%, 64%)`, bioCol2 = `hsl(${(bioHue + 65) % 360}, 95%, 72%)`;
  e.wingCol = bioCol1; e.bodyCol = bioCol2;

  if (e.kind === 'mini_flower') {
    ctx.save(); ctx.rotate(e.phase * 1.5);
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.ellipse(12, 0, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = flash ? '#ffffff' : '#3d1e05'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (e.kind === 'jellyfish_ship') {
    ctx.strokeStyle = bioCol2; ctx.lineWidth = 3.2;
    for (let t = -2.5; t <= 2.5; t += 1) {
      const sway = Math.sin(e.phase * 4 + t) * 6;
      ctx.beginPath(); ctx.moveTo(t * 5, 4); ctx.bezierCurveTo(t * 6 + sway, 14, t * 5 - sway, 22, t * 6 + sway * 0.5, 30); ctx.stroke();
    }
    ctx.fillStyle = flash ? '#ffffff' : bioCol1; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(0, 4, 20, Math.PI, 0); ctx.bezierCurveTo(22, 10, -22, 10, -20, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (e.kind === 'starfish_ship') {
    ctx.rotate(Math.sin(e.phase * 1.5) * 0.25);
    ctx.fillStyle = flash ? '#ffffff' : bioCol2; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 + Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 24, Math.sin(a) * 24);
      ctx.lineTo(Math.cos(a + Math.PI / 5) * 10, Math.sin(a + Math.PI / 5) * 10);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    ctx.strokeStyle = bioCol1; ctx.lineWidth = 4.5;
    for (let k = -2; k <= 2; k++) {
      const wave = Math.sin(e.phase * 3.5 + k) * 6;
      ctx.beginPath(); ctx.moveTo(k * 5, 8); ctx.quadraticCurveTo(k * 8 + wave, 20, k * 9, 29); ctx.stroke();
    }
    ctx.fillStyle = flash ? '#ffffff' : bioCol2; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -2, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// ДЕТАЛИЗИРОВАННЫЕ БОССЫ УРОВНЕЙ 1–6
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;

  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = lvl.id === 2 ? 'rgba(255, 190, 11, 0.85)' : 'rgba(155, 246, 255, 0.85)';
    ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    [-22 * bScale, 22 * bScale].forEach(ex => { ctx.beginPath(); ctx.moveTo(b.x + ex, b.y - 6); ctx.lineTo(b.laserX + ex * 0.6, H); ctx.stroke(); });
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [-22 * bScale, 22 * bScale].forEach((ex, idx) => {
      const startX = b.x + ex, startY = b.y - 6, endX = b.laserX + ex * 0.6;
      const beamCol = `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 64%)`;
      ctx.strokeStyle = beamCol; ctx.lineWidth = 22 * bScale; ctx.globalAlpha = 0.44;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6 * bScale; ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
    });
    ctx.restore();
  }

  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(bScale, bScale); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;
  const hue = Math.floor((b.time * 110) % 360);

  // --- БОСС 1: ОГРОМНАЯ ДЕТАЛИЗИРОВАННАЯ ПОЧТОВАЯ МАРКА С ПЕРФОРАЦИЕЙ, УЗОРАМИ И СПИРАЛЬЮ ---
  if (lvl.id === 1) {
    const stampW = 122, stampH = 136, halfW = 61, halfH = 68;
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${hue}, 95%, 60%)`;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 74%)`; ctx.lineWidth = 4;

    // Зубчатая перфорация по периметру
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    for (let i = 0; i < 8; i++) {
      const cx = -halfW + (stampW * (i + 0.5)) / 8;
      ctx.arc(cx, -halfH, 4.5, Math.PI, 0, true);
    }
    ctx.lineTo(halfW, -halfH);
    for (let i = 0; i < 9; i++) {
      const cy = -halfH + (stampH * (i + 0.5)) / 9;
      ctx.arc(halfW, cy, 4.5, -Math.PI / 2, Math.PI / 2, true);
    }
    ctx.lineTo(halfW, halfH);
    for (let i = 7; i >= 0; i--) {
      const cx = -halfW + (stampW * (i + 0.5)) / 8;
      ctx.arc(cx, halfH, 4.5, 0, Math.PI, true);
    }
    ctx.lineTo(-halfW, halfH);
    for (let i = 8; i >= 0; i--) {
      const cy = -halfH + (stampH * (i + 0.5)) / 9;
      ctx.arc(-halfW, cy, 4.5, Math.PI / 2, -Math.PI / 2, true);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Внутренняя тёмная рамка + декоративный орнамент по углам
    ctx.fillStyle = '#14052b'; roundRectPath(ctx, -halfW + 11, -halfH + 11, stampW - 22, stampH - 22, 8); ctx.fill();
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
    roundRectPath(ctx, -halfW + 15, -halfH + 15, stampW - 30, stampH - 30, 6); ctx.stroke();

    // Гипнотическая спираль и штемпель гашения
    ctx.save(); ctx.rotate(b.time * 4.5);
    ctx.strokeStyle = `hsl(${(hue + 90) % 360}, 100%, 62%)`; ctx.lineWidth = 4;
    ctx.beginPath();
    for (let t = 0; t < 38; t++) {
      const ang = t * 0.45, rad = t * 1.25;
      if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    }
    ctx.stroke(); ctx.restore();

    ctx.fillStyle = '#fee440'; ctx.font = '900 10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('POST 100µg', halfW - 18, -halfH + 26);

    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff006e';
      ctx.beginPath(); ctx.arc(ex + lookX, -13, 7.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#090214'; roundRectPath(ctx, -30, 14, 60, 28, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (let z = -20; z <= 20; z += 10) {
      ctx.beginPath(); ctx.moveTo(z - 4, 14); ctx.lineTo(z, 23); ctx.lineTo(z + 4, 14); ctx.fill();
      ctx.beginPath(); ctx.moveTo(z - 4, 42); ctx.lineTo(z, 33); ctx.lineTo(z + 4, 42); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- БОСС 2: ДЕТАЛИЗИРОВАННЫЙ МЕКСИКАНСКИЙ ЧЕРЕП (КАЛАВЕРА) С ПОЛОСКАМИ И 8 НОЖКАМИ ПАУКА ---
  if (lvl.id === 2) {
    // 8 суставчатых паучьих лап по бокам черепа
    const legCols = ['#ff002b', '#ffbe0b', '#06d6a0', '#3a86ff'];
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const wave = Math.sin(b.time * 6 + l * 1.4) * 10;
        const baseY = -12 + l * 12;
        ctx.strokeStyle = legCols[l]; ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(side * 42, baseY);
        ctx.quadraticCurveTo(side * 76, baseY - 22 + wave, side * 92, baseY + 24 - wave);
        ctx.stroke();
      }
    }

    // Купол черепа
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = '#ff002b'; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -14, 52, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(26, 52); ctx.lineTo(-26, 52);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Разноцветные полоски и узоры в мексиканском стиле (Калавера) на лбу и скулах
    ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, -44, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#06d6a0';
    ctx.beginPath(); ctx.moveTo(-36, -34); ctx.lineTo(-18, -46); ctx.moveTo(36, -34); ctx.lineTo(18, -46); ctx.stroke();
    ctx.strokeStyle = '#3a86ff';
    ctx.beginPath(); ctx.arc(-34, 14, 10, 0, Math.PI * 2); ctx.arc(34, 14, 10, 0, Math.PI * 2); ctx.stroke();

    // Цветочные глазницы черепа
    [-21, 21].forEach((ex, idx) => {
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#3a86ff';
      ctx.beginPath(); ctx.arc(ex, -6, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#090206';
      ctx.beginPath(); ctx.arc(ex, -6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
    });

    // Зубы челюсти
    ctx.fillStyle = '#ff002b'; roundRectPath(ctx, -22, 28, 44, 20, 6); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let tx = -16; tx <= 16; tx += 8) { roundRectPath(ctx, tx - 3, 28, 6, 18, 2); ctx.fill(); }
    ctx.restore();
    return;
  }

  // --- БОСС 3: ОГРОМНЫЙ ПРОРАБОТАННЫЙ ПОНЧИК С ПОСЫПКОЙ, ЗУБАМИ И РУКАМИ ---
  if (lvl.id === 3) {
    // Мультяшные руки в белых перчатках, бросающие пончики!
    [-1, 1].forEach(side => {
      const armWave = Math.sin(b.time * 5 + side) * 14;
      ctx.strokeStyle = '#ff70a6'; ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(side * 52, 8);
      ctx.quadraticCurveTo(side * 82, -10 + armWave, side * 90, 18 - armWave);
      ctx.stroke();

      // Перчатка и мини-пончик в руке
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(side * 90, 18 - armWave, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    // Тесто пончика
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Волнистая глазурь
    ctx.fillStyle = flash ? '#ffffff' : '#ff70a6'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (Math.PI * 2 * i) / 16, r = 49 + Math.sin(i * 3) * 4;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Разноцветная кондитерская посыпка на пончике
    const sprinkleCols = ['#fee440', '#00f5d4', '#9b5de5', '#ffffff', '#06d6a0'];
    [[-34, -22, 0.4], [34, -22, -0.5], [-38, 12, 0.8], [38, 12, -0.3], [0, -40, 0.1], [-22, -36, -0.7], [22, -36, 0.6]].forEach(([sx, sy, rot], idx) => {
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(rot);
      ctx.fillStyle = sprinkleCols[idx % sprinkleCols.length];
      roundRectPath(ctx, -6, -2.5, 12, 5, 2.5); ctx.fill();
      ctx.restore();
    });

    // Злобные глаза и зубастая пасть в центре кольца пончика
    [-21, 21].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, -12, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(ex + lookX, -11, 6, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#120824'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 16, 21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI * 2 * k) / 6;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 18, 16 + Math.sin(a) * 18, 3.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- БОСС 4: ОГРОМНЫЙ ОСЬМИНОГ С 8 ЩУПАЛЬЦАМИ, ЗЛОБНЫМИ ГЛАЗАМИ И ОСКАЛОМ ---
  if (lvl.id === 4) {
    const seaHue = 175 + Math.sin(b.time * 3.5) * 45;
    const bodyCol = `hsl(${seaHue}, 92%, 72%)`;

    // 8 щупалец
    for (let i = 0; i < 8; i++) {
      const t = i - 3.5;
      const waveX = Math.sin(b.time * 5 + i * 0.9) * 16;
      ctx.strokeStyle = `hsl(${(seaHue + i * 28) % 360}, 95%, 74%)`; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(t * 14, 22); ctx.quadraticCurveTo(t * 18 + waveX, 54, t * 21 - waveX * 0.5, 78); ctx.stroke();
    }

    ctx.fillStyle = flash ? '#ffffff' : bodyCol; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, -4, 54, Math.PI, 0); ctx.quadraticCurveTo(58, 32, 0, 34); ctx.quadraticCurveTo(-58, 32, -54, -4); ctx.closePath(); ctx.fill(); ctx.stroke();

    // Злобные глаза и зубастый оскал
    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, -8, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#03045e'; ctx.beginPath(); ctx.arc(ex + lookX, -7, 6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#03045e'; roundRectPath(ctx, -22, 12, 44, 16, 8); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let tx = -16; tx <= 16; tx += 8) { ctx.beginPath(); ctx.moveTo(tx - 3, 12); ctx.lineTo(tx, 19); ctx.lineTo(tx + 3, 12); ctx.fill(); }
    ctx.restore();
    return;
  }

  // --- БОСС 5: РАСТИТЕЛЬНЫЙ БОСС-ПОДСОЛНУХ С ЛИАНАМИ И ЦВЕТКАМИ ---
  if (lvl.id === 5) {
    // Хлещущие лианы с цветками
    ctx.strokeStyle = '#38b000'; ctx.lineWidth = 10;
    for (let v = 0; v < 4; v++) {
      const t = v - 1.5, whipX = Math.sin(b.time * 4.5 + v * 1.3) * 32;
      ctx.beginPath(); ctx.moveTo(t * 24, 24); ctx.bezierCurveTo(t * 36 + whipX, 55, t * 20 - whipX, 82, t * 32 + whipX * 0.6, 100); ctx.stroke();
    }

    // Золотые лепестки огромного Подсолнуха
    ctx.save(); ctx.rotate(b.time * 0.5);
    for (let i = 0; i < 14; i++) {
      ctx.rotate((Math.PI * 2) / 14);
      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ff9f1c'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, 32); ctx.quadraticCurveTo(14, 58, 0, 74); ctx.quadraticCurveTo(-14, 58, 0, 32); ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    // Тёмная сердцевина подсолнуха с семечками и злобной мордой
    ctx.fillStyle = flash ? '#ffffff' : '#3d1e05'; ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    [-16, 16].forEach(ex => {
      ctx.fillStyle = '#fee440'; ctx.beginPath(); ctx.arc(ex, -8, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d90429'; ctx.beginPath(); ctx.arc(ex + lookX, -8, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#1b4332'; roundRectPath(ctx, -20, 10, 40, 16, 8); ctx.fill();
    ctx.restore();
    return;
  }

  // --- БОСС 6: ОГРОМНЫЙ СТРАШНЫЙ МУХОМОР (мигает всеми цветами, лазеры + маленькие грибочки изо рта) ---
  const capCol = flash ? '#ffffff' : `hsl(${hue}, 100%, 54%)`;
  const spotCol = `hsl(${(hue + 160) % 360}, 100%, 76%)`;

  // Толстая ножка мухомора с зубастым ртом
  ctx.fillStyle = '#f8edeb'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-28, 0); ctx.quadraticCurveTo(-36, 36, -24, 62); ctx.lineTo(24, 62); ctx.quadraticCurveTo(36, 36, 28, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Огромная мигающая шляпка мухомора
  ctx.fillStyle = capCol; ctx.strokeStyle = spotCol; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 4, 66, Math.PI, 0);
  ctx.quadraticCurveTo(70, 22, 0, 16);
  ctx.quadraticCurveTo(-70, 22, -66, 4);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Белые и неоновые пятна на шляпке мухомора
  [[-36, -24, 9], [36, -24, 9], [0, -44, 11], [-18, -12, 7], [18, -12, 7]].forEach(([sx, sy, sr]) => {
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  });

  // Страшные глаза на ножке мухомора
  [-15, 15].forEach(ex => {
    ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.arc(ex, 22, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(ex + lookX, 22, 4.5, 0, Math.PI * 2); ctx.fill();
  });

  // Зубастая пасть, выплёвывающая маленькие мухоморчики
  ctx.fillStyle = '#14052b'; roundRectPath(ctx, -18, 36, 36, 18, 8); ctx.fill();
  ctx.fillStyle = '#ffffff';
  for (let z = -12; z <= 12; z += 8) {
    ctx.beginPath(); ctx.moveTo(z - 3, 36); ctx.lineTo(z, 43); ctx.lineTo(z + 3, 36); ctx.fill();
  }
  ctx.restore();
}
