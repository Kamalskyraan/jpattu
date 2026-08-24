import express from "express";
import {
    getFSBalanceLogs,
    getNPBalanceLogs,
  getNPLevelIncome,
  getRTBalanceLogs,
  getTTBalanceLogs,
  getTTLevelIncome,
  receivedAmount,
  receivedTTAmount,
  updateFSBalanceStatus,
  updateNPBalanceStatus,
  updateRTBalanceStatus,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getFSBalanceLogs);
router.put("/", verifyAdmin, updateFSBalanceStatus);



router.get("/income/:user_id", verifyUser, getNPLevelIncome);
router.get("/:user_id", verifyUser, receivedTTAmount);
export default router;
