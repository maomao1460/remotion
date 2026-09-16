import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const PRODUCT_COLORS = {
  navy: '#12345B',
  blue: '#1F6FB2',
  cyan: '#5CB9C7',
  gold: '#D3A64B',
  paper: '#F4F8FC',
  panel: '#FFFFFF',
  ink: '#15283C',
  muted: '#61758A',
  line: '#D8E4EF',
};

export const TrustBackdrop = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const drift = interpolate(frame, [0, fps * 4], [0, 44], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: PRODUCT_COLORS.paper, color: PRODUCT_COLORS.ink, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.55, backgroundImage: `linear-gradient(${PRODUCT_COLORS.line}80 1px, transparent 1px), linear-gradient(90deg, ${PRODUCT_COLORS.line}80 1px, transparent 1px)`, backgroundSize: '84px 84px'}} />
      <div style={{position: 'absolute', width: 720, height: 720, borderRadius: 999, top: -330, right: width * 0.03, background: 'radial-gradient(circle, #B9E4F055 0%, transparent 68%)', filter: 'blur(8px)', translate: `${drift}px 0px`}} />
      <div style={{position: 'absolute', width: 560, height: 560, borderRadius: 999, left: -260, bottom: -310, background: 'radial-gradient(circle, #F3D89666 0%, transparent 70%)', filter: 'blur(10px)', translate: `${-drift * 0.35}px 0px`}} />
      {children}
      <div style={{position: 'absolute', right: 72, bottom: 46, fontSize: 17, letterSpacing: 0.5, color: PRODUCT_COLORS.muted}}>演示内容 · 不代表具体产品、服务或承诺</div>
    </div>
  );
};

export const SectionMark = ({index, label}: {index: string; label: string}) => (
  <div style={{position: 'absolute', left: 78, top: 58, display: 'flex', gap: 14, alignItems: 'center', color: PRODUCT_COLORS.muted, fontSize: 21, letterSpacing: 1}}>
    <span style={{fontWeight: 900, color: PRODUCT_COLORS.blue}}>{index}</span>
    <span>{label}</span>
  </div>
);
