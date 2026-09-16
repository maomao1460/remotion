# -*- coding: utf-8 -*-
"""渲染前 DOM 审核：核对 FullNews 源码中必备元素是否齐全"""
import pathlib

BASE = pathlib.Path(__file__).resolve().parents[1]
src = (BASE / "src" / "FullNews.tsx").read_text(encoding="utf-8")

REQUIRED = {
    "标题-财政部出手": "财政部出手",
    "标题-注资3000亿": "注资 3000 亿",
    "机构-农业银行": "农业银行",
    "机构-工商银行": "工商银行",
    "机构-中国人寿": "中国人寿",
    "机构-进出口银行": "进出口银行",
    "机构-中国人保": "中国人保",
    "机构-出口信保": "出口信保",
    "机构-中国太平": "中国太平",
    "机构-中国再保": "中国再保",
    "观点-乐观提振": "乐观 · 提振",
    "观点-中性蓄能": "中性 · 蓄能",
    "观点-谨慎摊薄": "谨慎 · 摊薄",
    "风险提示": "仅消息面检索，不构成任何投资建议",
}

report = []
all_ok = True
for label, kw in REQUIRED.items():
    ok = kw in src
    if not ok:
        all_ok = False
    report.append(f"{'✅' if ok else '❌'} {label}")

print("\n".join(report))
print("=== 渲染前 DOM 审核:", "全部通过 ✅" if all_ok else "存在缺漏 ❌")
raise SystemExit(0 if all_ok else 1)
