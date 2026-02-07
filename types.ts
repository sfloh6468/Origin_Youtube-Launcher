
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

export type Category = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Horror' | 'Documentary' | 'Animation';

export const CATEGORIES: Category[] = [
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Horror',
  'Documentary',
  'Animation'
];

export type FocusSection = 'sidebar' | 'hero' | 'shelves' | 'modal';
