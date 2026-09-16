import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {OpeningScene} from './OpeningScene';
import {ServiceScene} from './ServiceScene';
import {ActionScene} from './ActionScene';

const transition = {timing: linearTiming({durationInFrames: 12})};

export const ProductTrustSample = () => (
  <AbsoluteFill style={{background: '#F4F8FC'}}>
    <Audio src={staticFile('bgm.wav')} volume={0.055} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={108} name="产品开场"><OpeningScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={108} name="服务特点"><ServiceScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} {...transition} />
      <TransitionSeries.Sequence durationInFrames={108} name="行动提示"><ActionScene /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
