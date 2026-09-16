import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const getFlag = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const inputPath = path.resolve(process.cwd(), getFlag('--input') ?? '');
const outputPath = path.resolve(process.cwd(), getFlag('--out') ?? '');
if (!fs.existsSync(inputPath) || !fs.existsSync(outputPath)) {
  console.error('产出检查需要存在的 --input 与 --out 文件。');
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate', '-of', 'json', outputPath], {encoding: 'utf8'});
if (probe.status !== 0) {
  console.error(`无法读取成片信息：${probe.stderr || probe.error?.message || 'ffprobe 失败'}`);
  process.exit(1);
}
const metadata = JSON.parse(probe.stdout);
const video = metadata.streams.find((stream) => stream.codec_type === 'video');
const audio = metadata.streams.find((stream) => stream.codec_type === 'audio');
const duration = Number(metadata.format.duration);
const expectedFps = `${input.render.fps}/1`;
const errors = [];
if (!video) errors.push('成片缺少视频轨道。');
if (video && (video.width !== input.render.width || video.height !== input.render.height)) errors.push(`尺寸不匹配：实际 ${video.width}×${video.height}。`);
if (video && video.r_frame_rate !== expectedFps) errors.push(`帧率不匹配：实际 ${video.r_frame_rate}。`);
if (!Number.isFinite(duration) || Math.abs(duration - input.render.expectedDurationSeconds) > 0.15) errors.push(`时长不匹配：实际 ${duration.toFixed(3)} 秒，预期 ${input.render.expectedDurationSeconds} 秒。`);
if ((input.media?.backgroundMusic || input.media?.voiceover || input.media?.voiceovers?.length) && !audio) errors.push('已配置音频素材，但成片没有音轨。');
if (errors.length > 0) {
  console.error('✗ 成片技术检查失败');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const reviewDirectory = path.resolve(process.cwd(), 'review', path.basename(outputPath, path.extname(outputPath)));
fs.mkdirSync(reviewDirectory, {recursive: true});
const contactSheet = path.join(reviewDirectory, 'contact-sheet.jpg');
const panelCount = input.render.expectedDurationSeconds >= 45 ? 6 : 4;
const framesPerSecond = panelCount / input.render.expectedDurationSeconds;
const sheet = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', outputPath, '-vf', `fps=${framesPerSecond},scale=480:-1,tile=${panelCount}x1`, '-frames:v', '1', contactSheet], {encoding: 'utf8'});
if (sheet.status !== 0 || !fs.existsSync(contactSheet)) {
  console.error(`✗ 成片技术检查通过，但关键画面检查板生成失败：${sheet.stderr || sheet.error?.message || 'ffmpeg 失败'}`);
  process.exit(1);
}
console.log(`✓ 成片检查通过  ${video.width}×${video.height} · ${video.r_frame_rate} · ${duration.toFixed(3)} 秒 · ${audio ? audio.codec_name : '无独立音轨'}`);
console.log(`✓ 关键画面检查板：${contactSheet}`);
