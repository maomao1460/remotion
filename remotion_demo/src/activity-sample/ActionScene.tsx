import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACTIVITY_COLORS, ActivityBackdrop, ActivityMark} from './ActivityBackdrop';

export const ActionScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 120}});
  const arrow = interpolate(frame, [22, 76], [0, 38], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <ActivityBackdrop>
      <ActivityMark index="03" label="先看说明，再轻松参与" />
      <div style={{position: 'absolute', left: 180, right: 180, top: 218, textAlign: 'center', opacity: enter, translate: `0 ${(1 - enter) * 38}px`}}>
        <div style={{fontSize: 80, fontWeight: 900, lineHeight: 1.17, letterSpacing: -4}}>把周末，<span style={{color: ACTIVITY_COLORS.coral}}>过得更有收获</span></div>
        <div style={{marginTop: 30, fontSize: 28, color: ACTIVITY_COLORS.muted}}>参与前请关注正式活动公告，确认时间、对象与参与方式。</div>
        <div style={{margin: '66px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 454, padding: '23px 34px', boxSizing: 'border-box', borderRadius: 999, background: ACTIVITY_COLORS.coral, color: '#FFF', fontSize: 28, fontWeight: 900, boxShadow: '0 18px 35px #F06C5C44'}}>
          <span>查看活动说明</span><span style={{fontSize: 42, lineHeight: 0.7, translate: `${arrow}px 0px`}}>→</span>
        </div>
      </div>
    </ActivityBackdrop>
  );
};
