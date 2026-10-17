const cron = require("node-cron");
const { default: UserBalanceModel } = require("../models/userbalance.model");

cron.schedule(
  "0 0 1 * *",
  async () => {
    try {
      const result = await UserBalanceModel.markPreviousMonthKRLogsPaid();

      console.log(
        `[KR Monthly Cron] Success: ${result.updatedCount} records updated`,
        result,
      );
    } catch (error) {
      console.error("[KR Monthly Cron] Failed:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  },
);

console.log("KR monthly payment cron scheduled");
