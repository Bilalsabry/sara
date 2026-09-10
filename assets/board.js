/* ============================================================================
   board.js — the shared shelf behind the wish list and the calendar.
   ----------------------------------------------------------------------------
   Everything else on this site is hers alone on her own device. These two
   pages are the exception: both of them write, and it has to still be there
   in ten years. That means a real store, which means it can be unreachable,
   which means every path through here has to answer for that.

   The rules it keeps:
   · A local mirror is written on every change, so the pages render instantly
     and keep working with no signal at all.
   · A change is applied locally first and sent afterwards. If the send fails
     it is queued and retried, so nothing she types is lost to a dead lift.
   · The server's answer is the truth. When it replies, its list replaces the
     local one — that is how his phone and hers converge.
   ========================================================================== */

const ENDPOINT = '/api/board';
const MIRROR = 'kingdom-board-mirror';
const QUEUE = 'kingdom-board-queue';

/* 'idle'    before the first reply
   'live'    talking to the store
   'local'   a store exists but is unreachable — changes are held and retried
   'nostore' none connected yet — changes are held too, and land the moment
             one is, but the page must not promise a sync that cannot happen */
let mode = 'idle';
let state = { wishes: [], days: [] };
const listeners = new Set();

/* ── the local mirror ────────────────────────────────────────────────────── */
function loadMirror() {
  try {
    const raw = JSON.parse(localStorage.getItem(MIRROR));
    if (raw && Array.isArray(raw.wishes) && Array.isArray(raw.days)) return raw;
  } catch (e) { /* private window, or nothing there yet */ }
  return { wishes: [], days: [] };
}
function saveMirror() {
  try { localStorage.setItem(MIRROR, JSON.stringify(state)); } catch (e) {}
}

function loadQueue() {
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE));
    return Array.isArray(q) ? q : [];
  } catch (e) { return []; }
}
function saveQueue(q) {
  try { localStorage.setItem(QUEUE, JSON.stringify(q.slice(-100))); } catch (e) {}
}

/* ── telling the pages ───────────────────────────────────────────────────── */
function announce() {
  for (const fn of listeners) {
    try { fn(state, mode); } catch (e) { /* one bad listener must not stop the rest */ }
  }
}

export function subscribe(fn) {
  listeners.add(fn);
  fn(state, mode);
  return () => listeners.delete(fn);
}

export const snapshot = () => state;
export const status = () => mode;

/* ── talking to the store ────────────────────────────────────────────────── */
async function send(payload) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}

  if (res.ok && data && data.ok) return data;

  /* 400 means the store is fine and this change is not: a wish deleted on the
     other phone, or something that failed validation. Retrying would never
     help, so the caller is told to drop it. */
  const permanent = res.status >= 400 && res.status < 500;
  const err = new Error((data && data.error) || 'That did not save.');
  err.permanent = permanent;
  err.noStore = data && data.reason === 'no-store';
  throw err;
}

function absorb(data) {
  if (Array.isArray(data.wishes)) state.wishes = data.wishes;
  if (Array.isArray(data.days)) state.days = data.days;
  saveMirror();
}

/* ── the queue of changes that have not landed yet ───────────────────────── */
let flushing = false;

async function flush() {
  if (flushing) return;
  flushing = true;
  try {
    let q = loadQueue();
    while (q.length) {
      try {
        const data = await send(q[0]);
        absorb(data);
        q.shift();
        saveQueue(q);
        if (mode !== 'live') { mode = 'live'; }
      } catch (err) {
        if (err.permanent) {
          /* Drop it and carry on; the next refresh shows the truth. */
          q.shift();
          saveQueue(q);
          continue;
        }
        mode = err.noStore ? 'nostore' : 'local';
        break;
      }
    }
    if (!q.length && mode !== 'live') mode = 'live';
  } finally {
    flushing = false;
    announce();
  }
}

/* ── what the pages call ─────────────────────────────────────────────────── */

/* Apply the change to the local copy at once so the page never waits, then
   put it on the queue. `optimistic` mutates a copy of state in place. */
export function change(payload, optimistic) {
  if (typeof optimistic === 'function') {
    optimistic(state);
    saveMirror();
    announce();
  }
  const q = loadQueue();
  q.push(payload);
  saveQueue(q);
  return flush();
}

export async function refresh() {
  try {
    const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
    const data = await res.json().catch(() => null);
    if (res.ok && data && data.ok) {
      absorb(data);
      /* Anything still queued has not been applied to what just arrived, so
         do not claim to be in step until the queue drains. */
      mode = loadQueue().length ? 'local' : 'live';
      announce();
      return flush();
    }
    mode = data && data.reason === 'no-store' ? 'nostore' : 'local';
  } catch (e) {
    mode = 'local';
  }
  announce();
}

export function start() {
  state = loadMirror();
  announce();
  refresh();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
  addEventListener('online', () => refresh());
}
