# -*- coding: utf-8 -*-
"""根据财经快报内容包生成分场景普通话旁白，并打印每段实际时长。"""
import argparse
import asyncio
import json
import pathlib
import subprocess

import edge_tts


def probe_duration(file_path: pathlib.Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(file_path)],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


async def main() -> None:
    parser = argparse.ArgumentParser(description="生成财经快报分场景旁白")
    parser.add_argument("--input", required=True, help="内容包 JSON 路径")
    parser.add_argument("--voice", default="zh-CN-YunjianNeural", help="Edge TTS 音色")
    parser.add_argument("--rate", default="+25%", help="语速；60 秒快报默认稍快")
    args = parser.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    source = pathlib.Path(args.input).resolve()
    content = json.loads(source.read_text(encoding="utf-8"))
    for segment in content["media"]["voiceovers"]:
        output = root / "public" / segment["file"]
        await edge_tts.Communicate(segment["text"], args.voice, rate=args.rate).save(str(output))
        duration = probe_duration(output)
        print(f"{segment['file']}  {duration:.2f}s / 画面上限 {segment['durationSeconds']:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
