import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {NewsSectionLandscape, HorizontalBars, TrendLine, GOLD} from './NewsSectionLandscape';

const INK = '#0B1120';

const F = (s: number) => Math.round(s * 30);
const FR = {cover: F(5.93), n1: F(36.10), n2: F(33.77), n3: F(31.92), n4: F(27.55), end: F(9.46)};
const OFF = {
  cover: 0,
  n1: FR.cover,
  n2: FR.cover + FR.n1,
  n3: FR.cover + FR.n1 + FR.n2,
  n4: FR.cover + FR.n1 + FR.n2 + FR.n3,
  end: FR.cover + FR.n1 + FR.n2 + FR.n3 + FR.n4,
};
const TOTAL = OFF.end + FR.end;

const Cover = () => {
  const frame = useCurrentFrame();
  const tagOp = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tOp = interpolate(frame, [15, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sOp = interpolate(frame, [40, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: '"Microsoft YaHei",sans-serif', color: '#FFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
      <div style={{opacity: tagOp, fontSize: 30, letterSpacing: 6, color: GOLD, fontWeight: 600}}>财经要闻 · 2026.09.10</div>
      <div style={{opacity: tOp, marginTop: 40, fontSize: 96, lineHeight: 1.25, fontWeight: 800, textAlign: 'center'}}>
        9月10日 财经要闻
      </div>
      <div style={{opacity: sOp, marginTop: 50, fontSize: 38, color: '#8A94A8', letterSpacing: 3}}>
        四个关键信号 · 看懂今天
      </div>
    </AbsoluteFill>
  );
};

const End = () => {
  const frame = useCurrentFrame();
  const tOp = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rOp = interpolate(frame, [70, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: '"Microsoft YaHei",sans-serif', color: '#FFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
      <div style={{opacity: tOp, fontSize: 80, lineHeight: 1.3, fontWeight: 700, textAlign: 'center'}}>
        关注经济数据与政策落地
      </div>
      <div style={{opacity: rOp, marginTop: 90, fontSize: 26, color: '#5A6478', letterSpacing: 1}}>
        仅消息面检索，不构成任何投资建议
      </div>
    </AbsoluteFill>
  );
};

export const FullVideo0910 = () => {
  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('bgm.wav')} volume={0.16} loop />
      <Sequence from={OFF.cover} durationInFrames={FR.cover}><Cover /></Sequence>

      <Sequence from={OFF.n1} durationInFrames={FR.n1}>
        <NewsSectionLandscape tag="要闻一 · 银行新高" title={'A股震荡调整\n银行股逆势创新高'} number={3934} unit="点"
          Chart={({p}) => <HorizontalBars p={p} bars={[
            {name: '沪指', val: -0.43}, {name: '深成指', val: -0.77}, {name: '创业板', val: -0.49},
          ]} />}
          durFrames={FR.n1} voiceFile="0910_news1.mp3"
          opinions={[
            {tag: '中性 · 震荡', color: GOLD, from: '渤海证券', text: '市场震荡延续，中期政策部署有助于降低下行风险'},
            {tag: '看好 · 防御', color: '#5AC8FA', from: '市场观察', text: '银行逆势创新高，高股息成存量资金避风港'},
            {tag: '谨慎 · 切换', color: '#F0997B', from: '盘面特征', text: '银行与科技跷跷板，存量博弈格局明显'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n2} durationInFrames={FR.n2}>
        <NewsSectionLandscape tag="要闻二 · 存储涨价" title={'存储芯片景气上行\n议价权转向卖方'} number={22} unit="%"
          Chart={({p}) => <HorizontalBars p={p} bars={[
            {name: 'DDR 环比', val: 22}, {name: 'NAND 合约', val: 20},
          ]} />}
          durFrames={FR.n2} voiceFile="0910_news2.mp3"
          opinions={[
            {tag: '看多 · 评级', color: GOLD, from: '摩根大通 / 美银', text: '上调存储龙头评级与目标价'},
            {tag: '看多 · 供需', color: '#5AC8FA', from: '瑞银', text: '供应短缺持续至2027，库存不足10天'},
            {tag: '谨慎 · 反噬', color: '#F0997B', from: '铠侠 CEO', text: 'NAND涨价已足够，警惕损害长期需求'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n3} durationInFrames={FR.n3}>
        <NewsSectionLandscape tag="要闻三 · 油价破百" title={'中东局势升级\n布伦特破 100 美元'} number={101} unit="美元"
          Chart={({p}) => <TrendLine p={p} label="布伦特原油 · 五个月新高"
            points={[[80, 680], [220, 560], [380, 580], [540, 420], [700, 300], [860, 160]]} endLabel="101 美元" />}
          durFrames={FR.n3} voiceFile="0910_news3.mp3"
          opinions={[
            {tag: '看多 · 升级', color: '#F0997B', from: '高盛', text: '航运袭击若升级，油价或冲 120 美元'},
            {tag: '看空 · 缓和', color: '#5AC8FA', from: '特朗普表态', text: '战事或于11月后结束，缓和即回吐'},
            {tag: '谨慎 · 溢价', color: GOLD, from: '地缘特征', text: '消息驱动，地缘溢价快速反应、波动大'},
          ]} />
      </Sequence>

      <Sequence from={OFF.n4} durationInFrames={FR.n4}>
        <NewsSectionLandscape tag="要闻四 · 政策解读" title={'国新办金融发布会\n8月数据亮眼'} number={18.6} unit="%"
          Chart={({p}) => <HorizontalBars p={p} bars={[
            {name: '出口增长', val: 18.6}, {name: 'PPI 同比', val: 3.8}, {name: 'CPI 同比', val: 0.8},
          ]} />}
          durFrames={FR.n4} voiceFile="0910_news4.mp3"
          opinions={[
            {tag: '乐观 · 周期', color: GOLD, from: '富达国际', text: '亚洲正进入新一轮增长周期'},
            {tag: '中性 · 通胀', color: '#5AC8FA', from: '中金', text: '核心CPI同比降至2.35%，通胀温和'},
            {tag: '谨慎 · 外部', color: '#F0997B', from: 'CME观察', text: '美联储9月加息概率升至约六成'},
          ]} />
      </Sequence>

      <Sequence from={OFF.end} durationInFrames={FR.end}><End /></Sequence>
    </AbsoluteFill>
  );
};