export interface SocialProviderInterface {
  authenticate(authorizationCode: string): Promise<AuthenticationResult>;
  refreshToken(refreshToken: string): Promise<AuthenticationResult>;
  createPost(postData: CreatePostData): Promise<PostResult>;
  schedulePost(
    postData: CreatePostData,
    scheduledTime: Date,
  ): Promise<PostResult>;
  getPostStatus(postId: string): Promise<PostStatus>;
  getAuthorizationUrl(state?: string): string;
  validateToken(): Promise<boolean>;
}

export interface AuthenticationResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
  organizationId?: string;
  organizationName?: string;
}

export interface CreatePostData {
  caption: string;
  imageUrl?: string;
  organizationId: string;
  personId?: string;
  visibility?: "PUBLIC" | "CONNECTIONS" | "LOGGED_IN";
}

export interface PostResult {
  postId: string;
  status: "PUBLISHED" | "SCHEDULED" | "FAILED";
  publishedAt?: Date;
  scheduledFor?: Date;
  platformUrl?: string;
  error?: string;
}

export interface PostStatus {
  postId: string;
  status: "PUBLISHED" | "SCHEDULED" | "FAILED" | "DELETED";
  publishedAt?: Date;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    impressions?: number;
  };
}
