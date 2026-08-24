import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
    getFSSalesReport,
  getNPSalesReport,
  getRTSalesReport,
} from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getFSSalesReport);

export default router;
