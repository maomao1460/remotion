# PPT 动画流

面向金融内容的 Remotion 视频生产流：把已审核的文案、来源、配音与画面风格组合为可检查、可复现的横版或竖版视频。

## 当前能力

- Remotion 模板：横版 16:9 与竖版 9:16。
- 配音：Edge TTS 分段生成；BGM、字体和音频资源置于 `remotion_demo/public/`。
- 内容包：每期的文案、图表、配音、证据与来源线索统一存放在 `remotion_demo/episodes/`。
- 四种短视频风格：数据脉冲、产品介绍、活动推荐、金融知识科普；填写 `style-inputs/` 的一份内容文件即可选择对应画面风格。
- 质量检查：源码元素、视频规格与抽帧画面检查。
- 5A 安全能力：首个 Git 基线、音频素材清单与备份指引、核心数字“来源—采用值—差异处理”核验表。
- 已交付案例：9 月 10 日与 9 月 13 日横版财经梳理。

`smoke_test_0906/` 是早期的 HTML 截图 + FFmpeg 验证方案；日常制作以 `remotion_demo/` 为准。

## 目录

```text
remotion_demo/
  src/       Remotion 组件与视频模板
  episodes/  按期保存的可校验内容包
  scripts/   内容包结构校验器
  manifests/ 本地音频的可恢复清单
  public/    字体、配音与 BGM（本地生成资源，不入 Git）
  docs/      素材恢复与制作说明
  review/    数据核对表、审核报告与检查脚本
  out/       渲染成片（不入 Git）
```

## 本地复跑

前置条件：Node.js、npm、FFmpeg/FFprobe，以及可供 Remotion 使用的 Chrome Headless Shell。Python 审核脚本还需要可用的 Python 解释器。

```powershell
cd remotion_demo
npm ci
npm run browser:ensure
npm run verify
npm run validate:episodes
npm run validate:episodes:assets
npm run validate:style-inputs
npm run verify:audio-assets
npm run render:0913
```

检查已生成的 9 月 13 日成片：

```powershell
& 'C:\Users\Administrator\.workbuddy\binaries\python\envs\default\Scripts\python.exe' .\review\check_0913.py
```

该 Python 路径是当前 WorkBuddy 环境的已验证路径；迁移到其他机器时，请换成该机器的 Python 路径，并确保 `ffmpeg` 与 `ffprobe` 在 `PATH` 中。

## 新风格短视频的标准流程

1. 复制 `remotion_demo/style-inputs/` 中最接近的示例，填写本期文案与风险提示。
2. 填写审核状态和来源。若有核心数字，必须写明每个来源的记录值、画面最终采用的值及差异处理说明。
3. 运行 `npm run validate:style-inputs`，必要时运行 `npm run review:style -- --input style-inputs/本期内容.json` 查看审核表。
4. 通过人工审核后，运行 `npm run render:style -- --input style-inputs/本期内容.json --out out/本期内容.mp4`。
5. 程序会检查尺寸、时长、音轨和关键画面；正式交付前仍需人工检查文字、素材授权和合规提示。

详见 `remotion_demo/style-inputs/README.md`。音频备份和恢复说明见 `remotion_demo/docs/素材恢复说明.md`。

## 质量边界

渲染审核保证素材、画面与输出规格完整，不替代财经数据的事实核验。来源链接可以访问，也不代表统计口径和数字含义完全一致；每期仍须由审核人判断来源可信度与差异处理。`legacy-migrated` 内容包仅迁移已有成片的表述与来源线索；只有补齐可访问来源并完成复核后，才能标记为 `verified`。
