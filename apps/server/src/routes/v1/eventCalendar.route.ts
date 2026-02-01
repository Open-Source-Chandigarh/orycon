import { Router } from "express";
import eventCalendarController from "../../controller/eventCalender.controller";

export const eventCalendarRouter = Router();

// CREATE
eventCalendarRouter.post("/", (req, res) =>
    eventCalendarController.addNewEventToCalendar(req, res),
);

// READ (By Month)
eventCalendarRouter.get("/", (req, res) =>
    eventCalendarController.getEventBasedOnMonth(req, res),
);

// UPDATE
eventCalendarRouter.put("/by-event-id/:eventId", (req, res) =>
    eventCalendarController.updateEventToCalendar(req, res),
);

// DELETE
eventCalendarRouter.delete("/by-event-id/:eventId", (req, res) =>
    eventCalendarController.deleteEventFromCalendar(req, res),
);

export default eventCalendarRouter;
