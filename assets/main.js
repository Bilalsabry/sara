/* ============================================================================
   main.js — behaviour: rendering, chapter routing, overlays, accessibility.

   NOTE ON COPY: every string rendered here comes from content.js, which mirrors
   the approved COPY.md. Never inline new prose in this file — add it to
   COPY.md first, then content.js. See the header of content.js.
   ========================================================================== */

import {
  IMAGES, ARCHIVE, COVER, INDEX, LETTER, ARCHIVE_TEXT, MAP_CORNER, MAP_PLACES,
  STARS, FIREHEART, LIBRARY, MARGINALIA, SOUNDTRACK, LITTLE_THINGS, NOTES,
  GAME, BELL, PIGEON, DAYS, AURORA, OPEN_WHEN, BOARD, WISHES, CALENDAR,
  EPILOGUE, FOOTER, PAGE_ORDER, PAGE_META, AUDIO,
} from './content.js';

import {
  seeded, TEAR_VERTICAL, TEAR_HORIZONTAL, tearFibres,
  stagSVG, stagMarkSVG, pressedStemSVG, graphiteSprigSVG,
  paintFireheart, paintConstellation, paintMapCard, paintConstellationCard,
  paintLetterCard, icon, MARKS, sealSVG, castleSVG, mapGroundSVG,
  auroraPainter,
} from './art.js';

import * as board from './board.js';

import { shouldPlayOverture, playOverture } from './overture.js';

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
function frame(img, { lazy = true, className = '', reserve = true } = {}) {
  /* `reserve` holds the slot's dimensions so the page never shifts while an
     image loads. The lightbox opts out: there the photograph should size
     itself, not be stretched to a slot shape it was never cut for. */
  const ratio = reserve
    ? (img.ratio ? `aspect-ratio:${img.ratio};` : 'height:100%;')
    : '';
  if (img.src) {
    /* Every photograph ships as WebP beside its JPEG (see tools/optimize-images.py).
       The <source> is offered first and browsers that don't take it fall through
       to the <img>, so there is nothing to keep in sync by hand. */
    const webp = img.src.replace(/\.(jpe?g|png)$/i, '.webp');
    const alt  = img.alt || '';
    return `<div class="frame ${className}" style="${ratio}">
      <picture>
        ${webp !== img.src ? `<source srcset="${webp}" type="image/webp">` : ''}
        <img src="${img.src}" alt="${alt}"
          ${lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high" decoding="async"'}
          style="object-fit:${img.fit || 'cover'};object-position:${img.focal || '50% 50%'}">
      </picture>
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

  renderRest();
}

/* The seven pages beyond the five numbered chapters. These used to sit in the
   footer at 12px uppercase, where they read as Privacy/Terms rather than as
   half the book. They now follow the chapters as a clearly-labelled second
   tier, named from PAGE_META so no new wording is invented. */
function renderRest() {
  const rest = $('#contents-rest');
  if (!rest) return;
  const keys = ORDER.filter(k => !INDEX.some(c => c.key === k));
  rest.innerHTML = keys.map(k => {
    const m = PAGE_META[k];
    if (!m) return '';
    return `
    <button class="rest-link anim-in" data-open="${k}"
            aria-label="Open ${m.folio}, ${m.title}">
      <span class="rest-link__name">${m.folio}</span>
      <span class="rest-link__sub">${m.title}</span>
      <span class="rest-link__arrow" aria-hidden="true"></span>
    </button>`;
  }).join('');
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
  /* Only rendered when the track's licence actually requires a credit.
     The current track is CC0, so this stays empty. */
  const credit = $('#colophon-credit');
  if (AUDIO.attribution) {
    credit.innerHTML = AUDIO.attributionHref
      ? `${AUDIO.attribution} — <a href="${AUDIO.attributionHref}" target="_blank" rel="noopener">source</a>`
      : AUDIO.attribution;
  } else {
    credit.remove();
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTER PAGES
   ══════════════════════════════════════════════════════════════════════════ */
const PAGES = {
  letter: () => `
    <div class="letter">
      <div class="letter__col prose">
        <div class="letter__folio" aria-hidden="true">${LETTER.folioDate.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="letter__salutation">${LETTER.salutation.map(l => `<p>${l}</p>`).join('')}</div>
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
            ${SOUNDTRACK.songs.map(s => {
              /* Each title opens in Spotify. The recordings are commercial, so
                 they are linked, never hosted here - only the CC0 Satie ships
                 with the site. */
              const q = encodeURIComponent(s.replace(/\u2014/g, ' ').replace(/\s+/g, ' ').trim());
              return `<li><a class="soundtrack__link" href="https://open.spotify.com/search/${q}"
                target="_blank" rel="noopener">${s}</a></li>`;
            }).join('')}
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

  openwhen: () => `
    <div class="drawer">
      <p class="drawer__intro">${OPEN_WHEN.intro}</p>
      <ul class="drawer__letters">
        ${writtenLetters().map(l => `
          <li class="envelope" data-key="${l.key}">
            <div class="envelope__face">
              <span class="envelope__when">Open ${l.when}</span>
              <span class="envelope__seal" aria-hidden="true">${sealSVG(52)}</span>
              <span class="envelope__state" data-state="sealed">${OPEN_WHEN.sealed}</span>
              <button type="button" class="envelope__open">${OPEN_WHEN.openAction}</button>
            </div>
            <div class="envelope__letter" hidden>
              ${l.body.map(para => `<p>${para}</p>`).join('')}
            </div>
          </li>`).join('')}
      </ul>
    </div>`,

  wishes: () => `
    <div class="board" id="wishes">
      <p class="board__intro">${WISHES.intro}</p>
      <div class="board__who" id="wish-who" hidden></div>
      <form class="wish__add" id="wish-add">
        <input id="wish-text" maxlength="240" autocomplete="off"
               placeholder="${WISHES.placeholder}" aria-label="${WISHES.placeholder}">
        <div class="wish__kind" role="radiogroup" aria-label="Kind of wish">
          <button type="button" class="wish__kind-btn" data-kind="have" aria-pressed="true">${WISHES.kindHave}</button>
          <button type="button" class="wish__kind-btn" data-kind="do" aria-pressed="false">${WISHES.kindDo}</button>
        </div>
        <button type="submit" class="board__btn">${WISHES.add}</button>
      </form>
      <div class="board__filters" role="group" aria-label="Show">
        <button type="button" class="board__filter" data-filter="all" aria-pressed="true">${WISHES.filterAll}</button>
        <button type="button" class="board__filter" data-filter="have" aria-pressed="false">${WISHES.filterHave}</button>
        <button type="button" class="board__filter" data-filter="do" aria-pressed="false">${WISHES.filterDo}</button>
      </div>
      <div id="wish-lists" aria-live="polite"></div>
      <p class="board__state" id="wish-state"></p>
    </div>`,

  calendar: () => `
    <div class="board" id="calendar">
      <p class="board__intro">${CALENDAR.intro}</p>
      <div class="board__who" id="cal-who" hidden></div>
      <div class="cal__today" id="cal-today" hidden></div>
      <form class="cal__add" id="cal-add">
        <div class="cal__row">
          <label class="board__label" for="cal-date">${CALENDAR.fieldDate}</label>
          <input type="date" id="cal-date" required>
        </div>
        <div class="cal__row cal__row--wide">
          <label class="board__label" for="cal-what">${CALENDAR.fieldWhat}</label>
          <input id="cal-what" maxlength="160" autocomplete="off" required
                 placeholder="${CALENDAR.placeholderWhat}">
        </div>
        <div class="cal__row cal__row--wide">
          <label class="board__label" for="cal-note">${CALENDAR.fieldNote}</label>
          <textarea id="cal-note" maxlength="600" rows="2"
                    placeholder="${CALENDAR.placeholderNote}"></textarea>
        </div>
        <button type="submit" class="board__btn">${CALENDAR.add}</button>
      </form>
      <div id="cal-list" aria-live="polite"></div>
      <p class="board__state" id="cal-state"></p>
    </div>`,

  wordgame: () => `
    <div class="game">
      <p class="game__rules">${GAME.rules.join('<br>')}</p>

      <div class="game__modes" role="group" aria-label="How are you playing?">
        <button type="button" class="game__mode" id="game-mode-local" aria-pressed="true">${GAME.duel.modeLocal}</button>
        <button type="button" class="game__mode" id="game-mode-away" aria-pressed="false">${GAME.duel.modeAway}</button>
      </div>

      <div id="game-local">
        <div class="game__boards">
          <section class="gboard" aria-labelledby="game-their-title">
            <h3 class="gboard__title" id="game-their-title">${GAME.theirTitle}</h3>
            <p class="gboard__hint">${GAME.theirHint}</p>
            <div class="gboard__secret" id="game-secret-block">
              <label class="gboard__label" for="game-secret">${GAME.secretLabel}</label>
              <form class="gboard__row" id="game-secret-form">
                <input id="game-secret" class="game__input" type="password" inputmode="latin"
                  maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false"
                  aria-describedby="game-secret-hint">
                <button type="submit" class="game__btn">${GAME.secretSet}</button>
              </form>
              <div class="gboard__row gboard__row--locked" hidden>
                <span class="game__masked" aria-hidden="true">\u2022 \u2022 \u2022 \u2022</span>
                <button type="button" class="game__btn game__btn--quiet" id="game-secret-peek">${GAME.secretShow}</button>
                <button type="button" class="game__btn game__btn--quiet" id="game-secret-change">${GAME.secretChange}</button>
              </div>
              <p class="gboard__note" id="game-secret-hint">${GAME.secretHint}</p>
            </div>
            <form class="gboard__row" id="game-their-form">
              <input id="game-their-guess" class="game__input" maxlength="4" autocomplete="off"
                autocapitalize="characters" spellcheck="false" aria-label="Their guess">
              <button type="submit" class="game__btn">${GAME.theirAction}</button>
            </form>
            <ol class="gboard__list" id="game-their-list" aria-live="polite"></ol>
          </section>

          <section class="gboard" aria-labelledby="game-your-title">
            <h3 class="gboard__title" id="game-your-title">${GAME.yourTitle}</h3>
            <p class="gboard__hint">${GAME.yourHint}</p>
            <form class="gboard__row" id="game-your-form">
              <input id="game-your-guess" class="game__input" maxlength="4" autocomplete="off"
                autocapitalize="characters" spellcheck="false" aria-label="Your guess">
              <select id="game-your-score" class="game__select" aria-label="Letters in place">
                <option value="0">0</option><option value="1">1</option>
                <option value="2">2</option><option value="3">3</option>
                <option value="4">4</option>
              </select>
              <button type="submit" class="game__btn">${GAME.yourAction}</button>
            </form>
            <ol class="gboard__list" id="game-your-list" aria-live="polite"></ol>
          </section>
        </div>
        <div class="game__foot">
          <span class="game__msg" id="game-msg" role="status"></span>
          <button type="button" class="game__btn game__btn--quiet" id="game-new">${GAME.newRound}</button>
        </div>
      </div>

      <div id="game-away" hidden>
        <p class="game__rules game__rules--away">${GAME.duel.awayHint}</p>
        <div class="duel__pick" id="duel-pick">
          <span class="gboard__label">${GAME.duel.pick}</span>
          <div class="duel__pick-row">
            <button type="button" class="game__btn" data-role="B">${GAME.duel.iAmB}</button>
            <button type="button" class="game__btn" data-role="S">${GAME.duel.iAmS}</button>
          </div>
        </div>
        <div id="duel-play" hidden>
          <div class="game__boards">
            <section class="gboard" aria-labelledby="duel-their-title">
              <h3 class="gboard__title" id="duel-their-title">${GAME.theirTitle}</h3>
              <p class="gboard__hint">${GAME.duel.theirGuessHint}</p>
              <div class="gboard__secret" id="duel-secret-block">
                <label class="gboard__label" for="duel-secret">${GAME.secretLabel}</label>
                <form class="gboard__row" id="duel-secret-form">
                  <input id="duel-secret" class="game__input" type="password" inputmode="latin"
                    maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false">
                  <button type="submit" class="game__btn">${GAME.secretSet}</button>
                </form>
                <div class="gboard__row gboard__row--locked" hidden>
                  <span class="game__masked" aria-hidden="true">\u2022 \u2022 \u2022 \u2022</span>
                  <button type="button" class="game__btn game__btn--quiet" id="duel-secret-peek">${GAME.secretShow}</button>
                  <button type="button" class="game__btn game__btn--quiet" id="duel-secret-change">${GAME.secretChange}</button>
                </div>
                <p class="gboard__note">${GAME.secretHint}</p>
              </div>
              <ol class="gboard__list" id="duel-their-list" aria-live="polite"></ol>
            </section>

            <section class="gboard" aria-labelledby="duel-your-title">
              <h3 class="gboard__title" id="duel-your-title">${GAME.yourTitle}</h3>
              <p class="gboard__hint">${GAME.duel.yourGuessHint}</p>
              <form class="gboard__row" id="duel-your-form">
                <input id="duel-your-guess" class="game__input" maxlength="4" autocomplete="off"
                  autocapitalize="characters" spellcheck="false" aria-label="Your guess">
                <button type="submit" class="game__btn">${GAME.duel.guessAction}</button>
              </form>
              <ol class="gboard__list" id="duel-your-list" aria-live="polite"></ol>
            </section>
          </div>
          <div class="game__foot">
            <span class="game__msg" id="duel-msg" role="status"></span>
            <span class="duel__conn" id="duel-conn"></span>
            <button type="button" class="game__btn game__btn--quiet" id="duel-switch">${GAME.duel.switchSide}</button>
            <button type="button" class="game__btn game__btn--quiet" id="duel-new">${GAME.newRound}</button>
          </div>
        </div>
      </div>
    </div>`,

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
/* Only letters he has actually written exist. An unwritten one is not an
   empty envelope on the page — it simply is not there yet. */
const writtenLetters = () => OPEN_WHEN.letters.filter(l => l.body && l.body.length);

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const roman = n => ROMAN[(n - 1) % 12];

/* ══════════════════════════════════════════════════════════════════════════
   READER OVERLAY
   ══════════════════════════════════════════════════════════════════════════ */
/* The drawer only joins the book once there is something in it. */
const ORDER = PAGE_ORDER.filter(k => k !== 'openwhen' || writtenLetters().length);

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

  const i = ORDER.indexOf(key);
  $('#reader-prev').disabled = i <= 0;
  $('#reader-next').disabled = i >= ORDER.length - 1;

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
  if (!currentPage) return;
  duelTeardown();

  /* Restore interactivity synchronously. The fade below is cosmetic only —
     if it stalls (backgrounded tab pauses rAF) the page must still be usable,
     so nothing that matters may depend on the tween completing. */
  lockBackground(false);
  currentPage = null;
  history.replaceState(null, '', location.pathname);
  lastTrigger?.focus();

  const hide = () => { reader.dataset.open = 'false'; };
  if (REDUCED || !window.gsap) return hide();

  gsap.to('#reader-head, #reader-body > *',
    { opacity: 0, y: -8, duration: .26, ease: 'power2.in', onComplete: hide });
  setTimeout(hide, 600);   // guard: never leave the overlay stuck open
}

/* Background is inert while the overlay is open: no tab-through, no scroll. */
function lockBackground(on) {
  document.body.style.overflow = on ? 'hidden' : '';
  ['#cover', '.contents-wrap', '#pigeon', '#colophon'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
    else    { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
  });
  if (window.lenis) on ? lenis.stop() : lenis.start();
}

/* ── PER-PAGE WIRING ─────────────────────────────────────────────────────── */
/* The duel holds a live SSE connection, and the shared pages hold a store
   subscription; neither must outlive the page that opened it. */
let duelES = null;
let readerUnsub = null;
function duelTeardown() {
  if (duelES) { duelES.close(); duelES = null; }
  if (readerUnsub) { readerUnsub(); readerUnsub = null; }
}

function hydrate(key) {
  duelTeardown();
  if (key === 'wishes' || key === 'calendar') {
    /* Both pages share a store, a "who is this" and a status line. */
    const WHO = 'kingdom-board-who';
    const getWho = () => { try { return localStorage.getItem(WHO) || ''; } catch (e) { return ''; } };
    const setWho = v => { try { localStorage.setItem(WHO, v); } catch (e) {} };

    const whoBox = $(key === 'wishes' ? '#wish-who' : '#cal-who');
    const stateLine = $(key === 'wishes' ? '#wish-state' : '#cal-state');

    const paintWho = () => {
      const me = getWho();
      whoBox.hidden = false;
      whoBox.innerHTML = me
        ? `<span class="board__mine">${me === 'S' ? BOARD.iAmS : BOARD.iAmB}</span>` +
          `<button type="button" class="board__link" data-who="">${BOARD.changeWho}</button>`
        : `<span>${BOARD.askWho}</span>` +
          `<button type="button" class="board__btn board__btn--quiet" data-who="S">${BOARD.iAmS}</button>` +
          `<button type="button" class="board__btn board__btn--quiet" data-who="B">${BOARD.iAmB}</button>`;
    };
    whoBox.addEventListener('click', e => {
      const btn = e.target.closest('[data-who]');
      if (!btn) return;
      setWho(btn.dataset.who);
      paintWho();
    });
    paintWho();

    const paintState = mode => {
      stateLine.textContent =
        mode === 'live' ? (getWho() === 'B' ? BOARD.liveB : BOARD.live)
        : mode === 'nostore' ? BOARD.noStore
        : mode === 'local' ? BOARD.offline
        : '';
      stateLine.dataset.mode = mode;
    };

    const esc = v => String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    /* ── the wish list ─────────────────────────────────────────────────── */
    if (key === 'wishes') {
      let filter = 'all';
      let kind = 'have';

      const lists = $('#wish-lists');

      const item = w => `
        <li class="wish${w.done ? ' wish--done' : ''}" data-id="${w.id}">
          <button type="button" class="wish__tick" aria-pressed="${!!w.done}"
                  aria-label="${w.done ? WISHES.markUndone : WISHES.markDone}"></button>
          <span class="wish__body">
            <span class="wish__text">${esc(w.text)}</span>
            <span class="wish__meta">${w.kind === 'do' ? WISHES.kindDo : WISHES.kindHave}${
              w.done ? ` \u00b7 ${WISHES.granted} ${new Date(w.done).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''
            }${w.by ? ` \u00b7 ${w.by}` : ''}</span>
          </span>
          <button type="button" class="wish__remove board__link" data-act="remove">${WISHES.remove}</button>
        </li>`;

      const paint = (data, mode) => {
        const all = data.wishes.filter(w => filter === 'all' || w.kind === filter);
        const open = all.filter(w => !w.done);
        const done = all.filter(w => w.done);
        lists.innerHTML =
          `<section class="wish__group">
             <h3 class="board__group-title">${WISHES.openTitle}</h3>
             ${open.length ? `<ul class="wish__list">${open.map(item).join('')}</ul>`
                           : `<p class="board__empty">${WISHES.emptyAll}</p>`}
           </section>` +
          (done.length ? `<section class="wish__group">
             <h3 class="board__group-title">${WISHES.doneTitle}</h3>
             <ul class="wish__list">${done.map(item).join('')}</ul>
             <p class="board__hint">${WISHES.toCalendar}</p>
           </section>` : '');
        paintState(mode);
      };

      $$('.wish__kind-btn').forEach(b => b.addEventListener('click', () => {
        kind = b.dataset.kind;
        $$('.wish__kind-btn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      }));
      $$('.board__filter').forEach(b => b.addEventListener('click', () => {
        filter = b.dataset.filter;
        $$('.board__filter').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        paint(board.snapshot(), board.status());
      }));

      $('#wish-add').addEventListener('submit', e => {
        e.preventDefault();
        const input = $('#wish-text');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        const local = {
          id: 'tmp-' + Date.now().toString(36), text, kind,
          by: getWho(), at: Date.now(), done: null,
        };
        board.change({ op: 'add-wish', text, kind, by: getWho() },
          st => st.wishes.unshift(local));
      });

      lists.addEventListener('click', e => {
        const li = e.target.closest('.wish');
        if (!li) return;
        const id = li.dataset.id;
        if (e.target.closest('[data-act="remove"]')) {
          if (!confirm(WISHES.removeConfirm)) return;
          return board.change({ op: 'remove-wish', id },
            st => { st.wishes = st.wishes.filter(w => w.id !== id); });
        }
        if (e.target.closest('.wish__tick')) {
          return board.change({ op: 'toggle-wish', id }, st => {
            const w = st.wishes.find(x => x.id === id);
            if (w) w.done = w.done ? null : Date.now();
          });
        }
      });

      readerUnsub = board.subscribe(paint);
      board.refresh();
    }

    /* ── the calendar ──────────────────────────────────────────────────── */
    if (key === 'calendar') {
      const list = $('#cal-list');
      const todayBox = $('#cal-today');
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      $('#cal-date').value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const long = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      /* Parsed as local time on purpose: a kept day is the day it says. */
      const parse = iso => {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
      };

      const entry = d => `
        <li class="cal__entry" data-id="${d.id}">
          <div class="cal__date">
            <span class="cal__day">${parse(d.date).getDate()}</span>
            <span class="cal__mon">${parse(d.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
          </div>
          <div class="cal__body">
            <p class="cal__what">${esc(d.title)}</p>
            ${d.note ? `<p class="cal__note">${esc(d.note)}</p>` : ''}
            <span class="cal__meta">${long(parse(d.date))}${d.by ? ` \u00b7 ${d.by}` : ''}</span>
          </div>
          <button type="button" class="board__link" data-act="remove">${CALENDAR.remove}</button>
        </li>`;

      const paint = (data, mode) => {
        const days = [...data.days].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

        /* On this day: same day and month, any earlier year. */
        const md = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const anniversaries = days.filter(d => d.date.slice(5) === md && d.date.slice(0, 4) < String(now.getFullYear()));
        todayBox.hidden = anniversaries.length === 0;
        if (anniversaries.length) {
          todayBox.innerHTML = `<span class="board__label">${CALENDAR.onThisDay}</span>` +
            anniversaries.map(d => {
              const years = now.getFullYear() - Number(d.date.slice(0, 4));
              return `<p class="cal__anniv"><em>${years} ${years === 1 ? 'year' : 'years'} ago</em> \u2014 ${esc(d.title)}</p>`;
            }).join('');
        }

        if (!days.length) {
          list.innerHTML = `<p class="board__empty">${CALENDAR.empty}</p>`;
          return paintState(mode);
        }

        /* Grouped by year, newest first. */
        const years = [...new Set(days.map(d => d.date.slice(0, 4)))];
        list.innerHTML =
          `<p class="board__count">${days.length} ${days.length === 1 ? CALENDAR.countOne : CALENDAR.countMany}</p>` +
          years.map(y => `
            <section class="cal__year">
              <h3 class="board__group-title">${y}</h3>
              <ul class="cal__list">${days.filter(d => d.date.startsWith(y)).map(entry).join('')}</ul>
            </section>`).join('');
        paintState(mode);
      };

      $('#cal-add').addEventListener('submit', e => {
        e.preventDefault();
        const date = $('#cal-date').value;
        const title = $('#cal-what').value.trim();
        const note = $('#cal-note').value.trim();
        if (!date || !title) return;
        $('#cal-what').value = ''; $('#cal-note').value = '';
        const local = {
          id: 'tmp-' + Date.now().toString(36), date, title, note,
          by: getWho(), at: Date.now(),
        };
        board.change({ op: 'add-day', date, title, note, by: getWho() },
          st => st.days.push(local));
      });

      list.addEventListener('click', e => {
        if (!e.target.closest('[data-act="remove"]')) return;
        const li = e.target.closest('.cal__entry');
        if (!li || !confirm(CALENDAR.removeConfirm)) return;
        const id = li.dataset.id;
        board.change({ op: 'remove-day', id },
          st => { st.days = st.days.filter(d => d.id !== id); });
      });

      readerUnsub = board.subscribe(paint);
      board.refresh();
    }
  }

  if (key === 'openwhen') {
    /* A broken seal stays broken, like a real letter. Kept on her device. */
    const KEY = 'kingdom-open-when';
    const read = () => {
      try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []); }
      catch (e) { return new Set(); }
    };
    const opened = read();
    const remember = k => {
      opened.add(k);
      try { localStorage.setItem(KEY, JSON.stringify([...opened])); } catch (e) {}
    };

    const reveal = (li, animate) => {
      const letter = li.querySelector('.envelope__letter');
      const state = li.querySelector('.envelope__state');
      li.classList.add('envelope--open');
      li.querySelector('.envelope__open').hidden = true;
      state.textContent = OPEN_WHEN.opened;
      state.dataset.state = 'opened';
      letter.hidden = false;
      if (animate && !REDUCED && window.gsap) {
        gsap.fromTo(letter, { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: .7, ease: 'power3.out' });
      }
    };

    $$('.envelope').forEach(li => {
      if (opened.has(li.dataset.key)) reveal(li, false);
    });

    $$('.envelope__open').forEach(btn => btn.addEventListener('click', () => {
      const li = btn.closest('.envelope');
      if (!confirm(OPEN_WHEN.confirm)) return;
      remember(li.dataset.key);
      reveal(li, true);
    }));
  }

  if (key === 'wordgame') {
    const KEY = 'kingdom-wordgame-v1';
    let state = { secret: '', theirs: [], yours: [] };
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) { /* storage unavailable - the round just won't survive a refresh */ }
    const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

    const clean = v => v.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const inPlace = (a, b) => [...a].reduce((n, ch, i) => n + (ch === b[i] ? 1 : 0), 0);

    /* The fields show only what a guess can be: letters, upper case. */
    ['game-secret', 'game-their-guess', 'game-your-guess'].forEach(id => {
      const el = $('#' + id);
      el.addEventListener('input', () => {
        const v = clean(el.value);
        if (el.value !== v) el.value = v;
      });
    });

    const msg = $('#game-msg');
    let msgTimer = 0;
    const say = text => {
      msg.textContent = text;
      clearTimeout(msgTimer);
      if (text) msgTimer = setTimeout(() => { msg.textContent = ''; }, 3200);
    };

    const row = (guess, score) => `
      <li class="gboard__entry${score === 4 ? ' gboard__entry--won' : ''}">
        <span class="gboard__tiles">${[...guess].map(c => `<i>${c}</i>`).join('')}</span>
        <span class="gboard__score">${score === 4
          ? GAME.found
          : `<b>${score}</b> ${GAME.inPlace}`}</span>
      </li>`;

    const secretBlock = $('#game-secret-block');
    const paint = () => {
      secretBlock.querySelector('#game-secret-form').hidden = !!state.secret;
      secretBlock.querySelector('.gboard__row--locked').hidden = !state.secret;
      $('#game-their-list').innerHTML = state.theirs.map(e => row(e.g, e.s)).join('');
      $('#game-your-list').innerHTML = state.yours.map(e => row(e.g, e.s)).join('');
    };
    paint();

    $('#game-secret-form').addEventListener('submit', e => {
      e.preventDefault();
      const w = clean($('#game-secret').value);
      if (w.length !== 4) return say(GAME.needFour);
      state.secret = w;
      $('#game-secret').value = '';
      persist(); paint();
    });
    /* Peek only while held - a glance across the table shouldn't spoil it. */
    const peek = $('#game-secret-peek');
    const masked = secretBlock.querySelector('.game__masked');
    const showSecret = on => { masked.textContent = on && state.secret ? [...state.secret].join(' ') : '\u2022 \u2022 \u2022 \u2022'; };
    ['pointerdown', 'keydown'].forEach(t => peek.addEventListener(t, e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); showSecret(true);
    }));
    ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'].forEach(t =>
      peek.addEventListener(t, () => showSecret(false)));
    $('#game-secret-change').addEventListener('click', () => {
      state.secret = '';
      persist(); paint();
      $('#game-secret').focus();
    });

    $('#game-their-form').addEventListener('submit', e => {
      e.preventDefault();
      if (!state.secret) return say(GAME.needSecret);
      const g = clean($('#game-their-guess').value);
      if (g.length !== 4) return say(GAME.needFour);
      state.theirs.unshift({ g, s: inPlace(g, state.secret) });
      $('#game-their-guess').value = '';
      persist(); paint();
    });

    $('#game-your-form').addEventListener('submit', e => {
      e.preventDefault();
      const g = clean($('#game-your-guess').value);
      if (g.length !== 4) return say(GAME.needFour);
      state.yours.unshift({ g, s: +$('#game-your-score').value });
      $('#game-your-guess').value = '';
      $('#game-your-score').value = '0';
      persist(); paint();
    });

    $('#game-new').addEventListener('click', () => {
      if (!confirm(GAME.newRoundConfirm)) return;
      state = { secret: '', theirs: [], yours: [] };
      persist(); paint();
      $('#game-secret').focus();
    });
  }

  if (key === 'wordgame') {
    /* ── ACROSS THE DISTANCE ─────────────────────────────────────────────
       Two phones, one private ntfy topic. Only guesses and counts travel;
       each secret word stays on its own device, which is also what makes
       the scoring trustworthy - your opponent's device answers, not you. */
    const D = GAME.duel;
    const DKEY = 'kingdom-duel-away-v1';
    let ds = { mode: 'local', role: null, secret: '', theirs: [], yours: [], pending: [], seen: [] };
    try {
      const raw = localStorage.getItem(DKEY);
      if (raw) ds = Object.assign(ds, JSON.parse(raw));
    } catch (e) {}
    const dsave = () => {
      ds.seen = ds.seen.slice(-200);
      try { localStorage.setItem(DKEY, JSON.stringify(ds)); } catch (e) {}
    };

    const clean = v => v.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const inPlace = (a, b) => [...a].reduce((n, ch, i) => n + (ch === b[i] ? 1 : 0), 0);
    const mid = () => Math.random().toString(36).slice(2, 10);

    const dmsg = $('#duel-msg');
    let dmsgTimer = 0;
    const dsay = text => {
      dmsg.textContent = text;
      clearTimeout(dmsgTimer);
      if (text) dmsgTimer = setTimeout(() => { dmsg.textContent = ''; }, 3600);
    };
    const conn = state => { $('#duel-conn').textContent = state; };

    const row = (guess, score) => `
      <li class="gboard__entry${score === 4 ? ' gboard__entry--won' : ''}">
        <span class="gboard__tiles">${[...guess].map(c => `<i>${c}</i>`).join('')}</span>
        <span class="gboard__score">${
          score == null ? `<em>${D.waiting}</em>` :
          score === 4 ? GAME.found : `<b>${score}</b> ${GAME.inPlace}`}</span>
      </li>`;

    const dpaint = () => {
      $('#game-local').hidden = ds.mode !== 'local';
      $('#game-away').hidden = ds.mode !== 'away';
      $('#game-mode-local').setAttribute('aria-pressed', String(ds.mode === 'local'));
      $('#game-mode-away').setAttribute('aria-pressed', String(ds.mode === 'away'));
      if (ds.mode !== 'away') return;
      $('#duel-pick').hidden = !!ds.role;
      $('#duel-play').hidden = !ds.role;
      if (!ds.role) return;
      const block = $('#duel-secret-block');
      block.querySelector('#duel-secret-form').hidden = !!ds.secret;
      block.querySelector('.gboard__row--locked').hidden = !ds.secret;
      $('#duel-their-list').innerHTML = ds.theirs.map(e => row(e.g, e.s)).join('');
      $('#duel-your-list').innerHTML = ds.yours.map(e => row(e.g, e.s)).join('');
    };

    const publish = async body => {
      const res = await fetch(`${D.server}/${D.topic}`, { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) throw new Error(res.status);
    };

    /* Score one of their guesses against my word and answer it. */
    const answer = g => {
      const sc = inPlace(g.word, ds.secret);
      ds.theirs.unshift({ g: g.word, s: sc });
      publish({ v: 1, mid: mid(), from: ds.role, t: 'score', gid: g.gid, word: g.word, score: sc })
        .catch(() => dsay(BELL.failed));
    };

    const handle = raw => {
      let m;
      try { m = JSON.parse(raw); } catch (e) { return; }
      if (!m || m.v !== 1 || !m.mid || m.from === ds.role) return;
      if (ds.seen.includes(m.mid)) return;
      ds.seen.push(m.mid);

      if (m.t === 'guess' && typeof m.word === 'string') {
        const word = clean(m.word);
        if (word.length !== 4) return;
        if (ds.secret) answer({ word, gid: m.gid });
        else { ds.pending.push({ word, gid: m.gid }); dsay(D.lockFirst); }
      } else if (m.t === 'score' && typeof m.gid === 'string') {
        const entry = ds.yours.find(e => e.gid === m.gid);
        if (entry && entry.s == null) entry.s = Math.max(0, Math.min(4, m.score | 0));
      } else if (m.t === 'new') {
        ds.theirs = []; ds.yours = []; ds.pending = []; ds.secret = '';
        dsay(GAME.newRound);
      } else {
        return;
      }
      dsave(); dpaint();
    };

    const connect = () => {
      if (duelES) return;
      /* Catch up on anything said while this page was closed (ntfy keeps
         ~12h), then listen live. */
      fetch(`${D.server}/${D.topic}/json?poll=1`)
        .then(r => r.ok ? r.text() : '')
        .then(text => {
          for (const line of text.trim().split('\n')) {
            if (!line) continue;
            try {
              const ev = JSON.parse(line);
              if (ev.event === 'message' && ev.message) handle(ev.message);
            } catch (e) {}
          }
        })
        .catch(() => {});
      duelES = new EventSource(`${D.server}/${D.topic}/sse`);
      duelES.onopen = () => conn(D.listening);
      duelES.onerror = () => conn(D.offline);
      duelES.onmessage = e => {
        try {
          const ev = JSON.parse(e.data);
          if (ev.event === 'message' && ev.message) handle(ev.message);
        } catch (err) {}
      };
    };

    const setMode = mode => {
      ds.mode = mode; dsave(); dpaint();
      if (mode === 'away') connect();
      else duelTeardown();
    };
    $('#game-mode-local').addEventListener('click', () => setMode('local'));
    $('#game-mode-away').addEventListener('click', () => setMode('away'));

    $('#duel-pick').addEventListener('click', e => {
      const btn = e.target.closest('[data-role]');
      if (!btn) return;
      ds.role = btn.dataset.role;
      dsave(); dpaint();
    });

    $('#duel-secret-form').addEventListener('submit', e => {
      e.preventDefault();
      const w = clean($('#duel-secret').value);
      if (w.length !== 4) return dsay(GAME.needFour);
      ds.secret = w;
      $('#duel-secret').value = '';
      const queued = ds.pending.splice(0);
      queued.forEach(answer);
      dsave(); dpaint();
    });
    const dpeek = $('#duel-secret-peek');
    const dmask = $('#duel-secret-block').querySelector('.game__masked');
    const dshow = on => { dmask.textContent = on && ds.secret ? [...ds.secret].join(' ') : '\u2022 \u2022 \u2022 \u2022'; };
    ['pointerdown', 'keydown'].forEach(t => dpeek.addEventListener(t, e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); dshow(true);
    }));
    ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'].forEach(t =>
      dpeek.addEventListener(t, () => dshow(false)));
    $('#duel-secret-change').addEventListener('click', () => {
      ds.secret = ''; dsave(); dpaint(); $('#duel-secret').focus();
    });

    $('#duel-your-form').addEventListener('submit', async e => {
      e.preventDefault();
      const g = clean($('#duel-your-guess').value);
      if (g.length !== 4) return dsay(GAME.needFour);
      const gid = mid();
      ds.yours.unshift({ gid, g, s: null });
      $('#duel-your-guess').value = '';
      dsave(); dpaint();
      try {
        await publish({ v: 1, mid: mid(), from: ds.role, t: 'guess', gid, word: g });
      } catch (err) {
        ds.yours = ds.yours.filter(x => x.gid !== gid);
        dsave(); dpaint(); dsay(BELL.failed);
      }
    });

    $('#duel-new').addEventListener('click', () => {
      if (!confirm(GAME.newRoundConfirm)) return;
      ds.theirs = []; ds.yours = []; ds.pending = []; ds.secret = '';
      dsave(); dpaint();
      publish({ v: 1, mid: mid(), from: ds.role, t: 'new' }).catch(() => dsay(BELL.failed));
    });
    $('#duel-switch').addEventListener('click', () => {
      ds.role = null; dsave(); dpaint();
    });

    $('#duel-secret').addEventListener('input', function () {
      const v = clean(this.value); if (this.value !== v) this.value = v;
    });
    $('#duel-your-guess').addEventListener('input', function () {
      const v = clean(this.value); if (this.value !== v) this.value = v;
    });

    dpaint();
    if (ds.mode === 'away') connect();
  }

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
  $('#lightbox-stage').innerHTML = frame(item, { lazy: false, reserve: false });
  const meta = [item.year, item.medium].filter(Boolean).join(' · ');
  $('#lightbox-meta').innerHTML =
    `<h3>${item.title}</h3>${meta ? `<div class="dl">${meta}</div>` : ''}` +
    (item.note ? `<p>${item.note}</p>` : '');
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
  const i = ORDER.indexOf(currentPage);
  if (i > 0) openPage(ORDER[i - 1], lastTrigger);
});
$('#reader-next').addEventListener('click', () => {
  const i = ORDER.indexOf(currentPage);
  if (i < ORDER.length - 1) openPage(ORDER[i + 1], lastTrigger);
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
   THE NORTHERN LIGHTS — rare, unannounced, and gone before long.
   ══════════════════════════════════════════════════════════════════════════ */
const aurora = (() => {
  let running = false;

  function show() {
    if (running || !AURORA.enabled || document.hidden) return;
    running = true;

    const canvas = document.createElement('canvas');
    canvas.className = 'aurora';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.mixBlendMode = AURORA.blend;
    document.body.appendChild(canvas);

    /* A third of the viewport is plenty: it is about to be blurred to a
       whisper anyway, and this keeps the whole pass cheap. */
    const size = () => {
      canvas.width  = Math.max(120, Math.round(innerWidth  / 3));
      canvas.height = Math.max(120, Math.round(innerHeight / 3));
    };
    size();
    addEventListener('resize', size, { passive: true });

    const draw = auroraPainter(canvas, {
      colors: AURORA.colors, bands: AURORA.bands, motion: AURORA.motion ?? 1,
      seed: 1 + Math.random() * 1e6,
    });

    const started = performance.now();
    const total = AURORA.durationSeconds * 1000;
    let raf = 0;

    const stop = () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
      canvas.remove();
      running = false;
    };

    const frame = now => {
      const p = (now - started) / total;
      if (p >= 1) return stop();
      /* Arrive slowly, hold, leave more slowly still. */
      const fade = p < 0.26 ? p / 0.26 : p > 0.58 ? (1 - p) / 0.42 : 1;
      canvas.style.opacity = String(Math.max(0, fade) * AURORA.opacity);
      /* Every frame: the curtains are the point, and throttling them to 30fps
         made the flow read as a slideshow. The canvas is a third of viewport
         size, so this stays cheap.
         Reduced motion keeps the curtains still; they only fade. */
      draw(REDUCED ? 0 : (now - started) / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  const between = ([lo, hi]) => (lo + Math.random() * (hi - lo));

  function schedule(first) {
    const wait = first
      ? between(AURORA.firstDelaySeconds) * 1000
      : between(AURORA.gapMinutes) * 60000;
    setTimeout(() => {
      /* Never while she is looking elsewhere — it would be spent unseen. */
      if (!document.hidden && Math.random() < (first ? AURORA.firstChance : AURORA.chance)) show();
      schedule(false);
    }, wait);
  }

  if (AURORA.enabled) schedule(true);
  return { show };
})();

/* A way to call them up deliberately: the small star under the cover
   button. Undocumented on the page on purpose. */
$('#cover-star')?.addEventListener('click', () => aurora.show());

/* ══════════════════════════════════════════════════════════════════════════
   DAYS OF US — the due-date stamp on the cover. Day 1 is DAYS.anchor.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const el = $('#days');
  const [y, m, d] = DAYS.anchor;
  /* Compare the two dates in UTC. Local-midnight arithmetic drifts by an hour
     whenever the anchor and today sit on opposite sides of a daylight-saving
     change, which floors the division down and loses a whole day. UTC has no
     DST, so the day count is exact year-round. */
  const now = new Date();
  const start = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const n = Math.round((today - start) / 86400000) + 1;
  if (n >= 1) {
    const anniversary = now.getMonth() === m - 1 && now.getDate() === d;
    const milestone = DAYS.milestones[n]
      || (anniversary && n > 1
          ? `${Math.round(n / 365)} year${n > 550 ? 's' : ''} \u2661` : '');
    el.innerHTML =
      `<span class="days__label">${DAYS.label}</span>` +
      `<span class="days__num">${n.toLocaleString('en')}</span>` +
      `<span class="days__since">${DAYS.since}</span>` +
      (milestone ? `<span class="days__milestone hand">${milestone}</span>` : '');
    el.hidden = false;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   THE PIGEON POST — his notes, fetched from their own ntfy topic.
   ntfy holds a note for about twelve hours, so once her browser has seen
   one it keeps it: the newest sits on the desk and the ones before it fold
   away underneath. The collection is hers, on her own device.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const KEY = 'kingdom-pigeon-notes';
  const OLD_KEY = 'kingdom-pigeon-last';   /* what the single-note version kept */
  const box = $('#pigeon');
  const moreBtn = $('#pigeon-more');
  const earlier = $('#pigeon-earlier');

  const load = () => {
    try {
      const kept = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(kept)) return kept;
      const one = JSON.parse(localStorage.getItem(OLD_KEY));   /* carry the old one over */
      return one && one.text ? [one] : [];
    } catch (e) { return []; }
  };
  const save = ns => {
    try { localStorage.setItem(KEY, JSON.stringify(ns.slice(0, PIGEON.keep))); } catch (e) {}
  };

  const when = time => {
    const d = new Date(time * 1000);
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    return days === 0 ? PIGEON.today
         : days === 1 ? PIGEON.yesterday
         : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  };

  let notes = load();

  const paint = () => {
    if (!notes.length) return;
    const [latest, ...rest] = notes;
    $('#pigeon-eyebrow').textContent = PIGEON.eyebrow;
    /* textContent, deliberately: the note travels over the wire. */
    $('#pigeon-text').textContent = latest.text;
    $('#pigeon-from').textContent = PIGEON.from;
    $('#pigeon-when').textContent = when(latest.time);
    box.hidden = false;

    earlier.replaceChildren(...rest.map(n => {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.className = 'hand';
      p.textContent = n.text;
      const t = document.createElement('span');
      t.className = 'pigeon__when';
      t.textContent = when(n.time);
      li.append(p, t);
      return li;
    }));

    moreBtn.hidden = rest.length === 0;
    if (!rest.length) {
      earlier.hidden = true;
      moreBtn.setAttribute('aria-expanded', 'false');
    } else if (moreBtn.getAttribute('aria-expanded') !== 'true') {
      moreBtn.textContent = rest.length === 1 ? PIGEON.earlierOne : PIGEON.earlierMany;
    }
  };
  paint();

  moreBtn.addEventListener('click', () => {
    const open = moreBtn.getAttribute('aria-expanded') === 'true';
    moreBtn.setAttribute('aria-expanded', String(!open));
    earlier.hidden = open;
    const count = Math.max(0, notes.length - 1);
    moreBtn.textContent = open
      ? (count === 1 ? PIGEON.earlierOne : PIGEON.earlierMany)
      : PIGEON.earlierHide;
  });

  const poll = async () => {
    try {
      const res = await fetch(`${PIGEON.server}/${PIGEON.topic}/json?poll=1`);
      if (!res.ok) return;
      const seen = new Set(notes.map(n => n.time + '|' + n.text));
      let added = false;
      for (const line of (await res.text()).trim().split('\n')) {
        if (!line) continue;
        try {
          const ev = JSON.parse(line);
          if (ev.event !== 'message' || !ev.message) continue;
          const note = { text: String(ev.message).slice(0, 500), time: ev.time };
          const id = note.time + '|' + note.text;
          if (seen.has(id)) continue;
          seen.add(id);
          notes.push(note);
          added = true;
        } catch (e) { /* skip a malformed line */ }
      }
      if (!added) return;
      notes.sort((a, b) => b.time - a.time);
      notes = notes.slice(0, PIGEON.keep);
      save(notes);
      paint();
    } catch (e) { /* offline — the notes she already has stay on the desk */ }
  };
  poll();
  setInterval(poll, PIGEON.pollMinutes * 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
}

/* ══════════════════════════════════════════════════════════════════════════
   THE BELL — a press here becomes a push notification on his phone, sent
   straight from the browser to ntfy.sh. No backend of our own; the topic
   name in content.js is the address.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const pull = $('#bell-pull');
  const tray = $('#bell-tray');
  const status = $('#bell-status');
  $('#bell-label').textContent = BELL.control;
  $('#bell-hint').textContent = BELL.trayHint;
  $('#bell-buttons').innerHTML = BELL.buttons.map(b =>
    `<button type="button" class="bell__ring" data-key="${b.key}">${b.label}</button>`).join('');
  $('#bell-line-label').textContent = BELL.lineLabel;
  $('#bell-line').placeholder = BELL.linePlaceholder;
  $('#bell-line-send').textContent = BELL.lineAction;

  const setOpen = open => {
    tray.hidden = !open;
    pull.setAttribute('aria-expanded', String(open));
    if (open) status.textContent = '';
  };
  pull.addEventListener('click', () => setOpen(tray.hidden));
  document.addEventListener('click', e => {
    if (!tray.hidden && !e.target.closest('.bell')) setOpen(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !tray.hidden) { setOpen(false); pull.focus(); }
  });

  let statusTimer = 0;
  const say = text => {
    status.textContent = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = ''; }, 4000);
  };

  /* One ring per button per cooldown window, so a double-tap or an
     enthusiastic moment doesn't turn into six buzzes. */
  const stampKey = k => 'kingdom-bell-' + k;
  const onCooldown = k => {
    const secs = k === 'line' ? BELL.lineCooldownSeconds : BELL.cooldownSeconds;
    try { return Date.now() - (+localStorage.getItem(stampKey(k)) || 0) < secs * 1000; }
    catch (e) { return false; }
  };
  const stamp = k => { try { localStorage.setItem(stampKey(k), String(Date.now())); } catch (e) {} };

  $('#bell-line-form').addEventListener('submit', async e => {
    e.preventDefault();
    const input = $('#bell-line');
    const text = input.value.trim();
    if (!text) return;
    if (onCooldown('line')) return say(BELL.cooldownMsg);
    const btn = $('#bell-line-send');
    btn.disabled = true;
    try {
      const res = await fetch(`${BELL.server}/${BELL.topic}`, {
        method: 'POST',
        body: text,
        headers: { Title: BELL.title, Tags: 'love_letter', Priority: 'urgent' },
      });
      if (!res.ok) throw new Error(res.status);
      stamp('line');
      input.value = '';
      say(BELL.sent);
    } catch (err) {
      say(BELL.failed);
    } finally {
      btn.disabled = false;
    }
  });

  $('#bell-buttons').addEventListener('click', async e => {
    const btn = e.target.closest('.bell__ring');
    if (!btn) return;
    const cfg = BELL.buttons.find(b => b.key === btn.dataset.key);
    if (!cfg) return;
    if (onCooldown(cfg.key)) return say(BELL.cooldownMsg);

    btn.disabled = true;
    try {
      const res = await fetch(`${BELL.server}/${BELL.topic}`, {
        method: 'POST',
        body: cfg.message,
        /* 'urgent' is ntfy's top priority: on Android it lands on the
           max-importance channel with an insistent buzz; on iOS it maps to a
           time-sensitive alert. For a bell like this, that's the point. */
        headers: { Title: BELL.title, Tags: cfg.tag, Priority: 'urgent' },
      });
      if (!res.ok) throw new Error(res.status);
      stamp(cfg.key);
      say(BELL.sent);
    } catch (err) {
      say(BELL.failed);
    } finally {
      btn.disabled = false;
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════════════════════ */
board.start();
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
    /* The cover reveal is held until the overture has handed over, otherwise
       it would play out underneath the closed book and she would arrive to a
       cover that had already finished assembling itself. */
    const revealCover = () => {
      gsap.to('#cover-mark',   { opacity: 1, duration: 1.3, delay: .25, ease: 'power2.out' });
      gsap.to('#cover-title',  { opacity: 1, y: 0, duration: 1.1, delay: .55, ease: 'power3.out' });
      gsap.to('#cover-orn',    { opacity: 1, duration: .9, delay: .95 });
      gsap.to('#cover-blurb',  { opacity: 1, y: 0, duration: .95, delay: 1.05, ease: 'power3.out' });
      gsap.to('#cover-cta',    { opacity: 1, y: 0, duration: .85, delay: 1.3, ease: 'power3.out' });
      gsap.to('#cover-star',   { opacity: 1, duration: .8, delay: 1.55 });
      gsap.to('#cover-aside',  { opacity: 1, duration: 1.4, delay: .7 });
    };

    if (shouldPlayOverture()) playOverture(revealCover);
    else revealCover();

    gsap.fromTo('.chapter-link',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: .85, stagger: .07, ease: 'power3.out',
        scrollTrigger: { trigger: '#contents', start: 'top 88%', once: true } });
    gsap.fromTo('.rest-link',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: .7, stagger: .05, ease: 'power3.out',
        scrollTrigger: { trigger: '.contents-rest', start: 'top 92%', once: true } });
    gsap.fromTo('.contents-head, .contents-rest .eyebrow',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contents-wrap', start: 'top 85%', once: true } });
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
  /* The overture deliberately holds the cover back until it hands over, so the
     watchdog must not race it and assemble the cover behind the closed book. */
  if (document.querySelector('.overture')) return;
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
