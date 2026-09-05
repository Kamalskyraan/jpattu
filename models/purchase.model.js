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
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM purchase_report


        WHERE  deleted_at IS NULL
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

  // tt

  getTTStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM tt_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM tt_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },
  getShadowTTQuantity: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM tt_users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM tt_purchase_report
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

  getOverallTTShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM tt_purchase_report
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

  getOverallTTQuantity: async () => {
    try {
      const query = `
      SELECT
        (SELECT COUNT(*)
         FROM tt_users
         WHERE deleted_at IS NULL
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM tt_purchase_report
         WHERE deleted_at IS NULL
        ) AS stock_quantity
    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
      throw err;
    }
  },

  // RT
  getRTStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM rpt_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM rpt_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getOverallRTQuantity: async () => {
    try {
      const query = `
      SELECT
        (SELECT COUNT(*)
         FROM rpt_users
         WHERE deleted_at IS NULL
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM rpt_purchase_report
         WHERE deleted_at IS NULL
        ) AS stock_quantity
    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
      throw err;
    }
  },

  getShadowQuantityRT: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM rpt_users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM rpt_purchase_report
  
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

  getOverallRTShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM rpt_purchase_report
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

  getNPStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM np_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM np_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getOverallNPQuantity: async () => {
    try {
      const query = `
      SELECT
        (SELECT COUNT(*)
         FROM np_users
         WHERE deleted_at IS NULL
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM np_purchase_report
         WHERE deleted_at IS NULL
        ) AS stock_quantity
    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
      throw err;
    }
  },

  getNPStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM np_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM np_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getShadowQuantityNP: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM np_users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM np_purchase_report
   WHERE deleted_at IS NULL
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

  getOverallNPShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM np_purchase_report 
       WHERE deleted_at IS NULL
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

  // focus

  getFSStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM fs_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM fs_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getOverallFSQuantity: async () => {
    try {
      const query = `
      SELECT
        (SELECT COUNT(*)
         FROM fs_users
         WHERE deleted_at IS NULL
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM fs_purchase_report
         WHERE deleted_at IS NULL
        ) AS stock_quantity
    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
      throw err;
    }
  },

  getFSStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM fs_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM fs_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getShadowQuantityFS: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM fs_users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM fs_purchase_report
  
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

  getOverallFSShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM fs_purchase_report WHERE deleted_at IS NULL
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

  // kr

  getKRStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM kr_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM kr_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getKRStockQuantity: async (timeline = false, year = null, month = null) => {
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
        FROM kr_purchase_report
        WHERE deleted_at IS NULL
          AND created_at BETWEEN ? AND ?
      `;

        params = [startDateString, endDateString];
      } else {
        query = `
        SELECT sum(quantity) as quantity
        FROM kr_purchase_report


        WHERE  deleted_at IS NULL
      `;
      }

      const [data] = await db.query(query, params);
      return data[0].quantity < 0 ? 0 : data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  getShadowQuantityKR: async () => {
    try {
      const query = `
      SELECT
  (SELECT COUNT(id)
   FROM kr_users
   WHERE deleted_at IS NULL
     AND status IN ('approved','queued') 
  ) AS sales_quantity,

  (SELECT SUM(quantity)
   FROM kr_purchase_report
  
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

  getOverallKRShadowQty: async () => {
    try {
      const query = `
      SELECT SUM(quantity) AS all_qty 
      FROM kr_purchase_report WHERE deleted_at IS NULL
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

  getOverallKRQuantity: async () => {
    try {
      const query = `
      SELECT
        (SELECT COUNT(*)
         FROM kr_users
         WHERE deleted_at IS NULL
        ) AS sales_quantity,

        (SELECT SUM(quantity)
         FROM kr_purchase_report
         WHERE deleted_at IS NULL
        ) AS stock_quantity
    `;

      const [data] = await db.query(query);

      return {
        sales_quantity: data?.[0]?.sales_quantity || 0,
        stock_quantity: data?.[0]?.stock_quantity || 0,
      };
    } catch (err) {
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

  // TT

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
  //tt

  getTTSales: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;
      const query =
        "SELECT id, gst_number, hsn_code, purchase_id, supplier, quantity, amount, purchase_date FROM tt_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL  ORDER BY created_at DESC";
      const [data] = await db.query(query, [startTime, endTime]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getTTStockQuantity: async (timeline = false) => {
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
          "SELECT sum(quantity) as quantity FROM tt_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM tt_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  addPurchaseTTData: async ({
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
        "INSERT INTO tt_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

  getPurchaseTTData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM tt_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  // tt

  editTTPurchaseData: async (data) => {
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
      const query = `UPDATE tt_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deleteTTPurchaseData: async (id) => {
    try {
      const query =
        "UPDATE tt_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getSingleTTPurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM tt_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getPurchaseTTDataForTotal: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT SUM(quantity) as quntity, amount FROM tt_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },
  // RT

  deleteRTPurchaseData: async (id) => {
    try {
      const query =
        "UPDATE rpt_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },
  getPurchaseRTData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM rpt_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getPurchaseRTDataForTotal: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT SUM(quantity) as quntity, amount FROM rpt_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getRTStockQuantity: async (timeline = false) => {
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
          "SELECT sum(quantity) as quantity FROM rpt_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM rpt_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  addPurchaseRTData: async ({
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
        "INSERT INTO rpt_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

  editRTPurchaseData: async (data) => {
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
      const query = `UPDATE rpt_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getSingleRTPurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM rpt_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // np

  addPurchaseNPData: async ({
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
        "INSERT INTO np_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

  getPurchaseNPData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM np_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getPurchaseNPDataForTotal: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT SUM(quantity) as quntity, amount FROM np_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getNPStockQuantity: async (timeline = false) => {
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
          "SELECT sum(quantity) as quantity FROM np_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM np_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  deleteNPPurchaseData: async (id) => {
    try {
      const query =
        "UPDATE np_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getSingleNPPurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM np_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  editNPPurchaseData: async (data) => {
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
      const query = `UPDATE np_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // FS

  getPurchaseFSData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM fs_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getPurchaseFSDataForTotal: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT SUM(quantity) as quntity, amount FROM fs_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getFSStockQuantity: async (timeline = false) => {
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
          "SELECT sum(quantity) as quantity FROM fs_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM fs_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  addPurchaseFSData: async ({
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
        "INSERT INTO fs_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

  editFSPurchaseData: async (data) => {
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
      const query = `UPDATE fs_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deleteFSPurchaseData: async (id) => {
    try {
      const query =
        "UPDATE fs_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getSingleFSPurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM fs_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // kr

  addPurchaseKRData: async ({
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
        "INSERT INTO kr_purchase_report (purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

  getPurchaseKRData: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM kr_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getPurchaseKRDataForTotal: async ({ start, end }) => {
    try {
      const startTime = `${start} 00:00:00`;
      const endTime = `${end} 23:59:59`;

      const query =
        "SELECT SUM(quantity) as quntity, amount FROM kr_purchase_report WHERE created_at >= ? AND created_at <= ? AND deleted_at IS NULL ORDER BY purchase_date DESC";
      const [data] = await db.query(query, [startTime, endTime]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  getKRStockQuantity: async (timeline = false) => {
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
          "SELECT sum(quantity) as quantity FROM kr_purchase_report WHERE deleted_at IS NULL AND created_at >= ? AND created_at <= NOW()";
        params = [startDateString];
      } else {
        query =
          "SELECT sum(quantity) as quantity FROM kr_purchase_report WHERE deleted_at IS NULL";
      }
      const [data] = await db.query(query, params);
      return data[0].quantity || 0;
    } catch (err) {
      throw err;
    }
  },

  deleteKRPurchaseData: async (id) => {
    try {
      const query =
        "UPDATE kr_purchase_report SET deleted_at = NOW() WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  getSingleKRPurchaseData: async (id) => {
    try {
      const query =
        "SELECT id, purchase_date, gst_number, hsn_code, purchase_id, supplier, quantity, amount FROM kr_purchase_report WHERE id = ? AND deleted_at IS NULL";
      const [data] = await db.query(query, [id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  editKRPurchaseData: async (data) => {
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
      const query = `UPDATE kr_purchase_report SET ${fields} WHERE id = ?`;
      await db.query(query, [...values, data.id]);
      return true;
    } catch (err) {
      throw err;
    }
  },
};
