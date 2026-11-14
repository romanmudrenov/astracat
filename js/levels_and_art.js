'use strict';

const INK = '#1e1633';

const LEVELS = [
  {
    id: 1,
    name: 'Звёздная Бухта',
    bossName: 'Доктор Кракен-Бот',
    theme: 'space',
    skyTop: '#171136', skyMid: '#241954', skyBot: '#311f6b',
    nebula1: 'rgba(255, 107, 157, 0.12)', nebula2: 'rgba(72, 219, 251, 0.11)',
    accent: '#48dbfb', bossColor: '#9b5de5', enemyTint: '#8ac926',
    songStyle: 0, bpm: 126, rootOffset: 0, hpMult: 1.0
  },
  {
    id: 2,
    name: 'Туманность Сахарной Ваты',
    bossName: 'Королева Зефира',
    theme: 'candy',
    skyTop: '#4a1942', skyMid: '#893168', skyBot: '#c8558c',
    nebula1: 'rgba(255, 214, 232, 0.22)', nebula2: 'rgba(255, 230, 109, 0.15)',
    accent: '#ffafcc', bossColor: '#ff70a6', enemyTint: '#ff9ebb',
    songStyle: 1, bpm: 130, rootOffset: 2, hpMult: 1.12
  },
  {
    id: 3,
    name: 'Пояс Пончиковых Астероидов',
    bossName: 'Мега-Бургер Дредноут',
    theme: 'donuts',
    skyTop: '#2b193d', skyMid: '#48284a', skyBot: '#7a3b69',
    nebula1: 'rgba(255, 183, 3, 0.15)', nebula2: 'rgba(251, 86, 7, 0.13)',
    accent: '#ffb703', bossColor: '#f77f00', enemyTint: '#fcbf49',
    songStyle: 1, bpm: 132, rootOffset: 4, hpMult: 1.24
  },
  {
    id: 4,
    name: 'Изумрудные Джунгли Орбиты',
    bossName: 'Споровый Левиафан',
    theme: 'jungle',
    skyTop: '#0b2e26', skyMid: '#134e3f', skyBot: '#1f7a5c',
    nebula1: 'rgba(128, 237, 153, 0.18)', nebula2: 'rgba(255, 209, 102, 0.12)',
    accent: '#06d6a0', bossColor: '#38b000', enemyTint: '#70e000',
    songStyle: 0, bpm: 128, rootOffset: 5, hpMult: 1.36
  },
  {
    id: 5,
    name: 'Ледяная Комета Криона',
    bossName: 'Ледяной Титан Фрост-9',
    theme: 'ice',
    skyTop: '#0d253f', skyMid: '#184e77', skyBot: '#1e6091',
    nebula1: 'rgba(144, 224, 239, 0.22)', nebula2: 'rgba(202, 240, 248, 0.18)',
    accent: '#90e0ef', bossColor: '#48cae4', enemyTint: '#ade8f4',
    songStyle: 2, bpm: 134, rootOffset: -2, hpMult: 1.48
  },
  {
    id: 6,
    name: 'Вулканическая Кузница Магмы',
    bossName: 'Инферно-Краб Вулкан',
    theme: 'lava',
    skyTop: '#2b0909', skyMid: '#591414', skyBot: '#942911',
    nebula1: 'rgba(255, 107, 53, 0.22)', nebula2: 'rgba(255, 190, 11, 0.16)',
    accent: '#ff6b35', bossColor: '#e63946', enemyTint: '#f77f00',
    songStyle: 3, bpm: 138, rootOffset: -5, hpMult: 1.60
  },
  {
    id: 7,
    name: 'Кибер-Сити Неонополис',
    bossName: 'Кибер-Сфинкс MK-IV',
    theme: 'cyber',
    skyTop: '#0f0726', skyMid: '#1d1147', skyBot: '#361973',
    nebula1: 'rgba(0, 245, 212, 0.18)', nebula2: 'rgba(241, 91, 181, 0.18)',
    accent: '#00f5d4', bossColor: '#f15bb5', enemyTint: '#00bbf9',
    songStyle: 3, bpm: 140, rootOffset: 1, hpMult: 1.72
  },
  {
    id: 8,
    name: 'Золотая Пустыня Дюн',
    bossName: 'Фараон-Скарабей',
    theme: 'desert',
    skyTop: '#3d2516', skyMid: '#774926', skyBot: '#b57436',
    nebula1: 'rgba(255, 209, 102, 0.22)', nebula2: 'rgba(255, 159, 28, 0.15)',
    accent: '#ffd166', bossColor: '#e09f3e', enemyTint: '#f4a261',
    songStyle: 2, bpm: 132, rootOffset: 3, hpMult: 1.85
  },
  {
    id: 9,
    name: 'Призрачный Сектор Эфира',
    bossName: 'Призрачный Адмирал',
    theme: 'ghost',
    skyTop: '#161329', skyMid: '#2a234d', skyBot: '#433878',
    nebula1: 'rgba(189, 178, 255, 0.20)', nebula2: 'rgba(114, 239, 221, 0.15)',
    accent: '#bdb2ff', bossColor: '#7209b7', enemyTint: '#a0c4ff',
    songStyle: 2, bpm: 136, rootOffset: -3, hpMult: 2.0
  },
  {
    id: 10,
    name: 'Цитадель Императора Кракена',
    bossName: 'Император Омега-Кракен',
    theme: 'citadel',
    skyTop: '#1b0718', skyMid: '#3d0c2e', skyBot: '#6e1447',
    nebula1: 'rgba(255, 0, 110, 0.22)', nebula2: 'rgba(255, 190, 11, 0.18)',
    accent: '#ff006e', bossColor: '#d90429', enemyTint: '#ff4d6d',
    songStyle: 3, bpm: 144, rootOffset: 0, hpMult: 2.25
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
// ДЕКОРАЦИИ И ФОНЫ ДЛЯ КАЖДОГО ИЗ 10 СЕКТОРОВ
// =========================================================================
function drawThemeProp(ctx, lvl, pr, W, globalTime) {
  const px = pr.xRatio * W;
  ctx.save();
  ctx.translate(px, pr.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (lvl.theme === 'candy') {
    // Полосатый леденец на палочке
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#fff8eb';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.fillRect(-3, pr.r * 0.6, 6, pr.r * 0.9);
    ctx.strokeRect(-3, pr.r * 0.6, 6, pr.r * 0.9);

    ctx.fillStyle = '#ffccd5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.62, 0, Math.PI * 1.35);
    ctx.stroke();

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.3, Math.PI, Math.PI * 2.3);
    ctx.stroke();

  } else if (lvl.theme === 'donuts') {
    // Космический пончик с розовой глазурью и цветной посыпкой
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#f4a261';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Посыпка
    const sprinkles = ['#ffd166', '#48dbfb', '#06d6a0', '#ffffff'];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      ctx.fillStyle = sprinkles[i % sprinkles.length];
      ctx.fillRect(Math.cos(a) * pr.r * 0.58 - 2, Math.sin(a) * pr.r * 0.58 - 2, 5, 3);
    }

    ctx.fillStyle = lvl.skyMid;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (lvl.theme === 'jungle') {
    // Биолюминесцентная космо-медуза
    const pulse = Math.sin(globalTime * 3.2 + pr.variant) * 3.5;
    ctx.strokeStyle = '#c7f9cc';
    ctx.lineWidth = 3;
    [-12, -4, 4, 12].forEach((ox, idx) => {
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.quadraticCurveTo(
        ox + Math.sin(globalTime * 4 + idx) * 6,
        pr.r * 0.55,
        ox - Math.sin(globalTime * 4 + idx) * 5,
        pr.r * 1.05
      );
      ctx.stroke();
    });

    ctx.fillStyle = '#80ed99';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r + pulse, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(-pr.r * 0.35, -pr.r * 0.42, pr.r * 0.22, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'ice') {
    // Граненый кристалл льда
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#caf0f8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r * 1.15);
    ctx.lineTo(pr.r * 0.72, -pr.r * 0.2);
    ctx.lineTo(pr.r * 0.55, pr.r * 0.9);
    ctx.lineTo(-pr.r * 0.55, pr.r * 0.9);
    ctx.lineTo(-pr.r * 0.72, -pr.r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r * 0.9);
    ctx.lineTo(0, pr.r * 0.7);
    ctx.stroke();

  } else if (lvl.theme === 'lava') {
    // Раскаленный магматический астероид
    ctx.rotate(pr.rot * 0.5);
    ctx.fillStyle = '#370617';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffba08';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-pr.r * 0.65, -5);
    ctx.lineTo(-5, 6);
    ctx.lineTo(10, -4);
    ctx.lineTo(pr.r * 0.68, 7);
    ctx.stroke();

  } else if (lvl.theme === 'cyber') {
    // Неоновый голографический маяк
    ctx.rotate(pr.rot);
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(-pr.r * 0.65, -pr.r * 0.65, pr.r * 1.3, pr.r * 1.3);

    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = '#f15bb5';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-pr.r * 0.52, -pr.r * 0.52, pr.r * 1.04, pr.r * 1.04);

  } else if (lvl.theme === 'desert') {
    // Золотая пирамида с глазом Гора
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -pr.r);
    ctx.lineTo(pr.r * 1.05, pr.r * 0.72);
    ctx.lineTo(-pr.r * 1.05, pr.r * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, pr.r * 0.12, pr.r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(0, pr.r * 0.12, pr.r * 0.11, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'ghost') {
    // Призрачный фонарь / рунический круг
    ctx.rotate(pr.rot);
    ctx.strokeStyle = '#bdb2ff';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(114, 239, 221, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.45, 0, Math.PI * 2);
    ctx.fill();

  } else if (lvl.theme === 'citadel') {
    // Боевая шестерня Цитадели
    ctx.rotate(pr.rot);
    ctx.fillStyle = '#590d22';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    const teeth = 8;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (Math.PI * i) / teeth;
      const rad = i % 2 === 0 ? pr.r * 1.05 : pr.r * 0.78;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(0, 0, pr.r * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else {
    // Сектор 1: Планета с кольцами и кратерами
    ctx.fillStyle = pr.variant % 2 === 0 ? '#ff8fab' : '#4cc9f0';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.arc(-pr.r * 0.3, -pr.r * 0.3, pr.r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    if (pr.variant % 2 === 0) {
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 2, pr.r * 1.62, pr.r * 0.36, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawLevelBackground(ctx, lvl, W, H, stars, props, globalTime) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, lvl.skyTop);
  grad.addColorStop(0.55, lvl.skyMid);
  grad.addColorStop(1, lvl.skyBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Тематические фоновые эффекты
  if (lvl.theme === 'cyber') {
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.13)';
    ctx.lineWidth = 1.5;
    const step = 46;
    const offset = (globalTime * 48) % step;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = offset; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  } else if (lvl.theme === 'ice') {
    // Северное сияние
    ctx.fillStyle = 'rgba(114, 239, 221, 0.09)';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.22 + Math.sin(globalTime * 1.5) * 18, W * 0.55, 65, -0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Туманности
  ctx.fillStyle = lvl.nebula1;
  ctx.beginPath();
  ctx.arc(W * 0.25, H * 0.28, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = lvl.nebula2;
  ctx.beginPath();
  ctx.arc(W * 0.78, H * 0.66, 205, 0, Math.PI * 2);
  ctx.fill();

  for (const pr of props) {
    drawThemeProp(ctx, lvl, pr, W, globalTime);
  }

  for (const s of stars) {
    const twinkle = 0.6 + 0.4 * Math.sin(globalTime * 4 + s.phase);
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = s.r > 2 ? lvl.accent : '#ffffff';
    ctx.beginPath();
    ctx.arc(s.x % W, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// =========================================================================
// УНИКАЛЬНАЯ ОТРИСОВКА КАЖДОГО ИЗ 10 БОССОВ
// =========================================================================
function drawUniqueBoss(ctx, b, lvl, player, H) {
  // 1. Луч мега-лазера (если активен)
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

  // Уникальные силуэты и детали по номеру уровня (1..10)
  if (lvl.id === 2) {
    // Королева Зефира: пышное зефирное облако + золотая тиара
    ctx.fillStyle = mainCol;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    const puffs = [
      { x: -36, y: 12, r: 26 },
      { x: 36,  y: 12, r: 26 },
      { x: -22, y: -16, r: 28 },
      { x: 22,  y: -16, r: 28 },
      { x: 0,   y: 8,  r: 38 }
    ];
    puffs.forEach(pf => {
      ctx.beginPath();
      ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Тиара-леденец
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
    // Мега-Бургер Дредноут: булки, котлета, сыр и пушки
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;

    // Нижняя булка
    ctx.fillStyle = flash ? '#ffffff' : '#f4a261';
    roundRectPath(ctx, -54, 16, 108, 22, 11);
    ctx.fill();
    ctx.stroke();

    // Котлета и лист салата
    ctx.fillStyle = '#6f1d1b';
    roundRectPath(ctx, -58, 2, 116, 16, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#8ac926';
    roundRectPath(ctx, -60, -6, 120, 10, 5);
    ctx.fill();
    ctx.stroke();

    // Верхняя булка с кунжутом
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(0, -4, 54, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff8eb';
    [-22, 0, 22].forEach(sx => {
      ctx.beginPath();
      ctx.ellipse(sx, -28, 4, 2, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });

  } else if (lvl.id === 4) {
    // Споровый Левиафан: хищный цветок с лепестками
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
    // Ледяной Титан Фрост-9: ромбовидный кристалл с ледяными шипами
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

    ctx.fillStyle = '#caf0f8';
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.lineTo(30, -8);
    ctx.lineTo(0, 26);
    ctx.lineTo(-30, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (lvl.id === 6) {
    // Инферно-Краб Вулкан: массивный панцирь и две огромные клешни
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
    // Кибер-Сфинкс MK-IV: неоновый треугольный дрон с лазерными крыльями
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
    // Фараон-Скарабей: золотой жук с солнечным диском
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

    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, 44);
    ctx.stroke();

  } else if (lvl.id === 9) {
    // Призрачный Адмирал: треуголка + волнистый призрачный шлейф
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

    // Пиратская шляпа адмирала
    ctx.fillStyle = '#1e1633';
    ctx.beginPath();
    ctx.moveTo(-58, -24);
    ctx.quadraticCurveTo(0, -64, 58, -24);
    ctx.quadraticCurveTo(0, -14, -58, -24);
    ctx.fill();
    ctx.stroke();

  } else {
    // Сектор 1 и Сектор 10: Кракен-Бот / Император Омега-Кракен
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

  // Общие выразительные глаза и злодейская улыбка босса
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

  // Хмурые брови
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-34, -20);
  ctx.lineTo(-8, -13);
  ctx.moveTo(34, -20);
  ctx.lineTo(8, -13);
  ctx.stroke();

  // Зубастая ухмылка
  ctx.fillStyle = INK;
  roundRectPath(ctx, -20, 14, 40, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, 14, 6, 5);
  ctx.fillRect(7, 14, 6, 5);

  ctx.restore();
}
