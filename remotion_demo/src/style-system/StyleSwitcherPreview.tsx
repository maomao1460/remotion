import type {ReactNode} from 'react';
import {z} from 'zod';
import {Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {isManualStyleOverride, resolveStyle} from './style-registry';
import {CONTENT_TYPES, STYLE_IDS, type ContentType, type StylePack} from './style-types';

export const StyleSwitcherPreviewSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  styleId: z.enum(STYLE_IDS).optional(),
  allowManualStyleOverride: z.boolean().default(false),
  eyebrow: z.string().min(1).max(32),
  title: z.string().min(1).max(28),
  subtitle: z.string().min(1).max(52),
  heroValue: z.string().max(16).optional(),
  heroUnit: z.string().max(12).optional(),
  cards: z.array(z.object({label: z.string().min(1).max(14), text: z.string().min(1).max(28)})).min(2).max(3),
  cta: z.string().min(1).max(20).optional(),
  disclaimer: z.string().min(8).max(80),
  review: z.object({
    verification: z.enum(['cross-checked', 'single-source', 'user-provided', 'pending-review']),
    approvalStatus: z.enum(['draft', 'approved']),
    userProvidedNote: z.string().max(120).optional(),
    sources: z.array(z.object({id: z.string().min(1), outlet: z.string().min(1), url: z.url().optional()})).max(8).default([]),
  }),
  media: z.object({
    backgroundMusic: z.object({file: z.string().min(1), volume: z.number().min(0).max(1)}).optional(),
    voiceover: z.object({file: z.string().min(1), durationSeconds: z.number().positive()}).optional(),
  }).optional(),
  render: z.object({
    width: z.literal(1920),
    height: z.literal(1080),
    fps: z.literal(30),
    expectedDurationSeconds: z.literal(8),
  }),
});

export type StyleSwitcherPreviewProps = z.infer<typeof StyleSwitcherPreviewSchema>;

const Backdrop = ({pack, children}: {pack: StylePack; children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const drift = interpolate(frame, [0, fps * 4], [0, pack.motion.pace === 'fast' ? 90 : 46], {extrapolateRight: 'clamp'});
  const dark = pack.id === 'data-pulse';
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: pack.colors.background, color: pack.colors.ink, fontFamily: 'NotoSansSC,"Microsoft YaHei",sans-serif'}}>
    <div style={{position: 'absolute', inset: 0, opacity: dark ? 0.45 : 0.5, backgroundImage: dark ? `linear-gradient(${pack.colors.muted}24 1px, transparent 1px), linear-gradient(90deg, ${pack.colors.muted}24 1px, transparent 1px)` : `radial-gradient(${pack.colors.accent}20 1px, transparent 1px)`, backgroundSize: dark ? '72px 72px' : '34px 34px'}} />
    <div style={{position: 'absolute', width: 650, height: 650, borderRadius: 999, right: width * 0.02, top: -300, background: `radial-gradient(circle, ${pack.colors.accent}33 0%, transparent 68%)`, filter: 'blur(10px)', translate: `${drift}px 0px`}} />
    <div style={{position: 'absolute', width: 460, height: 460, borderRadius: 999, left: -220, bottom: -270, background: `radial-gradient(circle, ${pack.colors.accentAlt}33 0%, transparent 68%)`, filter: 'blur(12px)', translate: `${-drift * 0.4}px 0px`}} />
    {children}
  </div>;
};

const Motif = ({pack, value, unit}: {pack: StylePack; value?: string; unit?: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 8, fps, config: {damping: 17, stiffness: 115}});
  const common = {position: 'absolute' as const, right: 168, top: 246, width: 480, height: 430, opacity: enter, scale: 0.82 + enter * 0.18, translate: `${(1 - enter) * 60}px 0px`};
  if (pack.motif === 'metric') return <div style={{...common, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: `1px solid ${pack.colors.accent}44`, borderRadius: 38, padding: 52, boxSizing: 'border-box', background: pack.colors.panel, boxShadow: `0 26px 70px ${pack.colors.accent}18`}}><div style={{fontSize: 22, color: pack.colors.muted}}>核心数字</div><div style={{marginTop: 20, color: pack.colors.accent, fontSize: 112, lineHeight: 0.9, fontWeight: 900, letterSpacing: -7}}>{value ?? '3900'}<span style={{fontSize: 32, letterSpacing: 0, marginLeft: 10}}>{unit ?? '点'}</span></div><div style={{marginTop: 42, height: 12, width: 285, borderRadius: 99, background: pack.colors.accentAlt}} /></div>;
  if (pack.motif === 'product-card') return <div style={{...common, borderRadius: 38, background: `linear-gradient(135deg, ${pack.colors.accent}, ${pack.colors.ink})`, color: '#FFF', padding: 48, boxSizing: 'border-box', boxShadow: `0 28px 70px ${pack.colors.accent}44`}}><div style={{fontSize: 20, opacity: 0.75, letterSpacing: 2}}>SERVICE INTRODUCTION</div><div style={{marginTop: 120, fontSize: 48, fontWeight: 900}}>从了解开始</div><div style={{marginTop: 18, fontSize: 25, opacity: 0.8}}>清晰 · 有序 · 易理解</div><div style={{position: 'absolute', right: 42, bottom: 42, width: 80, height: 80, border: '2px solid #FFFFFF66', borderRadius: 999}} /></div>;
  if (pack.motif === 'calendar') return <div style={{...common, width: 410, right: 220, overflow: 'hidden', borderRadius: 38, background: '#FFF', color: pack.colors.ink, boxShadow: '0 28px 64px #8F562322'}}><div style={{height: 112, padding: '25px 36px', boxSizing: 'border-box', background: pack.colors.accent, color: '#FFF'}}><div style={{fontSize: 17, letterSpacing: 2, opacity: 0.8}}>WEEKEND</div><div style={{marginTop: 5, fontSize: 30, fontWeight: 900}}>活动日历</div></div><div style={{padding: '50px 40px', fontSize: 100, lineHeight: 0.9, fontWeight: 900, color: pack.colors.ink}}>SAT<div style={{marginTop: 46, fontSize: 22, color: pack.colors.accent}}>轻松参与 · 了解详情</div></div></div>;
  const pointer = interpolate(frame, [18, 108], [0.18, 0.66], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{...common, width: 560, right: 125, top: 296}}><div style={{fontSize: 23, fontWeight: 900, color: pack.colors.muted}}>风险理解坐标</div><div style={{position: 'relative', marginTop: 50, height: 72, borderRadius: 99, background: `linear-gradient(90deg, ${pack.colors.accent}, ${pack.colors.accentAlt}, #E77D6B)`}}><div style={{position: 'absolute', left: `calc(${pointer * 100}% - 32px)`, top: -44, width: 64, height: 64, borderRadius: 999, boxSizing: 'border-box', border: `7px solid ${pack.colors.ink}`, background: '#FFF'}} /></div><div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, color: pack.colors.muted, fontSize: 20}}><span>相对稳健</span><span>理解波动</span><span>目标更高</span></div></div>;
};

export const StyleSwitcherPreview: React.FC<StyleSwitcherPreviewProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pack = resolveStyle(props.contentType as ContentType, props.styleId);
  const enter = spring({frame, fps, config: {damping: 19, stiffness: 115}});
  const manual = isManualStyleOverride(props.contentType as ContentType, props.styleId);
  return <Backdrop pack={pack}>
    {props.media?.backgroundMusic ? <Audio src={staticFile(props.media.backgroundMusic.file)} volume={props.media.backgroundMusic.volume} loop /> : null}
    {props.media?.voiceover ? <Audio src={staticFile(props.media.voiceover.file)} volume={1} /> : null}
    <div style={{position: 'absolute', left: 78, top: 58, display: 'flex', gap: 14, alignItems: 'center', color: pack.colors.muted, fontSize: 21}}><span style={{fontWeight: 900, color: pack.colors.accent}}>{pack.label}</span><span>{manual ? '手动切换' : '自动推荐'}</span><span>· {props.review.verification === 'user-provided' ? '用户提供内容' : props.review.verification === 'cross-checked' ? '已交叉核验' : props.review.verification === 'single-source' ? '单一来源' : '待审核'}</span></div>
    <div style={{position: 'absolute', left: 148, top: 215, width: 940, opacity: enter, translate: `0 ${(1 - enter) * 38}px`}}>
      <div style={{fontSize: 28, letterSpacing: 3, fontWeight: 900, color: pack.colors.accent}}>{props.eyebrow}</div>
      <div style={{marginTop: 25, fontSize: 80, fontWeight: 900, lineHeight: 1.17, letterSpacing: -4, whiteSpace: 'pre-line'}}>{props.title}</div>
      <div style={{marginTop: 28, fontSize: 27, lineHeight: 1.6, color: pack.colors.muted}}>{props.subtitle}</div>
    </div>
    <Motif pack={pack} value={props.heroValue} unit={props.heroUnit} />
    <div style={{position: 'absolute', left: 148, right: 148, bottom: 126, display: 'flex', gap: 22}}>{props.cards.map((card, index) => { const cardEnter = spring({frame: frame - 18 - index * 9, fps, config: {damping: 18, stiffness: 120}}); return <div key={card.label} style={{flex: 1, minHeight: 150, padding: '22px 28px', boxSizing: 'border-box', borderRadius: 24, background: pack.colors.cardFills[index], color: pack.colors.ink, opacity: cardEnter, scale: 0.9 + cardEnter * 0.1, translate: `0 ${(1 - cardEnter) * 28}px`, boxShadow: '0 14px 38px #17324D12'}}><div style={{fontSize: 25, fontWeight: 900, color: pack.colors.accent}}>{card.label}</div><div style={{marginTop: 14, fontSize: 20, lineHeight: 1.45, color: pack.colors.muted}}>{card.text}</div></div>; })}</div>
    <div style={{position: 'absolute', left: 148, bottom: 53, padding: '13px 24px', borderRadius: 99, background: pack.colors.accent, color: pack.id === 'data-pulse' ? '#0B1322' : '#FFF', fontSize: 22, fontWeight: 900}}>{props.cta ?? pack.defaultCta} →</div>
    <div style={{position: 'absolute', right: 72, bottom: 55, fontSize: 16, color: pack.colors.muted}}>{props.disclaimer}</div>
  </Backdrop>;
};
