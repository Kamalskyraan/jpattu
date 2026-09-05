import express from "express";
import {
  addPurchaseData,
  addPurchaseFSData,
  addPurchaseKRData,
  addPurchaseNPData,
  addPurchaseRTData,
  addPurchaseTTData,
  deletePurchaseData,
  editPurchaseData,
  getPurchaseReports,
  getPurchaseTTReports,
  getSinglePurchaseReports,
} from "../controllers/jp_purchase.controller.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseReports);
router.post("/", verifyAdmin, addPurchase, addPurchaseData);
router.put("/", verifyAdmin, editPurchaseData);
router.delete("/:id", verifyAdmin, deletePurchaseData);
router.get("/:id", verifyAdmin, getSinglePurchaseReports);

// tt

router.post("/tt", verifyAdmin, addPurchase, addPurchaseTTData);
router.post("/rt", verifyAdmin, addPurchase, addPurchaseRTData);
router.post("/np", verifyAdmin, addPurchase, addPurchaseNPData);
router.post("/fs", verifyAdmin, addPurchase, addPurchaseFSData);
router.post("/kr", verifyAdmin, addPurchase, addPurchaseKRData);

export default router;
