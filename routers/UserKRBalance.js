import express from "express";
import {
    getFSBalanceLogs,
    getKRBalanceLogs,
    getKRLevelIncome,
    getNPBalanceLogs,
  getNPLevelIncome,
  getRTBalanceLogs,
  getTTBalanceLogs,
  getTTLevelIncome,
  receivedAmount,
  receivedTTAmount,
  updateFSBalanceStatus,
  updateKRBalanceStatus,
  updateNPBalanceStatus,
  updateRTBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getKRBalanceLogs);
router.put("/", verifyAdmin, updateKRBalanceStatus);

router.get("/income/:user_id", verifyUser, getKRLevelIncome);


router.get("/:user_id", verifyUser, receivedTTAmount);
export default router;
