import express from "express";
import {
  addPurchaseTTData,
  getPurchaseTTReports,
} from "../controllers/jp_purchase.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { addPurchaseData } from "../controllers/purchases.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseTTReports);
router.post("/", verifyAdmin, addPurchase, addPurchaseTTData);

// tt

export default router;
