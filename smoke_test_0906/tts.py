# -*- coding: utf-8 -*-
"""冒烟测试：逐段 TTS 配音 -> 量时长 -> 生成 SRT 字幕 + durations.json"""
import asyncio, json, pathlib, subprocess, sys
import edge_tts

BASE = pathlib.Path(__file__).resolve().parent
AUDIO_DIR = BASE / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
VOICE = "zh-CN-YunjianNeural"  # 云健，男声新闻播报

SCRIPTS = [
    "这里是九月六号的财经要闻。一分半钟，带你看懂这个周末的四个关键信号。",
    "第一，财政部史诗级出手，向工农中保等金融机构注资超过三千亿元。工商银行、农业银行抛出定增预案，财政部认购两千亿元；人保、人寿、太平合计获注资五百七十亿元。资金全部用于补充核心一级资本，背后是三千亿元特别国债。市场普遍认为，这是一次明确的政策底信号。",
    "第二，美国八月非农就业爆表。新增就业十六点二万人，约为市场预期的三倍，失业率维持在百分之四点一。数据公布后，美联储九月加息二十五个基点的概率，从五成飙升至六成。十年期美债收益率逼近百分之四点八，全球风险资产承压，黄金和比特币同步走弱。",
    "第三，美伊冲突推升油价。霍尔木兹海峡承载着全球约五分之一的原油海运，供应中断的溢价正在被计入价格。布伦特原油突破九十美元，周涨约百分之九，逼近九十六美元。地缘风险通过油价、通胀、利率层层传导，压制全球风险偏好。",
    "第四，七部门联合发文，推动数字化、绿色化协同转型。方案聚焦算力设施，探索八百伏高压直流供电、液冷散热、超百千瓦单机柜部署。叠加算力网十五五期间新增投资超四万亿元，AI算力产业链迎来政策和需求的双重支撑。",
    "关注下周一A股开盘，政策底的逻辑能否兑现，我们持续跟踪。以上就是今天的财经要闻。",
]


def probe_dur(p):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(p)],
        capture_output=True, text=True)
    return float(r.stdout.strip())


def fmt_ts(sec):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


async def synth(text, out_mp3):
    comm = edge_tts.Communicate(text, VOICE, rate="+0%")
    await comm.save(str(out_mp3))


async def main():
    durations = []
    for i, text in enumerate(SCRIPTS, 1):
        mp3 = AUDIO_DIR / f"seg_{i:02d}.mp3"
        await synth(text, mp3)
        dur = probe_dur(mp3)
        durations.append(dur)
        print(f"[{i}/{len(SCRIPTS)}] seg_{i:02d}.mp3  {dur:.2f}s")

    # 生成 SRT（每段一个字幕块）
    srt_lines = []
    t0 = 0.0
    for i, (text, dur) in enumerate(zip(SCRIPTS, durations), 1):
        t1 = t0 + dur
        srt_lines.append(str(i))
        srt_lines.append(f"{fmt_ts(t0)} --> {fmt_ts(t1)}")
        srt_lines.append(text)
        srt_lines.append("")
        t0 = t1
    srt_path = BASE / "out" / "subtitle.srt"
    srt_path.parent.mkdir(parents=True, exist_ok=True)
    srt_path.write_text("\n".join(srt_lines), encoding="utf-8")

    meta = {"durations": durations, "total": sum(durations)}
    (BASE / "durations.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print("SRT ->", srt_path)
    print("durations.json ->", BASE / "durations.json")
    print(f"TOTAL {sum(durations):.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
