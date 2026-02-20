import { Router } from "express";
import { LinkedInController } from "../../controller/linkedin.controller";

const router = Router();

router.get("/auth-url", LinkedInController.getAuthorizationUrl);
router.get("/callback", LinkedInController.handleCallback);
router.post("/analytics", LinkedInController.getAnalytics);

export default router;
