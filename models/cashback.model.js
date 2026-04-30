import db from "../configs/db.js";
import dayjs from 'dayjs'

const CashbackModel = {
  getCashBackReport: async ({ start, end }) => {
    const startTime = `${start} 00:00:00`;
    const endTime = `${end} 23:59:59`;
    const params = [startTime, endTime];
    const query =
        "SELECT c.id, c.user_id, u.name, u.mobile, 1000 as paid_amount, 0 as cashback, c.status, u.created_at as joining_date, c.updated_at as paid_date FROM user_cashbacks c LEFT JOIN users u  ON u.user_id = c.user_id WHERE c.created_at >= ? AND c.created_at <= ? AND c.deleted_at IS NULL ORDER BY c.created_at DESC";

    const [data] = await db.query(query, params);
    return data;
  },

  getUserCashBackReport: async (user_id) => {
    const query =
      "SELECT id, user_id, 1000 as paid_amount, 0 as cashback, status FROM user_cashbacks WHERE user_id = ? AND deleted_at IS NULL";
    const [data] = await db.query(query, [user_id]);
    return data;
  },

  addCashBack: async (user_id) => {
    try {
      const amount = 0;
      const query = "INSERT INTO user_cashbacks (user_id, amount, status) VALUES (?, ?, ?)";
      await db.query(query, [user_id, amount, "paid"]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  updateCashBack: async (ids) => {
    try {
      const query = "UPDATE user_cashbacks SET status = 'paid' WHERE id in (?)";
      await db.query(query, [ids]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  cashbackStatus: async (user_id) => {
    const query = "SELECT * FROM user_cashbacks WHERE user_id = ? AND status = 'paid'";
    const [data] = await db.query(query, [user_id]);
    if (data.length === 0) return 0;
    else return data[0].amount;
  },

  getTotalPayouts: async (all = false, year = null, month = null) => {
    try {
      let query;
      let params = [];

      if (all) {
        const now = dayjs();
        const targetYear = typeof year === "number" ? year : now.year();
        const targetMonth = typeof month === "number" ? month : now.month();

        const start = dayjs(`${2024}-${targetMonth}-01`, "YYYY-M-D")
          .format("YYYY-MM-DD HH:mm:ss");

        const endOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

        query = `
        SELECT SUM(amount) AS total
        FROM user_cashbacks
        WHERE created_at BETWEEN ? AND ?
          AND deleted_at IS NULL
        `;
        params = [start, endOfMonth];
      } else {
        const now = dayjs();
        const targetYear = typeof year === "number" ? year : now.year();
        const targetMonth = typeof month === "number" ? month : now.month();

        const startOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .format("YYYY-MM-DD HH:mm:ss");

        const endOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

        query = `
        SELECT SUM(amount) AS total
        FROM user_cashbacks
        WHERE created_at BETWEEN ? AND ?
          AND deleted_at IS NULL
      `;
        params = [startOfMonth, endOfMonth];
      }

      const [data] = await db.query(query, params);
      return data[0]?.total || 0;
    } catch (err) {
      throw err;
    }
  },
};

export default CashbackModel;
