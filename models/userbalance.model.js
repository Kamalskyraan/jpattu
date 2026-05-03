import db from "../configs/db.js";
import dayjs from "dayjs";

const UserBalanceModel = {
  getLogs: async ({ start, end, status }) => {
    const startTime = `${start} 00:00:00`;
    const endTime = `${end} 23:59:59`;

    let query = `
    SELECT 
      GROUP_CONCAT(u.id) AS id,
      u.user_id,
      us.name,
      us.mobile,
      u.status,
      SUM(u.amount) AS amount,
      us.created_at AS joined_date,
      MAX(u.created_at) AS payment_date
    FROM user_balance_logs u
    LEFT JOIN users us 
      ON u.user_id = us.user_id
    WHERE 
      u.created_at >= ?
      AND u.created_at <= ?
      AND u.deleted_at IS NULL
  `;

    const params = [startTime, endTime];

    if (status) {
      query += ` AND u.status = ? `;
      params.push(status);
    }

    query += `
    GROUP BY 
      u.user_id,
      us.name,
      us.mobile,
      us.created_at,
      u.status
    ORDER BY payment_date DESC
  `;

    const [rows] = await db.query(query, params);

    return rows.map((row) => ({
      ...row,
      id: row.id ? row.id.split(",").map(Number) : [],
    }));
  },

  getUserLog: async ({ start, end, user_id }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query =
        "SELECT * FROM user_balance_logs WHERE user_id = ? AND created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY created_at DESC";
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  updateBalance: async (ids) => {
    try {
      const query =
        "UPDATE user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  paymentHistory: async (user_id) => {
    try {
      const query =
        "SELECT *, updated_at as received_date FROM user_balance_logs WHERE user_id = ? AND deleted_at IS NULL AND status = 'paid'";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  totalPayment: async (user_id) => {
    try {
      const startTime = dayjs().startOf("month").valueOf();
      const endTime = dayjs().endOf("month").valueOf();

      const received_amount_query =
        "SELECT SUM(amount) as amount, status, UNIX_TIMESTAMP(updated_at) * 1000 as created_at FROM user_balance_logs WHERE user_id = ? AND deleted_at IS NULL GROUP BY status, created_at";

      const [data] = await db.query(received_amount_query, [user_id]);
      const level_amount = data
        .filter(
          (val) =>  val.status === "paid" && val.created_at >= startTime && val.created_at <= endTime,
        )
        .reduce((total, val) => parseInt(total) + parseInt(val.amount), 0);
      const received_amount = data
        .filter((val) => val.status === "paid")
        .reduce((total, val) => total + Number(val.amount), 0);

      return [parseInt(level_amount), parseInt(received_amount)];
    } catch (err) {
      throw err;
    }
  },

  getTotalPayouts: async (all = false, year = null, month = null) => {
    try {
      let query = "";
      let params = [];

      if (all) {
        const now = dayjs();
        const targetYear = typeof year === "number" ? year : now.year();
        const targetMonth = typeof month === "number" ? month : now.month();

        const start = dayjs(`${2024}-${targetMonth}-01`, "YYYY-M-D").format(
          "YYYY-MM-DD HH:mm:ss",
        );

        const endOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

        query = `
        SELECT SUM(amount) AS total
        FROM user_balance_logs
        WHERE
          created_at >= ? AND created_at  <= ?
          AND deleted_at IS NULL
      `;
        params = [start, endOfMonth];
      } else {
        const now = dayjs();
        const targetYear = typeof year === "number" ? year : now.year();
        const targetMonth = typeof month === "number" ? month : now.month();

        const startOfMonth = dayjs(
          `${targetYear}-${targetMonth}-01`,
          "YYYY-M-D",
        ).format("YYYY-MM-DD HH:mm:ss");

        const endOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

        query = `
        SELECT SUM(amount) AS total
        FROM user_balance_logs
        WHERE
          created_at BETWEEN ? AND ?
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

  getLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getReceivedAmount: async (user_id) => {
    try {
      const query =
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total_amount, COUNT(*) AS total_records FROM user_balance_logs WHERE user_id = ? AND status = 'paid' AND deleted_at IS NULL GROUP BY month ORDER BY month DESC;";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },
};

export default UserBalanceModel;
