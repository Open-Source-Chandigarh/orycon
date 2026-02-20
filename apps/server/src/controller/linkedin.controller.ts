import type { Request, Response } from "express";
import { LinkedInService } from "../services/linkedin.service";

export class LinkedInController {

  static async getAuthorizationUrl(req: Request, res: Response) {
    const url = LinkedInService.getAuthorizationUrl();
    return res.json({ url });
  }

  static async handleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      const userId = "test-user";

      const account = await LinkedInService.handleOAuthCallback(
        code,
        userId
      );

      return res.json({
        message: "LinkedIn connected successfully",
        account,
      });

    } catch (error: any) {

      console.error("OAuth Error:", error.response?.data || error.message);

      return res.status(500).json({
        error: "OAuth failed",
        details: error.response?.data || error.message,
      });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const { accessToken, linkedinUserId } = req.body;

      if (!accessToken || !linkedinUserId) {
        return res.status(400).json({ error: "Missing credentials" });
      }

      const posts = await LinkedInService.fetchUserPosts(
        accessToken,
        linkedinUserId
      );

      const overview =
        LinkedInService.buildAnalyticsOverview(posts);

      const topPost =
        LinkedInService.getTopPerformingPost(posts);

      return res.json({
        overview,
        topPost,
        posts,
      });

    } catch (error: any) {

      console.error("Analytics Error:", error.response?.data || error.message);

      return res.status(500).json({
        error: "Failed to fetch analytics",
        details: error.response?.data || error.message,
      });
    }
  }
}
