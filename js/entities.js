'use strict';

const INK = '#100824';

// 5 ПОКОЛЕНИЙ КОРАБЛЕЙ ИГРОКА
const SHIPS_CATALOG = [
  {
    id: 'shuttle',
    name: '1. Кото-Шаттл МК-1',
    desc: 'Обтекаемый 3D-шаттл Котовии-17 • 1 центральная пушка • Базовый урон.',
    price: 0,
    hpBonus: 0,
    speedMult: 1.0,
    fireRateMult: 1.0,
    dmgMult: 1.0,
    coinMult: 1.0,
    gunMounts: 1,
    hullColor: '#e0fbfc',
    hullDark: '#98c1d9',
    wingColor: '#ff5964',
    neonColor: '#48dbfb'
  },
  {
    id: 'interceptor',
    name: '2. Неоновый Перехватчик',
    desc: 'Скоростной обтекаемый корпус • 2 ствола • +25% скорость, +20% урон.',
    price: 750,
    hpBonus: 1,
    speedMult: 1.25,
    fireRateMult: 0.86,
    dmgMult: 1.20,
    coinMult: 1.25,
    gunMounts: 2,
    hullColor: '#caf0f8',
    hullDark: '#48cae4',
    wingColor: '#72efdd',
    neonColor: '#80ffdb'
  },
  {
    id: 'dreadnought',
    name: '3. Линкор Котовии-17',
    desc: 'Усиленная броня (+2 котика) • 3 ствола • +45% урон орудий.',
    price: 1650,
    hpBonus: 2,
    speedMult: 1.12,
    fireRateMult: 0.82,
    dmgMult: 1.45,
    coinMult: 1.45,
    gunMounts: 3,
    hullColor: '#ffd6a5',
    hullDark: '#f4a261',
    wingColor: '#9b5de5',
    neonColor: '#ff9f1c'
  },
  {
    id: 'valkyrie',
    name: '4. Био-Фрегат «Валькирия»',
    desc: 'Изумрудные аэро-крылья (+3 котика) • 4 веерных ствола • +80% урон.',
    price: 2900,
    hpBonus: 3,
    speedMult: 1.28,
    fireRateMult: 0.76,
    dmgMult: 1.80,
    coinMult: 1.75,
    gunMounts: 4,
    hullColor: '#d8f3dc',
    hullDark: '#74c69d',
    wingColor: '#38b000',
    neonColor: '#80ed99'
  },
  {
    id: 'emperor',
    name: '5. Архонт «Кото-Император»',
    desc: 'Флагман с плазменным кольцом (+4 котика) • 5 стволов • +130% урон!',
    price: 4600,
    hpBonus: 4,
    speedMult: 1.35,
    fireRateMult: 0.70,
    dmgMult: 2.30,
    coinMult: 2.20,
    gunMounts: 5,
    hullColor: '#fff3b0',
    hullDark: '#ffd166',
    wingColor: '#f72585',
    neonColor: '#fee440'
  }
];

// 5 ВИДОВ БАЗОВОГО ОРУЖИЯ
const WEAPONS_CATALOG = [
  {
    id: 'droplet',
    name: '1. Капельная Плазма (Урон x1.0)',
    desc: 'Мягкие пузырьки плазмы с бархатным ASMR-звуком.',
    price: 0,
    dmgBonus: 1.0,
    bulletColor: '#48dbfb'
  },
  {
    id: 'kalimba',
    name: '2. Калимба-Кристаллы (Урон x1.55)',
    desc: 'Ускоренные резонансные кристаллы (+55% урона).',
    price: 600,
    dmgBonus: 1.55,
    bulletColor: '#72efdd'
  },
  {
    id: 'silk_spread',
    name: '3. Шёлковый Залп (Урон x2.15)',
    desc: 'Широкие энергетические сферы (+115% урона).',
    price: 1350,
    dmgBonus: 2.15,
    bulletColor: '#ff8fab'
  },
  {
    id: 'prism_beam',
    name: '4. Призматический Луч (Урон x2.95)',
    desc: 'Пробивающие броню неоновые импульсы (+195% урона).',
    price: 2500,
    dmgBonus: 2.95,
    bulletColor: '#fee440'
  },
  {
    id: 'nova_pulse',
    name: '5. Сверхновая Пушка «Нова» (Урон x4.0)',
    desc: 'Разрывные плазменные звёзды максимальной мощи (+300% урона!).',
    price: 4100,
    dmgBonus: 4.0,
    bulletColor: '#f72585'
  }
];

const LEVELS = [
  {
    id: 1,
    name: 'Туманность Узоров',
    story: 'Навстречу летят неоновые фракталы со знаком Ом (ॐ) и сияющие звёзды! В финале ждёт зловещая Психоделическая Почтовая Марка, искажающая пространство!',
    enemiesDesc: 'Переливающиеся Психо-Глаза, Гриб-Крейсеры и Фрактал-Медузы',
    bossName: 'Зловещая Психо-Марка «ЛСД-999»',
    bossWeapon: 'Переливающиеся лучи изо рта и крутящиеся зелёные звёзды из глаз',
    theme: 'lsd',
    enemyTypes: ['psy_eye', 'shroom_cruiser', 'fractal_medusa'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'В багровом тумане мигают Корабли-Летучие Мыши с красными глазами, Корабли-Пауки и Корабли-Скелеты! Впереди — Огромный Пылающий Череп!',
    enemiesDesc: 'Корабли-Летучие Мыши, Корабли-Пауки и Корабли-Скелеты',
    bossName: 'Пылающий Череп Преисподней',
    bossWeapon: 'Потоки огня, красные лазеры и лазерные сюрикены в красно-жёлтых вспышках',
    theme: 'horror',
    enemyTypes: ['bat_ship', 'spider_ship', 'skeleton_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ff002b', bossColor: '#590d22', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'Среди широких радуг и сладостей летят круглые Корабли-Печеньки с глазом и Корабли-Радуги с гипнотическим глазом-спиралью!',
    enemiesDesc: 'Круглые Корабли-Печенье с глазом и Корабли-Радуги со спиральным оком',
    bossName: 'Пончик-Мутант Глазурный',
    bossWeapon: 'Волны радуги изо рта и двойные лазеры из глаз',
    theme: 'rainbow',
    enemyTypes: ['cookie_eye_ship', 'rainbow_spiral_ship', 'unicorn_lancer'],
    skyTop: '#1d1447', skyMid: '#2e226b', skyBot: '#463599',
    accent: '#ffd166', bossColor: '#ff5964', hpMult: 1.45, coinReward: 780
  },
  {
    id: 4,
    name: 'Пастельный Океан',
    story: 'Среди пастельных волн, пузырьков и рыбок плывут Корабли-Рыбы и Корабли-Осьминоги! Облетай неоновые кораллы и водоросли!',
    enemiesDesc: 'Корабли-Рыбы (гидро-лучи), Корабли-Осьминоги (торпеды) и Скат-Зонды (волны)',
    bossName: 'Пастельный Кракен Глубин',
    bossWeapon: 'Лучи из щупалец, волновые удары изо рта и молнии из глаз',
    theme: 'underwater',
    enemyTypes: ['fish_ship', 'octopus_ship', 'manta_wave'],
    skyTop: '#061a2e', skyMid: '#0d3b5c', skyBot: '#16697a',
    accent: '#9bf6ff', bossColor: '#48cae4', hpMult: 1.70, coinReward: 1050
  },
  {
    id: 5,
    name: 'Изумрудная Бездна Био-Флоры',
    story: 'В изумрудном неоновом свете парят плавные био-корабли в форме Медуз, Осьминогов и Морских Звёзд! В финале — Гигантский Страшный Цветок!',
    enemiesDesc: 'Био-Медузы (зелёные лазеры), Изумрудные Осьминоги (био-пакеты) и Морские Звёзды (лианы)',
    bossName: 'Император Флоры «Титан-Цветок»',
    bossWeapon: 'Вращающиеся лазерные цветки, хлещущие лианы и био-лазеры',
    theme: 'organic',
    enemyTypes: ['jellyfish_ship', 'bio_octopus_ship', 'starfish_ship'],
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
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = hiCol;
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.42, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Отрисовка гипнотической спирали (для Почтовой Марки и Корабля-Радуги)
function drawHypnoSpiral(ctx, cx, cy, maxR, turns, phase, color, lineWidth = 2.2) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  const steps = 42;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * Math.PI * 2 * turns + phase;
    const r = t * maxR;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// =========================================================================
// БОНУСЫ И СПЕЦ-ОРУЖИЕ
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
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, bn.r + 2);
  grad.addColorStop(0, '#36266b');
  grad.addColorStop(1, '#120a2e');
  ctx.fillStyle = grad;
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

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
    ctx.moveTo(3, -13); ctx.lineTo(-9, 1); ctx.lineTo(-1, 1);
    ctx.lineTo(-5, 13); ctx.lineTo(9, -2); ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 3.2;
    [-4, 2, 8].forEach((ry, idx) => {
      ctx.beginPath();
      ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-6, -8, 5, 2.5, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

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
  } else if (b.kind === 'wave_pulse') {
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 8, b.r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else if (b.kind === 'prism_spear') {
    ctx.fillStyle = '#fee440';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    roundRectPath(ctx, -4, -17, 8, 34, 4);
    ctx.fill(); ctx.stroke();
  } else if (b.kind === 'nova_star') {
    ctx.rotate(b.rot || 0);
    ctx.fillStyle = '#f72585';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * i) / 4;
      const rad = i % 2 === 0 ? 11 : 4.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
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
// ПРЕПЯТСТВИЯ НА ПУТИ:
// - Ур.1: Вращающийся неоновый фрактал с индийским символом ОМ (ॐ) и вращающаяся неоновая Звезда!
// - Ур.2: Вращающиеся черепа с костями и кровавые руны
// - Ур.3: Пончики, мечтания, радужные облачка
// - Ур.4: Светящиеся кораллы и морские водоросли
// - Ур.5: Био-бутоны и светящиеся споры
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const hue = Math.floor(((ob.phase || 0) * 95) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 65%)`;
  const dynamicNeon2 = `hsl(${(hue + 120) % 360}, 100%, 70%)`;

  // --- УРОВЕНЬ 1: ВРАЩАЮЩИЙСЯ ФРАКТАЛ С ИНДИЙСКИМ СИМВОЛОМ «ОМ» (ॐ) ---
  if (ob.shape === 'om_fractal') {
    ctx.fillStyle = dynamicNeon;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Вращающиеся лепестки фрактального лотоса
    ctx.save();
    ctx.rotate(ob.rot || 0);
    const petals = 8;
    for (let i = 0; i < petals; i++) {
      ctx.rotate((Math.PI * 2) / petals);
      ctx.fillStyle = i % 2 === 0 ? `hsl(${hue}, 90%, 38%)` : `hsl(${(hue + 60) % 360}, 90%, 45%)`;
      ctx.strokeStyle = dynamicNeon;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(14, -14, 0, -(ob.r + 6));
      ctx.quadraticCurveTo(-14, -14, 0, 0);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Внутренний круг мандалы
    ctx.fillStyle = '#190836';
    ctx.strokeStyle = dynamicNeon2;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Сияющий индийский символ ОМ (ॐ) в центре фрактала
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = dynamicNeon;
    ctx.shadowBlur = 10;
    ctx.font = '900 21px "Segoe UI Symbol", "Noto Sans Devanagari", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', 0, 1);
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1: ВТОРОЙ ОБЪЕКТ — ВРАЩАЮЩАЯСЯ НЕОНОВАЯ ЗВЕЗДА ---
  if (ob.shape === 'neon_star_obstacle') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = dynamicNeon2;
    ctx.globalAlpha = 0.30;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = `hsl(${hue}, 95%, 52%)`;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    const spikes = 6;
    for (let i = 0; i < spikes * 2; i++) {
      const a = (Math.PI * i) / spikes;
      const rad = i % 2 === 0 ? ob.r + 6 : ob.r * 0.42;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Внутренняя контрастная звезда
    ctx.fillStyle = dynamicNeon2;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const a = (Math.PI * i) / spikes;
      const rad = i % 2 === 0 ? ob.r * 0.52 : ob.r * 0.22;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 2: ВРАЩАЮЩИЕСЯ ЧЕРЕПА С КОСТЯМИ И МРАЧНЫЕ ФИГУРЫ С КРАСНЫМ НЕОНОМ ---
  if (ob.shape === 'skull_bones' || ob.shape === 'blood_pentagram') {
    ctx.rotate(ob.rot || 0);
    const redGlow = 0.26 + 0.16 * Math.sin((ob.phase || 0) * 5);
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = redGlow;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'skull_bones') {
      ctx.strokeStyle = '#e2ece9';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-24, -24); ctx.lineTo(24, 24);
      ctx.moveTo(24, -24);  ctx.lineTo(-24, 24);
      ctx.stroke();

      // Плавный мультяшный череп с багровым неоном
      ctx.fillStyle = '#2b2333';
      ctx.strokeStyle = '#ff002b';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, -4, 18, Math.PI * 0.8, Math.PI * 2.2);
      ctx.quadraticCurveTo(14, 16, 8, 17);
      ctx.lineTo(-8, 17);
      ctx.quadraticCurveTo(-14, 16, -14, 6);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ff002b';
      ctx.beginPath();
      ctx.arc(-6, -3, 4.5, 0, Math.PI * 2);
      ctx.arc(6, -3, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#1b0914';
      ctx.strokeStyle = '#ff002b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * i) / 4;
        const rad = i % 2 === 0 ? ob.r + 6 : ob.r * 0.48;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: ПОНЧИКИ, МЕЧТАНИЯ, РАДУЖНЫЕ ОБЛАЧКА ---
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

  // --- УРОВЕНЬ 4: НЕОНОВЫЕ КОРАЛЛЫ И ВОДОРОСЛИ ---
  if (ob.shape === 'neon_coral' || ob.shape === 'seaweed_kelp') {
    const seaCol1 = `hsl(${165 + Math.sin(ob.phase || 0) * 45}, 95%, 68%)`;
    const seaCol2 = `hsl(${290 + Math.cos(ob.phase || 0) * 40}, 95%, 74%)`;
    ctx.fillStyle = seaCol1;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'neon_coral') {
      ctx.strokeStyle = seaCol2;
      ctx.lineWidth = 8;
      [[-14, -18], [0, -24], [14, -16], [-20, -4], [20, -4]].forEach(([bx, by]) => {
        ctx.beginPath(); ctx.moveTo(0, 16); ctx.quadraticCurveTo(bx * 0.5, 0, bx, by); ctx.stroke();
        ctx.fillStyle = seaCol1;
        ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      ctx.strokeStyle = seaCol1;
      ctx.lineWidth = 6;
      [-10, 0, 10].forEach((kx, idx) => {
        const sway = Math.sin((ob.phase || 0) * 3 + idx) * 7;
        ctx.beginPath(); ctx.moveTo(kx, 22); ctx.quadraticCurveTo(kx + sway, 0, kx - sway, -22); ctx.stroke();
      });
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: БИО-БУТОНЫ ---
  ctx.rotate(ob.rot || 0);
  ctx.fillStyle = '#80ed99';
  ctx.globalAlpha = 0.26;
  ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1b4332';
  ctx.strokeStyle = '#80ed99';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.arc(0, 0, ob.r, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  drawWarts(ctx, [[-10, -8, 4.5], [10, -8, 4.5], [0, 11, 5]], '#ff006e', '#ffffff');
  ctx.restore();
}

// =========================================================================
// ПЛАВНАЯ МУЛЬТЯШНАЯ 3D-ГРАФИКА ВРАГОВ (БОЛЬШЕ ИЗГИБОВ И ДЕТАЛЕЙ, БЕЗ УГЛОВАТЫХ ПОЛИГОНОВ):
// - Ур.2: Мигающие Летучие Мыши с красными глазами, Летающие Корабли-Пауки и Скелеты
// - Ур.3: Корабли-Печенье с глазом и Корабли-Радуги со спиральным глазом
// - Ур.5: Корабли-Медузы, Осьминоги и Морские Звёзды
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 95) % 360);

  // --- УРОВЕНЬ 2: ЛЕТУЧИЕ МЫШИ, ПАУКИ И СКЕЛЕТЫ (ПЛАВНЫЕ МУЛЬТЯШНЫЕ ИЗГИБЫ + МИГАНИЕ) ---
  if (e.kind === 'bat_ship' || e.kind === 'spider_ship' || e.kind === 'skeleton_ship') {
    const blinkOn = Math.sin(e.phase * 6) > 0;
    const glowCol = blinkOn ? '#ff002b' : '#ffbe0b';
    ctx.fillStyle = glowCol;
    ctx.globalAlpha = 0.22 + 0.14 * Math.abs(Math.sin(e.phase * 5));
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'bat_ship') {
      // Мультяшный Корабль-Летучая Мышь с плавными изогнутыми перепончатыми крыльями и красными глазами
      e.wingCol = '#590d22'; e.bodyCol = '#240046';
      const flap = Math.sin(e.phase * 3) * 7;

      ctx.fillStyle = flash ? '#ffffff' : '#4a081c';
      ctx.strokeStyle = glowCol;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.bezierCurveTo(-18, -26 + flap, -34, -14 + flap, -32, 6 + flap);
      ctx.quadraticCurveTo(-22, 2 + flap, -18, 14 + flap);
      ctx.quadraticCurveTo(-9, 6, 0, 18);
      ctx.quadraticCurveTo(9, 6, 18, 14 + flap);
      ctx.quadraticCurveTo(22, 2 + flap, 32, 6 + flap);
      ctx.bezierCurveTo(34, -14 + flap, 18, -26 + flap, 0, -10);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Пушистое круглое тельце и большие ушки мыши
      ctx.fillStyle = flash ? '#ffffff' : '#240046';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-10, -8); ctx.quadraticCurveTo(-16, -25, -3, -15);
      ctx.moveTo(10, -8);  ctx.quadraticCurveTo(16, -25, 3, -15);
      ctx.fill(); ctx.stroke();

      ctx.beginPath(); ctx.ellipse(0, 2, 13, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Светящиеся красные глаза и белые клычки
      ctx.fillStyle = blinkOn ? '#ff002b' : '#ff758f';
      ctx.beginPath(); ctx.arc(-5, 0, 3.8, 0, Math.PI * 2); ctx.arc(5, 0, 3.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-5, 11); ctx.lineTo(-3, 17); ctx.lineTo(-1, 11);
      ctx.moveTo(5, 11);  ctx.lineTo(3, 17);  ctx.lineTo(1, 11);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (e.kind === 'spider_ship') {
      // Мультяшный Летающий Корабль-Паук (8 плавных изгибающихся лапок, брюшко с красными часами и 6 глаз)
      e.wingCol = '#ff002b'; e.bodyCol = '#1b1026';
      ctx.strokeStyle = flash ? '#ffffff' : '#3c096c';
      ctx.lineWidth = 3.5;
      [-1.5, -0.5, 0.5, 1.5].forEach((row, idx) => {
        const legWave = Math.sin(e.phase * 4 + idx) * 4;
        // Левая лапка
        ctx.beginPath();
        ctx.moveTo(-10, row * 6);
        ctx.quadraticCurveTo(-24, row * 8 - 6 + legWave, -30, row * 11 + 5 + legWave);
        ctx.stroke();
        // Правая лапка
        ctx.beginPath();
        ctx.moveTo(10, row * 6);
        ctx.quadraticCurveTo(24, row * 8 - 6 - legWave, 30, row * 11 + 5 - legWave);
        ctx.stroke();
      });

      // Круглое глянцевое брюшко паука
      ctx.fillStyle = flash ? '#ffffff' : '#1b1026';
      ctx.strokeStyle = glowCol;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, -6, 15, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Красный узор «чёрной вдовы» на спинке
      ctx.fillStyle = '#ff002b';
      ctx.beginPath();
      ctx.moveTo(-5, -11); ctx.lineTo(5, -11); ctx.lineTo(-5, -1); ctx.lineTo(5, -1);
      ctx.closePath(); ctx.fill();

      // Голова паука с гроздью мигающих красных глаз и жвалами
      ctx.fillStyle = flash ? '#ffffff' : '#240046';
      ctx.beginPath(); ctx.arc(0, 9, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = blinkOn ? '#ff002b' : '#fee440';
      [[-5, 9, 2.8], [5, 9, 2.8], [-2.5, 13, 2.2], [2.5, 13, 2.2]].forEach(([gx, gy, gr]) => {
        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      return;
    }

    // Корабль-Скелет с плавными изогнутыми рёбрами и черепом
    e.wingCol = '#e2ece9'; e.bodyCol = '#4a4e69';
    ctx.strokeStyle = flash ? '#ffffff' : '#e2ece9';
    ctx.lineWidth = 4.2;
    [-10, -2, 6].forEach(ry => {
      ctx.beginPath(); ctx.moveTo(-26, ry - 4); ctx.quadraticCurveTo(0, ry + 8, 26, ry - 4); ctx.stroke();
    });
    ctx.fillStyle = flash ? '#ffffff' : '#f8f9fa';
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    roundRectPath(ctx, -8, 10, 16, 10, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = glowCol;
    ctx.beginPath(); ctx.arc(-5, 1, 4, 0, Math.PI * 2); ctx.arc(5, 1, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: КРУГЛЫЕ КОРАБЛИ-ПЕЧЕНЬЕ С ГЛАЗОМ И КОРАБЛИ-РАДУГИ С ГЛАЗОМ-СПИРАЛЬЮ ---
  if (e.kind === 'cookie_eye_ship' || e.kind === 'rainbow_spiral_ship' || e.kind === 'unicorn_lancer') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    e.wingCol = wingCol; e.bodyCol = '#e09f3e';

    ctx.fillStyle = wingCol;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'cookie_eye_ship') {
      // Круглое аппетитное Печенье с волнистым краем, шоколадными каплями и живым глазом в центре!
      ctx.fillStyle = flash ? '#ffffff' : '#e09f3e';
      ctx.strokeStyle = '#7f4f24';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        const r = 21 + Math.sin(i * 3) * 1.8;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Шоколадные капли по краям печенья
      ctx.fillStyle = '#3d1e05';
      [[-12, -10, 3.2], [13, -9, 3.5], [-13, 8, 3.0], [12, 10, 3.4], [0, -14, 3.0]].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
      });

      // Большой мультяшный глаз в центре печенья
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 2, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = wingCol;
      ctx.beginPath(); ctx.arc(0, 3, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(0, 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-2, 1, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    if (e.kind === 'rainbow_spiral_ship') {
      // Корабль в форме пышной Радуги с глазом в форме вращающейся спирали!
      const rCols = ['#ff3366', '#ff9f1c', '#ffee33', '#06d6a0', '#48dbfb'];
      rCols.forEach((rc, idx) => {
        ctx.strokeStyle = flash ? '#ffffff' : rc;
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.arc(0, 10, 26 - idx * 3.5, Math.PI, Math.PI * 2);
        ctx.stroke();
      });

      // Мягкие облачка по краям радуги
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = wingCol;
      ctx.lineWidth = 2;
      [-20, 20].forEach(cx => {
        ctx.beginPath(); ctx.arc(cx, 10, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      // Центральное око со спиралью внутри
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 4, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawHypnoSpiral(ctx, 0, 4, 10, 2.3, e.phase * 4, '#ff006e', 2.0);
      ctx.restore();
      return;
    }

    // Мультяшный округлый Корабль-Единорог
    ctx.fillStyle = flash ? '#ffffff' : wingCol;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(-18, 2, 12, 7, -0.3, 0, Math.PI * 2);
    ctx.ellipse(18, 2, 12, 7, 0.3, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.moveTo(-4.5, 15); ctx.lineTo(0, 32); ctx.lineTo(4.5, 15); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 4: ПАСТЕЛЬНЫЕ РЫБЫ И ОСЬМИНОГИ ---
  if (e.kind === 'fish_ship' || e.kind === 'octopus_ship' || e.kind === 'manta_wave') {
    const seaHue = 170 + Math.sin(e.phase * 2.5) * 45;
    const pastel1 = `hsl(${seaHue}, 95%, 74%)`;
    const pastel2 = `hsl(${(seaHue + 80) % 360}, 95%, 78%)`;
    e.wingCol = pastel1; e.bodyCol = pastel2;

    ctx.fillStyle = pastel1;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'octopus_ship') {
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
    } else {
      const fin = Math.sin(e.phase * 3) * 4;
      ctx.fillStyle = flash ? '#ffffff' : pastel2;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(-19, 2 + fin * 0.4, 12, 6, -0.3, 0, Math.PI * 2);
      ctx.ellipse(19, 2 + fin * 0.4, 12, 6, 0.3, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = flash ? '#ffffff' : pastel1;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, 13, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(0, 26, 4.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: КОРАБЛИ В ФОРМЕ МЕДУЗ, ОСЬМИНОГОВ И МОРСКИХ ЗВЁЗД (ПЛАВНЫЕ МУЛЬТЯШНЫЕ ИЗГИБЫ) ---
  if (e.kind === 'jellyfish_ship' || e.kind === 'bio_octopus_ship' || e.kind === 'starfish_ship') {
    const bioNeon = `hsl(${115 + Math.sin(e.phase * 3) * 35}, 95%, 64%)`;
    const bioAccent = `hsl(${290 + Math.cos(e.phase * 2) * 40}, 95%, 70%)`;
    e.wingCol = bioNeon; e.bodyCol = bioAccent;

    ctx.fillStyle = bioNeon;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'jellyfish_ship') {
      // Плавная полупрозрачная Космическая Медуза с извивающимися щупальцами и кружевным куполом
      ctx.strokeStyle = bioAccent;
      ctx.lineWidth = 3.2;
      for (let t = -2; t <= 2; t++) {
        const w = Math.sin(e.phase * 3.5 + t) * 6;
        ctx.beginPath();
        ctx.moveTo(t * 6, 2);
        ctx.quadraticCurveTo(t * 7 + w, -14, t * 8 - w * 0.5, -26);
        ctx.stroke();
      }

      ctx.fillStyle = flash ? '#ffffff' : 'rgba(56, 176, 0, 0.85)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 6, 20, Math.PI, 0);
      ctx.quadraticCurveTo(10, 14, 0, 10);
      ctx.quadraticCurveTo(-10, 14, -20, 6);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Светящиеся био-ядра под куполом медузы
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(-7, 2, 3.5, 0, Math.PI * 2); ctx.arc(7, 2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    if (e.kind === 'bio_octopus_ship') {
      // Изумрудный Био-Осьминог с 6 плавными щупальцами в присосках
      ctx.strokeStyle = '#38b000';
      ctx.lineWidth = 5;
      for (let k = -2.5; k <= 2.5; k += 1) {
        const wave = Math.sin(e.phase * 3 + k) * 6;
        ctx.beginPath();
        ctx.moveTo(k * 5, -6);
        ctx.quadraticCurveTo(k * 9 + wave, -20, k * 10 - wave * 0.5, -28);
        ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : '#2d6a4f';
      ctx.strokeStyle = bioNeon;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(0, 4, 19, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      drawWarts(ctx, [[-10, -2, 3.2], [10, -2, 3.2], [0, -6, 3.5]], bioAccent, '#ffffff');
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(-7, 9, 4, 0, Math.PI * 2); ctx.arc(7, 9, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-7, 9, 1.8, 0, Math.PI * 2); ctx.arc(7, 9, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    // Вращающийся Корабль — Пятиконечная Морская Звезда с пупырышками и глазом в центре
    ctx.save();
    ctx.rotate(e.rot * 0.6);
    ctx.fillStyle = flash ? '#ffffff' : '#ff006e';
    ctx.strokeStyle = bioNeon;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * i) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? 24 : 11;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.quadraticCurveTo(Math.cos(a - 0.15) * (rad * 0.9), Math.sin(a - 0.15) * (rad * 0.9), px, py);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38b000';
    ctx.beginPath(); ctx.arc(0, 1, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1 («Туманность Узоров»): ПЛАВНЫЙ ГАЛЛЮЦИНОГЕННЫЙ КОРАБЛЬ ---
  const bodyCol = `hsl(${hue}, 92%, 56%)`;
  const wingCol = `hsl(${(hue + 110) % 360}, 95%, 60%)`;
  const domeCol = `hsl(${(hue + 220) % 360}, 95%, 68%)`;
  const wartCol = `hsl(${(hue + 160) % 360}, 95%, 65%)`;
  e.wingCol = wingCol; e.bodyCol = bodyCol;

  ctx.fillStyle = domeCol;
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = flash ? '#ffffff' : wingCol;
  ctx.strokeStyle = domeCol;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.bezierCurveTo(-30, -16, -32, 16, 0, 22);
  ctx.bezierCurveTo(32, 16, 30, -16, 0, -10);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.ellipse(0, 2, 14, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath(); ctx.ellipse(0, 3, 7.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  drawWarts(ctx, [[-16, -2, 3.2], [16, -2, 3.2], [-11, 10, 2.8], [11, 10, 2.8]], wartCol, '#ffffff');
  ctx.restore();
}

// =========================================================================
// БОССЫ УРОВНЕЙ 1–5:
// - Ур.1: Зловещая Психоделическая Почтовая Марка (зубчатые края, спираль, страшные глаза и зубы, ЛСД-искажение пространства, лучи изо рта и зелёные звёзды из глаз!)
// - Ур.2: Огромный Детализированный Пылающий Череп (огонь, красные лазеры и лазерные сюрикены в красно-жёлтых вспышках!)
// - Ур.3: Пончик-Мутант
// - Ур.4: Пастельный Морской Осьминог
// - Ур.5: Гигантский Страшный Цветок
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;
  const hue = Math.floor((b.time * 95) % 360);

  // ЛУЧИ ИЗ РТА ИЛИ ГЛАЗ БОССА
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = lvl.id === 2 ? 'rgba(255, 190, 11, 0.9)' : `hsla(${hue}, 100%, 65%, 0.9)`;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    if (lvl.id === 1) {
      // На 1-м уровне Почтовая Марка целится радужным лучом прямо изо рта!
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + 24 * bScale);
      ctx.lineTo(b.laserX, H);
      ctx.stroke();
    } else {
      [-22 * bScale, 22 * bScale].forEach(ex => {
        ctx.beginPath();
        ctx.moveTo(b.x + ex, b.y - 6);
        ctx.lineTo(b.laserX + ex * 0.6, H);
        ctx.stroke();
      });
    }
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    if (lvl.id === 1) {
      // Зловещая Почтовая Марка извергает ИЗО РТА многослойный радужно-переливающийся мега-луч!
      const startX = b.x;
      const startY = b.y + 24 * bScale;
      const endX = b.laserX;
      for (let band = -2; band <= 2; band++) {
        const bHue = (b.time * 280 + (band + 2) * 65) % 360;
        ctx.strokeStyle = `hsl(${bHue}, 100%, 62%)`;
        ctx.lineWidth = 10 * bScale;
        ctx.globalAlpha = 0.78;
        ctx.beginPath();
        ctx.moveTo(startX + band * 5, startY);
        ctx.lineTo(endX + band * 8, H);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6 * bScale;
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
    } else {
      [-22 * bScale, 22 * bScale].forEach((ex, idx) => {
        const startX = b.x + ex;
        const startY = b.y - 6;
        const endX = b.laserX + ex * 0.6;
        const beamCol = lvl.id === 2
          ? (Math.floor(b.time * 16) % 2 === 0 ? '#ff002b' : '#ffbe0b')
          : (lvl.id === 5 ? '#70e000' : `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 66%)`);

        if (lvl.id === 4) {
          ctx.strokeStyle = '#9bf6ff';
          ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(startX, startY);
          for (let seg = 1; seg <= 8; seg++) {
            const t = seg / 8;
            ctx.lineTo(startX + (endX - startX) * t + (Math.random() - 0.5) * 28, startY + (H - startY) * t);
          }
          ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
        } else {
          ctx.strokeStyle = beamCol; ctx.lineWidth = 22 * bScale; ctx.globalAlpha = 0.48;
          ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6 * bScale; ctx.globalAlpha = 0.95;
          ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
        }
      });
    }
    ctx.restore();
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.scale(bScale, bScale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const flash = b.hitFlash > 0;
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  // --- БОСС УРОВНЯ 1: ОГРОМНАЯ ЗЛОВЕЩАЯ ПСИХОДЕЛИЧЕСКАЯ ПОЧТОВАЯ МАРКА «ЛСД-999» ---
  if (lvl.id === 1) {
    // ЛСД-эффекты искривления пространства вокруг Почтовой Марки (пульсирующие волновые контуры)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let w = 1; w <= 3; w++) {
      const warpHue = (hue + w * 90) % 360;
      ctx.strokeStyle = `hsla(${warpHue}, 100%, 65%, ${0.42 - w * 0.1})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.2) {
        const rad = 64 + w * 14 + Math.sin(a * 6 + b.time * 7) * 8;
        const wx = Math.cos(a) * rad;
        const wy = Math.sin(a) * rad;
        if (a === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // Плавное желеобразное искажение самой марки в пространстве
    const warpX = 1 + Math.sin(b.time * 4.2) * 0.06;
    const warpY = 1 + Math.cos(b.time * 3.7) * 0.06;
    ctx.scale(warpX, warpY);

    const sw = 56;
    const sh = 62;
    const stampCol = flash ? '#ffffff' : `hsl(${hue}, 95%, 58%)`;
    const borderNeon = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

    // Основа почтовой марки
    ctx.fillStyle = stampCol;
    ctx.strokeStyle = borderNeon;
    ctx.lineWidth = 3.5;
    roundRectPath(ctx, -sw, -sh, sw * 2, sh * 2, 6);
    ctx.fill();
    ctx.stroke();

    // Перфорированные зубчатые края почтовой марки по всему периметру
    ctx.fillStyle = '#240940';
    ctx.strokeStyle = borderNeon;
    ctx.lineWidth = 1.6;
    for (let x = -sw + 10; x <= sw - 10; x += 18) {
      ctx.beginPath(); ctx.arc(x, -sh, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, sh, 5.5, 0, Math.PI * 2);  ctx.fill(); ctx.stroke();
    }
    for (let y = -sh + 10; y <= sh - 10; y += 18) {
      ctx.beginPath(); ctx.arc(-sw, y, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(sw, y, 5.5, 0, Math.PI * 2);  ctx.fill(); ctx.stroke();
    }

    // Внутренняя художественная рамка марки
    ctx.fillStyle = `hsl(${(hue + 210) % 360}, 85%, 22%)`;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    roundRectPath(ctx, -sw + 10, -sh + 10, (sw - 10) * 2, (sh - 10) * 2, 4);
    ctx.fill();
    ctx.stroke();

    // Большая вращающаяся гипнотическая СПИРАЛЬ в центре почтовой марки!
    drawHypnoSpiral(ctx, 0, -4, 38, 3.5, -b.time * 5, `hsl(${(hue + 80) % 360}, 100%, 66%)`, 3.2);

    // Номинал марки в углу («999 LSD»)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('999 ॐ', sw - 14, -sh + 22);

    // СТРАШНЫЕ БЕЗУМНЫЕ ГЛАЗА МАРКИ (стреляют крутящимися зелёными звёздами!)
    [-22, 22].forEach((ex, idx) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -14, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Кислотно-зелёная радужка
      ctx.fillStyle = '#06d6a0';
      ctx.beginPath(); ctx.arc(ex + lookX, -14, 8, 0, Math.PI * 2); ctx.fill();

      // Суженный зловещий зрачок
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.ellipse(ex + lookX, -14, 2.5, 6.5, 0, 0, Math.PI * 2); ctx.fill();

      // Нахмуренные злые брови
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(ex - 13, idx === 0 ? -30 : -24);
      ctx.lineTo(ex + 13, idx === 0 ? -24 : -30);
      ctx.stroke();
    });

    // ОГРОМНАЯ ЗУБАСТАЯ ПАСТЬ ПОЧТОВОЙ МАРКИ (извергает разноцветные лучи!)
    ctx.fillStyle = '#0b0317';
    ctx.strokeStyle = borderNeon;
    ctx.lineWidth = 2.8;
    roundRectPath(ctx, -34, 12, 68, 28, 10);
    ctx.fill();
    ctx.stroke();

    // Переливающееся свечение в глотке
    ctx.fillStyle = `hsl(${(b.time * 240) % 360}, 100%, 62%)`;
    ctx.beginPath();
    ctx.ellipse(0, 26, 22, 8 + Math.sin(b.time * 16) * 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Острые пиラньи зубы сверху и снизу
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    for (let k = -3; k <= 3; k++) {
      const tx = k * 8.5;
      // Верхний зуб
      ctx.beginPath();
      ctx.moveTo(tx - 4, 12); ctx.lineTo(tx, 23); ctx.lineTo(tx + 4, 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Нижний зуб
      ctx.beginPath();
      ctx.moveTo(tx - 4, 40); ctx.lineTo(tx, 30); ctx.lineTo(tx + 4, 40);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 2: ОГРОМНЫЙ ПЫЛАЮЩИЙ ЧЕРЕП (КРАСНО-ЖЁЛТЫЕ МИГАНИЯ, ОГОНЬ, ЛАЗЕРЫ, СЮРИКЕНЫ) ---
  if (lvl.id === 2) {
    const fireToggle = Math.floor(b.time * 14) % 2 === 0;
    const fireRim = fireToggle ? '#ff002b' : '#ffbe0b';
    const fireInner = fireToggle ? '#ffbe0b' : '#ff5400';

    // Яростная корона адского пламени вокруг черепа
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12 + b.time * 2;
      const flameR = 62 + Math.sin(b.time * 15 + i * 2) * 14;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 0, 43, 0.55)' : 'rgba(255, 190, 11, 0.55)';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (flameR * 0.65), Math.sin(a) * (flameR * 0.65) - 6, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Массивный детализированный купол черепа со скулами
    const skullGrad = ctx.createRadialGradient(-14, -22, 8, 0, 0, 62);
    skullGrad.addColorStop(0, flash ? '#ffffff' : '#fff3b0');
    skullGrad.addColorStop(0.55, flash ? '#ffffff' : '#e2ece9');
    skullGrad.addColorStop(1, '#6c757d');

    ctx.fillStyle = skullGrad;
    ctx.strokeStyle = fireRim;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -12, 50, Math.PI * 0.82, Math.PI * 2.18);
    // Скулы черепа
    ctx.quadraticCurveTo(56, 8, 38, 22);
    ctx.lineTo(28, 46);
    ctx.lineTo(-28, 46);
    ctx.lineTo(-38, 22);
    ctx.quadraticCurveTo(-56, 8, -42, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Глубокие трещины на лбу и висках черепа, светящиеся жёлто-красной лавой
    ctx.strokeStyle = fireInner;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0, -60); ctx.lineTo(-8, -42); ctx.lineTo(4, -30);
    ctx.moveTo(36, -34); ctx.lineTo(22, -22);
    ctx.moveTo(-36, -34); ctx.lineTo(-22, -22);
    ctx.stroke();

    // Пылающие глазницы черепа
    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#090206';
      ctx.strokeStyle = fireRim;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(ex, -8, 15, 13, ex < 0 ? -0.18 : 0.18, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Мигающее красно-жёлтое ядро в глазницах
      ctx.fillStyle = fireRim;
      ctx.beginPath(); ctx.arc(ex + lookX, -8, 7.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex + lookX - 2, -10, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Треугольная носовая впадина
    ctx.fillStyle = '#090206';
    ctx.strokeStyle = fireInner;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 2); ctx.lineTo(-9, 17); ctx.lineTo(9, 17);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Раскрытая челюсть черепа, извергающая адский огонь
    ctx.fillStyle = '#120309';
    ctx.strokeStyle = fireRim;
    ctx.lineWidth = 2.8;
    roundRectPath(ctx, -24, 22, 48, 20, 6);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = fireInner;
    ctx.beginPath();
    ctx.arc(0, 32, 11 + Math.sin(b.time * 22) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Крупные детальные зубы черепа
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    for (let k = -2; k <= 2; k++) {
      roundRectPath(ctx, k * 8.5 - 3.5, 21, 7, 9, 2);
      ctx.fill(); ctx.stroke();
    }

    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 5: СТРАШНЫЙ ЦВЕТОК ---
  if (lvl.id === 5) {
    ctx.strokeStyle = '#38b000';
    ctx.lineWidth = 11;
    for (let v = 0; v < 4; v++) {
      const t = v - 1.5;
      const whipX = Math.sin(b.time * 4.5 + v * 1.3) * 34;
      ctx.beginPath();
      ctx.moveTo(t * 24, 20);
      ctx.bezierCurveTo(t * 36 + whipX, 55, t * 20 - whipX, 82, t * 32 + whipX * 0.6, 102);
      ctx.stroke();
      ctx.strokeStyle = '#80ed99'; ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = '#38b000'; ctx.lineWidth = 11;
    }

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
      ctx.fillStyle = '#fee440'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, -8, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d90429';
      ctx.beginPath(); ctx.ellipse(ex + lookX, -8, 3.5, 7, 0, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#081c15'; ctx.strokeStyle = '#ff006e'; ctx.lineWidth = 3;
    roundRectPath(ctx, -22, 10, 44, 18, 9);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 4: ПАСТЕЛЬНЫЙ МОРСКОЙ ОСЬМИНОГ ---
  if (lvl.id === 4) {
    const seaHue = 165 + Math.sin(b.time * 3.5) * 55;
    const pastelBody = `hsl(${seaHue}, 92%, 72%)`;
    const pastelGlow = `hsl(${(seaHue + 90) % 360}, 95%, 80%)`;

    ctx.fillStyle = pastelGlow;
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(b.time * 8);
    ctx.beginPath(); ctx.arc(0, 6, 78, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    for (let i = 0; i < 6; i++) {
      const t = i - 2.5;
      const waveX = Math.sin(b.time * 5 + i) * 14;
      const tipX = t * 24 - waveX * 0.5;
      ctx.strokeStyle = `hsl(${(seaHue + i * 35) % 360}, 95%, 74%)`;
      ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(t * 18, 22); ctx.quadraticCurveTo(t * 22 + waveX, 52, tipX, 76); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(tipX, 76, 5, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = flash ? '#ffffff' : pastelBody;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 56, Math.PI, 0);
    ctx.quadraticCurveTo(60, 34, 0, 36);
    ctx.quadraticCurveTo(-60, 34, -56, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    drawWarts(ctx, [[-36, -18, 5.5], [36, -18, 5.5], [-40, 6, 4.8], [40, 6, 4.8]], pastelGlow, '#ffffff');

    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0077b6';
      ctx.beginPath(); ctx.arc(ex + lookX, -2, 6.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#03045e'; ctx.strokeStyle = pastelGlow; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 18, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 3: ПОНЧИК-МУТАНТ ---
  const icingCol = `hsl(${hue}, 95%, 64%)`;
  const neonCol = `hsl(${(hue + 140) % 360}, 100%, 68%)`;

  ctx.fillStyle = flash ? '#ffffff' : '#f4a261';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : icingCol;
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16;
    const r = 48 + Math.sin(b.time * 4 + i * 2) * 5;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#120824'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 12, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  [-22, 22].forEach(ex => {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(ex, -10, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff006e';
    ctx.beginPath(); ctx.arc(ex + lookX, -8, 6.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}
