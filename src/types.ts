export interface ArticleMetadata {
  title: string;
  metaDescription: string;
  urlSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  readingTime: string;
  type: string;
  day: number;
}

export type PublishStatus = 'Draft' | 'Scheduled' | 'Published';

export interface ImagePrompt {
  featuredImage: string;
  image2Food: string;
  image3Ambiance: string;
  altText: string;
}

export interface OutreachTarget {
  name: string;
  reason: string;
}

export interface Article {
  day: number;
  metadata: ArticleMetadata;
  status: PublishStatus;
  content: string;
  imagePrompts: ImagePrompt;
  internalLinks: string[];
  externalLinks: { anchor: string; url: string }[];
  outreachTargets: OutreachTarget[];
}
