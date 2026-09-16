import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const getFlag = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const inputArgument = getFlag('--input');
const outputArgument = getFlag('--out');
if (!inputArgument) { console.error('用法：npm run render:brief -- --input brief-inputs/2026-09-15-finance-hotspots.json [--out out/财经快报.mp4] [--replace]'); process.exit(1); }
const input = path.resolve(process.cwd(), inputArgument);
const output = path.resolve(process.cwd(), outputArgument ?? path.join('out', `${path.basename(input, '.json')}.mp4`));
if (!fs.existsSync(input)) { console.error(`找不到输入文件：${input}`); process.exit(1); }
if (fs.existsSync(output) && !args.includes('--replace')) { console.error(`输出文件已存在：${output}\n为避免覆盖，请换一个 --out 文件名；只有确认替换时才加 --replace。`); process.exit(1); }

const validate = spawnSync(process.execPath, ['scripts/validate-news-briefs.mjs', '--file', input, '--for-render', '--online'], {cwd: process.cwd(), stdio: 'inherit'});
if (validate.status !== 0) process.exit(validate.status ?? 1);
const review = spawnSync(process.execPath, ['scripts/write-news-brief-review.mjs', '--input', input, '--out', output], {cwd: process.cwd(), stdio: 'inherit'});
if (review.status !== 0) process.exit(review.status ?? 1);
fs.mkdirSync(path.dirname(output), {recursive: true});
const remotionCli = path.resolve(process.cwd(), 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const render = spawnSync(process.execPath, [remotionCli, 'render', 'src/index.tsx', 'FinanceHotspotsBrief', output, `--props=${input}`, '--concurrency=4'], {cwd: process.cwd(), stdio: 'inherit'});
if (render.error) { console.error(`无法启动出片程序：${render.error.message}`); process.exit(1); }
if (render.status !== 0) process.exit(render.status ?? 1);
const verify = spawnSync(process.execPath, ['scripts/verify-render-output.mjs', '--input', input, '--out', output], {cwd: process.cwd(), stdio: 'inherit'});
process.exit(verify.status ?? 1);
