import { randomUUID } from "crypto";
import type { PostSchedule, ScheduleStatus } from "../utils/types";
import { ReminderService } from "./reminder.services";
export class SchedulerService {

  private static schedules: PostSchedule[] = [];

  static createSchedule(
    postId: string,
    scheduledAt: Date,
    timezone: string
  ): PostSchedule {
    if (scheduledAt.getTime() <= Date.now()) {
      throw new Error("Scheduled time must be in the future");
    }

    const schedule: PostSchedule = {
      id: crypto.randomUUID(),
      postId,
      scheduledAt,
      timezone,
      status: "SCHEDULED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.schedules.push(schedule);

    ReminderService.createReminder(
      schedule.id,
      scheduledAt,
      "1_HOUR",
      "EMAIL"
    );

    return schedule;
  }
    
  static updateSchedule(
    scheduleId: string,
    newScheduledAt: Date
  ): PostSchedule {
    const schedule = this.schedules.find(s => s.id === scheduleId);

    if (!schedule) throw new Error("Schedule not found");

    if (schedule.status !== "SCHEDULED") {
      throw new Error("Only scheduled posts can be updated");
    }

    if (newScheduledAt.getTime() <= Date.now()) {
      throw new Error("Updated time must be in the future");
    }

    schedule.scheduledAt = newScheduledAt;
    schedule.updatedAt = new Date();

    return schedule;
  }

  static cancelSchedule(scheduleId: string): PostSchedule {
    const schedule = this.schedules.find(s => s.id === scheduleId);

    if (!schedule) throw new Error("Schedule not found");

    if (schedule.status === "CANCELLED") {
      throw new Error("Schedule is already cancelled");
    }

    schedule.status = "CANCELLED";
    schedule.updatedAt = new Date();

    return schedule;
  }

  static getSchedulesByDateRange(start: Date, end: Date): PostSchedule[] {
    return this.schedules.filter(
      s =>
        s.status !== "CANCELLED" &&
        s.scheduledAt >= start &&
        s.scheduledAt <= end
    );
  }

  static getSchedulesByPost(postId: string): PostSchedule[] {
    return this.schedules.filter(
      s => s.postId === postId && s.status !== "CANCELLED"
    );
  }
}