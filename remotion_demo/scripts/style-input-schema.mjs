import {z} from 'zod';

export const contentTypes = ['news', 'product', 'activity', 'education'];
export const styleIds = ['data-pulse', 'product-trust', 'activity-calendar', 'finance-education'];

export const defaultStyleByContentType = {
  news: 'data-pulse',
  product: 'product-trust',
  activity: 'activity-calendar',
  education: 'finance-education',
};

export const styleInputSchema = z.object({
  contentType: z.enum(contentTypes),
  styleId: z.enum(styleIds).optional(),
  allowManualStyleOverride: z.boolean().default(false),
  eyebrow: z.string().min(1).max(32),
  title: z.string().min(1).max(28),
  subtitle: z.string().min(1).max(52),
  heroValue: z.string().max(16).optional(),
  heroUnit: z.string().max(12).optional(),
  cards: z.array(z.object({
    label: z.string().min(1).max(14),
    text: z.string().min(1).max(28),
  })).min(2).max(3),
  cta: z.string().min(1).max(20).optional(),
  disclaimer: z.string().min(8).max(80),
  review: z.object({
    verification: z.enum(['cross-checked', 'single-source', 'user-provided', 'pending-review']),
    approvalStatus: z.enum(['draft', 'approved']),
    userProvidedNote: z.string().max(120).optional(),
    sources: z.array(z.object({id: z.string().min(1), outlet: z.string().min(1), url: z.url().optional()})).max(8).default([]),
    // 每个会在画面中影响理解或决策的核心数字，都要在这里留下可追溯记录。
    numericClaims: z.array(z.object({
      id: z.string().min(1).max(32),
      label: z.string().min(1).max(32),
      displayedValue: z.string().min(1).max(32),
      sourceValues: z.array(z.object({
        sourceId: z.string().min(1),
        value: z.string().min(1).max(64),
      })).min(1).max(8),
      adoptedSourceId: z.string().min(1),
      resolution: z.enum(['consistent', 'official-source-selected', 'latest-source-selected', 'manual-review']),
      resolutionNote: z.string().min(1).max(160),
    })).max(12).default([]),
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
