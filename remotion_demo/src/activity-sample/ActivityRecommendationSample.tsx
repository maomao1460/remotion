import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {LaunchScene} from './LaunchScene';
import {HighlightsScene} from './HighlightsScene';
import {ActionScene} from './ActionScene';

const transition = {timing: linearTiming({durationInFrames: 12})};

export const ActivityRecommendationSample = () => (
  <AbsoluteFill style={{background: '#FFF9F1'}}>
    <Audio src={staticFile('bgm.wav')} volume={0.07} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={88} name="活动开场"><LaunchScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={88} name="活动亮点"><HighlightsScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={88} name="参与提示"><ActionScene /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
