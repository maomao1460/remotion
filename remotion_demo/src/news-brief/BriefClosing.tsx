import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {NewsBriefProps} from './brief-types';
import {PulseBackdrop} from './PulseBackdrop';

export const BriefClosing = ({input}: {input: NewsBriefProps}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  return <PulseBackdrop>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: enter, scale: 0.92 + enter * 0.08}}>
      <div style={{color: '#C9FF4A', fontSize: 26, letterSpacing: 4, fontWeight: 900}}>后续观察</div>
      <div style={{marginTop: 25, fontSize: 78, fontWeight: 900, letterSpacing: -4}}>新动能 · 资金传导 · 外部利率</div>
      <div style={{marginTop: 32, maxWidth: 1120, color: '#AAB8CF', textAlign: 'center', fontSize: 28, lineHeight: 1.55}}>{input.disclaimer}</div>
      <div style={{marginTop: 35, color: '#8290A9', fontSize: 20}}>信息日期：2026 年 9 月 15 日</div>
    </div>
  </PulseBackdrop>;
};
