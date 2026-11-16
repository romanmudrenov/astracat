'use strict';

const INK = '#100824';

// 5 МИНИАТЮРНЫХ ОБТЕКАЕМЫХ КОРАБЛЕЙ
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

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Облетай неоновые фракталы со знаком Ом (ॐ) и звёзды! В финале — гигантская психоделическая Почтовая Марка со спиралью!',
    enemiesDesc: 'Переливающиеся Психо-Глаза, Гриб-Крейсеры и Фрактал-Медузы',
    bossName: 'Психо-Марка Оракула',
    bossWeapon: 'Переливающиеся лучи изо рта и крутящиеся зелёные звёзды из глаз',
    theme: 'lsd',
    enemyTypes: ['psy_eye', 'shroom_cruiser', 'fractal_medusa'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Среди планет-черепов и углей летят мигающие Корабли-Летучие Мыши, Пауки и Скелеты! Босс — Огромный Пылающий Череп!',
    enemiesDesc: 'Летучие Мыши (ракеты), Корабли-Пауки (паутина) и Скелеты (лазеры)',
    bossName: 'Огромный Инферно-Череп',
    bossWeapon: 'Потоки огня изо рта, красные лазеры и лазерные сюрикены',
    theme: 'horror',
    enemyTypes: ['bat_ship', 'spider_ship', 'skeleton_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ff002b', bossColor: '#4a0e2e', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Атакуют мультяшные Корабли-Клоуны с пулями, Леденцы с ракетами и Радуги со спиральным глазом с лазерами!',
    enemiesDesc: 'Корабли-Клоуны (пули), Корабли-Леденцы (ракеты) и Радуги (лазеры)',
    bossName: 'Пончик-Мутант Глазурный',
    bossWeapon: 'Волны радуги изо рта и двойные лазеры из глаз',
    theme: 'rainbow',
    enemyTypes: ['clown_ship', 'lollipop_ship', 'rainbow_spiral'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Среди пастельных волн, пузырьков и рыбок плывут Корабли-Крабы и Корабли-Осьминоги! Облетай неоновые кораллы и водоросли!',
    enemiesDesc: 'Корабли-Крабы (гидро-лучи), Осьминоги (торпеды) и Скат-Зонды (волны)',
    bossName: 'Пастельный Кракен Глубин',
    bossWeapon: 'Лучи из щупалец, волновые удары изо рта и молнии из глаз',
    theme: 'underwater',
    enemyTypes: ['crab_ship', 'octopus_ship', 'manta_wave'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#9bf6ff', bossColor: '#48cae4', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудный Мир Био-Флоры',
    story: 'В изумрудных глубинах космоса дрейфуют Водоросли со щупальцами и атакуют био-корабли Медузы, Осьминоги и Морские Звёзды!',
    enemiesDesc: 'Корабли-Медузы (волны), Био-Осьминоги (ракеты) и Морские Звёзды (лазеры)',
    bossName: 'Император Флоры «Титан-Цветок»',
    bossWeapon: 'Вращающиеся лазерные цветки, хлещущие лианы и био-лазеры',
    theme: 'organic',
    enemyTypes: ['jellyfish_ship', 'octopus_bio', 'starfish_ship'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#80ed99', bossColor: '#38b000', hpMult: 2.10, coinReward: 1600
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

function drawWarts(ctx, spots, baseCol, hiCol) {
  spots.forEach(([x, y, r]) => {
    ctx.fillStyle = baseCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = hiCol;
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.42, 0, Math.PI * 2); ctx.fill();
  });
}

// =========================================================================
// АДАПТИВНЫЕ ТОЧКИ ПОДВЕСКИ ОРУЖИЯ ПОД КАЖДЫЙ ИЗ 5 КОРАБЛЕЙ
// =========================================================================
function getShipHardpoints(shipId) {
  if (shipId === 'green_hawk') {
    return { noseY: -22, pairX: 14, pairY: -6, wingX: 22, wingY: 2 };
  }
  if (shipId === 'blue_fish') {
    return { noseY: -23, pairX: 11, pairY: -8, wingX: 17, wingY: 0 };
  }
  if (shipId === 'heart_ship') {
    return { noseY: -21, pairX: 11, pairY: -12, wingX: 16, wingY: -4 };
  }
  if (shipId === 'stealth_wing') {
    return { noseY: -16, pairX: 14, pairY: -6, wingX: 27, wingY: 3 };
  }
  return { noseY: -22, pairX: 10, pairY: -8, wingX: 19, wingY: 2 };
}

// =========================================================================
// 5 МИНИАТЮРНЫХ ОБТЕКАЕМЫХ КОРАБЛЕЙ (используется и в бою, и в 3D-гараже)
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

  // Неоновая аура вокруг миниатюрного корабля
  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.22;
  ctx.beginPath(); ctx.arc(0, 0, 27, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Реактивная струя двигателей
  const flameH = 14 + Math.sin(time * 42) * 4.5;
  const thrusters = shipId === 'blue_fish' ? [0] : (shipId === 'stealth_wing' ? [-14, 0, 14] : [-7, 7]);
  thrusters.forEach(ox => {
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath();
    ctx.moveTo(ox - 3.5, 13);
    ctx.quadraticCurveTo(ox, 13 + flameH * 1.25, ox + 3.5, 13);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(ox - 1.8, 13);
    ctx.quadraticCurveTo(ox, 13 + flameH * 0.65, ox + 1.8, 13);
    ctx.closePath(); ctx.fill();
  });

  if (shipId === 'green_hawk') {
    // 2. ЗЕЛЁНЫЙ КОРАБЛЬ С ПЛАВНЫМИ КРЫЛЬЯМИ И РАКЕТАМИ
    ctx.fillStyle = wingCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.bezierCurveTo(-18, -10, -29, 0, -25, 13);
    ctx.quadraticCurveTo(-11, 9, 0, 13);
    ctx.quadraticCurveTo(11, 9, 25, 13);
    ctx.bezierCurveTo(29, 0, 18, -10, 0, -12);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Бортовые мини-ракеты под крыльями
    [-19, 19].forEach(rx => {
      ctx.fillStyle = '#e0fbfc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      roundRectPath(ctx, rx - 2.5, -5, 5, 14, 2.5);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff0054';
      ctx.beginPath(); ctx.arc(rx, -5, 2.6, Math.PI, 0); ctx.fill();
    });

    // Обтекаемый зелёный фюзеляж
    ctx.fillStyle = hullCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.bezierCurveTo(13, -12, 13, 10, 0, 19);
    ctx.bezierCurveTo(-13, 10, -13, -12, 0, -22);
    ctx.closePath(); ctx.fill(); ctx.stroke();

  } else if (shipId === 'blue_fish') {
    // 3. СИНИЙ КОРАБЛЬ В ФОРМЕ РЫБКИ С ВОРОНКОВОЙ ПУШКОЙ
    const tailWag = Math.sin(time * 12) * 3.5;
    // Плавный хвостовой плавник рыбки
    ctx.fillStyle = wingCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(-11 + tailWag, 21, -9 + tailWag, 26);
    ctx.quadraticCurveTo(0, 21, 9 + tailWag, 26);
    ctx.quadraticCurveTo(11 + tailWag, 21, 0, 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Боковые плавники рыбки
    ctx.beginPath();
    ctx.moveTo(-10, -2); ctx.quadraticCurveTo(-24, 2, -18, 12); ctx.quadraticCurveTo(-11, 9, -10, 5);
    ctx.moveTo(10, -2);  ctx.quadraticCurveTo(24, 2, 18, 12);  ctx.quadraticCurveTo(11, 9, 10, 5);
    ctx.fill(); ctx.stroke();

    // Обтекаемое синее тельце рыбки
    ctx.fillStyle = hullCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.bezierCurveTo(15, -13, 15, 8, 0, 17);
    ctx.bezierCurveTo(-15, 8, -15, -13, 0, -21);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Жаберные дуги и носовая воронковая пушка
    ctx.strokeStyle = hullDark;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-6, -4, 5, 0.3, 1.4);
    ctx.arc(6, -4, 5, Math.PI - 1.4, Math.PI - 0.3);
    ctx.stroke();

    // Воронковое сопло на носу рыбки
    ctx.fillStyle = '#03045e';
    ctx.strokeStyle = '#90e0ef';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -19); ctx.lineTo(-6, -24); ctx.lineTo(6, -24); ctx.lineTo(4, -19);
    ctx.closePath(); ctx.fill(); ctx.stroke();

  } else if (shipId === 'heart_ship') {
    // 4. СТИЛИЗОВАННЫЙ КОРАБЛЬ В ФОРМЕ СЕРДЦА
    ctx.fillStyle = hullCol;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.bezierCurveTo(10, -10, 23, -3, 21, 9);
    ctx.bezierCurveTo(19, 19, 6, 20, 0, 12);
    ctx.bezierCurveTo(-6, 20, -19, 19, -21, 9);
    ctx.bezierCurveTo(-23, -3, -10, -10, 0, -21);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Внутренний объёмный контур сердца
    ctx.fillStyle = hullDark;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.bezierCurveTo(7, -8, 16, -2, 14, 7);
    ctx.bezierCurveTo(12, 13, 4, 14, 0, 8);
    ctx.bezierCurveTo(-4, 14, -12, 13, -14, 7);
    ctx.bezierCurveTo(-16, -2, -7, -8, 0, -16);
    ctx.closePath();
    ctx.fill();

  } else if (shipId === 'stealth_wing') {
    // 5. КОРАБЛЬ В ФОРМЕ КРЫЛА С ЛАЗЕРНЫМИ И РАКЕТНЫМИ ПУШКАМИ
    ctx.fillStyle = hullCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.bezierCurveTo(14, -12, 26, -3, 31, 12);
    ctx.quadraticCurveTo(16, 8, 8, 13);
    ctx.lineTo(0, 9);
    ctx.lineTo(-8, 13);
    ctx.quadraticCurveTo(-16, 8, -31, 12);
    ctx.bezierCurveTo(-26, -3, -14, -12, 0, -16);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Лазерные пушки на законцовках крыла
    [-27, 27].forEach(lx => {
      ctx.fillStyle = '#f72585';
      roundRectPath(ctx, lx - 2, -2, 4, 13, 2);
      ctx.fill();
    });
    // Ракетные установки ближе к центру
    [-14, 14].forEach(rx => {
      ctx.fillStyle = '#7209b7';
      roundRectPath(ctx, rx - 3, -8, 6, 12, 2);
      ctx.fill();
    });

  } else {
    // 1. МИНИАТЮРНЫЙ КОТО-ШАТТЛ МК-1
    ctx.fillStyle = wingCol;
    ctx.strokeStyle = neonCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.bezierCurveTo(-15, -5, -24, 4, -21, 14);
    ctx.quadraticCurveTo(-10, 12, 0, 14);
    ctx.quadraticCurveTo(10, 12, 21, 14);
    ctx.bezierCurveTo(24, 4, 15, -5, 0, -9);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = hullCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.bezierCurveTo(13, -12, 13, 10, 0, 19);
    ctx.bezierCurveTo(-13, 10, -13, -12, 0, -21);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // Миниатюрный стеклянный купол и Астро-Кот в кабине
  ctx.fillStyle = '#48dbfb';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.ellipse(0, 0, 8.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ffb703';
  ctx.beginPath();
  ctx.moveTo(-5, -3); ctx.lineTo(-4, -8); ctx.lineTo(-1, -4);
  ctx.moveTo(5, -3);  ctx.lineTo(4, -8);  ctx.lineTo(1, -4);
  ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0.5, 5.8, 0, Math.PI * 2); ctx.fill();

  // Блик на стекле кабины
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.beginPath(); ctx.ellipse(-3, -4, 2.5, 4.2, -0.35, 0, Math.PI * 2); ctx.fill();

  // Визуальная адаптация выбранного оружия на корпусе корабля
  if (opts.weaponId) {
    const hp = getShipHardpoints(shipId);
    if (opts.weaponId === 'double_shot') {
      ctx.fillStyle = '#72efdd';
      [-hp.pairX, hp.pairX].forEach(wx => {
        roundRectPath(ctx, wx - 2, hp.pairY - 5, 4, 10, 2);
        ctx.fill();
      });
    } else if (opts.weaponId === 'rocket_launcher') {
      ctx.fillStyle = '#ff9f1c';
      [-hp.wingX, hp.wingX].forEach(wx => {
        roundRectPath(ctx, wx - 3, hp.wingY - 6, 6, 12, 2.5);
        ctx.fill();
      });
    } else if (opts.weaponId === 'wave_amp') {
      ctx.strokeStyle = '#f15bb5';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, hp.noseY - 2, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (opts.weaponId === 'electric_arc') {
      ctx.fillStyle = '#fee440';
      [-hp.pairX, hp.pairX].forEach(wx => {
        ctx.beginPath(); ctx.arc(wx, hp.pairY - 4, 3, 0, Math.PI * 2); ctx.fill();
      });
    }
  }

  ctx.restore();
}

// =========================================================================
// БОНУСЫ И СНАРЯДЫ ИГРОКА (включая вихревые кольца рыбки и сердца)
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

  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.28;
  ctx.beginPath(); ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1b1438';
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  if (bn.type === 'green_star' || bn.type === 'red_shield') {
    ctx.fillStyle = bn.type === 'green_star' ? '#06d6a0' : '#ff5964';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.lineTo(Math.cos(a + Math.PI / 5) * 6, Math.sin(a + Math.PI / 5) * 6);
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
  } else {
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => {
      ctx.beginPath(); ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    });
  }
  ctx.restore();
}

function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'heart_shot') {
    // Снаряд в форме светящегося сердца (корабль №4)
    ctx.fillStyle = '#ff4d6d';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(6, -14, 13, -6, 0, 8);
    ctx.bezierCurveTo(-13, -6, -6, -14, 0, -8);
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'vortex_ring') {
    // Вихревое воронковое кольцо (Синяя Рыбка №3)
    ctx.rotate(b.rot || 0);
    ctx.strokeStyle = '#90e0ef';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 1.6); ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(0, 0, b.r * 0.55, Math.PI, Math.PI * 2.5); ctx.stroke();
  } else if (b.kind === 'player_rocket') {
    // Самонаводящаяся ракета игрока
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = '#e0fbfc';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    roundRectPath(ctx, -3.5, -9, 7, 16, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath(); ctx.arc(0, -9, 3.6, Math.PI, 0); ctx.fill();
  } else if (b.kind === 'fractal_shuriken') {
    ctx.rotate(b.rot || 0);
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
    ctx.strokeStyle = '#fee440';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-6, -4); ctx.lineTo(5, 3); ctx.lineTo(0, 14); ctx.stroke();
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = b.color || '#f15bb5';
    ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (b.kind === 'wing_laser') {
    ctx.fillStyle = '#f72585';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, -2.5, -14, 5, 26, 2.5);
    ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = b.color || '#48dbfb';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// ПРЕПЯТСТВИЯ НА ПУТИ (на 5-м уровне — Водоросль со щупальцами!)
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const hue = Math.floor(((ob.phase || 0) * 95) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 66%)`;
  const dynamicNeon2 = `hsl(${(hue + 140) % 360}, 100%, 72%)`;

  if (ob.shape === 'om_fractal') {
    ctx.fillStyle = dynamicNeon;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.rotate(ob.rot || 0);
    ctx.strokeStyle = dynamicNeon;
    ctx.lineWidth = 2.5;
    for (let k = 0; k < 8; k++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(12, 0); ctx.quadraticCurveTo(22, -9, 30, 0); ctx.quadraticCurveTo(22, 9, 12, 0);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = '#1b0933';
    ctx.strokeStyle = dynamicNeon2;
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', 0, 1);
    ctx.restore();
    return;
  }

  if (ob.shape === 'neon_star_obstacle') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon2;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = dynamicNeon;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * (ob.r + 4), Math.sin(a) * (ob.r + 4));
      ctx.lineTo(Math.cos(a + Math.PI / 5) * (ob.r * 0.45), Math.sin(a + Math.PI / 5) * (ob.r * 0.45));
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (ob.shape === 'skull_bones' || ob.shape === 'blood_pentagram') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#e2ece9';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-24, -24); ctx.lineTo(24, 24);
    ctx.moveTo(24, -24);  ctx.lineTo(-24, 24);
    ctx.stroke();

    ctx.fillStyle = '#2b2333';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, -4, 18, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineTo(8, 17); ctx.lineTo(-8, 17);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff002b';
    ctx.beginPath(); ctx.arc(-6, -3, 4.5, 0, Math.PI * 2); ctx.arc(6, -3, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (ob.shape === 'rainbow_donut' || ob.shape === 'dream_bubble' || ob.shape === 'rainbow_cloud') {
    ctx.fillStyle = dynamicNeon;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'rainbow_donut') {
      ctx.rotate(ob.rot || 0);
      ctx.fillStyle = '#f4a261';
      ctx.strokeStyle = dynamicNeon;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, ob.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `hsl(${(hue + 40) % 360}, 95%, 62%)`;
      ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.82, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1447';
      ctx.beginPath(); ctx.arc(0, 0, ob.r * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (ob.shape === 'dream_bubble') {
      ctx.fillStyle = `hsl(${hue}, 90%, 88%)`;
      ctx.strokeStyle = dynamicNeon;
      ctx.lineWidth = 3;
      [[-12, 4, 14], [12, 4, 14], [-6, -8, 15], [8, -8, 15], [0, 2, 16]].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
    } else {
      ['#ff3366', '#ffee33', '#33ee88', '#33ccff'].forEach((rc, idx) => {
        ctx.strokeStyle = rc;
        ctx.lineWidth = 3.2;
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
    ctx.fillStyle = seaCol1;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = seaCol2;
    ctx.lineWidth = 7;
    [[-14, -18], [0, -24], [14, -16], [-20, -4], [20, -4]].forEach(([bx, by]) => {
      ctx.beginPath(); ctx.moveTo(0, 16); ctx.quadraticCurveTo(bx * 0.5, 0, bx, by); ctx.stroke();
      ctx.fillStyle = seaCol1;
      ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: ВОДОРОСЛЬ СО ЩУПАЛЬЦАМИ (заменила thorn_pod) ---
  ctx.fillStyle = '#80ed99';
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.arc(0, 0, ob.r + 11, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Извивающиеся зелёные щупальца с неоновыми присосками
  for (let t = -2; t <= 2; t++) {
    const sway = Math.sin((ob.phase || 0) * 3.5 + t * 1.3) * 9;
    const tipX = t * 11 + sway;
    const tipY = -24 + Math.abs(t) * 3;
    ctx.strokeStyle = t % 2 === 0 ? '#38b000' : '#80ed99';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(t * 4, 14);
    ctx.bezierCurveTo(t * 8 - sway, 2, t * 10 + sway, -12, tipX, tipY);
    ctx.stroke();

    // Светящаяся присоска на кончике щупальца
    ctx.fillStyle = '#ccff33';
    ctx.beginPath(); ctx.arc(tipX, tipY, 3.2, 0, Math.PI * 2); ctx.fill();
  }

  // Основание био-водоросли
  ctx.fillStyle = '#1b4332';
  ctx.strokeStyle = '#80ed99';
  ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.ellipse(0, 14, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.restore();
}

// =========================================================================
// ВРАГИ УРОВНЕЙ 1–5:
// - Уровень 3: Корабль-Клоун (пули), Корабль-Леденец (ракеты), Радуга со спиральным глазом (лазеры)
// - Уровень 4: Корабль-Краб (вместо вытянутого) и Корабль-Осьминог
// - Уровень 5: Медузы, Осьминоги и Морские Звёзды
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 95) % 360);

  // --- УРОВЕНЬ 2: ЛЕТУЧИЕ МЫШИ, ПАУКИ, СКЕЛЕТЫ ---
  if (e.kind === 'bat_ship' || e.kind === 'spider_ship' || e.kind === 'skeleton_ship') {
    const blink = 0.22 + 0.18 * Math.abs(Math.sin(e.phase * 5.5));
    const darkNeon = Math.sin(e.phase * 4) > 0 ? '#ff002b' : '#ff9f1c';

    ctx.fillStyle = darkNeon;
    ctx.globalAlpha = blink;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 11, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'bat_ship') {
      e.wingCol = '#590d22'; e.bodyCol = '#240b36';
      const flap = Math.sin(e.phase * 3.2) * 7;
      ctx.fillStyle = flash ? '#ffffff' : '#590d22';
      ctx.strokeStyle = darkNeon;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-18, -22, -32, -16 + flap, -30, 6 + flap);
      ctx.quadraticCurveTo(-20, 4 + flap, -15, 14 + flap);
      ctx.quadraticCurveTo(-8, 8, 0, 20);
      ctx.quadraticCurveTo(8, 8, 15, 14 + flap);
      ctx.quadraticCurveTo(20, 4 + flap, 30, 6 + flap);
      ctx.bezierCurveTo(32, -16 + flap, 18, -22, 0, -6);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.fillStyle = flash ? '#ffffff' : '#240b36';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(0, 2, 13, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(-5, 4, 3.8, 0, Math.PI * 2); ctx.arc(5, 4, 3.8, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'spider_ship') {
      e.wingCol = '#3c096c'; e.bodyCol = '#10002b';
      const legMove = Math.sin(e.phase * 4) * 4;
      ctx.strokeStyle = flash ? '#ffffff' : '#e0aaff';
      ctx.lineWidth = 3.2;
      [-12, -4, 4, 12].forEach((ly, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(-10, ly); ctx.quadraticCurveTo(-24, ly - 10 + legMove * dir, -28, ly + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, ly);  ctx.quadraticCurveTo(24, ly - 10 - legMove * dir, 28, ly + 8); ctx.stroke();
      });
      ctx.fillStyle = flash ? '#ffffff' : '#240046';
      ctx.strokeStyle = darkNeon;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(0, -6, 15, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 10, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(-5, 13, 2.8, 0, Math.PI * 2); ctx.arc(5, 13, 2.8, 0, Math.PI * 2); ctx.fill();
    } else {
      e.wingCol = '#e2ece9'; e.bodyCol = '#4a4e69';
      ctx.strokeStyle = flash ? '#ffffff' : '#e2ece9';
      ctx.lineWidth = 4;
      [-10, -2, 6].forEach(ry => {
        ctx.beginPath(); ctx.moveTo(-25, ry - 4); ctx.bezierCurveTo(-12, ry + 8, 12, ry + 8, 25, ry - 4); ctx.stroke();
      });
      ctx.fillStyle = flash ? '#ffffff' : '#f8edeb';
      ctx.strokeStyle = darkNeon;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 2, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(-5, 3, 3.8, 0, Math.PI * 2); ctx.arc(5, 3, 3.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: КОРАБЛЬ-КЛОУН (пули), КОРАБЛЬ-ЛЕДЕНЕЦ (ракеты), РАДУГА СО СПИРАЛЬЮ (лазеры) ---
  if (e.kind === 'clown_ship' || e.kind === 'lollipop_ship' || e.kind === 'rainbow_spiral') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    e.wingCol = wingCol; e.bodyCol = '#fff8eb';

    ctx.fillStyle = wingCol;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'clown_ship') {
      // МУЛЬТЯШНЫЙ КОРАБЛЬ-КЛОУН (стреляет пулями-конфетти)
      // Пышный радужный воротник-крылья
      ctx.fillStyle = flash ? '#ffffff' : wingCol;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-28, -14, -32, 14, -14, 18);
      ctx.quadraticCurveTo(0, 24, 14, 18);
      ctx.bezierCurveTo(32, 14, 28, -14, 0, 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Кудрявые цветные пучки волос клоуна по бокам головы
      ctx.fillStyle = '#00f5d4';
      ctx.beginPath(); ctx.arc(-16, -6, 6, 0, Math.PI * 2); ctx.arc(16, -6, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff006e';
      ctx.beginPath(); ctx.arc(-14, -12, 5, 0, Math.PI * 2); ctx.arc(14, -12, 5, 0, Math.PI * 2); ctx.fill();

      // Белое лицо-корпус клоуна
      ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Глаза, широкая улыбка и большой красный нос клоуна
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-5, -3, 2.2, 0, Math.PI * 2); ctx.arc(5, -3, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ff002b';
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 3, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(0, 2, 4.5, 0, Math.PI * 2); ctx.fill();

    } else if (e.kind === 'lollipop_ship') {
      // СТРЕЛЯЮЩИЙ КОРАБЛЬ В ФОРМЕ ЛЕДЕНЦА НА ПАЛОЧКЕ (выпускает ракеты)
      // Белая палочка-фюзеляж с ракетными соплами
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      roundRectPath(ctx, -4, 6, 8, 22, 4);
      ctx.fill(); ctx.stroke();

      // Бантик на палочке леденца
      ctx.fillStyle = '#ff006e';
      ctx.beginPath();
      ctx.moveTo(0, 12); ctx.lineTo(-11, 7); ctx.lineTo(-11, 17);
      ctx.moveTo(0, 12); ctx.lineTo(11, 7);  ctx.lineTo(11, 17);
      ctx.closePath(); ctx.fill();

      // Большой круглый леденец со спиралью
      ctx.fillStyle = flash ? '#ffffff' : '#ff70a6';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, -4, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.save();
      ctx.translate(0, -4);
      ctx.rotate(e.phase * 3);
      ctx.strokeStyle = '#fee440';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t < 18; t++) {
        const ang = t * 0.5;
        const rad = t * 0.8;
        if (t === 0) ctx.moveTo(0, 0);
        else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
      }
      ctx.stroke();
      ctx.restore();

    } else {
      // РАДУГА С ГЛАЗОМ В ФОРМЕ СПИРАЛИ (стреляет лазерами)
      const rCols = ['#ff3366', '#ff9933', '#ffee33', '#33ee88', '#33ccff', '#aa66ff'];
      rCols.forEach((rc, idx) => {
        ctx.strokeStyle = flash ? '#ffffff' : rc;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 10, 26 - idx * 3, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      });
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-22, 11, 7, 0, Math.PI * 2); ctx.arc(22, 11, 7, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.save();
      ctx.translate(0, 4);
      ctx.rotate(e.phase * 4);
      ctx.strokeStyle = '#ff006e';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let t = 0; t < 18; t++) {
        const ang = t * 0.55;
        const rad = t * 0.48;
        if (t === 0) ctx.moveTo(0, 0);
        else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 4: МУЛЬТЯШНЫЙ КОРАБЛЬ-КРАБ И ОСЬМИНОЖКИ ---
  if (e.kind === 'crab_ship' || e.kind === 'octopus_ship' || e.kind === 'manta_wave') {
    const seaHue = 170 + Math.sin(e.phase * 2.5) * 45;
    const pastel1 = `hsl(${seaHue}, 95%, 74%)`;
    const pastel2 = `hsl(${(seaHue + 80) % 360}, 95%, 78%)`;
    e.wingCol = pastel1; e.bodyCol = pastel2;

    ctx.fillStyle = pastel1;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'crab_ship') {
      // МУЛЬТЯШНЫЙ КОРАБЛЬ-КРАБ С КЛЕШНЯМИ И БОКОВЫМИ ЛАПКАМИ
      const pinch = Math.sin(e.phase * 5) * 0.25;
      // 6 боковых лапок краба
      ctx.strokeStyle = pastel2;
      ctx.lineWidth = 3.2;
      [-8, -1, 6].forEach((ly, idx) => {
        const w = Math.sin(e.phase * 4 + idx) * 3;
        ctx.beginPath(); ctx.moveTo(-16, ly); ctx.quadraticCurveTo(-26, ly - 4 + w, -29, ly + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16, ly);  ctx.quadraticCurveTo(26, ly - 4 - w, 29, ly + 6);  ctx.stroke();
      });

      // Две большие изогнутые клешни спереди
      [-16, 16].forEach((cx, idx) => {
        const side = idx === 0 ? -1 : 1;
        ctx.save();
        ctx.translate(cx, 12);
        ctx.rotate(side * pinch);
        ctx.fillStyle = flash ? '#ffffff' : pastel2;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 6, 8, 0, Math.PI * 1.65);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      });

      // Широкий овальный панцирь краба
      ctx.fillStyle = flash ? '#ffffff' : pastel1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Глазки на стебельках
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-7, 10, 4, 0, Math.PI * 2); ctx.arc(7, 10, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-7, 11, 2, 0, Math.PI * 2); ctx.arc(7, 11, 2, 0, Math.PI * 2); ctx.fill();

    } else {
      // Осьминожки 4-го уровня
      ctx.strokeStyle = pastel2;
      ctx.lineWidth = 4.5;
      for (let k = -2; k <= 2; k++) {
        const wave = Math.sin(e.phase * 3 + k) * 5;
        ctx.beginPath(); ctx.moveTo(k * 5, -10); ctx.quadraticCurveTo(k * 8 + wave, -24, k * 9, -30); ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : pastel1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 2, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-6, 6, 3.2, 0, Math.PI * 2); ctx.arc(6, 6, 3.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: МЕДУЗЫ, ОСЬМИНОГИ И МОРСКИЕ ЗВЁЗДЫ ---
  if (e.kind === 'jellyfish_ship' || e.kind === 'octopus_bio' || e.kind === 'starfish_ship') {
    const bioHue = 115 + Math.sin(e.phase * 3) * 35;
    const bioCol1 = `hsl(${bioHue}, 95%, 64%)`;
    const bioCol2 = `hsl(${(bioHue + 65) % 360}, 95%, 72%)`;
    e.wingCol = bioCol1; e.bodyCol = bioCol2;

    ctx.fillStyle = bioCol1;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'jellyfish_ship') {
      ctx.strokeStyle = bioCol2;
      ctx.lineWidth = 3.2;
      for (let t = -2.5; t <= 2.5; t += 1) {
        const sway = Math.sin(e.phase * 4 + t) * 6;
        ctx.beginPath(); ctx.moveTo(t * 5, 4); ctx.bezierCurveTo(t * 6 + sway, 14, t * 5 - sway, 22, t * 6 + sway * 0.5, 30); ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : bioCol1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 4, 20, Math.PI, 0); ctx.bezierCurveTo(22, 10, -22, 10, -20, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (e.kind === 'starfish_ship') {
      ctx.rotate(Math.sin(e.phase * 1.5) * 0.25);
      ctx.fillStyle = flash ? '#ffffff' : bioCol2;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 + Math.PI / 2;
        const tipX = Math.cos(a) * 24;
        const tipY = Math.sin(a) * 24;
        const nextA = a + Math.PI / 5;
        const valX = Math.cos(nextA) * 10;
        const valY = Math.sin(nextA) * 10;
        if (i === 0) ctx.moveTo(tipX, tipY);
        else ctx.lineTo(tipX, tipY);
        ctx.quadraticCurveTo(valX, valY, Math.cos(a + (Math.PI * 2) / 5) * 24, Math.sin(a + (Math.PI * 2) / 5) * 24);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-5, 1, 2.2, 0, Math.PI * 2); ctx.arc(5, 1, 2.2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = bioCol1;
      ctx.lineWidth = 4.5;
      for (let k = -2; k <= 2; k++) {
        const wave = Math.sin(e.phase * 3.5 + k) * 6;
        ctx.beginPath(); ctx.moveTo(k * 5, 8); ctx.quadraticCurveTo(k * 8 + wave, 20, k * 9, 29); ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : bioCol2;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, -2, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1 («Туманность Узоров») ---
  const bodyCol = `hsl(${hue}, 92%, 56%)`;
  const wingCol = `hsl(${(hue + 110) % 360}, 95%, 60%)`;
  const domeCol = `hsl(${(hue + 220) % 360}, 95%, 68%)`;
  e.wingCol = wingCol; e.bodyCol = bodyCol;

  ctx.fillStyle = flash ? '#ffffff' : wingCol;
  ctx.strokeStyle = domeCol;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(0, 4); ctx.bezierCurveTo(-18, -14, -30, -4, -24, 15); ctx.quadraticCurveTo(0, 22, 24, 15); ctx.bezierCurveTo(30, -4, 18, -14, 0, 4);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.ellipse(0, 2, 14, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath(); ctx.ellipse(0, 3, 7.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// =========================================================================
// БОССЫ УРОВНЕЙ 1–5
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;

  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = lvl.id === 2 ? 'rgba(255, 0, 43, 0.85)' : (lvl.id === 5 ? 'rgba(128, 237, 153, 0.85)' : 'rgba(155, 246, 255, 0.85)');
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    [-22 * bScale, 22 * bScale].forEach(ex => {
      ctx.beginPath(); ctx.moveTo(b.x + ex, b.y - 6); ctx.lineTo(b.laserX + ex * 0.6, H); ctx.stroke();
    });
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    [-22 * bScale, 22 * bScale].forEach((ex, idx) => {
      const startX = b.x + ex;
      const startY = b.y - 6;
      const endX = b.laserX + ex * 0.6;
      const beamCol = lvl.id === 2 ? '#ff002b' : (lvl.id === 5 ? '#70e000' : `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 66%)`);

      ctx.strokeStyle = beamCol; ctx.lineWidth = 22 * bScale; ctx.globalAlpha = 0.44;
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
  const hue = Math.floor((b.time * 110) % 360);

  if (lvl.id === 1) {
    // Психоделическая Почтовая Марка
    const stampW = 114, stampH = 128, halfW = 57, halfH = 64;
    ctx.fillStyle = flash ? '#ffffff' : `hsl(${hue}, 95%, 58%)`;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 72%)`;
    ctx.lineWidth = 4;
    roundRectPath(ctx, -halfW, -halfH, stampW, stampH, 12);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#14052b';
    roundRectPath(ctx, -halfW + 10, -halfH + 10, stampW - 20, stampH - 20, 8);
    ctx.fill();

    ctx.save();
    ctx.rotate(b.time * 4.5);
    ctx.strokeStyle = `hsl(${(hue + 90) % 360}, 100%, 62%)`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let t = 0; t < 36; t++) {
      const ang = t * 0.45, rad = t * 1.25;
      if (t === 0) ctx.moveTo(0, 0);
      else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    }
    ctx.stroke();
    ctx.restore();

    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff006e';
      ctx.beginPath(); ctx.arc(ex + lookX, -13, 7.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#090214';
    roundRectPath(ctx, -30, 12, 60, 28, 12);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  if (lvl.id === 2) {
    // Огромный Пылающий Череп
    const fireFlash = Math.sin(b.time * 14) > 0;
    const skullGlow = fireFlash ? '#ff002b' : '#ffbe0b';
    ctx.fillStyle = flash ? '#ffffff' : '#f8edeb';
    ctx.strokeStyle = skullGlow;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -12, 54, Math.PI * 0.82, Math.PI * 2.18);
    ctx.lineTo(26, 54); ctx.lineTo(-26, 54);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    [-22, 22].forEach(ex => {
      ctx.fillStyle = '#090206';
      ctx.beginPath(); ctx.ellipse(ex, -6, 16, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = skullGlow;
      ctx.beginPath(); ctx.arc(ex + lookX, -5, 8.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#ff6b35';
    roundRectPath(ctx, -22, 30, 44, 20, 6);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (lvl.id === 5) {
    ctx.save();
    ctx.rotate(b.time * 0.65);
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = i % 2 === 0 ? '#d90429' : '#7209b7';
      ctx.strokeStyle = '#80ed99';
      ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(22, 52, 0, 72); ctx.quadraticCurveTo(-22, 52, 0, 18);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = flash ? '#ffffff' : '#1b4332';
    ctx.strokeStyle = '#80ed99';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [-18, 18].forEach(ex => {
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(ex, -8, 12, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // Боссы уровней 3 и 4
  ctx.fillStyle = flash ? '#ffffff' : (lvl.id === 4 ? '#48cae4' : `hsl(${hue}, 95%, 64%)`);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.arc(0, 0, 56, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  [-22, 22].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ex, -8, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff006e';
    ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}
