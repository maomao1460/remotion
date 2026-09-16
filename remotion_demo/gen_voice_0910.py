# -*- coding: utf-8 -*-
"""生成9月10日财经要闻配音（①财经专业风：云健男声 +15%）"""
import asyncio, json, pathlib, subprocess
import edge_tts

BASE = pathlib.Path(__file__).resolve().parent
VOICE = "zh-CN-YunjianNeural"
RATE = "+15%"

SEGS = {
    "cover": "这里是九月十号的财经要闻。三分钟，看懂今天的四个关键信号。",
    "news1": "第一，A股震荡调整，银行股逆势创新高。沪指收跌百分之零点四三，报三千九百三十四点四零；两市成交一点六五万亿元，创年内次新低。盘面上，银行板块逆势走强，南京银行、江苏银行、杭州银行齐创历史新高，高股息成为存量资金的避风港。市场怎么看？渤海证券认为，市场延续震荡特征，中期政策部署有助于降低下行风险。也有观点指出，银行创新高与科技回调并存，反映存量资金在防御与成长之间反复切换。",
    "news2": "第二，存储芯片景气上行，议价权转向卖方。瑞银预计，三季度DDR价格环比上涨百分之二十二，NAND合约价上涨百分之二十，供应短缺格局将持续到二零二七年。苹果发布两纳米制程A20 Pro芯片，并签订三到五年无价格上限的NAND长协，三星、海力士库存不足十天。市场怎么看？摩根大通、美银纷纷上调存储龙头评级。但铠侠CEO警告，NAND价格涨幅已足够，继续强推涨价可能损害行业自身增长。",
    "news3": "第三，中东局势升级，布伦特原油突破一百美元。夜盘布伦特结算价报一百零一点二一美元，为五个月新高，七月底以来首次站上三位数。伊朗革命卫队宣布在霍尔木兹海峡设立新制裁区域，美军摧毁五艘伊朗油轮。市场怎么看？高盛警告，若航运袭击继续升级，油价可能冲上一百二十美元。也有观点认为，特朗普表态战事或于十一月中期选举后结束，地缘缓和随时可能引发油价回吐。",
    "news4": "第四，央行、证监会、金融监管总局、外汇局齐聚国新办，解读十五五金融强国建设。数据面上，八月CPI同比上涨百分之零点八，PPI同比增长百分之三点八，出口增长百分之十八点六。市场怎么看？富达国际认为，亚洲正进入新一轮增长周期。也有机构提醒，美联储九月加息概率升至约六成，外部流动性仍构成约束。",
    "end": "关注后续经济数据与政策落地。以上就是今天的财经要闻。以上内容仅消息面检索，不构成任何投资建议。",
}


def probe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


async def main():
    durations = {}
    for name, text in SEGS.items():
        mp3 = BASE / "public" / f"0910_{name}.mp3"
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(str(mp3))
        dur = probe_dur(mp3)
        durations[name] = dur
        print(f"0910_{name}.mp3  {dur:.2f}s")
    (BASE / "durations_0910.json").write_text(
        json.dumps(durations, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"TOTAL {sum(durations.values()):.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
