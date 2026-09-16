import fs from 'node:fs';
import path from 'node:path';
import {compareManifest, listAudioAssets, manifestPath, projectDirectory, publicDirectory, readManifest} from './audio-assets.mjs';

const args = process.argv.slice(2);
const destinationIndex = args.indexOf('--dest');
const destinationArgument = destinationIndex >= 0 ? args[destinationIndex + 1] : undefined;
if (!destinationArgument || !path.isAbsolute(destinationArgument)) {
  console.error('用法：npm run backup:audio-assets -- --dest E:\\PPT动画流备份\\2026-09-16');
  process.exit(1);
}

const destination = path.resolve(destinationArgument);
const relativeToProject = path.relative(projectDirectory, destination);
if (!relativeToProject.startsWith('..') && !path.isAbsolute(relativeToProject)) {
  console.error('备份位置不能放在项目目录内，否则项目损坏时备份也会一起丢失。');
  process.exit(1);
}
if (fs.existsSync(destination) && fs.readdirSync(destination).length > 0) {
  console.error(`备份位置已存在且不为空：${destination}\n为避免覆盖已有备份，请换一个新的空文件夹。`);
  process.exit(1);
}

try {
  const manifest = readManifest();
  const errors = compareManifest(manifest, listAudioAssets());
  if (errors.length > 0) throw new Error(`当前音频与清单不一致：${errors.join('；')}`);
  fs.mkdirSync(destination, {recursive: true});
  fs.cpSync(publicDirectory, path.join(destination, 'public'), {
    recursive: true,
    filter: (source) => fs.statSync(source).isDirectory() || ['.mp3', '.wav'].includes(path.extname(source).toLowerCase()),
  });
  fs.copyFileSync(manifestPath, path.join(destination, 'audio-assets.json'));
  console.log(`✓ 音频备份已创建：${destination}`);
  console.log('✓ 未自动执行恢复；如发生误删，请先确认是否需要恢复以及是否有人工备份。');
} catch (error) {
  console.error(`✗ 音频备份失败：${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
