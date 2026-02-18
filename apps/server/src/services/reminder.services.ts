export type ReminderType = "EMAIL" | "IN_APP";
export type ReminderOffset =
  | "15_MIN"
  | "30_MIN"
  | "1_HOUR"
  | "1_DAY";

export interface Reminder {
  id: string;
  scheduleId: string;
  type: ReminderType;
  offset: ReminderOffset;
  triggerAt: Date;
  createdAt: Date;
}

export class ReminderService {  //Create reminder from schedule
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

  return {
    id: "",
    scheduleId,
    type,
    offset,
    triggerAt,
    createdAt: new Date(),
  };
}
}
