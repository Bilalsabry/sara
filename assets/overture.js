/* ============================================================================
   overture.js — the book opening.

   A closed volume on an ivory field: the front board swings back, the leaves
   fan, light climbs out of the spine and the gilding lifts off the page as
   dust. Then the whole thing scales past the reader and the real cover is
   underneath.

   Deliberately in the book's own palette — brass and forest on paper. Warm
   gilt motes, not coloured sparkles; the site's restraint should survive its
   own front door.

   It is an overture, not a gate:
     · prefers-reduced-motion skips it outright
     · a click, tap or key press skips it at any point
     · it replays only after OVERTURE_GAP, so a second visit in the same
       evening opens straight onto the cover
     · if anything here throws, `onDone` still fires and the site loads
   ========================================================================== */

import { stagSVG } from './art.js';

const SEEN_KEY = 'kingdom-overture-last';
const OVERTURE_GAP = 12 * 60 * 60 * 1000;   // 12 hours

export function shouldPlayOverture() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.gsap) return false;
  if (location.hash) return false;            // deep link — go straight there
  try {
    const last = +localStorage.getItem(SEEN_KEY) || 0;
    return Date.now() - last > OVERTURE_GAP;
  } catch (e) {
    return true;                              // storage blocked: still play
  }
}

export function playOverture(onDone) {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch (e) {}
    cleanup();
    onDone?.();
  };

  /* Nothing below may strand the reader on a blank page. */
  try {
    return build(finish);
  } catch (err) {
    console.warn('overture failed, opening directly', err);
    finish();
  }

  function build(done) {
    const root = document.createElement('div');
    root.className = 'overture';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <canvas class="overture__dust"></canvas>
      <div class="overture__stage">
        <div class="overture__book">
          <div class="overture__leaves">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div class="overture__glow"></div>
          <div class="overture__board">
            <div class="overture__emblem">${stagSVG({ size: 108, width: 1 })}</div>
            <div class="overture__rule"></div>
          </div>
        </div>
      </div>
      <button class="overture__skip" type="button">Skip</button>`;
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';

    const skip = root.querySelector('.overture__skip');
    skip.addEventListener('click', e => { e.stopPropagation(); done(); });
    root.addEventListener('click', done);
    window.addEventListener('keydown', onKey, true);

    const dust = startDust(root.querySelector('.overture__dust'));

    const tl = gsap.timeline({ onComplete: done });

    /* the volume arrives */
    tl.fromTo('.overture__book',
      { opacity: 0, scale: .88, rotateX: 26 },
      { opacity: 1, scale: 1, rotateX: 12, duration: 1.0, ease: 'power3.out' });
    tl.fromTo('.overture__emblem',
      { opacity: 0 }, { opacity: 1, duration: .7, ease: 'power2.out' }, '-=.55');
    tl.fromTo('.overture__rule',
      { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power3.out' }, '-=.5');

    /* the board swings back */
    tl.to('.overture__board',
      { rotateY: -168, duration: 1.5, ease: 'power2.inOut' }, '+=.25');
    tl.to('.overture__emblem',
      { opacity: 0, duration: .4 }, '<');

    /* the leaves fan, light climbs out of the spine */
    tl.fromTo('.overture__leaves span',
      { rotateY: 0, opacity: 0 },
      { rotateY: i => -14 - i * 13, opacity: 1,
        duration: 1.1, stagger: .07, ease: 'power2.out' }, '-=1.15');
    tl.fromTo('.overture__glow',
      { opacity: 0, scaleX: .3 },
      { opacity: 1, scaleX: 1, duration: 1.2, ease: 'power2.out' }, '-=1.0');

    /* the gilding lifts off the page */
    tl.call(() => dust.burst(), null, '-=.85');

    /* past the reader, onto the cover underneath */
    tl.to('.overture__stage',
      { scale: 2.9, opacity: 0, duration: 1.25, ease: 'power2.in' }, '+=.35');
    tl.to('.overture__glow',
      { opacity: 0, duration: .5 }, '<');
    tl.to(root,
      { opacity: 0, duration: .7, ease: 'power2.inOut' }, '-=.55');

    function onKey(e) {
      if (e.key === 'Tab') return;
      e.preventDefault();
      done();
    }

    cleanup = () => {
      window.removeEventListener('keydown', onKey, true);
      dust.stop();
      gsap.killTweensOf(['.overture__book', '.overture__board', '.overture__leaves span',
                         '.overture__glow', '.overture__stage', '.overture__emblem',
                         '.overture__rule', root]);
      tl.kill();
      root.remove();
      document.body.style.overflow = '';
    };
  }

  function cleanup() {}
}

/* ── gilt dust ────────────────────────────────────────────────────────────
   Motes lift off the open page, slow as they rise and wink out. Brass at low
   alpha on ivory — the gold of a gilded edge catching light, not glitter. */
function startDust(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, raf = 0, running = true;
  const motes = [];

  const size = () => {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener('resize', size);

  const spawn = (n, wide) => {
    for (let i = 0; i < n; i++) {
      motes.push({
        x: W / 2 + (Math.random() - .5) * (wide ? W * .52 : W * .18),
        y: H * .58 + (Math.random() - .5) * H * .06,
        vx: (Math.random() - .5) * .34,
        vy: -(.28 + Math.random() * .95),
        r: .5 + Math.random() * 1.7,
        life: 0,
        max: 150 + Math.random() * 190,
        tw: Math.random() * Math.PI * 2,
      });
    }
  };

  spawn(26, false);

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i];
      m.life++;
      if (m.life > m.max) { motes.splice(i, 1); continue; }
      m.x += m.vx;
      m.y += m.vy;
      m.vy *= .992;                       // they slow as they climb
      m.vx += (Math.random() - .5) * .012;
      m.tw += .09;
      const t = m.life / m.max;
      const fade = t < .18 ? t / .18 : 1 - (t - .18) / .82;
      const a = Math.max(0, fade) * (.34 + .3 * Math.sin(m.tw));
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3.4);
      g.addColorStop(0, `rgba(206,176,116,${a})`);
      g.addColorStop(1, 'rgba(206,176,116,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3.4, 0, Math.PI * 2); ctx.fill();
    }
    if (motes.length < 14) spawn(4, false);
    raf = requestAnimationFrame(tick);
  };
  tick();

  return {
    burst() { spawn(150, true); },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
    },
  };
}
