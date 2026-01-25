import { Router } from "express";
import eventPostController from "../../controller/eventPost.controller";

export const eventPostRouter = Router();

// CREATE - Draft post for LinkedIn
eventPostRouter.post("/draft", (req, res) =>
  eventPostController.createDraftPost(req, res),
);

// CREATE - Legacy
eventPostRouter.post("/", (req, res) =>
  eventPostController.createEventPost(req, res),
);

// READ (All)
eventPostRouter.get("/", (req, res) =>
  eventPostController.getAllEventPosts(req, res),
);

// READ (By ID)
eventPostRouter.get("/by-id/:id", (req, res) =>
  eventPostController.getEventPostById(req, res),
);

// UPDATE
eventPostRouter.put("/by-id/:id", (req, res) =>
  eventPostController.updateEventPost(req, res),
);

// DELETE
eventPostRouter.delete("/by-id/:id", (req, res) =>
  eventPostController.deleteEventPost(req, res),
);

// LinkedIn Integration Routes

// Approve a post
eventPostRouter.post("/:id/approve", (req, res) =>
  eventPostController.approvePost(req, res),
);

// Reject a post
eventPostRouter.post("/:id/reject", (req, res) =>
  eventPostController.rejectPost(req, res),
);

// Schedule on LinkedIn
eventPostRouter.post("/:id/schedule", (req, res) =>
  eventPostController.scheduleOnLinkedIn(req, res),
);

// Get post status
eventPostRouter.get("/:id/status", (req, res) =>
  eventPostController.getPostStatus(req, res),
);

// Cancel scheduled post
eventPostRouter.delete("/:id/cancel", (req, res) =>
  eventPostController.cancelScheduledPost(req, res),
);
