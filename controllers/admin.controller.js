import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import AdminModel from "../models/admin.model.js";
import { TempUserModel, UserModel } from "../models/users.model.js";
import { PurchaseModel } from "../models/purchase.model.js";
import UserBalanceModel from "../models/userbalance.model.js";
import CashbackModel from "../models/cashback.model.js";
import TreeModel from "../models/tree.model.js";
import path from "path";
import { sendAdminMail } from "../helpers/mail.js";
import {
  nwpMembersDetails,
  nwpMembersDetailsAll,
} from "../models/nwp.model.js";

export const LoginAdmin = async (req, res) => {
  try {
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((val) => val.msg) });
    }

    const { user_id, password } = req.body;
    const user = await AdminModel.getUser(user_id);

    if (user?.id) {
      const verified = await bcrypt.compare(password, user.password);

      user.role = "admin";
      const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

      if (verified) {
        res.cookie("auth", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          // sameSite: "Lax",
        });

        delete user?.password;

        res.status(200).json({ user: user, message: "Login Successful" });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutAdmin = async (req, res) => {
  const { user_id } = req.body || false;
  if (!user_id) return res.status(401).json({ message: "user_id is required" });

  res.cookie("auth", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({ message: "Logout Successful" });
};

export const verifyStatus = async (req, res) => {
  const token = req.cookies.auth;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    if (user.role === "admin") {
      const data = await AdminModel.getUser(user.user_id);
      res.status(200).json({ authenticated: true, user: data });
    } else {
      res.cookie(
        "auth",
        {},
        {
          httpOnly: true,
          secure: true,
          // sameSite: "Lax",
          sameSite: "None",
          maxAge: 0,
        },
      );

      res.status(403).json({ message: "Unable to login" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ authenticated: false });
  }
};

export const TargetUserData = async (req, res) => {
  try {
    const targetUser = await AdminModel.fetchTagetUserDatas();

    res.status(200).json({
      data: targetUser,
      message: "Target User Data fetched successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user_ids = req.body?.user_ids;
    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "user_id is required and must be an array" });
    }

    const ids = await UserModel.approveUser(user_ids);

    if (ids.length > 0) {
      // sendAdminMail(ids);

      const newIds = ids.map((id) => ({
        newId: id.newId,
        user_id: id.user_id,
        status: id.status,
      }));

      return res
        .status(200)
        .json({ newIds: newIds, message: "User approved successfully" });
    } else {
      return res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AddQueuedUser = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (!data?.referral_id) {
      return res.status(400).json({ message: "referral_id is required" });
    }

    const approved = await UserModel.addQueuedUser(
      data.user_id,
      data.referral_id,
    );

    if (approved) {
      return res.status(200).json({ message: "User approved successfully" });
    } else {
      return res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    if (error.message === "limit exceed") {
      return res.status(200).json({ message: "Referral limit reached" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const getHomeDetails = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    const yr = req.query.year;
    const mn = req.query.month;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const year = parseInt(yr);
    const month = parseInt(mn);

    if (!year || isNaN(parseInt(year))) {
      return res.status(400).json({ message: "year is required" });
    }

    if (!month || isNaN(parseInt(month))) {
      return res.status(400).json({ message: "month is required" });
    }

    const quantity = await PurchaseModel.getStockQuantity();
    const total_user_count = await UserModel.getUsersCount(
      true,
      year,
      month,
      true,
    );
    const user_count = await UserModel.getUsersCount(true, year, month, false);
    const stockAvailable =
      quantity - user_count < 0 ? 0 : quantity - user_count;

    const [activeCount, inactiveCount, queueCount] =
      await UserModel.getUserStatus(true, year, month);
    const levelPayout = await UserBalanceModel.getTotalPayouts(
      false,
      year,
      month,
    );
    const cashbackPayout = await CashbackModel.getTotalPayouts(
      false,
      year,
      month,
    );
    const userData = await AdminModel.getUser(user_id);

    const totalCashbackPayouts = await CashbackModel.getTotalPayouts(
      true,
      year,
      month,
    );
    const totalPaidLevelAmount = await UserBalanceModel.getTotalPayouts(
      true,
      year,
      month,
    );
    const totalPaidCashbackAmount = totalCashbackPayouts;
    const nwpDetails = await nwpMembersDetails(year, month);
    const nwpDetailsAll = await nwpMembersDetailsAll();
    res.status(200).json({
      company_income: (activeCount + queueCount) * 1000,
      stock_available: quantity,
      active_ids: activeCount,
      inactive_ids: inactiveCount,
      queued_ids: queueCount,
      total_ids: activeCount + inactiveCount + queueCount,
      level_amount: parseInt(levelPayout),
      cashback_amount: parseInt(cashbackPayout),
      total_payouts: parseInt(cashbackPayout) + parseInt(levelPayout),
      total_income: parseInt(total_user_count) * 1000,
      total_paid_amount:
        parseInt(totalPaidLevelAmount) + parseInt(totalPaidCashbackAmount),
      user_data: userData,
      nwp_details: nwpDetails,
      nwp_details_all: nwpDetailsAll,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { start, end, type } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const users = await UserModel.getAllUsers({ start, end });
    let temp_users = [];
    if (type !== "permanent") {
      temp_users = await TempUserModel.getAllUsers({ start, end });
    }

    const data = [...users, ...temp_users];
    const updatedData = data.map((val) => {
      if (val.screenshot)
        return {
          ...val,
          // screenshot: path.join("http://localhost:8010", "public", "screenshots", val.screenshot),
          screenshot: `https://rightshadow.skyraantech.com/server/public/screenshots/${val.screenshot}`,
        };
      else return val;
    });

    updatedData.sort((a, b) => b.created - a.created);

    return res.status(200).json({
      data: updatedData,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateAdmin = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (!data.user_type) {
      return res.status(400).json({ message: "user_type is required" });
    }

    const updated = await AdminModel.updateUser(data);

    if (updated) {
      const user = await AdminModel.getUser(data.user_id);
      if (!user) {
        res.status(400).json({ message: "Admin not found" });
        return;
      }
      user.role = "admin";
      const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

      res.cookie("auth", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        // sameSite: "Lax",
      });

      delete user?.password;
      res
        .status(200)
        .json({ data: user, message: "User updated successfully" });
    } else {
      res.status(400).json({ message: "Atleast 1 field is required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getQueuedUsers = async (req, res) => {
  try {
    const data = await UserModel.getQueuedUsers();

    return res.status(200).json({
      data: data,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    let admin = false;
    if (req.user_id.toLowerCase() === user_id.trim().toLowerCase()) {
      admin = true;
    }

    const data = await AdminModel.getSearchUser(user_id, admin);

    if (data.length === 0) {
      res.status(200).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTTUsers = async (req, res) => {
  try {
    const { start, end, type } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const users = await UserModel.getAllUsersTT({ start, end });
    let temp_users = [];
    if (type !== "permanent") {
      temp_users = await TempUserModel.getAllUsersTT({ start, end });
    }

    const data = [...users, ...temp_users];
    const updatedData = data.map((val) => {
      if (val.screenshot)
        return {
          ...val,
          // screenshot: path.join("http://localhost:8010", "public", "screenshots", val.screenshot),
          screenshot: `https://rightshadow.skyraantech.com/server/public/screenshots/${val.screenshot}`,
        };
      else return val;
    });

    updatedData.sort((a, b) => b.created - a.created);

    return res.status(200).json({
      data: updatedData,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// TT

export const approveTTUser = async (req, res) => {
  try {
    const user_ids = req.body?.user_ids;
    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "user_id is required and must be an array" });
    }

    const ids = await UserModel.approveUserTT(user_ids);

    
    if (ids.length > 0) {
      // sendAdminMail(ids);

      const newIds = ids.map((id) => ({
        newId: id.newId,
        user_id: id.user_id,
        status: id.status,
      }));

      return res
        .status(200)
        .json({ newIds: newIds, message: "User approved successfully" });
    } else {
      return res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
