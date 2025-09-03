
export enum AppStep {
  UPLOAD = 'UPLOAD',
  SELECT_COSTUME = 'SELECT_COSTUME',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}

export enum CostumeCategory {
  ANIME = 'Anime',
  GAMING = 'Gaming',
  MOVIES = 'Movies',
  FANTASY = 'Fantasy',
  CUSTOM = 'Custom',
}

export interface Costume {
  id: string;
  name: string;
  category: CostumeCategory;
  thumbnailUrl: string;
}

export interface Transformation {
  id: string;
  originalImage: string;
  resultImage: string;
  costume: Costume;
  createdAt: Date;
}