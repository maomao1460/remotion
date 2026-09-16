import type {ContentType, StyleId, StylePack} from './style-types';

export const DEFAULT_STYLE_BY_CONTENT_TYPE: Record<ContentType, StyleId> = {
  news: 'data-pulse',
  product: 'product-trust',
  activity: 'activity-calendar',
  education: 'finance-education',
};

export const STYLE_REGISTRY: Record<StyleId, StylePack> = {
  'data-pulse': {
    id: 'data-pulse',
    label: '数据脉冲',
    description: '用于一个周期内的核心新闻解读，强调数据、节奏和市场影响。',
    contentTypes: ['news'],
    colors: {background: '#0B1322', panel: '#111D31', ink: '#EDF4FF', muted: '#8290A9', accent: '#C9FF4A', accentAlt: '#55D6FF', cardFills: ['#1A2B45', '#162B3F', '#26204A']},
    motion: {pace: 'fast', entranceFrames: 16},
    motif: 'metric',
    defaultCta: '关注后续影响',
  },
  'product-trust': {
    id: 'product-trust',
    label: '信赖产品橱窗',
    description: '用于银行产品与服务介绍，强调清晰、可信和易理解。',
    contentTypes: ['product'],
    colors: {background: '#F4F8FC', panel: '#FFFFFF', ink: '#15283C', muted: '#61758A', accent: '#1F6FB2', accentAlt: '#D3A64B', cardFills: ['#E7F3FA', '#E7F4EF', '#FCF3DF']},
    motion: {pace: 'calm', entranceFrames: 22},
    motif: 'product-card',
    defaultCta: '了解服务详情',
  },
  'activity-calendar': {
    id: 'activity-calendar',
    label: '金融生活日历',
    description: '用于活动推荐，强调时间、亮点和参与方式。',
    contentTypes: ['activity'],
    colors: {background: '#FFF9F1', panel: '#FFFFFF', ink: '#17324D', muted: '#6B7B8C', accent: '#F06C5C', accentAlt: '#FFC94D', cardFills: ['#E4F2FF', '#FFF0D0', '#FFE2DB']},
    motion: {pace: 'lively', entranceFrames: 17},
    motif: 'calendar',
    defaultCta: '查看活动说明',
  },
  'finance-education': {
    id: 'finance-education',
    label: '一图懂金融',
    description: '用于投资者教育，强调图解、理解与风险提示。',
    contentTypes: ['education'],
    colors: {background: '#F8FBFE', panel: '#FFFFFF', ink: '#17324D', muted: '#6C8296', accent: '#38A79A', accentAlt: '#E2AE45', cardFills: ['#E5F6F1', '#EAF3FB', '#FFF3DD']},
    motion: {pace: 'calm', entranceFrames: 20},
    motif: 'spectrum',
    defaultCta: '了解后再选择',
  },
};

export const resolveStyle = (contentType: ContentType, styleId?: StyleId): StylePack => {
  return STYLE_REGISTRY[styleId ?? DEFAULT_STYLE_BY_CONTENT_TYPE[contentType]];
};

export const isManualStyleOverride = (contentType: ContentType, styleId?: StyleId): boolean => {
  return Boolean(styleId && styleId !== DEFAULT_STYLE_BY_CONTENT_TYPE[contentType]);
};
