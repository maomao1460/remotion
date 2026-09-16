# -*- coding: utf-8 -*-
"""渲染后图像审核：抽帧检测黑屏 + 柱状图图例是否渲染"""
import subprocess, re, pathlib

BASE = pathlib.Path(__file__).resolve().parents[1]
MP4 = BASE / "out" / "fullnews.mp4"


def signalstats(ts, crop=None):
    vf = f"crop={crop},signalstats,metadata=print" if crop else "signalstats,metadata=print"
    cmd = ["ffmpeg", "-ss", str(ts), "-i", str(MP4), "-vf", vf,
           "-frames:v", "1", "-f", "null", "-"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    m = re.search(r"lavfi\.signalstats\.YMAX=(\d+)", r.stderr)
    ymax = int(m.group(1)) if m else None
    m2 = re.search(r"lavfi\.signalstats\.YAVG=([\d.]+)", r.stderr)
    yavg = float(m2.group(1)) if m2 else None
    return yavg, ymax


# 1. 黑屏检测：各时间点整帧最大亮度
print("=== 黑屏检测（整帧 YMAX > 40 视为有内容）===")
black_fail = []
for ts in [2, 5, 8, 12, 20, 26, 32, 38]:
    yavg, ymax = signalstats(ts)
    ok = ymax is not None and ymax > 40
    if not ok:
        black_fail.append(ts)
    print(f"{'✅' if ok else '❌'} t={ts:2d}s  YMAX={ymax}")

# 2. 图例检测：柱状图区域（左机构名 + 右金额）是否有亮像素
print("\n=== 图例检测（柱状图区域 crop 后 YMAX > 60 视为有文字）===")
legend_fail = []
# 机构名区域：左侧 x 0-210，柱状图区 y 约 500-1080
name_yavg, name_ymax = signalstats(12, "210:560:0:520")
# 金额区域：柱子右侧 x 620-880
amt_yavg, amt_ymax = signalstats(12, "260:560:620:520")
for label, ymax, ok in [
    ("机构名区域", name_ymax, name_ymax is not None and name_ymax > 60),
    ("金额区域", amt_ymax, amt_ymax is not None and amt_ymax > 60),
]:
    if not ok:
        legend_fail.append(label)
    print(f"{'✅' if ok else '❌'} {label}  YMAX={ymax}")

all_ok = not black_fail and not legend_fail
print("\n=== 渲染后图像审核:", "全部通过 ✅" if all_ok else f"存在异常 ❌ (黑屏:{black_fail} 图例:{legend_fail})")
raise SystemExit(0 if all_ok else 1)
