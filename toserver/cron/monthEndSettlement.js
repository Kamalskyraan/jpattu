import cron from "node-cron";
import db from "../configs/db.js";

// Cron runs every minute for testing
cron.schedule("* * * * *", async () => {
  try {
    // Force month-end = true for testing
    const isMonthEnd = 1;

    if (!isMonthEnd) return;

    // 1️⃣ withdraw → paid
    const [paidResult] = await db.query(`
      UPDATE nwp_earnings
      SET status = 'paid',
          paid_at = NOW()
      WHERE status = 'withdraw'
    `);

    // 2️⃣ delete deleted records
    const [deleteResult] = await db.query(`
      DELETE FROM nwp_earnings
      WHERE status = 'deleted'
    `);

    console.log("✅ Month End Settlement Done", {
      paid: paidResult.affectedRows,
      deleted: deleteResult.affectedRows,
    });
  } catch (err) {
    console.error("❌ Month End Cron Error:", err);
  }
});
