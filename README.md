# A Kingdom Made for Her

A private digital artist's book. Static site — no build step, no framework.

```
index.html                markup shell only
assets/styles.css         design tokens + all styling
assets/content.js         approved copy + image configuration  ← you edit this
assets/art.js             original line work and generated ink
assets/main.js            rendering, routing, overlays, accessibility
tools/optimize-images.py  run after adding photographs
COPY.md                   the approved wording (source of truth)
```

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

> `main.js` is an ES module, so `file://` will be blocked by CORS. Use a local
> server, or just view the deployed site.

---

## Adding the real photographs and artwork

**You only ever edit `assets/content.js`.** Never touch layout code.

Every image slot renders a proofing frame while `src` is `null`. Setting `src`
swaps the photograph in at exactly the same dimensions, so nothing on the page
moves.

### 1. Drop the files in

Create a folder and add your images:

```
assets/images/her-at-work.jpg
assets/images/sketchbook-01.jpg
```

Drop the originals straight off the phone — size and rotation are handled for
you. Then run:

```bash
pip install pillow          # once
python3 tools/optimize-images.py
```

That bakes EXIF rotation into the pixels, caps the long edge at 1600px, and
writes a `.webp` beside each `.jpg`. The page offers the WebP first and falls
back to the JPEG on its own, so there is nothing to wire up. It is safe to
re-run over files it has already processed.

> Baking the rotation matters. Browsers honour the EXIF orientation tag, but
> plenty of other things don't — a photo that stands upright in the page can
> still arrive sideways in a share preview. After the script the file is simply
> correct on disk.

### 2. Point the entry at the file

Find the entry in `content.js` and change `src` from `null` to the path:

```js
// before
{ id: 'archive-01', src: null, label: 'HER AT WORK', ratio: '4 / 3', … }

// after
{ id: 'archive-01', src: 'assets/images/her-at-work.jpg', label: 'HER AT WORK', ratio: '4 / 3', … }
```

That is the whole change. The frame keeps its size, the label disappears, and
the photograph fills the space.

### 3. Adjust the crop if you need to

| Field | What it does |
|---|---|
| `ratio` | The shape of the frame, e.g. `'4 / 3'`, `'3 / 4'`, `'1 / 1'`. **Keep it close to the photograph's own shape.** The frame crops to fill, so a portrait photo in a landscape frame loses the top and bottom of the picture — a 4/3 frame holding a 3/4 photo throws away 44% of it. The layout reflows cleanly whatever you choose. |
| `focal` | Which part stays visible when cropped. `'50% 50%'` is centre; `'50% 25%'` favours the top — useful when a face sits high in frame. |
| `fit`   | `'cover'` fills the frame and crops. `'contain'` shows the whole image with space around it — better for artwork scans you don't want cropped. |
| `alt`   | Describe the image for screen readers. Leave `''` for purely decorative pieces. |

### 4. Where each slot lives

**`IMAGES`** — the three fixed slots:

| Key | Where it appears |
|---|---|
| `coverPortrait` | The large photographic panel on the cover |
| `coverSnapshot` | The small taped snapshot, lower right of the cover |
| `letterPlate`   | The image beside the letter in Chapter I |

**`ARCHIVE`** — the array behind Chapter II. Entry `[0]` is the large feature
frame; the rest are the smaller process plates. Add as many as you like:

```js
{
  id: 'archive-06',
  src: 'assets/images/study-03.jpg',
  alt: 'A pencil study of hands',
  label: 'ARTWORK SCAN',      // shown only while src is null
  scale: 'detail',
  ratio: '3 / 4',
  focal: '50% 50%',
  title: 'Study, hands',       // shown in the lightbox
  year: '2025',
  medium: 'Graphite on paper',
  note: 'The one you nearly threw away.',
}
```

`title`, `year`, `medium` and `note` appear in the lightbox when a plate is
opened. Leave `year` or `medium` as `''` and they're simply omitted.

### 5. Placeholder labels

Use whichever reads right for the slot: `ADD PHOTO`, `ARTWORK SCAN`,
`HER PHOTOGRAPH`, `MEMORY`. These only ever show while `src` is `null`.

---

## The copy is locked

`COPY.md` holds the approved wording for every page, and `content.js` mirrors
it. **Do not rewrite, shorten, regenerate or re-punctuate any of it.** If the
two ever disagree, `COPY.md` wins — fix `content.js`, not `COPY.md`.

Layout, styling and code may change freely. The words may not.

---

## Design tokens

All colour, type and spacing live as CSS custom properties at the top of
`styles.css`. Change them there and the whole book follows.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F3EEE4` | warm archival ivory |
| `--paper-deep` | `#E9E2D4` | slightly darker parchment |
| `--ink` | `#23261F` | charcoal green-black, primary text |
| `--forest` | `#243D35` | muted deep green |
| `--oxblood` | `#6F2F2B` | restrained dark red-brown |
| `--brass` | `#A4854D` | muted antique gold, used sparingly |
| `--graphite` | `#6E6B62` | secondary text |
| `--dried` | `#8A6A4F` | dried-flower brown, botanicals |

---

## Notes

- **Sound never autoplays.** It is opt-in via the control at lower left, and
  its state is announced to screen readers.

### The music

`assets/audio/gymnopedie-no1.mp3` — Erik Satie, *Gymnopédie No. 1*.

Free to use with **no obligations whatsoever**. Both layers are clear, which is
the part people usually miss — a public-domain *composition* played on a
copyrighted *recording* is still copyrighted:

| Layer | Status |
|---|---|
| Composition | Satie died 1925 → public domain worldwide |
| Recording | [CC0 1.0 Universal](https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg) — all rights waived |

CC0 requires no attribution, no share-alike, and permits commercial use. The
file is self-hosted, so there's no hotlinking and no external dependency.

**To swap the track**, drop an MP3 into `assets/audio/` and change `AUDIO.src`
in `content.js`. If the new track needs a credit (CC-BY, for instance), set
`attribution` and the credit line reappears in the colophon automatically.
Leave it `null` for CC0 or public-domain tracks.

Good sources for genuinely free music: [Musopen](https://musopen.org)
(CC0 and public-domain classical recordings) and
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Piano_music).
Check the *recording's* licence, not just the composer's death date.
- **Reduced motion** is respected throughout; animation is an enhancement and
  the page renders fully without it.
- **If the CDN is blocked**, GSAP and Lenis simply don't load and everything
  still displays — content is visible by default and only hidden once JS
  confirms it is running.

## Deploying

Pushing to `main` deploys automatically. Or manually:

```bash
vercel --prod
```
