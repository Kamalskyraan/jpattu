import express from "express";
import {
  addPurchaseFSData,
  addPurchaseTTData,
  deleteFSPurchaseData,
  deleteKRPurchaseData,
  deleteRTPurchaseData,
  deleteTTPurchaseData,
  editFSPurchaseData,
  editKRPurchaseData,
  editRTPurchaseData,
  editTTPurchaseData,
  getPurchaseFSReports,
  getPurchaseKRReports,
  getPurchaseRTReports,
  getPurchaseTTReports,
  getSingleFSPurchaseReports,
  getSingleKRPurchaseReports,
  getSingleRTPurchaseReports,
  getSingleTTPurchaseReports,
} from "../controllers/jp_purchase.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { addPurchaseData } from "../controllers/purchases.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseKRReports);

router.post("/", verifyAdmin, addPurchase, addPurchaseFSData);

router.put("/", verifyAdmin, editKRPurchaseData);

router.delete("/:id", verifyAdmin, deleteKRPurchaseData);

router.get("/:id", verifyAdmin, getSingleKRPurchaseReports);

export default router;
