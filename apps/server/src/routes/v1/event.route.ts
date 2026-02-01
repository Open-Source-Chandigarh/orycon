import { Router } from "express";
import eventController from "../../controller/event.controller";

export const eventRouter = Router();

// CREATE
eventRouter.post("/create", (req, res) =>
    eventController.createEvent(req, res),
);

// READ (All)
eventRouter.get("/all", (req, res) =>
    eventController.getAllEvents(req, res),
);

// READ (By ID)
eventRouter.get("/by-id/:id", (req, res) =>
    eventController.getEventsById(req, res),
);

// UPDATE
eventRouter.put("/update/:id", (req, res) =>
    eventController.updateEvent(req, res),
);

// DELETE
eventRouter.post("/remove", (req, res) =>
    eventController.removeEvent(req, res),
);

export default eventRouter;
