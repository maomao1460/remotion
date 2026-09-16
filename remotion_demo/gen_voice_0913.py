# -*- coding: utf-8 -*-
"""生成9月13日财经梳理配音（①财经专业风：云健男声 +15%）"""
import asyncio, json, pathlib, subprocess
import edge_tts

BASE = pathlib.Path(__file__).resolve().parent
VOICE = "zh-CN-YunjianNeural"
RATE = "+15%"

SEGS = {
    "cover": "这里是九月十三号的财经梳理。三分钟，看懂这周的四个关键信号。",
    "news1": "第一，A股本周调整，上证失守三千九百点。沪指全周下跌百分之一点零七，周五收报三千八百八十八点一一。创业板逆势上涨百分之一点零八，通信、算力硬件成为资金避风港，两市主力净流出二百四十八亿元。市场怎么看？有机构认为，核心矛盾不在内部，而在海外利率定价。也有观点指出，流动性并不缺，缺的是增量资金的承接意愿。",
    "news2": "第二，美联储加息预期骤然升温。美国八月核心CPI超出预期，市场对九月加息二十五个基点的押注升至近九成。高盛、摩根大通集体转鹰，十年期美债收益率升至百分之四点九六，创阶段新高。市场怎么看？高盛认为，委员会不希望按兵不动引发剧烈波动。巴克莱则指出，符合预期的数据也不会排除加息，但政策方向明确后终将回稳。",
    "news3": "第三，中东局势再升级，油价年内第三次破百。本周布伦特原油上涨百分之八点八四，重新站上一百美元。霍尔木兹航运风险重燃，中东至中国VLCC运费飙升至正常基准的四点五倍。市场怎么看？地缘推油价、油价推通胀、通胀逼央行偏鹰的传导链条清晰。也有观点认为，伊朗表态若美国结束封锁，海峡将重新开放。",
    "news4": "第四，AI算力景气延续，光模块再获上调。高盛将二零二八年全球光模块市场预测上调至一千四百八十五亿美元，较此前上调百分之一百一十五。FCC新规落地，中国光通信企业未被纳入限制名单，GPT-6 Astra发布，黄仁勋称AGI已经到来。市场怎么看？算力硬件方向经历回调后，估值回到低位，政策与产业共振。",
    "end": "关注下周通胀数据与政策落地。以上就是今天的财经梳理。以上内容仅消息面检索，不构成任何投资建议。",
}


def probe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


async def main():
    durations = {}
    for name, text in SEGS.items():
        mp3 = BASE / "public" / f"0913_{name}.mp3"
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(str(mp3))
        dur = probe_dur(mp3)
        durations[name] = dur
        print(f"0913_{name}.mp3  {dur:.2f}s")
    (BASE / "durations_0913.json").write_text(
        json.dumps(durations, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"TOTAL {sum(durations.values()):.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
