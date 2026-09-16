import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACTIVITY_COLORS, ActivityBackdrop, ActivityMark} from './ActivityBackdrop';

export const LaunchScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 125}});
  const calendar = spring({frame: frame - 11, fps, config: {damping: 15, stiffness: 125}});
  const underline = interpolate(frame, [15, 64], [0, 330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <ActivityBackdrop>
      <ActivityMark index="01" label="金融生活日历" />
      <div style={{position: 'absolute', left: 148, top: 225, width: 840, opacity: enter, translate: `0 ${(1 - enter) * 38}px`}}>
        <div style={{fontSize: 30, color: ACTIVITY_COLORS.coral, fontWeight: 900, letterSpacing: 4}}>周末金融生活季 · 演示样片</div>
        <div style={{marginTop: 26, fontSize: 80, fontWeight: 900, letterSpacing: -4, lineHeight: 1.17}}>这个周末，<br/>来一场轻松见面</div>
        <div style={{marginTop: 26, width: underline, height: 9, borderRadius: 99, background: ACTIVITY_COLORS.yellow}} />
        <div style={{marginTop: 28, fontSize: 28, color: ACTIVITY_COLORS.muted}}>把服务说明、互动体验与金融知识放进同一天。</div>
      </div>
      <div style={{position: 'absolute', right: 188, top: 222, width: 455, height: 510, opacity: calendar, scale: 0.78 + calendar * 0.22, rotate: `${(1 - calendar) * 8}deg`, translate: `${(1 - calendar) * 50}px 0px`, background: '#FFFFFF', borderRadius: 40, overflow: 'hidden', boxShadow: '0 28px 60px #B86A421F'}}>
        <div style={{height: 130, background: ACTIVITY_COLORS.coral, color: '#FFF', padding: '29px 38px', boxSizing: 'border-box'}}>
          <div style={{fontSize: 18, letterSpacing: 2, opacity: 0.85}}>WEEKEND</div><div style={{marginTop: 6, fontSize: 35, fontWeight: 900}}>周末见</div>
        </div>
        <div style={{padding: '40px 42px', boxSizing: 'border-box'}}>
          <div style={{fontSize: 106, lineHeight: 0.86, fontWeight: 900, color: ACTIVITY_COLORS.navy}}>SAT</div>
          <div style={{marginTop: 36, display: 'flex', gap: 12}}>
            <span style={{padding: '11px 16px', borderRadius: 99, background: '#EAF4FF', color: ACTIVITY_COLORS.blue, fontSize: 18, fontWeight: 800}}>小课堂</span>
            <span style={{padding: '11px 16px', borderRadius: 99, background: '#FFF0D2', color: '#9B6A00', fontSize: 18, fontWeight: 800}}>互动</span>
          </div>
        </div>
      </div>
    </ActivityBackdrop>
  );
};
