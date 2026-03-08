import prisma from "@osc/prisma";  
import type { Reminder, ReminderOffset, ReminderType } from "../utils/types";

export class ReminderService {

  static createReminder(
    scheduleId: string,
    scheduledAt: Date,
    offset: ReminderOffset,
    type: ReminderType,
  ) {
    const offsetMap: Record<ReminderOffset, number> = {
      "15_MIN": 15 * 60 * 1000,
      "30_MIN": 30 * 60 * 1000,
      "1_HOUR": 60 * 60 * 1000,
      "1_DAY": 24 * 60 * 60 * 1000,
    };

    const triggerAt = new Date(scheduledAt.getTime() - offsetMap[offset]);

    if (triggerAt.getTime() <= Date.now()) {
      throw new Error("Reminder trigger time must be in the future");
    }

    return prisma.reminder.create({
      data: {
        scheduleId,
        type,
        offset,
        triggerAt,
        sent: false,
      },
    });
  }
}