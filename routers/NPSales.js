import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
  getNPSalesReport,
  getRTSalesReport,
} from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getNPSalesReport);

export default router;
