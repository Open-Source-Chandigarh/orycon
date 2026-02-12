import axios from "axios";
import type {
  CreatePostData,
  PostResult,
  PostStatus,
} from "./social-provider.interface";
import linkedInOAuthService from "./linkedin-oauth.service";

export class LinkedInAPIService {
  // LinkedIn API endpoints
  private readonly UGC_POSTS_URL = "https://api.linkedin.com/v2/ugcPosts";
  private readonly ASSETS_URL =
    "https://api.linkedin.com/v2/assets?action=registerUpload";
  private readonly SHARES_URL = "https://api.linkedin.com/v2/shares";

  // Create and publish a post on LinkedIn
  async createPost(postData: CreatePostData): Promise<PostResult> {
    try {
      const accessToken = await linkedInOAuthService.getValidAccessToken();

      let mediaUrn: string | undefined;

      if (postData.imageUrl) {
        mediaUrn = await this.uploadImage(
          postData.imageUrl,
          postData.organizationId,
          accessToken,
          postData.personId,
        );
      }

      const postPayload = this.buildPostPayload(postData, mediaUrn);

      const response = await axios.post(this.UGC_POSTS_URL, postPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      const postId = response.data.id;

      return {
        postId,
        status: "PUBLISHED",
        publishedAt: new Date(),
        platformUrl: `https://www.linkedin.com/feed/update/${postId}`,
      };
    } catch (error: any) {
      console.error(
        "LinkedIn post creation error:",
        error.response?.data || error.message,
      );
      return {
        postId: "",
        status: "FAILED",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Schedule a post for future publishing
  async schedulePost(
    postData: CreatePostData,
    scheduledTime: Date,
  ): Promise<PostResult> {
    try {
      return {
        postId: `scheduled_${Date.now()}`,
        status: "SCHEDULED",
        scheduledFor: scheduledTime,
      };
    } catch (error: any) {
      console.error("LinkedIn post scheduling error:", error.message);
      return {
        postId: "",
        status: "FAILED",
        error: error.message,
      };
    }
  }

  // Get post status and analytics
  async getPostStatus(postId: string): Promise<PostStatus> {
    try {
      const accessToken = await linkedInOAuthService.getValidAccessToken();

      const response = await axios.get(`${this.UGC_POSTS_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      return {
        postId,
        status: "PUBLISHED",
        publishedAt: new Date(response.data.created?.time || Date.now()),
        engagement: {
          likes: response.data.numLikes || 0,
          comments: response.data.numComments || 0,
          shares: response.data.numShares || 0,
        },
      };
    } catch (error: any) {
      console.error(
        "Error fetching post status:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to fetch post status");
    }
  }

  // Upload image to LinkedIn (supports both personal profile and organization uploads)
  private async uploadImage(
    imageUrl: string,
    organizationId: string,
    accessToken: string,
    personId?: string,
  ): Promise<string> {
    try {
      const isPersonalProfile =
        organizationId === "personal" ||
        !organizationId ||
        (!organizationId.includes("-") && !/^\d+$/.test(organizationId));

      const owner = isPersonalProfile
        ? `urn:li:person:${personId || organizationId}`
        : `urn:li:organization:${organizationId}`;

      const registerPayload = {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      };

      const registerResponse = await axios.post(
        this.ASSETS_URL,
        registerPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      );

      const uploadUrl =
        registerResponse.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const asset = registerResponse.data.value.asset;

      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(imageResponse.data);

      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/octet-stream",
        },
      });

      return asset;
    } catch (error: any) {
      console.error(
        "Image upload error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to upload image to LinkedIn");
    }
  }

  // Build post payload for LinkedIn API (supports both personal profile and organization posting)
  private buildPostPayload(postData: CreatePostData, mediaUrn?: string): any {
    const isPersonalProfile =
      postData.organizationId === "personal" ||
      !postData.organizationId ||
      (!postData.organizationId.includes("-") &&
        !/^\d+$/.test(postData.organizationId));

    const author = isPersonalProfile
      ? `urn:li:person:${postData.personId || postData.organizationId}`
      : `urn:li:organization:${postData.organizationId}`;

    const payload: any = {
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postData.caption,
          },
          shareMediaCategory: mediaUrn ? "IMAGE" : "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility":
          postData.visibility || "PUBLIC",
      },
    };

    if (mediaUrn) {
      payload.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: {
            text: postData.caption,
          },
          media: mediaUrn,
          title: {
            text: "Post Image",
          },
        },
      ];
    }

    return payload;
  }

  // Publish a scheduled post (to be called by cron job)
  async publishScheduledPost(postData: CreatePostData): Promise<PostResult> {
    return this.createPost(postData);
  }
}

export default new LinkedInAPIService();
