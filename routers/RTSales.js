import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import { getRTSalesReport } from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getRTSalesReport);

export default router;
