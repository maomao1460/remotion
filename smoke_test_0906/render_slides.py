# -*- coding: utf-8 -*-
"""冒烟测试：生成竖屏1080x1920 HTML幻灯片 -> Edge无头截图渲染PNG"""
import subprocess, pathlib, sys, time

BASE = pathlib.Path(__file__).resolve().parent
PNG_DIR = BASE / "png"
PNG_DIR.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 每页配色主题
SLIDES = [
    {
        "type": "cover",
        "tag": "财经要闻 · 2026.09.06",
        "title": "9月6日\n财经要闻",
        "chips": ["四大信号", "看懂周末"],
        "color": "#3B82F6",
    },
    {
        "type": "body",
        "tag": "要闻一 · 政策底",
        "title": "财政部出手\n注资超 3000 亿",
        "chips": ["政策底", "特别国债"],
        "points": [
            "工行、农行定增，财政部认购 2000 亿",
            "人保、人寿、太平获注资 570 亿",
            "进出口行 300 亿、出口信保 100 亿",
            "资金全部用于补充核心一级资本",
        ],
        "highlight": "3000亿",
        "note": "金融体系增资总规模",
        "color": "#F5B841",
    },
    {
        "type": "body",
        "tag": "要闻二 · 加息升温",
        "title": "美国非农爆表\n加息概率飙至六成",
        "chips": ["加息升温", "美债承压"],
        "points": [
            "8 月新增就业 16.2 万，约为预期三倍",
            "失业率 4.1%，前两月数据大幅上修",
            "9 月加息 25bp 概率升至 60%",
            "10 年期美债 4.8%，风险资产承压",
        ],
        "highlight": "16.2万",
        "note": "8 月非农新增就业",
        "color": "#E24B4A",
    },
    {
        "type": "body",
        "tag": "要闻三 · 地缘风险",
        "title": "美伊冲突\n油价逼近 96 美元",
        "chips": ["地缘风险", "供应溢价"],
        "points": [
            "霍尔木兹海峡占全球 1/5 原油海运",
            "布伦特突破 90 美元，周涨约 9%",
            "供应中断溢价被计入价格",
            "通胀—加息—长端利率层层传导",
        ],
        "highlight": "96美元",
        "note": "布伦特原油逼近",
        "color": "#F0997B",
    },
    {
        "type": "body",
        "tag": "要闻四 · 政策红利",
        "title": "七部门发文\n算力网迎红利",
        "chips": ["政策红利", "AI 算力"],
        "points": [
            "800V 高压直流、液冷散热",
            "超百千瓦单机柜部署",
            "算力网「十五五」新增投资超 4 万亿",
            "AI 算力链获政策 + 需求双支撑",
        ],
        "highlight": "4万亿+",
        "note": "算力网新增直接投资",
        "color": "#5DCAA5",
    },
    {
        "type": "cover",
        "tag": "关注 · 下个交易日",
        "title": "周一 A 股\n能否兑现政策底？",
        "chips": ["持续跟踪"],
        "color": "#7F77DD",
    },
]

CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1920px; overflow:hidden;
  background:#0B1120; color:#E8ECF5;
  font-family:"Microsoft YaHei","PingFang SC",sans-serif; }
.page { position:relative; width:1080px; height:1920px; padding:120px 90px 100px;
  display:flex; flex-direction:column; }
.accent { position:absolute; left:0; top:0; width:1080px; height:12px; background:COLOR; }
.watermark { position:absolute; right:-40px; bottom:120px; font-size:360px; font-weight:700;
  color:rgba(255,255,255,0.03); line-height:1; pointer-events:none; }
.tag { font-size:30px; letter-spacing:4px; color:COLOR; font-weight:500; }
.title { margin-top:70px; font-size:88px; line-height:1.28; font-weight:700; color:#FFFFFF; }
.chips { margin-top:60px; display:flex; gap:28px; flex-wrap:wrap; }
.chip { font-size:28px; color:COLOR; border:2px solid COLOR; border-radius:999px;
  padding:14px 34px; letter-spacing:2px; }
.pointlist { margin-top:90px; display:flex; flex-direction:column; gap:52px; }
.point { display:flex; align-items:flex-start; gap:28px; }
.dot { width:16px; height:16px; border-radius:50%; background:COLOR; margin-top:22px; flex:none; }
.ptext { font-size:42px; line-height:1.5; color:#C7D0E0; }
.highlight { margin-top:auto; display:flex; flex-direction:column; gap:8px; }
.hnum { font-size:120px; font-weight:700; color:COLOR; line-height:1; }
.hnote { font-size:32px; color:#8A94A8; letter-spacing:2px; }
.footer { position:absolute; left:90px; bottom:70px; right:90px; display:flex;
  justify-content:space-between; align-items:center; }
.fpage { font-size:28px; color:#5A6478; letter-spacing:2px; }
.fbrand { font-size:26px; color:#3A4356; letter-spacing:2px; }
.cover-wrap { height:100%; display:flex; flex-direction:column; justify-content:center; }
.cover-title { font-size:100px; line-height:1.32; font-weight:700; color:#FFFFFF; }
.cover-sub { margin-top:56px; font-size:40px; color:#8A94A8; line-height:1.6; letter-spacing:2px; }
"""


def page_html(idx, s, total):
    c = s["color"]
    css = CSS.replace("COLOR", c)
    if s["type"] == "body":
        points = "".join(
            f'<div class="point"><span class="dot"></span><span class="ptext">{p}</span></div>'
            for p in s["points"]
        )
        body = f"""
        <div class="accent"></div>
        <div class="watermark">{idx:02d}</div>
        <div class="tag">{s['tag']}</div>
        <div class="title">{s['title'].replace(chr(10), '<br>')}</div>
        <div class="chips">{''.join(f'<span class="chip">{t}</span>' for t in s['chips'])}</div>
        <div class="pointlist">{points}</div>
        <div class="highlight"><span class="hnum">{s['highlight']}</span>
        <span class="hnote">{s['note']}</span></div>
        """
    else:
        body = f"""
        <div class="accent"></div>
        <div class="watermark">{idx:02d}</div>
        <div class="cover-wrap">
          <div class="tag">{s['tag']}</div>
          <div class="cover-title">{s['title'].replace(chr(10), '<br>')}</div>
          <div class="chips" style="margin-top:64px">{''.join(f'<span class="chip">{t}</span>' for t in s['chips'])}</div>
        </div>
        """
    return f"""<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8">
<style>{css}</style></head><body><div class="page">{body}
<div class="footer"><span class="fpage">{idx:02d} / {total:02d}</span>
<span class="fbrand">冒烟测试 · 降本流水线</span></div>
</div></body></html>"""


def main():
    total = len(SLIDES)
    results = []
    for i, s in enumerate(SLIDES, 1):
        html = page_html(i, s, total)
        hf = BASE / f"slide_{i:02d}.html"
        hf.write_text(html, encoding="utf-8")
        png = PNG_DIR / f"page_{i:02d}.png"
        profile = BASE / f"edge_profile_{i}"
        cmd = [
            EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1", "--no-first-run",
            "--no-default-browser-check", f"--user-data-dir={profile}",
            "--window-size=1080,1920", "--virtual-time-budget=2500",
            f"--screenshot={png}", hf.as_uri(),
        ]
        ok = False
        for attempt in range(4):
            subprocess.run(cmd, capture_output=True, text=True, timeout=90)
            if png.exists() and png.stat().st_size > 10000:
                ok = True
                break
            time.sleep(2)
        time.sleep(2)  # 让 Edge 子进程彻底退出，避免进程竞态
        results.append((png.name, "OK" if ok else "FAIL", png.stat().st_size if png.exists() else 0))
        print(f"[{i}/{total}] {png.name} {'OK' if ok else 'FAIL'} size={png.stat().st_size if png.exists() else 0}")
    fail = [r for r in results if r[1] == "FAIL"]
    print("ALL OK" if not fail else f"{len(fail)} FAILED: {fail}")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
