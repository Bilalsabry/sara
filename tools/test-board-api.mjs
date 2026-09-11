/* Executes api/board.js for real, against a fake Redis behind a stubbed
   fetch. The serverless function is the one piece of this site a browser
   check cannot reach, so this is its test.

       node tools/test-board-api.mjs

   No dependencies, no network, no Vercel. Exits non-zero on failure. */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const REDIS = new Map();
let failNext = null;

global.fetch = async (url, opts = {}) => {
  if (failNext) { const f = failNext; failNext = null; return f; }
  const u = new URL(url);
  const [, verb, key] = u.pathname.split('/');
  if (!String(opts.headers?.Authorization || '').startsWith('Bearer ')) {
    return { ok: false, status: 401, json: async () => ({}) };
  }
  if (verb === 'get') {
    return { ok: true, status: 200, json: async () => ({ result: REDIS.get(decodeURIComponent(key)) ?? null }) };
  }
  if (verb === 'set') {
    REDIS.set(decodeURIComponent(key), opts.body);
    return { ok: true, status: 200, json: async () => ({ result: 'OK' }) };
  }
  return { ok: false, status: 404, json: async () => ({}) };
};

function mkRes() {
  const r = { code: 0, body: null, headers: {} };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.status = c => { r.code = c; return r; };
  r.json = b => { r.body = b; return r; };
  return r;
}
const call = async (handler, method, body) => {
  const res = mkRes();
  await handler({ method, body }, res);
  return res;
};

let pass = 0, fail = 0;
const check = (name, cond, extra = '') => {
  (cond ? pass++ : fail++);
  console.log(`${cond ? ' ok ' : 'FAIL'}  ${name}${cond ? '' : '  <- ' + extra}`);
};

/* ── with no store connected ─────────────────────────────────────────────── */
delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN;
let handler = require('/home/user/sara/api/board.js');
let r = await call(handler, 'GET');
check('no store -> 503 no-store', r.code === 503 && r.body.reason === 'no-store', JSON.stringify(r.body));
check('diagnostic lists names only, no values',
  Array.isArray(r.body.looked) && !JSON.stringify(r.body.looked).includes('secret'));

/* ── connected, exactly as Vercel named them ─────────────────────────────── */
process.env.KV_REST_API_URL = 'https://fake.upstash.io';
process.env.KV_REST_API_TOKEN = 'secret-token-value';
process.env.KV_REST_API_READ_ONLY_TOKEN = 'read-only-should-not-be-used';

r = await call(handler, 'GET');
check('empty store -> ok with empty lists',
  r.code === 200 && r.body.ok && r.body.wishes.length === 0 && r.body.days.length === 0, JSON.stringify(r.body));

r = await call(handler, 'POST', { op: 'add-wish', text: '  a proper   bookshelf  ', kind: 'have', by: 'S' });
check('add-wish normalises whitespace',
  r.code === 200 && r.body.wishes[0].text === 'a proper bookshelf', JSON.stringify(r.body.wishes[0]));
const wid = r.body.wishes[0].id;

r = await call(handler, 'POST', { op: 'add-wish', text: 'see the northern lights', kind: 'do', by: 'S' });
check('newest wish first', r.body.wishes[0].text === 'see the northern lights' && r.body.wishes.length === 2);

r = await call(handler, 'POST', { op: 'toggle-wish', id: wid });
check('toggle marks granted', !!r.body.wishes.find(w => w.id === wid).done);
r = await call(handler, 'POST', { op: 'toggle-wish', id: wid });
check('toggle again un-grants', !r.body.wishes.find(w => w.id === wid).done);

r = await call(handler, 'POST', { op: 'toggle-wish', id: 'nope' });
check('unknown id -> 400 (client drops it)', r.code === 400, JSON.stringify(r.body));

r = await call(handler, 'POST', { op: 'add-wish', text: '   ' });
check('blank wish rejected', r.code === 400);

r = await call(handler, 'POST', { op: 'add-day', date: '2026-01-08', title: 'the day we started', note: 'x', by: 'B' });
check('add-day accepted', r.code === 200 && r.body.days.length === 1, JSON.stringify(r.body));
r = await call(handler, 'POST', { op: 'add-day', date: '08/01/2026', title: 'bad date' });
check('malformed date rejected', r.code === 400);
r = await call(handler, 'POST', { op: 'add-day', date: '2026-06-01', title: 'later day' });
check('days sort newest first', r.body.days[0].date === '2026-06-01', JSON.stringify(r.body.days.map(d=>d.date)));

r = await call(handler, 'POST', { op: 'add-wish', text: 'x'.repeat(500) });
check('over-long text is capped, not rejected', r.code === 200 && r.body.wishes[0].text.length === 240);

r = await call(handler, 'POST', { op: 'add-wish', text: 'who am i', by: 'hacker' });
check('unknown author discarded', r.body.wishes[0].by === '');

r = await call(handler, 'POST', '{"op":"add-wish","text":"string body"}');
check('string body parsed', r.code === 200 && r.body.wishes[0].text === 'string body');

r = await call(handler, 'PUT', {});
check('PUT -> 405', r.code === 405 && r.headers.Allow);
r = await call(handler, 'POST', { op: 'drop-everything' });
check('unknown op -> 400', r.code === 400);

/* ── the store itself failing ────────────────────────────────────────────── */
failNext = { ok: false, status: 500, json: async () => ({}) };
r = await call(handler, 'GET');
check('store error -> 502, message is ours',
  r.code === 502 && r.body.reason === 'store-error' && !JSON.stringify(r.body).includes('500'), JSON.stringify(r.body));

/* ── data survives across calls (it is really in the fake redis) ─────────── */
r = await call(handler, 'GET');
check('data persisted between requests', r.body.wishes.length >= 4 && r.body.days.length === 2);
check('never wrote the read-only token anywhere',
  !JSON.stringify([...REDIS.values()]).includes('read-only-should-not-be-used'));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
