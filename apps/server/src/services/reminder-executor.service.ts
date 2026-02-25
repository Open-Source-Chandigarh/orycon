import { ReminderService } from "./reminder.services";
import type { Reminder } from "../utils/types";

export type ReminderExecutionResult = "SENT" | "FAILED" | "SKIPPED";

export class ReminderExecutorService {
static start() {
    setInterval(() => {
      this.processReminders();
    }, 60 * 1000); // every minute
  }

  private static processReminders() {
    const now = new Date();

    for (const reminder of ReminderService.getAll()) {
      if (!reminder.sent && reminder.triggerAt <= now) {
        const result = this.execute(reminder);

        if (result === "SENT") {
          reminder.sent = true;
        }
      }
    }
  }

  static execute(reminder: Reminder): ReminderExecutionResult {
  if (reminder.sent) {
    return "SKIPPED";
  }

  if (reminder.triggerAt.getTime() > Date.now()) {
    return "SKIPPED";
  }

  try {
    //  integrate notification delivery (in-app)
    console.log(`Reminder SENT for schedule ${reminder.scheduleId}`);
    return "SENT";
  } catch {
    return "FAILED";
  }
}
}