javascript
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

const DRONES_CATALOG = [
  {
    id: 'cat_orb',
    name: '1. Кото-Спутник «Мур-Орбита»',
    desc: 'Орбитальный дрон с неоновыми ушками • Стреляет быстрыми плазменными импульсами.',
    price: 0,
    fireInterval: 0.68,
    dmgMult: 0.60,
    magnetRange: 0,
    coinBonus: 0,
    mainColor: '#90e0ef',
    accentColor: '#ff85a1',
    coreColor: '#ffd166'
  },
  {
    id: 'prism_guard',
    name: '2. Кристальный Страж «Призма-Х»',
    desc: 'Магнитный дрон-перехватчик • Притягивает бонусы (175px) и бьёт лазерами.',
    price: 1450,
    fireInterval: 0.56,
    dmgMult: 0.95,
    magnetRange: 175,
    coinBonus: 0.12,
    mainColor: '#72efdd',
    accentColor: '#c77dff',
    coreColor: '#00f5d4'
  },
  {
    id: 'neon_jelly',
    name: '3. Психо-Медуза «Неон-Спрут»',
    desc: 'Био-кибер дрон • Самонаводящиеся цепные молнии +25% к сбору рыбки 🐟!',
    price: 2950,
    fireInterval: 0.46,
    dmgMult: 1.30,
    magnetRange: 130,
    coinBonus: 0.25,
    mainColor: '#ff70a6',
    accentColor: '#fee440',
    coreColor: '#f72585'
  }
];

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Стреляй в Зеркальные Порталы, чтобы бить врагов в спину! Босс — Огромная Психо-Марка!',
    enemiesDesc: 'Фрактал-Корабли, Мини-Марки и Кубики Рубика',
    bossName: 'Психо-Марка Оракула',
    theme: 'lsd',
    interactiveType: 'mirror_portal',
    enemyTypes: ['fractal_ship', 'mini_stamp', 'rubik_cube'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Сбивай Черепа-Пиньяты для взрыва конфетти и оглушения врагов! Босс — Мексиканский Череп-Паук!',
    enemiesDesc: 'Неоновые Калавера-Мыши, Пауки, Скелеты и Мини-Черепа',
    bossName: 'Калавера-Паук Инферно',
    theme: 'horror',
    interactiveType: 'pinata_skull',
    enemyTypes: ['bat_ship', 'spider_ship', 'skeleton_ship', 'mini_skull'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ffbe0b', bossColor: '#ff002b', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Залетай в Карамельные Ускорители для турбо-стрельбы! Босс — Огромный Пончик-Метатель!',
    enemiesDesc: 'Клоуны, Леденцы, Радуги и Мини-Пончики',
    bossName: 'Пончик-Метатель Глазурный',
    theme: 'rainbow',
    interactiveType: 'candy_booster',
    enemyTypes: ['clown_ship', 'lollipop_ship', 'rainbow_spiral', 'mini_donut'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Лови врагов в Гигантские Мыльные Пузыри или ныряй в них за щитом! Босс — Пастельный Кракен!',
    enemiesDesc: 'Корабли-Крабы, Осьминоги и Мини-Кракены',
    bossName: 'Пастельный Кракен Глубин',
    theme: 'underwater',
    interactiveType: 'giant_bubble',
    enemyTypes: ['crab_ship', 'octopus_ship', 'manta_wave', 'mini_kraken'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#9bf6ff', bossColor: '#48cae4', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудный Мир Био-Флоры',
    story: 'Используй Цветки-Батуты для рикошета пуль под углом! Босс — Император Подсолнух!',
    enemiesDesc: 'Медузы, Био-Осьминоги, Морские Звёзды и Мини-Подсолнухи',
    bossName: 'Император Флоры «Подсолнух»',
    theme: 'organic',
    interactiveType: 'flower_bumper',
    enemyTypes: ['jellyfish_ship', 'octopus_bio', 'starfish_ship', 'mini_flower'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#80ed99', bossColor: '#38b000', hpMult: 2.05, coinReward: 1500
  },
  {
    id: 6,
    name: 'Грибная Галактика',
    story: 'Собирай Золотые Психо-Споры для замедления времени и веерного залпа! Босс — Страшный Мухомор!',
    enemiesDesc: 'Злобные Мухоморы, Грибы-Корабли, Полип-Грибы и Бактерии',
    bossName: 'Владыка Спор «Мега-Мухомор»',
    theme: 'mushroom',
    interactiveType: 'psy_spore',
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

function drawGlossyCircle(ctx, x, y, r, mainCol) {
  ctx.fillStyle = mainCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(18, 8, 38, 0.24)';
  ctx.beginPath(); ctx.arc(x, y + r * 0.14, r * 0.86, 0.15 * Math.PI, 0.85 * Math.PI); ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.28, y - r * 0.36, r * 0.42, r * 0.22, -0.35, 0, Math.PI * 2); ctx.fill();
}

function drawCartoonEyes(ctx, e, leftX, rightX, eyeY, eyeR, irisCol = '#ff006e', player = null) {
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

  [leftX, rightX].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = irisCol;
    ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.58, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(ex + lookX, eyeY + lookY, eyeR * 0.30, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ex + lookX - eyeR * 0.22, eyeY + lookY - eyeR * 0.22, eyeR * 0.22, 0, Math.PI * 2); ctx.fill();
  });
}

function drawEliteCrown(ctx, yTop) {
  ctx.save();
  ctx.translate(0, yTop);
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-11, 0); ctx.lineTo(-13, -11); ctx.lineTo(-5, -5); ctx.lineTo(0, -14); ctx.lineTo(5, -5); ctx.lineTo(13, -11); ctx.lineTo(11, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff006e';
  ctx.beginPath(); ctx.arc(0, -4, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawDroneModel(ctx, drone, time, opts = {}) {
  const id = (drone && drone.id) || 'cat_orb';
  const mainCol = (drone && drone.mainColor) || '#90e0ef';
  const accentCol = (drone && drone.accentColor) || '#ff85a1';
  const coreCol = (drone && drone.coreColor) || '#ffd166';
  const scale = opts.scale || 1.0;

  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.fillStyle = mainCol;
  ctx.globalAlpha = 0.24;
  ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  if (id === 'prism_guard') {
    const waveR = 14 + ((time * 18) % 10);
    ctx.strokeStyle = coreCol;
    ctx.globalAlpha = Math.max(0.1, 1 - (waveR - 14) / 10);
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, waveR, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.rotate(time * 2.8);
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = k % 2 === 0 ? accentCol : mainCol;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(9, 0); ctx.lineTo(16, -4); ctx.lineTo(19, 0); ctx.lineTo(16, 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 12); ctx.lineTo(-10, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = coreCol;
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(5, 0); ctx.lineTo(0, 6); ctx.lineTo(-5, 0);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-2.5, -3.5, 2, 0, Math.PI * 2); ctx.fill();

  } else if (id === 'neon_jelly') {
    for (let t = -1.5; t <= 1.5; t += 1) {
      const wag = Math.sin(time * 7 + t * 1.6) * 4;
      ctx.strokeStyle = t % 2 === 0 ? accentCol : mainCol;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(t * 4.5, 4);
      ctx.quadraticCurveTo(t * 5.5 + wag, 11, t * 4 - wag * 0.7, 17);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(t * 4 - wag * 0.7, 17, 1.4, 0, Math.PI * 2); ctx.fill();
    }

    const pulse = 1 + Math.sin(time * 5.5) * 0.08;
    ctx.save();
    ctx.scale(pulse, 2 - pulse);
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 2, 12, Math.PI, 0);
    ctx.quadraticCurveTo(13, 7, 0, 6);
    ctx.quadraticCurveTo(-13, 7, -12, 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = accentCol;
    ctx.beginPath(); ctx.arc(-5, -3, 2.2, 0, Math.PI * 2); ctx.arc(5, -3, 2.2, 0, Math.PI * 2); ctx.arc(0, -6, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-3.5, 1.5, 1.6, 0, Math.PI * 2); ctx.arc(3.5, 1.5, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-4, 1, 0.7, 0, Math.PI * 2); ctx.arc(3, 1, 0.7, 0, Math.PI * 2); ctx.fill();

  } else {
    ctx.save();
    ctx.rotate(Math.sin(time * 2.5) * 0.35);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(0, 1, 16, 5.5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = accentCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -5); ctx.lineTo(-9, -14); ctx.lineTo(-2, -9);
    ctx.moveTo(8, -5);  ctx.lineTo(9, -14);  ctx.lineTo(2, -9);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    drawGlossyCircle(ctx, 0, 0, 10.5, mainCol);

    ctx.fillStyle = '#14082e';
    roundRectPath(ctx, -7, -3.5, 14, 6.5, 3.2);
    ctx.fill();

    ctx.fillStyle = coreCol;
    ctx.beginPath(); ctx.arc(-3.2, -0.2, 1.7, 0, Math.PI * 2); ctx.arc(3.2, -0.2, 1.7, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = accentCol;
    ctx.beginPath(); ctx.arc(0, 10.5, 2.8, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

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
    ctx.strokeStyle = pr.pairIdx === 0 ? '#00f5d4' : '#f72585';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, pr.r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
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
    const rCols = ['#ff3366', '#ffee33', '#33ee88', '#33ccff'];
    rCols.forEach((c, idx) => {
      ctx.strokeStyle = c; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, 0, pr.r - idx * 4, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.fillStyle = '#ffffff'; ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 0, 1);
  } else if (pr.type === 'giant_bubble') {
    ctx.fillStyle = 'rgba(155, 246, 255, 0.25)';
    ctx.strokeStyle = '#9bf6ff';
    ctx.lineWidth = 3;
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
    ctx.strokeStyle = '#fee440'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-6, -4); ctx.lineTo(5, 3); ctx.lineTo(0, 14); ctx.stroke();
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = b.color || '#f15bb5'; ctx.lineWidth = 5.5; ctx.beginPath(); ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (b.kind === 'wing_laser') {
    ctx.fillStyle = b.color || '#f72585'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; roundRectPath(ctx, -2.5, -14, 5, 26, 2.5); ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = b.color || '#48dbfb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.8, b.r * 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
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
      ctx.fillStyle = dynamicNeon2; ctx.beginPath(); ctx.arc(0, 0, 11, Math.PI, 0); ctx.fill();
      ctx.restore();
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
    ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-24, -24); ctx.lineTo(24, 24); ctx.moveTo(24, -24); ctx.lineTo(-24, 24); ctx.stroke();
    drawGlossyCircle(ctx, 0, -2, 18, '#fff8eb');
    ctx.strokeStyle = '#ff006e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-6, -3, 6, 0, Math.PI * 2); ctx.arc(6, -3, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#06d6a0'; ctx.beginPath(); ctx.arc(-6, -3, 3.8, 0, Math.PI * 2); ctx.arc(6, -3, 3.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  if (ob.shape === 'rainbow_donut' || ob.shape === 'dream_bubble' || ob.shape === 'rainbow_cloud') {
    ctx.rotate(ob.rot || 0);
    drawGlossyCircle(ctx, 0, 0, ob.r, '#f4a261');
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
  drawGlossyCircle(ctx, 0, 12, 13, '#1b4332');
  ctx.restore();
}

function drawCalaveraOrnament(ctx, leftX, rightX, eyeY, eyeR, cPetal, cAccent, cGlow) {
  [leftX, rightX].forEach((ex, idx) => {
    const ringCol = idx === 0 ? cPetal : cGlow;
    ctx.fillStyle = ringCol;
    for (let p = 0; p < 8; p++) {
      const a = (Math.PI * 2 * p) / 8;
      ctx.beginPath();
      ctx.arc(ex + Math.cos(a) * (eyeR + 1.8), eyeY + Math.sin(a) * (eyeR + 1.8), 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = cAccent;
  ctx.beginPath();
  ctx.arc(0, eyeY - 9, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cPetal;
  ctx.beginPath();
  ctx.arc(0, eyeY - 9, 1.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cPetal;
  ctx.beginPath();
  ctx.moveTo(0, eyeY + 4.5);
  ctx.lineTo(-2.4, eyeY + 8.5);
  ctx.lineTo(2.4, eyeY + 8.5);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = cGlow;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(leftX - 3, eyeY + 7, 2.5, 0.2, Math.PI * 1.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rightX + 3, eyeY + 7, 2.5, -Math.PI * 0.4, Math.PI * 0.8);
  ctx.stroke();
}

function drawUniqueEnemy(ctx, e, player = null) {
  ctx.save(); ctx.translate(e.x, e.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (e.isElite) ctx.scale(1.18, 1.18);

  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 105) % 360);

  if (e.isElite) {
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(0, 0, e.r + 8, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }

  if (e.kind === 'evil_flyagaric' || e.kind === 'mini_flyagaric') {
    const capCol = e.kind === 'mini_flyagaric' ? `hsl(${hue}, 95%, 56%)` : '#ff002b';
    e.wingCol = capCol; e.bodyCol = '#ffffff';
    const breathe = 1 + Math.sin(e.phase * 4) * 0.06;
    ctx.scale(breathe, 2 - breathe);

    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRectPath(ctx, -8, 0, 16, 21, 7); ctx.fill(); ctx.stroke();

    ctx.fillStyle = flash ? '#ffffff' : capCol; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.quadraticCurveTo(22, 9, 0, 7); ctx.quadraticCurveTo(-22, 9, -21, 2); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    [[-10, -8, 3.4], [10, -7, 3.2], [0, -13, 4]].forEach(([sx, sy, sr]) => { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
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
    const calaveraNeon = ['#ff006e', '#ffbe0b', '#06d6a0', '#00f5d4', '#c77dff'];
    const idx = Math.floor(e.phase * 1.2) % calaveraNeon.length;
    const cPetal = calaveraNeon[idx];
    const cAccent = calaveraNeon[(idx + 1) % calaveraNeon.length];
    const cGlow = calaveraNeon[(idx + 2) % calaveraNeon.length];
    e.wingCol = cPetal;
    e.bodyCol = '#fff8eb';

    if (e.kind === 'bat_ship') {
      const flap = Math.sin(e.phase * 4.2) * 7;
      ctx.fillStyle = flash ? '#ffffff' : cPetal;
      ctx.strokeStyle = cGlow;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-18, -22, -33, -15 + flap, -31, 7 + flap);
      ctx.quadraticCurveTo(-22, 4 + flap * 0.5, -15, 11);
      ctx.quadraticCurveTo(-7, 7, 0, 16);
      ctx.quadraticCurveTo(7, 7, 15, 11);
      ctx.quadraticCurveTo(22, 4 + flap * 0.5, 31, 7 + flap);
      ctx.bezierCurveTo(33, -15 + flap, 18, -22, 0, -6);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.strokeStyle = cAccent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-10, -2); ctx.lineTo(-25, 2 + flap * 0.7);
      ctx.moveTo(10, -2);  ctx.lineTo(25, 2 + flap * 0.7);
      ctx.stroke();
    } else if (e.kind === 'spider_ship') {
      [-10, 0, 10].forEach((ly, li) => {
        const legSwing = Math.sin(e.phase * 5 + li) * 3.5;
        ctx.strokeStyle = li % 2 === 0 ? cPetal : cGlow;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(-11, ly); ctx.lineTo(-21, ly - 5 + legSwing); ctx.lineTo(-28, ly + 8);
        ctx.moveTo(11, ly);  ctx.lineTo(21, ly - 5 - legSwing);  ctx.lineTo(28, ly + 8);
        ctx.stroke();
      });
    } else if (e.kind === 'skeleton_ship') {
      ctx.strokeStyle = cGlow;
      ctx.lineWidth = 3.2;
      [-7, 0, 7].forEach((ry, ri) => {
        const w = 24 - ri * 3;
        ctx.beginPath();
        ctx.moveTo(-w, ry); ctx.quadraticCurveTo(0, ry + 6, w, ry);
        ctx.stroke();
      });
    } else if (e.kind === 'mini_skull') {
      ctx.save();
      ctx.rotate(e.phase * 0.8);
      for (let m = 0; m < 10; m++) {
        ctx.rotate((Math.PI * 2) / 10);
        ctx.fillStyle = m % 2 === 0 ? '#ffbe0b' : '#ff006e';
        ctx.beginPath(); ctx.arc(20, 0, 4.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    const skR = e.kind === 'mini_skull' ? 17 : 15;
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
    ctx.strokeStyle = cPetal;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, -3, skR, Math.PI * 0.84, Math.PI * 2.16);
    ctx.lineTo(skR * 0.56, skR + 4);
    ctx.lineTo(-skR * 0.56, skR + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-skR * 0.45, skR + 0.5); ctx.lineTo(skR * 0.45, skR + 0.5);
    ctx.moveTo(-3, skR - 2); ctx.lineTo(-3, skR + 3.5);
    ctx.moveTo(3, skR - 2);  ctx.lineTo(3, skR + 3.5);
    ctx.stroke();

    drawCalaveraOrnament(ctx, -6, 6, -2, 4.3, cPetal, cAccent, cGlow);
    drawCartoonEyes(ctx, e, -6, 6, -2, 4.1, cGlow, player);

    if (e.isElite) drawEliteCrown(ctx, -skR - 5);
    ctx.restore(); return;
  }

  if (e.kind === 'clown_ship' || e.kind === 'lollipop_ship' || e.kind === 'rainbow_spiral' || e.kind === 'mini_donut') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    e.wingCol = wingCol; e.bodyCol = '#fff8eb';

    if (e.kind === 'clown_ship') {
      ctx.fillStyle = '#00f5d4'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-16, -6, 6.5, 0, Math.PI * 2); ctx.arc(16, -6, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawGlossyCircle(ctx, 0, 0, 16, flash ? '#ffffff' : '#fff8eb');
      drawCartoonEyes(ctx, e, -6, 6, -3, 4.2, '#3a86ff', player);
      ctx.fillStyle = '#ff002b'; ctx.beginPath(); ctx.arc(0, 3, 4.5, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'lollipop_ship') {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2; roundRectPath(ctx, -4, 6, 8, 22, 4); ctx.fill(); ctx.stroke();
      drawGlossyCircle(ctx, 0, -4, 18, flash ? '#ffffff' : '#ff70a6');
      drawCartoonEyes(ctx, e, -6, 6, -4, 4.3, '#7209b7', player);
    } else {
      drawGlossyCircle(ctx, 0, 0, 18, flash ? '#ffffff' : wingCol);
      drawCartoonEyes(ctx, e, -6, 6, -2, 4.4, '#ff006e', player);
    }
    if (e.isElite) drawEliteCrown(ctx, -20);
    ctx.restore(); return;
  }

  const mainCol = lvlColorByKind(e.kind, hue);
  e.wingCol = mainCol; e.bodyCol = '#ffffff';
  if (e.kind === 'crab_ship') {
    ctx.strokeStyle = mainCol; ctx.lineWidth = 3.5;
    [-6, 4].forEach(ly => { ctx.beginPath(); ctx.moveTo(-16, ly); ctx.lineTo(-28, ly + 6); ctx.moveTo(16, ly); ctx.lineTo(28, ly + 6); ctx.stroke(); });
  } else {
    ctx.strokeStyle = mainCol; ctx.lineWidth = 4;
    for (let k = -2; k <= 2; k++) {
      const w = Math.sin(e.phase * 4 + k) * 5;
      ctx.beginPath(); ctx.moveTo(k * 5, 8); ctx.quadraticCurveTo(k * 6 + w, 18, k * 7, 27); ctx.stroke();
    }
  }
  drawGlossyCircle(ctx, 0, 0, 17, flash ? '#ffffff' : mainCol);
  drawCartoonEyes(ctx, e, -6, 6, -1, 4.5, '#14213d', player);
  if (e.isElite) drawEliteCrown(ctx, -19);
  ctx.restore();
}

function lvlColorByKind(kind, hue) {
  if (kind.includes('crab') || kind.includes('octopus_ship') || kind.includes('manta') || kind.includes('kraken')) {
    return `hsl(${175 + (hue % 45)}, 90%, 72%)`;
  }
  return `hsl(${110 + (hue % 45)}, 90%, 62%)`;
}

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
    ctx.save(); ctx.rotate(b.time * 4.5);
    ctx.strokeStyle = `hsl(${(hue + 90) % 360}, 100%, 62%)`; ctx.lineWidth = 4; ctx.beginPath();
    for (let t = 0; t < 38; t++) { const ang = t * 0.45, rad = t * 1.25; if (t === 0) ctx.moveTo(0, 0); else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); }
    ctx.stroke(); ctx.restore();

    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.arc(ex, -14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = idx === 0 ? '#06d6a0' : '#ff006e'; ctx.beginPath(); ctx.arc(ex + lookX, -13, 7.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#090214'; roundRectPath(ctx, -30, 14, 60, 28, 12); ctx.fill(); ctx.stroke();
    ctx.restore(); return;
  }

  if (lvl.id === 2) {
    const legCols = ['#ff006e', '#ffbe0b', '#06d6a0', '#00f5d4'];
    for (let side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const wave = Math.sin(b.time * 6 + l * 1.4) * 10, baseY = -12 + l * 12;
        ctx.strokeStyle = legCols[l]; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(side * 42, baseY); ctx.quadraticCurveTo(side * 76, baseY - 22 + wave, side * 92, baseY + 24 - wave); ctx.stroke();
      }
    }
    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb'; ctx.strokeStyle = '#ff006e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -14, 52, Math.PI * 0.82, Math.PI * 2.18); ctx.lineTo(26, 52); ctx.lineTo(-26, 52); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(0, -40, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(0, -40, 5, 0, Math.PI * 2); ctx.fill();

    [-21, 21].forEach((ex, idx) => {
      const pCol = idx === 0 ? '#06d6a0' : '#ff006e';
      ctx.fillStyle = pCol;
      for (let p = 0; p < 10; p++) {
        const a = b.time * 1.5 + (Math.PI * 2 * p) / 10;
        ctx.beginPath(); ctx.arc(ex + Math.cos(a) * 19, -6 + Math.sin(a) * 19, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#090206'; ctx.beginPath(); ctx.arc(ex, -6, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.arc(ex + lookX, -6, 6.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#ff006e'; roundRectPath(ctx, -22, 28, 44, 20, 6); ctx.fill();
    ctx.strokeStyle = '#fff8eb'; ctx.lineWidth = 2.5;
    [-11, 0, 11].forEach(tx => { ctx.beginPath(); ctx.moveTo(tx, 28); ctx.lineTo(tx, 48); ctx.stroke(); });
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
