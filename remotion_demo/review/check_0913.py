# -*- coding: utf-8 -*-
"""9 月 13 日横版财经梳理：源码与成片交付检查。"""
import json
import pathlib
import re
import subprocess
import sys

BASE = pathlib.Path(__file__).resolve().parents[1]
SOURCE_FILES = [BASE / "src" / "FullVideo0913.tsx", BASE / "src" / "NewsItem0913.tsx"]
VIDEO = BASE / "out" / "fullvideo_0913.mp4"
CHECK_DIR = BASE / "review"
SAMPLES = [2, 15, 28, 42, 56, 70, 83, 97, 110, 119, 122]


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")


def media_info() -> dict:
    result = run([
        "ffprobe", "-v", "error", "-show_entries",
        "stream=codec_type,width,height:format=duration",
        "-of", "json", str(VIDEO),
    ])
    if result.returncode:
        raise RuntimeError(result.stderr.strip())
    return json.loads(result.stdout)


def luminance(timestamp: int) -> tuple[float | None, int | None]:
    result = run([
        "ffmpeg", "-ss", str(timestamp), "-i", str(VIDEO), "-vf",
        "signalstats,metadata=print", "-frames:v", "1", "-f", "null", "-",
    ])
    output = result.stdout + result.stderr
    avg = re.search(r"lavfi\.signalstats\.YAVG=([\d.]+)", output)
    maximum = re.search(r"lavfi\.signalstats\.YMAX=(\d+)", output)
    return (float(avg.group(1)) if avg else None, int(maximum.group(1)) if maximum else None)


def export_frame(timestamp: int) -> pathlib.Path:
    destination = CHECK_DIR / f"chk0913_{timestamp:03d}.png"
    result = run([
        "ffmpeg", "-y", "-ss", str(timestamp), "-i", str(VIDEO),
        "-frames:v", "1", str(destination),
    ])
    if result.returncode:
        raise RuntimeError(result.stderr.strip())
    return destination


def main() -> int:
    source = "\n".join(path.read_text(encoding="utf-8") for path in SOURCE_FILES)
    requirements = {
        "封面日期": "2026.09.13",
        "要闻一": "A股失守3900",
        "要闻二": "美联储加息预期",
        "要闻三": "油价年内第三次破百",
        "要闻四": "光模块预测再上调",
        "风险提示": "仅消息面检索，不构成任何投资建议",
        "四段配音": "0913_news4.mp3",
        "背景音乐": "bgm.wav",
    }
    failures = []
    print("=== 源码交付元素 ===")
    for label, text in requirements.items():
        ok = text in source
        print(f"{'[PASS]' if ok else '[FAIL]'} {label}")
        if not ok:
            failures.append(label)

    if not VIDEO.exists():
        print("[FAIL] 成片不存在：", VIDEO)
        return 1

    info = media_info()
    video_stream = next((stream for stream in info["streams"] if stream.get("codec_type") == "video"), {})
    audio_stream = next((stream for stream in info["streams"] if stream.get("codec_type") == "audio"), {})
    duration = float(info["format"]["duration"])
    media_ok = video_stream.get("width") == 1920 and video_stream.get("height") == 1080 and bool(audio_stream)
    print("\n=== 成片规格 ===")
    print(f"{'[PASS]' if media_ok else '[FAIL]'} 1920×1080，时长 {duration:.3f}s，含音频轨")
    if not media_ok:
        failures.append("成片规格")

    print("\n=== 抽帧画面检查 ===")
    for timestamp in SAMPLES:
        frame = export_frame(timestamp)
        average, maximum = luminance(timestamp)
        ok = frame.exists() and frame.stat().st_size > 50_000 and maximum is not None and maximum > 40
        print(f"{'[PASS]' if ok else '[FAIL]'} t={timestamp:03d}s  YAVG={average} YMAX={maximum}  {frame.name}")
        if not ok:
            failures.append(f"t={timestamp}s 抽帧")

    print("\n=== 9 月 13 日交付检查：", "全部通过" if not failures else f"存在异常：{', '.join(failures)}")
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
