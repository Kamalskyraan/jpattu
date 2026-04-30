// models/nwp.model.js
import dayjs from "dayjs";
import db from "../configs/db.js";

/**
 * Insert the generated NWP rows into DB.
 * @param {number} user_id
 * @param {number|null} package_id
 * @param {Array<Object>} rows - generated rows from generateNwpSchedule
 */

export async function insertNwpUserPackage(
  user_id,
  reward_id,
  package_id,
  package_amount
) {
  try {
    // Calculate daily amount and interest
    const daily_amt = Number(package_amount) / 400;
    const interest_amount = Number(package_amount) * 0.05;

    // Insert into nwp_users_package
    const insertNwpUserPackageSql = `
      INSERT INTO nwp_users_package 
        (user_id, reward_id, package_id, daily_amt, approved) 
      VALUES (?, ?, ?, ?, 0)
    `;

    const [userPackageResult] = await db.query(insertNwpUserPackageSql, [
      user_id,
      reward_id,
      package_id,
      daily_amt,
    ]);
    const insertId = userPackageResult.insertId ?? null;

    // Insert into nwp_rewards
    const insertRewardsSql = `
      INSERT INTO nwp_earnings 
        (user_id, reward_id, user_package_id, total_amount, type, year)
      VALUES (?, ?, ?, ?, ?, YEAR(CURDATE()))
    `;

    const user_package_id = insertId;
    const [insertRewardsResult] = await db.query(insertRewardsSql, [
      user_id, // referred person
      reward_id, // who gets reward
      user_package_id,
      interest_amount, // reward amount
      "reward",
    ]);
    console.log("insertRewardsResult lvivbiv", insertRewardsResult);
    return { result: 1, insertId };
  } catch (err) {
    console.error("Error inserting NWP user package:", err);
    return { result: 0, error: err.message };
  }
}
export async function nwpPackageList() {
  const sql = "SELECT * FROM nwp_packages";
  const [result] = await db.query(sql);
  return { result };
}
export async function updatePackage(id, connection = null) {
  const sql =
    "UPDATE nwp_users_package SET approved = 1, approved_at = NOW() WHERE id = ?";
  const executor = connection
    ? connection.query.bind(connection)
    : db.query.bind(db);
  const result = await executor(sql, [id]);
  return { result: 1, message: "successfully updated", dbResult: result };
}
export async function insertNwpEarnings(
  user_id,
  reward_id,
  user_package_id,
  rows,
  connection = null
) {
  if (!rows || rows.length === 0) return { insertedCount: 0 };

  const placeholders = rows.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
  const values = [];
  for (const r of rows) {
    values.push(
      user_id,
      reward_id,
      user_package_id ?? null,
      r.earnedFor,
      r.year,
      r.totalDays,
      r.dailyAmount,
      r.totalAmount,
      r.receivedDate,
      r.earnedDate
    );
  }

  const sql = `INSERT INTO nwp_earnings
    (user_id, reward_id, user_package_id, earned_for, year, total_days, daily_amount, total_amount, received_date,earned_date)
    VALUES ${placeholders}`;

  // allow passing a transaction connection (conn.query)
  const executor = connection
    ? connection.query.bind(connection)
    : db.query.bind(db);
  const result = await executor(sql, values);
  return { insertedCount: rows.length, dbResult: result };
}
export async function nwpMembersList(status, start, end, order) {
  const startDate = `${start} 00:00:00`;
  const endDate = `${end} 23:59:59`;

  let sql = `
    SELECT 
      u.name,
      u.mobile,
      nwp.id,
      nwp.user_id,
      nwp.reward_id,
      nwp.package_id,
      p.amount AS package_amount,
      nwp.daily_amt,
      nwp.approved,
      nwp.is_completed,
      CONVERT_TZ(nwp.approved_at, '+00:00', '+05:30') AS approved_at,
      CONVERT_TZ(nwp.created_at, '+00:00', '+05:30') AS created_at
    FROM nwp_users_package AS nwp
    LEFT JOIN users AS u ON nwp.user_id = u.user_id
    LEFT JOIN nwp_packages AS p ON nwp.package_id = p.id
    WHERE nwp.is_deleted = 0
  `;

  const params = [];

  // Filter by status (approved)
  if (status !== null && status !== undefined) {
    sql += ` AND nwp.approved = ?`;
    params.push(status);
  }

  // Filter by date range
  if (start && end) {
    sql += ` AND nwp.created_at BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  // ORDER BY (must be ASC or DESC)
  sql += ` ORDER BY nwp.created_at ${order === "ASC" ? "ASC" : "DESC"}`;

  const [result] = await db.query(sql, params);
  return { result };
}
export async function nwpEarningsList(status, start, end) {
  let sql = `
      SELECT 
        u.name,
        u.mobile,
        nwp.id,
        CASE 
          WHEN nwp.type = 'reward' THEN nwp.reward_id 
          ELSE nwp.user_id 
        END AS user_id,
        nwp.type,
        nwp.reward_id,
        nwp.earned_for,
        nwp.total_amount AS amount,
        nwp.status,
        nwp.earned_date,
        nwp.created_at
      FROM nwp_earnings AS nwp
      LEFT JOIN users AS u 
        ON (
          (nwp.type = 'monthly' AND nwp.user_id = u.user_id)
          OR
          (nwp.type = 'reward'  AND nwp.reward_id = u.user_id)
        )
      WHERE 
        (
          (nwp.type = 'reward'
           AND nwp.earned_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND nwp.earned_date <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
          )
          OR
          (nwp.type = 'monthly'
           AND nwp.earned_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND nwp.earned_date <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
          )
        )
    `;

  const params = [];
  if (status && Array.isArray(status) && status.length) {
    sql += ` AND nwp.status IN (${status.map(() => "?").join(",")})`;
    params.push(...status);
  }
  if (start && end) {
    sql += ` AND DATE(nwp.earned_date) BETWEEN ? AND ?`;
    params.push(start, end);
  }

  sql += ` ORDER BY nwp.created_at DESC`;

  const [result] = await db.query(sql, params);
  console.log("result", result);
  return { result };
}

export async function markEarningsAsPaid(nwp_earning_ids = []) {
  try {
    if (!nwp_earning_ids.length) return { message: "No IDs provided" };

    const placeholders = nwp_earning_ids.map(() => "?").join(", ");

    const sql = `
      UPDATE nwp_earnings
      SET 
        status = 'paid',
        paid_at = NOW(),
        received_date = CASE
          WHEN type = 'reward' THEN
            CASE 
              WHEN DAY(CURDATE()) < 10 
                THEN DATE_FORMAT(CURDATE(), '%Y-%m-10')
              ELSE DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-10')
            END
          ELSE received_date
        END
      WHERE id IN (${placeholders})
    `;

    const [result] = await db.query(sql, nwp_earning_ids);
    return result;
  } catch (err) {
    console.error("Error marking earnings as paid in model:", err);
    throw err;
  }
}

export async function nwpMemberDetails(user_id, status) {
  let sql = `
    SELECT 
      u.name,
      u.mobile,
      nwp.id,
      nwp.user_id,
      nwp.reward_id,
      nwp.package_id,
      p.amount AS package_amount,
      nwp.daily_amt,
      nwp.approved,
      nwp.is_completed,
      CONVERT_TZ(nwp.approved_at, '+00:00', '+05:30') AS approved_at
    FROM nwp_users_package AS nwp
    LEFT JOIN users AS u ON nwp.user_id = u.user_id
    LEFT JOIN nwp_packages AS p ON nwp.package_id = p.id
    WHERE nwp.user_id = ?
    ORDER BY nwp.created_at DESC
  `;

  let earningsListSql;
  let params = [user_id];

  earningsListSql = `
        SELECT 
          u.name,
          u.mobile,
          nwp.id,
          nwp.user_id,
          nwp.type,
          nwp.reward_id,
          nwp.earned_for,
          nwp.total_amount AS amount,
          nwp.total_days,
          nwp.daily_amount,
          CONVERT_TZ(nwp.received_date, '+00:00', '+05:30') AS received_date
        FROM nwp_earnings AS nwp
        LEFT JOIN users AS u ON nwp.user_id = u.user_id
        WHERE  
          (
            YEAR(nwp.earned_date) < YEAR(CURDATE())
            OR (
              YEAR(nwp.earned_date) = YEAR(CURDATE())
              AND MONTH(nwp.earned_date) <= MONTH(CURDATE())
            )
          ) 
          AND nwp.user_id = ?
          AND nwp.status = 'pending'
          AND nwp.type = 'monthly'
        ORDER BY nwp.received_date DESC
        `;

  let rewardEarningsListSql = `
      SELECT 
        u.name,
        u.mobile,
        nwp.id,
        nwp.user_id,
        nwp.type,
        nwp.reward_id,
        nwp.earned_for,
        p.amount AS package_amount,
        nwp.total_amount AS amount,
        nwp.total_days,
        nwp.status,
        nwp.daily_amount,
        
        CASE 
            WHEN DAY(CONVERT_TZ(nwpup.approved_at, '+00:00', '+05:30')) <= 15 
                THEN DATE_FORMAT(CONVERT_TZ(nwpup.approved_at, '+00:00', '+05:30'), '%Y-%m-15')
            ELSE 
                DATE_FORMAT(
                    DATE_ADD(CONVERT_TZ(nwpup.approved_at, '+00:00', '+05:30'), INTERVAL 1 MONTH),
                    '%Y-%m-15'
                )
        END AS received_date,
    
        CONVERT_TZ(nwpup.approved_at, '+00:00', '+05:30') AS joining_date
    
      FROM nwp_earnings AS nwp
      LEFT JOIN users AS u 
        ON nwp.user_id = u.user_id
      LEFT JOIN nwp_users_package AS nwpup
        ON nwp.reward_id = nwpup.reward_id
      LEFT JOIN nwp_packages AS p 
        ON nwpup.package_id = p.id
      WHERE nwp.earned_date <= CURDATE()
        AND nwp.type = 'reward'
        AND nwp.reward_id = ?
        AND nwpup.approved = 1
    `;

  const rewardparams = [user_id];

  // ✅ Conditionally add status filter
  if (status) {
    rewardEarningsListSql += ` AND nwp.status = ?`;
    rewardparams.push(status);
  }

  rewardEarningsListSql += ` ORDER BY nwp.received_date DESC`;
  const nwp_sql = "SELECT * FROM nwp_users_package WHERE user_id = ?";
  const [nwp_result] = await db.query(nwp_sql, [user_id]);

  const [result] = await db.query(sql, [user_id]);
  const [earningResult] = await db.query(earningsListSql, params);
  const [rewarEarningResult] = await db.query(
    rewardEarningsListSql,
    rewardparams
  );
  const is_nwp_user = nwp_result.length > 0 ? 1 : 0;

  return { result, earningResult, rewarEarningResult, is_nwp_user };
}

export async function softDeleteMembersByIds(member_ids = []) {
  try {
    const placeholders = member_ids.map(() => "?").join(", ");

    const sql = `
      UPDATE nwp_users_package
      SET 
        is_deleted = 1,
        deleted_at = NOW()
      WHERE id IN (${placeholders})
        AND (is_deleted = 0 OR is_deleted IS NULL)
    `;

    const [result] = await db.query(sql, member_ids);
    return result;
  } catch (err) {
    console.error("Error soft deleting members:", err);
    throw err;
  }
}

export async function nwpMembersDetails(year = null, month = null) {
  let startOfMonth, endOfMonth;

  if (typeof year === "number" && typeof month === "number") {
    startOfMonth = new Date(year, month - 1, 1);
    endOfMonth = new Date(year, month, 0, 23, 59, 59);
  } else {
    const now = new Date();
    startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }

  const startDateString = startOfMonth
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const endDateString = endOfMonth.toISOString().slice(0, 19).replace("T", " ");

  // Query 1: Total users not deleted
  const [countRows] = await db.query(
    `
    SELECT COUNT(*) AS total_count
    FROM nwp_users_package
    WHERE is_deleted = 0
    AND created_at BETWEEN ? AND ?
  `,
    [startDateString, endDateString]
  );

  // Query 2: Total package amount (Approved only)
  const [amountRows] = await db.query(
    `
    SELECT SUM(p.amount) AS total_package_amount
    FROM nwp_users_package AS nwp
    LEFT JOIN nwp_packages AS p ON nwp.package_id = p.id
    WHERE nwp.approved = 1
    AND nwp.created_at BETWEEN ? AND ?
  `,
    [startDateString, endDateString]
  );

  // Query 3: Monthly earnings (paid monthly + paid reward)
  const [earningsRows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN type = 'monthly' THEN total_amount ELSE 0 END) AS monthly_amount,
      SUM(CASE WHEN status = 'paid' AND type = 'reward' THEN total_amount ELSE 0 END) AS reward_amount
    FROM nwp_earnings
    WHERE earned_date BETWEEN ? AND ?
  `,
    [startDateString, endDateString]
  );

  // Query 4: Total paid amount
  const [payoutRows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) AS total_paid_amount
    FROM nwp_earnings
    WHERE paid_at BETWEEN ? AND ?
  `,
    [startDateString, endDateString]
  );

  return {
    total_count: countRows[0]?.total_count || 0,
    total_package_amount: amountRows[0]?.total_package_amount || 0,
    monthly_paid_amount: earningsRows[0]?.monthly_amount || 0,
    reward_paid_amount: earningsRows[0]?.reward_amount || 0,
    total_payouts: payoutRows[0]?.total_paid_amount || 0,
  };
}

// kamalesh

export const getWithdrawEarnings = async (user_id) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      total_amount,
      type,
      status,
    DATE_FORMAT(earned_date, '%Y-%m-%d') AS earned_date
    FROM nwp_earnings
    WHERE user_id = ?
      AND status = 'pending'
      AND type = "monthly"
     ORDER BY earned_date ASC
    LIMIT 1
  `,
    [user_id]
  );

  return rows;
};

export const withdrawEarningsAfterDate = async (
  user_id,
  windup_earned_date
) => {
  const [result] = await db.query(
    `
    UPDATE nwp_earnings
    SET status = 'deleted'
    WHERE user_id = ?
      AND status = 'pending'
      AND type = 'monthly'
      AND DATE(earned_date) > DATE(?)
    `,
    [user_id, windup_earned_date]
  );

  return result.affectedRows;
};

export const withdrawExactDate = async (user_id, earned_date) => {
  const [result] = await db.query(
    `
    UPDATE nwp_earnings
    SET status = 'withdraw'
    WHERE user_id = ?
      AND status = 'pending'
      AND type = 'monthly'
      AND DATE(earned_date) = DATE(?)
    `,
    [user_id, earned_date]
  );

  return result.affectedRows;
};
