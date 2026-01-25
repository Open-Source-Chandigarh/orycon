import prisma from "@osc/prisma";
import type { Request, Response } from "express";
import socialUploaderService from "../services/social-uploader-service/social-uploader.service";
/**
 * The eventPostController controller class which will be working around and executing the main
 * functionalities realted to user functions that are defined below.
 */
class eventPostController {
  // Create draft post for LinkedIn integration
  async createDraftPost(req: Request, res: Response) {
    try {
      const { name, caption, imageUrl, eventId, createdBy, postScheduleDate } =
        req.body;

      if (!name || !caption || !eventId || !createdBy || !postScheduleDate) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: name, caption, eventId, createdBy, postScheduleDate",
        });
      }

      const post = await socialUploaderService.createDraftPost({
        name,
        caption,
        imageUrl,
        eventId,
        createdBy,
        postScheduleDate: new Date(postScheduleDate),
      });

      return res.status(201).json({
        success: true,
        message: "Draft post created successfully",
        data: post,
      });
    } catch (error: any) {
      console.error("Error creating draft post:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async createEventPost(req: Request, res: Response) {
    try {
      const {
        name,
        platform,
        externalRef,
        postScheduleDate,
        eventId,
        createdBy,
        caption,
        imageUrl,
      } = req.body;

      if (!name || !platform || !postScheduleDate || !eventId || !createdBy) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newPost = await prisma.eventPost.create({
        data: {
          name,
          platform,
          externalRef: externalRef || "",
          postScheduleDate: new Date(postScheduleDate),
          eventId,
          createdBy,
          caption,
          imageUrl,
          status: "DRAFT",
        },
      });

      return res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating event post:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllEventPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.eventPost.findMany({
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
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching event posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getEventPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await prisma.eventPost.findUnique({
        where: { id: id as string },
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
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
      if (!post) {
        return res.status(404).json({ message: "Event post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching event post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateEventPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        platform,
        externalRef,
        postScheduleDate,
        caption,
        imageUrl,
      } = req.body;

      const updatedPost = await prisma.eventPost.update({
        where: { id: id as string },
        data: {
          name,
          platform,
          externalRef,
          caption,
          imageUrl,
          postScheduleDate: postScheduleDate
            ? new Date(postScheduleDate)
            : undefined,
          updatedAt: new Date(),
        },
      });
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating event post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteEventPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.eventPost.delete({
        where: { id: id as string },
      });
      res.json({ message: "Event post deleted successfully" });
    } catch (error) {
      console.error("Error deleting event post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Approve post (role-based authorization)
  async approvePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;

      if (!approvedBy) {
        return res.status(400).json({
          success: false,
          message: "approvedBy is required",
        });
      }

      const approver = await prisma.user.findUnique({
        where: { id: approvedBy },
        select: { role: true },
      });

      if (!approver) {
        return res.status(404).json({
          success: false,
          message: "Approver user not found",
        });
      }

      if (!["LEAD", "ADMIN", "SUBHEAD"].includes(approver.role)) {
        return res.status(403).json({
          success: false,
          message: `User with role ${approver.role} is not authorized to approve posts. Required: LEAD, ADMIN, or SUBHEAD.`,
        });
      }

      const post = await socialUploaderService.approvePost(
        id as string,
        approvedBy,
      );

      return res.status(200).json({
        success: true,
        message: "Post approved successfully",
        data: post,
      });
    } catch (error: any) {
      console.error("Error approving post:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Reject post with reason
  async rejectPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: "rejectionReason is required",
        });
      }

      const post = await socialUploaderService.rejectPost(
        id as string,
        rejectionReason,
      );

      return res.status(200).json({
        success: true,
        message: "Post rejected successfully",
        data: post,
      });
    } catch (error: any) {
      console.error("Error rejecting post:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Schedule post on LinkedIn
  async scheduleOnLinkedIn(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await socialUploaderService.schedulePostOnLinkedIn(
        id as string,
      );

      return res.status(200).json({
        success: true,
        message:
          result.status === "PUBLISHED"
            ? "Post published on LinkedIn successfully"
            : "Post scheduled on LinkedIn successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Error scheduling post on LinkedIn:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Get post status with LinkedIn analytics
  async getPostStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const status = await socialUploaderService.getPostStatus(id as string);

      return res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      console.error("Error getting post status:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Cancel scheduled post
  async cancelScheduledPost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await prisma.eventPost.findUnique({
        where: { id: id as string },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      if (post.status !== "SCHEDULED") {
        return res.status(400).json({
          success: false,
          message: "Only scheduled posts can be cancelled",
        });
      }

      const updatedPost = await prisma.eventPost.update({
        where: { id: id as string },
        data: {
          status: "DRAFT",
          linkedInPostId: null,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Scheduled post cancelled successfully",
        data: updatedPost,
      });
    } catch (error: any) {
      console.error("Error cancelling scheduled post:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new eventPostController();
