import express from "express";
import {
  getTTBalanceLogs,
  getTTLevelIncome,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTTBalanceLogs);
router.put("/", verifyAdmin, updateTTBalanceStatus);
router.get("/income/:user_id", verifyUser, getTTLevelIncome);
export default router;
