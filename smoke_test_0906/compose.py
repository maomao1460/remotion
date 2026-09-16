# -*- coding: utf-8 -*-
"""冒烟测试 v2：平滑漂移动画(无抖动) + 配音 + BGM 混音，无字幕"""
import json, pathlib, subprocess, sys

BASE = pathlib.Path(__file__).resolve().parent
OUT = BASE / "out"
OUT.mkdir(parents=True, exist_ok=True)
FPS = 24
BGM = BASE / "bgm.wav"

meta = json.loads((BASE / "durations.json").read_text(encoding="utf-8"))
durations = meta["durations"]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FAIL:", " ".join(cmd)[:220])
        print(r.stderr[-1600:])
        sys.exit(1)


segments = []
for i, d in enumerate(durations, 1):
    png = BASE / "png" / f"page_{i:02d}.png"
    mp3 = BASE / "audio" / f"seg_{i:02d}.mp3"
    segmp4 = OUT / f"seg_{i:02d}.mp4"
    # 预放大 1.1 倍 -> crop 时间线性垂直漂移，平滑无抖动
    vf = (f"scale=1188:2112,"
          f"crop=1080:1920:x=(in_w-out_w)/2:y=(in_h-out_h)*(t/{d:.3f})")
    cmd = ["ffmpeg", "-y", "-framerate", str(FPS), "-loop", "1", "-i", str(png),
           "-i", str(mp3),
           "-filter_complex", f"[0:v]{vf}[v]", "-map", "[v]", "-map", "1:a",
           "-t", f"{d:.3f}", "-c:v", "libx264", "-preset", "veryfast",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
           "-shortest", str(segmp4)]
    print(f"[{i}/{len(durations)}] 生成 seg_{i:02d} ({d:.1f}s)...")
    run(cmd)
    segments.append(segmp4)

# 合并（视频 + 配音）
concat_txt = OUT / "concat.txt"
concat_txt.write_text("\n".join(f"file '{s.as_posix()}'" for s in segments), encoding="utf-8")
voice_video = OUT / "video_voice.mp4"
print("合并视频+配音...")
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt),
     "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "128k", str(voice_video)])

# 混入 BGM（音量压低为背景）
final = OUT / "final.mp4"
print("混入 BGM...")
run(["ffmpeg", "-y", "-i", str(voice_video), "-i", str(BGM),
     "-filter_complex",
     "[1:a]volume=0.16[bg];[0:a][bg]amix=inputs=2:duration=first:normalize=0[a]",
     "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
     str(final)])

print("FINISH:", final)
print(f"OK 总时长 {meta['total']:.2f}s")
