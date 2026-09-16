import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PRODUCT_COLORS, SectionMark, TrustBackdrop} from './TrustBackdrop';

export const ActionScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 110}});
  const arrow = interpolate(frame, [26, 86], [0, 48], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <TrustBackdrop>
      <SectionMark index="03" label="从了解开始" />
      <div style={{position: 'absolute', left: 190, top: 242, right: 190, textAlign: 'center', opacity: enter, translate: `0 ${(1 - enter) * 38}px`}}>
        <div style={{fontSize: 76, fontWeight: 900, letterSpacing: -4}}>选择更适合自己的<br/><span style={{color: PRODUCT_COLORS.blue}}>资金安排方式</span></div>
        <div style={{marginTop: 28, fontSize: 28, color: PRODUCT_COLORS.muted}}>先沟通需求，再了解服务；重要信息请以审核后的正式资料为准。</div>
        <div style={{margin: '72px auto 0', width: 460, borderRadius: 999, padding: '24px 34px', background: PRODUCT_COLORS.navy, color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 28, fontWeight: 800, boxSizing: 'border-box'}}>
          <span>了解服务详情</span><span style={{fontSize: 40, lineHeight: 0.7, translate: `${arrow}px 0px`}}>→</span>
        </div>
      </div>
    </TrustBackdrop>
  );
};
