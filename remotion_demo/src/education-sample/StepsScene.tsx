import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EDU_COLORS, EducationBackdrop, EducationMark} from './EducationBackdrop';

const steps = [
  {number: '01', title: '看期限', text: '这笔钱什么时候可能要用？', color: '#E5F6F1'},
  {number: '02', title: '看风险等级', text: '波动发生时，自己能否接受？', color: '#EAF3FB'},
  {number: '03', title: '留足备用金', text: '日常所需不要全部投入。', color: '#FFF3DD'},
];

export const StepsScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <EducationBackdrop>
      <EducationMark index="03" label="记住这三个判断步骤" />
      <div style={{position: 'absolute', left: 150, top: 185, fontSize: 70, fontWeight: 900, letterSpacing: -3}}>先理解，再选择</div>
      <div style={{position: 'absolute', left: 150, top: 294, fontSize: 27, color: EDU_COLORS.muted}}>适合自己的，才是值得认真了解的。</div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 424, display: 'flex', gap: 28}}>
        {steps.map((step, index) => {
          const enter = spring({frame: frame - 4 - index * 14, fps, config: {damping: 18, stiffness: 108}});
          return <div key={step.number} style={{flex: 1, minHeight: 284, borderRadius: 30, padding: '35px 36px', boxSizing: 'border-box', background: step.color, border: `1px solid ${EDU_COLORS.line}`, opacity: enter, translate: `0 ${(1 - enter) * 34}px`, scale: 0.91 + enter * 0.09}}>
            <div style={{fontSize: 22, letterSpacing: 2, fontWeight: 900, color: EDU_COLORS.teal}}>{step.number}</div>
            <div style={{marginTop: 54, fontSize: 40, fontWeight: 900}}>{step.title}</div>
            <div style={{marginTop: 18, fontSize: 24, lineHeight: 1.6, color: EDU_COLORS.muted}}>{step.text}</div>
          </div>;
        })}
      </div>
    </EducationBackdrop>
  );
};
