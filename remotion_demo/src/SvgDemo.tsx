import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const C = '#F5B841'; // 金色主题

// 各机构获注资额（亿元）
const DATA = [
  {name: '农业银行', val: 1300},
  {name: '工商银行', val: 700},
  {name: '中国人寿', val: 350},
  {name: '中国人保', val: 150},
  {name: '中国太平', val: 70},
];
const MAX = 1300;
const BAR_MAX = 500;
const BAR_X = 220;

export const SvgDemo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const tagOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const title = spring({frame: frame - 8, fps, config: {damping: 14, stiffness: 110}});
  const noteOp = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const grow = (i: number) =>
    interpolate(frame, [40 + i * 20, 40 + i * 20 + 45], [0, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill
      style={{
        background: '#0B1120',
        fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '150px 90px 110px',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: '100%', height: 14, background: C,
      }} />

      <div style={{
        opacity: tagOp, fontSize: 36, letterSpacing: 6,
        color: C, fontWeight: 600,
      }}>
        配图方案 · SVG 动态数据图
      </div>

      <div style={{
        marginTop: 50, fontSize: 74, lineHeight: 1.3,
        fontWeight: 700, opacity: title,
        transform: `translateY(${(1 - title) * 40}px)`,
      }}>
        财政部注资 · 增资规模
      </div>

      <svg width="900" height="660" viewBox="0 0 900 660" style={{marginTop: 40}}>
        {DATA.map((d, i) => {
          const p = grow(i);
          const w = (d.val / MAX) * BAR_MAX * p;
          const yTop = 30 + i * 126;
          const yMid = yTop + 46;
          return (
            <g key={i}>
              <text x={0} y={yMid} fill="#C7D0E0" fontSize={42}
                textAnchor="end" dominantBaseline="central">
                {d.name}
              </text>
              <rect x={BAR_X} y={yTop} width={w} height={64} rx={12} fill={C} />
              <text x={BAR_X + BAR_MAX + 28} y={yMid} fill={C} fontSize={42}
                fontWeight={700} dominantBaseline="central" opacity={p}>
                {d.val} 亿
              </text>
            </g>
          );
        })}
        <line x1={BAR_X} y1={635} x2={BAR_X + BAR_MAX} y2={635}
          stroke="#3A4356" strokeWidth={2} />
      </svg>

      <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{
          opacity: noteOp, fontSize: 34, color: '#8A94A8', letterSpacing: 2,
        }}>
          各机构获财政部注资 · 合计超 3000 亿元
        </div>
        <div style={{
          opacity: noteOp, fontSize: 26, color: '#5A6478', letterSpacing: 1,
        }}>
          仅消息面检索，不构成任何投资建议
        </div>
      </div>
    </AbsoluteFill>
  );
};