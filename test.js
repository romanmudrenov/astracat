javascript
'use strict';

const resultsList = document.getElementById('results-list');
const summaryBox = document.getElementById('summary-box');
let plainReportLines = [];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function addCard(title, status, badgeText, lines, snippet = '') {
  const card = document.createElement('div');
  card.className = `module-card ${status}`;

  const detailsHtml = lines.map(l => `<div>${l}</div>`).join('');
  const snippetHtml = snippet ? `<div class="code-snippet">${escapeHtml(snippet)}</div>` : '';

  card.innerHTML = `
    <div class="mod-head">
      <span>${title}</span>
      <span class="badge ${status}">${badgeText}</span>
    </div>
    <div class="mod-details">${detailsHtml}${snippetHtml}</div>
  `;
  resultsList.appendChild(card);

  plainReportLines.push(`[${badgeText}] ${title}`);
  lines.forEach(l => plainReportLines.push(`  - ${l.replace(/<[^>]*>/g, '')}`));
  if (snippet) plainReportLines.push(`  Snippet: ${snippet}`);
}

async function fetchTextFile(path) {
  const url = `${path}?nocache=${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} (${res.statusText})`);
  return await res.text();
}

function checkPollution(text) {
  const lines = text.trim().split('\n');
  const firstLine = (lines[0] || '').trim();
  const lastLine = (lines[lines.length - 1] || '').trim();
  const issues = [];
  if (firstLine.startsWith('\x60\x60\x60') || firstLine === 'html' || firstLine === 'javascript' || firstLine === 'css') {
    issues.push(`На 1-й строке лишний текст: "${firstLine}"`);
  }
  if (lastLine.startsWith('\x60\x60\x60') || lastLine === 'eof') {
    issues.push(`В конце файла лишний текст: "${lastLine}"`);
  }
  return issues;
}

async function checkImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ ok: true, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ ok: false });
    img.src = `${src}?t=${Date.now()}`;
  });
}

async function checkHead(src) {
  try {
    const res = await fetch(`${src}?t=${Date.now()}`, { method: 'HEAD' });
    return res.ok;
  } catch (_) {
    return false;
  }
}

async function runAllDiagnostics() {
  resultsList.innerHTML = '';
  plainReportLines = ['=== ОТЧЁТ ДИАГНОСТИКИ ASTRACAT ==='];
  summaryBox.textContent = '⏳ Идёт проверка всех модулей...';

  let errorCount = 0;
  let warnCount = 0;

  // 1. Проверка index.html
  try {
    const htmlText = await fetchTextFile('index.html');
    const mdIssues = checkPollution(htmlText);
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');

    const requiredIds = [
      'game', 'menu-particles-canvas', 'hud-top-bar', 'pause-btn', 'settings-open-btn', 'mute-btn',
      'prev-track-btn', 'next-track-btn', 'splash-overlay', 'splash-bg-img', 'splash-enter-btn',
      'start-overlay', 'diff-row', 'levels-grid', 'selected-level-info', 'start-btn', 'hangar-open-btn',
      'hangar-overlay', 'tab-ships-btn', 'tab-weapons-btn', 'tab-drones-btn',
      'hangar-section-ships', 'hangar-section-weapons', 'hangar-section-drones',
      'ships-carousel', 'weapons-carousel', 'drones-carousel', 'hangar-close-btn',
      'lore-overlay', 'intro-overlay', 'settings-overlay', 'pause-overlay', 'end-overlay'
    ];
    const missingIds = requiredIds.filter(id => !doc.getElementById(id));

    if (mdIssues.length > 0 || missingIds.length > 0) {
      errorCount++;
      const msgs = [...mdIssues];
      if (missingIds.length > 0) msgs.push(`Отсутствуют ID: ${missingIds.join(', ')}`);
      addCard('1. index.html', 'err', 'ОШИБКА', msgs, htmlText.slice(0, 140));
    } else {
      addCard('1. index.html', 'ok', 'OK', [
        `Размер: ${htmlText.length} байт • Все ${requiredIds.length} ID на месте ✔`
      ]);
    }
  } catch (e) {
    errorCount++;
    addCard('1. index.html', 'err', '404 / ОШИБКА', [e.message]);
  }

  // 2. Проверка css/style.css
  try {
    const cssText = await fetchTextFile('css/style.css');
    const mdIssues = checkPollution(cssText);
    const openBraces = (cssText.match(/\{/g) || []).length;
    const closeBraces = (cssText.match(/\}/g) || []).length;
    const issues = [...mdIssues];
    if (openBraces !== closeBraces) issues.push(`Несовпадение скобок: { = ${openBraces}, } = ${closeBraces}`);
    if (!cssText.includes('.three-tabs')) issues.push('Не найден класс .three-tabs для 3 вкладок Ангара');

    if (issues.length > 0) {
      errorCount++;
      addCard('2. css/style.css', 'err', 'ОШИБКА', issues, cssText.slice(0, 140));
    } else {
      addCard('2. css/style.css', 'ok', 'OK', [
        `Размер: ${cssText.length} байт • Скобки: ${openBraces}/${closeBraces} ✔`
      ]);
    }
  } catch (e) {
    errorCount++;
    addCard('2. css/style.css', 'err', '404 / ОШИБКА', [e.message]);
  }

  // 3. Проверка JS-модулей
  const jsModules = [
    {
      file: 'js/synth.js',
      title: '3. js/synth.js (Звук и музыка)',
      verify: (w) => typeof w.AstraCatSynth !== 'function' ? 'Класс AstraCatSynth не найден' : null
    },
    {
      file: 'js/vfx.js',
      title: '4. js/vfx.js (Спецэффекты)',
      verify: (w) => typeof w.VFXEngine !== 'function' ? 'Класс VFXEngine не найден' : null
    },
    {
      file: 'js/world3d.js',
      title: '5. js/world3d.js (Фоны и синусоиды)',
      verify: (w) => typeof w.World3DEngine !== 'function' ? 'Класс World3DEngine не найден' : null
    },
    {
      file: 'js/entities.js',
      title: '6. js/entities.js (Корабли, пушки, дроны)',
      verify: (w) => {
        if (!Array.isArray(w.SHIPS_CATALOG)) return 'Нет SHIPS_CATALOG';
        if (!Array.isArray(w.WEAPONS_CATALOG)) return 'Нет WEAPONS_CATALOG';
        if (!Array.isArray(w.DRONES_CATALOG)) return 'Нет DRONES_CATALOG';
        if (typeof w.drawDroneModel !== 'function') return 'Нет drawDroneModel';
        return null;
      }
    },
    {
      file: 'js/game.js',
      title: '7. js/game.js (Игровой цикл)',
      syntaxOnly: true
    }
  ];

  const sandbox = document.createElement('iframe');
  sandbox.style.display = 'none';
  document.body.appendChild(sandbox);
  const sbWin = sandbox.contentWindow;

  for (const mod of jsModules) {
    try {
      const code = await fetchTextFile(mod.file);
      const mdIssues = checkPollution(code);
      if (mdIssues.length > 0) {
        errorCount++;
        addCard(mod.title, 'err', 'МУСОР В КОДЕ', mdIssues, code.slice(0, 120));
        continue;
      }

      try {
        new sbWin.Function(code);
      } catch (synErr) {
        errorCount++;
        addCard(mod.title, 'err', 'SYNTAX ERROR', [`Ошибка синтаксиса: ${synErr.message}`], code.slice(0, 120));
        continue;
      }

      if (!mod.syntaxOnly && mod.verify) {
        try {
          sbWin.eval(code);
          const err = mod.verify(sbWin);
          if (err) {
            errorCount++;
            addCard(mod.title, 'err', 'ОШИБКА ЭКСПОРТА', [err]);
          } else {
            addCard(mod.title, 'ok', 'OK', [`Синтаксис и классы проверены (${code.length} байт) ✔`]);
          }
        } catch (runErr) {
          errorCount++;
          addCard(mod.title, 'err', 'RUNTIME ERROR', [runErr.message]);
        }
      } else {
        addCard(mod.title, 'ok', 'OK', [`Синтаксис проверен (${code.length} байт) ✔`]);
      }
    } catch (e) {
      errorCount++;
      addCard(mod.title, 'err', '404 / СЕТЬ', [e.message]);
    }
  }

  document.body.removeChild(sandbox);

  // 4. Проверка картинок
  const imgList = [
    'img/splash.jpg', 'img/menu_bg.jpg', 'img/hangar_bg.jpg',
    'img/slide1.jpg', 'img/slide2.jpg', 'img/slide3.jpg',
    'img/lvl1_in.jpg', 'img/lvl1_out.jpg',
    'img/lvl2_in.jpg', 'img/lvl2_out.jpg',
    'img/lvl3_in.jpg', 'img/lvl3_out.jpg',
    'img/lvl4_in.jpg', 'img/lvl4_out.jpg',
    'img/lvl5_in.jpg', 'img/lvl5_out.jpg',
    'img/lvl6_in.jpg', 'img/lvl6_out.jpg'
  ];
  const missImgs = [];
  for (const src of imgList) {
    const res = await checkImage(src);
    if (!res.ok) missImgs.push(src);
  }
  if (missImgs.length > 0) {
    warnCount++;
    addCard('8. Картинки (img/)', 'warn', 'ЕСТЬ ПРОПУСКИ', [
      `Найдено: ${imgList.length - missImgs.length}/${imgList.length}`,
      `Не найдены: ${missImgs.join(', ')}`
    ]);
  } else {
    addCard('8. Картинки (img/)', 'ok', 'OK', [`Все ${imgList.length} картинок загружены ✔`]);
  }

  // 5. Проверка музыки
  const musicList = ['music/leaving_the_city_early.mp3', 'music/level1.mp3', 'music/boss.mp3', 'music/boss2.mp3'];
  const missMusic = [];
  for (const m of musicList) {
    if (!(await checkHead(m))) missMusic.push(m);
  }
  addCard('9. Музыка (music/)', missMusic.length ? 'warn' : 'ok', missMusic.length ? 'ПРОВЕРИТЬ' : 'OK', [
    missMusic.length ? `Не найдены: ${missMusic.join(', ')}` : 'Базовые треки доступны ✔'
  ]);

  if (errorCount === 0 && warnCount === 0) {
    summaryBox.style.borderColor = '#06d6a0';
    summaryBox.innerHTML = '✅ ВСЕ 9 ПРОВЕРОК ПРОЙДЕНЫ! Ошибок нет.';
  } else {
    summaryBox.style.borderColor = errorCount > 0 ? '#ff006e' : '#ffd166';
    summaryBox.innerHTML = `⚠️ Критических ошибок: <b>${errorCount}</b> • Предупреждений: <b>${warnCount}</b>`;
  }
}

document.getElementById('run-btn').addEventListener('click', runAllDiagnostics);
document.getElementById('copy-btn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(plainReportLines.join('\n'));
    summaryBox.textContent = '📋 Отчёт скопирован! Вставь его в чат.';
  } catch (_) {
    summaryBox.textContent = 'Выдели и скопируй текст из карточек ниже.';
  }
});

runAllDiagnostics();
