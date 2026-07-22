import express from "express";
import {
  getRTBalanceLogs,
  getTTBalanceLogs,
  getTTLevelIncome,
  receivedAmount,
  receivedTTAmount,
  updateRTBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getRTBalanceLogs);
router.put("/", verifyAdmin, updateRTBalanceStatus);
router.get("/income/:user_id", verifyUser, getTTLevelIncome);
router.get("/:user_id", verifyUser, receivedTTAmount);
export default router;
