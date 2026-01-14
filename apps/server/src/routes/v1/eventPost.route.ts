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
eventPostRouter.get("/:id", (req, res) =>
  eventPostController.getEventPostById(req, res),
);

// UPDATE
eventPostRouter.put("/:id", (req, res) =>
  eventPostController.updateEventPost(req, res),
);

// DELETE
eventPostRouter.delete("/:id", (req, res) =>
  eventPostController.deleteEventPost(req, res),
);
