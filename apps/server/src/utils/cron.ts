import cron from "node-cron";
import { ReminderExecutorService } from "../services/reminder-executor.service";

export function startCronJobs() {

  // Runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running reminder cron:", new Date().toISOString());
    await ReminderExecutorService.processPendingReminders();
  });

}

/**
 * VM Deployment Note:
 * 
 * Ensure this cron scheduler runs within the Node.js application process.
 * 
 * If deploying on a VM (e.g. AWS EC2):
 * - Keep server running using PM2:
 *     pm2 start index.js --name scheduler app
 * 
 * For Docker--- ensure container stays alive in Docker deployment.
 */