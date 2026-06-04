# -*- coding: utf-8 -*-
from pathlib import Path
import math

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "x-mom-daily-buy-before.mp4"
POSTER = ASSETS / "x-mom-daily-buy-before-poster.png"

FONT_BOLD = Path(r"C:\Windows\Fonts\meiryob.ttc")
FONT_REG = Path(r"C:\Windows\Fonts\meiryo.ttc")
FONT_SERIF = Path(r"C:\Windows\Fonts\yumin.ttf")

W, H = 1088, 1920
FPS = 24
DURATION = 13.6
FRAMES = int(FPS * DURATION)

cream = (255, 250, 240, 255)
paper = (255, 255, 255, 235)
ink = (31, 38, 43, 255)
muted = (237, 231, 221, 255)
gold = (222, 197, 132, 255)
coral = (201, 106, 72, 255)
blue = (74, 142, 160, 255)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


brand_f = font(FONT_BOLD, 26)
note_f = font(FONT_REG, 33)
small_f = font(FONT_BOLD, 38)
mid_f = font(FONT_BOLD, 56)
big_f = font(FONT_SERIF, 86)
huge_f = font(FONT_SERIF, 98)
SHADE = None


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
    scale = max(W / iw, H / ih) * (1.0 + 0.055 * ease((t - start) / duration))
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    progress = ease((t - start) / duration)
    cx = 0.5 + pan * (progress - 0.5)
    left = int(max(0, min(nw - W, (nw - W) * cx)))
    top = int(max(0, min(nh - H, (nh - H) * (0.48 + 0.04 * math.sin(progress * math.pi)))))
    return img.crop((left, top, left + W, top + H))


def composite_text(base: Image.Image, pos, text: str, f, fill, alpha=1.0, spacing=8, align="left", stroke=0):
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rgba = fill[:3] + (int(fill[3] * alpha),)
    stroke_fill = (0, 0, 0, int(105 * alpha))
    x, y = pos
    lines = text.split("\n")
    yy = y
    for line in lines:
        box = d.textbbox((0, 0), line, font=f, stroke_width=stroke)
        tw = box[2] - box[0]
        tx = x - tw / 2 if align == "center" else x
        d.text((tx, yy), line, font=f, fill=rgba, spacing=spacing, stroke_width=stroke, stroke_fill=stroke_fill)
        yy += (box[3] - box[1]) + spacing
    base.alpha_composite(layer)


def rounded_card(base: Image.Image, xy, radius, fill, alpha=1.0, outline=None):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = fill[:3] + (int(fill[3] * alpha),)
    o = outline[:3] + (int(outline[3] * alpha),) if outline else None
    d.rounded_rectangle(xy, radius=radius, fill=f, outline=o, width=2)
    base.alpha_composite(layer)


def make_shade() -> Image.Image:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p = overlay.load()
    for y in range(H):
        top = max(0, 210 - y * 0.25)
        bottom = max(0, (y - 1040) * 0.15)
        a = int(min(190, top + bottom))
        for x in range(W):
            p[x, y] = (13, 20, 24, a)
    return overlay


def shade(base: Image.Image):
    global SHADE
    if SHADE is None:
        SHADE = make_shade()
    base.alpha_composite(SHADE)


scenes = [
    {
        "path": ASSETS / "x-mom-daily-entrance.png",
        "start": 0.0,
        "end": 4.4,
        "pan": -0.10,
        "headline": "出かけるだけで\nもう一仕事",
        "sub": "ベビーカー、バッグ、上着、靴。\n玄関でぜんぶ詰まる朝。",
        "tag": "玄関",
        "color": coral,
    },
    {
        "path": ASSETS / "x-mom-daily-living.png",
        "start": 4.4,
        "end": 8.8,
        "pan": 0.08,
        "headline": "買ってから\n気づくこと",
        "sub": "置けるかより、通れるか。\nリビングの余白って大事。",
        "tag": "リビング",
        "color": blue,
    },
    {
        "path": ASSETS / "x-mom-daily-car.png",
        "start": 8.8,
        "end": 12.4,
        "pan": -0.08,
        "headline": "毎日の乗せ降ろし\n地味に効く",
        "sub": "ドアの開き、荷物、ベルト。\n車まわりも暮らし目線で。",
        "tag": "車",
        "color": gold,
    },
]


def active_scene(t: float):
    for scene in scenes:
        if scene["start"] <= t < scene["end"]:
            return scene
    return scenes[-1]


def draw_brand(frame: Image.Image):
    composite_text(frame, (56, 54), "KAZ & MIO | LIFE, LIGHTLY", brand_f, cream, alpha=0.93, stroke=1)
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle((56, 94, 252, 101), radius=4, fill=gold)


def make_frame(t: float) -> Image.Image:
    if t < 12.2:
        scene = active_scene(t)
        scene_duration = scene["end"] - scene["start"]
        frame = cover_image(scene["path"], t, scene["start"], scene_duration, scene["pan"]).convert("RGBA")
        shade(frame)
        scene_alpha = alpha_between(t, scene["start"], scene["start"] + 0.55, scene["end"] - 0.45, scene["end"] + 0.1)
        draw_brand(frame)

        tag_x = 70
        tag_y = 132
        rounded_card(frame, (tag_x, tag_y, tag_x + 220, tag_y + 62), 31, scene["color"], alpha=scene_alpha)
        composite_text(frame, (tag_x + 110, tag_y + 7), scene["tag"], small_f, ink, alpha=scene_alpha, align="center")

        y_offset = 24 * (1 - scene_alpha)
        composite_text(frame, (72, 235 + y_offset), scene["headline"], huge_f, cream, alpha=scene_alpha, spacing=10, stroke=3)
        composite_text(frame, (76, 485 + y_offset), scene["sub"], note_f, muted, alpha=scene_alpha, spacing=12, stroke=2)
        return frame

    last = cover_image(scenes[1]["path"], t, scenes[1]["start"], scenes[1]["end"] - scenes[1]["start"], 0.0)
    frame = last.convert("RGBA").filter(ImageFilter.GaussianBlur(2.2))
    frame.alpha_composite(Image.new("RGBA", (W, H), (12, 20, 24, 182)))
    draw_brand(frame)
    a = fade(t, 12.15, 12.65)
    rounded_card(frame, (72, 520, 1008, 1282), 8, (255, 255, 255, 226), alpha=a, outline=(255, 255, 255, 120))
    composite_text(frame, (W // 2, 620), "育児グッズは", big_f, ink, alpha=a, align="center")
    composite_text(frame, (W // 2, 742), "商品名より先に", huge_f, ink, alpha=a, align="center")
    composite_text(frame, (W // 2, 890), "生活の詰まり場所で見る。", mid_f, ink, alpha=a, align="center")
    composite_text(frame, (W // 2, 1062), "買う前に失敗が見える育児グッズ診断", small_f, coral, alpha=a, align="center")
    composite_text(frame, (W // 2, 1130), "KAZ & MIO", note_f, (89, 84, 77, 255), alpha=a, align="center")
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
            if poster is None and t >= 5.7:
                poster = frame.convert("RGB")
    finally:
        writer.close()

    if poster is None:
        poster = make_frame(5.7).convert("RGB")
    poster.save(POSTER, quality=95, optimize=True)
    print(OUT)
    print(POSTER)


if __name__ == "__main__":
    main()
