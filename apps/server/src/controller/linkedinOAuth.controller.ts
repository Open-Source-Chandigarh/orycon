import type { Request, Response } from "express";
import linkedInOAuthService from "../services/social-uploader-service/linkedin-oauth.service";
import socialUploaderService from "../services/social-uploader-service/social-uploader.service";

class LinkedInOAuthController {
  // Initiate OAuth flow - Start LinkedIn authentication
  async initiateOAuth(req: Request, res: Response) {
    try {
      const state = Math.random().toString(36).substring(7);
      const authUrl = linkedInOAuthService.getAuthorizationUrl(state);

      return res.status(200).json({
        success: true,
        authorizationUrl: authUrl,
        message: "Redirect user to this URL to authorize LinkedIn access",
      });
    } catch (error: any) {
      console.error("Error initiating OAuth:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to initiate OAuth flow",
        error: error.message,
      });
    }
  }

  // Handle OAuth callback from LinkedIn
  async handleCallback(req: Request, res: Response) {
    try {
      const { code, state, error, error_description } = req.query;

      if (error) {
        return res.status(400).json({
          success: false,
          message: "OAuth authorization failed",
          error: error_description || error,
        });
      }

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Authorization code not provided",
        });
      }

      const authResult = await linkedInOAuthService.authenticate(
        code as string,
      );

      return res.status(200).json({
        success: true,
        message: "LinkedIn connected successfully",
        data: {
          organizationName: authResult.organizationName,
          organizationId: authResult.organizationId,
          expiresIn: authResult.expiresIn,
        },
      });
    } catch (error: any) {
      console.error("Error handling OAuth callback:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to complete OAuth flow",
        error: error.message,
      });
    }
  }

  // Get LinkedIn connection status
  async getConnectionStatus(req: Request, res: Response) {
    try {
      const status = await socialUploaderService.getConnectionStatus();

      return res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      console.error("Error getting connection status:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to get connection status",
        error: error.message,
      });
    }
  }

  // Disconnect LinkedIn integration
  async disconnectLinkedIn(req: Request, res: Response) {
    try {
      await socialUploaderService.disconnectLinkedIn();

      return res.status(200).json({
        success: true,
        message: "LinkedIn disconnected successfully",
      });
    } catch (error: any) {
      console.error("Error disconnecting LinkedIn:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to disconnect LinkedIn",
        error: error.message,
      });
    }
  }
}

export default new LinkedInOAuthController();
