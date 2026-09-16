import fs from 'node:fs';
import path from 'node:path';
import {styleInputSchema} from './style-input-schema.mjs';

const args = process.argv.slice(2);
const getFlag = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const inputArgument = getFlag('--input');
const outputArgument = getFlag('--out');
if (!inputArgument) {
  console.error('用法：npm run review:style -- --input style-inputs/本期内容.json [--out out/本期内容.mp4]');
  process.exit(1);
}

try {
  const inputPath = path.resolve(process.cwd(), inputArgument);
  const parsed = styleInputSchema.safeParse(JSON.parse(fs.readFileSync(inputPath, 'utf8')));
  if (!parsed.success) throw new Error('输入文件格式不正确，请先执行 npm run validate:style-inputs。');
  const input = parsed.data;
  const outputBaseName = path.basename(outputArgument ?? inputPath, path.extname(outputArgument ?? inputPath));
  const reportDirectory = path.resolve(process.cwd(), 'review', outputBaseName);
  const reportPath = path.join(reportDirectory, 'content-review.md');
  const sourceRows = input.review.sources.length === 0
    ? '| — | 未提供 | — |'
    : input.review.sources.map((source) => `| ${source.id} | ${source.outlet} | ${source.url ?? '用户提供材料 / 无外部链接'} |`).join('\n');
  const numberRows = input.review.numericClaims.length === 0
    ? '| — | 本期未登记核心数字 | — | — | — |'
    : input.review.numericClaims.map((claim) => {
      const sourceValues = claim.sourceValues.map((value) => `${value.sourceId}: ${value.value}`).join('<br>');
      return `| ${claim.label} | ${claim.displayedValue} | ${sourceValues} | ${claim.adoptedSourceId} | ${claim.resolution}：${claim.resolutionNote} |`;
    }).join('\n');
  const report = `# 内容审核记录\n\n- 输入文件：\`${path.relative(process.cwd(), inputPath)}\`\n- 内容类型：${input.contentType}\n- 审核状态：${input.review.approvalStatus}\n- 核验方式：${input.review.verification}\n- 用户材料说明：${input.review.userProvidedNote ?? '—'}\n\n## 来源清单\n\n| 编号 | 来源 | 链接或材料说明 |\n| --- | --- | --- |\n${sourceRows}\n\n## 核心数字核验表\n\n| 数字名称 | 画面采用值 | 各来源记录值 | 最终采用来源 | 差异处理 |\n| --- | --- | --- | --- | --- |\n${numberRows}\n\n> 说明：程序会检查来源编号、最少来源数量和“数值一致”标记是否自洽；对事实含义、统计口径与页面正文的判断仍需由审核人完成。\n`;
  fs.mkdirSync(reportDirectory, {recursive: true});
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`✓ 内容审核记录：${reportPath}`);
} catch (error) {
  console.error(`✗ 无法生成内容审核记录：${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
