# -*- coding: utf-8 -*-
from pathlib import Path
import math

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "x-leany-fitness-wear-40s.mp4"
POSTER = ASSETS / "x-leany-fitness-wear-40s-poster.png"

FONT_BOLD = Path(r"C:\Windows\Fonts\meiryob.ttc")
FONT_REG = Path(r"C:\Windows\Fonts\meiryo.ttc")
FONT_SERIF = Path(r"C:\Windows\Fonts\yumin.ttf")

W, H = 1088, 1920
FPS = 24
DURATION = 12.8
FRAMES = int(FPS * DURATION)

cream = (255, 249, 239, 255)
muted = (238, 231, 222, 255)
ink = (32, 32, 30, 255)
rose = (183, 99, 114, 255)
sage = (127, 154, 130, 255)
gold = (223, 207, 152, 255)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


brand_f = font(FONT_BOLD, 26)
note_f = font(FONT_REG, 34)
small_f = font(FONT_BOLD, 38)
mid_f = font(FONT_BOLD, 56)
big_f = font(FONT_SERIF, 84)
huge_f = font(FONT_SERIF, 98)


def ease(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def fade(t: float, start: float, end: float) -> float:
    return ease((t - start) / (end - start))


def alpha_between(t: float, start: float, in_end: float, out_start: float, end: float) -> float:
    return fade(t, start, in_end) * (1 - fade(t, out_start, end))


def cover_image(path: Path, t: float, start: float, duration: float, pan: float) -> Image.Image:
    img = Image.open(path).convert("RGB")
    iw, ih = img.size
    scale = max(W / iw, H / ih) * (1.0 + 0.05 * ease((t - start) / duration))
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    progress = ease((t - start) / duration)
    cx = 0.5 + pan * (progress - 0.5)
    left = int(max(0, min(nw - W, (nw - W) * cx)))
    top = int(max(0, min(nh - H, (nh - H) * (0.45 + 0.04 * math.sin(progress * math.pi)))))
    return img.crop((left, top, left + W, top + H))


def composite_text(base: Image.Image, pos, text: str, f, fill, alpha=1.0, spacing=8, align="left", stroke=0):
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rgba = fill[:3] + (int(fill[3] * alpha),)
    stroke_fill = (0, 0, 0, int(110 * alpha))
    x, y = pos
    yy = y
    for line in text.split("\n"):
        box = d.textbbox((0, 0), line, font=f, stroke_width=stroke)
        tw = box[2] - box[0]
        tx = x - tw / 2 if align == "center" else x
        d.text((tx, yy), line, font=f, fill=rgba, stroke_width=stroke, stroke_fill=stroke_fill)
        yy += (box[3] - box[1]) + spacing
    base.alpha_composite(layer)


def rounded_card(base: Image.Image, xy, radius, fill, alpha=1.0, outline=None):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = fill[:3] + (int(fill[3] * alpha),)
    o = outline[:3] + (int(outline[3] * alpha),) if outline else None
    d.rounded_rectangle(xy, radius=radius, fill=f, outline=o, width=2)
    base.alpha_composite(layer)


shade_layer = None


def shade(base: Image.Image):
    global shade_layer
    if shade_layer is None:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        p = overlay.load()
        for y in range(H):
            top = max(0, 235 - y * 0.26)
            bottom = max(0, (y - 1060) * 0.16)
            a = int(min(205, top + bottom))
            for x in range(W):
                p[x, y] = (22, 22, 21, a)
        shade_layer = overlay
    base.alpha_composite(shade_layer)


scenes = [
    {
        "path": ASSETS / "x-mom-daily-living.png",
        "start": 0.0,
        "end": 4.0,
        "pan": 0.05,
        "tag": "本音",
        "headline": "運動したい\n気持ちはある",
        "sub": "でも、ウェア選びで\nいつも手が止まる。",
        "color": rose,
    },
    {
        "path": ASSETS / "x-mom-daily-entrance.png",
        "start": 4.0,
        "end": 8.2,
        "pan": -0.07,
        "tag": "40代",
        "headline": "部屋着だと\n気分が乗らない",
        "sub": "ピタピタすぎるのも\nちょっと勇気がいる。",
        "color": sage,
    },
    {
        "path": ASSETS / "kaz-mio-encyclopedia-hero-08.jpg",
        "start": 8.2,
        "end": 11.4,
        "pan": 0.08,
        "tag": "入口",
        "headline": "形から入るの\n全然あり",
        "sub": "着たら動きたくなる服を\n先に決めてもいい。",
        "color": gold,
    },
]


def active_scene(t: float):
    for scene in scenes:
        if scene["start"] <= t < scene["end"]:
            return scene
    return scenes[-1]


def draw_brand(frame: Image.Image):
    composite_text(frame, (56, 54), "KAZ & MIO | LIFE, LIGHTLY", brand_f, cream, alpha=0.94, stroke=1)
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle((56, 94, 252, 101), radius=4, fill=gold)


def make_frame(t: float) -> Image.Image:
    if t < 11.2:
        scene = active_scene(t)
        duration = scene["end"] - scene["start"]
        frame = cover_image(scene["path"], t, scene["start"], duration, scene["pan"]).convert("RGBA")
        shade(frame)
        a = alpha_between(t, scene["start"], scene["start"] + 0.45, scene["end"] - 0.38, scene["end"] + 0.1)
        draw_brand(frame)
        rounded_card(frame, (70, 134, 276, 196), 31, scene["color"], alpha=a)
        composite_text(frame, (173, 141), scene["tag"], small_f, ink, alpha=a, align="center")
        y_offset = 24 * (1 - a)
        composite_text(frame, (74, 250 + y_offset), scene["headline"], huge_f, cream, alpha=a, spacing=10, stroke=3)
        composite_text(frame, (78, 510 + y_offset), scene["sub"], note_f, muted, alpha=a, spacing=12, stroke=2)
        return frame

    last = cover_image(scenes[2]["path"], t, scenes[2]["start"], scenes[2]["end"] - scenes[2]["start"], 0.0)
    frame = last.convert("RGBA").filter(ImageFilter.GaussianBlur(2.0))
    frame.alpha_composite(Image.new("RGBA", (W, H), (22, 22, 21, 178)))
    draw_brand(frame)
    a = fade(t, 11.15, 11.65)
    rounded_card(frame, (72, 526, 1016, 1296), 8, (255, 255, 255, 230), alpha=a, outline=(255, 255, 255, 130))
    composite_text(frame, (W // 2, 640), "40代ママの", big_f, ink, alpha=a, align="center")
    composite_text(frame, (W // 2, 758), "運動ウェア迷子診断", mid_f, ink, alpha=a, align="center")
    composite_text(frame, (W // 2, 900), "体型カバーも、気分も。\n5問で見る入口。", small_f, rose, alpha=a, align="center", spacing=12)
    composite_text(frame, (W // 2, 1110), "KAZ & MIO", note_f, (89, 84, 77, 255), alpha=a, align="center")
    return frame


def main():
    writer = imageio.get_writer(
        str(OUT),
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=16,
    )
    poster = None
    try:
        for i in range(FRAMES):
            t = i / FPS
            frame = make_frame(t)
            writer.append_data(np.asarray(frame.convert("RGB")))
            if poster is None and t >= 8.7:
                poster = frame.convert("RGB")
    finally:
        writer.close()
    if poster is None:
        poster = make_frame(8.7).convert("RGB")
    poster.save(POSTER, quality=95, optimize=True)
    print(OUT)
    print(POSTER)


if __name__ == "__main__":
    main()
