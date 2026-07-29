import express from "express";
import {
    getNPBalanceLogs,
  getRTBalanceLogs,
  getTTBalanceLogs,
  getTTLevelIncome,
  receivedAmount,
  receivedTTAmount,
  updateNPBalanceStatus,
  updateRTBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getNPBalanceLogs);
router.put("/", verifyAdmin, updateNPBalanceStatus);
router.get("/income/:user_id", verifyUser, getTTLevelIncome);
router.get("/:user_id", verifyUser, receivedTTAmount);
export default router;
