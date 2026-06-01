import express from "express";
import {
  addPurchaseTTData,
  deleteTTPurchaseData,
  editTTPurchaseData,
  getPurchaseTTReports,
  getSingleTTPurchaseReports,
} from "../controllers/jp_purchase.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { addPurchaseData } from "../controllers/purchases.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseTTReports);
router.post("/", verifyAdmin, addPurchase, addPurchaseTTData);
router.put("/", verifyAdmin, editTTPurchaseData);
router.delete("/:id", verifyAdmin, deleteTTPurchaseData);
router.get("/:id", verifyAdmin, getSingleTTPurchaseReports);

export default router;
