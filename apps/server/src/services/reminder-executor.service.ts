export type ReminderExecutionResult = "SENT" | "FAILED" | "SKIPPED";

export interface ExecutableReminder {
  id: string;
  triggerAt: Date;
  type: "EMAIL" | "IN_APP";
  sent: boolean;
}
export class ReminderExecutorService {

static execute(reminder: ExecutableReminder): ReminderExecutionResult {
  if (reminder.sent) {
    return "SKIPPED";
  }

  if (reminder.triggerAt.getTime() > Date.now()) {
    return "SKIPPED";
  }

  try {
    //  integrate notification delivery (email / in-app)
    return "SENT";
  } catch {
    return "FAILED";
  }
}
}