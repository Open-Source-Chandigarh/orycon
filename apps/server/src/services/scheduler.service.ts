export type ScheduleStatus = "DRAFT" | "SCHEDULED" | "CANCELLED";
export interface PostSchedule {
  id: string;
  postId: string;
  scheduledAt: Date;
  timezone: string;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}
export class SchedulerService {
static createSchedule(
  postId: string,
  scheduledAt: Date,
  timezone: string
): PostSchedule {
  if (scheduledAt.getTime() <= Date.now()) {
    throw new Error("Scheduled time must be in the future");
  }

  return {
    id: "",
    postId,
    scheduledAt,
    timezone,
    status: "SCHEDULED",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
static updateSchedule(
  schedule: PostSchedule,
  newScheduledAt: Date
): PostSchedule {
  if (schedule.status !== "SCHEDULED") {
    throw new Error("Only scheduled posts can be updated");
  }

  if (newScheduledAt.getTime() <= Date.now()) {
    throw new Error("Updated time must be in the future");
  }

  return {
    ...schedule,
    scheduledAt: newScheduledAt,
    updatedAt: new Date(),
  };
}
static cancelSchedule(schedule: PostSchedule): PostSchedule {
  if (schedule.status === "CANCELLED") {
    throw new Error("Schedule is already cancelled");
  }

  return {
    ...schedule,
    status: "CANCELLED",
    updatedAt: new Date(),
  };
}
}