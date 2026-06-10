import express from "express";
import {
  getJarikaiOverall,
  getJPSalesReport,
  getJPSalesTTReport,
  getOuterSorceReport,
  getOuterTTSorceReport,
  getSalesReport,
  getShadowReport,
  getTTJarikaiOverall,
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

router.get("/jarigai/tt", verifyAdmin, getJPSalesTTReport);

router.get("/shadow-overall/tt", verifyAdmin, getShadowReport);
router.get("/outer-src-all-qty/tt", verifyAdmin, getOuterTTSorceReport);

router.get("/jarigai-overall/tt", verifyAdmin, getTTJarikaiOverall);
export default router;
