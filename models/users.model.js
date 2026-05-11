import db from "../configs/db.js";
import { sendAdminMail, sendMail } from "../helpers/mail.js";
import dayjs from "dayjs";

export const TempUserModel = {
  getUser: async (user_id) => {
    try {
      const query = `SELECT 
                      u.id, 
                      u.user_id, 
                      u.name, 
                      u.mobile, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.txn_id,
                      u.duplicate_txn_id,
                      u.email,
                      u.referral_id,
                      u.approved,
                      u.pancard,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM temp_users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id = ? AND u.deleted_at IS NULL`;
      const [data] = await db.query(query, [user_id]);

      const updatedData = data.map((val) => ({
        ...val,
        account_number: "",
        holder_name: "",
        ifsc_code: "",
        branch: "",
        status: "Pending",
      }));
      return updatedData;
    } catch (err) {
      throw err;
    }
  },

  getAllUsers: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query = `SELECT 
                      u.id, 
                      u.user_id, 
                      u.name, 
                      u.mobile, 
                      u.screenshot,
                      u.password,
                      u.email,
                      u.txn_id,
                      u.duplicate_txn_id,
                      u.approved,
                      IFNULL(r.user_id, a.user_id) AS referral_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM temp_users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.created_at >= ? AND u.created_at <= ? AND u.deleted_at is NULL AND u.approved = 0 ORDER BY u.created_at DESC`;
      const [data] = await db.query(query, [startTime, endTime]);

      const updatedData = data.map((val) => ({
        ...val,
        address: "",
        account_number: "",
        holder_name: "",
        ifsc_code: "",
        branch: "",
        status: "Pending",
      }));
      return updatedData;
    } catch (err) {
      throw err;
    }
  },

  getLastUser: async () => {
    try {
      const query = "SELECT user_id from temp_users ORDER BY id DESC LIMIT 1";
      const [id] = await db.query(query);
      if (id[0]?.user_id) {
        return id[0].user_id;
      } else {
        return "TM0";
      }
    } catch (err) {
      throw err;
    }
  },

  // TT
  getLastTargetUser: async () => {
    try {
      const query =
        "SELECT user_id from tt_temp_users ORDER BY id DESC LIMIT 1";
      const [id] = await db.query(query);
      if (id[0]?.user_id) {
        return id[0].user_id;
      } else {
        return "TM0";
      }
    } catch (err) {
      throw err;
    }
  },

  getAllUsersTT: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query = `SELECT 
                      u.id, 
                      u.user_id, 
                      u.name, 
                      u.mobile, 
                      u.screenshot,
                      u.password,
                      u.email,
                      u.txn_id,
                      u.duplicate_txn_id,
                      u.approved,
                      IFNULL(r.user_id, a.user_id) AS referral_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM tt_temp_users u
                    LEFT JOIN tt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.created_at >= ? AND u.created_at <= ? AND u.deleted_at is NULL AND u.approved = 0 ORDER BY u.created_at DESC`;
      const [data] = await db.query(query, [startTime, endTime]);

      const updatedData = data.map((val) => ({
        ...val,
        address: "",
        account_number: "",
        holder_name: "",
        ifsc_code: "",
        branch: "",
        status: "Pending",
      }));
      return updatedData;
    } catch (err) {
      throw err;
    }
  },

  //

  addUser: async (data) => {
    try {
      const lastId = await TempUserModel.getLastUser();
      const value = lastId.length > 0 ? lastId.split("TM")[1] : 0;
      const newValue = ((parseInt(value) || 0) + 1).toString();
      const newId = "TM" + newValue;

      const referrarQuery =
        "SELECT * FROM users WHERE user_id = ? AND deleted_at IS NULL";
      let [referrar] = await db.query(referrarQuery, [data.referral_id]);
      if (referrar.length === 0) {
        const referrarQuery =
          "SELECT * FROM admin WHERE user_id = ? AND deleted_at IS NULL";
        [referrar] = await db.query(referrarQuery, [data.referral_id]);
        if (!referrar[0]?.id) {
          throw new Error("referrer not found");
        } else if (referrar[0].status === "Queued") {
          throw new Error("Referrar is in Queue");
        }
      }

      const query =
        "INSERT INTO temp_users (referral_id, user_id, name, mobile, email, password, txn_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db.query(query, [
        data.referral_id,
        newId,
        data.name,
        data.mobile,
        data.email || "",
        data.password,
        data.txn_id,
      ]);

      return newId;
    } catch (err) {
      throw err;
    }
  },

  paidProof: async ({ user_id, image, txn_id }) => {
    try {
      const [data] = await TempUserModel.getUser(user_id);
      if (!data) return false;

      if (!image) {
        const updateQuery = `
        UPDATE temp_users 
        SET txn_id = ?
        WHERE user_id = ?;
        `;
        await db.query(updateQuery, [txn_id, user_id]);
      } else if (!txn_id) {
        const updateQuery = `
        UPDATE temp_users 
        SET screenshot = ?
        WHERE user_id = ?;
        `;
        await db.query(updateQuery, [image, user_id]);
      }

      const checkQuery = `
        SELECT user_id 
        FROM temp_users 
        WHERE txn_id = ? AND user_id != ? 
        UNION 
        SELECT user_id 
        FROM users 
        WHERE txn_id = ?;`;
      const [duplicates] = await db.query(checkQuery, [
        txn_id,
        user_id,
        txn_id,
      ]);

      if (duplicates.length > 0) {
        const markDupesQuery = `
          UPDATE temp_users 
          SET duplicate_txn_id = TRUE 
          WHERE txn_id = ?;
        `;
        await db.query(markDupesQuery, [txn_id]);
      }

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deleteUser: async (id) => {
    try {
      const query =
        "UPDATE temp_users SET deleted_at = NOW() WHERE user_id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  // TT

  addTargetUser: async (data) => {
    try {
      const lastId = await TempUserModel.getLastTargetUser();
      const value = lastId.length > 0 ? lastId.split("TE")[1] : 0;
      const newValue = ((parseInt(value) || 0) + 1).toString();
      const newId = "TE" + newValue;

      const referrarQuery =
        "SELECT * FROM tt_users WHERE user_id = ? AND deleted_at IS NULL";

      let [referrar] = await db.query(referrarQuery, [data.referral_id]);
      if (referrar.length === 0) {
        const referrarQuery =
          "SELECT * FROM admin WHERE user_id = ? AND deleted_at IS NULL";
        [referrar] = await db.query(referrarQuery, [data.referral_id]);
        if (!referrar[0]?.id) {
          throw new Error("referrer not found");
        } else if (referrar[0].status === "Queued") {
          throw new Error("Referrar is in Queue");
        }
      }

      const query =
        "INSERT INTO tt_temp_users (referral_id, user_id, name, mobile, email, password, txn_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db.query(query, [
        data.referral_id,
        newId,
        data.name,
        data.mobile,
        data.email || "",
        data.password,
        data.txn_id,
      ]);

      return newId;
    } catch (err) {
      throw err;
    }
  },
};

export const UserModel = {
  getUserName: async (referral_id) => {
    try {
      const query =
        "SELECT user_id, name, user_id, status FROM users WHERE user_id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [referral_id]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getUser: async (user_id) => {
    try {
      const query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.pancard,
                      u.screenshot,
                      u.password,
                      u.address,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      u.referral_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id = ? AND u.deleted_at IS NULL;`;
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getQueuedUsers: async () => {
    try {
      const query = `SELECT 
                      id,
                      user_id,
                      name, 
                      mobile, 
                      status,
                      email,
                      password,
                      screenshot,
                      address,
                      referral_id,
                      account_number,
                      bank_name,
                      holder_name,
                      ifsc_code,
                      txn_id,
                      branch,
                      UNIX_TIMESTAMP(created_at) as created,
                      created_at
                      FROM users
                    WHERE status = "Queued" AND deleted_at IS NULL`;
      const [data] = await db.query(query);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getAllUsers: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.pancard,
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.txn_id,
                      u.branch,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.created_at >= ? AND u.created_at <= ? AND u.deleted_at IS NULL ORDER BY u.created_at DESC`;
      const [data] = await db.query(query, [startTime, endTime]);
      const updatedData = data.map((val) => ({ ...val, duplicate_txn_id: 0 }));
      return updatedData;
    } catch (err) {
      throw err;
    }
  },

  getLastUser: async () => {
    try {
      const query = "SELECT user_id from users ORDER BY id DESC LIMIT 1";
      const [id] = await db.query(query);
      if (id[0]?.user_id) {
        return id[0].user_id;
      } else {
        return "DS0";
      }
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (data) => {
    let column;

    if (data.user_type === "users") {
      column = [
        "name",
        "mobile",
        "email",
        "status",
        "address",
        "pancard",
        "bank_name",
        "holder_name",
        "account_number",
        "ifsc_code",
        "branch",
      ];
    } else {
      column = ["name", "mobile", "email", "address", "pancard"];
    }

    let keys = [];
    let values = [];

    column.forEach((val) => {
      if (data[val]) {
        keys.push(`${val} = ?`);
        values.push(data[val].trim());
      }
    });

    if (data.referral_id && data.role === "admin") {
      keys.push("referral_id = ?");
      values.push(data.referral_id);
    }

    if (data.password && data.role === "admin") {
      keys.push("password = ?");
      values.push(data.password);
    }

    if (keys.length === 0) {
      return false;
    }

    const list = keys.join(", ");
    const query = `UPDATE ${
      data.user_type === "users" ? "users" : "temp_users"
    } SET ${list} WHERE user_id = ?`;
    await db.query(query, [...values, data.user_id]);
    return true;
  },

  approveUser: async (user_ids) => {
    try {
      await db.beginTransaction();
      const ids = [];

      const lastId = await UserModel.getLastUser();
      let baseId = lastId.length > 0 ? parseInt(lastId.split("DS")[1]) : 0;
      user_ids.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      );

      for (const temp_user_id of user_ids) {
        const [[user]] = await db.query(
          "SELECT * FROM temp_users WHERE user_id = ? AND approved = 0 AND deleted_at IS NULL",
          [temp_user_id],
        );

        if (!user) continue;

        const [[referrer]] = await db.query(
          `SELECT user_id, 'user' as role FROM users WHERE user_id = ?
         UNION
         SELECT user_id, role FROM admin WHERE user_id = ?`,
          [user.referral_id, user.referral_id],
        );

        let status = "Approved";

        const [[{ count }]] = await db.query(
          "SELECT COUNT(*) as count FROM users WHERE referral_id = ?",
          [referrer.user_id],
        );
        if (referrer?.role === "admin" && count !== 0) {
          status = "Queued";
        } else if (referrer?.role !== "admin" && count >= 2) status = "Queued";

        baseId += 1;
        const newId = "DS" + baseId.toString();

        await db.query(
          `INSERT INTO users 
        (referral_id, user_id, name, mobile, email, address, password, status, txn_id, screenshot)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            referrer?.user_id,
            newId,
            user.name,
            user.mobile,
            user.email,
            user.address,
            user.password,
            status,
            user.txn_id,
            user.screenshot,
          ],
        );

        await db.query(
          "INSERT INTO user_cashbacks (user_id, amount, status) VALUES (?, ?, ?)",
          [newId, 0, "paid"],
        );

        if (status === "Approved" && referrer?.role === "user") {
          // Add direct relation
          await db.query(
            "INSERT INTO user_relations (ancestor_id, descendant_id, level) VALUES (?, ?, 1)",
            [referrer.user_id, newId],
          );

          // Add upper relations
          await db.query(
            `INSERT INTO user_relations (ancestor_id, descendant_id, level)
     SELECT ancestor_id, ?, level + 1
     FROM user_relations
     WHERE descendant_id = ? AND ancestor_id IS NOT NULL`,
            [newId, referrer.user_id],
          );

          // Level 1 payout = 100
          await db.query(
            `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
     VALUES (?, ?, 100, 'unpaid')`,
            [referrer.user_id, newId],
          );

          // Level 2–8 payout = 10
          await db.query(
            `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
     SELECT ancestor_id, ?, 10, 'unpaid'
     FROM user_relations
     WHERE descendant_id = ? AND level BETWEEN 2 AND 8`,
            [newId, newId],
          );

          // Level 9+ payout = 100
          await db.query(
            `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
     SELECT ancestor_id, ?, 185, 'unpaid'
     FROM user_relations
     WHERE descendant_id = ? AND level >= 9`,
            [newId, newId],
          );
        }

        await db.query("UPDATE temp_users SET approved = 1 WHERE user_id = ?", [
          temp_user_id,
        ]);

        if (user.email) {
          user.user_id = newId;
          user.referral_id = referrer.user_id;
          sendMail(user);
        }
        await sendAdminMail(user);
        ids.push({
          new_id: newId,
          user_id: temp_user_id,
          mobile: user.mobile,
          name: user.name,
          sponsor_id: referrer.user_id,
          password: user.password,
          status,
        });
      }

      await db.commit();
      return ids;
    } catch (err) {
      console.error("approveUser error:", err);
      await db.rollback();
      throw err;
    }
  },

  getSales: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query =
        "SELECT id, referral_id, user_id, name, mobile, 1000 as amount, created_at as purchase_date FROM users WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY created_at DESC";
      const [data] = await db.query(query, [startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getUsersCount: async (
    timeline = false,
    year = null,
    month = null,
    all = false,
  ) => {
    try {
      let startOfMonth, endOfMonth;

      if (all && typeof year === "number" && typeof month === "number") {
        startOfMonth = dayjs(`${2025}-1-01`, "YYYY-M-D")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        endOfMonth = dayjs(`${year}-${month}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (typeof year === "number" && typeof month === "number") {
        startOfMonth = dayjs(`${year}-${month}-01`, "YYYY-M-D")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        endOfMonth = dayjs(`${year}-${month}-01`, "YYYY-M-D")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        const now = dayjs();
        startOfMonth = now.startOf("month").format("YYYY-MM-DD HH:mm:ss");
        endOfMonth = now.endOf("month").format("YYYY-MM-DD HH:mm:ss");
      }

      let query = "",
        params = [];

      if (timeline) {
        query = `
        SELECT COUNT(*) as user_count
        FROM users
        WHERE deleted_at IS NULL
          AND created_at >= ? AND created_at <= ?
      `;
        params = [startOfMonth, endOfMonth];
      } else {
        query = `
        SELECT COUNT(*) as user_count
        FROM users
        WHERE deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].user_count || 0;
    } catch (err) {
      throw err;
    }
  },

  getUserStatus: async (timeline = false, year = null, month = null) => {
    try {
      let activeQuery = "",
        inActiveQuery = "",
        queuedQuery = "",
        activeParams = [],
        inactiveParams = [],
        queuedParams = [];

      if (timeline) {
        const now = dayjs();
        const targetYear = typeof year === "number" ? year : now.year();
        const targetMonth = typeof month === "number" ? month : now.month();

        const startOfMonth = dayjs(
          `${targetYear}-${targetMonth}-01`,
          "YYYY-M-D",
        )
          //   .subtract(5, "hour")
          //   .subtract(30, "minute")
          .format("YYYY-MM-DD HH:mm:ss");

        const endOfMonth = dayjs(`${targetYear}-${targetMonth}-01`, "YYYY-M-D")
          .endOf("month")
          //   .subtract(5, "hour")
          //   .subtract(30, "minute")
          .format("YYYY-MM-DD HH:mm:ss");

        // Queries for specific month
        activeQuery = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE deleted_at IS NULL
          AND status = 'Approved'
          AND created_at BETWEEN ? AND ?
      `;
        activeParams = [startOfMonth, endOfMonth];

        inActiveQuery = `
        SELECT COUNT(*) AS count
        FROM temp_users
        WHERE deleted_at IS NULL
          AND approved = 0
          AND created_at BETWEEN ? AND ?
      `;
        inactiveParams = [startOfMonth, endOfMonth];

        queuedQuery = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE deleted_at IS NULL
          AND status = 'Queued'
          AND created_at BETWEEN ? AND ?
      `;
        queuedParams = [startOfMonth, endOfMonth];
      } else {
        // All-time queries
        activeQuery = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE deleted_at IS NULL
          AND status = 'Approved'
      `;
        inActiveQuery = `
        SELECT COUNT(*) AS count
        FROM temp_users
        WHERE deleted_at IS NULL
          AND approved = 0
      `;
        queuedQuery = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE deleted_at IS NULL
          AND status = 'Queued'
      `;
      }

      const [activeData] = await db.query(activeQuery, activeParams);
      const [inActiveData] = await db.query(inActiveQuery, inactiveParams);
      const [queueData] = await db.query(queuedQuery, queuedParams);

      return [
        activeData[0]?.count || 0,
        inActiveData[0]?.count || 0,
        queueData[0]?.count || 0,
      ];
    } catch (err) {
      throw err;
    }
  },

  addQueuedUser: async (user_id, referral_id) => {
    try {
      db.beginTransaction();
      const query =
        "SELECT * FROM users WHERE user_id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [user_id]);

      if (data.length === 0) {
        return false;
      }

      const referrar_query =
        "SELECT * FROM users WHERE user_id = ? AND status = 'Approved' AND deleted_at IS NULL";
      const [referrar_data] = await db.query(referrar_query, [referral_id]);

      if (referrar_data.length === 0) {
        return false;
      }

      const updatedQuery =
        "UPDATE users SET referral_id = ?, status = 'Approved' WHERE user_id = ?";
      await db.query(updatedQuery, [referral_id, user_id]);

      //Make relations
      const relationQuery1 = `INSERT INTO user_relations (ancestor_id, descendant_id, level)
                                VALUES (?, ?, 1);`;
      await db.query(relationQuery1, [referral_id, user_id]);
      const relationQuery = `INSERT INTO user_relations (ancestor_id, descendant_id, level)
                                SELECT
                                  ancestor_id,
                                  ? AS descendant_id,
                                  level + 1
                                  FROM user_relations
                                  WHERE descendant_id = ?
                                  AND level < 9 AND ancestor_id IS NOT NULL`;
      await db.query(relationQuery, [user_id, referral_id]);

      //Add amount to every parent
      const amountQuery1 = `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
            VALUES (?, ?, 100, 'unpaid');`;
      await db.query(amountQuery1, [referral_id, user_id]);

      const amountQuery = `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
                              SELECT
                              ancestor_id,
                              ? AS descendant_id,
                              10 AS amount,
                              'unpaid' AS status
                              FROM user_relations
                              WHERE descendant_id = ?
                              AND level < 8;`;
      await db.query(amountQuery, [user_id, referral_id]);

      const bonusQuery = `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
                              SELECT
                              ancestor_id,
                              ? AS descendant_id,
                              185 AS amount,
                              'unpaid' AS status
                              FROM user_relations
                              WHERE descendant_id = ?
                              AND level = 8;`;
      await db.query(bonusQuery, [user_id, referral_id]);
      db.commit();
      return true;
    } catch (err) {
      db.rollback();
      throw err;
    }
  },

  allUserPayouts: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT 
                      combined.user_id,
                      u.name,
                      u.mobile,
                      u.created_at AS joining_date,
                      "paid" as status,
                      SUM(combined.level_amount) AS level_amount,
                      SUM(combined.cashback_amount) AS cashback_amount,
                      MAX(combined.payment_date) AS payment_date
                    FROM (
                      SELECT 
                        b.user_id,
                        SUM(b.amount) AS level_amount,
                        0 AS cashback_amount,
                        MAX(b.created_at) AS payment_date
                      FROM user_balance_logs b
                      WHERE b.created_at BETWEEN ? AND ?
                        AND b.status = 'paid'
                        AND b.deleted_at IS NULL
                      GROUP BY b.user_id

                      UNION ALL

                      SELECT 
                        c.user_id,
                        0 AS level_amount,
                        SUM(c.amount) AS cashback_amount,
                        MAX(c.created_at) AS payment_date
                      FROM user_cashbacks c
                      WHERE c.created_at BETWEEN ? AND ?
                        AND c.status = 'paid'
                        AND c.deleted_at IS NULL
                      GROUP BY c.user_id
                    ) AS combined
                    LEFT JOIN users u ON u.user_id = combined.user_id
                    GROUP BY combined.user_id
                    ORDER BY payment_date DESC;
                    `;
      const [data] = await db.query(query, [
        startTime,
        endTime,
        startTime,
        endTime,
      ]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  hasMembers: async (user_id) => {
    try {
      const query = "SELECT user_id from users WHERE referral_id = ? LIMIT 1";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  addPackageToUser: async ({ user_data, level }) => {
    try {
      await db.beginTransaction();

      let currentLevel = [user_data.user_id];
      let new_ids = [];
      console.log("level", level);
      const status = "Approved";
      const cashbackStatus = "paid";
      const amount = 0;

      const lastId = await UserModel.getLastUser();
      let value = lastId.length > 0 ? parseInt(lastId.split("DS")[1]) : 0;

      for (let i = 1; i <= level; i++) {
        const nextLevel = [];

        for (const referrer_id of currentLevel) {
          for (let j = 0; j < 2; j++) {
            value += 1;
            const newId = "DS" + value.toString();

            const userQuery = `INSERT INTO users
              (referral_id, user_id, name, mobile, email, address, password, status, bank_name, holder_name, account_number, ifsc_code, branch)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            await db.query(userQuery, [
              referrer_id,
              newId,
              user_data.name,
              user_data.mobile,
              user_data.email,
              user_data.address,
              user_data.password,
              status,
              user_data.bank_name,
              user_data.holder_name,
              user_data.account_number,
              user_data.ifsc_code,
              user_data.branch,
            ]);

            const cashbackQuery = `INSERT INTO user_cashbacks (user_id, amount, status) VALUES (?, ?, ?)`;
            await db.query(cashbackQuery, [newId, amount, cashbackStatus]);

            nextLevel.push(newId);
            new_ids.push(newId);

            await db.query(
              "INSERT INTO user_relations (ancestor_id, descendant_id, level) VALUES (?, ?, 1)",
              [referrer_id, newId],
            );

            await db.query(
              `INSERT INTO user_relations (ancestor_id, descendant_id, level)
             SELECT ancestor_id, ?, level + 1
             FROM user_relations
             WHERE descendant_id = ? AND level < 9 AND ancestor_id IS NOT NULL`,
              [newId, referrer_id],
            );

            await db.query(
              `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
             VALUES (?, ?, 100, 'unpaid')`,
              [referrer_id, newId],
            );
            await db.query(
              `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
              SELECT ancestor_id, ?, 10, 'unpaid'
              FROM user_relations
              WHERE descendant_id = ? AND level BETWEEN 2 AND 8`,
              [newId, newId],
            );

            await db.query(
              `INSERT INTO user_balance_logs (user_id, related_user_id, amount, status)
                SELECT ancestor_id, ?, 185, 'unpaid'
                FROM user_relations
                WHERE descendant_id = ? AND level = 9`,
              [newId, newId],
            );
          }
        }
        currentLevel = nextLevel;
      }
      await db.commit();
      return new_ids;
    } catch (err) {
      await db.rollback();
      throw err;
    }
  },

  getNwpDetails: async (user_id) => {
    try {
      const query = "SELECT * FROM nwp_users_package WHERE user_id = ?";
      const [data] = await db.query(query, [user_id]);

      if (data.length === 0) {
        return [
          {
            id: null,
            user_id: user_id,
            reward_id: null,
            package_id: null,
            daily_amt: 0,
            approved: 0,
            is_completed: 0,
            is_deleted: 0,
            approved_at: null,
            deleted_at: null,
            completed_at: null,
            created_at: null,
            updated_at: null,
            mock: true,
          },
        ];
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  getRewardDetails: async (user_id) => {
    try {
      const query = `
      SELECT COALESCE(SUM(total_amount), 0) AS reward_amount 
      FROM nwp_earnings 
      WHERE reward_id = ?
      AND type = 'reward'
      AND earned_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND earned_date < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
    `;

      const [rows] = await db.query(query, [user_id]);

      return {
        reward_amount: rows[0]?.reward_amount || 0,
      };
    } catch (err) {
      throw err;
    }
  },

  // TT

  getUserNameFromTT: async (referral_id) => {
    try {
      const query =
        "SELECT user_id, name, user_id, status FROM tt_users WHERE user_id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [referral_id]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getAllUsersTT: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.pancard,
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.txn_id,
                      u.branch,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM tt_users u
                    LEFT JOIN tt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.created_at >= ? AND u.created_at <= ? AND u.deleted_at IS NULL ORDER BY u.created_at DESC`;
      const [data] = await db.query(query, [startTime, endTime]);
      const updatedData = data.map((val) => ({ ...val, duplicate_txn_id: 0 }));
      return updatedData;
    } catch (err) {
      throw err;
    }
  },

  approveUserTT: async (user_ids) => {
    try {
      await db.beginTransaction();
      const ids = [];

      const lastId = await UserModel.getLastUserTT();
      let baseId = lastId.length > 0 ? parseInt(lastId.split("TT")[1]) : 0;
      user_ids.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      );

      for (const temp_user_id of user_ids) {
        const [[user]] = await db.query(
          "SELECT * FROM tt_temp_users WHERE user_id = ? AND approved = 0 AND deleted_at IS NULL",
          [temp_user_id],
        );

        if (!user) continue;

        const [[referrer]] = await db.query(
          `SELECT user_id, 'user' as role FROM tt_users WHERE user_id = ?
         UNION
         SELECT user_id, role FROM admin WHERE user_id = ?`,
          [user.referral_id, user.referral_id],
        );

        let status = "Approved";

        const [[{ count }]] = await db.query(
          "SELECT COUNT(*) as count FROM tt_users WHERE referral_id = ?",
          [referrer.user_id],
        );
        if (referrer?.role === "admin" && count !== 0) {
          status = "Queued";
        } else if (referrer?.role !== "admin" && count >= 2) status = "Queued";

        baseId += 1;
        const newId = "TT" + baseId.toString();

        await db.query(
          `INSERT INTO tt_users 
        (referral_id, user_id, name, mobile, email, address, password, status, txn_id, screenshot)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            referrer?.user_id,
            newId,
            user.name,
            user.mobile,
            user.email,
            user.address,
            user.password,
            status,
            user.txn_id,
            user.screenshot,
          ],
        );

        await db.query(
          "INSERT INTO tt_user_cashbacks (user_id, amount, status) VALUES (?, ?, ?)",
          [newId, 0, "paid"],
        );

        if (status === "Approved" && referrer?.role === "user") {
          // Add direct relation
          await db.query(
            "INSERT INTO tt_user_relations (ancestor_id, descendant_id, level) VALUES (?, ?, 1)",
            [referrer.user_id, newId],
          );

          // Add upper relations
          await db.query(
            `INSERT INTO tt_user_relations (ancestor_id, descendant_id, level)
     SELECT ancestor_id, ?, level + 1
     FROM tt_user_relations
     WHERE descendant_id = ? AND ancestor_id IS NOT NULL`,
            [newId, referrer.user_id],
          );

          // Level 1 payout = 100
          await db.query(
            `INSERT INTO tt_user_balance_logs (user_id, related_user_id, amount, status)
     VALUES (?, ?, 100, 'unpaid')`,
            [referrer.user_id, newId],
          );

          // Level 2–8 payout = 10
          await db.query(
            `INSERT INTO tt_user_balance_logs (user_id, related_user_id, amount, status)
     SELECT ancestor_id, ?, 10, 'unpaid'
     FROM tt_user_relations
     WHERE descendant_id = ? AND level BETWEEN 2 AND 8`,
            [newId, newId],
          );

          // Level 9+ payout = 100
          await db.query(
            `INSERT INTO tt_user_balance_logs (user_id, related_user_id, amount, status)
     SELECT ancestor_id, ?, 185, 'unpaid'
     FROM tt_user_relations
     WHERE descendant_id = ? AND level >= 9`,
            [newId, newId],
          );
        }

        await db.query(
          "UPDATE tt_temp_users SET approved = 1 WHERE user_id = ?",
          [temp_user_id],
        );

        if (user.email) {
          user.user_id = newId;
          user.referral_id = referrer.user_id;
          sendMail(user);
        }
        await sendAdminMail(user);
        ids.push({
          new_id: newId,
          user_id: temp_user_id,
          mobile: user.mobile,
          name: user.name,
          sponsor_id: referrer.user_id,
          password: user.password,
          status,
        });
      }

      await db.commit();
      return ids;
    } catch (err) {
      console.error("approveUser error:", err);
      await db.rollback();
      throw err;
    }
  },

  getLastUserTT: async () => {
    try {
      const query = "SELECT user_id from tt_users ORDER BY id DESC LIMIT 1";
      const [id] = await db.query(query);
      if (id[0]?.user_id) {
        return id[0].user_id;
      } else {
        return "TT0";
      }
    } catch (err) {
      throw err;
    }
  },

  getUserTT: async (user_id) => {
    try {
      const query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.pancard,
                      u.screenshot,
                      u.password,
                      u.address,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      u.referral_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM tt_users u
                    LEFT JOIN tt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id = ? AND u.deleted_at IS NULL;`;
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  hasTTMembers: async (user_id) => {
    try {
      const query =
        "SELECT user_id from tt_users WHERE referral_id = ? LIMIT 1";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },
};

export const getUserFullDetails = async (user_id) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE user_id = ? LIMIT 1`,
    [user_id],
  );

  return rows.length ? rows[0] : null;
};

export const fetchAdminDetails = async () => {
  const [rows] = await db.query(`SELECT * FROM admin LIMIT 1`);

  return rows.length ? rows[0] : null;
};
