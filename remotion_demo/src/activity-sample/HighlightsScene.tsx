import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACTIVITY_COLORS, ActivityBackdrop, ActivityMark} from './ActivityBackdrop';

const highlights = [
  {icon: '◎', title: '轻松听懂', text: '用简单方式聊聊金融话题', color: '#E4F2FF'},
  {icon: '✦', title: '现场体验', text: '把服务内容看得更明白', color: '#FFF0D0'},
  {icon: '→', title: '互动打卡', text: '留下属于你的参与记录', color: '#FFE2DB'},
];

export const HighlightsScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <ActivityBackdrop>
      <ActivityMark index="02" label="来这里，可以做什么？" />
      <div style={{position: 'absolute', left: 150, top: 187, fontSize: 68, fontWeight: 900, letterSpacing: -3}}>三件小事，轻松认识金融服务</div>
      <div style={{position: 'absolute', left: 150, top: 296, fontSize: 27, color: ACTIVITY_COLORS.muted}}>先了解，再体验；把每一步安排得清清楚楚。</div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 430, display: 'flex', gap: 28}}>
        {highlights.map((item, index) => {
          const enter = spring({frame: frame - 3 - index * 12, fps, config: {damping: 17, stiffness: 125}});
          return <div key={item.title} style={{flex: 1, minHeight: 278, borderRadius: 31, padding: '32px 36px', boxSizing: 'border-box', background: item.color, opacity: enter, scale: 0.88 + enter * 0.12, translate: `0 ${(1 - enter) * 32}px`, boxShadow: '0 20px 46px #A05D2312'}}>
            <div style={{fontSize: 48, lineHeight: 1, fontWeight: 900, color: ACTIVITY_COLORS.coral}}>{item.icon}</div>
            <div style={{marginTop: 45, fontSize: 39, fontWeight: 900}}>{item.title}</div>
            <div style={{marginTop: 17, fontSize: 23, color: ACTIVITY_COLORS.muted, lineHeight: 1.55}}>{item.text}</div>
          </div>;
        })}
      </div>
    </ActivityBackdrop>
  );
};
