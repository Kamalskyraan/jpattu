import express from "express";
import {
  addSupplier,
  addSupplierNP,
  addSupplierRT,
  addSupplierTT,
  deleteSupplier,
  deleteSupplierNP,
  deleteSupplierRT,
  deleteSupplierTT,
  getSuppliers,
  getSuppliersNP,
  getSuppliersRT,
  getSuppliersTT,
  updateSupplier,
  updateSupplierNP,
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

// NP
router.get("/np", verifyAdmin, getSuppliersNP);
router.post("/np", verifyAdmin, addSupplierNP);
router.put("/np", verifyAdmin, updateSupplierNP);
router.delete("/np/:id", verifyAdmin, deleteSupplierNP);

export default router;
