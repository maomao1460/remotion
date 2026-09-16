import {
  AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from 'remotion';
import type {ReactElement} from 'react';

export const GOLD = '#F5B841';
const GREEN = '#4ADE80'; // 下跌（A股惯例）
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

type Bar = {name: string; val: number; suffix?: string};

// ============ 横向条形图（单向布局，颜色区分涨跌：涨金跌绿）============
const HorizontalBars = ({bars, p}: {bars: Bar[]; p: number}) => {
  const maxAbs = Math.max(...bars.map((b) => Math.abs(b.val)));
  const n = bars.length;
  const rowH = 660 / Math.max(n, 1);
  const fontSize = n <= 3 ? 48 : 40;
  const nameX = 60;   // 机构名左对齐起点
  const baseX = 300;  // 条形起点
  const barMax = 520; // 最大柱长（到 820）

  return (
    <svg width="1000" height="800" viewBox="0 0 1000 800">
      {bars.map((b, i) => {
        const pi = inOut(p * (n + 1) - i, 0, 1);
        const w = (Math.abs(b.val) / maxAbs) * barMax * pi;
        const yTop = 60 + i * rowH;
        const yMid = yTop + fontSize - 10;
        const color = b.val < 0 ? GREEN : GOLD;
        return (
          <g key={i}>
            <text x={nameX} y={yMid} fill="#E8ECF5" fontSize={fontSize} fontWeight={600}
              textAnchor="start" dominantBaseline="central">{b.name}</text>
            <rect x={baseX} y={yTop} width={w} height={fontSize + 8} rx={12} fill={color} />
            <text x={baseX + w + 20} y={yMid} fill={color} fontSize={fontSize} fontWeight={700}
              dominantBaseline="central" opacity={pi}>
              {b.val > 0 ? '+' : ''}{b.val}{b.suffix ?? '%'}
            </text>
          </g>
        );
      })}
      <line x1={baseX} y1={60 + n * rowH} x2={baseX + barMax} y2={60 + n * rowH} stroke="#3A4356" strokeWidth={2} />
    </svg>
  );
};

// ============ 趋势线 ============
const TrendLine = ({label, points, endLabel, p}: {label: string; points: number[][]; endLabel: string; p: number}) => {
  const n = Math.max(Math.floor(p * (points.length - 1)) + 1, 1);
  const poly = points.slice(0, n).map((c) => c.join(',')).join(' ');
  const last = points[n - 1];
  return (
    <svg width="1000" height="800" viewBox="0 0 1000 800">
      <polyline points={poly} fill="none" stroke={GOLD} strokeWidth={6}
        strokeLinecap="round" strokeLinejoin="round" />
      {n >= 2 && <circle cx={last[0]} cy={last[1]} r={14} fill={GOLD} />}
      <text x={last[0] - 30} y={last[1] - 36} fill={GOLD} fontSize={48} fontWeight={700}
        textAnchor="end" opacity={p}>
        {endLabel}
      </text>
      <line x1={60} y1={720} x2={940} y2={720} stroke="#3A4356" strokeWidth={2} />
      <text x={60} y={765} fill="#8A94A8" fontSize={32}>{label}</text>
    </svg>
  );
};

type Opinion = {tag: string; color: string; from: string; text: string};
type ChartProps = {p: number; fps: number; frame: number};

const OpinionCard = ({o, op}: {o: Opinion; op: number}) => (
  <div style={{
    opacity: op, transform: `translateY(${(1 - op) * 40}px)`,
    background: CARD, borderRadius: 18, padding: '28px 30px',
    borderTop: `5px solid ${o.color}`, flex: 1,
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
      <span style={{fontSize: 28, fontWeight: 700, color: o.color}}>{o.tag}</span>
    </div>
    <div style={{fontSize: 30, lineHeight: 1.45, color: '#E8ECF5', fontWeight: 500, marginBottom: 14}}>{o.text}</div>
    <div style={{fontSize: 24, color: '#8A94A8'}}>{o.from}</div>
  </div>
);

type Props = {
  tag: string; title: string; number: number; unit: string;
  Chart: (c: ChartProps) => ReactElement;
  opinions: Opinion[]; durFrames: number; voiceFile: string;
};

export const NewsSectionLandscape = ({tag, title, number, unit, Chart, opinions, durFrames, voiceFile}: Props) => {
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

  const tagOp = inOut(frame, 0, 25);
  const t1 = springD(frame, fps, 15);
  const numRaw = easeOut(frame, bodyEnd * 0.12, bodyEnd * 0.38, 0, number);
  const num = Number.isInteger(number) ? String(Math.round(numRaw)) : numRaw.toFixed(1);
  const unitOp = inOut(frame, bodyEnd * 0.36, bodyEnd * 0.42);
  const chartP = easeOut(frame, bodyEnd * 0.28, bodyEnd * 0.78, 0, 1);

  const otitle = inOut(local, 0, 25);
  const ol = durFrames - opinStart;
  const ops = [
    inOut(local, ol * 0.08, ol * 0.20),
    inOut(local, ol * 0.36, ol * 0.48),
    inOut(local, ol * 0.64, ol * 0.76),
  ];

  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile(voiceFile)} />

      {/* 正文屏：左右分栏 */}
      <AbsoluteFill style={{opacity: bodyOp}}>
        <AbsoluteFill style={{
          background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          color: '#FFF', display: 'flex', padding: '70px 80px',
        }}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
          {/* 左栏：文字 */}
          <div style={{width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{opacity: tagOp, fontSize: 30, letterSpacing: 5, color: GOLD, fontWeight: 600}}>{tag}</div>
            <div style={{marginTop: 36, fontSize: 72, lineHeight: 1.28, fontWeight: 700,
              opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`, whiteSpace: 'pre-line'}}>{title}</div>
            <div style={{marginTop: 28, display: 'flex', alignItems: 'flex-end'}}>
              <span style={{fontSize: 150, fontWeight: 800, color: GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{num}</span>
              <span style={{fontSize: 56, fontWeight: 600, color: GOLD, marginLeft: 16, marginBottom: 8, opacity: unitOp}}>{unit}</span>
            </div>
          </div>
          {/* 右栏：图表 */}
          <div style={{width: '58%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Chart p={chartP} fps={fps} frame={frame} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* 观点屏 */}
      <AbsoluteFill style={{opacity: opinOp}}>
        <AbsoluteFill style={{
          background: INK, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          color: '#FFF', display: 'flex', flexDirection: 'column', padding: '70px 80px',
        }}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
          <div style={{opacity: otitle, fontSize: 28, letterSpacing: 5, color: GOLD, fontWeight: 600}}>多方观点</div>
          <div style={{opacity: otitle, marginTop: 20, fontSize: 64, lineHeight: 1.2, fontWeight: 700}}>市场怎么看</div>
          <div style={{marginTop: 50, display: 'flex', gap: 36}}>
            {opinions.map((o, i) => <OpinionCard key={i} o={o} op={ops[i]} />)}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export {HorizontalBars, TrendLine};
