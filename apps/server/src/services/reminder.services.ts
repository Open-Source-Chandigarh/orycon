import type { Reminder, ReminderOffset, ReminderType } from "../utils/types";
import crypto from "crypto";

export class ReminderService {

  private static reminders: Reminder[] = [];

  static createReminder(
    scheduleId: string,
    scheduledAt: Date,
    offset: ReminderOffset,
    type: ReminderType
  ): Reminder {

    const offsetMap: Record<ReminderOffset, number> = {
      "15_MIN": 15 * 60 * 1000,
      "30_MIN": 30 * 60 * 1000,
      "1_HOUR": 60 * 60 * 1000,
      "1_DAY": 24 * 60 * 60 * 1000,
    };

    const triggerAt = new Date(
      scheduledAt.getTime() - offsetMap[offset]
    );

    if (triggerAt.getTime() <= Date.now()) {
      throw new Error("Reminder trigger time must be in the future");
    }

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      scheduleId,
      type,
      offset,
      triggerAt,
      sent: false,
      createdAt: new Date(),
    };

    this.reminders.push(reminder);
    return reminder;
  }

  static getAll(): Reminder[] {
    return this.reminders;
  }
}