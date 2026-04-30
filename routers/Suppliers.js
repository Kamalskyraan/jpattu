import express from "express";
import {
  addSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/suppliers.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getSuppliers);
router.post("/", verifyAdmin, addSupplier);
router.put("/", verifyAdmin, updateSupplier);
router.delete("/:id", verifyAdmin, deleteSupplier);

export default router;
