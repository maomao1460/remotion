export const CONTENT_TYPES = ['news', 'product', 'activity', 'education'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const STYLE_IDS = ['data-pulse', 'product-trust', 'activity-calendar', 'finance-education'] as const;
export type StyleId = (typeof STYLE_IDS)[number];

export type StylePack = {
  id: StyleId;
  label: string;
  description: string;
  contentTypes: readonly ContentType[];
  colors: {
    background: string;
    panel: string;
    ink: string;
    muted: string;
    accent: string;
    accentAlt: string;
    cardFills: readonly [string, string, string];
  };
  motion: {
    pace: 'fast' | 'calm' | 'lively';
    entranceFrames: number;
  };
  motif: 'metric' | 'product-card' | 'calendar' | 'spectrum';
  defaultCta: string;
};
