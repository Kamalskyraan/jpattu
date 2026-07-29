import express from "express";
import {
  addPurchaseTTData,
  deleteNPPurchaseData,
  deleteRTPurchaseData,
  deleteTTPurchaseData,
  editNPPurchaseData,
  editRTPurchaseData,
  editTTPurchaseData,
  getPurchaseNPReports,
  getPurchaseRTReports,
  getPurchaseTTReports,
  getSingleNPPurchaseReports,
  getSingleRTPurchaseReports,
  getSingleTTPurchaseReports,
} from "../controllers/jp_purchase.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { addPurchaseData } from "../controllers/purchases.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseNPReports);
router.post("/", verifyAdmin, addPurchase, addPurchaseTTData);
router.put("/", verifyAdmin, editNPPurchaseData);
router.delete("/:id", verifyAdmin, deleteNPPurchaseData);
router.get("/:id", verifyAdmin, getSingleNPPurchaseReports);

export default router;
