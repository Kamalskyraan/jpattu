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
};

export default AdminModel;
