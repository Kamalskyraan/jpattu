import jwt from "jsonwebtoken";
import {
  fetchAdminDetails,
  getUserFullDetails,
  TempUserModel,
  UserModel,
} from "../models/users.model.js";
import { validationResult } from "express-validator";
import path from "path";
import { existsSync, rmSync } from "fs";
import UserBalanceModel from "../models/userbalance.model.js";
import TreeModel from "../models/tree.model.js";
import AdminModel from "../models/admin.model.js";
import dayjs from "dayjs";

export const RegisterUser = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: result.array().map((val) => val.msg),
      });
    }

    if (data.role === "user" && !data.referral_id) {
      res.status(400).json({ message: "referral_id is required" });
    }

    const user = await UserModel.getUserName(data?.referral_id);

    let admin = [];
    if (user.length === 0 && data.role === "admin") {
      admin = await AdminModel.getUserName(data.referral_id);
    }

    if (user.length === 0 && admin.length === 0) {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else {
      const id = await TempUserModel.addUser(data);
      res.status(201).json({ id: id, message: "Registered Successfully" });
    }
  } catch (error) {
    console.log(error);
    if (error.message === "referrer not found") {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else if (error.message === "Referrar is in Queue") {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { user_id, password } = req.body || false;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((val) => val.msg) });
    }
    const [user] = await UserModel.getUser(user_id);

    if (user?.id) {
      const verified = password === user.password;

      if (user.referral_name === null) {
        const adminData = await AdminModel.getUserName(user.referral_id);
        user.referral_name = adminData[0]?.name;
      }

      user.role = "user";
      const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

      if (verified) {
        res.cookie("auth", token, {
          httpOnly: true,
          secure: true,
          // sameSite: "Lax",
          sameSite: "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(200).json({ user: user, message: "Login Successful" });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } else if (user_id) {
      const [user] = await TempUserModel.getUser(user_id);
      console.log(user);
      if (user?.id && user?.approved == 0) {
        const verified = password === user.password;

        if (user.referral_name === null) {
          const adminData = await AdminModel.getUserName(user.referral_id);
          user.referral_name = adminData[0]?.name || "";
        }

        user.role = "temp_user";
        const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);
        if (verified) {
          res.cookie("auth", token, {
            httpOnly: true,
            secure: true,
            // sameSite: "Lax",
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
          res.status(200).json({ user: user, message: "Login Successful" });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      } else {
        res.status(200).json({ message: "User not found" });
      }
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutUser = async (req, res) => {
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
  const user = jwt.verify(token, process.env.TOKEN_SECRET);

  try {
    if (user.role === "user") {
      const [data] = await UserModel.getUser(user.user_id);
      if (!data.id) {
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
      }
      res.status(200).json({ authenticated: true, user: data });
    } else if (user.role === "temp_user") {
      const [data] = await TempUserModel.getUser(user.user_id);
      if (!data.id) {
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
      }
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
    console.log(11);
    res.status(401).json({ authenticated: false });
  }
};

export const paidProof = async (req, res) => {
  const image = req.file?.filename;
  try {
    const id = req.body?.id;
    const txn_id = req.body?.txn_id;
    if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const submitted = await TempUserModel.paidProof({
      image,
      user_id: id,
      txn_id,
    });
    if (submitted) {
      const [result] = await TempUserModel.getUser(id);
      res.status(200).json({ result, message: "Proof submitted successfully" });
    } else {
      if (image) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          "screenshots",
          image,
        );
        if (existsSync(imagePath)) {
          rmSync(imagePath);
        }
      }
      res.status(200).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    if (image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "screenshots",
        image,
      );
      if (existsSync(imagePath)) {
        rmSync(imagePath);
      }
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTempUser = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await TempUserModel.deleteUser(id);
    if (result > 0) {
      res.status(200).json({
        message: "id deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "id not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (!data.user_type) {
      return res
        .status(400)
        .json({ message: "user_type must be either 'users' or 'temp'" });
    }

    data.role = req.role;
    const updated = await UserModel.updateUser(data);

    if (updated) {
      const [user] = await UserModel.getUser(data.user_id);
      if (req.role === "user") {
        user.role = "user";
        const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);
        res.cookie("auth", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          // sameSite: "Lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      } else if (req.role === "temp_user") {
        user.role = "temp_user";
        const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);
        res.cookie("auth", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          // sameSite: "Lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      }

      res
        .status(200)
        .json({ user: user, message: "User updated successfully" });
    } else {
      res.status(400).json({ message: "Atleast 1 field is required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    const data = await UserModel.getUser(user_id);
    if (data.length === 0) {
      res.status(200).json({ message: "User not found" });
    } else {
      const updatedData = data.map((val) => {
        if (val.screenshot)
          return {
            ...val,
            // screenshot: path.join("http://localhost:8010", "public", "screenshots", val.screenshot),
            screenshot: `https://rightshadow.in/server/public/screenshots/${val.screenshot}`,
          };
        else return val;
      });

      res.status(200).json({ data: updatedData[0] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTempUser = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    // if (user_id !== req.user_id && req.role !== "admin") {
    //   return res.status(403).json({ message: "Action cannot be done!" });
    // }

    const data = await TempUserModel.getUser(user_id);
    if (data.length === 0) {
      res.status(200).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: data[0] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getHomeDetails = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    const [levelAmount, receivedAmount] =
      await UserBalanceModel.totalPayment(user_id);

    const membersCount = await TreeModel.getMembersCount(user_id);

    const levelOne = membersCount?.filter((val) => val.level === 1)[0];
    const direct_id = levelOne?.count || 0;
    const totalCount = membersCount.reduce(
      (total, current) => total + current.count,
      0,
    );
    const nwpDetails = await UserModel?.getNwpDetails(user_id);
    const rewardDetails = await UserModel.getRewardDetails(user_id);

    const detail = nwpDetails[0];

    const approvedDate = dayjs(detail.approved_at).startOf("day");
    const currentDate = dayjs().startOf("day");

    let totalDays = currentDate.diff(approvedDate, "day") + 1;

    const totalAmount = detail.daily_amt * totalDays;

    res.status(200).json({
      level_amount: levelAmount,
      received_amount: receivedAmount,
      direct_id: direct_id,
      total_ids: totalCount,
      total_days: totalDays,
      total_amount: totalAmount,
      daily_amount: detail.daily_amt,
      reward_amount: rewardDetails.reward_amount,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserName = async (req, res) => {
  try {
    const { referral_id } = req.query || false;
    if (!referral_id) {
      return res.status(400).json({ message: "referral_id is required" });
    }

    const data = await UserModel.getUserName(referral_id);
    if (data.length === 0) {
      const adminData = await AdminModel.getUserName(referral_id);

      if (adminData.length === 0) {
        res.status(200).json({ message: "User not found" });
      } else {
        adminData[0].status = "Approved";
        res.status(200).json({ data: adminData[0] });
      }
    } else {
      res.status(200).json({ data: data[0] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPayouts = async (req, res) => {
  try {
    const { start, end } = req.query || false;
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start and end date is required" });
    }

    const data = await UserModel.allUserPayouts({ start, end });
    const sortedData = data.sort((a, b) =>
      a.user_id.localeCompare(b.user_id, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    res.status(200).json({ data: sortedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const data = await AdminModel.getPaymentDetails();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateUserToken = async (req, res) => {
  try {
    const { user_id } = req.body || false;
    if (!user_id) {
      return res.status(400).json({ message: errors.map((val) => val.msg) });
    }

    const [user] = await UserModel.getUser(user_id);

    if (user?.id) {
      user.role = "user";
      const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

      res.cookie("auth", token, {
        httpOnly: true,
        secure: true,
        // sameSite: "Lax",
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.status(200).json({ user: user, message: "Token updated Successful" });
    } else if (user_id) {
      const [user] = await TempUserModel.getUser(user_id);

      if (user?.id) {
        user.role = "temp_user";
        const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

        res.cookie("auth", token, {
          httpOnly: true,
          secure: true,
          // sameSite: "Lax",
          sameSite: "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res
          .status(200)
          .json({ user: user, message: "Token updated Successful" });
      } else {
        res.status(200).json({ message: "User not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const data = await getUserFullDetails(user_id);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdminData = async (req, res) => {
  try {
    const adminData = await fetchAdminDetails();

    return res
      .status(200)
      .json({ data: adminData, message: "Admin Data fetched Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// TT

export const TTRegisterUser = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: result.array().map((val) => val.msg),
      });
    }

    if (data.role === "user" && !data.referral_id) {
      res.status(400).json({ message: "referral_id is required" });
    }

    const user = await UserModel.getUserNameFromTT(data?.referral_id);

    let admin = [];
    if (user.length === 0 && data.role === "admin") {
      admin = await AdminModel.getUserName(data.referral_id);
    }

    if (user.length === 0 && admin.length === 0) {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else {
      const id = await TempUserModel.addTargetUser(data);
      res.status(201).json({ id: id, message: "Registered Successfully" });
    }
  } catch (error) {
  
    if (error.message === "referrer not found") {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else if (error.message === "Referrar is in Queue") {
      return res.status(200).json({ message: "Invalid referral Id..." });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
