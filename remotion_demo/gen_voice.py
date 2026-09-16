# -*- coding: utf-8 -*-
"""生成完整消息页配音（财政部注资），并输出时长"""
import asyncio, json, pathlib, subprocess
import edge_tts

BASE = pathlib.Path(__file__).resolve().parent
VOICE = "zh-CN-YunjianNeural"

TEXT = (
    "财政部发行三千亿元特别国债，向八家中央金融企业注资，用于补充核心一级资本。"
    "其中，农业银行获一千三百亿元，工商银行七百亿元，"
    "进出口银行、人寿、人保、太平、出口信保、再保等机构同步获注资。"
    "这笔注资被市场视为明确的政策底信号。"
    "市场怎么看？有机构测算，三千亿资本有望撬动约四万亿元资产增量，利好银行保险板块估值。"
    "也有观点认为，大行资本本就充足，这次更像着眼长远的蓄能安排。"
    "当然，定增短期会摊薄每股收益，还需留意。"
    "以上内容仅消息面检索，不构成任何投资建议。"
)


def probe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


async def main():
    mp3 = BASE / "public" / "full_voice.mp3"
    comm = edge_tts.Communicate(TEXT, VOICE, rate="+15%")
    await comm.save(str(mp3))
    dur = probe_dur(mp3)
    (BASE / "full_voice_duration.json").write_text(
        json.dumps({"duration": dur}, ensure_ascii=False), encoding="utf-8")
    print(f"voice -> {mp3}  {dur:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
