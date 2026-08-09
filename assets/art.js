/* ============================================================================
   art.js — original line work and generated ink.
   Everything here is drawn from primitives. No traced or copyrighted artwork.
   ========================================================================== */

/* ── Deterministic PRNG ──────────────────────────────────────────────────
   Seeded so a given composition renders identically on every load — the ink
   is a fixed piece of art, not noise that changes under the reader. */
export function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ── ORGANIC TORN EDGE ───────────────────────────────────────────────────
   A CSS clip-path polygon can only join straight segments, which is why the
   previous edge read as a zigzag. These are cubic Bézier paths in
   objectBoundingBox units, so one path scales to any panel size.
   Amplitude varies between ~0.018 and ~0.068 and the curvature never repeats,
   which is what stops the eye finding a rhythm. */
export const TEAR_VERTICAL =
  'M0.052,0 ' +
  'C0.031,0.024 0.059,0.049 0.042,0.074 C0.025,0.099 0.048,0.121 0.036,0.148 ' +
  'C0.024,0.175 0.063,0.196 0.048,0.222 C0.033,0.248 0.020,0.269 0.038,0.294 ' +
  'C0.056,0.319 0.029,0.343 0.044,0.369 C0.059,0.395 0.026,0.417 0.039,0.443 ' +
  'C0.052,0.469 0.034,0.494 0.051,0.520 C0.068,0.546 0.027,0.567 0.042,0.594 ' +
  'C0.057,0.621 0.023,0.641 0.037,0.668 C0.051,0.695 0.062,0.716 0.045,0.742 ' +
  'C0.028,0.768 0.053,0.791 0.038,0.817 C0.023,0.843 0.058,0.866 0.043,0.892 ' +
  'C0.028,0.918 0.047,0.942 0.033,0.966 C0.024,0.982 0.040,0.991 0.035,1 ' +
  'L1,1 L1,0 Z';

/* Simplified, shallower tear for narrow screens (horizontal, along the top). */
export const TEAR_HORIZONTAL =
  'M0,0.058 ' +
  'C0.041,0.034 0.083,0.062 0.124,0.043 C0.165,0.024 0.207,0.055 0.248,0.038 ' +
  'C0.289,0.021 0.331,0.058 0.372,0.044 C0.413,0.030 0.455,0.061 0.496,0.046 ' +
  'C0.537,0.031 0.579,0.057 0.620,0.042 C0.661,0.027 0.703,0.060 0.744,0.045 ' +
  'C0.785,0.030 0.827,0.056 0.868,0.041 C0.909,0.026 0.951,0.054 1,0.038 ' +
  'L1,1 L0,1 Z';

/* Fine fibres that sell the tear as paper rather than a cut. */
export function tearFibres(rnd, count = 26) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const y = i / count + rnd() * 0.012;
    const x = 0.030 + rnd() * 0.030;
    const len = 0.006 + rnd() * 0.014;
    d += `M${x.toFixed(4)},${y.toFixed(4)} l${len.toFixed(4)},${((rnd() - 0.5) * 0.006).toFixed(4)} `;
  }
  return d;
}

/* ── HERALDIC STAG ───────────────────────────────────────────────────────
   An engraved-plate interpretation: angular skull planes, straight beam
   antlers with distinct tines. Deliberately not a soft cartoon deer. */
export function stagSVG({ size = 108, stroke = 'currentColor', width = 1 } = {}) {
  return `
<svg width="${size}" height="${Math.round(size * 0.92)}" viewBox="0 0 120 110" fill="none"
     stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true" focusable="false">
  <!-- skull: faceted, narrowing to the muzzle -->
  <path d="M60 92 L52 84 L48.5 70 L50 58 L54 50 L60 46 L66 50 L70 58 L71.5 70 L68 84 Z"/>
  <path d="M50 58 L60 62 L70 58"/>
  <path d="M54 50 L60 62 L66 50"/>
  <!-- eyes: engraved slivers, not dots -->
  <path d="M53.5 65.5 L57 66.8" stroke-width="${width * 1.5}"/>
  <path d="M66.5 65.5 L63 66.8" stroke-width="${width * 1.5}"/>
  <!-- muzzle -->
  <path d="M57 84 L60 87 L63 84"/>
  <path d="M58.5 79 L60 80.5 L61.5 79"/>
  <!-- ears, swept back -->
  <path d="M49.5 61 C43 57 36 57.5 31 61 C36 65 43.5 65.5 48 63"/>
  <path d="M70.5 61 C77 57 84 57.5 89 61 C84 65 76.5 65.5 72 63"/>
  <!-- left antler: straight beam, four tines -->
  <path d="M52 52 L44 40 L38 26 L35 12"/>
  <path d="M44 40 L31 36 L20 33"/>
  <path d="M40 31 L28 24 L18 20"/>
  <path d="M38 26 L26 25 L15 28"/>
  <path d="M35 12 L28 6"/>
  <path d="M36 18 L25 13"/>
  <!-- right antler mirrored -->
  <path d="M68 52 L76 40 L82 26 L85 12"/>
  <path d="M76 40 L89 36 L100 33"/>
  <path d="M80 31 L92 24 L102 20"/>
  <path d="M82 26 L94 25 L105 28"/>
  <path d="M85 12 L92 6"/>
  <path d="M84 18 L95 13"/>
  <!-- engraver's hatching under the jaw -->
  <path d="M55 88 L57 91 M60 89 L60 92.5 M65 88 L63 91" stroke-width="${width * 0.7}" opacity=".6"/>
</svg>`;
}

/* Compact stag for seals and small marks. */
export function stagMarkSVG({ size = 52, stroke = 'currentColor', width = 1.1 } = {}) {
  return `
<svg width="${size}" height="${Math.round(size * 0.92)}" viewBox="0 0 120 110" fill="none"
     stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true" focusable="false">
  <path d="M60 92 L52 84 L48.5 70 L50 58 L54 50 L60 46 L66 50 L70 58 L71.5 70 L68 84 Z"/>
  <path d="M49.5 61 C43 57 36 57.5 31 61 M70.5 61 C77 57 84 57.5 89 61"/>
  <path d="M52 52 L44 40 L38 26 L35 12 M44 40 L31 36 M40 31 L28 24 M38 26 L26 25"/>
  <path d="M68 52 L76 40 L82 26 L85 12 M76 40 L89 36 M80 31 L92 24 M82 26 L94 25"/>
</svg>`;
}

/* ── BOTANICALS ──────────────────────────────────────────────────────────
   Two deliberate drawings rather than a scatter of generic florals:
   a pressed stem silhouette and a faint graphite sprig. Asymmetric on purpose. */
export function pressedStemSVG() {
  return `
<svg viewBox="0 0 108 220" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width=".9" stroke-linecap="round">
    <path d="M58 218 C55 176 50 142 43 112 C38 90 31 68 22 50"/>
    <path d="M48 152 C36 145 25 147 17 156"/>
    <path d="M52 176 C64 170 75 172 83 181"/>
    <path d="M44 122 C33 117 24 119 17 127"/>
  </g>
  <!-- pressed flower head: filled silhouette, as if flattened under glass -->
  <g fill="currentColor" opacity=".5">
    <ellipse cx="22" cy="46" rx="4.4" ry="7.6" transform="rotate(-24 22 46)"/>
    <ellipse cx="14" cy="39" rx="3.6" ry="6.8" transform="rotate(-62 14 39)"/>
    <ellipse cx="30" cy="38" rx="3.6" ry="6.8" transform="rotate(24 30 38)"/>
    <ellipse cx="17" cy="55" rx="3.4" ry="6.2" transform="rotate(-108 17 55)"/>
    <ellipse cx="29" cy="54" rx="3.4" ry="6.2" transform="rotate(112 29 54)"/>
  </g>
  <circle cx="22.5" cy="46.5" r="2.1" fill="currentColor" opacity=".8"/>
  <g stroke="currentColor" stroke-width=".7" opacity=".55">
    <path d="M83 181 C88 176 90 169 88 162"/>
    <path d="M17 156 C12 152 10 145 12 138"/>
  </g>
</svg>`;
}

export function graphiteSprigSVG() {
  return `
<svg viewBox="0 0 86 132" fill="none" stroke="currentColor" stroke-width=".8"
     stroke-linecap="round" aria-hidden="true" focusable="false">
  <path d="M40 130 C39 102 36 78 30 58 C26 44 20 32 12 22"/>
  <g opacity=".85">
    <path d="M33 74 C25 68 17 69 11 76 C18 81 27 80 33 74 Z"/>
    <path d="M37 94 C46 89 55 91 60 98 C52 102 42 100 37 94 Z"/>
    <path d="M29 56 C22 51 15 52 10 58 C16 62 24 61 29 56 Z"/>
  </g>
  <path d="M12 22 C9 16 10 9 15 4" opacity=".7"/>
  <circle cx="15.5" cy="3.5" r="1.7" fill="currentColor" opacity=".65"/>
</svg>`;
}

/* ── INK ─────────────────────────────────────────────────────────────────
   Real ink has a dense core and a ragged, feathered rim. Building it from a
   wobbled blob path plus edge stippling reads as pigment; a plain radial
   gradient reads as fog. */
function blobPath(ctx, cx, cy, rad, rnd, rough, squash = 1) {
  const n = 30, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = 1 - rough * 0.5 +
      rough * (0.35 * Math.sin(a * 3 + rnd() * 0.4) + 0.35 * Math.sin(a * 7) + 0.3 * rnd());
    pts.push([cx + Math.cos(a) * rad * w, cy + Math.sin(a) * rad * w * squash]);
  }
  ctx.beginPath();
  ctx.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  ctx.closePath();
}

export function inkMass(ctx, cx, cy, rad, rgb, rnd, opts = {}) {
  const { core = 0.72, squash = 1, rough = 0.34, feather = 320 } = opts;
  blobPath(ctx, cx, cy, rad, rnd, rough, squash);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  g.addColorStop(0,    `rgba(${rgb},${core})`);
  g.addColorStop(0.55, `rgba(${rgb},${core * 0.82})`);
  g.addColorStop(0.86, `rgba(${rgb},${core * 0.34})`);
  g.addColorStop(1,    `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fill();
  for (let i = 0; i < feather; i++) {
    const a = rnd() * Math.PI * 2;
    const d = rad * (0.72 + rnd() * 0.42);
    const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * squash;
    const r = rad * 0.05 * (0.3 + rnd() * 1.5);
    const al = (1 - Math.min(1, (d / rad - 0.72) / 0.42)) * core * 0.5;
    const g2 = ctx.createRadialGradient(px, py, 0, px, py, r);
    g2.addColorStop(0, `rgba(${rgb},${al})`);
    g2.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  }
}

/* Fireheart: a diagonal charcoal sweep bleeding into oxblood, threaded with
   a little aged brass. No flame, no figure, no red-orange gradient. */
export function paintFireheart(canvas, { compact = false, seed = 20260615 } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height, S = Math.min(W, H);
  const rnd = seeded(seed);
  const n = compact ? 1 : 1.6;

  ctx.fillStyle = '#EFEADF';
  ctx.fillRect(0, 0, W, H);

  [[0.10, 0.28], [0.26, 0.36], [0.42, 0.46], [0.56, 0.56], [0.68, 0.66], [0.80, 0.76]]
    .forEach(([ax, ay], i, arr) => {
      const t = i / (arr.length - 1);
      inkMass(ctx, W * ax, H * ay, S * (0.30 - t * 0.06), '24,26,23', rnd,
        { core: 0.80 - t * 0.12, squash: 0.72, rough: 0.40, feather: Math.round(160 * n) });
    });
  inkMass(ctx, W * 0.44, H * 0.48, S * 0.24, '14,15,13', rnd,
    { core: 0.72, squash: 0.60, rough: 0.46, feather: Math.round(115 * n) });
  inkMass(ctx, W * 0.62, H * 0.60, S * 0.20, '18,19,17', rnd,
    { core: 0.62, squash: 0.62, rough: 0.48, feather: Math.round(95 * n) });

  inkMass(ctx, W * 0.74, H * 0.74, S * 0.26, '111,47,43', rnd,
    { core: 0.62, squash: 0.78, rough: 0.42, feather: Math.round(135 * n) });
  inkMass(ctx, W * 0.86, H * 0.86, S * 0.19, '132,40,36', rnd,
    { core: 0.55, squash: 0.80, rough: 0.46, feather: Math.round(95 * n) });
  inkMass(ctx, W * 0.66, H * 0.84, S * 0.14, '88,28,26', rnd,
    { core: 0.44, squash: 0.85, rough: 0.50, feather: Math.round(65 * n) });

  /* an ivory reserve keeps it a wash rather than a solid block */
  inkMass(ctx, W * 0.24, H * 0.70, S * 0.20, '239,234,223', rnd,
    { core: 0.50, squash: 0.80, rough: 0.50, feather: Math.round(75 * n) });

  ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    let px = W * (0.02 + rnd() * 0.10), py = H * (0.24 + k * 0.10 + rnd() * 0.03);
    ctx.beginPath(); ctx.moveTo(px, py);
    for (let i = 0; i < 11; i++) {
      const nx = px + W * (0.07 + rnd() * 0.06);
      const ny = py + H * (0.035 + rnd() * 0.045) + (rnd() - 0.5) * H * 0.03;
      ctx.quadraticCurveTo(px + (nx - px) * 0.5, py + (rnd() - 0.5) * H * 0.045, nx, ny);
      px = nx; py = ny;
    }
    ctx.strokeStyle = `rgba(150,116,58,${0.82 - k * 0.11})`;
    ctx.lineWidth = (compact ? 2.4 : 3.6) - k * 0.45; ctx.stroke();
    ctx.strokeStyle = `rgba(206,176,116,${0.86 - k * 0.13})`;
    ctx.lineWidth = (compact ? 1 : 1.5) - k * 0.18; ctx.stroke();
  }

  for (let i = 0; i < (compact ? 120 : 210); i++) {
    ctx.fillStyle = `rgba(20,22,19,${0.03 + rnd() * 0.15})`;
    ctx.beginPath();
    ctx.arc(rnd() * W, H * 0.18 + rnd() * H * 0.76, rnd() * 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  /* graphite ridge — line drawing only */
  ctx.strokeStyle = 'rgba(35,38,31,.30)';
  ctx.lineWidth = 1; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.93); ctx.lineTo(W * 0.09, H * 0.81); ctx.lineTo(W * 0.16, H * 0.88);
  ctx.lineTo(W * 0.25, H * 0.76); ctx.lineTo(W * 0.35, H * 0.93);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.06, H * 0.93); ctx.lineTo(W * 0.13, H * 0.85); ctx.lineTo(W * 0.19, H * 0.91);
  ctx.stroke();
}

/* Constellation ground: an ink wash on paper, not a digital starfield. */
export function paintConstellation(canvas, stars, { compact = false, seed = 48271 } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const rnd = seeded(seed);

  const bg = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.62);
  bg.addColorStop(0, '#22352A'); bg.addColorStop(0.55, '#16241B'); bg.addColorStop(1, '#0F1811');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  /* a fixed scatter of faint grains — no per-frame twinkle */
  for (let i = 0; i < (compact ? 260 : 460); i++) {
    ctx.fillStyle = `rgba(238,228,204,${0.05 + rnd() * 0.4})`;
    ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, rnd() * 1.2, 0, Math.PI * 2); ctx.fill();
  }

  /* ink-washed tree line grounding the base */
  ctx.fillStyle = 'rgba(11,17,12,.85)';
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 14) {
    const h = H - (22 + rnd() * 46);
    ctx.lineTo(x, h); ctx.lineTo(x + 7, h + (10 + rnd() * 16));
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  const cx = W / 2, cy = H * 0.5;
  ctx.strokeStyle = 'rgba(164,133,77,.2)'; ctx.lineWidth = 0.8;
  [90, 150, 210, 270].forEach(r => {
    ctx.beginPath(); ctx.arc(cx, cy, r * (W / 900), 0, Math.PI * 2); ctx.stroke();
  });

  /* imperfect connecting lines, hand-drawn rather than ruled */
  ctx.strokeStyle = 'rgba(164,133,77,.34)';
  stars.forEach(s => {
    const mx = (cx + s.x) / 2 + (rnd() - 0.5) * 10;
    const my = (cy + s.y) / 2 + (rnd() - 0.5) * 10;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(mx, my, s.x, s.y); ctx.stroke();
  });

  /* centre compass rose */
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    const len = (i % 2 === 0 ? 76 : 34) * (W / 900);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(5, -len * 0.3); ctx.lineTo(0, -len); ctx.lineTo(-5, -len * 0.3);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(244,233,206,.93)' : 'rgba(196,172,120,.62)';
    ctx.fill();
  }
  const gl = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
  gl.addColorStop(0, 'rgba(246,236,208,.46)'); gl.addColorStop(1, 'rgba(246,236,208,0)');
  ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  stars.forEach(s => {
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 22);
    g.addColorStop(0, 'rgba(242,230,200,.5)'); g.addColorStop(1, 'rgba(242,230,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, 22, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── CHAPTER-CARD VIGNETTES ──────────────────────────────────────────────── */
export function paintMapCard(canvas) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(35,38,31,.44)'; ctx.lineWidth = 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  [[.10, .42, .20], [.34, .30, .24], [.60, .44, .20], [.20, .66, .18], [.62, .70, .16]]
    .forEach(([px, py, s]) => {
      const bx = px * W, by = py * H, w = s * W;
      ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx + w * .34, by - w * .52);
      ctx.lineTo(bx + w * .56, by - w * .20); ctx.lineTo(bx + w * .74, by - w * .42);
      ctx.lineTo(bx + w, by); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + w * .22, by); ctx.lineTo(bx + w * .36, by - w * .30);
      ctx.lineTo(bx + w * .50, by - w * .06); ctx.stroke();
    });

  ctx.strokeStyle = 'rgba(164,133,77,.8)'; ctx.setLineDash([2, 5]);
  ctx.beginPath();
  ctx.moveTo(W * .14, H * .36);
  ctx.bezierCurveTo(W * .34, H * .30, W * .52, H * .42, W * .72, H * .40);
  ctx.bezierCurveTo(W * .86, H * .39, W * .90, H * .56, W * .76, H * .66);
  ctx.bezierCurveTo(W * .58, H * .78, W * .36, H * .74, W * .28, H * .86);
  ctx.stroke(); ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(111,47,43,.85)';
  [[.14, .36], [.72, .40], [.76, .66], [.28, .86], [.44, .36]].forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px * W, py * H, 2.6, 0, Math.PI * 2); ctx.fill();
  });

  ctx.strokeStyle = 'rgba(35,38,31,.5)';
  const cx = W * .46, cy = H * .92, u = W * .024;
  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - u * 4); ctx.lineTo(cx + u, cy - u * 4);
  ctx.lineTo(cx + u, cy - u * 5.4); ctx.lineTo(cx + u * 2, cy - u * 5.4);
  ctx.lineTo(cx + u * 2, cy - u * 4); ctx.lineTo(cx + u * 3.2, cy - u * 4);
  ctx.lineTo(cx + u * 3.2, cy - u * 6.4); ctx.lineTo(cx + u * 4.2, cy - u * 6.4);
  ctx.lineTo(cx + u * 4.2, cy - u * 4); ctx.lineTo(cx + u * 5.4, cy - u * 4);
  ctx.lineTo(cx + u * 5.4, cy - u * 5.4); ctx.lineTo(cx + u * 6.4, cy - u * 5.4);
  ctx.lineTo(cx + u * 6.4, cy - u * 4); ctx.lineTo(cx + u * 7.4, cy - u * 4);
  ctx.lineTo(cx + u * 7.4, cy); ctx.closePath(); ctx.stroke();

  ctx.font = `italic ${Math.round(W * .042)}px Italianno, cursive`;
  ctx.fillStyle = 'rgba(111,47,43,.72)';
  ctx.fillText('where we met', W * .02, H * .26);
  ctx.fillText('the distance', W * .60, H * .60);
  ctx.fillText('where we are now', W * .20, H * .98);
}

export function paintConstellationCard(canvas, seed = 48271) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const rnd = seeded(seed);
  ctx.clearRect(0, 0, W, H);

  inkMass(ctx, W / 2, H * 0.5, W * 0.40, '26,48,36', rnd,
    { core: .94, squash: .96, rough: .30, feather: 380 });
  inkMass(ctx, W * 0.46, H * 0.44, W * 0.28, '16,32,23', rnd,
    { core: .6, squash: .98, rough: .42, feather: 180 });

  const cx = W / 2, cy = H * 0.5;
  const pts = [[.5, .24, 'Books'], [.76, .40, 'Dreams'], [.74, .70, 'Kindness'],
               [.5, .84, 'Jokes'], [.24, .70, 'Songs'], [.24, .40, 'Art']];

  ctx.strokeStyle = 'rgba(196,172,120,.5)'; ctx.lineWidth = .9;
  pts.forEach(p => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p[0] * W, p[1] * H); ctx.stroke(); });

  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    const len = i % 2 === 0 ? W * .09 : W * .04;
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(4, -len * .3); ctx.lineTo(0, -len); ctx.lineTo(-4, -len * .3);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(244,233,206,.94)' : 'rgba(196,172,120,.6)';
    ctx.fill();
  }
  ctx.restore();

  pts.forEach(p => {
    const px = p[0] * W, py = p[1] * H;
    const g = ctx.createRadialGradient(px, py, 0, px, py, 12);
    g.addColorStop(0, 'rgba(244,233,206,.55)'); g.addColorStop(1, 'rgba(244,233,206,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F0E4C6'; ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(243,238,228,.9)';
  ctx.font = `${Math.round(W * .042)}px "Cormorant Garamond", serif`;
  pts.forEach(p => ctx.fillText(p[2], p[0] * W, p[1] * H + (p[1] < .5 ? -14 : 22)));
}

export function paintLetterCard(canvas) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W * 0.5, H * 0.5);
  ctx.rotate(-0.052);
  const w = W * 0.62, h = H * 0.78;
  ctx.fillStyle = '#E2D8C0';
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2 + 3); ctx.lineTo(w / 2 - 2, -h / 2);
  ctx.lineTo(w / 2, h / 2 - 3);   ctx.lineTo(-w / 2 + 2, h / 2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(35,38,31,.17)'; ctx.lineWidth = 1;
  const widths = [.82, .9, .76, .86, .64, .84, .8, .56, .88, .7, .82, .4];
  widths.forEach((wd, i) => {
    const y = -h / 2 + h * 0.14 + i * (h * 0.058);
    ctx.beginPath();
    ctx.moveTo(-w / 2 + w * .1, y);
    ctx.lineTo(-w / 2 + w * .1 + (w * .8) * wd, y);
    ctx.stroke();
  });
  ctx.restore();
}

/* ── ICONS ───────────────────────────────────────────────────────────────── */
const ICON_PATHS = {
  book: '<path d="M2 4.5 C5 3 9 3 12 4.5 C15 3 19 3 22 4.5 L22 19.5 C19 18 15 18 12 19.5 C9 18 5 18 2 19.5 Z"/><path d="M12 4.5 L12 19.5"/>',
  cup: '<path d="M3 8 h13 v6 a5 5 0 0 1 -5 5 h-3 a5 5 0 0 1 -5 -5 z"/><path d="M16 10 h2.5 a2.5 2.5 0 0 1 0 5 H16"/><path d="M7 5 c0 -1 1 -1 1 -2 M11 5 c0 -1 1 -1 1 -2"/>',
  camera: '<rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6 l1.6 -2.6 h4.8 L16 6"/>',
  brush: '<path d="M15.5 3.5 l5 5 L8 21 H3 v-5 z"/><path d="M13.5 5.5 l5 5"/>',
  stars: '<circle cx="5" cy="7" r="1.3"/><circle cx="13" cy="4" r="1.3"/><circle cx="19" cy="10" r="1.3"/><circle cx="9" cy="14" r="1.3"/><circle cx="16" cy="19" r="1.3"/><path d="M5 7 L13 4 L19 10 L9 14 Z M9 14 L16 19"/>',
  headphones: '<path d="M4 15 v-3 a8 8 0 0 1 16 0 v3"/><path d="M4 14 h3 v6 H5 a1 1 0 0 1 -1 -1 z"/><path d="M20 14 h-3 v6 h2 a1 1 0 0 0 1 -1 z"/>',
  moon: '<path d="M20 13.5 A8.5 8.5 0 1 1 10.5 4 a6.6 6.6 0 0 0 9.5 9.5 z"/>',
  leaf: '<path d="M12 21 C12 14 14 9 20 5 C20 12 17 18 12 21 Z"/><path d="M12 21 C12 15 10 11 5 8 C5 14 8 18 12 21 Z"/><path d="M12 21 v-6"/>',
  mountain: '<path d="M2 19 l7 -11 l4.5 6 l3 -4 l5.5 9 z"/><circle cx="17" cy="5.5" r="2"/>',
  crown: '<path d="M3 8 l4 4 l5 -7 l5 7 l4 -4 v10 H3 z"/><circle cx="3" cy="7" r="1"/><circle cx="21" cy="7" r="1"/><circle cx="12" cy="4" r="1"/>',
};

export function icon(name, size = 26) {
  const d = ICON_PATHS[name];
  if (!d) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false">${d}</svg>`;
}

/* Marginalia / notes marks, drawn at a larger canvas than the 24px icons. */
export const MARKS = {
  dagger: '<svg width="26" height="42" viewBox="0 0 26 42" fill="none" stroke="currentColor" stroke-width=".9" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 l3 8 v18 h-6 V10 z"/><path d="M4 28 h18"/><path d="M13 28 v10"/><path d="M10 38 h6"/></svg>',
  sprig: '<svg width="30" height="40" viewBox="0 0 30 34" fill="none" stroke="currentColor" stroke-width=".9" aria-hidden="true"><path d="M15 32 C14 24 12 18 8 13 M15 24 C10 21 6 22 3 26 M15 27 C20 24 24 25 27 29"/><circle cx="8" cy="10" r="3"/><path d="M8 7 C6 3 8 1 11 0 M5 10 C1 8 0 5 1 2 M11 12 C15 12 18 9 19 6"/></svg>',
  crown: '<svg width="34" height="40" viewBox="0 0 34 40" fill="none" stroke="currentColor" stroke-width=".9" stroke-linejoin="round" aria-hidden="true"><path d="M4 16 l6 6 l7 -11 l7 11 l6 -6 v14 H4 z"/><circle cx="4" cy="14" r="1.6"/><circle cx="30" cy="14" r="1.6"/><circle cx="17" cy="8" r="1.6"/></svg>',
  nose: '<svg width="24" height="32" viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round" aria-hidden="true"><path d="M12 3 C12 10 9 14 7 18 C5.5 21 7 24 10 24 M12 3 C12 10 15 14 17 18 C18.5 21 17 24 14 24"/><path d="M8 20 C9.5 21.5 14.5 21.5 16 20"/></svg>',
  wings: '<svg width="40" height="34" viewBox="0 0 40 34" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round" aria-hidden="true"><path d="M20 8 C18 5 14 5 13 8 C12 11 16 14 20 17 C24 14 28 11 27 8 C26 5 22 5 20 8 Z"/><path d="M14 20 C9 20 5 17 4 12 M26 20 C31 20 35 17 36 12"/><path d="M6 12 C4 10 2 10 1 12 M34 12 C36 10 38 10 39 12"/><path d="M12 24 C8 26 5 25 3 22 M28 24 C32 26 35 25 37 22"/></svg>',
  star: '<svg width="26" height="30" viewBox="0 0 26 28" fill="none" stroke="currentColor" stroke-width=".9" aria-hidden="true"><path d="M13 2 l2.6 6 l6.4 1 l-4.6 4.6 l1.2 6.4 l-5.6 -3.2 l-5.6 3.2 l1.2 -6.4 L4 9 l6.4 -1 z"/><path d="M13 22 v4 M9 25 l1.5 -2 M17 25 l-1.5 -2"/></svg>',
};

/* Wax seal bearing the stag mark. */
export function sealSVG(size = 66) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 66 66" fill="none" aria-hidden="true" focusable="false">
  <circle cx="33" cy="33" r="31" fill="#7C6338"/>
  <circle cx="33" cy="33" r="31" fill="url(#sealLight)"/>
  <circle cx="33" cy="33" r="25" stroke="rgba(240,226,192,.45)" stroke-width="1"/>
  <g transform="translate(33,33) scale(.30) translate(-60,-62)"
     stroke="rgba(240,226,192,.8)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M60 92 L52 84 L48.5 70 L50 58 L54 50 L60 46 L66 50 L70 58 L71.5 70 L68 84 Z"/>
    <path d="M52 52 L44 40 L38 26 L35 12 M44 40 L31 36 M38 26 L26 25"/>
    <path d="M68 52 L76 40 L82 26 L85 12 M76 40 L89 36 M82 26 L94 25"/>
  </g>
  <defs>
    <radialGradient id="sealLight" cx=".36" cy=".3" r=".8">
      <stop offset="0" stop-color="rgba(255,240,204,.5)"/>
      <stop offset="1" stop-color="rgba(58,42,18,.5)"/>
    </radialGradient>
  </defs>
</svg>`;
}

/* Castle on its outcrop — the epilogue drawing.
   Stroke weight and opacity are deliberate: earlier revisions rendered this
   nearly invisible. Keep stroke-width >= 1.5 and opacity >= .6. */
export function castleSVG() {
  return `
<svg viewBox="0 0 360 400" fill="none" stroke="rgba(35,38,31,.62)" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round"
     style="width:82%;height:auto" aria-hidden="true" focusable="false">
  <path d="M20 390 C60 340 90 320 118 300 C150 278 176 268 210 262 C250 256 290 268 330 300 C348 316 356 350 350 390"/>
  <path d="M60 360 C90 342 120 336 150 340 M200 300 C240 296 276 306 304 326"/>
  <path d="M110 340 C130 326 156 320 180 322"/>
  <g stroke-width="1.1">
    <path d="M136 388 l14 -8 M142 378 l14 -8 M148 368 l14 -8 M154 358 l14 -8 M160 348 l14 -8 M166 338 l14 -8 M172 328 l14 -8"/>
    <path d="M136 388 C152 360 172 336 194 316 M150 392 C166 364 186 340 208 320"/>
  </g>
  <path d="M150 262 l0 -60 l10 0 l0 -14 l10 0 l0 14 l14 0 l0 -26 l10 0 l0 26 l14 0 l0 -14 l10 0 l0 14 l10 0 l0 60 z"/>
  <path d="M172 262 l0 -34 l16 0 l0 34"/><path d="M178 236 a3 3 0 0 1 6 0"/>
  <path d="M128 262 l0 -40 l8 0 l0 -12 l7 0 l0 12 l7 0 l0 40"/>
  <path d="M212 262 l0 -46 l8 0 l0 -12 l7 0 l0 12 l7 0 l0 46"/>
  <path d="M194 176 l0 -22 M194 154 l14 5 l-14 5"/>
  <path d="M136 210 l0 -14 M136 196 l10 4 l-10 4"/>
  <path d="M226 204 l0 -16 M226 188 l10 4 l-10 4"/>
  <g stroke-width="1.1"><path d="M156 236 h6 v9 h-6 z M200 240 h6 v9 h-6 z M134 240 h5 v8 h-5 z M218 236 h5 v8 h-5 z"/></g>
  <g stroke-width="1.1" opacity=".62">
    <path d="M60 140 c4 -4 8 -4 12 0 M72 140 c4 -4 8 -4 12 0"/>
    <path d="M290 110 c3 -3 6 -3 9 0 M299 110 c3 -3 6 -3 9 0"/>
    <path d="M266 152 c2.5 -2.5 5 -2.5 7.5 0 M273.5 152 c2.5 -2.5 5 -2.5 7.5 0"/>
  </g>
</svg>`;
}

/* Hand-drawn map ground for Chapter III. */
export function mapGroundSVG() {
  return `
  <path d="M70 300 C110 262 156 268 190 246 C226 222 240 176 288 168 C336 160 372 190 420 178 C470 166 496 118 548 122 C600 126 622 170 672 178 C720 186 758 158 800 172 C836 184 856 216 862 252"
    stroke="rgba(35,38,31,.32)" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M88 336 C130 302 178 308 214 286 C254 262 268 220 312 210"
    stroke="rgba(35,38,31,.14)" stroke-width=".8" stroke-linecap="round"/>
  <g stroke="rgba(35,38,31,.42)" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 296 l24 -32 l16 21 l15 -19 l22 30"/><path d="M174 296 l16 -21 l13 17"/>
    <path d="M232 306 l20 -27 l14 18 l12 -16 l18 25"/>
    <path d="M430 244 l26 -36 l17 23 l16 -20 l24 33"/><path d="M456 244 l17 -23 l14 19"/>
    <path d="M512 258 l22 -30 l15 20 l14 -18 l20 28"/>
    <path d="M690 292 l22 -30 l15 20 l14 -18 l21 28"/><path d="M714 292 l15 -20 l12 16"/>
    <path d="M300 366 l18 -25 l13 17 l11 -14 l17 22"/>
  </g>
  <path d="M470 150 C462 202 490 240 480 292 C472 332 494 364 486 406"
    stroke="rgba(36,61,53,.34)" stroke-width="1" stroke-linecap="round"/>
  <g stroke="rgba(36,61,53,.36)" stroke-width=".85" stroke-linecap="round">
    <path d="M206 396 l0 -13 M202 390 l4 -5 l4 5"/><path d="M225 404 l0 -13 M221 398 l4 -5 l4 5"/>
    <path d="M190 410 l0 -13 M186 404 l4 -5 l4 5"/><path d="M241 392 l0 -13 M237 386 l4 -5 l4 5"/>
    <path d="M778 350 l0 -13 M774 344 l4 -5 l4 5"/><path d="M796 360 l0 -13 M792 354 l4 -5 l4 5"/>
    <path d="M760 366 l0 -13 M756 360 l4 -5 l4 5"/>
  </g>
  <g stroke="rgba(35,38,31,.5)" stroke-width="1" stroke-linejoin="round">
    <path d="M452 466 l0 -36 l8 0 l0 -11 l7 0 l0 11 l9 0 l0 -16 l7 0 l0 16 l9 0 l0 -11 l7 0 l0 11 l8 0 l0 36 z"/>
    <path d="M468 466 l0 -16 l11 0 l0 16"/>
  </g>
  <g stroke="rgba(35,38,31,.42)" stroke-width=".9" stroke-linecap="round">
    <path d="M150 430 l26 0 l-4 8 l-18 0 z"/><path d="M163 430 l0 -18"/><path d="M163 414 l10 5 l-10 5 z"/>
  </g>
  <path d="M236 268 C300 252 366 232 414 214 M428 210 C486 194 522 208 560 258 M572 262 C620 250 660 234 696 222 M694 232 C664 296 592 342 508 372"
    stroke="rgba(164,133,77,.75)" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round"/>
  <g transform="translate(898,120)">
    <circle r="24" stroke="rgba(35,38,31,.2)" stroke-width=".8"/>
    <circle r="16" stroke="rgba(35,38,31,.12)" stroke-width=".7"/>
    <path d="M0 -22 L4.5 0 L0 22 L-4.5 0 Z" fill="rgba(35,38,31,.34)"/>
    <path d="M-22 0 L0 4.5 L22 0 L0 -4.5 Z" fill="rgba(35,38,31,.16)"/>
    <text y="-30" text-anchor="middle" font-family="Cormorant,serif" font-size="9"
      letter-spacing="1.6" fill="rgba(35,38,31,.42)">N</text>
  </g>`;
}
