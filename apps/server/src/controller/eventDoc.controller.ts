import prisma from "@osc/prisma";
import type { Request, Response } from "express";
import type { EventDocumentation } from "../utils/types";

class EventDocsController {
  async createEventDocumentation(req: Request, res: Response) {
    try {
      const data: EventDocumentation = req.body;
      if (!data.name || !data.title || !data.content || !data.eventId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existingDoc = await prisma.eventDocumentation.findMany({
        where: { name: data.name, eventId: data.eventId },
      });

      if (existingDoc) {
        return res.status(409).json({
          message: "EventDocumentation with this name already exists",
        });
      }
      const createdDoc = await prisma.eventDocumentation.create({
        data,
      });

      res.status(201).json({
        message: "event created successfully",
        data: createdDoc,
        error: null,
      });
    } catch (error) {
      console.error("Error creating EventDocumentation:", error);
      res.status(500).json({ message: "error while creating event docs " });
    }
  }
  async getAllEventDocumentation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await prisma.event.findUnique({
        where: { id },
      });
      if (!doc)
        return res.status(404).json({ message: "Event does not exists" });

      const docs = await prisma.eventDocumentation.findMany({
        where: { eventId: id },
        include: {
          event: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json({
        message: "fetch successfull",
        data: docs,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching EventDocumentations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getEventDocumentationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await prisma.eventDocumentation.findUnique({
        where: { id },
        include: { event: true },
      });

      if (!doc) return res.status(404).json({ message: "Not found" });
      res.status(200).json({
        data: doc,
        message: "EventDocumentation fetched successfully",
        error: null,
      });
    } catch (error) {
      console.error("Error fetching EventDocumentation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateEventDocumentation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await prisma.eventDocumentation.findUnique({
        where: { id },
      });
      if (!doc)
        return res.status(404).json({ message: "Event does not exists" });

      const data: Partial<EventDocumentation> = req.body;
      const updatedDoc = await prisma.eventDocumentation.update({
        where: { id },
        data: {
          ...data,
        },
      });
      res.status(200).json({
        message: "eventdocumentation updated successfully",
        data: updatedDoc,
        error: null,
      });
    } catch (error) {
      console.error("Error updating EventDocumentation:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteEventDocumentation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await prisma.eventDocumentation.findUnique({
        where: { id },
      });
      if (!doc)
        return res.status(404).json({
          message: "Invalid id: Event for deletion does not exist in the db",
        });

      const deletedEventDoc = await prisma.eventDocumentation.delete({
        where: { id },
      });

      res.status(204).json({
        message: "EventDocumentation deleted successfully",
        data: deletedEventDoc,
        error: null,
      });
    } catch (error) {
      console.error("Error deleting EventDocumentation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new EventDocsController();
