const LOCALES = ['fr', 'nl', 'en'];
const NUMBER_LOCALES = { fr: 'fr-BE', nl: 'nl-BE', en: 'en-GB' };
const LOCALIZED_SIGNS = { nl: ['F111'] };
const NEW_CODE = Date.UTC(2027, 5, 1);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

const QUIZ = [
  { ok: true },
  { ok: false, sign: 'F99a' },
  { ok: true },
  { ok: false, sign: 'F111' },
  { ok: false },
];

const $ = id => document.getElementById(id);
let lang = 'fr';

function tr(key, vars = {}) {
  const text = I18N[lang][key] ?? I18N.fr[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

function num(value) {
  return new Intl.NumberFormat(NUMBER_LOCALES[lang]).format(value);
}

function pick(value) {
  return typeof value === 'object' && value !== null ? value[lang] ?? value.fr : value;
}

function storedLang() {
  try { return localStorage.getItem('lang'); } catch { return null; }
}

function saveLang(value) {
  try { localStorage.setItem('lang', value); } catch { }
}

function initialLang() {
  const query = new URLSearchParams(location.search).get('lang');
  if (LOCALES.includes(query)) return query;
  const saved = storedLang();
  if (LOCALES.includes(saved)) return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return browser === 'fr' || browser === 'nl' ? browser : 'en';
}

function signSrc(code) {
  const local = (LOCALIZED_SIGNS[lang] || []).includes(code);
  return `img/signs/${local ? `${lang}/` : ''}${code}.webp`;
}

function applyText() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = tr(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = tr(el.dataset.i18nAlt); });
  document.querySelectorAll('[data-i18n-content]').forEach(el => { el.content = tr(el.dataset.i18nContent); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => { el.setAttribute('aria-label', tr(el.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-lang-href]').forEach(el => { el.href = el.dataset.langHref.replace('{lang}', lang); });
  document.querySelectorAll('[data-screen]').forEach(el => {
    el.src = `img/screens${lang === 'fr' ? '' : `-${lang}`}/${el.dataset.screen}.webp`;
  });
  $('lang').value = lang;
}

function setLang(value) {
  lang = value;
  saveLang(value);
  const url = new URL(location.href);
  url.searchParams.set('lang', value);
  history.replaceState(null, '', url);
  applyText();
  renderCards();
  renderStats();
  renderDays();
  renderQuestion();
}

function buildScene() {
  const W = 1440, H = 820, GROUND = 600;
  const rand = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  let houses = '', windows = '';
  for (let x = -20; x < W + 40;) {
    const w = 90 + Math.floor(rand() * 70);
    const h = 170 + Math.floor(rand() * 120);
    const top = GROUND - h;
    const shade = ['#26292c', '#2c3033', '#232629', '#313538'][Math.floor(rand() * 4)];
    let roof;
    if (rand() > .45) {
      const s = w / 7, r = 26;
      roof = `${x},${top} ${x},${top - r} ${x + s},${top - r} ${x + s},${top - 2 * r} ${x + 2 * s},${top - 2 * r} ${x + 2 * s},${top - 3 * r} ${x + 3 * s},${top - 3 * r} ${x + 3 * s},${top - 4 * r} ${x + 4 * s},${top - 4 * r} ${x + 4 * s},${top - 3 * r} ${x + 5 * s},${top - 3 * r} ${x + 5 * s},${top - 2 * r} ${x + 6 * s},${top - 2 * r} ${x + 6 * s},${top - r} ${x + w},${top - r} ${x + w},${top}`;
    } else {
      roof = `${x},${top} ${x + w / 2},${top - 60} ${x + w},${top}`;
    }
    houses += `<polygon points="${roof} ${x + w},${GROUND} ${x},${GROUND}" fill="${shade}"/>`;
    const cols = w > 130 ? 3 : 2, rows = Math.floor((h - 50) / 62);
    const ww = 18, wh = 30, gap = (w - cols * ww) / (cols + 1);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const lit = rand() > .48;
      windows += `<rect x="${x + gap + c * (ww + gap)}" y="${top + 26 + r * 62}" width="${ww}" height="${wh}" rx="3" fill="${lit ? '#f2c14e' : '#3a3f43'}" opacity="${lit ? .55 + rand() * .45 : 1}"/>`;
    }
    x += w;
  }
  let lamps = '';
  for (let x = 140; x < W; x += 340) {
    lamps += `<circle cx="${x}" cy="${GROUND - 168}" r="120" fill="url(#glow)"/><rect x="${x - 3}" y="${GROUND - 170}" width="6" height="190" rx="3" fill="#0d151c"/><path d="M${x} ${GROUND - 170} q0 -20 22 -20" stroke="#0d151c" stroke-width="6" fill="none"/><rect x="${x + 14}" y="${GROUND - 194}" width="20" height="10" rx="4" fill="#ffe6a3"/>`;
  }
  let stars = '';
  for (let i = 0; i < 40; i++) stars += `<circle cx="${rand() * W}" cy="${rand() * 300}" r="${rand() * 1.4 + .4}" fill="#f8f1e5" opacity="${rand() * .6 + .2}"/>`;
  let bikes = '';
  for (let x = 60; x < W; x += 300) bikes += `<image href="img/bike-marking.webp" x="${x}" y="${H - 92}" width="96" height="51" opacity=".85"/>`;
  const defs = `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17191b"/><stop offset=".65" stop-color="#3a3f43"/><stop offset="1" stop-color="#7a5446"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#ffd877" stop-opacity=".38"/><stop offset="1" stop-color="#ffd877" stop-opacity="0"/></radialGradient>
    <pattern id="dash" width="90" height="5" patternUnits="userSpaceOnUse"><rect width="50" height="5" fill="#f4f2ec" opacity=".8"/></pattern>
  </defs>`;
  const layer = (depth, body) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" data-depth="${depth}">${defs}${body}</svg>`;
  $('scene').innerHTML =
    layer(.15, `<rect width="${W}" height="${H}" fill="url(#sky)"/>${stars}<circle cx="1180" cy="120" r="34" fill="#f6ead0"/><circle cx="1194" cy="110" r="30" fill="#1d2023"/>`) +
    layer(.45, houses + windows) +
    layer(1, `<rect y="${GROUND}" width="${W}" height="32" fill="#4a5258"/><rect y="${GROUND + 32}" width="${W}" height="6" fill="#6e767b"/><rect y="${GROUND + 38}" width="${W}" height="${H - GROUND - 38}" fill="#2a2f33"/><rect y="${GROUND + 86}" width="${W}" height="5" fill="url(#dash)"/><rect y="${H - 110}" width="${W}" height="5" fill="url(#dash)"/><rect y="${H - 100}" width="${W}" height="100" fill="#b5432f"/>${bikes}`) +
    layer(1.35, lamps);
}

function initMotion() {
  const hero = document.querySelector('.hero');
  const nav = $('nav');
  new IntersectionObserver(([e]) => nav.classList.toggle('solid', !e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
  if (REDUCED) return;
  const layers = [...document.querySelectorAll('#scene svg')];
  const rider = document.querySelector('.rider');
  let px = 0, py = 0, sy = 0, queued = false;
  const paint = () => {
    queued = false;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      l.style.transform = `translate3d(${px * d * -18}px, ${py * d * -8 + sy * (1 - Math.min(d, 1)) * .35}px, 0)`;
    });
    rider.style.translate = `${px * -26}px ${py * -6}px`;
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
  if (FINE) hero.addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; ask(); });
  addEventListener('scroll', () => { sy = Math.min(scrollY, innerHeight); ask(); }, { passive: true });
  if (!FINE) return;
  document.addEventListener('pointermove', e => {
    const el = e.target.closest?.('[data-tilt]');
    document.querySelectorAll('[data-tilting]').forEach(other => {
      if (other !== el) { other.removeAttribute('data-tilting'); other.style.removeProperty('--ry'); other.style.removeProperty('--rx'); }
    });
    if (!el) return;
    const max = +el.dataset.tilt;
    const r = el.getBoundingClientRect();
    el.setAttribute('data-tilting', '');
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * max * 2}deg`);
    el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * max * 2}deg`);
  });
}

let quizIndex = 0, quizScore = 0, quizDone = false;

function renderQuestion() {
  const item = QUIZ[quizIndex];
  $('qcount').textContent = tr('questionOf', { n: quizIndex + 1, total: QUIZ.length });
  $('pips').innerHTML = QUIZ.map((_, k) => `<i class="${k < quizIndex ? 'done' : k === quizIndex ? 'now' : ''}"></i>`).join('');
  $('qtext').textContent = tr(`q${quizIndex + 1}`);
  const sign = $('qsign');
  sign.hidden = !item.sign;
  if (item.sign) { sign.src = signSrc(item.sign); sign.alt = tr('sign', { code: item.sign }); }
}

function initQuiz() {
  const dialog = $('result');
  document.querySelectorAll('.choices button').forEach(b => b.addEventListener('click', () => {
    const item = QUIZ[quizIndex];
    const good = (b.dataset.v === '1') === item.ok;
    quizScore += good ? 1 : 0;
    $('rstamp').hidden = false;
    $('rmascot').hidden = true;
    $('rstamp').className = `stamp ${good ? 'good' : 'bad'}`;
    $('rstamp').textContent = good ? '✓' : '✗';
    $('rtitle').textContent = tr(good ? 'verdictOk' : 'verdictNo');
    $('rtruth').textContent = tr(item.ok ? 'itIsTrue' : 'itIsFalse');
    $('rwhy').textContent = tr(`a${quizIndex + 1}`);
    $('rnext').textContent = tr(quizIndex < QUIZ.length - 1 ? 'nextQuestion' : 'seeScore');
    dialog.showModal();
  }));
  $('rnext').addEventListener('click', () => {
    if (quizDone) {
      quizDone = false; quizIndex = 0; quizScore = 0;
      dialog.close(); renderQuestion(); return;
    }
    if (quizIndex < QUIZ.length - 1) { dialog.close(); quizIndex += 1; renderQuestion(); return; }
    quizDone = true;
    $('rstamp').hidden = true;
    $('rmascot').hidden = false;
    $('rtitle').textContent = tr('endTitle', { score: quizScore, total: QUIZ.length });
    $('rtruth').textContent = tr(quizScore === QUIZ.length ? 'endPerfect' : quizScore >= 3 ? 'endGood' : 'endLearn');
    $('rwhy').textContent = tr('endBody', { rules: CONTENT.totals.rules });
    $('rnext').textContent = tr('restart');
  });
  dialog.addEventListener('cancel', e => { e.preventDefault(); $('rnext').click(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) $('rnext').click(); });
}

function renderCards() {
  $('cardsKicker').textContent = tr('cardsKicker', { cards: CONTENT.totals.cards, rules: CONTENT.totals.rules });
  const grid = $('guides');
  grid.querySelectorAll('.guide:not(.more)').forEach(el => el.remove());
  const html = CONTENT.cards.map(card => `
    <div class="card guide" data-tilt="7">
      <img src="img/${card.icon}.webp" alt="" width="70" height="70" loading="lazy">
      <h3>${pick(card.title)}</h3>
      <p>${pick(card.summary)}</p>
      <span class="count">${tr('rulesCount', { n: card.rules })}</span>
    </div>`).join('');
  grid.insertAdjacentHTML('afterbegin', html);
}

let statsYear = null;

function renderReadout(year) {
  const y = CONTENT.stats.years.find(item => item.year === year);
  const total = y.dead + y.serious + y.slight;
  $('readout').innerHTML = `
    <span class="year">${y.year}</span>
    <p class="total"><b>${num(total)}</b>${tr('chartTotal')}</p>
    <ul>
      <li><b>${num(y.dead)}</b> ${tr('chartKilled')}</li>
      <li><b>${num(y.serious)}</b> ${tr('chartSerious')}</li>
      <li><b>${num(y.slight)}</b> ${tr('chartSlight')}</li>
    </ul>`;
  document.querySelectorAll('.bar').forEach(b => {
    const on = +b.dataset.year === year;
    b.classList.toggle('active', on);
  });
}

function renderStats() {
  const years = CONTENT.stats.years;
  const last = years[years.length - 1];
  if (statsYear === null) statsYear = last.year;
  document.querySelector('[data-key="dead"]').textContent = num(last.dead);
  document.querySelector('[data-key="serious"]').textContent = num(last.serious);
  document.querySelector('[data-key="slight"]').textContent = num(last.slight);
  $('keyKilled').textContent = tr('statsKilled', { year: last.year });
  $('chartHint').textContent = tr(FINE ? 'chartHintMouse' : 'chartHintTouch');
  $('statsSource').innerHTML = tr('statsSource', { url: CONTENT.stats.source.url, name: CONTENT.stats.source.name });
  const max = Math.max(...years.map(y => y.dead + y.serious + y.slight));
  const bars = $('bars');
  bars.setAttribute('aria-label', tr('chartTitle'));
  bars.innerHTML = years.map((y, k) => {
    const total = y.dead + y.serious + y.slight;
    return `<button type="button" class="bar" data-year="${y.year}" aria-pressed="${y.year === statsYear}" aria-label="${tr('chartBar', { year: y.year, total: num(total) })}" style="--h:${(total / max) * 86}%; --d:${k * 60}ms">
      <span class="col"></span>
      <span class="tip" aria-hidden="true">${y.year} : ${num(total)}</span>
      <span class="yr" aria-hidden="true">${y.year}</span>
    </button>`;
  }).join('');
  renderReadout(statsYear);
}

function initChart() {
  const bars = $('bars');
  const show = year => renderReadout(year);
  const pin = year => {
    statsYear = year;
    bars.querySelectorAll('.bar').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.year === year)));
    show(year);
  };
  bars.addEventListener('click', e => { const b = e.target.closest('.bar'); if (b) pin(+b.dataset.year); });
  bars.addEventListener('focusin', e => { const b = e.target.closest('.bar'); if (b) pin(+b.dataset.year); });
  if (FINE) {
    bars.addEventListener('pointerover', e => { const b = e.target.closest('.bar'); if (b) show(+b.dataset.year); });
    bars.addEventListener('pointerleave', () => show(statsYear));
  }
  bars.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const list = [...bars.querySelectorAll('.bar')];
    let i = list.findIndex(b => +b.dataset.year === statsYear);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : Math.max(0, Math.min(list.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)));
    e.preventDefault();
    list[i].focus();
  });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { bars.classList.add('on'); o.disconnect(); } }, { threshold: .3 }).observe(bars);
}

function renderDays() {
  const days = Math.max(0, Math.ceil((NEW_CODE - Date.now()) / 864e5));
  const box = $('days');
  box.querySelector('b').textContent = num(days);
  box.querySelector('span').textContent = tr(days === 1 ? 'daysOne' : 'daysMany');
  box.setAttribute('aria-label', tr('daysLabel', { n: num(days) }));
}

lang = initialLang();
buildScene();
applyText();
renderCards();
renderStats();
renderDays();
renderQuestion();
initMotion();
initQuiz();
initChart();
$('lang').addEventListener('change', e => setLang(e.target.value));
