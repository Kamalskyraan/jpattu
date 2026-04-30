import express from "express";
import {
  getHomeDetails,
  getPaymentDetails,
  getTempUser,
  getUser,
  getUserName,
  paidProof,
  updateUser,
  deleteTempUser,
  getUserDetails,
  getAdminData,
} from "../controllers/users.controller.js";
import multer from "multer";
import path from "path";
import { updateValidation } from "../validator/authValidator.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "" +
        Math.floor(Math.random() * 99) +
        path.extname(file.originalname),
    );
  },
  destination: (req, file, cb) => {
    cb(null, "public/screenshots");
  },
});

const screenshots = multer({
  storage: storage,
  limits: 5 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.delete("/delete-user/:id", deleteTempUser);
router.post("/paidProof", screenshots.single("image"), paidProof);
router.put("/", verifyUser, updateValidation, updateUser);
router.get("/", getUserName);
router.get("/payment-details", getPaymentDetails);
router.get("/data/:user_id", verifyUser, getHomeDetails);
router.get("/temp/:user_id", getTempUser);
router.get("/:user_id", verifyUser, getUser);
router.post("/user-id", getUserDetails);


export default router;
