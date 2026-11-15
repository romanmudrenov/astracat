'use strict';

const INK = '#120a28';

// 5 ВИДОВ КОСМИЧЕСКИХ КОРАБЛЕЙ (каждый следующий превосходит предыдущий по числу стволов и урону!)
const SHIPS_CATALOG = [
  {
    id: 'shuttle',
    name: '1. Кото-Шаттл МК-1',
    desc: 'Стартовый шаттл • 1 центральная пушка • Базовый урон.',
    price: 0,
    hpBonus: 0,
    speedMult: 1.0,
    fireRateMult: 1.0,
    dmgMult: 1.0,
    coinMult: 1.0,
    gunMounts: 1,
    hullColor: '#e0fbfc',
    wingColor: '#ff5964',
    neonColor: '#48dbfb'
  },
  {
    id: 'interceptor',
    name: '2. Неоновый Перехватчик',
    desc: 'Стреловидный корпус • 2 спаренных ствола • +25% скорость, +20% урон.',
    price: 750,
    hpBonus: 1,
    speedMult: 1.25,
    fireRateMult: 0.86,
    dmgMult: 1.20,
    coinMult: 1.25,
    gunMounts: 2,
    hullColor: '#caf0f8',
    wingColor: '#72efdd',
    neonColor: '#80ffdb'
  },
  {
    id: 'dreadnought',
    name: '3. Линкор Котовии-17',
    desc: 'Тяжёлая броня (+2 котика) • 3 мощных ствола • +45% урон орудий.',
    price: 1650,
    hpBonus: 2,
    speedMult: 1.12,
    fireRateMult: 0.82,
    dmgMult: 1.45,
    coinMult: 1.45,
    gunMounts: 3,
    hullColor: '#ffd6a5',
    wingColor: '#9b5de5',
    neonColor: '#ff9f1c'
  },
  {
    id: 'valkyrie',
    name: '4. Био-Фрегат «Валькирия»',
    desc: 'Изумрудные био-крылья (+3 котика) • 4 веерных ствола • +80% урон.',
    price: 2900,
    hpBonus: 3,
    speedMult: 1.28,
    fireRateMult: 0.76,
    dmgMult: 1.80,
    coinMult: 1.75,
    gunMounts: 4,
    hullColor: '#d8f3dc',
    wingColor: '#38b000',
    neonColor: '#80ed99'
  },
  {
    id: 'emperor',
    name: '5. Архонт «Кото-Император»',
    desc: 'Флагман с плазменным кольцом (+4 котика) • 5 стволов + авто-дрон • +130% урон!',
    price: 4600,
    hpBonus: 4,
    speedMult: 1.35,
    fireRateMult: 0.70,
    dmgMult: 2.30,
    coinMult: 2.20,
    gunMounts: 5,
    hullColor: '#fff3b0',
    wingColor: '#f72585',
    neonColor: '#fee440'
  }
];

// 5 ВИДОВ БАЗОВОГО ОРУЖИЯ (каждое следующее мощнее предыдущего по урону)
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
    name: '4. Призматический Копьё-Луч (Урон x2.95)',
    desc: 'Пробивающие броню неоновые копья (+195% урона).',
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
    story: 'Галлюциногенные корабли переливаются всеми цветами радуги на фоне асинхронных синусоид! Оракул Фракталов бьёт психо-волнами изо рта и лазерами из глаз!',
    enemiesDesc: 'Переливающиеся Психо-Глаза, Гриб-Крейсеры и Фрактал-Медузы',
    bossName: 'Оракул Фракталов',
    bossWeapon: 'Разноцветные психо-волны изо рта и лазеры из глаз',
    theme: 'lsd',
    enemyTypes: ['psy_eye', 'shroom_cruiser', 'fractal_medusa'],
    skyTop: '#16052b', skyMid: '#340b54', skyBot: '#5c1068',
    accent: '#ff70a6', bossColor: '#9b5de5', hpMult: 1.0, coinReward: 380
  },
  {
    id: 2,
    name: 'Мрачный Сектор Кошмаров',
    story: 'Среди планет-черепов и тлеющих углей вращаются черепа с костями, атакуют Скелеты, Летучие Мыши и Зомби в багровом неоне!',
    enemiesDesc: 'Корабли-Скелеты (лазеры), Летучие Мыши (ракеты) и Корабли-Зомби',
    bossName: 'Вампир-Слизняк Кровожадный',
    bossWeapon: 'Поток адского огня изо рта и кровавые лучи из глаз',
    theme: 'horror',
    enemyTypes: ['skeleton_ship', 'bat_ship', 'zombie_ship'],
    skyTop: '#040108', skyMid: '#120309', skyBot: '#24050e',
    accent: '#ff002b', bossColor: '#4a0e2e', hpMult: 1.25, coinReward: 560
  },
  {
    id: 3,
    name: 'Радужный Поток',
    story: 'На фоне широких радужных синусоид, печенья и пончиков атакуют полу-корабли Единороги и Радужки-Мутанты! Облетай неоновые пончики и облачка-мечтания!',
    enemiesDesc: 'Кибер-Единороги (лазеры), Радужки-Мутанты (ракеты) и Пегас-Крейсеры',
    bossName: 'Пончик-Мутант Глазурный',
    bossWeapon: 'Волны радуги изо рта и двойные лазеры из глаз',
    theme: 'rainbow',
    enemyTypes: ['unicorn_lancer', 'iris_mutant', 'pegasus_bomber'],
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
    name: 'Изумрудный Мир Хищной Флоры',
    story: 'Зелёные джунгли космоса! Хищные корабли-растения стреляют зелёными лазерами, био-ракетами и лианами! Впереди — Гигантский Страшный Цветок!',
    enemiesDesc: 'Венерины Мухоловки (зелёные лазеры), Шипо-Бутоны (био-ракеты) и Лиана-Дроны',
    bossName: 'Император Флоры «Титан-Цветок»',
    bossWeapon: 'Вращающиеся лазерные цветки, хлещущие лианы и био-лазеры',
    theme: 'organic',
    enemyTypes: ['plant_flytrap', 'plant_thorn', 'plant_vine'],
    skyTop: '#041b0b', skyMid: '#0b3818', skyBot: '#145926',
    accent: '#80ed99', bossColor: '#38b000', hpMult: 2.10, coinReward: 1600
  }
];

// 4 УРОВНЯ СЛОЖНОСТИ (включая «Безумие»: уровень на 20% длиннее, враги чаще и сильнее, 2 босса!)
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
    ctx.arc(x, y, 2.0, 0, Math.PI * 2);
    ctx.fill();
  });
}

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
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1b1438';
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'green_star' || bn.type === 'red_shield') {
    ctx.fillStyle = bn.type === 'green_star' ? '#06d6a0' : '#ff5964';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
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
      ctx.beginPath();
      ctx.arc(0, ry, 6 + idx * 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });
  }

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
    ctx.beginPath();
    ctx.moveTo(0, -18); ctx.lineTo(5, 0); ctx.lineTo(0, 18); ctx.lineTo(-5, 0);
    ctx.closePath();
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
// ПРЕПЯТСТВИЯ НА ПУТИ ДЛЯ КАЖДОГО УРОВНЯ:
// - Ур.2: Вращающиеся черепа с костями и мрачные руны со свечением глаз в красном неоне
// - Ур.3: Пончики, мечтания, радужные облачка
// - Ур.4: Светящиеся неоновые кораллы и морские водоросли
// - Ур.5: Неоновые шипастые лозы и ядовитые бутоны
// =========================================================================
function drawObstacle(ctx, ob) {
  ctx.save();
  ctx.translate(ob.x, ob.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const hue = Math.floor(((ob.phase || 0) * 90) % 360);
  const dynamicNeon = `hsl(${hue}, 100%, 66%)`;

  // --- УРОВЕНЬ 2: ВРАЩАЮЩИЕСЯ ЧЕРЕПА С КОСТЯМИ И МРАЧНЫЕ ФИГУРЫ С КРАСНЫМ НЕОНОМ ---
  if (ob.shape === 'skull_bones' || ob.shape === 'blood_pentagram') {
    ctx.rotate(ob.rot || 0);
    const redGlow = 0.25 + 0.15 * Math.sin((ob.phase || 0) * 4);
    ctx.fillStyle = '#ff002b';
    ctx.globalAlpha = redGlow;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'skull_bones') {
      // Перекрещённые кости позади черепа
      ctx.strokeStyle = '#e2ece9';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-24, -24); ctx.lineTo(24, 24);
      ctx.moveTo(24, -24);  ctx.lineTo(-24, 24);
      ctx.stroke();

      // Череп с неоновым багровым контуром
      ctx.fillStyle = '#2b2333';
      ctx.strokeStyle = '#ff002b';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, -4, 18, Math.PI * 0.8, Math.PI * 2.2);
      ctx.lineTo(10, 16);
      ctx.lineTo(-10, 16);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Ярко светящиеся красным неоном глазницы
      ctx.fillStyle = '#ff002b';
      ctx.beginPath();
      ctx.arc(-6, -3, 4.5, 0, Math.PI * 2);
      ctx.arc(6, -3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6, -3, 1.8, 0, Math.PI * 2);
      ctx.arc(6, -3, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Мрачная вращающаяся фигура с всевидящим кровавым оком
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
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: ПОНЧИКИ, ОБЛАЧКА-МЕЧТАНИЯ И РАДУЖНЫЕ ТУЧКИ ---
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

  // --- УРОВЕНЬ 4: НЕОНОВЫЕ КОРАЛЛЫ И МОРСКИЕ ВОДОРОСЛИ ---
  if (ob.shape === 'neon_coral' || ob.shape === 'seaweed_kelp') {
    const seaCol1 = `hsl(${165 + Math.sin(ob.phase || 0) * 45}, 95%, 68%)`;
    const seaCol2 = `hsl(${290 + Math.cos(ob.phase || 0) * 40}, 95%, 74%)`;
    ctx.fillStyle = seaCol1;
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (ob.shape === 'neon_coral') {
      // Ветвистый неоновый коралл
      ctx.strokeStyle = seaCol2;
      ctx.lineWidth = 8;
      [[-14, -18], [0, -24], [14, -16], [-20, -4], [20, -4]].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.moveTo(0, 16);
        ctx.quadraticCurveTo(bx * 0.5, 0, bx, by);
        ctx.stroke();
        ctx.fillStyle = seaCol1;
        ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      // Переплетающиеся светящиеся водоросли
      ctx.strokeStyle = seaCol1;
      ctx.lineWidth = 6;
      [-10, 0, 10].forEach((kx, idx) => {
        const sway = Math.sin((ob.phase || 0) * 3 + idx) * 7;
        ctx.beginPath();
        ctx.moveTo(kx, 22);
        ctx.quadraticCurveTo(kx + sway, 0, kx - sway, -22);
        ctx.stroke();
      });
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: КОЛЮЧИЕ НЕОНОВЫЕ БУТОНЫ И СВЕЧЕНЬЕ ХИЩНОЙ ФЛОРЫ ---
  if (ob.shape === 'thorn_pod') {
    ctx.rotate(ob.rot || 0);
    ctx.fillStyle = '#80ed99';
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#1b4332';
    ctx.strokeStyle = '#80ed99';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 6;
      const rad = i % 2 === 0 ? ob.r + 5 : ob.r - 6;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ff006e';
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // Уровень 1 (Металлические фигуры с неоном)
  ctx.rotate(ob.rot || 0);
  const neonCol = ob.neonColor || '#00f5d4';
  ctx.fillStyle = neonCol;
  ctx.globalAlpha = 0.24;
  ctx.beginPath(); ctx.arc(0, 0, ob.r + 10, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#33415c';
  ctx.strokeStyle = neonCol;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * i) / 3;
    if (i === 0) ctx.moveTo(Math.cos(a) * ob.r, Math.sin(a) * ob.r);
    else ctx.lineTo(Math.cos(a) * ob.r, Math.sin(a) * ob.r);
  }
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = neonCol;
  ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// =========================================================================
// ВРАГИ УРОВНЕЙ 1–5:
// - Ур.1: Галлюциногенные переливы
// - Ур.2: Скелеты, Летучие Мыши и Зомби с багровым неоновым свечением
// - Ур.3: Единороги и Радужки-Мутанты
// - Ур.4: Корабли-Рыбы и Корабли-Осьминоги в пастельных неоновых переливах
// - Ур.5: Страшные и яркие Корабли-Растения в зелёном неоне
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const hue = Math.floor((e.phase * 95) % 360);

  // --- УРОВЕНЬ 2: СКЕЛЕТЫ, ЛЕТУЧИЕ МЫШИ, ЗОМБИ С ТЁМНО-НЕОНОВЫМ ПЕРЕЛИВОМ ---
  if (e.kind === 'skeleton_ship' || e.kind === 'bat_ship' || e.kind === 'zombie_ship') {
    const darkHue = 340 + Math.sin(e.phase * 3) * 25;
    const darkNeon = `hsl(${darkHue}, 100%, 55%)`;
    ctx.fillStyle = darkNeon;
    ctx.globalAlpha = 0.25 + 0.12 * Math.sin(e.phase * 5);
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'skeleton_ship') {
      e.wingCol = '#d8e2dc'; e.bodyCol = '#4a4e69';
      ctx.strokeStyle = flash ? '#ffffff' : '#d8e2dc';
      ctx.lineWidth = 4;
      [-10, -2, 6].forEach(ry => {
        ctx.beginPath(); ctx.moveTo(-25, ry - 4); ctx.quadraticCurveTo(0, ry + 6, 25, ry - 4); ctx.stroke();
      });
      ctx.fillStyle = flash ? '#ffffff' : '#e2ece9';
      ctx.strokeStyle = darkNeon;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      roundRectPath(ctx, -8, 12, 16, 10, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(-5, 3, 3.8, 0, Math.PI * 2); ctx.arc(5, 3, 3.8, 0, Math.PI * 2); ctx.fill();
    } else if (e.kind === 'bat_ship') {
      e.wingCol = '#590d22'; e.bodyCol = '#1b1026';
      const flap = Math.sin(e.phase * 2.4) * 6;
      ctx.fillStyle = flash ? '#ffffff' : '#3c0919';
      ctx.strokeStyle = darkNeon;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -6); ctx.lineTo(-30, -14 + flap); ctx.lineTo(-22, 12 + flap); ctx.lineTo(-10, 6);
      ctx.lineTo(0, 20); ctx.lineTo(10, 6); ctx.lineTo(22, 12 + flap); ctx.lineTo(30, -14 + flap);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = flash ? '#ffffff' : '#1b1026';
      ctx.beginPath(); ctx.ellipse(0, 2, 12, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-5, 18); ctx.lineTo(-3, 25); ctx.lineTo(-1, 18);
      ctx.moveTo(5, 18);  ctx.lineTo(3, 25);  ctx.lineTo(1, 18);
      ctx.fill();
    } else {
      e.wingCol = '#6a994e'; e.bodyCol = '#386641';
      ctx.fillStyle = flash ? '#ffffff' : '#386641';
      ctx.strokeStyle = '#a7c957';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, 6); ctx.lineTo(-26, -10); ctx.lineTo(-18, 16); ctx.lineTo(0, 22); ctx.lineTo(20, 14); ctx.lineTo(24, -12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-12, 0, 3.8], [12, 4, 3.5], [0, -8, 3.5]], '#bc4749', '#ff002b');
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 3: ПОЛУ-КОРАБЛИ ЕДИНОРОГИ И РАДУЖКИ-МУТАНТЫ ---
  if (e.kind === 'unicorn_lancer' || e.kind === 'pegasus_bomber' || e.kind === 'iris_mutant') {
    const wingCol = `hsl(${hue}, 95%, 66%)`;
    const irisCol2 = `hsl(${(hue + 120) % 360}, 100%, 65%)`;
    e.wingCol = wingCol; e.bodyCol = '#fff8eb';

    ctx.fillStyle = wingCol;
    ctx.globalAlpha = 0.26;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (e.kind === 'iris_mutant') {
      ctx.fillStyle = flash ? '#ffffff' : '#2e226b';
      ctx.strokeStyle = wingCol;
      ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.arc(0, 0, 21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 2, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = wingCol;
      ctx.beginPath(); ctx.arc(0, 3, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.ellipse(0, 3, 2.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = flash ? '#ffffff' : wingCol;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -4); ctx.lineTo(-28, -14); ctx.lineTo(-20, 12); ctx.lineTo(0, 16); ctx.lineTo(20, 12); ctx.lineTo(28, -14);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = flash ? '#ffffff' : '#fff8eb';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(0, 0, 14, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.moveTo(-5, 16); ctx.lineTo(0, 34); ctx.lineTo(5, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 4: КОРАБЛИ-РЫБЫ И КОРАБЛИ-ОСЬМИНОГИ В ПАСТЕЛЬНЫХ НЕОНОВЫХ ПЕРЕЛИВАХ ---
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
      // Корабль-Осьминог с волнистыми щупальцами сверху
      ctx.strokeStyle = pastel2;
      ctx.lineWidth = 4.5;
      for (let k = -2; k <= 2; k++) {
        const wave = Math.sin(e.phase * 3 + k) * 5;
        ctx.beginPath();
        ctx.moveTo(k * 5, -10);
        ctx.quadraticCurveTo(k * 8 + wave, -24, k * 9, -30);
        ctx.stroke();
      }
      ctx.fillStyle = flash ? '#ffffff' : pastel1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 2, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(-6, 6, 3.2, 0, Math.PI * 2); ctx.arc(6, 6, 3.2, 0, Math.PI * 2); ctx.fill();
    } else {
      // Био-механический Корабль-Рыба с плавниками-крыльями и неоновым фонариком удильщика
      const fin = Math.sin(e.phase * 3) * 4;
      ctx.fillStyle = flash ? '#ffffff' : pastel2;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -6); ctx.lineTo(-28, -4 + fin); ctx.lineTo(-16, 14); ctx.lineTo(0, 18); ctx.lineTo(16, 14); ctx.lineTo(28, -4 + fin);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.fillStyle = flash ? '#ffffff' : pastel1;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, 13, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Светящаяся антенна рыбы-удильщика спереди
      ctx.fillStyle = '#fee440';
      ctx.beginPath(); ctx.arc(0, 26, 4.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 5: СТРАШНЫЕ И ЯРКИЕ КОРАБЛИ-РАСТЕНИЯ В ЗЕЛЁНОМ НЕОНЕ ---
  if (e.kind === 'plant_flytrap' || e.kind === 'plant_thorn' || e.kind === 'plant_vine') {
    const bioNeon = `hsl(${105 + Math.sin(e.phase * 3) * 30}, 95%, 62%)`;
    const petalCol = e.kind === 'plant_flytrap' ? '#ff006e' : (e.kind === 'plant_thorn' ? '#ffbe0b' : '#7209b7');
    e.wingCol = bioNeon; e.bodyCol = petalCol;

    ctx.fillStyle = bioNeon;
    ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(0, 0, e.r + 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Острые неоновые листья-крылья
    ctx.fillStyle = flash ? '#ffffff' : '#2d6a4f';
    ctx.strokeStyle = bioNeon;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 4); ctx.lineTo(-28, -12); ctx.lineTo(-18, 16); ctx.lineTo(0, 22); ctx.lineTo(18, 16); ctx.lineTo(28, -12);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Хищный бутон с зубастыми челюстями мухоловки
    ctx.fillStyle = flash ? '#ffffff' : petalCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, 2, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Белые шипы-зубы растения спереди
    ctx.fillStyle = '#ffffff';
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(k * 4 - 2, 15); ctx.lineTo(k * 4, 23); ctx.lineTo(k * 4 + 2, 15);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // --- УРОВЕНЬ 1 («Туманность Узоров»): ГАЛЛЮЦИНОГЕННЫЕ ПЕРЕЛИВЫ ---
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
  ctx.moveTo(0, 6); ctx.lineTo(-26, -12); ctx.lineTo(-18, 14); ctx.lineTo(0, 22); ctx.lineTo(18, 14); ctx.lineTo(26, -12);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : bodyCol;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.8;
  ctx.beginPath(); ctx.ellipse(0, 2, 14, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = flash ? '#ffffff' : domeCol;
  ctx.beginPath(); ctx.ellipse(0, 3, 7.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  drawWarts(ctx, [[-16, -2, 3.2], [16, -2, 3.2], [-11, 10, 2.8], [11, 10, 2.8]], wartCol, '#ffffff');
  ctx.restore();
}

// =========================================================================
// БОССЫ УРОВНЕЙ 1–5 (с поддержкой масштаба для 2 боссов в режиме «Безумие»!)
// - Ур.1: Оракул Фракталов
// - Ур.2: Вампир-Слизняк
// - Ур.3: Пончик-Мутант
// - Ур.4: Пастельный Морской Осьминог (лучи из щупалец, волны изо рта, молнии из глаз)
// - Ур.5: Гигантский Страшный Цветок (вращающиеся лазерные цветки, лианы и лазеры)
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  const bScale = b.bossScale || 1.0;

  // ЛАЗЕРЫ ИЛИ МОЛНИИ ИЗ ГЛАЗ БОССА
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = lvl.id === 2 ? 'rgba(255, 0, 43, 0.85)' : (lvl.id === 5 ? 'rgba(128, 237, 153, 0.85)' : 'rgba(155, 246, 255, 0.85)');
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    [-22 * bScale, 22 * bScale].forEach(ex => {
      ctx.beginPath();
      ctx.moveTo(b.x + ex, b.y - 6);
      ctx.lineTo(b.laserX + ex * 0.6, H);
      ctx.stroke();
    });
    ctx.restore();
  } else if (b.laserState === 'fire') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    [-22 * bScale, 22 * bScale].forEach((ex, idx) => {
      const startX = b.x + ex;
      const startY = b.y - 6;
      const endX = b.laserX + ex * 0.6;
      const beamCol = lvl.id === 2
        ? '#ff002b'
        : (lvl.id === 5 ? '#70e000' : `hsl(${(b.time * 220 + idx * 140) % 360}, 100%, 66%)`);

      if (lvl.id === 4) {
        // На 4-м уровне босс-осьминог бьёт ветвистыми МОЛНИЯМИ из глаз!
        ctx.strokeStyle = '#9bf6ff';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let seg = 1; seg <= 8; seg++) {
          const t = seg / 8;
          const lx = startX + (endX - startX) * t + (Math.random() - 0.5) * 28;
          const ly = startY + (H - startY) * t;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = beamCol;
        ctx.lineWidth = 22 * bScale;
        ctx.globalAlpha = 0.44;
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6 * bScale;
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, H); ctx.stroke();
      }
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
  const hue = Math.floor((b.time * 80) % 360);

  // --- БОСС УРОВНЯ 5: ОГРОМНЫЙ СТРАШНЫЙ ХИЩНЫЙ ЦВЕТОК ---
  if (lvl.id === 5) {
    // Хлещущие неоновые лианы с шипами, которыми цветок пытается сбить корабль
    ctx.strokeStyle = '#38b000';
    ctx.lineWidth = 11;
    for (let v = 0; v < 4; v++) {
      const t = v - 1.5;
      const whipX = Math.sin(b.time * 4.5 + v * 1.3) * 34;
      ctx.beginPath();
      ctx.moveTo(t * 24, 20);
      ctx.bezierCurveTo(t * 36 + whipX, 55, t * 20 - whipX, 82, t * 32 + whipX * 0.6, 102);
      ctx.stroke();
      ctx.strokeStyle = '#80ed99';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = '#38b000';
      ctx.lineWidth = 11;
    }

    // Вращающийся венчик острых ядовито-неоновых лепестков
    ctx.save();
    ctx.rotate(b.time * 0.65);
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      ctx.rotate((Math.PI * 2) / petalCount);
      ctx.fillStyle = i % 2 === 0 ? '#d90429' : '#7209b7';
      ctx.strokeStyle = '#80ed99';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(22, 52, 0, 72);
      ctx.quadraticCurveTo(-22, 52, 0, 18);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    // Центральная мясистая сердцевина цветка
    ctx.fillStyle = flash ? '#ffffff' : '#1b4332';
    ctx.strokeStyle = '#80ed99';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Три хищных глаза и зубастая пасть цветка
    [-18, 18].forEach(ex => {
      ctx.fillStyle = '#fee440';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, -8, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d90429';
      ctx.beginPath(); ctx.ellipse(ex + lookX, -8, 3.5, 7, 0, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#081c15';
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 3;
    roundRectPath(ctx, -22, 10, 44, 18, 9);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 4: МИГАЮЩИЙ ПАСТЕЛЬНЫЙ МОРСКОЙ ОСЬМИНОГ ---
  if (lvl.id === 4) {
    const seaHue = 165 + Math.sin(b.time * 3.5) * 55;
    const pastelBody = `hsl(${seaHue}, 92%, 72%)`;
    const pastelGlow = `hsl(${(seaHue + 90) % 360}, 95%, 80%)`;

    ctx.fillStyle = pastelGlow;
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(b.time * 8);
    ctx.beginPath(); ctx.arc(0, 6, 78, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // 6 щупалец со светящимися присосками, испускающими лучи
    for (let i = 0; i < 6; i++) {
      const t = i - 2.5;
      const waveX = Math.sin(b.time * 5 + i) * 14;
      const tipX = t * 24 - waveX * 0.5;
      ctx.strokeStyle = `hsl(${(seaHue + i * 35) % 360}, 95%, 74%)`;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(t * 18, 22);
      ctx.quadraticCurveTo(t * 22 + waveX, 52, tipX, 76);
      ctx.stroke();

      // Светящийся излучатель на кончике каждого щупальца
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
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(ex, -4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0077b6';
      ctx.beginPath(); ctx.arc(ex + lookX, -2, 6.5, 0, Math.PI * 2); ctx.fill();
    });

    // Воронкообразный рот осьминога для волновых ударов
    ctx.fillStyle = '#03045e';
    ctx.strokeStyle = pastelGlow;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 18, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 3: ПОНЧИК-МУТАНТ ---
  if (lvl.id === 3) {
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

    ctx.fillStyle = '#120824';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 12, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    [-22, 22].forEach(ex => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(ex, -10, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff006e';
      ctx.beginPath(); ctx.arc(ex + lookX, -8, 6.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 2: СТРАШНЫЙ ВАМПИР-СЛИЗНЯК ---
  if (lvl.id === 2) {
    ctx.fillStyle = '#2b0514';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-68, -28); ctx.lineTo(-42, -66); ctx.lineTo(0, -44); ctx.lineTo(42, -66); ctx.lineTo(68, -28);
    ctx.lineTo(52, 24); ctx.lineTo(-52, 24);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    const squish = Math.sin(b.time * 4) * 5;
    ctx.fillStyle = flash ? '#ffffff' : '#590d22';
    ctx.strokeStyle = '#ff002b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -6, 54 + squish * 0.4, Math.PI, 0);
    ctx.bezierCurveTo(66, 28, 45, 52, 0, 48 + squish);
    ctx.bezierCurveTo(-45, 52, -66, 28, -54 - squish * 0.4, -6);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    drawWarts(ctx, [[-36, -18, 6.5], [36, -18, 6.5], [-42, 8, 5.5], [42, 8, 5.5]], '#800f2f', '#ff4d6d');

    ctx.fillStyle = '#090206';
    roundRectPath(ctx, -28, 12, 56, 26, 12);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    [[-18, 12, -13, 28, -8, 12], [8, 12, 13, 28, 18, 12]].forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
    });

    [-20, 20].forEach(ex => {
      ctx.fillStyle = '#ffccd5';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(ex, -6, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff002b';
      ctx.beginPath(); ctx.arc(ex + lookX, -4, 7, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
    return;
  }

  // --- БОСС УРОВНЯ 1 («Туманность Узоров») ---
  const dynamicBossCol = `hsl(${hue}, 88%, 54%)`;
  const dynamicAccent = `hsl(${(hue + 120) % 360}, 95%, 65%)`;

  for (let i = 0; i < 4; i++) {
    const t = i - 1.5;
    const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
    ctx.strokeStyle = `hsl(${(hue + i * 55) % 360}, 95%, 62%)`;
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(t * 28, 24); ctx.quadraticCurveTo(t * 28 + waveX, 52, t * 32 - waveX * 0.6, 74); ctx.stroke();
  }

  ctx.fillStyle = flash ? '#ffffff' : dynamicBossCol;
  ctx.strokeStyle = dynamicAccent;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 56, Math.PI, 0);
  ctx.quadraticCurveTo(60, 34, 0, 36);
  ctx.quadraticCurveTo(-60, 34, -56, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(ex, -4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff006e';
    ctx.beginPath(); ctx.arc(ex + lookX, -2, 6, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = INK;
  roundRectPath(ctx, -22, 13, 44, 14, 7);
  ctx.fill();
  ctx.restore();
}
