import express from "express";
import {
  addPurchaseFSData,
  addPurchaseTTData,
  deleteFSPurchaseData,
  deleteRTPurchaseData,
  deleteTTPurchaseData,
  editFSPurchaseData,
  editRTPurchaseData,
  editTTPurchaseData,
  getPurchaseFSReports,
  getPurchaseRTReports,
  getPurchaseTTReports,
  getSingleFSPurchaseReports,
  getSingleRTPurchaseReports,
  getSingleTTPurchaseReports,
} from "../controllers/jp_purchase.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { addPurchaseData } from "../controllers/purchases.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseFSReports);

router.post("/", verifyAdmin, addPurchase, addPurchaseFSData);

router.put("/", verifyAdmin, editFSPurchaseData);

router.delete("/:id", verifyAdmin, deleteFSPurchaseData);

router.get("/:id", verifyAdmin, getSingleFSPurchaseReports);

export default router;
