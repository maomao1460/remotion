# -*- coding: utf-8 -*-
"""渲染前 DOM 审核：核对完整视频（FullVideo + NewsSection）必备元素"""
import pathlib

BASE = pathlib.Path(__file__).resolve().parents[1]
src_dir = BASE / "src"
full = (src_dir / "FullVideo.tsx").read_text(encoding="utf-8")
section = (src_dir / "NewsSection.tsx").read_text(encoding="utf-8")
all_src = full + section

REQUIRED = {
    "封面-9月6日财经要闻": "财经要闻",
    "要闻一-财政部注资3000亿": "注资 3000 亿",
    "要闻二-美国非农爆表": "美国非农爆表",
    "要闻三-美伊冲突": "美伊冲突",
    "要闻四-七部门发文": "七部门发文",
    "结尾-风险提示": "仅消息面检索，不构成任何投资建议",
    "机构-农业银行": "农业银行",
    "机构-工商银行": "工商银行",
    "机构-进出口银行": "进出口银行",
    "机构-中国再保": "中国再保",
    "观点-政策底乐观": "撬动约四万亿",
    "观点-加息鹰派": "67%",
    "观点-油价高盛": "120 美元",
    "观点-算力开源": "800V 架构",
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
