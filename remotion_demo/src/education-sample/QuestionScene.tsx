import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EDU_COLORS, EducationBackdrop, EducationMark} from './EducationBackdrop';

export const QuestionScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  const path = interpolate(frame, [18, 88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <EducationBackdrop>
      <EducationMark index="01" label="一图懂金融" />
      <div style={{position: 'absolute', left: 148, top: 236, width: 900, opacity: enter, translate: `0 ${(1 - enter) * 42}px`}}>
        <div style={{fontSize: 29, color: EDU_COLORS.teal, fontWeight: 900, letterSpacing: 4}}>先问一个简单的问题</div>
        <div style={{marginTop: 28, fontSize: 82, lineHeight: 1.18, letterSpacing: -4, fontWeight: 900}}>风险和收益，<br/>为什么总在一起？</div>
        <div style={{marginTop: 32, fontSize: 28, color: EDU_COLORS.muted, lineHeight: 1.65}}>像骑车一样：速度更快，面对的变化也会更多。</div>
      </div>
      <div style={{position: 'absolute', right: 152, top: 255, width: 610, height: 460, borderRadius: 38, overflow: 'hidden', background: '#FFFFFFB8', border: `1px solid ${EDU_COLORS.line}`, boxShadow: '0 25px 62px #24537814'}}>
        <div style={{position: 'absolute', left: 54, top: 54, fontSize: 22, fontWeight: 800, color: EDU_COLORS.muted}}>波动示意</div>
        <svg viewBox="0 0 610 460" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d="M65 332 C130 290, 160 348, 222 238 S322 300, 370 190 S465 278, 540 120" fill="none" stroke={EDU_COLORS.teal} strokeWidth="12" strokeLinecap="round" strokeDasharray="760" strokeDashoffset={760 * (1 - path)} />
          <path d="M65 332 C130 290, 160 348, 222 238 S322 300, 370 190 S465 278, 540 120" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="760" strokeDashoffset={760 * (1 - path)} opacity="0.85" />
          <line x1="65" x2="540" y1="363" y2="363" stroke={EDU_COLORS.line} strokeWidth="3" />
          <circle cx={65 + 475 * path} cy={332 - 212 * path} r="14" fill={EDU_COLORS.gold} opacity={path} />
        </svg>
      </div>
    </EducationBackdrop>
  );
};
