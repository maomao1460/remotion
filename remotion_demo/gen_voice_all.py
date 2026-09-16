# -*- coding: utf-8 -*-
"""生成完整6页视频配音（封面+4消息+结尾），并输出时长"""
import asyncio, json, pathlib, subprocess
import edge_tts

BASE = pathlib.Path(__file__).resolve().parent
VOICE = "zh-CN-YunjianNeural"
RATE = "+15%"

SEGS = {
    "cover": "这里是九月六号的财经要闻。三分钟，带你看懂这个周末的四个关键信号。",
    "news1": "第一，财政部发行三千亿元特别国债，向八家中央金融企业注资，用于补充核心一级资本。其中，农业银行获一千三百亿元，工商银行七百亿元，进出口银行、人寿、人保、太平、出口信保、再保等机构同步获注资。这笔注资被市场视为明确的政策底信号。市场怎么看？有机构测算，三千亿资本有望撬动约四万亿元资产增量，利好银行保险板块估值。也有观点认为，大行资本本就充足，这次更像着眼长远的蓄能安排。当然，定增短期会摊薄每股收益，还需留意。",
    "news2": "第二，美国八月非农就业爆表。新增就业十六点二万人，约为市场预期的三倍，失业率维持在百分之四点一。数据公布后，美联储九月加息二十五个基点的概率，从五成升至约六成，十年期美债收益率逼近百分之四点八，全球风险资产承压。市场怎么看？有机构认为，非农给鹰派添了筹码，加息概率一度飙至六成七。也有观点指出，真正决定方向的还是下周的通胀数据，若通胀继续降温，美联储仍可能按兵不动。",
    "news3": "第三，美伊冲突推升油价。霍尔木兹海峡承载着全球约五分之一的原油海运，布伦特原油周涨约百分之八，逼近九十六美元。供应中断的溢价正在被计入价格，并通过油价、通胀、利率层层传导。市场怎么看？高盛警告，若中东航运袭击继续升级，油价可能冲上一百二十美元。也有观点认为，短期油价大概率在九十到一百美元区间震荡，剔除地缘溢价后，公允价仅约七十美元。",
    "news4": "第四，七部门联合发文，推动数字化、绿色化协同转型。方案聚焦算力设施，探索八百伏高压直流供电、液冷散热、超百千瓦单机柜。目前，我国算力用电量已达一千九百六十亿千瓦时，同比增十八个百分点。市场怎么看？有机构指出，八百伏架构将带来机柜电源、备电等增量需求。也有观点强调，人工智能的竞争本质是电力的较量，算电协同才是深层战略。",
    "end": "关注下周一A股开盘。以上就是今天的财经要闻。以上内容仅消息面检索，不构成任何投资建议。",
}


def probe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


async def main():
    durations = {}
    for name, text in SEGS.items():
        mp3 = BASE / "public" / f"{name}.mp3"
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(str(mp3))
        dur = probe_dur(mp3)
        durations[name] = dur
        print(f"{name}.mp3  {dur:.2f}s")
    (BASE / "durations_all.json").write_text(
        json.dumps(durations, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"TOTAL {sum(durations.values()):.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
