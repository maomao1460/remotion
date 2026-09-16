import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const PulseBackdrop = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const drift = interpolate(frame, [0, 360], [0, 100], {extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#0B1322', color: '#EDF4FF', fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
    <div style={{position: 'absolute', inset: 0, opacity: 0.38, backgroundImage: 'linear-gradient(#8290A922 1px, transparent 1px), linear-gradient(90deg, #8290A922 1px, transparent 1px)', backgroundSize: '72px 72px'}} />
    <div style={{position: 'absolute', width: 760, height: 760, right: -240, top: -310, borderRadius: 999, background: 'radial-gradient(circle, #55D6FF2E 0%, transparent 68%)', translate: `${drift}px 0px`}} />
    <div style={{position: 'absolute', width: 560, height: 560, left: -260, bottom: -270, borderRadius: 999, background: 'radial-gradient(circle, #C9FF4A2A 0%, transparent 68%)', translate: `${-drift * 0.45}px 0px`}} />
    <div style={{position: 'absolute', top: 58, left: 82, right: 82, height: 1, background: 'linear-gradient(90deg, #C9FF4A, #55D6FF55, transparent)'}} />
    {children}
  </div>;
};
