import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {NewsSection, ChartBars, ChartCompare, ChartTrend, ChartCards, GOLD} from './NewsSection';

const INK = '#0B1120';

// 配音时长 → 帧数（@30fps）
const F = (s: number) => Math.round(s * 30);
const FR = {cover: F(6.65), n1: F(39.31), n2: F(33.5), n3: F(30.79), n4: F(30.96), end: F(8.74)};
const OFF = {
  cover: 0,
  n1: FR.cover,
  n2: FR.cover + FR.n1,
  n3: FR.cover + FR.n1 + FR.n2,
  n4: FR.cover + FR.n1 + FR.n2 + FR.n3,
  end: FR.cover + FR.n1 + FR.n2 + FR.n3 + FR.n4,
};
const TOTAL = OFF.end + FR.end;

// ============ 封面 ============
const Cover = () => {
  const frame = useCurrentFrame();
  const tagOp = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tOp = interpolate(frame, [15, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sOp = interpolate(frame, [40, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: '"Microsoft YaHei",sans-serif', color: '#FFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />
      <div style={{opacity: tagOp, fontSize: 30, letterSpacing: 6, color: GOLD, fontWeight: 600}}>财经要闻 · 2026.09.06</div>
      <div style={{opacity: tOp, marginTop: 50, fontSize: 110, lineHeight: 1.25, fontWeight: 800, textAlign: 'center'}}>
        9月6日<br/>财经要闻
      </div>
      <div style={{opacity: sOp, marginTop: 60, fontSize: 40, color: '#8A94A8', letterSpacing: 3}}>
        四个关键信号 · 看懂这个周末
      </div>
    </AbsoluteFill>
  );
};

// ============ 结尾 ============
const End = () => {
  const frame = useCurrentFrame();
  const tOp = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rOp = interpolate(frame, [60, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: '"Microsoft YaHei",sans-serif', color: '#FFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 100px'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />
      <div style={{opacity: tOp, fontSize: 76, lineHeight: 1.3, fontWeight: 700, textAlign: 'center'}}>
        关注下周一<br/>A 股开盘
      </div>
      <div style={{opacity: rOp, marginTop: 120, fontSize: 28, color: '#5A6478', letterSpacing: 1}}>
        仅消息面检索，不构成任何投资建议
      </div>
    </AbsoluteFill>
  );
};

// ============ 主组件 ============
export const FullVideo = () => {
  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('bgm.wav')} volume={0.16} loop />
      <Sequence from={OFF.cover} durationInFrames={FR.cover}><Cover /></Sequence>

      <Sequence from={OFF.n1} durationInFrames={FR.n1}>
        <NewsSection tag="要闻一 · 政策底" title={'财政部出手\n注资 3000 亿'} number={3000} unit="亿元"
          Chart={ChartBars} durFrames={FR.n1} voiceFile="news1.mp3"
          opinions={[
            {tag: '乐观 · 提振', color: GOLD, from: '招联 董希淼', text: '三千亿资本撬动约四万亿资产增量，稳估值'},
            {tag: '中性 · 蓄能', color: '#5AC8FA', from: '国信证券 王剑', text: '大行资本本就充足，是着眼长远的蓄能安排'},
            {tag: '谨慎 · 摊薄', color: '#F0997B', from: '招联 董希淼', text: '定增短期摊薄每股收益，还需留意'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n2} durationInFrames={FR.n2}>
        <NewsSection tag="要闻二 · 加息升温" title={'美国非农爆表\n加息概率升至六成'} number={16.2} unit="万人"
          Chart={ChartCompare} durFrames={FR.n2} voiceFile="news2.mp3"
          opinions={[
            {tag: '鹰派 · 看加息', color: '#F0997B', from: '零对冲', text: '非农后加息概率一度飙至 67%'},
            {tag: '中性 · 看通胀', color: '#5AC8FA', from: '贝莱德 Rosenberg', text: '真正决定方向的仍是下周 CPI'},
            {tag: '谨慎 · 待定案', color: GOLD, from: 'BMO Hartman', text: '不足以单独定案，仍需 CPI 佐证'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n3} durationInFrames={FR.n3}>
        <NewsSection tag="要闻三 · 地缘风险" title={'美伊冲突\n油价逼近 96 美元'} number={96} unit="美元"
          Chart={ChartTrend} durFrames={FR.n3} voiceFile="news3.mp3"
          opinions={[
            {tag: '看多 · 升级', color: '#F0997B', from: '高盛 Struyven', text: '若中东航运袭击升级，油价或至 120 美元'},
            {tag: '中性 · 震荡', color: '#5AC8FA', from: '威灵顿 Backman', text: '短期 90-100 区间，剔除溢价公允价约 70'},
            {tag: '基本面 · 过剩', color: GOLD, from: '巴克莱', text: '中长期供需过剩，2030 均衡价约 85 美元'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n4} durationInFrames={FR.n4}>
        <NewsSection tag="要闻四 · 政策红利" title={'七部门发文\n算力迎绿色红利'} number={1960} unit="亿千瓦时"
          Chart={ChartCards} durFrames={FR.n4} voiceFile="news4.mp3"
          opinions={[
            {tag: '看多 · 利好', color: GOLD, from: '开源证券', text: '800V 架构带来机柜电源、备电等增量需求'},
            {tag: '中性 · 战略', color: '#5AC8FA', from: '国研新经济 朱克力', text: 'AI 竞争本质是电力的较量'},
            {tag: '谨慎 · 能耗', color: '#F0997B', from: '信通院测算', text: '算力用电增速 3.6 倍于全社会用电'},
          ]} />
      </Sequence>

      <Sequence from={OFF.end} durationInFrames={FR.end}><End /></Sequence>
    </AbsoluteFill>
  );
};