import type { Request, Response } from "express";
import { SchedulerService } from "../services/scheduler.service";

export class SchedulerController {

  static createSchedule(req: Request, res: Response) {
    try {
      const { postId, scheduledAt, timezone } = req.body;

      if (!postId || !scheduledAt || !timezone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const schedule = SchedulerService.createSchedule(
        String(postId),
        new Date(scheduledAt),
        String(timezone)
      );

      return res.status(201).json(schedule);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static updateSchedule(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { scheduledAt } = req.body;

      if (!scheduledAt) {
        return res.status(400).json({ error: "New scheduledAt required" });
      }

      const schedule = SchedulerService.updateSchedule(
        id,
        new Date(scheduledAt)
      );

      return res.json(schedule);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static cancelSchedule(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const schedule = SchedulerService.cancelSchedule(id);

      return res.json(schedule);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static getSchedulesByDateRange(req: Request, res: Response) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ error: "Start and end required" });
      }

      const schedules = SchedulerService.getSchedulesByDateRange(
        new Date(String(start)),
        new Date(String(end))
      );

      return res.json(schedules);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static getSchedulesByPost(req: Request, res: Response) {
    try {
      const postId = String(req.params.postId);

      const schedules = SchedulerService.getSchedulesByPost(postId);

      return res.json(schedules);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}