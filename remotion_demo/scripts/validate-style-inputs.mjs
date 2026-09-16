import fs from 'node:fs';
import path from 'node:path';
import {defaultStyleByContentType, styleInputSchema} from './style-input-schema.mjs';

const args = process.argv.slice(2);
const fileFlag = args.indexOf('--file');
const onlineCheck = args.includes('--online');
const forRender = args.includes('--for-render');
const inputDirectory = path.resolve(process.cwd(), 'style-inputs');
const targets = fileFlag >= 0
  ? [path.resolve(process.cwd(), args[fileFlag + 1] ?? '')]
  : fs.readdirSync(inputDirectory).filter((file) => file.endsWith('.json')).map((file) => path.join(inputDirectory, file));

const checkUrl = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {method: 'HEAD', redirect: 'follow', signal: controller.signal});
    if (response.status >= 400) throw new Error(`返回 ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeNumberText = (value) => value.replace(/[\s,，]/g, '');

if (targets.length === 0) {
  console.error('没有找到可检查的风格输入文件。');
  process.exit(1);
}

let failed = false;
for (const target of targets) {
  try {
    const raw = JSON.parse(fs.readFileSync(target, 'utf8'));
    const result = styleInputSchema.safeParse(raw);
    if (!result.success) {
      console.error(`✗ ${path.basename(target)}`);
      for (const issue of result.error.issues) console.error(`  - ${issue.path.join('.') || '根字段'}：${issue.message}`);
      failed = true;
      continue;
    }
    const input = result.data;
    const recommended = defaultStyleByContentType[input.contentType];
    const errors = [];
    if (input.styleId && input.styleId !== recommended && !input.allowManualStyleOverride) errors.push(`${input.contentType} 默认应使用 ${recommended}；如确需改用 ${input.styleId}，请把 allowManualStyleOverride 设为 true。`);
    if ((input.contentType === 'product' || input.contentType === 'activity') && !/正式|公告|审核|以.*为准/.test(input.disclaimer)) errors.push('产品或活动内容的提示语必须说明以正式资料、审核内容或公告为准。');
    if (input.contentType === 'education' && !/不构成投资建议|风险/.test(input.disclaimer)) errors.push('金融知识科普必须包含风险提示或“不构成投资建议”。');
    if (input.review.verification === 'cross-checked') {
      if (input.review.sources.length < 2) errors.push('交叉核验至少需要两个来源。');
      if (new Set(input.review.sources.map((source) => source.outlet)).size < 2) errors.push('交叉核验需要来自至少两个不同来源。');
      if (input.review.sources.some((source) => !source.url)) errors.push('交叉核验的每个来源都必须填写可访问链接。');
    }
    if (input.review.verification === 'single-source' && input.review.sources.filter((source) => source.url).length < 1) errors.push('单一来源内容必须填写一个可访问链接。');
    if (input.review.verification === 'user-provided' && !input.review.userProvidedNote) errors.push('用户提供内容必须说明上传来源或材料名称。');
    const sourceById = new Map(input.review.sources.map((source) => [source.id, source]));
    for (const claim of input.review.numericClaims) {
      const referencedSourceIds = [...new Set(claim.sourceValues.map((value) => value.sourceId))];
      if (!sourceById.has(claim.adoptedSourceId)) errors.push(`核心数字“${claim.label}”采用的来源 ${claim.adoptedSourceId} 不在 sources 中。`);
      for (const sourceId of referencedSourceIds) {
        if (!sourceById.has(sourceId)) errors.push(`核心数字“${claim.label}”引用的来源 ${sourceId} 不在 sources 中。`);
      }
      if (input.review.verification === 'cross-checked' && referencedSourceIds.length < 2) errors.push(`核心数字“${claim.label}”交叉核验时至少要对应两个来源。`);
      if (claim.resolution === 'consistent' && new Set(claim.sourceValues.map((value) => normalizeNumberText(value.value))).size > 1) errors.push(`核心数字“${claim.label}”标为一致，但来源数值并不相同；请说明采用官方口径、较新口径或人工复核。`);
    }
    if (['cross-checked', 'single-source'].includes(input.review.verification) && input.heroValue && !input.review.numericClaims.some((claim) => normalizeNumberText(claim.displayedValue) === normalizeNumberText(input.heroValue))) {
      errors.push(`画面核心数字 ${input.heroValue}${input.heroUnit ?? ''} 未写入 review.numericClaims。`);
    }
    if (input.media?.voiceover && input.media.voiceover.durationSeconds > input.render.expectedDurationSeconds + 0.1) errors.push('旁白时长超过当前 8 秒模板时长，请先缩短文案或改用长视频模板。');
    for (const file of [input.media?.backgroundMusic?.file, input.media?.voiceover?.file].filter(Boolean)) {
      if (!fs.existsSync(path.resolve(process.cwd(), 'public', file))) errors.push(`缺少 public 素材：${file}`);
    }
    if (forRender && input.review.approvalStatus !== 'approved') errors.push('正式出片只接受 approvalStatus 为 approved 的内容。');
    if (forRender && input.review.verification === 'pending-review') errors.push('待审核内容只能作为草稿，不能直接正式出片。');
    if (onlineCheck && ['cross-checked', 'single-source'].includes(input.review.verification)) {
      for (const source of input.review.sources) {
        if (!source.url) continue;
        try { await checkUrl(source.url); } catch (error) { errors.push(`来源无法访问：${source.outlet}（${error instanceof Error ? error.message : String(error)}）`); }
      }
    }
    if (errors.length > 0) {
      console.error(`✗ ${path.basename(target)}`);
      for (const error of errors) console.error(`  - ${error}`);
      failed = true;
      continue;
    }
    console.log(`✓ ${path.basename(target)}  ${input.contentType} → ${input.styleId ?? recommended} · ${input.review.verification} · ${input.review.approvalStatus}`);
  } catch (error) {
    console.error(`✗ ${path.basename(target)}：${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('风格输入检查通过。');
