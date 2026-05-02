// controllers/nwp.controller.js
import { validationResult } from "express-validator";
import { generateNwpSchedule } from "../utilities/nwpCalculator.js";
import {
  getWithdrawEarnings,
  insertNwpEarnings,
  insertNwpUserPackage,
  markEarningsAsPaid,
  nwpEarningsList,
  nwpMemberDetails,
  nwpMembersList,
  nwpPackageList,
  softDeleteMembersByIds,
  updatePackage,
  withdrawEarningsAfterDate,
  withdrawExactDate,
} from "../models/nwp.model.js";
import db from "../configs/db.js";
import dayjs from "dayjs";
import { sendNWPAdminMail, sendNWPMail } from "../helpers/mail.js";

export const AddNewPackageToUser = async (req, res) => {
  try {
    console.log("req");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    const { user_id, reward_id, package_id = null, package_amount } = req.body;

    // await the insert and return insertedId
    const nwpUserPackage = await insertNwpUserPackage(
      user_id,
      reward_id,
      package_id,
      package_amount,
    );
    console.log("req", nwpUserPackage);
    return res.status(201).json({
      success: true,
      data: nwpUserPackage,
    });
  } catch (err) {
    console.error("AddNewPackageToUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const PackageList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    // await the insert and return insertedId
    const nwpUserPackage = await nwpPackageList();

    return res.status(201).json({ result: nwpUserPackage.result });
  } catch (err) {
    console.error("AddNewPackageToUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const DeleteMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });
    }

    const { member_ids = [] } = req.body;

    if (!Array.isArray(member_ids) || member_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No member IDs provided",
      });
    }

    // ✅ Soft delete members
    const result = await softDeleteMembersByIds(member_ids);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: `Soft deleted ${result.affectedRows} member(s) successfully.`,
        deletedCount: result.affectedRows,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No members were updated — invalid IDs or already deleted.",
      });
    }
  } catch (err) {
    console.error("DeleteMember error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to soft delete members.",
    });
  }
};

// export const PackageApproved = async (req, res) => {
//   let connection;

//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ message: errors.array().map((e) => e.msg) });
//     }

//     const { user_package_ids = [], save = true } = req.body;

//     if (!Array.isArray(user_package_ids) || user_package_ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No package IDs provided",
//       });
//     }

//     const startMoment = dayjs();
//     const start_date = startMoment.format("YYYY-MM-DD");

//     if (typeof db.getConnection === "function") {
//       connection = await db.getConnection();

//       try {
//         await connection.beginTransaction();
//         const allInserts = [];

//         for (const pkgId of user_package_ids) {
//           // ✅ Get user_id, reward_id, and package_amount using JOIN
//           const [pkgRows] = await connection.query(
//             `SELECT
//                 up.user_id,
//                 up.reward_id,
//                 up.package_id,
//                 p.amount AS package_amount
//              FROM nwp_users_package AS up
//              INNER JOIN nwp_packages AS p
//                ON up.package_id = p.id
//              WHERE up.id = ?`,
//             [pkgId]
//           );

//           if (pkgRows.length === 0) {
//             console.warn(`Package ID ${pkgId} not found`);
//             continue;
//           }

//           const {
//             user_id: pkgUserId,
//             reward_id: pkgRewardId,
//             package_amount,
//           } = pkgRows[0];

//           // Generate schedule based on the specific package amount
//           const schedule = generateNwpSchedule({ package_amount, start_date });

//           // ✅ Update package
//           await updatePackage(pkgId, connection);

//           // ✅ Insert related earnings
//           if (save) {
//             const insertResult = await insertNwpEarnings(
//               pkgUserId,
//               pkgRewardId,
//               pkgId,
//               schedule.rows,
//               connection
//             );
//             allInserts.push({ pkgId, insertResult });
//           }
//           await sendNWPMail({
//             email: user.email,
//             userName: user.name,
//             userId: pkgUserId,
//             joinDate: dayjs(user.created_at).format("DD MMM YYYY"),
//             mobile: user.mobile,

//             packageAmount: package_amount,
//             countingDays: schedule.total_days,
//             dailyAmount: schedule.daily_amount,
//             benefitAmount: schedule.benefit_amount,
//             settlementAmount: schedule.settlement_amount,
//             totalAmount: schedule.total_amount,
//           });
//         }

//         await connection.commit();
//         connection.release();

//         return res.status(200).json({
//           success: true,
//           message: "Packages approved successfully",
//           approvedPackages: user_package_ids,
//           insert: allInserts,
//         });
//       } catch (txErr) {
//         console.error("Transaction error:", txErr);
//         await connection.rollback();
//         connection.release();
//         throw txErr;
//       }
//     } else {
//       // ⚙️ Fallback (no connection pooling)
//       const allInserts = [];

//       for (const pkgId of user_package_ids) {
//         // ✅ JOIN query to get data
//         const [pkgRows] = await db.query(
//           `SELECT
//               up.user_id,
//               up.reward_id,
//               up.package_id,
//               p.amount AS package_amount
//            FROM nwp_users_package AS up
//            INNER JOIN nwp_packages AS p
//              ON up.package_id = p.id
//            WHERE up.id = ?`,
//           [pkgId]
//         );

//         if (pkgRows.length === 0) {
//           console.warn(`Package ID ${pkgId} not found`);
//           continue;
//         }

//         const {
//           user_id: pkgUserId,
//           reward_id: pkgRewardId,
//           package_amount,
//         } = pkgRows[0];

//         const schedule = generateNwpSchedule({ package_amount, start_date });

//         await updatePackage(pkgId);

//         if (save) {
//           const insertResult = await insertNwpEarnings(
//             pkgUserId,
//             pkgRewardId,
//             pkgId,
//             schedule.rows
//           );
//           allInserts.push({ pkgId, insertResult });
//         }
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Packages approved successfully (no transaction)",
//         approvedPackages: user_package_ids,
//         insert: allInserts,
//       });
//     }
//   } catch (err) {
//     console.error("PackageApproved error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

export const PackageApproved = async (req, res) => {
  let connection;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    const { user_package_ids = [], save = true } = req.body;

    if (!Array.isArray(user_package_ids) || user_package_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No package IDs provided",
      });
    }

    const start_date = dayjs().format("YYYY-MM-DD");

    // ✅ Get connection if using pool
    if (typeof db.getConnection === "function") {
      connection = await db.getConnection();
      await connection.beginTransaction();
    }

    const allInserts = [];

    for (const pkgId of user_package_ids) {
      // 1️⃣ Get package and user info
      const [pkgRows] = await (connection
        ? connection.query(
            `SELECT 
              up.user_id, up.reward_id, up.package_id, p.amount AS package_amount,
              u.name AS user_name, u.email, u.mobile, u.created_at
            FROM nwp_users_package AS up
            INNER JOIN nwp_packages AS p ON up.package_id = p.id
            INNER JOIN users AS u ON up.user_id = u.user_id
            WHERE up.id = ?`,
            [pkgId],
          )
        : db.query(
            `SELECT 
              up.user_id, up.reward_id, up.package_id, p.amount AS package_amount,
              u.name AS user_name, u.email, u.mobile, u.created_at
            FROM nwp_users_package AS up
            INNER JOIN nwp_packages AS p ON up.package_id = p.id
            INNER JOIN users AS u ON up.user_id = u.user_id
            WHERE up.id = ?`,
            [pkgId],
          ));

      if (pkgRows.length === 0) {
        console.warn(`Package ID ${pkgId} not found`);
        continue;
      }

      const {
        user_id,
        reward_id,
        package_amount,
        user_name,
        email,
        mobile,
        created_at,
      } = pkgRows[0];

      const schedule = await generateNwpSchedule({
        package_amount,
        start_date,
      });

      await updatePackage(pkgId, connection);

      if (save) {
        const insertResult = await insertNwpEarnings(
          user_id,
          reward_id,
          pkgId,
          schedule.rows,
          connection,
        );
        allInserts.push({ pkgId, insertResult });
      }

      await sendNWPMail({
        email,
        userName: user_name,
        userId: user_id,
        joinDate: dayjs(created_at).format("DD MMM YYYY"),
        mobile,
        packageAmount: package_amount,
        countingDays: schedule.meta.totalDaysAllowed,
        dailyAmount: parseFloat(schedule.meta.perDayAmount),
        benefitAmount: parseFloat(schedule.meta.totalAmount),
        settlementAmount: parseFloat(schedule.meta.totalAmount),
        totalAmount: parseFloat(schedule.meta.totalAmount) * 2,
      });
      await sendNWPAdminMail({
        email,
        userName: user_name,
        userId: user_id,
        joinDate: dayjs(created_at).format("DD MMM YYYY"),
        mobile,
        packageAmount: package_amount,
        countingDays: schedule.meta.totalDaysAllowed,
        dailyAmount: parseFloat(schedule.meta.perDayAmount),
        benefitAmount: parseFloat(schedule.meta.totalAmount),
        settlementAmount: parseFloat(schedule.meta.totalAmount),
        totalAmount: parseFloat(schedule.meta.totalAmount) * 2,
      });
    }

    if (connection) {
      await connection.commit();
      connection.release();
    }

    return res.status(200).json({
      success: true,
      message: "Packages approved and mails sent successfully",
      approvedPackages: user_package_ids,
      insert: allInserts,
    });
  } catch (err) {
    console.error("PackageApproved error:", err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const MembersList = async (req, res) => {
  try {
    const { status = null, start, end, order = "desc" } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }
    const Order = order == "asc" ? "ASC" : "DESC";
    // await the insert and return insertedId
    const nwpUserPackage = await nwpMembersList(status, start, end, Order);

    return res.status(201).json({ result: nwpUserPackage.result });
  } catch (err) {
    console.error("AddNewPackageToUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const EarningsList = async (req, res) => {
  try {
    const { status, start, end } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    // await the insert and return insertedId
    const nwpUserPackage = await nwpEarningsList(status, start, end);

    return res.status(200).json({ result: nwpUserPackage.result });
  } catch (err) {
    console.error("AddNewPackageToUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const Earningspaid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });
    }

    const { nwp_earning_ids = [] } = req.body;

    if (!Array.isArray(nwp_earning_ids) || nwp_earning_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No earning IDs provided",
      });
    }

    // ✅ Pass only the IDs array
    const result = await markEarningsAsPaid(nwp_earning_ids);

    return res.status(200).json({
      success: true,
      message: `Marked ${result.affectedRows} earnings as paid.`,
      updatedCount: result.affectedRows,
    });
  } catch (err) {
    console.error("Earningspaid error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update earnings status",
    });
  }
};
export const UserDetails = async (req, res) => {
  try {
    const {
      user_id = null,
      type = "monthly",
      status,
      start_date,
      end_date,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const { result, earningResult, rewarEarningResult, is_nwp_user } =
      await nwpMemberDetails(user_id, status, start_date, end_date);

    return res.status(200).json({
      success: true,
      userPackages: result,
      earnings: earningResult,
      rewards: rewarEarningResult,
      is_nwp_user: is_nwp_user,
    });
  } catch (err) {
    console.error("UserDetails error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// kamalesh

export const getWithdrawEarningsForUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await getWithdrawEarnings(user_id);
    return res.status(200).json({
      success: true,
      message: "Earning fetched Successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// export const withdrawMoney = async (req, res) => {
//   try {
//     const { user_id, confirm, windup_earned_date } = req.body;
//     if (!user_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "user_id is required" });
//     }

//     if (!confirm) {
//       return res.status(400).json({
//         success: false,
//         message: "Withdrawal not confirmed",
//       });
//     }
//     const affectedRows = await withdrawEarningsAfterDate(
//       user_id,
//       windup_earned_date
//     );

//     if (!affectedRows) {
//       return res.status(200).json({
//         success: false,
//         message: "No pending earnings found for withdrawal",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Withdrawal completed successfully",
//       withdrawn_count: affectedRows,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const withdrawMoney = async (req, res) => {
  try {
    const { user_id, confirm, windup_earned_date } = req.body;

    if (!user_id || !confirm) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    await db.beginTransaction();

    // SAME DATE → withdrawn
    await withdrawExactDate(user_id, windup_earned_date);

    // AFTER DATE → withdraw
    const affectedRows = await withdrawEarningsAfterDate(
      user_id,
      windup_earned_date,
    );

    await db.commit();

    return res.status(200).json({
      success: true,
      message: "Withdrawal confirmed",
      withdrawn_count: affectedRows,
    });
  } catch (err) {
    await db.rollback();
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//
