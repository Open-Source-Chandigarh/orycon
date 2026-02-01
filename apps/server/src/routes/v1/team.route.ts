import { Router } from "express";
import teamController from "../../controller/team.controller";
import type { AuthenticatedRequest } from "../../controller/team.controller";

export const teamRouter = Router();

teamRouter.post("/create", (req, res) =>
  teamController.createTeam(req as AuthenticatedRequest, res),
);
teamRouter.post("/remove", (req, res) =>
  teamController.removeTeam(req as AuthenticatedRequest, res),
);
teamRouter.post("/update/by-id/:id", (req, res) =>
  teamController.updateTeam(req as AuthenticatedRequest, res),
);

teamRouter.get("/all", (req, res) =>
  teamController.getAllTeams(req as AuthenticatedRequest, res),
);

export default teamRouter;
