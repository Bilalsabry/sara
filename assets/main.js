/* ============================================================================
   main.js — behaviour: rendering, chapter routing, overlays, accessibility.

   NOTE ON COPY: every string rendered here comes from content.js, which mirrors
   the approved COPY.md. Never inline new prose in this file — add it to
   COPY.md first, then content.js. See the header of content.js.
   ========================================================================== */

import {
  IMAGES, ARCHIVE, COVER, INDEX, LETTER, ARCHIVE_TEXT, MAP_CORNER, MAP_PLACES,
  STARS, FIREHEART, LIBRARY, MARGINALIA, SOUNDTRACK, LITTLE_THINGS, NOTES,
  EPILOGUE, FOOTER, PAGE_ORDER, PAGE_META, AUDIO,
} from './content.js';

import {
  seeded, TEAR_VERTICAL, TEAR_HORIZONTAL, tearFibres,
  stagSVG, stagMarkSVG, pressedStemSVG, graphiteSprigSVG,
  paintFireheart, paintConstellation, paintMapCard, paintConstellationCard,
  paintLetterCard, icon, MARKS, sealSVG, castleSVG, mapGroundSVG,
} from './art.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mark that JS is running. Until this lands, everything renders visible —
   a blocked CDN must never leave the reader with a blank page. */
document.documentElement.classList.add('js-ready');

const ORN_LG = `<div class="orn" aria-hidden="true"><i></i><svg width="26" height="9" viewBox="0 0 26 9" fill="none" stroke="currentColor" stroke-width=".9"><path d="M13 1.2 L15.6 4.5 L13 7.8 L10.4 4.5 Z"/><path d="M4 4.5 L9.6 4.5 M16.4 4.5 L22 4.5"/><circle cx="2" cy="4.5" r="1"/><circle cx="24" cy="4.5" r="1"/></svg><i></i></div>`;
const ORN_SM = `<div class="orn" aria-hidden="true"><i></i><svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor"><path d="M4.5 0 L5.6 3.4 L9 4.5 L5.6 5.6 L4.5 9 L3.4 5.6 L0 4.5 L3.4 3.4 Z"/></svg><i></i></div>`;
const STAR_SM = `<svg width="14" height="14" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true"><path d="M7.5 0 L9 6 L15 7.5 L9 9 L7.5 15 L6 9 L0 7.5 L6 6 Z"/></svg>`;

/* ── PLACEHOLDER FRAMES ──────────────────────────────────────────────────
   One renderer for every image slot. `src: null` yields a proofing frame;
   supplying a src swaps in the photograph at identical dimensions, so the
   layout never shifts. */
function frame(img, { lazy = true, className = '' } = {}) {
  const ratio = img.ratio ? `aspect-ratio:${img.ratio};` : 'height:100%;';
  if (img.src) {
    return `<div class="frame ${className}" style="${ratio}">
      <img src="${img.src}" alt="${img.alt || ''}"
        ${lazy ? 'loading="lazy" decoding="async"' : ''}
        style="object-fit:${img.fit || 'cover'};object-position:${img.focal || '50% 50%'}">
    </div>`;
  }
  return `<div class="frame frame--empty ${className}" style="${ratio}">
    <span class="frame__label">${img.label || 'ADD PHOTO'}</span>
  </div>`;
}

/* ── TEAR MASKS ──────────────────────────────────────────────────────────── */
function injectTearDefs() {
  const rnd = seeded(7331);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute';
  svg.innerHTML = `
    <defs>
      <clipPath id="tear-clip" clipPathUnits="objectBoundingBox">
        <path d="${TEAR_VERTICAL}"/>
      </clipPath>
      <clipPath id="tear-clip-h" clipPathUnits="objectBoundingBox">
        <path d="${TEAR_HORIZONTAL}"/>
      </clipPath>
      <path id="tear-fibres" d="${tearFibres(rnd)}"/>
    </defs>`;
  document.body.appendChild(svg);
}

/* ══════════════════════════════════════════════════════════════════════════
   COVER
   ══════════════════════════════════════════════════════════════════════════ */
function renderCover() {
  $('#cover-mark').innerHTML = stagSVG({ size: 112, stroke: 'currentColor', width: 1 });
  $('#cover-stem').innerHTML = pressedStemSVG();
  $('#cover-sprig').innerHTML = graphiteSprigSVG();

  $('#cover-title-top').textContent    = COVER.titleTop;
  $('#cover-title-bottom').textContent = COVER.titleBottom;
  $('#cover-orn').innerHTML   = ORN_LG;
  $('#cover-blurb').innerHTML = COVER.blurb.join('<br>');
  $('#cover-cta').innerHTML   = `<span>${COVER.cta}</span>`;
  $('#cover-star').innerHTML  = STAR_SM;

  $('#cover-photo').innerHTML    = frame(IMAGES.coverPortrait, { lazy: false });
  $('#cover-note').innerHTML     = `<span class="hand">${COVER.quoteCard.join('<br>')}</span>`;
  $('#cover-frame').innerHTML    = `<div class="cover__frame-inner">${stagMarkSVG({ size: 54, width: 1.4 })}</div>`;
  $('#cover-snapshot').innerHTML = frame(IMAGES.coverSnapshot);
}

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTER INDEX
   ══════════════════════════════════════════════════════════════════════════ */
const CARD_PAINTERS = { map: paintMapCard, constellation: paintConstellationCard, letter: paintLetterCard };

function renderContents() {
  const wrap = $('#contents');
  wrap.innerHTML = INDEX.map(c => `
    <button class="chapter-link anim-in" data-open="${c.key}"
            aria-label="Open chapter ${c.folio}, ${c.title}">
      <span class="folio chapter-link__folio">${c.folio}.</span>
      <span class="chapter-link__body">
        <span class="chapter-link__title">${c.title}</span>
        <span class="chapter-link__rule" aria-hidden="true"></span>
        <span class="chapter-link__blurb">${c.blurb}</span>
      </span>
      <span class="chapter-link__art" aria-hidden="true">${
        CARD_PAINTERS[c.key] || c.key === 'fireheart'
          ? `<canvas class="card-art" data-art="${c.key}" width="460" height="420"></canvas>`
          : archiveCardArt()
      }</span>
      <span class="chapter-link__cue">${c.link} <i aria-hidden="true"></i></span>
    </button>`).join('');

  $$('.card-art', wrap).forEach(c => {
    const kind = c.dataset.art;
    if (kind === 'fireheart') paintFireheart(c, { compact: true });
    else CARD_PAINTERS[kind]?.(c);
  });
}

/* The archive card is layered paper rather than canvas, so the placeholders
   on it read as physical prints. */
function archiveCardArt() {
  return `<span class="a-arch" style="position:relative;display:block;width:100%;height:100%">
    <span style="position:absolute;left:4%;top:8%;width:52%;aspect-ratio:3/4;background:var(--paper);padding:.28rem;box-shadow:var(--shadow-paper);transform:rotate(-4deg);display:block">
      <span style="display:block;width:100%;height:100%;background:var(--paper-edge)"></span></span>
    <span style="position:absolute;right:6%;top:26%;width:44%;aspect-ratio:1/1;background:var(--paper);padding:.28rem;box-shadow:var(--shadow-paper);transform:rotate(5deg);display:block">
      <span style="display:block;width:100%;height:100%;background:var(--paper-edge)"></span></span>
    <span style="position:absolute;left:20%;bottom:4%;width:46%;aspect-ratio:4/3;background:var(--paper);padding:.28rem;box-shadow:var(--shadow-paper);transform:rotate(-2deg);display:block">
      <span style="display:block;width:100%;height:100%;background:var(--paper-edge)"></span></span>
  </span>`;
}

function renderColophon() {
  $('#colophon-lines').innerHTML = FOOTER.lines.join('<br>');
  $('#colophon-sig').textContent = FOOTER.signature;
  $('#colophon-credit').innerHTML =
    `${AUDIO.attribution} — <a href="${AUDIO.attributionHref}" target="_blank" rel="noopener">bensound.com</a>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTER PAGES
   ══════════════════════════════════════════════════════════════════════════ */
const PAGES = {
  letter: () => `
    <div class="letter">
      <div class="letter__col prose">
        <div class="letter__folio" aria-hidden="true">${LETTER.folioDate.map(d => `<span>${d}</span>`).join('')}</div>
        ${LETTER.paragraphs.map(p => `<p>${p}</p>`).join('')}
        <div class="letter__sign">
          ${LETTER.signOff.map(s => `<span>${s}</span>`).join('')}
          <span class="letter__initial">${LETTER.initial}</span>
        </div>
      </div>
      <div class="letter__plate">
        ${frame(IMAGES.letterPlate)}
        <div class="letter__seal" aria-hidden="true">${sealSVG(66)}</div>
        <div class="letter__note"><span class="hand">${LETTER.tapedNote.join('<br>')}</span></div>
      </div>
    </div>`,

  archive: () => `
    <div class="archive">
      <div class="archive__feature">
        ${plate(ARCHIVE[0], 0)}
        <div class="archive__caption">
          <em>${ARCHIVE_TEXT.caption}</em>
          <span class="hand">${ARCHIVE_TEXT.captionAction}</span>
        </div>
      </div>
      <div class="archive__details">
        <div class="archive__note"><span class="hand">${ARCHIVE_TEXT.marginNote.join('<br>')}</span></div>
        ${ARCHIVE.slice(1).map((a, i) => plate(a, i + 1)).join('')}
      </div>
    </div>
    <div class="archive__add">
      <button id="archive-add" type="button">${ARCHIVE_TEXT.addAction}</button>
      <input type="file" id="archive-input" accept="image/*" multiple hidden>
    </div>
    <div class="archive__extra" id="archive-extra"></div>`,

  map: () => `
    <svg class="map__svg" viewBox="0 0 1000 520" fill="none" role="group" aria-label="A map of our places">
      ${mapGroundSVG()}
      ${MAP_PLACES.map(p => `
        <g class="map-pin" data-place="${p.key}" role="button" tabindex="0"
           aria-pressed="false" aria-label="${p.label}">
          <circle class="map-pin__hit" cx="${p.x}" cy="${p.y}" r="26"/>
          <circle class="map-pin__halo" cx="${p.x}" cy="${p.y}" r="13"/>
          <circle class="map-pin__dot" cx="${p.x}" cy="${p.y}" r="3.4"/>
          <text class="map-pin__label" x="${p.labelX}" y="${p.labelY}">${p.label}</text>
          <text class="map-pin__sub" x="${p.labelX + 2}" y="${p.labelY + 19}">${p.sub}</text>
        </g>`).join('')}
    </svg>
    <div class="map__foot">
      <span class="hand map__corner">${MAP_CORNER.join('<br>')}</span>
      <div class="map__read" id="map-read" aria-live="polite">
        <p class="map__read--idle">Click a place to revisit the memory</p>
      </div>
    </div>`,

  constellation: () => `
    <div class="constellation">
      <div class="constellation__stage">
        <div class="constellation__field">
          <canvas id="constellation-canvas" width="900" height="640"></canvas>
          <svg class="constellation__svg" viewBox="0 0 900 640" role="group" aria-label="Her constellation">
            ${STARS.map(s => `
              <g class="star" data-star="${s.key}" role="button" tabindex="0"
                 aria-pressed="false" aria-label="${s.name}">
                <circle class="star__hit" cx="${s.x}" cy="${s.y}" r="30"/>
                <circle class="star__ring" cx="${s.x}" cy="${s.y}" r="12"/>
                <circle class="star__dot" cx="${s.x}" cy="${s.y}" r="3.4"/>
                <text class="star__name" x="${s.x}" y="${s.y < 300 ? s.y - 26 : s.y + 34}"
                      text-anchor="middle">${s.name}</text>
              </g>`).join('')}
          </svg>
        </div>
        <div class="constellation__card">
          <h3 id="star-name">${STARS[5].name}</h3>
          <p id="star-body" aria-live="polite">${STARS[5].body}</p>
        </div>
      </div>
      <p class="constellation__hint">Click a star</p>
    </div>`,

  fireheart: () => `
    <div class="fireheart">
      <div class="fireheart__text prose">
        ${FIREHEART.paragraphs.map(p =>
          `<p${p.emphasis ? ' class="is-emphasis"' : ''}>${p.text}</p>`).join('')}
        <div class="fireheart__quiet">
          <span class="hand">${FIREHEART.handwritten.join('<br>')}</span>
        </div>
        <div class="fireheart__mark" aria-hidden="true">${stagMarkSVG({ size: 54, width: 1.2 })}</div>
      </div>
      <div class="fireheart__art">
        <canvas id="fireheart-canvas" width="900" height="1100"></canvas>
        <div class="fireheart__crest" aria-hidden="true">
          <svg width="34" height="40" viewBox="0 0 34 40" fill="none" stroke="currentColor" stroke-width=".9">
            <path d="M4 12 l5 5 l6 -9 l6 9 l5 -5 v13 H4 z"/>
            <circle cx="4" cy="10" r="1.4"/><circle cx="30" cy="10" r="1.4"/><circle cx="17" cy="5" r="1.4"/>
            <path d="M8 29 h18 M11 33 h12"/></svg>
        </div>
        <div class="fireheart__note"><span class="hand">${FIREHEART.sideNote.join('<br>')}</span></div>
      </div>
    </div>`,

  library: () => `
    <div class="library">
      <div class="library__shelf">
        ${LIBRARY.books.map((b, i) => `
          <div class="book" style="background:${b.spine};height:${200 + ((i * 37) % 22)}px">
            <span class="book__mark" aria-hidden="true">${STAR_SM}</span>
            <span class="book__title">${b.title}</span>
            <span class="book__author">${LIBRARY.author}</span>
          </div>`).join('')}
      </div>
      <div class="library__plank" aria-hidden="true"></div>
      <div class="library__foot"><span class="hand">${LIBRARY.footer}</span></div>
    </div>`,

  marginalia: () => `
    <div class="cards">
      ${MARGINALIA.quotes.map(q => `
        <blockquote class="card">
          <p class="card__quote">${q.lines.join('<br>')}</p>
          <cite class="card__attr">— ${q.attribution}</cite>
          <span class="card__icon" aria-hidden="true">${MARKS[q.icon] || ''}</span>
        </blockquote>`).join('')}
    </div>
    <div class="cards__foot"><span class="hand">${MARGINALIA.footer}</span></div>`,

  soundtrack: () => `
    <div class="soundtrack">
      <div>
        <div class="soundtrack__card">
          <ol class="soundtrack__list">
            ${SOUNDTRACK.songs.map(s => `<li>${s}</li>`).join('')}
          </ol>
          <span class="soundtrack__more">${SOUNDTRACK.more}</span>
        </div>
      </div>
      <div class="soundtrack__art">
        <svg width="200" height="200" viewBox="0 0 180 180" fill="none" aria-hidden="true">
          <circle cx="90" cy="90" r="86" fill="#141310"/>
          <g stroke="rgba(243,238,228,.07)" stroke-width=".8">
            <circle cx="90" cy="90" r="78"/><circle cx="90" cy="90" r="70"/><circle cx="90" cy="90" r="62"/>
            <circle cx="90" cy="90" r="54"/><circle cx="90" cy="90" r="46"/><circle cx="90" cy="90" r="38"/></g>
          <circle cx="90" cy="90" r="30" fill="#856A3C"/>
          <circle cx="90" cy="90" r="30" fill="url(#discLight)"/>
          <circle cx="90" cy="90" r="4" fill="#141310"/>
          <defs><radialGradient id="discLight" cx=".35" cy=".3" r=".85">
            <stop offset="0" stop-color="rgba(255,236,196,.5)"/>
            <stop offset="1" stop-color="rgba(48,36,14,.4)"/></radialGradient></defs>
        </svg>
        <div class="soundtrack__note"><span class="hand">${SOUNDTRACK.sideNote.join('<br>')}</span></div>
      </div>
    </div>`,

  little: () => `
    <div class="little">
      ${LITTLE_THINGS.map(t => `
        <div class="little__cell">
          <span aria-hidden="true">${icon(t.icon)}</span>
          <p>${t.text}</p>
        </div>`).join('')}
    </div>`,

  notes: () => `
    <div class="cards">
      ${NOTES.cards.map(c => `
        <div class="card">
          <p class="card__hand">${c.lines.join('<br>')}</p>
          <span class="card__icon" aria-hidden="true">${MARKS[c.icon] || ''}</span>
        </div>`).join('')}
    </div>
    <div class="cards__foot"><p>${NOTES.footer.join('<br>')}</p></div>`,

  epilogue: () => `
    <div class="epilogue">
      <div class="epilogue__text">
        ${EPILOGUE.paragraphs.map(p => `<p>${p.join('<br>')}</p>`).join('')}
        <div class="epilogue__sign">
          <span>${EPILOGUE.signOff}</span>
          <span class="epilogue__initial">${EPILOGUE.initial}</span>
        </div>
        <span class="epilogue__date">${EPILOGUE.date}</span>
        <div><button class="epilogue__restart" id="epilogue-restart" type="button">${EPILOGUE.restart}</button></div>
      </div>
      <div class="epilogue__art">
        ${castleSVG()}
        <div class="epilogue__note"><span class="hand">${EPILOGUE.cornerNote.join('<br>')}</span></div>
      </div>
    </div>`,
};

function plate(item, index) {
  return `<figure class="plate" data-plate="${index}" role="button" tabindex="0"
      aria-label="View ${item.title}">
    ${frame(item)}
    <figcaption class="plate__meta">
      <span class="folio">${roman(index + 1)}</span>
      <span>${item.note}</span>
    </figcaption>
  </figure>`;
}
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const roman = n => ROMAN[(n - 1) % 12];

/* ══════════════════════════════════════════════════════════════════════════
   READER OVERLAY
   ══════════════════════════════════════════════════════════════════════════ */
const reader = $('#reader');
let currentPage = null;
let lastTrigger = null;

function openPage(key, trigger) {
  const meta = PAGE_META[key];
  const build = PAGES[key];
  if (!meta || !build) return;

  currentPage = key;
  lastTrigger = trigger || document.activeElement;

  $('#reader-label').textContent = meta.title;
  $('#reader-head').innerHTML =
    `<span class="folio">${meta.folio}</span><h2 class="title">${meta.title}</h2>${ORN_LG}`;
  $('#reader-body').innerHTML = build();

  const i = PAGE_ORDER.indexOf(key);
  $('#reader-prev').disabled = i <= 0;
  $('#reader-next').disabled = i >= PAGE_ORDER.length - 1;

  /* Opaque before content animates — the index must never show through. */
  reader.dataset.open = 'true';
  reader.scrollTop = 0;
  lockBackground(true);

  if (!REDUCED && window.gsap) {
    gsap.fromTo('#reader-head, #reader-body > *',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: .62, stagger: .06, delay: .04, ease: 'power3.out' });
  }

  hydrate(key);
  $('#reader-back').focus();
  history.replaceState(null, '', '#' + key);
}

function closePage() {
  const finish = () => {
    reader.dataset.open = 'false';
    reader.innerHTML === '' || null;
    lockBackground(false);
    currentPage = null;
    lastTrigger?.focus();
    history.replaceState(null, '', location.pathname);
  };
  if (REDUCED || !window.gsap) return finish();
  gsap.to('#reader-head, #reader-body > *',
    { opacity: 0, y: -8, duration: .26, ease: 'power2.in', onComplete: finish });
}

/* Background is inert while the overlay is open: no tab-through, no scroll. */
function lockBackground(on) {
  document.body.style.overflow = on ? 'hidden' : '';
  ['#cover', '#contents', '#colophon'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
    else    { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
  });
  if (window.lenis) on ? lenis.stop() : lenis.start();
}

/* ── PER-PAGE WIRING ─────────────────────────────────────────────────────── */
function hydrate(key) {
  if (key === 'map') {
    const read = $('#map-read');
    const select = pin => {
      $$('.map-pin').forEach(p => p.setAttribute('aria-pressed', 'false'));
      pin.setAttribute('aria-pressed', 'true');
      const place = MAP_PLACES.find(p => p.key === pin.dataset.place);
      read.innerHTML = `<h3>${place.label}</h3><p>${place.body}</p>`;
      if (!REDUCED && window.gsap) {
        gsap.fromTo(read, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' });
      }
    };
    $$('.map-pin').forEach(pin => {
      pin.addEventListener('click', () => select(pin));
      pin.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(pin); }
      });
    });
  }

  if (key === 'constellation') {
    paintConstellation($('#constellation-canvas'), STARS);
    const select = node => {
      $$('.star').forEach(s => s.setAttribute('aria-pressed', 'false'));
      node.setAttribute('aria-pressed', 'true');
      const star = STARS.find(s => s.key === node.dataset.star);
      $('#star-name').textContent = star.name;
      $('#star-body').textContent = star.body;
      if (!REDUCED && window.gsap) {
        gsap.fromTo('.constellation__card',
          { opacity: .4, y: 6 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
      }
    };
    $$('.star').forEach(node => {
      node.addEventListener('click', () => select(node));
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(node); }
      });
    });
  }

  if (key === 'fireheart') paintFireheart($('#fireheart-canvas'));

  if (key === 'archive') wireArchive();

  if (key === 'epilogue') {
    $('#epilogue-restart').addEventListener('click', () => {
      closePage();
      setTimeout(() => {
        if (window.lenis) lenis.scrollTo(0, { duration: REDUCED ? 0 : 1.2 });
        else window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      }, 320);
    });
  }
}

/* ── ARCHIVE + LIGHTBOX ──────────────────────────────────────────────────── */
let gallery = [];

function wireArchive() {
  gallery = [...ARCHIVE];
  const openAt = i => openLightbox(i);
  $$('.plate').forEach(el => {
    const i = +el.dataset.plate;
    el.addEventListener('click', () => openAt(i));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
    });
  });

  const input = $('#archive-input');
  $('#archive-add').addEventListener('click', () => input.click());
  input.addEventListener('change', function () {
    const extra = $('#archive-extra');
    [...this.files].forEach(file => {
      const url = URL.createObjectURL(file);
      const item = {
        id: `archive-added-${gallery.length + 1}`,
        src: url, alt: '', label: 'ADD PHOTO',
        ratio: '4 / 5', focal: '50% 50%',
        title: 'Untitled', year: '', medium: '',
        note: 'Add the place and the date.',
      };
      gallery.push(item);
      const i = gallery.length - 1;
      const fig = document.createElement('figure');
      fig.className = 'plate';
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', 'View added photograph');
      fig.innerHTML = `${frame(item)}
        <figcaption class="plate__meta">
          <span class="folio">${roman(i + 1)}</span><span>${item.note}</span>
        </figcaption>`;
      fig.addEventListener('click', () => openLightbox(i));
      fig.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
      extra.appendChild(fig);
      if (!REDUCED && window.gsap) {
        gsap.fromTo(fig, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
      }
    });
    this.value = '';
  });
}

const lightbox = $('#lightbox');
let lbIndex = 0, lbTrigger = null;

function openLightbox(i) {
  if (!gallery.length) return;
  lbIndex = i;
  lbTrigger = document.activeElement;
  paintLightbox();
  lightbox.dataset.open = 'true';
  $('#lightbox-close').focus();
}
function paintLightbox() {
  const item = gallery[lbIndex];
  $('#lightbox-stage').innerHTML = frame(item, { lazy: false });
  const meta = [item.year, item.medium].filter(Boolean).join(' · ');
  $('#lightbox-meta').innerHTML =
    `<h3>${item.title}</h3>${meta ? `<div class="dl">${meta}</div>` : ''}<p>${item.note}</p>`;
  $('#lightbox-prev').disabled = lbIndex <= 0;
  $('#lightbox-next').disabled = lbIndex >= gallery.length - 1;
}
function closeLightbox() {
  lightbox.dataset.open = 'false';
  lbTrigger?.focus();
}
$('#lightbox-close').addEventListener('click', closeLightbox);
$('#lightbox-prev').addEventListener('click', () => { if (lbIndex > 0) { lbIndex--; paintLightbox(); } });
$('#lightbox-next').addEventListener('click', () => { if (lbIndex < gallery.length - 1) { lbIndex++; paintLightbox(); } });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

/* ══════════════════════════════════════════════════════════════════════════
   GLOBAL EVENTS
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-open]');
  if (t) openPage(t.dataset.open, t);
});
$('#reader-back').addEventListener('click', closePage);
$('#reader-prev').addEventListener('click', () => {
  const i = PAGE_ORDER.indexOf(currentPage);
  if (i > 0) openPage(PAGE_ORDER[i - 1], lastTrigger);
});
$('#reader-next').addEventListener('click', () => {
  const i = PAGE_ORDER.indexOf(currentPage);
  if (i < PAGE_ORDER.length - 1) openPage(PAGE_ORDER[i + 1], lastTrigger);
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (lightbox.dataset.open === 'true') closeLightbox();
  else if (currentPage) closePage();
});

/* Focus trap for the two modal surfaces. */
function trap(container) {
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || container.dataset.open !== 'true') return;
    const f = $$('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
trap(reader); trap(lightbox);

/* Lenis binds wheel/touch on window. Stopping those events inside the
   overlays keeps native scrolling working within them. Do not remove — this
   is what makes chapter pages scrollable. */
[reader, lightbox].forEach(el => {
  ['wheel', 'touchmove', 'touchstart'].forEach(evt =>
    el.addEventListener(evt, e => e.stopPropagation(), { passive: true }));
});

/* ── SOUND — never autoplays ─────────────────────────────────────────────── */
const audio = new Audio(AUDIO.src);
audio.loop = true; audio.volume = 0; audio.preload = 'none';
let soundOn = false;
const soundBtn = $('#sound');
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  $('#sound-label').textContent = soundOn ? 'Soundtrack: playing' : 'Soundtrack: paused';
  if (soundOn) {
    audio.play().catch(() => {});
    window.gsap ? gsap.to(audio, { volume: .26, duration: REDUCED ? 0 : 2.2 }) : (audio.volume = .26);
  } else if (window.gsap) {
    gsap.to(audio, { volume: 0, duration: REDUCED ? 0 : 1, onComplete: () => audio.pause() });
  } else { audio.pause(); }
});

/* ══════════════════════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════════════════════ */
injectTearDefs();
renderCover();
renderContents();
renderColophon();

$('#cover-cta').addEventListener('click', () => {
  const target = $('#contents');
  if (window.lenis) lenis.scrollTo(target, { offset: -12, duration: REDUCED ? 0 : 1.4 });
  else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
});

/* Smooth scroll + reveals, only once the libraries are present. */
if (window.Lenis && !REDUCED) {
  window.lenis = new Lenis({ lerp: .08, smoothWheel: true });
  if (window.gsap) {
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (!REDUCED) {
    gsap.to('#cover-mark',   { opacity: 1, duration: 1.3, delay: .25, ease: 'power2.out' });
    gsap.to('#cover-title',  { opacity: 1, y: 0, duration: 1.1, delay: .55, ease: 'power3.out' });
    gsap.to('#cover-orn',    { opacity: 1, duration: .9, delay: .95 });
    gsap.to('#cover-blurb',  { opacity: 1, y: 0, duration: .95, delay: 1.05, ease: 'power3.out' });
    gsap.to('#cover-cta',    { opacity: 1, y: 0, duration: .85, delay: 1.3, ease: 'power3.out' });
    gsap.to('#cover-star',   { opacity: 1, duration: .8, delay: 1.55 });
    gsap.to('#cover-aside',  { opacity: 1, duration: 1.4, delay: .7 });

    gsap.fromTo('.chapter-link',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: .85, stagger: .07, ease: 'power3.out',
        scrollTrigger: { trigger: '#contents', start: 'top 88%', once: true } });
    gsap.fromTo('#colophon',
      { opacity: 0 },
      { opacity: 1, duration: 1,
        scrollTrigger: { trigger: '#colophon', start: 'top 94%', once: true } });
  }
} else {
  /* No animation library: reveal everything immediately. */
  revealAll();
}

/* Watchdog. requestAnimationFrame is paused while a tab is backgrounded, so a
   reveal that begins just as the reader switches away can freeze part-way and
   never resume. Nothing may stay invisible: force any stalled element open. */
function revealAll() {
  $$('.anim-in').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
function sweepStalled() {
  $$('.anim-in').forEach(el => {
    if (parseFloat(getComputedStyle(el).opacity) < 1) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') setTimeout(sweepStalled, 1400);
});
setTimeout(sweepStalled, 6000);

/* Deep link straight into a chapter. */
const hash = location.hash.replace('#', '');
if (hash && PAGES[hash]) setTimeout(() => openPage(hash, null), 320);
