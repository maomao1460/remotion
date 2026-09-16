import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {NewsItem0913, IndexBars, YieldsBars, OilTrend, OpticsBars} from './NewsItem0913';

const GOLD = '#F5B841';
const GREEN = '#4ADE80';
const BLUE = '#5AC8FA';
const CORAL = '#F0997B';
const INK = '#0B1120';

const F = (s: number) => Math.round(s * 30);
const FR = {cover: F(6.14), n1: F(28.08), n2: F(28.30), n3: F(26.86), n4: F(26.74), end: F(9.50)};
const T = 12; // 转帧时长

const FontFace = () => (
  <style>{`
    @font-face { font-family: 'NotoSansSC'; src: url('${staticFile('fonts/NotoSansSC-Regular.woff2')}') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'NotoSansSC'; src: url('${staticFile('fonts/NotoSansSC-Bold.woff2')}') format('woff2'); font-weight: 700; }
    @font-face { font-family: 'SmileySans'; src: url('${staticFile('fonts/SmileySans-Oblique.ttf')}'); }
  `}</style>
);

const Cover = () => {
  const frame = useCurrentFrame();
  const tagOp = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tOp = interpolate(frame, [15, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sOp = interpolate(frame, [40, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <FontFace />
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
      <div style={{opacity: tagOp, fontSize: 30, letterSpacing: 6, color: GOLD, fontWeight: 600}}>财经梳理 · 2026.09.13</div>
      <div style={{opacity: tOp, marginTop: 40, fontSize: 94, lineHeight: 1.25, fontWeight: 800, textAlign: 'center'}}>9月13日 财经梳理</div>
      <div style={{opacity: sOp, marginTop: 50, fontSize: 38, color: '#8A94A8', letterSpacing: 3}}>四个关键信号 · 看懂本周</div>
    </AbsoluteFill>
  );
};

const End = () => {
  const frame = useCurrentFrame();
  const tOp = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rOp = interpolate(frame, [70, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
      <div style={{opacity: tOp, fontSize: 78, lineHeight: 1.3, fontWeight: 700, textAlign: 'center'}}>关注下周通胀数据与政策落地</div>
      <div style={{opacity: rOp, marginTop: 90, fontSize: 26, color: '#5A6478', letterSpacing: 1}}>仅消息面检索，不构成任何投资建议</div>
    </AbsoluteFill>
  );
};

const fadeT = (d: number) => ({presentation: fade(), timing: linearTiming({durationInFrames: d})});
const slideT = (d: number) => ({presentation: slide({direction: 'from-right'}), timing: linearTiming({durationInFrames: d})});

export const FullVideo0913 = () => {
  return (
    <AbsoluteFill style={{background: INK}}>
      <FontFace />
      <Audio src={staticFile('bgm.wav')} volume={0.16} loop />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={FR.cover}><Cover /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...slideT(T)} />

        <TransitionSeries.Sequence durationInFrames={FR.n1}>
          <NewsItem0913 tag="要闻一 · 大盘调整" title={'A股失守3900\n通信算力逆势吸金'} number={3888} unit="点"
            Chart={({p}) => <IndexBars p={p} />} durFrames={FR.n1} voiceFile="0913_news1.mp3"
            opinions={[
              {tag: '中性 · 利率定价', color: GOLD, from: '星图金融研究院', text: '核心矛盾不在内部，而在海外利率定价'},
              {tag: '看好 · 站队', color: BLUE, from: '资金流向', text: '通信、算力硬件逆势吸金，主力站队明显'},
              {tag: '谨慎 · 承接', color: CORAL, from: '盘面观察', text: '流动性不缺，缺增量资金承接意愿'},
            ]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(T)} />

        <TransitionSeries.Sequence durationInFrames={FR.n2}>
          <NewsItem0913 tag="要闻二 · 加息升温" title={'美联储加息预期\n骤升至近九成'} number={90} unit="%"
            Chart={({p}) => <YieldsBars p={p} />} durFrames={FR.n2} voiceFile="0913_news2.mp3"
            opinions={[
              {tag: '转鹰 · 高盛', color: CORAL, from: '高盛/摩根大通', text: '不希望按兵不动引发剧烈波动'},
              {tag: '中性 · 落地', color: BLUE, from: '巴克莱', text: '政策方向明确后，终将带来回报'},
              {tag: '谨慎 · 估值', color: GOLD, from: '利率传导', text: '美债利率飙升，压制风险资产估值'},
            ]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(T)} />

        <TransitionSeries.Sequence durationInFrames={FR.n3}>
          <NewsItem0913 tag="要闻三 · 油价破百" title={'中东局势升级\n油价年内第三次破百'} number={101} unit="美元"
            Chart={({p}) => <OilTrend p={p} />} durFrames={FR.n3} voiceFile="0913_news3.mp3"
            opinions={[
              {tag: '看多 · 传导', color: CORAL, from: '传导链', text: '地缘→油价→通胀→央行偏鹰清晰'},
              {tag: '看空 · 缓和', color: BLUE, from: '伊朗表态', text: '若美国结束封锁，海峡将重新开放'},
              {tag: '谨慎 · 运费', color: GOLD, from: '航运数据', text: 'VLCC运费飙至正常基准4.5倍'},
            ]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(T)} />

        <TransitionSeries.Sequence durationInFrames={FR.n4}>
          <NewsItem0913 tag="要闻四 · 算力景气" title={'AI算力景气\n光模块预测再上调'} number={1485} unit="亿美元"
            Chart={({p}) => <OpticsBars p={p} />} durFrames={FR.n4} voiceFile="0913_news4.mp3"
            opinions={[
              {tag: '看多 · 上调', color: GOLD, from: '高盛', text: '上调光模块预测，2028达1485亿美元'},
              {tag: '看多 · AGI', color: BLUE, from: '黄仁勋', text: 'AGI已到来，算力需求持续升温'},
              {tag: '中性 · 落地', color: GREEN, from: 'FCC新规', text: '中国光通信未入限制名单，担忧缓解'},
            ]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(T)} />

        <TransitionSeries.Sequence durationInFrames={FR.end}><End /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
