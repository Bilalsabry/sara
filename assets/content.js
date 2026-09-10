/* ============================================================================
   content.js — approved copy + placeholder configuration
   ----------------------------------------------------------------------------
   THE COPY IN THIS FILE IS APPROVED AND LOCKED.

   Every string here is transcribed from COPY.md, which Bilal has signed off.
   Do NOT rewrite, shorten, "improve", regenerate or re-punctuate this wording.
   Do not add new Throne of Glass quotations. If this file and COPY.md ever
   disagree, COPY.md wins — correct this file, not COPY.md.

   Layout, styling and markup may change freely. The words may not.
   ----------------------------------------------------------------------------
   IMAGES: every image slot has `src: null` and renders as a proofing frame.
   To insert a real photograph, set `src` to its path. Nothing else changes —
   the frame keeps its dimensions, so no layout shifts. See README.md.
   ========================================================================== */

/* Aspect ratios are declared so an empty frame reserves exactly the space its
   photograph will occupy. Change `ratio` only if the real image differs. */
export const IMAGES = {
  coverPortrait: {
    id: 'cover-portrait',
    src: 'assets/images/cover-portrait.jpg',
    alt: 'Sara laughing, seated in a candlelit room with stained glass behind her',
    label: 'HER PHOTOGRAPH',
    ratio: null,          // fills the cover panel
    /* The file is pre-cropped (top 30% of the original removed) so she reads
       large in the panel rather than sitting under a wall of architecture.
       The x focal keeps the stained glass at the left edge in shot. */
    focal: '42% 50%',
    fit: 'cover',
  },
  coverSnapshot: {
    id: 'cover-snapshot',
    src: 'assets/images/cover-snapshot.jpg',
    alt: '',
    label: 'ADD PHOTO',
    ratio: '2 / 3',
    focal: '50% 30%',
    fit: 'cover',
  },
  letterPlate: {
    id: 'letter-plate',
    src: 'assets/images/archive-shrine.jpg',
    alt: 'Standing together in the gardens, blue sky above',
    label: 'ADD PHOTO',
    ratio: '4 / 5',
    focal: '50% 62%',
    fit: 'cover',
  },
};

/* The archive. Add entries freely — the layout adapts.
   `scale` drives the editorial composition: 'feature' is the large frame,
   'detail' the smaller process pieces. */
export const ARCHIVE = [
  /* Titles below are neutral place labels, pending Bilal's real captions.
     `note` is intentionally blank until he writes each one — do not invent
     captions here (see COPY.md). Original art-slot placeholders (HER AT WORK /
     ARTWORK SCAN) return automatically on any entry whose src is set null. */
  {
    id: 'archive-01',
    src: 'assets/images/archive-street.jpg',
    alt: 'The two of us in matching cream, autumn sun, city street behind',
    label: 'HER AT WORK',
    scale: 'feature',
    ratio: '4 / 5',
    focal: '50% 34%',
    title: 'Autumn, in matching white',
    year: '',
    medium: 'Photograph',
    note: '',
  },
  {
    id: 'archive-02',
    src: 'assets/images/archive-kiss.jpg',
    alt: 'A kiss under red light',
    label: 'ARTWORK SCAN',
    scale: 'detail',
    ratio: '5 / 8',
    focal: '50% 46%',
    title: 'Under red light',
    year: '',
    medium: 'Photograph',
    note: '',
  },
  {
    id: 'archive-03',
    src: 'assets/images/archive-spa.jpg',
    alt: 'The two of us in white robes, faces close to the camera',
    label: 'ADD PHOTO',
    scale: 'detail',
    ratio: '3 / 4',
    focal: '50% 40%',
    title: 'Robes',
    year: '',
    medium: 'Photograph',
    note: '',
  },
  {
    id: 'archive-05',
    src: 'assets/images/archive-bondi.jpg',
    alt: 'Coffee at the Bondi rail, sunset behind us',
    label: 'ADD PHOTO',
    scale: 'detail',
    ratio: '3 / 4',
    focal: '50% 50%',
    title: 'Bondi, golden hour',
    year: '',
    medium: 'Photograph',
    note: '',
  },
];

/* ── COVER ───────────────────────────────────────────────────────────────── */
export const COVER = {
  titleTop: 'A Kingdom',
  titleBottom: 'made for Sara',
  blurb: ['A private collection of things', 'I never want us to forget.'],
  cta: 'Open the Book',
  quoteCard: ['To the stars', 'who listen and', 'the dreams that', 'are answered.'],
};

/* ── CHAPTER INDEX ───────────────────────────────────────────────────────── */
export const INDEX = [
  {
    key: 'letter', folio: 'I', title: 'The Letter',
    blurb: 'Some things are hard to say out loud. So I wrote them here. For you. For us. For every version of our story.',
    link: 'Read the letter',
  },
  {
    key: 'archive', folio: 'II', title: "An Artist's Archive",
    blurb: 'The colours Sara loves. The things she creates. The world through her eyes.',
    link: 'Browse the archive',
  },
  {
    key: 'map', folio: 'III', title: 'The Map',
    blurb: 'Every place. Every moment. Every chapter of us.',
    link: 'Explore the map',
  },
  {
    key: 'constellation', folio: 'IV', title: "Sara's Constellation",
    blurb: 'A universe of everything that makes Sara, Sara.',
    link: "Explore Sara's stars",
  },
  {
    key: 'fireheart', folio: 'V', title: 'Fireheart',
    blurb: 'Sara is fire and starlight. A rare combination. A force of her own.',
    link: 'Read this chapter',
  },
];

/* ── CHAPTER I · THE LETTER ──────────────────────────────────────────────── */
export const LETTER = {
  folioDate: ['15', '06', '2026'],
  paragraphs: [
    'If you ever forget, I want you to come here.',
    'You are the kind of person who notices the little things — the colour of the sky before it rains, the way a song can hold a whole memory, the quiet in people that they don’t know they carry.',
    'I like who I am when I’m around you. I think more carefully. I notice more. You did that without ever asking me to.',
    'You have made my world feel less like a battlefield and more like home.',
    'Thank you for being the steady in my story, the fire in my heart, and the person I am most proud to love.',
  ],
  signOff: ['Always,', 'Yours'],
  initial: 'Bilal',
  tapedNote: ['for the one', 'who makes', 'ordinary days', 'extraordinary ♡'],
};

/* ── CHAPTER II · AN ARTIST'S ARCHIVE ────────────────────────────────────── */
export const ARCHIVE_TEXT = {
  caption: "A few pieces from Sara's world.",
  captionAction: 'click to explore',
  marginNote: ['she paints', 'what words', 'cannot.'],
  addAction: 'Add to the archive',
};

/* ── CHAPTER III · THE MAP ───────────────────────────────────────────────── */
export const MAP_CORNER = ['Every place.', 'Every memory.', 'Every us.'];

export const MAP_PLACES = [
  {
    key: 'met', label: 'Where we met', sub: 'The beginning',
    x: 236, y: 268, labelX: 60, labelY: 238,
    body: 'Replace this with the real place — the room, the street, the day of the week. The specific version always beats the poetic one.',
  },
  {
    key: 'spoke', label: 'The first night we spoke properly', sub: 'The spark',
    x: 420, y: 212, labelX: 392, labelY: 166,
    body: 'Not the first time we talked. The first time it went past the surface and neither of us wanted it to end.',
  },
  {
    key: 'realised', label: 'Where I realised', sub: 'Everything changed',
    x: 694, y: 226, labelX: 716, labelY: 272,
    body: 'There was a moment it stopped being a question. Write down where you were standing.',
  },
  {
    key: 'distance', label: 'The distance between us', sub: 'Hard, but worth it',
    x: 184, y: 374, labelX: 44, labelY: 350,
    body: 'Every map has a stretch that was harder to cross. This one was ours. Worth marking honestly.',
  },
  {
    key: 'now', label: 'Where we are now', sub: 'Home',
    x: 500, y: 416, labelX: 524, labelY: 452,
    body: 'Still being drawn. That is the point of leaving the edges open.',
  },
];

/* ── CHAPTER IV · HER CONSTELLATION ──────────────────────────────────────── */
export const STARS = [
  { key: 'books', name: 'Books', x: 450, y: 118,
    body: 'She finishes a book and carries it around for days afterwards. Ask her about the ending — she has a whole argument ready.' },
  { key: 'dreams', name: 'Dreams', x: 664, y: 238,
    body: 'She is ambitious in a quiet way. She would rather do the thing properly than tell you she is doing it.' },
  { key: 'kindness', name: 'Kindness', x: 648, y: 432,
    body: 'She has stayed gentle in a world that rewards the opposite, and I do not think she knows how rare that is.' },
  { key: 'jokes', name: 'Jokes', x: 450, y: 540,
    body: 'The private jokes that make no sense to anyone else. Half of them are one word long by now.' },
  { key: 'songs', name: 'Songs', x: 242, y: 432,
    body: 'The songs she puts on when she works, and the completely different ones for when she does not want to think.' },
  { key: 'art', name: 'Art', x: 236, y: 238,
    body: 'She sees beauty others walk past. She turns feeling into something the world can hold.' },
];

/* ── CHAPTER V · FIREHEART ───────────────────────────────────────────────── */
export const FIREHEART = {
  paragraphs: [
    { text: 'There are people who survive by becoming harder.', emphasis: false },
    { text: 'You have somehow remained gentle without ever becoming fragile.', emphasis: true },
    { text: 'I don’t think you know how rare that is. It would have been easier to close, and you didn’t. You kept making things. You kept paying attention. You stayed soft in the places most people armour first.', emphasis: false },
    { text: 'You are fire, but you are also home.', emphasis: false },
  ],
  handwritten: ['and you’d have found the light anyway —', 'you always do'],
  sideNote: ['To the girl', 'who would', 'bow to no one', 'and change', 'everything.'],
};

/* ── THE LIBRARY ─────────────────────────────────────────────────────────── */
export const LIBRARY = {
  books: [
    { title: 'Throne of Glass',  spine: '#1B1E27' },
    { title: 'Crown of Midnight', spine: '#6B2A2A' },
    { title: 'Heir of Fire',      spine: '#22402E' },
    { title: 'Queen of Shadows',  spine: '#59211E' },
    { title: 'Empire of Storms',  spine: '#213450' },
    { title: 'Tower of Dawn',     spine: '#1B293D' },
    { title: 'Kingdom of Ash',    spine: '#856632' },
  ],
  author: 'Sarah J. Maas',
  footer: 'To the series that gave us a kingdom of our own. ♡',
};

/* ── MARGINALIA ──────────────────────────────────────────────────────────
   Short attributed quotations. Do not add further quotations. */
export const MARGINALIA = {
  quotes: [
    { lines: ['“I am not afraid.', 'I was born to do this.”'], attribution: 'Celaena Sardothien', icon: 'dagger' },
    { lines: ['“Libraries were full of ideas —', 'perhaps the most dangerous and', 'powerful of all weapons.”'], attribution: 'Sarah J. Maas', icon: 'sprig' },
    { lines: ['“To whatever end,”', 'he whispered, “fireheart.”'], attribution: 'Dorian Havilliard', icon: 'crown' },
  ],
  footer: 'Some lines feel like they were written for you. ♡',
};

/* ── OUR SOUNDTRACK ──────────────────────────────────────────────────────
   Titles and artists only. Never reproduce lyrics. */
export const SOUNDTRACK = {
  songs: [
    'Holocene — Bon Iver',
    'You Are the Reason — Calum Scott',
    'Until I Found You — Stephen Sanchez',
    'Bloom — The Paper Kites',
    'Sparks — Coldplay',
    'Lover — Taylor Swift',
    'The Night We Met — Lord Huron',
    '505 — Arctic Monkeys',
  ],
  more: 'and many more…',
  sideNote: ['Every song tells', 'a piece of our story.'],
};

/* ── THE LITTLE THINGS ───────────────────────────────────────────────────── */
export const LITTLE_THINGS = [
  { icon: 'book',      text: 'The way she gets lost in books' },
  { icon: 'cup',       text: 'Her morning coffee rituals' },
  { icon: 'camera',    text: 'How she sees beauty in everything' },
  { icon: 'brush',     text: 'Her art, her therapy, her magic' },
  { icon: 'stars',     text: 'The stars she talks to at night' },
  { icon: 'headphones',text: 'Songs that become our memories' },
  { icon: 'moon',      text: 'The kind heart she carries' },
  { icon: 'leaf',      text: 'Her laugh, my favourite sound' },
  { icon: 'mountain',  text: 'The dreams she’s chasing fearlessly' },
  { icon: 'crown',     text: 'The queen she was always meant to be' },
];

/* ── NOTES FROM ME ───────────────────────────────────────────────────────── */
export const NOTES = {
  cards: [
    { lines: ['The way you wrinkle', 'your nose when', 'you laugh.'], icon: 'nose' },
    { lines: ['How you always know', 'exactly what', 'to say.'], icon: 'wings' },
    { lines: ['The way you', 'believe in me,', 'even when I don’t', 'believe in myself.'], icon: 'star' },
  ],
  footer: ['There are a million more.', 'I hope I get a lifetime to write them all.'],
};

/* ── EPILOGUE ────────────────────────────────────────────────────────────── */
export const EPILOGUE = {
  paragraphs: [
    ['There are still pages missing.', 'I hope there always will be.'],
    ['Thank you for letting me', 'write this with you.'],
  ],
  signOff: 'Always,',
  initial: 'Bilal',
  date: '15 · 06 · 2026',
  restart: 'Return to the beginning',
  cornerNote: ['To my', 'Fireheart.', 'Forever. ♡'],
};

/* ── HOMEPAGE FOOTER ─────────────────────────────────────────────────────── */
export const FOOTER = {
  lines: ['There are still pages missing.', 'I hope there always will be.'],
  signature: '— for Sara, always ♡',
};


/* ── THE WORD GAME ───────────────────────────────────────────────────────
   The game the two of them play on paper: each writes a hidden four-letter
   word; guesses are answered only with how many letters sit in their right
   place. This page is the scorekeeper.
   Wording here is provisional - functional labels, not yet in COPY.md. */
export const GAME = {
  rules: ['You each think of a four-letter word and keep it hidden.',
          'Take turns guessing each other\u2019s. The only answer you may give:',
          'how many letters sit in their right place.'],
  secretLabel: 'Your word',
  secretHint: 'Kept on this device only \u2014 never shown unless you press and hold.',
  secretSet: 'Lock it in',
  secretChange: 'Change word',
  secretShow: 'Hold to peek',
  theirTitle: 'Their guesses',
  theirHint: 'Type each guess they make \u2014 the count is worked out for you.',
  theirAction: 'Mark',
  yourTitle: 'Your guesses',
  yourHint: 'Note each guess you make and the count they give you.',
  yourAction: 'Note it',
  inPlace: 'in place',
  found: 'Found it \u2661',
  duel: {
    topic: 'kingdom-duel-bc9b1e52ea37a7c2',
    server: 'https://ntfy.sh',
    modeLocal: 'Same room',
    modeAway: 'Across the distance',
    awayHint: 'Each of you opens this page on your own phone. Your word never leaves your device \u2014 only guesses and counts travel.',
    pick: 'Which of you is this?',
    iAmB: 'I\u2019m B', iAmS: 'I\u2019m S',
    theirGuessHint: 'Their guesses arrive here on their own and are answered for you.',
    yourGuessHint: 'Send a guess \u2014 their device answers with the count.',
    guessAction: 'Send guess',
    waiting: 'waiting\u2026',
    listening: 'Listening for them',
    offline: 'Reconnecting\u2026',
    lockFirst: 'They\u2019re guessing \u2014 lock your word to answer.',
    switchSide: 'Switch side',
  },
  newRound: 'New round',
  newRoundConfirm: 'Start a new round? Both lists and the hidden word are cleared.',
  needSecret: 'Lock in your word first.',
  needFour: 'Four letters.',
};






/* ── THE WISH LIST & THE CALENDAR ────────────────────────────────────────
   The only two pages both of them write to, so they live in a real store
   rather than on one device (see api/board.js and assets/board.js).
   Wording here is functional and provisional — not yet in COPY.md. */
export const BOARD = {
  /* who is using this browser; she picks once and it is remembered */
  askWho: 'Before you add anything — which of you is this?',
  iAmS: 'I\u2019m Sara', iAmB: 'I\u2019m Bilal',
  changeWho: 'not you?',
  offline: 'Saved here for now \u2014 it will sync when the connection returns.',
  noStore: 'Saved on this device. Once the shared store is connected these appear on both phones.',
  live: 'Shared with him',
  liveB: 'Shared with her',
};

export const WISHES = {
  intro: 'Things to have, and things to do together. Add anything \u2014 however small, however far off.',
  placeholder: 'a wish\u2026',
  kindHave: 'to have', kindDo: 'to do together',
  add: 'Add it',
  filterAll: 'Everything', filterHave: 'To have', filterDo: 'To do together',
  openTitle: 'Still wishing', doneTitle: 'Granted',
  granted: 'Granted',
  markDone: 'Mark as granted', markUndone: 'Not yet after all',
  remove: 'Remove',
  removeConfirm: 'Take this off the list?',
  emptyAll: 'Nothing on the list yet. The first one is the hardest.',
  emptyDone: 'Nothing granted yet.',
  toCalendar: 'Granted things can go in the calendar as the day they happened.',
};

export const CALENDAR = {
  intro: 'The days worth keeping. Add them as they happen, or long afterwards \u2014 the calendar does not mind.',
  onThisDay: 'On this day',
  addTitle: 'Add a day',
  fieldDate: 'When', fieldWhat: 'What happened', fieldNote: 'Anything else',
  placeholderWhat: 'the day we\u2026',
  placeholderNote: 'optional \u2014 where you were, what was said, what you ate',
  add: 'Keep this day',
  remove: 'Remove',
  removeConfirm: 'Remove this day from the calendar?',
  empty: 'No days kept yet. Start with the one you would hate to forget.',
  countOne: 'day kept', countMany: 'days kept',
};

/* ── OPEN WHEN ───────────────────────────────────────────────────────────
   A drawer of sealed letters. She breaks a seal when the moment on the
   envelope arrives, and a broken seal stays broken — like a real letter.

   THE WORDS HERE ARE BILAL'S TO WRITE. `body` is an array of paragraphs
   and is deliberately empty. An envelope with an empty body does not
   render at all, and while every body is empty the whole page stays out of
   the book — so she never sees an empty drawer. Fill one in and it appears.
   Do not invent these; they are the most personal thing on the site.

   The `when` lines are structural labels rather than his voice, so they are
   provisional and can be changed freely. */
export const OPEN_WHEN = {
  intro: 'Some of these are for a day that has not happened yet. Break the seal when it does.',
  sealed: 'Sealed',
  opened: 'Opened',
  openAction: 'Break the seal',
  confirm: 'Once a seal is broken it stays broken. Open this one now?',
  letters: [
    { key: 'miss',    when: 'when you miss me',                body: [] },
    { key: 'doubt',   when: 'when you are doubting your work', body: [] },
    { key: 'bad-day', when: 'when the day has been unkind',    body: [] },
    { key: 'sleep',   when: 'when you cannot sleep',           body: [] },
    { key: 'angry',   when: 'when you are angry with me',      body: [] },
    { key: 'proud',   when: 'when something wonderful happens', body: [] },
  ],
};

/* ── THE NORTHERN LIGHTS ─────────────────────────────────────────────────
   Her favourite thing in the world, so they are never on demand and never
   on a schedule she could learn. They drift across the page rarely, at a
   random moment, and leave on their own.

   Rarity is the whole point - resist turning these numbers up. With the
   defaults, a pass arrives for roughly one visit in five soon after she
   opens the book, and about once every half hour of reading after that.
   Set `enabled: false` to retire them.

   Colours are [r, g, b], kept muted so they read as light falling on paper
   rather than a screensaver. Wording/values provisional. */
export const AURORA = {
  enabled: true,
  firstChance: 0.18,            // chance of a pass shortly after she arrives
  firstDelaySeconds: [25, 110],
  chance: 0.30,                 // chance at each later roll
  gapMinutes: [5, 16],          // how long between rolls
  durationSeconds: 32,   // long enough to watch them move
  opacity: 0.62,
  /* `color` takes hue from the lights and luminosity from the page, so the
     paper catches the colour without any text losing contrast. */
  blend: 'color',
  bands: 8,
  motion: 1,             // raise to make them livelier, lower to calm them
  /* Weighted the way a real sky is: mostly greens, with blue and a violet
     fringe turning up now and then. An even spread of hues reads as a
     rainbow, not as the northern lights. */
  colors: [
    [ 78, 152, 118],   // jade
    [110, 182, 150],   // sea green
    [ 88, 164, 128],   // jade, lighter
    [ 92, 132, 160],   // glacial blue
    [120, 176, 144],   // green
    [128, 104, 156],   // faint violet at the fringe
    [ 84, 158, 124],   // green
  ],
};

/* ── THE PIGEON POST ─────────────────────────────────────────────────────
   Notes from Bilal that appear on the site as a paper note left on the
   desk. He publishes to the topic below (iOS Shortcut or the ntfy.sh web
   page - see README); the site polls it and shows the newest note.
   ntfy.sh only caches messages for ~12 hours, so once the site has seen a
   note it also keeps it in the reader's browser until a newer one arrives.
   Wording provisional. */
export const PIGEON = {
  topic: 'kingdom-post-128eddf76cddc1a3',
  server: 'https://ntfy.sh',
  eyebrow: 'Left on the desk',
  from: '\u2014 Bilal',
  today: 'today', yesterday: 'yesterday',
  pollMinutes: 5,
  /* ntfy only holds a note for about twelve hours, so once her browser has
     seen one it keeps it. These are the ones she has kept. */
  keep: 12,
  earlierOne: 'one note before this',
  earlierMany: 'the notes before this',
  earlierHide: 'put them away',
};

/* ── DAYS OF US ──────────────────────────────────────────────────────────
   The due-date stamp on the cover. Day 1 = the day they started dating. */
export const DAYS = {
  anchor: [2026, 1, 8],        // year, month, day - local time
  label: 'Day',
  since: 'since 08 \u00b7 01 \u00b7 2026',
  milestones: {
    50: 'fifty days \u2661', 100: 'one hundred days \u2661',
    200: 'two hundred days \u2661', 365: 'one whole year \u2661',
    500: 'five hundred days \u2661', 730: 'two years \u2661',
    1000: 'one thousand days \u2661',
  },
};

/* ── THE BELL ────────────────────────────────────────────────────────────
   The small fixed control at lower right. When Sara rings it, a push
   notification lands on Bilal's phone within a second or two, via ntfy.sh
   (a free public push relay - no account, no server of our own).

   SETUP, once, on Bilal's phone: install the ntfy app (iOS/Android),
   subscribe to the topic below, done. The topic name is the only secret:
   anyone who knows it could ring the bell, so it is random and must not be
   shared outside the two of you. To rotate it, change `topic` here and
   re-subscribe in the app.
   Wording is provisional - functional labels, not yet in COPY.md. */
export const BELL = {
  topic: 'kingdom-6b7aa2ad5dfefe43',
  server: 'https://ntfy.sh',
  title: 'From Sara',
  control: 'Ring for Bilal',
  trayHint: 'Bilal will feel it buzz.',
  buttons: [
    { key: 'hug',    label: 'A hug',  message: 'Sara wants a hug \u2661',  tag: 'hugs' },
    { key: 'kiss',   label: 'A kiss', message: 'Sara wants a kiss \u2661', tag: 'kiss' },
    { key: 'coffee', label: 'Coffee', message: 'Coffee, please',            tag: 'coffee' },
  ],
  lineLabel: 'Or send Bilal a line',
  linePlaceholder: 'anything at all\u2026',
  lineAction: 'Send',
  lineCooldownSeconds: 15,
  sent: 'On its way to Bilal \u2661',
  cooldownMsg: 'Already rung \u2014 give it a minute.',
  failed: 'It didn\u2019t go through \u2014 try again in a moment.',
  cooldownSeconds: 60,
};

/* ── PAGE ORDER (drives Prev/Next) ───────────────────────────────────────── */
export const PAGE_ORDER = [
  'letter', 'archive', 'map', 'constellation', 'fireheart',
  'library', 'marginalia', 'soundtrack', 'little', 'notes', 'openwhen',
  'wishes', 'calendar', 'wordgame', 'epilogue',
];

export const PAGE_META = {
  letter:        { folio: 'Chapter I',        title: 'The Letter' },
  archive:       { folio: 'Chapter II',       title: "An Artist's Archive" },
  map:           { folio: 'Chapter III',      title: 'The Map' },
  constellation: { folio: 'Chapter IV',       title: "Sara's Constellation" },
  fireheart:     { folio: 'Chapter V',        title: 'Fireheart' },
  library:       { folio: 'The Library',      title: 'The Stories We Love' },
  marginalia:    { folio: 'Marginalia',       title: "Lines I'll Never Forget" },
  soundtrack:    { folio: 'Our Soundtrack',   title: 'Songs That Found Us' },
  little:        { folio: 'The Little Things',title: 'Sara, in bits and pieces' },
  notes:         { folio: 'Notes From Me',    title: 'Things I Never Want to Forget' },
  openwhen:      { folio: 'The Drawer',      title: 'Open When' },
  wishes:        { folio: 'The Wish List',   title: 'Things We Want' },
  calendar:      { folio: 'The Calendar',    title: 'Days Worth Keeping' },
  wordgame:      { folio: 'The Parlour',     title: 'The Word Game' },
  epilogue:      { folio: 'The End For Now',  title: 'But Not Really' },
};

/* ── AUDIO ───────────────────────────────────────────────────────────────
   Erik Satie, Gymnopédie No. 1.

   Both layers are clear, which is what matters — a public-domain composition
   played on a copyrighted recording would still be a copyrighted recording:

     composition  Satie died 1925 → public domain worldwide
     recording    Creative Commons CC0 1.0 Universal, all rights waived
                  https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg

   CC0 imposes no obligations at all: no attribution, no share-alike, no
   restriction on commercial use. The file is self-hosted rather than
   hotlinked, so there is no external dependency and nothing to break.

   `attribution: null` means no credit line renders. If you ever swap in a
   CC-BY track, put the credit here and it reappears in the colophon. */
export const AUDIO = {
  src: 'assets/audio/gymnopedie-no1.mp3',
  title: 'Gymnopédie No. 1',
  composer: 'Erik Satie',
  attribution: null,
  attributionHref: null,
};
