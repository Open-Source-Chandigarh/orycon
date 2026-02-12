import { Router } from "express";
import linkedInOAuthController from "../../controller/linkedinOAuth.controller";

const linkedInOAuthRouter = Router();

/**
 * LinkedIn OAuth Routes
 */

// Initiate OAuth flow
linkedInOAuthRouter.get("/initiate", linkedInOAuthController.initiateOAuth);

// OAuth callback
linkedInOAuthRouter.get("/callback", linkedInOAuthController.handleCallback);

// Get connection status
linkedInOAuthRouter.get("/status", linkedInOAuthController.getConnectionStatus);

// Disconnect LinkedIn
linkedInOAuthRouter.post(
  "/disconnect",
  linkedInOAuthController.disconnectLinkedIn,
);

export { linkedInOAuthRouter };
