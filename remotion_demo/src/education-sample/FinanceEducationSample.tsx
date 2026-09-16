import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {QuestionScene} from './QuestionScene';
import {SpectrumScene} from './SpectrumScene';
import {StepsScene} from './StepsScene';

const transition = {timing: linearTiming({durationInFrames: 12})};

export const FinanceEducationSample = () => (
  <AbsoluteFill style={{background: '#F8FBFE'}}>
    <Audio src={staticFile('bgm.wav')} volume={0.045} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={128} name="提出问题"><QuestionScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={128} name="理解范围"><SpectrumScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={128} name="判断步骤"><StepsScene /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
