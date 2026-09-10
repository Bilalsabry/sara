/* ============================================================================
   /api/board — the one thing on this site that two people share.
   ----------------------------------------------------------------------------
   The wish list and the calendar have to be writable from both phones and
   have to last for years, which localStorage and ntfy cannot do. This talks
   to a Vercel-connected Redis store over its REST API, so it needs no npm
   dependency and the project keeps its no-build-step promise.

   SETUP, once, in the Vercel dashboard: Storage -> Create Database -> Upstash
   Redis (free tier) -> connect it to this project. Vercel injects the two
   environment variables below; nothing else is needed and no key ever reaches
   the browser. Until that is done this endpoint answers 503 and the pages
   fall back to a local-only copy, saying so plainly.

   Access: this endpoint is as private as the site's URL, exactly like the
   ntfy topics. The caps below exist so that someone who finds it cannot use
   it as free storage, not because they make it secret.
   ========================================================================== */

const KEYS = { wishes: 'kingdom:wishes', days: 'kingdom:days' };

const LIMITS = {
  wishes: 300,
  days: 800,
  text: 240,
  note: 600,
  title: 160,
  body: 16 * 1024,      // a request larger than this is not one of ours
};

function store() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function read(s, key) {
  const res = await fetch(`${s.url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${s.token}` },
  });
  if (!res.ok) throw new Error(`store read ${res.status}`);
  const { result } = await res.json();
  if (!result) return [];
  try {
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    /* Never throw away what is there because one read came back malformed. */
    throw new Error('store holds unreadable data');
  }
}

async function write(s, key, value) {
  const res = await fetch(`${s.url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${s.token}` },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`store write ${res.status}`);
}

/* ── shaping ─────────────────────────────────────────────────────────────── */
const clean = (v, max) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

const who = v => (v === 'B' || v === 'S' ? v : '');

const id = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const isDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/* ── operations ──────────────────────────────────────────────────────────── */
const OPS = {
  'add-wish'(wishes, p) {
    const text = clean(p.text, LIMITS.text);
    if (!text) return { error: 'A wish needs some words.' };
    if (wishes.length >= LIMITS.wishes) return { error: 'The list is full.' };
    wishes.unshift({
      id: id(),
      text,
      kind: p.kind === 'do' ? 'do' : 'have',
      by: who(p.by),
      at: Date.now(),
      done: null,
    });
    return { wishes };
  },

  'toggle-wish'(wishes, p) {
    const w = wishes.find(x => x.id === p.id);
    if (!w) return { error: 'That wish is no longer on the list.' };
    w.done = w.done ? null : Date.now();
    return { wishes };
  },

  'remove-wish'(wishes, p) {
    const i = wishes.findIndex(x => x.id === p.id);
    if (i < 0) return { error: 'That wish is no longer on the list.' };
    wishes.splice(i, 1);
    return { wishes };
  },
};

const DAY_OPS = {
  'add-day'(days, p) {
    const title = clean(p.title, LIMITS.title);
    if (!isDate(p.date)) return { error: 'That date did not come through.' };
    if (!title) return { error: 'A day needs a few words.' };
    if (days.length >= LIMITS.days) return { error: 'The calendar is full.' };
    days.push({
      id: id(),
      date: p.date,
      title,
      note: clean(p.note, LIMITS.note),
      by: who(p.by),
      at: Date.now(),
    });
    days.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.at - a.at));
    return { days };
  },

  'edit-day'(days, p) {
    const d = days.find(x => x.id === p.id);
    if (!d) return { error: 'That day is no longer in the calendar.' };
    if (p.title !== undefined) {
      const title = clean(p.title, LIMITS.title);
      if (!title) return { error: 'A day needs a few words.' };
      d.title = title;
    }
    if (p.note !== undefined) d.note = clean(p.note, LIMITS.note);
    if (p.date !== undefined) {
      if (!isDate(p.date)) return { error: 'That date did not come through.' };
      d.date = p.date;
      days.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.at - a.at));
    }
    return { days };
  },

  'remove-day'(days, p) {
    const i = days.findIndex(x => x.id === p.id);
    if (i < 0) return { error: 'That day is no longer in the calendar.' };
    days.splice(i, 1);
    return { days };
  },
};

/* ── handler ─────────────────────────────────────────────────────────────── */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const s = store();
  if (!s) {
    return res.status(503).json({
      ok: false,
      reason: 'no-store',
      error: 'No store is connected to this project yet.',
    });
  }

  try {
    if (req.method === 'GET') {
      const [wishes, days] = await Promise.all([
        read(s, KEYS.wishes),
        read(s, KEYS.days),
      ]);
      return res.status(200).json({ ok: true, wishes, days });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ ok: false, error: 'Method not allowed.' });
    }

    /* Vercel parses JSON bodies itself, but a string body turns up when the
       content type is anything else, so handle both. */
    let p = req.body;
    if (typeof p === 'string') {
      if (p.length > LIMITS.body) {
        return res.status(413).json({ ok: false, error: 'That is too long.' });
      }
      try { p = JSON.parse(p); } catch (e) { p = null; }
    }
    if (!p || typeof p !== 'object') {
      return res.status(400).json({ ok: false, error: 'Nothing to save.' });
    }

    const op = p.op;
    if (OPS[op]) {
      const wishes = await read(s, KEYS.wishes);
      const out = OPS[op](wishes, p);
      if (out.error) return res.status(400).json({ ok: false, error: out.error });
      await write(s, KEYS.wishes, out.wishes);
      return res.status(200).json({ ok: true, wishes: out.wishes });
    }

    if (DAY_OPS[op]) {
      const days = await read(s, KEYS.days);
      const out = DAY_OPS[op](days, p);
      if (out.error) return res.status(400).json({ ok: false, error: out.error });
      await write(s, KEYS.days, out.days);
      return res.status(200).json({ ok: true, days: out.days });
    }

    return res.status(400).json({ ok: false, error: 'Nothing to save.' });
  } catch (err) {
    /* The message is ours, never the store's — it can carry internals. */
    return res.status(502).json({
      ok: false,
      reason: 'store-error',
      error: 'The store could not be reached.',
    });
  }
};
