import express from "express";
import {
  addPurchaseData,
  deletePurchaseData,
  editPurchaseData,
  getPurchaseReports,
  getSinglePurchaseReports,
} from "../controllers/purchases.controller.js";
import { addPurchase } from "../validator/purchaseValidator.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getPurchaseReports);
router.post("/", verifyAdmin, addPurchase, addPurchaseData);
router.put("/", verifyAdmin, editPurchaseData);
router.delete("/:id", verifyAdmin, deletePurchaseData);
router.get("/:id", verifyAdmin, getSinglePurchaseReports);

export default router;
