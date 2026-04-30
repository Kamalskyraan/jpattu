import express from "express";
import {
  addCashback,
  getCashbackReport,
  getUserCashbackReport,
  updateCashback,
} from "../controllers/cashback.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getCashbackReport);
router.post("/", verifyUser, addCashback);
router.put("/", verifyAdmin, updateCashback);
router.get("/:user_id", verifyUser, getUserCashbackReport);

export default router;
