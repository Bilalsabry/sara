# A Kingdom Made for Her

A private digital artist's book. Static site — no build step, no framework.

```
index.html          markup shell only
assets/styles.css   design tokens + all styling
assets/content.js   approved copy + image configuration  ← you edit this
assets/art.js       original line work and generated ink
assets/main.js      rendering, routing, overlays, accessibility
COPY.md             the approved wording (source of truth)
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

Any format the browser reads works — `.jpg`, `.png`, `.webp`, `.avif`.
Aim for roughly 1600px on the long edge; larger than that is wasted bytes.

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
| `ratio` | The shape of the frame, e.g. `'4 / 3'`, `'3 / 4'`, `'1 / 1'`. Change it if your photo is a different shape — the layout reflows cleanly. |
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
  its state is announced to screen readers. The Bensound attribution in the
  footer is required by their licence while that track is in use.
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
