import type {ReactNode} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const COLORS = {
  ink: '#0B1322',
  panel: '#111D31',
  line: '#273750',
  lime: '#C9FF4A',
  cyan: '#55D6FF',
  violet: '#8D6BFF',
  coral: '#FF8A75',
  text: '#EDF4FF',
  muted: '#8290A9',
};

export const DataBackdrop = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const drift = interpolate(frame, [0, fps * 9], [-60, 80], {extrapolateRight: 'clamp'});
  const pulse = 0.22 + Math.sin(frame / fps * 1.3) * 0.08;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: COLORS.ink, color: COLORS.text, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.55, backgroundImage: `linear-gradient(${COLORS.line}66 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line}66 1px, transparent 1px)`, backgroundSize: '72px 72px'}} />
      <div style={{position: 'absolute', width: 720, height: 720, borderRadius: 999, left: width * 0.58, top: -220, background: `radial-gradient(circle, ${COLORS.cyan}${Math.round(pulse * 255).toString(16).padStart(2, '0')} 0%, transparent 66%)`, filter: 'blur(10px)', translate: `${drift}px 0px`}} />
      <div style={{position: 'absolute', width: 600, height: 600, borderRadius: 999, left: -200, bottom: -310, background: `radial-gradient(circle, ${COLORS.violet}44 0%, transparent 67%)`, filter: 'blur(15px)', translate: `${-drift * 0.4}px 0px`}} />
      {children}
    </div>
  );
};

export const SceneLabel = ({index, children}: {index: string; children: ReactNode}) => (
  <div style={{position: 'absolute', left: 78, top: 60, display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, color: COLORS.muted, letterSpacing: 1}}>
    <span style={{color: COLORS.lime, fontWeight: 800}}>{index}</span><span>{children}</span>
  </div>
);

export const MetricCard = ({label, value, suffix, color = COLORS.lime, delay = 0}: {label: string; value: string; suffix: string; color?: string; delay?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 130}});
  return (
    <div style={{background: color, color: COLORS.ink, borderRadius: 26, padding: '24px 32px', minWidth: 330, boxShadow: `0 20px 70px ${color}44`, opacity: entrance, scale: 0.82 + entrance * 0.18, translate: `${(1 - entrance) * 70}px 0px`}}>
      <div style={{fontSize: 18, fontWeight: 700, opacity: 0.72, marginBottom: 10}}>{label}</div>
      <div style={{fontSize: 64, fontWeight: 900, letterSpacing: -3, lineHeight: 1}}>{value}<span style={{fontSize: 26, marginLeft: 7, letterSpacing: 0}}>{suffix}</span></div>
    </div>
  );
};
