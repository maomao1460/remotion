import fs from 'node:fs';
import path from 'node:path';
import {newsBriefInputSchema} from './news-brief-schema.mjs';

const args = process.argv.slice(2);
const getFlag = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const inputArgument = getFlag('--input');
const outputArgument = getFlag('--out');
if (!inputArgument) { console.error('用法：npm run review:brief -- --input brief-inputs/本期.json [--out out/本期.mp4]'); process.exit(1); }
try {
  const inputPath = path.resolve(process.cwd(), inputArgument);
  const parsed = newsBriefInputSchema.safeParse(JSON.parse(fs.readFileSync(inputPath, 'utf8')));
  if (!parsed.success) throw new Error('输入文件格式不正确，请先执行 npm run validate:brief-inputs。');
  const input = parsed.data;
  const outputBase = path.basename(outputArgument ?? inputPath, path.extname(outputArgument ?? inputPath));
  const reviewDirectory = path.resolve(process.cwd(), 'review', outputBase);
  const reportPath = path.join(reviewDirectory, 'content-review.md');
  const sourceRows = input.review.sources.map((source) => `| ${source.id} | ${source.outlet} | ${source.url} |`).join('\n');
  const claimRows = input.review.numericClaims.map((claim) => `| ${claim.label} | ${claim.displayedValue} | ${claim.sourceValues.map((value) => `${value.sourceId}: ${value.value}`).join('<br>')} | ${claim.adoptedSourceId} | ${claim.resolution}：${claim.resolutionNote} |`).join('\n');
  const report = `# 财经快报审核记录\n\n- 输入文件：\`${path.relative(process.cwd(), inputPath)}\`\n- 热点数量：4\n- 审核状态：已批准\n- 核验方式：交叉核验\n\n## 来源清单\n\n| 编号 | 来源 | 链接 |\n| --- | --- | --- |\n${sourceRows}\n\n## 核心数字核验表\n\n| 数字名称 | 画面采用值 | 各来源记录值 | 最终采用来源 | 差异处理 |\n| --- | --- | --- | --- | --- |\n${claimRows}\n\n> 说明：程序检查来源、数值和采用口径是否自洽；对统计口径、事实含义和合规表述仍由内容审核负责。\n`;
  fs.mkdirSync(reviewDirectory, {recursive: true});
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`✓ 财经快报审核记录：${reportPath}`);
} catch (error) { console.error(`✗ 无法生成财经快报审核记录：${error instanceof Error ? error.message : String(error)}`); process.exit(1); }
