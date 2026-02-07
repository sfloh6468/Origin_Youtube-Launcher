
export interface Movie {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  description: string;
  category: string;
  rating?: string;
  year?: string;
}

export const DEFAULT_CATEGORIES = [
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Horror',
  'Documentary',
  'Animation',
  'Sports',
  'News'
] as const;

export type FocusSection = 'sidebar' | 'hero' | 'shelves' | 'modal' | 'player';
