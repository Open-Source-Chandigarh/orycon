import prisma from "@osc/prisma";
import type { Request, Response } from "express";
/**
 * The eventPostController controller class which will be working around and executing the main
 * functionalities realted to user functions that are defined below.
 */

class eventPostController {
  async createEventPost(req: Request, res: Response) {
    try {
      const { name, platform, externalRef, postScheduleDate, eventId } =
        req.body;

      if (!name || !platform || !externalRef || !postScheduleDate || !eventId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newPost = await prisma.eventPost.create({
        data: {
          name,
          platform,
          externalRef,
          postScheduleDate: new Date(postScheduleDate),
          eventId,
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
        include: { event: true },
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
        where: { id: id },
        include: { event: true },
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
      const { name, platform, externalRef, postScheduleDate, eventId } =
        req.body;
      const updatedPost = await prisma.eventPost.update({
        where: { id: id },
        data: {
          name,
          platform,
          externalRef,
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
        where: { id: id },
      });
      res.json({ message: "Event post deleted successfully" });
    } catch (error) {
      console.error("Error deleting event post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new eventPostController();
