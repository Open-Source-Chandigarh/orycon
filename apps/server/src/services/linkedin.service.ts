import axios from "axios";
import type { LinkedInAccount } from "../utils/types";

const LINKEDIN_AUTH_URL =
  "https://www.linkedin.com/oauth/v2/authorization";

const LINKEDIN_TOKEN_URL =
  "https://www.linkedin.com/oauth/v2/accessToken";

const LINKEDIN_PROFILE_URL =
  "https://api.linkedin.com/v2/me";

const LINKEDIN_SCOPES = [
  "r_liteprofile",
  "r_emailaddress",
  "w_member_social",
];

export class LinkedInService {

  /**
   * Generates LinkedIn OAuth authorization URL
   */
  static getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? "",
      scope: LINKEDIN_SCOPES.join(" "),
    });

    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Handles OAuth callback and exchanges code for tokens
   * Also fetches LinkedIn profile ID
   */
  static async handleOAuthCallback(
    code: string,
    userId: string
  ): Promise<LinkedInAccount> {

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

    const profileResponse = await axios.get(
      LINKEDIN_PROFILE_URL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  }

  /**
   * Fetch engagement metrics for a single post
   */
  static async fetchPostMetrics(
    accessToken: string,
    postUrn: string
  ) {
    const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
}
