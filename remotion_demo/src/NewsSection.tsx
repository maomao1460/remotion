import {
  AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from 'remotion';
import type {ReactElement} from 'react';

export const GOLD = '#F5B841';
export const BLUE = '#5AC8FA';
export const CORAL = '#F0997B';
const INK = '#0B1120';
const CARD = '#141C2E';

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

type Opinion = {tag: string; color: string; from: string; text: string};
type ChartProps = {p: number; fps: number; frame: number};

// ============ 图表1：8家机构横向柱状图 ============
const BARS8 = [
  {name: '农业银行', val: 1300}, {name: '工商银行', val: 700},
  {name: '中国人寿', val: 350}, {name: '进出口银行', val: 300},
  {name: '中国人保', val: 150}, {name: '出口信保', val: 100},
  {name: '中国太平', val: 70}, {name: '中国再保', val: 30},
];
const MAX = 1300, BAR_MAX = 430, BAR_X = 210;

const ChartBars = ({p}: ChartProps) => (
  <svg width="900" height="600" viewBox="0 0 900 600">
    {BARS8.map((d, i) => {
      const pi = inOut(p * 10 - i * 0.8, 0, 1);
      const w = (d.val / MAX) * BAR_MAX * pi;
      const yTop = 8 + i * 72, yMid = yTop + 25;
      return (
        <g key={i}>
          <text x={BAR_X - 22} y={yMid} fill="#C7D0E0" fontSize={34} textAnchor="end"
            dominantBaseline="central">{d.name}</text>
          <rect x={BAR_X} y={yTop} width={w} height={50} rx={9} fill={GOLD} />
          <text x={BAR_X + w + 16} y={yMid} fill={GOLD} fontSize={34} fontWeight={700}
            dominantBaseline="central" opacity={pi}>{d.val} 亿</text>
        </g>
      );
    })}
    <line x1={BAR_X} y1={572} x2={BAR_X + BAR_MAX} y2={572} stroke="#3A4356" strokeWidth={2} />
  </svg>
);

// ============ 图表2：非农 预期 vs 实际 对比柱 ============
const ChartCompare = ({p}: ChartProps) => {
  const h1 = 60 * p, h2 = 220 * p;
  return (
    <svg width="900" height="600" viewBox="0 0 900 600">
      <g>
        <rect x={120} y={500 - h1} width={200} height={h1} rx={10} fill="#3A4356" />
        <text x={220} y={525} fill="#8A94A8" fontSize={34} textAnchor="middle">预期</text>
        <text x={220} y={490 - h1} fill="#8A94A8" fontSize={36} textAnchor="middle" opacity={p}>5.5万</text>
      </g>
      <g>
        <rect x={460} y={500 - h2} width={200} height={h2} rx={10} fill={GOLD} />
        <text x={560} y={525} fill="#FFF" fontSize={34} textAnchor="middle">实际</text>
        <text x={560} y={490 - h2} fill={GOLD} fontSize={40} fontWeight={700} textAnchor="middle" opacity={p}>16.2万</text>
      </g>
      <line x1={80} y1={500} x2={800} y2={500} stroke="#3A4356" strokeWidth={2} />
      <text x={450} y={70} fill="#E8ECF5" fontSize={44} fontWeight={700} textAnchor="middle" opacity={p}>
        约为预期的 3 倍
      </text>
    </svg>
  );
};

// ============ 图表3：油价上升趋势线 ============
const ChartTrend = ({p}: ChartProps) => {
  const pts = [[80, 480], [180, 430], [300, 440], [420, 350], [560, 300], [720, 200], [820, 150]];
  const n = Math.floor(p * 6) + 1;
  const poly = pts.slice(0, n).map((c) => c.join(',')).join(' ');
  const last = pts[n - 1];
  return (
    <svg width="900" height="600" viewBox="0 0 900 600">
      <polyline points={poly} fill="none" stroke={GOLD} strokeWidth={6}
        strokeLinecap="round" strokeLinejoin="round" />
      {n >= 2 && <circle cx={last[0]} cy={last[1]} r={14} fill={GOLD} />}
      <text x={last[0] + 30} y={last[1] - 20} fill={GOLD} fontSize={44} fontWeight={700} opacity={p}>
        96 美元
      </text>
      <line x1={80} y1={520} x2={820} y2={520} stroke="#3A4356" strokeWidth={2} />
      <text x={80} y={565} fill="#8A94A8" fontSize={30}>布伦特原油 · 周涨约 8%</text>
    </svg>
  );
};

// ============ 图表4：算力技术关键词卡片 ============
const ChartCards = ({p}: ChartProps) => {
  const items = [
    {t: '800V', d: '高压直流供电'},
    {t: '液冷', d: '散热 + 余热回收'},
    {t: '超百千瓦', d: '单机柜部署'},
  ];
  return (
    <svg width="900" height="600" viewBox="0 0 900 600">
      {items.map((it, i) => {
        const pi = inOut(p * 10 - i * 1.5, 0, 1);
        return (
          <g key={i} opacity={pi} transform={`translate(0 ${(1 - pi) * 30})`}>
            <rect x={40} y={40 + i * 180} width={820} height={150} rx={16} fill={CARD}
              stroke={GOLD} strokeWidth={2} />
            <text x={90} y={130 + i * 180} fill={GOLD} fontSize={56} fontWeight={700}>{it.t}</text>
            <text x={480} y={130 + i * 180} fill="#C7D0E0" fontSize={38}>{it.d}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ============ 观点卡片 ============
const OpinionCard = ({o, op}: {o: Opinion; op: number}) => (
  <div style={{
    opacity: op, transform: `translateY(${(1 - op) * 50}px)`,
    background: CARD, borderRadius: 20, padding: '30px 38px', borderLeft: `6px solid ${o.color}`,
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16}}>
      <span style={{fontSize: 30, fontWeight: 700, color: o.color}}>{o.tag}</span>
      <span style={{fontSize: 26, color: '#8A94A8'}}>{o.from}</span>
    </div>
    <div style={{fontSize: 38, lineHeight: 1.5, color: '#E8ECF5', fontWeight: 500}}>{o.text}</div>
  </div>
);

// ============ 通用消息组件（正文屏 + 观点屏）============
type Props = {
  tag: string; title: string; number: number; unit: string;
  Chart: (c: ChartProps) => ReactElement;
  opinions: Opinion[]; durFrames: number; voiceFile: string;
};

export const NewsSection = ({tag, title, number, unit, Chart, opinions, durFrames, voiceFile}: Props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bodyEnd = Math.round(durFrames * 0.52);
  const trans = Math.round(durFrames * 0.035);
  const opinStart = bodyEnd + trans;

  const bodyOp = interpolate(frame, [bodyEnd, bodyEnd + trans], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opinOp = inOut(frame, opinStart, opinStart + trans);
  const local = frame - opinStart;

  // 正文屏时间轴
  const tagOp = inOut(frame, 0, 25);
  const t1 = springD(frame, fps, 15);
  const numRaw = easeOut(frame, bodyEnd * 0.12, bodyEnd * 0.38, 0, number);
  const num = Number.isInteger(number) ? String(Math.round(numRaw)) : numRaw.toFixed(1);
  const unitOp = inOut(frame, bodyEnd * 0.36, bodyEnd * 0.42);
  const chartP = easeOut(frame, bodyEnd * 0.28, bodyEnd * 0.78, 0, 1);

  // 观点屏时间轴（相对）
  const otitle = inOut(local, 0, 25);
  const ol = durFrames - opinStart; // 观点屏长度
  const ops = [
    inOut(local, ol * 0.08, ol * 0.20),
    inOut(local, ol * 0.36, ol * 0.48),
    inOut(local, ol * 0.64, ol * 0.76),
  ];

  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile(voiceFile)} />

      <AbsoluteFill style={{opacity: bodyOp}}>
        <AbsoluteFill style={{
          background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          color: '#FFF', display: 'flex', flexDirection: 'column', padding: '120px 90px 90px',
        }}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />
          <div style={{opacity: tagOp, fontSize: 32, letterSpacing: 6, color: GOLD, fontWeight: 600}}>{tag}</div>
          <div style={{marginTop: 40, fontSize: 70, lineHeight: 1.25, fontWeight: 700,
            opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`,
            whiteSpace: 'pre-line'}}>{title}</div>
          <div style={{marginTop: 16, display: 'flex', alignItems: 'flex-end'}}>
            <span style={{fontSize: 120, fontWeight: 800, color: GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{num}</span>
            <span style={{fontSize: 50, fontWeight: 600, color: GOLD, marginLeft: 14, marginBottom: 6, opacity: unitOp}}>{unit}</span>
          </div>
          <div style={{marginTop: 8}}>
            <Chart p={chartP} fps={fps} frame={frame} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: opinOp}}>
        <AbsoluteFill style={{
          background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          color: '#FFF', display: 'flex', flexDirection: 'column', padding: '130px 90px 110px',
        }}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14, background: GOLD}} />
          <div style={{opacity: otitle, fontSize: 30, letterSpacing: 6, color: GOLD, fontWeight: 600}}>多方观点</div>
          <div style={{opacity: otitle, marginTop: 22, fontSize: 68, lineHeight: 1.2, fontWeight: 700}}>市场怎么看</div>
          <div style={{marginTop: 56, display: 'flex', flexDirection: 'column', gap: 36}}>
            {opinions.map((o, i) => <OpinionCard key={i} o={o} op={ops[i]} />)}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export {ChartBars, ChartCompare, ChartTrend, ChartCards};
