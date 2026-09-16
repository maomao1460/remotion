import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedLineTrace} from '../vendor/remotion-scenes/AnimatedLineTrace';
import {COLORS, DataBackdrop, MetricCard, SceneLabel} from './shared';

export const RiskScene = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const ring = spring({frame: frame - fps * 0.5, fps, config: {damping: 18, stiffness: 90}});
  const annotation = interpolate(frame, [fps * 2.1, fps * 2.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <DataBackdrop>
      <SceneLabel index="03 / 宏观风险">一条传导链，决定风险偏好</SceneLabel>
      <div style={{position: 'absolute', left: 78, top: 180}}>
        <div style={{fontSize: 72, fontWeight: 900, letterSpacing: -2}}>利率预期骤然升温</div>
        <div style={{fontSize: 27, color: COLORS.muted, marginTop: 18}}>美债收益率的上行，会迅速压缩风险资产估值。</div>
      </div>
      <div style={{position: 'absolute', left: 78, bottom: 112}}>
        <AnimatedLineTrace delay={fps * 0.75} points={[{label: '周一', value: 4.42}, {label: '周二', value: 4.48}, {label: '周三', value: 4.61}, {label: '周四', value: 4.77}, {label: '周五', value: 4.96}]} />
      </div>
      <div style={{position: 'absolute', left: width - 510, top: 300, width: 330, height: 330, borderRadius: 999, border: `2px solid ${COLORS.lime}`, opacity: ring, scale: 0.78 + ring * 0.22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 25px ${COLORS.lime}12, 0 0 0 65px ${COLORS.cyan}0c, 0 0 80px ${COLORS.lime}45`}}>
        <div style={{fontSize: 84, fontWeight: 900, color: COLORS.lime, letterSpacing: -5}}>90%</div>
        <div style={{fontSize: 18, color: COLORS.muted, marginTop: 10}}>加息预期（历史表述）</div>
      </div>
      <div style={{position: 'absolute', right: 96, bottom: 115, opacity: annotation}}><MetricCard label="10 年期美债收益率" value="4.96" suffix="%" color={COLORS.cyan} /></div>
    </DataBackdrop>
  );
};
