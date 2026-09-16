# -*- coding: utf-8 -*-
"""渲染前 DOM 审核：核对今日（0910）横屏成片必备元素"""
import pathlib

BASE = pathlib.Path(__file__).resolve().parents[1]
src = (BASE / "src" / "FullVideo0910.tsx").read_text(encoding="utf-8")
sec = (BASE / "src" / "NewsSectionLandscape.tsx").read_text(encoding="utf-8")
all_src = src + sec

REQUIRED = {
    "封面-9月10日财经要闻": "9月10日 财经要闻",
    "要闻一-银行逆势创新高": "银行股逆势创新高",
    "要闻二-存储景气": "存储芯片景气上行",
    "要闻三-布伦特破百": "布伦特破 100 美元",
    "要闻四-金融发布会": "国新办金融发布会",
    "结尾风险提示": "仅消息面检索，不构成任何投资建议",
    "观点-渤海证券": "渤海证券",
    "观点-摩根大通": "摩根大通",
    "观点-高盛": "高盛",
    "观点-富达国际": "富达国际",
}

report = []
all_ok = True
for label, kw in REQUIRED.items():
    ok = kw in all_src
    if not ok:
        all_ok = False
    report.append(f"{'✅' if ok else '❌'} {label}")

print("\n".join(report))
print("=== 渲染前 DOM 审核:", "全部通过 ✅" if all_ok else "存在缺漏 ❌")
raise SystemExit(0 if all_ok else 1)
