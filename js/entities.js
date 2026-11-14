'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'Звёздная Бухта',
    enemiesDesc: 'Слизни-НЛО и Зубастые Метеоры',
    bossName: 'Доктор Кракен-Бот',
    theme: 'space',
    enemyTypes: ['ufo', 'meteor'],
    skyTop: '#171136', skyMid: '#241954', skyBot: '#311f6b',
    nebula1: 'rgba(255, 107, 157, 0.12)', nebula2: 'rgba(72, 219, 251, 0.11)',
    accent: '#48dbfb', bossColor: '#9b5de5',
    songStyle: 0, bpm: 122, rootOffset: 0, hpMult: 1.0
  },
  {
    id: 2,
    name: 'Туманность Сахарной Ваты',
    enemiesDesc: 'Зефирные Бомберы и Леденцовые Дроны',
    bossName: 'Королева Зефира',
    theme: 'candy',
    enemyTypes: ['marshmallow', 'lollipop'],
    skyTop: '#4a1942', skyMid: '#893168', skyBot: '#c8558c',
    nebula1: 'rgba(255, 214, 232, 0.22)', nebula2: 'rgba(255, 230, 109, 0.15)',
    accent: '#ffafcc', bossColor: '#ff70a6',
    songStyle: 1, bpm: 126, rootOffset: 2, hpMult: 1.12
  },
  {
    id: 3,
    name: 'Пояс Пончиковых Астероидов',
    enemiesDesc: 'Злые Пончики и Кексы-Камикадзе',
    bossName: 'Мега-Бургер Дредноут',
    theme: 'donuts',
    enemyTypes: ['angry_donut', 'cupcake'],
    skyTop: '#2b193d', skyMid: '#48284a', skyBot: '#7a3b69',
    nebula1: 'rgba(255, 183, 3, 0.15)', nebula2: 'rgba(251, 86, 7, 0.13)',
    accent: '#ffb703', bossColor: '#f77f00',
    songStyle: 1, bpm: 128, rootOffset: 4, hpMult: 1.24
  },
  {
    id: 4,
    name: 'Изумрудные Джунгли Орбиты',
    enemiesDesc: 'Хищные Мухоловки и Споровые Жуки',
    bossName: 'Споровый Левиафан',
    theme: 'jungle',
    enemyTypes: ['flytrap', 'spore_bug'],
    skyTop: '#0b2e26', skyMid: '#134e3f', skyBot: '#1f7a5c',
    nebula1: 'rgba(128, 237, 153, 0.18)', nebula2: 'rgba(255, 209, 102, 0.12)',
    accent: '#06d6a0', bossColor: '#38b000',
    songStyle: 0, bpm: 124, rootOffset: 5, hpMult: 1.36
  },
  {
    id: 5,
    name: 'Ледяная Комета Криона',
    enemiesDesc: 'Снежные Големы и Сосульки-Перехватчики',
    bossName: 'Ледяной Титан Фрост-9',
    theme: 'ice',
    enemyTypes: ['snow_golem', 'icicle'],
    skyTop: '#0d253f', skyMid: '#184e77', skyBot: '#1e6091',
    nebula1: 'rgba(144, 224, 239, 0.22)', nebula2: 'rgba(202, 240, 248, 0.18)',
    accent: '#90e0ef', bossColor: '#48cae4',
    songStyle: 2, bpm: 128, rootOffset: -2, hpMult: 1.48
  },
  {
    id: 6,
    name: 'Вулканическая Кузница Магмы',
    enemiesDesc: 'Лавовые Элементали и Огненные Скорпионы',
    bossName: 'Инферно-Краб Вулкан',
    theme: 'lava',
    enemyTypes: ['lava_elem', 'fire_scorp'],
    skyTop: '#2b0909', skyMid: '#591414', skyBot: '#942911',
    nebula1: 'rgba(255, 107, 53, 0.22)', nebula2: 'rgba(255, 190, 11, 0.16)',
    accent: '#ff6b35', bossColor: '#e63946',
    songStyle: 3, bpm: 132, rootOffset: -5, hpMult: 1.60
  },
  {
    id: 7,
    name: 'Кибер-Сити Неонополис',
    enemiesDesc: 'Неоновые Кубы и Лазерные Турели',
    bossName: 'Кибер-Сфинкс MK-IV',
    theme: 'cyber',
    enemyTypes: ['neon_cube', 'cyber_turret'],
    skyTop: '#0f0726', skyMid: '#1d1147', skyBot: '#361973',
    nebula1: 'rgba(0, 245, 212, 0.18)', nebula2: 'rgba(241, 91, 181, 0.18)',
    accent: '#00f5d4', bossColor: '#f15bb5',
    songStyle: 3, bpm: 135, rootOffset: 1, hpMult: 1.72
  },
  {
    id: 8,
    name: 'Золотая Пустыня Дюн',
    enemiesDesc: 'Мумии-Боты и Золотые Сфинксы',
    bossName: 'Фараон-Скарабей',
    theme: 'desert',
    enemyTypes: ['mummy_bot', 'sand_drone'],
    skyTop: '#3d2516', skyMid: '#774926', skyBot: '#b57436',
    nebula1: 'rgba(255, 209, 102, 0.22)', nebula2: 'rgba(255, 159, 28, 0.15)',
    accent: '#ffd166', bossColor: '#e09f3e',
    songStyle: 2, bpm: 126, rootOffset: 3, hpMult: 1.85
  },
  {
    id: 9,
    name: 'Призрачный Сектор Эфира',
    enemiesDesc: 'Космо-Привидения и Проклятые Черепа',
    bossName: 'Призрачный Адмирал',
    theme: 'ghost',
    enemyTypes: ['ghost_orb', 'skull_bot'],
    skyTop: '#161329', skyMid: '#2a234d', skyBot: '#433878',
    nebula1: 'rgba(189, 178, 255, 0.20)', nebula2: 'rgba(114, 239, 221, 0.15)',
    accent: '#bdb2ff', bossColor: '#7209b7',
    songStyle: 2, bpm: 130, rootOffset: -3, hpMult: 2.0
  },
  {
    id: 10,
    name: 'Цитадель Императора Кракена',
    enemiesDesc: 'Боевые Дредноуты и Имперские Стражи',
    bossName: 'Император Омега-Кракен',
    theme: 'citadel',
    enemyTypes: ['dreadnought', 'royal_guard'],
    skyTop: '#1b0718', skyMid: '#3d0c2e', skyBot: '#6e1447',
    nebula1: 'rgba(255, 0, 110, 0.22)', nebula2: 'rgba(255, 190, 11, 0.18)',
    accent: '#ff006e', bossColor: '#d90429',
    songStyle: 3, bpm: 138, rootOffset: 0, hpMult: 2.25
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

// =========================================================================
// 1. БОНУСЫ ИЗ КОСМИЧЕСКОЙ ЕДЫ (5 ВИДОВ ОРУЖИЯ И ЗАЩИТЫ)
// =========================================================================
function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.1;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const auraColors = {
    pizza:  'rgba(255, 183, 3, 0.30)',
    sushi:  'rgba(6, 214, 160, 0.30)',
    donut:  'rgba(255, 112, 166, 0.32)',
    burger: 'rgba(247, 127, 0, 0.30)',
    milk:   'rgba(72, 219, 251, 0.32)'
  };

  // Светящийся пузырь вокруг еды
  ctx.fillStyle = auraColors[bn.type] || 'rgba(255,255,255,0.25)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'pizza') {
    // Кусочек Космо-Пиццы (Огненный Веер)
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(13, 10);
    ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Корочка
    ctx.fillStyle = '#e07a5f';
    roundRectPath(ctx, -14, 8, 28, 5, 2.5);
    ctx.fill();
    ctx.stroke();

    // Пепперони
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-3, 2, 2.6, 0, Math.PI * 2);
    ctx.arc(4, 4, 2.4, 0, Math.PI * 2);
    ctx.arc(0, -5, 2.2, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'sushi') {
    // Суши-Ролл (Плазменные Сюрикены)
    ctx.fillStyle = '#1e1633';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -13, -10, 26, 20, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff8eb';
    roundRectPath(ctx, -10, -7, 20, 14, 6);
    ctx.fill();

    // Начинка (лосось и авокадо)
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-2, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(4, 1, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'donut') {
    // Турбо-Пончик (Гипер-Лазер + Магнит)
    ctx.fillStyle = '#f4a261';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'burger') {
    // Мега-Бургер (Бургер-Ракеты + Ремонт)
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    // Нижняя булка
    ctx.fillStyle = '#f4a261';
    roundRectPath(ctx, -13, 5, 26, 6, 3);
    ctx.fill();
    ctx.stroke();
    // Котлета и салат
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -14, 0, 28, 6, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8ac926';
    ctx.fillRect(-14, -2, 28, 3);
    // Верхняя булка
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, -1, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else {
    // Космо-Молоко (Энергетический Щит)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -9, -7, 18, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#48dbfb';
    ctx.fillRect(-7, -1, 14, 8);

    // Крышечка
    ctx.fillStyle = '#ff5964';
    roundRectPath(ctx, -6, -12, 12, 5, 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// =========================================================================
// 2. ОТРИСОВКА СНАРЯДОВ ИГРОКА (ПОД КАЖДЫЙ ТИП ОРУЖИЯ)
// =========================================================================
function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'pizza_slice') {
    // Раскалённый кусок пиццы
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.lineTo(8, 8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, 1, 2.4, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.kind === 'shuriken') {
    // Вращающийся суши-сюрикен
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
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.kind === 'burger_rocket') {
    // Тяжёлая Бургер-Ракета
    ctx.fillStyle = '#ff9f1c';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -7, -12, 14, 24, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, -8, 7, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

  } else if (b.kind === 'laser_bolt') {
    // Гипер-лазерный импульс
    ctx.fillStyle = '#ff70a6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    roundRectPath(ctx, -4, -18, 8, 36, 4);
    ctx.fill();
    ctx.stroke();

  } else {
    // Стандартная плазма
    ctx.fillStyle = b.color;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.75, b.r * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// =========================================================================
// 3. 20 УНИКАЛЬНЫХ ВРАГОВ (ПО 2 СОБСТВЕННЫХ ВРАГА НА КАЖДЫЙ ИЗ 10 МИРОВ)
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const fCol = (c) => (flash ? '#ffffff' : c);

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  switch (e.kind) {
    // --- СЕКТОР 1: Звёздная Бухта ---
    case 'ufo':
      ctx.fillStyle = fCol('#8ac926');
      ctx.beginPath();
      ctx.ellipse(0, 5, 24, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fCol('#bde0fe');
      ctx.beginPath();
      ctx.arc(0, 1, 13, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      break;

    case 'meteor':
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = fCol('#e07a5f');
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = (Math.PI * 2 * i) / 9;
        const rad = e.r * (i % 2 === 0 ? 1.05 : 0.85);
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.rotate(-(e.rot || 0));
      break;

    // --- СЕКТОР 2: Туманность Сахарной Ваты ---
    case 'marshmallow':
      ctx.fillStyle = fCol('#ffccd5');
      roundRectPath(ctx, -20, -22, 40, 44, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fCol('#ff70a6');
      ctx.fillRect(-18, -4, 36, 8);
      break;

    case 'lollipop':
      ctx.fillStyle = '#fff8eb';
      ctx.fillRect(-3, 8, 6, 18);
      ctx.strokeRect(-3, 8, 6, 18);
      ctx.fillStyle = fCol('#ff4d6d');
      ctx.beginPath();
      ctx.arc(0, -4, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -4, 10, 0, Math.PI * 1.4);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      break;

    // --- СЕКТОР 3: Пояс Пончиковых Астероидов ---
    case 'angry_donut':
      ctx.fillStyle = fCol('#f4a261');
      ctx.beginPath();
      ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fCol('#ff70a6');
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b193d';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'cupcake':
      ctx.fillStyle = fCol('#48dbfb');
      ctx.beginPath();
      ctx.moveTo(-16, 4);
      ctx.lineTo(16, 4);
      ctx.lineTo(12, 22);
      ctx.lineTo(-12, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fCol('#ffbe0b');
      ctx.beginPath();
      ctx.arc(0, 2, 18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff006e';
      ctx.beginPath();
      ctx.arc(0, -18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 4: Изумрудные Джунгли Орбиты ---
    case 'flytrap':
      ctx.fillStyle = fCol('#38b000');
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(-4, -8, 4, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'spore_bug':
      ctx.fillStyle = fCol('#80ed99');
      ctx.beginPath();
      ctx.ellipse(-18, -4, 12, 7, -0.4, 0, Math.PI * 2);
      ctx.ellipse(18, -4, 12, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fCol('#007f5f');
      ctx.beginPath();
      ctx.ellipse(0, 2, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 5: Ледяная Комета Криона ---
    case 'snow_golem':
      ctx.fillStyle = fCol('#caf0f8');
      ctx.beginPath();
      ctx.arc(0, 8, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -12, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(10, -9);
      ctx.lineTo(0, -7);
      ctx.closePath();
      ctx.fill();
      break;

    case 'icicle':
      ctx.fillStyle = fCol('#90e0ef');
      ctx.beginPath();
      ctx.moveTo(-16, -20);
      ctx.lineTo(16, -20);
      ctx.lineTo(0, 26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 6: Вулканическая Кузница Магмы ---
    case 'lava_elem':
      ctx.fillStyle = fCol('#e63946');
      roundRectPath(ctx, -22, -20, 44, 40, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffba08';
      ctx.beginPath();
      ctx.moveTo(-14, -20);
      ctx.lineTo(-8, -30);
      ctx.lineTo(-2, -20);
      ctx.moveTo(2, -20);
      ctx.lineTo(8, -30);
      ctx.lineTo(14, -20);
      ctx.fill();
      ctx.stroke();
      break;

    case 'fire_scorp':
      ctx.fillStyle = fCol('#f77f00');
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.arc(-20, 14, 7, 0, Math.PI * 2);
      ctx.arc(20, 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 7: Кибер-Сити Неонополис ---
    case 'neon_cube':
      ctx.fillStyle = fCol('#3a0ca3');
      ctx.strokeStyle = '#00f5d4';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.strokeStyle = '#f15bb5';
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.strokeStyle = INK;
      break;

    case 'cyber_turret':
      ctx.fillStyle = fCol('#f15bb5');
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.lineTo(-24, -14);
      ctx.lineTo(0, -6);
      ctx.lineTo(24, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 8: Золотая Пустыня Дюн ---
    case 'mummy_bot':
      ctx.fillStyle = fCol('#f4e285');
      roundRectPath(ctx, -19, -22, 38, 44, 15);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, -8); ctx.lineTo(18, -4);
      ctx.moveTo(-18, 6);  ctx.lineTo(18, 10);
      ctx.stroke();
      break;

    case 'sand_drone':
      ctx.fillStyle = fCol('#e09f3e');
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(25, 16);
      ctx.lineTo(-25, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 9: Призрачный Сектор Эфира ---
    case 'ghost_orb':
      ctx.fillStyle = fCol('#bdb2ff');
      ctx.beginPath();
      ctx.arc(0, -4, 20, Math.PI, 0);
      ctx.lineTo(20, 18);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 18);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-20, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'skull_bot':
      ctx.fillStyle = fCol('#e2ece9');
      ctx.beginPath();
      ctx.arc(0, -4, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      roundRectPath(ctx, -11, 8, 22, 12, 4);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 10: Цитадель Императора Кракена ---
    case 'dreadnought':
      ctx.fillStyle = fCol('#590d22');
      roundRectPath(ctx, -26, -20, 52, 40, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(-20, 14, 10, 10);
      ctx.fillRect(10, 14, 10, 10);
      break;

    case 'royal_guard':
    default:
      ctx.fillStyle = fCol('#d90429');
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.lineTo(-24, -16);
      ctx.lineTo(0, -24);
      ctx.lineTo(24, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }

  // Мультяшные злые глазки для всех врагов (кроме спиной повернутой мухоловки)
  if (e.kind !== 'flytrap') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -2, 4.5, 0, Math.PI * 2);
    ctx.arc(7, -2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(-7, -1, 2, 0, Math.PI * 2);
    ctx.arc(7, -1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Полоска здоровья для крепких врагов
  if (e.maxHp > 2 && e.hp < e.maxHp) {
    const bw = 34;
    ctx.fillStyle = INK;
    ctx.fillRect(-bw / 2, -e.r - 12, bw, 6);
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(-bw / 2 + 1, -e.r - 11, (bw - 2) * (e.hp / e.maxHp), 4);
  }

  ctx.restore();
}

// =========================================================================
// 4. 10 УНИКАЛЬНЫХ БОССОВ
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  if (b.laserState === 'charge') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 110, 0.75)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(b.laserX, b.y + 40);
    ctx.lineTo(b.laserX, H);
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
  const mainCol = flash ? '#ffffff' : (b.phase === 3 ? '#ff4d6d' : lvl.bossColor);
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  if (lvl.id === 2) {
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    [
      { x: -36, y: 12, r: 26 },
      { x: 36,  y: 12, r: 26 },
      { x: -22, y: -16, r: 28 },
      { x: 22,  y: -16, r: 28 },
      { x: 0,   y: 8,  r: 38 }
    ].forEach(pf => {
      ctx.beginPath();
      ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -38);
    ctx.lineTo(-12, -62);
    ctx.lineTo(0, -45);
    ctx.lineTo(12, -62);
    ctx.lineTo(22, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 3) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261';
    roundRectPath(ctx, -54, 16, 108, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -58, 2, 116, 16, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8ac926';
    roundRectPath(ctx, -60, -6, 120, 10, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, -4, 54, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 4) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const a = b.time * 0.7 + (Math.PI * 2 * i) / 6;
      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#80ed99';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 44, Math.sin(a) * 34, 22, 14, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 5) {
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -64);
    ctx.lineTo(58, -10);
    ctx.lineTo(38, 44);
    ctx.lineTo(-38, 44);
    ctx.lineTo(-58, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 6) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const clawWave = Math.sin(b.time * 4) * 6;
    [-64, 64].forEach((cx, idx) => {
      ctx.fillStyle = '#ffba08';
      ctx.beginPath();
      ctx.arc(cx, 18 + (idx === 0 ? clawWave : -clawWave), 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = mainCol;
    roundRectPath(ctx, -56, -34, 112, 66, 26);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 7) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.moveTo(-72, -16);
    ctx.lineTo(72, -16);
    ctx.lineTo(48, 18);
    ctx.lineTo(-48, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.lineTo(46, 36);
    ctx.lineTo(-46, 36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 8) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath();
    ctx.arc(0, -46, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.ellipse(0, 4, 56, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 9) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, 0, 48, Math.PI, 0);
    ctx.lineTo(48, 38);
    ctx.lineTo(24, 24);
    ctx.lineTo(0, 40);
    ctx.lineTo(-24, 24);
    ctx.lineTo(-48, 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.moveTo(-58, -24);
    ctx.quadraticCurveTo(0, -64, 58, -24);
    ctx.quadraticCurveTo(0, -14, -58, -24);
    ctx.fill();
    ctx.stroke();

  } else {
    const tentacleCount = lvl.id === 10 ? 6 : 4;
    for (let i = 0; i < tentacleCount; i++) {
      const t = i - (tentacleCount - 1) / 2;
      const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
      const baseX = t * (lvl.id === 10 ? 20 : 28);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(baseX, 24);
      ctx.quadraticCurveTo(baseX + waveX, 52, baseX * 1.2 - waveX * 0.6, 74);
      ctx.stroke();
      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 8;
      ctx.stroke();
    }
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, Math.PI, 0);
    ctx.quadraticCurveTo(60, 34, 0, 36);
    ctx.quadraticCurveTo(-60, 34, -56, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -48);
    ctx.lineTo(-12, -74);
    ctx.lineTo(0, -54);
    ctx.lineTo(12, -74);
    ctx.lineTo(22, -48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

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
    ctx.arc(ex + lookX - 2, -4, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Брови
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-34, -20);
  ctx.lineTo(-8, -13);
  ctx.moveTo(34, -20);
  ctx.lineTo(8, -13);
  ctx.stroke();

  // Улыбка
  ctx.fillStyle = INK;
  roundRectPath(ctx, -20, 14, 40, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, 14, 6, 5);
  ctx.fillRect(7, 14, 6, 5);

  ctx.restore();
}
