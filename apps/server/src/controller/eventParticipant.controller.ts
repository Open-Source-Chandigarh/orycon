import prisma from "@osc/prisma";
import type { Request, Response } from "express";
import type { EventParticipant } from "../utils/types";

/**
 * The eventParticipantController controller class which will be working around and executing the main
 * functionalities realted to user functions that are defined below.
 */

const MAX_EVENT = 30;

class eventParticipantController {
  async registerParticipant(req: Request, res: Response) {
    try {
      const { data }: { data: EventParticipant } = req.body;
      const dbUser = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });
      if (!dbUser) throw new Error("No User Found, Kindly Register");
      const dbEvent = await prisma.event.findUnique({
        where: {
          id: data.eventId,
        },
      });
      if (!dbEvent) throw new Error("No Event Found");
      const existingUser = await prisma.eventParticipant.findFirst({
        where: {
          userId: data.userId,
          eventId: data.eventId,
        },
      });
      if (existingUser) throw new Error("Already Registered");

      const createdEntry = await prisma.eventParticipant.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          entryType: data.entryType,
          isPresent: "ABSENT",
        },
      });
      if (!createdEntry) throw new Error("Couldn't Create Entry");
      return res.json({
        data: createdEntry,
        message: "Entry created successfully",
        error: null,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        data: null,
        message: error.message,
        error: error,
      });
    }
  }
  async getUserRegistration(req: Request, res: Response) {
    try {
      const id = req.body.userId;
      if (!id) throw new Error("User id not found");
      const dbUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!dbUser) throw new Error("No User Found, Kindly Register");

      const participatedEvents = await prisma.eventParticipant.findMany({
        where: {
          userId: id,
        },
      });

      if (
        Array.isArray(participatedEvents) &&
        participatedEvents.length === 0
      ) {
        return res.json({
          data: [],
          message: "No Events Found",
          error: null,
        });
      }

      return res.json({
        data: participatedEvents,
        message: "Events fetched",
        error: null,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        data: null,
        message: error.message,
        error: error,
      });
    }
  }

  async getPaginatedRegistrationForEvent(req: Request, res: Response) {
    try {
      let { pageNumber, eventId } = req.body;
      if (pageNumber === null) pageNumber = 0;
      const dbEvent = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });
      if (!dbEvent) throw new Error("No Event Found");
      const eventParticipants = await prisma.eventParticipant.findMany({
        where: {
          eventId: eventId,
        },
        take: MAX_EVENT,
        skip: MAX_EVENT * (pageNumber - 1),
      });
      if (Array.isArray(eventParticipants) && eventParticipants.length === 0) {
        return res.json({
          data: [],
          message: "No Event Participants Found",
          error: null,
        });
      }
      return res.json({
        data: eventParticipants,
        message: "Event Participants Found",
        error: null,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({ data: null, message: error.message, error: error });
    }
  }
  async markEventAttendance(req: Request, res: Response) {
    try {
      const { data }: { data: EventParticipant } = req.body;
      const dbUser = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });
      if (!dbUser) throw new Error("No User Found, Kindly Register");
      const dbEvent = await prisma.event.findUnique({
        where: {
          id: data.eventId,
        },
      });
      if (!dbEvent) throw new Error("No Event Found");
      const existingUser = await prisma.eventParticipant.findFirst({
        where: {
          userId: data.userId,
          eventId: data.eventId,
        },
      });
      if (!existingUser) throw new Error("User Not Registered");
      const markedAttendence = await prisma.eventParticipant.update({
        data: {
          isPresent: "PRESENT",
        },
        where: {
          id: existingUser.id,
        },
      });
      if (!markedAttendence) throw new Error("Couldn't mark attendence");
      return res.json({
        data: markedAttendence,
        message: "Attendence marked successfully",
        error: null,
      });
    } catch (error: any) {
      res.json({
        data: null,
        message: error.message,
        error: error,
      });
    }
  }
  async handleWalkInRegistration(req: Request, res: Response) {
    try {
      const { data }: { data: EventParticipant } = req.body;
      const dbUser = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });
      if (!dbUser) throw new Error("No User Found, Kindly Register");
      const dbEvent = await prisma.event.findUnique({
        where: {
          id: data.eventId,
        },
      });
      if (!dbEvent) throw new Error("No Event Found");
      const existingUser = await prisma.eventParticipant.findFirst({
        where: {
          userId: data.userId,
          eventId: data.eventId,
        },
      });
      if (existingUser) throw new Error("Already Registered");
      const walkInRegistration = await prisma.eventParticipant.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          entryType: "WALKIN",
          isPresent: "PRESENT",
        },
      });
      if (!walkInRegistration) throw new Error("Couldn't create Registration");
      return res.json({
        data: walkInRegistration,
        message: "Walkin Registration Successful",
        error: null,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        data: null,
        message: error.message,
        error: error,
      });
    }
  }
}
export default new eventParticipantController();
