import { Router } from "express";
import { eventRouter } from "./event.route";
import { eventCalendarRouter } from "./eventCalendar.route";
import { eventDocRouter } from "./eventDoc.route";
import { eventParticipantRouter } from "./eventParticipant.route";
import { eventPostRouter } from "./eventPost.route";
import { teamRouter } from "./team.route";
import { teamMemberRouter } from "./teamMember.route";
import { userRouter } from "./user.route";
import schedulerRoutes from "../scheduler.routes";

export const v1Router = Router();

v1Router.use("/event-calendar", eventCalendarRouter);
v1Router.use("/event-docs", eventDocRouter);
v1Router.use("/event-participants", eventParticipantRouter);
v1Router.use("/event-posts", eventPostRouter);
v1Router.use("/events", eventRouter);
v1Router.use("/teams", teamRouter);
v1Router.use("/team-members", teamMemberRouter);
v1Router.use("/users", userRouter);
v1Router.use("/schedules", schedulerRoutes);
