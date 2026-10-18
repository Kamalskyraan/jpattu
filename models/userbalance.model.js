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
        "SELECT SUM(amount) as amount, status, UNIX_TIMESTAMP(created_at) * 1000 as created_at FROM user_balance_logs WHERE user_id = ? AND deleted_at IS NULL GROUP BY status, created_at";

      const [data] = await db.query(received_amount_query, [user_id]);
      const level_amount = data
        .filter(
          (val) => val.created_at >= startTime && val.created_at <= endTime,
        )
        .reduce((total, val) => parseInt(total) + parseInt(val.amount), 0);
      const received_amount = data
        .filter((val) => val.status === "paid" || val.status === "unpaid")
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
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total_amount, COUNT(*) AS total_records FROM user_balance_logs WHERE user_id = ? AND deleted_at IS NULL GROUP BY month ORDER BY month DESC;";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // tt

  getTTLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM tt_user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },
  getTTLogs: async ({ start, end, status }) => {
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
    FROM tt_user_balance_logs u
    LEFT JOIN tt_users us 
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
  updateTTBalance: async (ids) => {
    try {
      const query =
        "UPDATE tt_user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getTotalTTPayouts: async (all = false, year = null, month = null) => {
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
        FROM tt_user_balance_logs
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
        FROM tt_user_balance_logs
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

  getReceivedTTAmount: async (user_id) => {
    try {
      const query =
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total_amount, COUNT(*) AS total_records FROM tt_user_balance_logs WHERE user_id = ? AND status = 'paid' AND deleted_at IS NULL GROUP BY month ORDER BY month DESC;";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  totalTTPayment: async (user_id) => {
    try {
      const startTime = dayjs().startOf("month").valueOf();
      const endTime = dayjs().endOf("month").valueOf();

      const received_amount_query =
        "SELECT SUM(amount) as amount, status, UNIX_TIMESTAMP(created_at) * 1000 as created_at FROM tt_user_balance_logs WHERE user_id = ? AND deleted_at IS NULL GROUP BY status, created_at";

      const [data] = await db.query(received_amount_query, [user_id]);
      const level_amount = data
        .filter(
          (val) => val.created_at >= startTime && val.created_at <= endTime,
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

  totalKRPayment: async (user_id) => {
    try {
      const startTime = dayjs().startOf("month").valueOf();
      const endTime = dayjs().endOf("month").valueOf();

      const received_amount_query =
        "SELECT SUM(amount) as amount, status, UNIX_TIMESTAMP(created_at) * 1000 as created_at FROM kr_user_balance_logs WHERE user_id = ? AND deleted_at IS NULL GROUP BY status, created_at";

      const [data] = await db.query(received_amount_query, [user_id]);
      const level_amount = data
        .filter(
          (val) => val.created_at >= startTime && val.created_at <= endTime,
        )
        .reduce((total, val) => parseInt(total) + parseInt(val.amount), 0);
      const received_amount = data
        .filter((val) => val.status === "paid" || val.status === "unpaid")
        .reduce((total, val) => total + Number(val.amount), 0);

      return [parseInt(level_amount), parseInt(received_amount)];
    } catch (err) {
      throw err;
    }
  },
  // RT

  getRTLogs: async ({ start, end, status }) => {
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
    FROM rpt_user_balance_logs u
    LEFT JOIN rpt_users us 
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

  updateRTBalance: async (ids) => {
    try {
      const query =
        "UPDATE rpt_user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },
  getRTLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM rpt_user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getReceivedRTAmount: async (user_id) => {
    try {
      const query =
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total_amount, COUNT(*) AS total_records FROM rpt_user_balance_logs WHERE user_id = ? AND status = 'paid' AND deleted_at IS NULL GROUP BY month ORDER BY month DESC;";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },
  // NP
  updateNPBalance: async (ids) => {
    try {
      const query =
        "UPDATE np_user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },
  getNPLogs: async ({ start, end, status }) => {
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
    FROM np_user_balance_logs u
    LEFT JOIN np_users us 
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

  getNPLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM np_user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getTotalNPPayouts: async (all = false, year = null, month = null) => {
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
        FROM np_user_balance_logs
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
        FROM np_user_balance_logs
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

  getTotalRTPayouts: async (all = false, year = null, month = null) => {
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
        FROM rpt_user_balance_logs
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
        FROM rpt_user_balance_logs
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

  // fs

  getFSLogs: async ({ start, end, status }) => {
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
    FROM fs_user_balance_logs u
    LEFT JOIN fs_users us 
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

  updateFSBalance: async (ids) => {
    try {
      const query =
        "UPDATE fs_user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getFSLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM fs_user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getTotalFSPayouts: async (all = false, year = null, month = null) => {
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
        FROM fs_user_balance_logs
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
        FROM fs_user_balance_logs
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

  // Kerchief\

  getKRLogs: async ({ start, end, status }) => {
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
    FROM kr_user_balance_logs u
    LEFT JOIN kr_users us 
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

  updateKRBalance: async (ids) => {
    try {
      const query =
        "UPDATE kr_user_balance_logs SET status = 'paid' WHERE id in (?) AND deleted_at IS NULL";
      const [data] = await db.query(query, [ids]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getReceivedKRAmount: async (user_id) => {
    try {
      // AND status = 'paid'
      const query =
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total_amount, COUNT(*) AS total_records FROM kr_user_balance_logs WHERE user_id = ?  AND deleted_at IS NULL GROUP BY month ORDER BY month DESC;";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getKRLevelIncome: async ({ user_id, start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT COUNT(*) as count, level FROM kr_user_relations WHERE ancestor_id = ? AND created_at >= ? AND created_at <= ? GROUP BY level`;
      const [data] = await db.query(query, [user_id, startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getTotalKRPayouts: async (all = false, year = null, month = null) => {
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
        FROM kr_user_balance_logs
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
        FROM kr_user_balance_logs
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

  getBankLogs: async ({ name = "", mobile = "" }) => {
    let query = `
    SELECT
      DATE_FORMAT(u.created_at, '%Y-%m') AS month,
      DATE_FORMAT(u.created_at, '%M %Y') AS month_name,
      SUM(u.amount) AS amount
    FROM kr_user_balance_logs u

    LEFT JOIN kr_users us
      ON u.user_id = us.user_id

    WHERE
      u.deleted_at IS NULL
  `;

    const params = [];

    // Optional name filter
    if (name) {
      query += ` AND us.name LIKE ? `;
      params.push(`%${name}%`);
    }

    // Optional mobile filter
    if (mobile) {
      query += ` AND us.mobile LIKE ? `;
      params.push(`%${mobile}%`);
    }

    query += `
    GROUP BY
      DATE_FORMAT(u.created_at, '%Y-%m'),
      DATE_FORMAT(u.created_at, '%M %Y')

    ORDER BY
      DATE_FORMAT(u.created_at, '%Y-%m') ASC
  `;

    const [rows] = await db.query(query, params);

    let cumulativeAmount = 0;

    return rows.map((row) => {
      const amount = Number(row.amount || 0);

      cumulativeAmount += amount;

      return {
        month: row.month,
        month_name: row.month_name,
        amount,
        cumulative_amount: cumulativeAmount,
      };
    });
  },

  getDSBankLogs: async ({ name = "", mobile = "" }) => {
    let query = `
    SELECT
      DATE_FORMAT(ubl.created_at, '%Y-%m') AS month,
      DATE_FORMAT(ubl.created_at, '%M %Y') AS month_name,
      SUM(ubl.amount) AS amount
    FROM user_balance_logs AS ubl

    LEFT JOIN users AS us
      ON ubl.user_id = us.user_id

    WHERE ubl.deleted_at IS NULL
  `;

    const params = [];

    if (name) {
      query += ` AND us.name LIKE ? `;
      params.push(`%${name}%`);
    }

    if (mobile) {
      query += ` AND us.mobile LIKE ? `;
      params.push(`%${mobile}%`);
    }

    query += `
    GROUP BY
      DATE_FORMAT(ubl.created_at, '%Y-%m'),
      DATE_FORMAT(ubl.created_at, '%M %Y')

    ORDER BY
      DATE_FORMAT(ubl.created_at, '%Y-%m') ASC
  `;

    const [rows] = await db.query(query, params);

    let cumulativeAmount = 0;

    return rows.map((row) => {
      const amount = Number(row.amount || 0);

      cumulativeAmount += amount;

      return {
        month: row.month,
        month_name: row.month_name,
        amount,
        cumulative_amount: cumulativeAmount,
      };
    });
  },

  getClubPayKR: async ({ start, end, status }) => {
    const startTime = `${start} 00:00:00`;
    const endTime = `${end} 23:59:59`;

    const query = `
    SELECT
      MIN(us.id) AS id,
      COUNT(DISTINCT us.id) AS club_ids,
      us.name,
      us.mobile,

      MAX(
        CAST(SUBSTRING(TRIM(us.user_id), 3) AS UNSIGNED)
      ) AS sort_user_id,

      YEAR(?) AS year,
      MONTH(?) AS month,

      COALESCE(SUM(u.amount), 0) AS amount,
      MAX(u.created_at) AS payment_date

    FROM kr_users us

    LEFT JOIN kr_user_balance_logs u
      ON u.user_id = us.user_id
      AND u.created_at >= ?
      AND u.created_at <= ?
      AND u.deleted_at IS NULL
      ${status ? "AND u.status = ?" : ""}

    GROUP BY
      us.name,
      us.mobile

    ORDER BY
      sort_user_id DESC,
      id DESC
  `;

    const params = [startTime, startTime, startTime, endTime];

    if (status) {
      params.push(status);
    }

    const [rows] = await db.query(query, params);

    return rows.map((row) => ({
      ...row,
      id: Number(row.id),
      club_ids: Number(row.club_ids),
      sort_user_id: Number(row.sort_user_id),
      amount: Number(row.amount),
      month: Number(row.month),
      year: Number(row.year),
    }));
  },

  getClubPayDS: async ({ start, end, status }) => {
    const startTime = `${start} 00:00:00`;
    const endTime = `${end} 23:59:59`;

    let query = `
    SELECT
      MIN(us.id) AS id,
      COUNT(DISTINCT us.id) AS club_ids,
      us.name,
      us.mobile,

      YEAR(?) AS year,
      MONTH(?) AS month,

      COALESCE(SUM(u.amount), 0) AS amount,
      MAX(u.created_at) AS payment_date

    FROM users us

    LEFT JOIN user_balance_logs u
      ON u.user_id = us.user_id
      AND u.created_at >= ?
      AND u.created_at <= ?
      AND u.deleted_at IS NULL
      ${status ? "AND u.status = ?" : ""}

    GROUP BY
      us.name,
      us.mobile

    ORDER BY
      us.user_id DESC
  `;

    const params = [startTime, startTime, startTime, endTime];

    if (status) {
      params.push(status);
    }

    const [rows] = await db.query(query, params);

    return rows.map((row) => ({
      ...row,
      id: Number(row.id),
      club_ids: Number(row.club_ids),
      amount: Number(row.amount),
      month: Number(row.month),
      year: Number(row.year),
    }));
  },

  getAccountsDS: async ({ start, end, status }) => {
    const query = `
    SELECT
        g.id,
        g.club_ids,
        g.name,
        g.mobile,

        COALESCE(b.bank_amount, 0) AS bank_amount,

        COALESCE(p.paid_count, 0) AS paid_count,
        COALESCE(p.paid_amount, 0) AS paid_amount,

        COALESCE(b.bank_amount, 0)
          - COALESCE(p.paid_amount, 0) AS balance_amount,

        g.txn_id,
        g.bank_name,
        g.holder_name,
        g.account_number,
        g.ifsc_code,
        g.pancard,
        g.branch,

        p.last_payment_id,
        p.last_payment_amount,
        p.payment_date

    FROM (
        SELECT
            MIN(u.id) AS id,
            COUNT(DISTINCT u.id) AS club_ids,
            u.name,
            u.mobile,

            MAX(u.txn_id) AS txn_id,
            MAX(u.bank_name) AS bank_name,
            MAX(u.holder_name) AS holder_name,
            MAX(u.account_number) AS account_number,
            MAX(u.pancard) AS pancard,
            MAX(u.ifsc_code) AS ifsc_code,
            MAX(u.branch) AS branch

        FROM users u
        GROUP BY u.name, u.mobile
    ) g

    LEFT JOIN (
        SELECT
            us.name,
            us.mobile,
            COALESCE(SUM(ubl.amount), 0) AS bank_amount

        FROM users us
        INNER JOIN user_balance_logs ubl
            ON ubl.user_id = us.user_id

        WHERE ubl.deleted_at IS NULL

        GROUP BY us.name, us.mobile
    ) b
        ON b.name = g.name
       AND b.mobile = g.mobile

    LEFT JOIN (
        SELECT
            us.name,
            us.mobile,

            COUNT(ubl.id) AS paid_count,
            COALESCE(SUM(ubl.amount), 0) AS paid_amount,

            MAX(ubl.id) AS last_payment_id,
            MAX(ubl.created_at) AS payment_date,

            SUBSTRING_INDEX(
                GROUP_CONCAT(
                    ubl.amount
                    ORDER BY ubl.created_at DESC, ubl.id DESC
                ),
                ',',
                1
            ) AS last_payment_amount

        FROM users us
        INNER JOIN user_balance_logs ubl
            ON ubl.user_id = us.user_id

        WHERE ubl.deleted_at IS NULL
          AND ubl.status = 'paid'

        GROUP BY us.name, us.mobile
    ) p
        ON p.name = g.name
       AND p.mobile = g.mobile

    ORDER BY g.id DESC;
  `;

    const [rows] = await db.query(query);

    return rows.map((row) => ({
      ...row,
      id: Number(row.id),
      club_ids: Number(row.club_ids),
      bank_amount: Number(row.bank_amount),
      paid_count: Number(row.paid_count),
      paid_amount: Number(row.paid_amount),
      balance_amount: Number(row.balance_amount),
      last_payment_id: row.last_payment_id ? Number(row.last_payment_id) : null,
      last_payment_amount: Number(row.last_payment_amount || 0),
    }));
  },

  getAccountsKR: async ({ start, end, status, minBalance = 100 }) => {
    const query = `
    SELECT
      g.id,
      g.club_ids,
      g.name,
      g.mobile,

      COALESCE(b.bank_amount, 0) AS bank_amount,

      FLOOR(
        GREATEST(COALESCE(b.bank_amount, 0), 0) / 1000
      ) AS new_id,

      COALESCE(p.paid_count, 0) AS paid_count,
      COALESCE(p.paid_amount, 0) AS paid_amount,

      COALESCE(b.bank_amount, 0)
        - COALESCE(p.paid_amount, 0) AS balance_amount,

      g.txn_id,
      g.bank_name,
      g.holder_name,
      g.account_number,
      g.ifsc_code,
      g.pancard,
      g.branch,

      p.last_payment_id,
      p.last_payment_amount,
      p.payment_date

    FROM (
      SELECT
        MIN(u.id) AS id,
        COUNT(DISTINCT u.id) AS club_ids,
        u.name,
        u.mobile,

        MAX(u.txn_id) AS txn_id,
        MAX(u.bank_name) AS bank_name,
        MAX(u.holder_name) AS holder_name,
        MAX(u.account_number) AS account_number,
        MAX(u.pancard) AS pancard,
        MAX(u.ifsc_code) AS ifsc_code,
        MAX(u.branch) AS branch

      FROM kr_users u
      GROUP BY u.name, u.mobile
    ) g

    LEFT JOIN (
      SELECT
        us.name,
        us.mobile,
        COALESCE(SUM(ubl.amount), 0) AS bank_amount

      FROM kr_users us
      INNER JOIN kr_user_balance_logs ubl
        ON ubl.user_id = us.user_id

      WHERE ubl.deleted_at IS NULL
        AND (? IS NULL OR ubl.created_at >= ?)
        AND (? IS NULL OR ubl.created_at < DATE_ADD(?, INTERVAL 1 DAY))

      GROUP BY us.name, us.mobile
    ) b
      ON b.name = g.name
     AND b.mobile = g.mobile

    LEFT JOIN (
      SELECT
        us.name,
        us.mobile,

        COUNT(ubl.id) AS paid_count,
        COALESCE(SUM(ubl.amount), 0) AS paid_amount,

        SUBSTRING_INDEX(
          GROUP_CONCAT(
            ubl.id ORDER BY ubl.created_at DESC, ubl.id DESC
          ),
          ',',
          1
        ) AS last_payment_id,

        MAX(ubl.created_at) AS payment_date,

        SUBSTRING_INDEX(
          GROUP_CONCAT(
            ubl.amount ORDER BY ubl.created_at DESC, ubl.id DESC
          ),
          ',',
          1
        ) AS last_payment_amount

      FROM kr_users us
      INNER JOIN kr_user_balance_logs ubl
        ON ubl.user_id = us.user_id

      WHERE ubl.deleted_at IS NULL
        AND ubl.status = 'paid'
        AND (? IS NULL OR ubl.created_at >= ?)
        AND (? IS NULL OR ubl.created_at < DATE_ADD(?, INTERVAL 1 DAY))

      GROUP BY us.name, us.mobile
    ) p
      ON p.name = g.name
     AND p.mobile = g.mobile

    WHERE COALESCE(b.bank_amount, 0)
        - COALESCE(p.paid_amount, 0) > ?

    ORDER BY g.id DESC
  `;

    const dateParams = [start || null, start || null, end || null, end || null];

    const [rows] = await db.query(query, [
      ...dateParams,
      ...dateParams,
      minBalance,
    ]);

    return rows.map((row) => ({
      ...row,
      id: Number(row.id),
      club_ids: Number(row.club_ids),
      bank_amount: Number(row.bank_amount),

      // New ID
      new_id: Number(row.new_id || 0),

      paid_count: Number(row.paid_count),
      paid_amount: Number(row.paid_amount),
      balance_amount: Number(row.balance_amount),

      last_payment_id: row.last_payment_id ? Number(row.last_payment_id) : null,

      last_payment_amount: Number(row.last_payment_amount || 0),
    }));
  },

  markSelectedKRAccountsPaid: async (users) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      let totalUpdated = 0;

      for (const user of users) {
        const name = String(user.name ?? "").trim();
        const mobile = String(user.mobile ?? "").trim();

        if (!name || !mobile) {
          throw new Error("Name and mobile are required");
        }

        // Get all matching KR user IDs
        const [userRows] = await connection.query(
          `
        SELECT DISTINCT user_id
        FROM kr_users
        WHERE name = ?
          AND mobile = ?
          AND deleted_at IS NULL
        `,
          [name, mobile],
        );

        if (!userRows.length) {
          throw new Error(`No matching KR users found for ${name}`);
        }

        const userIds = userRows.map((row) => row.user_id);

        const placeholders = userIds.map(() => "?").join(",");

        // Update only unpaid logs
        const [result] = await connection.query(
          `
        UPDATE kr_user_balance_logs
        SET status = 'paid'
        WHERE user_id IN (${placeholders})
          AND status = 'unpaid'
          AND deleted_at IS NULL
        `,
          userIds,
        );

        totalUpdated += result.affectedRows;
      }

      await connection.commit();

      return {
        updatedCount: totalUpdated,
        selectedUsers: users.length,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  markSelectedAccountsPaid: async (users) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      let totalUpdated = 0;

      for (const user of users) {
        const name = String(user.name ?? "").trim();
        const mobile = String(user.mobile ?? "").trim();

        if (!name || !mobile) {
          throw new Error("Name and mobile are required");
        }

        // Get all matching KR user IDs
        const [userRows] = await connection.query(
          `
        SELECT DISTINCT user_id
        FROM users
        WHERE name = ?
          AND mobile = ?
          AND deleted_at IS NULL
        `,
          [name, mobile],
        );

        if (!userRows.length) {
          throw new Error(`No matching DS users found for ${name}`);
        }

        const userIds = userRows.map((row) => row.user_id);

        const placeholders = userIds.map(() => "?").join(",");

        // Update only unpaid logs
        const [result] = await connection.query(
          `
        UPDATE user_balance_logs
        SET status = 'paid'
        WHERE user_id IN (${placeholders})
          AND status = 'unpaid'
          AND deleted_at IS NULL
        `,
          userIds,
        );

        totalUpdated += result.affectedRows;
      }

      await connection.commit();

      return {
        updatedCount: totalUpdated,
        selectedUsers: users.length,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  markPreviousMonthKRLogsPaid: async () => {
    const connection = await db.getConnection();
    let transactionStarted = false;

    try {
      // Get current year and month in Indian Standard Time.
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
      }).formatToParts(new Date());

      const year = Number(parts.find((p) => p.type === "year").value);

      const month = Number(parts.find((p) => p.type === "month").value);

      const formatDate = (date) =>
        `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
          2,
          "0",
        )}-01`;

      // First day of current month.
      const currentMonthStart = `${year}-${String(month).padStart(2, "0")}-01`;

      // First day of previous month.
      const previousMonthStart = formatDate(
        new Date(Date.UTC(year, month - 2, 1)),
      );

      await connection.beginTransaction();
      transactionStarted = true;

      const [result] = await connection.query(
        `
      UPDATE kr_user_balance_logs
      SET status = 'paid'
      WHERE status = 'unpaid'
        AND deleted_at IS NULL
        AND created_at >= ?
        AND created_at < ?
      `,
        [previousMonthStart, currentMonthStart],
      );

      await connection.commit();
      transactionStarted = false;

      return {
        updatedCount: result.affectedRows,
        periodStart: previousMonthStart,
        periodEnd: currentMonthStart,
      };
    } catch (error) {
      if (transactionStarted) {
        await connection.rollback();
      }

      throw error;
    } finally {
      connection.release();
    }
  },

  getUnpaidAccountsBelow99: async () => {
    const query = `
    SELECT
      MIN(u.id) AS id,
      COUNT(DISTINCT u.id) AS club_ids,
      u.name,
      u.mobile,
      COALESCE(SUM(ubl.amount), 0) AS payouts,
      COALESCE(SUM(ubl.amount), 0) AS balance_amount
    FROM kr_users u
    INNER JOIN kr_user_balance_logs ubl
      ON ubl.user_id = u.user_id
    WHERE ubl.deleted_at IS NULL
      AND ubl.status = 'unpaid'
    GROUP BY
      u.name,
      u.mobile
    HAVING SUM(ubl.amount) > 0
       AND SUM(ubl.amount) < 99
    ORDER BY MIN(u.id) DESC
  `;

    const [rows] = await db.query(query);

    return rows.map((row) => ({
      ...row,
      id: Number(row.id),
      club_ids: Number(row.club_ids),
      payouts: Number(row.payouts),
      balance_amount: Number(row.balance_amount),
    }));
  },
};

export default UserBalanceModel;
