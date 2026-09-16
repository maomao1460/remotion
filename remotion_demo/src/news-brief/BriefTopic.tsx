import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {NewsBriefTopic} from './brief-types';
import {PulseBackdrop} from './PulseBackdrop';

const perspectiveStyle = [
  {title: '偏积极', color: '#C9FF4A'},
  {title: '偏谨慎', color: '#FF8F7D'},
  {title: '中性观察', color: '#55D6FF'},
];

export const BriefTopic = ({topic, index}: {topic: NewsBriefTopic; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleEnter = spring({frame, fps, config: {damping: 18, stiffness: 115}});
  const chartEnter = spring({frame: frame - 10, fps, config: {damping: 17, stiffness: 110}});
  const maximum = Math.max(...topic.chart.map((item) => item.value));
  const perspectives = [topic.positive, topic.caution, topic.neutral];
  return <PulseBackdrop>
    <div style={{position: 'absolute', left: 148, top: 142, width: 920, opacity: titleEnter, translate: `0 ${(1 - titleEnter) * 36}px`}}>
      <div style={{color: '#C9FF4A', fontWeight: 900, letterSpacing: 3, fontSize: 26}}>0{index + 1} · {topic.eyebrow}</div>
      <div style={{marginTop: 18, fontSize: 74, fontWeight: 900, letterSpacing: -4, lineHeight: 1.12}}>{topic.title}</div>
      <div style={{marginTop: 20, color: '#AAB8CF', fontSize: 28, lineHeight: 1.5}}>{topic.summary}</div>
    </div>
    <div style={{position: 'absolute', right: 142, top: 156, width: 500, height: 385, boxSizing: 'border-box', padding: 38, borderRadius: 34, background: '#111D31', border: '1px solid #55D6FF44', boxShadow: '0 30px 70px #00000033', opacity: chartEnter, scale: 0.9 + chartEnter * 0.1}}>
      <div style={{fontSize: 20, color: '#8290A9'}}>{topic.metric.label}</div>
      <div style={{marginTop: 15, color: '#C9FF4A', fontSize: 88, lineHeight: 0.9, letterSpacing: -6, fontWeight: 900}}>{topic.metric.value}<span style={{marginLeft: 10, letterSpacing: 0, fontSize: 28}}>{topic.metric.unit}</span></div>
      <div style={{display: 'flex', gap: 22, alignItems: 'end', height: 128, marginTop: 38}}>{topic.chart.map((bar, barIndex) => {
        const rise = interpolate(frame, [14 + barIndex * 6, 58 + barIndex * 6], [0, bar.value / maximum * 96], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={bar.label} style={{flex: 1, textAlign: 'center'}}><div style={{height: rise, minHeight: rise > 0 ? 3 : 0, borderRadius: '9px 9px 2px 2px', background: barIndex === 1 ? '#55D6FF' : '#C9FF4A'}} /><div style={{marginTop: 11, color: '#AAB8CF', fontSize: 15}}>{bar.label}</div><div style={{marginTop: 3, color: '#EDF4FF', fontSize: 17, fontWeight: 900}}>{bar.display}</div></div>;
      })}</div>
    </div>
    <div style={{position: 'absolute', left: 148, right: 148, bottom: 126, display: 'flex', gap: 20}}>{perspectives.map((perspective, perspectiveIndex) => {
      const enter = spring({frame: frame - 18 - perspectiveIndex * 7, fps, config: {damping: 18, stiffness: 118}});
      return <div key={perspectiveStyle[perspectiveIndex].title} style={{flex: 1, minHeight: 182, padding: '20px 27px', borderRadius: 24, background: '#152944', opacity: enter, scale: 0.9 + enter * 0.1, translate: `0 ${(1 - enter) * 28}px`, boxSizing: 'border-box'}}><div style={{fontSize: 22, color: perspectiveStyle[perspectiveIndex].color, fontWeight: 900}}>{perspectiveStyle[perspectiveIndex].title}</div><div style={{marginTop: 11, color: '#C4D0E4', fontSize: 19, lineHeight: 1.38}}>{perspective.text}</div><div style={{marginTop: 10, color: '#7F91AB', fontSize: 13, lineHeight: 1.25}}>来源：{perspective.attribution} · {perspective.sourceType}</div></div>;
    })}</div>
  </PulseBackdrop>;
};
