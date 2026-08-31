#!/usr/bin/env python3
"""Prepare photographs for the book.

Run it after dropping new files into assets/images/. It is idempotent, so
re-running over already-processed images is harmless.

    pip install pillow
    python3 tools/optimize-images.py

Three things happen to every JPEG:

1. EXIF orientation is baked into the pixels. Browsers honour the orientation
   tag, but plenty of other things don't, and a photo that is upright in the
   page but sideways in a share preview is worse than one that is simply
   correct on disk. After this the file needs no tag to look right.
2. The long edge is capped at LONG_EDGE. The largest any photograph is ever
   painted is the cover panel and the lightbox; beyond this the extra pixels
   are bytes nobody sees.
3. A WebP is written beside the JPEG. frame() in assets/main.js offers the
   WebP first and falls through to the JPEG, so nothing needs updating by hand.
"""
from PIL import Image, ImageOps
import glob
import os

LONG_EDGE = 1600
SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "images")


def main():
    before = after_jpg = after_webp = 0

    for path in sorted(glob.glob(os.path.join(SRC, "*.jpg"))):
        name = os.path.basename(path)
        start = os.path.getsize(path)
        before += start

        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        if max(im.size) > LONG_EDGE:
            im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)

        # exif_transpose has already applied the rotation, so the re-encode
        # deliberately carries no orientation tag.
        im.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        webp = os.path.splitext(path)[0] + ".webp"
        im.save(webp, "WEBP", quality=80, method=6)

        j, w = os.path.getsize(path), os.path.getsize(webp)
        after_jpg += j
        after_webp += w
        print(f"{name:24} {im.size[0]}x{im.size[1]}  "
              f"{start / 1024:6.0f}K -> jpg {j / 1024:5.0f}K / webp {w / 1024:5.0f}K")

    mb = 1024 * 1024
    print(f"\ntotal   before {before / mb:.2f} MB"
          f"   jpeg {after_jpg / mb:.2f} MB   webp {after_webp / mb:.2f} MB")


if __name__ == "__main__":
    main()
