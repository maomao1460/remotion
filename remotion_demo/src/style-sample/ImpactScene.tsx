import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SweepHeadline} from '../vendor/curvable/SweepHeadline';
import {COLORS, DataBackdrop, MetricCard, SceneLabel} from './shared';

export const ImpactScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kickerOpacity = interpolate(frame, [fps * 0.4, fps * 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bandWidth = interpolate(frame, [fps * 1.8, fps * 3.2], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <DataBackdrop>
      <SceneLabel index="01 / 市场冲击">本周最重要的一个数字</SceneLabel>
      <div style={{position: 'absolute', left: 78, top: 235, maxWidth: 1120}}>
        <div style={{fontSize: 25, letterSpacing: 5, color: COLORS.lime, fontWeight: 800, opacity: kickerOpacity}}>A 股周度信号</div>
        <div style={{marginTop: 30}}><SweepHeadline text="3900 点失守" accent={COLORS.lime} fontSize={128} /></div>
        <div style={{marginTop: 24, fontSize: 33, color: COLORS.muted, fontWeight: 600}}>不是全面恐慌，而是资金正在重新选择方向。</div>
        <div style={{height: 9, width: `${bandWidth}%`, maxWidth: 760, background: `linear-gradient(90deg, ${COLORS.lime}, ${COLORS.cyan})`, marginTop: 48, borderRadius: 999}} />
      </div>
      <div style={{position: 'absolute', right: 105, bottom: 125, display: 'flex', gap: 24}}>
        <MetricCard label="上证指数周跌幅" value="-1.07" suffix="%" color={COLORS.coral} delay={fps * 1.4} />
        <MetricCard label="创业板逆势表现" value="+1.08" suffix="%" color={COLORS.lime} delay={fps * 1.75} />
      </div>
      <div style={{position: 'absolute', left: 78, bottom: 68, color: COLORS.muted, fontSize: 18}}>视觉样片 · 基于历史迁移数据，不构成事实复核或投资建议</div>
    </DataBackdrop>
  );
};
