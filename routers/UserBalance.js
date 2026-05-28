import express from "express";
import {
  getBalanceLogs,
  getLevelIncome,
  getPaymentHistory,
  getTTLevelIncome,
  getUserBalanceLog,
  receivedAmount,
  updateBalanceStatus,
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
export default router;
