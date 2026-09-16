# 内容包

每一期视频以一个 `YYYY-MM-DD.json` 内容包保存：封面、新闻、图表数据、配音、证据和来源均在同一文件中。阶段 3 会让通用 Remotion 渲染器直接读取该包。

校验所有内容包：

```powershell
npm run validate:episodes
```

校验单期内容包：

```powershell
node scripts/validate-episodes.mjs 2026-09-13
```

在本机已生成配音与 BGM 后，可再检查内容包引用的媒体是否存在：

```powershell
npm run validate:episodes:assets
```

`legacy-migrated` 表示从已有成片迁移而来；它保留原有表述和来源线索，但不等同于重新联网核验。此类包允许来源 URL 为 `null`，后续事实核验完成后应将状态提升为 `verified`，并补上可访问 URL 与核验时间。
