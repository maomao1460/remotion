// Adapted from Remotion Scenes' DataLineChart component (MIT).
// Source: https://github.com/lifeprompt-team/remotion-scenes
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Point = {label: string; value: number};

type AnimatedLineTraceProps = {
  points: Point[];
  color?: string;
  delay?: number;
  width?: number;
  height?: number;
};

export const AnimatedLineTrace = ({
  points,
  color = '#55D6FF',
  delay = 0,
  width = 860,
  height = 270,
}: AnimatedLineTraceProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [delay, delay + fps * 1.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const values = points.map((point) => point.value);
  const minimum = Math.min(...values) - 0.1;
  const maximum = Math.max(...values) + 0.1;
  const x = (index: number) => (index / Math.max(1, points.length - 1)) * width;
  const y = (value: number) => height - ((value - minimum) / (maximum - minimum)) * height;
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.value)}`).join(' ');
  const visible = Math.max(1, Math.ceil(points.length * progress));
  const last = points[visible - 1];
  const lastIndex = visible - 1;

  return (
    <div style={{position: 'relative', width, height: height + 48}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
        {[0.18, 0.5, 0.82].map((ratio) => (
          <line key={ratio} x1={0} x2={width} y1={height * ratio} y2={height * ratio} stroke="#31405B" strokeDasharray="7 13" />
        ))}
        <defs>
          <linearGradient id="trace-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.36" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="trace-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#trace-fill)" opacity={progress} />
        <path d={path} pathLength="1" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - progress} filter="url(#trace-glow)" />
        {points.slice(0, visible).map((point, index) => (
          <circle key={point.label} cx={x(index)} cy={y(point.value)} r={index === lastIndex ? 9 : 5} fill={index === lastIndex ? '#C9FF4A' : color} stroke="#101A2C" strokeWidth="3" />
        ))}
      </svg>
      {last ? <div style={{position: 'absolute', left: Math.min(width - 80, x(lastIndex) + 14), top: Math.max(-8, y(last.value) - 40), color: '#0B1322', background: '#C9FF4A', borderRadius: 12, padding: '7px 12px', fontSize: 20, fontWeight: 800}}>{last.value.toFixed(2)}%</div> : null}
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, color: '#8290A9', fontSize: 16}}>{points.map((point) => <span key={point.label}>{point.label}</span>)}</div>
    </div>
  );
};
