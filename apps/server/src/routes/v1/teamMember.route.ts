import teamMemberController from "../../controller/teamMember.controller";
import { Router } from "express";

export const teamMemberRouter = Router();

teamMemberRouter.post("/create", teamMemberController.createTeamMember);
teamMemberRouter.post(
  "/remove/:memberId",
  teamMemberController.removeTeamMember,
);
teamMemberRouter.post(
  "/update/:memberId",
  teamMemberController.updateTeamMember,
);

teamMemberRouter.get(
  "/team/:teamId",
  teamMemberController.getTeamMembersByTeam,
);
