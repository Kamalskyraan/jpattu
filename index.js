import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuthRoutes from "./routers/UserAuth.js";
import ttUserAuthRoutes from "./routers/TTuser.js";
import adminAuthRoutes from "./routers/AdminAuth.js";
import adminRoutes from "./routers/Admin.js";
import userRoutes from "./routers/Users.js";
import userTTRoutes from "./routers/TTusers.js";
import userRTRoutes from "./routers/RTUsers.js";
import userKRRoutes from "./routers/KRUser.js";
import userNPRoutes from "./routers/NPUser.js";
import userFSRoutes from "./routers/FSUser.js";
import levelRoutes from "./routers/Levels.js";
import linkRoutes from "./routers/Links.js";
import productRoutes from "./routers/Products.js";
import treeRoutes from "./routers/Tree.js";
import treeTTRoutes from "./routers/TargetTree.js";
import treeRTRoutes from "./routers/RepeatTree.js";
import treeNPRoutes from "./routers/NPTree.js";
import treeFSRoutes from "./routers/FSTree.js";
import treeKRRoutes from "./routers/KRTree.js";
import cashbackRoutes from "./routers/Cashbacks.js";
import userBalanceRoutes from "./routers/UserBalance.js";
import userTTBalanceRoutes from "./routers/UserTTBalance.js";
import userRTBalanceRoutes from "./routers/UserRTBalance.js";
import userNPBalanceRoutes from "./routers/UserNPBalance.js";
import userFSBalanceRoutes from "./routers/UserFSBalance.js";
import userKRBalanceRoutes from "./routers/UserKRBalance.js";
import purchaseRoutes from "./routers/Purchase.js";
import suppliersRoutes from "./routers/Suppliers.js";
import jppurchaseRoutes from "./routers/JpPurchase.js";
import ttpurchaseRoutes from "./routers/TtPurchases.js";
import rtpurchaseRoutes from "./routers/RTPurchases.js";
import fspurchaseRoutes from "./routers/FSPurchase.js";
import krpurchaseRoutes from "./routers/KRPurchases.js";
import npPurchaseRoutes from "./routers/NPPurchases.js";
import jpsuppliersRoutes from "./routers/JpSuppliers.js";
import salesRoutes from "./routers/Sales.js";
import ttSalesRoutes from "./routers/TTsales.js";
import PackageRoutes from "./routers/Packages.js";
import NwpRoutes from "./routers/Nwp.js";
import rtSalesRoutes from "./routers/RTSales.js";
import npSalesRoutes from "./routers/NPSales.js";
import fsSalesRoutes from "./routers/FSSales.js";
import krSalesRoutes from "./routers/KRSales.js";
import "./cron/monthEndSettlement.js";
import {
  getAdminData,
  getTTAdminData,
} from "./controllers/users.controller.js";

const app = express();
configDotenv();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:5174",
      "http://192.168.38.16:5173",
      "http://172.20.10.5:5174",
      "http://192.168.100.177:5173",
      "http://192.168.100.177:5174",
      "http://192.168.100.177:5175",
      "http://192.168.100.177:4173",
      "http://192.168.66.16:5173",
      "http://192.168.100.103:5173",
      "http://192.168.100.103:5174",
      "http://192.168.100.178:5174",
      "http://192.168.100.115:5174",
      "http://192.168.0.110:5174",
      "http://192.168.0.140:5173",
      "http://192.168.0.140:5174",
      "*",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());
app.use("/users/auth", userAuthRoutes);
app.use("tt-users/", ttUserAuthRoutes);
app.use("/admin/auth", adminAuthRoutes);

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/tt-users", userTTRoutes);
app.use("/rt-users", userRTRoutes);

app.use("/kr-users", userKRRoutes);

app.use("/np-users", userNPRoutes);
app.use("/fs-users", userFSRoutes);

app.use("/levels", levelRoutes);
app.use("/links", linkRoutes);
app.use("/products", productRoutes);
app.use("/treeview", treeRoutes);
app.use("/treeview-tt", treeTTRoutes);
app.use("/treeview-rt", treeRTRoutes);

app.use("/treeview-np", treeNPRoutes);
app.use("/treeview-fs", treeFSRoutes);
app.use("/treeview-kr", treeKRRoutes);

app.use("/cashbacks", cashbackRoutes);
app.use("/balance", userBalanceRoutes);
app.use("/balance-tt", userTTBalanceRoutes);
app.use("/balance-rt", userRTBalanceRoutes);
app.use("/balance-np", userNPBalanceRoutes);
app.use("/balance-fs", userFSBalanceRoutes);
app.use("/balance-kr", userKRBalanceRoutes);

app.use("/purchases", purchaseRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/tt/purchases", ttpurchaseRoutes);
app.use("/rt/purchases", rtpurchaseRoutes);
app.use("/np/purchases", npPurchaseRoutes);
app.use("/fs/purchases", fspurchaseRoutes);
app.use("/kr/purchases", krpurchaseRoutes);

app.use("/jp/purchases", jppurchaseRoutes);

app.use("/jp/suppliers", jpsuppliersRoutes);

app.use("/sales", salesRoutes);
app.use("/tt-sales", ttSalesRoutes);
app.use("/rt-sales", rtSalesRoutes);
app.use("/np-sales", npSalesRoutes);
app.use("/fs-sales", fsSalesRoutes);
app.use("/kr-sales", krSalesRoutes);
app.use("/packages", PackageRoutes);
app.use("/nwp", NwpRoutes);
app.get("/get-admin-data", getAdminData);
app.get("/get-tt-admin-data", getTTAdminData);

// Bank and Parent ID and CLUB Pay dummy

export const addClubPay = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    const { start, end } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getKRLevelIncome({
      user_id,
      start,
      end,
    });
    data.sort((a, b) => a.level - b.level);

    const maxLevel = 18;
    const base = 2;
    let sub_total = 0;
    const result = Array.from({ length: maxLevel }, (_, i) => {
      const level = i + 1;
      const members = base ** level;
      const record = data.find((item) => item.level === level);
      const entry = record ? record.count : 0;

      const oneValues = [2, 3, 4, 6, 7, 8, 11, 13, 14, 16, 17];
      const twoValues = [5, 9, 10, 12, 15];

      const income =
        level === 1
          ? 50
          : oneValues.includes(level)
            ? 1
            : twoValues.includes(level)
              ? 2
              : level === 18
                ? 37
                : 50;

      const total_income = income * entry;
      sub_total += total_income;

      return {
        level,
        members,
        entry,
        income,
        total_income,
      };
    });

    res.status(200).json({ data: result, sub_total: sub_total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const RecivedAMountForPayment = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }
    const data = await UserBalanceModel.getReceivedKRAmount(user_id);
    res.status(200).json({ data: data, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getClubPay = async (req, res) => {
  try {
    const { name = "", mobile = "" } = req.query || {};

    const data = await UserBalanceModel.getBankLogs({
      name: String(name).trim(),
      mobile: String(mobile).trim(),
    });

    return res.status(200).json({
      data,
      message: "Monthly bank logs fetched successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getDsForClubPay = async (req, res) => {
  try {
    const { name = "", mobile = "" } = req.query || {};

    const data = await UserBalanceModel.getDSBankLogs({
      name: String(name).trim(),
      mobile: String(mobile).trim(),
    });

    return res.status(200).json({
      data,
      message: "Monthly bank logs fetched successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const RecivedAMountForPaymentForKR = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }
    const data = await UserBalanceModel.getReceivedKRAmount(user_id);
    res.status(200).json({ data: data, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getKRForClubPay = async (req, res) => {
  try {
    const { name = "", mobile = "" } = req.query || {};

    const data = await UserBalanceModel.getDSBankLogs({
      name: String(name).trim(),
      mobile: String(mobile).trim(),
    });

    return res.status(200).json({
      data,
      message: "Monthly bank logs fetched successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const findDSAndKRDiffrence = async (req, res) => {
  try {
    const { name = "", mobile = "" } = req.query || {};

    const data = await UserBalanceModel.getDSBankLogs({
      name: String(name).trim(),
      mobile: String(mobile).trim(),
    });

    return res.status(200).json({
      data,
      message: "Monthly bank logs fetched successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

app.listen(process.env.PORT, () => {
  console.log(`Server running @ ${process.env.PORT}`);
});
