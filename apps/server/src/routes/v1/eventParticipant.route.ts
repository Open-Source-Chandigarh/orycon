import { Router } from "express";
import eventParticipantController from "../../controller/eventParticipant.controller";

export const eventParticipantRouter = Router();

// CREATE - Register Participant
eventParticipantRouter.post("/register", (req, res) =>
    eventParticipantController.registerParticipant(req, res),
);

// CREATE - Walk-in Registration
eventParticipantRouter.post("/walkin", (req, res) =>
    eventParticipantController.handleWalkInRegistration(req, res),
);

// READ - Get User Registrations
eventParticipantRouter.get("/user", (req, res) =>
    eventParticipantController.getUserRegistration(req, res),
);

// READ - Get Paginated Registrations for Event
eventParticipantRouter.post("/event/paginated", (req, res) =>
    eventParticipantController.getPaginatedRegistrationForEvent(req, res),
);

// UPDATE - Mark Attendance
eventParticipantRouter.put("/attendance", (req, res) =>
    eventParticipantController.markEventAttendance(req, res),
);

export default eventParticipantRouter;
