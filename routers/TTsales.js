import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import { getTTSalesReport } from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getTTSalesReport);
export default router;
