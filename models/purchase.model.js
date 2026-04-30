import db from "../configs/db.js";

export const PurchaseModel = {
  getPurchaseData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getSinglePurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  addPurchaseData: async ({
    purchase_date,
    gst_number,
    hsn_code,
    purchase_id,
    supplier,
    quantity,
    amount,
  }) => {
    try {
      const query =
        "INSERT INTO purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db.query(query, [
        purchase_date,
        gst_number,
        hsn_code,
        purchase_id,
        supplier,
        quantity,
        amount,
      ]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  editPurchaseData: async (data) => {
    try {
      const columns = [
        "purchase_date",
        "gst_number",
        "hsn_code",
        "purchase_id",
        "supplier",
        "quantity",
        "amount",
      ];
      let keys = [],
        values = [];

      columns.forEach((val) => {
        if (data[val]) {
          keys.push(`${val} = ?`);
          values.push(data[val]);
        }
      });

      if (keys.length === 0) {
        throw new Error("no data");
      }

      const fields = keys.join(", ");
      const query = `UPDATE purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deletePurchaseData: async (id) => {
    try {
      const query =
        "UPDATE purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getStockQuantity: async (timeline = false, year = null, month = null) => {
    try {
      let startOfMonth, endOfMonth;

      if (typeof year === "number" && typeof month === "number") {
        startOfMonth = new Date(year, month - 1, 1);
        endOfMonth = new Date(year, month, 0, 23, 59, 59);
      } else {
        const now = new Date();
        startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
      }

      const startDateString = startOfMonth
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const endDateString = endOfMonth
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let query = "",
        params = [];

      if (timeline) {
        query = `
        SELECT sum(quantity) as quantity
        FROM purchase_report
        WHERE supplier = 'jarigai'
          AND deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM purchase_report


        WHERE supplier = 'jarigai'
          AND deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  // kamal
  getOverallQuantity: async () => {
    try {
      const params = [];

      const query = `
      SELECT
        (SELECT SUM(quantity)
         FROM purchase_report
         WHERE supplier = 'jarigai'
           AND deleted_at IS NULL
           
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM jp_purchase_report
        ) AS stock_quantity
    `;

      const [data] = await db.query(query, params);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
      throw err;
    }
  },
  getShadowQuantity: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM purchase_report
   WHERE supplier = 'jarigai'
  ) AS stock_count;

    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_count: data?.[0]?.stock_count || 0,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getOverallShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM jp_purchase_report
    `;

      const [rows] = await db.query(query);

      return {
        all_quantity: rows?.[0]?.all_qty || 0,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export const JpPurchaseModel = {
  getPurchaseData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM jp_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getSinglePurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM jp_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  addPurchaseData: async ({
    purchase_date,
    gst_number,
    hsn_code,
    purchase_id,
    supplier,
    quantity,
    amount,
  }) => {
    try {
      const query =
        "INSERT INTO jp_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db.query(query, [
        purchase_date,
        gst_number,
        hsn_code,
        purchase_id,
        supplier,
        quantity,
        amount,
      ]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  editPurchaseData: async (data) => {
    try {
      const columns = [
        "purchase_date",
        "gst_number",
        "hsn_code",
        "purchase_id",
        "supplier",
        "quantity",
        "amount",
      ];
      let keys = [],
        values = [];

      columns.forEach((val) => {
        if (data[val]) {
          keys.push(`${val} = ?`);
          values.push(data[val]);
        }
      });

      if (keys.length === 0) {
        throw new Error("no data");
      }

      const fields = keys.join(", ");
      const query = `UPDATE jp_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deletePurchaseData: async (id) => {
    try {
      const query =
        "UPDATE jp_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getStockQuantity: async (timeline = false) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startDateString = startOfMonth
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let query = "",
        params = [];
      if (timeline) {
        query =
          "SELECT sum(quantity) as quantity FROM jp_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM jp_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getSales: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query =
        "SELECT id, gst_number, hsn_code, purchase_id, supplier, quantity, amount, purchase_date FROM purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL AND supplier = 'jarigai' ORDER BY created_at DESC";
      const [data] = await db.query(query, [startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },
};
