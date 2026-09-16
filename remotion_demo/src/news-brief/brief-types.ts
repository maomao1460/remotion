import {z} from 'zod';

const sourceSchema = z.object({
  id: z.string().min(1).max(32),
  outlet: z.string().min(1).max(48),
  url: z.url(),
});

const numericClaimSchema = z.object({
  id: z.string().min(1).max(32),
  label: z.string().min(1).max(32),
  displayedValue: z.string().min(1).max(32),
  sourceValues: z.array(z.object({sourceId: z.string().min(1), value: z.string().min(1).max(64)})).min(2).max(4),
  adoptedSourceId: z.string().min(1),
  resolution: z.enum(['consistent', 'official-source-selected', 'latest-source-selected', 'manual-review']),
  resolutionNote: z.string().min(1).max(160),
});

const perspectiveSchema = z.object({
  label: z.string().min(1).max(12),
  text: z.string().min(1).max(42),
  // 观点必须回到内容包中的公开来源，避免把编辑判断伪装成外部观点。
  sourceId: z.string().min(1).max(32),
  attribution: z.string().min(1).max(56),
  sourceType: z.enum(['媒体评论', '机构观点', '政策方观点']),
});

const topicSchema = z.object({
  id: z.string().min(1).max(32),
  eyebrow: z.string().min(1).max(32),
  title: z.string().min(1).max(32),
  summary: z.string().min(1).max(58),
  metric: z.object({label: z.string().min(1).max(18), value: z.string().min(1).max(16), unit: z.string().max(12)}),
  chart: z.array(z.object({label: z.string().min(1).max(10), value: z.number().min(0), display: z.string().min(1).max(16)})).min(2).max(3),
  positive: perspectiveSchema,
  caution: perspectiveSchema,
  neutral: perspectiveSchema,
});

export const NewsBriefSchema = z.object({
  contentType: z.literal('news'),
  styleId: z.literal('data-pulse'),
  eyebrow: z.string().min(1).max(32),
  title: z.string().min(1).max(32),
  subtitle: z.string().min(1).max(60),
  topics: z.array(topicSchema).length(4),
  captions: z.array(z.object({
    text: z.string().min(1).max(48),
    voiceoverFile: z.string().min(1),
    startMs: z.number().min(0),
    endMs: z.number().positive(),
    timestampMs: z.number().nullable().default(null),
    confidence: z.number().nullable().default(null),
    pageBreakAfter: z.boolean().optional(),
  })).min(6).max(24),
  review: z.object({
    verification: z.literal('cross-checked'),
    approvalStatus: z.literal('approved'),
    sources: z.array(sourceSchema).min(8).max(20),
    numericClaims: z.array(numericClaimSchema).min(6).max(12),
  }),
  media: z.object({
    backgroundMusic: z.object({file: z.string().min(1), volume: z.number().min(0).max(1)}),
    voiceovers: z.array(z.object({
      file: z.string().min(1),
      text: z.string().min(1).max(180),
      fromSeconds: z.number().min(0),
      durationSeconds: z.number().positive(),
    })).length(6),
  }),
  disclaimer: z.string().min(8).max(80),
  render: z.object({width: z.literal(1920), height: z.literal(1080), fps: z.literal(30), expectedDurationSeconds: z.literal(60)}),
});

export type NewsBriefProps = z.infer<typeof NewsBriefSchema>;
export type NewsBriefTopic = NewsBriefProps['topics'][number];
