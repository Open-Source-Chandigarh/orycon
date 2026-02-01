import type { Request, Response } from "express";
import prisma from "@osc/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class HiringController {
  // APPLICANT

  async applyForHiring(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { eventId, role, team, motivation } = req.body;

      if (!userId) throw new Error("User not authenticated");

      if (!eventId || !role || !motivation) {
        return res.status(400).json({ 
        message: "Missing required fields"
      });
      }

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });
      if (!event) throw new Error("Event not found");

      const existing = await prisma.eventParticipant.findFirst({
        where: { userId, eventId },
      });
      if (existing) {
        return res.status(409).json({
          message: "You have already applied for this event",
        });
      }

      const application = await prisma.eventParticipant.create({
        data: {
          userId,
          eventId,
          role,
          team: team || null,
          motivation,
          status: "PENDING",
          entryType: "REGISTERED",
          isPresent: "ABSENT",
        },
        include: { event: true },
      });

      return res.status(201).json({
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMyApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const application = await prisma.eventParticipant.findFirst({
        where: { userId },
        include: { event: true },
      });

      if (!application) throw new Error("No application found");
      return res.json(application);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  // ADMIN

  async getApplicants(req: Request, res: Response) {
    try {
      const { eventId, status, team } = req.query;
      if (!eventId) {
        return res.status(400).json({ 
          message: "eventId is required" 
        });
      }

      const applicants = await prisma.eventParticipant.findMany({
        where: {
          eventId: eventId as string,
          ...(status && { status: status as string }),
          ...(team && { team: team as string }),
        },
        include: { user: true },
      });

      return res.json(applicants);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

 async updateApplicantStatus(req: Request, res: Response) {
  try {
    const applicantId = req.params.id as string;

    if (!applicantId) {
      return res.status(400).json({ message: "Applicant id required" });
    }
    const { status } = req.body;

    if (!["PENDING", "SELECTED", "MAYBE", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await prisma.eventParticipant.update({
      where: { id: applicantId },
      data: { status },
    });

    return res.json({
      message: "Applicant status updated",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

  async updateApplicantTeam(req: Request, res: Response) {
  try {
    const applicantId = req.params.id as string;

    if (!applicantId) {
      return res.status(400).json({ message: "Applicant id required" });
    }

    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "teamId required" });
    }

    const applicant = await prisma.eventParticipant.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // adding user to team
    const teamMember = await prisma.teamMember.create({
      data: {
        userId: applicant.userId,
        teamId,
      },
    });

    // updating applicant record
    await prisma.eventParticipant.update({
      where: { id: applicantId },
      data: { team: teamId },
    });

    return res.json({
      message: "Applicant assigned to team",
      data: teamMember,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

  async deleteApplicant(req: Request, res: Response) {
  try {
    const applicantId = req.params.id as string;
    
    if (!applicantId) {
      return res.status(400).json({ message: "Applicant id required" });
    }

    await prisma.eventParticipant.delete({
      where: { id: applicantId },
    });

    return res.status(200).json({
      message: "Applicant deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}}

export default new HiringController();