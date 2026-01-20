export type LinkedInPostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'ARTICLE';

export interface LinkedInPost {
  id: string;

  // Relation to LinkedInAccount
  linkedinAccountId: string;

  // LinkedIn post URN
  postUrn: string;

  postType: LinkedInPostType;

  createdAt: Date;

  // Engagement metrics
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
}
