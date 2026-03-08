import { Router } from "express";
import { SchedulerController } from "../controller/scheduler.controller";

const router = Router();

router.post("/", SchedulerController.createSchedule);
router.patch("/:id", SchedulerController.updateSchedule);
router.delete("/:id", SchedulerController.cancelSchedule);
router.get("/", SchedulerController.getSchedulesByDateRange);
router.get("/post/:postId", SchedulerController.getSchedulesByPost);

export default router;