# -*- coding: utf-8 -*-
from pathlib import Path
import math

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
BG = ASSETS / "kaz-mio-sea-dino-rain-park.png"
OUT = ASSETS / "x-buy-before-5places.mp4"
POSTER = ASSETS / "x-buy-before-5places-poster.png"

FONT_BOLD = Path(r"C:\Windows\Fonts\meiryob.ttc")
FONT_REG = Path(r"C:\Windows\Fonts\meiryo.ttc")
FONT_SERIF = Path(r"C:\Windows\Fonts\yumin.ttf")

W = H = 1088
FPS = 30
DURATION = 10.5
FRAMES = int(FPS * DURATION)

cream = (252, 248, 238, 255)
muted = (225, 218, 204, 255)
gold = (223, 207, 152, 255)
coral = (201, 106, 58, 255)
aqua = (96, 197, 213, 255)
ink = (23, 32, 39, 255)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


brand_f = font(FONT_BOLD, 27)
small_f = font(FONT_BOLD, 28)
sub_f = font(FONT_REG, 34)
mid_f = font(FONT_BOLD, 50)
big_f = font(FONT_SERIF, 82)
huge_f = font(FONT_SERIF, 92)
chip_f = font(FONT_BOLD, 47)
chip_small_f = font(FONT_REG, 24)


def ease(x: float) -> float:
    x = max(0, min(1, x))
    return 1 - (1 - x) ** 3


def fade(t: float, start: float, end: float) -> float:
    return ease((t - start) / (end - start))


def center_text(draw: ImageDraw.ImageDraw, y: float, text: str, f, fill, xcenter=W // 2, spacing=8):
    yy = y
    for line in text.split("\n"):
        box = draw.textbbox((0, 0), line, font=f)
        tw = box[2] - box[0]
        draw.text((xcenter - tw / 2, yy), line, font=f, fill=fill)
        yy += (box[3] - box[1]) + spacing
    return yy


def draw_text_alpha(base: Image.Image, pos, text: str, f, fill, alpha=1, spacing=8, align="left"):
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rgba = fill[:3] + (int(fill[3] * alpha),)
    x, y = pos
    if align == "center":
        center_text(d, y, text, f, rgba, xcenter=x, spacing=spacing)
    else:
        d.multiline_text((x, y), text, font=f, fill=rgba, spacing=spacing)
    base.alpha_composite(layer)


def rounded_rect_alpha(base: Image.Image, xy, radius, fill, outline=None, width=1, alpha=1):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    fill_rgba = fill[:3] + (int(fill[3] * alpha),)
    outline_rgba = outline[:3] + (int(outline[3] * alpha),) if outline else None
    d.rounded_rectangle(xy, radius=radius, fill=fill_rgba, outline=outline_rgba, width=width)
    base.alpha_composite(layer)


def cover_background() -> Image.Image:
    bg = Image.open(BG).convert("RGB")
    iw, ih = bg.size
    scale = max(W / iw, H / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    bg = bg.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(nw - W, (nw - W) // 2 + 70))
    top = max(0, min(nh - H, (nh - H) // 2))
    return bg.crop((left, top, left + W, top + H)).filter(ImageFilter.GaussianBlur(1.0))


def make_gradient() -> Image.Image:
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gp = grad.load()
    for yy in range(H):
        a = int(70 * yy / H)
        for xx in range(W):
            gp[xx, yy] = (0, 0, 0, a)
    return grad


items = [
    ("01", "玄関", "置き場所・通路"),
    ("02", "車", "乗せ降ろし・積み込み"),
    ("03", "リビング", "圧迫感・安全"),
    ("04", "在庫", "買い置き・収納"),
    ("05", "季節", "サイズアウト"),
]


def main():
    bg_base = cover_background()
    grad = make_gradient()
    writer = imageio.get_writer(
        str(OUT),
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=16,
    )
    poster_frame = None
    try:
        for i in range(FRAMES):
            t = i / FPS
            zoom = 1.0 + 0.035 * (t / DURATION)
            sw, sh = int(W / zoom), int(H / zoom)
            x = int((W - sw) * (0.42 + 0.12 * math.sin(t * 0.35)))
            y = int((H - sh) * 0.5)
            frame_bg = bg_base.crop((x, y, x + sw, y + sh)).resize((W, H), Image.Resampling.LANCZOS)
            frame = frame_bg.convert("RGBA")
            frame.alpha_composite(Image.new("RGBA", (W, H), (11, 20, 25, 142)))
            frame.alpha_composite(grad)
            draw = ImageDraw.Draw(frame)

            draw_text_alpha(frame, (58, 52), "KAZ & MIO | LIFE, LIGHTLY", brand_f, cream, alpha=0.95)
            draw.rounded_rectangle((58, 94, 242, 101), radius=4, fill=gold)

            a1 = fade(t, 0.0, 0.45) * (1 - fade(t, 2.35, 2.75))
            draw_text_alpha(
                frame,
                (W // 2, 196 - 24 * (1 - a1)),
                "育児グッズ、\n買う前は「良さそう」で選ぶ。",
                big_f,
                cream,
                alpha=a1,
                align="center",
                spacing=10,
            )
            draw_text_alpha(
                frame,
                (W // 2, 518),
                "でも、後悔は家に入れたあとに来る。",
                sub_f,
                muted,
                alpha=a1,
                align="center",
            )

            a2 = fade(t, 2.6, 3.1) * (1 - fade(t, 5.15, 5.55))
            draw_text_alpha(
                frame,
                (W // 2, 198),
                "商品名より先に、\n見る場所がある。",
                huge_f,
                cream,
                alpha=a2,
                align="center",
                spacing=8,
            )
            draw_text_alpha(
                frame,
                (W // 2, 526),
                "うちで詰まるかどうか。",
                sub_f,
                gold,
                alpha=a2,
                align="center",
            )

            a3 = fade(t, 5.25, 5.75) * (1 - fade(t, 8.55, 8.95))
            draw_text_alpha(frame, (70, 150), "買う前に見る\n5つの場所", big_f, cream, alpha=a3, spacing=3)
            for idx, (num, label, note) in enumerate(items):
                appear = fade(t, 5.6 + idx * 0.32, 6.0 + idx * 0.32) * a3
                xx = 510 + int(70 * (1 - appear))
                yy = 155 + idx * 118
                rounded_rect_alpha(
                    frame,
                    (xx, yy, xx + 500, yy + 88),
                    8,
                    (255, 255, 255, 226),
                    outline=(255, 255, 255, 115),
                    alpha=appear,
                )
                accent = [coral, aqua, gold, coral, aqua][idx]
                rounded_rect_alpha(frame, (xx + 18, yy + 18, xx + 80, yy + 68), 25, accent, alpha=appear)
                draw_text_alpha(frame, (xx + 32, yy + 28), num, small_f, ink, alpha=appear)
                draw_text_alpha(frame, (xx + 104, yy + 8), label, chip_f, ink, alpha=appear)
                draw_text_alpha(frame, (xx + 106, yy + 57), note, chip_small_f, (88, 84, 76, 255), alpha=appear)

            a4 = fade(t, 8.75, 9.2)
            rounded_rect_alpha(
                frame,
                (82, 188, 1006, 730),
                8,
                (18, 28, 34, 180),
                outline=(255, 255, 255, 72),
                alpha=a4,
            )
            draw_text_alpha(
                frame,
                (W // 2, 248),
                "レビューの前に、\nうちで詰まる場所を見る。",
                big_f,
                cream,
                alpha=a4,
                align="center",
                spacing=8,
            )
            draw_text_alpha(frame, (W // 2, 532), "買う前タイムマシン診断", mid_f, gold, alpha=a4, align="center")
            draw_text_alpha(frame, (W // 2, 603), "KAZ & MIO", small_f, muted, alpha=a4, align="center")

            writer.append_data(np.asarray(frame.convert("RGB")))
            if abs(t - 7.25) < 1 / FPS:
                poster_frame = frame.convert("RGB")
    finally:
        writer.close()

    if poster_frame is None:
        poster_frame = frame.convert("RGB")
    poster_frame.save(POSTER, quality=95, optimize=True)
    print(OUT)
    print(POSTER)


if __name__ == "__main__":
    main()
