import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PRODUCT_COLORS, SectionMark, TrustBackdrop} from './TrustBackdrop';

export const OpeningScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 115}});
  const cardEnter = spring({frame: frame - 12, fps, config: {damping: 16, stiffness: 110}});
  const lineWidth = interpolate(frame, [12, 58], [0, 328], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <TrustBackdrop>
      <SectionMark index="01" label="信赖产品橱窗" />
      <div style={{position: 'absolute', left: 148, top: 265, width: 820, opacity: enter, translate: `0 ${(1 - enter) * 40}px`}}>
        <div style={{fontSize: 30, fontWeight: 800, color: PRODUCT_COLORS.blue, letterSpacing: 4}}>资金规划服务 · 演示样片</div>
        <div style={{marginTop: 28, fontSize: 86, fontWeight: 900, lineHeight: 1.15, letterSpacing: -4}}>把资金安排得<br/><span style={{color: PRODUCT_COLORS.navy}}>更从容一些</span></div>
        <div style={{marginTop: 28, width: lineWidth, height: 8, borderRadius: 99, background: PRODUCT_COLORS.gold}} />
        <div style={{marginTop: 30, fontSize: 28, lineHeight: 1.7, color: PRODUCT_COLORS.muted}}>从实际需求出发，找到适合自己的服务方式。</div>
      </div>
      <div style={{position: 'absolute', right: 176, top: 226, width: 555, height: 535, opacity: cardEnter, scale: 0.84 + cardEnter * 0.16, translate: `${(1 - cardEnter) * 64}px 0px`}}>
        <div style={{position: 'absolute', left: 38, top: 78, width: 430, height: 330, borderRadius: 34, background: '#D9E7F3', rotate: '-8deg'}} />
        <div style={{position: 'absolute', left: 82, top: 42, width: 430, height: 330, borderRadius: 34, background: '#BFE2E7', rotate: '5deg'}} />
        <div style={{position: 'absolute', left: 62, top: 34, width: 430, height: 330, borderRadius: 34, padding: 44, boxSizing: 'border-box', color: '#FFF', background: `linear-gradient(135deg, ${PRODUCT_COLORS.navy}, ${PRODUCT_COLORS.blue})`, boxShadow: '0 28px 70px #1F477533'}}>
          <div style={{fontSize: 22, opacity: 0.8, letterSpacing: 2}}>YOUR FINANCIAL PLAN</div>
          <div style={{marginTop: 82, fontSize: 42, fontWeight: 900, letterSpacing: 1}}>从容规划</div>
          <div style={{marginTop: 14, fontSize: 23, opacity: 0.8}}>从了解开始</div>
          <div style={{position: 'absolute', right: 44, bottom: 38, width: 72, height: 72, border: '2px solid #FFFFFF66', borderRadius: 999}} />
        </div>
        <div style={{position: 'absolute', right: 18, bottom: 4, width: 190, height: 190, borderRadius: 999, background: PRODUCT_COLORS.gold, opacity: 0.9}} />
      </div>
    </TrustBackdrop>
  );
};
