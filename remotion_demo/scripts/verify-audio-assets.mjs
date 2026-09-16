import {compareManifest, listAudioAssets, readManifest} from './audio-assets.mjs';

try {
  const manifest = readManifest();
  const errors = compareManifest(manifest, listAudioAssets());
  if (errors.length > 0) {
    console.error('✗ 音频素材核对失败');
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`✓ 音频素材核对通过：${manifest.assets.length} 个文件均与清单一致。`);
} catch (error) {
  console.error(`✗ 音频素材核对失败：${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
