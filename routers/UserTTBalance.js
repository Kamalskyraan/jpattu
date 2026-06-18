import express from "express";
import {
  getTTBalanceLogs,
  getTTLevelIncome,
  receivedAmount,
  receivedTTAmount,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTTBalanceLogs);
router.put("/", verifyAdmin, updateTTBalanceStatus);
router.get("/income/:user_id", verifyUser, getTTLevelIncome);
router.get("/:user_id", verifyUser, receivedTTAmount);
export default router;
