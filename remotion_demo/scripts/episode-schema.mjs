import {z} from 'zod';

const SourceSchema = z.object({
  id: z.string().regex(/^src-[a-z0-9-]+$/),
  outlet: z.string().min(1),
  tier: z.enum(['primary', 'secondary', 'context']),
  retrievedAt: z.string().date(),
  url: z.url().nullable(),
  citation: z.string().min(1),
});

const VoiceSchema = z.object({
  file: z.string().endsWith('.mp3'),
  durationSeconds: z.number().positive(),
  narration: z.string().min(1),
});

const EvidenceSchema = z.object({
  claim: z.string().min(1),
  adoptedValue: z.string().min(1),
  verification: z.enum(['cross-checked', 'single-source', 'legacy-unverified']),
  sourceIds: z.array(z.string().regex(/^src-[a-z0-9-]+$/)).min(1),
});

const ChartSchema = z.object({
  kind: z.enum(['index-bars', 'yield-bars', 'oil-trend', 'optics-bars']),
  unit: z.string().min(1),
  series: z.array(z.object({
    label: z.string().min(1),
    value: z.number(),
  })).min(1),
});

const SectionSchema = z.object({
  id: z.string().regex(/^news-[1-9][0-9]*$/),
  tag: z.string().min(1),
  title: z.string().min(1),
  metric: z.object({
    value: z.string().min(1),
    unit: z.string().min(1),
  }),
  chart: ChartSchema,
  opinions: z.array(z.object({
    source: z.string().min(1),
    tone: z.enum(['bullish', 'neutral', 'bearish']),
    text: z.string().min(1),
  })).min(1),
  evidence: z.array(EvidenceSchema).min(1),
  voice: VoiceSchema,
});

export const EpisodeSchema = z.object({
  schemaVersion: z.literal('1.0'),
  id: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['draft', 'verified', 'legacy-migrated']),
  format: z.object({
    compositionId: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive(),
    transitionSeconds: z.number().min(0),
    expectedDurationSeconds: z.number().positive(),
  }),
  template: z.object({
    id: z.string().min(1),
    voiceProvider: z.string().min(1),
    backgroundMusic: z.string().min(1),
  }),
  cover: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    voice: VoiceSchema,
  }),
  sections: z.array(SectionSchema).min(1),
  ending: z.object({
    headline: z.string().min(1),
    disclaimer: z.string().min(1),
    voice: VoiceSchema,
  }),
  sources: z.array(SourceSchema).min(1),
}).superRefine((episode, ctx) => {
  const sourceIds = new Set();
  const sourcesById = new Map();
  for (const source of episode.sources) {
    if (sourceIds.has(source.id)) {
      ctx.addIssue({code: 'custom', path: ['sources'], message: `重复的来源 ID：${source.id}`});
    }
    sourceIds.add(source.id);
    sourcesById.set(source.id, source);
  }

  for (const [sectionIndex, section] of episode.sections.entries()) {
    for (const [evidenceIndex, evidence] of section.evidence.entries()) {
      for (const sourceId of evidence.sourceIds) {
        if (!sourceIds.has(sourceId)) {
          ctx.addIssue({code: 'custom', path: ['sections', sectionIndex, 'evidence', evidenceIndex, 'sourceIds'], message: `未定义的来源 ID：${sourceId}`});
        }
      }
      if (evidence.verification === 'cross-checked' && evidence.sourceIds.length < 2) {
        ctx.addIssue({code: 'custom', path: ['sections', sectionIndex, 'evidence', evidenceIndex, 'sourceIds'], message: '交叉核验至少需要两个来源。'});
      }
      if (episode.status === 'verified' && evidence.verification === 'legacy-unverified') {
        ctx.addIssue({code: 'custom', path: ['sections', sectionIndex, 'evidence', evidenceIndex, 'verification'], message: '已核验内容包不能保留 legacy-unverified 证据。'});
      }
      if (episode.status === 'verified') {
        for (const sourceId of evidence.sourceIds) {
          if (sourcesById.get(sourceId)?.url === null) {
            ctx.addIssue({code: 'custom', path: ['sections', sectionIndex, 'evidence', evidenceIndex, 'sourceIds'], message: `已核验内容包的引用来源必须有 URL：${sourceId}`});
          }
        }
      }
    }
  }

  const clips = [episode.cover.voice, ...episode.sections.map((section) => section.voice), episode.ending.voice];
  const rawDuration = clips.reduce((total, voice) => total + voice.durationSeconds, 0);
  const renderedDuration = rawDuration - ((clips.length - 1) * episode.format.transitionSeconds);
  if (Math.abs(renderedDuration - episode.format.expectedDurationSeconds) > 0.1) {
    ctx.addIssue({code: 'custom', path: ['format', 'expectedDurationSeconds'], message: `时长不匹配：素材与转场推算为 ${renderedDuration.toFixed(3)} 秒。`});
  }
});
