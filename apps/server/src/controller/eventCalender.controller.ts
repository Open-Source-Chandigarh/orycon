import prisma from "@osc/prisma";
import type { Request, Response } from "express";

/**
 * Handles calendar event operations
 */
class EventCalendarController {
  async addNewEventToCalendar(req: Request, res: Response) {
    try {
      const { title, description, eventDate, marked, eventType } = req.body;

      if (!title || !eventDate || !eventType) {
        return res.status(400).json({
          error: "title, eventDate, and eventType are required",
        });
      }
      const parsedDate = new Date(eventDate);
      const existingEvent = await prisma.eventCalendar.findFirst({
        where: {
          title,
          eventDate: parsedDate,
        },
      });

      if (existingEvent) {
        return res.status(409).json({
          error: "Event with this title already exists on the same date",
        });
      }

      const event = await prisma.eventCalendar.create({
        data: {
          title,
          description,
          eventDate: parsedDate,
          marked: !!marked,
          eventType,
          event: title,
        },
      });

      return res.status(201).json(event);
    } catch (error: any) {
      console.error("Error adding event:", error);

      if (error.code === "P2002") {
        return res.status(409).json({ error: "Event already exists" });
      }

      return res.status(500).json({ error: "Failed to add event" });
    }
  }
  async getEventBasedOnMonth(req: Request, res: Response) {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({
          error: "year and month query parameters are required",
        });
      }

      const yearNum = parseInt(year as string);
      const monthNum = parseInt(month as string);

      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 1);

      const events = await prisma.eventCalendar.findMany({
        where: {
          eventDate: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: {
          eventDate: "asc",
        },
      });

      return res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  }
  async updateEventToCalendar(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const { title, description, eventDate, marked, eventType } = req.body;

      const updateData: Record<string, any> = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (eventDate !== undefined) updateData.eventDate = new Date(eventDate);
      if (marked !== undefined) updateData.marked = marked;
      if (eventType !== undefined) updateData.eventType = eventType;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: "No fields provided to update",
        });
      }

      const event = await prisma.eventCalendar.update({
        where: { id: eventId },
        data: updateData,
      });

      return res.json(event);
    } catch (error: any) {
      console.error("Error updating event:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Event not found" });
      }

      return res.status(500).json({ error: "Failed to update event" });
    }
  }

  async deleteEventFromCalendar(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const existingEvent = await prisma.eventCalendar.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      await prisma.eventCalendar.delete({
        where: { id: eventId },
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      return res.status(500).json({ error: "Failed to delete event" });
    }
  }
}

export default new EventCalendarController();
