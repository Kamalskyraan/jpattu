import express from "express";
import {
  getJarikaiOverall,
  getJPSalesReport,
  getOuterSorceReport,
  getSalesReport,
  getShadowReport,
  getTTSalesReport,
} from "../controllers/sales.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getSalesReport);
router.get("/jarigai", verifyAdmin, getJPSalesReport);
router.get("/jarigai-overall", verifyAdmin, getJarikaiOverall);
router.get("/shadow-overall", verifyAdmin, getShadowReport);

router.get("/outer-src-all-qty", verifyAdmin, getOuterSorceReport);

//TT

router.get("/tt", verifyAdmin, getTTSalesReport);

export default router;
