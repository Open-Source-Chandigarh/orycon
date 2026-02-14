export interface CalendarSchedule {
  id: string;
  postId: string;
  scheduledAt: Date;
  status: "SCHEDULED" | "CANCELLED";
}
export class CalendarService {
//Get schedules by date range
static getSchedulesInRange(
  schedules: CalendarSchedule[],
  start: Date,
  end: Date
): CalendarSchedule[] {
  return schedules.filter(
    (s) =>
      s.scheduledAt.getTime() >= start.getTime() &&
      s.scheduledAt.getTime() <= end.getTime()
  );
}
//Get schedules for a specific day
static getSchedulesForDate(
  schedules: CalendarSchedule[],
  date: Date
): CalendarSchedule[] {
  return schedules.filter(
    (s) =>
      s.scheduledAt.toDateString() === date.toDateString()
  );
}
//Get upcoming schedules
static getUpcomingSchedules(
  schedules: CalendarSchedule[],
  limit = 10
): CalendarSchedule[] {
  const now = Date.now();

  return schedules
    .filter(
      (s) =>
        s.status === "SCHEDULED" &&
        s.scheduledAt.getTime() > now
    )
    .sort(
      (a, b) =>
        a.scheduledAt.getTime() - b.scheduledAt.getTime()
    )
    .slice(0, limit);
}
}