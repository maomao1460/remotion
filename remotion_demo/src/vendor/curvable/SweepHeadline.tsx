// Adapted from Curvable Motion's TextHover component (MIT).
// Source: https://github.com/Curvable/motion
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type SweepHeadlineProps = {
  text: string;
  accent?: string;
  delay?: number;
  fontSize?: number;
};

export const SweepHeadline = ({
  text,
  accent = '#C9FF4A',
  delay = 0,
  fontSize = 92,
}: SweepHeadlineProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);
  const reveal = interpolate(localFrame, [0, fps * 1.1], [0, 115], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif',
        fontSize,
        fontWeight: 900,
        letterSpacing: -3,
        lineHeight: 1.08,
        color: '#EDF4FF',
        opacity,
      }}
    >
      <span>{text}</span>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          color: accent,
          clipPath: `polygon(0 0, ${reveal}% 0, ${Math.min(100, reveal + 18)}% 100%, 0 100%)`,
          textShadow: `0 0 28px ${accent}88`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
