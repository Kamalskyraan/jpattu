import express from "express";
import {
  addSupplier,
  addSupplierFS,
  addSupplierKR,
  addSupplierNP,
  addSupplierRT,
  addSupplierTT,
  deleteSupplier,
  deleteSupplierFS,
  deleteSupplierKR,
  deleteSupplierNP,
  deleteSupplierRT,
  deleteSupplierTT,
  getSuppliers,
  getSuppliersFS,
  getSuppliersKR,
  getSuppliersNP,
  getSuppliersRT,
  getSuppliersTT,
  updateSupplier,
  updateSupplierFS,
  updateSupplierKR,
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

// FS
router.get("/fs", verifyAdmin, getSuppliersFS);
router.post("/fs", verifyAdmin, addSupplierFS);
router.put("/fs", verifyAdmin, updateSupplierFS);
router.delete("/fs/:id", verifyAdmin, deleteSupplierFS);

// KR

router.get("/kr", verifyAdmin, getSuppliersKR);
router.post("/kr", verifyAdmin, addSupplierKR);
router.put("/kr", verifyAdmin, updateSupplierKR);
router.delete("/kr/:id", verifyAdmin, deleteSupplierKR);


export default router;
