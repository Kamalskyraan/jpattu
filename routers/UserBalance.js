import express from "express";
import {
  getAccounts,
  getAccountsKR,
  getBalanceLogs,
  getClubPayDS,
  getClubPayKR,
  getDSBankBalanceLogs,
  getFSLevelIncome,
  getKRLevelIncome,
  getLevelIncome,
  getNPLevelIncome,
  getPaymentHistory,
  getRTLevelIncome,
  getTTBalanceLogs,
  getTTLevelIncome,
  getUserBalanceLog,
  markAllAccountsPaid,
  markAllAccountsPaidKR,
  markSelectedAccountsPaid,
  markSelectedKRAccountsPaid,
  receivedAmount,
  updateBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();
router.get("/get-bank-data", verifyUser, getDSBankBalanceLogs);

router.get("/club-pay-kr", verifyUser, getClubPayKR);
router.get("/club-pay-ds", verifyUser, getClubPayDS);
router.put("/accounts/mark-paid", verifyUser, markAllAccountsPaid);
router.put("/kr-accounts/mark-paid", verifyUser, markAllAccountsPaidKR);
router.get("/get-accounts", verifyUser, getAccounts);
router.get("/get-accounts-kr", verifyUser, getAccountsKR);
router.put(
  "/kr-accounts/mark-selected-paid",
  verifyUser,
  markSelectedKRAccountsPaid,
);
router.put(
  "/accounts/mark-selected-paid",
  verifyUser,
  markSelectedAccountsPaid,
);

router.get("/", verifyUser, getBalanceLogs);
router.put("/", verifyAdmin, updateBalanceStatus);
router.get("/payment-history/:user_id", verifyUser, getPaymentHistory);
router.get("/income/:user_id", verifyUser, getLevelIncome);
router.get("/:user_id", verifyUser, receivedAmount);
router.get("/:user_id", verifyUser, getUserBalanceLog);

// tt
router.get("/tt-income/:user_id", verifyUser, getTTLevelIncome);
router.get("/tt", verifyUser, getTTBalanceLogs);
router.put("/tt", verifyAdmin, updateTTBalanceStatus);

// rt

router.get("/rt-income/:user_id", verifyUser, getRTLevelIncome);
router.get("/np-income/:user_id", verifyUser, getNPLevelIncome);
router.get("/fs-income/:user_id", verifyUser, getFSLevelIncome);
router.get("/kr-income/:user_id", verifyUser, getKRLevelIncome);

export default router;
