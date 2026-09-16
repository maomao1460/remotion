import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {ImpactScene} from './ImpactScene';
import {FlowScene} from './FlowScene';
import {RiskScene} from './RiskScene';

const transition = {timing: linearTiming({durationInFrames: 12})};

export const FinanceDataStyleSample = () => (
  <AbsoluteFill style={{background: '#0B1322'}}>
    <Audio src={staticFile('bgm.wav')} volume={0.1} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={270} name="市场冲击"><ImpactScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} {...transition} />
      <TransitionSeries.Sequence durationInFrames={270} name="资金流向"><FlowScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={270} name="宏观风险"><RiskScene /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
