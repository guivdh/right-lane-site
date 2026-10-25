const STORES = {
  android: 'https://play.google.com/store/apps/details?id=be.codevelo.app',
  ios: null,
};

const LOCALES = ['fr', 'nl', 'en'];
const NUMBER_LOCALES = { fr: 'fr-BE', nl: 'nl-BE', en: 'en-GB' };
const LOCALIZED_SIGNS = { nl: ['F111'] };
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NEW_CODE = Date.UTC(2027, 5, 1);

const STEPS = [
  { screen: 'card', title: 'demo1Title', body: 'demo1Body' },
  { screen: 'rule-bike-box', title: 'demo2Title', body: 'demo2Body' },
  { screen: 'rule-overtaking', title: 'demo3Title', body: 'demo3Body' },
  { screen: 'sign-d7', title: 'demo4Title', body: 'demo4Body' },
  { screen: 'law-bike-box', title: 'demo5Title', body: 'demo5Body' },
];

const FEATURES = [
  ['f1', '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M9 7h6M9 10.5h4"/>'],
  ['f2', '<path d="M3 9h18M3 15h18M12 3v18"/><circle cx="16.5" cy="12" r="1.8"/>'],
  ['f3', '<circle cx="12" cy="10" r="7"/><path d="M12 17v4.5"/>'],
  ['f4', '<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 13.5h6M9 17h4"/>'],
  ['f5', '<path d="M12 3v18M4 7h16M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>'],
  ['f6', '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>'],
  ['f7', '<path d="M4 9a12 12 0 0 1 16 0M7 12.5a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><path d="M3 3l18 18"/>'],
  ['f8', '<path d="M4 19 9 5l5 14M5.8 14h6.4M15 19l3-8 3 8M15.9 16.5h4.2"/>'],
];

const SCREENS = [
  ['home', 'capHome', 'altHome'],
  ['card', 'capCard', 'altCard'],
  ['rule-bike-box', 'capRule', 'altBikeBox'],
  ['rule-overtaking', 'capScheme', 'altOvertaking'],
  ['sign-d7', 'capSign', 'altSign'],
  ['law-bike-box', 'capLaw', 'altLaw'],
  ['home-stats', 'capStats', 'altStats'],
];

const QUIZ = [
  { ok: true },
  { ok: false, sign: 'F99a' },
  { ok: true },
  { ok: false, sign: 'F111' },
  { ok: false },
];

const TRUST = ['trustAccount', 'trustAds', 'trustOffline', 'trustLanguages'];

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5v17a1 1 0 0 0 1.5.86l14.2-8.5a1 1 0 0 0 0-1.72L6.5 2.64A1 1 0 0 0 5 3.5Z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-3.5ZM14.1 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3Z"/></svg>',
  tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let lang = 'fr';

const pick = (text) => text[lang] ?? text.fr;
const number = (value) => new Intl.NumberFormat(NUMBER_LOCALES[lang]).format(value);

function typeset(text) {
  return lang === 'fr' ? text.replace(/ ([?!:;»])/g, ' $1') : text;
}

function tr(key, values = {}) {
  const all = { cards: CONTENT.totals.cards, rules: CONTENT.totals.rules, ...values };
  const text = (I18N[lang] && I18N[lang][key]) ?? I18N.fr[key] ?? key;
  return typeset(text.replace(/\{(\w+)\}/g, (_, name) => all[name] ?? ''));
}

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};

const TARGETS = [
  ['i18n', 'data-i18n', (el, value) => { el.innerHTML = value; }, (el) => el.innerHTML],
  ['i18nAlt', 'data-i18n-alt', (el, value) => { el.alt = value; }, (el) => el.alt],
  ['i18nContent', 'data-i18n-content', (el, value) => { el.content = value; }, (el) => el.content],
  ['i18nAriaLabel', 'data-i18n-aria-label', (el, value) => el.setAttribute('aria-label', value), (el) => el.getAttribute('aria-label')],
];

const screenSrc = (name) => `img/screens${lang === 'fr' ? '' : `-${lang}`}/${name}.webp`;
const signSrc = (code) => `img/signs/${(LOCALIZED_SIGNS[lang] ?? []).includes(code) ? `${lang}/` : ''}${code}.webp`;

function pickLanguage() {
  const asked = new URLSearchParams(window.location.search).get('lang') ?? storage.get('rl-lang');
  if (LOCALES.includes(asked)) {
    return asked;
  }
  for (const code of navigator.languages ?? [navigator.language]) {
    const short = (code || '').slice(0, 2).toLowerCase();
    if (short === 'fr' || short === 'nl') {
      return short;
    }
  }
  return 'en';
}

const pending = [];
const watch = (el, run) => (REDUCED ? run() : pending.push([el, run]));

function checkPending() {
  for (let i = pending.length - 1; i >= 0; i--) {
    const box = pending[i][0].getBoundingClientRect();
    if (box.top < innerHeight * 0.88 && box.bottom > 0) {
      pending[i][1]();
      pending.splice(i, 1);
    }
  }
}

function onFrame(run) {
  let queued = false;
  const ask = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        run();
      });
    }
  };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask, { passive: true });
  ask();
}

function setupRoads() {
  const road = '<div class="road"><span class="walk"></span><span class="curb"></span><span class="car"></span><span class="solid"></span><span class="car"></span><span class="dashed"></span><span class="bikes"></span><span class="curb"></span><span class="walk"></span></div>';
  $$('[data-road]').forEach((scene) => {
    scene.innerHTML = road;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => scene.classList.toggle('paused', !entry.isIntersecting)).observe(scene);
    }
  });
}

function renderStores() {
  $$('[data-stores]').forEach((box) => {
    const android = `<a class="store" href="${STORES.android}" target="_blank" rel="noopener">${ICON.play}<span><small>${tr('storeOn')}</small>Google Play</span></a>`;
    const ios = STORES.ios
      ? `<a class="store store-ghost" href="${STORES.ios}" target="_blank" rel="noopener">${ICON.apple}<span><small>${tr('storeOn')}</small>App Store</span></a>`
      : `<span class="store store-ghost" aria-disabled="true">${ICON.apple}<span><small>${tr('soon')}</small>${tr('appStore')}</span></span>`;
    box.innerHTML = android + ios;
  });
  $$('[data-checks]').forEach((list) => {
    list.innerHTML = TRUST.map((key) => `<li>${ICON.tick}${tr(key)}</li>`).join('');
  });
}

const sections = $$('section[data-km]');

function renderNavigation() {
  const link = (section) => `<a href="#${section.id}"><b>KM ${section.dataset.km}</b><span>${tr(section.dataset.nav)}</span></a>`;
  const current = $('.nav-links a[aria-current="true"]')?.hash;
  $('.nav-links').innerHTML = sections
    .filter((section) => section.id !== 'download')
    .map((section) => `<a href="#${section.id}"${`#${section.id}` === current ? ' aria-current="true"' : ''}>${tr(section.dataset.nav)}</a>`)
    .join('');
  $('.menu').innerHTML = sections.map(link).join('');
  $('.rail ol').innerHTML = sections.map((section) => `<li>${link(section)}</li>`).join('');
  setMenu($('.menu').classList.contains('open'));
  placeRail();
}

function setMenu(open) {
  const button = $('.menu-btn');
  $('.menu').classList.toggle('open', open);
  button.setAttribute('aria-expanded', String(open));
  button.textContent = tr(open ? 'menuClose' : 'menuOpen');
}

function placeRail() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const items = $$('.rail li');
  sections.forEach((section, i) => {
    const at = Math.min(1, Math.max(0, (section.getBoundingClientRect().top + scrollY - 80) / max));
    items[i]?.style.setProperty('--at', `${(at * 100).toFixed(2)}%`);
  });
}

function setupNavigation() {
  $('.menu-btn').addEventListener('click', () => setMenu(!$('.menu').classList.contains('open')));
  $('.menu').addEventListener('click', (event) => event.target.closest('a') && setMenu(false));
  addEventListener('keydown', (event) => event.key === 'Escape' && setMenu(false));

  const banner = $('#banner');
  if (storage.get('rl-2027-closed') !== '1') {
    banner.hidden = false;
  }
  $('[data-close-banner]').addEventListener('click', () => {
    banner.hidden = true;
    storage.set('rl-2027-closed', '1');
    placeRail();
  });

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            $$('.nav-links a').forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${entry.target.id}`)));
          }
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => spy.observe(section));
  }

  addEventListener('resize', placeRail, { passive: true });
  addEventListener('load', placeRail);

  const nav = $('.nav');
  const rail = $('.rail');
  const heroPhone = $('.hero-phone');
  onFrame(() => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(1, y / max) : 0;
    nav.classList.toggle('solid', y > 30);
    nav.style.setProperty('--p', progress.toFixed(4));
    rail.style.setProperty('--p', progress.toFixed(4));
    rail.classList.toggle('show', y > innerHeight * 0.6);
    checkPending();
    if (REDUCED) {
      return;
    }
    const t = Math.min(1, y / innerHeight);
    heroPhone.style.setProperty('--py', `${(-22 + t * 22).toFixed(2)}deg`);
    heroPhone.style.setProperty('--px', `${(10 - t * 6).toFixed(2)}deg`);
  });
  addEventListener('scroll', checkPending, { passive: true });
}

const quiz = { index: 0, score: 0, answer: null };

function quizFront(i) {
  const q = QUIZ[i];
  const sign = q.sign ? `<img class="qsign" src="${signSrc(q.sign)}" alt="${tr('sign', { code: q.sign })}" width="84" height="84">` : '';
  return `<div class="face front">
      <p class="qn">${tr('questionOf', { n: i + 1, total: QUIZ.length })}</p>
      <p class="qtext">${tr(`q${i + 1}`)}</p>
      ${sign}
      <div class="choices"><button type="button" data-c="true">${tr('true')}</button><button type="button" data-c="false">${tr('false')}</button></div>
    </div>`;
}

function quizBack(i, picked) {
  const q = QUIZ[i];
  const right = picked === q.ok;
  const verdict = right
    ? `<i style="background:var(--ok)">✓</i> ${tr('verdictOk')}`
    : `<i style="background:var(--no)">✗</i> ${tr('verdictNo')}`;
  return `<div class="face back ${right ? 'ok' : 'no'}">
      <p class="verdict">${verdict}</p>
      <p class="picked-line">${tr('yourAnswer', { answer: tr(String(picked)) })}</p>
      <p class="answer"><b>${tr('rightAnswer', { answer: tr(String(q.ok)) })}</b>${tr(`a${i + 1}`)}</p>
      <button type="button" class="btn btn-yellow">${tr(i === QUIZ.length - 1 ? 'seeScore' : 'nextQuestion')}</button>
    </div>`;
}

function quizEnd(score) {
  const message = score === QUIZ.length ? 'endPerfect' : score >= 3 ? 'endGood' : 'endLearn';
  return `<div class="face qend">
      <img src="img/mascot/well-done.webp" alt="" width="150" height="173">
      <h3>${tr('endScore', { score, total: QUIZ.length })} ${tr(message)}</h3>
      <p>${tr('quizEnd')}</p>
      <div class="row"><a class="btn btn-yellow" href="#download">${tr('quizCta')}</a><button type="button" class="btn btn-line">${tr('restart')}</button></div>
    </div>`;
}

function fitQuiz() {
  const card = $('.qcard');
  const ghost = document.createElement('div');
  ghost.className = 'qcard qghost';
  ghost.setAttribute('aria-hidden', 'true');
  card.parentNode.appendChild(ghost);
  const states = QUIZ.flatMap((q, i) => [quizFront(i), quizBack(i, !q.ok), quizBack(i, q.ok)]).concat(quizEnd(0));
  let tallest = 0;
  states.forEach((html) => {
    ghost.innerHTML = html;
    tallest = Math.max(tallest, ghost.offsetHeight);
  });
  ghost.remove();
  card.style.minHeight = `${Math.ceil(tallest)}px`;
}

function setQuizScore() {
  $('.sv').textContent = quiz.score;
  $('.score span').textContent = tr(quiz.score > 1 ? 'scoreMany' : 'scoreOne', { total: QUIZ.length });
}

function swapQuiz(render) {
  const card = $('.qcard');
  if (REDUCED) {
    render();
    return;
  }
  card.classList.add('swap-out');
  setTimeout(() => {
    card.classList.remove('swap-out');
    render();
    card.classList.add('swap-in');
    setTimeout(() => card.classList.remove('swap-in'), 520);
  }, 340);
}

function renderQuiz(animateFlip = false) {
  const card = $('.qcard');
  const trip = $('.trip');
  setQuizScore();
  if (quiz.index >= QUIZ.length) {
    trip.style.setProperty('--t', 1);
    card.innerHTML = quizEnd(quiz.score);
    $('.btn-line', card).addEventListener('click', () => {
      Object.assign(quiz, { index: 0, score: 0, answer: null });
      swapQuiz(() => renderQuiz());
    });
    return;
  }
  const answered = quiz.answer !== null;
  trip.style.setProperty('--t', (quiz.index + (answered ? 1 : 0)) / QUIZ.length);
  card.innerHTML = `<div class="flipper${answered && !animateFlip ? ' flipped' : ''}">${quizFront(quiz.index)}${answered ? quizBack(quiz.index, quiz.answer) : ''}</div>`;
  const flipper = $('.flipper', card);
  if (!answered) {
    $$('.choices button', card).forEach((button) =>
      button.addEventListener('click', () => {
        const picked = button.dataset.c === 'true';
        quiz.answer = picked;
        quiz.score += picked === QUIZ[quiz.index].ok ? 1 : 0;
        renderQuiz(true);
      }),
    );
    return;
  }
  const front = $('.front', flipper);
  front.inert = true;
  front.setAttribute('aria-hidden', 'true');
  const next = $('.back .btn', flipper);
  next.addEventListener('click', () => {
    quiz.index += 1;
    quiz.answer = null;
    swapQuiz(() => renderQuiz());
  });
  if (animateFlip) {
    void flipper.offsetWidth;
    flipper.classList.add('flipped');
    setTimeout(() => next.focus({ preventScroll: true }), REDUCED ? 0 : 500);
  }
}

let step = 0;

function renderDemo() {
  $('.steps').innerHTML = STEPS.map(
    (s, i) => `<li><button type="button" aria-current="${i === step}"><b>${i + 1}</b><span><strong>${tr(s.title)}</strong><span>${tr(s.body)}</span></span></button></li>`,
  ).join('');
  $$('.steps button').forEach((button, i) => button.addEventListener('click', () => showStep(i)));
  showStep(step, false);
}

function showStep(i, animate = true) {
  step = (i + STEPS.length) % STEPS.length;
  const phone = $('.demo-phone .phone');
  const image = $('.screen', phone);
  const angles = [-14, 12, -10, 16, -8];
  $$('.steps button').forEach((button, n) => button.setAttribute('aria-current', String(n === step)));
  phone.style.setProperty('--ay', `${angles[step]}deg`);
  $('.demo-nav .count').textContent = `${step + 1} / ${STEPS.length}`;
  const swap = () => {
    image.src = screenSrc(STEPS[step].screen);
    image.alt = tr(STEPS[step].title);
    if (image.complete) {
      image.classList.remove('out');
    } else {
      image.onload = () => image.classList.remove('out');
    }
  };
  if (!animate || REDUCED) {
    swap();
    return;
  }
  image.classList.add('out');
  setTimeout(swap, 250);
}

function setupDemo() {
  $$('[data-step]').forEach((button) => button.addEventListener('click', () => showStep(step + Number(button.dataset.step))));
}

let featuresShown = false;

function renderFeatures() {
  $('.features').innerHTML = FEATURES.map(
    ([key, path], i) =>
      `<li class="feature reveal${featuresShown ? ' in' : ''}" style="transition-delay:0s,${(i % 4) * 70}ms,${(i % 4) * 70}ms"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg></span><h3>${tr(`${key}Title`)}</h3><p>${tr(`${key}Body`)}</p></li>`,
  ).join('');
}

let flowIndex = 2;

function renderScreens() {
  const flow = $('.flow');
  flow.innerHTML = SCREENS.map(
    ([name, , alt]) => `<figure><div class="phone"><img class="screen" src="${screenSrc(name)}" alt="${tr(alt)}" width="390" height="844" loading="lazy"></div></figure>`,
  ).join('');
  $$('figure', flow).forEach((figure, i) => figure.addEventListener('click', () => goToScreen(i)));
  goToScreen(flowIndex, false);
  coverFlow();
}

function goToScreen(i, smooth = true) {
  const flow = $('.flow');
  const figures = [...flow.children];
  flowIndex = Math.max(0, Math.min(figures.length - 1, i));
  const figure = figures[flowIndex];
  flow.scrollTo({ left: figure.offsetLeft - (flow.clientWidth - figure.offsetWidth) / 2, behavior: smooth && !REDUCED ? 'smooth' : 'auto' });
}

function coverFlow() {
  const flow = $('.flow');
  const figures = [...flow.children];
  const middle = flow.getBoundingClientRect().left + flow.clientWidth / 2;
  let best = 0;
  let bestDistance = Infinity;
  figures.forEach((figure, i) => {
    const box = figure.getBoundingClientRect();
    const raw = (box.left + box.width / 2 - middle) / (box.width * 1.6);
    const d = Math.max(-1, Math.min(1, raw));
    if (Math.abs(raw) < bestDistance) {
      bestDistance = Math.abs(raw);
      best = i;
    }
    if (REDUCED) {
      return;
    }
    figure.style.setProperty('--fy', `${(-d * 48).toFixed(1)}deg`);
    figure.style.setProperty('--fs', (1 - Math.abs(d) * 0.18).toFixed(3));
    figure.style.setProperty('--fz', `${(-Math.abs(d) * 120).toFixed(0)}px`);
    figure.style.setProperty('--fo', (1 - Math.abs(d) * 0.5).toFixed(2));
  });
  flowIndex = best;
  $('.flow-cap').innerHTML = `${tr(SCREENS[best][1])}<small>${tr('screenOf', { n: best + 1, total: figures.length })}</small>`;
  $('[data-flow="-1"]').disabled = best === 0;
  $('[data-flow="1"]').disabled = best === figures.length - 1;
}

function setupScreens() {
  const flow = $('.flow');
  let queued = false;
  flow.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          coverFlow();
        });
      }
    },
    { passive: true },
  );
  $$('[data-flow]').forEach((button) => button.addEventListener('click', () => goToScreen(flowIndex + Number(button.dataset.flow))));
  flow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goToScreen(flowIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  addEventListener('resize', () => goToScreen(flowIndex, false), { passive: true });
}

function renderCards() {
  const max = Math.max(...CONTENT.cards.map((card) => card.rules));
  const done = $('.cards').dataset.done;
  $('.cards').innerHTML = CONTENT.cards
    .map(
      (card) => `<li class="card${done ? ' in' : ''}"><img src="img/${card.icon}.webp" alt="" loading="lazy" width="78" height="78"><div><h3>${pick(card.title)}</h3><p>${pick(card.summary)}</p></div><div class="meter"><strong>${tr('cardRules', { n: card.rules })}</strong><span>${tr('cardChapters', { n: card.chapters })}</span><i style="--w:${((card.rules / max) * 100).toFixed(0)}%"></i></div></li>`,
    )
    .join('');
  if (!done) {
    $$('.cards .card').forEach((el) => watch(el, () => el.classList.add('in')));
  }
  $('.cards').dataset.done = '1';
}

let chartYear = null;

function renderStats() {
  const stats = CONTENT.stats;
  const years = stats.years.map((y) => ({ ...y, total: y.dead + y.serious + y.slight }));
  const last = years[years.length - 1];
  const peak = Math.max(...years.map((y) => y.total));
  chartYear ??= years.length - 1;
  $$('[data-count]').forEach((el) => {
    el.textContent = number(last[el.dataset.count]);
  });
  const chart = $('.chart');
  chart.innerHTML = years
    .map(
      (y, k) =>
        `<button type="button" style="--h:${((y.total / peak) * 100).toFixed(1)}%;--k:${k}" aria-pressed="${k === chartYear}" aria-label="${tr('chartBar', { year: y.year, total: number(y.total) })}"><i></i><small>${y.year}</small></button>`,
    )
    .join('');
  const read = (k) => {
    chartYear = k;
    const y = years[k];
    $$('button', chart).forEach((button, j) => button.setAttribute('aria-pressed', String(j === k)));
    $('.chart-read').innerHTML = tr('chartRead', { year: y.year, total: number(y.total), dead: y.dead });
  };
  $$('button', chart).forEach((button, k) => button.addEventListener('click', () => read(k)));
  read(chartYear);
  $('.facts-title').textContent = pick(stats.factsTitle);
  $('.facts').innerHTML = stats.facts
    .map((fact) => {
      const value = Math.round((fact.part / fact.of) * 100);
      return `<div class="fact"><b>${number(value)}&nbsp;%</b><p>${pick(fact.text)}</p><div class="gauge" style="--v:${value}%"></div></div>`;
    })
    .join('');
  $('.stats-note').innerHTML = `${pick(stats.definition)} ${pick(stats.note)} ${tr('statsSource', stats.source)}`;
}

function setupStats() {
  const chart = $('.chart');
  watch(chart, () => chart.classList.add('in'));
  watch($('.facts'), () => $('.facts').classList.add('in'));
  watch($('.keys'), () => {
    if (REDUCED) {
      return;
    }
    $$('[data-count]').forEach((el) => {
      const last = CONTENT.stats.years[CONTENT.stats.years.length - 1];
      const end = last[el.dataset.count];
      const start = performance.now();
      const run = (now) => {
        const k = Math.max(0, Math.min(1, (now - start) / 1200));
        el.textContent = number(Math.round(end * (1 - Math.pow(1 - k, 3))));
        if (k < 1) {
          requestAnimationFrame(run);
        }
      };
      requestAnimationFrame(run);
    });
  });
}

function renderCountdown() {
  const flap = $('.flap');
  const days = Math.ceil((NEW_CODE - Date.now()) / 86400000);
  if (days <= 0) {
    flap.hidden = true;
    return;
  }
  const digits = $('.flap-digits');
  const flipped = digits.dataset.flipped;
  digits.innerHTML = String(days)
    .split('')
    .map((d, i) => `<span${flipped ? '' : ` style="--d:${i * 120}ms"`}>${d}</span>`)
    .join('');
  $('.flap-label').textContent = tr(days > 1 ? 'daysMany' : 'daysOne');
  flap.setAttribute('role', 'img');
  flap.setAttribute('aria-label', tr('daysLabel', { n: days }));
}

function setupCountdown() {
  const digits = $('.flap-digits');
  watch(digits, () => {
    digits.dataset.flipped = '1';
    $$('span', digits).forEach((span) => span.classList.add('flip'));
  });
}

function applyLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  TARGETS.forEach(([key, attr, write]) => {
    $$(`[${attr}]`).forEach((el) => write(el, tr(el.dataset[key])));
  });
  $$('[data-lang-href]').forEach((el) => {
    el.href = el.dataset.langHref.replace('{lang}', lang);
  });
  $$('[data-screen]').forEach((el) => {
    el.src = screenSrc(el.dataset.screen);
  });
  $$('.lang button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  renderStores();
  renderNavigation();
  renderDemo();
  renderFeatures();
  renderScreens();
  renderCards();
  renderStats();
  renderCountdown();
  fitQuiz();
  renderQuiz();
  placeRail();
}

function setupLanguage() {
  TARGETS.forEach(([key, attr, , read]) => {
    $$(`[${attr}]`).forEach((el) => {
      I18N.fr[el.dataset[key]] ??= read(el);
    });
  });
  $$('.lang button').forEach((button) =>
    button.addEventListener('click', () => {
      storage.set('rl-lang', button.dataset.lang);
      applyLanguage(button.dataset.lang);
    }),
  );
}

function setupTilt() {
  if (REDUCED || !matchMedia('(hover: hover)').matches) {
    return;
  }
  $('.features').addEventListener('pointermove', (event) => {
    const el = event.target.closest('.feature');
    if (!el) {
      return;
    }
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  });
  $('.features').addEventListener(
    'pointerout',
    (event) => {
      const el = event.target.closest('.feature');
      if (el && !el.contains(event.relatedTarget)) {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      }
    },
  );
}

setupRoads();
setupLanguage();
setupNavigation();
setupDemo();
setupScreens();
applyLanguage(pickLanguage());
$$('.reveal:not(.feature)').forEach((el) => watch(el, () => el.classList.add('in')));
watch($('.features'), () => {
  featuresShown = true;
  $$('.feature').forEach((el) => el.classList.add('in'));
});
setupStats();
setupCountdown();
setupTilt();
checkPending();
addEventListener('resize', fitQuiz, { passive: true });
if (document.fonts) {
  document.fonts.ready.then(fitQuiz);
}
addEventListener('load', fitQuiz);
