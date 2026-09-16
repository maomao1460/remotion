import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, DataBackdrop, SceneLabel} from './shared';

const sectors = [
  {name: '通信', value: 86, color: COLORS.lime, note: '逆势吸金'},
  {name: '算力硬件', value: 68, color: COLORS.cyan, note: '强于大盘'},
  {name: '高股息', value: 42, color: COLORS.violet, note: '防御承接'},
  {name: '消费', value: 24, color: '#53627B', note: '相对走弱'},
];

export const FlowScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <DataBackdrop>
      <SceneLabel index="02 / 资金流向">不是所有板块都在下跌</SceneLabel>
      <div style={{position: 'absolute', left: 78, top: 170, opacity: titleOpacity}}>
        <div style={{fontSize: 66, fontWeight: 900, letterSpacing: -2}}>资金正在重新排队</div>
        <div style={{fontSize: 26, color: COLORS.muted, marginTop: 16}}>高景气方向，成为波动市里的视觉焦点</div>
      </div>
      <div style={{position: 'absolute', left: 78, right: 110, top: 385, display: 'flex', flexDirection: 'column', gap: 22}}>
        {sectors.map((sector, index) => {
          const enter = spring({frame: frame - fps * 0.75 - index * 9, fps, config: {damping: 17, stiffness: 150}});
          const width = sector.value * enter;
          return <div key={sector.name} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: enter, translate: `${(1 - enter) * 120}px 0px`}}>
            <div style={{width: 140, fontSize: 26, fontWeight: 800}}>{sector.name}</div>
            <div style={{height: 58, flex: 1, background: '#17243B', borderRadius: 18, overflow: 'hidden', position: 'relative'}}>
              <div style={{height: '100%', width: `${width}%`, borderRadius: 18, background: `linear-gradient(90deg, ${sector.color}88, ${sector.color})`, boxShadow: `0 0 34px ${sector.color}66`}} />
              <div style={{position: 'absolute', right: 18, top: 14, color: width > 52 ? COLORS.ink : COLORS.muted, fontWeight: 800, fontSize: 20}}>{sector.note}</div>
            </div>
            <div style={{width: 70, textAlign: 'right', color: sector.color, fontSize: 26, fontWeight: 900}}>{Math.round(width)}</div>
          </div>;
        })}
      </div>
      <div style={{position: 'absolute', right: 110, bottom: 76, padding: '17px 24px', border: `1px solid ${COLORS.line}`, borderRadius: 16, color: COLORS.muted, fontSize: 18}}>关键不是涨跌数量，而是资金集中在哪</div>
    </DataBackdrop>
  );
};
