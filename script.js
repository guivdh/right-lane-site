const STORES = {
  android: 'https://play.google.com/store/apps/details?id=be.codevelo.app',
  ios: null,
};

document.documentElement.classList.remove('no-js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupStores() {
  document.querySelectorAll('[data-store]').forEach((link) => {
    const url = STORES[link.dataset.store];
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      return;
    }
    link.classList.add('soon');
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    const label = link.querySelector('span');
    const tag = document.createElement('span');
    tag.className = 'soon-tag';
    tag.textContent = 'bientôt';
    label.append(tag);
  });
}

function setupHeader() {
  const header = document.querySelector('.top');
  const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((item) => observer.observe(item));
}

function setupLane() {
  const bike = document.querySelector('.lane-bike');
  if (reducedMotion) {
    return;
  }
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bike.style.transform = `translateY(${72 + progress * (window.innerHeight - 110)}px) rotate(90deg)`;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update);
}

function setupQuiz() {
  const cards = [...document.querySelectorAll('.qcard')];
  const scoreValue = document.querySelector('.score-value');
  const end = document.querySelector('.quiz-end');
  const endTitle = document.querySelector('.quiz-end-title');
  const endMascot = document.querySelector('.quiz-mascot');
  let answered = 0;
  let score = 0;

  const finish = () => {
    const titles = [
      [5, 'Sans faute ! Tu connais ton code.'],
      [3, 'Pas mal du tout !'],
      [0, 'Il y a des surprises, hein ?'],
    ];
    endTitle.textContent = `${score} sur ${cards.length}. ${titles.find(([min]) => score >= min)[1]}`;
    endMascot.src = score >= 3 ? 'img/mascot/well-done.webp' : 'img/mascot/offline.webp';
    end.hidden = false;
  };

  cards.forEach((card, index) => {
    const buttons = card.querySelectorAll('[data-choice]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const right = button.dataset.choice === card.dataset.answer;
        buttons.forEach((b) => {
          b.disabled = true;
        });
        button.classList.add('picked');
        card.classList.add(right ? 'right' : 'wrong');
        const result = card.querySelector('.qresult');
        const truth = card.dataset.answer === 'true' ? 'vrai' : 'faux';
        result.querySelector('.verdict').textContent = right ? `Bien vu, c'est ${truth} !` : `Eh non, c'est ${truth}.`;
        result.hidden = false;
        answered += 1;
        if (right) {
          confetti(button);
          score += 1;
          scoreValue.textContent = score;
          scoreValue.classList.add('bump');
          setTimeout(() => scoreValue.classList.remove('bump'), 200);
        }
        const next = cards[index + 1];
        if (next && !next.classList.contains('right') && !next.classList.contains('wrong')) {
          setTimeout(() => {
            const list = card.parentElement;
            if (list.scrollWidth > list.clientWidth) {
              list.scrollTo({ left: next.offsetLeft - list.offsetLeft - 16, behavior: reducedMotion ? 'auto' : 'smooth' });
            }
          }, 1400);
        }
        if (answered === cards.length) {
          finish();
        }
      });
    });
  });
}

function confetti(origin) {
  if (reducedMotion) {
    return;
  }
  const box = origin.getBoundingClientRect();
  const colors = ['#f4c542', '#b5432f', '#8bcb98', '#f2f0ea', '#2f5fa7'];
  for (let i = 0; i < 26; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.background = colors[i % colors.length];
    document.body.append(piece);
    const angle = Math.random() * Math.PI - Math.PI;
    const distance = 70 + Math.random() * 110;
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    piece
      .animate(
        [
          { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 1 },
          {
            transform: `translate(${x + Math.cos(angle) * distance}px, ${y + Math.sin(angle) * distance + 120}px) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
      )
      .finished.then(() => piece.remove());
  }
}

function setupStickers() {
  if (reducedMotion) {
    return;
  }
  const hover = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.sticker, .sign-float').forEach((sticker) => {
    sticker.addEventListener('click', () => {
      sticker.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.2, 0.85) rotate(-8deg)', offset: 0.3 },
          { transform: 'scale(0.9, 1.15) rotate(6deg) translateY(-18px)', offset: 0.55 },
          { transform: 'scale(1) rotate(0deg)' },
        ],
        { duration: 700, easing: 'cubic-bezier(0.3, 1.6, 0.4, 1)' },
      );
    });
    if (hover) {
      sticker.addEventListener('mouseenter', () => {
        sticker.animate(
          [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(-6deg) scale(1.06)' },
            { transform: 'rotate(6deg) scale(1.06)' },
            { transform: 'rotate(0deg)' },
          ],
          { duration: 500, easing: 'ease-in-out' },
        );
      });
    }
  });
}

function setupTilt() {
  if (reducedMotion || !window.matchMedia('(hover: hover)').matches) {
    return;
  }
  document.querySelectorAll('.hero-visual, .step').forEach((zone) => {
    const phone = zone.querySelector('.phone');
    zone.addEventListener('mousemove', (event) => {
      const box = zone.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      phone.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    zone.addEventListener('mouseleave', () => {
      phone.style.transform = '';
    });
  });
}

setupStores();
setupHeader();
setupReveal();
setupLane();
setupQuiz();
setupStickers();
setupTilt();
