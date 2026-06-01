import express from "express";
import {
  getTTBalanceLogs,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTTBalanceLogs);
router.put("/", verifyAdmin, updateTTBalanceStatus);
export default router;
