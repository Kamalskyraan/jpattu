import express from "express";
import {
  getTTBalanceLogs,
  updateTTBalanceStatus,
} from "../controllers/userbalance.controller";
import { verifyAdmin, verifyUser } from "../middlewares/auth";

const router = express.Router();

router.get("/", verifyUser, getTTBalanceLogs);
router.put("/", verifyAdmin, updateTTBalanceStatus);
export default router;
