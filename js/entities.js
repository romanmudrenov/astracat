'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'Звёздная Бухта',
    story: 'Редж выходит на орбиту Котовии-17! Корабли пришельцев, метеоры и космические рыбки перекрыли путь к первым запасам.',
    enemiesDesc: 'Тарелки Пришельцев, Метеоры и Космические Рыбки',
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

// =========================================================================
// БЫСТРЫЕ ТЕКСТУРНЫЕ ХЕЛПЕРЫ (МОЗОЛИ/БОРОДАВКИ, ЗАКЛЁПКИ, ПРИСОСКИ)
// =========================================================================
function drawWarts(ctx, spots, baseCol, hiCol) {
  spots.forEach(([x, y, r]) => {
    ctx.fillStyle = baseCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

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
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
}

// =========================================================================
// 1. БОНУСЫ ИЗ КОСМИЧЕСКОЙ ЕДЫ
// =========================================================================
function drawFoodBonus(ctx, bn) {
  ctx.save();
  ctx.translate(bn.x, bn.y);
  const pulse = 1 + Math.sin(bn.phase) * 0.08;
  ctx.scale(pulse, pulse);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const auraColors = {
    pizza:  'rgba(255, 183, 3, 0.32)',
    sushi:  'rgba(6, 214, 160, 0.32)',
    donut:  'rgba(255, 112, 166, 0.34)',
    burger: 'rgba(247, 127, 0, 0.32)',
    milk:   'rgba(72, 219, 251, 0.34)'
  };

  ctx.fillStyle = auraColors[bn.type] || 'rgba(255,255,255,0.28)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, bn.r + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (bn.type === 'pizza') {
    ctx.fillStyle = '#ffd166';
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
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, -1, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = '#edf2f4';
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
// 2. СНАРЯДЫ ИГРОКА
// =========================================================================
function drawPlayerBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (b.kind === 'pizza_slice') {
    ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
    ctx.fillStyle = '#ffd166';
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
    ctx.fillStyle = '#ff70a6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    roundRectPath(ctx, -4, -18, 8, 36, 4);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = b.color;
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
// 3. ДЕТАЛИЗИРОВАННЫЕ 30 ВРАГОВ С МОЗОЛЯМИ, БОРОДАВКАМИ, ЗАКЛЁПКАМИ И ЩУПАЛЬЦАМИ
// =========================================================================
function drawUniqueEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const flash = e.hitFlash > 0;
  const col = (c) => (flash ? '#ffffff' : c);

  // Быстрая 3D-тень без создания градиента
  ctx.fillStyle = 'rgba(8, 5, 22, 0.34)';
  ctx.beginPath();
  ctx.ellipse(4, e.r + 6, e.r * 0.75, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;

  switch (e.kind) {
    // --- СЕКТОР 1: Корабль пришельцев с люками/заклёпками, Метеор, Рыбка с чешуёй ---
    case 'ufo':
      // Нижняя броня тарелки
      ctx.fillStyle = col('#52b788');
      ctx.beginPath();
      ctx.ellipse(0, 7, 25, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Верхняя палуба и заклёпки
      ctx.fillStyle = col('#8ac926');
      ctx.beginPath();
      ctx.ellipse(0, 3, 24, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Посадочные опоры / люки и огни иллюминаторов
      ctx.fillStyle = '#ffbe0b';
      [-14, 0, 14].forEach(lx => {
        ctx.beginPath();
        ctx.arc(lx, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      drawRivets(ctx, [[-19, 2], [-8, 1], [8, 1], [19, 2]]);

      // Прозрачный купол с пришельцем-мозгом в мозолях
      ctx.fillStyle = col('rgba(189, 224, 254, 0.75)');
      ctx.beginPath();
      ctx.arc(0, 0, 13, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      drawWarts(ctx, [[-5, -6, 2.2], [5, -6, 2.2]], '#9b5de5', '#e0aaff');
      break;

    case 'meteor':
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = col('#bc6c25');
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
      // Объёмные кратеры и наросты на метеорите
      drawWarts(ctx, [[-9, -8, 4.2], [10, 6, 3.6], [-4, 11, 3.2], [8, -10, 2.8]], '#7f4f24', '#dda15e');
      ctx.rotate(-(e.rot || 0));
      break;

    case 'space_fish':
      ctx.fillStyle = col('#fb5607');
      ctx.beginPath();
      ctx.moveTo(0, -24); ctx.lineTo(-12, -34); ctx.lineTo(12, -34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = col('#0096c7');
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Чешуйки и шипы на спине
      drawWarts(ctx, [[-7, 8, 3], [7, 8, 3], [0, 14, 3.2]], '#023e8a', '#90e0ef');
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.moveTo(-15, 0); ctx.lineTo(-25, -8); ctx.lineTo(-16, 10);
      ctx.moveTo(15, 0); ctx.lineTo(25, -8); ctx.lineTo(16, 10);
      ctx.fill();
      ctx.stroke();
      break;

    // --- СЕКТОР 2: Зефир с подпалинами, Леденец, Имбирный пряник ---
    case 'marshmallow':
      ctx.fillStyle = col('#ffccd5');
      roundRectPath(ctx, -20, -22, 40, 44, 15);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = col('#ff70a6');
      ctx.fillRect(-18, -4, 36, 8);
      drawWarts(ctx, [[-11, -13, 3], [11, 12, 3.4]], '#ff8fab', '#ffffff');
      break;

    case 'lollipop':
      ctx.fillStyle = '#fff8eb';
      ctx.fillRect(-3, 8, 6, 18);
      ctx.strokeRect(-3, 8, 6, 18);
      ctx.fillStyle = col('#ff4d6d');
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
      ctx.fillStyle = col('#b08968');
      roundRectPath(ctx, -24, -4, 48, 10, 5);
      ctx.fill(); ctx.stroke();
      roundRectPath(ctx, -13, 6, 10, 18, 5);
      ctx.fill(); ctx.stroke();
      roundRectPath(ctx, 3, 6, 10, 18, 5);
      ctx.fill(); ctx.stroke();
      roundRectPath(ctx, -12, -6, 24, 20, 8);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -11, 13, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff5964';
      ctx.beginPath();
      ctx.arc(0, 5, 2.6, 0, Math.PI * 2);
      ctx.arc(0, 11, 2.6, 0, Math.PI * 2);
      ctx.fill();
      break;

    // --- СЕКТОР 3: Пончик с присыпкой, Кекс, Мармеладный мишка ---
    case 'angry_donut':
      ctx.fillStyle = col('#f4a261');
      ctx.beginPath();
      ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#ff70a6');
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();
      // Объёмные драже-мозоли на глазури
      drawWarts(ctx, [[-12, -9, 2.5], [12, -9, 2.5], [-11, 11, 2.5], [11, 11, 2.5]], '#ffd166', '#ffffff');
      ctx.fillStyle = '#2b193d';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;

    case 'cupcake':
      ctx.fillStyle = col('#48dbfb');
      ctx.beginPath();
      ctx.moveTo(-16, 4); ctx.lineTo(16, 4); ctx.lineTo(12, 22); ctx.lineTo(-12, 22);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#ffbe0b');
      ctx.beginPath();
      ctx.arc(0, 2, 18, Math.PI, 0);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#ff006e');
      ctx.beginPath();
      ctx.arc(0, -18, 5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;

    case 'gummy_bear':
      ctx.fillStyle = col('#38b000');
      ctx.beginPath();
      ctx.arc(-11, -18, 6, 0, Math.PI * 2);
      ctx.arc(11, -18, 6, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      roundRectPath(ctx, -16, -16, 32, 36, 14);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[0, 10, 4.5]], '#70e000', '#ccff33');
      break;

    // --- СЕКТОР 4: Мухоловка в пятнах, Споровый жук с наростами, Улитка ---
    case 'flytrap':
      ctx.fillStyle = col('#38b000');
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-9, -10, 3.2], [-12, 4, 2.8], [4, -14, 2.8]], '#ff5964', '#ffccd5');
      break;

    case 'spore_bug':
      ctx.fillStyle = col('#80ed99');
      ctx.beginPath();
      ctx.ellipse(-18, -4, 12, 7, -0.4, 0, Math.PI * 2);
      ctx.ellipse(18, -4, 12, 7, 0.4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#007f5f');
      ctx.beginPath();
      ctx.ellipse(0, 2, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-6, 9, 2.8], [6, 9, 2.8], [0, 15, 3]], '#52b788', '#d8f3dc');
      break;

    case 'space_snail':
      ctx.fillStyle = col('#74c69d');
      roundRectPath(ctx, -20, 4, 40, 14, 7);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col('#ffb703');
      ctx.beginPath();
      ctx.arc(2, -4, 16, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-4, -8, 3], [8, -2, 3]], '#e07a5f', '#fff3b0');
      break;

    // --- СЕКТОР 5: Снеговик, Сосулька, Кристальный паук ---
    case 'snow_golem':
      ctx.fillStyle = col('#caf0f8');
      ctx.beginPath();
      ctx.arc(0, 8, 18, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -12, 13, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath();
      ctx.moveTo(0, -11); ctx.lineTo(10, -9); ctx.lineTo(0, -7);
      ctx.closePath();
      ctx.fill();
      break;

    case 'icicle':
      ctx.fillStyle = col('#90e0ef');
      ctx.beginPath();
      ctx.moveTo(-16, -20); ctx.lineTo(16, -20); ctx.lineTo(0, 26);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      break;

    case 'crystal_spider':
      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 3.5;
      [-10, 0, 10].forEach(oy => {
        ctx.beginPath();
        ctx.moveTo(-24, oy - 4); ctx.lineTo(24, oy + 4);
        ctx.stroke();
      });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.fillStyle = col('#00b4d8');
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-7, 7, 2.6], [7, 7, 2.6]], '#03045e', '#caf0f8');
      break;

    // --- СЕКТОР 6: Лавовый элементаль в наростах, Скорпион, Магма-бомба ---
    case 'lava_elem':
      ctx.fillStyle = col('#e63946');
      roundRectPath(ctx, -22, -20, 44, 40, 12);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-12, 10, 3.5], [12, 10, 3.5], [0, 13, 3]], '#590d22', '#ffba08');
      ctx.fillStyle = '#ffba08';
      ctx.beginPath();
      ctx.moveTo(-14, -20); ctx.lineTo(-8, -30); ctx.lineTo(-2, -20);
      ctx.moveTo(2, -20); ctx.lineTo(8, -30); ctx.lineTo(14, -20);
      ctx.fill(); ctx.stroke();
      break;

    case 'fire_scorp':
      ctx.fillStyle = col('#f77f00');
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-8, 10, 2.8], [8, 10, 2.8]], '#9b2226', '#ffd166');
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.arc(-20, 14, 7, 0, Math.PI * 2);
      ctx.arc(20, 14, 7, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;

    case 'magma_bomb':
      ctx.fillStyle = col('#370617');
      ctx.beginPath();
      ctx.arc(0, 2, 19, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-11, -6], [11, -6], [-11, 10], [11, 10]]);
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -17); ctx.lineTo(8, -26);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      break;

    // --- СЕКТОР 7: Корабли и турели Кибер-Сити с пластинами и заклёпками ---
    case 'neon_cube':
      ctx.fillStyle = col('#3a0ca3');
      ctx.strokeStyle = '#00f5d4';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.strokeStyle = '#f15bb5';
      ctx.strokeRect(-11, -11, 22, 22);
      drawRivets(ctx, [[-16, -16], [16, -16], [-16, 16], [16, 16]]);
      ctx.strokeStyle = INK;
      break;

    case 'cyber_turret':
      ctx.fillStyle = col('#f15bb5');
      ctx.beginPath();
      ctx.moveTo(0, 24); ctx.lineTo(-24, -14); ctx.lineTo(0, -6); ctx.lineTo(24, -14);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-14, -9], [14, -9], [0, 12]]);
      break;

    case 'holo_drone':
      ctx.fillStyle = col('#00b4d8');
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-18, 0], [18, 0]]);
      ctx.fillStyle = '#f15bb5';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;

    // --- СЕКТОР 8 ---
    case 'mummy_bot':
      ctx.fillStyle = col('#f4e285');
      roundRectPath(ctx, -19, -22, 38, 44, 15);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, -8); ctx.lineTo(18, -4);
      ctx.moveTo(-18, 6);  ctx.lineTo(18, 10);
      ctx.stroke();
      break;

    case 'sand_drone':
      ctx.fillStyle = col('#e09f3e');
      ctx.beginPath();
      ctx.moveTo(0, -22); ctx.lineTo(25, 16); ctx.lineTo(-25, 16);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-14, 11], [0, 11], [14, 11]]);
      break;

    case 'scarab_bot':
      ctx.fillStyle = col('#ffbe0b');
      ctx.beginPath();
      ctx.ellipse(0, 2, 19, 21, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -19); ctx.lineTo(0, 23);
      ctx.stroke();
      drawWarts(ctx, [[-9, 9, 2.8], [9, 9, 2.8]], '#bc6c25', '#fff3b0');
      break;

    // --- СЕКТОР 9 ---
    case 'ghost_orb':
      ctx.fillStyle = col('#bdb2ff');
      ctx.beginPath();
      ctx.arc(0, -4, 20, Math.PI, 0);
      ctx.lineTo(20, 18); ctx.lineTo(10, 10); ctx.lineTo(0, 18);
      ctx.lineTo(-10, 10); ctx.lineTo(-20, 18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawWarts(ctx, [[-11, -11, 2.8], [11, -9, 2.5]], '#7209b7', '#ffffff');
      break;

    case 'skull_bot':
      ctx.fillStyle = col('#e2ece9');
      ctx.beginPath();
      ctx.arc(0, -4, 19, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      roundRectPath(ctx, -11, 8, 22, 12, 4);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-13, -10], [13, -10]]);
      break;

    case 'ghost_lantern':
      ctx.fillStyle = col('#7209b7');
      roundRectPath(ctx, -15, -18, 30, 36, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#72efdd';
      roundRectPath(ctx, -9, -10, 18, 20, 4);
      ctx.fill();
      break;

    // --- СЕКТОР 10: Тяжёлый броненосец с заклёпками, мина, имперский крейсер ---
    case 'dreadnought':
      ctx.fillStyle = col('#800f2f');
      roundRectPath(ctx, -26, -20, 52, 40, 10);
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-20, -14], [0, -14], [20, -14], [-20, 10], [20, 10]]);
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(-20, 14, 10, 10);
      ctx.fillRect(10, 14, 10, 10);
      break;

    case 'star_mine':
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = col('#ff006e');
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * i) / 6;
        const rad = i % 2 === 0 ? 25 : 13;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.rotate(-(e.rot || 0));
      break;

    case 'royal_guard':
    default:
      ctx.fillStyle = col('#d90429');
      ctx.beginPath();
      ctx.moveTo(0, 24); ctx.lineTo(-24, -16); ctx.lineTo(0, -24); ctx.lineTo(24, -16);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      drawRivets(ctx, [[-14, -13], [14, -13], [0, 12]]);
      break;
  }

  // Объёмные глаза с бликами
  if (e.kind !== 'flytrap') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -2, 4.6, 0, Math.PI * 2);
    ctx.arc(7, -2, 4.6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

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

  // Глянцевый блик
  ctx.fillStyle = 'rgba(255, 255, 255, 0.30)';
  ctx.beginPath();
  ctx.ellipse(-8, -11, 5.5, 2.6, -0.4, 0, Math.PI * 2);
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
// 4. ДЕТАЛИЗИРОВАННЫЕ 10 БОССОВ (МОЗОЛИ/БОРОДАВКИ, ПРИСОСКИ НА ЩУПАЛЬЦАХ, ЗАКЛЁПКИ)
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
        ctx.moveTo(0, 0); ctx.lineTo(0, H);
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
    ctx.moveTo(b.laserX, b.y + 40); ctx.lineTo(b.laserX, H);
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
  ctx.ellipse(8, 54, 56, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  const flash = b.hitFlash > 0;
  const col = (c) => (flash ? '#ffffff' : c);
  const lookX = player ? Math.max(-4, Math.min(4, (player.x - b.x) * 0.02)) : 0;

  if (lvl.id === 2) {
    ctx.fillStyle = col('#ff70a6');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    [
      { x: -36, y: 12, r: 26 }, { x: 36, y: 12, r: 26 },
      { x: -22, y: -16, r: 28 }, { x: 22, y: -16, r: 28 },
      { x: 0, y: 8, r: 38 }
    ].forEach(pf => {
      ctx.beginPath();
      ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });
    // Сахарные наросты на Королеве Зефира
    drawWarts(ctx, [[-42, 4, 5], [42, 4, 5], [-30, -24, 4.5], [30, -24, 4.5]], '#ff4d6d', '#ffe5ec');
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -38); ctx.lineTo(-12, -62); ctx.lineTo(0, -45); ctx.lineTo(12, -62); ctx.lineTo(22, -38);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

  } else if (lvl.id === 3) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = col('#f4a261');
    roundRectPath(ctx, -54, 16, 108, 22, 11);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -58, 2, 116, 16, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8ac926';
    roundRectPath(ctx, -60, -6, 120, 10, 5);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = col('#f77f00');
    ctx.beginPath();
    ctx.arc(0, -4, 54, Math.PI, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Кунжутные зёрна-наросты на булке
    drawWarts(ctx, [[-32, -26, 3.5], [0, -38, 3.8], [32, -26, 3.5], [-16, -34, 3]], '#fff3b0', '#ffffff');

  } else if (lvl.id === 4) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const a = b.time * 0.7 + (Math.PI * 2 * i) / 6;
      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#80ed99';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 44, Math.sin(a) * 34, 22, 14, a, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = col('#38b000');
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-28, -20, 5], [28, -20, 5], [-32, 14, 4.5], [32, 14, 4.5]], '#007f5f', '#b7e4c7');

  } else if (lvl.id === 5) {
    ctx.fillStyle = col('#48cae4');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -64); ctx.lineTo(58, -10); ctx.lineTo(38, 44); ctx.lineTo(-38, 44); ctx.lineTo(-58, -10);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-34, -6, 5], [34, -6, 5], [0, -38, 5.5]], '#0077b6', '#caf0f8');

  } else if (lvl.id === 6) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const clawWave = Math.sin(b.time * 4) * 6;
    [-64, 64].forEach((cx, idx) => {
      ctx.fillStyle = col('#ffba08');
      ctx.beginPath();
      ctx.arc(cx, 18 + (idx === 0 ? clawWave : -clawWave), 20, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = col('#e63946');
    roundRectPath(ctx, -56, -34, 112, 66, 26);
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-40, -18, 5], [40, -18, 5], [-42, 14, 4.5], [42, 14, 4.5]], '#800f2f', '#ffccd5');

  } else if (lvl.id === 7) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = col('#00f5d4');
    ctx.beginPath();
    ctx.moveTo(-72, -16); ctx.lineTo(72, -16); ctx.lineTo(48, 18); ctx.lineTo(-48, 18);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = col('#f15bb5');
    ctx.beginPath();
    ctx.moveTo(0, -56); ctx.lineTo(46, 36); ctx.lineTo(-46, 36);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-56, -8], [56, -8], [-28, 26], [28, 26], [0, -38]]);

  } else if (lvl.id === 8) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = col('#ff9f1c');
    ctx.beginPath();
    ctx.arc(0, -46, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = col('#e09f3e');
    ctx.beginPath();
    ctx.ellipse(0, 4, 56, 42, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    drawRivets(ctx, [[-42, -8], [42, -8], [-38, 18], [38, 18]]);

  } else if (lvl.id === 9) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.fillStyle = col('#7209b7');
    ctx.beginPath();
    ctx.arc(0, 0, 48, Math.PI, 0);
    ctx.lineTo(48, 38); ctx.lineTo(24, 24); ctx.lineTo(0, 40); ctx.lineTo(-24, 24); ctx.lineTo(-48, 38);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawWarts(ctx, [[-34, -14, 5], [34, -14, 5], [0, -34, 4.5]], '#3c096c', '#e0aaff');
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.moveTo(-58, -24); ctx.quadraticCurveTo(0, -64, 58, -24); ctx.quadraticCurveTo(0, -14, -58, -24);
    ctx.fill(); ctx.stroke();

  } else {
    // Осьминоги-Пожиратели (Сектор 1 Кракен-Бот и Сектор 10 Император Омега-Кракен) с мозолями и присосками!
    const tentacleCount = lvl.id === 10 ? 6 : 4;
    for (let i = 0; i < tentacleCount; i++) {
      const t = i - (tentacleCount - 1) / 2;
      const waveX = Math.sin(b.time * 5 + t * 1.4) * 14;
      const baseX = t * (lvl.id === 10 ? 20 : 28);
      const midX = baseX + waveX * 0.5;
      const tipX = baseX * 1.2 - waveX * 0.6;

      ctx.strokeStyle = INK;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(baseX, 24);
      ctx.quadraticCurveTo(baseX + waveX, 52, tipX, 74);
      ctx.stroke();

      ctx.strokeStyle = lvl.accent;
      ctx.lineWidth = 8;
      ctx.stroke();

      // Объёмные присоски / мозоли вдоль щупалец осьминога
      ctx.fillStyle = '#ffd166';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      [
        [baseX + waveX * 0.25, 38, 3.2],
        [midX + waveX * 0.35, 54, 2.8],
        [tipX, 68, 2.4]
      ].forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Купол осьминога
    ctx.fillStyle = col(lvl.id === 10 ? '#d90429' : '#9b5de5');
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, Math.PI, 0);
    ctx.quadraticCurveTo(60, 34, 0, 36);
    ctx.quadraticCurveTo(-60, 34, -56, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Мозоли / бородавки на голове осьминога
    drawWarts(
      ctx,
      [[-38, -18, 5.5], [38, -18, 5.5], [-42, 6, 4.8], [42, 6, 4.8], [-18, -38, 4.5], [18, -38, 4.5]],
      lvl.id === 10 ? '#800f2f' : '#5a189a',
      lvl.id === 10 ? '#ff758f' : '#e0aaff'
    );

    // Корона
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(-22, -48); ctx.lineTo(-12, -74); ctx.lineTo(0, -54); ctx.lineTo(12, -74); ctx.lineTo(22, -48);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // Глаза босса
  [-20, 20].forEach(ex => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ex, -4, 14, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.beginPath();
  ctx.ellipse(-22, -26, 13, 5.5, -0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
