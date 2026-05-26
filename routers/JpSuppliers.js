import express from "express";
import {
  addSupplier,
  addSupplierTT,
  deleteSupplier,
  deleteSupplierTT,
  getSuppliers,
  getSuppliersTT,
  updateSupplier,
  updateSupplierTT,
} from "../controllers/jp_suppliers.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getSuppliers);
router.post("/", verifyAdmin, addSupplier);
router.put("/", verifyAdmin, updateSupplier);
router.delete("/:id", verifyAdmin, deleteSupplier);

// TT
router.post("/tt", verifyAdmin, addSupplierTT);
router.get("/tt", verifyAdmin, getSuppliersTT);
router.put("/tt", verifyAdmin, updateSupplierTT);
router.delete("/:id", verifyAdmin, deleteSupplierTT);
export default router;
