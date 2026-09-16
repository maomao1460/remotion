import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PRODUCT_COLORS, SectionMark, TrustBackdrop} from './TrustBackdrop';

const services = [
  {number: '01', title: '先了解需求', text: '从资金安排与使用计划出发', color: '#E7F3FA'},
  {number: '02', title: '再清晰选择', text: '用易懂的信息比较服务方案', color: '#E7F4EF'},
  {number: '03', title: '持续可查看', text: '重要信息与进度随时掌握', color: '#FCF3DF'},
];

export const ServiceScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <TrustBackdrop>
      <SectionMark index="02" label="清晰 · 有序 · 易理解" />
      <div style={{position: 'absolute', left: 150, top: 186, fontSize: 68, fontWeight: 900, letterSpacing: -3}}>一项服务，先把你关心的事说清楚</div>
      <div style={{position: 'absolute', left: 150, top: 304, fontSize: 27, color: PRODUCT_COLORS.muted}}>不堆砌复杂术语，用清晰步骤帮助你理解选择。</div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 458, display: 'flex', gap: 28}}>
        {services.map((service, index) => {
          const enter = spring({frame: frame - 6 - index * 13, fps, config: {damping: 18, stiffness: 115}});
          return (
            <div key={service.number} style={{flex: 1, minHeight: 278, borderRadius: 30, padding: '34px 36px', boxSizing: 'border-box', background: service.color, border: `1px solid ${PRODUCT_COLORS.line}`, opacity: enter, scale: 0.9 + enter * 0.1, translate: `0 ${(1 - enter) * 34}px`, boxShadow: '0 18px 45px #1B41610F'}}>
              <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 2, color: PRODUCT_COLORS.blue}}>{service.number}</div>
              <div style={{marginTop: 52, fontSize: 38, fontWeight: 900}}>{service.title}</div>
              <div style={{marginTop: 20, fontSize: 23, lineHeight: 1.55, color: PRODUCT_COLORS.muted}}>{service.text}</div>
            </div>
          );
        })}
      </div>
    </TrustBackdrop>
  );
};
