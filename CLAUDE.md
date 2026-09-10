# Working in this repo

A private digital artist's book for Sara. Static site, no build step, no
framework. `README.md` covers how the site works and how to add photographs,
music and letters; this file is about how to work on it safely.

## Two sessions work here at once

More than one Claude session has this repo open, and both push to `main`.
Assume the remote has moved since you last looked.

- **Before starting work:** `git fetch origin main` and merge it into your
  branch. Do not begin a feature on a stale base.
- **Before every push:** fetch and merge `origin/main` again, then re-run the
  browser checks below. A merge that compiles is not a merge that works.
- **Never** `push --force`, rebase shared history, or resolve a conflict by
  discarding the other session's side. If a conflict is genuinely ambiguous,
  say so rather than guessing.
- When resolving a conflict by hand, **check the whole file afterwards**, not
  just the conflicted hunk — it is easy to drop content past the markers.
  `git diff origin/main -- <file>` should show only your intended change.

Conflicts concentrate in `assets/content.js`, `assets/main.js`,
`assets/styles.css` and `index.html`, because every feature touches them.
Where a feature is self-contained, give it its own file (as `overture.js`
does) so the two sessions collide less.

## The words are not yours

`COPY.md` holds wording Bilal has approved. `assets/content.js` mirrors it.

- **Never rewrite, shorten, re-punctuate or regenerate approved copy.** If the
  two files disagree, `COPY.md` wins — fix `content.js`.
- **Never invent his voice or hers.** The Open When letters, the map
  memories, the archive captions and anything else written *to* Sara are his
  to write. An unwritten entry stays empty and renders as nothing; it does not
  get a plausible placeholder that might survive to production.
- Functional labels for new features (button text, hints, empty states) may be
  written freely. Mark them provisional in `content.js` until he signs off.

Layout, styling and code may change freely. The words may not.

## Where things live

| File | What belongs there |
|---|---|
| `assets/content.js` | Every string and every tunable. Nothing hardcoded elsewhere. |
| `assets/art.js` | Drawing: SVG line work and canvas painters. |
| `assets/main.js` | Rendering, routing, overlays, behaviour. |
| `assets/styles.css` | Design tokens first, then components in page order. |
| `tools/optimize-images.py` | Run after adding any photograph. |

Adding a page means: a `PAGE_META` entry, a slot in `PAGE_ORDER`, and a
template in `PAGES`. The contents list builds itself from those.

## Private topics are secrets

`BELL.topic`, `PIGEON.topic` and `GAME.duel.topic` are unguessable ntfy topic
names, and knowing one is enough to ring his phone or read her notes. They
live in `content.js` because the browser needs them, but keep them out of
commit messages, PR titles and anywhere else they would outlive the file.

## Check it in a browser before pushing

There are no tests. The check is the real page, and it has caught every bug
that mattered here — a grain overlay painting a 300×150 rectangle, a
bookshelf floating off its plank, an aurora that measured as "moving" while
actually fading out. Screenshots at both widths, every time:

```bash
python3 -m http.server 8765 &          # then drive it with Playwright
```

Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.

- **1440×900 and 390×844** at minimum; short viewports (1440×700) break
  differently and are worth a look when touching the cover.
- **Zero console errors**, and `scrollWidth - clientWidth === 0` on every page.
  Horizontal overflow hides behind `overflow-x: hidden` and shows up as
  rubber-banding on a real iPhone.
- Outbound network is blocked in this sandbox, so **GSAP, Lenis, Google Fonts
  and ntfy will fail**. Abort those requests in the harness and use
  `wait_until="load"`, never `networkidle`. The site is built to work without
  them; a fallback font in a screenshot is the sandbox, not a bug.
- Exercise the thing you changed. Measure behaviour rather than trusting it:
  compare pixels over time for animation, assert element boxes for layout.

## Deploying

Pushing to `main` deploys to sarabilal.com automatically. Merge your branch
into `main` with `--no-ff` and push; if that push is rejected, another session
landed first — fetch, merge, re-check, push again.
