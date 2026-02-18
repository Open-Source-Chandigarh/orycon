import teamMemberController from "../../controller/teamMember.controller";
import { Router } from "express";

export const teamMemberRouter = Router();

teamMemberRouter.post("/create", (req, res) => 
  teamMemberController.createTeamMember(req, res),
);
teamMemberRouter.post(
  "/remove/by-member-id/:memberId", (req, res) => 
  teamMemberController.removeTeamMember(req, res),
);
teamMemberRouter.post(
  "/update/by-member-id/:memberId", (req, res) => 
  teamMemberController.updateTeamMember(req, res),
);

teamMemberRouter.get(
  "/by-team-id/:teamId", (req, res) => 
  teamMemberController.getTeamMembersByTeam(req, res),
);
