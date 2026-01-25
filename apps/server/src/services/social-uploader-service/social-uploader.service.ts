import prisma from "@osc/prisma";
import linkedInOAuthService from "./linkedin-oauth.service";
import linkedInAPIService from "./linkedin-api.service";
import type { CreatePostData, PostResult } from "./social-provider.interface";

export class SocialUploaderService {
  async isLinkedInConnected(): Promise<boolean> {
    try {
      return await linkedInOAuthService.validateToken();
    } catch (error) {
      return false;
    }
  }

  async getConnectionStatus(): Promise<{
    connected: boolean;
    organizationName?: string;
    organizationId?: string;
    expiresAt?: Date;
  }> {
    try {
      const token = await prisma.linkedInOAuthToken.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!token) {
        return { connected: false };
      }

      const isValid = new Date(token.expiresAt).getTime() > Date.now();

      return {
        connected: isValid,
        organizationName: token.organizationName || undefined,
        organizationId: token.organizationId,
        expiresAt: token.expiresAt,
      };
    } catch (error) {
      return { connected: false };
    }
  }

  async disconnectLinkedIn(): Promise<void> {
    try {
      await prisma.linkedInOAuthToken.deleteMany({});
    } catch (error: any) {
      console.error("Error disconnecting LinkedIn:", error.message);
      throw new Error("Failed to disconnect LinkedIn");
    }
  }

  async createDraftPost(data: {
    name: string;
    caption: string;
    imageUrl?: string;
    eventId: string;
    createdBy: string;
    postScheduleDate: Date;
  }): Promise<any> {
    try {
      const token = await prisma.linkedInOAuthToken.findFirst({
        orderBy: { createdAt: "desc" },
      });

      const post = await prisma.eventPost.create({
        data: {
          name: data.name,
          platform: "LINKEDIN",
          externalRef: "",
          postScheduleDate: data.postScheduleDate,
          eventId: data.eventId,
          createdBy: data.createdBy,
          status: "DRAFT",
          caption: data.caption,
          imageUrl: data.imageUrl,
          organizationId: token?.organizationId,
        },
        include: {
          event: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return post;
    } catch (error: any) {
      console.error("Error creating draft post:", error.message);
      throw new Error("Failed to create draft post");
    }
  }

  async approvePost(postId: string, approvedBy: string): Promise<any> {
    try {
      const post = await prisma.eventPost.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status !== "DRAFT" && post.status !== "PENDING_APPROVAL") {
        throw new Error(`Cannot approve post with status: ${post.status}`);
      }

      const updatedPost = await prisma.eventPost.update({
        where: { id: postId },
        data: {
          status: "APPROVED",
          approvedBy,
          approvedAt: new Date(),
        },
        include: {
          event: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedPost;
    } catch (error: any) {
      console.error("Error approving post:", error.message);
      throw error;
    }
  }

  async rejectPost(postId: string, rejectionReason: string): Promise<any> {
    try {
      const post = await prisma.eventPost.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const updatedPost = await prisma.eventPost.update({
        where: { id: postId },
        data: {
          status: "REJECTED",
          rejectionReason,
        },
        include: {
          event: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedPost;
    } catch (error: any) {
      console.error("Error rejecting post:", error.message);
      throw error;
    }
  }

  async schedulePostOnLinkedIn(postId: string): Promise<PostResult> {
    try {
      const post = await prisma.eventPost.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status !== "APPROVED") {
        throw new Error("Post must be approved before scheduling");
      }

      if (!post.caption) {
        throw new Error("Post must have a caption");
      }

      if (!post.organizationId) {
        throw new Error(
          "Organization ID not found. Please reconnect LinkedIn.",
        );
      }

      const isConnected = await this.isLinkedInConnected();
      if (!isConnected) {
        throw new Error(
          "LinkedIn is not connected. Please authenticate first.",
        );
      }

      const postData: CreatePostData = {
        caption: post.caption,
        imageUrl: post.imageUrl || undefined,
        organizationId: post.organizationId,
        visibility: "PUBLIC",
      };

      const now = new Date();
      const scheduledTime = new Date(post.postScheduleDate);

      let result: PostResult;

      if (scheduledTime > now) {
        result = await linkedInAPIService.schedulePost(postData, scheduledTime);

        await prisma.eventPost.update({
          where: { id: postId },
          data: {
            status: "SCHEDULED",
            linkedInPostId: result.postId,
          },
        });
      } else {
        result = await linkedInAPIService.createPost(postData);

        await prisma.eventPost.update({
          where: { id: postId },
          data: {
            status: result.status === "PUBLISHED" ? "PUBLISHED" : "FAILED",
            linkedInPostId: result.postId,
            externalRef: result.platformUrl || "",
          },
        });
      }

      return result;
    } catch (error: any) {
      console.error("Error scheduling post on LinkedIn:", error.message);

      await prisma.eventPost.update({
        where: { id: postId },
        data: {
          status: "FAILED",
        },
      });

      throw error;
    }
  }

  async publishScheduledPost(postId: string): Promise<PostResult> {
    try {
      const post = await prisma.eventPost.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status !== "SCHEDULED") {
        throw new Error("Post is not scheduled");
      }

      if (!post.caption || !post.organizationId) {
        throw new Error("Invalid post data");
      }

      const postData: CreatePostData = {
        caption: post.caption,
        imageUrl: post.imageUrl || undefined,
        organizationId: post.organizationId,
        visibility: "PUBLIC",
      };

      const result = await linkedInAPIService.createPost(postData);

      await prisma.eventPost.update({
        where: { id: postId },
        data: {
          status: result.status === "PUBLISHED" ? "PUBLISHED" : "FAILED",
          linkedInPostId: result.postId,
          externalRef: result.platformUrl || "",
        },
      });

      return result;
    } catch (error: any) {
      console.error("Error publishing scheduled post:", error.message);

      await prisma.eventPost.update({
        where: { id: postId },
        data: {
          status: "FAILED",
        },
      });

      throw error;
    }
  }

  async getPostStatus(postId: string): Promise<any> {
    try {
      const post = await prisma.eventPost.findUnique({
        where: { id: postId },
        include: {
          event: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status === "PUBLISHED" && post.linkedInPostId) {
        try {
          const linkedInStatus = await linkedInAPIService.getPostStatus(
            post.linkedInPostId,
          );
          return {
            ...post,
            linkedInAnalytics: linkedInStatus.engagement,
          };
        } catch (error) {
          return post;
        }
      }

      return post;
    } catch (error: any) {
      console.error("Error getting post status:", error.message);
      throw error;
    }
  }
}

export default new SocialUploaderService();
