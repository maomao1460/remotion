import type {ReactElement} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Cell, Tooltip} from 'recharts';

const GOLD = '#F5B841';
const GREEN = '#4ADE80';
const BLUE = '#5AC8FA';
const INK = '#0B1120';
const CARD = '#141C2E';

const inOut = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const easeOut = (f: number, a: number, b: number, from: number, to: number) => interpolate(f, [a, b], [from, to], {
  easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const springD = (f: number, fps: number, d: number) => spring({frame: f - d, fps, config: {damping: 15, stiffness: 110}});

// 轴/格子统一样式
const axisStyle = {stroke: '#3A4356'};
const tickStyle = {fill: '#8892A6', fontSize: 26};

// ============ 图表1：指数全周涨跌（横向条形，涨金跌绿）============
const IndexBars = ({p}: {p: number}) => {
  const items = [
    {name: '创业板指', full: 1.08}, {name: '深证成指', full: -0.34}, {name: '上证指数', full: -1.07},
  ];
  const data = items.map((it) => ({name: it.name, v: +(it.full * p).toFixed(2)}));
  return (
    <BarChart data={data} layout="vertical" width={920} height={520} margin={{left: 20, right: 40, top: 20}}>
      <XAxis type="number" tick={tickStyle} axisLine={axisStyle} tickLine={false} />
      <YAxis type="category" dataKey="name" tick={{fill: '#E8ECF5', fontSize: 34}} axisLine={false} tickLine={false} width={130} />
      <Bar dataKey="v" radius={[0, 12, 12, 0]} barSize={46} isAnimationActive={false}>
        {data.map((d, i) => (<Cell key={i} fill={d.v < 0 ? GREEN : GOLD} />))}
      </Bar>
    </BarChart>
  );
};

// ============ 图表2：美债收益率升高（柱状 2Y vs 10Y）============
const YieldsBars = ({p}: {p: number}) => {
  const items = [{name: '2年期', full: 4.42}, {name: '10年期', full: 4.96}];
  const data = items.map((it) => ({name: it.name, v: +(it.full * p).toFixed(2)}));
  return (
    <BarChart data={data} width={920} height={520} margin={{left: 20, right: 40, top: 30}}>
      <XAxis dataKey="name" tick={{fill: '#E8ECF5', fontSize: 34}} axisLine={axisStyle} tickLine={false} />
      <YAxis domain={[0, 6]} tick={tickStyle} axisLine={axisStyle} tickLine={false} width={60} />
      <Bar dataKey="v" radius={[12, 12, 0, 0]} barSize={90} fill={GOLD} isAnimationActive={false}>
        {data.map((d, i) => (<Cell key={i} fill={i === 1 ? GOLD : '#7A5AF8'} />))}
      </Bar>
    </BarChart>
  );
};

// ============ 图表3：油价破百（面积趋势）============
const OilTrend = ({p}: {p: number}) => {
  const full = [90, 93, 95, 98, 99, 101];
  const n = Math.max(Math.floor(p * (full.length - 1)) + 1, 1);
  const data = full.slice(0, n).map((v, i) => ({t: i, 油价: v}));
  return (
    <AreaChart data={data} width={920} height={520} margin={{left: 20, right: 40, top: 20}}>
      <XAxis dataKey="t" tick={false} axisLine={axisStyle} tickLine={false} />
      <YAxis domain={[85, 105]} tick={tickStyle} axisLine={axisStyle} tickLine={false} width={60} />
      <Area dataKey="油价" stroke={GOLD} strokeWidth={4} fill="url(#goldGrad)" isAnimationActive={false} dot={{fill: GOLD}} />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </linearGradient>
      </defs>
    </AreaChart>
  );
};

// ============ 图表4：光模块市场预测（三年柱状）============
const OpticsBars = ({p}: {p: number}) => {
  const items = [{name: '2026', full: 677}, {name: '2027', full: 1314}, {name: '2028', full: 1485}];
  const data = items.map((it) => ({name: it.name, v: Math.round(it.full * p)}));
  return (
    <BarChart data={data} width={920} height={520} margin={{left: 20, right: 40, top: 30}}>
      <XAxis dataKey="name" tick={{fill: '#E8ECF5', fontSize: 34}} axisLine={axisStyle} tickLine={false} />
      <YAxis tick={tickStyle} axisLine={axisStyle} tickLine={false} width={70} unit="亿" />
      <Bar dataKey="v" radius={[12, 12, 0, 0]} barSize={90} isAnimationActive={false}>
        {data.map((d, i) => (<Cell key={i} fill={i === 2 ? GOLD : '#2A3A5C'} />))}
      </Bar>
    </BarChart>
  );
};

type Opinion = {tag: string; color: string; from: string; text: string};
type Props = {tag: string; title: string; number: number; unit: string; Chart: (c: {p: number}) => ReactElement; opinions: Opinion[]; durFrames: number; voiceFile: string;};

export const NewsItem0913 = ({tag, title, number, unit, Chart, opinions, durFrames, voiceFile}: Props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bodyEnd = Math.round(durFrames * 0.52);
  const trans = Math.round(durFrames * 0.035);
  const opinStart = bodyEnd + trans;

  const bodyOp = interpolate(frame, [bodyEnd, bodyEnd + trans], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opinOp = inOut(frame, opinStart, opinStart + trans);
  const local = frame - opinStart;

  const tagOp = inOut(frame, 0, 25);
  const t1 = springD(frame, fps, 15);
  const numRaw = easeOut(frame, bodyEnd * 0.12, bodyEnd * 0.38, 0, number);
  const num = Number.isInteger(number) ? String(Math.round(numRaw)) : numRaw.toFixed(1);
  const unitOp = inOut(frame, bodyEnd * 0.36, bodyEnd * 0.42);
  const chartP = easeOut(frame, bodyEnd * 0.28, bodyEnd * 0.80, 0, 1);

  const ol = durFrames - opinStart;
  const ops = [inOut(local, ol * 0.08, ol * 0.20), inOut(local, ol * 0.36, ol * 0.48), inOut(local, ol * 0.64, ol * 0.76)];

  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile(voiceFile)} />
      <AbsoluteFill style={{opacity: bodyOp}}>
        <AbsoluteFill style={{background: INK, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif', color: '#FFF', display: 'flex', padding: '60px 70px'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
          <div style={{width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{opacity: tagOp, fontSize: 30, letterSpacing: 5, color: GOLD, fontWeight: 600}}>{tag}</div>
            <div style={{marginTop: 32, fontSize: 66, lineHeight: 1.3, fontWeight: 700, opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`, whiteSpace: 'pre-line'}}>{title}</div>
            <div style={{marginTop: 26, display: 'flex', alignItems: 'flex-end'}}>
              <span style={{fontSize: 130, fontWeight: 800, color: GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{num}</span>
              <span style={{fontSize: 52, fontWeight: 600, color: GOLD, marginLeft: 14, marginBottom: 6, opacity: unitOp}}>{unit}</span>
            </div>
          </div>
          <div style={{width: '58%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Chart p={chartP} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: opinOp}}>
        <AbsoluteFill style={{background: INK, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif', color: '#FFF', display: 'flex', flexDirection: 'column', padding: '70px 70px'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 10, background: GOLD}} />
          <div style={{opacity: ops[1] >= 0 ? inOut(local, 0, 25) : 0, fontSize: 28, letterSpacing: 5, color: GOLD, fontWeight: 600}}>多方观点</div>
          <div style={{opacity: inOut(local, 0, 25), marginTop: 18, fontSize: 60, lineHeight: 1.2, fontWeight: 700}}>市场怎么看</div>
          <div style={{marginTop: 46, display: 'flex', gap: 34}}>
            {opinions.map((o, i) => (
              <div key={i} style={{opacity: ops[i], transform: `translateY(${(1 - ops[i]) * 40}px)`, background: CARD, borderRadius: 16, padding: '28px 28px', borderTop: `5px solid ${o.color}`, flex: 1}}>
                <div style={{fontSize: 27, fontWeight: 700, color: o.color, marginBottom: 14}}>{o.tag}</div>
                <div style={{fontSize: 29, lineHeight: 1.45, color: '#E8ECF5', fontWeight: 500, marginBottom: 14}}>{o.text}</div>
                <div style={{fontSize: 23, color: '#8A94A8'}}>{o.from}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export {IndexBars, YieldsBars, OilTrend, OpticsBars};
