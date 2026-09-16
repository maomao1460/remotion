import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';

export const CaptionOverlay = ({captions}: {captions: Caption[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps * 1000;
  const active = captions.find((caption) => now >= caption.startMs && now < caption.endMs);
  if (!active) return null;
  const opacity = interpolate(now, [active.startMs, active.startMs + 180, active.endMs - 180, active.endMs], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: 220, right: 220, bottom: 42, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity}}><div style={{maxWidth: 1320, padding: '12px 28px', borderRadius: 16, background: '#08111CE6', color: '#FFFFFF', fontSize: 28, fontWeight: 800, lineHeight: 1.42, textAlign: 'center', boxShadow: '0 8px 24px #00000055'}}>{active.text}</div></div>;
};
