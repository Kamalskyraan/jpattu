import db from "../configs/db.js";
import bcrypt from "bcryptjs";

const AdminModel = {
  getUserName: async (referral_id) => {
    try {
      const query =
        "SELECT user_id, name FROM admin WHERE user_id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [referral_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getUser: async (user_id) => {
    try {
      const query =
        "SELECT id, user_id, name, mobile, email, password, bank_name, holder_name, account_number, ifsc_code, branch, created_at, updated_at FROM admin WHERE user_id = ? AND admin_type = 0 AND deleted_at IS NULL";
      const [data] = await db.query(query, [user_id]);
      return data[0] || {};
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (data) => {
    const column = [
      "name",
      "mobile",
      "email",
      // "holder_name",
      // "account_number",
      // "ifsc_code",
      // "branch",
    ];

    let keys = [];
    let values = [];

    column.forEach((val) => {
      if (data[val]) {
        keys.push(`${val} = ?`);
        values.push(data[val].trim());
      }
    });

    if (data.password) {
      const password = await bcrypt.hash(data.password, 10);
      keys.push("password = ?");
      values.push(password);
    }

    if (keys.length === 0) {
      return false;
    }

    const list = keys.join(", ");
    const query = `UPDATE admin SET ${list} WHERE user_id = ?`;
    await db.query(query, [...values, data.user_id]);
    return true;
  },

  getPaymentDetails: async () => {
    try {
      const query =
        "SELECT holder_name, account_number, ifsc_code, bank_name, branch FROM admin WHERE deleted_at IS NULL";
      const [data] = await db.query(query, []);
      console.log(data);
      return data[0] || [{}];
    } catch (err) {
      throw err;
    }
  },

  getSearchUser: async (user_id, admin) => {
    try {
      let query;
      if (admin) {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      } else {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM users u
                    LEFT JOIN users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      }
      const [data] = await db.query(query, [`%${user_id}%`]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  fetchTagetUserDatas: async () => {
    try {
      const [result] = await db.query(
        `SELECT 
        user_id,
        role,
        admin_type,
        name,
        mobile,
        email,
        holder_name,
        account_number,
        bank_name,
        ifsc_code,
        branch
       FROM admin
       WHERE admin_type = ?
       LIMIT 1`,
        [1],
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  fetchRepeatUserDatas: async () => {
    try {
      const [result] = await db.query(
        `SELECT
          user_id,
          role,
          admin_type,
          name,
          mobile,
          email,
          holder_name,
          account_number,
          bank_name,
          ifsc_code,
          branch
       FROM admin
       WHERE user_id LIKE ?
       LIMIT 1`,
        ["repeat%"],
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  getSearchTTUser: async (user_id, admin) => {
    try {
      let query;
      if (admin) {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM tt_users u
                    LEFT JOIN tt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      } else {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM tt_users u
                    LEFT JOIN tt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      }
      const [data] = await db.query(query, [`%${user_id}%`]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getPaymentDetailsTT: async () => {
    try {
      const query =
        "SELECT holder_name, account_number, ifsc_code, bank_name, branch FROM admin WHERE deleted_at IS NULL";
      const [data] = await db.query(query, []);
      console.log(data);
      return data[0] || [{}];
    } catch (err) {
      throw err;
    }
  },

  getSearchRTUser: async (user_id, admin) => {
    try {
      let query;
      if (admin) {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM rpt_users u
                    LEFT JOIN rpt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      } else {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM rpt_users u
                    LEFT JOIN rpt_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      }
      const [data] = await db.query(query, [`%${user_id}%`]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  fetchNewUserDatas: async () => {
    try {
      const [result] = await db.query(
        `SELECT
          user_id,
          role,
          admin_type,
          name,
          mobile,
          email,
          holder_name,
          account_number,
          bank_name,
          ifsc_code,
          branch
       FROM admin
       WHERE admin_type = ?
       LIMIT 1`,
        [3],
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  getSearchNPUser: async (user_id, admin) => {
    try {
      let query;
      if (admin) {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM np_users u
                    LEFT JOIN np_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      } else {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM np_users u
                    LEFT JOIN np_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      }
      const [data] = await db.query(query, [`%${user_id}%`]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getPaymentDetailsNP: async () => {
    try {
      const query =
        "SELECT holder_name, account_number, ifsc_code, bank_name, branch FROM admin WHERE deleted_at IS NULL";
      const [data] = await db.query(query, []);
      console.log(data);
      return data[0] || [{}];
    } catch (err) {
      throw err;
    }
  },

  // focus

  fetchFocusUserDatas: async () => {
    try {
      const [result] = await db.query(
        `SELECT
          user_id,
          role,
          admin_type,
          name,
          mobile,
          email,
          holder_name,
          account_number,
          bank_name,
          ifsc_code,
          branch
       FROM admin
       WHERE admin_type = ?
       LIMIT 1`,
        [4],
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  getSearchFSUser: async (user_id, admin) => {
    try {
      let query;
      if (admin) {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM fs_users u
                    LEFT JOIN fs_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      } else {
        query = `SELECT 
                      u.id, 
                      u.user_id,
                      u.name, 
                      u.mobile, 
                      u.status,
                      u.email, 
                      u.screenshot,
                      u.password,
                      u.address,
                      u.referral_id,
                      u.account_number,
                      u.bank_name,
                      u.holder_name,
                      u.ifsc_code,
                      u.branch,
                      u.txn_id,
                      IFNULL(r.name, a.name) AS referral_name,
                      UNIX_TIMESTAMP(u.created_at) as created,
                      u.created_at
                    FROM fs_users u
                    LEFT JOIN fs_users r ON u.referral_id = r.user_id
                    LEFT JOIN admin a ON u.referral_id = a.user_id
                    WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
      }
      const [data] = await db.query(query, [`%${user_id}%`]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Kerchief

  fetchKerchiefUserDatas: async () => {
    try {
      const [result] = await db.query(
        `SELECT
          user_id,
          role,
          admin_type,
          name,
          mobile,
          email,
          holder_name,
          account_number,
          bank_name,
          ifsc_code,
          branch
       FROM admin
       WHERE admin_type = ?
       LIMIT 1`,
        [5],
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  getPaymentDetailsKR: async () => {
    try {
      const query =
        "SELECT holder_name, account_number, ifsc_code, bank_name, branch FROM admin WHERE deleted_at IS NULL";
      const [data] = await db.query(query, []);
      console.log(data);
      return data[0] || [{}];
    } catch (err) {
      throw err;
    }
  },

  //  getSearchKRUser: async (user_id, admin) => {
  //   try {
  //     let query;
  //     if (admin) {
  //       query = `SELECT
  //                     u.id,
  //                     u.user_id,
  //                     u.name,
  //                     u.mobile,
  //                     u.status,
  //                     u.email,
  //                     u.screenshot,
  //                     u.password,
  //                     u.address,
  //                     u.referral_id,
  //                     u.account_number,
  //                     u.bank_name,
  //                     u.holder_name,
  //                     u.ifsc_code,
  //                     u.branch,
  //                     u.txn_id,
  //                     IFNULL(r.name, a.name) AS referral_name,
  //                     UNIX_TIMESTAMP(u.created_at) as created,
  //                     u.created_at
  //                   FROM kr_users u
  //                   LEFT JOIN kr_users r ON u.referral_id = r.user_id
  //                   LEFT JOIN admin a ON u.referral_id = a.user_id
  //                   WHERE u.referral_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL ;`;
  //     } else {
  //       query = `SELECT
  //                     u.id,
  //                     u.user_id,
  //                     u.name,
  //                     u.mobile,
  //                     u.status,
  //                     u.email,
  //                     u.screenshot,
  //                     u.password,
  //                     u.address,
  //                     u.referral_id,
  //                     u.account_number,
  //                     u.bank_name,
  //                     u.holder_name,
  //                     u.ifsc_code,
  //                     u.branch,
  //                     u.txn_id,
  //                     IFNULL(r.name, a.name) AS referral_name,
  //                     UNIX_TIMESTAMP(u.created_at) as created,
  //                     u.created_at
  //                   FROM kr_users u
  //                   LEFT JOIN kr_users r ON u.referral_id = r.user_id
  //                   LEFT JOIN admin a ON u.referral_id = a.user_id
  //                   WHERE u.user_id LIKE ? AND u.status = "Approved" AND u.deleted_at IS NULL;`;
  //     }
  //     const [data] = await db.query(query, [`%${user_id}%`]);
  //     return data;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  getSearchKRUser: async (user_id, admin) => {
    try {
      let query;

      if (admin) {
        query = `
        SELECT 
          u.id, 
          u.user_id,
          u.name, 
          u.mobile, 
          u.status,
          u.email, 
          u.screenshot,
          u.password,
          u.address,
          u.referral_id,
          u.account_number,
          u.bank_name,
          u.holder_name,
          u.ifsc_code,
          u.branch,
          u.txn_id,
          IFNULL(r.name, a.name) AS referral_name,
          UNIX_TIMESTAMP(u.created_at) AS created,
          u.created_at
        FROM kr_users u
        LEFT JOIN kr_users r ON u.referral_id = r.user_id
        LEFT JOIN admin a ON u.referral_id = a.user_id
        WHERE u.referral_id = ?
          AND u.status = "Approved"
          AND u.deleted_at IS NULL
      `;
      } else {
        query = `
        SELECT 
          u.id, 
          u.user_id,
          u.name, 
          u.mobile, 
          u.status,
          u.email, 
          u.screenshot,
          u.password,
          u.address,
          u.referral_id,
          u.account_number,
          u.bank_name,
          u.holder_name,
          u.ifsc_code,
          u.branch,
          u.txn_id,
          IFNULL(r.name, a.name) AS referral_name,
          UNIX_TIMESTAMP(u.created_at) AS created,
          u.created_at
        FROM kr_users u
        LEFT JOIN kr_users r ON u.referral_id = r.user_id
        LEFT JOIN admin a ON u.referral_id = a.user_id
        WHERE u.user_id = ?
          AND u.status = "Approved"
          AND u.deleted_at IS NULL
      `;
      }

      const searchId = user_id.startsWith("KR") ? user_id : `KR${user_id}`;

      const [data] = await db.query(query, [searchId]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  //

  searchMembers: async (data) => {
    const { type, name = "", mobile = "", page = 1, limit = 10 } = data;

    const config = {
      KR: {
        memberTable: "kr_users",
        balanceTable: "kr_user_balance_logs",
      },

      DS: {
        memberTable: "users",
        balanceTable: "user_balance_logs",
      },
    };

    const selectedConfig = config[type];

    if (!selectedConfig) {
      throw new Error("Invalid member type");
    }

    const { memberTable, balanceTable } = selectedConfig;

    const cleanName = String(name).trim();
    const cleanMobile = String(mobile).trim();

    if (!cleanName || !cleanMobile) {
      return {
        rows: [],
        total: 0,
        total_received_amount: 0,
      };
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 10, 1);
    const offset = (currentPage - 1) * currentLimit;

    // ----------------------------------------
    // TOTAL USERS
    // ----------------------------------------
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM ${memberTable} AS m
    WHERE m.name = ?
      AND m.mobile = ?
  `;

    const [countRows] = await db.query(countQuery, [cleanName, cleanMobile]);

    const total = Number(countRows?.[0]?.total || 0);

    // ----------------------------------------
    // TOTAL RECEIVED AMOUNT
    // ALL MATCHING USERS
    // ----------------------------------------
    const totalAmountQuery = `
    SELECT
      COALESCE(SUM(bl.amount), 0) AS total_received_amount

    FROM ${memberTable} AS m

    LEFT JOIN ${balanceTable} AS bl
      ON bl.user_id = m.user_id

    WHERE m.name = ?
      AND m.mobile = ?
  `;

    const [totalAmountRows] = await db.query(totalAmountQuery, [
      cleanName,
      cleanMobile,
    ]);

    const totalReceivedAmount = Number(
      totalAmountRows?.[0]?.total_received_amount || 0,
    );

    if (total === 0) {
      return {
        rows: [],
        total: 0,
        total_received_amount: 0,
      };
    }

    // ----------------------------------------
    // PAGINATED DATA
    // ----------------------------------------
    const query = `
    SELECT
      m.user_id,
      m.name,
      m.mobile,
      m.referral_id,

      COALESCE(
        SUM(bl.amount),
        0
      ) AS received_amount

    FROM ${memberTable} AS m

    LEFT JOIN ${balanceTable} AS bl
      ON bl.user_id = m.user_id

    WHERE m.name = ?
      AND m.mobile = ?

    GROUP BY
      m.user_id,
      m.name,
      m.mobile,
      m.referral_id

    ORDER BY m.user_id ASC

    LIMIT ? OFFSET ?
  `;

    const [rows] = await db.query(query, [
      cleanName,
      cleanMobile,
      currentLimit,
      offset,
    ]);

    return {
      rows,
      total,
      total_received_amount: totalReceivedAmount,
    };
  },

  getUserByMobile: async (mobile, user_type) => {
    const tableName =
      user_type === "KR" ? "kr_users" : user_type === "DS" ? "users" : null;

    if (!tableName) {
      throw new Error("Invalid user type");
    }

    const query = `
    SELECT
      MIN(user_id) AS user_id,
      name,
      MIN(mobile) AS mobile
    FROM ${tableName}
    WHERE mobile = ?
    GROUP BY name
    ORDER BY name ASC
    LIMIT 15
  `;

    const [result] = await db.query(query, [mobile]);

    console.log(result);

    return result;
  },

  getAllMembersForExport: async (data) => {
    const { type, name = "", mobile = "" } = data;

    const config = {
      KR: {
        memberTable: "kr_users",
        balanceTable: "kr_user_balance_logs",
      },

      DS: {
        memberTable: "users",
        balanceTable: "user_balance_logs",
      },
    };

    const selectedConfig = config[type];

    if (!selectedConfig) {
      throw new Error("Invalid member type");
    }

    const { memberTable, balanceTable } = selectedConfig;

    const cleanName = String(name).trim();
    const cleanMobile = String(mobile).trim();

    if (!cleanName || !cleanMobile) {
      return [];
    }

    const query = `
    SELECT
      m.user_id,
      m.name,
      m.mobile,
      m.referral_id,
      COALESCE(SUM(bl.amount), 0) AS received_amount
    FROM ${memberTable} AS m

    LEFT JOIN ${balanceTable} AS bl
      ON bl.user_id = m.user_id

    WHERE m.name = ?
      AND m.mobile = ?

    GROUP BY
      m.user_id,
      m.name,
      m.mobile,
      m.referral_id

    ORDER BY m.user_id ASC
  `;

    const [rows] = await db.query(query, [cleanName, cleanMobile]);

    return rows;
  },

  getMemberExportSummary: async (data) => {
    const { type, name = "", mobile = "" } = data;

    const config = {
      KR: {
        memberTable: "kr_users",
        balanceTable: "kr_user_balance_logs",
      },

      DS: {
        memberTable: "users",
        balanceTable: "user_balance_logs",
      },
    };

    const selectedConfig = config[type];

    if (!selectedConfig) {
      throw new Error("Invalid member type");
    }

    const { memberTable, balanceTable } = selectedConfig;

    const cleanName = String(name).trim();
    const cleanMobile = String(mobile).trim();

    if (!cleanName || !cleanMobile) {
      return {
        user_count: 0,
        total_amount: "0.00",
        received_amount: "0.00",
      };
    }

    const query = `
    SELECT
      COUNT(DISTINCT m.user_id) AS user_count,

      CAST(
        COUNT(DISTINCT m.user_id) * 10000000
        AS DECIMAL(20,2)
      ) AS total_amount,

      CAST(
        COALESCE(SUM(bl.amount), 0)
        AS DECIMAL(20,2)
      ) AS received_amount

    FROM ${memberTable} AS m

    LEFT JOIN ${balanceTable} AS bl
      ON bl.user_id = m.user_id

    WHERE m.name = ?
      AND m.mobile = ?
  `;

    const [rows] = await db.query(query, [cleanName, cleanMobile]);

    return {
      user_count: Number(rows[0]?.user_count || 0),
      total_amount: rows[0]?.total_amount || "0.00",
      received_amount: rows[0]?.received_amount || "0.00",
    };
  },


  getAllParents: async (data) => {
  const {
    type,
    name = "",
    mobile = "",
  } = data;

  const config = {
    KR: {
      memberTable: "kr_users",
      amount: 10000000, // 1 Crore
    },

    DS: {
      memberTable: "users",
      amount: 100000, // 1 Lakh
    },
  };

  const selectedConfig = config[type];

  if (!selectedConfig) {
    throw new Error("Invalid member type");
  }

  const {
    memberTable,
    amount,
  } = selectedConfig;

  const cleanName = String(name).trim();
  const cleanMobile = String(mobile).trim();

  if (!cleanName || !cleanMobile) {
    return [];
  }

  const query = `
    SELECT
      m.user_id,
      m.referral_id,
      CAST(? AS DECIMAL(20,2)) AS amount
    FROM ${memberTable} AS m
    WHERE m.name = ?
      AND m.mobile = ?
    ORDER BY m.user_id ASC
  `;

  const [rows] = await db.query(query, [
    amount,
    cleanName,
    cleanMobile,
  ]);

  return rows;
},
  
};

export default AdminModel;
