import { Router } from "express";
import hiringController from "../../controller/hiring.controller";
import verifyJWT from "../../middleware/auth.middleware";
import type { AuthenticatedRequest } from "../../controller/team.controller";

export const hiringRouter = Router();

// Applicant / User routes

// CREATE FORMS
hiringRouter.post("/apply", verifyJWT, (req, res) =>
  hiringController.applyForHiring(req as AuthenticatedRequest, res)
);

// READ (USER)
hiringRouter.get("/my-application", verifyJWT, (req, res) =>
  hiringController.getMyApplication(req as AuthenticatedRequest, res)
);

// Admin routes

// SHOW FORMS (ALL)
hiringRouter.get("/applicants", verifyJWT, (req, res) =>
  hiringController.getApplicants(req as AuthenticatedRequest, res)
);

// UPDATE STATUS
hiringRouter.put("/applicants/:id/status", verifyJWT, (req, res) =>
  hiringController.updateApplicantStatus(req as AuthenticatedRequest, res)
);

// UPDATE TEAM
hiringRouter.put("/applicants/:id/team", verifyJWT, (req, res) =>
  hiringController.updateApplicantTeam(req as AuthenticatedRequest, res)
);

// DELETE
hiringRouter.delete("/applicants/:id", verifyJWT, (req, res) =>
  hiringController.deleteApplicant(req as AuthenticatedRequest, res)
);