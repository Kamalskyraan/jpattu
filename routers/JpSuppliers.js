import express from "express";
import {
  addSupplier,
  addSupplierRT,
  addSupplierTT,
  deleteSupplier,
  deleteSupplierRT,
  deleteSupplierTT,
  getSuppliers,
  getSuppliersRT,
  getSuppliersTT,
  updateSupplier,
  updateSupplierRT,
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
router.delete("/tt/:id", verifyAdmin, deleteSupplierTT);

// RT
router.get("/rt", verifyAdmin, getSuppliersRT);
router.post("/rt", verifyAdmin, addSupplierRT);
router.put("/rt", verifyAdmin, updateSupplierRT);
router.delete("/rt/:id", verifyAdmin, deleteSupplierRT);
export default router;
