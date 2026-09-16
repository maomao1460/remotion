import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {newsBriefInputSchema} from './news-brief-schema.mjs';

const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const online = args.includes('--online');
const forRender = args.includes('--for-render');
const inputDirectory = path.resolve(process.cwd(), 'brief-inputs');
const targets = fileIndex >= 0 ? [path.resolve(process.cwd(), args[fileIndex + 1] ?? '')] : fs.readdirSync(inputDirectory).filter((file) => file.endsWith('.json')).map((file) => path.join(inputDirectory, file));
const normalize = (value) => value.replace(/[\s,，]/g, '').replace(/内$/u, '');
const normalizeNarration = (value) => value.replace(/[\s,，。；;、！？!?]/g, '');

const checkUrl = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(url, {method: 'HEAD', redirect: 'follow', signal: controller.signal});
    if (response.status === 405 || response.status === 403) response = await fetch(url, {method: 'GET', redirect: 'follow', headers: {Range: 'bytes=0-512'}, signal: controller.signal});
    if (response.status >= 400) throw new Error(`返回 ${response.status}`);
  } finally { clearTimeout(timeout); }
};

const audioDuration = (file) => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(result.stderr || 'ffprobe 无法读取音频。');
  return Number(result.stdout.trim());
};

if (targets.length === 0) { console.error('没有找到财经快报输入文件。'); process.exit(1); }
let failed = false;
for (const target of targets) {
  try {
    const parsed = newsBriefInputSchema.safeParse(JSON.parse(fs.readFileSync(target, 'utf8')));
    if (!parsed.success) {
      console.error(`✗ ${path.basename(target)}`);
      for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}：${issue.message}`);
      failed = true;
      continue;
    }
    const input = parsed.data;
    const errors = [];
    const sources = new Map(input.review.sources.map((item) => [item.id, item]));
    if (sources.size !== input.review.sources.length) errors.push('来源编号不能重复。');
    for (const topic of input.topics) for (const perspective of [topic.positive, topic.caution, topic.neutral]) {
      if (!sources.has(perspective.sourceId)) errors.push(`热点“${topic.eyebrow}”的“${perspective.label}”观点引用了未登记来源 ${perspective.sourceId}。`);
    }
    for (const claim of input.review.numericClaims) {
      const sourceIds = [...new Set(claim.sourceValues.map((item) => item.sourceId))];
      if (sourceIds.length < 2) errors.push(`核心数字“${claim.label}”至少需要两个来源。`);
      if (!sources.has(claim.adoptedSourceId)) errors.push(`核心数字“${claim.label}”的采用来源不存在。`);
      for (const sourceId of sourceIds) if (!sources.has(sourceId)) errors.push(`核心数字“${claim.label}”引用了未登记来源 ${sourceId}。`);
      if (claim.resolution === 'consistent' && new Set(claim.sourceValues.map((item) => normalize(item.value))).size > 1) errors.push(`核心数字“${claim.label}”标为一致，但两个来源数值不一致。`);
    }
    for (let index = 0; index < input.captions.length; index += 1) {
      const current = input.captions[index];
      const next = input.captions[index + 1];
      if (current.endMs <= current.startMs) errors.push(`字幕 ${index + 1} 的结束时间必须晚于开始时间。`);
      if (next && current.endMs > next.startMs) errors.push(`字幕 ${index + 1} 与 ${index + 2} 发生重叠。`);
    }
    const voiceovers = new Map(input.media.voiceovers.map((item) => [item.file, item]));
    for (const caption of input.captions) if (!voiceovers.has(caption.voiceoverFile)) errors.push(`字幕“${caption.text}”关联了不存在的旁白 ${caption.voiceoverFile}。`);
    for (const voiceover of input.media.voiceovers) {
      const related = input.captions.filter((caption) => caption.voiceoverFile === voiceover.file);
      if (related.length === 0) { errors.push(`旁白 ${voiceover.file} 没有对应字幕。`); continue; }
      const spokenStart = voiceover.fromSeconds * 1000;
      const spokenEnd = (voiceover.fromSeconds + voiceover.durationSeconds) * 1000;
      if (related[0].startMs !== spokenStart) errors.push(`旁白 ${voiceover.file} 的首条字幕必须从 ${spokenStart}ms 开始。`);
      if (related.at(-1).endMs !== spokenEnd) errors.push(`旁白 ${voiceover.file} 的末条字幕必须在 ${spokenEnd}ms 结束。`);
      if (related.some((caption) => caption.startMs < spokenStart || caption.endMs > spokenEnd)) errors.push(`旁白 ${voiceover.file} 的字幕时间超出所属旁白范围。`);
      if (normalizeNarration(related.map((caption) => caption.text).join('')) !== normalizeNarration(voiceover.text)) errors.push(`旁白 ${voiceover.file} 与对应字幕文字不一致。`);
    }
    if (input.captions.at(-1)?.endMs !== input.render.expectedDurationSeconds * 1000) errors.push('最后一条字幕必须覆盖到成片结束时间。');
    const audioFiles = [input.media.backgroundMusic.file, ...input.media.voiceovers.map((item) => item.file)];
    for (const file of audioFiles) if (!fs.existsSync(path.resolve(process.cwd(), 'public', file))) errors.push(`缺少 public 素材：${file}`);
    if (forRender) for (const voiceover of input.media.voiceovers) {
      const file = path.resolve(process.cwd(), 'public', voiceover.file);
      if (!fs.existsSync(file)) continue;
      const actual = audioDuration(file);
      if (!Number.isFinite(actual) || actual > voiceover.durationSeconds) errors.push(`旁白 ${voiceover.file} 为 ${actual.toFixed(2)} 秒，超过所属画面 ${voiceover.durationSeconds} 秒。`);
    }
    if (online) for (const source of input.review.sources) {
      try { await checkUrl(source.url); } catch (error) { errors.push(`来源无法访问：${source.outlet}（${error instanceof Error ? error.message : String(error)}）`); }
    }
    if (errors.length > 0) { console.error(`✗ ${path.basename(target)}`); for (const error of errors) console.error(`  - ${error}`); failed = true; continue; }
    console.log(`✓ ${path.basename(target)}  4 条热点 · ${input.review.numericClaims.length} 个核心数字 · 已交叉核验`);
  } catch (error) { console.error(`✗ ${path.basename(target)}：${error instanceof Error ? error.message : String(error)}`); failed = true; }
}
if (failed) process.exit(1);
console.log('财经快报输入检查通过。');
