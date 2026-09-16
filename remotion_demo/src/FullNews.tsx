import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const GOLD = '#F5B841';
const BLUE = '#5AC8FA';
const CORAL = '#F0997B';
const INK = '#0B1120';
const CARD = '#141C2E';

const BARS = [
  {name: '农业银行', val: 1300},
  {name: '工商银行', val: 700},
  {name: '中国人寿', val: 350},
  {name: '进出口银行', val: 300},
  {name: '中国人保', val: 150},
  {name: '出口信保', val: 100},
  {name: '中国太平', val: 70},
  {name: '中国再保', val: 30},
];
const MAX = 1300;
const BAR_MAX = 430;
const BAR_X = 210;

const OPINIONS = [
  {tag: '乐观 · 提振', color: GOLD, from: '招联首席经济学家 董希淼',
   text: '三千亿资本可撬动约四万亿资产增量，释放稳估值信号'},
  {tag: '中性 · 蓄能', color: BLUE, from: '国信证券 王剑',
   text: '大行资本本就充足，这次是着眼长远的蓄能安排'},
  {tag: '谨慎 · 摊薄', color: CORAL, from: '招联 董希淼',
   text: '定增短期摊薄每股收益，还需留意'},
];

const springD = (frame: number, fps: number, delay: number) =>
  spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 110}});

const inOut = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

const easeOut = (frame: number, a: number, b: number, from: number, to: number) =>
  interpolate(frame, [a, b], [from, to], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

// ============ 正文屏 ============
const BodyContent = ({frame, fps}: {frame: number; fps: number}) => {
  const tagOp = inOut(frame, 0, 30);
  const t1 = springD(frame, fps, 15);
  const t2 = springD(frame, fps, 28);
  const num = Math.round(easeOut(frame, 75, 150, 0, 3000));
  const unitOp = inOut(frame, 140, 170);
  const grow = (i: number) => easeOut(frame, 135 + i * 20, 135 + i * 20 + 40, 0, 1);

  return (
    <AbsoluteFill style={{
      background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
      color: '#FFF', display: 'flex', flexDirection: 'column', padding: '120px 90px 90px',
    }}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />

      <div style={{opacity: tagOp, fontSize: 32, letterSpacing: 6, color: GOLD, fontWeight: 600}}>
        要闻一 · 政策底
      </div>

      <div style={{marginTop: 44, fontSize: 76, lineHeight: 1.25, fontWeight: 700,
        opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`}}>
        财政部出手
      </div>
      <div style={{fontSize: 76, lineHeight: 1.25, fontWeight: 700,
        opacity: t2, transform: `translateY(${(1 - t2) * 40}px)`}}>
        注资 3000 亿
      </div>

      <div style={{marginTop: 28, display: 'flex', alignItems: 'flex-end'}}>
        <span style={{fontSize: 150, fontWeight: 800, color: GOLD, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums'}}>
          {num}
        </span>
        <span style={{fontSize: 54, fontWeight: 600, color: GOLD, marginLeft: 16,
          marginBottom: 8, opacity: unitOp}}>
          亿元
        </span>
      </div>

      <svg width="900" height="600" viewBox="0 0 900 600" style={{marginTop: 16}}>
        {BARS.map((d, i) => {
          const p = grow(i);
          const w = (d.val / MAX) * BAR_MAX * p;
          const yTop = 8 + i * 72;
          const yMid = yTop + 25;
          return (
            <g key={i}>
              <text x={BAR_X - 22} y={yMid} fill="#C7D0E0" fontSize={34} textAnchor="end"
                dominantBaseline="central">{d.name}</text>
              <rect x={BAR_X} y={yTop} width={w} height={50} rx={9} fill={GOLD} />
              <text x={BAR_X + w + 16} y={yMid} fill={GOLD} fontSize={34}
                fontWeight={700} dominantBaseline="central" opacity={p}>{d.val} 亿</text>
            </g>
          );
        })}
        <line x1={BAR_X} y1={572} x2={BAR_X + BAR_MAX} y2={572} stroke="#3A4356" strokeWidth={2} />
      </svg>
    </AbsoluteFill>
  );
};

// ============ 观点屏 ============
const OpinionsContent = ({frame, fps}: {frame: number; fps: number}) => {
  const titleOp = inOut(frame, 0, 30);
  const ops = [
    inOut(frame, 20, 60),
    inOut(frame, 240, 280),
    inOut(frame, 390, 430),
  ];
  const riskOp = inOut(frame, 510, 550);

  return (
    <AbsoluteFill style={{
      background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
      color: '#FFF', display: 'flex', flexDirection: 'column', padding: '130px 90px 110px',
    }}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />

      <div style={{opacity: titleOp, fontSize: 32, letterSpacing: 6, color: GOLD, fontWeight: 600}}>
        多方观点
      </div>
      <div style={{opacity: titleOp, marginTop: 26, fontSize: 72, lineHeight: 1.2, fontWeight: 700}}>
        市场怎么看
      </div>

      <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 44}}>
        {OPINIONS.map((o, i) => (
          <div key={i} style={{
            opacity: ops[i], transform: `translateY(${(1 - ops[i]) * 50}px)`,
            background: CARD, borderRadius: 20, padding: '34px 38px',
            borderLeft: `6px solid ${o.color}`,
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18}}>
              <span style={{fontSize: 30, fontWeight: 700, color: o.color}}>{o.tag}</span>
              <span style={{fontSize: 26, color: '#8A94A8'}}>{o.from}</span>
            </div>
            <div style={{fontSize: 40, lineHeight: 1.55, color: '#E8ECF5', fontWeight: 500}}>
              {o.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop: 'auto', opacity: riskOp, fontSize: 26, color: '#5A6478', letterSpacing: 1}}>
        仅消息面检索，不构成任何投资建议
      </div>
    </AbsoluteFill>
  );
};

// ============ 主组件 ============
export const FullNews = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bodyOp = interpolate(frame, [510, 540], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opinOp = inOut(frame, 540, 570);

  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('full_voice.mp3')} />
      <Audio src={staticFile('bgm.wav')} volume={0.16} />
      <AbsoluteFill style={{opacity: bodyOp}}>
        <BodyContent frame={frame} fps={fps} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: opinOp}}>
        <OpinionsContent frame={frame - 540} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};