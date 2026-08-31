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
    focal: '58% 38%',
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
    src: 'assets/images/letter-plate.jpg',
    alt: '',
    label: 'ADD PHOTO',
    ratio: '4 / 5',
    focal: '50% 28%',
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
    id: 'archive-04',
    src: 'assets/images/archive-shrine.jpg',
    alt: 'Standing together in the gardens, blue sky above',
    label: 'ARTWORK SCAN',
    scale: 'detail',
    ratio: '4 / 5',
    focal: '50% 62%',
    title: 'The gardens',
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
  titleBottom: 'made for her',
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
    blurb: 'The colours she loves. The things she creates. The world through her eyes.',
    link: 'Browse the archive',
  },
  {
    key: 'map', folio: 'III', title: 'The Map',
    blurb: 'Every place. Every moment. Every chapter of us.',
    link: 'Explore the map',
  },
  {
    key: 'constellation', folio: 'IV', title: 'Her Constellation',
    blurb: 'A universe of everything that makes her, her.',
    link: 'Explore her stars',
  },
  {
    key: 'fireheart', folio: 'V', title: 'Fireheart',
    blurb: 'She is fire and starlight. A rare combination. A force of her own.',
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
  initial: 'B',
  tapedNote: ['for the one', 'who makes', 'ordinary days', 'extraordinary ♡'],
};

/* ── CHAPTER II · AN ARTIST'S ARCHIVE ────────────────────────────────────── */
export const ARCHIVE_TEXT = {
  caption: 'A few pieces from her world.',
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
  initial: 'B',
  date: '15 · 06 · 2026',
  restart: 'Return to the beginning',
  cornerNote: ['To my', 'Fireheart.', 'Forever. ♡'],
};

/* ── HOMEPAGE FOOTER ─────────────────────────────────────────────────────── */
export const FOOTER = {
  lines: ['There are still pages missing.', 'I hope there always will be.'],
  signature: '— for sara, always ♡',
};

/* ── PAGE ORDER (drives Prev/Next) ───────────────────────────────────────── */
export const PAGE_ORDER = [
  'letter', 'archive', 'map', 'constellation', 'fireheart',
  'library', 'marginalia', 'soundtrack', 'little', 'notes', 'epilogue',
];

export const PAGE_META = {
  letter:        { folio: 'Chapter I',        title: 'The Letter' },
  archive:       { folio: 'Chapter II',       title: "An Artist's Archive" },
  map:           { folio: 'Chapter III',      title: 'The Map' },
  constellation: { folio: 'Chapter IV',       title: 'Her Constellation' },
  fireheart:     { folio: 'Chapter V',        title: 'Fireheart' },
  library:       { folio: 'The Library',      title: 'The Stories We Love' },
  marginalia:    { folio: 'Marginalia',       title: "Lines I'll Never Forget" },
  soundtrack:    { folio: 'Our Soundtrack',   title: 'Songs That Found Us' },
  little:        { folio: 'The Little Things',title: 'Her, in bits and pieces' },
  notes:         { folio: 'Notes From Me',    title: 'Things I Never Want to Forget' },
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
