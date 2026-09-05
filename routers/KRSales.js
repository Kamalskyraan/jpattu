import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
    getFSSalesReport,
  getKRSalesReport,
  getNPSalesReport,
  getRTSalesReport,
} from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getKRSalesReport);

export default router;
