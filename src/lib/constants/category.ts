export const CATEGORIES = {
  free: { label: '자유게시판', slug: 'free', color: '#818384' },
  question: { label: '질문', slug: 'question', color: '#818384' },
  info: { label: '정보공유', slug: 'info', color: '#818384' },
  humor: { label: '유머', slug: 'humor', color: '#818384' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, value]) => ({
  key: key as CategoryKey,
  ...value,
}));

export const DEFAULT_CATEGORY: CategoryKey = 'free';

export function isValidCategory(category: string): category is CategoryKey {
  return category in CATEGORIES;
}
