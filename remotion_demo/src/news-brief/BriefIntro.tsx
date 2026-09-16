import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {NewsBriefProps} from './brief-types';
import {PulseBackdrop} from './PulseBackdrop';

const labels = ['经济数据', '国内流动性', '海外利率', '企业回款'];

export const BriefIntro = ({input}: {input: NewsBriefProps}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  return <PulseBackdrop>
    <div style={{position: 'absolute', left: 148, top: 188, opacity: enter, translate: `0 ${(1 - enter) * 42}px`}}>
      <div style={{fontSize: 30, fontWeight: 900, letterSpacing: 4, color: '#C9FF4A'}}>{input.eyebrow}</div>
      <div style={{marginTop: 26, fontSize: 88, lineHeight: 1.12, letterSpacing: -5, fontWeight: 900, whiteSpace: 'pre-line'}}>{input.title}</div>
      <div style={{marginTop: 28, maxWidth: 900, color: '#AAB8CF', fontSize: 31, lineHeight: 1.55}}>{input.subtitle}</div>
    </div>
    <div style={{position: 'absolute', right: 155, top: 218, width: 440, height: 440}}>
      {labels.map((label, index) => {
        const angle = index * Math.PI / 2 - Math.PI / 4;
        const distance = interpolate(frame, [0, 90], [30, 170], {extrapolateRight: 'clamp'});
        const node = spring({frame: frame - 12 - index * 7, fps, config: {damping: 16, stiffness: 120}});
        return <div key={label} style={{position: 'absolute', left: 200 + Math.cos(angle) * distance, top: 200 + Math.sin(angle) * distance, width: 112, height: 112, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, textAlign: 'center', boxSizing: 'border-box', background: index % 2 === 0 ? '#C9FF4A' : '#55D6FF', color: '#0B1322', fontWeight: 900, fontSize: 18, opacity: node, scale: 0.7 + node * 0.3}}>{label}</div>;
      })}
      <div style={{position: 'absolute', left: 205, top: 205, width: 102, height: 102, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#142944', border: '1px solid #C9FF4A', color: '#EDF4FF', fontWeight: 900, fontSize: 22}}>09.15</div>
    </div>
    <div style={{position: 'absolute', left: 148, bottom: 118, fontSize: 25, color: '#8290A9'}}>正向信号 · 风险变量 · 中性观察</div>
  </PulseBackdrop>;
};
