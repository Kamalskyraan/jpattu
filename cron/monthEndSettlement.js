import cron from "node-cron";
import db from "../configs/db.js";

cron.schedule("0 */6 * * *", async () => {
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

// reward and monthly

cron.schedule("0 */6 * * *", async () => {
  try {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    if (now.getDate() !== lastDay) {
      return;
    }

    const [reward] = await db.query(`
      UPDATE nwp_earnings
      SET status = 'paid',
          paid_at = NOW()
      WHERE id = (
        SELECT id FROM (
          SELECT id
          FROM nwp_earnings
          WHERE type = 'reward'
            AND status = 'pending'
          ORDER BY created_at ASC
          LIMIT 1
        ) as t
      )
    `);

    const [monthly] = await db.query(`
      UPDATE nwp_earnings
      SET status = 'paid',
          paid_at = NOW()
      WHERE type = 'monthly'
        AND status = 'pending'
        AND earned_date <= CURDATE()
    `);

    console.log(" Month End Reward + Monthly Settlement Done", {
      reward_paid: reward.affectedRows,
      monthly_paid: monthly.affectedRows,
    });
  } catch (err) {
    console.error(" Month End Cron Error:", err);
  }
});

//level payouts

cron.schedule("0 */6 * * *", async () => {
  try {
    const now = new Date();

    if (now.getDate() !== 1) {
      return;
    }

    const [levelPay] = await db.query(`
    UPDATE user_cashbacks
SET status = 'paid'
WHERE status = 'unpaid'
AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      `);

    console.log(" Cashback payout done", {
      paid_rows: levelPay.affectedRows,
    });
  } catch (err) {
    console.error(" Month Start Cron Error:", err);
  }
});
