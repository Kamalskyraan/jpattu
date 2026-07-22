import express from "express";
import {
  getBalanceLogs,
  getLevelIncome,
  getPaymentHistory,
  getRTLevelIncome,
  getTTBalanceLogs,
  getTTLevelIncome,
  getUserBalanceLog,
  receivedAmount,
  updateBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

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
export default router;
