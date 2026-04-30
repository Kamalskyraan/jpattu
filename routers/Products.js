import express from "express";
import path from "path";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../controllers/products.controller.js";

import multer from "multer";
import { verifyAdmin } from "../middlewares/auth.js";

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const storage = multer({
  storage: productStorage,
});

const router = express.Router();

router.get("/", getProducts);
router.post("/", verifyAdmin, storage.single("image"), addProduct);
router.put("/", verifyAdmin, storage.single("image"), editProduct);
router.patch("/", verifyAdmin, deleteProduct);

export default router;
