import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const projectDirectory = process.cwd();
export const publicDirectory = path.join(projectDirectory, 'public');
export const manifestPath = path.join(projectDirectory, 'manifests', 'audio-assets.json');

const roleFor = (name) => {
  if (name === 'bgm.wav') return '背景音乐：四种风格样片与历史作品';
  if (name.startsWith('0913_')) return '历史基线：FullVideo0913';
  if (name.startsWith('0910_')) return '历史基线：FullVideo0910';
  return '早期竖版或单段演示作品';
};

export const listAudioAssets = () => {
  if (!fs.existsSync(publicDirectory)) throw new Error('找不到 public 目录，无法检查音频素材。');
  return fs.readdirSync(publicDirectory, {withFileTypes: true})
    .filter((entry) => entry.isFile() && ['.mp3', '.wav'].includes(path.extname(entry.name).toLowerCase()))
    .map((entry) => {
      const absolutePath = path.join(publicDirectory, entry.name);
      return {
        path: `public/${entry.name}`,
        bytes: fs.statSync(absolutePath).size,
        sha256: createHash('sha256').update(fs.readFileSync(absolutePath)).digest('hex'),
        role: roleFor(entry.name),
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path, 'en'));
};

export const readManifest = () => {
  if (!fs.existsSync(manifestPath)) throw new Error('找不到 manifests/audio-assets.json，请先执行 npm run manifest:audio-assets。');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
};

export const compareManifest = (manifest, actualAssets) => {
  const expectedByPath = new Map(manifest.assets.map((asset) => [asset.path, asset]));
  const actualByPath = new Map(actualAssets.map((asset) => [asset.path, asset]));
  const errors = [];
  for (const [assetPath, expected] of expectedByPath) {
    const actual = actualByPath.get(assetPath);
    if (!actual) {
      errors.push(`缺少音频：${assetPath}`);
      continue;
    }
    if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) errors.push(`音频内容已变化：${assetPath}`);
  }
  for (const assetPath of actualByPath.keys()) {
    if (!expectedByPath.has(assetPath)) errors.push(`发现未登记音频：${assetPath}；确认可用后请更新清单。`);
  }
  return errors;
};
