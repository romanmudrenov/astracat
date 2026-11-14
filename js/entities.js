'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'Звёздная Бухта',
    story: 'Редж выходит на орбиту Котовии-17! Слизни-НЛО, Метеоры и Космические Рыбки перекрыли путь к первым запасам.',
    enemiesDesc: 'Слизни-НЛО, Метеоры и Космические Рыбки',
    bossName: 'Доктор Кракен-Бот',
    bossWeapon: 'Плазменный веер и Мега-Луч',
    theme: 'space',
    enemyTypes: ['ufo', 'meteor', 'space_fish'],
    skyTop: '#100b26', skyMid: '#1b1442', skyBot: '#271c5e',
    nebula1: 'rgba(255, 107, 157, 0.14)', nebula2: 'rgba(72, 219, 251, 0.14)',
    accent: '#48dbfb', bossColor: '#9b5de5', hpMult: 1.0
  },
  {
    id: 2,
    name: 'Туманность Сахарной Ваты',
    story: 'Сладкое облако захватило торговый маршрут! Осторожно: шустрые Имбирные Пряники и липкие залпы Королевы Зефира!',
    enemiesDesc: 'Зефирные Бомберы, Леденцы и Имбирные Пряники',
    bossName: 'Королева Зефира',
    bossWeapon: 'Тройные зефирные пузыри',
    theme: 'candy',
    enemyTypes: ['marshmallow', 'lollipop', 'gingerbread'],
    skyTop: '#290d24', skyMid: '#4a1942', skyBot: '#6e2562',
    nebula1: 'rgba(255, 175, 204, 0.18)', nebula2: 'rgba(255, 230, 109, 0.14)',
    accent: '#ffafcc', bossColor: '#ff70a6', hpMult: 1.12
  },
  {
    id: 3,
    name: 'Пояс Пончиковых Астероидов',
    story: 'Космическая закусочная взбунтовалась! Сквозь Злых Пончиков и Мармеладных Мишек прорывайся к Дредноуту.',
    enemiesDesc: 'Злые Пончики, Кексы и Мармеладные Мишки',
    bossName: 'Мега-Бургер Дредноут',
    bossWeapon: 'Залп острых кетчуп-ракет',
    theme: 'donuts',
    enemyTypes: ['angry_donut', 'cupcake', 'gummy_bear'],
    skyTop: '#1e112b', skyMid: '#361e47', skyBot: '#522c6b',
    nebula1: 'rgba(255, 183, 3, 0.16)', nebula2: 'rgba(251, 86, 7, 0.14)',
    accent: '#ffb703', bossColor: '#f77f00', hpMult: 1.24
  },
  {
    id: 4,
    name: 'Изумрудные Джунгли Орбиты',
    story: 'Гигантские космические споры опутали спутники связи. Пробейся сквозь рой жуков и бронированных Космо-Улиток!',
    enemiesDesc: 'Мухоловки, Споровые Жуки и Космо-Улитки',
    bossName: 'Споровый Левиафан',
    bossWeapon: 'Вращающееся кольцо спор',
    theme: 'jungle',
    enemyTypes: ['flytrap', 'spore_bug', 'space_snail'],
    skyTop: '#071f19', skyMid: '#0e382e', skyBot: '#165445',
    nebula1: 'rgba(128, 237, 153, 0.16)', nebula2: 'rgba(255, 209, 102, 0.12)',
    accent: '#06d6a0', bossColor: '#38b000', hpMult: 1.36
  },
  {
    id: 5,
    name: 'Ледяная Комета Криона',
    story: 'Температура за бортом падает! Уворачивайся от Кристальных Пауков и ледяных осколков Титана Фрост-9.',
    enemiesDesc: 'Снежные Големы, Сосульки и Кристальные Пауки',
    bossName: 'Ледяной Титан Фрост-9',
    bossWeapon: 'Скоростные ледяные иглы',
    theme: 'ice',
    enemyTypes: ['snow_golem', 'icicle', 'crystal_spider'],
    skyTop: '#08192b', skyMid: '#103454', skyBot: '#184e77',
    nebula1: 'rgba(144, 224, 239, 0.18)', nebula2: 'rgba(202, 240, 248, 0.14)',
    accent: '#90e0ef', bossColor: '#48cae4', hpMult: 1.48
  },
  {
    id: 6,
    name: 'Вулканическая Кузница Магмы',
    story: 'Огненные крабы перегревают ядро планеты. Береги щит от Магма-Бомб и лавовых снарядов!',
    enemiesDesc: 'Лавовые Элементали, Скорпионы и Магма-Бомбы',
    bossName: 'Инферно-Краб Вулкан',
    bossWeapon: 'Магматический дождь и клешни',
    theme: 'lava',
    enemyTypes: ['lava_elem', 'fire_scorp', 'magma_bomb'],
    skyTop: '#1f0606', skyMid: '#3d0d0d', skyBot: '#631717',
    nebula1: 'rgba(255, 107, 53, 0.18)', nebula2: 'rgba(255, 190, 11, 0.14)',
    accent: '#ff6b35', bossColor: '#e63946', hpMult: 1.60
  },
  {
    id: 7,
    name: 'Кибер-Сити Неонополис',
    story: 'Главный сервер взломан! Кибер-Сфинкс охраняет коды доступа перекрёстными лазерами и Голо-Дронами.',
    enemiesDesc: 'Неоновые Кубы, Лазерные Турели и Голо-Дроны',
    bossName: 'Кибер-Сфинкс MK-IV',
    bossWeapon: 'Двойные перекрёстные лазеры',
    theme: 'cyber',
    enemyTypes: ['neon_cube', 'cyber_turret', 'holo_drone'],
    skyTop: '#0b051c', skyMid: '#160c36', skyBot: '#261459',
    nebula1: 'rgba(0, 245, 212, 0.16)', nebula2: 'rgba(241, 91, 181, 0.16)',
    accent: '#00f5d4', bossColor: '#f15bb5', hpMult: 1.72
  },
  {
    id: 8,
    name: 'Золотая Пустыня Дюн',
    story: 'Древние пирамиды поднялись в космос! Фараон-Скарабей вызывает песчаные вихри и стаи Золотых Скарабеев.',
    enemiesDesc: 'Мумии-Боты, Золотые Сфинксы и Скарабеи',
    bossName: 'Фараон-Скарабей',
    bossWeapon: 'Спиральные солнечные сферы',
    theme: 'desert',
    enemyTypes: ['mummy_bot', 'sand_drone', 'scarab_bot'],
    skyTop: '#26170d', skyMid: '#4a2d19', skyBot: '#734626',
    nebula1: 'rgba(255, 209, 102, 0.18)', nebula2: 'rgba(255, 159, 28, 0.14)',
    accent: '#ffd166', bossColor: '#e09f3e', hpMult: 1.85
  },
  {
    id: 9,
    name: 'Призрачный Сектор Эфира',
    story: 'Корабли-призраки вышли из гиперпространства. Остерегайся Призрачных Фонарей и самонаводящихся огней!',
    enemiesDesc: 'Космо-Привидения, Черепа и Призрачные Фонари',
    bossName: 'Призрачный Адмирал',
    bossWeapon: 'Самонаводящиеся призрачные огни',
    theme: 'ghost',
    enemyTypes: ['ghost_orb', 'skull_bot', 'ghost_lantern'],
    skyTop: '#0f0d1f', skyMid: '#1e193b', skyBot: '#30285e',
    nebula1: 'rgba(189, 178, 255, 0.18)', nebula2: 'rgba(114, 239, 221, 0.14)',
    accent: '#bdb2ff', bossColor: '#7209b7', hpMult: 2.0
  },
  {
    id: 10,
    name: 'Цитадель Императора Кракена',
    story: 'Финальная битва за продовольствие Котовии-17! Прорвись сквозь Звёздные Мины и победи Омега-Кракена!',
    enemiesDesc: 'Дредноуты, Имперские Стражи и Звёздные Мины',
    bossName: 'Император Омега-Кракен',
    bossWeapon: 'Все виды атак + Гипер-Луч',
    theme: 'citadel',
    enemyTypes: ['dreadnought', 'royal_guard', 'star_mine'],
    skyTop: '#140512', skyMid: '#2e0923', skyBot: '#4f0f3b',
    nebula1: 'rgba(255, 0, 110, 0.20)', nebula2: 'rgba(255, 190, 11, 0.16)',
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

function make3DGrad(ctx, x, y, r, lightCol, midCol, darkCol) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.08, x, y, r * 1.15);
  g.addColorStop(0, lightCol);
  g.addColorStop(0.55, midCol);
  g.addColorStop(1, darkCol);
  return g;
}

// =========================================================================
// 1. БОНУСЫ ИЗ КОСМИЧЕСКОЙ ЕДЫ
// =========================================================================
function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.1;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const auraColors = {
    pizza:  'rgba(255, 183, 3, 0.34)',
    sushi:  'rgba(6, 214, 160, 0.34)',
    donut:  'rgba(255, 112, 166, 0.36)',
    burger: 'rgba(247, 127, 0, 0.34)',
    milk:   'rgba(72, 219, 251, 0.36)'
  };

  ctx.fillStyle = auraColors[bn.type] || 'rgba(255,255,255,0.28)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'pizza') {
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 15, '#fff3b0', '#ffd166', '#e09f3e');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(13, 10); ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e07a5f';
    roundRectPath(ctx, -14, 8, 28, 5, 2.5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-3, 2, 2.6, 0, Math.PI * 2);
    ctx.arc(4, 4, 2.4, 0, Math.PI * 2);
    ctx.arc(0, -5, 2.2, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'sushi') {
    ctx.fillStyle = '#1e1633';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -13, -10, 26, 20, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff8eb';
    roundRectPath(ctx, -10, -7, 20, 14, 6);
    ctx.fill();

    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(-2, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(4, 1, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'donut') {
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 15, '#ffd6a5', '#f4a261', '#bc6c25');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = make3DGrad(ctx, 0, 0, 12, '#ffc2d1', '#ff70a6', '#c9184a');
    ctx.beginPath();
    ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (bn.type === 'burger') {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    ctx.fillStyle = '#f4a261';
    roundRectPath(ctx, -13, 5, 26, 6, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -14, 0, 28, 6, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8ac926';
    ctx.fillRect(-14, -2, 28, 3);
    ctx.fillStyle = make3DGrad(ctx, 0, -4, 13, '#ffe169', '#ffb703', '#ca6702');
    ctx.beginPath();
    ctx.arc(0, -1, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else {
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 16, '#ffffff', '#edf2f4', '#adb5bd');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, -9, -7, 18, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#48dbfb';
    ctx.fillRect(-7, -1, 14, 8);

    ctx.fillStyle = '#ff5964';
    roundRectPath(ctx, -6, -12, 12, 5, 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-7, -8, 4.5, 2.2, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =========================================================================
// 2. СНАРЯДЫ ИГРОКА В 3D-СТИЛЕ
// =========================================================================
function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'pizza_slice') {
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 11, '#fff3b0', '#ffd166', '#e09f3e');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -11); ctx.lineTo(8, 8); ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff5964';
    ctx.beginPath();
    ctx.arc(0, 1, 2.4, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.kind === 'shuriken') {
    ctx.rotate(b.rot || 0);
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 11, '#9ef01a', '#06d6a0', '#007f5f');
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
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 14, '#ffd166', '#ff9f1c', '#bc6c25');
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
    ctx.fillStyle = make3DGrad(ctx, 0, 0, 14, '#ffffff', '#ff70a6', '#c9184a');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    roundRectPath(ctx, -4, -18, 8, 36, 4);
    ctx.fill();
    ctx.stroke();

  } else {
    ctx.fillStyle = make3DGrad(ctx, 0, 0, b.r * 1.4, '#ffffff', b.color, '#1d3557');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.78, b.r * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// =========================================================================
// 3. 30 УНИКАЛЬНЫХ ОБЪЁМНЫХ 3D-ВРАГОВ (3 ВИДА НА КАЖДЫЙ ИЗ 10 СЕКТОРОВ)
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const g3d = (l, m, d) => (flash ? '#ffffff' : make3DGrad(ctx, 0, 0, e.r, l, m, d));

  // Объёмная 3D-тень под врагом
  ctx.fillStyle = 'rgba(8, 5, 22, 0.34)';
  ctx.beginPath();
  ctx.ellipse(5, e.r + 7, e.r * 0.78, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  switch (e.kind) {
    // --- СЕКТОР 1 ---
    case 'ufo':
      ctx.fillStyle = g3d('#d8f3dc', '#8ac926', '#386641');
      ctx.beginPath();
      ctx.ellipse(0, 5, 24, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#ffffff', '#bde0fe', '#4ea8de');
      ctx.beginPath();
      ctx.arc(0, 1, 13, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      break;

    case 'meteor':
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = g3d('#f4a261', '#e07a5f', '#6f1d1b');
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = (Math.PI * 2 * i) / 9;
        const rad = e.r * (i % 2 === 0 ? 1.08 : 0.82);
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.rotate(-(e.rot || 0));
      break;

    case 'space_fish':
      // Космическая Рыбка-Пиранья с плавниками и хвостом
      ctx.fillStyle = g3d('#ffbe0b', '#fb5607', '#9b2226');
      ctx.beginPath();
      ctx.moveTo(0, -24); ctx.lineTo(-12, -34); ctx.lineTo(12, -34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = g3d('#90e0ef', '#00b4d8', '#023e8a');
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.moveTo(-15, 0); ctx.lineTo(-25, -8); ctx.lineTo(-16, 10);
      ctx.moveTo(15, 0); ctx.lineTo(25, -8); ctx.lineTo(16, 10);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 2 ---
    case 'marshmallow':
      ctx.fillStyle = g3d('#ffffff', '#ffccd5', '#ff758f');
      roundRectPath(ctx, -20, -22, 40, 44, 15);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#ffccd5', '#ff70a6', '#a4133c');
      ctx.fillRect(-18, -4, 36, 8);
      break;

    case 'lollipop':
      ctx.fillStyle = '#fff8eb';
      ctx.fillRect(-3, 8, 6, 18);
      ctx.strokeRect(-3, 8, 6, 18);
      ctx.fillStyle = g3d('#ffccd5', '#ff4d6d', '#800f2f');
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

    case 'gingerbread':
      // Злой Имбирный Пряник с глазурью и пуговками
      ctx.fillStyle = g3d('#e6ccb2', '#b08968', '#7f5539');
      // Ручки и ножки
      roundRectPath(ctx, -24, -4, 48, 10, 5);
      ctx.fill();
      ctx.stroke();
      roundRectPath(ctx, -13, 6, 10, 18, 5);
      ctx.fill();
      ctx.stroke();
      roundRectPath(ctx, 3, 6, 10, 18, 5);
      ctx.fill();
      ctx.stroke();
      // Голова и туловище
      roundRectPath(ctx, -12, -6, 24, 20, 8);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -11, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Пуговки-леденцы
      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(0, 4, 2.5, 0, Math.PI * 2);
      ctx.arc(0, 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    // --- СЕКТОР 3 ---
    case 'angry_donut':
      ctx.fillStyle = g3d('#ffd6a5', '#f4a261', '#9c6644');
      ctx.beginPath();
      ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#ffc2d1', '#ff70a6', '#c9184a');
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
      ctx.fillStyle = g3d('#caf0f8', '#48dbfb', '#0077b6');
      ctx.beginPath();
      ctx.moveTo(-16, 4); ctx.lineTo(16, 4); ctx.lineTo(12, 22); ctx.lineTo(-12, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#fff3b0', '#ffbe0b', '#ca6702');
      ctx.beginPath();
      ctx.arc(0, 2, 18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#ffccd5', '#ff006e', '#800f2f');
      ctx.beginPath();
      ctx.arc(0, -18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'gummy_bear':
      // Мармеладный Мишка-Перехватчик
      ctx.fillStyle = g3d('#9ef01a', '#38b000', '#007200');
      ctx.beginPath();
      ctx.arc(-11, -18, 6, 0, Math.PI * 2);
      ctx.arc(11, -18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      roundRectPath(ctx, -16, -16, 32, 36, 14);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 4 ---
    case 'flytrap':
      ctx.fillStyle = g3d('#b7e4c7', '#38b000', '#1b4332');
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'spore_bug':
      ctx.fillStyle = g3d('#d8f3dc', '#80ed99', '#2d6a4f');
      ctx.beginPath();
      ctx.ellipse(-18, -4, 12, 7, -0.4, 0, Math.PI * 2);
      ctx.ellipse(18, -4, 12, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#95d5b2', '#007f5f', '#081c15');
      ctx.beginPath();
      ctx.ellipse(0, 2, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'space_snail':
      // Космо-Улитка со спиральным панцирем
      ctx.fillStyle = g3d('#d8f3dc', '#74c69d', '#1b4332');
      roundRectPath(ctx, -20, 4, 40, 14, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = g3d('#fff3b0', '#ffb703', '#ca6702');
      ctx.beginPath();
      ctx.arc(2, -4, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 5 ---
    case 'snow_golem':
      ctx.fillStyle = g3d('#ffffff', '#caf0f8', '#48cae4');
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
      ctx.moveTo(0, -11); ctx.lineTo(10, -9); ctx.lineTo(0, -7);
      ctx.closePath();
      ctx.fill();
      break;

    case 'icicle':
      ctx.fillStyle = g3d('#ffffff', '#90e0ef', '#0077b6');
      ctx.beginPath();
      ctx.moveTo(-16, -20); ctx.lineTo(16, -20); ctx.lineTo(0, 26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'crystal_spider':
      // Кристальный Паук с 6 лапками
      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 3.5;
      [-10, 0, 10].forEach(oy => {
        ctx.beginPath();
        ctx.moveTo(-24, oy - 4); ctx.lineTo(24, oy + 4);
        ctx.stroke();
      });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.fillStyle = g3d('#caf0f8', '#00b4d8', '#03045e');
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 6 ---
    case 'lava_elem':
      ctx.fillStyle = g3d('#ffccd5', '#e63946', '#590d22');
      roundRectPath(ctx, -22, -20, 44, 40, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffba08';
      ctx.beginPath();
      ctx.moveTo(-14, -20); ctx.lineTo(-8, -30); ctx.lineTo(-2, -20);
      ctx.moveTo(2, -20); ctx.lineTo(8, -30); ctx.lineTo(14, -20);
      ctx.fill();
      ctx.stroke();
      break;

    case 'fire_scorp':
      ctx.fillStyle = g3d('#ffd166', '#f77f00', '#9b2226');
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

    case 'magma_bomb':
      // Раскалённая Магма-Бомба с фитилём
      ctx.fillStyle = g3d('#ff9f1c', '#370617', '#03071e');
      ctx.beginPath();
      ctx.arc(0, 2, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -17); ctx.lineTo(8, -26);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      break;

    // --- СЕКТОР 7 ---
    case 'neon_cube':
      ctx.fillStyle = g3d('#7209b7', '#3a0ca3', '#10002b');
      ctx.strokeStyle = '#00f5d4';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.strokeStyle = '#f15bb5';
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.strokeStyle = INK;
      break;

    case 'cyber_turret':
      ctx.fillStyle = g3d('#ffc2d1', '#f15bb5', '#560bad');
      ctx.beginPath();
      ctx.moveTo(0, 24); ctx.lineTo(-24, -14); ctx.lineTo(0, -6); ctx.lineTo(24, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'holo_drone':
      // Голо-Дрон с боковыми турбинами
      ctx.fillStyle = g3d('#caf0f8', '#00f5d4', '#0077b6');
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f15bb5';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 8 ---
    case 'mummy_bot':
      ctx.fillStyle = g3d('#fff3b0', '#f4e285', '#bc6c25');
      roundRectPath(ctx, -19, -22, 38, 44, 15);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, -8); ctx.lineTo(18, -4);
      ctx.moveTo(-18, 6);  ctx.lineTo(18, 10);
      ctx.stroke();
      break;

    case 'sand_drone':
      ctx.fillStyle = g3d('#ffd166', '#e09f3e', '#7f4f24');
      ctx.beginPath();
      ctx.moveTo(0, -22); ctx.lineTo(25, 16); ctx.lineTo(-25, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'scarab_bot':
      // Золотой Скарабей с крыльями
      ctx.fillStyle = g3d('#fff3b0', '#ffbe0b', '#9c6644');
      ctx.beginPath();
      ctx.ellipse(0, 2, 19, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -19); ctx.lineTo(0, 23);
      ctx.stroke();
      break;

    // --- СЕКТОР 9 ---
    case 'ghost_orb':
      ctx.fillStyle = g3d('#ffffff', '#bdb2ff', '#5a189a');
      ctx.beginPath();
      ctx.arc(0, -4, 20, Math.PI, 0);
      ctx.lineTo(20, 18); ctx.lineTo(10, 10); ctx.lineTo(0, 18);
      ctx.lineTo(-10, 10); ctx.lineTo(-20, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'skull_bot':
      ctx.fillStyle = g3d('#ffffff', '#e2ece9', '#6c757d');
      ctx.beginPath();
      ctx.arc(0, -4, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      roundRectPath(ctx, -11, 8, 22, 12, 4);
      ctx.fill();
      ctx.stroke();
      break;

    case 'ghost_lantern':
      // Призрачный Фонарь с эфирным пламенем
      ctx.fillStyle = g3d('#e0aaff', '#7209b7', '#240046');
      roundRectPath(ctx, -15, -18, 30, 36, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#72efdd';
      roundRectPath(ctx, -9, -10, 18, 20, 4);
      ctx.fill();
      break;

    // --- СЕКТОР 10 ---
    case 'dreadnought':
      ctx.fillStyle = g3d('#ff758f', '#800f2f', '#2b0510');
      roundRectPath(ctx, -26, -20, 52, 40, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(-20, 14, 10, 10);
      ctx.fillRect(10, 14, 10, 10);
      break;

    case 'star_mine':
      // Звёздная Шипастая Мина Цитадели
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = g3d('#ffbe0b', '#ff006e', '#370617');
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * i) / 6;
        const rad = i % 2 === 0 ? 25 : 13;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.rotate(-(e.rot || 0));
      break;

    case 'royal_guard':
    default:
      ctx.fillStyle = g3d('#ffccd5', '#d90429', '#590d22');
      ctx.beginPath();
      ctx.moveTo(0, 24); ctx.lineTo(-24, -16); ctx.lineTo(0, -24); ctx.lineTo(24, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }

  // Выпуклые 3D-глаза
  if (e.kind !== 'flytrap') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -2, 4.6, 0, Math.PI * 2);
    ctx.arc(7, -2, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(-7, -1, 2.1, 0, Math.PI * 2);
    ctx.arc(7, -1, 2.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-8, -2.5, 1, 0, Math.PI * 2);
    ctx.arc(6, -2.5, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Глянцевый 3D-блик сверху слева
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-8, -11, 6, 3, -0.4, 0, Math.PI * 2);
  ctx.fill();

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
// 4. 10 УНИКАЛЬНЫХ БОССОВ В ОБЪЁМНОМ 3D-СТИЛЕ
// =========================================================================
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
        ctx.moveTo(0, 0);
        ctx.lineTo(0, H);
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

  ctx.fillStyle = 'rgba(8, 5, 22, 0.42)';
  ctx.beginPath();
  ctx.ellipse(10, 56, 58, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  const flash = b.hitFlash > 0;
  const gBoss = (l, m, d) => (flash ? '#ffffff' : make3DGrad(ctx, 0, 0, 62, l, m, d));
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  if (lvl.id === 2) {
    ctx.fillStyle = gBoss('#ffe5ec', '#ff70a6', '#a4133c');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    [
      { x: -36, y: 12, r: 26 }, { x: 36, y: 12, r: 26 },
      { x: -22, y: -16, r: 28 }, { x: 22, y: -16, r: 28 },
      { x: 0, y: 8, r: 38 }
    ].forEach(pf => {
      ctx.beginPath();
      ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -38); ctx.lineTo(-12, -62); ctx.lineTo(0, -45); ctx.lineTo(12, -62); ctx.lineTo(22, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 3) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = gBoss('#ffd6a5', '#f4a261', '#9c6644');
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
    ctx.fillStyle = gBoss('#ffe169', '#f77f00', '#9b2226');
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
    ctx.fillStyle = gBoss('#b7e4c7', '#38b000', '#1b4332');
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 5) {
    ctx.fillStyle = gBoss('#ffffff', '#48cae4', '#023e8a');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -64); ctx.lineTo(58, -10); ctx.lineTo(38, 44); ctx.lineTo(-38, 44); ctx.lineTo(-58, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 6) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const clawWave = Math.sin(b.time * 4) * 6;
    [-64, 64].forEach((cx, idx) => {
      ctx.fillStyle = gBoss('#fff3b0', '#ffba08', '#ca6702');
      ctx.beginPath();
      ctx.arc(cx, 18 + (idx === 0 ? clawWave : -clawWave), 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = gBoss('#ffccd5', '#e63946', '#590d22');
    roundRectPath(ctx, -56, -34, 112, 66, 26);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 7) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = gBoss('#caf0f8', '#00f5d4', '#0077b6');
    ctx.beginPath();
    ctx.moveTo(-72, -16); ctx.lineTo(72, -16); ctx.lineTo(48, 18); ctx.lineTo(-48, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = gBoss('#ffc2d1', '#f15bb5', '#560bad');
    ctx.beginPath();
    ctx.moveTo(0, -56); ctx.lineTo(46, 36); ctx.lineTo(-46, 36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 8) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = gBoss('#fff3b0', '#ff9f1c', '#bc6c25');
    ctx.beginPath();
    ctx.arc(0, -46, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = gBoss('#ffe169', '#e09f3e', '#7f4f24');
    ctx.beginPath();
    ctx.ellipse(0, 4, 56, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 9) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = gBoss('#e0aaff', '#7209b7', '#240046');
    ctx.beginPath();
    ctx.arc(0, 0, 48, Math.PI, 0);
    ctx.lineTo(48, 38); ctx.lineTo(24, 24); ctx.lineTo(0, 40); ctx.lineTo(-24, 24); ctx.lineTo(-48, 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.moveTo(-58, -24); ctx.quadraticCurveTo(0, -64, 58, -24); ctx.quadraticCurveTo(0, -14, -58, -24);
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
    ctx.fillStyle = lvl.id === 10
      ? gBoss('#ff758f', '#d90429', '#370617')
      : gBoss('#e0aaff', '#9b5de5', '#3c096c');
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
    ctx.moveTo(-22, -48); ctx.lineTo(-12, -74); ctx.lineTo(0, -54); ctx.lineTo(12, -74); ctx.lineTo(22, -48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.beginPath();
  ctx.ellipse(-22, -26, 14, 6, -0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
