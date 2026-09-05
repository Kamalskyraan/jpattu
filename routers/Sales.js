import express from "express";
import {
  getFSJarikaiOverall,
  getJarikaiOverall,
  getJPSalesReport,
  getJPSalesTTReport,
  getKRJarikaiOverall,
  getNPJarikaiOverall,
  getOuterFSSorceReport,
  getOuterKRSorceReport,
  getOuterNPSorceReport,
  getOuterRTSorceReport,
  getOuterSorceReport,
  getOuterTTSorceReport,
  getRTJarikaiOverall,
  getSalesReport,
  getShadowReport,
  getShadowReportFS,
  getShadowReportKR,
  getShadowReportNP,
  getShadowReportRT,
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

// RT

router.get("/jarigai-overall/rt", verifyAdmin, getRTJarikaiOverall);
router.get("/shadow-overall/rt", verifyAdmin, getShadowReportRT);
router.get("/outer-src-all-qty/rt", verifyAdmin, getOuterRTSorceReport);

// NP

router.get("/jarigai-overall/np", verifyAdmin, getNPJarikaiOverall);
router.get("/shadow-overall/np", verifyAdmin, getShadowReportNP);

router.get("/outer-src-all-qty/np", verifyAdmin, getOuterNPSorceReport);



// fs
router.get("/jarigai-overall/fs", verifyAdmin, getFSJarikaiOverall);
router.get("/shadow-overall/fs", verifyAdmin, getShadowReportFS);

router.get("/outer-src-all-qty/fs", verifyAdmin, getOuterFSSorceReport);


// kr


router.get("/jarigai-overall/kr", verifyAdmin, getKRJarikaiOverall);
router.get("/shadow-overall/kr", verifyAdmin, getShadowReportKR);
router.get("/outer-src-all-qty/kr", verifyAdmin, getOuterKRSorceReport);


export default router;
