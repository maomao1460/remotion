import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const EDU_COLORS = {
  ink: '#17324D',
  blue: '#2B74B6',
  teal: '#38A79A',
  mint: '#DDF4EC',
  paper: '#F8FBFE',
  gold: '#E2AE45',
  coral: '#E77D6B',
  muted: '#6C8296',
  line: '#D8E8F1',
};

export const EducationBackdrop = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = interpolate(frame, [0, fps * 4], [0, 36], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: EDU_COLORS.paper, color: EDU_COLORS.ink, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
      <div style={{position: 'absolute', width: 720, height: 720, borderRadius: 999, right: -280, top: -350, background: 'radial-gradient(circle, #C7EAF566 0%, transparent 70%)', filter: 'blur(10px)', translate: `${drift}px 0px`}} />
      <div style={{position: 'absolute', width: 530, height: 530, borderRadius: 999, left: -260, bottom: -330, background: 'radial-gradient(circle, #FAE9B066 0%, transparent 72%)', filter: 'blur(10px)', translate: `${-drift * 0.4}px 0px`}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.44, backgroundImage: `radial-gradient(${EDU_COLORS.line} 1px, transparent 1px)`, backgroundSize: '34px 34px'}} />
      {children}
      <div style={{position: 'absolute', right: 72, bottom: 46, fontSize: 17, letterSpacing: 0.5, color: EDU_COLORS.muted}}>演示内容 · 不构成投资建议</div>
    </div>
  );
};

export const EducationMark = ({index, label}: {index: string; label: string}) => (
  <div style={{position: 'absolute', left: 78, top: 58, display: 'flex', alignItems: 'center', gap: 14, color: EDU_COLORS.muted, fontSize: 21, letterSpacing: 1}}>
    <span style={{fontWeight: 900, color: EDU_COLORS.teal}}>{index}</span><span>{label}</span>
  </div>
);
