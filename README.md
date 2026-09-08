# A Kingdom Made for Her

A private digital artist's book. Static site — no build step, no framework.

```
index.html                markup shell only
assets/styles.css         design tokens + all styling
assets/content.js         approved copy + image configuration  ← you edit this
assets/art.js             original line work and generated ink
assets/main.js            rendering, routing, overlays, games, accessibility
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
- **The Bell** (the control at lower right) sends a push notification to
  Bilal's phone when Sara rings it — a hug, a kiss, or coffee. It goes
  browser → [ntfy.sh](https://ntfy.sh) → phone; no server of our own, free,
  no account.

  **Setup, once:** install the ntfy app
  ([iOS](https://apps.apple.com/us/app/ntfy/id1625396347) /
  [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy)),
  tap **+ / Subscribe to topic**, and enter the topic exactly as it appears
  in `BELL.topic` in `content.js`. Then open the live site and ring once to
  test. The topic name is the only secret — anyone who knows it can ring the
  bell, so don't share it; to rotate it, change `BELL.topic` and re-subscribe
  in the app. There's a 60-second per-button cooldown so a double-tap doesn't
  buzz twice. If real SMS is ever wanted instead, swap the endpoint for a
  small Vercel function + Twilio; the front end won't need to change.
- **The northern lights.** Rarely, and at a random moment, aurora curtains
  drift across the whole site — her favourite thing in the world, so they are
  never on demand and never on a schedule she could learn. With the defaults
  in `AURORA` (`content.js`) a pass arrives for roughly one visit in five soon
  after she opens the book, and about once every half hour of reading after
  that; each pass lasts around 24 seconds and fades itself out. **Rarity is
  the whole point — resist turning those numbers up.** They use the `color`
  blend mode, which takes hue from the lights and luminosity from the page,
  so nothing on the page loses contrast while they pass. Under
  `prefers-reduced-motion` the curtains hold still and only fade.

  To call them up deliberately — to show her the first time — click the small
  star under *Open the Book* on the cover. Deliberately undocumented on the
  page itself.
- **The Pigeon Post.** Bilal can leave a note that appears on the site as a
  taped paper note under the chapter index. Send it by POSTing text to
  `https://ntfy.sh/<PIGEON.topic>` (topic in `content.js`) — easiest is an
  iPhone Shortcut: Shortcuts app → + → add action **Get Contents of URL** →
  URL `https://ntfy.sh/<topic>`, Method POST, Request Body: Text → tap the
  body field and choose **Ask Each Time** → name it "Note for Sara" and add
  to the Home Screen. One tap, type, sent. (Or open `ntfy.sh/<topic>` in any
  browser and use its publish box.) ntfy only caches notes ~12h, but once
  her browser has seen one it keeps showing it until a newer note arrives.
- **Days of Us** — the due-date stamp on the cover counts from 08·01·2026
  (`DAYS` in `content.js`); milestone days add a small hand-written line.
- **Send him a line** — the bell tray also takes free text, straight to
  Bilal's phone, 15-second cooldown.
- **The Word Game** (The Parlour, linked from the colophon) is the paper game
  digitised: lock in a hidden four-letter word, and the page scores their
  guesses — how many letters sit in the right place — while a second ledger
  tracks your own guesses at theirs. State lives in the browser only, so a
  refresh mid-round loses nothing and the word never leaves the device.
  **Across the distance** mode makes it two-player on two phones: each of
  you opens the page, picks your side, locks a word, and guesses — moves
  travel over a private ntfy topic (`GAME.duel` in `content.js`), scores are
  answered automatically by the *other* person's device, and secrets never
  leave their own phone. Don't subscribe the phone apps to the duel topic —
  only the page listens to it. Its
  wording is provisional (marked in `content.js`) and is not yet in COPY.md.
- **Soundtrack songs link out to Spotify.** The recordings are commercial, so
  they are linked, never hosted — only the CC0 Satie ships with the site.
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
