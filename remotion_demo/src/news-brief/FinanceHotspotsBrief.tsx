import {Audio, Sequence, staticFile} from 'remotion';
import {CaptionOverlay} from './CaptionOverlay';
import {BriefClosing} from './BriefClosing';
import {BriefIntro} from './BriefIntro';
import {BriefTopic} from './BriefTopic';
import {NewsBriefSchema, type NewsBriefProps} from './brief-types';

// 每一段预留少量收尾时间，确保旁白不被画面切断；总时长固定为 60 秒。
const sceneFrames = [150, 450, 330, 360, 300, 210] as const;
const sceneStarts = [0, 150, 600, 930, 1290, 1590] as const;

export {NewsBriefSchema};
export type {NewsBriefProps};

export const FinanceHotspotsBrief: React.FC<NewsBriefProps> = (input) => {
  return <>
    <Audio src={staticFile(input.media.backgroundMusic.file)} volume={input.media.backgroundMusic.volume} loop />
    {input.media.voiceovers.map((segment) => <Sequence key={segment.file} from={segment.fromSeconds * input.render.fps} durationInFrames={segment.durationSeconds * input.render.fps} layout="none"><Audio src={staticFile(segment.file)} volume={1} /></Sequence>)}
    <Sequence from={sceneStarts[0]} durationInFrames={sceneFrames[0]} layout="none"><BriefIntro input={input} /></Sequence>
    {input.topics.map((topic, index) => <Sequence key={topic.id} from={sceneStarts[index + 1]} durationInFrames={sceneFrames[index + 1]} layout="none"><BriefTopic topic={topic} index={index} /></Sequence>)}
    <Sequence from={sceneStarts[5]} durationInFrames={sceneFrames[5]} layout="none"><BriefClosing input={input} /></Sequence>
    <CaptionOverlay captions={input.captions} />
  </>;
};
