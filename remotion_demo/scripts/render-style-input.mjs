import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const getFlag = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const inputArgument = getFlag('--input');
const outputArgument = getFlag('--out');

if (!inputArgument) {
  console.error('用法：npm run render:style -- --input style-inputs/活动推荐.demo.json [--out out/活动推荐.mp4] [--replace]');
  process.exit(1);
}

const input = path.resolve(process.cwd(), inputArgument);
const output = path.resolve(process.cwd(), outputArgument ?? path.join('out', `${path.basename(input, '.json')}.mp4`));
if (!fs.existsSync(input)) {
  console.error(`找不到输入文件：${input}`);
  process.exit(1);
}
if (fs.existsSync(output) && !args.includes('--replace')) {
  console.error(`输出文件已存在：${output}\n为避免覆盖，请换一个 --out 文件名；只有确认替换时才加 --replace。`);
  process.exit(1);
}

const validator = spawnSync(process.execPath, ['scripts/validate-style-inputs.mjs', '--file', input, '--for-render', '--online'], {cwd: process.cwd(), stdio: 'inherit'});
if (validator.status !== 0) process.exit(validator.status ?? 1);

const reviewRecord = spawnSync(process.execPath, ['scripts/write-content-review.mjs', '--input', input, '--out', output], {cwd: process.cwd(), stdio: 'inherit'});
if (reviewRecord.status !== 0) process.exit(reviewRecord.status ?? 1);

fs.mkdirSync(path.dirname(output), {recursive: true});
const remotionCli = path.resolve(process.cwd(), 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const rendered = spawnSync(process.execPath, [remotionCli, 'render', 'src/index.tsx', 'StyleSwitcherPreview', output, `--props=${input}`, '--concurrency=4'], {cwd: process.cwd(), stdio: 'inherit'});
if (rendered.error) {
  console.error(`无法启动出片程序：${rendered.error.message}`);
  process.exit(1);
}
if (rendered.status !== 0) process.exit(rendered.status ?? 1);
const outputCheck = spawnSync(process.execPath, ['scripts/verify-render-output.mjs', '--input', input, '--out', output], {cwd: process.cwd(), stdio: 'inherit'});
process.exit(outputCheck.status ?? 1);
