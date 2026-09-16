import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const ACTIVITY_COLORS = {
  navy: '#133B69',
  blue: '#287AC2',
  coral: '#F06C5C',
  yellow: '#FFC94D',
  peach: '#FFF4DE',
  paper: '#FFF9F1',
  ink: '#17324D',
  muted: '#6B7B8C',
  line: '#F0DFC5',
};

export const ActivityBackdrop = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const float = interpolate(frame, [0, fps * 3], [0, 44], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: ACTIVITY_COLORS.paper, color: ACTIVITY_COLORS.ink, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
      <div style={{position: 'absolute', width: 550, height: 550, borderRadius: 999, right: -130, top: -230, background: '#D9EFFF', translate: `${float}px 0px`}} />
      <div style={{position: 'absolute', width: 420, height: 420, borderRadius: 999, left: -190, bottom: -225, background: '#FFE0AA', translate: `${-float * 0.45}px 0px`}} />
      <div style={{position: 'absolute', left: width * 0.73, top: height * 0.73, width: 62, height: 62, borderRadius: 18, background: ACTIVITY_COLORS.coral, rotate: `${float * 0.6}deg`}} />
      <div style={{position: 'absolute', left: width * 0.08, top: height * 0.17, width: 29, height: 29, borderRadius: 999, background: ACTIVITY_COLORS.yellow, translate: `0 ${float * 0.28}px`}} />
      {children}
      <div style={{position: 'absolute', right: 72, bottom: 46, fontSize: 17, letterSpacing: 0.5, color: ACTIVITY_COLORS.muted}}>演示活动 · 日期、对象与方式以正式公告为准</div>
    </div>
  );
};

export const ActivityMark = ({index, label}: {index: string; label: string}) => (
  <div style={{position: 'absolute', left: 78, top: 58, display: 'flex', gap: 14, alignItems: 'center', color: ACTIVITY_COLORS.muted, fontSize: 21, letterSpacing: 1}}>
    <span style={{fontWeight: 900, color: ACTIVITY_COLORS.coral}}>{index}</span><span>{label}</span>
  </div>
);
