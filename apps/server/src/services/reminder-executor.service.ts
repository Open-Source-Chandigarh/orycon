import prisma from  "@osc/prisma";
import type { Reminder } from "../utils/types";

export class ReminderExecutorService {

  static async processPendingReminders() {
  try{
    const now = new Date();

    const reminders = await prisma.reminder.findMany({
      where: {
        sent: false,
        triggerAt: {
          lte: now
        }
      }
    });

    for (const reminder of reminders) {
        console.log(`Reminder SENT for schedule ${reminder.scheduleId}`);

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { sent: true }
        });
      }
    } catch (error) {
        console.error("Reminder failed:", error);
      }
    }
}
  
