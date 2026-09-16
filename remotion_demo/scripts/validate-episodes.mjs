import {access, readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {EpisodeSchema} from './episode-schema.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const episodesDirectory = path.resolve(scriptDirectory, '..', 'episodes');
const publicDirectory = path.resolve(scriptDirectory, '..', 'public');
const arguments_ = process.argv.slice(2);
const checkAssets = arguments_.includes('--assets');
const requestedIds = new Set(arguments_.filter((argument) => argument !== '--assets'));
const files = (await readdir(episodesDirectory))
  .filter((file) => file.endsWith('.json'))
  .filter((file) => requestedIds.size === 0 || requestedIds.has(path.basename(file, '.json')));

if (files.length === 0) {
  console.error(requestedIds.size ? `没有找到指定内容包：${[...requestedIds].join(', ')}` : 'episodes 目录中没有 JSON 内容包。');
  process.exitCode = 1;
} else {
  let failed = false;
  for (const file of files.sort()) {
    try {
      const raw = await readFile(path.join(episodesDirectory, file), 'utf8');
      const episode = EpisodeSchema.parse(JSON.parse(raw));
      if (checkAssets) {
        const assetFiles = [
          episode.template.backgroundMusic,
          episode.cover.voice.file,
          ...episode.sections.map((section) => section.voice.file),
          episode.ending.voice.file,
        ];
        for (const assetFile of assetFiles) {
          try {
            await access(path.join(publicDirectory, assetFile));
          } catch {
            throw new Error(`缺少 public 资源：${assetFile}`);
          }
        }
      }
      console.log(`PASS  ${file}  ${episode.sections.length} 条新闻，${episode.format.expectedDurationSeconds} 秒`);
    } catch (error) {
      failed = true;
      const issues = error.issues?.map((issue) => `${issue.path.join('.') || '根对象'}：${issue.message}`).join('\n  ');
      console.error(`FAIL  ${file}\n  ${issues ?? error.message}`);
    }
  }
  if (failed) process.exitCode = 1;
}
