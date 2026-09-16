import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EDU_COLORS, EducationBackdrop, EducationMark} from './EducationBackdrop';

export const SpectrumScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  const pointer = interpolate(frame, [16, 90], [0.18, 0.69], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <EducationBackdrop>
      <EducationMark index="02" label="不是二选一，而是理解范围" />
      <div style={{position: 'absolute', left: 150, top: 194, fontSize: 68, fontWeight: 900, letterSpacing: -3}}>风险与收益，像一条连续的坐标轴</div>
      <div style={{position: 'absolute', left: 150, top: 305, fontSize: 27, color: EDU_COLORS.muted}}>不必追求“最高”或“最稳”，关键是知道自己处在什么位置。</div>
      <div style={{position: 'absolute', left: 190, right: 190, top: 486, opacity: enter, scale: 0.92 + enter * 0.08}}>
        <div style={{position: 'relative', height: 78, borderRadius: 999, background: `linear-gradient(90deg, ${EDU_COLORS.teal}, ${EDU_COLORS.gold}, ${EDU_COLORS.coral})`, boxShadow: '0 18px 40px #2B74B622'}}>
          <div style={{position: 'absolute', left: `calc(${pointer * 100}% - 36px)`, top: -48, width: 72, height: 72, borderRadius: 999, background: '#FFF', border: `8px solid ${EDU_COLORS.ink}`, boxSizing: 'border-box', boxShadow: '0 10px 22px #17324D33'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 28, fontSize: 27, fontWeight: 800}}>
          <span style={{color: EDU_COLORS.teal}}>相对稳健</span><span style={{color: EDU_COLORS.gold}}>需要理解波动</span><span style={{color: EDU_COLORS.coral}}>目标更高，波动可能更大</span>
        </div>
        <div style={{marginTop: 96, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 900}}>
          <span style={{width: 15, height: 15, borderRadius: 999, background: EDU_COLORS.teal}} />
          先理解自己能承受什么，再做选择
        </div>
      </div>
    </EducationBackdrop>
  );
};
