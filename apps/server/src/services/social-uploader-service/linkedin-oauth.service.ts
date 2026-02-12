import axios from "axios";
import prisma from "@osc/prisma";
import type {
  SocialProviderInterface,
  AuthenticationResult,
  CreatePostData,
  PostResult,
  PostStatus,
} from "./social-provider.interface";

export class LinkedInOAuthService implements SocialProviderInterface {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scope: string;

  // LinkedIn OAuth endpoints
  private readonly AUTHORIZATION_URL =
    "https://www.linkedin.com/oauth/v2/authorization";
  private readonly TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
  private readonly ORGANIZATION_URL =
    "https://api.linkedin.com/v2/organizationAcls";

  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID || "";
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET || "";
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI || "";
    this.scope =
      process.env.LINKEDIN_SCOPE ||
      "r_organization_social,w_organization_social,r_liteprofile";
  }

  // Check if LinkedIn OAuth credentials are configured
  private checkCredentials(): void {
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error(
        "LinkedIn OAuth credentials are not configured. Please set LINKEDIN_CLIENT_ID, efknekjfnjnwjknjefw, and LINKEDIN_REDIRECT_URI in your .env file.",
      );
    }
  }

  // Generate OAuth authorization URL
  getAuthorizationUrl(state?: string): string {
    this.checkCredentials();

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      ...(state && { state }),
    });

    return `${this.AUTHORIZATION_URL}?${params.toString()}`;
  }

  // Authenticate with LinkedIn using authorization code
  async authenticate(authorizationCode: string): Promise<AuthenticationResult> {
    this.checkCredentials();

    try {
      const tokenResponse = await axios.post(
        this.TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token, refresh_token, expires_in, token_type, scope } =
        tokenResponse.data;

      let organizationInfo = {
        organizationId: "personal",
        organizationName: "Personal Profile",
      };

      const currentScope = scope || this.scope;
      const hasOrgScope = currentScope.includes("organization");

      if (hasOrgScope) {
        try {
          organizationInfo = await this.getOrganizationInfo(access_token);
        } catch (orgError: any) {
          console.warn(
            "Could not fetch organization info, using personal profile mode:",
            orgError.message,
          );
        }
      } else {
        try {
          const userInfo = await this.getUserInfo(access_token);
          organizationInfo = {
            organizationId: userInfo.userId,
            organizationName: userInfo.userName || "Personal Profile",
          };
        } catch (userError: any) {
          console.warn(
            "Could not fetch user info, using default personal profile:",
            userError.message,
          );
        }
      }

      const expiresAt = new Date(Date.now() + expires_in * 1000);
      await this.storeTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        tokenType: token_type,
        scope: currentScope,
        organizationId: organizationInfo.organizationId,
        organizationName: organizationInfo.organizationName,
      });

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        tokenType: token_type,
        scope: currentScope,
        organizationId: organizationInfo.organizationId,
        organizationName: organizationInfo.organizationName,
      };
    } catch (error: any) {
      console.error(
        "LinkedIn authentication error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `LinkedIn authentication failed: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  // Get user information from LinkedIn (for personal profile mode)
  private async getUserInfo(accessToken: string): Promise<{
    userId: string;
    userName?: string;
  }> {
    try {
      const userinfoResponse = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const userId = userinfoResponse.data.sub;
      const userName =
        userinfoResponse.data.name ||
        userinfoResponse.data.given_name ||
        "Personal Profile";

      console.log("LinkedIn user info fetched from /v2/userinfo:", {
        userId,
        userName,
      });

      if (userId) {
        return { userId, userName };
      }
    } catch (error: any) {
      console.warn(
        "Error fetching from /v2/userinfo, trying /v2/me:",
        error.response?.data?.message || error.message,
      );
    }

    try {
      const meResponse = await axios.get("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      const userId = meResponse.data.id;
      const firstName = meResponse.data.localizedFirstName || "";
      const lastName = meResponse.data.localizedLastName || "";
      const userName = `${firstName} ${lastName}`.trim() || "Personal Profile";

      console.log("LinkedIn user info fetched from /v2/me:", {
        userId,
        userName,
      });

      return {
        userId: userId || "personal",
        userName,
      };
    } catch (error: any) {
      console.warn(
        "Error fetching user info from /v2/me:",
        error.response?.data || error.message,
      );
      return {
        userId: "personal",
        userName: "Personal Profile",
      };
    }
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string): Promise<AuthenticationResult> {
    this.checkCredentials();

    try {
      const tokenResponse = await axios.post(
        this.TOKEN_URL,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const {
        access_token,
        refresh_token: new_refresh_token,
        expires_in,
        token_type,
        scope,
      } = tokenResponse.data;

      const expiresAt = new Date(Date.now() + expires_in * 1000);
      await this.updateTokens({
        accessToken: access_token,
        refreshToken: new_refresh_token || refreshToken,
        expiresAt,
        tokenType: token_type,
        scope: scope || this.scope,
      });

      return {
        accessToken: access_token,
        refreshToken: new_refresh_token || refreshToken,
        expiresIn: expires_in,
        tokenType: token_type,
        scope: scope || this.scope,
      };
    } catch (error: any) {
      console.error(
        "LinkedIn token refresh error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Token refresh failed: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  // Get organization information from LinkedIn
  private async getOrganizationInfo(accessToken: string): Promise<{
    organizationId: string;
    organizationName: string;
  }> {
    try {
      const response = await axios.get(this.ORGANIZATION_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        params: {
          q: "roleAssignee",
          role: "ADMINISTRATOR",
          projection: "(elements*(organization~(localizedName,id)))",
        },
      });

      const organizations = response.data.elements;
      if (!organizations || organizations.length === 0) {
        throw new Error("No organizations found for this account");
      }

      const org = organizations[0]["organization~"];
      return {
        organizationId: org.id,
        organizationName: org.localizedName,
      };
    } catch (error: any) {
      console.error(
        "Error fetching organization info:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to fetch organization information");
    }
  }

  // Store OAuth tokens in database
  private async storeTokens(data: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    tokenType: string;
    scope: string;
    organizationId: string;
    organizationName?: string;
  }): Promise<void> {
    try {
      await prisma.linkedInOAuthToken.deleteMany({
        where: { organizationId: data.organizationId },
      });

      await prisma.linkedInOAuthToken.create({
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
          organizationId: data.organizationId,
          organizationName: data.organizationName,
        },
      });
    } catch (error: any) {
      console.error("Error storing tokens:", error.message);
      throw new Error("Failed to store OAuth tokens");
    }
  }

  // Update existing OAuth tokens in database
  private async updateTokens(data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    tokenType: string;
    scope: string;
  }): Promise<void> {
    try {
      const existingToken = await prisma.linkedInOAuthToken.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!existingToken) {
        throw new Error("No existing token found to update");
      }

      await prisma.linkedInOAuthToken.update({
        where: { id: existingToken.id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
        },
      });
    } catch (error: any) {
      console.error("Error updating tokens:", error.message);
      throw new Error("Failed to update OAuth tokens");
    }
  }

  // Get valid access token (refresh if expired)
  async getValidAccessToken(): Promise<string> {
    try {
      const token = await prisma.linkedInOAuthToken.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!token) {
        throw new Error(
          "No LinkedIn connection found. Please authenticate first.",
        );
      }

      const expiryBuffer = 5 * 60 * 1000;
      const isExpired =
        new Date(token.expiresAt).getTime() - Date.now() < expiryBuffer;

      if (isExpired && token.refreshToken) {
        const refreshed = await this.refreshToken(token.refreshToken);
        return refreshed.accessToken;
      }

      return token.accessToken;
    } catch (error: any) {
      console.error("Error getting valid access token:", error.message);
      throw error;
    }
  }

  // Validate if token is still valid
  async validateToken(): Promise<boolean> {
    try {
      const token = await prisma.linkedInOAuthToken.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!token) {
        return false;
      }

      return new Date(token.expiresAt).getTime() > Date.now();
    } catch (error) {
      return false;
    }
  }

  // Placeholder methods (will be implemented in LinkedIn API service)
  async createPost(postData: CreatePostData): Promise<PostResult> {
    throw new Error("Use LinkedInAPIService for creating posts");
  }

  async schedulePost(
    postData: CreatePostData,
    scheduledTime: Date,
  ): Promise<PostResult> {
    throw new Error("Use LinkedInAPIService for scheduling posts");
  }

  async getPostStatus(postId: string): Promise<PostStatus> {
    throw new Error("Use LinkedInAPIService for getting post status");
  }
}

export default new LinkedInOAuthService();
