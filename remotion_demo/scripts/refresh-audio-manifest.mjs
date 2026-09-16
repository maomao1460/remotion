import fs from 'node:fs';
import path from 'node:path';
import {listAudioAssets, manifestPath} from './audio-assets.mjs';

const assets = listAudioAssets();
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  purpose: '本机配音和背景音乐的名称、大小与内容指纹。音频本体不进入 Git，迁移或恢复前须用此清单核对。',
  assets,
};
fs.mkdirSync(path.dirname(manifestPath), {recursive: true});
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`✓ 已登记 ${assets.length} 个音频素材：${manifestPath}`);
