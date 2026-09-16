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

const C = '#F5B841'; // 金色主题

const POINTS = [
  '工行、农行定增，财政部认购 2000 亿',
  '人保、人寿、太平获注资 570 亿',
  '资金全部用于补充核心一级资本',
];

export const Zhuzi = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const s = (delay: number) =>
    spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 110}});

  // 时间轴（27.43s = 823 帧 @30fps，对齐配音节奏）
  const tagOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const t1 = s(12);
  const t2 = s(26);
  const num = Math.round(
    interpolate(frame, [60, 180], [0, 3000], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }),
  );
  const unitOp = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const p1 = s(255);
  const p2 = s(395);
  const p3 = s(515);
  const noteOp = interpolate(frame, [680, 710], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const slideDown = (p: number) => `translateY(${(1 - p) * 50}px)`;
  const slideRight = (p: number) => `translateX(${(1 - p) * 60}px)`;
  const ps = [p1, p2, p3];

  return (
    <AbsoluteFill
      style={{
        background: '#0B1120',
        fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '150px 100px 100px',
      }}
    >
      <Audio src={staticFile('seg_02.mp3')} />
      <Audio src={staticFile('bgm.wav')} volume={0.16} />

      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: '100%', height: 14, background: C,
      }} />

      <div style={{
        opacity: tagOp, fontSize: 36, letterSpacing: 6,
        color: C, fontWeight: 600,
      }}>
        要闻一 · 政策底
      </div>

      <div style={{
        marginTop: 56, fontSize: 92, lineHeight: 1.22,
        fontWeight: 700, opacity: t1, transform: slideDown(t1),
      }}>
        财政部出手
      </div>
      <div style={{
        fontSize: 92, lineHeight: 1.22, fontWeight: 700,
        opacity: t2, transform: slideDown(t2),
      }}>
        注资超
      </div>

      <div style={{marginTop: 36, display: 'flex', alignItems: 'flex-end'}}>
        <span style={{
          fontSize: 190, fontWeight: 800, color: C, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {num}
        </span>
        <span style={{
          fontSize: 66, fontWeight: 600, color: C,
          marginLeft: 18, marginBottom: 12, opacity: unitOp,
        }}>
          亿元
        </span>
      </div>

      <div style={{marginTop: 84, display: 'flex', flexDirection: 'column', gap: 40}}>
        {POINTS.map((txt, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 24,
            opacity: ps[i], transform: slideRight(ps[i]),
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: C, flexShrink: 0,
            }} />
            <span style={{fontSize: 44, color: '#C7D0E0'}}>{txt}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 84, opacity: noteOp, fontSize: 34,
        color: '#8A94A8', letterSpacing: 2,
      }}>
        金融体系增资总规模 · 政策底信号
      </div>
    </AbsoluteFill>
  );
};