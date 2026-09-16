import {Composition} from 'remotion';
import {Zhuzi} from './Zhuzi';
import {SvgDemo} from './SvgDemo';
import {FullNews} from './FullNews';
import {FullVideo} from './FullVideo';
import {FullVideo0910} from './FullVideo0910';
import {FullVideo0913} from './FullVideo0913';
import {FinanceDataStyleSample} from './style-sample/FinanceDataStyleSample';
import {ProductTrustSample} from './product-sample/ProductTrustSample';
import {FinanceEducationSample} from './education-sample/FinanceEducationSample';
import {ActivityRecommendationSample} from './activity-sample/ActivityRecommendationSample';
import {StyleSwitcherPreview, StyleSwitcherPreviewSchema} from './style-system/StyleSwitcherPreview';
import {styleSwitcherDefaultProps} from './style-system/default-props';
import {FinanceHotspotsBrief, NewsBriefSchema} from './news-brief/FinanceHotspotsBrief';
import {newsBriefDefaultProps} from './news-brief/default-props';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="FinanceHotspotsBrief"
        component={FinanceHotspotsBrief}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        schema={NewsBriefSchema}
        defaultProps={newsBriefDefaultProps}
      />
      <Composition
        id="StyleSwitcherPreview"
        component={StyleSwitcherPreview}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        schema={StyleSwitcherPreviewSchema}
        defaultProps={styleSwitcherDefaultProps}
      />
      <Composition
        id="ActivityRecommendationSample"
        component={ActivityRecommendationSample}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FinanceEducationSample"
        component={FinanceEducationSample}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProductTrustSample"
        component={ProductTrustSample}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FinanceDataStyleSample"
        component={FinanceDataStyleSample}
        durationInFrames={786}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullVideo0913"
        component={FullVideo0913}
        durationInFrames={3708}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullVideo0910"
        component={FullVideo0910}
        durationInFrames={4343}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={4499}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FullNews"
        component={FullNews}
        durationInFrames={1285}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SvgDemo"
        component={SvgDemo}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Zhuzi"
        component={Zhuzi}
        durationInFrames={823}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
