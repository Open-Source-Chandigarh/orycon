import prisma, { Role } from "@osc/prisma";
import type { Request, Response } from "express";
import type { Team, Role } from "../utils/types";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

class teamController {
  async createTeam(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) throw new Error("User not authenticated");

      if (!(user.role === "ADMIN" || user.role === "LEAD")) {
        return res.status(403).json({
          message: "Unauthorized: Only admins or leads can create teams",
          error: true,
          data: null,
        });
      }

      const { data }: { data: Team } = req.body;
      if (!data) throw new Error("error in team data");
      const dbTeam = await prisma.team.findFirst({
        where: {
          name: data.name,
        },
      });

      if (dbTeam) throw new Error("a team by this name exists");

      const createdTeam = await prisma.team.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });

      if (!createdTeam) throw new Error("Couldn't store inside the database");

      res.status(200).json({
        team: createdTeam,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        message: error.message || "something went wrong",
        error: true,
        data: null,
      });
    }
  }

  async removeTeam(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) throw new Error("User not authenticated");

      if (!(user.role === "ADMIN" || user.role === "LEAD")) {
        return res.status(403).json({
          error: true,
          message: "Unauthorized: Only admins or leads can remove teams",
          data: null,
        });
      }

      const { name } = req.body;
      if (!name) throw new Error("teamname required");

      const dbTeam = await prisma.team.findFirst({
        where: {
          name: name,
        },
      });

      if (!dbTeam) throw new Error("no such team found");

      const deletedTeam = await prisma.team.deleteMany({
        where: {
          name,
        },
      });

      if (!deletedTeam) throw new Error("failed to remove team");

      return res.status(200).json({
        data: deletedTeam,
        message: "team removed successfully",
        error: false,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        data: null,
        message: error.message || "something went wrong",
        error: true,
      });
    }
  }

  async updateTeam(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ error: true, message: "User not authenticated", data: null });
      }

      if (!(user.role === "ADMIN" || user.role === "LEAD")) {
        return res.status(403).json({
          error: true,
          message:
            "Unauthorized: Only admins or leads can make changes in teams",
          data: null,
        });
      }

      const { id } = req.params; // team id from URL or if you want to search it by name then please mention in comments
      const { name, description } = req.body;

      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ error: true, message: "Team Id is required", data: null });
      }

      if (!name && !description) {
        return res.status(400).json({
          error: true,
          message: "At least one field is required to update",
          data: null,
        });
      }

      const dataUpdated: any = {};
      if (name) dataUpdated.name = name;
      if (description) dataUpdated.description = description;

      const updatedTeam = await prisma.team.update({
        where: { id },
        data: dataUpdated,
      });

      return res.status(200).json({
        error: false,
        message: "Team updated successfully",
        data: updatedTeam,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: error.message || "Something went wrong",
        data: null,
      });
    }
  }
  async getAllTeams(req: Request, res: Response) {
    try {
      const dbTeams = await prisma.team.findMany({});
      if (dbTeams.length == 0)
        return res.status(200).json({
          data: [],
          message: "no team found",
          error: false,
        });

      return res.status(200).json({
        data: dbTeams,
        message: "teams fetched successfully",
        error: false,
      });
    } catch (error: any) {
      console.log(error);
      return res.json({
        data: null,
        message: error.message || "something went wrong",
        error: true,
      });
    }
  }
}
export default new teamController();
