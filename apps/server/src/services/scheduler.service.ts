import prisma from "@osc/prisma";
import { ReminderService } from "./reminder.services";
export class SchedulerService {
 

  static async createSchedule(
    postId: string,
    scheduledAt: Date,
    timezone: string,
  ) {

    if (scheduledAt.getTime() <= Date.now()) {
      throw new Error("Scheduled time must be in the future");
    }

    const schedule = await prisma.postSchedule.create({
      data: {
        postId,
        scheduledAt,
        timezone,
        status: "SCHEDULED",
      },
    });

    // Auto create reminder
    await ReminderService.createReminder(
      schedule.id,
      scheduledAt,
      "1_HOUR",
      "EMAIL",
    );

    return schedule;
  }

  static async updateSchedule(
    scheduleId: string,
    newScheduledAt: Date,
  ){

    if (newScheduledAt.getTime() <= Date.now()) {
      throw new Error("Updated time must be in the future");
    }

   return prisma.postSchedule.update({
      where: { id: scheduleId },
      data: {
        scheduledAt: newScheduledAt,
        updatedAt: new Date(),
      },
    });
  }


  static async cancelSchedule(scheduleId: string) {
    return prisma.postSchedule.update({
      where: { id: scheduleId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });
  }

  static async getSchedulesByDateRange(start: Date, end: Date){
  return prisma.postSchedule.findMany({
      where: {
        status: { not: "CANCELLED" },
        scheduledAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  static getSchedulesByPost(postId: string) {
  return prisma.postSchedule.findMany({
      where: {
        postId,
        status: { not: "CANCELLED" },
      },
    });
  }
}