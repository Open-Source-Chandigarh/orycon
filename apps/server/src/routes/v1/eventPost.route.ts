import { Router } from "express";
import eventPostController from "../../controller/eventPost.controller";

export const eventPostRouter = Router();

// CREATE
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
