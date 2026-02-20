import axios from "axios";
import type { LinkedInAccount, LinkedInPostMetrics } from "../utils/types";

const LINKEDIN_AUTH_URL =
  "https://www.linkedin.com/oauth/v2/authorization";

const LINKEDIN_TOKEN_URL =
  "https://www.linkedin.com/oauth/v2/accessToken";

const LINKEDIN_PROFILE_URL =
  "https://api.linkedin.com/v2/userinfo";

const LINKEDIN_POSTS_URL =
  "https://api.linkedin.com/v2/ugcPosts";

const LINKEDIN_SCOPES = [
  "openid",
  "profile",
  "email"
];


type PostMetrics = {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
};

export class LinkedInService {

  // Generate OAuth URL
  static getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? "",
      scope: LINKEDIN_SCOPES.join(" "),
    });

    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  }

  // Handle OAuth callback
  static async handleOAuthCallback(
    code: string,
    userId: string
  ): Promise<LinkedInAccount> {
    try {
      const tokenResponse = await axios.post(
        LINKEDIN_TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? "",
          client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
          client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
      const expiresIn = tokenResponse.data.expires_in;

      // Fetch LinkedIn profile ID
      const profileResponse = await axios.get(
  LINKEDIN_PROFILE_URL,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202601", 
    },
  }
);
    
        const linkedinUserId = profileResponse.data.id;
        return {
        id: "",
        userId,
        linkedinUserId,
        accessToken,
        refreshToken,
        expiresAt: expiresIn
          ? new Date(Date.now() + expiresIn * 1000)
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

    } catch (error: any) {
      console.error("LinkedIn OAuth Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Fetch all user posts
  static async fetchUserPosts(
    accessToken: string,
    linkedinUserId: string
  ): Promise<LinkedInPostMetrics[]> {

    try {
      const postsResponse = await axios.get(
        `${LINKEDIN_POSTS_URL}?q=authors&authors=List(urn:li:person:${linkedinUserId})`,
        {
           headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202601",
          },
        }
      );

      const posts = postsResponse.data.elements || [];

      const enrichedPosts: LinkedInPostMetrics[] = [];

      for (const post of posts) {

        const postId = post.id as string;

        const metrics = await this.fetchPostMetrics(
          accessToken,
          postId
        );

        enrichedPosts.push({
          postUrn: postId,
          likesCount: metrics.likesCount,
          commentsCount: metrics.commentsCount,
          sharesCount: metrics.sharesCount,
          viewsCount: metrics.viewsCount,
        });
      }

      return enrichedPosts;

    } catch (error: any) {
      console.error("Fetch Posts Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Fetch metrics for single post
  static async fetchPostMetrics(
    accessToken: string,
    postUrn: string
  ): Promise<PostMetrics> {

    const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}`;

    const response = await axios.get(url, {
      headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202601", 
    },
    });

    const data = response.data;

    return {
      likesCount: data.likesSummary?.totalCount ?? 0,
      commentsCount: data.commentsSummary?.totalCount ?? 0,
      sharesCount: data.sharesSummary?.totalCount ?? 0,
      viewsCount: undefined,
    };
  }

  // Calculate engagement rate
  static calculateEngagementRate(
    likes: number,
    comments: number,
    shares: number,
    views?: number
  ): number {
    if (!views || views === 0) return 0;
    return (likes + comments + shares) / views;
  }

  // Build analytics overview
  static buildAnalyticsOverview(posts: LinkedInPostMetrics[]) {

    const totalPosts = posts.length;

    const totals = posts.reduce(
      (acc, post) => {
        acc.likes += post.likesCount;
        acc.comments += post.commentsCount;
        acc.shares += post.sharesCount;
        acc.views += post.viewsCount ?? 0;
        return acc;
      },
      { likes: 0, comments: 0, shares: 0, views: 0 }
    );

    const averageEngagementRate =
      totals.views === 0
        ? 0
        : (totals.likes + totals.comments + totals.shares) / totals.views;

    return {
      totalPosts,
      totalLikes: totals.likes,
      totalComments: totals.comments,
      totalShares: totals.shares,
      totalViews: totals.views,
      averageEngagementRate,
    };
  }

  // Get top performing post
  static getTopPerformingPost(
    posts: LinkedInPostMetrics[]
  ): LinkedInPostMetrics | null {

    if (!posts.length) return null;

    return posts.reduce((best, current) => {
      const currentScore =
        current.likesCount +
        current.commentsCount +
        current.sharesCount;

      const bestScore =
        best.likesCount +
        best.commentsCount +
        best.sharesCount;

      return currentScore > bestScore ? current : best;
    });
  }
}
