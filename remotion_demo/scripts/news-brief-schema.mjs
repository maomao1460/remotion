import {z} from 'zod';

const source = z.object({id: z.string().min(1), outlet: z.string().min(1), url: z.url()});
const numericClaim = z.object({
  id: z.string().min(1), label: z.string().min(1), displayedValue: z.string().min(1),
  sourceValues: z.array(z.object({sourceId: z.string().min(1), value: z.string().min(1)})).min(2),
  adoptedSourceId: z.string().min(1),
  resolution: z.enum(['consistent', 'official-source-selected', 'latest-source-selected', 'manual-review']),
  resolutionNote: z.string().min(1),
});
const perspective = z.object({
  label: z.string().min(1), text: z.string().min(1), sourceId: z.string().min(1),
  attribution: z.string().min(1), sourceType: z.enum(['媒体评论', '机构观点', '政策方观点']),
});
const topic = z.object({
  id: z.string().min(1), eyebrow: z.string().min(1).max(32), title: z.string().min(1).max(32), summary: z.string().min(1).max(58),
  metric: z.object({label: z.string().min(1), value: z.string().min(1), unit: z.string()}),
  chart: z.array(z.object({label: z.string().min(1), value: z.number().min(0), display: z.string().min(1)})).min(2).max(3),
  positive: perspective, caution: perspective, neutral: perspective,
});

export const newsBriefInputSchema = z.object({
  contentType: z.literal('news'), styleId: z.literal('data-pulse'), eyebrow: z.string().min(1).max(32), title: z.string().min(1).max(32), subtitle: z.string().min(1).max(60),
  topics: z.array(topic).length(4),
  captions: z.array(z.object({text: z.string().min(1).max(48), voiceoverFile: z.string().min(1), startMs: z.number().min(0), endMs: z.number().positive(), timestampMs: z.number().nullable(), confidence: z.number().nullable(), pageBreakAfter: z.boolean().optional()})).min(6).max(24),
  review: z.object({verification: z.literal('cross-checked'), approvalStatus: z.literal('approved'), sources: z.array(source).min(8).max(20), numericClaims: z.array(numericClaim).min(6).max(12)}),
  media: z.object({backgroundMusic: z.object({file: z.string().min(1), volume: z.number().min(0).max(1)}), voiceovers: z.array(z.object({file: z.string().min(1), text: z.string().min(1).max(180), fromSeconds: z.number().min(0), durationSeconds: z.number().positive()})).length(6)}),
  disclaimer: z.string().min(8).max(80), render: z.object({width: z.literal(1920), height: z.literal(1080), fps: z.literal(30), expectedDurationSeconds: z.literal(60)}),
});
